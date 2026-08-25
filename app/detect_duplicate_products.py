"""Scan db.products for likely duplicate barcodes that point to the same
product, write a `duplicate_candidates` collection that admins can review.

Two products are considered candidates when their normalized title token
sets match exactly after stripping diacritics, brand-noise tokens, and
size suffixes (e.g. "50ml"). Match strength is reported so admins can
sort the queue by confidence.

Idempotent: each run upserts onto a stable group key derived from the
shared token set so existing review status (dismissed/merged) is
preserved across runs.

Use:
  python3 detect_duplicate_products.py [--limit 0] [--min-tokens 3]
"""
from __future__ import annotations

import argparse
import hashlib
import os
import re
import unicodedata
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne


_WORD_RE = re.compile(r"[\wΑ-Ωα-ωάέήίόύώϊϋΐΰΆΈΉΊΌΎΏ]+", re.UNICODE)
_SIZE_RE = re.compile(r"\b\d+[.,]?\d*\s?(ml|gr|g|mg|caps|tabs|τεμ|τμχ)\b", re.I)
_NOISE_TOKENS = {"το", "της", "τη", "και", "the", "for", "with", "by", "by"}


def _strip_accents(text: str) -> str:
    nfd = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn")


def _tokenize(title: str) -> List[str]:
    text = (title or "").lower()
    text = _SIZE_RE.sub(" ", text)
    text = _strip_accents(text)
    tokens = [t for t in _WORD_RE.findall(text) if len(t) >= 3 and t not in _NOISE_TOKENS]
    return tokens


def _group_key(tokens: List[str]) -> str:
    sorted_tokens = sorted(set(tokens))
    payload = ",".join(sorted_tokens)
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()[:16]


def _pick_keeper(products: List[Dict[str, Any]]) -> str:
    """Score each candidate and return the recommended keeper barcode.

    Higher is better. Ties broken by latest cms_updated_at.
    """
    def score(p: Dict[str, Any]) -> Tuple[int, str]:
        s = 0
        bc = str(p.get("Barcode") or "")
        if bc.isdigit() and len(bc) in (12, 13, 14):
            s += 5  # proper EAN/UPC
        if p.get("cms_status") == "active":
            s += 4
        if str(p.get("cms_description") or "").strip():
            s += 2
        if str(p.get("cms_title") or "").strip():
            s += 2
        if p.get("Image_Path"):
            s += 2
        if p.get("photo_source_locked"):
            s += 1
        return (s, str(p.get("cms_updated_at") or ""))
    return max(products, key=score).get("Barcode", "")


def run(limit: int, min_tokens: int) -> Dict[str, int]:
    load_dotenv("/app/.env")
    client = MongoClient(
        f"mongodb://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASSWORD')}"
        f"@{os.getenv('MONGO_HOST', 'mongodb')}:{os.getenv('MONGO_PORT', '27017')}"
    )
    db = client[os.getenv("MONGO_DB", "imageDB")]

    proj = {
        "Barcode": 1, "Title": 1, "cms_title": 1, "cms_description": 1,
        "Brand": 1, "Image_Path": 1, "Img_src": 1, "cms_status": 1,
        "Category_1": 1, "Category_2": 1, "cms_updated_at": 1,
        "photo_source_locked": 1, "_id": 0,
    }
    cursor = db.products.find({"Title": {"$exists": True, "$ne": ""}}, proj)

    groups: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    examined = 0
    for product in cursor:
        if limit and examined >= limit:
            break
        examined += 1
        tokens = _tokenize(product.get("Title", ""))
        if len(tokens) < min_tokens:
            continue
        key = _group_key(tokens)
        groups[key].append(product)

    now_iso = datetime.now(timezone.utc).isoformat()
    ops: List[UpdateOne] = []
    candidate_groups = 0
    candidate_barcodes = 0
    for group_key, items in groups.items():
        if len(items) < 2:
            continue
        candidate_groups += 1
        candidate_barcodes += len(items)

        barcodes = [str(p.get("Barcode") or "").strip() for p in items if p.get("Barcode")]
        keeper = _pick_keeper(items)
        sample_title = str((items[0].get("cms_title") or items[0].get("Title") or "")).strip()[:160]
        all_active = sum(1 for p in items if p.get("cms_status") == "active")
        all_have_image = sum(1 for p in items if p.get("Image_Path") or p.get("Img_src"))
        tokens = sorted(set(_tokenize(sample_title)))

        ops.append(UpdateOne(
            {"group_key": group_key},
            {
                "$set": {
                    "barcodes": barcodes,
                    "barcode_count": len(barcodes),
                    "keeper_recommended": keeper,
                    "sample_title": sample_title,
                    "shared_tokens": tokens[:10],
                    "items_active_count": all_active,
                    "items_with_image": all_have_image,
                    "last_scanned_at": now_iso,
                },
                "$setOnInsert": {
                    "group_key": group_key,
                    "first_seen_at": now_iso,
                    "status": "pending",
                },
            },
            upsert=True,
        ))

    if ops:
        for i in range(0, len(ops), 500):
            db.duplicate_candidates.bulk_write(ops[i:i + 500], ordered=False)

    # Mark stale rows (no longer seen) so admins can spot resolved drift.
    stale_result = db.duplicate_candidates.update_many(
        {"last_scanned_at": {"$ne": now_iso}, "status": "pending"},
        {"$set": {"status": "stale", "stale_marked_at": now_iso}},
    )

    client.close()
    return {
        "examined": examined,
        "candidate_groups": candidate_groups,
        "candidate_barcodes": candidate_barcodes,
        "stale_marked": int(stale_result.modified_count),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--min-tokens", type=int, default=3)
    args = parser.parse_args()
    print(run(args.limit, args.min_tokens))


if __name__ == "__main__":
    main()
