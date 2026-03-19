#!/usr/bin/env python3
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent / "app"))

from image_paths import has_any_local_image


CURRENT_VERSION = "farmakopoiosmou_crop_v3"


def normalize_source(value: str) -> str:
    value = str(value or "").strip().lower()
    if value in {"farmakopoiosmou", "ofarmakopoiosmou"}:
        return "farmakopoiosmou"
    return value


def docker_mongo_records() -> list[dict]:
    cmd = [
        "docker",
        "exec",
        "mongodb",
        "mongo",
        "--quiet",
        "-u",
        "root",
        "-p",
        "de3Rfsz#l",
        "--authenticationDatabase",
        "admin",
        "imageDB",
        "--eval",
        "printjson(db.products.find({},{_id:0,Barcode:1,Img_src:1,Product_Link:1,last_source:1,Site:1,image_processing_version:1,watermark_cleanup_applied:1,image_reprocessed_at:1}).toArray())",
    ]
    raw = subprocess.check_output(cmd, text=True)
    return json.loads(raw)


def infer_source(record: dict) -> str:
    site = normalize_source(record.get("last_source", "") or record.get("Site", ""))
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


def main() -> None:
    parser = argparse.ArgumentParser(description="Show watermark reprocess progress.")
    parser.add_argument("--source", default="farmakopoiosmou")
    parser.add_argument("--version", default=CURRENT_VERSION)
    parser.add_argument(
        "--queue-file",
        default="/home/imageuser/imageDataAPI/reprocess_farmakopoiosmou_queue.json",
        help="Optional frozen queue file used for snapshot-based progress.",
    )
    parser.add_argument(
        "--images-dir",
        default=os.getenv("IMAGES_PATH", "/home/imageuser/CloudonXMLGenerator/Photos/CloudOn"),
    )
    args = parser.parse_args()
    normalized_source = normalize_source(args.source)

    images_dir = Path(args.images_dir)
    pattern = re.compile(r"^\d{8,14}$")

    records = docker_mongo_records()
    scoped = []
    for record in records:
        barcode = str(record.get("Barcode", "")).strip()
        if not pattern.fullmatch(barcode):
            continue
        if infer_source(record) != normalized_source:
            continue
        if not has_any_local_image(images_dir, barcode):
            continue
        scoped.append(record)

    processed = 0
    watermark_applied = 0
    pending = 0
    by_barcode = {}
    for record in scoped:
        barcode = str(record.get("Barcode", "")).strip()
        if barcode:
            by_barcode[barcode] = record
        version = str(record.get("image_processing_version", "")).strip()
        if version == args.version:
            processed += 1
            if bool(record.get("watermark_cleanup_applied")):
                watermark_applied += 1
        else:
            pending += 1

    snapshot_total = None
    snapshot_processed = None
    snapshot_watermark_applied = None
    snapshot_pending = None
    queue_path = Path(args.queue_file)
    if queue_path.exists():
        try:
            queued_records = json.loads(queue_path.read_text())
            if isinstance(queued_records, list):
                snapshot_total = len(queued_records)
                snapshot_processed = 0
                snapshot_watermark_applied = 0
                snapshot_pending = 0
                for queued in queued_records:
                    barcode = str(queued.get("Barcode", "")).strip()
                    current = by_barcode.get(barcode)
                    if current and str(current.get("image_processing_version", "")).strip() == args.version:
                        snapshot_processed += 1
                        if bool(current.get("watermark_cleanup_applied")):
                            snapshot_watermark_applied += 1
                    else:
                        snapshot_pending += 1
        except Exception:
            pass

    print(
        json.dumps(
            {
                "source": args.source,
                "source_normalized": normalized_source,
                "version": args.version,
                "hosted_images_in_scope": len(scoped),
                "processed_current_version": processed,
                "watermark_cleanup_applied": watermark_applied,
                "pending_reprocess": pending,
                "snapshot_queue_file": str(queue_path) if queue_path.exists() else "",
                "snapshot_total": snapshot_total,
                "snapshot_processed_current_version": snapshot_processed,
                "snapshot_watermark_cleanup_applied": snapshot_watermark_applied,
                "snapshot_pending_reprocess": snapshot_pending,
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
