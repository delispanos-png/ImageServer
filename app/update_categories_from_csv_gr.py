"""Apply Greek-categorized CSV from Pharmacy295.

The CSV has 4 levels. ~54% of rows already have Greek L1; the rest
have English L1 which we map to canonical Greek L1 categories.
L2-L4 are passed through as-is (mixed Greek/English).
"""

from __future__ import annotations

import argparse
import csv
import os
import re
import sys
from collections import OrderedDict
from datetime import datetime, timezone
from typing import Dict, List, Optional

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


DEFAULT_CSV_PATH = "/app/Pharmacy295_products_gr.csv"
EVALUATOR = "automation:update_categories_from_csv_gr"
BARCODE_DIGITS = re.compile(r"\d")
GREEK_RE = re.compile(r"[Ͱ-Ͽἀ-῿]")

# English L1 → canonical Greek L1
ENGLISH_L1_TO_GREEK = {
    "FOOD SUPPL. & VITAMIN": "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ",
    "TOILETR & PERSONAL CARE": "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ",
    "PHARMACEUTICALS": "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ",
    "MEDICAL": "ΙΑΤΡΙΚΑ ΕΙΔΗ",
    "GENERAL MERCHANDISE": "ΓΕΝΙΚΑ ΕΙΔΗ",
    "OPTICS": "ΟΠΤΙΚΑ",
    "ATHLETICS": "ΑΘΛΗΤΙΚΑ ΕΙΔΗ",
    "FOOD": "ΔΙΑΤΡΟΦΗ",
    "DIETETICS": "ΔΙΑΤΡΟΦΗ",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Apply Pharmacy295 Greek CSV categories to MongoDB products.")
    parser.add_argument("--csv", default=DEFAULT_CSV_PATH)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--mode", choices=["inactive", "active-fill", "all"], default="inactive",
                        help="inactive: only products missing C2. active-fill: active with missing L2/L3.")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--batch-size", type=int, default=500)
    return parser.parse_args()


def _clean_barcode(value: Optional[str]) -> str:
    return "".join(BARCODE_DIGITS.findall(value or ""))


def _barcode_variants(barcode: str) -> List[str]:
    if not barcode:
        return []
    out = [barcode]
    stripped = barcode.lstrip("0")
    if stripped and stripped != barcode:
        out.append(stripped)
    return out


def map_l1(value: str) -> str:
    raw = (value or "").strip()
    if not raw:
        return ""
    if GREEK_RE.search(raw):
        return raw
    return ENGLISH_L1_TO_GREEK.get(raw, raw)


def load_csv(path: str) -> Dict[str, Dict[str, str]]:
    """Return barcode → row mapping. Barcode normalized to digits."""
    lookup: "OrderedDict[str, Dict[str, str]]" = OrderedDict()
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for raw in reader:
            row: Dict[str, str] = {}
            for key, value in raw.items():
                clean_key = (key or "").lstrip("﻿").strip()
                row[clean_key] = value
            barcode = _clean_barcode(row.get("barcode"))
            if not barcode:
                continue
            l1 = map_l1(row.get("category_level1") or "")
            l2 = (row.get("category_level2") or "").strip()
            l3 = (row.get("category_level3") or "").strip()
            l4 = (row.get("category_level4") or "").strip()
            lookup[barcode] = {
                "barcode": barcode,
                "l1": l1,
                "l2": l2,
                "l3": l3,
                "l4": l4,
            }
    return lookup


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

    lookup = load_csv(args.csv)
    print({"stage": "csv_loaded", "rows": len(lookup)})

    # Pre-compute variant → barcode (canonical)
    variant_to_barcode: Dict[str, str] = {}
    for bc in lookup.keys():
        for variant in _barcode_variants(bc):
            variant_to_barcode.setdefault(variant, bc)
    variants = list(variant_to_barcode.keys())

    client, db = mongo_db()
    try:
        base_q: Dict = {"Barcode": {"$in": variants}}
        if args.mode == "inactive":
            base_q["cms_status"] = "inactive"
        elif args.mode == "active-fill":
            base_q["cms_status"] = "active"
            base_q["$or"] = [
                {"Category_2": {"$exists": False}},
                {"Category_2": ""},
                {"Category_3": {"$exists": False}},
                {"Category_3": ""},
            ]

        total = db.products.count_documents(base_q)
        print({"stage": "mongo_scope", "total": total})

        cursor = db.products.find(base_q)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)

        stats = {
            "examined": 0,
            "matched_csv": 0,
            "no_csv_row": 0,
            "would_activate": 0,
            "stays_inactive": 0,
            "modified": 0,
        }
        l1_distribution: Dict[str, int] = {}
        operations: List[UpdateOne] = []

        for doc in cursor:
            stats["examined"] += 1
            barcode_value = str(doc.get("Barcode", "") or "")
            canonical = variant_to_barcode.get(barcode_value)
            row = lookup.get(canonical) if canonical else None
            if not row:
                stats["no_csv_row"] += 1
                continue
            stats["matched_csv"] += 1

            set_updates: Dict[str, object] = {
                "category_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }
            fill_only = args.mode == "active-fill"
            existing_c1 = str(doc.get("Category_1", "") or "").strip()
            existing_c2 = str(doc.get("Category_2", "") or "").strip()
            existing_c3 = str(doc.get("Category_3", "") or "").strip()
            existing_c4 = str(doc.get("Category_4", "") or "").strip()
            if row["l1"] and (not fill_only or not existing_c1):
                set_updates["Category_1"] = row["l1"]
            if row["l2"] and (not fill_only or not existing_c2):
                set_updates["Category_2"] = row["l2"]
            if row["l3"] and (not fill_only or not existing_c3):
                set_updates["Category_3"] = row["l3"]
            if row["l4"] and (not fill_only or not existing_c4):
                set_updates["Category_4"] = row["l4"]

            candidate = dict(doc)
            candidate.update(set_updates)
            set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR))

            if doc.get("cms_status") == "inactive" and set_updates.get("cms_status") == "active":
                stats["would_activate"] += 1
            elif doc.get("cms_status") == "inactive" and set_updates.get("cms_status") == "inactive":
                stats["stays_inactive"] += 1

            l1_used = set_updates.get("Category_1") or existing_c1
            if l1_used:
                l1_distribution[l1_used] = l1_distribution.get(l1_used, 0) + 1

            operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": set_updates}, upsert=False))

            if len(operations) >= args.batch_size:
                if not args.dry_run:
                    result = db.products.bulk_write(operations, ordered=False)
                    stats["modified"] += result.modified_count
                operations.clear()
                if stats["examined"] % (args.batch_size * 5) == 0:
                    print({"progress": stats["examined"], "total": total, "would_activate": stats["would_activate"]}, flush=True)

        if operations and not args.dry_run:
            result = db.products.bulk_write(operations, ordered=False)
            stats["modified"] += result.modified_count

        print({"summary": stats, "l1_distribution": l1_distribution})
    finally:
        client.close()


if __name__ == "__main__":
    main()
