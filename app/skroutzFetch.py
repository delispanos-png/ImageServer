import asyncio
import html
import io
import json
import os
import random
import re
import time
from contextlib import suppress
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urljoin, urlparse, urlunparse

import aiofiles
import aiohttp
from PIL import Image, ImageStat
from playwright.async_api import TimeoutError as PlaywrightTimeoutError
from playwright.async_api import async_playwright
from image_paths import ensure_barcode_image_dir, primary_image_path

_MIN_DELAY_SECONDS = float(os.getenv("SKROUTZ_MIN_DELAY_SECONDS", "4.0"))
_DELAY_JITTER_SECONDS = float(os.getenv("SKROUTZ_DELAY_JITTER_SECONDS", "1.0"))
_NAVIGATION_MAX_RETRIES = int(os.getenv("SKROUTZ_NAVIGATION_MAX_RETRIES", "2"))
_IMAGE_MAX_RETRIES = int(os.getenv("SKROUTZ_IMAGE_MAX_RETRIES", "2"))
_PAGE_LOAD_TIMEOUT_SECONDS = int(os.getenv("SKROUTZ_PAGE_LOAD_TIMEOUT_SECONDS", "18"))
_ELEMENT_WAIT_SECONDS = int(os.getenv("SKROUTZ_ELEMENT_WAIT_SECONDS", "6"))
_SOURCE_PER_SITE_TIMEOUT_SECONDS = int(os.getenv("SOURCE_PER_SITE_TIMEOUT_SECONDS", "18"))
_USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
_PROXY_URL = os.getenv("SKROUTZ_PROXY_URL", "").strip()
_PROXY_USERNAME = os.getenv("SKROUTZ_PROXY_USERNAME", "").strip()
_PROXY_PASSWORD = os.getenv("SKROUTZ_PROXY_PASSWORD", "").strip()
_PHARMACY295_BASE_URL = os.getenv("PHARMACY295_BASE_URL", "https://www.pharmacy295.gr").strip()
_FARMAKOPOIOSMOU_BASE_URL = os.getenv("FARMAKOPOIOSMOU_BASE_URL", "https://www.ofarmakopoiosmou.gr").strip()
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
_BROWSER_PATHS = [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
]


class CloudflareBlockedError(Exception):
    pass


def _build_proxy_url() -> str:
    if not _PROXY_URL:
        return ""

    parsed = urlparse(_PROXY_URL)
    if not parsed.scheme:
        parsed = urlparse(f"http://{_PROXY_URL}")

    if parsed.username or not (_PROXY_USERNAME and _PROXY_PASSWORD):
        return urlunparse(parsed)

    netloc = parsed.netloc
    if "@" in netloc:
        return urlunparse(parsed)

    parsed = parsed._replace(netloc=f"{_PROXY_USERNAME}:{_PROXY_PASSWORD}@{netloc}")
    return urlunparse(parsed)


_EFFECTIVE_PROXY_URL = _build_proxy_url()


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

    if use_proxy and _EFFECTIVE_PROXY_URL:
        launch_options["proxy"] = {"server": _EFFECTIVE_PROXY_URL}

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
    best_bbox = None
    best_component_pixels = 0
    best_bbox_area = 0

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

            bbox_area = (max_x - min_x + 1) * (max_y - min_y + 1)
            # Prefer the actual largest connected object, not the widest box.
            # This keeps the product and ignores smaller detached watermark/logo
            # clusters in the lower-left margin.
            if area >= 120 and (
                area > best_component_pixels
                or (area == best_component_pixels and bbox_area > best_bbox_area)
            ):
                best_component_pixels = area
                best_bbox_area = bbox_area
                best_bbox = (min_x, min_y, max_x + 1, max_y + 1)

    if not best_bbox:
        return image

    left, top, right, bottom = best_bbox
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

    return image.crop((left, top, right, bottom))


def _prepare_image_bytes_for_storage(content: bytes, site_name: str) -> bytes:
    with Image.open(io.BytesIO(content)) as image:
        prepared = image.convert("RGB")
        if site_name == "farmakopoiosmou":
            prepared = _remove_farmakopoiosmou_watermark(prepared)

        output = io.BytesIO()
        prepared.save(output, format="JPEG", quality=92, optimize=True)
        return output.getvalue()


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


async def _download_image_with_retries(img_url: str, image_local_path: str, site_name: str = "") -> str:
    image_path = Path(image_local_path)
    image_path.parent.mkdir(parents=True, exist_ok=True)
    if image_path.exists() and image_path.stat().st_size > 0:
        return image_local_path

    timeout = aiohttp.ClientTimeout(total=15)
    connector = aiohttp.TCPConnector(ssl=False)
    headers = {"User-Agent": _USER_AGENT}
    for attempt in range(_IMAGE_MAX_RETRIES + 1):
        try:
            await _apply_polite_delay()
            async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
                async with session.get(img_url, headers=headers, proxy=_EFFECTIVE_PROXY_URL or None) as response:
                    if response.status == 200:
                        content = await response.read()
                        try:
                            content = _prepare_image_bytes_for_storage(content, site_name)
                        except Exception as exc:
                            print(f"Image post-process skipped for {img_url}: {exc}")
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


