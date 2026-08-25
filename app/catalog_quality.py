from __future__ import annotations

import os
import re
from datetime import datetime, timezone
from typing import Any, Dict, List

from image_paths import resolve_public_image_urls


_HTML_TAG_RE = re.compile(r"<[^>]+>")
_WHITESPACE_RE = re.compile(r"\s+")


def _html_to_text(value: Any) -> str:
    """Strip HTML tags and common entities. Returns the visible text content."""
    raw = str(value or "")
    if not raw:
        return ""
    text = _HTML_TAG_RE.sub(" ", raw)
    text = (text
            .replace("&nbsp;", " ")
            .replace("&#160;", " ")
            .replace("&amp;", "&"))
    return _WHITESPACE_RE.sub(" ", text).strip()


# Reseller / aggregator sites whose names must NOT appear in a product
# description. Manufacturer and importer mentions are allowed.
SOURCE_LEAK_PATTERNS = [
    r"\bskroutz\b",
    r"ofarmakopoiosmou",
    r"o\s*farmakopoiosmou",
    r"farmakopoiosmou\.gr",
    r"ο\s*φαρμακοποιος\s*μου",
    r"pharmacy\s*295",
    r"pharmacy295",
    r"youpharmacy",
    r"gohealthy",
    r"cure4u",
    r"kpdhellas",
    r"vita4you",
    r"tofarmakeiomou",
    r"το\s*φαρμακειο\s*μου",
]
_SOURCE_LEAK_RE = re.compile("|".join(SOURCE_LEAK_PATTERNS), re.IGNORECASE | re.UNICODE)


def _strip_greek_diacritics(text: str) -> str:
    import unicodedata
    nfd = unicodedata.normalize("NFD", text)
    return "".join(c for c in nfd if not unicodedata.combining(c))


def _description_mentions_source(doc: Dict[str, Any]) -> bool:
    parts = [
        _html_to_text(doc.get("cms_description_html", "")),
        str(doc.get("cms_description", "") or ""),
        _first_text(doc.get("Description")),
    ]
    text = _strip_greek_diacritics(" ".join(p for p in parts if p))
    if not text:
        return False
    return bool(_SOURCE_LEAK_RE.search(text))


# Thin-description detection: catches "descriptions" that are just the title
# repeated, or trivially short text.
DESCRIPTION_MIN_TEXT_LENGTH = 30
DESCRIPTION_TITLE_OVERLAP_RATIO = 0.85

_WORD_RE = re.compile(r"[\wΑ-Ωα-ωάέήίόύώϊϋΐΰΆΈΉΊΌΎΏ]+", re.UNICODE)


def _description_words(text: str) -> set:
    return {
        _strip_greek_diacritics(t).lower()
        for t in _WORD_RE.findall(text or "")
        if len(t) > 1
    }


def _description_is_thin(doc: Dict[str, Any]) -> bool:
    """True if the description is too short or essentially the title repeated."""
    html_text = _html_to_text(doc.get("cms_description_html", ""))
    plain = str(doc.get("cms_description", "") or "").strip()
    raw = _first_text(doc.get("Description"))
    desc_text = max((html_text, plain, raw), key=len)
    if len(desc_text.strip()) < DESCRIPTION_MIN_TEXT_LENGTH:
        return True
    desc_tokens = _description_words(desc_text)
    if not desc_tokens:
        return True
    title_text = " ".join(filter(None, [str(doc.get("cms_title", "") or ""),
                                          str(doc.get("Title", "") or "")]))
    title_tokens = _description_words(title_text)
    overlap = len(desc_tokens & title_tokens) / len(desc_tokens)
    return overlap >= DESCRIPTION_TITLE_OVERLAP_RATIO


IMAGE_FILES_BASE_DIR = os.getenv("IMAGE_FILES_BASE_DIR", "/app/images")
IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")

