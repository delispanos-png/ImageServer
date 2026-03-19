#!/usr/bin/env python3
import argparse
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse

from dotenv import load_dotenv
from PIL import Image
from pymongo import MongoClient

PROJECT_ROOT = Path(__file__).resolve().parent
APP_DIR = PROJECT_ROOT / "app"
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))

from image_paths import resolve_local_image_paths  # noqa: E402
from skroutzFetch import _remove_farmakopoiosmou_watermark  # noqa: E402
from runtime_settings import is_source_enabled_for_images, is_watermark_cleanup_enabled  # noqa: E402


PROCESSING_VERSION = "farmakopoiosmou_crop_v3"


def infer_source_domain(record: dict) -> str:
    site = str(record.get("last_source", "") or record.get("Site", "")).strip().lower()
    if site:
        return site

    img_src = str(record.get("Img_src", "")).strip()
    if not img_src:
        return ""

    host = urlparse(img_src).netloc.lower()
    if "ofarmakopoiosmou" in host:
        return "farmakopoiosmou"
    if "skroutz" in host:
        return "skroutz"
    if "pharmacy295" in host:
        return "pharmacy295"
    return host


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
    query: dict = {"Barcode": {"$exists": True, "$ne": ""}}
    if barcode:
        query["Barcode"] = barcode
    if source == "farmakopoiosmou":
        query["$or"] = [
            {"last_source": "farmakopoiosmou"},
            {"Site": "farmakopoiosmou"},
            {"Img_src": {"$regex": "ofarmakopoiosmou", "$options": "i"}},
        ]
    return query


def iter_records(db, barcode: str, source: str) -> Iterable[dict]:
    projection = {
        "_id": 0,
        "Barcode": 1,
        "Img_src": 1,
        "last_source": 1,
        "Site": 1,
        "image_processing_version": 1,
        "watermark_cleanup_applied": 1,
    }
    return db.products.find(build_query(barcode, source), projection)


def main() -> None:
    parser = argparse.ArgumentParser(description="Reprocess hosted images in-place with source-specific cleanup.")
    parser.add_argument("--source", default="farmakopoiosmou", help="Source family to process.")
    parser.add_argument("--barcode", default="", help="Only process one barcode.")
    parser.add_argument("--limit", type=int, default=0, help="Max records to examine. 0 means no limit.")
    parser.add_argument("--dry-run", action="store_true", help="Inspect and report without changing files.")
    parser.add_argument(
        "--backup-dir",
        default=str(PROJECT_ROOT / "image_reprocess_backup"),
        help="Backup directory used before overwriting images.",
    )
    parser.add_argument(
        "--skip-current-version",
        action="store_true",
        help="Skip records already marked with the current processing version.",
    )
    args = parser.parse_args()

    load_dotenv(PROJECT_ROOT / ".env")

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    images_dir = Path(os.getenv("IMAGES_PATH", "/home/imageuser/CloudonXMLGenerator/Photos/CloudOn"))
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
        if args.source.strip().lower() == "farmakopoiosmou" and (
            not is_source_enabled_for_images("farmakopoiosmou") or not is_watermark_cleanup_enabled()
        ):
            print(
                {
                    "source": args.source,
                    "processing_version": PROCESSING_VERSION,
                    "dry_run": args.dry_run,
                    "skipped": True,
                    "reason": "farmakopoiosmou watermark cleanup is disabled in runtime settings.",
                }
            )
            return
        for record in iter_records(db, args.barcode.strip(), args.source.strip().lower()):
            if args.limit and examined >= args.limit:
                break
            examined += 1

            barcode = str(record.get("Barcode", "")).strip()
            if not barcode:
                continue

            source = infer_source_domain(record)
            if source != args.source:
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
                relative_path = image_path.relative_to(images_dir)
                backup_path = backup_dir / relative_path
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(image_path, backup_path)
                changed_any = process_image(image_path, source) or changed_any

            if changed_any:
                processed += 1
            else:
                unchanged += 1

            db.products.update_one(
                {"Barcode": barcode},
                {
                    "$set": {
                        "image_source_domain": source,
                        "image_processing_version": PROCESSING_VERSION,
                        "watermark_cleanup_applied": bool(changed_any),
                        "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
                    }
                },
            )

            print(
                f"reprocessed barcode={barcode} source={source} "
                f"changed={changed_any} files={[str(path) for path in image_paths]}"
            )
    finally:
        client.close()

    print(
        {
            "source": args.source,
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
