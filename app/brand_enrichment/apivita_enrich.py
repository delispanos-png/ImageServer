"""Apivita brand enrichment POC.

Two-stage:
  Stage 1 (deterministic): all products with Title containing "APIVITA"
                            → Category_1 = ΟΜΟΡΦΙΑ
  Stage 2 (fuzzy):          best-match against apivita.com catalog
                            → Category_2/3 from manufacturer's own taxonomy

Stage 1 happens regardless of Stage 2 success — never lose L1.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import unicodedata
import urllib.request
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


APIVITA_GRAPHQL_URL = "https://www.apivita.com/graphql"
APIVITA_STORE = "hellas"
APIVITA_BRAND_TITLE_REGEX = re.compile(r"\bAPIVITA\b", re.IGNORECASE)
BRAND_L1 = "ΟΜΟΡΦΙΑ"
EVALUATOR = "automation:brand_enrichment:apivita"
CACHE_PATH = "/app/brand_catalog_apivita.json"

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
    r"\b\d+[\s\.,]?\d*\s?(ml|ML|gr|GR|g|G|τεμ|τεμάχια|τμχ|caps|tabs|pcs|mg|MG|kg|KG|l|L)\b"
)
NOISE_RE = re.compile(r"[/\-,\.():&·•\[\]\"']")


import subprocess

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def fetch_apivita_catalog() -> List[Dict]:
    """Page through GraphQL and return all products."""
    all_items: List[Dict] = []
    page = 1
    while True:
        query = (
            "{ products(search: \"\", pageSize: 50, currentPage: "
            + str(page)
            + ") { total_count items { name sku url_key categories { name url_path level } image { url } media_gallery { url label } } } }"
        )
        body = json.dumps({"query": query})
        completed = subprocess.run(
            [
                "curl", "-s", "-X", "POST", APIVITA_GRAPHQL_URL,
                "-H", "Content-Type: application/json",
                "-H", f"Store: {APIVITA_STORE}",
                "-H", f"User-Agent: {USER_AGENT}",
                "-d", body, "--max-time", "30",
            ],
            capture_output=True, check=False, timeout=35,
        )
        if completed.returncode != 0:
            raise RuntimeError(f"curl failed: {completed.stderr.decode('utf-8', 'ignore')[:200]}")
        try:
            data = json.loads(completed.stdout.decode("utf-8"))
        except Exception as e:
            raise RuntimeError(f"json parse error: {e}; first 200 chars: {completed.stdout[:200]!r}")

        products = (data.get("data") or {}).get("products") or {}
        items = products.get("items") or []
        total = products.get("total_count") or 0
        all_items.extend(items)
        print(f"  page {page}: got {len(items)} items (total so far {len(all_items)}/{total})", flush=True)
        if not items or len(all_items) >= total:
            break
        page += 1
        time.sleep(0.5)
    return all_items


def load_catalog(force_refresh: bool = False) -> List[Dict]:
    if not force_refresh and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, encoding="utf-8") as f:
            return json.load(f)
    items = fetch_apivita_catalog()
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


def normalize_title(title: str) -> Tuple[str, set]:
    """Return (normalized_string, token_set)."""
    text = (title or "").lower()
    text = text.replace("apivita", " ")
    text = SIZE_TOKEN_RE.sub(" ", text)
    text = NOISE_RE.sub(" ", text)
    text = transliterate_greeklish(text)
    text = strip_accents(text)
    text = text.translate(PHONETIC_FOLDING)
    tokens = {tok for tok in text.split() if len(tok) >= 3}
    return text.strip(), tokens


def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = a & b
    union = a | b
    return len(inter) / len(union)


def match_score(our_tokens: set, brand_tokens: set) -> float:
    if not our_tokens or not brand_tokens:
        return 0.0
    j = jaccard(our_tokens, brand_tokens)
    coverage = len(our_tokens & brand_tokens) / len(brand_tokens)  # how much of brand title covered
    return round(0.6 * j + 0.4 * coverage, 4)


def find_best_match(our_title: str, brand_index: List[Dict]) -> Tuple[Optional[Dict], float]:
    _, our_tokens = normalize_title(our_title)
    best = None
    best_score = 0.0
    for entry in brand_index:
        score = match_score(our_tokens, entry["tokens"])
        if score > best_score:
            best = entry
            best_score = score
    return best, best_score


def build_brand_index(items: List[Dict]) -> List[Dict]:
    index = []
    for it in items:
        name = (it.get("name") or "").strip()
        if not name:
            continue
        _, tokens = normalize_title(name)
        cats = it.get("categories") or []
        cats_sorted = sorted(cats, key=lambda c: c.get("level", 0))
        url_key = (it.get("url_key") or "").strip()
        source_url = f"https://www.apivita.com/{url_key}.html" if url_key else ""
        index.append({
            "name": name,
            "sku": it.get("sku"),
            "url_key": url_key,
            "source_url": source_url,
            "categories": cats_sorted,
            "image": (it.get("image") or {}).get("url"),
            "tokens": tokens,
        })
    return index


def categories_from_apivita(entry: Dict) -> Tuple[str, str, str]:
    """Return (cat2, cat3, cat4) — L1 always comes from brand registry separately."""
    cats = entry.get("categories") or []
    # Levels in Magento: 1=root, 2=L1 site nav, 3=L2, 4=L3
    # We treat level 2 as our Category_2, level 3 as our Category_3, level 4 as Category_4
    cat_by_level = {c.get("level"): c.get("name") for c in cats if c.get("name")}
    cat2 = cat_by_level.get(2, "")
    cat3 = cat_by_level.get(3, "")
    cat4 = cat_by_level.get(4, "")
    return cat2, cat3, cat4


def confidence_label(score: float) -> str:
    if score >= 0.6:
        return "high"
    if score >= 0.4:
        return "medium"
    if score >= 0.25:
        return "low"
    return "none"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Apivita brand enrichment: L1 from brand, L2/L3 fuzzy from apivita.com.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--refresh-catalog", action="store_true", help="Force re-fetch from GraphQL.")
    parser.add_argument("--min-score", type=float, default=0.4, help="Threshold for accepting L2/L3 from fuzzy match.")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument(
        "--mode", choices=["inactive", "active-fill", "all"], default="inactive",
        help="inactive: enrich inactive-no-category. active-fill: active products missing L2/L3.",
    )
    parser.add_argument("--report-path", default="/app/apivita_enrichment_report.json")
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

    print({"stage": "load_apivita_catalog", "refresh": args.refresh_catalog})
    catalog = load_catalog(force_refresh=args.refresh_catalog)
    print({"stage": "load_apivita_catalog", "items": len(catalog)})
    brand_index = build_brand_index(catalog)
    print({"stage": "build_index", "indexed": len(brand_index)})

    client, db = mongo_db()
    try:
        base = {"Title": {"$regex": "APIVITA", "$options": "i"}}
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
            match, score = find_best_match(our_title, brand_index)
            confidence = confidence_label(score)
            stats["by_confidence"][confidence] = stats["by_confidence"].get(confidence, 0) + 1

            set_updates: Dict[str, object] = {
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }

            # In inactive mode, always set L1. In active-fill mode, never touch L1.
            if args.mode != "active-fill":
                set_updates["Category_1"] = BRAND_L1

            apivita_match_info = None
            if match and score >= args.min_score:
                cat2, cat3, cat4 = categories_from_apivita(match)
                existing_c2 = str(doc.get("Category_2", "") or "").strip()
                existing_c3 = str(doc.get("Category_3", "") or "").strip()
                existing_c4 = str(doc.get("Category_4", "") or "").strip()
                # In active-fill mode, only fill empty slots; never overwrite.
                fill_only = args.mode == "active-fill"
                if cat2 and (not fill_only or not existing_c2):
                    set_updates["Category_2"] = cat2
                if cat3 and (not fill_only or not existing_c3):
                    set_updates["Category_3"] = cat3
                if cat4 and (not fill_only or not existing_c4):
                    set_updates["Category_4"] = cat4
                apivita_match_info = {
                    "sku": match.get("sku"),
                    "name": match.get("name"),
                    "score": score,
                    "categories": [(c.get("level"), c.get("name")) for c in match.get("categories", [])],
                }
                stats["with_full_match"] += 1
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
                "applied_l1": BRAND_L1,
                "matched_apivita": apivita_match_info,
                "result_status": set_updates.get("cms_status"),
            })

            operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": set_updates}, upsert=False))

        if not args.dry_run and operations:
            batch = 500
            for i in range(0, len(operations), batch):
                result = db.products.bulk_write(operations[i:i + batch], ordered=False)
                stats["modified"] += result.modified_count

        with open(args.report_path, "w", encoding="utf-8") as f:
            json.dump({"stats": stats, "rows": report_rows[:200]}, f, ensure_ascii=False, indent=2)

        print({"summary": stats, "report": args.report_path})
    finally:
        client.close()


if __name__ == "__main__":
    main()
