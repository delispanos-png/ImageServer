#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

PROJECT_ROOT = Path(__file__).resolve().parent
APP_DIR = PROJECT_ROOT / "app"
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))

from image_paths import has_any_local_image  # noqa: E402

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
        (
            "printjson(db.products.find({},"
            "{_id:0,Barcode:1,Img_src:1,Product_Link:1,last_source:1,Site:1,"
            "image_processing_version:1,watermark_cleanup_applied:1,image_reprocessed_at:1}).toArray())"
        ),
    ]
    raw = subprocess.check_output(cmd, text=True)
    return json.loads(raw)


def infer_source(record: dict) -> str:
    site = normalize_source(record.get("last_source", "") or record.get("Site", ""))
    if site:
        return site
    for candidate in (str(record.get("Img_src", "")).strip(), str(record.get("Product_Link", "")).strip()):
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
    source = "farmakopoiosmou"
    images_dir = Path(os.getenv("IMAGES_PATH", "/home/imageuser/CloudonXMLGenerator/Photos/CloudOn"))
    out_path = Path("/home/imageuser/imageDataAPI/reprocess_farmakopoiosmou_queue.json")
    app_out_path = Path("/home/imageuser/imageDataAPI/app/reprocess_farmakopoiosmou_queue.json")
    pattern = re.compile(r"^\d{8,14}$")

    records = docker_mongo_records()
    queue = []
    for record in records:
        barcode = str(record.get("Barcode", "")).strip()
        if not pattern.fullmatch(barcode):
            continue
        if infer_source(record) != source:
            continue
        if not has_any_local_image(images_dir, barcode):
            continue
        if str(record.get("image_processing_version", "")).strip() == CURRENT_VERSION:
            continue
        queue.append(record)

    payload = json.dumps(queue, ensure_ascii=False, indent=2)
    out_path.write_text(payload)
    app_out_path.write_text(payload)
    print(
        json.dumps(
            {
                "source": source,
                "version": CURRENT_VERSION,
                "queued": len(queue),
                "host_path": str(out_path),
                "app_path": str(app_out_path),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
