#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def is_structured_code(value: str) -> bool:
    value = value.strip()
    if len(value) < 3:
        return False
    if not any(ch.isdigit() for ch in value):
        return False
    return all(ch.isalnum() for ch in value)


def next_image_path(image_dir: Path, suffix: str) -> Path:
    index = 1
    while True:
        candidate = image_dir / f"{index}{suffix}"
        if not candidate.exists():
            return candidate
        index += 1


def migrate(base_dir: Path, dry_run: bool) -> dict:
    moved = 0
    skipped_non_barcode = 0
    skipped_non_image = 0
    conflicts_resolved = 0

    for path in sorted(base_dir.iterdir()):
        if not path.is_file():
            continue

        if path.suffix.lower() not in IMAGE_EXTENSIONS:
            skipped_non_image += 1
            continue

        barcode = path.stem.strip()
        if not is_structured_code(barcode):
            skipped_non_barcode += 1
            continue

        target_dir = base_dir / barcode
        target_dir.mkdir(parents=True, exist_ok=True) if not dry_run else None

        target_path = target_dir / f"1{path.suffix.lower()}"
        if target_path.exists():
            target_path = next_image_path(target_dir, path.suffix.lower())
            conflicts_resolved += 1

        if not dry_run:
            shutil.move(str(path), str(target_path))
        moved += 1

    return {
        "base_dir": str(base_dir),
        "dry_run": dry_run,
        "moved": moved,
        "skipped_non_barcode": skipped_non_barcode,
        "skipped_non_image": skipped_non_image,
        "conflicts_resolved": conflicts_resolved,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Move flat hosted images into barcode-named folders.")
    parser.add_argument(
        "--base-dir",
        default="/home/imageuser/CloudonXMLGenerator/Photos/CloudOn",
        help="Hosted image root directory.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Report what would move without changing files.")
    args = parser.parse_args()

    result = migrate(Path(args.base_dir), args.dry_run)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
