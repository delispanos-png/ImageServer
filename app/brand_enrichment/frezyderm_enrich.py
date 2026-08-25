"""Frezyderm brand enrichment.

Frezyderm exposes:
  - /system/feed/products (sitemap XML with product URLs)
  - Each product page contains JSON-LD with `gtin` (barcode) and `sku`
  - HTML breadcrumb with Greek category hierarchy

Match strategy is EXACT barcode (gtin), no fuzzy matching needed.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


FREZYDERM_FEED_URL = "https://www.frezyderm.gr/system/feed/products"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
EVALUATOR = "automation:brand_enrichment:frezyderm"
CACHE_PATH = "/app/brand_catalog_frezyderm.json"

SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
BREADCRUMB_RE = re.compile(r'<ul[^>]*breadcrumb[^>]*>(.*?)</ul>', re.S | re.I)
BREADCRUMB_NAME_RE = re.compile(r'<span[^>]*itemprop="name"[^>]*>(.*?)</span>', re.S | re.I)
LDJSON_RE = re.compile(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', re.S | re.I)


def _curl(url: str) -> str:
    completed = subprocess.run(
        ["curl", "-sL", "-A", USER_AGENT, url, "--max-time", "30"],
        capture_output=True, check=False, timeout=35,
    )
    if completed.returncode != 0:
        raise RuntimeError(f"curl failed for {url}: {completed.stderr.decode('utf-8', 'ignore')[:200]}")
    return completed.stdout.decode("utf-8", "ignore")


def fetch_product_urls() -> List[str]:
    xml_text = _curl(FREZYDERM_FEED_URL)
    root = ET.fromstring(xml_text)
    urls: List[str] = []
    for url_elem in root.findall(f"{SITEMAP_NS}url"):
        loc = url_elem.find(f"{SITEMAP_NS}loc")
        if loc is not None and loc.text:
            urls.append(loc.text.strip())
    return urls


def extract_product(html: str, source_url: str) -> Optional[Dict]:
    product_data: Optional[Dict] = None
    for ld_block in LDJSON_RE.findall(html):
        try:
            data = json.loads(ld_block.strip(), strict=False)
        except Exception:
            continue
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and item.get("@type") == "Product":
                    product_data = item
                    break
        elif isinstance(data, dict) and data.get("@type") == "Product":
            product_data = data
        if product_data:
            break

    if not product_data:
        return None

    breadcrumb_names: List[str] = []
    bc_match = BREADCRUMB_RE.search(html)
    if bc_match:
        for name in BREADCRUMB_NAME_RE.findall(bc_match.group(1)):
            text = re.sub(r"<[^>]+>", " ", name)
            text = re.sub(r"\s+", " ", text).strip()
            if text:
                breadcrumb_names.append(text)

    # Strip the root brand link ("Δερμοκαλλυντικά Προϊόντα...") and any product-name leaf
    if breadcrumb_names and breadcrumb_names[0].upper().startswith("ΔΕΡΜΟΚΑΛΛΥΝΤΙΚΑ"):
        breadcrumb_names = breadcrumb_names[1:]

    product_name = str(product_data.get("name", "") or "").strip()
    if breadcrumb_names and breadcrumb_names[-1].strip().lower() == product_name.lower():
        breadcrumb_names = breadcrumb_names[:-1]

    cat1 = breadcrumb_names[0] if len(breadcrumb_names) > 0 else ""
    cat2 = breadcrumb_names[1] if len(breadcrumb_names) > 1 else ""
    cat3 = breadcrumb_names[2] if len(breadcrumb_names) > 2 else ""

    image = product_data.get("image")
    if isinstance(image, list):
        image = image[0] if image else ""
    image = str(image or "").strip()

    return {
        "source_url": source_url,
        "name": product_name,
        "gtin": str(product_data.get("gtin", "") or "").strip(),
        "sku": str(product_data.get("sku", "") or "").strip(),
        "image": image,
        "category_1": cat1,
        "category_2": cat2,
        "category_3": cat3,
        "breadcrumb": breadcrumb_names,
    }


def crawl_catalog(delay: float = 0.4) -> List[Dict]:
    urls = fetch_product_urls()
    print(f"  sitemap urls: {len(urls)}")
    out: List[Dict] = []
    fail = 0
    for i, url in enumerate(urls, start=1):
        try:
            html = _curl(url)
            entry = extract_product(html, url)
            if entry:
                out.append(entry)
            else:
                fail += 1
        except Exception as exc:
            print(f"  ERR {url}: {exc}")
            fail += 1
        if i % 25 == 0 or i == len(urls):
            print(f"  progress {i}/{len(urls)} ok={len(out)} fail={fail}", flush=True)
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
        gtin = (it.get("gtin") or "").strip()
        if not gtin:
            continue
        out[gtin] = it
        stripped = gtin.lstrip("0")
        if stripped and stripped != gtin:
            out[stripped] = it
    return out


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Frezyderm brand enrichment by exact barcode match.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--refresh-catalog", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument(
        "--mode", choices=["inactive", "active-fill", "all"], default="all",
        help="all: any Frezyderm product. inactive: only inactive-no-category. active-fill: only fill missing L2/L3.",
    )
    parser.add_argument("--report-path", default="/app/frezyderm_enrichment_report.json")
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
    print({"stage": "build_index", "unique_gtins": len(set(it.get("gtin", "") for it in catalog if it.get("gtin")))})

    client, db = mongo_db()
    try:
        base = {"Title": {"$regex": "FREZYDERM", "$options": "i"}}
        if args.mode == "inactive":
            query = {**base, "cms_status": "inactive"}
        elif args.mode == "active-fill":
            query = {
                **base,
                "cms_status": "active",
                "$or": [
                    {"Category_2": {"$exists": False}},
                    {"Category_2": ""},
                ],
            }
        else:
            query = base

        cursor = db.products.find(query)
        if args.limit > 0:
            cursor = cursor.limit(args.limit)

        stats = {
            "examined": 0,
            "barcode_matched": 0,
            "barcode_missed": 0,
            "would_activate": 0,
            "stays_inactive": 0,
            "modified": 0,
        }
        report_rows: List[Dict] = []
        operations: List[UpdateOne] = []

        for doc in cursor:
            stats["examined"] += 1
            barcode = str(doc.get("Barcode", "")).strip()
            barcode_norm = barcode.lstrip("0")
            entry = barcode_map.get(barcode) or barcode_map.get(barcode_norm)

            if not entry:
                stats["barcode_missed"] += 1
                report_rows.append({
                    "barcode": barcode,
                    "title": (doc.get("Title", "") or "")[:80],
                    "matched": False,
                })
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
                "barcode": barcode,
                "title": (doc.get("Title", "") or "")[:80],
                "matched": True,
                "name_apply": entry.get("name"),
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
            json.dump({"stats": stats, "rows": report_rows[:200]}, f, ensure_ascii=False, indent=2)

        print({"summary": stats, "report": args.report_path})
    finally:
        client.close()


if __name__ == "__main__":
    main()
