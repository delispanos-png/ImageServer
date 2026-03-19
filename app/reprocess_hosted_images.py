#!/usr/bin/env python3
import argparse
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse

from dotenv import load_dotenv
from PIL import Image
from pymongo import MongoClient

from skroutzFetch import _remove_farmakopoiosmou_watermark
from image_paths import resolve_local_image_paths
from runtime_settings import is_source_enabled_for_images, is_watermark_cleanup_enabled


PROCESSING_VERSION = "farmakopoiosmou_crop_v3"


def _normalize_source_name(value: str) -> str:
    value = str(value or "").strip().lower()
    if value in {"farmakopoiosmou", "ofarmakopoiosmou"}:
        return "farmakopoiosmou"
    return value


def infer_source_domain(record: dict) -> str:
    site = _normalize_source_name(record.get("last_source", "") or record.get("Site", ""))
    if site:
        return site

    img_src = str(record.get("Img_src", "")).strip()
    product_link = str(record.get("Product_Link", "")).strip()
    for candidate in (img_src, product_link):
        if not candidate:
            continue
        host = urlparse(candidate).netloc.lower()
        if "ofarmakopoiosmou" in host:
            return "farmakopoiosmou"
        if "skroutz" in host:
            return "skroutz"
        if "pharmacy295" in host:
            return "pharmacy295"
        if host:
            return host
    return ""


def process_image(image_path: Path, source: str) -> bool:
    if (
        source != "farmakopoiosmou"
        or not is_source_enabled_for_images("farmakopoiosmou")
        or not is_watermark_cleanup_enabled()
    ):
        return False

    with Image.open(image_path) as image:
        original = image.convert("RGB")
        processed = _remove_farmakopoiosmou_watermark(original)

        if processed.size == original.size and processed.tobytes() == original.tobytes():
            return False

        temp_path = image_path.with_suffix(".reprocess.tmp.jpg")
        processed.save(temp_path, format="JPEG", quality=92, optimize=True)
        os.replace(temp_path, image_path)
        return True


def build_query(barcode: str, source: str) -> dict:
    source = _normalize_source_name(source)
    query: dict = {"Barcode": {"$exists": True, "$ne": ""}}
    if barcode:
        query["Barcode"] = barcode
    if source == "farmakopoiosmou":
        query["$or"] = [
            {"last_source": "farmakopoiosmou"},
            {"last_source": "ofarmakopoiosmou"},
            {"Site": "farmakopoiosmou"},
            {"Site": "ofarmakopoiosmou"},
            {"Img_src": {"$regex": "ofarmakopoiosmou", "$options": "i"}},
            {"Product_Link": {"$regex": "ofarmakopoiosmou", "$options": "i"}},
        ]
    return query


def iter_records(db, barcode: str, source: str) -> Iterable[dict]:
    projection = {
        "_id": 0,
        "Barcode": 1,
        "Img_src": 1,
        "Product_Link": 1,
        "last_source": 1,
        "Site": 1,
        "image_processing_version": 1,
        "watermark_cleanup_applied": 1,
    }
    return db.products.find(build_query(barcode, source), projection)


def load_records_from_file(path: str) -> list[dict]:
    input_path = Path(path)
    if not input_path.exists():
        raise FileNotFoundError(f"input file not found: {input_path}")
    records = json.loads(input_path.read_text())
    if not isinstance(records, list):
        raise ValueError("input file must contain a JSON array")
    return records


def main() -> None:
    parser = argparse.ArgumentParser(description="Reprocess hosted images in-place with source-specific cleanup.")
    parser.add_argument("--source", default="farmakopoiosmou", help="Source family to process.")
    parser.add_argument("--barcode", default="", help="Only process one barcode.")
    parser.add_argument("--limit", type=int, default=0, help="Max records to examine. 0 means no limit.")
    parser.add_argument("--dry-run", action="store_true", help="Inspect and report without changing files.")
    parser.add_argument(
        "--backup-dir",
        default="/app/image_reprocess_backup",
        help="Backup directory used before overwriting images.",
    )
    parser.add_argument(
        "--skip-current-version",
        action="store_true",
        help="Skip records already marked with the current processing version.",
    )
    parser.add_argument(
        "--input-file",
        default="",
        help="Optional JSON file with prebuilt records queue. When set, Mongo query is skipped.",
    )
    args = parser.parse_args()

    load_dotenv()

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    images_dir = Path("/app/images")
    backup_dir = Path(args.backup_dir)

    mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}"
    client = MongoClient(mongo_uri)
    db = client[mongo_db]

    examined = 0
    missing_file = 0
    skipped_source = 0
    skipped_version = 0
    eligible = 0
    processed = 0
    unchanged = 0

    try:
        normalized_source = _normalize_source_name(args.source)
        if normalized_source == "farmakopoiosmou" and (
            not is_source_enabled_for_images("farmakopoiosmou") or not is_watermark_cleanup_enabled()
        ):
            print(
                {
                    "source": normalized_source,
                    "processing_version": PROCESSING_VERSION,
                    "dry_run": args.dry_run,
                    "skipped": True,
                    "reason": "farmakopoiosmou watermark cleanup is disabled in runtime settings.",
                }
            )
            return
        if args.input_file:
            records_iter = load_records_from_file(args.input_file)
        else:
            records_iter = iter_records(db, args.barcode.strip(), normalized_source)

        for record in records_iter:
            if args.limit and examined >= args.limit:
                break
            examined += 1

            barcode = str(record.get("Barcode", "")).strip()
            if not barcode:
                continue

            source = infer_source_domain(record)
            if source != normalized_source:
                skipped_source += 1
                continue

            if args.skip_current_version and record.get("image_processing_version") == PROCESSING_VERSION:
                skipped_version += 1
                continue

            image_paths = resolve_local_image_paths(images_dir, barcode)
            if not image_paths:
                missing_file += 1
                continue

            eligible += 1
            if args.dry_run:
                print(f"dry-run eligible barcode={barcode} files={[str(path) for path in image_paths]}")
                continue

            changed_any = False
            for image_path in image_paths:
                relative_parts = image_path.relative_to(images_dir).parts
                backup_path = backup_dir.joinpath(*relative_parts)
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(image_path, backup_path)
                if process_image(image_path, source):
                    changed_any = True

            if changed_any:
                processed += 1
            else:
                unchanged += 1

            db.products.update_one(
                {"Barcode": barcode},
                {
                    "$set": {
                        "image_source_domain": normalized_source,
                        "image_processing_version": PROCESSING_VERSION,
                        "watermark_cleanup_applied": bool(changed_any),
                        "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
                    }
                },
            )

            print(
                f"reprocessed barcode={barcode} source={normalized_source} "
                f"changed={changed_any} files={[str(path) for path in image_paths]}"
            )
    finally:
        client.close()

    print(
        {
            "source": normalized_source,
            "processing_version": PROCESSING_VERSION,
            "dry_run": args.dry_run,
            "examined": examined,
            "eligible": eligible,
            "processed": processed,
            "unchanged": unchanged,
            "missing_file": missing_file,
            "skipped_source": skipped_source,
            "skipped_version": skipped_version,
        }
    )


if __name__ == "__main__":
    main()
