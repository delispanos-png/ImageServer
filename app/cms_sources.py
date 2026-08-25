from __future__ import annotations

import os
import xml.etree.ElementTree as ET
from collections import defaultdict
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from cms_activity import log_cms_audit_event, utcnow_iso
from cms_catalog import _first_text
from cms_permissions import get_current_cms_user, require_cms_permissions
from cms_source_jobs import (
    get_source_job_config,
    get_source_job_overview,
    get_source_job_upload_path,
    start_source_job,
    update_source_job_upload_state,
)
from image_paths import scan_public_image_urls
from runtime_settings import (
    get_enabled_source_chain,
    get_enabled_image_source_chain,
    get_enabled_text_source_chain,
    get_sources_settings,
    is_proxy_configured,
    save_runtime_settings,
)


IMAGE_FILES_BASE_DIR = os.getenv("IMAGE_FILES_BASE_DIR", "/app/images")
IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")

SOURCE_CONFIGS: Dict[str, Dict[str, Any]] = {
    "farmakopoiosmou": {
        "label": "Ofarmakopoiosmou",
        "base_url": "https://www.ofarmakopoiosmou.gr",
        "search_pattern": "https://www.ofarmakopoiosmou.gr/#search/<barcode>",
        "priority": 1,
        "enabled_in_chain": True,
        "access_status": "active",
        "notes": [
            "Primary text source in the fetch chain.",
            "Image intake is disabled for this source; it is used only for text and metadata.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": True},
        ],
    },
    "pharmacy295": {
        "label": "Pharmacy295",
        "base_url": "https://www.pharmacy295.gr",
        "search_pattern": "https://www.pharmacy295.gr/search-results?query=<barcode>",
        "priority": 2,
        "enabled_in_chain": True,
        "access_status": "flaresolverr_supported",
        "notes": [
            "Preferred photo source when feed coverage exists.",
            "Live HTTP traffic is now routed through FlareSolverr so Cloudflare no longer blocks the legacy fetcher, but the Excel feed remains the primary path because their search index does not return individual products by barcode.",
            "Day-to-day operation should keep using Import Photos from the Excel feed.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "youpharmacy": {
        "label": "YouPharmacy",
        "base_url": "https://www.youpharmacy.gr",
        "search_pattern": "https://www.youpharmacy.gr/?s=<barcode>&post_type=product",
        "priority": 5,
        "enabled_in_chain": True,
        "access_status": "flaresolverr_supported",
        "notes": [
            "WooCommerce source. Live HTTP flows through FlareSolverr (Cloudflare-protected).",
            "Live fetch is the primary path for both text and images, via the FlareSolverr-first chain that resolves /product/<slug>/ URLs and parses the WooCommerce product page.",
            "XML photo-import remains available as a fallback for bulk seeding when live fetch is unavailable.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "gohealthy": {
        "label": "GoHealthy",
        "base_url": "https://www.gohealthy.gr",
        "search_pattern": "https://www.gohealthy.gr/search-results?search=<barcode>",
        "priority": 6,
        "enabled_in_chain": False,
        "access_status": "flaresolverr_supported",
        "notes": [
            "Search-result pattern lands on product-detail candidates via the canonical /search-results?search= barcode flow.",
            "Manual refresh can use this source directly for text, categories, and images through the generic source adapter.",
            "Keep it disabled in the live chain until barcode/title precision is validated on a wider sample.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "cure4u": {
        "label": "Cure4u",
        "base_url": "https://www.cure4u.gr",
        "search_pattern": "https://www.cure4u.gr/module/ambjolisearch/jolisearch?s=<barcode>",
        "priority": 6,
        "enabled_in_chain": False,
        "access_status": "flaresolverr_supported",
        "notes": [
            "PrestaShop source wired on the ambjolisearch HTML endpoint instead of browser-only search flow.",
            "Manual refresh can use this source directly for text, categories, and images.",
            "Keep it disabled in the live chain until barcode precision is validated on a wider production sample.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "kpdhellas": {
        "label": "KpdHellas",
        "base_url": "https://kpdhellas.gr",
        "search_pattern": "https://kpdhellas.gr/index.php?route=product/search&search=<barcode>",
        "priority": 7,
        "enabled_in_chain": True,
        "access_status": "active",
        "notes": [
            "OpenCart/Journal3 source wired on the canonical product/search HTML endpoint.",
            "Enabled in the live chain with deliberately low priority as a late text fallback after the primary sources.",
            "Automatic image priority is currently disabled because the product-page gallery extractor still pulls unrelated carousel images on some templates.",
            "Manual refresh can still use this source explicitly for images when you choose KpdHellas in the item modal. Category depth is limited because the product page breadcrumb often exposes only the product title.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": False},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "vita4you": {
        "label": "Vita4you",
        "base_url": "https://www.vita4you.gr",
        "search_pattern": "https://www.vita4you.gr/el/search/?q=<barcode>",
        "priority": 3,
        "enabled_in_chain": False,
        "access_status": "unstable",
        "notes": [
            "Currently disabled in the live source chain because it is not reliable enough for production refresh decisions.",
            "If re-enabled later, the fetch path must stay on the canonical localized search URL plus direct Klevu JSON fallback and browser candidate fallback.",
            "Matching remains intentionally strict and time-bounded so wrong variants do not stall manual refresh, and invalid 200 image responses are now rejected instead of being stored as bad files.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": False},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "skroutz": {
        "label": "Skroutz",
        "base_url": "https://www.skroutz.gr",
        "search_pattern": "Skroutz product search by barcode",
        "priority": 4,
        "enabled_in_chain": False,
        "access_status": "flaresolverr_supported",
        "notes": [
            "Aggregator listings parser; FlareSolverr now bypasses Cloudflare.",
            "Currently not enabled in the active source chain — pull-on-demand only.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": False},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": False},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": False},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": False},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "boxpharmacy": {
        "label": "Box Pharmacy",
        "base_url": "https://www.boxpharmacy.gr",
        "search_pattern": "https://www.boxpharmacy.gr/el/search?q=<barcode>",
        "priority": 5,
        "enabled_in_chain": False,
        "access_status": "unstable",
        "notes": [
            "Detected in historical image URLs only; no dedicated parser exists yet.",
            "Live tests show timeout and redirect instability, so it is kept disabled.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": False},
            {"key": "short_title", "label": "Short Title", "enabled": False},
            {"key": "description", "label": "Description", "enabled": False},
            {"key": "brand", "label": "Brand", "enabled": False},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": False},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": False},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "tofarmakeiomou": {
        "label": "ToFarmakeioMou",
        "base_url": "https://www.tofarmakeiomou.gr",
        "search_pattern": "https://www.tofarmakeiomou.gr/el-gr/ALL?title=<barcode>",
        "priority": 6,
        "enabled_in_chain": False,
        "access_status": "proxy_required",
        "notes": [
            "Direct title search pattern is known and parser support is now wired.",
            "Live server-side requests currently return Cloudflare challenge pages, so live fetch still needs proxy.",
            "When proxy is off, manual refresh can still reuse a trusted stored snapshot for text, but image mode skips remote source-image download attempts and leaves the draft image state empty unless a fresh hosted set can be produced.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "newgenpharmacy": {
        "label": "NewGen Pharmacy",
        "base_url": "https://www.newgenpharmacy.gr",
        "search_pattern": "https://www.newgenpharmacy.gr/index.php?route=product/search&search=<barcode>",
        "priority": 4,
        "enabled_in_chain": True,
        "access_status": "flaresolverr_required",
        "notes": [
            "OpenCart source behind Cloudflare Turnstile — every fetch is routed through the FlareSolverr sidecar (set FLARESOLVERR_URL).",
            "Search page exposes the matching product id and ga4_items metadata, then we follow up to the canonical product page for description and high-res image.",
            "Refresh time is higher than the average source because each request goes through the FlareSolverr challenge solver.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": True},
            {"key": "short_title", "label": "Short Title", "enabled": True},
            {"key": "description", "label": "Description", "enabled": True},
            {"key": "brand", "label": "Brand", "enabled": True},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": True},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "pharm16": {
        "label": "Pharm16",
        "base_url": "https://www.pharm16.gr",
        "search_pattern": "Blocked by Cloudflare without proxy/session",
        "priority": 7,
        "enabled_in_chain": False,
        "access_status": "blocked",
        "notes": [
            "Historical image host exists in the backlog.",
            "Live search requests return Cloudflare protection, so the source stays disabled.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": False},
            {"key": "short_title", "label": "Short Title", "enabled": False},
            {"key": "description", "label": "Description", "enabled": False},
            {"key": "brand", "label": "Brand", "enabled": False},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": False},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": False},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
    "google_images": {
        "label": "Google Images",
        "base_url": "https://www.googleapis.com/customsearch/v1",
        "search_pattern": "Google Custom Search JSON API (image search by barcode)",
        "priority": 99,
        "enabled_in_chain": False,
        "access_status": "needs_credentials",
        "notes": [
            "Requires GOOGLE_API_KEY and GOOGLE_CSE_ID environment variables.",
            "Image-only source — does not contribute text fields.",
            "Pricing: 100 queries/day free, then $5 per 1000 queries.",
            "Optional GOOGLE_IMAGES_BLOCKED_DOMAINS for filtering watermarked sources.",
            "Optional GOOGLE_IMAGES_DAILY_BUDGET to cap daily spend.",
        ],
        "capabilities": [
            {"key": "title", "label": "Title", "enabled": False},
            {"key": "short_title", "label": "Short Title", "enabled": False},
            {"key": "description", "label": "Description", "enabled": False},
            {"key": "brand", "label": "Brand", "enabled": False},
            {"key": "categories_3_levels", "label": "Category 1/2/3", "enabled": False},
            {"key": "multiple_images", "label": "Multiple Images", "enabled": True},
            {"key": "watermark_cleanup", "label": "Watermark Cleanup", "enabled": False},
        ],
    },
}


class SourceSettingsPayload(BaseModel):
    enabled: Optional[bool] = None
    removed: Optional[bool] = None
    priority: Optional[int] = None
    text_priority: Optional[int] = None
    image_priority: Optional[int] = None
    use_flaresolverr: Optional[bool] = None


class SourceJobRunPayload(BaseModel):
    job_key: str


class SourceJobUploadPayload(BaseModel):
    file_name: str
    content: str


def _normalize_text(value: Any) -> str:
    return str(value or "").strip()


def _hostname_from_url(value: Any) -> str:
    raw = _normalize_text(value)
    if not raw:
        return ""
    parsed = urlparse(raw)
    host = (parsed.netloc or "").strip().lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def _normalize_source_name(source_name: Any, site_name: Any, img_src: Any, product_link: Any) -> str:
    for candidate in (_normalize_text(source_name).lower(), _normalize_text(site_name).lower()):
        if candidate in {"farmakopoiosmou", "ofarmakopoiosmou"}:
            return "farmakopoiosmou"
        if "pharmacy295" in candidate:
            return "pharmacy295"
        if "youpharmacy" in candidate:
            return "youpharmacy"
        if "kpdhellas" in candidate:
            return "kpdhellas"
        if "cure4u" in candidate:
            return "cure4u"
        if "vita4you" in candidate:
            return "vita4you"
        if "boxpharmacy" in candidate or "box pharmacy" in candidate:
            return "boxpharmacy"
        if "tofarmakeiomou" in candidate:
            return "tofarmakeiomou"
        if "pharm16" in candidate:
            return "pharm16"
        if "skroutz" in candidate:
            return "skroutz"
        if candidate:
            return candidate.replace(" ", "_")

    for candidate in (_hostname_from_url(img_src), _hostname_from_url(product_link)):
        if "ofarmakopoiosmou" in candidate:
            return "farmakopoiosmou"
        if "pharmacy295" in candidate:
            return "pharmacy295"
        if "kpdhellas" in candidate:
            return "kpdhellas"
        if "cure4u" in candidate:
            return "cure4u"
        if "vita4you" in candidate:
            return "vita4you"
        if "tofarmakeiomou" in candidate:
            return "tofarmakeiomou"
        if "pharm16" in candidate:
            return "pharm16"
        if "skroutz" in candidate:
            return "skroutz"
        if candidate:
            return candidate

    for candidate in (_normalize_text(img_src).lower(), _normalize_text(product_link).lower()):
        if "boxpharmacy" in candidate or "box pharmacy" in candidate:
            return "boxpharmacy"
        if "kpdhellas" in candidate:
            return "kpdhellas"
        if "cure4u" in candidate:
            return "cure4u"
        if "vita4you" in candidate:
            return "vita4you"
        if "tofarmakeiomou" in candidate:
            return "tofarmakeiomou"
        if "pharm16" in candidate:
            return "pharm16"

    return "unknown"


def _has_title(doc: Dict[str, Any]) -> bool:
    return bool(_normalize_text(doc.get("cms_title")) or _first_text(doc.get("Title")))


def _has_short_title(doc: Dict[str, Any]) -> bool:
    return bool(_first_text(doc.get("Sml_Title")))


def _has_description(doc: Dict[str, Any]) -> bool:
    return bool(
        _normalize_text(doc.get("cms_description_html"))
        or _normalize_text(doc.get("cms_description"))
        or _first_text(doc.get("Description"))
    )


def _has_brand(doc: Dict[str, Any]) -> bool:
    return bool(_normalize_text(doc.get("cms_brand")) or _normalize_text(doc.get("Brand")))


def _has_category_tree(doc: Dict[str, Any]) -> bool:
    return bool(
        _normalize_text(doc.get("cms_category_id"))
        or _normalize_text(doc.get("Category_1"))
        or _normalize_text(doc.get("Category_2"))
        or _normalize_text(doc.get("Category_3"))
    )


def _projection() -> Dict[str, int]:
    return {
        "_id": 0,
        "Barcode": 1,
        "last_source": 1,
        "Site": 1,
        "Img_src": 1,
        "Img_src_List": 1,
        "Product_Link": 1,
        "Title": 1,
        "Sml_Title": 1,
        "Description": 1,
        "Brand": 1,
        "Category_1": 1,
        "Category_2": 1,
        "Category_3": 1,
        "cms_title": 1,
        "cms_description": 1,
        "cms_description_html": 1,
        "cms_brand": 1,
        "cms_category_id": 1,
        "watermark_cleanup_applied": 1,
    }


def _init_stats() -> Dict[str, int]:
    return {
        "products_in_db": 0,
        "hosted_images_count": 0,
        "multiple_images_count": 0,
        "watermark_cleaned_count": 0,
        "title_count": 0,
        "short_title_count": 0,
        "description_count": 0,
        "brand_count": 0,
        "category_tree_count": 0,
        "source_image_count": 0,
    }


def _serialize_source(
    key: str,
    config: Dict[str, Any],
    stats: Dict[str, Any],
    proxy_configured: bool,
    runtime_config: Dict[str, Any],
) -> Dict[str, Any]:
    removed = bool(runtime_config.get("removed", False))
    access_status = str(config.get("access_status", "active"))
    if removed:
        access_status = "removed"
    if key in {"pharmacy295", "skroutz", "tofarmakeiomou", "pharm16"} and proxy_configured:
        access_status = "proxy_ready"
    if removed:
        access_status = "removed"

    return {
        "key": key,
        "label": config.get("label", key),
        "base_url": config.get("base_url", ""),
        "search_pattern": config.get("search_pattern", ""),
        "priority": int(runtime_config.get("priority", config.get("priority", 999))),
        "text_priority": int(runtime_config.get("text_priority", config.get("priority", 0)) or 0),
        "image_priority": int(runtime_config.get("image_priority", 0) or 0),
        "enabled_in_chain": False if removed else bool(runtime_config.get("enabled", config.get("enabled_in_chain", False))),
        "removed": removed,
        "removed_at": str(runtime_config.get("removed_at", "") or ""),
        "removed_by": str(runtime_config.get("removed_by", "") or ""),
        "use_flaresolverr": bool(runtime_config.get("use_flaresolverr", False)),
        "preserves_existing_products": True,
        "runtime_control_enabled": bool(config.get("runtime_control_enabled", True)),
        "access_status": access_status,
        "products_in_db": int(stats["products_in_db"]),
        "hosted_images_count": int(stats["hosted_images_count"]),
        "multiple_images_count": int(stats["multiple_images_count"]),
        "watermark_cleaned_count": int(stats["watermark_cleaned_count"]),
        "field_coverage": {
            "title": int(stats["title_count"]),
            "short_title": int(stats["short_title_count"]),
            "description": int(stats["description_count"]),
            "brand": int(stats["brand_count"]),
            "category_tree": int(stats["category_tree_count"]),
            "source_image": int(stats["source_image_count"]),
        },
        "capabilities": config.get("capabilities", []),
        "notes": config.get("notes", []),
        "jobs": [] if removed else get_source_job_overview(key),
    }


def _build_sources_overview_data(docs: List[Dict[str, Any]]) -> Dict[str, Any]:
    proxy_configured = is_proxy_configured()
    runtime_sources = get_sources_settings()
    hosted_images_lookup = scan_public_image_urls(IMAGE_FILES_BASE_DIR, IMAGE_PUBLIC_BASE_URL)

    known_stats: Dict[str, Dict[str, int]] = {key: _init_stats() for key in SOURCE_CONFIGS}
    other_stats: Dict[str, Dict[str, int]] = defaultdict(_init_stats)

    for doc in docs:
        source_key = _normalize_source_name(
            doc.get("last_source"),
            doc.get("Site"),
            doc.get("Img_src"),
            doc.get("Product_Link"),
        )
        barcode = _normalize_text(doc.get("Barcode"))
        hosted_urls = hosted_images_lookup.get(barcode, []) if barcode else []
        stats = known_stats[source_key] if source_key in SOURCE_CONFIGS else other_stats[source_key]

        stats["products_in_db"] += 1
        if hosted_urls:
            stats["hosted_images_count"] += 1
        if len(hosted_urls) > 1 or len(doc.get("Img_src_List") or []) > 1:
            stats["multiple_images_count"] += 1
        if bool(doc.get("watermark_cleanup_applied")):
            stats["watermark_cleaned_count"] += 1
        if _has_title(doc):
            stats["title_count"] += 1
        if _has_short_title(doc):
            stats["short_title_count"] += 1
        if _has_description(doc):
            stats["description_count"] += 1
        if _has_brand(doc):
            stats["brand_count"] += 1
        if _has_category_tree(doc):
            stats["category_tree_count"] += 1
        if _normalize_text(doc.get("Img_src")):
            stats["source_image_count"] += 1

    known_sources = [
        _serialize_source(key, SOURCE_CONFIGS[key], known_stats[key], proxy_configured, runtime_sources.get(key, {}))
        for key in SOURCE_CONFIGS
    ]
    known_sources.sort(
        key=lambda row: (
            1 if row.get("removed") else 0,
            0 if row["enabled_in_chain"] else 1,
            row["priority"] or 999,
            row["label"].lower(),
        )
    )

    other_detected_sources = [
        {
            "key": key,
            "label": key,
            "products_in_db": int(stats["products_in_db"]),
            "hosted_images_count": int(stats["hosted_images_count"]),
            "multiple_images_count": int(stats["multiple_images_count"]),
        }
        for key, stats in other_stats.items()
        if key not in {"unknown", ""}
    ]
    other_detected_sources.sort(key=lambda row: (-row["products_in_db"], row["label"]))

    totals = {
        "tracked_sources": len(known_sources),
        "removed_sources_count": sum(1 for source in known_sources if source.get("removed")),
        "products_in_db": sum(source["products_in_db"] for source in known_sources),
        "hosted_images_count": sum(source["hosted_images_count"] for source in known_sources),
        "multiple_images_count": sum(source["multiple_images_count"] for source in known_sources),
        "watermark_cleaned_count": sum(source["watermark_cleaned_count"] for source in known_sources),
        "other_detected_sources_count": len(other_detected_sources),
    }

    return {
        "proxy_configured": proxy_configured,
        "source_chain": get_enabled_source_chain(),
        "text_source_chain": get_enabled_text_source_chain(),
        "image_source_chain": get_enabled_image_source_chain(),
        "totals": totals,
        "sources": known_sources,
        "other_detected_sources": other_detected_sources[:15],
    }


def _source_or_404(source_key: str) -> Dict[str, Any]:
    config = SOURCE_CONFIGS.get(source_key)
    if config is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown source")
    return config


def _inspect_uploaded_xml(xml_path: str) -> Dict[str, int]:
    product_count = 0
    image_rows = 0
    try:
        for _, elem in ET.iterparse(xml_path, events=("end",)):
            if elem.tag != "product":
                continue
            product_count += 1
            if str(elem.findtext("image", "") or "").strip():
                image_rows += 1
            elem.clear()
    except ET.ParseError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid XML file: {exc}") from exc

    if product_count <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded XML does not contain any <product> rows")

    return {
        "product_count": product_count,
        "image_rows": image_rows,
    }


def create_cms_sources_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/sources", tags=["cms-sources"])

    @router.get(
        "/overview",
        dependencies=[Depends(require_cms_permissions("sources.view"))],
    )
    async def get_sources_overview(current_user: Dict[str, Any] = Depends(get_current_cms_user)) -> Dict[str, Any]:
        del current_user
        docs = await db.products.find({}, _projection()).to_list(length=None)
        return {"success": True, "data": _build_sources_overview_data(docs)}

    @router.put(
        "/{source_key}",
        dependencies=[Depends(require_cms_permissions("sources.update"))],
    )
    async def update_source_settings(
        source_key: str,
        payload: SourceSettingsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        _source_or_404(source_key)
        current_runtime = get_sources_settings().get(source_key, {})

        if (
            payload.enabled is None
            and payload.removed is None
            and payload.priority is None
            and payload.text_priority is None
            and payload.image_priority is None
            and payload.use_flaresolverr is None
        ):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No source setting changes were provided")

        updates: Dict[str, Any] = {}
        if payload.enabled is not None:
            updates["enabled"] = bool(payload.enabled)

        if payload.removed is not None:
            source_jobs = get_source_job_overview(source_key)
            if payload.removed and any(job.get("running") for job in source_jobs):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Stop or wait for running source jobs before removing this source",
                )
            updates["removed"] = bool(payload.removed)
            if payload.removed:
                updates["enabled"] = False
                updates["removed_at"] = utcnow_iso()
                updates["removed_by"] = str(current_user.get("email", "")).strip()
            else:
                updates["removed_at"] = ""
                updates["removed_by"] = ""

        if bool(current_runtime.get("removed", False)) and payload.enabled:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Restore the source before enabling it in the source chain",
            )

        for field_name in ("priority", "text_priority", "image_priority"):
            value = getattr(payload, field_name)
            if value is None:
                continue
            if value < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"{field_name} must be zero or a positive integer",
                )
            updates[field_name] = int(value)

        if payload.use_flaresolverr is not None:
            updates["use_flaresolverr"] = bool(payload.use_flaresolverr)

        saved = save_runtime_settings(
            {
                "sources": {
                    source_key: updates
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_source_settings",
            entity_type="source",
            entity_id=source_key,
            user=current_user,
            metadata={
                "enabled": bool(saved["sources"][source_key]["enabled"]),
                "removed": bool(saved["sources"][source_key].get("removed", False)),
                "priority": int(saved["sources"][source_key]["priority"]),
                "text_priority": int(saved["sources"][source_key]["text_priority"]),
                "image_priority": int(saved["sources"][source_key]["image_priority"]),
                "updated_at": utcnow_iso(),
            },
        )

        docs = await db.products.find({}, _projection()).to_list(length=None)
        overview = _build_sources_overview_data(docs)
        source = next((row for row in overview["sources"] if row["key"] == source_key), None)
        return {
            "success": True,
            "data": {
                "source": source,
                "source_chain": overview["source_chain"],
            },
        }

    @router.delete(
        "/{source_key}",
        dependencies=[Depends(require_cms_permissions("sources.update"))],
    )
    async def remove_source(
        source_key: str,
        purge_references: bool = False,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        """Mark a source as removed. Products that were previously
        enriched from this source stay in db.products — only the chain
        registration is dropped.

        When `purge_references=true`, also scrub stale fields that pin a
        product to the removed source: `Other_Sites.<source>`, and any
        `last_source` / `image_source_domain` / `text_source_domain` /
        `category_source_domain` value equal to the source. Hosted images
        and primary fields (Title, Description, Img_src) are kept — the
        product remains usable, it just no longer claims this source.
        """
        normalized = str(source_key or "").strip().lower()
        result = await update_source_settings(
            source_key=source_key,
            payload=SourceSettingsPayload(removed=True),
            current_user=current_user,
        )

        if purge_references and normalized:
            domain_fields = (
                "last_source",
                "image_source_domain",
                "text_source_domain",
                "category_source_domain",
            )
            unset_doc = {f"Other_Sites.{normalized}": ""}
            # Wipe per-source snapshot block for every product that has one.
            await db.products.update_many(
                {f"Other_Sites.{normalized}": {"$exists": True}},
                {"$unset": unset_doc},
            )
            # Detach domain fields whose value points at the removed source.
            for field in domain_fields:
                await db.products.update_many(
                    {field: normalized},
                    {"$unset": {field: ""}},
                )
            # Clear the photo_source_lock when it pinned to the removed source.
            await db.products.update_many(
                {"photo_source_lock": normalized},
                {
                    "$unset": {
                        "photo_source_lock": "",
                        "photo_source_locked": "",
                        "photo_source_locked_at": "",
                    },
                },
            )
            await log_cms_audit_event(
                db,
                action="purge_source_references",
                entity_type="source",
                entity_id=normalized,
                user=current_user,
                metadata={"fields_cleared": list(domain_fields) + ["Other_Sites", "photo_source_lock"]},
            )

        return {**result, "purge_references": purge_references}

    @router.post(
        "/{source_key}/restore",
        dependencies=[Depends(require_cms_permissions("sources.update"))],
    )
    async def restore_source(
        source_key: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        return await update_source_settings(
            source_key=source_key,
            payload=SourceSettingsPayload(removed=False),
            current_user=current_user,
        )

    @router.post(
        "/{source_key}/jobs/{job_key}/upload",
        dependencies=[Depends(require_cms_permissions("sources.run"))],
    )
    async def upload_source_job_file(
        source_key: str,
        job_key: str,
        payload: SourceJobUploadPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        _source_or_404(source_key)
        current_runtime = get_sources_settings().get(source_key, {})
        if bool(current_runtime.get("removed", False)):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Source has been removed from operations")

        job_config = get_source_job_config(source_key, job_key)
        if not job_config or not isinstance(job_config.get("upload"), dict):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This source job does not accept file uploads")

        source_jobs = get_source_job_overview(source_key)
        running_job = next((row for row in source_jobs if row.get("key") == job_key and row.get("running")), None)
        if running_job:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Wait for the running job to finish before uploading a new XML file")

        file_name = str(payload.file_name or "").strip()
        if not file_name.lower().endswith(".xml"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only .xml files are supported for this job")
        xml_content = str(payload.content or "")
        if not xml_content.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded XML content is empty")

        target_path = get_source_job_upload_path(source_key, job_key)
        if target_path is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Source job upload path is not configured")

        target_path.parent.mkdir(parents=True, exist_ok=True)
        temp_path = target_path.with_suffix(".uploading")
        try:
            temp_path.write_text(xml_content, encoding="utf-8")
            upload_stats = _inspect_uploaded_xml(str(temp_path))
            temp_path.replace(target_path)
        finally:
            if temp_path.exists():
                temp_path.unlink(missing_ok=True)

        uploaded_at = utcnow_iso()
        size_bytes = int(target_path.stat().st_size) if target_path.exists() else 0
        update_source_job_upload_state(
            source_key,
            job_key,
            uploaded_file_name=file_name,
            uploaded_at=uploaded_at,
            uploaded_size_bytes=size_bytes,
            uploaded_product_count=upload_stats["product_count"],
            uploaded_image_rows=upload_stats["image_rows"],
        )

        await log_cms_audit_event(
            db,
            action="upload_source_job_file",
            entity_type="source_job_upload",
            entity_id=f"{source_key}:{job_key}",
            user=current_user,
            metadata={
                "source": source_key,
                "job_key": job_key,
                "file_name": file_name,
                "stored_path": str(target_path),
                "size_bytes": size_bytes,
                "product_count": upload_stats["product_count"],
                "image_rows": upload_stats["image_rows"],
            },
        )

        docs = await db.products.find({}, _projection()).to_list(length=None)
        overview = _build_sources_overview_data(docs)
        source = next((row for row in overview["sources"] if row["key"] == source_key), None)
        job = next((row for row in (source or {}).get("jobs", []) if row["key"] == job_key), None)
        return {
            "success": True,
            "data": {
                "source": source,
                "job": job,
                "upload": (job or {}).get("upload"),
            },
        }

    @router.post(
        "/{source_key}/run",
        dependencies=[Depends(require_cms_permissions("sources.run"))],
    )
    async def run_source_job(
        source_key: str,
        payload: SourceJobRunPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        _source_or_404(source_key)
        current_runtime = get_sources_settings().get(source_key, {})
        if bool(current_runtime.get("removed", False)):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Source has been removed from operations")
        try:
            job_start = start_source_job(source_key, payload.job_key)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

        await log_cms_audit_event(
            db,
            action="run_source_job",
            entity_type="source_job",
            entity_id=f"{source_key}:{payload.job_key}",
            user=current_user,
            metadata={
                "source": source_key,
                "job_key": payload.job_key,
                "started": bool(job_start.get("started")),
                "already_running": bool(job_start.get("already_running")),
                "pid": int(job_start.get("pid", 0)),
                "log_path": str(job_start.get("log_path", "")),
            },
        )

        docs = await db.products.find({}, _projection()).to_list(length=None)
        overview = _build_sources_overview_data(docs)
        source = next((row for row in overview["sources"] if row["key"] == source_key), None)
        job = next((row for row in (source or {}).get("jobs", []) if row["key"] == payload.job_key), None)
        return {
            "success": True,
            "data": {
                "source": source,
                "job": job,
                "job_start": job_start,
            },
        }

    return router
