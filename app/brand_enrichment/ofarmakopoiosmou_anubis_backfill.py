"""Backfill categories and hosted images from ofarmakopoiosmou.gr via Anubis bypass.

For each inactive product with Site=ofarmakopoiosmou and a Product_Link:
  1. Fetch product page (Anubis cookie auto-handled)
  2. Extract breadcrumb → Category_1/2/3
  3. Extract og:image URL → download to /app/images/{barcode}/1.jpg
  4. Update DB + re-run catalog quality

Anubis auth cookie is shared across the entire batch (renewed if expired).
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import os
import re
import subprocess
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
sys.path.insert(0, "/app/brand_enrichment")
from anubis_solver import fetch_protected, get_anubis_cookie, parse_challenge  # noqa: E402
from catalog_quality import build_catalog_quality_updates  # noqa: E402


IMAGES_DIR = Path("/app/images")
EVALUATOR = "automation:ofarmakopoiosmou_anubis_backfill"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
PROCESSING_VERSION = "ofarmakopoiosmou_anubis_v1"

BREADCRUMB_RE = re.compile(r'<div\s+class="breadcrumb">(.*?)</div>', re.S | re.I)
OG_IMAGE_RE = re.compile(r'<meta\s+property="og:image"\s+content="([^"]+)"', re.I)
SKIP_BREADCRUMB_RAW = {"ONLINE ΦΑΡΜΑΚΕΙΟ", "ONLINE FARMAKEIO", "HOME", "ΑΡΧΙΚΗ",
                       "EXPRESS ΠΡΟΪΟΝΤΑ", "EXPRESS PROIONTA",
                       "ΠΡΟΣΦΟΡΕΣ", "OFFERS"}


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--download-images", action="store_true", default=True)
    return p.parse_args()


def mongo_db():
    u = os.getenv("MONGO_USER"); pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb"); port = int(os.getenv("MONGO_PORT", "27017"))
    c = MongoClient(f"mongodb://{u}:{pw}@{host}:{port}")
    return c, c[os.getenv("MONGO_DB", "imageDB")]


# Per-worker session storage
_thread_local = threading.local()


def get_session():
    s = getattr(_thread_local, "session", None)
    if s is None:
        s = get_anubis_cookie("https://www.ofarmakopoiosmou.gr/")
        if s is None:
            return None
        _thread_local.session = s
    return s


def reset_session():
    _thread_local.session = None


def fetch_product(url: str, retries: int = 2) -> Optional[str]:
    """Fetch product page via Anubis session, handle expiry."""
    for attempt in range(retries):
        session = get_session()
        if session is None:
            time.sleep(1)
            continue
        text, session = fetch_protected(url, session=session)
        if text:
            _thread_local.session = session
            return text
        # Session may have expired - reset
        reset_session()
        time.sleep(0.5)
    return None


import unicodedata


def _strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


SKIP_BREADCRUMB = {_strip_accents(s) for s in SKIP_BREADCRUMB_RAW}


def extract_breadcrumb(html: str) -> List[str]:
    m = BREADCRUMB_RE.search(html)
    if not m:
        return []
    chunk = m.group(1)
    texts = re.findall(r'>([^<>\n]+)<', chunk)
    cleaned: List[str] = []
    for t in texts:
        text = html_lib.unescape(t).strip()
        if not text or len(text) < 2 or len(text) > 100:
            continue
        normalized = _strip_accents(text.upper())
        if normalized in SKIP_BREADCRUMB:
            continue
        cleaned.append(text)
    # Last entry is always the product name (long) — drop it
    if cleaned and len(cleaned[-1]) > 30:
        cleaned = cleaned[:-1]
    return cleaned


def extract_image_url(html: str) -> str:
    m = OG_IMAGE_RE.search(html)
    return m.group(1).strip() if m else ""


def download_image(url: str, target: Path, session) -> bool:
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".dl.tmp")
    try:
        r = session.get(url, timeout=20, allow_redirects=True)
    except Exception:
        return False
    if r.status_code != 200 or len(r.content) < 1000:
        return False
    head = r.content[:8]
    if not (head[:3] in (b"\xff\xd8\xff", b"\x89PN", b"GIF") or head[:4] == b"\x89PNG"):
        # Maybe PNG signature different — accept anyway
        if not (head[:2] == b"\xff\xd8" or head[:4] == b"\x89PNG" or head[:6] == b"GIF89a"):
            return False
    with open(tmp, "wb") as f:
        f.write(r.content)
    tmp.rename(target)
    return True


def process_product(doc: Dict, download_images: bool) -> Optional[Dict]:
    url = (doc.get("Product_Link") or "").strip()
    if not url:
        return None
    bc = str(doc.get("Barcode", "")).strip()
    html = fetch_product(url)
    if not html:
        return {"id": doc["_id"], "bc": bc, "ok": False, "reason": "fetch_failed"}

    bc_list = extract_breadcrumb(html)
    # The last entry is typically the product title — drop it
    product_name = re.sub(r"<[^>]+>", "", str(doc.get("Title", "") or "")).strip().lower()
    if bc_list and bc_list[-1].lower() == product_name:
        bc_list = bc_list[:-1]

    image_url = extract_image_url(html)
    image_downloaded = False
    if download_images and image_url and bc:
        target = IMAGES_DIR / bc / "1.jpg"
        session = get_session()
        if session:
            image_downloaded = download_image(image_url, target, session)

    return {
        "id": doc["_id"],
        "bc": bc,
        "ok": True,
        "categories": bc_list[:3],
        "image_url": image_url,
        "image_downloaded": image_downloaded,
    }


def main():
    args = parse_args()
    load_dotenv("/app/.env")

    client, db = mongo_db()
    try:
        # Target: inactive ofarmakopoiosmou with Product_Link
        query = {
            "cms_status": "inactive",
            "Site": "ofarmakopoiosmou",
            "Product_Link": {"$exists": True, "$ne": ""},
        }
        total = db.products.count_documents(query)
        print({"stage": "count", "total": total, "workers": args.workers})

        cursor = db.products.find(query)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)
        docs = list(cursor)

        stats = {
            "examined": len(docs), "fetched": 0, "fetch_failed": 0,
            "with_breadcrumb": 0, "image_downloaded": 0,
            "would_activate": 0, "modified": 0,
        }
        report: List[Dict] = []
        ops: List[UpdateOne] = []

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(process_product, d, args.download_images): d for d in docs}
            for i, fut in enumerate(as_completed(futures), 1):
                doc = futures[fut]
                result = fut.result()
                if not result or not result.get("ok"):
                    stats["fetch_failed"] += 1
                    if i % 100 == 0:
                        print({"progress": i, "ok": stats["fetched"], "failed": stats["fetch_failed"]}, flush=True)
                    continue
                stats["fetched"] += 1
                if result.get("categories"):
                    stats["with_breadcrumb"] += 1
                if result.get("image_downloaded"):
                    stats["image_downloaded"] += 1

                cats = result.get("categories") or []
                updates: Dict[str, object] = {
                    "brand_enrichment_source": EVALUATOR,
                    "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
                }
                if cats:
                    updates["Category_1"] = cats[0] if len(cats) > 0 else ""
                    if len(cats) > 1:
                        updates["Category_2"] = cats[1]
                    if len(cats) > 2:
                        updates["Category_3"] = cats[2]
                if result.get("image_downloaded"):
                    updates["Image_Path"] = f"Images/ofarmakopoiosmou/{result['bc']}.jpg"
                    updates["Image_Path_Collection"] = f"Images/ofarmakopoiosmou/{result['bc']}.jpg"
                    updates["image_processing_version"] = PROCESSING_VERSION
                    updates["watermark_cleanup_applied"] = False
                    updates["image_reprocessed_at"] = datetime.now(timezone.utc).isoformat()

                cand = dict(doc); cand.update(updates)
                updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR))
                if doc.get("cms_status") == "inactive" and updates.get("cms_status") == "active":
                    stats["would_activate"] += 1
                if len(report) < 100:
                    report.append({
                        "barcode": result["bc"],
                        "categories": cats,
                        "image": result.get("image_url"),
                        "image_downloaded": result.get("image_downloaded"),
                        "result_status": updates.get("cms_status"),
                    })
                ops.append(UpdateOne({"_id": result["id"]}, {"$set": updates}, upsert=False))

                if i % 100 == 0:
                    print({"progress": i, "ok": stats["fetched"], "would_activate": stats["would_activate"]}, flush=True)

        if not args.dry_run and ops:
            for i in range(0, len(ops), 500):
                r = db.products.bulk_write(ops[i:i + 500], ordered=False)
                stats["modified"] += r.modified_count

        with open("/app/ofarmakopoiosmou_anubis_report.json", "w", encoding="utf-8") as f:
            json.dump({"stats": stats, "sample": report[:50]}, f, ensure_ascii=False, indent=2)
        print({"summary": stats})
    finally:
        client.close()


if __name__ == "__main__":
    main()
