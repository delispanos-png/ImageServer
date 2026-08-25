"""Download Img_src URLs to local hosted images for products missing them.

Targets inactive products with `catalog_has_hosted_image=false` and an
external Img_src URL on an accessible (non-bot-protected) CDN.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


IMAGES_DIR = Path("/app/images")
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
EVALUATOR = "automation:img_src_backfill"
PROCESSING_VERSION = "img_src_backfill_v1"

# Hosts known to serve images without bot-protection challenges.
ACCESSIBLE_HOST_PATTERNS = [
    r"assets\.gy\.digital",
    r"assets\.vita4you\.gr",
    r"\.pharm16\.gr/mediastream",
    r"static\.pharmacy295\.gr",
]
ACCESSIBLE_RE = re.compile("|".join(ACCESSIBLE_HOST_PATTERNS), re.I)


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--workers", type=int, default=10)
    p.add_argument("--inactive-only", action="store_true", default=True)
    return p.parse_args()


def mongo_db():
    u = os.getenv("MONGO_USER"); pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST","mongodb"); port = int(os.getenv("MONGO_PORT","27017"))
    c = MongoClient(f"mongodb://{u}:{pw}@{host}:{port}")
    return c, c[os.getenv("MONGO_DB","imageDB")]


def download(url: str, target: Path, referer: str = "") -> Tuple[bool, int]:
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".dl.tmp")
    cmd = ["curl","-sL","-A",USER_AGENT,url,"--max-time","20","-o",str(tmp)]
    if referer:
        cmd += ["-H", f"Referer: {referer}"]
    try:
        r = subprocess.run(cmd, capture_output=True, check=False, timeout=25)
    except Exception:
        return False, 0
    if r.returncode != 0:
        return False, 0
    if not tmp.exists():
        return False, 0
    size = tmp.stat().st_size
    if size < 1000:
        tmp.unlink(missing_ok=True)
        return False, size
    # Validate it's not HTML masquerading as image
    try:
        with open(tmp, "rb") as f:
            head = f.read(8)
    except Exception:
        tmp.unlink(missing_ok=True)
        return False, 0
    is_img = head[:3] in (b"\xff\xd8\xff", b"\x89PN", b"RIF", b"GIF") or head[:4] == b"\x89PNG"
    if not is_img:
        tmp.unlink(missing_ok=True)
        return False, size
    tmp.rename(target)
    return True, size


def process(doc: Dict) -> Optional[Dict]:
    bc = str(doc.get("Barcode","")).strip()
    img_url = str(doc.get("Img_src","") or "").strip()
    if not bc or not img_url:
        return None
    target = IMAGES_DIR / bc / "1.jpg"
    referer = str(doc.get("Product_Link","") or "").strip()
    ok, size = download(img_url, target, referer)
    return {"id": doc["_id"], "bc": bc, "ok": ok, "size": size, "url": img_url}


def main():
    args = parse_args()
    load_dotenv("/app/.env")

    client, db = mongo_db()
    try:
        query = {
            "catalog_has_hosted_image": False,
            "Img_src": {"$regex": ACCESSIBLE_RE.pattern, "$options": "i"},
        }
        if args.inactive_only:
            query["cms_status"] = "inactive"

        total = db.products.count_documents(query)
        print({"stage":"count", "total": total, "workers": args.workers})

        cursor = db.products.find(query)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)
        docs = list(cursor)

        stats = {"examined": len(docs), "downloaded": 0, "failed": 0, "would_activate": 0, "modified": 0}
        ops: List[UpdateOne] = []

        if args.dry_run:
            print({"summary": stats, "would_examine": len(docs)})
            return

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(process, d): d for d in docs}
            for i, fut in enumerate(as_completed(futures), 1):
                doc = futures[fut]
                result = fut.result()
                if not result or not result.get("ok"):
                    stats["failed"] += 1
                    if i % 500 == 0:
                        print({"progress": i, "ok": stats["downloaded"], "failed": stats["failed"]}, flush=True)
                    continue
                stats["downloaded"] += 1
                bc = result["bc"]
                updates = {
                    "Image_Path": f"Images/{doc.get('Site','source')}/{bc}.jpg",
                    "Image_Path_Collection": f"Images/{doc.get('Site','source')}/{bc}.jpg",
                    "image_processing_version": PROCESSING_VERSION,
                    "watermark_cleanup_applied": False,
                    "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
                    "brand_enrichment_source": EVALUATOR,
                }
                cand = dict(doc); cand.update(updates)
                updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR))
                if updates.get("cms_status") == "active":
                    stats["would_activate"] += 1
                ops.append(UpdateOne({"_id": doc["_id"]}, {"$set": updates}, upsert=False))

                if i % 500 == 0:
                    print({"progress": i, "ok": stats["downloaded"], "failed": stats["failed"], "activated": stats["would_activate"]}, flush=True)

        if ops:
            for i in range(0, len(ops), 500):
                r = db.products.bulk_write(ops[i:i + 500], ordered=False)
                stats["modified"] += r.modified_count

        print({"summary": stats})
    finally:
        client.close()


if __name__ == "__main__":
    main()
