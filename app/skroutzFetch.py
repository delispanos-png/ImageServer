import asyncio
import html
import io
import json
import os
import random
import re
import shutil
import time
from contextlib import suppress
from pathlib import Path
from typing import Any, Dict
from urllib.parse import quote_plus, urljoin, urlparse, urlunparse

import aiofiles
import aiohttp
from pymongo import AsyncMongoClient
from PIL import Image, ImageStat
from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from playwright.async_api import async_playwright
from image_paths import ensure_barcode_image_dir, primary_image_path, resolve_local_image_paths
from pharmacy295_lookup import lookup_pharmacy295_product
from runtime_settings import (
    get_effective_proxy_url,
    get_enabled_image_source_chain,
    get_enabled_source_chain,
    get_enabled_text_source_chain,
    is_source_enabled_for_images,
    is_source_enabled_for_text,
    is_watermark_cleanup_enabled,
)
from source_locks import get_trusted_photo_lock_source, normalize_source_name

_MIN_DELAY_SECONDS = float(os.getenv("SKROUTZ_MIN_DELAY_SECONDS", "4.0"))
_DELAY_JITTER_SECONDS = float(os.getenv("SKROUTZ_DELAY_JITTER_SECONDS", "1.0"))
_NAVIGATION_MAX_RETRIES = int(os.getenv("SKROUTZ_NAVIGATION_MAX_RETRIES", "2"))
_IMAGE_MAX_RETRIES = int(os.getenv("SKROUTZ_IMAGE_MAX_RETRIES", "2"))
_PAGE_LOAD_TIMEOUT_SECONDS = int(os.getenv("SKROUTZ_PAGE_LOAD_TIMEOUT_SECONDS", "18"))
_ELEMENT_WAIT_SECONDS = int(os.getenv("SKROUTZ_ELEMENT_WAIT_SECONDS", "6"))
_SOURCE_PER_SITE_TIMEOUT_SECONDS = int(os.getenv("SOURCE_PER_SITE_TIMEOUT_SECONDS", "18"))
_IMAGE_SOURCE_PER_SITE_TIMEOUT_SECONDS = int(os.getenv("IMAGE_SOURCE_PER_SITE_TIMEOUT_SECONDS", "60"))
_USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
_PHARMACY295_BASE_URL = os.getenv("PHARMACY295_BASE_URL", "https://www.pharmacy295.gr").strip()
_FARMAKOPOIOSMOU_BASE_URL = os.getenv("FARMAKOPOIOSMOU_BASE_URL", "https://www.ofarmakopoiosmou.gr").strip()
_YOUPHARMACY_BASE_URL = os.getenv("YOUPHARMACY_BASE_URL", "https://www.youpharmacy.gr").strip()
_GOHEALTHY_BASE_URL = os.getenv("GOHEALTHY_BASE_URL", "https://www.gohealthy.gr").strip()
_CURE4U_BASE_URL = os.getenv("CURE4U_BASE_URL", "https://www.cure4u.gr").strip()
_KPDHELLAS_BASE_URL = os.getenv("KPDHELLAS_BASE_URL", "https://kpdhellas.gr").strip()
_KPDHELLAS_BRIDGE_URL = os.getenv("KPDHELLAS_BRIDGE_URL", "http://host.docker.internal:8765").strip().rstrip("/")
_KPDHELLAS_BRIDGE_TIMEOUT_SECONDS = int(os.getenv("KPDHELLAS_BRIDGE_TIMEOUT_SECONDS", "30"))
_VITA4YOU_BASE_URL = os.getenv("VITA4YOU_BASE_URL", "https://www.vita4you.gr").strip()
_VITA4YOU_KLEVU_SEARCH_URL = os.getenv("VITA4YOU_KLEVU_SEARCH_URL", "https://uscs4v2.ksearchnet.com/cs/v2/search").strip()
_VITA4YOU_KLEVU_API_KEY = os.getenv("VITA4YOU_KLEVU_API_KEY", "").strip()
_VITA4YOU_TEXT_SOURCE_TIMEOUT_SECONDS = int(os.getenv("VITA4YOU_TEXT_SOURCE_TIMEOUT_SECONDS", "12"))
_VITA4YOU_IMAGE_SOURCE_TIMEOUT_SECONDS = int(os.getenv("VITA4YOU_IMAGE_SOURCE_TIMEOUT_SECONDS", "25"))
_TOFARMAKEIOMOU_BASE_URL = os.getenv("TOFARMAKEIOMOU_BASE_URL", "https://www.tofarmakeiomou.gr").strip()
_PLAYWRIGHT_STORAGE_STATE_PATH = os.getenv("PLAYWRIGHT_STORAGE_STATE_PATH", "").strip()
_IMAGE_FILE_UID = int(os.getenv("IMAGE_FILE_UID", "1000"))
_IMAGE_FILE_GID = int(os.getenv("IMAGE_FILE_GID", "1000"))
_FARMAKOPOIOSMOU_DIRECT_FALLBACKS = {
    "8436580288866": "https://www.ofarmakopoiosmou.gr/platanomelon-golum-dahtylidi-donisis-1tem?id=1230495",
    "8436580286411": "https://www.ofarmakopoiosmou.gr/platanomelon-kiwitas-classic-sporty-negro-aporrofitiko-esoroyho-periodoy-mayro-1tem?id=2940021",
}

_REQUEST_LOCK = asyncio.Lock()
_CACHE_LOCK = asyncio.Lock()
_LAST_REQUEST_AT = 0.0
_BARCODE_CACHE: Dict[Any, Dict[str, Any]] = {}
_PHOTO_LOCK_CACHE: Dict[str, bool] = {}
_PHOTO_LOCK_CACHE_LOCK = asyncio.Lock()
_BROWSER_PATHS = [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
]
_LIVE_PROXY_REQUIRED_SOURCES = {"tofarmakeiomou"}


class CloudflareBlockedError(Exception):
    pass


_MONGO_USER = os.getenv("MONGO_USER", "").strip()
_MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "").strip()
_MONGO_HOST = os.getenv("MONGO_HOST", "mongodb").strip()
_MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
_MONGO_DB = os.getenv("MONGO_DB", "imageDB").strip()
_MONGO_URI = f"mongodb://{_MONGO_USER}:{_MONGO_PASSWORD}@{_MONGO_HOST}:{_MONGO_PORT}"
_SOURCE_LOCK_CLIENT = AsyncMongoClient(_MONGO_URI)
_SOURCE_LOCK_DB = _SOURCE_LOCK_CLIENT[_MONGO_DB]


def _canonicalize_farmakopoiosmou_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    parsed = urlparse(url)
    if not parsed.scheme:
        url = urljoin(_FARMAKOPOIOSMOU_BASE_URL, url)
        parsed = urlparse(url)

    if parsed.netloc == "ofarmakopoiosmou.gr":
        parsed = parsed._replace(netloc="www.ofarmakopoiosmou.gr")
    return urlunparse(parsed)


def _canonicalize_vita4you_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    parsed = urlparse(url)
    if not parsed.scheme:
        url = urljoin(_VITA4YOU_BASE_URL, url)
        parsed = urlparse(url)

    if parsed.netloc == "vita4you.gr":
        parsed = parsed._replace(netloc="www.vita4you.gr")
    return urlunparse(parsed)


def _canonicalize_cure4u_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    parsed = urlparse(url)
    if not parsed.scheme:
        url = urljoin(_CURE4U_BASE_URL, url)
        parsed = urlparse(url)

    if parsed.netloc == "cure4u.gr":
        parsed = parsed._replace(netloc="www.cure4u.gr")
    parsed = parsed._replace(query="", fragment="")
    return urlunparse(parsed)


def _canonicalize_kpdhellas_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    parsed = urlparse(url)
    if not parsed.scheme:
        url = urljoin(_KPDHELLAS_BASE_URL, url)
        parsed = urlparse(url)

    if parsed.netloc == "www.kpdhellas.gr":
        parsed = parsed._replace(netloc="kpdhellas.gr")
    parsed = parsed._replace(query="", fragment="")
    return urlunparse(parsed)


def _canonicalize_youpharmacy_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    parsed = urlparse(url)
    if not parsed.scheme:
        url = urljoin(_YOUPHARMACY_BASE_URL, url)
        parsed = urlparse(url)

    if parsed.netloc == "youpharmacy.gr":
        parsed = parsed._replace(netloc="www.youpharmacy.gr")
    return urlunparse(parsed)


def _canonicalize_gohealthy_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""

    parsed = urlparse(url)
    if not parsed.scheme:
        url = urljoin(_GOHEALTHY_BASE_URL, url)
        parsed = urlparse(url)

    if parsed.netloc == "gohealthy.gr":
        parsed = parsed._replace(netloc="www.gohealthy.gr")
    parsed = parsed._replace(query="", fragment="")
    return urlunparse(parsed)


def _is_probable_gohealthy_product_url(url: str) -> bool:
    candidate = _canonicalize_gohealthy_url(url)
    if not candidate:
        return False
    parsed = urlparse(candidate)
    path = parsed.path.strip("/")
    if not path:
        return False
    excluded_prefixes = (
        "search-results",
        "search",
        "category",
        "blog",
        "news",
        "contact",
        "cart",
        "checkout",
        "account",
    )
    if any(path.startswith(prefix) for prefix in excluded_prefixes):
        return False
    if "." in path.split("/")[-1]:
        return False
    last_segment = path.split("/")[-1]
    return "-" in last_segment or bool(re.search(r"\d{4,}", last_segment))


async def _apply_polite_delay() -> None:
    global _LAST_REQUEST_AT

    async with _REQUEST_LOCK:
        target_at = _LAST_REQUEST_AT + _MIN_DELAY_SECONDS + random.uniform(0, _DELAY_JITTER_SECONDS)
        now = time.monotonic()
        wait_seconds = target_at - now
        if wait_seconds > 0:
            await asyncio.sleep(wait_seconds)
        _LAST_REQUEST_AT = time.monotonic()


async def _get_cache_value(cache_key: Any):
    async with _CACHE_LOCK:
        if cache_key in _BARCODE_CACHE:
            return dict(_BARCODE_CACHE[cache_key])
    return None


async def _set_cache_value(cache_key: Any, value: Dict[str, Any]) -> None:
    async with _CACHE_LOCK:
        _BARCODE_CACHE[cache_key] = dict(value)


async def _clear_cache_value(cache_key: Any) -> None:
    async with _CACHE_LOCK:
        _BARCODE_CACHE.pop(cache_key, None)


async def _barcode_has_protected_photo_lock(barcode: str) -> bool:
    barcode = str(barcode or "").strip()
    if not barcode:
        return False

    async with _PHOTO_LOCK_CACHE_LOCK:
        if _PHOTO_LOCK_CACHE.get(barcode):
            return True

    try:
        record = await _SOURCE_LOCK_DB.products.find_one(
            {"Barcode": barcode},
            {
                "_id": 0,
                "Img_src": 1,
                "Img_src_List": 1,
                "Site": 1,
                "last_source": 1,
                "Product_Link": 1,
                "image_source_domain": 1,
                "image_processing_version": 1,
                "photo_source_locked": 1,
                "photo_source_lock": 1,
                "Other_Sites.pharmacy295_excel": 1,
                "Other_Sites.youpharmacy_xml": 1,
            },
        )
    except Exception as exc:
        print(f"Photo lock lookup failed for barcode {barcode}: {exc}")
        return False

    lock_source = get_trusted_photo_lock_source(record or {})
    if lock_source:
        async with _PHOTO_LOCK_CACHE_LOCK:
            _PHOTO_LOCK_CACHE[barcode] = True
    return bool(lock_source)


async def _get_stored_source_snapshot(barcode: str, source_name: str) -> Dict[str, Any]:
    barcode = str(barcode or "").strip()
    source_name = normalize_source_name(source_name)
    if not barcode or not source_name:
        return {}

    try:
        record = await _SOURCE_LOCK_DB.products.find_one(
            {"Barcode": barcode},
            {
                "_id": 0,
                "Barcode": 1,
                "Site": 1,
                "last_source": 1,
                "Product_Link": 1,
                "Img_src": 1,
                "Img_src_List": 1,
                "Title": 1,
                "Sml_Title": 1,
                "Description": 1,
                "fullDesc": 1,
                "Brand": 1,
                "Categ": 1,
                "Category_1": 1,
                "Category_2": 1,
                "Category_3": 1,
                "Weight": 1,
                "Other_Sites": 1,
            },
        )
    except Exception as exc:
        print(f"Stored source snapshot lookup failed for {source_name} barcode {barcode}: {exc}")
        return {}

    if not record:
        return {}

    other_sites = record.get("Other_Sites") or {}
    if isinstance(other_sites, dict):
        snapshot = other_sites.get(source_name)
        if isinstance(snapshot, dict):
            snapshot = dict(snapshot)
            snapshot.setdefault("Barcode", barcode)
            snapshot["Site"] = source_name
            return snapshot
        for raw_name, raw_payload in other_sites.items():
            if normalize_source_name(raw_name) != source_name or not isinstance(raw_payload, dict):
                continue
            snapshot = dict(raw_payload)
            snapshot.setdefault("Barcode", barcode)
            snapshot["Site"] = source_name
            return snapshot

    primary_site = normalize_source_name(record.get("Site"))
    last_source = normalize_source_name(record.get("last_source"))
    if source_name in {primary_site, last_source}:
        snapshot = dict(record)
        snapshot["Site"] = source_name
        return snapshot

    return {}


async def _fetch_from_stored_source_snapshot(
    barcode: str,
    source_name: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
) -> Dict[str, Any]:
    snapshot = await _get_stored_source_snapshot(barcode, source_name)
    if not snapshot:
        return {}

    snapshot = dict(snapshot)
    product_link = str(snapshot.get("Product_Link", "")).strip()
    image_urls = [
        str(url).strip()
        for url in (snapshot.get("Img_src_List") or ([snapshot.get("Img_src", "")] if snapshot.get("Img_src") else []))
        if str(url).strip()
    ]
    image_urls = sanitize_source_image_urls(source_name, barcode, image_urls, limit=12)
    if image_urls:
        snapshot["Img_src"] = image_urls[0]
        snapshot["Img_src_List"] = image_urls
    else:
        snapshot.pop("Img_src", None)
        snapshot["Img_src_List"] = []

    stored_image_paths_raw = snapshot.get("Image_Path_Collection")
    if isinstance(stored_image_paths_raw, str):
        stored_image_paths = [stored_image_paths_raw.strip()] if stored_image_paths_raw.strip() else []
    elif isinstance(stored_image_paths_raw, list):
        stored_image_paths = [str(path).strip() for path in stored_image_paths_raw if str(path).strip()]
    else:
        stored_image_paths = [str(snapshot.get("Image_Path", "")).strip()] if str(snapshot.get("Image_Path", "")).strip() else []

    if download_images and replace_existing_images:
        snapshot.pop("Image_Path", None)
        snapshot.pop("Image_Path_Collection", None)

    skip_remote_image_download = (
        download_images
        and source_name in _LIVE_PROXY_REQUIRED_SOURCES
        and not get_effective_proxy_url()
    )
    if skip_remote_image_download and image_urls:
        print(
            f"Skipping stored snapshot remote image download for {source_name} barcode {barcode}: "
            "proxy is required but not configured"
        )

    if download_images and image_urls and not skip_remote_image_download:
        image_local_paths = await _download_image_collection(
            image_urls,
            barcode,
            site_name=source_name,
            replace_existing=replace_existing_images,
            referer=product_link,
        )
        if image_local_paths:
            snapshot["Image_Path"] = image_local_paths[0]
            snapshot["Image_Path_Collection"] = image_local_paths
        elif stored_image_paths and not replace_existing_images:
            snapshot["Image_Path"] = stored_image_paths[0]
            snapshot["Image_Path_Collection"] = stored_image_paths
    elif stored_image_paths and not replace_existing_images:
        snapshot["Image_Path"] = stored_image_paths[0]
        snapshot["Image_Path_Collection"] = stored_image_paths

    snapshot["Site"] = source_name
    snapshot["Barcode"] = barcode
    return snapshot


def _get_browser_executable() -> str | None:
    for binary in _BROWSER_PATHS:
        if os.path.exists(binary):
            return binary
    return None


def _get_launch_options(*, use_proxy: bool = True) -> Dict[str, Any]:
    chromium_env = os.environ.copy()
    chromium_env.setdefault("HOME", "/tmp")
    chromium_env.setdefault("XDG_CONFIG_HOME", "/tmp/.chromium-config")
    chromium_env.setdefault("XDG_CACHE_HOME", "/tmp/.chromium-cache")
    chromium_env.setdefault("TMPDIR", "/tmp")

    launch_options: Dict[str, Any] = {
        "headless": True,
        "env": chromium_env,
        "args": [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-crash-reporter",
            "--disable-crashpad",
            "--disable-crashpad-for-testing",
            "--disable-blink-features=AutomationControlled",
            "--disable-extensions",
            "--disable-plugins",
            "--disable-background-timer-throttling",
            "--disable-renderer-backgrounding",
            "--disable-backgrounding-occluded-windows",
            "--window-size=1920,1080",
        ],
    }

    browser_path = _get_browser_executable()
    if browser_path:
        launch_options["executable_path"] = browser_path

    effective_proxy_url = get_effective_proxy_url()
    if use_proxy and effective_proxy_url:
        launch_options["proxy"] = {"server": effective_proxy_url}

    return launch_options


async def _new_page(*, use_proxy: bool = True):
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(**_get_launch_options(use_proxy=use_proxy))
    context = await browser.new_context(
        user_agent=_USER_AGENT,
        viewport={"width": 1920, "height": 1080},
        locale="el-GR",
        timezone_id="Europe/Athens",
    )
    if _PLAYWRIGHT_STORAGE_STATE_PATH:
        try:
            async with aiofiles.open(_PLAYWRIGHT_STORAGE_STATE_PATH, "r", encoding="utf-8") as state_file:
                state_data = json.loads(await state_file.read())
            cookies = state_data.get("cookies", [])
            if cookies:
                await context.add_cookies(cookies)
        except Exception as exc:
            print(f"Failed to load Playwright storage state from {_PLAYWRIGHT_STORAGE_STATE_PATH}: {exc}")
    page = await context.new_page()
    page.set_default_timeout(_ELEMENT_WAIT_SECONDS * 1000)
    page.set_default_navigation_timeout(_PAGE_LOAD_TIMEOUT_SECONDS * 1000)
    return playwright, browser, context, page


async def _close_page(playwright, browser, context) -> None:
    await context.close()
    if browser is not None:
        await browser.close()
    await playwright.stop()


async def _goto(page, url: str) -> bool:
    for attempt in range(_NAVIGATION_MAX_RETRIES + 1):
        try:
            await _apply_polite_delay()
            await page.goto(url, wait_until="domcontentloaded", timeout=_PAGE_LOAD_TIMEOUT_SECONDS * 1000)
            return True
        except PlaywrightTimeoutError:
            try:
                await page.evaluate("window.stop()")
            except Exception:
                pass
            print(f"⚠️ Page load timeout for {url}, continuing with partial DOM")
            return True
        except Exception as exc:
            if attempt == _NAVIGATION_MAX_RETRIES:
                print(f"❌ Navigation failed for {url}: {exc}")
                return False
            backoff = (2 ** attempt) + random.uniform(0.2, 0.6)
            print(f"⚠️ Navigation retry {attempt + 1}/{_NAVIGATION_MAX_RETRIES} in {backoff:.1f}s")
            await asyncio.sleep(backoff)
    return False


async def _count(locator) -> int:
    try:
        return await locator.count()
    except Exception:
        return 0


