from __future__ import annotations

import argparse
import asyncio
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

from image_paths import ensure_barcode_image_dir, resolve_local_image_paths
from pharmacy295_lookup import get_pharmacy295_lookup, lookup_pharmacy295_product
from skroutzFetch import _download_image_collection, _download_image_with_retries
from source_locks import PHARMACY295_LOCK_SOURCE
from catalog_quality import build_catalog_quality_updates


PROCESSING_VERSION = "pharmacy295_excel_replace_v1"
IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Replace watermark-cleaned hosted images with pharmacy295 Excel photo feed."
    )
    parser.add_argument("--barcode", default="", help="Process a single barcode.")
    parser.add_argument("--limit", type=int, default=0, help="Max products to process.")
    parser.add_argument("--dry-run", action="store_true", help="Inspect candidates without changing files.")
    parser.add_argument(
        "--backup-dir",
        default="/app/image_replacement_backup",
        help="Base backup directory before replacing hosted images.",
    )
    parser.add_argument(
        "--skip-barcodes-file",
        default=os.getenv("SKIP_REPLACE_BARCODES_FILE", "/app/skip_replace_from_varwww_barcodes.txt"),
        help="Optional newline-delimited barcode file to exclude from replacement.",
    )
    parser.add_argument(
        "--watermarked-only",
        action="store_true",
        help="Limit replacement to products with watermark_cleanup_applied=true.",
    )
    return parser.parse_args()


def build_query(feed_barcodes: list[str], barcode: str, watermarked_only: bool = False) -> dict:
    if barcode:
        query: dict = {"Barcode": barcode}
    else:
        query = {"Barcode": {"$in": feed_barcodes}}
    if watermarked_only:
        query["watermark_cleanup_applied"] = True
    return query


def backup_existing_images(images_dir: Path, backup_root: Path, barcode: str) -> None:
    image_paths = resolve_local_image_paths(images_dir, barcode)
    for image_path in image_paths:
        relative_parts = image_path.relative_to(images_dir).parts
        backup_path = backup_root.joinpath(*relative_parts)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(image_path, backup_path)


def clear_existing_images(images_dir: Path, barcode: str) -> None:
    target_dir = ensure_barcode_image_dir(images_dir, barcode)
    for image_path in target_dir.glob("*.jpg"):
        image_path.unlink(missing_ok=True)


def load_skip_barcodes(path: str) -> set[str]:
    skip_path = Path(path)
    if not path or not skip_path.exists() or not skip_path.is_file():
        return set()
    return {
        line.strip()
        for line in skip_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    }


def next_image_index(existing_paths: list[Path]) -> int:
    max_index = 0
    for path in existing_paths:
        stem = path.stem.strip()
        if stem.isdigit():
            max_index = max(max_index, int(stem))
    if max_index > 0:
        return max_index + 1
    return len(existing_paths) + 1


async def append_additional_images(images_dir: Path, barcode: str, additional_urls: list[str]) -> list[str]:
    image_dir = ensure_barcode_image_dir(images_dir, barcode)
    existing_paths = resolve_local_image_paths(images_dir, barcode)
    next_index = next_image_index(existing_paths)
    downloaded_paths: list[str] = []

    for image_url in additional_urls:
        target_path = image_dir / f"{next_index}.jpg"
        saved_path = await _download_image_with_retries(image_url, str(target_path), site_name="pharmacy295")
        if saved_path:
            downloaded_paths.append(saved_path.replace("\\", "/"))
            next_index += 1

    return downloaded_paths


