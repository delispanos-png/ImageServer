"""Brand → L1+L2 fallback assignment for inactive products.

For products whose Title starts with a known brand, assign the brand's
canonical L1 + L2 categories. This is a coarse-grained, brand-level
mapping — every product of brand X gets the same L1+L2. Good enough
for activation; can be refined per-product later.
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import Dict, List, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


EVALUATOR = "automation:brand_fallback"

# Brand → (L1, L2). Only HIGH-CONFIDENCE mappings. Uncertain ones omitted.
# Pattern is regex (case-insensitive) anchored to start of Title.
BRAND_REGISTRY: List[Tuple[str, str, str]] = [
    # (brand_pattern, L1, L2)
    (r"^L['']?\s*OREAL\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^L['']?ORE[ÁA]L\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^MAYBELLINE\b", "ΟΜΟΡΦΙΑ", "ΜΑΚΙΓΙΑΖ"),
    (r"^RADIANT\b", "ΟΜΟΡΦΙΑ", "ΜΑΚΙΓΙΑΖ"),
    (r"^(NYX|ΝΥΧ)\b", "ΟΜΟΡΦΙΑ", "ΜΑΚΙΓΙΑΖ"),
    (r"^MUA\b", "ΟΜΟΡΦΙΑ", "ΜΑΚΙΓΙΑΖ"),
    (r"^ESSIE\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΝΥΧΙΩΝ"),
    (r"^GARNIER\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^NATURA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^WELEDA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^AHAVA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^APIVITA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^KORRES\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^NIVEA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^GARDEN\b", "ΟΜΟΡΦΙΑ", "ΑΡΩΜΑΤΑ"),
    (r"^INVISIBOBBLE\b", "ΟΜΟΡΦΙΑ", "ΑΞΕΣΟΥΑΡ ΜΑΛΛΙΩΝ"),

    # Dermo / skin care
    (r"^FREZYDERM\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^INTERMED\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^PANTHENOL\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^ALFACARE\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^AVENE\b|^AVÈNE\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^LA\s+ROCHE", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^VICHY\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^BIODERMA\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^EUCERIN\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^SCHOLL\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΟΔΙΩΝ"),
    (r"^DUCRAY\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^ROCHE\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),

    # Baby brands
    (r"^MAM\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΑΞΕΣΟΥΑΡ ΒΡΕΦΟΥΣ"),
    (r"^NUK\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΑΞΕΣΟΥΑΡ ΒΡΕΦΟΥΣ"),
    (r"^MUNCHKIN\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΑΞΕΣΟΥΑΡ ΒΡΕΦΟΥΣ"),
    (r"^CHICCO\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΑΞΕΣΟΥΑΡ ΒΡΕΦΟΥΣ"),
    (r"^TOMMEE\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΑΞΕΣΟΥΑΡ ΒΡΕΦΟΥΣ"),
    (r"^MUSTELA\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΒΡΕΦΙΚΗ ΚΑΙ ΠΑΙΔΙΚΗ ΦΡΟΝΤΙΔΑ"),
    (r"^HIPP\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΒΡΕΦΙΚΗ : ΠΑΙΔΙΚΗ ΔΙΑΤΡΟΦΗ"),
    (r"^BABYDERM\b|^BABY DERM\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΒΡΕΦΙΚΗ ΚΑΙ ΠΑΙΔΙΚΗ ΦΡΟΝΤΙΔΑ"),
    (r"^AVENT\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΑΞΕΣΟΥΑΡ ΒΡΕΦΟΥΣ"),

    # Supplements
    (r"^SOLGAR\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^LAMBERTS\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΕΙΔΙΚΑ ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ"),
    (r"^POWER\s+HEALTH\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^PHARMALEAD\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^NATURE['']?S\s+PLUS\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^NOW\s+(FOODS|SPORTS)\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^QUEST\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^METAPHARM\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),
    (r"^VIOGENESIS\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΕΙΔΙΚΑ ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ"),
    (r"^VITABIOTICS\b", "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ", "ΒΙΤΑΜΙΝΕΣ"),

    # Pharmaceutical / medical consumables
    (r"^CHEMCO\b", "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ", "ΔΙΑΦΟΡΑ ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ"),
    (r"^HARTMANN\b", "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ", "ΔΙΑΦΟΡΑ ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ"),
    (r"^DETTOL\b", "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ", "ΑΝΤΙΒΑΚΤΗΡΙΑΚΑ ΠΡΟΪΟΝΤΑ"),

    # Orthopedic
    (r"^ADCO\b", "ΟΡΘΟΠΕΔΙΚΑ", "ΑΝΑΤΟΜΙΚΟΙ ΠΑΤΟΙ"),

    # Personal hygiene / oral
    (r"^BOOBAM\b", "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ", "ΣΤΟΜΑΤΙΚΗ ΦΡΟΝΤΙΔΑ"),
    (r"^ORAL[\s-]?B\b", "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ", "ΣΤΟΜΑΤΙΚΗ ΦΡΟΝΤΙΔΑ"),
    (r"^COLGATE\b", "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ", "ΣΤΟΜΑΤΙΚΗ ΦΡΟΝΤΙΔΑ"),
    (r"^SENSODYNE\b", "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ", "ΣΤΟΜΑΤΙΚΗ ΦΡΟΝΤΙΔΑ"),
    (r"^CHILLY['']?S\b", "ΓΕΝΙΚΑ ΕΙΔΗ", "ΚΟΥΖΙΝΑ ΚΑΙ ΜΠΑΝΙΟ"),
    (r"^ZIPPO\b", "ΓΕΝΙΚΑ ΕΙΔΗ", "ΧΟΜΠΙ"),
    (r"^SEPTONA\b", "ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ", "ΓΙΑ ΤΟ ΜΠΑΝΙΟ"),

    # French dermo / skincare brands
    (r"^CAUDALIE\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^NUXE\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^URIAGE\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^LIERAC\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^KLORANE\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΜΑΛΛΙΩΝ : STYLING"),
    (r"^PHYTO\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΜΑΛΛΙΩΝ : STYLING"),
    (r"^DUCRAY\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),

    # Greek dermo / cosmetics
    (r"^HELENVITA\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^COVERDERM\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^TECNOSKIN\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^ANAPLASIS\b", "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ", "ΠΕΡΙΠΟΙΗΣΗ ΠΡΟΣΩΠΟΥ"),
    (r"^MESSINIAN\s+SPA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^MASTIC\s+SPA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^FRESH\s+LINE\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^AUSTRALIAN\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ"),
    (r"^ERRE\s+DUE\b", "ΟΜΟΡΦΙΑ", "ΜΑΚΙΓΙΑΖ"),

    # Hair
    (r"^WELLA\b", "ΟΜΟΡΦΙΑ", "ΠΕΡΙΠΟΙΗΣΗ ΜΑΛΛΙΩΝ : STYLING"),
    (r"^TANGLE\s+TEEZER\b", "ΟΜΟΡΦΙΑ", "ΑΞΕΣΟΥΑΡ ΜΑΛΛΙΩΝ"),

    # Medical / pharmacy
    (r"^HANSAPLAST\b", "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ", "ΠΡΩΤΕΣ ΒΟΗΘΕΙΕΣ"),
    (r"^PIC\s+SOLUTION\b", "ΦΑΡΜΑΚΕΥΤΙΚΑ ΕΙΔΗ", "ΔΙΑΓΝΩΣΤΙΚΕΣ ΣΥΣΚΕΥΕΣ"),

    # Already-known fixes
    (r"^MUSTELA\b", "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ", "ΒΡΕΦΙΚΗ ΚΑΙ ΠΑΙΔΙΚΗ ΦΡΟΝΤΙΔΑ"),
]

COMPILED = [(re.compile(p, re.I), l1, l2) for p, l1, l2 in BRAND_REGISTRY]


def match_brand(title: str):
    for pattern, l1, l2 in COMPILED:
        if pattern.search(title or ""):
            return (pattern.pattern, l1, l2)
    return None


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--limit", type=int, default=0)
    args = p.parse_args()

    load_dotenv("/app/.env")
    u = os.getenv("MONGO_USER"); pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST","mongodb"); port = int(os.getenv("MONGO_PORT","27017"))
    client = MongoClient(f"mongodb://{u}:{pw}@{host}:{port}")
    db = client[os.getenv("MONGO_DB","imageDB")]

    cursor = db.products.find({"cms_status": "inactive"})
    if args.limit > 0:
        cursor = cursor.limit(args.limit)

    stats = {"examined": 0, "matched_brand": 0, "no_brand_match": 0, "would_activate": 0, "modified": 0}
    per_brand: Dict[str, int] = {}
    ops: List[UpdateOne] = []

    for doc in cursor:
        stats["examined"] += 1
        title = doc.get("Title", "") or ""
        m = match_brand(title)
        if not m:
            stats["no_brand_match"] += 1
            continue
        stats["matched_brand"] += 1
        pat, l1, l2 = m
        per_brand[pat] = per_brand.get(pat, 0) + 1

        existing_c1 = str(doc.get("Category_1", "") or "").strip()
        existing_c2 = str(doc.get("Category_2", "") or "").strip()
        updates = {
            "brand_enrichment_source": EVALUATOR,
            "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
        }
        # Only overwrite if missing — keep existing if any
        if not existing_c1:
            updates["Category_1"] = l1
        if not existing_c2:
            updates["Category_2"] = l2

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
    print("Top matched brands:")
    for pat, c in sorted(per_brand.items(), key=lambda x: -x[1])[:30]:
        print(f"  {c:>4} {pat}")


if __name__ == "__main__":
    main()
