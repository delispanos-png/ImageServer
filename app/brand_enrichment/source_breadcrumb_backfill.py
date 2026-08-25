"""Backfill categories from source product pages by reading their breadcrumbs.

Each source we scrape (vita4you, etc.) has a Product_Link stored on every
product. We fetch that URL, parse the breadcrumb, and apply the categories
from the source's own taxonomy to our document.

This script targets only sources without aggressive bot protection. For
Cloudflare/Anubis-protected sources, a different fetcher is needed.
"""

from __future__ import annotations

import argparse
import asyncio
import html as html_lib
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

import requests
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
EVALUATOR = "automation:source_breadcrumb_backfill"


# Per-source extraction config. Each entry needs:
#   - breadcrumb_re: regex finding the breadcrumb list element (use group 1)
#   - name_re: regex finding each breadcrumb level inside, group 1 = name
#   - barcode_field: name in JSON-LD Product where barcode lives (gtin/gtin13/mpn/sku)
SOURCE_CONFIG: Dict[str, Dict] = {
    "vita4you": {
        "host": "vita4you.gr",
        "breadcrumb_re": r'<ul[^>]*breadcrumb[^>]*>(.*?)</ul>',
        "name_re": r'itemprop="name"[^>]*>([^<]+)',
        "barcode_fields": ["mpn", "gtin13", "gtin"],
    },
}


LDJSON_RE = re.compile(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', re.S | re.I)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Backfill categories from source product pages.")
    parser.add_argument("--source", required=True, choices=list(SOURCE_CONFIG.keys()))
    parser.add_argument("--mode", choices=["inactive", "active-fill", "all"], default="inactive")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--delay", type=float, default=0.1, help="Sleep between requests per worker.")
    parser.add_argument("--report-path", default="")
    return parser.parse_args()


def mongo_db():
    user = os.getenv("MONGO_USER")
    password = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST", "mongodb")
    port = int(os.getenv("MONGO_PORT", "27017"))
    client = MongoClient(f"mongodb://{user}:{password}@{host}:{port}")
    return client, client[os.getenv("MONGO_DB", "imageDB")]


def fetch_html(url: str, timeout: int = 20) -> Optional[str]:
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=timeout, allow_redirects=True)
        if resp.status_code == 200:
            return resp.text
        return None
    except Exception:
        return None


def extract_breadcrumb(html: str, cfg: Dict) -> List[str]:
    m = re.search(cfg["breadcrumb_re"], html, flags=re.S | re.I)
    if not m:
        return []
    chunk = m.group(1)
    names: List[str] = []
    for raw in re.findall(cfg["name_re"], chunk, flags=re.S | re.I):
        text = html_lib.unescape(raw).strip()
        text = re.sub(r"\s+", " ", text)
        if text:
            names.append(text)
    return names


def extract_barcodes(html: str, cfg: Dict) -> List[str]:
    out: List[str] = []
    for block in LDJSON_RE.findall(html):
        try:
            data = json.loads(block.strip(), strict=False)
        except Exception:
            continue
        candidates: List[Dict] = []
        if isinstance(data, list):
            candidates.extend(item for item in data if isinstance(item, dict))
        elif isinstance(data, dict):
            candidates.append(data)
        for item in candidates:
            if item.get("@type") != "Product":
                continue
            for field in cfg["barcode_fields"]:
                val = str(item.get(field, "") or "").strip()
                # Field may contain comma-separated values for product variants
                for piece in re.split(r"[,;]\s*", val):
                    piece = piece.strip()
                    if piece and piece not in out:
                        out.append(piece)
    return out


SKIP_CATEGORY_NAMES = {"ΕΤΑΙΡΕΙΕΣ", "BRANDS", "ΜΑΡΚΕΣ"}


def parse_product_page(html: str, cfg: Dict) -> Dict:
    breadcrumb = extract_breadcrumb(html, cfg)
    cleaned = [b for b in breadcrumb if len(b) < 80 and b.upper() not in SKIP_CATEGORY_NAMES]
    categories = cleaned[:3]
    barcodes = extract_barcodes(html, cfg)
    return {
        "categories": categories,
        "barcodes": barcodes,
    }


