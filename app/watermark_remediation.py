from __future__ import annotations

import argparse
import asyncio
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient

from catalog_quality import CLEAN_IMAGE_VERSIONS, build_catalog_quality_updates
from google_images_source import fetch_from_google_images, is_configured as google_is_configured
from image_paths import ensure_barcode_image_dir, resolve_local_image_paths
from pharmacy295_lookup import get_pharmacy295_lookup
from skroutzFetch import _download_image_with_retries


ALT_SOURCE_PRIORITY = ["vita4you", "pharm16", "tofarmakeiomou", "boxpharmacy", "kpdhellas"]
PROCESSING_VERSION = "watermark_remediation_alt_v1"
GOOGLE_PROCESSING_VERSION = "watermark_remediation_google_v1"
DEAD_END_REQUIREMENT = "watermark_no_replacement"
EVALUATOR = "automation:watermark_remediation"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Watermark remediation phases: 2 (alt-source replace), 3 (flag dead-ends), "
            "google (replace from Google Custom Search), deactivate (set cms_status=inactive)."
        )
    )
    parser.add_argument("--phase", choices=["2", "3", "google", "deactivate"], required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument(
        "--backup-dir",
        default="/app/image_replacement_backup_alt",
        help="Backup directory for replaced images (phase 2 / google).",
    )
    return parser.parse_args()


def mongo_db() -> Tuple[MongoClient, "object"]:
    user = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb")
    port = int(os.getenv("MONGO_PORT", "27017"))
    client = MongoClient(f"mongodb://{user}:{password}@{host}:{port}")
    return client, client[os.getenv("MONGO_DB", "imageDB")]


def feed_barcode_set() -> set:
    lookup = get_pharmacy295_lookup(force_reload=True)
    return {bc for bc, row in lookup.items() if row.image_urls}


def pick_alternative(record: dict) -> Optional[Tuple[str, List[str]]]:
    others = record.get("Other_Sites") or {}
    for source in ALT_SOURCE_PRIORITY:
        entry = others.get(source)
        if not isinstance(entry, dict):
            continue
        urls: List[str] = []
        primary = entry.get("Img_src")
        if isinstance(primary, str) and primary.strip():
            urls.append(primary.strip())
        extras = entry.get("Img_src_List") or []
        if isinstance(extras, list):
            for u in extras:
                if isinstance(u, str) and u.strip() and u.strip() not in urls:
                    urls.append(u.strip())
        if urls:
            return source, urls
    return None


async def download_replacement(barcode: str, urls: List[str], source: str) -> List[str]:
    images_dir = Path("/app/images")
    target_dir = ensure_barcode_image_dir(images_dir, barcode)
    saved: List[str] = []
    for index, url in enumerate(urls, start=1):
        target = target_dir / f"{index}.jpg"
        result = await _download_image_with_retries(url, str(target), site_name=source)
        if result:
            saved.append(result.replace("\\", "/"))
    return saved


def backup_existing(images_dir: Path, backup_root: Path, barcode: str) -> int:
    paths = resolve_local_image_paths(images_dir, barcode)
    if not paths:
        return 0
    for path in paths:
        relative = path.relative_to(images_dir).parts
        backup_path = backup_root.joinpath(*relative)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup_path)
    return len(paths)


def clear_existing(images_dir: Path, barcode: str) -> None:
    target_dir = ensure_barcode_image_dir(images_dir, barcode)
    for path in target_dir.glob("*.jpg"):
        path.unlink(missing_ok=True)


async def run_phase2(db, args: argparse.Namespace) -> Dict[str, object]:
    feed = feed_barcode_set()
    cursor = db.products.find(
        {
            "watermark_cleanup_applied": True,
            "Barcode": {"$nin": list(feed)},
        }
    )

    images_dir = Path("/app/images")
    backup_root = Path(args.backup_dir) / datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    examined = 0
    skipped_no_alt = 0
    by_source: Dict[str, int] = {s: 0 for s in ALT_SOURCE_PRIORITY}
    replaced = 0
    download_failed = 0

    for record in cursor:
        if args.limit and examined >= args.limit:
            break
        examined += 1

        alt = pick_alternative(record)
        if not alt:
            skipped_no_alt += 1
            continue

        source, urls = alt
        by_source[source] = by_source.get(source, 0) + 1
        barcode = str(record.get("Barcode", "")).strip()

        if args.dry_run:
            if examined <= 20 or examined % 500 == 0:
                print(
                    {
                        "barcode": barcode,
                        "source": source,
                        "current_images": [str(p) for p in resolve_local_image_paths(images_dir, barcode)],
                        "replacement_urls": urls,
                        "cms_status_now": record.get("cms_status"),
                    },
                    flush=True,
                )
            continue

        backup_existing(images_dir, backup_root, barcode)
        clear_existing(images_dir, barcode)
        downloaded = await download_replacement(barcode, urls, source)
        if not downloaded:
            download_failed += 1
            continue

        set_updates = {
            "Img_src": urls[0],
            "Img_src_List": urls,
            "image_source_domain": source,
            "image_processing_version": PROCESSING_VERSION,
            "watermark_cleanup_applied": False,
            "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
            "image_remediated_from": source,
        }
        candidate = dict(record)
        candidate.update(set_updates)
        set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR + ":alt"))
        db.products.update_one({"_id": record["_id"]}, {"$set": set_updates})
        replaced += 1

    return {
        "phase": 2,
        "dry_run": args.dry_run,
        "examined": examined,
        "with_alt_source": examined - skipped_no_alt,
        "no_alt_skipped": skipped_no_alt,
        "by_source": by_source,
        "replaced": replaced,
        "download_failed": download_failed,
        "backup_root": str(backup_root),
    }


