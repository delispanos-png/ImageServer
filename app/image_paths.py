from __future__ import annotations

from pathlib import Path
from typing import Dict, List


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def barcode_image_dir(base_dir: str | Path, barcode: str) -> Path:
    return Path(base_dir) / str(barcode).strip()


def legacy_image_path(base_dir: str | Path, barcode: str) -> Path:
    return Path(base_dir) / f"{str(barcode).strip()}.jpg"


def primary_image_path(base_dir: str | Path, barcode: str) -> Path:
    return barcode_image_dir(base_dir, barcode) / "1.jpg"


def ensure_barcode_image_dir(base_dir: str | Path, barcode: str) -> Path:
    image_dir = barcode_image_dir(base_dir, barcode)
    image_dir.mkdir(parents=True, exist_ok=True)
    return image_dir


def _image_sort_key(path: Path) -> tuple[int, int | str]:
    stem = path.stem
    if stem.isdigit():
        return (0, int(stem))
    return (1, stem)


def resolve_local_image_paths(base_dir: str | Path, barcode: str) -> List[Path]:
    barcode = str(barcode).strip()
    if not barcode:
        return []

    image_dir = barcode_image_dir(base_dir, barcode)
    if image_dir.exists() and image_dir.is_dir():
        image_files = [
            path
            for path in image_dir.iterdir()
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
        ]
        image_files.sort(key=_image_sort_key)
        if image_files:
            return image_files

    legacy_path = legacy_image_path(base_dir, barcode)
    if legacy_path.exists() and legacy_path.is_file():
        return [legacy_path]

    return []


def has_any_local_image(base_dir: str | Path, barcode: str) -> bool:
    return bool(resolve_local_image_paths(base_dir, barcode))


def public_url_for_image_path(barcode: str, image_path: Path, base_url: str) -> str:
    base_url = base_url.rstrip("/")
    barcode = str(barcode).strip()
    if image_path.parent.name == barcode:
        return f"{base_url}/{barcode}/{image_path.name}"
    return f"{base_url}/{barcode}.jpg"


def resolve_public_image_urls(base_dir: str | Path, barcode: str, base_url: str) -> List[str]:
    return [
        public_url_for_image_path(str(barcode).strip(), image_path, base_url)
        for image_path in resolve_local_image_paths(base_dir, barcode)
    ]


def scan_public_image_urls(base_dir: str | Path, base_url: str) -> Dict[str, List[str]]:
    base_dir = Path(base_dir)
    image_urls: Dict[str, List[str]] = {}
    if not base_dir.exists() or not base_dir.is_dir():
        return image_urls

    for entry in base_dir.iterdir():
        if entry.is_dir():
            barcode = entry.name.strip()
            urls = resolve_public_image_urls(base_dir, barcode, base_url)
            if urls:
                image_urls[barcode] = urls
            continue

        if entry.is_file() and entry.suffix.lower() in IMAGE_EXTENSIONS:
            barcode = entry.stem.strip()
            if barcode and barcode not in image_urls:
                image_urls[barcode] = [public_url_for_image_path(barcode, entry, base_url)]

    return image_urls
