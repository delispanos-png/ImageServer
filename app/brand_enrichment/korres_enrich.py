"""Korres brand enrichment (Shopify-based, no barcodes in feed).

Korres = Shopify storefront at korres.com (US, English only).
We use /products.json for full catalog; barcodes are not exposed,
so matching is title-based fuzzy.

L1: brand → ΟΜΟΡΦΙΑ
L2: from product_type (manual English→Greek mapping)
L3: from tags (filter_type:* parsed and translated where possible)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


KORRES_PRODUCTS_URL = "https://www.korres.com/products.json"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
BRAND_L1 = "ΟΜΟΡΦΙΑ"
EVALUATOR = "automation:brand_enrichment:korres"
CACHE_PATH = "/app/brand_catalog_korres.json"

PRODUCT_TYPE_TO_L2 = {
    "Body Care": "Σώμα",
    "Skincare": "Πρόσωπο",
    "Skincare Kits": "Πρόσωπο",
    "Hair": "Μαλλιά",
    "Makeup": "Μακιγιάζ",
    "Men": "Άνδρας",
    "Fragrance": "Αρώματα",
    "Pure Greek Olive": "Σώμα",
    "Littles": "Παιδικά",
}
SKIP_PRODUCT_TYPES = {"Gift Cards", "Greened Shipping", "Merch", "Kits"}

FILTER_TYPE_TO_L3 = {
    "Body Oils": "Λάδια Σώματος",
    "Body Creams": "Κρέμες Σώματος",
    "Body Cleansers": "Καθαρισμός Σώματος",
    "Body Scrubs": "Scrub και Απολέπιση Σώματος",
    "Cleansers": "Καθαρισμός Προσώπου",
    "Moisturizers": "Κρέμες Προσώπου",
    "Serums": "Serum",
    "Masks": "Μάσκες Ομορφιάς",
    "Eye Care": "Περιποίηση Ματιών",
    "Lip Care": "Ενυδάτωση Χειλιών - Lip Balm",
    "Shampoos": "Σαμπουάν",
    "Conditioners": "Conditioner Μαλλιών",
    "Hair Treatments": "Μάσκες Μαλλιών",
    "Foundations": "Μακιγιάζ Προσώπου",
    "Lipsticks": "Μακιγιάζ Χειλιών",
    "Mascaras": "Mακιγιάζ Ματιών",
    "Hand Cream": "Περιποίηση Χεριών",
    "Perfumes": "Αρώματα",
    "Eau de Toilette": "Αρώματα",
    "Eau de Parfum": "Αρώματα",
    "Deodorants": "Αποσμητικά",
    "Toners": "Καθαρισμός Προσώπου",
    "Exfoliators": "Scrub Προσώπου",
}

# Phonetic / normalization
GREEKLISH_DIGRAPHS = [
    ("ou", "ου"), ("ai", "αι"), ("ei", "ει"), ("oi", "οι"),
    ("th", "θ"), ("ps", "ψ"), ("ch", "χ"), ("ks", "ξ"),
    ("mp", "μπ"), ("nt", "ντ"), ("gk", "γκ"), ("tz", "τζ"), ("ts", "τσ"),
]
GREEKLISH_LETTERS = {
    "a": "α", "b": "β", "g": "γ", "d": "δ", "e": "ε", "z": "ζ",
    "h": "η", "i": "ι", "k": "κ", "l": "λ", "m": "μ", "n": "ν",
    "x": "ξ", "o": "ο", "p": "π", "r": "ρ", "s": "σ", "t": "τ",
    "y": "υ", "u": "υ", "f": "φ", "v": "β", "w": "ω", "j": "ι", "c": "κ",
}
PHONETIC_FOLDING = str.maketrans({"η": "ι", "υ": "ι", "ω": "ο", "ς": "σ",
                                  "ϊ": "ι", "ΰ": "ι", "ϋ": "ι", "ΐ": "ι"})

SIZE_TOKEN_RE = re.compile(
    r"\b\d+[\s\.,]?\d*\s?(ml|ML|gr|GR|g|G|τεμ|τμχ|caps|tabs|pcs|mg|MG|kg|KG|l|L|oz|fl|fl\.?\s?oz)\b"
)
NOISE_RE = re.compile(r"[/\-,\.():&·•\[\]\"']")


def _curl_json(url: str, params: Dict[str, str]) -> dict:
    pairs = "&".join(f"{k}={v}" for k, v in params.items())
    full = f"{url}?{pairs}" if params else url
    completed = subprocess.run(
        ["curl", "-sL", "-A", USER_AGENT, full, "--max-time", "30"],
        capture_output=True, check=False, timeout=35,
    )
    if completed.returncode != 0:
        raise RuntimeError(f"curl failed: {completed.stderr.decode('utf-8', 'ignore')[:200]}")
    return json.loads(completed.stdout.decode("utf-8"))


def fetch_korres_catalog() -> List[Dict]:
    all_items: List[Dict] = []
    page = 1
    while True:
        data = _curl_json(KORRES_PRODUCTS_URL, {"limit": "250", "page": str(page)})
        items = data.get("products") or []
        print(f"  korres page {page}: {len(items)} products (total {len(all_items) + len(items)})", flush=True)
        if not items:
            break
        all_items.extend(items)
        page += 1
        time.sleep(0.5)
    return _enrich_with_source_url(all_items)


def _enrich_with_source_url(items: List[Dict]) -> List[Dict]:
    for it in items:
        if it.get("source_url"):
            continue
        handle = str(it.get("handle") or "").strip()
        if handle:
            it["source_url"] = f"https://www.korres.com/products/{handle}"
    return items


def load_catalog(force_refresh: bool = False) -> List[Dict]:
    if not force_refresh and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, encoding="utf-8") as f:
            return _enrich_with_source_url(json.load(f))
    items = _enrich_with_source_url(fetch_korres_catalog())
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    return items


def transliterate_greeklish(text: str) -> str:
    text = text.lower()
    for digraph, replacement in GREEKLISH_DIGRAPHS:
        text = text.replace(digraph, replacement)
    return "".join(GREEKLISH_LETTERS.get(ch, ch) for ch in text)


def strip_accents(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")


def normalize_title(title: str) -> set:
    text = (title or "").lower()
    text = text.replace("korres", " ")
    text = SIZE_TOKEN_RE.sub(" ", text)
    text = NOISE_RE.sub(" ", text)
    text = transliterate_greeklish(text)
    text = strip_accents(text)
    text = text.translate(PHONETIC_FOLDING)
    return {tok for tok in text.split() if len(tok) >= 3}


def jaccard_coverage(our: set, brand: set) -> float:
    if not our or not brand:
        return 0.0
    inter = our & brand
    union = our | brand
    j = len(inter) / len(union)
    coverage = len(inter) / len(brand)
    return round(0.6 * j + 0.4 * coverage, 4)


def categories_from_korres(entry: Dict) -> Tuple[str, str]:
    """Return (L2, L3). Empty if can't determine."""
    pt = (entry.get("product_type") or "").strip()
    if pt in SKIP_PRODUCT_TYPES:
        return "", ""
    l2 = PRODUCT_TYPE_TO_L2.get(pt, "")
    l3 = ""
    tags = entry.get("tags") or []
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",")]
    for tag in tags:
        if isinstance(tag, str) and tag.startswith("filter_type:"):
            key = tag.split(":", 1)[1].strip()
            if key in FILTER_TYPE_TO_L3:
                l3 = FILTER_TYPE_TO_L3[key]
                break
    return l2, l3


