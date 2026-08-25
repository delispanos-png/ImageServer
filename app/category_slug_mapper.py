from __future__ import annotations

import argparse
import json
import os
import re
import sys
import unicodedata
from collections import OrderedDict
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient


GREEKLISH_DIGRAPHS = OrderedDict(
    [
        ("ou", "ου"),
        ("ai", "αι"),
        ("ei", "ει"),
        ("oi", "οι"),
        ("th", "θ"),
        ("ps", "ψ"),
        ("ch", "χ"),
        ("ks", "ξ"),
        ("mp", "μπ"),
        ("nt", "ντ"),
        ("gk", "γκ"),
        ("tz", "τζ"),
        ("ts", "τσ"),
    ]
)

GREEKLISH_LETTERS = {
    "a": "α", "b": "β", "g": "γ", "d": "δ", "e": "ε", "z": "ζ",
    "h": "η", "i": "ι", "k": "κ", "l": "λ", "m": "μ", "n": "ν",
    "x": "ξ", "o": "ο", "p": "π", "r": "ρ", "s": "σ", "t": "τ",
    "y": "υ", "u": "υ", "f": "φ", "v": "β", "w": "ω", "j": "ι",
    "c": "κ",
}

STOPWORDS = {"και", "with", "για", "η", "ο", "το", "ως", "&", "-"}

# Collapse phonetically-equivalent Greek letters so Greeklish→Greek doesn't
# fail when the original transliteration picks the wrong homophone (η vs ι vs υ etc.).
PHONETIC_FOLDING = str.maketrans({
    "η": "ι", "υ": "ι", "ω": "ο", "ς": "σ",
    "ϊ": "ι", "ΰ": "ι", "ϋ": "ι", "ΐ": "ι",
})


def strip_accents(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")


def phonetic_fold(text: str) -> str:
    text = text.replace("ει", "ι").replace("αι", "ε").replace("οι", "ι")
    return text.translate(PHONETIC_FOLDING)


def transliterate_greeklish(text: str) -> str:
    text = text.lower()
    for digraph, replacement in GREEKLISH_DIGRAPHS.items():
        text = text.replace(digraph, replacement)
    output: List[str] = []
    for ch in text:
        if ch in GREEKLISH_LETTERS:
            output.append(GREEKLISH_LETTERS[ch])
        else:
            output.append(ch)
    return "".join(output)


def tokenize(text: str) -> List[str]:
    text = strip_accents((text or "").lower())
    text = phonetic_fold(text)
    tokens = re.split(r"[\s/_\-:&,\.()]+", text)
    return [tok for tok in tokens if tok and tok not in STOPWORDS]


def slug_tokens(slug: str) -> List[str]:
    greek = transliterate_greeklish(slug)
    return tokenize(greek)


def canonical_tokens(path: List[str]) -> List[str]:
    tokens: List[str] = []
    for name in path:
        tokens.extend(tokenize(name))
    return tokens


def jaccard_similarity(a: List[str], b: List[str]) -> float:
    if not a or not b:
        return 0.0
    set_a = set(a)
    set_b = set(b)
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union) if union else 0.0


def token_overlap_score(slug_tok: List[str], canonical_tok: List[str]) -> float:
    if not slug_tok or not canonical_tok:
        return 0.0
    # Jaccard with bonus for proportion of slug tokens covered (precision)
    jaccard = jaccard_similarity(slug_tok, canonical_tok)
    covered = len(set(slug_tok) & set(canonical_tok)) / len(set(slug_tok))
    # Penalty for deep canonical paths matching shallow slugs
    depth_factor = 1.0 - 0.05 * max(0, len(canonical_tok) - len(slug_tok))
    return round(jaccard * 0.5 + covered * 0.5 * depth_factor, 4)


def load_slugs(db, min_count: int = 1, status_filter: str = "inactive") -> List[Dict]:
    pipeline = [
        {"$match": {
            "Categ": {"$exists": True, "$ne": ""},
            "cms_status": status_filter,
            "catalog_has_category": False,
        }},
        {"$group": {
            "_id": "$Categ",
            "count": {"$sum": 1},
            "samples": {"$push": "$Barcode"},
        }},
        {"$sort": {"count": -1}},
    ]
    rows = []
    for doc in db.products.aggregate(pipeline):
        if doc["count"] < min_count:
            continue
        rows.append({
            "slug": doc["_id"],
            "count": doc["count"],
            "samples": doc.get("samples", [])[:3],
        })
    return rows


