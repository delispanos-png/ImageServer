"""Cloudflare cache-purge helper for the CDN in front of image.cloudon.gr.

No-op when CLOUDFLARE_API_TOKEN / CLOUDFLARE_ZONE_ID are missing, so the app
still works if the token is not provisioned. Failures are logged but never
propagate — image mutation must not fail because the cache purge did.

The token needs "Zone.Cache Purge" permission scoped to image.cloudon.gr's
zone (or the parent cloudon.gr zone).
"""
from __future__ import annotations

import os
from typing import Iterable, List

import aiohttp

_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
_ZONE_ID = os.getenv("CLOUDFLARE_ZONE_ID", "").strip()
_IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


def is_configured() -> bool:
    return bool(_API_TOKEN and _ZONE_ID)


async def purge_urls(urls: Iterable[str]) -> bool:
    """Purge each URL from Cloudflare edge caches. Returns True on success.

    Silent no-op if not configured or url list is empty.
    """
    if not is_configured():
        return False
    unique_urls: List[str] = []
    seen = set()
    for raw in urls:
        u = str(raw or "").strip()
        if not u or u in seen:
            continue
        seen.add(u)
        unique_urls.append(u)
    if not unique_urls:
        return False

    # Cloudflare accepts up to 30 URLs per call on the free plan.
    headers = {
        "Authorization": f"Bearer {_API_TOKEN}",
        "Content-Type": "application/json",
    }
    endpoint = f"https://api.cloudflare.com/client/v4/zones/{_ZONE_ID}/purge_cache"
    success = True
    timeout = aiohttp.ClientTimeout(total=15)
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            for chunk_start in range(0, len(unique_urls), 30):
                chunk = unique_urls[chunk_start:chunk_start + 30]
                try:
                    async with session.post(endpoint, headers=headers, json={"files": chunk}) as resp:
                        if resp.status != 200:
                            body = await resp.text()
                            print(f"cloudflare purge failed status={resp.status} body={body[:200]}")
                            success = False
                except Exception as exc:
                    print(f"cloudflare purge chunk exception: {exc}")
                    success = False
    except Exception as exc:
        print(f"cloudflare purge session exception: {exc}")
        return False
    return success


def barcode_position_urls(barcode: str, position: int, base_url: str) -> List[str]:
    """Return every URL variant for a (barcode, position) that could still
    live in an edge/browser cache: bare `.jpg/.jpeg/.png/.webp` filenames.

    We purge all common extensions because the extension may have changed
    across replaces (e.g. `1.jpg` → `1.png`).
    """
    barcode = str(barcode or "").strip()
    if not barcode or position < 1:
        return []
    base = str(base_url or "").rstrip("/")
    if not base:
        return []
    return [f"{base}/{barcode}/{position}{ext}" for ext in _IMAGE_EXTENSIONS]


def barcode_all_positions_urls(barcode: str, max_position: int, base_url: str) -> List[str]:
    """Same as above but covers positions 1..max_position (used when
    renumbering after a delete may have shuffled filenames around)."""
    urls: List[str] = []
    for pos in range(1, max(1, max_position) + 1):
        urls.extend(barcode_position_urls(barcode, pos, base_url))
    return urls