def build_index(items: List[Dict]) -> List[Dict]:
    index = []
    for it in items:
        title = (it.get("title") or "").strip()
        if not title:
            continue
        tokens = normalize_title(title)
        l2, l3 = categories_from_korres(it)
        handle = (it.get("handle") or "").strip()
        source_url = f"https://www.korres.com/products/{handle}" if handle else ""
        index.append({
            "title": title,
            "handle": handle,
            "source_url": source_url,
            "product_type": it.get("product_type"),
            "tags": it.get("tags"),
            "l2": l2,
            "l3": l3,
            "tokens": tokens,
        })
    return index


def find_best_match(our_title: str, index: List[Dict]) -> Tuple[Optional[Dict], float]:
    our_tokens = normalize_title(our_title)
    best, best_score = None, 0.0
    for entry in index:
        s = jaccard_coverage(our_tokens, entry["tokens"])
        if s > best_score:
            best, best_score = entry, s
    return best, best_score


def confidence_label(score: float) -> str:
    if score >= 0.6:
        return "high"
    if score >= 0.4:
        return "medium"
    if score >= 0.25:
        return "low"
    return "none"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Korres brand enrichment.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--refresh-catalog", action="store_true")
    parser.add_argument("--min-score", type=float, default=0.4)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument(
        "--mode", choices=["inactive", "active-fill", "all"], default="inactive",
    )
    parser.add_argument("--report-path", default="/app/korres_enrichment_report.json")
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

    print({"stage": "load_catalog", "refresh": args.refresh_catalog})
    catalog = load_catalog(force_refresh=args.refresh_catalog)
    print({"stage": "load_catalog", "items": len(catalog)})
    index = build_index(catalog)
    print({"stage": "build_index", "indexed": len(index)})

    client, db = mongo_db()
    try:
        base = {"Title": {"$regex": "KORRES", "$options": "i"}}
        if args.mode == "inactive":
            query = {**base, "cms_status": "inactive", "catalog_has_category": False}
        elif args.mode == "active-fill":
            query = {
                **base,
                "cms_status": "active",
                "$or": [
                    {"Category_2": {"$exists": False}},
                    {"Category_2": ""},
                    {"Category_3": {"$exists": False}},
                    {"Category_3": ""},
                ],
            }
        else:
            query = base

        cursor = db.products.find(query)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)

        stats = {
            "examined": 0,
            "with_l1_only": 0,
            "with_full_match": 0,
            "by_confidence": {"high": 0, "medium": 0, "low": 0, "none": 0},
            "would_activate": 0,
            "modified": 0,
        }
        report_rows: List[Dict] = []
        operations: List[UpdateOne] = []

        for doc in cursor:
            stats["examined"] += 1
            our_title = doc.get("Title", "")
            match, score = find_best_match(our_title, index)
            confidence = confidence_label(score)
            stats["by_confidence"][confidence] = stats["by_confidence"].get(confidence, 0) + 1

            set_updates: Dict[str, object] = {
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }
            if args.mode != "active-fill":
                set_updates["Category_1"] = BRAND_L1

            korres_match_info = None
            if match and score >= args.min_score:
                l2 = match.get("l2") or ""
                l3 = match.get("l3") or ""
                existing_c2 = str(doc.get("Category_2", "") or "").strip()
                existing_c3 = str(doc.get("Category_3", "") or "").strip()
                fill_only = args.mode == "active-fill"
                if l2 and (not fill_only or not existing_c2):
                    set_updates["Category_2"] = l2
                if l3 and (not fill_only or not existing_c3):
                    set_updates["Category_3"] = l3
                korres_match_info = {
                    "title": match.get("title"),
                    "score": score,
                    "product_type": match.get("product_type"),
                    "l2": l2,
                    "l3": l3,
                }
                if l2 or l3:
                    stats["with_full_match"] += 1
                else:
                    stats["with_l1_only"] += 1
            else:
                stats["with_l1_only"] += 1

            candidate = dict(doc)
            candidate.update(set_updates)
            set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR))
            if doc.get("cms_status") == "inactive" and set_updates.get("cms_status") == "active":
                stats["would_activate"] += 1

            report_rows.append({
                "barcode": doc.get("Barcode"),
                "title": our_title[:80],
                "score": score,
                "confidence": confidence,
                "applied_l1": set_updates.get("Category_1"),
                "matched": korres_match_info,
                "result_status": set_updates.get("cms_status"),
            })
            operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": set_updates}, upsert=False))

        if not args.dry_run and operations:
            for i in range(0, len(operations), 500):
                result = db.products.bulk_write(operations[i:i + 500], ordered=False)
                stats["modified"] += result.modified_count

        with open(args.report_path, "w", encoding="utf-8") as f:
            json.dump({"stats": stats, "rows": report_rows[:200]}, f, ensure_ascii=False, indent=2)

        print({"summary": stats, "report": args.report_path})
    finally:
        client.close()


if __name__ == "__main__":
    main()
