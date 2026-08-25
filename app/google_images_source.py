"""
Google Custom Search JSON API integration for product image lookup.

Setup:
  1. Create a Google Cloud project + enable Custom Search API
  2. Get an API key
  3. Create a Custom Search Engine at https://programmablesearchengine.google.com/
     Set it to search the whole web and enable Image Search
  4. Set env vars:
       GOOGLE_API_KEY=...
       GOOGLE_CSE_ID=...
       GOOGLE_IMAGES_BLOCKED_DOMAINS=vita4you.gr,ofarmakopoiosmou.gr   (optional, comma-separated)
       GOOGLE_IMAGES_DAILY_BUDGET=200   (optional, soft cap on queries/day)

Pricing reminder: 100 queries/day free, then $5 per 1000 queries.
"""
from __future__ import annotations

import asyncio
import os
from datetime import date
from typing import Any, Dict, List
from urllib.parse import urlparse

import httpx

_API_ENDPOINT = "https://www.googleapis.com/customsearch/v1"
_USAGE_LOCK = asyncio.Lock()
_USAGE_DATE: date | None = None
_USAGE_COUNT = 0


def _blocked_domains() -> set[str]:
    raw = os.getenv("GOOGLE_IMAGES_BLOCKED_DOMAINS", "")
    return {d.strip().lower() for d in raw.split(",") if d.strip()}


def _domain_of(url: str) -> str:
    try:
        host = urlparse(url).netloc.lower()
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        return ""


def _is_blocked(url: str) -> bool:
    host = _domain_of(url)
    if not host:
        return False
    for blocked in _blocked_domains():
        if host == blocked or host.endswith("." + blocked):
            return True
    return False


def is_configured() -> bool:
    return bool(os.getenv("GOOGLE_API_KEY", "").strip() and os.getenv("GOOGLE_CSE_ID", "").strip())


def get_daily_budget() -> int:
    try:
        return max(0, int(os.getenv("GOOGLE_IMAGES_DAILY_BUDGET", "200")))
    except (TypeError, ValueError):
        return 200


async def _check_budget_and_inc() -> bool:
    global _USAGE_DATE, _USAGE_COUNT
    async with _USAGE_LOCK:
        today = date.today()
        if _USAGE_DATE != today:
            _USAGE_DATE = today
            _USAGE_COUNT = 0
        budget = get_daily_budget()
        if budget and _USAGE_COUNT >= budget:
            return False
        _USAGE_COUNT += 1
        return True


async def search_image_urls(query: str, *, limit: int = 5) -> List[str]:
    """Return up to N image URLs from Google Custom Search for the given query.

    Filters out:
      - URLs from blocklisted domains (GOOGLE_IMAGES_BLOCKED_DOMAINS)
      - Non-image URLs
    """
    if not is_configured():
        return []
    if not query or not query.strip():
        return []
    if not await _check_budget_and_inc():
        print("Google Images daily budget exhausted")
        return []

    params = {
        "key": os.environ["GOOGLE_API_KEY"].strip(),
        "cx": os.environ["GOOGLE_CSE_ID"].strip(),
        "q": query.strip(),
        "searchType": "image",
        "num": min(10, max(1, int(limit))),
        "safe": "off",
        "imgType": "photo",
    }
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(_API_ENDPOINT, params=params)
            if resp.status_code != 200:
                print(f"Google CSE returned {resp.status_code}: {resp.text[:200]}")
                return []
            payload = resp.json()
    except Exception as exc:
        print(f"Google CSE call failed: {exc}")
        return []

    urls: List[str] = []
    for item in payload.get("items", []) or []:
        link = str(item.get("link", "")).strip()
        if not link:
            continue
        if _is_blocked(link):
            continue
        urls.append(link)
        if len(urls) >= int(limit):
            break
    return urls


async def fetch_from_google_images(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
    **_kwargs: Any,
) -> Dict[str, Any]:
    """Source-chain compatible fetcher.

    Returns a product dict with Site/Img_src/Img_src_List for the chain to consume.
    Text fields are empty — Google only contributes images.
    """
    if not download_images:
        return {}
    if not is_configured():
        return {}

    queries: List[str] = [str(barcode).strip()]
    for term in search_terms or []:
        t = str(term).strip()
        if t and t not in queries:
            queries.append(t)

    image_urls: List[str] = []
    for q in queries:
        candidates = await search_image_urls(q, limit=5)
        for u in candidates:
            if u not in image_urls:
                image_urls.append(u)
        if image_urls:
            break

    if not image_urls:
        return {}

    return {
        "Barcode": str(barcode).strip(),
        "Site": "google_images",
        "last_source": "google_images",
        "Img_src": image_urls[0],
        "Img_src_List": image_urls,
    }
