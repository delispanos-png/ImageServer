"""Thin async client for FlareSolverr.

FlareSolverr (https://github.com/FlareSolverr/FlareSolverr) is a Cloudflare
bypass proxy that runs a headless browser internally. We POST a JSON
request and get back the resolved HTML.

Used by sources whose origin sits behind Cloudflare Turnstile that even
our Playwright stack can't beat (e.g. newgenpharmacy.gr). For everything
else, prefer the direct fetchers in skroutzFetch.py.

Set `FLARESOLVERR_URL` in the container env (defaults to the docker
compose service name). Returns {} on failure so callers can fall back.
"""
from __future__ import annotations

import os
from typing import Any, Dict, Optional

import httpx


_DEFAULT_URL = "http://flaresolverr:8191/v1"
_DEFAULT_TIMEOUT_MS = 60000
_HTTP_TIMEOUT_SECONDS = 90.0


def get_endpoint() -> str:
    return os.getenv("FLARESOLVERR_URL", _DEFAULT_URL).strip() or _DEFAULT_URL


def is_configured() -> bool:
    return bool(get_endpoint())


async def get(
    url: str,
    *,
    max_timeout_ms: int = _DEFAULT_TIMEOUT_MS,
    session: Optional[str] = None,
    cookies: Optional[list] = None,
) -> Dict[str, Any]:
    """Run a Cloudflare-bypassing GET. Returns a dict with at least
    `status`, `url`, `response` (HTML body) on success.
    """
    endpoint = get_endpoint()
    body: Dict[str, Any] = {
        "cmd": "request.get",
        "url": url,
        "maxTimeout": int(max_timeout_ms),
    }
    if session:
        body["session"] = session
    if cookies:
        body["cookies"] = cookies

    try:
        async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT_SECONDS) as client:
            response = await client.post(endpoint, json=body)
            if response.status_code != 200:
                return {}
            payload = response.json()
            if payload.get("status") != "ok":
                return {}
            return payload.get("solution") or {}
    except Exception as exc:
        print(f"FlareSolverr GET failed for {url[:80]}: {exc}", flush=True)
        return {}
