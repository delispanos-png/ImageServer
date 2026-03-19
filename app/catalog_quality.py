from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Dict, List

from image_paths import resolve_public_image_urls


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
    return bool(
        str(doc.get("cms_category_id", "")).strip()
        or str(doc.get("Category_1", "")).strip()
        or str(doc.get("Category_2", "")).strip()
        or str(doc.get("Category_3", "")).strip()
    )


def _title_present(doc: Dict[str, Any]) -> bool:
    return bool(str(doc.get("cms_title", "")).strip() or _first_text(doc.get("Title")))


def _description_present(doc: Dict[str, Any]) -> bool:
    return bool(
        str(doc.get("cms_description_html", "")).strip()
        or str(doc.get("cms_description", "")).strip()
        or _first_text(doc.get("Description"))
    )


def _hosted_image_urls(doc: Dict[str, Any]) -> List[str]:
    barcode = str(doc.get("cms_barcode", "")).strip() or str(doc.get("Barcode", "")).strip()
    if not barcode:
        return []
    return resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL)


def evaluate_catalog_quality(doc: Dict[str, Any]) -> Dict[str, Any]:
    hosted_urls = _hosted_image_urls(doc)
    has_hosted_image = bool(hosted_urls)
    has_any_image = bool(has_hosted_image or str(doc.get("Img_src", "")).strip() or _first_text(doc.get("Image_url")))
    has_title = _title_present(doc)
    has_description = _description_present(doc)
    has_text = bool(has_title and has_description)
    has_category = _category_present(doc)

    missing_requirements: List[str] = []
    if not has_any_image:
        missing_requirements.append("missing_any_image")
    if not has_text:
        missing_requirements.append("missing_text")
    if not has_category:
        missing_requirements.append("missing_category")
    public_image_enabled = has_hosted_image
    image_visibility = "hosted" if has_hosted_image else ("disabled_external" if has_any_image else "missing")

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
        "missing_requirements": missing_requirements,
        "quality_state": quality_state,
        "review_required": review_required,
        "ready_for_activation": ready_for_activation,
        "recommended_status": reviewed_status,
        "quality_managed_status": quality_managed_status,
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
        "catalog_missing_requirements": evaluation["missing_requirements"],
        "catalog_quality_state": evaluation["quality_state"],
        "catalog_review_required": evaluation["review_required"],
        "catalog_ready_for_activation": evaluation["ready_for_activation"],
        "catalog_quality_managed_status": evaluation["quality_managed_status"],
        "catalog_last_evaluated_at": _utcnow_iso(),
        "catalog_last_evaluated_by": evaluator,
        "cms_status": evaluation["recommended_status"],
    }

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
