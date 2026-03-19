from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, Optional


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def utcnow_iso() -> str:
    return utcnow().isoformat()


def parse_datetime(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc)
    if isinstance(value, str) and value.strip():
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return None
    return None


def serialize_datetime(value: Any) -> str:
    parsed = parse_datetime(value)
    if parsed:
        return parsed.isoformat()
    if isinstance(value, str):
        return value
    return ""


def preview_value(value: Any, max_length: int = 160) -> str:
    if value is None:
        return ""
    if isinstance(value, (dict, list)):
        text = json.dumps(value, ensure_ascii=False, default=str)
    else:
        text = str(value)
    text = text.strip()
    if len(text) <= max_length:
        return text
    return f"{text[: max_length - 1]}..."


def build_item_snapshot(doc: Dict[str, Any], category_name: str = "") -> Dict[str, Any]:
    image_urls = doc.get("Image_url", [])
    if isinstance(image_urls, str):
        image_urls = [image_urls]
    if not isinstance(image_urls, list):
        image_urls = []
    cleaned_urls = [str(url).strip() for url in image_urls if str(url).strip()]
    main_image = (
        str(doc.get("cms_main_image", "")).strip()
        or (cleaned_urls[0] if cleaned_urls else "")
        or str(doc.get("Img_src", "")).strip()
    )
    return {
        "title": str(doc.get("cms_title") or doc.get("Title") or "").strip(),
        "code": str(doc.get("cms_code") or doc.get("Code") or "").strip(),
        "sku": str(doc.get("cms_sku") or doc.get("SKU") or "").strip(),
        "barcode": str(doc.get("cms_barcode") or doc.get("Barcode") or "").strip(),
        "status": str(doc.get("cms_status") or "active").strip() or "active",
        "brand": str(doc.get("cms_brand") or doc.get("Brand") or "").strip(),
        "unit": str(doc.get("cms_unit") or "").strip(),
        "category_id": str(doc.get("cms_category_id") or "").strip(),
        "category_name": category_name,
        "main_image": main_image,
        "image_urls": cleaned_urls or ([main_image] if main_image else []),
    }


async def log_cms_audit_event(
    db,
    *,
    action: str,
    entity_type: str,
    entity_id: str = "",
    user: Optional[Dict[str, Any]] = None,
    metadata: Any = None,
) -> None:
    await db.cms_audit_logs.insert_one(
        {
            "user_id": str(user.get("_id", "")).strip() if user else "",
            "user_email": str(user.get("email", "")).strip() if user else "",
            "user_name": str(user.get("full_name", "")).strip() if user else "",
            "entity_type": entity_type.strip(),
            "entity_id": str(entity_id).strip(),
            "action": action.strip(),
            "metadata": metadata if metadata is not None else {},
            "created_at": utcnow(),
        }
    )


async def queue_notification_event(
    db,
    *,
    event_type: str,
    item_id: str,
    category_id: str = "",
    payload: Optional[Dict[str, Any]] = None,
) -> None:
    await db.cms_notification_events.insert_one(
        {
            "item_id": item_id,
            "category_id": str(category_id).strip(),
            "event_type": event_type.strip(),
            "status": "pending",
            "payload": payload or {},
            "created_at": utcnow(),
            "published_at": None,
        }
    )


def serialize_audit_log(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc.get("_id", "")),
        "user_id": str(doc.get("user_id", "")).strip(),
        "user_email": str(doc.get("user_email", "")).strip(),
        "user_name": str(doc.get("user_name", "")).strip(),
        "entity_type": str(doc.get("entity_type", "")).strip(),
        "entity_id": str(doc.get("entity_id", "")).strip(),
        "action": str(doc.get("action", "")).strip(),
        "metadata": doc.get("metadata") or {},
        "metadata_preview": preview_value(doc.get("metadata"), 180),
        "created_at": serialize_datetime(doc.get("created_at")),
    }


def serialize_notification_event(
    doc: Dict[str, Any], category_lookup: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    payload = doc.get("payload") or {}
    category_id = str(doc.get("category_id", "")).strip()
    category_name = (
        str(payload.get("category_name", "")).strip()
        or (category_lookup or {}).get(category_id, "")
    )
    status = str(doc.get("status", "")).strip() or ("published" if doc.get("published_at") else "pending")
    return {
        "id": str(doc.get("_id", "")),
        "item_id": str(doc.get("item_id", "")).strip(),
        "category_id": category_id,
        "category_name": category_name,
        "event_type": str(doc.get("event_type", "")).strip(),
        "status": status,
        "payload": payload,
        "payload_preview": preview_value(payload, 180),
        "item_title": str(payload.get("title", "")).strip(),
        "item_code": str(payload.get("code", "")).strip(),
        "item_barcode": str(payload.get("barcode", "")).strip(),
        "created_at": serialize_datetime(doc.get("created_at")),
        "published_at": serialize_datetime(doc.get("published_at")),
    }
