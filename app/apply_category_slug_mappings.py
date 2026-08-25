from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from typing import Dict, List, Optional

from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

from catalog_quality import build_catalog_quality_updates


EVALUATOR = "automation:apply_category_slug_mappings"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Apply slug→canonical mappings to inactive-no-category products.")
    parser.add_argument("--suggestions", default="/app/category_slug_suggestions.json")
    parser.add_argument("--min-score", type=float, default=0.85, help="Apply only suggestions with top_score >= this.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0, help="Optional per-slug limit for testing.")
    parser.add_argument("--include-active", action="store_true", help="Also apply to active products missing categories.")
    return parser.parse_args()


def mongo_db():
    user = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb")
    port = int(os.getenv("MONGO_PORT", "27017"))
    client = MongoClient(f"mongodb://{user}:{password}@{host}:{port}")
    return client, client[os.getenv("MONGO_DB", "imageDB")]


def load_suggestions(path: str, min_score: float) -> List[Dict]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    selected = []
    for entry in data:
        if entry.get("top_score", 0) < min_score:
            continue
        if not entry.get("candidates"):
            continue
        top = entry["candidates"][0]
        selected.append({
            "slug": entry["slug"],
            "path": top["path"],
            "node_ids": top["node_ids"],
            "score": top["score"],
            "depth": top["depth"],
            "product_count": entry["product_count"],
        })
    return selected


def build_query(slug: str, include_active: bool) -> Dict:
    query: Dict = {
        "Categ": slug,
        "catalog_has_category": False,
    }
    if not include_active:
        query["cms_status"] = "inactive"
    return query


def updates_for_path(path: List[str], node_ids: List[str]) -> Dict[str, object]:
    updates: Dict[str, object] = {
        "Category_1": path[0] if len(path) > 0 else "",
        "Category_2": path[1] if len(path) > 1 else "",
        "Category_3": path[2] if len(path) > 2 else "",
        "Category_4": path[3] if len(path) > 3 else "",
        "cms_category_id": ObjectId(node_ids[-1]),
        "category_source": EVALUATOR,
    }
    return updates


def main() -> None:
    args = parse_args()
    load_dotenv("/app/.env")

    selected = load_suggestions(args.suggestions, args.min_score)
    print({"phase": "load_suggestions", "selected": len(selected), "min_score": args.min_score})
    for entry in selected:
        print(f"  {entry['slug']:<35} → {' > '.join(entry['path'])} (score={entry['score']}, products~{entry['product_count']})")

    client, db = mongo_db()
    try:
        overall = {
            "dry_run": args.dry_run,
            "selected_slugs": len(selected),
            "matched_total": 0,
            "modified_total": 0,
            "would_activate_total": 0,
            "still_inactive_total": 0,
            "per_slug": {},
        }

        for entry in selected:
            slug = entry["slug"]
            path = entry["path"]
            node_ids = entry["node_ids"]
            query = build_query(slug, args.include_active)

            cursor = db.products.find(query)
            if args.limit > 0:
                cursor = cursor.limit(args.limit)

            slug_stats = {
                "matched": 0,
                "modified": 0,
                "would_activate": 0,
                "still_inactive": 0,
            }

            operations: List[UpdateOne] = []
            for doc in cursor:
                slug_stats["matched"] += 1
                set_updates = updates_for_path(path, node_ids)
                candidate = dict(doc)
                candidate.update(set_updates)
                set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR))
                new_status = set_updates.get("cms_status")
                if doc.get("cms_status") == "inactive" and new_status == "active":
                    slug_stats["would_activate"] += 1
                elif doc.get("cms_status") == "inactive" and new_status == "inactive":
                    slug_stats["still_inactive"] += 1
                operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": set_updates}, upsert=False))

            if not args.dry_run and operations:
                # Process in batches to avoid 100K BSON limit
                batch_size = 1000
                for i in range(0, len(operations), batch_size):
                    chunk = operations[i:i + batch_size]
                    result = db.products.bulk_write(chunk, ordered=False)
                    slug_stats["modified"] += result.modified_count

            overall["matched_total"] += slug_stats["matched"]
            overall["modified_total"] += slug_stats["modified"]
            overall["would_activate_total"] += slug_stats["would_activate"]
            overall["still_inactive_total"] += slug_stats["still_inactive"]
            overall["per_slug"][slug] = slug_stats
            print(
                f"  {slug:<35} matched={slug_stats['matched']:>5}  would_activate={slug_stats['would_activate']:>5}  still_inactive={slug_stats['still_inactive']:>5}  modified={slug_stats['modified']:>5}"
            )

        print({"summary": overall})
    finally:
        client.close()


if __name__ == "__main__":
    main()
