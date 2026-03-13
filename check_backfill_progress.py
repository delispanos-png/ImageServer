import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "app"))

from image_paths import has_any_local_image


def collect_counts() -> dict:
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
        "printjson(db.products.find({},{_id:0,Barcode:1}).toArray())",
    ]
    raw = subprocess.check_output(cmd, text=True)
    records = json.loads(raw)

    img_dir = Path("/home/imageuser/CloudonXMLGenerator/Photos/CloudOn")
    numeric_pattern = re.compile(r"^\d{8,14}$")

    raw_missing = 0
    numeric_missing = 0
    with_hosted = 0

    for record in records:
        barcode = str(record.get("Barcode", "")).strip()
        if not barcode:
            continue

        if has_any_local_image(img_dir, barcode):
            with_hosted += 1
            continue

        raw_missing += 1
        if numeric_pattern.fullmatch(barcode):
            numeric_missing += 1

    return {
        "total_records": len(records),
        "with_hosted_local_jpg": with_hosted,
        "raw_missing_hosted_local_jpg": raw_missing,
        "numeric_missing_hosted_local_jpg": numeric_missing,
    }


def print_counts() -> None:
    counts = collect_counts()
    print(json.dumps(counts, ensure_ascii=False, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Check backfill progress for hosted product images.")
    parser.add_argument("--watch", action="store_true", help="Repeat the check continuously.")
    parser.add_argument("--interval", type=int, default=300, help="Watch interval in seconds. Default: 300.")
    args = parser.parse_args()

    if not args.watch:
        print_counts()
        return

    while True:
        print(time.strftime("%Y-%m-%d %H:%M:%S"))
        print_counts()
        print("-" * 60)
        time.sleep(max(1, args.interval))


if __name__ == "__main__":
    main()
