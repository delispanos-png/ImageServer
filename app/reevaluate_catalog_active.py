"""Re-evaluate all active products against current catalog_quality rules.

Use this after a rule change in catalog_quality.py to enforce the
new policy across existing documents. Products no longer meeting
requirements get cms_status flipped to "inactive" via the standard
quality gate.
"""

from __future__ import annotations

import argparse
import os
import sys
from typing import Dict, List

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


EVALUATOR = "automation:reevaluate_catalog_active"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Re-evaluate active products against current catalog_quality rules.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--batch-size", type=int, default=500)
    parser.add_argument("--scope", choices=["active", "all"], default="active",
                        help="active: only currently-active products. all: every product.")
    return parser.parse_args()


def mongo_db():
    user = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb")
    port = int(os.getenv("MONGO_PORT", "27017"))
    client = MongoClient(f"mongodb://{user}:{password}@{host}:{port}")
    return client, client[os.getenv("MONGO_DB", "imageDB")]


def main() -> None:
    args = parse_args()
    load_dotenv("/app/.env")

    client, db = mongo_db()
    try:
        query: Dict = {} if args.scope == "all" else {"cms_status": "active"}
        total = db.products.count_documents(query)
        print({"phase": "start", "scope": args.scope, "total": total, "dry_run": args.dry_run})

        cursor = db.products.find(query)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)

        stats = {
            "examined": 0,
            "stays_active": 0,
            "becomes_inactive": 0,
            "stays_inactive": 0,
            "becomes_active": 0,
            "modified": 0,
            "by_reason": {},
        }
        operations: List[UpdateOne] = []

        for doc in cursor:
            stats["examined"] += 1
            old_status = doc.get("cms_status")
            updates = build_catalog_quality_updates(doc, evaluator=EVALUATOR)
            new_status = updates.get("cms_status")

            if old_status == "active" and new_status == "active":
                stats["stays_active"] += 1
            elif old_status == "active" and new_status == "inactive":
                stats["becomes_inactive"] += 1
                missing = updates.get("catalog_missing_requirements") or []
                for r in missing:
                    stats["by_reason"][r] = stats["by_reason"].get(r, 0) + 1
            elif old_status == "inactive" and new_status == "inactive":
                stats["stays_inactive"] += 1
            elif old_status == "inactive" and new_status == "active":
                stats["becomes_active"] += 1

            operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": updates}, upsert=False))

            if len(operations) >= args.batch_size:
                if not args.dry_run:
                    result = db.products.bulk_write(operations, ordered=False)
                    stats["modified"] += result.modified_count
                operations.clear()
                if stats["examined"] % (args.batch_size * 10) == 0:
                    print({"progress": stats["examined"], "total": total}, flush=True)

        if operations and not args.dry_run:
            result = db.products.bulk_write(operations, ordered=False)
            stats["modified"] += result.modified_count

        print({"summary": stats})
    finally:
        client.close()


if __name__ == "__main__":
    main()
