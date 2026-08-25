"""Anubis (techaro.lol) Proof-of-Work challenge solver.

ofarmakopoiosmou.gr started serving product pages behind Anubis in 2026. The
challenge page contains an `anubis_challenge` script tag with the random
data + difficulty. We compute a nonce such that
SHA256(random_data + str(nonce)) has at least `difficulty` leading zero hex
characters, then submit the (nonce, hash) pair to
`/.within.website/x/cmd/anubis/api/pass-challenge` to receive the success
cookie. The success cookie is then reused on subsequent requests so we don't
re-solve for every page.

Public docs: https://github.com/TecharoHQ/anubis
"""
from __future__ import annotations

import hashlib
import json
import re
import time
from typing import Optional, Tuple
from urllib.parse import urlencode, urlparse

import aiohttp

ANUBIS_CHALLENGE_RE = re.compile(
    r'<script id="anubis_challenge"[^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)
ANUBIS_VERSION_RE = re.compile(
    r'<script id="anubis_version"[^>]*>"?([0-9.]+)"?</script>', re.IGNORECASE
)
ANUBIS_PASS_PATH = "/.within.website/x/cmd/anubis/api/pass-challenge"
ANUBIS_SUCCESS_COOKIE = "techaro.lol-anubis-cookie-verification"

DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
)


def _solve_pow(random_data: str, difficulty: int, max_attempts: int = 50_000_000) -> Tuple[int, str]:
    """Find a nonce such that SHA256(random_data + nonce) has at least
    `difficulty` leading zero hex characters. Pure Python; difficulty=4
    converges in <1s on commodity CPU.
    """
    target = "0" * int(difficulty)
    base = random_data.encode("utf-8")
    nonce = 0
    while nonce < max_attempts:
        digest = hashlib.sha256(base + str(nonce).encode("ascii")).hexdigest()
        if digest.startswith(target):
            return nonce, digest
        nonce += 1
    raise RuntimeError(f"Anubis PoW exhausted after {max_attempts} attempts")


def looks_like_anubis_challenge(html: str) -> bool:
    return bool(html and "anubis_challenge" in html)


def extract_anubis_challenge(html: str) -> Optional[dict]:
    """Return the {rules, challenge} dict embedded in the Anubis page, or None."""
    m = ANUBIS_CHALLENGE_RE.search(html or "")
    if not m:
        return None
    try:
        return json.loads(m.group(1).strip())
    except json.JSONDecodeError:
        return None


async def solve_and_fetch(
    url: str,
    *,
    user_agent: str = DEFAULT_USER_AGENT,
    timeout_seconds: float = 25.0,
    extra_headers: Optional[dict] = None,
    existing_cookie_jar: Optional[aiohttp.CookieJar] = None,
) -> Tuple[str, aiohttp.CookieJar]:
    """Fetch a URL behind an Anubis challenge.

    Returns (final_html, cookie_jar). Pass the jar back in on the next call
    via `existing_cookie_jar` to skip the PoW round-trip when the success
    cookie is still valid.
    """
    parsed = urlparse(url)
    origin = f"{parsed.scheme}://{parsed.netloc}"

    headers = {
        "User-Agent": user_agent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
    }
    if extra_headers:
        headers.update(extra_headers)

    jar = existing_cookie_jar or aiohttp.CookieJar(unsafe=True)
    timeout = aiohttp.ClientTimeout(total=timeout_seconds)

    async with aiohttp.ClientSession(headers=headers, cookie_jar=jar, timeout=timeout) as session:
        async with session.get(url, allow_redirects=True) as response:
            html = await response.text()

        if not looks_like_anubis_challenge(html):
            return html, jar

        challenge = extract_anubis_challenge(html)
        if not challenge:
            return html, jar

        rules = challenge.get("rules") or {}
        ch = challenge.get("challenge") or {}
        algo = (rules.get("algorithm") or "").lower()
        difficulty = int(rules.get("difficulty") or 0)
        random_data = str(ch.get("randomData") or "")
        challenge_id = str(ch.get("id") or "")

        if algo != "fast":
            raise RuntimeError(f"Anubis algorithm '{algo}' not supported by this solver")
        if not random_data or not challenge_id or difficulty <= 0:
            raise RuntimeError("Anubis challenge payload missing required fields")

        started_at_ms = int(time.time() * 1000)
        nonce, digest = _solve_pow(random_data, difficulty)
        elapsed_ms = max(1, int(time.time() * 1000) - started_at_ms)

        params = {
            "id": challenge_id,
            "response": digest,
            "nonce": str(nonce),
            "redir": url,
            "elapsedTime": str(elapsed_ms),
        }
        pass_url = f"{origin}{ANUBIS_PASS_PATH}?{urlencode(params)}"

        async with session.get(pass_url, allow_redirects=True) as response:
            final_html = await response.text()

        if looks_like_anubis_challenge(final_html):
            raise RuntimeError(
                "Anubis still presented a challenge after PoW submission "
                f"(difficulty={difficulty})"
            )
        return final_html, jar


def serialize_cookie_jar(jar: aiohttp.CookieJar) -> dict:
    """Compact serialization of an aiohttp CookieJar for cross-process caching."""
    out: dict = {}
    for cookie in jar:
        out[cookie.key] = {
            "value": cookie.value,
            "domain": cookie["domain"],
            "path": cookie["path"],
            "expires": cookie["expires"],
        }
    return out
