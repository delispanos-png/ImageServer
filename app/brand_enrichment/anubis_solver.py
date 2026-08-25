"""Anubis (TrustServers) bot-protection bypass.

Anubis exposes a SHA-256 proof-of-work challenge:
  - Compute SHA-256(randomData + nonce_str)
  - Hash must have `difficulty` leading zero hex digits (= difficulty/2 full
    zero bytes + optional half-byte for odd difficulty)
  - Submit nonce + hash to /.within.website/x/cmd/anubis/api/pass-challenge
  - Receive an auth cookie usable for subsequent requests

Tested against ofarmakopoiosmou.gr (Anubis version 1.25.0, difficulty 4).
"""

from __future__ import annotations

import hashlib
import json
import re
import time
from typing import Dict, Optional, Tuple
from urllib.parse import urlencode

import requests


ANUBIS_CHALLENGE_RE = re.compile(
    r'<script id="anubis_challenge"[^>]*>(.*?)</script>', re.S | re.I
)
ANUBIS_PASS_PATH = "/.within.website/x/cmd/anubis/api/pass-challenge"

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def parse_challenge(html: str) -> Optional[Dict]:
    m = ANUBIS_CHALLENGE_RE.search(html)
    if not m:
        return None
    try:
        return json.loads(m.group(1).strip())
    except Exception:
        return None


def solve_pow(random_data: str, difficulty: int) -> Tuple[int, str]:
    """Find a nonce such that SHA-256(random_data + str(nonce)) has
    `difficulty` leading zero hex digits.

    Returns (nonce, hash_hex). Raises if no solution within reasonable bounds.
    """
    full_zero_bytes = difficulty // 2
    has_half = difficulty % 2 != 0
    target_prefix = b"\x00" * full_zero_bytes

    nonce = 0
    max_attempts = 1 << 24  # 16M, very generous
    data_bytes = random_data.encode("ascii")

    while nonce < max_attempts:
        candidate = data_bytes + str(nonce).encode("ascii")
        digest = hashlib.sha256(candidate).digest()
        if digest.startswith(target_prefix) and (not has_half or digest[full_zero_bytes] >> 4 == 0):
            return nonce, digest.hex()
        nonce += 1
    raise RuntimeError(f"PoW solve exceeded {max_attempts} attempts")


def get_anubis_cookie(
    target_url: str,
    *,
    timeout: int = 30,
    session: Optional[requests.Session] = None,
) -> Optional[requests.Session]:
    """Returns a requests.Session with the auth cookie set, or None if it failed."""
    if session is None:
        session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    # Step 1: fetch challenge page
    try:
        r = session.get(target_url, timeout=timeout)
    except Exception as exc:
        print(f"Anubis: failed to fetch challenge page: {exc}")
        return None

    challenge = parse_challenge(r.text)
    if not challenge:
        # No challenge — page is already accessible
        return session

    rules = challenge.get("rules") or {}
    ch = challenge.get("challenge") or {}
    difficulty = int(rules.get("difficulty", 4))
    random_data = ch.get("randomData", "")
    challenge_id = ch.get("id", "")
    if not random_data or not challenge_id:
        print("Anubis: missing fields in challenge")
        return None

    # Step 2: solve PoW
    start = time.time()
    try:
        nonce, hash_hex = solve_pow(random_data, difficulty)
    except Exception as exc:
        print(f"Anubis: PoW solve failed: {exc}")
        return None
    elapsed_ms = int((time.time() - start) * 1000)

    # Step 3: submit solution (browser uses GET via location.replace)
    parts = re.match(r"^(https?://[^/]+)", target_url)
    if not parts:
        return None
    origin = parts.group(1)
    redir = target_url
    params = {
        "id": challenge_id,
        "response": hash_hex,
        "nonce": str(nonce),
        "redir": redir,
        "elapsedTime": elapsed_ms,
    }
    pass_url = f"{origin}{ANUBIS_PASS_PATH}?{urlencode(params)}"
    try:
        r = session.get(pass_url, timeout=timeout, allow_redirects=True)
    except Exception as exc:
        print(f"Anubis: pass-challenge request failed: {exc}")
        return None

    # The auth cookie should now be in the session
    if any(c.name == "techaro.lol-anubis-auth" and c.value for c in session.cookies):
        return session
    print(f"Anubis: no auth cookie in response (HTTP {r.status_code})")
    return None


def fetch_protected(url: str, session: Optional[requests.Session] = None,
                    timeout: int = 30) -> Tuple[Optional[str], requests.Session]:
    """Fetch a URL behind Anubis. Returns (html_text, session).
    Reuses session cookies; only solves PoW if challenge is encountered.
    """
    if session is None:
        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT})
    try:
        r = session.get(url, timeout=timeout)
    except Exception as exc:
        return None, session
    # If we got a challenge, solve it then re-fetch
    if parse_challenge(r.text):
        session = get_anubis_cookie(url, session=session) or session
        try:
            r = session.get(url, timeout=timeout)
        except Exception:
            return None, session
    if r.status_code != 200:
        return None, session
    # Re-check that we didn't get challenge after solve
    if parse_challenge(r.text):
        return None, session
    return r.text, session


if __name__ == "__main__":
    import sys
    test_url = sys.argv[1] if len(sys.argv) > 1 else "https://www.ofarmakopoiosmou.gr/"
    print(f"Testing Anubis solver on: {test_url}")
    session = get_anubis_cookie(test_url)
    if session is None:
        print("FAILED to solve Anubis challenge")
        sys.exit(1)
    cookies = {c.name: c.value for c in session.cookies}
    print(f"Cookies obtained: {list(cookies.keys())}")
    # Test fetching a real product page
    test_product = "https://www.ofarmakopoiosmou.gr/show-tech-dental-wipes-mantilakia-odontikis-ygieinis-gia-katoikidia-100tem?id=394425"
    print(f"\nFetching product page: {test_product}")
    text, session = fetch_protected(test_product, session=session)
    if text:
        print(f"  ✓ Got {len(text)} chars")
        # Look for breadcrumb
        m = re.search(r'breadcrumb[^>]*>(.*?)</', text, re.S | re.I)
        if m:
            print(f"  Breadcrumb chunk: {m.group(1)[:200]}")
        print(f"  Title hint: {re.search(r'<title>([^<]+)</title>', text).group(1) if re.search(r'<title>([^<]+)</title>', text) else 'N/A'}")
    else:
        print(f"  ✗ Failed to fetch product")
