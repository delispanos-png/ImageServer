from __future__ import annotations

import argparse
import asyncio
import os
import re
import shutil
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

from catalog_quality import build_catalog_quality_updates
from image_paths import resolve_local_image_paths
from skroutzFetch import _download_image_collection
from source_locks import (
    YOUPHARMACY_XML_LOCK_SOURCE,
    YOUPHARMACY_XML_REPLACE_PROCESSING_VERSION,
    normalize_source_name,
)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class YoupharmacyXmlRow:
    barcode: str
    product_name: str
    image_url: str
    product_link: str
    manufacturer: str
    category_name: str
    description: str
    availability: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Replace farmakopoiosmou hosted images with clean images from a youpharmacy XML feed."
    )
    parser.add_argument(
        "--xml-file",
        default="/home/imageuser/skroutz.xml",
        help="Absolute path to the youpharmacy XML file.",
    )
    parser.add_argument("--barcode", default="", help="Process a single barcode.")
    parser.add_argument("--limit", type=int, default=0, help="Max matching products to process.")
    parser.add_argument("--dry-run", action="store_true", help="Inspect candidates without changing files.")
    parser.add_argument(
        "--backup-dir",
        default="/app/image_replacement_backup",
        help="Base backup directory before replacing hosted images.",
    )
    parser.add_argument(
        "--replace-all-matched-barcodes",
        action="store_true",
        help="Ignore the farmakopoiosmou-only filter and replace every barcode found in the XML feed.",
    )
    return parser.parse_args()


def _normalize_barcode(value: str) -> str:
    digits = re.sub(r"\D+", "", str(value or "").strip())
    if len(digits) < 8:
        return ""
    return digits


def _iter_barcode_candidates(product_elem: ET.Element) -> list[str]:
    candidates: list[str] = []
    for raw_value in (
        product_elem.findtext("ean", ""),
        product_elem.findtext("mpn", ""),
    ):
        barcode = _normalize_barcode(raw_value)
        if barcode and barcode not in candidates:
            candidates.append(barcode)
    return candidates


def load_youpharmacy_xml_lookup(xml_file: str) -> dict[str, YoupharmacyXmlRow]:
    xml_path = Path(xml_file)
    if not xml_path.exists() or not xml_path.is_file():
        raise FileNotFoundError(f"xml file not found: {xml_path}")

    lookup: dict[str, YoupharmacyXmlRow] = {}

    for _, elem in ET.iterparse(xml_path, events=("end",)):
        if elem.tag != "product":
            continue

        image_url = str(elem.findtext("image", "") or "").strip()
        if not image_url:
            elem.clear()
            continue

        row = YoupharmacyXmlRow(
            barcode="",
            product_name=str(elem.findtext("name", "") or "").strip(),
            image_url=image_url,
            product_link=str(elem.findtext("link", "") or "").strip(),
            manufacturer=str(elem.findtext("manufacturer", "") or "").strip(),
            category_name=str(elem.findtext("category", "") or "").strip(),
            description=str(elem.findtext("description", "") or "").strip(),
            availability=str(elem.findtext("availability", "") or "").strip(),
        )
        for barcode in _iter_barcode_candidates(elem):
            if barcode not in lookup:
                lookup[barcode] = YoupharmacyXmlRow(
                    barcode=barcode,
                    product_name=row.product_name,
                    image_url=row.image_url,
                    product_link=row.product_link,
                    manufacturer=row.manufacturer,
                    category_name=row.category_name,
                    description=row.description,
                    availability=row.availability,
                )

        elem.clear()

    return lookup


def build_query(feed_barcodes: list[str], barcode: str, replace_all_matched_barcodes: bool) -> dict:
    if barcode:
        return {"Barcode": barcode}

    query: dict = {"Barcode": {"$in": feed_barcodes}}
    if replace_all_matched_barcodes:
        return query

    query["$or"] = [
        {"last_source": "farmakopoiosmou"},
        {"last_source": "ofarmakopoiosmou"},
        {"Site": "farmakopoiosmou"},
        {"Site": "ofarmakopoiosmou"},
        {"image_source_domain": "farmakopoiosmou"},
        {"Img_src": {"$regex": "ofarmakopoiosmou", "$options": "i"}},
        {"Product_Link": {"$regex": "ofarmakopoiosmou", "$options": "i"}},
        {"image_processing_version": {"$regex": "^farmakopoiosmou_crop_", "$options": "i"}},
        {"watermark_cleanup_applied": True},
    ]
    return query


def backup_existing_images(images_dir: Path, backup_root: Path, barcode: str) -> None:
    image_paths = resolve_local_image_paths(images_dir, barcode)
    for image_path in image_paths:
        relative_parts = image_path.relative_to(images_dir).parts
        backup_path = backup_root.joinpath(*relative_parts)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(image_path, backup_path)


def _already_uses_youpharmacy_image(record: dict, xml_row: YoupharmacyXmlRow, local_images: list[Path]) -> bool:
    if not local_images:
        return False

    if str(record.get("photo_source_lock", "")).strip() != YOUPHARMACY_XML_LOCK_SOURCE:
        return False

    current_img_src = str(record.get("Img_src", "") or "").strip()
    if current_img_src and current_img_src == xml_row.image_url:
        return True

    current_source = normalize_source_name(
        record.get("image_source_domain", ""),
        record.get("Site", ""),
        record.get("last_source", ""),
        current_img_src,
        record.get("Product_Link", ""),
    )
    return current_source == "youpharmacy"


