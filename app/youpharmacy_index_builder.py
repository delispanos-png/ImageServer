"""CLI worker that builds the youpharmacy barcode → URL index.

Two phases:
  1) Discover every product URL by crawling all sitemap pages
     (/sitemap.xml lists 38 product-sitemap{N}.xml files; each lists
     ~150 product URLs). Upserts into `youpharmacy_url_index`.
  2) For every pending URL, fetch the product page through FlareSolverr,
     extract the EAN/barcode + title + brand from the rendered HTML, and
     persist the mapping. Skips entries we've already barcoded.

Designed to be re-runnable. New products added since the last refresh
are picked up automatically; barcoded URLs are not refetched unless
forced.

Usage:
    python /app/youpharmacy_index_builder.py [--phase=sitemap|barcodes|all]
                                             [--batch=100] [--max-batches=N]
                                             [--rate-delay=2.0]
"""
from __future__ import annotations

import argparse
import asyncio
import os
import re
import sys
import time
from html import unescape
from typing import List

sys.path.insert(0, "/app")

from pymongo import AsyncMongoClient

from flaresolverr_client import get as flaresolverr_get
from youpharmacy_url_index import (
    attach_barcode,
    ensure_indexes,
    lookup_url_for_barcode,
    mark_error,
    mark_no_barcode,
    next_pending_batch,
    stats,
    upsert_urls,
)

_MONGO_USER = os.getenv("MONGO_USER", "")
_MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "")
_MONGO_HOST = os.getenv("MONGO_HOST", "mongodb")
_MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
_MONGO_DB = os.getenv("MONGO_DB", "imageDB")
_MONGO_URI = f"mongodb://{_MONGO_USER}:{_MONGO_PASSWORD}@{_MONGO_HOST}:{_MONGO_PORT}"

_BASE_URL = "https://www.youpharmacy.gr"
_SITEMAP_INDEX_URL = f"{_BASE_URL}/sitemap.xml"

_PRODUCT_URL_RE = re.compile(
    r"https?://(?:www\.)?youpharmacy\.gr/product/[a-z0-9\-]+/?", re.I
)
_SITEMAP_URL_RE = re.compile(
    r"https?://(?:www\.)?youpharmacy\.gr/(?:product[a-z_]*-sitemap[0-9]*\.xml)", re.I
)


async def _fetch_via_flaresolverr(url: str, *, timeout_ms: int = 45000) -> str:
    try:
        solution = await flaresolverr_get(url, max_timeout_ms=timeout_ms)
    except BaseException as exc:
        print(f"  fs error for {url}: {type(exc).__name__}: {exc}", flush=True)
        return ""
    html = (solution or {}).get("response") or ""
    return html if isinstance(html, str) else ""


def _decode_html_payload(raw: str) -> str:
    """FlareSolverr wraps XML responses in <html><body><pre>...</pre>… or
    renders them as DOM. Decode entities so we can regex out URLs cleanly.
    """
    return unescape(raw)


async def discover_sitemap_urls() -> List[str]:
    """Phase 1: download sitemap index → discover all product-sitemap*.xml,
    then download each sub-sitemap and collect product URLs.
    """
    print(f"Fetching sitemap index: {_SITEMAP_INDEX_URL}", flush=True)
    index_html = await _fetch_via_flaresolverr(_SITEMAP_INDEX_URL)
    if not index_html:
        print("  ✗ could not load sitemap index", flush=True)
        return []
    index_decoded = _decode_html_payload(index_html)
    sitemap_urls = sorted(set(_SITEMAP_URL_RE.findall(index_decoded)))
    product_sitemaps = [u for u in sitemap_urls if "product-sitemap" in u]
    print(f"  found {len(product_sitemaps)} product sitemaps", flush=True)

    all_product_urls: List[str] = []
    for i, sitemap_url in enumerate(product_sitemaps, start=1):
        html = await _fetch_via_flaresolverr(sitemap_url)
        if not html:
            print(f"  [{i}/{len(product_sitemaps)}] ✗ {sitemap_url}", flush=True)
            continue
        decoded = _decode_html_payload(html)
        urls = sorted(set(_PRODUCT_URL_RE.findall(decoded)))
        all_product_urls.extend(urls)
        print(f"  [{i}/{len(product_sitemaps)}] {sitemap_url} → {len(urls)} urls", flush=True)

    return sorted(set(all_product_urls))


