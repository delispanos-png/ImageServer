"""Per-image watermark scanner.

For each candidate product:
  1. Fetch the hosted image from /app/images/<barcode>/<barcode>.jpg
  2. Crop the four corners + bottom band (common watermark zones)
  3. Run Tesseract OCR (Greek + English)
  4. Match the detected text against known watermark patterns
  5. Persist the verdict to the product document:
       image_watermark_detected: True | False
       image_watermark_scanned_at: ISO
       image_watermark_terms: [..]   (matched substrings)

The catalog quality gate consumes `image_watermark_detected` to decide
`watermarked_image` — so the next reevaluate run flips offenders to inactive.

Usage:
    python3 image_watermark_scanner.py [--limit N] [--versions a,b,c]
                                       [--barcode BC] [--dry-run]
                                       [--workers N]

By default runs against products with image_processing_version NOT in the
known-clean allow-list.
"""

import argparse
import io
import os
import re
import sys
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Tuple

from dotenv import load_dotenv
from PIL import Image
from pymongo import MongoClient, UpdateOne

try:
    import pytesseract
except ImportError:
    pytesseract = None  # type: ignore[assignment]


sys.path.insert(0, "/app")
from catalog_quality import CLEAN_IMAGE_VERSIONS, build_catalog_quality_updates  # noqa: E402


load_dotenv("/app/.env")

IMAGE_FILES_BASE_DIR = os.getenv("IMAGE_FILES_BASE_DIR", "/app/images")

# Watermark text patterns — case- and accent-insensitive substring matches.
WATERMARK_PATTERNS = [
    "skroutz",
    "ofarmakopoiosmou",
    "o farmakopoiosmou",
    "farmakopoiosmou",
    "ο φαρμακοποιος μου",
    "ο φαρμακοποιοσ μου",
    "pharmacy295",
    "pharmacy 295",
    "youpharmacy",
    "you pharmacy",
    "gohealthy",
    "go healthy",
    "cure4u",
    "kpdhellas",
    "vita4you",
    "vita 4 you",
    "vita4u",
    "tofarmakeiomou",
    "το φαρμακειο μου",
    ".gr",  # weak but useful for any-domain stamp
]


_DIACRITICS = re.compile(r"[̀-ͯ]")


def normalize(text: str) -> str:
    nfd = unicodedata.normalize("NFD", text or "")
    stripped = _DIACRITICS.sub("", nfd)
    return re.sub(r"\s+", " ", stripped.lower()).strip()


def find_watermark_terms(text: str) -> List[str]:
    if not text:
        return []
    norm = normalize(text)
    hits: List[str] = []
    for pattern in WATERMARK_PATTERNS:
        if pattern in norm:
            hits.append(pattern)
    return hits


def ocr_image(img: Image.Image) -> str:
    if pytesseract is None:
        raise RuntimeError("pytesseract is not installed")
    return pytesseract.image_to_string(img, lang="eng+ell", config="--psm 6")


def crop_regions(img: Image.Image) -> List[Tuple[str, Image.Image]]:
    w, h = img.size
    cw = max(60, int(w * 0.45))
    ch = max(40, int(h * 0.18))
    return [
        ("tl", img.crop((0, 0, cw, ch))),
        ("tr", img.crop((w - cw, 0, w, ch))),
        ("bl", img.crop((0, h - ch, cw, h))),
        ("br", img.crop((w - cw, h - ch, w, h))),
        ("bot", img.crop((0, int(h * 0.78), w, h))),
    ]


def find_hosted_image_path(barcode: str) -> Optional[Path]:
    if not barcode:
        return None
    base = Path(IMAGE_FILES_BASE_DIR) / barcode
    if not base.is_dir():
        return None
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        cand = base / f"{barcode}{ext}"
        if cand.is_file():
            return cand
    for child in base.iterdir():
        if child.is_file() and child.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            return child
    return None


