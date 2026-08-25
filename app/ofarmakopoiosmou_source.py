"""ofarmakopoiosmou.gr fast HTTP-based source using Anubis bypass.

Replaces the slow Playwright path for products from ofarmakopoiosmou/farmakopoiosmou.
Uses the SHA-256 PoW Anubis solver to obtain auth cookies, then plain HTTP
to fetch product pages and extract data.

Returns the standard product dict shape used by the source chain:
  Site, Site_Id, Barcode, Title, Sml_Title, Description, Categ,
  Category_1/2/3, Brand, Product_Link, Img_src, Img_src_List,
  Image_Path, Image_Path_Collection.
"""

from __future__ import annotations

import asyncio
import html as html_lib
import json
import os
import re
import sys
import threading
import unicodedata
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, "/app/brand_enrichment")
from anubis_solver import fetch_protected, get_anubis_cookie  # noqa: E402


BASE_URL = "https://www.ofarmakopoiosmou.gr"
IMAGES_DIR = Path(os.getenv("IMAGE_FILES_BASE_DIR", "/app/images"))

BREADCRUMB_RE = re.compile(r'<div\s+class="breadcrumb">(.*?)</div>', re.S | re.I)
OG_IMAGE_RE = re.compile(r'<meta\s+property="og:image"\s+content="([^"]+)"', re.I)
OG_TITLE_RE = re.compile(r'<meta\s+property="og:title"\s+content="([^"]+)"', re.I)
OG_DESC_RE = re.compile(r'<meta\s+property="og:description"\s+content="([^"]+)"', re.I)
H1_TITLE_RE = re.compile(r'<h1[^>]*class="[^"]*page-title[^"]*"[^>]*>\s*<span[^>]*>(.*?)</span>', re.S | re.I)
DESC_PATTERNS = [
    re.compile(r'<div[^>]*class="[^"]*field--name-body[^"]*"[^>]*>(.*?)</div>\s*</div>', re.S | re.I),
    re.compile(r'<div[^>]*class="[^"]*field--name-body[^"]*"[^>]*>(.*?)</div>', re.S | re.I),
    re.compile(r'<div[^>]*id="full_description"[^>]*>(.*?)</div>\s*</div>', re.S | re.I),
    re.compile(r'<div[^>]*class="[^"]*ty-wysiwyg-content[^"]*"[^>]*>(.*?)</div>', re.S | re.I),
]

SKIP_BREADCRUMB_RAW = {
    "ONLINE ΦΑΡΜΑΚΕΙΟ", "ONLINE FARMAKEIO", "HOME", "ΑΡΧΙΚΗ",
    "EXPRESS ΠΡΟΪΟΝΤΑ", "EXPRESS PROIONTA",
}


def _strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


SKIP_BREADCRUMB = {_strip_accents(s) for s in SKIP_BREADCRUMB_RAW}


# Per-thread session storage so concurrent fetches don't trample each other.
_thread_local = threading.local()


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", " ", text or "")


def _normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def _get_session():
    s = getattr(_thread_local, "session", None)
    if s is None:
        s = get_anubis_cookie(f"{BASE_URL}/")
        if s is None:
            return None
        _thread_local.session = s
    return s


def _reset_session():
    _thread_local.session = None


def _fetch(url: str, retries: int = 2) -> Optional[str]:
    for _ in range(retries):
        session = _get_session()
        if session is None:
            continue
        text, session = fetch_protected(url, session=session)
        if text:
            _thread_local.session = session
            return text
        _reset_session()
    return None


def extract_breadcrumb(html: str) -> List[str]:
    m = BREADCRUMB_RE.search(html)
    if not m:
        return []
    chunk = m.group(1)
    texts = re.findall(r">([^<>\n]+)<", chunk)
    cleaned: List[str] = []
    for t in texts:
        text = html_lib.unescape(t).strip()
        if not text or len(text) < 2 or len(text) > 200:
            continue
        if _strip_accents(text.upper()) in SKIP_BREADCRUMB:
            continue
        cleaned.append(text)
    if cleaned and len(cleaned[-1]) > 30:
        cleaned = cleaned[:-1]
    return cleaned


def extract_image_urls(html: str) -> List[str]:
    urls: List[str] = []
    m = OG_IMAGE_RE.search(html)
    if m:
        urls.append(m.group(1).strip())
    for match in re.finditer(r"https://www\.ofarmakopoiosmou\.gr/sites/default/files/[^\"' )]+\.(?:jpg|png|jpeg|webp)", html, re.I):
        u = match.group(0)
        if u not in urls:
            urls.append(u)
    return [u for u in urls if u]