async def _download_image_collection(image_urls: list[str], barcode: str, site_name: str = "") -> list[str]:
    barcode = str(barcode).strip()
    if not barcode:
        return []

    image_dir = ensure_barcode_image_dir("/app/images", barcode)
    saved_paths: list[str] = []
    seen_urls: set[str] = set()

    for index, raw_url in enumerate(image_urls, start=1):
        image_url = str(raw_url or "").strip()
        if not image_url or image_url in seen_urls:
            continue
        seen_urls.add(image_url)
        image_local_path = str(image_dir / f"{index}.jpg")
        saved_path = await _download_image_with_retries(image_url, image_local_path, site_name)
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
    timeout = aiohttp.ClientTimeout(total=20)
    headers = {
        "User-Agent": _USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    if referer:
        headers["Referer"] = referer

    await _apply_polite_delay()
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url, headers=headers) as response:
            if response.status != 200:
                print(f"farmakopoiosmou product fetch status {response.status} for {url}")
                return ""
            return await response.text()


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
        rf"item_id['\"]?\s*:\s*['\"]{compact_barcode}['\"]",
        rf'"sku"\s*:\s*"{compact_barcode}"',
        rf"data-ean=['\"]{compact_barcode}['\"]",
        rf"data-enhanced_ecommerce_id=['\"]{compact_barcode}['\"]",
    ]
    return any(re.search(pattern, compact_html, flags=re.I) for pattern in patterns)


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

    image_urls = _extract_farmakopoiosmou_image_urls_from_html(page_html)
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


def _extract_farmakopoiosmou_image_urls_from_html(page_html: str) -> list[str]:
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

    filtered_urls = [
        image_url
        for image_url in image_urls
        if any(marker in image_url for marker in ("/sites/default/files/", "product_", "mother", ".png", ".jpg", ".jpeg"))
    ]
    return filtered_urls or image_urls


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
    else:
        category = await _first_text(
            page,
            [".posted_in a:last-child", ".breadcrumb_last", ".breadcrumbs a:last-child", ".category-link"],
            timeout_ms=3000,
        )

    image_local_paths = await _download_image_collection(image_urls, barcode, site_name=site_name) if image_urls else []
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


async def _fetch_from_generic_site(barcode: str, site_name: str, base_url: str, search_urls: list[str]) -> Dict[str, Any]:
    cache_key = (site_name, barcode)
    cached = await _get_cache_value(cache_key)
    if cached is not None:
        print(f"Using cached result for {site_name} barcode {barcode}: {bool(cached)}")
        return cached

    playwright = browser = context = page = None
    product_link_selectors = [
        "a[href*='/product/']",
        "a[href*='/shop/']",
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

        for search_url in search_urls:
            if not await _goto(page, search_url.format(barcode=barcode)):
                continue
            await _try_accept_cookies(page)

            page_title = await _first_text(page, ["h1"], timeout_ms=3000)
            page_content = await page.content()
            if page_title and barcode in page_content:
                product_data = await _extract_product_data(page, barcode, site_name, page.url)
                if product_data.get("Title"):
                    await _set_cache_value(cache_key, product_data)
                    print(f"{site_name} hit for barcode {barcode}")
                    return product_data

            product_url = await _find_first_href(page, product_link_selectors)
            if product_url and await _goto(page, product_url):
                product_data = await _extract_product_data(page, barcode, site_name, product_url)
                if product_data.get("Title"):
                    await _set_cache_value(cache_key, product_data)
                    print(f"{site_name} hit for barcode {barcode}")
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

        await search_input.fill(barcode)
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


async def fetch_from_pharmacy295(barcode: str) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    search_urls = [
        f"{_PHARMACY295_BASE_URL}/search?keyphrase={{barcode}}",
        f"{_PHARMACY295_BASE_URL}/search?query={{barcode}}",
        f"{_PHARMACY295_BASE_URL}/?s={{barcode}}",
    ]
    return await _fetch_from_generic_site(barcode, "pharmacy295", _PHARMACY295_BASE_URL, search_urls)


async def fetch_from_farmakopoiosmou(barcode: str) -> Dict[str, Any]:
    barcode = str(barcode).strip()
    if not barcode:
        return {}

    cache_key = ("farmakopoiosmou", barcode)
    cached = await _get_cache_value(cache_key)
    if cached is not None:
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
                image_urls = product_data.get("Img_src_List") or ([product_data.get("Img_src", "")] if product_data.get("Img_src") else [])
                image_local_paths = await _download_image_collection(image_urls, barcode, "farmakopoiosmou")
                if image_local_paths:
                    product_data["Image_Path"] = image_local_paths[0]
                    product_data["Image_Path_Collection"] = image_local_paths
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
                        image_urls = product_data.get("Img_src_List") or ([product_data.get("Img_src", "")] if product_data.get("Img_src") else [])
                        image_local_paths = await _download_image_collection(image_urls, barcode, "farmakopoiosmou")
                        if image_local_paths:
                            product_data["Image_Path"] = image_local_paths[0]
                            product_data["Image_Path_Collection"] = image_local_paths
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


async def fetch_product_with_source_priority(barcode: str) -> Dict[str, Any]:
    fetchers = (
        ("farmakopoiosmou", fetch_from_farmakopoiosmou),
    )
    for source_name, fetcher in fetchers:
        if source_name in {"skroutz", "farmakopoiosmou"}:
            product_data = await fetcher(barcode)
        else:
            fetch_task = asyncio.create_task(fetcher(barcode))
            try:
                product_data = await asyncio.wait_for(fetch_task, timeout=_SOURCE_PER_SITE_TIMEOUT_SECONDS)
            except asyncio.TimeoutError:
                fetch_task.cancel()
                with suppress(asyncio.CancelledError, Exception):
                    await fetch_task
                print(f"{source_name} timed out for barcode {barcode}")
                continue
        if product_data:
            return product_data
    return {}