async def _get_first(locator):
    if await _count(locator) == 0:
        return None
    return locator.first


async def _text(locator) -> str:
    if locator is None:
        return ""
    try:
        value = await locator.text_content()
        return value.strip() if value else ""
    except Exception:
        return ""


async def _attribute(locator, attr: str) -> str:
    if locator is None:
        return ""
    try:
        value = await locator.get_attribute(attr)
        return value.strip() if value else ""
    except Exception:
        return ""


async def _try_accept_cookies(page) -> None:
    selectors = [
        "button:has-text('Αποδοχή')",
        "button:has-text('Accept')",
        "button:has-text('Συμφων')",
        "a:has-text('Αποδοχή')",
        "a:has-text('Accept')",
    ]
    for selector in selectors:
        locator = await _get_first(page.locator(selector))
        if not locator:
            continue
        try:
            await locator.click(timeout=2000)
            await asyncio.sleep(0.5)
            return
        except Exception:
            continue


async def _find_first_href(page, selectors: list[str]) -> str:
    for selector in selectors:
        locator = page.locator(selector)
        count = await _count(locator)
        for index in range(count):
            candidate = locator.nth(index)
            href = await _attribute(candidate, "href")
            if href:
                return urljoin(page.url, href)
    return ""


async def _find_all_hrefs(page, selectors: list[str], limit: int = 10) -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()
    for selector in selectors:
        locator = page.locator(selector)
        count = await _count(locator)
        for index in range(count):
            candidate = locator.nth(index)
            href = await _attribute(candidate, "href")
            if not href:
                continue
            url = urljoin(page.url, href)
            if url in seen:
                continue
            seen.add(url)
            urls.append(url)
            if len(urls) >= limit:
                return urls
    return urls


async def _page_looks_like_product_detail(page, site_name: str) -> bool:
    normalized_site = normalize_source_name(site_name)
    selectors = [
        "[itemtype*='Product']",
        ".product_title",
        ".single-product",
        ".product.type-product",
        "form.cart",
        ".woocommerce-product-gallery",
    ]
    if normalized_site == "farmakopoiosmou":
        selectors = [
            ".ty-product-block",
            ".product-title",
            "[itemtype*='Product']",
        ]

    for selector in selectors:
        locator = page.locator(selector)
        if await _count(locator):
            return True

    try:
        content = await page.content()
    except Exception:
        return False

    return bool(
        re.search(
            r'<meta[^>]+property=["\']og:type["\'][^>]+content=["\']product["\']',
            content,
            flags=re.I,
        )
    )


def _unique_urls(urls: list[str], limit: int = 8) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for url in urls:
        if not url or url in seen:
            continue
        seen.add(url)
        result.append(url)
        if len(result) >= limit:
            break
    return result


def _strip_pagespeed_suffix(url: str) -> str:
    value = str(url or "").strip()
    if not value:
        return ""

    parsed = urlparse(value)
    cleaned_path = re.sub(r"\.pagespeed\.[^/]+", "", parsed.path, flags=re.I)
    return urlunparse(parsed._replace(path=cleaned_path))


