"""Download images from manufacturer caches and host them locally.

Sources:
  - Frezyderm cache (barcode → image URL)
  - Avene cache (barcode → image URL)

For each inactive DB product matching a cached barcode:
  - Download image to /app/images/{barcode}/1.jpg
  - Update product: image_processing_version=manufacturer_cache_v1,
                    watermark_cleanup_applied=false, catalog_has_hosted_image=true
  - Re-run catalog quality gate
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


IMAGES_DIR = Path("/app/images")
EVALUATOR = "automation:host_from_manufacturer_cache"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
PROCESSING_VERSION = "manufacturer_cache_v1"


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--sources", nargs="+", default=["frezyderm", "avene"])
    return p.parse_args()


def mongo_db():
    u = os.getenv("MONGO_USER"); pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST","mongodb"); port = int(os.getenv("MONGO_PORT","27017"))
    c = MongoClient(f"mongodb://{u}:{pw}@{host}:{port}")
    return c, c[os.getenv("MONGO_DB","imageDB")]


def load_caches(sources: List[str]) -> Dict[str, str]:
    """Return barcode → image_url mapping across selected caches."""
    out: Dict[str, str] = {}
    for src in sources:
        path = f"/app/brand_catalog_{src}.json"
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        for entry in data:
            bc = (entry.get("gtin") or entry.get("sitemap_barcode") or "").strip()
            if not bc:
                continue
            img = entry.get("image")
            if isinstance(img, dict):
                img = img.get("url", "")
            img = str(img or "").strip()
            if not img:
                continue
            bc_norm = bc.lstrip("0")
            out.setdefault(bc, img)
            if bc_norm and bc_norm != bc:
                out.setdefault(bc_norm, img)
    return out


def download_image(url: str, target: Path) -> bool:
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".tmp")
    r = subprocess.run(
        ["curl","-sL","-A",USER_AGENT,url,"--max-time","30","-o",str(tmp)],
        capture_output=True, check=False, timeout=35,
    )
    if r.returncode != 0:
        return False
    if not tmp.exists() or tmp.stat().st_size < 1000:
        tmp.unlink(missing_ok=True)
        return False
    tmp.rename(target)
    return True


def main():
    args = parse_args()
    load_dotenv("/app/.env")

    bmap = load_caches(args.sources)
    print({"stage": "load_caches", "sources": args.sources, "barcode_count": len(bmap)})

    client, db = mongo_db()
    try:
        # Target: inactive products whose barcode is in our cache
        candidate_barcodes = list(bmap.keys())
        query = {
            "cms_status": "inactive",
            "Barcode": {"$in": candidate_barcodes},
        }
        total = db.products.count_documents(query)
        print({"stage": "mongo_query", "candidates": total})

        cursor = db.products.find(query)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)

        stats = {"examined": 0, "downloaded": 0, "skip_already_hosted": 0,
                 "download_failed": 0, "would_activate": 0, "modified": 0}
        ops: List[UpdateOne] = []

        for doc in cursor:
            stats["examined"] += 1
            bc = str(doc.get("Barcode", "")).strip()
            url = bmap.get(bc) or bmap.get(bc.lstrip("0"))
            if not url:
                continue
            target = IMAGES_DIR / bc / "1.jpg"
            if target.exists() and target.stat().st_size > 1000 and not doc.get("watermark_cleanup_applied"):
                stats["skip_already_hosted"] += 1
                continue
            if args.dry_run:
                stats["downloaded"] += 1  # would-download
            else:
                if not download_image(url, target):
                    stats["download_failed"] += 1
                    continue
                stats["downloaded"] += 1

            updates = {
                "Image_Path": f"Images/manufacturer/{bc}.jpg",
                "Image_Path_Collection": f"Images/manufacturer/{bc}.jpg",
                "image_processing_version": PROCESSING_VERSION,
                "watermark_cleanup_applied": False,
                "image_reprocessed_at": datetime.now(timezone.utc).isoformat(),
                "image_source_domain": "manufacturer_cache",
                "brand_enrichment_source": EVALUATOR,
            }
            cand = dict(doc); cand.update(updates)
            updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR))
            if updates.get("cms_status") == "active":
                stats["would_activate"] += 1
            ops.append(UpdateOne({"_id": doc["_id"]}, {"$set": updates}, upsert=False))

        if not args.dry_run and ops:
            for i in range(0, len(ops), 500):
                r = db.products.bulk_write(ops[i:i + 500], ordered=False)
                stats["modified"] += r.modified_count

        print({"summary": stats})
    finally:
        client.close()


if __name__ == "__main__":
    main()
