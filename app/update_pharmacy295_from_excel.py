from __future__ import annotations

from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
import argparse
import os

from pharmacy295_lookup import get_pharmacy295_lookup


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sync pharmacy295 photo feed from Excel into Mongo products.Other_Sites."
    )
    parser.add_argument("--dry-run", action="store_true", help="Print counts without writing to Mongo.")
    parser.add_argument("--limit", type=int, default=0, help="Optional limit for testing.")
    parser.add_argument("--batch-size", type=int, default=1000, help="Bulk write batch size.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    load_dotenv()

    lookup = get_pharmacy295_lookup(force_reload=True)
    if not lookup:
        print({"success": False, "error": "No pharmacy295 Excel feed loaded."})
        return

    rows_with_images = {
        barcode: row
        for barcode, row in lookup.items()
        if row.image_urls
    }

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "localhost")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    client = MongoClient(f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}")
    db = client[mongo_db]

    barcodes = list(rows_with_images.keys())
    if args.limit > 0:
        barcodes = barcodes[: args.limit]

    matched_existing = db.products.count_documents({"Barcode": {"$in": barcodes}})
    summary = {
        "success": True,
        "excel_rows_total": len(lookup),
        "excel_rows_with_images": len(rows_with_images),
        "barcodes_selected": len(barcodes),
        "matched_existing_products": matched_existing,
        "dry_run": args.dry_run,
        "batch_size": args.batch_size,
    }
    if args.dry_run or not barcodes:
        print(summary)
        return

    total_matched = 0
    total_modified = 0
    batch_size = max(1, args.batch_size)

    for offset in range(0, len(barcodes), batch_size):
        chunk = barcodes[offset : offset + batch_size]
        operations = []
        for barcode in chunk:
            row = rows_with_images[barcode]
            category_1, category_2, category_3 = row.category_levels
            product_link = f"https://www.pharmacy295.gr/search-results?query={barcode}"
            operations.append(
                UpdateOne(
                    {"Barcode": barcode},
                    {
                        "$set": {
                            "Other_Sites.pharmacy295_excel": {
                                "Title": row.product_name,
                                "Img_src": row.image_urls[0],
                                "Img_src_List": list(row.image_urls),
                                "Product_Link": product_link,
                                "Category_1": category_1,
                                "Category_2": category_2,
                                "Category_3": category_3,
                                "Category_name": row.category_name,
                                "Source_Sheets": list(row.source_sheets),
                            }
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

    summary.update({"matched_count": total_matched, "modified_count": total_modified})
    print(summary)


if __name__ == "__main__":
    main()