def _is_probable_product_image_url(url: str, *, site_name: str, barcode: str = "") -> bool:
    normalized_url = _strip_pagespeed_suffix(url)
    parsed = urlparse(normalized_url)
    path = parsed.path.lower()
    full_value = normalized_url.lower()
    barcode = str(barcode or "").strip().lower()

    if not path:
        return False

    if any(path.endswith(ext) for ext in (".svg", ".ico", ".gif")):
        return False

    reject_markers = [
        "apple-touch-icon",
        "favicon",
        "logo",
        "icon-",
        "/icon",
        "sprite",
        "placeholder",
        "banner",
        "slideshow",
        "mobile_",
        "/sites/all/themes/",
        "/themes/",
        "/advagg_",
        "facebook",
        "twitter",
        "instagram",
        "youtube",
        "payment",
        "trustmark",
        "cookie",
        "flag",
        "loader",
        "30x30",
        "20x20",
        "16x16",
        "x30x",
        "x20x",
        "x16x",
    ]
    if any(marker in full_value for marker in reject_markers):
        return False

    if site_name == "farmakopoiosmou":
        if "/sites/default/files/" not in path:
            return False
        if barcode and barcode not in full_value:
            return False
        if not any(path.endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")):
            return False
        return True

    return any(path.endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp"))


def sanitize_source_image_urls(site_name: str, barcode: str, image_urls: list[str], limit: int = 12) -> list[str]:
    seen: set[str] = set()
    cleaned: list[str] = []
    normalized_site = normalize_source_name(site_name)

    for raw_url in image_urls:
        candidate = _strip_pagespeed_suffix(raw_url)
        if not candidate or candidate in seen:
            continue
        if not _is_probable_product_image_url(candidate, site_name=normalized_site, barcode=barcode):
            continue
        seen.add(candidate)
        cleaned.append(candidate)
        if len(cleaned) >= limit:
            break

    return cleaned


async def invalidate_source_barcode_cache(barcode: str) -> None:
    barcode = str(barcode or "").strip()
    if not barcode:
        return

    for source_name in ("farmakopoiosmou", "pharmacy295", "youpharmacy", "gohealthy", "cure4u", "kpdhellas", "vita4you", "tofarmakeiomou", "skroutz"):
        await _clear_cache_value((source_name, barcode))


async def _find_farmakopoiosmou_candidate_urls_from_html(page, barcode: str, limit: int = 8) -> list[str]:
    try:
        content = await page.content()
    except Exception:
        return []

    pattern = re.compile(
        rf'<div id="node-[^"]+" class="findastic-item node node--product">.*?'
        rf'data-enhanced_ecommerce_id="{re.escape(barcode)}".*?</div>\s*</div>',
        re.DOTALL,
    )
    urls: list[str] = []
    for block_match in pattern.finditer(content):
        block = block_match.group(0)
        for href_match in re.finditer(r'href="([^"]+)"', block):
            href = href_match.group(1)
            if href.startswith("/"):
                urls.append(urljoin(page.url, href))
            elif href.startswith("http"):
                urls.append(href)
    return _unique_urls(urls, limit=limit)


async def _find_farmakopoiosmou_candidate_urls(page, barcode: str, limit: int = 8) -> list[str]:
    html_urls = await _find_farmakopoiosmou_candidate_urls_from_html(page, barcode, limit=limit)
    if html_urls:
        return html_urls

    matching_urls: list[str] = []
    for selector in [
        ".findastic-overlay-search-results .findastic-item.node--product",
        ".findastic-item.node--product",
    ]:
        cards = page.locator(selector)
        count = await _count(cards)
        for index in range(count):
            card = cards.nth(index)
            ecommerce_id = await _attribute(card, "data-enhanced_ecommerce_id")
            if not ecommerce_id:
                inner = card.locator("[data-enhanced_ecommerce_id]")
                if await _count(inner):
                    ecommerce_id = await _attribute(inner.first, "data-enhanced_ecommerce_id")
            if ecommerce_id and ecommerce_id.strip() == barcode:
                for link_selector in [
                    "a.product-image",
                    ".product-basic a",
                    "h3 a",
                    "a[href*='?id=']",
                    "a[href^='/']",
                ]:
                    locator = card.locator(link_selector)
                    if await _count(locator) == 0:
                        continue
                    href = await _attribute(locator.first, "href")
                    if href:
                        matching_urls.append(urljoin(page.url, href))
                        if len(matching_urls) >= limit:
                            return _unique_urls(matching_urls, limit=limit)
        if matching_urls:
            return _unique_urls(matching_urls, limit=limit)

    selectors = [
        ".ut2-gl__item .ut2-gl__name a",
        ".ut2-gl__item a[href*='ofarmakopoiosmou.gr/']",
        ".ut2-gl__item a[href^='/']",
        ".ty-column3 .ty-grid-list__item-name a",
        ".ty-column3 a[href^='/']",
    ]
    urls = await _find_all_hrefs(page, selectors, limit=limit)
    return _unique_urls([url for url in urls if "#search/" not in url], limit=limit)


async def _click_farmakopoiosmou_result_cards(page, barcode: str, limit: int = 4) -> list[str]:
    selectors = [
        ".ut2-gl__item .ut2-gl__name a",
        ".ut2-gl__item a",
        ".ty-column3 .grid-list__item a",
        ".ty-column3 a",
    ]
    discovered_urls: list[str] = []
    seen: set[str] = set()

    for selector in selectors:
        locator = page.locator(selector)
        count = await _count(locator)
        for index in range(min(count, limit)):
            try:
                await page.goto(f"{_FARMAKOPOIOSMOU_BASE_URL}/#search/{barcode}", wait_until="domcontentloaded")
                await asyncio.sleep(2)
            except Exception:
                pass

            current_locator = page.locator(selector)
            if await _count(current_locator) <= index:
                continue

            candidate = current_locator.nth(index)
            try:
                await candidate.click(timeout=3000, force=True)
                await page.wait_for_load_state("domcontentloaded")
                await asyncio.sleep(1)
            except Exception:
                continue

            current_url = page.url
            if current_url in seen or "#search/" in current_url:
                continue
            seen.add(current_url)
            discovered_urls.append(current_url)
            print(f"Clicked farmakopoiosmou result card {index + 1} -> {current_url}")
            if len(discovered_urls) >= limit:
                return discovered_urls

    return discovered_urls


async def _find_skroutz_product_url(page) -> str:
    selector_url = await _find_first_href(
        page,
        [
            "article a[href*='/s/']",
            "[data-testid='product-link']",
            "h3 a[href*='/s/']",
            ".sku-card a[href*='/s/']",
            "a[href*='/s/']",
            ".sku-link",
            ".product-link",
            "a[data-testid='product-link']",
        ],
    )
    if selector_url:
        return selector_url

    try:
        content = await page.content()
    except Exception:
        return ""

    relative_match = re.search(r'href="(/s/\d+/[^"]+)"', content)
    if relative_match:
        return urljoin(page.url, relative_match.group(1))

    escaped_relative_match = re.search(r'\\?/s\\?/\d+\\?/[^"\\]+', content)
    if escaped_relative_match:
        raw_url = escaped_relative_match.group(0).replace("\\/", "/").replace("\\", "")
        return urljoin(page.url, raw_url)

    absolute_match = re.search(r'https://www\.skroutz\.gr/s/\d+/[^"\']+', content)
    if absolute_match:
        return absolute_match.group(0)

    absolute_escaped_match = re.search(r'https:\\/\\/www\.skroutz\.gr\\/s\\/\d+\\/[^"\\]+', content)
    if absolute_escaped_match:
        return absolute_escaped_match.group(0).replace("\\/", "/")

    return ""


async def _click_first_skroutz_result(page) -> bool:
    selectors = [
        "[data-testid='sku-card']",
        ".sku-card",
        "article",
        "article a",
        ".sku-card a",
        "[data-testid='product-link']",
        "a[href*='/s/']",
        "h3 a",
    ]
    for selector in selectors:
        locator = page.locator(selector)
        count = await _count(locator)
        for index in range(count):
            candidate = locator.nth(index)
            try:
                await candidate.click(timeout=3000, force=True)
                await page.wait_for_load_state("domcontentloaded")
                print(f"Clicked skroutz result via selector {selector}")
                return True
            except Exception:
                continue
    return False


async def _first_text(page, selectors: list[str], timeout_ms: int | None = None) -> str:
    timeout_ms = timeout_ms or (_ELEMENT_WAIT_SECONDS * 1000)
    for selector in selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        value = await _text(locator.first)
        if value:
            return value
    return ""


async def _first_attr(page, selectors: list[str], attr: str, timeout_ms: int | None = None) -> str:
    timeout_ms = timeout_ms or (_ELEMENT_WAIT_SECONDS * 1000)
    for selector in selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        value = await _attribute(locator.first, attr)
        if value:
            return value
    return ""


async def _first_js_property(page, selectors: list[str], prop: str, timeout_ms: int | None = None) -> str:
    timeout_ms = timeout_ms or (_ELEMENT_WAIT_SECONDS * 1000)
    for selector in selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        count = await _count(locator)
        for index in range(count):
            candidate = locator.nth(index)
            try:
                value = await candidate.evaluate(f"(el) => el && el['{prop}'] ? String(el['{prop}']).trim() : ''")
            except Exception:
                value = ""
            if value:
                return value
    return ""


def _normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def _sanitize_extracted_text(value: str) -> str:
    if not value:
        return ""

    banned_line_markers = [
        "ofarmakopoiosmou",
        "φαρμακοποιοςμου",
        "φαρμακοποιόσμου",
        "φαρμακοποιόσ μου",
        "τηλεφων",
        "e-mail",
        "email",
        "www.",
        "http://",
        "https://",
        "στοιχεια εταιρειας",
        "στοιχεία εταιρείας",
        "διανομή",
        "διανομη",
        "δείτε όλα τα προϊόντα",
        "προσθήκη στα αγαπημένα",
        "προσθεκη στα αγαπημενα",
        "προσθέστε στο καλάθι",
        "προσθεστε στο καλαθι",
        "άμεσα διαθέσιμο",
        "αμεσα διαθεσιμο",
        "ογκομετρικό βάρος",
        "ογκομετρικο βαρος",
        "timh",
        "τιμη",
        "ποσότητα",
        "ποσοτητα",
        "στοιχεία εταιρίας",
        "στοιχεια εταιριας",
        "σχόλια/αξιολόγηση",
        "σχολια/αξιολογηση",
    ]
    banned_exact_lines = {
        "neo",
        "<>",
        "περιγραφή",
        "περιγραφη",
        "οδηγίες χρήσης",
        "οδηγιες χρησης",
        "προφυλάξεις",
        "προφυλαξεις",
        "στοιχεία εταιρίας",
        "στοιχεια εταιριας",
        "στοιχεία εταιρείας",
        "στοιχεια εταιρειας",
        "σχόλια/αξιολόγηση",
        "σχολια/αξιολογηση",
        "μέγεθος",
        "μεγεθος",
        "τιμη",
        "timh",
    }
    banned_company_patterns = [
        r"\b(?:φαρμακε(?:ια|ίο|ιο))\b.*\b(?:σια|οε|εε|αε|ike|ιωκ)\b",
        r"\b(?:info|sales)\s*@",
        r"\b(?:κυριος|κα)\b",
    ]

    cleaned_lines: list[str] = []
    for raw_line in value.splitlines():
        line = raw_line.strip()
        if not line:
            cleaned_lines.append("")
            continue

        line_lower = line.lower()
        if any(marker in line_lower for marker in banned_line_markers):
            continue
        if line_lower in banned_exact_lines:
            continue
        if any(re.search(pattern, line_lower, re.IGNORECASE) for pattern in banned_company_patterns):
            continue

        if re.search(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", line, re.IGNORECASE):
            continue

        if re.search(r"(?:\+?\d[\d\s().-]{7,}\d)", line):
            continue

        cleaned_lines.append(line)

    cleaned = "\n".join(cleaned_lines)
    cleaned = re.sub(r"\bofarmakopoiosmou(?:\.gr)?\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b(?:\+?30\s*)?(?:2\d{9}|69\d{8}|\d{10})\b", "", cleaned)
    cleaned = re.sub(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"https?://\S+|www\.\S+", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def _normalize_farmakopoiosmou_image_url(value: str) -> str:
    value = (value or "").strip()
    if not value:
        return ""
    value = value.replace("/styles/product_medium/", "/styles/product_large/")
    return value


def _trim_farmakopoiosmou_description(value: str) -> str:
    if not value:
        return ""

    cut_markers = [
        "Όροι Επιστροφής",
        "Οροι Επιστροφης",
        "ΠΛΗΡΟΦΟΡΙΕΣ ΑΠΟΣΤΟΛΗΣ",
        "Πολιτική Επιστροφών",
        "Διανομή για την Ελλάδα",
        "Διανομη για την Ελλαδα",
    ]
    trimmed = value
    for marker in cut_markers:
        if marker in trimmed:
            trimmed = trimmed.split(marker, 1)[0]
    return trimmed.strip()


def _remove_farmakopoiosmou_watermark(image: Image.Image) -> Image.Image:
    width, height = image.size
    if width < 120 or height < 120:
        return image

    # Keep the largest dark connected component, which is the product itself.
    # The lower-left watermark is a much smaller detached component, so it gets
    # excluded from the crop without painting over the image.
    small_w = min(256, width)
    scale = small_w / float(width)
    small_h = max(1, int(height * scale))
    small = image.resize((small_w, small_h), Image.Resampling.BILINEAR).convert("L")
    pixels = small.load()

    threshold = 232
    visited = set()
    components = []

    for y in range(small_h):
        for x in range(small_w):
            if (x, y) in visited or pixels[x, y] >= threshold:
                continue

            stack = [(x, y)]
            visited.add((x, y))
            min_x = max_x = x
            min_y = max_y = y
            area = 0

            while stack:
                cx, cy = stack.pop()
                area += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)

                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < small_w and 0 <= ny < small_h and (nx, ny) not in visited and pixels[nx, ny] < threshold:
                        visited.add((nx, ny))
                        stack.append((nx, ny))

            if area >= 120:
                components.append(
                    {
                        "area": area,
                        "bbox": (min_x, min_y, max_x + 1, max_y + 1),
                    }
                )

    if not components:
        cropped = image
    else:
        largest_area = max(component["area"] for component in components)
        significant_components = [
            component
            for component in components
            if component["area"] >= max(120, int(largest_area * 0.35))
        ]
        left = min(component["bbox"][0] for component in significant_components)
        top = min(component["bbox"][1] for component in significant_components)
        right = max(component["bbox"][2] for component in significant_components)
        bottom = max(component["bbox"][3] for component in significant_components)
        inv_scale = width / float(small_w)
        left = int(left * inv_scale)
        top = int(top * inv_scale)
        right = int(right * inv_scale)
        bottom = int(bottom * inv_scale)

        padding_x = int(width * 0.02)
        padding_top = int(height * 0.02)
        padding_bottom = int(height * 0.015)

        left = max(0, left - padding_x)
        top = max(0, top - padding_top)
        right = min(width, right + padding_x)
        bottom = min(height, bottom + padding_bottom)

        cropped = image.crop((left, top, right, bottom))

    # Some images are already tightly cropped, so the lower-left watermark
    # survives the bbox crop. In that case, detect the remaining lower-left
    # watermark cluster and replace it using nearby clean pixels from the same
    # image instead of painting with a flat color. That preserves gradients and
    # looks significantly cleaner on packshots.
    working = cropped.convert("RGB")
    width, height = working.size
    patch_w = max(6, int(width * 0.08))
    patch_h = max(6, int(height * 0.08))
    corner_patches = [
        working.crop((0, 0, patch_w, patch_h)),
        working.crop((max(0, width - patch_w), 0, width, patch_h)),
        working.crop((max(0, width - patch_w), max(0, height - patch_h), width, height)),
    ]
    background_patch = max(corner_patches, key=lambda patch: sum(ImageStat.Stat(patch).mean))
    background = tuple(int(round(channel)) for channel in ImageStat.Stat(background_patch).mean[:3])

    roi_left = 0
    roi_top = int(height * 0.68)
    roi_right = int(width * 0.42)
    roi_bottom = height
    pixels = working.load()
    row_backgrounds = {}
    candidate_pixels = set()

    def _row_background(y: int) -> tuple[int, int, int]:
        if y in row_backgrounds:
            return row_backgrounds[y]

        sample_left = min(width - 1, max(int(width * 0.46), roi_right + 1))
        sample_right = min(width, max(sample_left + 8, int(width * 0.88)))
        samples = []
        for sx in range(sample_left, sample_right):
            samples.append(pixels[sx, y])

        if not samples:
            row_backgrounds[y] = background
            return background

        row_background = tuple(
            int(round(sum(pixel[channel] for pixel in samples) / len(samples)))
            for channel in range(3)
        )
        row_backgrounds[y] = row_background
        return row_background

    for y in range(roi_top, roi_bottom):
        row_background = _row_background(y)
        for x in range(roi_left, roi_right):
            current = pixels[x, y]
            delta_bg = max(abs(current[index] - background[index]) for index in range(3))
            delta_row = max(abs(current[index] - row_background[index]) for index in range(3))
            brightness = current[0] + current[1] + current[2]

            if delta_bg < 18 and delta_row < 18:
                continue
            if brightness > 745 and delta_bg < 32:
                continue
            candidate_pixels.add((x, y))

    if not candidate_pixels:
        return working

    visited = set()
    mask_pixels = set()
    max_component_area = max(120, int((roi_right - roi_left) * (roi_bottom - roi_top) * 0.09))

    for start in list(candidate_pixels):
        if start in visited:
            continue

        stack = [start]
        visited.add(start)
        component = []
        min_x = max_x = start[0]
        min_y = max_y = start[1]

        while stack:
            cx, cy = stack.pop()
            component.append((cx, cy))
            min_x = min(min_x, cx)
            max_x = max(max_x, cx)
            min_y = min(min_y, cy)
            max_y = max(max_y, cy)

            for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                if (nx, ny) in candidate_pixels and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    stack.append((nx, ny))

        area = len(component)
        bbox_w = (max_x - min_x) + 1
        bbox_h = (max_y - min_y) + 1
        centroid_x = sum(x for x, _ in component) / float(area)
        centroid_y = sum(y for _, y in component) / float(area)
        touches_corner = min_x < int(width * 0.12) or max_y > int(height * 0.92)
        looks_like_watermark = (
            24 <= area <= max_component_area
            and bbox_w <= int(width * 0.34)
            and bbox_h <= int(height * 0.16)
            and centroid_x <= width * 0.22
            and centroid_y >= height * 0.74
            and touches_corner
        )

        if not looks_like_watermark:
            continue

        for x, y in component:
            for dx in range(-2, 3):
                for dy in range(-2, 3):
                    nx = x + dx
                    ny = y + dy
                    if roi_left <= nx < roi_right and roi_top <= ny < roi_bottom:
                        mask_pixels.add((nx, ny))

    if not mask_pixels:
        return working

    changed_pixels = 0
    x_shift = max(18, int(width * 0.18))
    for y in range(roi_top, roi_bottom):
        row_background = _row_background(y)
        for x in range(roi_left, roi_right):
            if (x, y) not in mask_pixels:
                continue

            replacement = None
            for multiplier in (1, 2, 3):
                src_x = x + (x_shift * multiplier)
                if src_x >= width:
                    break
                if (src_x, y) in mask_pixels:
                    continue
                replacement = pixels[src_x, y]
                break

            pixels[x, y] = replacement or row_background
            changed_pixels += 1

    return working if changed_pixels else cropped.convert("RGB")


def _prepare_image_bytes_for_storage(content: bytes, site_name: str) -> bytes:
    with Image.open(io.BytesIO(content)) as image:
        prepared = image.convert("RGB")
        if (
            site_name == "farmakopoiosmou"
            and is_source_enabled_for_images("farmakopoiosmou")
            and is_watermark_cleanup_enabled()
        ):
            prepared = _remove_farmakopoiosmou_watermark(prepared)

        output = io.BytesIO()
        prepared.save(output, format="JPEG", quality=92, optimize=True)
        return output.getvalue()


def _strip_source_image_payload(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return {}
    stripped = dict(doc)
    stripped.pop("Img_src", None)
    stripped.pop("Image_Path", None)
    stripped["Img_src_List"] = []
    stripped["Image_Path_Collection"] = []
    return stripped


async def _extract_farmakopoiosmou_tab_description(page) -> str:
    try:
        tab_text = await page.evaluate(
            """
            () => {
                const excluded = ['ΣΤΟΙΧΕΙΑ ΕΤΑΙΡΕΙΑΣ', 'ΣΧΟΛΙΑ/ΑΞΙΟΛΟΓΗΣΗ'];
                const parts = [];
                const seen = new Set();
                const links = Array.from(document.querySelectorAll('.ty-tabs a, .ty-tabs__list a, .tabs a'));

                for (const link of links) {
                    const label = (link.innerText || link.textContent || '').trim();
                    if (!label || excluded.includes(label)) continue;

                    const href = link.getAttribute('href') || '';
                    if (!href.startsWith('#')) continue;

                    const target = document.querySelector(href);
                    if (!target) continue;

                    const text = (target.innerText || target.textContent || '').trim();
                    if (!text || seen.has(text)) continue;
                    seen.add(text);
                    parts.push(text);
                }

                if (!parts.length) {
                    const fallbackBlocks = Array.from(document.querySelectorAll('.ty-tabs__content'));
                    for (const block of fallbackBlocks) {
                        const text = (block.innerText || block.textContent || '').trim();
                        if (!text || seen.has(text)) continue;
                        seen.add(text);
                        parts.push(text);
                    }
                }

                return parts.join('\\n\\n');
            }
            """
        )
    except Exception:
        tab_text = ""
    return _trim_farmakopoiosmou_description(tab_text)


async def _extract_farmakopoiosmou_main_description(page) -> str:
    try:
        main_text = await page.evaluate(
            """
            () => {
                const excludedHeadings = ['ΣΤΟΙΧΕΙΑ ΕΤΑΙΡΕΙΑΣ', 'ΣΧΟΛΙΑ/ΑΞΙΟΛΟΓΗΣΗ'];
                const containers = [
                    '.page-node .l-content',
                    '.node--product',
                    '.product-info-wrapper',
                    'main',
                    '#main-content',
                ];

                const texts = [];
                const seen = new Set();

                for (const selector of containers) {
                    const root = document.querySelector(selector);
                    if (!root) continue;

                    const cloned = root.cloneNode(true);
                    cloned.querySelectorAll('script, style, noscript').forEach((node) => node.remove());

                    const walker = document.createTreeWalker(cloned, NodeFilter.SHOW_ELEMENT, null);
                    const toRemove = [];
                    while (walker.nextNode()) {
                        const el = walker.currentNode;
                        const text = (el.innerText || el.textContent || '').trim();
                        if (!text) continue;
                        if (excludedHeadings.includes(text)) {
                            toRemove.push(el);
                        }
                    }

                    for (const el of toRemove) {
                        let next = el.nextElementSibling;
                        while (next) {
                            const candidate = next;
                            next = next.nextElementSibling;
                            candidate.remove();
                        }
                        el.remove();
                    }

                    const text = (cloned.innerText || cloned.textContent || '').trim();
                    if (text && !seen.has(text)) {
                        seen.add(text);
                        texts.push(text);
                    }
                }

                return texts.join('\\n\\n');
            }
            """
        )
    except Exception:
        main_text = ""

    main_text = _trim_farmakopoiosmou_description(main_text)

    lines = []
    seen_lines = set()
    for raw_line in main_text.splitlines():
        line = raw_line.strip()
        if not line:
            if lines and lines[-1] != "":
                lines.append("")
            continue
        if line in seen_lines:
            continue
        seen_lines.add(line)
        lines.append(line)

    return "\n".join(lines).strip()


async def _collect_texts(page, selectors: list[str], timeout_ms: int | None = None, limit: int = 10) -> list[str]:
    timeout_ms = timeout_ms or (_ELEMENT_WAIT_SECONDS * 1000)
    values: list[str] = []
    seen: set[str] = set()
    for selector in selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        count = await _count(locator)
        for index in range(min(count, limit)):
            value = _normalize_space(await _text(locator.nth(index)))
            if not value or value in seen:
                continue
            seen.add(value)
            values.append(value)
    return values


async def _collect_image_urls_from_page(
    page,
    href_selectors: list[str],
    image_selectors: list[str],
    meta_selectors: list[str],
    timeout_ms: int = 4000,
    normalizer=None,
    limit: int = 12,
) -> list[str]:
    image_urls: list[str] = []

    def _add_url(url: str) -> None:
        normalized = str(url or "").strip()
        if not normalized:
            return
        if normalizer is not None:
            normalized = normalizer(normalized)
        if normalized.startswith("//"):
            normalized = f"https:{normalized}"
        if normalized and normalized not in image_urls:
            image_urls.append(normalized)

    for selector in href_selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        count = await _count(locator)
        for index in range(min(count, limit)):
            _add_url(await _attr(locator.nth(index), "href"))

    for selector in image_selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        count = await _count(locator)
        for index in range(min(count, limit)):
            candidate = locator.nth(index)
            _add_url(await _js_property(candidate, "currentSrc"))
            _add_url(await _attr(candidate, "src"))

    for selector in meta_selectors:
        locator = page.locator(selector)
        try:
            await locator.first.wait_for(state="attached", timeout=timeout_ms)
        except Exception:
            continue
        count = await _count(locator)
        for index in range(min(count, limit)):
            _add_url(await _attr(locator.nth(index), "content"))

    return image_urls


async def _download_image_with_retries(
    img_url: str,
    image_local_path: str,
    site_name: str = "",
    *,
    referer: str = "",
) -> str:
    image_path = Path(image_local_path)
    image_path.parent.mkdir(parents=True, exist_ok=True)
    if image_path.exists() and image_path.stat().st_size > 0:
        return image_local_path

    normalized_site_name = normalize_source_name(site_name)
    if normalized_site_name == "kpdhellas":
        bridged_path = await _download_image_via_kpdhellas_bridge(
            img_url,
            image_local_path,
            referer=referer,
        )
        if bridged_path:
            return bridged_path

    timeout = aiohttp.ClientTimeout(total=15)
    connector = aiohttp.TCPConnector(ssl=False)
    headers = {"User-Agent": _USER_AGENT}
    if referer:
        headers["Referer"] = referer
    for attempt in range(_IMAGE_MAX_RETRIES + 1):
        try:
            await _apply_polite_delay()
            effective_proxy_url = get_effective_proxy_url()
            async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
                async with session.get(img_url, headers=headers, proxy=effective_proxy_url or None) as response:
                    if response.status == 200:
                        content = await response.read()
                        try:
                            content = _prepare_image_bytes_for_storage(content, site_name)
                        except Exception as exc:
                            if attempt < _IMAGE_MAX_RETRIES:
                                backoff = (2 ** attempt) + random.uniform(0.2, 0.6)
                                print(
                                    f"Image validation failed for {img_url}, "
                                    f"retry {attempt + 1}/{_IMAGE_MAX_RETRIES} in {backoff:.1f}s: {exc}"
                                )
                                await asyncio.sleep(backoff)
                                continue
                            print(f"Image validation failed for {img_url}: {exc}")
                            return ""
                        async with aiofiles.open(image_local_path, "wb") as image_file:
                            await image_file.write(content)
                        try:
                            os.chmod(image_local_path, 0o664)
                        except Exception as exc:
                            print(f"Image chmod skipped for {image_local_path}: {exc}")
                        try:
                            os.chown(image_local_path, _IMAGE_FILE_UID, _IMAGE_FILE_GID)
                        except Exception as exc:
                            print(f"Image chown skipped for {image_local_path}: {exc}")
                        print(f"Image saved: {image_local_path}")
                        return image_local_path

                    if response.status in {429, 500, 502, 503, 504} and attempt < _IMAGE_MAX_RETRIES:
                        backoff = (2 ** attempt) + random.uniform(0.2, 0.6)
                        print(
                            f"Image download status {response.status}, "
                            f"retry {attempt + 1}/{_IMAGE_MAX_RETRIES} in {backoff:.1f}s"
                        )
                        await asyncio.sleep(backoff)
                        continue

                    print(f"Failed to download image: {response.status}")
                    return ""
        except Exception as exc:
            if attempt == _IMAGE_MAX_RETRIES:
                print(f"Image download error: {exc}")
                return ""
            backoff = (2 ** attempt) + random.uniform(0.2, 0.6)
            print(f"Image download retry {attempt + 1}/{_IMAGE_MAX_RETRIES} in {backoff:.1f}s")
            await asyncio.sleep(backoff)

    return ""


def _remove_image_files_from_dir(image_dir: Path) -> None:
    for path in image_dir.iterdir():
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
            with suppress(Exception):
                path.unlink()


def _finalize_replaced_image_set(
    image_dir: Path,
    barcode: str,
    temp_saved_paths: list[Path],
) -> list[str]:
    if not temp_saved_paths:
        return []

    _remove_image_files_from_dir(image_dir)
    legacy_path = Path("/app/images") / f"{barcode}.jpg"
    if legacy_path.exists():
        with suppress(Exception):
            legacy_path.unlink()

    saved_paths: list[str] = []
    for index, temp_path in enumerate(sorted(temp_saved_paths), start=1):
        final_path = image_dir / f"{index}.jpg"
        temp_path.replace(final_path)
        saved_paths.append(str(final_path).replace("\\", "/"))
    return saved_paths


async def _download_image_collection(
    image_urls: list[str],
    barcode: str,
    site_name: str = "",
    *,
    replace_existing: bool = False,
    referer: str = "",
) -> list[str]:
    barcode = str(barcode).strip()
    if not barcode:
        return []

    normalized_site_name = normalize_source_name(site_name)
    if normalized_site_name == "farmakopoiosmou" and await _barcode_has_protected_photo_lock(barcode):
        existing_paths = resolve_local_image_paths("/app/images", barcode)
        if existing_paths:
            print(
                f"Skipping farmakopoiosmou image overwrite for locked barcode {barcode}; "
                f"preserving {len(existing_paths)} existing hosted image(s)."
            )
            return [str(path).replace("\\", "/") for path in existing_paths]

        print(
            f"Skipping farmakopoiosmou image download for locked barcode {barcode}; "
            "no existing hosted pharmacy295 image set found."
        )
        return []

    image_dir = ensure_barcode_image_dir("/app/images", barcode)
    normalized_urls = [str(raw_url or "").strip() for raw_url in image_urls if str(raw_url or "").strip()]
    saved_paths: list[str] = []
    seen_urls: set[str] = set()

    if replace_existing:
        temp_dir = image_dir / ".incoming"
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        temp_dir.mkdir(parents=True, exist_ok=True)
        temp_saved_paths: list[Path] = []

        try:
            for index, image_url in enumerate(normalized_urls, start=1):
                if image_url in seen_urls:
                    continue
                seen_urls.add(image_url)
                temp_path = temp_dir / f"{index}.jpg"
                saved_path = await _download_image_with_retries(
                    image_url,
                    str(temp_path),
                    site_name,
                    referer=referer,
                )
                if saved_path:
                    temp_saved_paths.append(Path(saved_path))
        except asyncio.CancelledError:
            try:
                if temp_saved_paths:
                    return _finalize_replaced_image_set(image_dir, barcode, temp_saved_paths)
            finally:
                shutil.rmtree(temp_dir, ignore_errors=True)
            raise

        if not temp_saved_paths:
            shutil.rmtree(temp_dir, ignore_errors=True)
            return []

        saved_paths = _finalize_replaced_image_set(image_dir, barcode, temp_saved_paths)
        shutil.rmtree(temp_dir, ignore_errors=True)
        return saved_paths

    for index, image_url in enumerate(normalized_urls, start=1):
        if image_url in seen_urls:
            continue
        seen_urls.add(image_url)
        image_local_path = str(image_dir / f"{index}.jpg")
        saved_path = await _download_image_with_retries(
            image_url,
            image_local_path,
            site_name,
            referer=referer,
        )
        if saved_path:
            saved_paths.append(saved_path.replace("\\", "/"))

    return saved_paths


async def _append_not_found(barcode: str) -> None:
    async with aiofiles.open("not_found.txt", "a", encoding="utf-8") as output_file:
        await output_file.write(f"{barcode}\n")


async def _persist_progress(product_data: Dict[str, Any]) -> None:
    async with aiofiles.open("products_data.json", "w", encoding="utf-8") as output_file:
        await output_file.write(json.dumps([product_data], ensure_ascii=False, indent=4))


async def _dump_skroutz_debug(page, barcode: str) -> None:
    debug_dir = Path("/app")
    screenshot_path = debug_dir / f"debug_skroutz_{barcode}.png"
    html_path = debug_dir / f"debug_skroutz_{barcode}.html"

    try:
        print(f"skroutz final page url for {barcode}: {page.url}")
    except Exception:
        pass

    try:
        await page.screenshot(path=str(screenshot_path), full_page=True)
        print(f"Saved skroutz screenshot: {screenshot_path}")
    except Exception as exc:
        print(f"Failed to save skroutz screenshot for {barcode}: {exc}")

    try:
        content = await page.content()
        async with aiofiles.open(html_path, "w", encoding="utf-8") as output_file:
            await output_file.write(content)
        print(f"Saved skroutz html: {html_path}")
    except Exception as exc:
        print(f"Failed to save skroutz html for {barcode}: {exc}")


async def _dump_farmakopoiosmou_debug(page, barcode: str) -> None:
    debug_dir = Path("/app")
    screenshot_path = debug_dir / f"debug_farmakopoiosmou_{barcode}.png"
    html_path = debug_dir / f"debug_farmakopoiosmou_{barcode}.html"

    try:
        print(f"farmakopoiosmou final page url for {barcode}: {page.url}")
    except Exception:
        pass

    try:
        await page.screenshot(path=str(screenshot_path), full_page=True)
        print(f"Saved farmakopoiosmou screenshot: {screenshot_path}")
    except Exception as exc:
        print(f"Failed to save farmakopoiosmou screenshot for {barcode}: {exc}")

    try:
        content = await page.content()
        async with aiofiles.open(html_path, "w", encoding="utf-8") as output_file:
            await output_file.write(content)
        print(f"Saved farmakopoiosmou html: {html_path}")
    except Exception as exc:
        print(f"Failed to save farmakopoiosmou html for {barcode}: {exc}")


async def _fetch_farmakopoiosmou_instant_search_json(barcode: str, page_number: int | None = None) -> Dict[str, Any]:
    params = {"text": barcode}
    if page_number is not None:
        params["page"] = str(page_number)

    timeout = aiohttp.ClientTimeout(total=20)
    headers = {
        "User-Agent": _USER_AGENT,
        "Accept": "application/json, text/plain, */*",
        "Referer": f"{_FARMAKOPOIOSMOU_BASE_URL}/",
    }
    await _apply_polite_delay()
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(
            f"{_FARMAKOPOIOSMOU_BASE_URL}/instant-search",
            params=params,
            headers=headers,
        ) as response:
            if response.status != 200:
                print(f"farmakopoiosmou instant-search status {response.status} for barcode {barcode}")
                return {}
            try:
                return await response.json(content_type=None)
            except Exception as exc:
                print(f"farmakopoiosmou instant-search JSON parse failed for barcode {barcode}: {exc}")
                return {}


async def _fetch_text_response(url: str, *, referer: str = "") -> str:
    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(ssl=False)
    headers = {
        "User-Agent": _USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    if referer:
        headers["Referer"] = referer

    await _apply_polite_delay()
    async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
        async with session.get(url, headers=headers) as response:
            if response.status != 200:
                print(f"farmakopoiosmou product fetch status {response.status} for {url}")
                return ""
            return await response.text()


async def _fetch_text_response_via_curl(url: str, *, referer: str = "") -> str:
    command = [
        "curl",
        "-L",
        "-sS",
        "-A",
        _USER_AGENT,
        "--max-time",
        "25",
        url,
    ]
    if referer:
        command.extend(["-H", f"Referer: {referer}"])

    await _apply_polite_delay()
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        print(f"curl fetch status {process.returncode} for {url}: {(stderr or b'').decode('utf-8', 'ignore').strip()}")
        return ""
    return (stdout or b"").decode("utf-8", "ignore")


async def _fetch_text_response_via_kpdhellas_bridge(url: str, *, referer: str = "") -> str:
    if not _KPDHELLAS_BRIDGE_URL:
        return ""

    timeout = aiohttp.ClientTimeout(total=_KPDHELLAS_BRIDGE_TIMEOUT_SECONDS)
    payload = {"url": url, "referer": referer}
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(f"{_KPDHELLAS_BRIDGE_URL}/fetch-text", json=payload) as response:
                if response.status != 200:
                    detail = await response.text()
                    print(f"kpdhellas bridge fetch-text status {response.status} for {url}: {detail[:240]}")
                    return ""
                data = await response.json()
                return str(data.get("text", "")).strip()
    except Exception as exc:
        print(f"kpdhellas bridge fetch-text error for {url}: {exc}")
        return ""


async def _download_image_via_kpdhellas_bridge(
    img_url: str,
    image_local_path: str,
    *,
    referer: str = "",
) -> str:
    if not _KPDHELLAS_BRIDGE_URL:
        return ""

    image_path = Path(image_local_path)
    image_path.parent.mkdir(parents=True, exist_ok=True)
    timeout = aiohttp.ClientTimeout(total=_KPDHELLAS_BRIDGE_TIMEOUT_SECONDS)
    payload = {"url": img_url, "referer": referer}
    try:
        await _apply_polite_delay()
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(f"{_KPDHELLAS_BRIDGE_URL}/download-image", json=payload) as response:
                if response.status != 200:
                    detail = await response.text()
                    print(f"kpdhellas bridge download-image status {response.status} for {img_url}: {detail[:240]}")
                    return ""
                content = await response.read()
                content = _prepare_image_bytes_for_storage(content, "kpdhellas")
                async with aiofiles.open(image_local_path, "wb") as image_file:
                    await image_file.write(content)
                try:
                    os.chmod(image_local_path, 0o664)
                except Exception as exc:
                    print(f"Image chmod skipped for {image_local_path}: {exc}")
                try:
                    os.chown(image_local_path, _IMAGE_FILE_UID, _IMAGE_FILE_GID)
                except Exception as exc:
                    print(f"Image chown skipped for {image_local_path}: {exc}")
                print(f"kpdhellas bridge image saved: {image_local_path}")
                return image_local_path
    except Exception as exc:
        print(f"kpdhellas bridge image download error for {img_url}: {exc}")
        return ""


def _strip_html(value: str) -> str:
    text = re.sub(r"<script\b[^>]*>.*?</script>", " ", value or "", flags=re.I | re.S)
    text = re.sub(r"<style\b[^>]*>.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</p\s*>", "\n\n", text, flags=re.I)
    text = re.sub(r"</div\s*>", "\n", text, flags=re.I)
    text = re.sub(r"</li\s*>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = text.replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_meta_content(page_html: str, property_name: str) -> str:
    patterns = [
        rf'<meta[^>]+property="{re.escape(property_name)}"[^>]+content="([^"]+)"',
        rf"<meta[^>]+property='{re.escape(property_name)}'[^>]+content='([^']+)'",
        rf'<meta[^>]+name="{re.escape(property_name)}"[^>]+content="([^"]+)"',
        rf"<meta[^>]+name='{re.escape(property_name)}'[^>]+content='([^']+)'",
    ]
    for pattern in patterns:
        match = re.search(pattern, page_html, flags=re.I)
        if match:
            return html.unescape(match.group(1)).strip()
    return ""


def _extract_first_match(page_html: str, patterns: list[str]) -> str:
    for pattern in patterns:
        match = re.search(pattern, page_html, flags=re.I | re.S)
        if match:
            return _strip_html(match.group(1))
    return ""


def _extract_all_matches(page_html: str, patterns: list[str]) -> list[str]:
    values: list[str] = []
    seen: set[str] = set()
    for pattern in patterns:
        for match in re.finditer(pattern, page_html, flags=re.I | re.S):
            text = _strip_html(match.group(1))
            text = _sanitize_extracted_text(_trim_farmakopoiosmou_description(text))
            if not text or text in seen:
                continue
            seen.add(text)
            values.append(text)
    return values


def _html_has_exact_barcode(page_html: str, barcode: str) -> bool:
    compact_html = re.sub(r"\s+", "", page_html or "")
    compact_barcode = re.escape(barcode)
    patterns = [
        rf"Κωδικός[:：]</[^>]+>{compact_barcode}",
        rf"Κωδικός[:：]{compact_barcode}",
        rf"Κωδικός[:：].{{0,120}}{compact_barcode}",
        rf"item_id['\"]?\s*:\s*['\"]{compact_barcode}['\"]",
        rf'"sku"\s*:\s*"{compact_barcode}"',
        rf"data-ean=['\"]{compact_barcode}['\"]",
        rf"data-enhanced_ecommerce_id=['\"]{compact_barcode}['\"]",
        rf'itemprop="mpn"content="[^"]*{compact_barcode}[^"]*"',
        rf'itemprop="gtin13"content="[^"]*{compact_barcode}[^"]*"',
        rf'"mpn":"[^"]*{compact_barcode}[^"]*"',
        rf'"gtin13":"[^"]*{compact_barcode}[^"]*"',
        rf"ean13</dt><dd[^>]*>{compact_barcode}</dd>",
        rf'"ean13"\s*:\s*"{compact_barcode}"',
    ]
    return any(re.search(pattern, compact_html, flags=re.I) for pattern in patterns)


def _decode_embedded_json_string(value: str) -> str:
    raw_value = str(value or "").strip()
    if not raw_value:
        return ""
    try:
        return json.loads(f'"{raw_value}"')
    except Exception:
        return html.unescape(raw_value).replace("\\/", "/")


def _extract_cure4u_candidate_urls_from_search_html(page_html: str, limit: int = 8) -> list[str]:
    urls: list[str] = []
    patterns = [
        r'<a[^>]+href="([^"]+)"[^>]+class="[^"]*product_img_link[^"]*"',
        r'<a[^>]+class="[^"]*product_img_link[^"]*"[^>]+href="([^"]+)"',
        r'<a[^>]+href="([^"]+)"[^>]+class="[^"]*product-name[^"]*"',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, page_html or "", flags=re.I | re.S):
            candidate = _canonicalize_cure4u_url(html.unescape(match.group(1)))
            if not candidate:
                continue
            parsed = urlparse(candidate)
            if parsed.path.rstrip("/") in {"", "/search", "/module/ambjolisearch/jolisearch"}:
                continue
            if candidate not in urls:
                urls.append(candidate)
            if len(urls) >= limit:
                return urls
    return urls


def _extract_gohealthy_candidate_urls_from_search_html(page_html: str, limit: int = 8) -> list[str]:
    urls: list[str] = []
    patterns = [
        r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"',
        r'<meta[^>]+property="og:url"[^>]+content="([^"]+)"',
        r'<a[^>]+href="([^"]+)"[^>]+class="[^"]*(?:product|item|name|title)[^"]*"',
        r'<a[^>]+class="[^"]*(?:product|item|name|title)[^"]*"[^>]+href="([^"]+)"',
        r'"url"\s*:\s*"(https?:\\/\\/www\.gohealthy\.gr\\/[^"]+)"',
        r'href="(https?://www\.gohealthy\.gr/[^"]+)"',
        r'href="(/[^"]+)"',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, page_html or "", flags=re.I | re.S):
            candidate = html.unescape(match.group(1)).replace("\\/", "/")
            candidate = _canonicalize_gohealthy_url(candidate)
            if not _is_probable_gohealthy_product_url(candidate):
                continue
            if candidate not in urls:
                urls.append(candidate)
            if len(urls) >= limit:
                return urls
    return urls


def _prioritize_gohealthy_candidate_urls(candidate_urls: list[str], barcode: str, query: str, limit: int = 8) -> list[str]:
    barcode = str(barcode or "").strip()
    query_tokens = [token for token in re.split(r"[^a-z0-9]+", (query or "").lower()) if token and len(token) > 2]

    def score(url: str) -> tuple[int, int, int]:
        lowered = (url or "").lower()
        barcode_match = 1 if barcode and barcode in lowered else 0
        query_matches = sum(1 for token in query_tokens if token in lowered)
        shorter = -len(lowered)
        return (barcode_match, query_matches, shorter)

    ranked = sorted(candidate_urls, key=score, reverse=True)
    unique_ranked: list[str] = []
    for url in ranked:
        if url and url not in unique_ranked:
            unique_ranked.append(url)
        if len(unique_ranked) >= limit:
            break
    return unique_ranked


def _normalize_gohealthy_image_url(value: str) -> str:
    value = html.unescape((value or "").strip()).replace("\\/", "/")
    if not value:
        return ""
    if value.startswith("//"):
        value = f"https:{value}"
    if value.startswith("/"):
        value = urljoin(_GOHEALTHY_BASE_URL, value)
    parsed = urlparse(value)
    parsed = parsed._replace(query="", fragment="")
    return urlunparse(parsed)


def _extract_gohealthy_image_urls_from_html(page_html: str, product_url: str = "") -> list[str]:
    image_urls: list[str] = []
    product_slug = urlparse(product_url or "").path.rstrip("/").split("/")[-1].lower()

    def _add(raw_value: str) -> None:
        candidate = _normalize_gohealthy_image_url(raw_value)
        if not candidate:
            return
        lowered = candidate.lower()
        if not any(marker in lowered for marker in ("/product", "/products", "/uploads/", "/media/", "/cache/")):
            return
        if product_slug and product_slug not in lowered and "/uploads/" not in lowered and "/media/" not in lowered:
            return
        if candidate not in image_urls:
            image_urls.append(candidate)

    patterns = [
        r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"',
        r'<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"',
        r'itemprop="image"\s+content="([^"]+)"',
        r'data-large_image="([^"]+)"',
        r'data-src="([^"]+)"',
        r'<img[^>]+src="([^"]+)"[^>]+class="[^"]*(?:product|gallery|main|wp-post-image)[^"]*"',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, page_html or "", flags=re.I | re.S):
            _add(match.group(1).split(" ", 1)[0].strip())
    return image_urls[:12]


def _extract_gohealthy_product_data_from_html(page_html: str, barcode: str, product_url: str) -> Dict[str, Any]:
    title = _sanitize_extracted_text(
        _extract_meta_content(page_html, "og:title")
        or _extract_first_match(
            page_html,
            [
                r'<h1[^>]*>(.*?)</h1>',
                r'<div[^>]+class="[^"]*(?:product|entry)-title[^"]*"[^>]*>(.*?)</div>',
            ],
        )
    )

    sml_title = _sanitize_extracted_text(
        _extract_meta_content(page_html, "description")
        or _extract_meta_content(page_html, "og:description")
        or _extract_first_match(
            page_html,
            [
                r'<div[^>]+class="[^"]*(?:short-description|product-excerpt)[^"]*"[^>]*>(.*?)</div>',
                r'<meta[^>]+itemprop="description"[^>]+content="([^"]+)"',
            ],
        )
    )

    description_candidates = _extract_all_matches(
        page_html,
        [
            r'<div[^>]+class="[^"]*(?:product-description|description|entry-content|woocommerce-Tabs-panel)[^"]*"[^>]*>(.*?)</div>',
            r'<section[^>]+class="[^"]*(?:product-description|description)[^"]*"[^>]*>(.*?)</section>',
            r'<div[^>]+id="description"[^>]*>(.*?)</div>',
        ],
    )
    description = max(description_candidates, key=len, default="") or sml_title

    brand = _sanitize_extracted_text(
        _extract_first_match(
            page_html,
            [
                r'"brand"\s*:\s*\{.*?"name"\s*:\s*"([^"]+)"',
                r'<meta[^>]+property="product:brand"[^>]+content="([^"]+)"',
                r'<span[^>]+class="[^"]*(?:brand|manufacturer)[^"]*"[^>]*>(.*?)</span>',
            ],
        )
    )
    if not brand and title:
        brand = title.split()[0]

    breadcrumb_values: list[str] = []
    breadcrumb_block = _extract_first_match(
        page_html,
        [
            r'<nav[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</nav>',
            r'<ul[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</ul>',
            r'<div[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</div>',
        ],
    )
    for link_match in re.finditer(r"<a[^>]*>(.*?)</a>", breadcrumb_block or "", flags=re.I | re.S):
        value = _sanitize_extracted_text(_strip_html(link_match.group(1)))
        if not value or value.lower() in {"home", "αρχική"} or value == title:
            continue
        if value not in breadcrumb_values:
            breadcrumb_values.append(value)

    hierarchy = breadcrumb_values[-3:]
    category_1 = hierarchy[0] if len(hierarchy) >= 1 else ""
    category_2 = hierarchy[1] if len(hierarchy) >= 2 else ""
    category_3 = hierarchy[2] if len(hierarchy) >= 3 else ""
    category = category_3 or category_2 or category_1

    image_urls = sanitize_source_image_urls(
        "gohealthy",
        barcode,
        _extract_gohealthy_image_urls_from_html(page_html, product_url),
        limit=12,
    )
    image_url = image_urls[0] if image_urls else ""

    canonical_product_url = _canonicalize_gohealthy_url(
        _extract_meta_content(page_html, "og:url")
        or _extract_first_match(page_html, [r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"'])
        or product_url
    )

    return {
        "Site_Id": "gohealthy_001",
        "Barcode": barcode,
        "Site": "gohealthy",
        "Categ": category,
        "Product_Link": canonical_product_url,
        "Img_src": image_url,
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": sml_title,
        "Description": description,
        "fullDesc": description,
        "Brand": brand,
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
    }


def _normalize_cure4u_image_url(value: str) -> str:
    value = html.unescape((value or "").strip())
    if not value:
        return ""
    if value.startswith("//"):
        value = f"https:{value}"
    if value.startswith("/"):
        value = urljoin(_CURE4U_BASE_URL, value)
    parsed = urlparse(value)
    parsed = parsed._replace(query="")
    return urlunparse(parsed)


def _extract_cure4u_image_urls_from_html(page_html: str, product_url: str = "") -> list[str]:
    image_urls: list[str] = []
    seen_filenames: set[str] = set()
    product_slug = urlparse(product_url or "").path.rstrip("/").split("/")[-1].lower()
    patterns = [
        r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"',
        r'itemprop="image"\s+content="([^"]+)"',
        r'data-src="([^"]+)"',
        r'data-srcset="([^"]+)"',
        r'<img[^>]+src="([^"]+)"[^>]+itemprop="image"',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, page_html or "", flags=re.I):
            raw_value = match.group(1).split(" ", 1)[0].strip()
            candidate = _normalize_cure4u_image_url(raw_value)
            if not candidate:
                continue
            parsed = urlparse(candidate)
            filename = Path(parsed.path).name.lower()
            if not filename:
                continue
            if product_slug and product_slug not in parsed.path.lower():
                continue
            if filename in seen_filenames:
                continue
            seen_filenames.add(filename)
            if candidate not in image_urls:
                image_urls.append(candidate)
    return image_urls[:12]


def _extract_cure4u_product_data_from_html(page_html: str, barcode: str, product_url: str) -> Dict[str, Any]:
    decoded_html = html.unescape(page_html or "")
    title = _sanitize_extracted_text(_extract_meta_content(page_html, "og:title"))
    if not title:
        title = _sanitize_extracted_text(_extract_first_match(page_html, [r"<h1[^>]*>(.*?)</h1>"]))
    title = re.sub(r"\s*\|\s*Cure4u\.gr\s*$", "", title, flags=re.I).strip()

    sml_title = _sanitize_extracted_text(
        _extract_meta_content(page_html, "og:description")
        or _extract_first_match(
            page_html,
            [
                r'<div[^>]+class="[^"]*product-description-short[^"]*"[^>]*>(.*?)</div>',
                r'<meta[^>]+itemprop="description"[^>]+content="([^"]+)"',
            ],
        )
    )

    description_candidates = _extract_all_matches(
        page_html,
        [
            r'<section[^>]+class="[^"]*product-features[^"]*"[^>]*>(.*?)</section>',
            r'<div[^>]+class="[^"]*product-description-short[^"]*"[^>]*>(.*?)</div>',
            r'<div[^>]+id="description"[^>]*>(.*?)</div>',
            r'<div[^>]+class="[^"]*product-description[^"]*"[^>]*>(.*?)</div>',
        ],
    )
    description = max(description_candidates, key=len, default="")
    if not description:
        description = sml_title

    brand = _sanitize_extracted_text(
        _extract_first_match(
            decoded_html,
            [
                r'"manufacturer_name":"([^"]+)"',
                r'<meta[^>]+property="product:brand"[^>]+content="([^"]+)"',
            ],
        )
    )
    if not brand and title:
        brand = title.split()[0]

    breadcrumb_values: list[str] = []
    breadcrumb_match = re.search(r'"breadcrumb":\{"links":\[(.*?)\],"count":\d+\}', decoded_html, flags=re.I | re.S)
    if breadcrumb_match:
        for title_match in re.finditer(r'"title":"(.*?)"', breadcrumb_match.group(1), flags=re.I | re.S):
            value = _sanitize_extracted_text(_decode_embedded_json_string(title_match.group(1)))
            if not value:
                continue
            if value.lower() in {"αρχική", "home"}:
                continue
            if value == title:
                continue
            if value not in breadcrumb_values:
                breadcrumb_values.append(value)
    hierarchy = breadcrumb_values[-3:]
    category_1 = hierarchy[0] if len(hierarchy) >= 1 else ""
    category_2 = hierarchy[1] if len(hierarchy) >= 2 else ""
    category_3 = hierarchy[2] if len(hierarchy) >= 3 else ""
    category = category_3 or category_2 or category_1

    image_urls = sanitize_source_image_urls("cure4u", barcode, _extract_cure4u_image_urls_from_html(page_html, product_url), limit=12)
    image_url = image_urls[0] if image_urls else ""

    return {
        "Site_Id": "cure4u_001",
        "Barcode": barcode,
        "Site": "cure4u",
        "Categ": category,
        "Product_Link": _canonicalize_cure4u_url(product_url),
        "Img_src": image_url,
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": sml_title,
        "Description": description,
        "fullDesc": description,
        "Brand": brand,
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
    }


def _extract_kpdhellas_candidate_urls_from_search_html(page_html: str, limit: int = 8) -> list[str]:
    urls: list[str] = []
    patterns = [
        r'<a[^>]+href="([^"]+)"[^>]+class="[^"]*product-img[^"]*"',
        r'<div[^>]+class="[^"]*name[^"]*"[^>]*>\s*<a[^>]+href="([^"]+)"',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, page_html or "", flags=re.I | re.S):
            candidate = _canonicalize_kpdhellas_url(html.unescape(match.group(1)))
            if not candidate:
                continue
            parsed = urlparse(candidate)
            if parsed.path.rstrip("/") in {"", "/search-results"}:
                continue
            if candidate not in urls:
                urls.append(candidate)
            if len(urls) >= limit:
                return urls
    return urls


def _prioritize_kpdhellas_candidate_urls(candidate_urls: list[str], barcode: str, query: str, limit: int = 8) -> list[str]:
    barcode = str(barcode or "").strip()
    query_tokens = [token for token in re.split(r"[^a-z0-9]+", (query or "").lower()) if token and len(token) > 2]

    def score(url: str) -> tuple[int, int, int]:
        lowered = (url or "").lower()
        barcode_match = 1 if barcode and barcode in lowered else 0
        query_matches = sum(1 for token in query_tokens if token in lowered)
        shorter = -len(lowered)
        return (barcode_match, query_matches, shorter)

    ranked = sorted(candidate_urls, key=score, reverse=True)
    unique_ranked: list[str] = []
    for url in ranked:
        if url and url not in unique_ranked:
            unique_ranked.append(url)
        if len(unique_ranked) >= limit:
            break
    return unique_ranked


def _normalize_kpdhellas_image_url(value: str) -> str:
    value = html.unescape((value or "").strip()).replace("\\/", "/")
    if not value:
        return ""
    if value.startswith("//"):
        value = f"https:{value}"
    if value.startswith("/"):
        value = urljoin(_KPDHELLAS_BASE_URL, value)
    parsed = urlparse(value)
    parsed = parsed._replace(query="", fragment="")
    return urlunparse(parsed)


def _extract_kpdhellas_image_urls_from_html(page_html: str, product_url: str = "") -> list[str]:
    image_urls: list[str] = []

    def _add(raw_value: str) -> None:
        candidate = _normalize_kpdhellas_image_url(raw_value)
        if candidate and candidate not in image_urls:
            image_urls.append(candidate)

    for pattern in [
        r'data-largeimg="([^"]+)"',
        r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"',
        r'<img[^>]+src="([^"]+)"[^>]+class="[^"]*img-first[^"]*"',
    ]:
        for match in re.finditer(pattern, page_html or "", flags=re.I | re.S):
            _add(match.group(1))

    for attr_pattern in [
        r"data-images='([^']+)'",
        r'data-images="([^"]+)"',
    ]:
        for match in re.finditer(attr_pattern, page_html or "", flags=re.I | re.S):
            raw_value = html.unescape(match.group(1))
            try:
                payload = json.loads(raw_value)
            except Exception:
                continue
            if not isinstance(payload, list):
                continue
            for item in payload:
                if not isinstance(item, dict):
                    continue
                _add(str(item.get("src", "")).strip())

    return image_urls[:12]


def _extract_kpdhellas_product_data_from_html(page_html: str, barcode: str, product_url: str) -> Dict[str, Any]:
    title = _sanitize_extracted_text(
        _extract_meta_content(page_html, "og:title")
        or _extract_first_match(
            page_html,
            [
                r'<h1[^>]+class="[^"]*title[^"]*page-title[^"]*"[^>]*>\s*<span>(.*?)</span>',
                r"<h1[^>]*>(.*?)</h1>",
            ],
        )
    )

    sml_title = _sanitize_extracted_text(
        _extract_meta_content(page_html, "description")
        or _extract_first_match(
            page_html,
            [
                r'<div[^>]+class="[^"]*block-short_description[^"]*"[^>]*>(.*?)</div>',
            ],
        )
    )

    description_candidates = _extract_all_matches(
        page_html,
        [
            r'<div[^>]+class="[^"]*block-description[^"]*"[^>]*>(.*?)</div>',
            r'<div[^>]+class="[^"]*block-short_description[^"]*"[^>]*>(.*?)</div>',
        ],
    )
    description = max(description_candidates, key=len, default="") or sml_title

    brand = _sanitize_extracted_text(
        _extract_first_match(
            page_html,
            [
                r'<li[^>]+class="[^"]*product-manufacturer[^"]*"[^>]*>.*?<a[^>]*>(.*?)</a>',
            ],
        )
    )
    if not brand and title:
        brand = title.split()[0]

    breadcrumb_values: list[str] = []
    breadcrumb_block = _extract_first_match(
        page_html,
        [
            r'<ul[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>(.*?)</ul>',
        ],
    )
    for link_match in re.finditer(r"<a[^>]*>(.*?)</a>", breadcrumb_block or "", flags=re.I | re.S):
        value = _sanitize_extracted_text(_strip_html(link_match.group(1)))
        if not value or value.lower() in {"home", "αρχική"} or value == title:
            continue
        if value not in breadcrumb_values:
            breadcrumb_values.append(value)

    hierarchy = breadcrumb_values[-3:]
    category_1 = hierarchy[0] if len(hierarchy) >= 1 else ""
    category_2 = hierarchy[1] if len(hierarchy) >= 2 else ""
    category_3 = hierarchy[2] if len(hierarchy) >= 3 else ""
    category = category_3 or category_2 or category_1

    image_urls = sanitize_source_image_urls(
        "kpdhellas",
        barcode,
        _extract_kpdhellas_image_urls_from_html(page_html, product_url),
        limit=12,
    )
    image_url = image_urls[0] if image_urls else ""

    return {
        "Site_Id": "kpdhellas_001",
        "Barcode": barcode,
        "Site": "kpdhellas",
        "Categ": category,
        "Product_Link": _canonicalize_kpdhellas_url(product_url),
        "Img_src": image_url,
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": sml_title,
        "Description": description,
        "fullDesc": description,
        "Brand": brand,
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
    }


def _normalize_vita4you_image_url(value: str) -> str:
    value = html.unescape((value or "").strip())
    if not value:
        return ""
    if value.startswith("//"):
        value = f"https:{value}"
    value = value.replace("\\/", "/")
    if value.startswith("/"):
        value = urljoin(_VITA4YOU_BASE_URL, value)
    parsed = urlparse(value)
    if parsed.query:
        parsed = parsed._replace(query="")
    return urlunparse(parsed)


def _extract_vita4you_candidate_urls_from_search_html(page_html: str, barcode: str, limit: int = 8) -> list[str]:
    urls: list[str] = []
    patterns = [
        re.compile(
            r'<a[^>]+itemprop="url"[^>]+href="([^"]+)"[^>]*>.*?<meta itemprop="mpn" content="([^"]+)"',
            re.I | re.S,
        ),
        re.compile(
            r'<a[^>]+itemprop="url"[^>]+href="([^"]+)"[^>]*>.*?<meta itemprop="gtin13" content="([^"]+)"',
            re.I | re.S,
        ),
        re.compile(
            r'"url":"(https:\\/\\/www\.vita4you\.gr\\/el\\/[^"]+)".*?"mpn":"([^"]+)"',
            re.I | re.S,
        ),
    ]
    for pattern in patterns:
        for href, barcode_haystack in pattern.findall(page_html or ""):
            candidate = html.unescape(href).replace("\\/", "/")
            if barcode not in html.unescape(barcode_haystack):
                continue
            candidate = _canonicalize_vita4you_url(candidate)
            if candidate and candidate not in urls:
                urls.append(candidate)
            if len(urls) >= limit:
                return urls
    return urls


def _extract_vita4you_klevu_api_key(page_html: str) -> str:
    patterns = [
        r"['\"]apiKeys?['\"]\s*:\s*\[\s*['\"](klevu-[^'\"]+)['\"]",
        r"['\"]apiKey['\"]\s*:\s*['\"](klevu-[^'\"]+)['\"]",
        r"\b(klevu-\d{8,})\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, page_html or "", flags=re.I)
        if match:
            return match.group(1).strip()
    return _VITA4YOU_KLEVU_API_KEY


async def _fetch_vita4you_candidate_urls_via_klevu(query: str, page_html: str = "", limit: int = 8) -> list[str]:
    query = _normalize_source_search_term(query)
    if not query:
        return []

    api_key = _extract_vita4you_klevu_api_key(page_html)
    if not api_key or not _VITA4YOU_KLEVU_SEARCH_URL:
        return []

    payload = {
        "recordQueries": [
            {
                "id": "productList",
                "typeOfRequest": "SEARCH",
                "settings": {
                    "query": {"term": query},
                    "typeOfRecords": ["KLEVU_PRODUCT"],
                    "fallbackQueryId": "productListFallback",
                    "limit": limit,
                    "searchPrefs": ["searchCompoundsAsAndQuery"],
                    "sort": "RELEVANCE",
                },
            }
        ],
        "context": {
            "apiKeys": [api_key],
        },
    }

    timeout = aiohttp.ClientTimeout(total=20)
    headers = {
        "User-Agent": _USER_AGENT,
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": _VITA4YOU_BASE_URL,
        "Referer": f"{_VITA4YOU_BASE_URL}/",
    }

    await _apply_polite_delay()
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                _VITA4YOU_KLEVU_SEARCH_URL,
                headers=headers,
                json=payload,
            ) as response:
                if response.status != 200:
                    print(f"vita4you klevu search status {response.status} for query {query}")
                    return []
                data = await response.json(content_type=None)
    except Exception as exc:
        print(f"vita4you klevu search failed for query {query}: {exc}")
        return []

    urls: list[str] = []
    query_results = data.get("queryResults") if isinstance(data, dict) else None
    if not isinstance(query_results, list):
        return []

    for result in query_results:
        records = result.get("records") if isinstance(result, dict) else None
        if not isinstance(records, list):
            continue
        for record in records:
            candidate = _canonicalize_vita4you_url((record or {}).get("url", ""))
            if not _is_probable_vita4you_product_url(candidate):
                continue
            if candidate in urls:
                continue
            urls.append(candidate)
            if len(urls) >= limit:
                return urls
    return urls


def _vita4you_candidate_limit(query: str, barcode: str) -> int:
    if _normalize_source_search_term(query) == _normalize_source_search_term(barcode):
        return 5
    return 3


def _normalize_source_search_term(value: str) -> str:
    return _normalize_space(str(value or "").strip())


def _build_source_search_terms(barcode: str, *candidate_terms: str) -> list[str]:
    terms: list[str] = []

    def add(term: str) -> None:
        normalized = _normalize_source_search_term(term)
        if not normalized or normalized in terms:
            return
        terms.append(normalized)

    add(barcode)
    for term in candidate_terms:
        add(term)
        stripped = re.sub(r"^\d+\s*[xX]\s*", "", _normalize_source_search_term(term)).strip(" -")
        if stripped and stripped != term:
            add(stripped)
        compact = " ".join(stripped.split()[:8]) if stripped else ""
        if compact and compact != stripped:
            add(compact)

    return terms


def _tokenize_source_search_text(value: str) -> list[str]:
    return [
        token
        for token in re.findall(r"[a-zA-ZΑ-Ωα-ω0-9]+", (value or "").lower())
        if len(token) >= 3
    ]


def _title_matches_source_query(title: str, query: str) -> bool:
    normalized_title = _normalize_space((title or "").lower())
    normalized_query = _normalize_space((query or "").lower())
    if not normalized_title or not normalized_query:
        return False
    if normalized_query in normalized_title:
        return True

    title_tokens = set(_tokenize_source_search_text(normalized_title))
    query_tokens = set(_tokenize_source_search_text(normalized_query))
    if not title_tokens or not query_tokens:
        return False

    common = title_tokens & query_tokens
    minimum_overlap = 2 if len(query_tokens) <= 4 else 3
    return len(common) >= minimum_overlap


def _extract_source_query_discriminators(value: str) -> set[str]:
    discriminators: set[str] = set()
    for token in _tokenize_source_search_text(value):
        if re.fullmatch(r"no\d+", token):
            discriminators.add(token)
        if re.search(r"\d", token):
            for digits in re.findall(r"\d+", token):
                if 1 <= len(digits) <= 3:
                    discriminators.add(digits)
    return discriminators


def _title_matches_source_query_strict(title: str, query: str) -> bool:
    if not _title_matches_source_query(title, query):
        return False

    query_discriminators = _extract_source_query_discriminators(query)
    if not query_discriminators:
        return True

    title_discriminators = _extract_source_query_discriminators(title)
    return query_discriminators.issubset(title_discriminators)


def _is_probable_vita4you_product_url(url: str) -> bool:
    candidate = _canonicalize_vita4you_url(url)
    if not candidate:
        return False
    parsed = urlparse(candidate)
    path = parsed.path.strip("/")
    if not path.startswith("el/"):
        return False
    last_segment = path.split("/")[-1]
    if last_segment in {"search", "catalogsearch", "result", "index"}:
        return False
    return "-" in last_segment


async def _extract_vita4you_candidate_urls_via_browser(search_url: str, limit: int = 8) -> list[str]:
    playwright = browser = context = page = None
    collected: list[str] = []
    selectors = [
        "#kuResultListBlock a[href*='/el/']",
        ".klevuLanding a[href*='/el/']",
        ".kuResults a[href*='/el/']",
        "a[href*='/el/'][href*='babylino']",
    ]
    try:
        playwright, browser, context, page = await _new_page(use_proxy=False)
        if not await _goto(page, search_url):
            return []
        await _try_accept_cookies(page)

        for _ in range(16):
            for selector in selectors:
                locator = page.locator(selector)
                count = min(await _count(locator), 24)
                for index in range(count):
                    href = await _attribute(locator.nth(index), "href")
                    href = _canonicalize_vita4you_url(href)
                    if not _is_probable_vita4you_product_url(href):
                        continue
                    if href not in collected:
                        collected.append(href)
                    if len(collected) >= limit:
                        return collected
            if collected:
                return collected
            await page.wait_for_timeout(500)

        content = await page.content()
        for match in re.finditer(r'https://www\.vita4you\.gr/el/[^"\'>\s]+', content, flags=re.I):
            href = _canonicalize_vita4you_url(match.group(0))
            if not _is_probable_vita4you_product_url(href):
                continue
            if href not in collected:
                collected.append(href)
            if len(collected) >= limit:
                break
        return collected
    except Exception as exc:
        print(f"vita4you browser search fallback failed for {search_url}: {exc}")
        return []
    finally:
        if playwright is not None and context is not None:
            await _close_page(playwright, browser, context)


def _extract_vita4you_image_urls_from_html(page_html: str) -> list[str]:
    image_urls: list[str] = []
    for pattern in [
        r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"',
        r'<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"',
        r'<meta[^>]+itemprop="image"[^>]+content="([^"]+)"',
        r'<img[^>]+class="[^"]*product-image-photo[^"]*"[^>]+src="([^"]+)"',
        r'"full":"(https:\\/\\/assets\.vita4you\.gr\\/pub\\/media\\/catalog\\/product\\/[^"]+)"',
        r'"img":"(https:\\/\\/assets\.vita4you\.gr\\/pub\\/media\\/catalog\\/product\\/[^"]+)"',
    ]:
        for match in re.finditer(pattern, page_html or "", flags=re.I):
            candidate = _normalize_vita4you_image_url(match.group(1))
            if not candidate:
                continue
            if "/pub/media/catalog/product/" not in candidate:
                continue
            if candidate not in image_urls:
                image_urls.append(candidate)
    return image_urls[:12]


def _extract_vita4you_product_data_from_html(page_html: str, barcode: str, product_url: str) -> Dict[str, Any]:
    title = _sanitize_extracted_text(_extract_meta_content(page_html, "og:title"))
    if not title:
        title = _sanitize_extracted_text(_extract_first_match(page_html, [r"<h1[^>]*>(.*?)</h1>"]))

    sml_title = _sanitize_extracted_text(
        _extract_meta_content(page_html, "og:description")
        or _extract_first_match(page_html, [r'<meta[^>]+itemprop="description"[^>]+content="([^"]+)"'])
    )

    description = _sanitize_extracted_text(
        _extract_first_match(
            page_html,
            [
                r'<meta[^>]+itemprop="description"[^>]+content="([^"]+)"',
                r'"description":"(.*?)","sku":',
            ],
        )
    )
    if not description:
        description = sml_title

    brand = _sanitize_extracted_text(
        _extract_meta_content(page_html, "og:brand")
        or _extract_first_match(page_html, [r'"brand":\{"@type":"Brand","name":"([^"]+)"\}'])
    )
    if not brand and title:
        brand = title.split()[0]

    image_urls = _extract_vita4you_image_urls_from_html(page_html)
    image_url = image_urls[0] if image_urls else ""

    breadcrumb_match = re.search(r'<div[^>]+class="[^"]*breadcrumbs[^"]*"[^>]*>(.*?)</div>', page_html, flags=re.I | re.S)
    breadcrumb_values: list[str] = []
    if breadcrumb_match:
        for match in re.finditer(r'<span itemprop="name">(.*?)</span>', breadcrumb_match.group(1), flags=re.I | re.S):
            value = _sanitize_extracted_text(_strip_html(match.group(1)))
            if not value:
                continue
            if value.lower() in {"αρχική", "home"}:
                continue
            if value == title:
                continue
            if value not in breadcrumb_values:
                breadcrumb_values.append(value)
    category_1 = breadcrumb_values[0] if len(breadcrumb_values) >= 1 else ""
    category_2 = breadcrumb_values[1] if len(breadcrumb_values) >= 2 else ""
    category_3 = breadcrumb_values[2] if len(breadcrumb_values) >= 3 else ""
    category = category_3 or category_2 or category_1

    return {
        "Site_Id": "vita4you_001",
        "Barcode": barcode,
        "Site": "vita4you",
        "Categ": category,
        "Product_Link": _canonicalize_vita4you_url(product_url),
        "Img_src": image_url,
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": sml_title,
        "Description": description,
        "fullDesc": description,
        "Brand": brand,
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
        "Weight": "",
    }


def _extract_product_data_from_farmakopoiosmou_html(page_html: str, barcode: str, product_url: str) -> Dict[str, Any]:
    title = _extract_meta_content(page_html, "og:title")
    title = re.sub(r"\s*-\s*oFarmakopoiosMou\.gr\s*$", "", title, flags=re.I).strip()
    if not title:
        title = _extract_first_match(page_html, [r"<h1[^>]*>(.*?)</h1>"])

    sml_title = _extract_meta_content(page_html, "description") or _extract_meta_content(page_html, "og:description")

    description_blocks = _extract_all_matches(
        page_html,
        [
            r'<div[^>]+class="[^"]*field--name-body[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>',
            r'<div[^>]+class="[^"]*field--name-field-[^"]*(?:usage|use|instructions|precautions|care|description)[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>',
            r'<div[^>]+id="tab-description"[^>]*>(.*?)</div>',
            r'<div[^>]+class="[^"]*product-tabs[^"]*"[^>]*>(.*?)</div>\s*</div>',
        ],
    )
    description = "\n\n".join(description_blocks).strip()
    if not description:
        description = sml_title

    image_urls = _extract_farmakopoiosmou_image_urls_from_html(page_html, barcode)
    image_url = image_urls[0] if image_urls else ""

    category_values = []
    breadcrumb_match = re.search(r'<div[^>]+class="[^"]*breadcrumbs[^"]*"[^>]*>(.*?)</div>', page_html, flags=re.I | re.S)
    if breadcrumb_match:
        breadcrumb_text = _strip_html(breadcrumb_match.group(1))
        parts = [part.strip() for part in re.split(r"/|›|»", breadcrumb_text) if part.strip()]
        category_values = [part for part in parts if "online φαρμακείο" not in part.lower()]

    brand = _extract_first_match(
        page_html,
        [
            r'"enhanced-ecommerce-brand":"([^"]+)"',
            r'<meta[^>]+property="product:brand"[^>]+content="([^"]+)"',
        ],
    )
    if not brand and title:
        brand = title.split()[0]

    title = _sanitize_extracted_text(title)
    sml_title = _sanitize_extracted_text(sml_title)
    description = _sanitize_extracted_text(_trim_farmakopoiosmou_description(description))
    brand = _sanitize_extracted_text(brand)

    category_1 = category_values[1] if len(category_values) > 1 else (category_values[0] if category_values else "")
    category_2 = category_values[2] if len(category_values) > 2 else ""
    category_3 = category_values[3] if len(category_values) > 3 else ""
    category = category_3 or category_2 or category_1

    return {
        "Barcode": barcode,
        "Title": title,
        "Sml_Title": sml_title,
        "Description": description,
        "Img_src": image_url,
        "Img_src_List": image_urls,
        "Site": "farmakopoiosmou",
        "Categ": category,
        "Product_Link": product_url,
        "Brand": brand,
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
        "Weight": "",
    }


def _extract_farmakopoiosmou_image_urls_from_html(page_html: str, barcode: str = "") -> list[str]:
    image_urls: list[str] = []

    for pattern in [
        r'<a[^>]+class="[^"]*photoswipe[^"]*"[^>]+href="([^"]+)"',
        r"<a[^>]+class='[^']*photoswipe[^']*'[^>]+href='([^']+)'",
        r'<img[^>]+src="([^"]+)"',
        r"<img[^>]+src='([^']+)'",
    ]:
        for match in re.finditer(pattern, page_html, flags=re.I):
            candidate = _normalize_farmakopoiosmou_image_url(match.group(1))
            if candidate and candidate not in image_urls:
                image_urls.append(candidate)

    og_image = _normalize_farmakopoiosmou_image_url(_extract_meta_content(page_html, "og:image"))
    if og_image and og_image not in image_urls:
        image_urls.append(og_image)

    return sanitize_source_image_urls("farmakopoiosmou", barcode, image_urls, limit=12)


def _extract_farmakopoiosmou_search_pages(search_json: Dict[str, Any]) -> list[int]:
    pager_html = str(search_json.get("data", {}).get("pager", "") or "")
    pages = []
    for match in re.finditer(r"[?&]page=(\d+)", pager_html):
        page_number = int(match.group(1))
        if page_number not in pages:
            pages.append(page_number)
    return pages


def _extract_farmakopoiosmou_candidate_urls_from_search_json(search_json: Dict[str, Any], barcode: str, limit: int = 12) -> list[str]:
    results = search_json.get("data", {}).get("results", {}).get("all", []) or []
    exact_urls: list[str] = []
    related_urls: list[str] = []
    fallback_urls: list[str] = []

    for item in results:
        if not isinstance(item, dict):
            continue
        item_url = str(item.get("url", "")).strip()
        if not item_url:
            continue
        absolute_url = _canonicalize_farmakopoiosmou_url(urljoin(_FARMAKOPOIOSMOU_BASE_URL, item_url))
        ecommerce_id = str(item.get("enhanced-ecommerce-id", "")).strip()
        title = _normalize_space(str(item.get("title", "")))
        body = _normalize_space(re.sub(r"<[^>]+>", " ", str(item.get("body", ""))))
        haystack = " ".join([ecommerce_id, title, body])

        if ecommerce_id == barcode:
            exact_urls.append(absolute_url)
        elif barcode in haystack:
            related_urls.append(absolute_url)
        else:
            fallback_urls.append(absolute_url)

    prioritized_urls = exact_urls + related_urls
    if prioritized_urls:
        return _unique_urls(prioritized_urls, limit=min(limit, 4))

    return _unique_urls(fallback_urls, limit=min(limit, 3))


async def _page_has_exact_barcode(page, barcode: str, site_name: str) -> bool:
    barcode = str(barcode).strip()
    if not barcode:
        return False

    try:
        if site_name == "farmakopoiosmou":
            selectors = [
                "text=/Κωδικός\\s*:\\s*" + re.escape(barcode) + "/",
                ".ty-product-block__sku",
                ".product-code",
                ".sku",
            ]
            for selector in selectors:
                locator = page.locator(selector)
                if await _count(locator) == 0:
                    continue
                for index in range(await _count(locator)):
                    candidate = locator.nth(index)
                    text = await _text(candidate)
                    normalized = re.sub(r"\s+", "", text)
                    if f"Κωδικός:{barcode}" in normalized or normalized == barcode or barcode in normalized:
                        return True
            return False

        content = await page.content()
        return barcode in content
    except Exception:
        return False


async def _is_cloudflare_challenge(page) -> bool:
    try:
        title = await page.title()
    except Exception:
        title = ""

    try:
        content = await page.content()
    except Exception:
        content = ""

    challenge_markers = (
        "Just a moment...",
        "Performing security verification",
        "cf-turnstile-response",
        "/cdn-cgi/challenge-platform/",
        "This website uses a security service to protect against malicious bots",
    )
    haystack = f"{title}\n{content}"
    return any(marker in haystack for marker in challenge_markers)


async def _ensure_not_cloudflare(page, barcode: str) -> None:
    if not await _is_cloudflare_challenge(page):
        return
    await _dump_skroutz_debug(page, barcode)
    raise CloudflareBlockedError(f"Cloudflare challenge detected for barcode {barcode}")


async def _extract_product_data(page, barcode: str, site_name: str, product_url: str) -> Dict[str, Any]:
    if site_name == "farmakopoiosmou":
        title_selectors = [
            "h1.ty-product-block-title",
            "h1.product-title",
            "h1",
        ]
        sml_title_selectors = [
            ".ty-product-block__short-description",
            ".ty-product-block__note",
            ".product-short-description",
            ".field--name-body p",
        ]
        description_selectors = [
            ".ty-tabs__content .ty-wysiwyg-content",
            ".ty-tabs__content",
            ".ty-product-block__advanced-extra div",
            ".tab-content .tab-pane",
            "#description",
            ".ty-tabs__content",
            ".ty-wysiwyg-content",
            ".ty-product-feature__description",
            ".tab-content .ty-wysiwyg-content",
            ".product-description",
            ".entry-content",
        ]
        image_meta_selectors = [
            "meta[property='og:image']",
        ]
        image_src_selectors = [
            ".ty-product-img img",
            ".cm-image-previewer",
            ".ty-pict img",
            ".main-image img",
        ]
    elif site_name == "pharmacy295":
        title_selectors = [
            "h1.product-title",
            "h1.entry-title",
            "h1[itemprop='name']",
            "h1",
        ]
        sml_title_selectors = [
            ".product-short-description",
            ".woocommerce-product-details__short-description",
            ".short-description",
        ]
        description_selectors = [
            ".woocommerce-Tabs-panel--description",
            ".woocommerce-Tabs-panel",
            ".product-description",
            ".entry-content",
            ".description",
        ]
        image_meta_selectors = [
            "meta[property='og:image']",
        ]
        image_src_selectors = [
            ".woocommerce-product-gallery__image img",
            ".product-gallery img",
            ".swiper-slide img",
            "[data-fancybox='gallery'] img",
            ".main-image img",
            ".product__media img",
        ]
    else:
        title_selectors = ["h1", ".product_title", ".entry-title", "[data-testid='product-title']"]
        sml_title_selectors = [
            ".woocommerce-product-details__short-description",
            ".product-short-description",
        ]
        description_selectors = [
            ".woocommerce-product-details__short-description",
            ".product-short-description",
            ".product-description",
            ".description",
            ".entry-content",
        ]
        image_meta_selectors = [
            "meta[property='og:image']",
            ".woocommerce-product-gallery__image img",
            ".product-gallery img",
            ".main-image img",
            "img[src*='skroutz']",
        ]
        image_src_selectors = [
            ".woocommerce-product-gallery__image img",
            ".product-gallery img",
            ".main-image img",
            "img[src*='skroutz']",
        ]

    title = await _first_text(page, title_selectors)
    sml_title = await _first_text(page, sml_title_selectors, timeout_ms=4000)
    description_values = await _collect_texts(page, description_selectors, timeout_ms=5000, limit=12)
    description = "\n\n".join(description_values)
    if site_name == "farmakopoiosmou":
        main_description = await _extract_farmakopoiosmou_main_description(page)
        tab_description = await _extract_farmakopoiosmou_tab_description(page)

        candidates = [
            main_description,
            tab_description,
            _trim_farmakopoiosmou_description(description),
        ]
        description = max(
            (candidate for candidate in candidates if candidate),
            key=len,
            default="",
        )

        if not description:
            try:
                long_text = await page.evaluate(
                    """
                    () => {
                        const selectors = [
                            '.ty-tabs__content',
                            '.ty-wysiwyg-content',
                            '.tab-content',
                            '.ty-product-block__advanced-extra',
                        ];
                        const parts = [];
                        for (const selector of selectors) {
                            document.querySelectorAll(selector).forEach((node) => {
                                const text = (node.innerText || '').trim();
                                if (text) parts.push(text);
                            });
                        }
                        return parts.join('\\n\\n');
                    }
                    """
                )
            except Exception:
                long_text = ""
            description = _trim_farmakopoiosmou_description(_normalize_space(long_text))
    if site_name == "farmakopoiosmou":
        image_urls = await _collect_image_urls_from_page(
            page,
            [
                "a.photoswipe",
                ".ty-product-img a.photoswipe",
                ".gallery-slide a.photoswipe",
            ],
            [
                "a.photoswipe img",
                ".ty-product-img a.photoswipe img",
                ".ty-product-img img",
                ".gallery-slide img",
            ],
            image_meta_selectors,
            timeout_ms=4000,
            normalizer=_normalize_farmakopoiosmou_image_url,
        )
    elif site_name == "pharmacy295":
        image_urls = await _collect_image_urls_from_page(
            page,
            [
                ".woocommerce-product-gallery__image a",
                ".product-gallery a",
                ".swiper-slide a",
                "[data-fancybox='gallery']",
                "a[href*='/sites/default/files/']",
            ],
            image_src_selectors,
            image_meta_selectors,
            timeout_ms=5000,
        )
    else:
        image_urls = await _collect_image_urls_from_page(
            page,
            [
                ".woocommerce-product-gallery__image a",
                ".product-gallery a",
                ".gallery a",
            ],
            image_src_selectors,
            image_meta_selectors,
            timeout_ms=4000,
        )

    image_urls = sanitize_source_image_urls(site_name, barcode, image_urls, limit=12)
    img_url = image_urls[0] if image_urls else ""

    title = _sanitize_extracted_text(title)
    sml_title = _sanitize_extracted_text(sml_title)
    description = _sanitize_extracted_text(description)

    brand = ""
    category = ""
    category_1 = ""
    category_2 = ""
    category_3 = ""
    if site_name == "farmakopoiosmou":
        brand = _normalize_space(await _first_text(
            page,
            [
                ".brand-title",
                ".field--name-field-brand",
                ".product-brand",
                ".ty-product-block__brand",
            ],
            timeout_ms=3000,
        ))
        breadcrumb_links = page.locator(".breadcrumbs a, .breadcrumb a, .ty-breadcrumbs__a")
        breadcrumb_values: list[str] = []
        count = await _count(breadcrumb_links)
        for index in range(count):
            value = _normalize_space(await _text(breadcrumb_links.nth(index)))
            if (
                value
                and value not in breadcrumb_values
                and "Online" not in value
                and value != _normalize_space(title)
            ):
                breadcrumb_values.append(value)
        if breadcrumb_values:
            category = breadcrumb_values[-1]
            hierarchy = breadcrumb_values[-3:]
            if len(hierarchy) >= 1:
                category_1 = hierarchy[0]
            if len(hierarchy) >= 2:
                category_2 = hierarchy[1]
            if len(hierarchy) >= 3:
                category_3 = hierarchy[2]
        if not brand:
            try:
                content = await page.content()
                brand_match = re.search(
                    r'data-enhanced_ecommerce_brand="([^"]+)"',
                    content,
                    re.IGNORECASE,
                )
                if brand_match:
                    brand = _normalize_space(brand_match.group(1))
            except Exception:
                pass
        if brand:
            brand = brand.split("Δείτε όλα τα προϊόντα")[0].strip(" :\n\t")
    elif site_name == "pharmacy295":
        brand = _normalize_space(
            await _first_text(
                page,
                [
                    ".product-brand",
                    ".brand a",
                    ".posted_in + .brand a",
                    "[itemprop='brand']",
                ],
                timeout_ms=3000,
            )
        )
        breadcrumb_links = page.locator(".breadcrumbs a, .breadcrumb a, .woocommerce-breadcrumb a")
        breadcrumb_values: list[str] = []
        count = await _count(breadcrumb_links)
        for index in range(count):
            value = _normalize_space(await _text(breadcrumb_links.nth(index)))
            if value and value not in breadcrumb_values and value != _normalize_space(title):
                breadcrumb_values.append(value)
        hierarchy = breadcrumb_values[-3:]
        if hierarchy:
            category = hierarchy[-1]
        if len(hierarchy) >= 1:
            category_1 = hierarchy[0]
        if len(hierarchy) >= 2:
            category_2 = hierarchy[1]
        if len(hierarchy) >= 3:
            category_3 = hierarchy[2]
    else:
        category = await _first_text(
            page,
            [".posted_in a:last-child", ".breadcrumb_last", ".breadcrumbs a:last-child", ".category-link"],
            timeout_ms=3000,
        )

    image_local_paths = (
        await _download_image_collection(
            image_urls,
            barcode,
            site_name=site_name,
            replace_existing=replace_existing_images,
            referer=product_url,
        )
        if image_urls
        else []
    )
    image_local_path = image_local_paths[0] if image_local_paths else ""

    return {
        "Site_Id": f"{site_name}_001",
        "Barcode": barcode,
        "Site": site_name,
        "Categ": category,
        "Product_Link": product_url,
        "Img_src": img_url,
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": sml_title,
        "Description": description,
        "fullDesc": description,
        "Brand": brand,
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
        "Image_Path": image_local_path.replace("\\", "/"),
        "Image_Path_Collection": image_local_paths,
    }


async def _fetch_from_generic_site(
    barcode: str,
    site_name: str,
    base_url: str,
    search_urls: list[str],
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    cache_key = (site_name, barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for {site_name} barcode {barcode}: {bool(cached)}")
        return cached

    playwright = browser = context = page = None
    product_link_selectors = [
        "a[href*='/product/']",
        "a[href*='/products/']",
        "a[href*='/shop/'][href*='-']",
        "a[href*='?id=']",
        "a[href*='/shop/']",
        "a[href*='/search-results/']",
        ".search-results a",
        ".product-item a",
        ".product-card a",
        ".product a",
        ".product-item-link",
        ".woocommerce-loop-product__link",
        "li.product a",
    ]
    search_input_selectors = [
        "input[type='search']",
        "input[name='s']",
        "input[name='search']",
        "input[placeholder*='Search']",
        "input[placeholder*='αναζ']",
    ]

    try:
        print(f"Fetching {site_name} for barcode {barcode}")
        playwright, browser, context, page = await _new_page(use_proxy=False)
        print(f"Async browser initialized for {site_name}")

        effective_search_terms = _build_source_search_terms(barcode, *(search_terms or []))

        for query in effective_search_terms:
            for search_url in search_urls:
                if not await _goto(page, search_url.format(query=quote_plus(query), barcode=quote_plus(query))):
                    continue
                await _try_accept_cookies(page)

                page_title = await _first_text(page, ["h1"], timeout_ms=3000)
                page_content = await page.content()
                if (
                    page_title
                    and barcode == query
                    and barcode in page_content
                    and await _page_looks_like_product_detail(page, site_name)
                ):
                    product_data = await _extract_product_data(page, barcode, site_name, page.url)
                    if product_data.get("Title"):
                        await _set_cache_value(cache_key, product_data)
                        print(f"{site_name} hit for barcode {barcode}")
                        return product_data

                product_url = await _find_first_href(page, product_link_selectors)
                if product_url and await _goto(page, product_url):
                    product_data = await _extract_product_data(page, barcode, site_name, product_url)
                    if product_data.get("Title") and (query == barcode or _title_matches_source_query(product_data.get("Title", ""), query)):
                        await _set_cache_value(cache_key, product_data)
                        print(f"{site_name} hit for barcode {barcode} via query {query}")
                        return product_data

        if not await _goto(page, base_url):
            await _set_cache_value(cache_key, {})
            return {}

        await _try_accept_cookies(page)
        search_input = None
        for selector in search_input_selectors:
            locator = await _get_first(page.locator(selector))
            if locator:
                search_input = locator
                break

        if not search_input:
            print(f"No search input found for {site_name}")
            await _set_cache_value(cache_key, {})
            return {}

        await search_input.fill(effective_search_terms[0] if effective_search_terms else barcode)
        await search_input.press("Enter")
        await page.wait_for_load_state("domcontentloaded")

        product_url = await _find_first_href(page, product_link_selectors)
        if not product_url:
            print(f"No product link found for barcode {barcode} on {site_name}")
            await _set_cache_value(cache_key, {})
            return {}

        if not await _goto(page, product_url):
            await _set_cache_value(cache_key, {})
            return {}

        product_data = await _extract_product_data(page, barcode, site_name, product_url)
        if product_data.get("Title"):
            await _set_cache_value(cache_key, product_data)
            print(f"{site_name} hit for barcode {barcode}")
            return product_data
    except Exception as exc:
        print(f"Error processing {site_name} barcode {barcode}: {exc}")
    finally:
        if playwright is not None and context is not None:
            await _close_page(playwright, browser, context)

    await _set_cache_value(cache_key, {})
    print(f"{site_name} miss for barcode {barcode}")
    return {}


def _pharmacy295_brand_from_title(title: str) -> str:
    normalized_title = _sanitize_extracted_text(title)
    if " - " in normalized_title:
        return normalized_title.split(" - ", 1)[0].strip()
    return normalized_title.split()[0].strip() if normalized_title else ""


async def _fetch_from_pharmacy295_excel_feed(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
) -> Dict[str, Any]:
    row = lookup_pharmacy295_product(barcode)
    if row is None or not row.image_urls:
        return {}

    category_1, category_2, category_3 = row.category_levels
    category = category_3 or category_2 or category_1 or _sanitize_extracted_text(row.category_name)
    title = _sanitize_extracted_text(row.product_name)
    image_urls = _unique_urls(list(row.image_urls), limit=12)
    product_link = f"{_PHARMACY295_BASE_URL}/search-results?query={barcode}"
    image_local_paths = (
        await _download_image_collection(
            image_urls,
            barcode,
            site_name="pharmacy295",
            replace_existing=replace_existing_images,
            referer=product_link,
        )
        if download_images
        else []
    )
    image_local_path = image_local_paths[0] if image_local_paths else ""
    return {
        "Site_Id": "pharmacy295_excel_001",
        "Barcode": barcode,
        "Site": "pharmacy295",
        "Categ": category,
        "Product_Link": product_link,
        "Img_src": image_urls[0],
        "Img_src_List": image_urls,
        "Title": title,
        "Sml_Title": "",
        "Description": "",
        "fullDesc": "",
        "Brand": _pharmacy295_brand_from_title(title),
        "Category_1": category_1,
        "Category_2": category_2,
        "Category_3": category_3,
        "Image_Path": image_local_path.replace("\\", "/"),
        "Image_Path_Collection": image_local_paths,
        "Other_Sites": {
            "pharmacy295_excel": {
                "Title": title,
                "Img_src": image_urls[0],
                "Img_src_List": image_urls,
                "Product_Link": product_link,
                "Category_1": category_1,
                "Category_2": category_2,
                "Category_3": category_3,
                "Category_name": _sanitize_extracted_text(row.category_name),
                "Source_Sheets": list(row.source_sheets),
            }
        },
    }


async def fetch_from_pharmacy295(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("pharmacy295", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for pharmacy295 barcode {barcode}: {bool(cached)}")
        return cached

    excel_result = await _fetch_from_pharmacy295_excel_feed(
        barcode,
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if excel_result:
        await _set_cache_value(cache_key, excel_result)
        print(f"pharmacy295 excel hit for barcode {barcode}")
        return excel_result

    search_urls = [
        f"{_PHARMACY295_BASE_URL}/search-results?query={{barcode}}",
        f"{_PHARMACY295_BASE_URL}/search-results?search={{barcode}}",
        f"{_PHARMACY295_BASE_URL}/search?keyphrase={{barcode}}",
        f"{_PHARMACY295_BASE_URL}/search?query={{barcode}}",
        f"{_PHARMACY295_BASE_URL}/?s={{barcode}}",
    ]
    result = await _fetch_from_generic_site(
        barcode,
        "pharmacy295",
        _PHARMACY295_BASE_URL,
        search_urls,
        download_images=download_images,
        replace_existing_images=replace_existing_images,
        search_terms=search_terms,
    )
    if result:
        await _set_cache_value(cache_key, result)
        return result

    await _set_cache_value(cache_key, {})
    return {}


async def fetch_from_youpharmacy(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("youpharmacy", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for youpharmacy barcode {barcode}: {bool(cached)}")
        return cached

    search_urls = [
        f"{_YOUPHARMACY_BASE_URL}/?s={{query}}&post_type=product",
        f"{_YOUPHARMACY_BASE_URL}/?post_type=product&s={{query}}",
        f"{_YOUPHARMACY_BASE_URL}/search/{{query}}",
    ]
    result = await _fetch_from_generic_site(
        barcode,
        "youpharmacy",
        _YOUPHARMACY_BASE_URL,
        search_urls,
        download_images=download_images,
        replace_existing_images=replace_existing_images,
        search_terms=search_terms,
    )
    if result:
        if result.get("Product_Link"):
            result["Product_Link"] = _canonicalize_youpharmacy_url(str(result.get("Product_Link", "")))
        await _set_cache_value(cache_key, result)
        print(f"youpharmacy hit for barcode {barcode}")
        return result

    stored_snapshot = await _fetch_from_stored_source_snapshot(
        barcode,
        "youpharmacy",
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if stored_snapshot:
        if stored_snapshot.get("Product_Link"):
            stored_snapshot["Product_Link"] = _canonicalize_youpharmacy_url(str(stored_snapshot.get("Product_Link", "")))
        await _set_cache_value(cache_key, stored_snapshot)
        print(f"youpharmacy stored snapshot hit for barcode {barcode}")
        return stored_snapshot

    await _set_cache_value(cache_key, {})
    print(f"youpharmacy miss for barcode {barcode}")
    return {}


async def fetch_from_gohealthy(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("gohealthy", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for gohealthy barcode {barcode}: {bool(cached)}")
        return cached

    effective_search_terms = _build_source_search_terms(barcode, *(search_terms or []))
    reference_query = next((term for term in effective_search_terms if term != barcode), "")

    for query in effective_search_terms:
        search_urls = [
            f"{_GOHEALTHY_BASE_URL}/search-results?search={quote_plus(query)}",
            f"{_GOHEALTHY_BASE_URL}/?search={quote_plus(query)}",
        ]
        for search_url in search_urls:
            search_html = await _fetch_text_response(search_url, referer=_GOHEALTHY_BASE_URL)
            if not search_html:
                search_html = await _fetch_text_response_via_curl(search_url, referer=_GOHEALTHY_BASE_URL)
            if not search_html:
                continue

            direct_product_data = _extract_gohealthy_product_data_from_html(search_html, barcode, search_url)
            direct_product_url = str(direct_product_data.get("Product_Link", "")).strip()
            if (
                direct_product_data.get("Title")
                and _is_probable_gohealthy_product_url(direct_product_url)
                and (
                    (query == barcode and (_html_has_exact_barcode(search_html, barcode) or "?search=" in search_url))
                    or (query != barcode and _title_matches_source_query_strict(direct_product_data.get("Title", ""), query))
                )
            ):
                image_urls = direct_product_data.get("Img_src_List") or ([direct_product_data.get("Img_src", "")] if direct_product_data.get("Img_src") else [])
                if not download_images or image_urls:
                    image_local_paths = (
                        await _download_image_collection(
                            image_urls,
                            barcode,
                            "gohealthy",
                            replace_existing=replace_existing_images,
                            referer=direct_product_url or search_url,
                        )
                        if download_images
                        else []
                    )
                    if not download_images or image_local_paths:
                        if image_local_paths:
                            direct_product_data["Image_Path"] = image_local_paths[0]
                            direct_product_data["Image_Path_Collection"] = image_local_paths
                        await _set_cache_value(cache_key, direct_product_data)
                        print(f"gohealthy direct hit for barcode {barcode} via query {query}")
                        return direct_product_data

            candidate_urls = _extract_gohealthy_candidate_urls_from_search_html(search_html, limit=12)
            candidate_urls = _prioritize_gohealthy_candidate_urls(candidate_urls, barcode, query, limit=8)
            if candidate_urls:
                print(f"gohealthy candidate urls for {barcode} via query {query}: {candidate_urls}")
            else:
                print(f"No product link found for barcode {barcode} on gohealthy via query {query}")
                continue

            single_candidate_barcode_search = query == barcode and len(candidate_urls) == 1
            for product_url in candidate_urls:
                product_html = await _fetch_text_response(product_url, referer=search_url)
                if not product_html:
                    product_html = await _fetch_text_response_via_curl(product_url, referer=search_url)
                if not product_html:
                    continue
                product_data = _extract_gohealthy_product_data_from_html(product_html, barcode, product_url)
                if not product_data.get("Title"):
                    continue
                if query == barcode:
                    if not _html_has_exact_barcode(product_html, barcode) and not single_candidate_barcode_search:
                        print(f"gohealthy barcode mismatch for {barcode} at {product_url}")
                        continue
                elif not _title_matches_source_query_strict(product_data.get("Title", ""), query):
                    print(f"gohealthy title mismatch for {barcode} query {query} at {product_url}")
                    continue
                if (
                    query != barcode
                    and reference_query
                    and reference_query != query
                    and not _title_matches_source_query_strict(product_data.get("Title", ""), reference_query)
                ):
                    print(f"gohealthy reference title mismatch for {barcode} query {reference_query} at {product_url}")
                    continue

                image_urls = product_data.get("Img_src_List") or ([product_data.get("Img_src", "")] if product_data.get("Img_src") else [])
                if download_images and not image_urls:
                    print(f"gohealthy returned no image urls for {barcode} at {product_url}")
                    continue

                image_local_paths = (
                    await _download_image_collection(
                        image_urls,
                        barcode,
                        "gohealthy",
                        replace_existing=replace_existing_images,
                        referer=product_url,
                    )
                    if download_images
                    else []
                )
                if download_images and not image_local_paths:
                    print(f"gohealthy image download failed for {barcode} at {product_url}")
                    continue
                if image_local_paths:
                    product_data["Image_Path"] = image_local_paths[0]
                    product_data["Image_Path_Collection"] = image_local_paths

                await _set_cache_value(cache_key, product_data)
                print(f"gohealthy hit for barcode {barcode} via query {query}")
                return product_data

    stored_snapshot = await _fetch_from_stored_source_snapshot(
        barcode,
        "gohealthy",
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if stored_snapshot:
        if stored_snapshot.get("Product_Link"):
            stored_snapshot["Product_Link"] = _canonicalize_gohealthy_url(str(stored_snapshot.get("Product_Link", "")))
        await _set_cache_value(cache_key, stored_snapshot)
        print(f"gohealthy stored snapshot hit for barcode {barcode}")
        return stored_snapshot

    await _set_cache_value(cache_key, {})
    print(f"gohealthy miss for barcode {barcode}")
    return {}


async def fetch_from_cure4u(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("cure4u", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for cure4u barcode {barcode}: {bool(cached)}")
        return cached

    effective_search_terms = _build_source_search_terms(barcode, *(search_terms or []))
    reference_query = next((term for term in effective_search_terms if term != barcode), "")
    for query in effective_search_terms:
        search_url = f"{_CURE4U_BASE_URL}/module/ambjolisearch/jolisearch?s={quote_plus(query)}"
        search_html = await _fetch_text_response(search_url, referer=_CURE4U_BASE_URL)
        if not search_html:
            continue

        candidate_urls = _extract_cure4u_candidate_urls_from_search_html(search_html, limit=8)
        if candidate_urls:
            print(f"cure4u candidate urls for {barcode} via query {query}: {candidate_urls}")
        else:
            print(f"No product link found for barcode {barcode} on cure4u via query {query}")
            continue

        for product_url in candidate_urls:
            product_html = await _fetch_text_response(product_url, referer=search_url)
            if not product_html:
                continue
            product_data = _extract_cure4u_product_data_from_html(product_html, barcode, product_url)
            if not product_data.get("Title"):
                continue
            if query == barcode:
                if not _html_has_exact_barcode(product_html, barcode):
                    print(f"cure4u barcode mismatch for {barcode} at {product_url}")
                    continue
            elif not _title_matches_source_query_strict(product_data.get("Title", ""), query):
                print(f"cure4u title mismatch for {barcode} query {query} at {product_url}")
                continue
            if (
                query != barcode
                and reference_query
                and reference_query != query
                and not _title_matches_source_query_strict(product_data.get("Title", ""), reference_query)
            ):
                print(f"cure4u reference title mismatch for {barcode} query {reference_query} at {product_url}")
                continue

            image_urls = product_data.get("Img_src_List") or ([product_data.get("Img_src", "")] if product_data.get("Img_src") else [])
            if download_images and not image_urls:
                print(f"cure4u returned no image urls for {barcode} at {product_url}")
                continue

            image_local_paths = (
                await _download_image_collection(
                    image_urls,
                    barcode,
                    "cure4u",
                    replace_existing=replace_existing_images,
                    referer=product_url,
                )
                if download_images
                else []
            )
            if download_images and not image_local_paths:
                print(f"cure4u image download failed for {barcode} at {product_url}")
                continue
            if image_local_paths:
                product_data["Image_Path"] = image_local_paths[0]
                product_data["Image_Path_Collection"] = image_local_paths

            await _set_cache_value(cache_key, product_data)
            print(f"cure4u hit for barcode {barcode} via query {query}")
            return product_data

    stored_snapshot = await _fetch_from_stored_source_snapshot(
        barcode,
        "cure4u",
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if stored_snapshot:
        if stored_snapshot.get("Product_Link"):
            stored_snapshot["Product_Link"] = _canonicalize_cure4u_url(str(stored_snapshot.get("Product_Link", "")))
        await _set_cache_value(cache_key, stored_snapshot)
        print(f"cure4u stored snapshot hit for barcode {barcode}")
        return stored_snapshot

    await _set_cache_value(cache_key, {})
    print(f"cure4u miss for barcode {barcode}")
    return {}


async def fetch_from_kpdhellas(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("kpdhellas", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for kpdhellas barcode {barcode}: {bool(cached)}")
        return cached

    effective_search_terms = _build_source_search_terms(barcode, *(search_terms or []))
    reference_query = next((term for term in effective_search_terms if term != barcode), "")
    playwright = browser = context = page = None
    try:
        playwright, browser, context, page = await _new_page(use_proxy=False)
        await _try_accept_cookies(page)

        for query in effective_search_terms:
            search_urls = [
                f"{_KPDHELLAS_BASE_URL}/index.php?route=product/search&search={quote_plus(query)}",
                f"{_KPDHELLAS_BASE_URL}/search-results?search={quote_plus(query)}",
            ]
            candidate_urls: list[str] = []
            for search_url in search_urls:
                search_html = await _fetch_text_response_via_kpdhellas_bridge(search_url, referer=_KPDHELLAS_BASE_URL)
                if not search_html:
                    search_html = await _fetch_text_response_via_curl(search_url, referer=_KPDHELLAS_BASE_URL)
                candidate_urls = _extract_kpdhellas_candidate_urls_from_search_html(search_html, limit=12) if search_html else []
                if not candidate_urls:
                    if not await _goto(page, search_url):
                        continue
                    await _try_accept_cookies(page)
                    with suppress(Exception):
                        await page.wait_for_selector(".product-layout .product-img, .product-layout .name a", timeout=5000)
                    search_html = await page.content()
                    candidate_urls = _extract_kpdhellas_candidate_urls_from_search_html(search_html, limit=12)
                if not candidate_urls:
                    candidate_urls = await _find_all_hrefs(
                        page,
                        [
                            ".product-layout .product-img",
                            ".product-layout .name a",
                            ".main-products .product-img",
                            ".main-products .name a",
                        ],
                        limit=12,
                    )
                    candidate_urls = [_canonicalize_kpdhellas_url(url) for url in candidate_urls if url]
                    candidate_urls = _unique_urls(candidate_urls, limit=12)
                candidate_urls = _prioritize_kpdhellas_candidate_urls(candidate_urls, barcode, query, limit=8)
                if candidate_urls:
                    break

            if candidate_urls:
                print(f"kpdhellas candidate urls for {barcode} via query {query}: {candidate_urls}")
            else:
                print(f"No product link found for barcode {barcode} on kpdhellas via query {query}")
                continue

            for product_url in candidate_urls:
                product_html = await _fetch_text_response_via_kpdhellas_bridge(product_url, referer=search_url)
                if not product_html:
                    product_html = await _fetch_text_response_via_curl(product_url, referer=search_url)
                if not product_html:
                    if not await _goto(page, product_url):
                        continue
                    await _try_accept_cookies(page)
                    with suppress(Exception):
                        await page.wait_for_selector("h1.title.page-title, .product-info, .main-image img", timeout=5000)
                    product_html = await page.content()
                product_data = _extract_kpdhellas_product_data_from_html(product_html, barcode, product_url)
                if not product_data.get("Title"):
                    continue
                if query == barcode:
                    if not _html_has_exact_barcode(product_html, barcode):
                        print(f"kpdhellas barcode mismatch for {barcode} at {product_url}")
                        continue
                elif not _title_matches_source_query_strict(product_data.get("Title", ""), query):
                    print(f"kpdhellas title mismatch for {barcode} query {query} at {product_url}")
                    continue
                if (
                    query != barcode
                    and reference_query
                    and reference_query != query
                    and not _title_matches_source_query_strict(product_data.get("Title", ""), reference_query)
                ):
                    print(f"kpdhellas reference title mismatch for {barcode} query {reference_query} at {product_url}")
                    continue

                image_urls = product_data.get("Img_src_List") or ([product_data.get("Img_src", "")] if product_data.get("Img_src") else [])
                if download_images and not image_urls:
                    print(f"kpdhellas returned no image urls for {barcode} at {product_url}")
                    continue

                image_local_paths = (
                    await _download_image_collection(
                        image_urls,
                        barcode,
                        "kpdhellas",
                        replace_existing=replace_existing_images,
                        referer=product_url,
                    )
                    if download_images
                    else []
                )
                if download_images and not image_local_paths:
                    print(f"kpdhellas image download failed for {barcode} at {product_url}")
                    continue
                if image_local_paths:
                    product_data["Image_Path"] = image_local_paths[0]
                    product_data["Image_Path_Collection"] = image_local_paths

                await _set_cache_value(cache_key, product_data)
                print(f"kpdhellas hit for barcode {barcode} via query {query}")
                return product_data
    except Exception as exc:
        print(f"Error processing kpdhellas barcode {barcode}: {exc}")
    finally:
        if playwright is not None and context is not None:
            await _close_page(playwright, browser, context)

    stored_snapshot = await _fetch_from_stored_source_snapshot(
        barcode,
        "kpdhellas",
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if stored_snapshot:
        if stored_snapshot.get("Product_Link"):
            stored_snapshot["Product_Link"] = _canonicalize_kpdhellas_url(str(stored_snapshot.get("Product_Link", "")))
        await _set_cache_value(cache_key, stored_snapshot)
        print(f"kpdhellas stored snapshot hit for barcode {barcode}")
        return stored_snapshot

    await _set_cache_value(cache_key, {})
    print(f"kpdhellas miss for barcode {barcode}")
    return {}


async def fetch_from_vita4you(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("vita4you", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for vita4you barcode {barcode}: {bool(cached)}")
        return cached

    search_urls = [f"{_VITA4YOU_BASE_URL}/el/search/?q={{query}}"]

    effective_search_terms = _build_source_search_terms(barcode, *(search_terms or []))
    reference_query = next((term for term in effective_search_terms if term != barcode), "")
    for query in effective_search_terms:
        candidate_limit = _vita4you_candidate_limit(query, barcode)
        candidate_urls: list[str] = []
        klevu_attempted = False
        for search_url in search_urls:
            resolved_search_url = search_url.format(query=quote_plus(query), barcode=quote_plus(query))
            search_html = await _fetch_text_response(resolved_search_url, referer=_VITA4YOU_BASE_URL)
            if not search_html:
                continue
            candidate_urls.extend(_extract_vita4you_candidate_urls_from_search_html(search_html, barcode, limit=candidate_limit))
            if not candidate_urls:
                candidate_urls.extend(await _fetch_vita4you_candidate_urls_via_klevu(query, search_html, limit=candidate_limit))
                klevu_attempted = True
            if candidate_urls:
                break
        if not candidate_urls and not klevu_attempted:
            candidate_urls.extend(await _fetch_vita4you_candidate_urls_via_klevu(query, limit=candidate_limit))
        if not candidate_urls:
            for search_url in search_urls:
                resolved_search_url = search_url.format(query=quote_plus(query), barcode=quote_plus(query))
                candidate_urls.extend(await _extract_vita4you_candidate_urls_via_browser(resolved_search_url, limit=candidate_limit))
                if candidate_urls:
                    break

        candidate_urls = _unique_urls(candidate_urls, limit=candidate_limit)
        if candidate_urls:
            print(f"vita4you candidate urls for {barcode} via query {query}: {candidate_urls}")
        else:
            print(f"No product link found for barcode {barcode} on vita4you via query {query}")

        for product_url in candidate_urls:
            product_html = await _fetch_text_response(product_url, referer=_VITA4YOU_BASE_URL)
            if not product_html:
                continue
            product_data = _extract_vita4you_product_data_from_html(product_html, barcode, product_url)
            if not product_data.get("Title"):
                continue
            if query == barcode:
                if not _html_has_exact_barcode(product_html, barcode):
                    print(f"vita4you barcode mismatch for {barcode} at {product_url}")
                    continue
            elif not _title_matches_source_query_strict(product_data.get("Title", ""), query):
                print(f"vita4you title mismatch for {barcode} query {query} at {product_url}")
                continue
            if (
                query != barcode
                and reference_query
                and reference_query != query
                and not _title_matches_source_query_strict(product_data.get("Title", ""), reference_query)
            ):
                print(f"vita4you reference title mismatch for {barcode} query {reference_query} at {product_url}")
                continue
            image_urls = product_data.get("Img_src_List") or ([product_data.get("Img_src", "")] if product_data.get("Img_src") else [])
            if download_images and not image_urls:
                print(f"vita4you returned no image urls for {barcode} at {product_url}")
                continue
            image_local_paths = (
                await _download_image_collection(
                    image_urls,
                    barcode,
                    "vita4you",
                    replace_existing=replace_existing_images,
                    referer=product_url,
                )
                if download_images
                else []
            )
            if download_images and not image_local_paths:
                print(f"vita4you image download failed for {barcode} at {product_url}")
                continue
            if image_local_paths:
                product_data["Image_Path"] = image_local_paths[0]
                product_data["Image_Path_Collection"] = image_local_paths
            await _set_cache_value(cache_key, product_data)
            print(f"vita4you hit for barcode {barcode} via query {query}")
            return product_data

    stored_snapshot = await _fetch_from_stored_source_snapshot(
        barcode,
        "vita4you",
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if stored_snapshot:
        await _set_cache_value(cache_key, stored_snapshot)
        print(f"vita4you stored snapshot hit for barcode {barcode}")
        return stored_snapshot

    await _set_cache_value(cache_key, {})
    print(f"vita4you miss for barcode {barcode}")
    return {}


def _strip_source_image_fields(product_data: Dict[str, Any]) -> Dict[str, Any]:
    cleaned = dict(product_data or {})
    cleaned.pop("Image_Path", None)
    cleaned.pop("Image_Path_Collection", None)
    cleaned.pop("Image_url", None)
    cleaned.pop("Image_urls", None)
    cleaned.pop("cms_main_image", None)
    cleaned.pop("main_image", None)
    cleaned.pop("Img_src", None)
    cleaned["Img_src_List"] = []
    return cleaned


def _can_use_cached_source_result(cached: Dict[str, Any] | None, *, download_images: bool) -> bool:
    if cached is None:
        return False
    if not download_images:
        return True
    image_paths = cached.get("Image_Path_Collection") or ([cached.get("Image_Path", "")] if cached.get("Image_Path") else [])
    return any(str(path).strip() for path in image_paths)


async def fetch_from_tofarmakeiomou(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("tofarmakeiomou", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for tofarmakeiomou barcode {barcode}: {bool(cached)}")
        return cached

    search_urls = [
        f"{_TOFARMAKEIOMOU_BASE_URL}/el-gr/ALL?title={{barcode}}",
        f"{_TOFARMAKEIOMOU_BASE_URL}/el-gr/search?title={{barcode}}",
        f"{_TOFARMAKEIOMOU_BASE_URL}/el-gr/search?query={{barcode}}",
        f"{_TOFARMAKEIOMOU_BASE_URL}/search?title={{barcode}}",
    ]
    result = await _fetch_from_generic_site(
        barcode,
        "tofarmakeiomou",
        _TOFARMAKEIOMOU_BASE_URL,
        search_urls,
        download_images=download_images,
        replace_existing_images=replace_existing_images,
        search_terms=search_terms,
    )
    if result:
        await _set_cache_value(cache_key, result)
        return result

    stored_snapshot = await _fetch_from_stored_source_snapshot(
        barcode,
        "tofarmakeiomou",
        download_images=download_images,
        replace_existing_images=replace_existing_images,
    )
    if stored_snapshot:
        await _set_cache_value(cache_key, stored_snapshot)
        print(f"tofarmakeiomou stored snapshot hit for barcode {barcode}")
        return stored_snapshot

    await _set_cache_value(cache_key, {})
    return {}


async def fetch_from_farmakopoiosmou(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("farmakopoiosmou", barcode)
    cached = await _get_cache_value(cache_key)
    if _can_use_cached_source_result(cached, download_images=download_images):
        print(f"Using cached result for farmakopoiosmou barcode {barcode}: {bool(cached)}")
        return cached

    playwright = browser = context = page = None
    try:
        print(f"Fetching farmakopoiosmou for barcode {barcode}")
        playwright, browser, context, page = await _new_page(use_proxy=False)
        print("Async browser initialized for farmakopoiosmou")

        product_urls: list[str] = []
        search_json = await _fetch_farmakopoiosmou_instant_search_json(barcode)
        if search_json:
            product_urls.extend(_extract_farmakopoiosmou_candidate_urls_from_search_json(search_json, barcode, limit=12))
            for page_number in _extract_farmakopoiosmou_search_pages(search_json)[:2]:
                next_page_json = await _fetch_farmakopoiosmou_instant_search_json(barcode, page_number=page_number)
                if next_page_json:
                    product_urls.extend(
                        _extract_farmakopoiosmou_candidate_urls_from_search_json(next_page_json, barcode, limit=12)
                    )
            product_urls = _unique_urls(product_urls, limit=12)
            if product_urls:
                print(f"farmakopoiosmou instant-search candidate urls for {barcode}: {product_urls}")

        dom_product_urls: list[str] = []
        if not product_urls:
            search_urls = [
                f"{_FARMAKOPOIOSMOU_BASE_URL}/#search/{barcode}",
                f"{_FARMAKOPOIOSMOU_BASE_URL}/?subcats=Y&status=A&pshort=Y&pfull=Y&pname=Y&pkeywords=Y&search_performed=Y&q={barcode}",
                _FARMAKOPOIOSMOU_BASE_URL,
            ]

            search_loaded = False
            for search_url in search_urls:
                if not await _goto(page, search_url):
                    continue
                await _try_accept_cookies(page)
                await asyncio.sleep(2)
                with suppress(Exception):
                    await page.wait_for_selector(
                        ".findastic-item.node--product, [data-enhanced_ecommerce_id]",
                        timeout=7000,
                    )
                search_loaded = True
                if "?id=" in page.url or "#search/" in page.url:
                    break

            if search_loaded and page.url.rstrip("/") == _FARMAKOPOIOSMOU_BASE_URL.rstrip("/"):
                search_input = None
                for selector in [
                    "input[name='hint_q']",
                    "input[id*='search_input']",
                    "input[type='search']",
                    "input[name='q']",
                    "input[placeholder*='Βρες']",
                    "input[placeholder*='αναζ']",
                ]:
                    locator = await _get_first(page.locator(selector))
                    if locator:
                        search_input = locator
                        break

                if search_input:
                    await search_input.fill(barcode)
                    await search_input.press("Enter")
                    await page.wait_for_load_state("domcontentloaded")
                    await asyncio.sleep(2)

            if search_loaded and "?id=" in page.url and await _page_has_exact_barcode(page, barcode, "farmakopoiosmou"):
                product_data = await _extract_product_data(page, barcode, "farmakopoiosmou", page.url)
                if product_data.get("Title"):
                    product_data = _strip_source_image_fields(product_data)
                    await _set_cache_value(cache_key, product_data)
                    print(f"farmakopoiosmou hit for barcode {barcode}")
                    return product_data

            if search_loaded:
                dom_product_urls = await _find_farmakopoiosmou_candidate_urls(page, barcode, limit=8)
                if not dom_product_urls:
                    with suppress(Exception):
                        await page.mouse.wheel(0, 900)
                    await asyncio.sleep(2)
                    dom_product_urls = await _find_farmakopoiosmou_candidate_urls(page, barcode, limit=8)

                if not dom_product_urls:
                    with suppress(Exception):
                        await page.wait_for_selector(
                            ".findastic-item.node--product, [data-enhanced_ecommerce_id]",
                            timeout=10000,
                        )
                    await asyncio.sleep(2)
                    dom_product_urls = await _find_farmakopoiosmou_candidate_urls(page, barcode, limit=8)

                if not dom_product_urls:
                    clicked_urls = await _click_farmakopoiosmou_result_cards(page, barcode, limit=4)
                    if clicked_urls:
                        dom_product_urls = clicked_urls

        product_urls = _unique_urls(product_urls + dom_product_urls, limit=12)

        if product_urls:
            print(f"farmakopoiosmou candidate urls for {barcode}: {product_urls}")
        else:
            print(f"No product link found for barcode {barcode} on farmakopoiosmou")

        for product_url in product_urls:
            product_html = await _fetch_text_response(product_url, referer=_FARMAKOPOIOSMOU_BASE_URL)
            if not product_html:
                continue

            if not _html_has_exact_barcode(product_html, barcode):
                print(f"farmakopoiosmou barcode mismatch for {barcode} at {product_url}")
                continue

            product_data = _extract_product_data_from_farmakopoiosmou_html(product_html, barcode, product_url)
            if product_data.get("Title"):
                product_data = _strip_source_image_fields(product_data)
                await _set_cache_value(cache_key, product_data)
                print(f"farmakopoiosmou hit for barcode {barcode}")
                return product_data

        direct_fallback_url = _FARMAKOPOIOSMOU_DIRECT_FALLBACKS.get(barcode)
        if direct_fallback_url:
            print(f"Trying farmakopoiosmou direct fallback for {barcode}: {direct_fallback_url}")
            product_html = await _fetch_text_response(direct_fallback_url, referer=_FARMAKOPOIOSMOU_BASE_URL)
            if product_html:
                if _html_has_exact_barcode(product_html, barcode):
                    product_data = _extract_product_data_from_farmakopoiosmou_html(product_html, barcode, direct_fallback_url)
                    if product_data.get("Title"):
                        product_data = _strip_source_image_fields(product_data)
                        await _set_cache_value(cache_key, product_data)
                        print(f"farmakopoiosmou hit via direct fallback for barcode {barcode}")
                        return product_data
                else:
                    print(f"farmakopoiosmou direct fallback barcode mismatch for {barcode} at {direct_fallback_url}")
        await _dump_farmakopoiosmou_debug(page, barcode)
    except Exception as exc:
        print(f"Error processing farmakopoiosmou barcode {barcode}: {exc}")
    finally:
        if playwright is not None and context is not None:
            await _close_page(playwright, browser, context)

    await _clear_cache_value(cache_key)
    print(f"farmakopoiosmou miss for barcode {barcode}")
    return {}


async def fetch_from_skroutz(barcode: str) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("skroutz", barcode)
    cached = await _get_cache_value(cache_key)
    if cached is not None:
        print(f"Using cached result for skroutz barcode {barcode}: {bool(cached)}")
        return cached

    playwright = browser = context = page = None
    try:
        print(f"Fetching skroutz for barcode {barcode}")
        playwright, browser, context, page = await _new_page()
        print("Async browser initialized for skroutz")

        search_urls = [
            f"https://www.skroutz.gr/c/835/kremes-prosopou.html?keyphrase={barcode}",
            f"https://www.skroutz.gr/search?keyphrase={barcode}",
        ]
        for search_url in search_urls:
            if not await _goto(page, search_url):
                continue

            await _try_accept_cookies(page)
            await asyncio.sleep(4)
            with suppress(Exception):
                await page.mouse.wheel(0, 900)
            await asyncio.sleep(1)
            await _ensure_not_cloudflare(page, barcode)

            # Some searches redirect directly to the product page or render the product
            # view without exposing a clickable result link first.
            current_page_title = await _first_text(
                page,
                ["h1", "[data-testid='product-title']", ".product-title h1"],
                timeout_ms=7000,
            )
            current_page_image = await _first_attr(
                page,
                ["img[src*='skroutz']", ".product-gallery img", ".main-image img"],
                "src",
                timeout_ms=4000,
            )
            if "/s/" in page.url or (current_page_title and current_page_image):
                product_data = await _extract_product_data(page, barcode, "skroutz", page.url)
                if product_data.get("Title"):
                    product_data["Site_Id"] = "skr123"
                    await _persist_progress(product_data)
                    await _set_cache_value(cache_key, product_data)
                    print(f"Successfully scraped: {product_data['Title'][:50]}...")
                    return product_data

            with suppress(Exception):
                await page.locator("a[href*='/s/']").first.wait_for(
                    state="attached",
                timeout=max(7000, _ELEMENT_WAIT_SECONDS * 1000),
            )

            product_url = await _find_skroutz_product_url(page)
            if not product_url:
                clicked = await _click_first_skroutz_result(page)
                if clicked and "/s/" in page.url:
                    await _ensure_not_cloudflare(page, barcode)
                    product_data = await _extract_product_data(page, barcode, "skroutz", page.url)
                    if product_data.get("Title"):
                        product_data["Site_Id"] = "skr123"
                        await _persist_progress(product_data)
                        await _set_cache_value(cache_key, product_data)
                        print(f"Successfully scraped: {product_data['Title'][:50]}...")
                        return product_data
                continue

            if not await _goto(page, product_url):
                continue

            await _ensure_not_cloudflare(page, barcode)
            product_data = await _extract_product_data(page, barcode, "skroutz", product_url)
            if product_data.get("Title"):
                product_data["Site_Id"] = "skr123"
                await _persist_progress(product_data)
                await _set_cache_value(cache_key, product_data)
                print(f"Successfully scraped: {product_data['Title'][:50]}...")
                return product_data

        print(f"No product link found for barcode: {barcode}")
        await _dump_skroutz_debug(page, barcode)
        await _append_not_found(barcode)
        await _clear_cache_value(cache_key)
        return {}
    except CloudflareBlockedError as exc:
        print(f"⚠️ {exc}")
        await _clear_cache_value(cache_key)
        return {}
    except Exception as exc:
        print(f"Error processing barcode {barcode}: {exc}")
        if page is not None:
            await _dump_skroutz_debug(page, barcode)
        await _append_not_found(barcode)
        await _clear_cache_value(cache_key)
        return {}
    finally:
        if playwright is not None and context is not None:
            await _close_page(playwright, browser, context)

    print(f"skroutz miss for barcode {barcode}")


async def _fetch_with_named_chain(
    barcode: str,
    source_chain: list[str],
    *,
    download_images: bool,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
    force_source_names: set[str] | None = None,
) -> Dict[str, Any]:
    def _image_paths_from_product_data(product_data: Dict[str, Any]) -> list[str]:
        image_paths_raw = product_data.get("Image_Path_Collection")
        if isinstance(image_paths_raw, str):
            return [image_paths_raw.strip()] if image_paths_raw.strip() else []
        if isinstance(image_paths_raw, list):
            return [str(path).strip() for path in image_paths_raw if str(path).strip()]
        single_path = str(product_data.get("Image_Path", "")).strip()
        return [single_path] if single_path else []

    fetcher_map = {
        "farmakopoiosmou": fetch_from_farmakopoiosmou,
        "pharmacy295": fetch_from_pharmacy295,
        "youpharmacy": fetch_from_youpharmacy,
        "gohealthy": fetch_from_gohealthy,
        "cure4u": fetch_from_cure4u,
        "kpdhellas": fetch_from_kpdhellas,
        "vita4you": fetch_from_vita4you,
        "tofarmakeiomou": fetch_from_tofarmakeiomou,
    }
    forced_sources = {str(source_name).strip().lower() for source_name in (force_source_names or set()) if str(source_name).strip()}
    for source_name in source_chain:
        fetcher = fetcher_map.get(source_name)
        if fetcher is None:
            continue
        is_forced_source = source_name in forced_sources
        if download_images:
            if not is_forced_source and not is_source_enabled_for_images(source_name):
                print(f"Skipping {source_name} for barcode {barcode}: source is not enabled for images")
                continue
        else:
            if not is_forced_source and not is_source_enabled_for_text(source_name):
                print(f"Skipping {source_name} for barcode {barcode}: source is not enabled for text")
                continue
        if source_name in _LIVE_PROXY_REQUIRED_SOURCES and not get_effective_proxy_url():
            print(
                f"Skipping live fetch for {source_name} barcode {barcode}: "
                "proxy is required but not configured; trying stored snapshot fallback"
            )
            product_data = await _fetch_from_stored_source_snapshot(
                barcode,
                source_name,
                download_images=download_images,
                replace_existing_images=replace_existing_images,
            )
            if product_data:
                if download_images and not _image_paths_from_product_data(product_data):
                    print(
                        f"{source_name} stored snapshot returned no downloadable hosted images for barcode {barcode}; "
                        "continuing to next image source"
                    )
                    continue
                print(f"{source_name} stored snapshot hit for barcode {barcode}")
                return product_data
            continue
        if source_name == "farmakopoiosmou":
            product_data = await fetcher(
                barcode,
                download_images=download_images,
                replace_existing_images=replace_existing_images,
            )
        else:
            timeout_seconds = _IMAGE_SOURCE_PER_SITE_TIMEOUT_SECONDS if download_images else _SOURCE_PER_SITE_TIMEOUT_SECONDS
            if source_name == "vita4you":
                if download_images:
                    timeout_seconds = min(timeout_seconds, _VITA4YOU_IMAGE_SOURCE_TIMEOUT_SECONDS)
                else:
                    timeout_seconds = min(timeout_seconds, _VITA4YOU_TEXT_SOURCE_TIMEOUT_SECONDS)
            fetch_task = asyncio.create_task(
                fetcher(
                    barcode,
                    download_images=download_images,
                    replace_existing_images=replace_existing_images,
                    search_terms=search_terms,
                )
            )
            try:
                product_data = await asyncio.wait_for(fetch_task, timeout=timeout_seconds)
            except asyncio.TimeoutError:
                fetch_task.cancel()
                with suppress(asyncio.CancelledError, Exception):
                    await fetch_task
                print(f"{source_name} timed out for barcode {barcode} after {timeout_seconds}s")
                continue
        if product_data and download_images:
            image_paths = _image_paths_from_product_data(product_data)
            if not image_paths:
                print(
                    f"{source_name} returned no downloadable hosted images for barcode {barcode}; "
                    "continuing to next image source"
                )
                continue
        if product_data:
            return product_data
    return {}


def _merge_source_payloads(
    content_doc: Dict[str, Any],
    image_doc: Dict[str, Any],
) -> Dict[str, Any]:
    if not content_doc and not image_doc:
        return {}
    if not content_doc:
        return dict(image_doc)

    merged = dict(content_doc)
    if not image_doc:
        return merged

    image_urls = [
        str(url).strip()
        for url in (image_doc.get("Img_src_List") or ([image_doc.get("Img_src", "")] if image_doc.get("Img_src") else []))
        if str(url).strip()
    ]
    image_paths = [
        str(path).strip()
        for path in (image_doc.get("Image_Path_Collection") or ([image_doc.get("Image_Path", "")] if image_doc.get("Image_Path") else []))
        if str(path).strip()
    ]

    if image_urls:
        merged["Img_src"] = image_urls[0]
        merged["Img_src_List"] = image_urls
    else:
        merged.pop("Img_src", None)
        merged["Img_src_List"] = []

    if image_paths:
        merged["Image_Path"] = image_paths[0]
        merged["Image_Path_Collection"] = image_paths
    else:
        merged.pop("Image_Path", None)
        merged.pop("Image_Path_Collection", None)

    merged["photo_metadata_source"] = str(content_doc.get("Site", "")).strip() or str(content_doc.get("last_source", "")).strip()
    merged["photo_image_source"] = str(image_doc.get("Site", "")).strip() or str(image_doc.get("last_source", "")).strip()
    if image_doc.get("Product_Link"):
        merged["Image_Product_Link"] = image_doc.get("Product_Link")
    return merged


async def fetch_product_with_source_priority(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
) -> Dict[str, Any]:
    enabled_source_chain = get_enabled_source_chain()
    text_source_chain = get_enabled_text_source_chain() or enabled_source_chain
    image_source_chain = get_enabled_image_source_chain()
    return await fetch_product_with_custom_source_priority(
        barcode,
        download_images=download_images,
        replace_existing_images=replace_existing_images,
        search_terms=search_terms,
        text_source_chain=text_source_chain,
        image_source_chain=image_source_chain,
    )


async def fetch_product_with_custom_source_priority(
    barcode: str,
    *,
    download_images: bool = True,
    replace_existing_images: bool = False,
    search_terms: list[str] | None = None,
    text_source_chain: list[str] | None = None,
    image_source_chain: list[str] | None = None,
    force_source_names: set[str] | None = None,
) -> Dict[str, Any]:
    enabled_source_chain = get_enabled_source_chain()
    effective_text_source_chain = list(text_source_chain or get_enabled_text_source_chain() or enabled_source_chain)
    effective_image_source_chain = list(image_source_chain or get_enabled_image_source_chain())

    content_doc = await _fetch_with_named_chain(
        barcode,
        effective_text_source_chain,
        download_images=False,
        search_terms=search_terms,
        force_source_names=force_source_names,
    )
    if content_doc and download_images:
        content_doc = _strip_source_image_payload(content_doc)
    if not download_images:
        return content_doc

    image_doc = await _fetch_with_named_chain(
        barcode,
        effective_image_source_chain,
        download_images=True,
        replace_existing_images=replace_existing_images,
        search_terms=search_terms,
        force_source_names=force_source_names,
    )
    if image_doc:
        return _merge_source_payloads(content_doc, image_doc)
    return content_doc