def run_phase3(db, args: argparse.Namespace) -> Dict[str, object]:
    feed = feed_barcode_set()
    query = {
        "watermark_cleanup_applied": True,
        "Barcode": {"$nin": list(feed)},
        "$nor": [
            {"Other_Sites." + s + ".Img_src": {"$exists": True, "$ne": ""}}
            for s in ALT_SOURCE_PRIORITY
        ]
        + [
            {"Other_Sites." + s + ".Img_src_List": {"$exists": True, "$ne": []}}
            for s in ALT_SOURCE_PRIORITY
        ],
    }

    examined = 0
    flagged = 0
    samples: List[dict] = []

    for record in db.products.find(query):
        if args.limit and examined >= args.limit:
            break
        examined += 1
        barcode = str(record.get("Barcode", "")).strip()
        status = record.get("cms_status")

        existing_missing = record.get("catalog_missing_requirements") or []
        if isinstance(existing_missing, list):
            missing = list(existing_missing)
        else:
            missing = []
        if DEAD_END_REQUIREMENT not in missing:
            missing.append(DEAD_END_REQUIREMENT)

        set_updates = {
            "catalog_missing_requirements": missing,
            "catalog_review_required": True,
            "catalog_last_evaluated_at": datetime.now(timezone.utc).isoformat(),
            "catalog_last_evaluated_by": EVALUATOR + ":dead_end",
            "watermark_dead_end_flagged_at": datetime.now(timezone.utc).isoformat(),
        }

        if args.dry_run:
            if len(samples) < 10:
                samples.append({"barcode": barcode, "cms_status": status, "missing_after": missing})
            flagged += 1
            continue

        db.products.update_one({"_id": record["_id"]}, {"$set": set_updates})
        flagged += 1

    status_counts: Dict[str, int] = {}
    if args.dry_run:
        for d in db.products.find(query, {"cms_status": 1}):
            s = d.get("cms_status", "unknown")
            status_counts[s] = status_counts.get(s, 0) + 1

    return {
        "phase": 3,
        "dry_run": args.dry_run,
        "examined": examined,
        "flagged": flagged,
        "status_counts": status_counts,
        "samples": samples,
    }


def _has_alt_source(record: dict) -> bool:
    others = record.get("Other_Sites") or {}
    for source in ALT_SOURCE_PRIORITY:
        entry = others.get(source)
        if not isinstance(entry, dict):
            continue
        if isinstance(entry.get("Img_src"), str) and entry.get("Img_src", "").strip():
            return True
        extras = entry.get("Img_src_List") or []
        if isinstance(extras, list) and any(isinstance(u, str) and u.strip() for u in extras):
            return True
    return False


def _build_search_terms(record: dict) -> List[str]:
    terms: List[str] = []
    for key in ("cms_title", "Title", "Brand", "Category_1"):
        value = record.get(key)
        if isinstance(value, list):
            value = next((v for v in value if isinstance(v, str) and v.strip()), "")
        text = str(value or "").strip()
        if text and text not in terms:
            terms.append(text)
    return terms


