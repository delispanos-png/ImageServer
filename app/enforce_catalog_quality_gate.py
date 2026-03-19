from __future__ import annotations

import argparse
import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

from catalog_quality import build_catalog_quality_updates


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Enforce catalog quality gate by classifying products and setting cms_status safely."
    )
    parser.add_argument("--barcode", default="", help="Only process one barcode.")
    parser.add_argument("--limit", type=int, default=0, help="Optional record limit.")
    parser.add_argument("--dry-run", action="store_true", help="Compute results without writing to Mongo.")
    parser.add_argument("--batch-size", type=int, default=500, help="Bulk write batch size.")
    return parser.parse_args()


def build_query(barcode: str) -> Dict[str, Any]:
    if barcode:
        return {"Barcode": barcode}
    return {}


def summarize_transition(before_status: str, after_status: str) -> str:
    if before_status == after_status:
        return "unchanged"
    return f"{before_status}->{after_status}"


def main() -> None:
    args = parse_args()
    load_dotenv()

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}"
    client = MongoClient(mongo_uri)
    db = client[mongo_db]

    cursor = None
    try:
        query = build_query(args.barcode.strip())
        total_matching = db.products.count_documents(query)
        cursor = db.products.find(query, no_cursor_timeout=True)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)

        summary = {
            "success": True,
            "dry_run": args.dry_run,
            "examined": 0,
            "total_matching": total_matching,
            "status_transitions": {},
            "quality_states": {},
            "ready_for_review": 0,
            "needs_fix": 0,
            "ready": 0,
            "modified_candidates": 0,
            "batch_size": max(1, args.batch_size),
        }

        modified_candidates = 0
        operations: List[UpdateOne] = []
        matched_count = 0
        modified_count = 0
        batch_size = max(1, args.batch_size)

        for record in cursor:
            summary["examined"] += 1
            barcode = str(record.get("Barcode", "")).strip()
            before_status = str(record.get("cms_status", "")).strip() or "active"
            updates = build_catalog_quality_updates(
                record,
                evaluator="batch:enforce_catalog_quality_gate",
            )
            after_status = str(updates.get("cms_status", before_status)).strip() or before_status
            transition = summarize_transition(before_status, after_status)
            quality_state = str(updates.get("catalog_quality_state", "")).strip() or "unknown"

            summary["status_transitions"][transition] = summary["status_transitions"].get(transition, 0) + 1
            summary["quality_states"][quality_state] = summary["quality_states"].get(quality_state, 0) + 1

            if quality_state == "needs_fix":
                summary["needs_fix"] += 1
            elif quality_state == "ready_for_review":
                summary["ready_for_review"] += 1
            elif quality_state == "ready":
                summary["ready"] += 1

            changes_detected = any(record.get(field) != value for field, value in updates.items())
            if changes_detected:
                modified_candidates += 1

            if args.dry_run:
                if barcode and len(summary.get("sample", [])) < 5:
                    summary.setdefault("sample", []).append(
                        {
                            "barcode": barcode,
                            "before_status": before_status,
                            "after_status": after_status,
                            "quality_state": quality_state,
                            "missing_requirements": updates.get("catalog_missing_requirements", []),
                        }
                    )
                continue

            if changes_detected:
                operations.append(UpdateOne({"_id": record["_id"]}, {"$set": updates}, upsert=False))
            if barcode and len(summary.get("sample", [])) < 5:
                summary.setdefault("sample", []).append(
                    {
                        "barcode": barcode,
                        "before_status": before_status,
                        "after_status": after_status,
                        "quality_state": quality_state,
                        "missing_requirements": updates.get("catalog_missing_requirements", []),
                    }
                )

            if len(operations) >= batch_size:
                result = db.products.bulk_write(operations, ordered=False)
                matched_count += result.matched_count
                modified_count += result.modified_count
                print(
                    {
                        "progress": summary["examined"],
                        "matched_so_far": matched_count,
                        "modified_so_far": modified_count,
                    },
                    flush=True,
                )
                operations = []

        summary["modified_candidates"] = modified_candidates

        if args.dry_run:
            print(summary)
            return

        if operations:
            result = db.products.bulk_write(operations, ordered=False)
            matched_count += result.matched_count
            modified_count += result.modified_count
            print(
                {
                    "progress": summary["examined"],
                    "matched_so_far": matched_count,
                    "modified_so_far": modified_count,
                },
                flush=True,
            )

        summary["matched_count"] = matched_count
        summary["modified_count"] = modified_count
        print(summary)
    finally:
        try:
            cursor.close()
        except Exception:
            pass
        client.close()


if __name__ == "__main__":
    main()