async def run_replacement(args: argparse.Namespace) -> dict:
    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    images_dir = Path("/app/images")
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_root = Path(args.backup_dir) / timestamp

    mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}"
    client = MongoClient(mongo_uri)
    db = client[mongo_db]
    skip_barcodes = load_skip_barcodes(args.skip_barcodes_file)

    lookup = get_pharmacy295_lookup(force_reload=True)
    rows_with_images = {
        barcode: row
        for barcode, row in lookup.items()
        if row.image_urls
    }
    feed_barcodes = list(rows_with_images.keys())
    if args.barcode.strip():
        feed_barcodes = [args.barcode.strip()]
    elif args.limit:
        feed_barcodes = feed_barcodes[: args.limit]

    examined = 0
    matched_feed = 0
    replaced = 0
    appended = 0
    missing_feed = 0
    missing_local = 0
    unchanged = 0
    skipped_barcode = 0
    skipped_without_extra = 0
    imported_missing_local = 0
    appended_non_skipped = 0

    try:
        cursor = db.products.find(
            build_query(feed_barcodes, args.barcode.strip(), args.watermarked_only)
        )
        records = list(cursor)
        records.sort(key=lambda row: str(row.get("Barcode", "")).strip())
        print({"records_loaded": len(records)}, flush=True)

        for record in records:
            examined += 1

            barcode = str(record.get("Barcode", "")).strip()
            if not barcode:
                continue

            lookup_row = rows_with_images.get(barcode) or lookup_pharmacy295_product(barcode)
            if lookup_row is None or not lookup_row.image_urls:
                missing_feed += 1
                continue

            local_images = resolve_local_image_paths(images_dir, barcode)

            matched_feed += 1
            image_urls = list(lookup_row.image_urls)
            category_1, category_2, category_3 = lookup_row.category_levels
            product_link = f"https://www.pharmacy295.gr/search-results?query={barcode}"
            explicit_img_src = str(record.get("Img_src", "") or "").strip()
            has_external_main_image = bool(explicit_img_src and not explicit_img_src.startswith(IMAGE_PUBLIC_BASE_URL))
            has_local_images = bool(local_images)
            needs_full_import = bool(record.get("watermark_cleanup_applied")) or has_external_main_image or not has_local_images
            additional_urls = image_urls[len(local_images) :] if has_local_images else image_urls

            if barcode in skip_barcodes:
                skipped_barcode += 1
                if not additional_urls:
                    skipped_without_extra += 1
                    continue

                if args.dry_run:
                    print(
                        {
                            "barcode": barcode,
                            "mode": "append_only",
                            "current_images": [str(path) for path in local_images],
                            "additional_urls": additional_urls,
                        },
                        flush=True,
                    )
                    continue

                downloaded_paths = await append_additional_images(images_dir, barcode, additional_urls)
                if not downloaded_paths:
                    unchanged += 1
                    continue

                set_updates = {
                    "photo_source_locked": True,
                    "photo_source_lock": PHARMACY295_LOCK_SOURCE,
                    "photo_source_locked_at": datetime.now(timezone.utc).isoformat(),
                    "pharmacy295_extra_images_added_at": datetime.now(timezone.utc).isoformat(),
                    "pharmacy295_extra_images_count": len(downloaded_paths),
                    "Other_Sites.pharmacy295_excel": {
                        "Title": lookup_row.product_name,
                        "Img_src": image_urls[0],
                        "Img_src_List": image_urls,
                        "Product_Link": product_link,
                        "Category_1": category_1,
                        "Category_2": category_2,
                        "Category_3": category_3,
                        "Category_name": lookup_row.category_name,
                        "Source_Sheets": list(lookup_row.source_sheets),
                    },
                }
                candidate = dict(record)
                candidate.update(set_updates)
                set_updates.update(
                    build_catalog_quality_updates(
                        candidate,
                        evaluator="automation:replace_watermarked_with_pharmacy295:append",
                    )
                )
                db.products.update_one({"Barcode": barcode}, {"$set": set_updates})
                appended += 1
                print(
                    {
                        "barcode": barcode,
                        "appended": True,
                        "downloaded_images": downloaded_paths,
                    },
                    flush=True,
                )
                continue

            if not needs_full_import and not additional_urls:
                unchanged += 1
                continue

            if not needs_full_import and additional_urls:
                if args.dry_run:
                    print(
                        {
                            "barcode": barcode,
                            "mode": "append_missing_extras",
                            "current_images": [str(path) for path in local_images],
                            "additional_urls": additional_urls,
                        },
                        flush=True,
                    )
                    continue

                downloaded_paths = await append_additional_images(images_dir, barcode, additional_urls)
                if not downloaded_paths:
                    unchanged += 1
                    continue

                set_updates = {
                    "photo_source_locked": True,
                    "photo_source_lock": PHARMACY295_LOCK_SOURCE,
                    "photo_source_locked_at": datetime.now(timezone.utc).isoformat(),
                    "pharmacy295_extra_images_added_at": datetime.now(timezone.utc).isoformat(),
                    "pharmacy295_extra_images_count": len(downloaded_paths),
                    "Other_Sites.pharmacy295_excel": {
                        "Title": lookup_row.product_name,
                        "Img_src": image_urls[0],
                        "Img_src_List": image_urls,
                        "Product_Link": product_link,
                        "Category_1": category_1,
                        "Category_2": category_2,
                        "Category_3": category_3,
                        "Category_name": lookup_row.category_name,
                        "Source_Sheets": list(lookup_row.source_sheets),
                    },
                }
                candidate = dict(record)
                candidate.update(set_updates)
                set_updates.update(
                    build_catalog_quality_updates(
                        candidate,
                        evaluator="automation:replace_watermarked_with_pharmacy295:append_missing_extras",
                    )
                )
                db.products.update_one({"Barcode": barcode}, {"$set": set_updates})
                appended += 1
                appended_non_skipped += 1
                print(
                    {
                        "barcode": barcode,
                        "appended": True,
                        "downloaded_images": downloaded_paths,
                    },
                    flush=True,
                )
                continue

            if args.dry_run:
                print(
                    {
                        "barcode": barcode,
                        "current_images": [str(path) for path in local_images],
                        "replacement_urls": image_urls,
                    },
                    flush=True,
                )
                continue

            if has_local_images:
                backup_existing_images(images_dir, backup_root, barcode)
                clear_existing_images(images_dir, barcode)
            else:
                missing_local += 1
            downloaded_paths = []
            try:
                downloaded_paths = await _download_image_collection(image_urls, barcode, site_name="pharmacy295")
            except Exception as exc:
                print({"barcode": barcode, "error": str(exc)}, flush=True)

            if not downloaded_paths:
                unchanged += 1
                continue

            set_updates = {
                "photo_source_locked": True,
                "photo_source_lock": PHARMACY295_LOCK_SOURCE,
                "photo_source_locked_at": datetime.now(timezone.utc).isoformat(),
                "Img_src": image_urls[0],
                "Img_src_List": image_urls,
                "Site": "pharmacy295",
                "last_source": "pharmacy295",
                "Product_Link": product_link,
                "Category_1": category_1 or record.get("Category_1", ""),
                "Category_2": category_2 or record.get("Category_2", ""),
                "Category_3": category_3 or record.get("Category_3", ""),
                "image_source_domain": "pharmacy295",
                "image_processing_version": PROCESSING_VERSION,
                "watermark_cleanup_applied": False,
                "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
                "Other_Sites.pharmacy295_excel": {
                    "Title": lookup_row.product_name,
                    "Img_src": image_urls[0],
                    "Img_src_List": image_urls,
                    "Product_Link": product_link,
                    "Category_1": category_1,
                    "Category_2": category_2,
                    "Category_3": category_3,
                    "Category_name": lookup_row.category_name,
                    "Source_Sheets": list(lookup_row.source_sheets),
                },
            }
            candidate = dict(record)
            candidate.update(set_updates)
            set_updates.update(
                build_catalog_quality_updates(
                    candidate,
                    evaluator="automation:replace_watermarked_with_pharmacy295:replace",
                )
            )
            db.products.update_one({"Barcode": barcode}, {"$set": set_updates})
            replaced += 1
            if not has_local_images:
                imported_missing_local += 1
            print(
                {
                    "barcode": barcode,
                    "replaced": True,
                    "downloaded_images": downloaded_paths,
                },
                flush=True,
            )
    finally:
        client.close()

    return {
        "processing_version": PROCESSING_VERSION,
        "dry_run": args.dry_run,
        "examined": examined,
        "matched_feed": matched_feed,
        "replaced": replaced,
        "appended": appended,
        "missing_feed": missing_feed,
        "missing_local": missing_local,
        "unchanged": unchanged,
        "skipped_barcode": skipped_barcode,
        "skipped_without_extra": skipped_without_extra,
        "imported_missing_local": imported_missing_local,
        "appended_non_skipped": appended_non_skipped,
        "skip_barcodes_loaded": len(skip_barcodes),
        "skip_barcodes_file": args.skip_barcodes_file,
        "backup_root": str(backup_root),
    }


def main() -> None:
    args = parse_args()
    load_dotenv()
    print(asyncio.run(run_replacement(args)))


if __name__ == "__main__":
    main()