STATE_READY = "ready"
STATE_NEEDS_FIX = "needs_fix"
STATE_READY_FOR_REVIEW = "ready_for_review"


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _first_text(value: Any) -> str:
    if isinstance(value, list):
        for item in value:
            if isinstance(item, str) and item.strip():
                return item.strip()
        return ""
    if isinstance(value, str):
        return value.strip()
    return ""


def _category_present(doc: Dict[str, Any]) -> bool:
    # Activation requires at least Category_1.
    return bool(str(doc.get("Category_1", "")).strip())


def _title_present(doc: Dict[str, Any]) -> bool:
    return bool(str(doc.get("cms_title", "")).strip() or _first_text(doc.get("Title")))


def _description_present(doc: Dict[str, Any]) -> bool:
    # cms_description_html is rich text; tags like <p></p> are not real content.
    if _html_to_text(doc.get("cms_description_html", "")):
        return True
    if str(doc.get("cms_description", "")).strip():
        return True
    return bool(_first_text(doc.get("Description")))


def _hosted_image_urls(doc: Dict[str, Any]) -> List[str]:
    barcode = str(doc.get("cms_barcode", "")).strip() or str(doc.get("Barcode", "")).strip()
    if not barcode:
        return []
    return resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL)


# Image processing versions known to produce watermark-free output.
CLEAN_IMAGE_VERSIONS = {
    "pharmacy295_excel_replace_v1",
    "manual_upload_v1",
    "manufacturer_cache_v1",
    "watermark_remediation_alt_v1",
    "watermark_remediation_google_v1",
}


def _image_is_clean(doc: Dict[str, Any]) -> bool:
    """Return True if the served image is known-clean (no watermark).

    A per-image watermark scan (image_watermark_detected flag) takes priority
    when present; otherwise fall back to the cleanup-pipeline heuristic.
    """
    # Per-image detector ruling (set by image_watermark_scanner.py).
    if doc.get("image_watermark_detected") is True:
        return False
    if doc.get("image_watermark_detected") is False:
        return True
    # Fallback to the legacy heuristic: if cleanup was never required, assume clean.
    if not bool(doc.get("watermark_cleanup_applied")):
        return True
    version = str(doc.get("image_processing_version", "") or "").strip()
    return version in CLEAN_IMAGE_VERSIONS


def evaluate_catalog_quality(doc: Dict[str, Any]) -> Dict[str, Any]:
    hosted_urls = _hosted_image_urls(doc)
    has_hosted_image = bool(hosted_urls)
    has_any_image = bool(has_hosted_image or str(doc.get("Img_src", "")).strip() or _first_text(doc.get("Image_url")))
    has_title = _title_present(doc)
    has_description = _description_present(doc)
    has_text = bool(has_title and has_description)
    has_category = _category_present(doc)
    image_clean = _image_is_clean(doc)
    description_leaks_source = has_description and _description_mentions_source(doc)
    description_thin = has_description and _description_is_thin(doc)

    missing_requirements: List[str] = []
    if not has_hosted_image:
        missing_requirements.append("missing_hosted_image")
    elif not image_clean:
        missing_requirements.append("watermarked_image")
    if not has_title:
        missing_requirements.append("missing_title")
    if not has_description:
        missing_requirements.append("missing_description")
    elif description_thin:
        missing_requirements.append("description_too_thin")
    elif description_leaks_source:
        missing_requirements.append("description_mentions_source")
    if not has_category:
        missing_requirements.append("missing_category")
    public_image_enabled = has_hosted_image
    image_visibility = "hosted" if has_hosted_image else ("disabled_external" if has_any_image else "missing")

    # Site-ready flag for customer e-shop export — INDEPENDENT of
    # cms_status. We track it separately so admins can filter "ready to
    # publish" without blocking internal activation of products that lack
    # weight/dimensions.
    from product_attributes import is_site_ready as _attrs_site_ready
    site_ready_for_export = _attrs_site_ready(doc.get("attributes") or {})

    reviewed_status = "active"
    quality_state = STATE_READY
    review_required = False
    ready_for_activation = True
    quality_managed_status = False

    if missing_requirements:
        reviewed_status = "inactive"
        quality_state = STATE_NEEDS_FIX
        review_required = True
        ready_for_activation = False
        quality_managed_status = True

    return {
        "hosted_image_urls": hosted_urls,
        "has_hosted_image": has_hosted_image,
        "has_any_image": has_any_image,
        "public_image_enabled": public_image_enabled,
        "image_visibility": image_visibility,
        "has_text": has_text,
        "has_title": has_title,
        "has_description": has_description,
        "has_category": has_category,
        "description_leaks_source": description_leaks_source,
        "description_thin": description_thin,
        "missing_requirements": missing_requirements,
        "quality_state": quality_state,
        "review_required": review_required,
        "ready_for_activation": ready_for_activation,
        "recommended_status": reviewed_status,
        "quality_managed_status": quality_managed_status,
        "site_ready_for_export": site_ready_for_export,
    }