def process_product(doc: Dict, cfg: Dict, delay: float) -> Dict:
    """Worker. Returns dict with doc_id, barcode, parsed, etc."""
    url = doc.get("Product_Link", "")
    if not url:
        return {"_id": doc["_id"], "ok": False, "reason": "no_url"}
    html = fetch_html(url)
    if delay > 0:
        time.sleep(delay)
    if not html:
        return {"_id": doc["_id"], "ok": False, "reason": "fetch_failed", "url": url}
    parsed = parse_product_page(html, cfg)
    if not parsed["categories"]:
        return {"_id": doc["_id"], "ok": False, "reason": "no_breadcrumb", "url": url}
    return {
        "_id": doc["_id"],
        "ok": True,
        "barcodes_extracted": parsed["barcodes"],
        "barcode_db": doc.get("Barcode", ""),
        "categories": parsed["categories"],
        "url": url,
    }


def main() -> None:
    args = parse_args()
    load_dotenv("/app/.env")

    cfg = SOURCE_CONFIG[args.source]
    report_path = args.report_path or f"/app/{args.source}_breadcrumb_backfill_report.json"

    client, db = mongo_db()
    try:
        base = {"Site": args.source, "Product_Link": {"$exists": True, "$ne": ""}}
        if args.mode == "inactive":
            query = {**base, "cms_status": "inactive"}
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

        docs = list(cursor)
        print({"stage": "load_docs", "count": len(docs)})

        stats = {
            "examined": len(docs),
            "fetched_ok": 0,
            "fetch_failed": 0,
            "no_breadcrumb": 0,
            "barcode_match": 0,
            "barcode_mismatch": 0,
            "barcode_unknown": 0,
            "would_activate": 0,
            "modified": 0,
        }
        report_rows: List[Dict] = []
        operations: List[UpdateOne] = []

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(process_product, doc, cfg, args.delay): doc for doc in docs}
            for i, fut in enumerate(as_completed(futures), start=1):
                doc = futures[fut]
                result = fut.result()
                if not result.get("ok"):
                    reason = result.get("reason")
                    if reason == "fetch_failed":
                        stats["fetch_failed"] += 1
                    elif reason == "no_breadcrumb":
                        stats["no_breadcrumb"] += 1
                    if i % 100 == 0:
                        print({"progress": i, "ok": stats["fetched_ok"]}, flush=True)
                    continue
                stats["fetched_ok"] += 1
                # Barcode sanity check (we apply categories regardless of result)
                bc_db = str(result.get("barcode_db", "")).lstrip("0")
                web_list = result.get("barcodes_extracted") or []
                web_normalized = [str(b or "").lstrip("0") for b in web_list]
                if not web_normalized:
                    stats["barcode_unknown"] += 1
                    match_status = "unknown"
                elif bc_db in web_normalized:
                    stats["barcode_match"] += 1
                    match_status = "match"
                else:
                    stats["barcode_mismatch"] += 1
                    match_status = "mismatch"

                cats = result["categories"]
                set_updates: Dict[str, object] = {
                    "brand_enrichment_source": EVALUATOR + ":" + args.source,
                    "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
                }
                fill_only = args.mode == "active-fill"
                existing_c1 = str(doc.get("Category_1", "") or "").strip()
                existing_c2 = str(doc.get("Category_2", "") or "").strip()
                existing_c3 = str(doc.get("Category_3", "") or "").strip()
                if len(cats) >= 1 and (not fill_only or not existing_c1):
                    set_updates["Category_1"] = cats[0]
                if len(cats) >= 2 and (not fill_only or not existing_c2):
                    set_updates["Category_2"] = cats[1]
                if len(cats) >= 3 and (not fill_only or not existing_c3):
                    set_updates["Category_3"] = cats[2]

                candidate = dict(doc)
                candidate.update(set_updates)
                set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR))
                if doc.get("cms_status") == "inactive" and set_updates.get("cms_status") == "active":
                    stats["would_activate"] += 1

                if len(report_rows) < 100:
                    report_rows.append({
                        "barcode_db": doc.get("Barcode"),
                        "barcodes_web": result.get("barcodes_extracted"),
                        "barcode_match": match_status,
                        "categories": cats,
                        "title": (doc.get("Title", "") or "")[:80],
                        "result_status": set_updates.get("cms_status"),
                    })
                operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": set_updates}, upsert=False))

                if i % 100 == 0:
                    print({"progress": i, "ok": stats["fetched_ok"], "would_activate": stats["would_activate"]}, flush=True)

        if not args.dry_run and operations:
            for i in range(0, len(operations), 500):
                result = db.products.bulk_write(operations[i:i + 500], ordered=False)
                stats["modified"] += result.modified_count

        with open(report_path, "w", encoding="utf-8") as f:
            json.dump({"stats": stats, "sample_rows": report_rows[:50]}, f, ensure_ascii=False, indent=2)
        print({"summary": stats, "report": report_path})
    finally:
        client.close()


if __name__ == "__main__":
    main()
