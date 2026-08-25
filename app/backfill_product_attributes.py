"""Backfill the `attributes` block on every active product with heuristic
estimates from product_attributes.build_attributes_block.

Only estimates the fields that are missing — existing `verified` values
(manufacturer or manual) are preserved by the underlying builder.

Use:
  python3 backfill_product_attributes.py                # all active products
  python3 backfill_product_attributes.py --status all   # active + inactive
  python3 backfill_product_attributes.py --limit 100    # dry-test size
  python3 backfill_product_attributes.py --dry-run      # don't write
"""
from __future__ import annotations

import argparse
import os
from datetime import datetime, timezone
from typing import Dict

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

from catalog_quality import build_catalog_quality_updates
from product_attributes import build_attributes_block, is_site_ready


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def run(*, status: str = "active", limit: int = 0, dry_run: bool = False, batch_size: int = 500) -> Dict[str, int]:
    load_dotenv("/app/.env")
    client = MongoClient(
        f"mongodb://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASSWORD')}"
        f"@{os.getenv('MONGO_HOST', 'mongodb')}:{os.getenv('MONGO_PORT', '27017')}"
    )
    db = client[os.getenv("MONGO_DB", "imageDB")]

    query: Dict[str, object] = {}
    if status == "active":
        query["cms_status"] = "active"
    elif status == "inactive":
        query["cms_status"] = "inactive"
    # else: all — no filter

    # IMPORTANT: load the FULL document, not just the attribute-related
    # fields. build_catalog_quality_updates re-evaluates description,
    # image, category, watermark, etc. and would mass-deactivate products
    # if those fields were absent from the projection.
    cursor = db.products.find(query, no_cursor_timeout=True)
    if limit:
        cursor = cursor.limit(int(limit))

    stats = {
        "examined": 0,
        "updated": 0,
        "now_site_ready": 0,
        "still_missing": 0,
        "skipped_no_title": 0,
    }
    ops = []
    try:
        for product in cursor:
            stats["examined"] += 1
            barcode = str(product.get("Barcode") or "").strip()
            title = str(product.get("cms_title") or product.get("Title") or "").strip()
            if not barcode or not title:
                stats["skipped_no_title"] += 1
                continue

            existing_attrs = product.get("attributes") or {}
            new_attrs = build_attributes_block(product, existing_attributes=dict(existing_attrs))

            site_ready = is_site_ready(new_attrs)
            if site_ready:
                stats["now_site_ready"] += 1
            else:
                stats["still_missing"] += 1

            set_updates = {"attributes": new_attrs}
            candidate = dict(product)
            candidate.update(set_updates)
            set_updates.update(
                build_catalog_quality_updates(candidate, evaluator="automation:backfill_attributes")
            )

            ops.append(UpdateOne({"Barcode": barcode}, {"$set": set_updates}))
            stats["updated"] += 1

            if not dry_run and len(ops) >= batch_size:
                db.products.bulk_write(ops, ordered=False)
                ops = []
                if stats["examined"] % 1000 == 0:
                    print(f"  progress examined={stats['examined']} updated={stats['updated']}", flush=True)

        if ops and not dry_run:
            db.products.bulk_write(ops, ordered=False)
    finally:
        cursor.close()
        client.close()

    stats["status_filter"] = status
    stats["dry_run"] = dry_run
    stats["completed_at"] = _utcnow_iso()
    return stats


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--status", choices=["active", "inactive", "all"], default="active")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    stats = run(status=args.status, limit=args.limit, dry_run=args.dry_run)
    print(stats)


if __name__ == "__main__":
    main()