def extract_title(html: str) -> str:
    m = H1_TITLE_RE.search(html)
    if m:
        raw = _normalize_space(_strip_html(m.group(1)))
    else:
        m = OG_TITLE_RE.search(html)
        raw = _normalize_space(html_lib.unescape(m.group(1))) if m else ""
    # Strip site-branding suffix (e.g. "Foo - oFarmakopoiosMou.gr"). Kept
    # local so this module has no cross-file dependency on skroutzFetch.
    if raw:
        raw = re.sub(
            r"\s*[-–|]\s*o?[Ff]armakopoios[Mm]ou\.gr\s*$",
            "",
            raw,
        ).strip()
    return raw


def extract_description(html: str) -> str:
    best = ""
    for pattern in DESC_PATTERNS:
        m = pattern.search(html)
        if not m:
            continue
        content = _normalize_space(_strip_html(html_lib.unescape(m.group(1))))
        if len(content) > len(best):
            best = content
    if best:
        return best
    m = OG_DESC_RE.search(html)
    return _normalize_space(html_lib.unescape(m.group(1))) if m else ""


async def _download_image(url: str, target: Path, session) -> bool:
    loop = asyncio.get_event_loop()

    def _do():
        target.parent.mkdir(parents=True, exist_ok=True)
        tmp = target.with_suffix(".dl.tmp")
        try:
            r = session.get(url, timeout=20, allow_redirects=True)
        except Exception:
            return False
        if r.status_code != 200 or len(r.content) < 1000:
            return False
        head = r.content[:8]
        if not (
            head[:3] == b"\xff\xd8\xff"
            or head[:4] == b"\x89PNG"
            or head[:6] == b"GIF89a"
            or head[:4] == b"RIFF"
        ):
            return False
        with open(tmp, "wb") as f:
            f.write(r.content)
        tmp.rename(target)
        return True

    return await loop.run_in_executor(None, _do)


async def fetch_ofarmakopoiosmou_product(
    barcode: str,
    *,
    product_link: str = "",
    download_images: bool = True,
    replace_existing_images: bool = False,
) -> Dict[str, Any]:
    """Fetch product data from ofarmakopoiosmou.gr using Anubis bypass.

    Requires Product_Link. If not provided, returns empty (search-by-barcode
    is not yet implemented for this fast path — caller can fall back to
    the Playwright variant).
    """
    barcode = str(barcode).strip()
    product_link = (product_link or "").strip()
    if not barcode or not product_link:
        return {}
    if "ofarmakopoiosmou" not in product_link and "farmakopoiosmou" not in product_link:
        return {}

    loop = asyncio.get_event_loop()
    html = await loop.run_in_executor(None, _fetch, product_link)
    if not html:
        return {}

    breadcrumb = extract_breadcrumb(html)
    title = extract_title(html)
    if breadcrumb and breadcrumb[-1].lower() == title.lower():
        breadcrumb = breadcrumb[:-1]
    description = extract_description(html)
    image_urls = extract_image_urls(html)

    image_local_paths: List[str] = []
    image_local_path = ""
    if download_images and image_urls and barcode:
        target = IMAGES_DIR / barcode / "1.jpg"
        if target.exists() and not replace_existing_images and target.stat().st_size > 1000:
            image_local_paths = [str(target).replace("\\", "/")]
            image_local_path = str(target).replace("\\", "/")
        else:
            session = _get_session()
            if session and await _download_image(image_urls[0], target, session):
                image_local_paths = [str(target).replace("\\", "/")]
                image_local_path = str(target).replace("\\", "/")

    cat_1 = breadcrumb[0] if len(breadcrumb) > 0 else ""
    cat_2 = breadcrumb[1] if len(breadcrumb) > 1 else ""
    cat_3 = breadcrumb[2] if len(breadcrumb) > 2 else ""

    return {
        "Site_Id": f"ofarmakopoiosmou_anubis_{barcode}",
        "Barcode": barcode,
        "Site": "farmakopoiosmou",
        "Categ": cat_3 or cat_2 or cat_1,
        "Product_Link": product_link,
        "Img_src": image_urls[0] if image_urls else "",
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": "",
        "Description": description,
        "fullDesc": description,
        "Brand": title.split()[0] if title else "",
        "Category_1": cat_1,
        "Category_2": cat_2,
        "Category_3": cat_3,
        "Image_Path": image_local_path,
        "Image_Path_Collection": image_local_paths,
    }
