from __future__ import annotations

from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
import argparse
import os

from category_lookup import get_category_lookup


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Update Mongo product categories from Excel barcode mapping.")
    parser.add_argument("--dry-run", action="store_true", help="Print counts without writing to Mongo.")
    parser.add_argument("--limit", type=int, default=0, help="Optional limit for testing.")
    parser.add_argument("--batch-size", type=int, default=1000, help="Bulk write batch size.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    load_dotenv()

    lookup = get_category_lookup(force_reload=True)
    total_rows = len(lookup)
    if not lookup:
        print({"success": False, "error": "No category Excel mapping loaded."})
        return

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "localhost")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    client = MongoClient(f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}")
    db = client[mongo_db]

    barcodes = list(lookup.keys())
    if args.limit > 0:
        barcodes = barcodes[: args.limit]

    matched_existing = db.products.count_documents({"Barcode": {"$in": barcodes}})

    result_summary = {
        "success": True,
        "excel_rows": total_rows,
        "barcodes_selected": len(barcodes),
        "matched_existing_products": matched_existing,
        "dry_run": args.dry_run,
        "batch_size": args.batch_size,
    }

    if args.dry_run or not barcodes:
        print(result_summary)
        return

    total_matched = 0
    total_modified = 0
    for offset in range(0, len(barcodes), max(1, args.batch_size)):
        chunk = barcodes[offset : offset + max(1, args.batch_size)]
        operations = []
        for barcode in chunk:
            row = lookup[barcode]
            operations.append(
                UpdateOne(
                    {"Barcode": barcode},
                    {
                        "$set": {
                            "Category_1": row.category_1,
                            "Category_2": row.category_2,
                            "Category_3": row.category_3,
                        }
                    },
                    upsert=False,
                )
            )
        bulk_result = db.products.bulk_write(operations, ordered=False)
        total_matched += bulk_result.matched_count
        total_modified += bulk_result.modified_count
        print(
            {
                "progress": offset + len(chunk),
                "total": len(barcodes),
                "matched_so_far": total_matched,
                "modified_so_far": total_modified,
            },
            flush=True,
        )

    result_summary.update({"matched_count": total_matched, "modified_count": total_modified})
    print(result_summary)


if __name__ == "__main__":
    main()