def scan_one(barcode: str) -> Tuple[Optional[bool], List[str], str]:
    """Returns (watermark_detected, matched_terms, raw_ocr_text). None on read failure."""
    path = find_hosted_image_path(barcode)
    if not path:
        return None, [], ""
    try:
        with Image.open(path) as raw:
            img = raw.convert("RGB")
    except Exception:
        return None, [], ""

    full_text_parts: List[str] = []
    matched: List[str] = []
    for _label, region in crop_regions(img):
        try:
            text = ocr_image(region)
        except Exception:
            continue
        full_text_parts.append(text)
        for hit in find_watermark_terms(text):
            if hit not in matched:
                matched.append(hit)
        if matched:
            break  # short-circuit: one solid hit is enough
    return (len(matched) > 0), matched, " ".join(full_text_parts)[:500]


def build_query(args) -> dict:
    if args.barcode:
        return {"Barcode": args.barcode}
    if args.versions:
        versions = [v.strip() for v in args.versions.split(",") if v.strip()]
        return {"image_processing_version": {"$in": versions}}
    # Default: everything NOT in the clean allow-list and currently active.
    return {
        "cms_status": "active",
        "image_processing_version": {"$nin": list(CLEAN_IMAGE_VERSIONS)},
        "image_watermark_scanned_at": {"$exists": False},  # resumable
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--versions", type=str, default="")
    parser.add_argument("--barcode", type=str, default="")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--batch", type=int, default=200)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--rescan", action="store_true",
                        help="Ignore image_watermark_scanned_at and re-scan everything matching the filter")
    args = parser.parse_args()

    if pytesseract is None:
        print("ERROR: pytesseract not installed", flush=True)
        return 2

    user = os.getenv("MONGO_USER")
    pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb")
    port = int(os.getenv("MONGO_PORT", "27017"))
    client = MongoClient(f"mongodb://{user}:{pw}@{host}:{port}")
    db = client[os.getenv("MONGO_DB", "imageDB")]

    query = build_query(args)
    if args.rescan:
        query.pop("image_watermark_scanned_at", None)

    total = db.products.count_documents(query)
    print(f"Candidates: {total}", flush=True)
    cursor = db.products.find(query, {"Barcode": 1, "cms_barcode": 1})
    if args.limit:
        cursor = cursor.limit(args.limit)

    barcodes_with_id = [
        (doc["_id"], str(doc.get("cms_barcode") or doc.get("Barcode") or "").strip())
        for doc in cursor
    ]

    stats = {"scanned": 0, "watermarked": 0, "clean": 0, "no_image": 0}
    matched_term_counter: dict = {}
    ops: List[UpdateOne] = []
    now_iso = datetime.now(timezone.utc).isoformat()

    def task(entry):
        oid, bc = entry
        detected, terms, raw = scan_one(bc)
        return oid, bc, detected, terms, raw

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(task, e) for e in barcodes_with_id if e[1]]
        for future in as_completed(futures):
            oid, bc, detected, terms, raw = future.result()
            if detected is None:
                stats["no_image"] += 1
                continue
            stats["scanned"] += 1
            update = {
                "image_watermark_detected": detected,
                "image_watermark_scanned_at": now_iso,
                "image_watermark_terms": terms,
            }
            if detected:
                stats["watermarked"] += 1
                for t in terms:
                    matched_term_counter[t] = matched_term_counter.get(t, 0) + 1
            else:
                stats["clean"] += 1
            if not args.dry_run:
                ops.append(UpdateOne({"_id": oid}, {"$set": update}, upsert=False))
                if len(ops) >= args.batch:
                    db.products.bulk_write(ops, ordered=False)
                    ops.clear()
            if stats["scanned"] % 100 == 0:
                print(f"  progress: {stats}", flush=True)

    if ops and not args.dry_run:
        db.products.bulk_write(ops, ordered=False)

    print(f"\n=== Summary ===")
    print(f"Stats: {stats}")
    print(f"Matched terms breakdown:")
    for term, n in sorted(matched_term_counter.items(), key=lambda x: -x[1]):
        print(f"  {term!r}: {n}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