async def run_replacement(args: argparse.Namespace) -> dict:
    load_dotenv()

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    images_dir = Path("/app/images")
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_root = Path(args.backup_dir) / timestamp

    lookup = load_youpharmacy_xml_lookup(args.xml_file)
    feed_barcodes = list(lookup.keys())
    requested_barcode = _normalize_barcode(args.barcode)
    if requested_barcode:
        feed_barcodes = [requested_barcode]
    elif args.limit:
        feed_barcodes = feed_barcodes[: args.limit]

    mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}"
    client = MongoClient(mongo_uri)
    db = client[mongo_db]

    examined = 0
    matched_feed = 0
    replaced = 0
    unchanged = 0
    missing_feed = 0
    missing_local = 0
    imported_missing_local = 0
    failed_download = 0

    try:
        cursor = db.products.find(build_query(feed_barcodes, requested_barcode, args.replace_all_matched_barcodes))
        records = list(cursor)
        records.sort(key=lambda row: str(row.get("Barcode", "")).strip())
        print({"records_loaded": len(records), "xml_rows_with_images": len(lookup)}, flush=True)

        for record in records:
            examined += 1
            barcode = _normalize_barcode(record.get("Barcode", ""))
            if not barcode:
                continue

            xml_row = lookup.get(barcode)
            if xml_row is None or not xml_row.image_url:
                missing_feed += 1
                continue

            matched_feed += 1
            local_images = resolve_local_image_paths(images_dir, barcode)
            has_local_images = bool(local_images)
            if not has_local_images:
                missing_local += 1

            if _already_uses_youpharmacy_image(record, xml_row, local_images):
                unchanged += 1
                continue

            if args.dry_run:
                print(
                    {
                        "barcode": barcode,
                        "current_source": normalize_source_name(
                            record.get("image_source_domain", ""),
                            record.get("Site", ""),
                            record.get("last_source", ""),
                            record.get("Img_src", ""),
                            record.get("Product_Link", ""),
                        ),
                        "current_img_src": str(record.get("Img_src", "") or "").strip(),
                        "replacement_img_src": xml_row.image_url,
                        "replacement_link": xml_row.product_link,
                        "has_local_images": has_local_images,
                    },
                    flush=True,
                )
                continue

            if has_local_images:
                backup_existing_images(images_dir, backup_root, barcode)

            downloaded_paths = await _download_image_collection(
                [xml_row.image_url],
                barcode,
                site_name="youpharmacy",
                replace_existing=True,
                referer=xml_row.product_link,
            )
            if not downloaded_paths:
                failed_download += 1
                print(
                    {
                        "barcode": barcode,
                        "replaced": False,
                        "reason": "download_failed",
                        "image_url": xml_row.image_url,
                    },
                    flush=True,
                )
                continue

            now_iso = _utcnow_iso()
            set_updates = {
                "photo_source_locked": True,
                "photo_source_lock": YOUPHARMACY_XML_LOCK_SOURCE,
                "photo_source_locked_at": now_iso,
                "Img_src": xml_row.image_url,
                "Img_src_List": [xml_row.image_url],
                "Site": YOUPHARMACY_XML_LOCK_SOURCE,
                "last_source": YOUPHARMACY_XML_LOCK_SOURCE,
                "Product_Link": xml_row.product_link or str(record.get("Product_Link", "") or "").strip(),
                "Brand": xml_row.manufacturer or record.get("Brand", ""),
                "image_source_domain": "youpharmacy",
                "image_processing_version": YOUPHARMACY_XML_REPLACE_PROCESSING_VERSION,
                "watermark_cleanup_applied": False,
                "image_reprocessed_at": now_iso,
                "youpharmacy_xml_replaced_at": now_iso,
                "Other_Sites.youpharmacy_xml": {
                    "Title": xml_row.product_name,
                    "Img_src": xml_row.image_url,
                    "Img_src_List": [xml_row.image_url],
                    "Product_Link": xml_row.product_link,
                    "Brand": xml_row.manufacturer,
                    "Description": xml_row.description,
                    "Category_name": xml_row.category_name,
                    "availability": xml_row.availability,
                    "Source_File": args.xml_file,
                },
            }
            candidate = dict(record)
            candidate.update(set_updates)
            set_updates.update(
                build_catalog_quality_updates(
                    candidate,
                    evaluator="automation:replace_farmakopoiosmou_with_youpharmacy_xml",
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
        "processing_version": YOUPHARMACY_XML_REPLACE_PROCESSING_VERSION,
        "xml_file": args.xml_file,
        "dry_run": args.dry_run,
        "replace_all_matched_barcodes": args.replace_all_matched_barcodes,
        "examined": examined,
        "matched_feed": matched_feed,
        "replaced": replaced,
        "unchanged": unchanged,
        "missing_feed": missing_feed,
        "missing_local": missing_local,
        "imported_missing_local": imported_missing_local,
        "failed_download": failed_download,
        "backup_root": str(backup_root),
    }


def main() -> None:
    args = parse_args()
    print(asyncio.run(run_replacement(args)))


if __name__ == "__main__":
    main()
