"""Chicco brand enrichment (Shopify-like API, Greek product_type)."""

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


PRODUCTS_URL = "https://chicco.gr/products.json"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
BRAND_L1 = "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ"
EVALUATOR = "automation:brand_enrichment:chicco"
CACHE_PATH = "/app/brand_catalog_chicco.json"

GREEKLISH_DIGRAPHS = [
    ("ou", "ου"), ("ai", "αι"), ("ei", "ει"), ("oi", "οι"),
    ("th", "θ"), ("ps", "ψ"), ("ch", "χ"), ("ks", "ξ"),
    ("mp", "μπ"), ("nt", "ντ"), ("gk", "γκ"), ("tz", "τζ"), ("ts", "τσ"),
]
GREEKLISH_LETTERS = {
    "a":"α","b":"β","g":"γ","d":"δ","e":"ε","z":"ζ","h":"η","i":"ι","k":"κ",
    "l":"λ","m":"μ","n":"ν","x":"ξ","o":"ο","p":"π","r":"ρ","s":"σ","t":"τ",
    "y":"υ","u":"υ","f":"φ","v":"β","w":"ω","j":"ι","c":"κ",
}
PHONETIC_FOLD = str.maketrans({"η":"ι","υ":"ι","ω":"ο","ς":"σ","ϊ":"ι","ΰ":"ι","ϋ":"ι","ΐ":"ι"})

SIZE_RE = re.compile(r"\b\d+[\s\.,]?\d*\s?(ml|ML|gr|GR|g|G|τεμ|τμχ|m|μ|χ|x)\b")
NOISE_RE = re.compile(r"[/\-,\.():&·•\[\]\"']")


def curl_json(url: str, params: Dict[str, str]) -> Dict:
    pairs = "&".join(f"{k}={v}" for k, v in params.items())
    full = f"{url}?{pairs}"
    r = subprocess.run(
        ["curl", "-sL", "-A", USER_AGENT, full, "--max-time", "30"],
        capture_output=True, check=False, timeout=35,
    )
    if r.returncode != 0:
        raise RuntimeError("curl failed")
    return json.loads(r.stdout.decode("utf-8"))


def fetch_catalog() -> List[Dict]:
    items: List[Dict] = []
    page = 1
    while True:
        data = curl_json(PRODUCTS_URL, {"limit": "250", "page": str(page)})
        prods = data.get("products") or []
        if not prods:
            break
        items.extend(prods)
        print(f"  page {page}: {len(prods)} (total {len(items)})", flush=True)
        if len(prods) < 250:
            break
        page += 1
        time.sleep(0.5)
    return items


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
    t = t.replace("chicco", " ")
    t = SIZE_RE.sub(" ", t)
    t = NOISE_RE.sub(" ", t)
    t = translit(t)
    t = strip_accents(t)
    t = t.translate(PHONETIC_FOLD)
    return {tok for tok in t.split() if len(tok) >= 3}


def score_match(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = a & b
    union = a | b
    j = len(inter) / len(union)
    coverage = len(inter) / len(b)
    return round(0.6 * j + 0.4 * coverage, 4)


def build_index(items: List[Dict]) -> List[Dict]:
    out: List[Dict] = []
    for it in items:
        title = (it.get("title") or "").strip()
        if not title:
            continue
        pt = (it.get("product_type") or "").strip()
        handle = (it.get("handle") or "").strip()
        source_url = f"https://chicco.gr/products/{handle}" if handle else ""
        out.append({
            "title": title,
            "handle": handle,
            "source_url": source_url,
            "product_type": pt,
            "tokens": normalize_title(title),
        })
    return out


def find_match(our_title: str, idx: List[Dict]) -> Tuple[Optional[Dict], float]:
    ours = normalize_title(our_title)
    best, best_score = None, 0.0
    for e in idx:
        s = score_match(ours, e["tokens"])
        if s > best_score:
            best, best_score = e, s
    return best, best_score


def confidence_label(s: float) -> str:
    if s >= 0.6: return "high"
    if s >= 0.4: return "medium"
    if s >= 0.25: return "low"
    return "none"


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--refresh-catalog", action="store_true")
    p.add_argument("--min-score", type=float, default=0.4)
    p.add_argument("--mode", choices=["inactive","active-fill","all"], default="inactive")
    p.add_argument("--report-path", default="/app/chicco_enrichment_report.json")
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
        base = {"Title": {"$regex": "CHICCO", "$options": "i"}}
        if args.mode == "inactive":
            q = {**base, "cms_status": "inactive"}
        elif args.mode == "active-fill":
            q = {**base, "cms_status": "active",
                 "$or": [{"Category_2":{"$exists":False}},{"Category_2":""}]}
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
            m, sc = find_match(ot, idx)
            conf = confidence_label(sc)
            stats["by_confidence"][conf] += 1

            updates: Dict[str,object] = {
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            }
            fill_only = args.mode == "active-fill"
            existing_c1 = str(doc.get("Category_1","") or "").strip()
            existing_c2 = str(doc.get("Category_2","") or "").strip()
            if args.mode != "active-fill":
                updates["Category_1"] = BRAND_L1
            elif not existing_c1:
                updates["Category_1"] = BRAND_L1

            matched_info = None
            if m and sc >= args.min_score and m.get("product_type"):
                if (not fill_only or not existing_c2):
                    updates["Category_2"] = m["product_type"]
                matched_info = {"title": m["title"], "score": sc, "product_type": m["product_type"]}
                stats["with_l2"] += 1
            else:
                stats["with_l1_only"] += 1

            candidate = dict(doc); candidate.update(updates)
            updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR))
            if doc.get("cms_status") == "inactive" and updates.get("cms_status") == "active":
                stats["would_activate"] += 1

            rows.append({
                "barcode": doc.get("Barcode"),
                "title": (ot or "")[:80],
                "score": sc, "confidence": conf,
                "matched": matched_info,
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
