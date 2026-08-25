"""Fuzzy deduplicator for cms.pending_brand_imports.

For each pending queue item, look inside db.products for a document with:
  - same normalised brand
  - Jaccard >= 0.75 on cleaned title tokens
  - same size tokens (75ml never matches 200ml)

If we find a single confident match we mark the queue row as
`duplicate`, recording resolved_to_barcode. If we find several matches
(ambiguous) we skip and leave the row for the auto-resolver / admin.

This is intentionally stricter than the brand_sync_job's original
matcher — that one uses 60% token overlap on ALL products and misses
many because the brand scrapers don't include size normalisation.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import unicodedata
from datetime import datetime, timezone
from typing import Dict, List, Optional, Set, Tuple

from pymongo import MongoClient


_SIZE_RE = re.compile(
    r"(\d+(?:[.,]\d+)?)\s*(ml|gr|g|mg|kg|l|caps|capsules|tabs|tablets|softgels|τεμ|τμχ|sachets|patches)",
    re.IGNORECASE,
)
_NOISE_WORDS = {
    # generic marketing filler and units already handled elsewhere
    "gia", "για", "the", "with", "και", "και", "και", "&",
    "new", "νέο", "premium", "special", "edition",
}


def _strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s or "") if unicodedata.category(c) != "Mn")


def _tokenise(title: str) -> Set[str]:
    if not title:
        return set()
    t = title.lower()
    t = _SIZE_RE.sub(" ", t)
    t = re.sub(r"[^a-zα-ωάέήίόύώϊϋΐΰ0-9\s]", " ", t)
    t = _strip_accents(t)
    return {w for w in t.split() if len(w) >= 3 and w not in _NOISE_WORDS}


def _sizes(title: str) -> frozenset:
    return frozenset(
        (m.group(1).replace(",", "."), m.group(2).lower())
        for m in _SIZE_RE.finditer(title or "")
    )


def _norm_brand(v: str) -> str:
    s = _strip_accents(str(v or "").strip().casefold())
    return re.sub(r"\s+", " ", s)


def _jaccard(a: Set[str], b: Set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def _build_brand_index(db, brand_name: str) -> List[Dict]:
    """One pass over db.products filtered by fuzzy brand match. Returns
    lightweight docs with the tokens + sizes precomputed."""
    # We match against Brand OR the first word of Title (many products
    # store the brand only inside the title).
    brand_key = _norm_brand(brand_name)
    if not brand_key:
        return []
    cursor = db.products.find(
        {
            "$or": [
                {"Brand": {"$regex": re.escape(brand_name), "$options": "i"}},
                {"Title": {"$regex": re.escape(brand_name), "$options": "i"}},
                {"cms_brand": {"$regex": re.escape(brand_name), "$options": "i"}},
            ]
        },
        {"Barcode": 1, "Title": 1, "cms_title": 1, "Brand": 1, "cms_brand": 1},
    )
    out = []
    for doc in cursor:
        best_title = str(doc.get("cms_title") or doc.get("Title") or "").strip()
        if not best_title:
            continue
        if _norm_brand(doc.get("Brand") or doc.get("cms_brand") or "") != brand_key \
                and brand_key not in best_title.lower():
            continue
        out.append({
            "_id": doc["_id"],
            "barcode": str(doc.get("Barcode") or "").strip(),
            "title": best_title,
            "tokens": _tokenise(best_title),
            "sizes": _sizes(best_title),
        })
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--min-jaccard", type=float, default=0.75)
    parser.add_argument("--brand", default="")
    args = parser.parse_args()

    u = os.getenv("MONGO_USER", "")
    p = os.getenv("MONGO_PASSWORD", "")
    db = MongoClient(f"mongodb://{u}:{p}@mongodb:27017")[os.getenv("MONGO_DB", "imageDB")]

    query: Dict = {"status": "pending"}
    if args.brand:
        query["brand"] = args.brand.lower()
    queue = list(db.pending_brand_imports.find(query))
    print(f"pending items to inspect: {len(queue)}")

    # Group by brand so we build the products index only once per brand.
    by_brand: Dict[str, List[Dict]] = {}
    for q in queue:
        by_brand.setdefault(str(q.get("brand") or ""), []).append(q)

    stats = {"scanned": 0, "matched": 0, "ambiguous": 0, "no_match": 0}
    now_iso = datetime.now(timezone.utc).isoformat()

    for brand_name, items in by_brand.items():
        index = _build_brand_index(db, brand_name)
        print(f"\n== {brand_name}: {len(items)} pending vs {len(index)} candidate products ==")
        for q in items:
            stats["scanned"] += 1
            q_title = str(q.get("title") or "")
            q_tokens = _tokenise(q_title)
            q_sizes = _sizes(q_title)
            if not q_tokens:
                stats["no_match"] += 1
                continue

            hits: List[Tuple[float, Dict]] = []
            for cand in index:
                # Size mismatch is a hard reject (75ml != 200ml).
                if q_sizes and cand["sizes"] and q_sizes != cand["sizes"]:
                    continue
                score = _jaccard(q_tokens, cand["tokens"])
                if score >= args.min_jaccard:
                    hits.append((score, cand))

            hits.sort(key=lambda x: x[0], reverse=True)
            # Require a clear leader: top score at least 0.05 above the runner-up.
            if len(hits) == 1 or (hits and (len(hits) < 2 or hits[0][0] - hits[1][0] >= 0.05)):
                pick = hits[0] if hits else None
            else:
                pick = None
                if hits:
                    stats["ambiguous"] += 1

            if not pick:
                stats["no_match"] += 1
                continue

            score, cand = pick
            stats["matched"] += 1
            if args.dry_run:
                print(f"  [DRY] {q_title[:60]!r} -> {cand['barcode']} ({cand['title'][:60]!r}) score={score:.2f}")
                continue
            db.pending_brand_imports.update_one(
                {"_id": q["_id"]},
                {"$set": {
                    "status": "duplicate",
                    "resolved_at": now_iso,
                    "resolved_to_barcode": cand["barcode"],
                    "resolved_by": "auto:fuzzy_dedup",
                    "match_score": round(float(score), 3),
                }},
            )

    print()
    print("=== dedup stats ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
