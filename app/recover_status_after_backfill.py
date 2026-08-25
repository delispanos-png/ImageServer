"""Recover cms_status that was wrongly set to inactive by a backfill run
that used an incomplete projection. Re-evaluate every product affected
by 'automation:backfill_attributes' against its FULL document.
"""
from __future__ import annotations

import os
from typing import Dict

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

from catalog_quality import build_catalog_quality_updates


def run() -> Dict[str, int]:
    load_dotenv("/app/.env")
    client = MongoClient(
        f"mongodb://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASSWORD')}"
        f"@{os.getenv('MONGO_HOST', 'mongodb')}:{os.getenv('MONGO_PORT', '27017')}"
    )
    db = client[os.getenv("MONGO_DB", "imageDB")]

    stats = {"examined": 0, "restored_active": 0, "stayed_inactive": 0, "noop": 0}
    ops = []
    cursor = db.products.find(
        {"catalog_last_evaluated_by": "automation:backfill_attributes"},
        no_cursor_timeout=True,
    )
    try:
        for product in cursor:
            stats["examined"] += 1
            current_status = str(product.get("cms_status") or "").strip().lower()
            updates = build_catalog_quality_updates(product, evaluator="automation:recover_backfill")
            new_status = str(updates.get("cms_status") or "").strip().lower()
            if new_status == current_status:
                stats["noop"] += 1
            elif new_status == "active" and current_status == "inactive":
                stats["restored_active"] += 1
            else:
                stats["stayed_inactive"] += 1
            ops.append(UpdateOne({"Barcode": product["Barcode"]}, {"$set": updates}))
            if len(ops) >= 500:
                db.products.bulk_write(ops, ordered=False)
                ops = []
                if stats["examined"] % 5000 == 0:
                    print(f"  progress examined={stats['examined']} restored={stats['restored_active']}", flush=True)
        if ops:
            db.products.bulk_write(ops, ordered=False)
    finally:
        cursor.close()
        client.close()
    return stats


if __name__ == "__main__":
    print(run())
