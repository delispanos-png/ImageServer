"""Lamberts brand enrichment via WooCommerce/WP REST.

lamberts.gr exposes /wp-json/wp/v2/product (210 products) with
product_cat IDs. Categories fetched via /wp-json/wp/v2/product_cat.
No barcode in API → title-based fuzzy match.
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
import html as html_lib
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402


BASE = "https://lamberts.gr/wp-json/wp/v2"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
BRAND_L1 = "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ"
EVALUATOR = "automation:brand_enrichment:lamberts"
CACHE_PATH = "/app/brand_catalog_lamberts.json"

GREEKLISH_DIGRAPHS = [
    ("ou","ου"),("ai","αι"),("ei","ει"),("oi","οι"),
    ("th","θ"),("ps","ψ"),("ch","χ"),("ks","ξ"),
    ("mp","μπ"),("nt","ντ"),("gk","γκ"),("tz","τζ"),("ts","τσ"),
]
GREEKLISH_LETTERS = {
    "a":"α","b":"β","g":"γ","d":"δ","e":"ε","z":"ζ","h":"η","i":"ι","k":"κ",
    "l":"λ","m":"μ","n":"ν","x":"ξ","o":"ο","p":"π","r":"ρ","s":"σ","t":"τ",
    "y":"υ","u":"υ","f":"φ","v":"β","w":"ω","j":"ι","c":"κ",
}
PHONETIC = str.maketrans({"η":"ι","υ":"ι","ω":"ο","ς":"σ","ϊ":"ι","ΰ":"ι","ϋ":"ι","ΐ":"ι"})

SIZE_RE = re.compile(r"\b\d+[\s\.,]?\d*\s?(ml|gr|g|mg|τεμ|τμχ|caps|tabs|capsules|tablets|μέρες)\b", re.I)
NOISE_RE = re.compile(r"[/\-,\.():&·•\[\]\"']")


def curl(url: str) -> str:
    r = subprocess.run(
        ["curl","-sL","-A",USER_AGENT,url,"--max-time","30"],
        capture_output=True, check=False, timeout=35,
    )
    if r.returncode != 0:
        return ""
    return r.stdout.decode("utf-8","ignore")


def fetch_categories() -> Dict[int, Dict]:
    out: Dict[int, Dict] = {}
    page = 1
    while True:
        url = f"{BASE}/product_cat?per_page=100&page={page}"
        txt = curl(url)
        try:
            arr = json.loads(txt)
        except Exception:
            break
        if not arr or not isinstance(arr, list):
            break
        for c in arr:
            out[c["id"]] = {
                "id": c["id"],
                "parent": c.get("parent", 0),
                "name": html_lib.unescape(c.get("name", "")),
                "slug": c.get("slug", ""),
            }
        if len(arr) < 100:
            break
        page += 1
        time.sleep(0.3)
    return out


def build_category_path(cat_id: int, cats: Dict[int, Dict]) -> List[str]:
    """Walk up to root and return [root, ..., leaf]."""
    path: List[str] = []
    seen = set()
    cur = cats.get(cat_id)
    while cur and cur["id"] not in seen:
        seen.add(cur["id"])
        path.insert(0, cur["name"])
        parent = cur.get("parent", 0)
        cur = cats.get(parent) if parent else None
    return path


def fetch_products() -> List[Dict]:
    out: List[Dict] = []
    page = 1
    while True:
        url = f"{BASE}/product?per_page=100&page={page}"
        txt = curl(url)
        try:
            arr = json.loads(txt)
        except Exception:
            break
        if not isinstance(arr, list) or not arr:
            break
        out.extend(arr)
        if len(arr) < 100:
            break
        page += 1
        time.sleep(0.3)
    return out


def fetch_catalog() -> List[Dict]:
    cats = fetch_categories()
    print(f"  categories: {len(cats)}")
    products = fetch_products()
    print(f"  products: {len(products)}")
    out: List[Dict] = []
    for p in products:
        title = html_lib.unescape((p.get("title", {}) or {}).get("rendered", ""))
        title = re.sub(r"<[^>]+>", "", title).strip()
        cat_ids = p.get("product_cat") or []
        # Get deepest category (longest path)
        best_path: List[str] = []
        for cid in cat_ids:
            path = build_category_path(cid, cats)
            if len(path) > len(best_path):
                best_path = path
        out.append({
            "title": title,
            "slug": p.get("slug", ""),
            "link": p.get("link", ""),
            "category_path": best_path,
        })
    return out


def load_catalog(force_refresh: bool = False) -> List[Dict]:
    if not force_refresh and os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, encoding="utf-8") as f:
            return json.load(f)
    items = fetch_catalog()
    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    return items


def translit(text: str) -> str:
    text = text.lower()
    for d, r in GREEKLISH_DIGRAPHS:
        text = text.replace(d, r)
    return "".join(GREEKLISH_LETTERS.get(c, c) for c in text)


def strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


def normalize_title(title: str) -> set:
    t = (title or "").lower()
    t = t.replace("lamberts", " ")
    t = SIZE_RE.sub(" ", t)
    t = NOISE_RE.sub(" ", t)
    t = translit(t)
    t = strip_accents(t)
    t = t.translate(PHONETIC)
    return {tok for tok in t.split() if len(tok) >= 3}


def score_match(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = a & b
    union = a | b
    return round(0.6 * (len(inter)/len(union)) + 0.4 * (len(inter)/len(b)), 4)


def build_index(items: List[Dict]) -> List[Dict]:
    out = []
    for it in items:
        title = it.get("title", "")
        if not title:
            continue
        out.append({
            "title": title,
            "source_url": (it.get("link") or "").strip(),
            "tokens": normalize_title(title),
            "category_path": it.get("category_path", []),
        })
    return out


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--refresh-catalog", action="store_true")
    p.add_argument("--min-score", type=float, default=0.4)
    p.add_argument("--mode", choices=["inactive","active-fill","all"], default="inactive")
    p.add_argument("--report-path", default="/app/lamberts_enrichment_report.json")
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
    idx = build_index(cat)
    print({"stage":"build_index","indexed":len(idx)})

    client, db = mongo_db()
    try:
        base = {"Title": {"$regex": "LAMBERTS", "$options": "i"}}
        if args.mode == "inactive":
            q = {**base, "cms_status": "inactive"}
        elif args.mode == "active-fill":
            q = {**base, "cms_status": "active",
                 "$or":[{"Category_2":{"$exists":False}},{"Category_2":""}]}
        else:
            q = base

        stats = {"examined":0,"with_l1_only":0,"with_l2":0,
                 "by_confidence":{"high":0,"medium":0,"low":0,"none":0},
                 "would_activate":0,"modified":0}
        rows: List[Dict] = []
        ops: List[UpdateOne] = []

        for doc in db.products.find(q):
            stats["examined"] += 1
            ot = doc.get("Title","")
            ours = normalize_title(ot)
            best, best_score = None, 0.0
            for e in idx:
                s = score_match(ours, e["tokens"])
                if s > best_score:
                    best, best_score = e, s
            if best_score >= 0.6: conf = "high"
            elif best_score >= 0.4: conf = "medium"
            elif best_score >= 0.25: conf = "low"
            else: conf = "none"
            stats["by_confidence"][conf] += 1

            updates: Dict[str,object] = {
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }
            fill_only = args.mode == "active-fill"
            existing_c1 = str(doc.get("Category_1","") or "").strip()
            existing_c2 = str(doc.get("Category_2","") or "").strip()
            existing_c3 = str(doc.get("Category_3","") or "").strip()
            if not fill_only or not existing_c1:
                updates["Category_1"] = BRAND_L1

            match_info = None
            if best and best_score >= args.min_score and best.get("category_path"):
                path = best["category_path"]
                # path is [root, ..., leaf]. Use top of path as L2, next as L3.
                if len(path) >= 1 and (not fill_only or not existing_c2):
                    updates["Category_2"] = path[0]
                if len(path) >= 2 and (not fill_only or not existing_c3):
                    updates["Category_3"] = path[1]
                match_info = {"title": best["title"], "score": best_score, "path": path}
                stats["with_l2"] += 1
            else:
                stats["with_l1_only"] += 1

            cand = dict(doc); cand.update(updates)
            updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR))
            if doc.get("cms_status") == "inactive" and updates.get("cms_status") == "active":
                stats["would_activate"] += 1
            rows.append({
                "barcode": doc.get("Barcode"),
                "title": (ot or "")[:80],
                "score": best_score, "confidence": conf,
                "matched": match_info,
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