_EAN_PATTERNS = [
    re.compile(r'data-ean=["\'](\d{8,14})["\']', re.I),
    re.compile(r'"ean(?:13|14)?"\s*:\s*"(\d{8,14})"', re.I),
    re.compile(r'"gtin(?:8|12|13|14)?"\s*:\s*"(\d{8,14})"', re.I),
    re.compile(r'"sku"\s*:\s*"(\d{8,14})"', re.I),
    re.compile(r'itemprop=["\']gtin13["\'][^>]*content=["\'](\d{8,14})["\']', re.I),
    re.compile(r'itemprop=["\']gtin14["\'][^>]*content=["\'](\d{8,14})["\']', re.I),
    # Final fallback: a 13-digit number rendered near "Barcode" / "EAN".
    re.compile(r'(?:barcode|ean|gtin)[^<>"]{0,80}(\d{13})', re.I),
    # Fallback to image filename (variants always use {gtin}_{N}.{ext}).
    re.compile(r'/wp-content/uploads/[^"\']*?(\d{13})_\d+\.(?:jpe?g|png|webp)', re.I),
]


def _extract_barcode(page_html: str) -> str:
    for pattern in _EAN_PATTERNS:
        match = pattern.search(page_html or "")
        if not match:
            continue
        candidate = match.group(1).strip()
        if len(candidate) in (8, 12, 13, 14):
            return candidate
    return ""


def _extract_title(page_html: str) -> str:
    m = re.search(r"<h1[^>]*>([^<]+)</h1>", page_html or "")
    if m:
        return m.group(1).strip()
    return ""


def _extract_brand(page_html: str) -> str:
    for pattern in (
        re.compile(r'itemprop="brand"[^>]*content="([^"]+)"', re.I),
        re.compile(r'"brand"\s*:\s*"([^"]+)"', re.I),
        re.compile(r'<meta[^>]+property=["\']product:brand["\'][^>]+content=["\']([^"\']+)["\']', re.I),
    ):
        m = pattern.search(page_html or "")
        if m:
            return m.group(1).strip()
    return ""


async def discover_barcodes_phase(db, *, batch_size: int, max_batches: int, rate_delay: float) -> None:
    """Phase 2: walk pending URLs, fetch each, extract barcode."""
    processed = 0
    batches_done = 0
    while True:
        if max_batches and batches_done >= max_batches:
            print(f"[stop] hit max_batches={max_batches}", flush=True)
            break
        batch = await next_pending_batch(db, limit=batch_size)
        if not batch:
            print("[done] no more pending URLs", flush=True)
            break
        for doc in batch:
            url = str(doc.get("url", "")).strip()
            if not url:
                continue
            html = await _fetch_via_flaresolverr(url)
            if not html:
                await mark_error(db, url, reason="empty FlareSolverr response")
                print(f"  ✗ {url}: empty", flush=True)
                await asyncio.sleep(rate_delay)
                continue
            barcode = _extract_barcode(html)
            if not barcode:
                await mark_no_barcode(db, url)
                print(f"  · {url}: no barcode in page", flush=True)
                await asyncio.sleep(rate_delay)
                continue
            await attach_barcode(
                db,
                url,
                barcode=barcode,
                title=_extract_title(html),
                brand=_extract_brand(html),
            )
            processed += 1
            print(f"  ✓ {url} → {barcode}", flush=True)
            await asyncio.sleep(rate_delay)
        batches_done += 1
        s = await stats(db)
        print(f"[progress] batches={batches_done} processed={processed} "
              f"total={s['total']} barcoded={s['barcoded']} "
              f"pending={s['pending']} no_barcode={s['no_barcode']} error={s['error']}",
              flush=True)


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", choices=["sitemap", "barcodes", "all"], default="all")
    parser.add_argument("--batch", type=int, default=50)
    parser.add_argument("--max-batches", type=int, default=0)
    parser.add_argument("--rate-delay", type=float, default=2.5)
    args = parser.parse_args()

    client = AsyncMongoClient(_MONGO_URI)
    db = client[_MONGO_DB]
    await ensure_indexes(db)

    if args.phase in ("sitemap", "all"):
        urls = await discover_sitemap_urls()
        if urls:
            res = await upsert_urls(db, urls)
            print(f"[sitemap] seen={res['seen']} new={res['inserted']}", flush=True)
        else:
            print("[sitemap] nothing discovered", flush=True)

    if args.phase in ("barcodes", "all"):
        print(f"[barcodes] batch={args.batch} max_batches={args.max_batches} "
              f"rate_delay={args.rate_delay}s", flush=True)
        await discover_barcodes_phase(
            db,
            batch_size=args.batch,
            max_batches=args.max_batches,
            rate_delay=args.rate_delay,
        )

    final = await stats(db)
    print(f"[final] {final}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