async def run_phase_google(db, args: argparse.Namespace) -> Dict[str, object]:
    if not google_is_configured():
        return {
            "phase": "google",
            "error": "GOOGLE_API_KEY / GOOGLE_CSE_ID not configured",
        }

    feed = feed_barcode_set()
    cursor = db.products.find(
        {
            "watermark_cleanup_applied": True,
            "Barcode": {"$nin": list(feed)},
            "image_processing_version": {"$nin": list(CLEAN_IMAGE_VERSIONS)},
            "image_watermark_detected": {"$ne": False},
        }
    )

    images_dir = Path("/app/images")
    backup_root = Path(args.backup_dir) / ("google_" + datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S"))

    examined = 0
    skipped_has_alt = 0
    queried = 0
    no_google_results = 0
    download_failed = 0
    replaced = 0

    for record in cursor:
        if args.limit and examined >= args.limit:
            break
        examined += 1

        if _has_alt_source(record):
            skipped_has_alt += 1
            continue

        barcode = str(record.get("Barcode", "")).strip()
        if not barcode:
            continue

        search_terms = _build_search_terms(record)

        if args.dry_run:
            if examined <= 20 or examined % 500 == 0:
                print(
                    {
                        "barcode": barcode,
                        "search_terms": search_terms,
                        "cms_status_now": record.get("cms_status"),
                    },
                    flush=True,
                )
            queried += 1
            continue

        result = await fetch_from_google_images(
            barcode,
            download_images=True,
            replace_existing_images=False,
            search_terms=search_terms,
        )
        queried += 1

        urls = result.get("Img_src_List") if isinstance(result, dict) else None
        if not urls:
            no_google_results += 1
            continue

        backup_existing(images_dir, backup_root, barcode)
        clear_existing(images_dir, barcode)
        downloaded = await download_replacement(barcode, urls, "google_images")
        if not downloaded:
            download_failed += 1
            continue

        set_updates = {
            "Img_src": urls[0],
            "Img_src_List": urls,
            "image_source_domain": "google_images",
            "image_processing_version": GOOGLE_PROCESSING_VERSION,
            "watermark_cleanup_applied": False,
            "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
            "image_remediated_from": "google_images",
        }
        candidate = dict(record)
        candidate.update(set_updates)
        set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR + ":google"))
        db.products.update_one({"_id": record["_id"]}, {"$set": set_updates})
        replaced += 1
        print({"barcode": barcode, "replaced_from": "google_images", "images": len(downloaded)}, flush=True)

    return {
        "phase": "google",
        "dry_run": args.dry_run,
        "examined": examined,
        "skipped_has_alt": skipped_has_alt,
        "queried_google": queried,
        "no_google_results": no_google_results,
        "download_failed": download_failed,
        "replaced": replaced,
        "backup_root": str(backup_root),
    }


def run_phase_deactivate(db, args: argparse.Namespace) -> Dict[str, object]:
    feed = feed_barcode_set()
    query = {
        "watermark_cleanup_applied": True,
        "Barcode": {"$nin": list(feed)},
        "image_processing_version": {"$nin": list(CLEAN_IMAGE_VERSIONS)},
        "image_watermark_detected": {"$ne": False},
        "$nor": [
            {"Other_Sites." + s + ".Img_src": {"$exists": True, "$ne": ""}}
            for s in ALT_SOURCE_PRIORITY
        ]
        + [
            {"Other_Sites." + s + ".Img_src_List": {"$exists": True, "$ne": []}}
            for s in ALT_SOURCE_PRIORITY
        ],
    }

    examined = 0
    already_inactive = 0
    deactivated = 0
    samples: List[dict] = []

    for record in db.products.find(query):
        if args.limit and examined >= args.limit:
            break
        examined += 1
        barcode = str(record.get("Barcode", "")).strip()
        current_status = str(record.get("cms_status") or "").strip().lower()

        existing_missing = record.get("catalog_missing_requirements") or []
        missing = list(existing_missing) if isinstance(existing_missing, list) else []
        if DEAD_END_REQUIREMENT not in missing:
            missing.append(DEAD_END_REQUIREMENT)

        candidate = dict(record)
        candidate["catalog_missing_requirements"] = missing

        set_updates = build_catalog_quality_updates(candidate, evaluator=EVALUATOR + ":deactivate")
        set_updates["catalog_missing_requirements"] = missing
        set_updates["cms_status"] = "inactive"
        set_updates["watermark_dead_end_flagged_at"] = datetime.now(timezone.utc).isoformat()

        if current_status == "inactive":
            already_inactive += 1

        if args.dry_run:
            if len(samples) < 20:
                samples.append(
                    {
                        "barcode": barcode,
                        "cms_status_before": current_status or "active",
                        "missing_after": missing,
                    }
                )
            deactivated += 1
            continue

        db.products.update_one({"_id": record["_id"]}, {"$set": set_updates})
        deactivated += 1

    return {
        "phase": "deactivate",
        "dry_run": args.dry_run,
        "examined": examined,
        "deactivated": deactivated,
        "already_inactive": already_inactive,
        "samples": samples,
    }


def main() -> None:
    args = parse_args()
    load_dotenv("/app/.env")

    client, db = mongo_db()
    try:
        if args.phase == "2":
            result = asyncio.run(run_phase2(db, args))
        elif args.phase == "3":
            result = run_phase3(db, args)
        elif args.phase == "google":
            result = asyncio.run(run_phase_google(db, args))
        else:
            result = run_phase_deactivate(db, args)
        print(result)
    finally:
        client.close()


if __name__ == "__main__":
    main()
