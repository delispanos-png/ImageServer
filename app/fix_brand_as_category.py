"""One-off fix: move brand names that ended up in Category_1 to the Brand field.

Mapping: brand → canonical L1 category. Keeps existing C2/C3 intact when present.
"""

import os
import sys
from datetime import datetime, timezone
from typing import Dict

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402

load_dotenv("/app/.env")

# brand → canonical L1 category for products mistakenly tagged with brand-as-C1
BRAND_TO_CANONICAL_L1: Dict[str, str] = {
    "Bioderma": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Avene": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Avène": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Vichy": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "La Roche-Posay": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Eucerin": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Nuxe": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Caudalie": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Uriage": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Lierac": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Klorane": "ΟΜΟΡΦΙΑ",
    "Phyto": "ΟΜΟΡΦΙΑ",
    "Mustela": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "Ducray": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Sebamed": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Helenvita": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Apivita": "ΟΜΟΡΦΙΑ",
    "Korres": "ΟΜΟΡΦΙΑ",
    "Frezyderm": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Intermed": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Nivea": "ΟΜΟΡΦΙΑ",
    "Garnier": "ΟΜΟΡΦΙΑ",
    "Solgar": "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ",
    "Lamberts": "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ",
    "Chicco": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "NUK": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "MAM": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "Munchkin": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "Hartmann": "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ",
    "Hansaplast": "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ",
    "Scholl": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "HIPP": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "Avent": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
    "Coverderm": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
    "Weleda": "ΟΜΟΡΦΙΑ",
    "Ahava": "ΟΜΟΡΦΙΑ",
    "Essie": "ΟΜΟΡΦΙΑ",
    "NYX": "ΟΜΟΡΦΙΑ",
    "Radiant": "ΟΜΟΡΦΙΑ",
    "MUA": "ΟΜΟΡΦΙΑ",
    "Boobam": "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ",
}


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    user = os.getenv("MONGO_USER")
    pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb")
    port = int(os.getenv("MONGO_PORT", "27017"))
    client = MongoClient(f"mongodb://{user}:{pw}@{host}:{port}")
    db = client[os.getenv("MONGO_DB", "imageDB")]

    now = datetime.now(timezone.utc).isoformat()
    stats = {"examined": 0, "fixed": 0, "by_brand": {}}
    ops = []

    for brand_value, canonical_l1 in BRAND_TO_CANONICAL_L1.items():
        cursor = db.products.find({"Category_1": brand_value})
        for doc in cursor:
            stats["examined"] += 1
            stats["by_brand"][brand_value] = stats["by_brand"].get(brand_value, 0) + 1

            updates = {
                "Category_1": canonical_l1,
                "cms_updated_at": now,
                "category_fix_source": "automation:fix_brand_as_category",
                "category_fix_at": now,
            }
            # Set Brand field if missing
            existing_brand = str(doc.get("Brand", "") or "").strip()
            if not existing_brand:
                updates["Brand"] = brand_value
                updates["cms_brand"] = brand_value

            candidate = dict(doc)
            candidate.update(updates)
            updates.update(build_catalog_quality_updates(candidate, evaluator="automation:fix_brand_as_category"))
            ops.append(UpdateOne({"_id": doc["_id"]}, {"$set": updates}, upsert=False))

    if args.dry_run:
        print({"dry_run": True, **stats})
        return

    if ops:
        for i in range(0, len(ops), 500):
            r = db.products.bulk_write(ops[i:i + 500], ordered=False)
            stats["fixed"] += r.modified_count
    print({"dry_run": False, **stats})


if __name__ == "__main__":
    main()