def load_canonical_paths(db) -> List[Tuple[List[str], List[str]]]:
    """Return list of (path_names, path_ids) for all cms_categories nodes."""
    nodes = list(db.cms_categories.find({}, {"_id": 1, "parent_id": 1, "name": 1, "is_active": 1}))
    nodes_by_id = {n["_id"]: n for n in nodes}

    paths: List[Tuple[List[str], List[str]]] = []
    for node in nodes:
        if not node.get("is_active", True):
            continue
        name_path: List[str] = []
        id_path: List[str] = []
        current = node
        guard = 0
        while current and guard < 10:
            name_path.insert(0, str(current.get("name", "")).strip())
            id_path.insert(0, str(current["_id"]))
            parent_id = current.get("parent_id")
            if not parent_id:
                break
            current = nodes_by_id.get(parent_id)
            guard += 1
        if name_path:
            paths.append((name_path, id_path))
    return paths


def best_matches(slug: str, canonical_paths: List[Tuple[List[str], List[str]]], top_n: int = 5) -> List[Dict]:
    slug_tok = slug_tokens(slug)
    scored: List[Tuple[float, List[str], List[str]]] = []
    for names, ids in canonical_paths:
        canon_tok = canonical_tokens(names)
        score = token_overlap_score(slug_tok, canon_tok)
        if score <= 0:
            continue
        scored.append((score, names, ids))
    scored.sort(key=lambda x: (-x[0], len(x[1])))
    return [
        {"score": score, "path": names, "node_ids": ids, "depth": len(names)}
        for score, names, ids in scored[:top_n]
    ]


def confidence_label(score: float) -> str:
    if score >= 0.85:
        return "high"
    if score >= 0.6:
        return "medium"
    if score >= 0.35:
        return "low"
    return "none"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fuzzy-match legacy Categ slugs to canonical cms_categories taxonomy.")
    parser.add_argument("--output", default="/app/category_slug_suggestions.json")
    parser.add_argument("--csv", default="/app/category_slug_suggestions.csv")
    parser.add_argument("--top-n", type=int, default=5)
    parser.add_argument("--min-count", type=int, default=1, help="Only include slugs used by >= this many products.")
    parser.add_argument("--status-filter", default="inactive", help="Only consider products with this cms_status.")
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
        slugs = load_slugs(db, min_count=args.min_count, status_filter=args.status_filter)
        canonical = load_canonical_paths(db)
        print(f"Loaded {len(slugs)} distinct slugs and {len(canonical)} canonical paths", file=sys.stderr)

        suggestions = []
        for entry in slugs:
            slug = entry["slug"]
            matches = best_matches(slug, canonical, top_n=args.top_n)
            top_score = matches[0]["score"] if matches else 0.0
            suggestions.append({
                "slug": slug,
                "product_count": entry["count"],
                "sample_barcodes": entry["samples"],
                "transliterated": transliterate_greeklish(slug),
                "tokens": slug_tokens(slug),
                "top_score": top_score,
                "confidence": confidence_label(top_score),
                "candidates": matches,
            })

        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(suggestions, f, ensure_ascii=False, indent=2)
        print(f"Wrote {args.output}", file=sys.stderr)

        with open(args.csv, "w", encoding="utf-8") as f:
            f.write("slug\tproduct_count\tconfidence\ttop_score\ttop_suggestion\tdepth\talternatives\n")
            for s in suggestions:
                top = s["candidates"][0]["path"] if s["candidates"] else []
                top_path = " > ".join(top)
                depth = len(top)
                alts = " | ".join(
                    " > ".join(c["path"]) + f" ({c['score']})"
                    for c in s["candidates"][1:3]
                )
                f.write(f"{s['slug']}\t{s['product_count']}\t{s['confidence']}\t{s['top_score']}\t{top_path}\t{depth}\t{alts}\n")
        print(f"Wrote {args.csv}", file=sys.stderr)

        # Summary
        from collections import Counter
        conf_counts = Counter(s["confidence"] for s in suggestions)
        products_by_conf = Counter()
        for s in suggestions:
            products_by_conf[s["confidence"]] += s["product_count"]
        print({
            "slugs_total": len(suggestions),
            "by_confidence": dict(conf_counts),
            "products_by_confidence": dict(products_by_conf),
        })
    finally:
        client.close()


if __name__ == "__main__":
    main()
