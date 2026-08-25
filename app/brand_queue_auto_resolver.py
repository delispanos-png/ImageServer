"""Auto-resolver for pending items in cms.pending_brand_imports.

For each queue item we try to find its barcode automatically. Two paths:

  1. source_url path (preferred): fetch the manufacturer product page and
     extract EAN/GTIN from structured data (JSON-LD, Open Graph, meta
     tags, or plain regex). ~95% of correct hits come from here.

  2. Reverse title search (fallback): hit a few pharmacy search endpoints
     with the queue title. If we get a single high-similarity result and
     that result page exposes a barcode, use it.

Actions per queue item, after we know (or don't know) the barcode:

  - barcode found AND already in db.products
      → mark queue row as `duplicate`, record resolved_to_barcode.
  - barcode found AND not in db.products
      → auto-approve: insert product via the same code path as the manual
        approve endpoint, mark queue row `approved`.
  - no barcode found AND seen_count >= AUTO_DISMISS_AFTER_SEEN
      → auto-dismiss with reason `no_barcode_after_repeated_scans`.
  - no barcode found otherwise
      → leave `pending`, bump seen_count via the existing brand sync.

Run:  docker exec fastapi python /app/brand_queue_auto_resolver.py [--dry-run]
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import quote_plus

import requests
from pymongo import MongoClient

# --- config ---------------------------------------------------------------

USER_AGENT = (
    "Mozilla/5.0 (Linux; auto-resolver) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
)
REQUEST_TIMEOUT = 12
AUTO_DISMISS_AFTER_SEEN = 5

# Numbers that look like EAN/UPC/GTIN (EAN-13, EAN-8, UPC-A, GTIN-14).
_BARCODE_RE = re.compile(r"\b(\d{8}|\d{12,14})\b")

# Common HTML patterns exposing a barcode value.
_META_BARCODE_PATTERNS = [
    re.compile(r'"gtin13"\s*:\s*"?(\d{8,14})"?', re.IGNORECASE),
    re.compile(r'"gtin14"\s*:\s*"?(\d{8,14})"?', re.IGNORECASE),
    re.compile(r'"gtin"\s*:\s*"?(\d{8,14})"?', re.IGNORECASE),
    re.compile(r'"ean"\s*:\s*"?(\d{8,14})"?', re.IGNORECASE),
    re.compile(r'"barcode"\s*:\s*"?(\d{8,14})"?', re.IGNORECASE),
    re.compile(r'"mpn"\s*:\s*"?(\d{8,14})"?', re.IGNORECASE),
    re.compile(r'itemprop=["\']gtin13["\'][^>]*content=["\'](\d{8,14})["\']', re.IGNORECASE),
    re.compile(r'itemprop=["\']gtin["\'][^>]*content=["\'](\d{8,14})["\']', re.IGNORECASE),
    re.compile(r'itemprop=["\']sku["\'][^>]*content=["\'](\d{8,14})["\']', re.IGNORECASE),
    re.compile(r'EAN[:\s]*</?\w*>\s*(\d{8,14})', re.IGNORECASE),
    re.compile(r'Barcode[:\s]*</?\w*>\s*(\d{8,14})', re.IGNORECASE),
    re.compile(r'Κωδικ[όο]ς\s+EAN[:\s]*</?\w*>\s*(\d{8,14})', re.IGNORECASE),
    re.compile(r'Γραμμωτ[όο]ς\s+κωδικ[όο]ς[:\s]*</?\w*>\s*(\d{8,14})', re.IGNORECASE),
]


def _http_get(url: str) -> Optional[str]:
    if not url or not url.startswith(("http://", "https://")):
        return None
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT},
                         timeout=REQUEST_TIMEOUT, allow_redirects=True)
        if r.status_code != 200:
            return None
        ct = r.headers.get("content-type", "").lower()
        if "html" not in ct and "json" not in ct and "text" not in ct:
            return None
        return r.text
    except Exception:
        return None


def _valid_barcode(bc: str) -> bool:
    if not bc or not bc.isdigit():
        return False
    n = len(bc)
    if n not in (8, 12, 13, 14):
        return False
    if bc == "0" * n:
        return False
    # Reject obvious IDs — SKU codes tend to start with padded 0s only if
    # they're 8-digit UPC-E; keep those. Otherwise a leading run of >3 zeros
    # is almost always a placeholder.
    if n >= 12 and bc.startswith("0000"):
        return False
    return True


def _extract_barcode_from_html(html_text: str) -> Optional[str]:
    if not html_text:
        return None
    for pattern in _META_BARCODE_PATTERNS:
        m = pattern.search(html_text)
        if m:
            candidate = m.group(1).strip()
            if _valid_barcode(candidate):
                return candidate
    # Try JSON-LD blocks — sometimes barcodes hide inside offers/product
    # entities with unusual key nesting.
    for block in re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html_text, re.IGNORECASE | re.DOTALL,
    ):
        try:
            data = json.loads(html.unescape(block.strip()))
        except Exception:
            continue

        def walk(node):
            if isinstance(node, dict):
                for k in ("gtin13", "gtin14", "gtin", "gtin12", "gtin8",
                          "ean", "barcode", "mpn", "sku"):
                    v = node.get(k)
                    if isinstance(v, (str, int)):
                        s = str(v).strip()
                        if _valid_barcode(s):
                            return s
                for v in node.values():
                    hit = walk(v)
                    if hit:
                        return hit
            elif isinstance(node, list):
                for v in node:
                    hit = walk(v)
                    if hit:
                        return hit
            return None

        hit = walk(data)
        if hit:
            return hit
    return None


# --- reverse title search -------------------------------------------------

def _title_similarity(a: str, b: str) -> float:
    """Cheap Jaccard on lowercased word sets."""
    def toks(s: str) -> set:
        s = s.lower()
        s = re.sub(r"[^a-zα-ωάέήίόύώϊϋΐΰ0-9\s]", " ", s)
        return {w for w in s.split() if len(w) > 2}
    ta, tb = toks(a), toks(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


_SKROUTZ_RESULT_RE = re.compile(
    r'<a[^>]+class="[^"]*js-sku-link[^"]*"[^>]+href="(?P<href>/s/\d+/[^"]+)"[^>]*>(?P<title>[^<]+)</a>',
    re.IGNORECASE,
)


def _search_skroutz_for_title(title: str, brand: str) -> Optional[str]:
    """Search Skroutz for the title, walk the first match's page for a
    barcode. Very light — plain requests, no Playwright."""
    query = f"{brand} {title}".strip()
    if not query:
        return None
    search_url = f"https://www.skroutz.gr/search?keyphrase={quote_plus(query)}"
    html_text = _http_get(search_url)
    if not html_text:
        return None
    for m in _SKROUTZ_RESULT_RE.finditer(html_text):
        result_title = html.unescape(m.group("title")).strip()
        if _title_similarity(title, result_title) < 0.5:
            continue
        product_url = "https://www.skroutz.gr" + m.group("href")
        product_html = _http_get(product_url)
        bc = _extract_barcode_from_html(product_html or "")
        if bc:
            return bc
        break  # only the top result — don't hammer Skroutz
    return None


# --- resolver -------------------------------------------------------------

def resolve_barcode(queue_doc: Dict) -> Tuple[Optional[str], str]:
    """Return (barcode, source_of_discovery). Source is one of:
    'source_url', 'skroutz_title_search', or '' if not found."""
    title = str(queue_doc.get("title") or "").strip()
    brand = str(queue_doc.get("brand") or "").strip()

    source_url = str(queue_doc.get("source_url") or "").strip()
    if source_url:
        html_text = _http_get(source_url)
        bc = _extract_barcode_from_html(html_text or "")
        if bc:
            return bc, "source_url"

    if title:
        bc = _search_skroutz_for_title(title, brand)
        if bc:
            return bc, "skroutz_title_search"

    return None, ""


# --- catalog inserter (mirrors the CMS approve endpoint) ------------------

def build_new_product(queue_doc: Dict, barcode: str, now_iso: str) -> Dict:
    brand_name = str(queue_doc.get("brand") or "")
    title = str(queue_doc.get("title") or "").strip()
    cats = queue_doc.get("categories") or {}
    c1 = str(cats.get("Category_1") or "").strip()
    c2 = str(cats.get("Category_2") or "").strip()
    c3 = str(cats.get("Category_3") or "").strip()
    return {
        "Barcode": barcode,
        "Site_Id": f"{brand_name}_auto_{barcode}",
        "Site": brand_name,
        "Title": title,
        "Description": "",
        "Brand": title.split()[0] if title else brand_name,
        "Category_1": c1,
        "Category_2": c2,
        "Category_3": c3,
        "Img_src": str(queue_doc.get("image") or ""),
        "Img_src_List": [str(queue_doc.get("image"))] if queue_doc.get("image") else [],
        "Product_Link": str(queue_doc.get("source_url") or ""),
        "Other_Sites": {},
        "cms_barcode": barcode,
        "cms_title": title,
        "cms_brand": title.split()[0] if title else brand_name,
        "cms_description": "",
        "cms_description_html": "",
        "cms_status": "inactive",
        "cms_main_image": "",
        "cms_updated_at": now_iso,
        "cms_updated_by": "cms:brand_queue:auto_resolver",
        "category_source_domain": brand_name,
        "text_source_domain": brand_name,
        "image_source_domain": brand_name,
        "image_processing_version": f"{brand_name}_auto_v1",
        "watermark_cleanup_applied": False,
        "image_reprocessed_at": now_iso,
        "brand_enrichment_source": "cms:brand_queue:auto_resolver",
        "brand_enrichment_at": now_iso,
    }


# --- main loop ------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Don't write to DB.")
    parser.add_argument("--limit", type=int, default=0, help="Cap items processed (0 = all).")
    parser.add_argument("--brand", default="", help="Only process this brand.")
    parser.add_argument("--skip-search", action="store_true",
                        help="Only look at source_url, don't fall back to Skroutz search.")
    args = parser.parse_args()

    u = os.getenv("MONGO_USER", "")
    p = os.getenv("MONGO_PASSWORD", "")
    db = MongoClient(f"mongodb://{u}:{p}@mongodb:27017")[os.getenv("MONGO_DB", "imageDB")]

    query: Dict = {"status": "pending"}
    if args.brand:
        query["brand"] = args.brand.lower()
    cursor = db.pending_brand_imports.find(query).sort("seen_count", -1)
    if args.limit:
        cursor = cursor.limit(args.limit)

    stats = {"scanned": 0, "resolved_via_url": 0, "resolved_via_search": 0,
             "auto_approved": 0, "auto_duplicate": 0, "auto_dismissed": 0,
             "still_pending": 0}
    now_iso = datetime.now(timezone.utc).isoformat()

    for qdoc in cursor:
        stats["scanned"] += 1
        seen_count = int(qdoc.get("seen_count") or 0)

        bc, source = resolve_barcode(qdoc) if not args.skip_search else (
            (_extract_barcode_from_html(_http_get(qdoc.get("source_url") or "") or ""), "source_url")
            if qdoc.get("source_url") else (None, "")
        )

        if bc:
            if source == "source_url":
                stats["resolved_via_url"] += 1
            else:
                stats["resolved_via_search"] += 1

            existing = db.products.find_one({"Barcode": bc}, {"_id": 1})
            if existing:
                if args.dry_run:
                    print(f"  [DRY] duplicate: {qdoc.get('brand')} / {qdoc.get('title')[:50]} → {bc}")
                else:
                    db.pending_brand_imports.update_one(
                        {"_id": qdoc["_id"]},
                        {"$set": {"status": "duplicate", "resolved_at": now_iso,
                                  "resolved_to_barcode": bc,
                                  "resolved_by": f"auto:{source}"}},
                    )
                stats["auto_duplicate"] += 1
            else:
                if args.dry_run:
                    print(f"  [DRY] approve: {qdoc.get('brand')} / {qdoc.get('title')[:50]} → {bc}")
                else:
                    new_product = build_new_product(qdoc, bc, now_iso)
                    db.products.insert_one(new_product)
                    db.pending_brand_imports.update_one(
                        {"_id": qdoc["_id"]},
                        {"$set": {"status": "approved", "resolved_at": now_iso,
                                  "resolved_to_barcode": bc,
                                  "resolved_by": f"auto:{source}"}},
                    )
                stats["auto_approved"] += 1
        else:
            if seen_count >= AUTO_DISMISS_AFTER_SEEN:
                if args.dry_run:
                    print(f"  [DRY] dismiss: {qdoc.get('brand')} / {qdoc.get('title')[:50]} (seen={seen_count})")
                else:
                    db.pending_brand_imports.update_one(
                        {"_id": qdoc["_id"]},
                        {"$set": {"status": "dismissed", "resolved_at": now_iso,
                                  "dismiss_reason": "no_barcode_after_repeated_scans",
                                  "resolved_by": "auto:seen_count_threshold"}},
                    )
                stats["auto_dismissed"] += 1
            else:
                stats["still_pending"] += 1

        if stats["scanned"] % 25 == 0:
            print(f"[{stats['scanned']}] approved={stats['auto_approved']} "
                  f"duplicate={stats['auto_duplicate']} dismissed={stats['auto_dismissed']} "
                  f"still_pending={stats['still_pending']}", flush=True)
        time.sleep(0.3)  # be polite

    print()
    print("=== auto-resolver stats ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
