"""MAM brand enrichment.

mambaby.com sitemap (gzipped) + product pages with gtin13 in microdata.
Match: exact barcode (gtin). Categories from breadcrumb (English).
Brand-mapped L1 = ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ.
"""

from __future__ import annotations

import argparse
import gzip
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


SITEMAP_INDEX_URL = "https://www.mambaby.com/sitemap.xml"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
BRAND_L1 = "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ"
EVALUATOR = "automation:brand_enrichment:mam"
CACHE_PATH = "/app/brand_catalog_mam.json"

GTIN_META_RE = re.compile(r'<meta\s+itemprop="gtin13"\s+content="(\d+)"', re.I)
BREADCRUMB_RE = re.compile(r'<ol[^>]*breadcrumb[^>]*>(.*?)</ol>', re.S | re.I)
PRODUCT_NAME_RE = re.compile(r'<meta\s+itemprop="name"\s+content="([^"]+)"', re.I)
SKIP_BREADCRUMB = {"HOME", "SHOP", "BUY", "ΑΡΧΙΚΗ"}


def _curl_bytes(url: str) -> bytes:
    r = subprocess.run(
        ["curl", "-sL", "-A", USER_AGENT, url, "--max-time", "30"],
        capture_output=True, check=False, timeout=35,
    )
    if r.returncode != 0:
        raise RuntimeError(f"curl failed for {url}")
    return r.stdout


def fetch_product_urls() -> List[str]:
    index_xml = _curl_bytes(SITEMAP_INDEX_URL).decode("utf-8", "ignore")
    sub_urls = re.findall(r"<loc>([^<]+)</loc>", index_xml)
    urls: List[str] = []
    for sub_url in sub_urls:
        raw = _curl_bytes(sub_url)
        if sub_url.endswith(".gz"):
            try:
                content = gzip.decompress(raw).decode("utf-8", "ignore")
            except Exception:
                content = raw.decode("utf-8", "ignore")
        else:
            content = raw.decode("utf-8", "ignore")
        urls.extend(re.findall(r"<loc>(https://www\.mambaby\.com/p/[^<]+)</loc>", content))
    # dedupe preserving order
    seen = set()
    out = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def extract_product(html: str) -> Optional[Dict]:
    m = GTIN_META_RE.search(html)
    gtin = m.group(1) if m else ""
    # Breadcrumb
    bc: List[str] = []
    b = BREADCRUMB_RE.search(html)
    if b:
        chunk = b.group(1)
        for raw in re.findall(r">([^<>\n]+)<", chunk):
            t = raw.strip()
            if t and len(t) < 80 and t.upper() not in SKIP_BREADCRUMB:
                bc.append(t)

    # Last entry is usually the product name; drop it
    name = ""
    nm = PRODUCT_NAME_RE.search(html)
    if nm:
        name = nm.group(1).strip()
    if bc and bc[-1].strip().lower() == name.lower():
        bc = bc[:-1]

    if not gtin and not bc:
        return None

    return {
        "name": name,
        "gtin": gtin,
        "category_1": BRAND_L1,
        "category_2": bc[0] if len(bc) > 0 else "",
        "category_3": bc[1] if len(bc) > 1 else "",
    }


def crawl_catalog(delay: float = 0.25) -> List[Dict]:
    urls = fetch_product_urls()
    print(f"  sitemap urls: {len(urls)}")
    out: List[Dict] = []
    fail = 0
    for i, url in enumerate(urls, 1):
        try:
            html = _curl_bytes(url).decode("utf-8", "ignore")
            entry = extract_product(html)
            if entry and entry.get("gtin"):
                entry["source_url"] = url
                out.append(entry)
            else:
                fail += 1
        except Exception as e:
            fail += 1
        if i % 50 == 0 or i == len(urls):
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
        gt = (it.get("gtin") or "").strip()
        if not gt:
            continue
        out[gt] = it
        s = gt.lstrip("0")
        if s and s != gt:
            out[s] = it
    return out


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--refresh-catalog", action="store_true")
    p.add_argument("--mode", choices=["inactive","active-fill","all"], default="all")
    p.add_argument("--report-path", default="/app/mam_enrichment_report.json")
    return p.parse_args()


def mongo_db():
    u = os.getenv("MONGO_USER"); pw = os.getenv("MONGO_PASSWORD")
    host = os.getenv("MONGO_HOST","mongodb"); port = int(os.getenv("MONGO_PORT","27017"))
    c = MongoClient(f"mongodb://{u}:{pw}@{host}:{port}")
    return c, c[os.getenv("MONGO_DB","imageDB")]


def main():
    args = parse_args()
    load_dotenv("/app/.env")

    print({"stage":"load_catalog","refresh":args.refresh_catalog})
    cat = load_catalog(force_refresh=args.refresh_catalog)
    print({"stage":"load_catalog","items":len(cat)})
    bmap = build_barcode_map(cat)

    client, db = mongo_db()
    try:
        base = {"Title": {"$regex": "^MAM\\b", "$options": "i"}}
        if args.mode == "inactive":
            q = {**base, "cms_status": "inactive"}
        elif args.mode == "active-fill":
            q = {**base, "cms_status": "active",
                 "$or":[{"Category_2":{"$exists":False}},{"Category_2":""}]}
        else:
            q = base

        stats = {"examined":0, "matched":0, "missed":0, "would_activate":0, "modified":0}
        rows: List[Dict] = []
        ops: List[UpdateOne] = []
        for doc in db.products.find(q):
            stats["examined"] += 1
            bc = str(doc.get("Barcode","") or "").strip()
            entry = bmap.get(bc) or bmap.get(bc.lstrip("0"))
            if not entry:
                stats["missed"] += 1
                continue
            stats["matched"] += 1

            updates: Dict[str,object] = {
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }
            fill_only = args.mode == "active-fill"
            existing_c1 = str(doc.get("Category_1","") or "").strip()
            existing_c2 = str(doc.get("Category_2","") or "").strip()
            existing_c3 = str(doc.get("Category_3","") or "").strip()
            if entry.get("category_1") and (not fill_only or not existing_c1):
                updates["Category_1"] = entry["category_1"]
            if entry.get("category_2") and (not fill_only or not existing_c2):
                updates["Category_2"] = entry["category_2"]
            if entry.get("category_3") and (not fill_only or not existing_c3):
                updates["Category_3"] = entry["category_3"]

            cand = dict(doc); cand.update(updates)
            updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR))
            if doc.get("cms_status") == "inactive" and updates.get("cms_status") == "active":
                stats["would_activate"] += 1
            rows.append({
                "barcode": bc, "title": (doc.get("Title","") or "")[:80],
                "name": entry.get("name"),
                "c2": entry.get("category_2"), "c3": entry.get("category_3"),
                "result_status": updates.get("cms_status"),
            })
            ops.append(UpdateOne({"_id":doc["_id"]},{"$set":updates},upsert=False))

        if not args.dry_run and ops:
            for i in range(0, len(ops), 500):
                r = db.products.bulk_write(ops[i:i+500], ordered=False)
                stats["modified"] += r.modified_count

        with open(args.report_path, "w", encoding="utf-8") as f:
            json.dump({"stats":stats, "rows":rows[:100]}, f, ensure_ascii=False, indent=2)
        print({"summary":stats, "report":args.report_path})
    finally:
        client.close()


if __name__ == "__main__":
    main()