def build_catalog_quality_updates(
    doc: Dict[str, Any],
    *,
    evaluator: str = "system",
    manual_review_approved: bool = False,
    queue_for_review: bool = False,
    reviewed_by: str = "",
) -> Dict[str, Any]:
    evaluation = evaluate_catalog_quality(doc)
    updates: Dict[str, Any] = {
        "catalog_has_hosted_image": evaluation["has_hosted_image"],
        "catalog_has_any_image": evaluation["has_any_image"],
        "catalog_public_image_enabled": evaluation["public_image_enabled"],
        "catalog_image_visibility": evaluation["image_visibility"],
        "catalog_has_text": evaluation["has_text"],
        "catalog_has_title": evaluation["has_title"],
        "catalog_has_description": evaluation["has_description"],
        "catalog_has_category": evaluation["has_category"],
        "catalog_description_leaks_source": evaluation["description_leaks_source"],
        "catalog_missing_requirements": evaluation["missing_requirements"],
        "catalog_quality_state": evaluation["quality_state"],
        "catalog_review_required": evaluation["review_required"],
        "catalog_ready_for_activation": evaluation["ready_for_activation"],
        "catalog_quality_managed_status": evaluation["quality_managed_status"],
        "catalog_last_evaluated_at": _utcnow_iso(),
        "catalog_last_evaluated_by": evaluator,
        "cms_status": evaluation["recommended_status"],
        "catalog_site_ready_for_export": evaluation["site_ready_for_export"],
    }

    # Track when a product transitions to active (for "new items" surfacing in the portal).
    previous_status = str(doc.get("cms_status", "") or "").strip().lower()
    if evaluation["recommended_status"] == "active" and previous_status != "active":
        updates["cms_activated_at"] = _utcnow_iso()
        updates["cms_activated_by"] = evaluator

    if evaluation["missing_requirements"]:
        updates.update(
            {
                "catalog_reviewed_at": "",
                "catalog_reviewed_by": "",
            }
        )

    if manual_review_approved and not evaluation["missing_requirements"]:
        updates.update(
            {
                "cms_status": "active",
                "catalog_quality_state": STATE_READY,
                "catalog_review_required": False,
                "catalog_ready_for_activation": False,
                "catalog_quality_managed_status": False,
                "catalog_reviewed_at": _utcnow_iso(),
                "catalog_reviewed_by": reviewed_by or evaluator,
            }
        )
        if previous_status != "active":
            updates["cms_activated_at"] = _utcnow_iso()
            updates["cms_activated_by"] = reviewed_by or evaluator
    elif queue_for_review and not evaluation["missing_requirements"]:
        updates.update(
            {
                "cms_status": "inactive",
                "catalog_quality_state": STATE_READY_FOR_REVIEW,
                "catalog_review_required": True,
                "catalog_ready_for_activation": True,
                "catalog_quality_managed_status": True,
                "catalog_reviewed_at": "",
                "catalog_reviewed_by": "",
            }
        )

    return updates
