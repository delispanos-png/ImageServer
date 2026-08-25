"""Avène brand enrichment.

eau-thermale-avene.gr exposes:
  - /product.xml sitemap with EAN-13 embedded in each URL
  - Each product page has JSON-LD Product with `gtin` + breadcrumb in Greek

Match strategy: exact barcode (gtin), no fuzzy matching.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


SITEMAP_URL = "https://www.eau-thermale-avene.gr/product.xml"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
EVALUATOR = "automation:brand_enrichment:avene"
CACHE_PATH = "/app/brand_catalog_avene.json"

URL_BARCODE_RE = re.compile(r"/p/.+-(\d{13})-[a-f0-9]+$")
BREADCRUMB_RE = re.compile(r'<nav[^>]*breadcrumb[^>]*>(.*?)</nav>|<ol[^>]*breadcrumb[^>]*>(.*?)</ol>|<ul[^>]*breadcrumb[^>]*>(.*?)</ul>', re.S | re.I)
BREADCRUMB_NAME_RE = re.compile(r'<a[^>]*>([^<]+?)</a>|<span[^>]*itemprop="name"[^>]*>([^<]+?)</span>', re.S | re.I)
LDJSON_RE = re.compile(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', re.S | re.I)

SKIP_BREADCRUMB = {"ΑΡΧΙΚΗ ΣΕΛΙΔΑ", "HOME"}


def _curl(url: str) -> str:
    completed = subprocess.run(
        ["curl", "-sL", "-A", USER_AGENT, url, "--max-time", "30"],
        capture_output=True, check=False, timeout=35,
    )
    if completed.returncode != 0:
        raise RuntimeError(f"curl failed for {url}")
    return completed.stdout.decode("utf-8", "ignore")


def fetch_product_urls() -> Dict[str, str]:
    xml = _curl(SITEMAP_URL)
    out: Dict[str, str] = {}
    for url in re.findall(r"<loc>(https://www\.eau-thermale-avene\.gr/p/[^<]+)</loc>", xml):
        m = URL_BARCODE_RE.search(url)
        if m:
            out[m.group(1)] = url
    return out


def extract_product(html: str) -> Optional[Dict]:
    product_data: Optional[Dict] = None
    for ld in LDJSON_RE.findall(html):
        try:
            data = json.loads(ld.strip(), strict=False)
        except Exception:
            continue
        candidates = [data] if isinstance(data, dict) else (data if isinstance(data, list) else [])
        for item in candidates:
            if isinstance(item, dict) and item.get("@type") == "Product":
                product_data = item
                break
        if product_data:
            break

    if not product_data:
        return None

    # Breadcrumb extraction
    breadcrumb: List[str] = []
    m = BREADCRUMB_RE.search(html)
    if m:
        chunk = next(g for g in m.groups() if g)
        for hit in BREADCRUMB_NAME_RE.findall(chunk):
            name = next((g for g in hit if g), "")
            name = re.sub(r"<[^>]+>", " ", name)
            name = re.sub(r"\s+", " ", name).strip()
            if name and name.upper() not in SKIP_BREADCRUMB and len(name) < 80:
                breadcrumb.append(name)

    product_name = str(product_data.get("name", "") or "").strip()
    if breadcrumb and breadcrumb[-1].strip().lower() == product_name.lower():
        breadcrumb = breadcrumb[:-1]

    gtin = str(product_data.get("gtin", "") or "").strip()
    return {
        "name": product_name,
        "gtin": gtin,
        "gtin_normalized": gtin.lstrip("0"),
        "category_1": breadcrumb[0] if len(breadcrumb) > 0 else "",
        "category_2": breadcrumb[1] if len(breadcrumb) > 1 else "",
        "category_3": breadcrumb[2] if len(breadcrumb) > 2 else "",
        "image": str(product_data.get("image", "") or "").strip(),
    }


def crawl_catalog(delay: float = 0.3) -> List[Dict]:
    barcode_urls = fetch_product_urls()
    print(f"  sitemap entries: {len(barcode_urls)}")
    out: List[Dict] = []
    fail = 0
    items = list(barcode_urls.items())
    for i, (bc, url) in enumerate(items, start=1):
        try:
            html = _curl(url)
            entry = extract_product(html)
            if entry:
                entry["source_url"] = url
                entry["sitemap_barcode"] = bc
                out.append(entry)
            else:
                fail += 1
        except Exception as e:
            print(f"  ERR {url}: {e}")
            fail += 1
        if i % 25 == 0 or i == len(items):
            print(f"  progress {i}/{len(items)} ok={len(out)} fail={fail}", flush=True)
        time.sleep(delay)
    return out


def load_catalog(force_refresh: bool = False) -> List[Dict]:
    if not force_refresh and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, encoding="utf-8") as f:
            return json.load(f)
    items = crawl_catalog()
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    return items


def build_barcode_map(items: List[Dict]) -> Dict[str, Dict]:
    out: Dict[str, Dict] = {}
    for it in items:
        gtin = it.get("gtin", "") or it.get("sitemap_barcode", "")
        if not gtin:
            continue
        out[gtin] = it
        stripped = gtin.lstrip("0")
        if stripped and stripped != gtin:
            out[stripped] = it
    return out


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Avène brand enrichment by exact barcode match.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--refresh-catalog", action="store_true")
    parser.add_argument("--mode", choices=["inactive", "active-fill", "all"], default="all")
    parser.add_argument("--report-path", default="/app/avene_enrichment_report.json")
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
    barcode_map = build_barcode_map(catalog)
    print({"stage": "build_index", "unique_gtins": len(set(it.get("gtin") for it in catalog if it.get("gtin")))})

    client, db = mongo_db()
    try:
        base = {"Title": {"$regex": "AVENE|AVÈNE", "$options": "i"}}
        if args.mode == "inactive":
            query = {**base, "cms_status": "inactive"}
        elif args.mode == "active-fill":
            query = {**base, "cms_status": "active", "$or": [{"Category_2": {"$exists": False}}, {"Category_2": ""}]}
        else:
            query = base

        cursor = db.products.find(query)
        stats = {"examined": 0, "barcode_matched": 0, "barcode_missed": 0,
                 "would_activate": 0, "stays_inactive": 0, "modified": 0}
        report_rows: List[Dict] = []
        operations: List[UpdateOne] = []

        for doc in cursor:
            stats["examined"] += 1
            bc = str(doc.get("Barcode", "")).strip()
            bc_stripped = bc.lstrip("0")
            entry = barcode_map.get(bc) or barcode_map.get(bc_stripped)
            if not entry:
                stats["barcode_missed"] += 1
                continue
            stats["barcode_matched"] += 1

            set_updates: Dict[str, object] = {
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }
            fill_only = args.mode == "active-fill"
            existing_c1 = str(doc.get("Category_1", "") or "").strip()
            existing_c2 = str(doc.get("Category_2", "") or "").strip()
            existing_c3 = str(doc.get("Category_3", "") or "").strip()
            if entry.get("category_1") and (not fill_only or not existing_c1):
                set_updates["Category_1"] = entry["category_1"]
            if entry.get("category_2") and (not fill_only or not existing_c2):
                set_updates["Category_2"] = entry["category_2"]
            if entry.get("category_3") and (not fill_only or not existing_c3):
                set_updates["Category_3"] = entry["category_3"]

            candidate = dict(doc)
            candidate.update(set_updates)
            set_updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR))
            if doc.get("cms_status") == "inactive" and set_updates.get("cms_status") == "active":
                stats["would_activate"] += 1
            elif doc.get("cms_status") == "inactive" and set_updates.get("cms_status") == "inactive":
                stats["stays_inactive"] += 1

            report_rows.append({
                "barcode": bc,
                "title": (doc.get("Title", "") or "")[:80],
                "c1": entry.get("category_1"),
                "c2": entry.get("category_2"),
                "c3": entry.get("category_3"),
                "result_status": set_updates.get("cms_status"),
            })
            operations.append(UpdateOne({"_id": doc["_id"]}, {"$set": set_updates}, upsert=False))

        if not args.dry_run and operations:
            for i in range(0, len(operations), 500):
                result = db.products.bulk_write(operations[i:i + 500], ordered=False)
                stats["modified"] += result.modified_count

        with open(args.report_path, "w", encoding="utf-8") as f:
            json.dump({"stats": stats, "rows": report_rows[:100]}, f, ensure_ascii=False, indent=2)
        print({"summary": stats, "report": args.report_path})
    finally:
        client.close()


if __name__ == "__main__":
    main()
