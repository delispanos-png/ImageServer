from __future__ import annotations

import html
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlsplit, urlunsplit

import aiohttp
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi import File, Form, UploadFile
from pydantic import BaseModel, Field

from cms_activity import (
    build_item_snapshot,
    log_cms_audit_event,
    preview_value,
    queue_notification_event,
    utcnow,
)
from catalog_quality import build_catalog_quality_updates, evaluate_catalog_quality
from category_lookup import lookup_categories, normalize_barcode
from cms_html import html_to_plain_text, plain_text_to_html, sanitize_html
from cms_permissions import get_current_cms_user, require_cms_permissions
from cms_source_jobs import cancel_source_job, get_source_job_overview, restart_source_job, start_source_job, stop_source_job
from image_paths import (
    barcode_image_dir,
    ensure_barcode_image_dir,
    IMAGE_EXTENSIONS,
    legacy_image_path,
    public_url_for_image_path,
    resolve_local_image_paths,
    resolve_public_image_urls,
)
from source_locks import MANUAL_UPLOAD_LOCK_SOURCE, MANUAL_UPLOAD_PROCESSING_VERSION, normalize_source_name


IMAGE_FILES_BASE_DIR = "/app/images"
IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")
CATALOG_REFRESH_REQUEST_PATH = Path(os.getenv("CATALOG_REFRESH_REQUEST_PATH", "/app/catalog_refresh_request.json"))
CATALOG_REFRESH_SOURCE_KEY = "catalog_refresh"
CATALOG_REFRESH_JOB_KEY = "bulk_refresh"
SUPPORTED_MANUAL_REFRESH_SOURCES = {"farmakopoiosmou", "pharmacy295", "youpharmacy", "gohealthy", "cure4u", "kpdhellas", "vita4you", "tofarmakeiomou"}


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _should_queue_for_review(status_value: Any, quality: Dict[str, Any]) -> bool:
    return str(status_value or "").strip().lower() != "active" and not bool(quality.get("missing_requirements"))


def _slugify(value: str) -> str:
    value = (value or "").strip().lower()
    allowed = []
    last_dash = False
    for char in value:
        if char.isalnum():
            allowed.append(char)
            last_dash = False
        elif char in {" ", "-", "_", "/"}:
            if not last_dash:
                allowed.append("-")
                last_dash = True
    slug = "".join(allowed).strip("-")
    return slug or "untitled"


def _first_text(value: Any) -> str:
    if isinstance(value, list):
        for item in value:
            if isinstance(item, str) and item.strip():
                return item.strip()
        return ""
    if isinstance(value, str):
        return value.strip()
    return ""


def _ensure_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except Exception as exc:  # pragma: no cover - defensive branch
        raise HTTPException(status_code=404, detail="Record not found") from exc


def _has_stored_source_payload(doc: Dict[str, Any]) -> bool:
    if not isinstance(doc, dict):
        return False
    if _first_text(doc.get("Title")):
        return True
    if _first_text(doc.get("Description")):
        return True
    if _first_text(doc.get("Brand")):
        return True
    if _first_text(doc.get("Product_Link")):
        return True
    if _first_text(doc.get("Img_src")):
        return True
    image_url_list = doc.get("Img_src_List", [])
    if isinstance(image_url_list, list) and any(_first_text(item) for item in image_url_list):
        return True
    if _first_text(doc.get("Image_Path")):
        return True
    image_path_list = doc.get("Image_Path_Collection", [])
    if isinstance(image_path_list, list) and any(_first_text(item) for item in image_path_list):
        return True
    if _first_text(doc.get("Category_1")) or _first_text(doc.get("Category_2")) or _first_text(doc.get("Category_3")):
        return True
    return False


def _normalize_stored_source_doc(source_name: str, barcode: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    doc = dict(payload)
    doc["Site"] = source_name
    doc["Barcode"] = barcode
    return doc


def _build_manual_refresh_stored_fallback(existing: Dict[str, Any], barcode: str) -> Dict[str, Any]:
    primary_source_name = normalize_source_name(
        existing.get("Site", ""),
        existing.get("last_source", ""),
        existing.get("Product_Link", ""),
        existing.get("Img_src", ""),
    )
    if primary_source_name and _has_stored_source_payload(existing):
        return _normalize_stored_source_doc(primary_source_name, barcode, existing)

    other_sites = existing.get("Other_Sites", {})
    if not isinstance(other_sites, dict):
        return {}

    preferred_order = [
        "pharmacy295",
        "tofarmakeiomou",
        "youpharmacy",
        "gohealthy",
        "cure4u",
        "kpdhellas",
        "vita4you",
        "farmakopoiosmou",
        "skroutz",
        "pharm16",
        "boxpharmacy",
    ]
    normalized_snapshots: Dict[str, Dict[str, Any]] = {}
    for raw_name, payload in other_sites.items():
        normalized_name = normalize_source_name(raw_name)
        if not normalized_name or not isinstance(payload, dict):
            continue
        if not _has_stored_source_payload(payload):
            continue
        normalized_snapshots.setdefault(normalized_name, dict(payload))

    for source_name in preferred_order:
        payload = normalized_snapshots.get(source_name)
        if payload:
            return _normalize_stored_source_doc(source_name, barcode, payload)

    for source_name, payload in normalized_snapshots.items():
        return _normalize_stored_source_doc(source_name, barcode, payload)

    return {}


class CategoryPayload(BaseModel):
    parent_id: Optional[str] = None
    name: str = Field(min_length=1, max_length=255)
    slug: Optional[str] = Field(default=None, max_length=255)
    description: str = ""
    is_active: bool = True


class ItemPayload(BaseModel):
    category_id: Optional[str] = None
    title: str = Field(min_length=1, max_length=255)
    slug: Optional[str] = Field(default=None, max_length=255)
    code: str = ""
    sku: str = ""
    barcode: str = ""
    description: str = ""
    description_html: str = ""
    brand: str = ""
    unit: str = ""
    status: str = Field(default="active", pattern="^(active|inactive)$")
    main_image: str = ""


class ItemSourceRefreshPayload(BaseModel):
    barcode: Optional[str] = Field(default=None, max_length=64)
    source_key: Optional[str] = Field(default=None, max_length=64)
    text_source_key: Optional[str] = Field(default=None, max_length=64)
    image_source_key: Optional[str] = Field(default=None, max_length=64)
    category_source_key: Optional[str] = Field(default=None, max_length=64)


class BulkCatalogRefreshPayload(BaseModel):
    search: str = Field(default="", max_length=120)
    status_filter: str = Field(default="all", pattern="^(all|active|inactive)$")
    quality_state_filter: str = Field(default="all", pattern="^(all|ready|needs_fix|ready_for_review)$")
    missing_requirement: str = Field(default="all", pattern="^(all|missing_any_image|missing_text|missing_category)$")
    photo_source_filter: str = Field(default="all", pattern="^(all|youpharmacy_xml|pharmacy295_excel)$")
    category_1: Optional[str] = Field(default=None, max_length=255)
    category_2: Optional[str] = Field(default=None, max_length=255)
    category_3: Optional[str] = Field(default=None, max_length=255)
    source_key: Optional[str] = Field(default=None, max_length=64)
    text_source_key: Optional[str] = Field(default=None, max_length=64)
    image_source_key: Optional[str] = Field(default=None, max_length=64)
    category_source_key: Optional[str] = Field(default=None, max_length=64)
    limit: int = Field(default=250, ge=1, le=5000)


class ManualImageImportUrlPayload(BaseModel):
    image_url: str = Field(default="", max_length=2000)
    source_page_url: str = Field(default="", max_length=2000)
    replace_existing: bool = False
    set_uploaded_as_main: bool = True


def _normalize_manual_source_key(value: Any) -> str:
    return normalize_source_name(value or "")


def _resolve_manual_source_selection(
    *,
    source_key: Any = "",
    text_source_key: Any = "",
    image_source_key: Any = "",
    category_source_key: Any = "",
) -> Dict[str, Any]:
    shared_source_key = _normalize_manual_source_key(source_key)
    resolved = {
        "shared_source_key": shared_source_key,
        "text_source_key": _normalize_manual_source_key(text_source_key) or shared_source_key,
        "image_source_key": _normalize_manual_source_key(image_source_key) or shared_source_key,
        "category_source_key": _normalize_manual_source_key(category_source_key) or shared_source_key,
    }
    for label, key in resolved.items():
        if label == "shared_source_key":
            continue
        if key and key not in SUPPORTED_MANUAL_REFRESH_SOURCES:
            raise HTTPException(status_code=422, detail=f"Unsupported source override: {key}")
    resolved["force_source_names"] = {
        key
        for key in {
            resolved["shared_source_key"],
            resolved["text_source_key"],
            resolved["image_source_key"],
            resolved["category_source_key"],
        }
        if key
    }
    return resolved


def _build_item_list_query(
    *,
    search: str = "",
    status_filter: str = "all",
    quality_state_filter: str = "all",
    missing_requirement: str = "all",
    photo_source_filter: str = "all",
    category_id: Optional[str] = None,
    category_filter: Optional[str] = None,
    category_1: Optional[str] = None,
    category_2: Optional[str] = None,
    category_3: Optional[str] = None,
) -> Dict[str, Any]:
    query: Dict[str, Any] = {}
    if status_filter != "all":
        query["cms_status"] = status_filter
    if quality_state_filter != "all":
        query["catalog_quality_state"] = quality_state_filter
    if missing_requirement != "all":
        if missing_requirement == "missing_any_image":
            query["catalog_public_image_enabled"] = False
        elif missing_requirement == "missing_text":
            query["catalog_has_text"] = False
        elif missing_requirement == "missing_category":
            query["catalog_has_category"] = False
    if photo_source_filter != "all":
        query["photo_source_lock"] = photo_source_filter
    if category_filter:
        query.update(_build_item_category_filter_query(category_filter))
    elif category_id:
        query["cms_category_id"] = category_id
    if category_1:
        query["Category_1"] = category_1
    if category_2:
        query["Category_2"] = category_2
    if category_3:
        query["Category_3"] = category_3
    if search.strip():
        pattern = {"$regex": search.strip(), "$options": "i"}
        query["$or"] = [
            {"cms_title": pattern},
            {"Title": pattern},
            {"cms_code": pattern},
            {"Code": pattern},
            {"cms_sku": pattern},
            {"SKU": pattern},
            {"cms_barcode": pattern},
            {"Barcode": pattern},
            {"cms_brand": pattern},
            {"Brand": pattern},
        ]
    return query


def _category_slug_from_path(parts: List[str]) -> str:
    return _slugify(" ".join(parts))


def _build_category_doc_lookup(docs: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    return {str(doc["_id"]): doc for doc in docs}


def _resolve_category_path(doc: Dict[str, Any], lookup: Dict[str, Dict[str, Any]]) -> List[str]:
    path: List[str] = []
    visited: set[str] = set()
    current = doc
    while current:
        current_id = str(current["_id"])
        if current_id in visited:
            break
        visited.add(current_id)
        name = str(current.get("name", "")).strip()
        if name:
            path.insert(0, name)
        parent_id = current.get("parent_id")
        current = lookup.get(str(parent_id)) if parent_id else None
    return path


def _serialize_category(doc: Dict[str, Any], lookup: Dict[str, Dict[str, Any]], items_count: int = 0) -> Dict[str, Any]:
    path = _resolve_category_path(doc, lookup)
    return {
        "id": str(doc["_id"]),
        "parent_id": str(doc["parent_id"]) if doc.get("parent_id") else None,
        "name": doc.get("name", ""),
        "slug": doc.get("slug", ""),
        "description": doc.get("description", ""),
        "is_active": bool(doc.get("is_active", True)),
        "level": len(path) or 1,
        "path": path,
        "category_1": path[0] if len(path) > 0 else "",
        "category_2": path[1] if len(path) > 1 else "",
        "category_3": path[2] if len(path) > 2 else "",
        "items_count": items_count,
        "created_by": doc.get("created_by", ""),
        "updated_by": doc.get("updated_by", ""),
        "created_at": doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", ""),
    }


def _extract_fallback_category_parts(doc: Dict[str, Any]) -> List[str]:
    return [
        part
        for part in (
            str(doc.get("Category_1", "")).strip(),
            str(doc.get("Category_2", "")).strip(),
            str(doc.get("Category_3", "")).strip(),
        )
        if part
    ]


def _extract_category_levels(doc: Dict[str, Any]) -> Tuple[str, str, str]:
    return (
        str(doc.get("Category_1", "")).strip(),
        str(doc.get("Category_2", "")).strip(),
        str(doc.get("Category_3", "")).strip(),
    )


def _build_item_filter_category(doc: Dict[str, Any], category_lookup: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    fallback_parts = _extract_fallback_category_parts(doc)
    category_id = str(doc.get("cms_category_id", "")).strip()
    category = category_lookup.get(category_id)

    if fallback_parts:
        return {
            "key": f"path:{'|||'.join(fallback_parts)}",
            "label": " / ".join(fallback_parts),
            "path": fallback_parts,
        }

    if category_id and category:
        return {
            "key": f"cms:{category_id}",
            "label": category.get("name", ""),
            "path": [category.get("name", "")] if category.get("name") else [],
        }

    return {"key": "uncategorized", "label": "Uncategorized", "path": []}


def _build_item_category_filter_query(category_filter: str) -> Dict[str, Any]:
    if not category_filter:
        return {}

    if category_filter == "uncategorized":
        return {
            "$and": [
                {"$or": [{"cms_category_id": {"$exists": False}}, {"cms_category_id": ""}, {"cms_category_id": None}]},
                {"$or": [{"Category_1": {"$exists": False}}, {"Category_1": ""}, {"Category_1": None}]},
                {"$or": [{"Category_2": {"$exists": False}}, {"Category_2": ""}, {"Category_2": None}]},
                {"$or": [{"Category_3": {"$exists": False}}, {"Category_3": ""}, {"Category_3": None}]},
            ]
        }

    if category_filter.startswith("cms:"):
        return {"cms_category_id": category_filter.split(":", 1)[1]}

    if category_filter.startswith("path:"):
        raw_parts = category_filter.split(":", 1)[1]
        parts = [part.strip() for part in raw_parts.split("|||") if part.strip()]
        if not parts:
            return {}

        conditions: List[Dict[str, Any]] = []
        fields = ["Category_1", "Category_2", "Category_3"]
        for index, field in enumerate(fields):
            if index < len(parts):
                conditions.append({field: parts[index]})
            else:
                conditions.append({"$or": [{field: {"$exists": False}}, {field: ""}, {field: None}]})
        return {"$and": conditions}

    return {}


async def _resolve_category_selection(
    db, category_object_id: Optional[ObjectId]
) -> Tuple[Optional[Dict[str, Any]], Dict[str, Dict[str, Any]], List[str]]:
    docs = await db.cms_categories.find({}).to_list(length=None)
    lookup = _build_category_doc_lookup(docs)
    if not category_object_id:
        return None, lookup, []

    selected = lookup.get(str(category_object_id))
    if not selected:
        raise HTTPException(status_code=404, detail="Category not found")

    return selected, lookup, _resolve_category_path(selected, lookup)


def _map_product_to_cms_item(
    doc: Dict[str, Any],
    category_lookup: Dict[str, Dict[str, Any]],
    *,
    cache_buster: str = "",
) -> Dict[str, Any]:
    quality = evaluate_catalog_quality(doc)
    category_id = str(doc.get("cms_category_id", "")).strip()
    category = category_lookup.get(category_id)
    legacy_title = _first_text(doc.get("Title"))
    legacy_description = _first_text(doc.get("Description"))

    title = str(doc.get("cms_title", "")).strip() or legacy_title
    code = str(doc.get("cms_code", "")).strip() or str(doc.get("Code", "")).strip() or str(doc.get("Barcode", "")).strip()
    sku = str(doc.get("cms_sku", "")).strip() or str(doc.get("SKU", "")).strip()
    barcode = str(doc.get("cms_barcode", "")).strip() or str(doc.get("Barcode", "")).strip()
    hosted_image_urls = _resolve_versioned_hosted_image_urls(barcode) if barcode else []
    legacy_main_image = _first_text(doc.get("Image_url")) or str(doc.get("Img_src", "")).strip()
    description = str(doc.get("cms_description", "")).strip() or legacy_description
    description_html = (
        str(doc.get("cms_description_html", "")).strip()
        or plain_text_to_html(description)
    )
    brand = str(doc.get("cms_brand", "")).strip() or str(doc.get("Brand", "")).strip()
    unit = str(doc.get("cms_unit", "")).strip()
    explicit_main_image = str(doc.get("cms_main_image", "")).strip()
    visible_explicit_main_image = explicit_main_image if explicit_main_image.startswith(IMAGE_PUBLIC_BASE_URL) else ""
    visible_legacy_main_image = legacy_main_image if str(legacy_main_image).startswith(IMAGE_PUBLIC_BASE_URL) else ""
    if hosted_image_urls:
        matched_explicit_main = _match_versioned_hosted_url(visible_explicit_main_image, hosted_image_urls)
        if matched_explicit_main:
            main_image = matched_explicit_main
        else:
            main_image = hosted_image_urls[0]
    else:
        main_image = visible_explicit_main_image or visible_legacy_main_image
    slug = str(doc.get("cms_slug", "")).strip() or _slugify(title or code or barcode)
    status = str(doc.get("cms_status", "")).strip() or "active"

    fallback_parts = _extract_fallback_category_parts(doc)
    category_1, category_2, category_3 = _extract_category_levels(doc)
    if not category:
        category_path = fallback_parts
        category_name = " / ".join(fallback_parts)
    else:
        category_path = fallback_parts or [category.get("name", "")]
        category_path = [part for part in category_path if part]
        category_name = " / ".join(category_path) or category.get("name", "")

    raw_image_urls = doc.get("Image_url", [])
    if isinstance(raw_image_urls, str):
        raw_image_urls = [raw_image_urls]
    if not isinstance(raw_image_urls, list):
        raw_image_urls = []
    if hosted_image_urls:
        image_urls = hosted_image_urls
    else:
        image_urls = [
            str(url).strip()
            for url in raw_image_urls
            if str(url).strip().startswith(IMAGE_PUBLIC_BASE_URL)
        ]
    matched_explicit_main = _match_versioned_hosted_url(visible_explicit_main_image, hosted_image_urls)
    if matched_explicit_main and matched_explicit_main not in image_urls:
        image_urls = [matched_explicit_main, *image_urls]
    if not image_urls and visible_legacy_main_image:
        image_urls = [visible_legacy_main_image]
    if cache_buster:
        if main_image:
            main_image = _append_cache_buster(main_image, cache_buster)
        image_urls = [_append_cache_buster(url, cache_buster) for url in image_urls]

    return {
        "id": str(doc["_id"]),
        "title": title,
        "slug": slug,
        "code": code,
        "sku": sku,
        "barcode": barcode,
        "description": description,
        "description_html": description_html,
        "brand": brand,
        "unit": unit,
        "status": status,
        "main_image": main_image,
        "image_urls": image_urls,
        "category_id": category_id or None,
        "category_name": category_name,
        "category_path": category_path,
        "category_1": category_1,
        "category_2": category_2,
        "category_3": category_3,
        "created_by": doc.get("cms_created_by", ""),
        "updated_by": doc.get("cms_updated_by", ""),
        "created_at": doc.get("cms_created_at", "") or doc.get("created_at", ""),
        "updated_at": doc.get("cms_updated_at", "") or doc.get("last_updated_at", "") or doc.get("updated_at", ""),
        "catalog_quality_state": str(doc.get("catalog_quality_state", "")).strip() or quality["quality_state"],
        "catalog_missing_requirements": list(doc.get("catalog_missing_requirements") or quality["missing_requirements"]),
        "catalog_ready_for_activation": bool(doc.get("catalog_ready_for_activation", quality["ready_for_activation"])),
        "catalog_review_required": bool(doc.get("catalog_review_required", quality["review_required"])),
        "catalog_reviewed_at": str(doc.get("catalog_reviewed_at", "")).strip(),
        "catalog_reviewed_by": str(doc.get("catalog_reviewed_by", "")).strip(),
        "catalog_has_hosted_image": bool(doc.get("catalog_has_hosted_image", quality["has_hosted_image"])),
        "catalog_has_any_image": bool(doc.get("catalog_has_any_image", quality["has_any_image"])),
        "catalog_has_text": bool(doc.get("catalog_has_text", quality["has_text"])),
        "catalog_has_category": bool(doc.get("catalog_has_category", quality["has_category"])),
        "catalog_public_image_enabled": bool(doc.get("catalog_public_image_enabled", quality["public_image_enabled"])),
        "catalog_image_visibility": str(doc.get("catalog_image_visibility", "")).strip() or quality["image_visibility"],
        "photo_source_locked": bool(doc.get("photo_source_locked", False)),
        "photo_source_lock": str(doc.get("photo_source_lock", "")).strip(),
        "image_source_domain": str(doc.get("image_source_domain", "")).strip(),
        "text_source_domain": str(doc.get("text_source_domain", "")).strip(),
        "category_source_domain": str(doc.get("category_source_domain", "")).strip(),
        "category_resolution_source": str(doc.get("category_resolution_source", "")).strip(),
    }


async def _load_category_lookup(db) -> Dict[str, Dict[str, Any]]:
    docs = await db.cms_categories.find({}).to_list(length=None)
    lookup = _build_category_doc_lookup(docs)
    return {str(doc["_id"]): _serialize_category(doc, lookup) for doc in docs}


async def _sync_categories_from_product_taxonomy(db) -> None:
    product_rows = await db.products.find(
        {},
        {"_id": 0, "Category_1": 1, "Category_2": 1, "Category_3": 1},
    ).to_list(length=None)

    unique_paths = {
        tuple(part for part in _extract_fallback_category_parts(row) if part)
        for row in product_rows
        if _extract_fallback_category_parts(row)
    }
    if not unique_paths:
        return

    docs = await db.cms_categories.find({}).to_list(length=None)
    lookup = _build_category_doc_lookup(docs)
    by_parent_and_name = {
        (str(doc.get("parent_id")) if doc.get("parent_id") else None, str(doc.get("name", "")).strip().lower()): doc
        for doc in docs
    }

    now = _utcnow()
    for path in sorted(unique_paths):
        parent_doc: Optional[Dict[str, Any]] = None
        path_accumulator: List[str] = []
        for part in path:
            path_accumulator.append(part)
            parent_key = str(parent_doc["_id"]) if parent_doc else None
            cache_key = (parent_key, part.strip().lower())
            current = by_parent_and_name.get(cache_key)
            if not current:
                document = {
                    "parent_id": parent_doc["_id"] if parent_doc else None,
                    "name": part.strip(),
                    "slug": _category_slug_from_path(path_accumulator),
                    "description": "",
                    "is_active": True,
                    "created_by": "system:taxonomy_sync",
                    "updated_by": "system:taxonomy_sync",
                    "created_at": now,
                    "updated_at": now,
                }
                result = await db.cms_categories.insert_one(document)
                document["_id"] = result.inserted_id
                current = document
                lookup[str(document["_id"])] = document
                by_parent_and_name[cache_key] = document
            parent_doc = current


async def sync_cms_taxonomy_from_products(db) -> None:
    await _sync_categories_from_product_taxonomy(db)


def _normalize_category_path(parts: List[str]) -> List[str]:
    normalized: List[str] = []
    for part in parts:
        value = str(part or "").strip()
        if not value or value in normalized:
            continue
        normalized.append(value)
    return normalized[:3]


def _extract_source_category_path(source_doc: Dict[str, Any]) -> List[str]:
    return _normalize_category_path(
        [
            source_doc.get("Category_1", ""),
            source_doc.get("Category_2", ""),
            source_doc.get("Category_3", ""),
        ]
    )


def _extract_barcode_lookup_category_path(barcode: str) -> List[str]:
    category_row = lookup_categories(barcode)
    if not category_row:
        return []
    return _normalize_category_path(
        [
            category_row.category_1,
            category_row.category_2,
            category_row.category_3,
        ]
    )


def _extract_existing_category_path(existing: Dict[str, Any]) -> List[str]:
    return _normalize_category_path(
        [
            existing.get("Category_1", ""),
            existing.get("Category_2", ""),
            existing.get("Category_3", ""),
        ]
    )


def _resolve_refresh_category_path(
    *,
    barcode: str,
    existing: Dict[str, Any],
    source_doc: Dict[str, Any],
) -> Tuple[List[str], str]:
    barcode_lookup_path = _extract_barcode_lookup_category_path(barcode)
    if barcode_lookup_path:
        return barcode_lookup_path, "barcode_lookup"

    source_category_path = _extract_source_category_path(source_doc)
    if source_category_path:
        return source_category_path, "source"

    existing_category_path = _extract_existing_category_path(existing)
    if existing_category_path:
        return existing_category_path, "existing"

    return [], "none"


def _normalize_image_url_list(value: Any) -> List[str]:
    if isinstance(value, str):
        value = [value]
    if not isinstance(value, list):
        return []
    return [str(url).strip() for url in value if str(url).strip()]


def _strip_url_query(url: str) -> str:
    return str(url or "").split("?", 1)[0].strip()


def _append_cache_buster(url: str, cache_buster: str) -> str:
    normalized = str(url or "").strip()
    if not normalized or not cache_buster:
        return normalized
    parsed = urlsplit(normalized)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query["_preview"] = cache_buster
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, urlencode(query), parsed.fragment))


def _resolve_versioned_hosted_image_urls(barcode: str) -> List[str]:
    barcode = normalize_barcode(barcode)
    if not barcode:
        return []

    urls: List[str] = []
    for image_path in resolve_local_image_paths(IMAGE_FILES_BASE_DIR, barcode):
        base_url = public_url_for_image_path(barcode, image_path, IMAGE_PUBLIC_BASE_URL)
        try:
            version = int(image_path.stat().st_mtime_ns)
        except Exception:
            version = 0
        urls.append(f"{base_url}?v={version}" if version else base_url)
    return urls


def _match_versioned_hosted_url(candidate: str, hosted_urls: List[str]) -> str:
    candidate_base = _strip_url_query(candidate)
    if not candidate_base:
        return ""
    for hosted_url in hosted_urls:
        if _strip_url_query(hosted_url) == candidate_base:
            return hosted_url
    return ""


def _hosted_image_path_from_url(barcode: str, image_url: str) -> Optional[Path]:
    barcode = normalize_barcode(barcode)
    image_url = str(image_url or "").strip()
    if not barcode or not image_url:
        return None

    public_path_prefix = urlparse(IMAGE_PUBLIC_BASE_URL).path.rstrip("/")
    parsed = urlparse(image_url)
    request_path = parsed.path.rstrip("/")
    if not request_path.startswith(public_path_prefix):
        return None

    relative = request_path[len(public_path_prefix):].lstrip("/")
    legacy_name = f"{barcode}.jpg"
    if relative == legacy_name:
        return legacy_image_path(IMAGE_FILES_BASE_DIR, barcode)
    if relative.startswith(f"{barcode}/"):
        filename = relative.split("/", 1)[1].strip()
        if not filename:
            return None
        return barcode_image_dir(IMAGE_FILES_BASE_DIR, barcode) / filename
    return None


def _manual_upload_extension(upload: UploadFile) -> str:
    filename = str(getattr(upload, "filename", "") or "").strip().lower()
    suffix = Path(filename).suffix.lower()
    if suffix in IMAGE_EXTENSIONS:
        return suffix

    content_type = str(getattr(upload, "content_type", "") or "").lower()
    if content_type in {"image/jpeg", "image/jpg"}:
        return ".jpg"
    if content_type == "image/png":
        return ".png"
    if content_type == "image/webp":
        return ".webp"
    raise HTTPException(status_code=422, detail=f"Unsupported image file type for {filename or 'upload'}")


def _validate_remote_image_url(raw_url: str, *, field_name: str) -> str:
    normalized = str(raw_url or "").strip()
    if not normalized:
        raise HTTPException(status_code=422, detail=f"{field_name} is required")
    parsed = urlsplit(normalized)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise HTTPException(status_code=422, detail=f"{field_name} must be a valid http(s) URL")
    return normalized


def _normalize_import_candidate_url(raw_url: str, page_url: str = "") -> str:
    candidate = html.unescape(str(raw_url or "").strip())
    if not candidate:
        return ""
    if candidate.startswith("//"):
        candidate = f"https:{candidate}"
    elif candidate.startswith("/"):
        candidate = urljoin(page_url, candidate)
    parsed = urlsplit(candidate)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return ""
    return candidate


def _is_google_search_url(candidate_url: str) -> bool:
    parsed = urlsplit(str(candidate_url or "").strip())
    host = parsed.netloc.lower()
    path = parsed.path.lower()
    query = parsed.query.lower()
    if "google." not in host:
        return False
    return path.startswith("/search") or "tbm=isch" in query


def _is_probable_product_image_url(candidate_url: str) -> bool:
    lower = str(candidate_url or "").lower()
    if not lower:
        return False
    if any(token in lower for token in ["/logo", "logo.", "sprite", "icon.", "favicon", "placeholder", "avatar", "banner", "payment", "flag", "theme/"]):
        return False
    if any(ext in lower for ext in [".jpg", ".jpeg", ".png", ".webp", ".avif"]):
        return True
    if any(token in lower for token in ["/media/", "/uploads/", "/product", "/products/", "/catalog/", "/image/", "/images/"]):
        return True
    return False


def _extract_remote_image_candidates_from_page_html(page_html: str, page_url: str) -> list[str]:
    html_text = page_html or ""
    if not html_text:
        return []

    candidates: list[str] = []
    seen: set[str] = set()

    def add(raw_value: str) -> None:
        normalized = _normalize_import_candidate_url(raw_value, page_url)
        if not normalized or normalized in seen:
            return
        if not _is_probable_product_image_url(normalized):
            return
        seen.add(normalized)
        candidates.append(normalized)

    ordered_patterns = [
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<meta[^>]+itemprop=["\']image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<link[^>]+rel=["\']image_src["\'][^>]+href=["\']([^"\']+)["\']',
        r'"image"\s*:\s*"([^"]+)"',
        r'"image"\s*:\s*\[\s*"([^"]+)"',
        r'data-src=["\']([^"\']+)["\']',
        r'data-large-image=["\']([^"\']+)["\']',
        r'data-zoom-image=["\']([^"\']+)["\']',
        r'<img[^>]+src=["\']([^"\']+)["\']',
    ]
    for pattern in ordered_patterns:
        for match in re.finditer(pattern, html_text, flags=re.I):
            raw_value = match.group(1).strip()
            if not raw_value:
                continue
            if "srcset" in pattern and " " in raw_value:
                raw_value = raw_value.split(" ", 1)[0]
            add(raw_value)
            if len(candidates) >= 12:
                return candidates
    return candidates


async def _write_manual_uploaded_images(
    *,
    barcode: str,
    uploads: List[UploadFile],
    replace_existing: bool,
) -> List[Path]:
    barcode = normalize_barcode(barcode)
    if not barcode:
        raise HTTPException(status_code=422, detail="Barcode is required before uploading hosted images")

    existing_paths = resolve_local_image_paths(IMAGE_FILES_BASE_DIR, barcode)
    if replace_existing:
        for path in existing_paths:
            try:
                if path.exists() and path.is_file():
                    path.unlink()
            except FileNotFoundError:
                pass
        existing_paths = []

    image_dir = ensure_barcode_image_dir(IMAGE_FILES_BASE_DIR, barcode)
    next_index = len(existing_paths) + 1
    written_paths: List[Path] = []

    for upload in uploads:
        extension = _manual_upload_extension(upload)
        target_path = image_dir / f"{next_index}{extension}"
        contents = await upload.read()
        if not contents:
            raise HTTPException(status_code=422, detail=f"Uploaded file {upload.filename or next_index} is empty")
        target_path.write_bytes(contents)
        written_paths.append(target_path)
        next_index += 1

    return written_paths


async def _write_manual_image_from_remote_url(
    *,
    barcode: str,
    image_url: str,
    replace_existing: bool,
    referer_url: str = "",
) -> Path:
    from skroutzFetch import _prepare_image_bytes_for_storage

    barcode = normalize_barcode(barcode)
    if not barcode:
        raise HTTPException(status_code=422, detail="Barcode is required before importing hosted images")

    validated_referer = _validate_remote_image_url(referer_url, field_name="Source page URL") if str(referer_url or "").strip() else ""
    validated_image_url = str(image_url or "").strip()
    if validated_image_url:
        validated_image_url = _validate_remote_image_url(validated_image_url, field_name="Image URL")
        if _is_google_search_url(validated_image_url):
            raise HTTPException(
                status_code=422,
                detail="The Google search results URL is not a direct image URL. Open Google Images, then paste the origin image URL or use the source page URL field.",
            )
    elif validated_referer:
        if _is_google_search_url(validated_referer):
            raise HTTPException(
                status_code=422,
                detail="Use the product page from the origin site, not the Google search results URL, in the source page field.",
            )
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
        }
        timeout = aiohttp.ClientTimeout(total=25)
        try:
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(validated_referer, headers=headers, allow_redirects=True) as response:
                    if response.status != 200:
                        raise HTTPException(status_code=422, detail=f"Source page fetch failed with status {response.status}")
                    page_html = await response.text()
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"Failed to fetch source page: {exc}") from exc

        image_candidates = _extract_remote_image_candidates_from_page_html(page_html, validated_referer)
        if not image_candidates:
            raise HTTPException(status_code=422, detail="No usable image candidate was found on the source page")
        validated_image_url = image_candidates[0]
    else:
        raise HTTPException(status_code=422, detail="Image URL or Source page URL is required")

    existing_paths = resolve_local_image_paths(IMAGE_FILES_BASE_DIR, barcode)
    if replace_existing:
        for path in existing_paths:
            try:
                if path.exists() and path.is_file():
                    path.unlink()
            except FileNotFoundError:
                pass
        existing_paths = []

    image_dir = ensure_barcode_image_dir(IMAGE_FILES_BASE_DIR, barcode)
    next_index = len(existing_paths) + 1
    target_path = image_dir / f"{next_index}.jpg"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
    }
    if validated_referer:
        headers["Referer"] = validated_referer

    timeout = aiohttp.ClientTimeout(total=25)
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(validated_image_url, headers=headers, allow_redirects=True) as response:
                if response.status != 200:
                    raise HTTPException(status_code=422, detail=f"Remote image download failed with status {response.status}")
                content_type = str(response.headers.get("Content-Type", "") or "").lower()
                if content_type and not content_type.startswith("image/"):
                    raise HTTPException(
                        status_code=422,
                        detail="The provided image URL does not point directly to an image file. Paste the origin image URL or use the source page URL field for auto-extract.",
                    )
                content = await response.read()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to download remote image: {exc}") from exc

    if not content:
        raise HTTPException(status_code=422, detail="Remote image response was empty")

    try:
        prepared = _prepare_image_bytes_for_storage(content, "manual_upload")
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="The imported content is not a valid raster image. Paste a direct image file URL or use the source page URL field.",
        ) from exc

    target_path.write_bytes(prepared)
    return target_path


def _prune_empty_barcode_dir(path: Optional[Path]) -> None:
    if not path:
        return
    parent = path.parent
    try:
        if parent.exists() and parent.is_dir() and not any(parent.iterdir()):
            parent.rmdir()
    except OSError:
        pass


async def _ensure_cms_category_path(db, category_path: List[str], updated_by: str) -> Optional[Dict[str, Any]]:
    normalized_path = _normalize_category_path(category_path)
    if not normalized_path:
        return None

    docs = await db.cms_categories.find({}).to_list(length=None)
    by_parent_and_name = {
        (str(doc.get("parent_id")) if doc.get("parent_id") else None, str(doc.get("name", "")).strip().lower()): doc
        for doc in docs
    }

    now = _utcnow()
    parent_doc: Optional[Dict[str, Any]] = None
    path_accumulator: List[str] = []
    for part in normalized_path:
        path_accumulator.append(part)
        parent_key = str(parent_doc["_id"]) if parent_doc else None
        cache_key = (parent_key, part.lower())
        current = by_parent_and_name.get(cache_key)
        if not current:
            document = {
                "parent_id": parent_doc["_id"] if parent_doc else None,
                "name": part,
                "slug": _category_slug_from_path(path_accumulator),
                "description": "",
                "is_active": True,
                "created_by": updated_by or "system:source_refresh",
                "updated_by": updated_by or "system:source_refresh",
                "created_at": now,
                "updated_at": now,
            }
            result = await db.cms_categories.insert_one(document)
            document["_id"] = result.inserted_id
            current = document
            by_parent_and_name[cache_key] = document
        parent_doc = current

    return parent_doc


def _build_source_refresh_document(
    existing: Dict[str, Any],
    source_doc: Dict[str, Any],
    *,
    category_object_id: Optional[str],
    category_path: List[str],
    main_image: str,
    image_urls: List[str],
    text_source_name: str = "",
    category_source_name: str = "",
    category_resolution_source: str = "",
) -> Dict[str, Any]:
    merged = dict(existing)

    source_title = _first_text(source_doc.get("Title"))
    if source_title:
        merged["Title"] = source_title
        merged["cms_title"] = source_title

    source_barcode = str(source_doc.get("Barcode", "")).strip()
    if source_barcode:
        merged["Barcode"] = source_barcode
        merged["cms_barcode"] = source_barcode

    source_brand = str(source_doc.get("Brand", "")).strip()
    if source_brand:
        merged["Brand"] = source_brand
        merged["cms_brand"] = source_brand

    source_description = (
        _first_text(source_doc.get("Description"))
        or _first_text(source_doc.get("fullDesc"))
        or _first_text(source_doc.get("Sml_Title"))
    )
    if source_description:
        description_html = plain_text_to_html(source_description)
        merged["Description"] = source_description
        merged["cms_description"] = source_description
        merged["cms_description_html"] = description_html

    if category_path:
        merged["Category_1"] = category_path[0] if len(category_path) > 0 else ""
        merged["Category_2"] = category_path[1] if len(category_path) > 1 else ""
        merged["Category_3"] = category_path[2] if len(category_path) > 2 else ""
        merged["cms_category_id"] = category_object_id or ""

    # Manual source refresh must replace the visible image state with the current
    # filtered result, otherwise stale bad source URLs survive forever in the item.
    merged["Image_url"] = [str(url).strip() for url in image_urls if str(url).strip()]

    if "Img_src" in source_doc:
        source_main = str(source_doc.get("Img_src", "")).strip()
        if source_main:
            merged["Img_src"] = source_main
        else:
            merged.pop("Img_src", None)

    if "Img_src_List" in source_doc:
        merged["Img_src_List"] = [str(url).strip() for url in source_doc.get("Img_src_List", []) if str(url).strip()]

    merged["cms_main_image"] = str(main_image or "").strip()

    source_link = str(source_doc.get("Product_Link", "")).strip()
    if source_link:
        merged["Product_Link"] = source_link
    source_site = str(source_doc.get("Site", "")).strip()
    if source_site:
        merged["Site"] = source_site
    if text_source_name:
        merged["text_source_domain"] = text_source_name
    if category_source_name:
        merged["category_source_domain"] = category_source_name
    if category_resolution_source:
        merged["category_resolution_source"] = category_resolution_source

    return merged


async def _build_source_refresh_preview(
    db,
    existing: Dict[str, Any],
    *,
    barcode: str,
    updated_by: str,
    source_key: str = "",
    text_source_key: str = "",
    image_source_key: str = "",
    category_source_key: str = "",
) -> Dict[str, Any]:
    from skroutzFetch import (
        _build_source_search_terms,
        fetch_product_with_custom_source_priority,
        fetch_product_with_source_priority,
        invalidate_source_barcode_cache,
        sanitize_source_image_urls,
    )

    selection = _resolve_manual_source_selection(
        source_key=source_key,
        text_source_key=text_source_key,
        image_source_key=image_source_key,
        category_source_key=category_source_key,
    )

    await invalidate_source_barcode_cache(barcode)
    search_terms = _build_source_search_terms(
        barcode,
        existing.get("cms_title") or existing.get("Title") or "",
        existing.get("cms_brand") or existing.get("Brand") or "",
    )

    if selection["force_source_names"]:
        source_doc = await fetch_product_with_custom_source_priority(
            barcode,
            download_images=True,
            replace_existing_images=True,
            search_terms=search_terms,
            text_source_chain=[selection["text_source_key"]] if selection["text_source_key"] else None,
            image_source_chain=[selection["image_source_key"]] if selection["image_source_key"] else None,
            force_source_names=selection["force_source_names"],
        )
    else:
        source_doc = await fetch_product_with_source_priority(
            barcode,
            download_images=True,
            replace_existing_images=True,
            search_terms=search_terms,
        )

    if not source_doc:
        source_doc = _build_manual_refresh_stored_fallback(existing, barcode)
    if not source_doc:
        raise HTTPException(status_code=404, detail=f"No source data found for barcode {barcode}")

    category_source_doc = source_doc
    if selection["category_source_key"]:
        category_source_doc = await fetch_product_with_custom_source_priority(
            barcode,
            download_images=False,
            replace_existing_images=False,
            search_terms=search_terms,
            text_source_chain=[selection["category_source_key"]],
            force_source_names={selection["category_source_key"]},
        ) or source_doc

    resolved_category_path, category_resolution_source = _resolve_refresh_category_path(
        barcode=barcode,
        existing=existing,
        source_doc=category_source_doc,
    )
    category_doc = await _ensure_cms_category_path(db, resolved_category_path, updated_by or "system:source_refresh")
    category_id = str(category_doc["_id"]) if category_doc else ""

    hosted_image_urls = resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL)
    raw_source_image_paths = source_doc.get("Image_Path_Collection") or ([source_doc.get("Image_Path", "")] if source_doc.get("Image_Path") else [])
    if isinstance(raw_source_image_paths, str):
        raw_source_image_paths = [raw_source_image_paths]
    source_image_paths = [str(path).strip() for path in raw_source_image_paths if str(path).strip()]
    has_fresh_hosted_image_set = any(path.startswith("/app/images/") for path in source_image_paths)
    raw_source_image_urls = [
        str(url).strip()
        for url in (source_doc.get("Img_src_List") or ([source_doc.get("Img_src", "")] if source_doc.get("Img_src") else []))
        if str(url).strip()
    ]
    source_name = str(source_doc.get("Site", "")).strip() or "unknown"
    text_source_name = str(source_doc.get("photo_metadata_source", "")).strip() or str(source_doc.get("Site", "")).strip()
    image_source_name = str(source_doc.get("photo_image_source", "")).strip() or str(source_doc.get("Site", "")).strip()
    category_source_name = str(category_source_doc.get("Site", "")).strip() or str(source_doc.get("Site", "")).strip()
    source_image_urls = sanitize_source_image_urls(source_name, barcode, raw_source_image_urls, limit=12)
    source_doc = dict(source_doc)
    if source_image_urls:
        source_doc["Img_src"] = source_image_urls[0]
        source_doc["Img_src_List"] = source_image_urls
    else:
        source_doc.pop("Img_src", None)
        source_doc["Img_src_List"] = []
    if not has_fresh_hosted_image_set:
        hosted_image_urls = []
    image_urls = hosted_image_urls
    main_image = hosted_image_urls[0] if hosted_image_urls else ""

    refreshed_document = _build_source_refresh_document(
        existing,
        source_doc,
        category_object_id=category_id,
        category_path=resolved_category_path,
        main_image=main_image,
        image_urls=image_urls,
        text_source_name=text_source_name,
        category_source_name=category_source_name,
        category_resolution_source=category_resolution_source,
    )
    category_lookup = await _load_category_lookup(db)
    refreshed_item = _map_product_to_cms_item(refreshed_document, category_lookup)

    return {
        "selection": selection,
        "source_doc": source_doc,
        "category_source_doc": category_source_doc,
        "refreshed_document": refreshed_document,
        "refreshed_item": refreshed_item,
        "source_name": source_name,
        "product_link": str(source_doc.get("Product_Link", "")).strip(),
        "text_source_name": text_source_name,
        "image_source_name": image_source_name,
        "category_source_name": category_source_name,
        "category_resolution_source": category_resolution_source,
        "resolved_category_path": resolved_category_path,
        "raw_source_images": len(raw_source_image_urls),
        "filtered_source_images": len(source_image_urls),
        "fresh_hosted_images": len(hosted_image_urls),
        "has_fresh_hosted_image_set": has_fresh_hosted_image_set,
    }


def _build_product_taxonomy_counts(product_rows: List[Dict[str, Any]]) -> Dict[Tuple[str, str, str], int]:
    counts: Dict[Tuple[str, str, str], int] = {}
    for row in product_rows:
        category_1, category_2, category_3 = _extract_category_levels(row)
        if category_1:
            counts[(category_1, "", "")] = counts.get((category_1, "", ""), 0) + 1
        if category_1 and category_2:
            counts[(category_1, category_2, "")] = counts.get((category_1, category_2, ""), 0) + 1
        if category_1 and category_2 and category_3:
            counts[(category_1, category_2, category_3)] = counts.get((category_1, category_2, category_3), 0) + 1
    return counts


def _category_items_count(doc: Dict[str, Any], lookup: Dict[str, Dict[str, Any]], taxonomy_counts: Dict[Tuple[str, str, str], int]) -> int:
    path = _resolve_category_path(doc, lookup)
    key = (
        path[0] if len(path) > 0 else "",
        path[1] if len(path) > 1 else "",
        path[2] if len(path) > 2 else "",
    )
    return taxonomy_counts.get(key, 0)


async def _insert_item_change(
    db,
    *,
    item_id: str,
    change_type: str,
    field_name: str,
    old_value: Any,
    new_value: Any,
    changed_by: str,
) -> None:
    await db.cms_item_changes.insert_one(
        {
            "item_id": item_id,
            "change_type": change_type,
            "field_name": field_name,
            "old_value": old_value,
            "new_value": new_value,
            "changed_by": changed_by,
            "created_at": _utcnow(),
        }
    )


def create_cms_catalog_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/catalog", tags=["cms-catalog"])

    @router.get(
        "/categories",
        dependencies=[Depends(require_cms_permissions("categories.view"))],
    )
    async def list_categories(
        search: str = Query(default="", max_length=120),
        is_active: Optional[bool] = None,
        parent_id: Optional[str] = None,
        category_1: Optional[str] = Query(default=None, max_length=255),
        category_2: Optional[str] = Query(default=None, max_length=255),
        category_3: Optional[str] = Query(default=None, max_length=255),
        page: Optional[int] = Query(default=None, ge=1),
        per_page: Optional[int] = Query(default=None, ge=1, le=100),
        sort_by: str = Query(default="name"),
        sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    ) -> Dict[str, Any]:
        await _sync_categories_from_product_taxonomy(db)

        docs = await db.cms_categories.find({}).sort("name", 1).to_list(length=None)
        lookup = _build_category_doc_lookup(docs)
        product_rows = await db.products.find(
            {},
            {"_id": 0, "Category_1": 1, "Category_2": 1, "Category_3": 1},
        ).to_list(length=None)
        taxonomy_counts = _build_product_taxonomy_counts(product_rows)

        data = []
        search_lower = search.strip().lower()
        for doc in docs:
            serialized = _serialize_category(doc, lookup)
            path_key = (
                serialized.get("category_1", ""),
                serialized.get("category_2", ""),
                serialized.get("category_3", ""),
            )
            serialized["items_count"] = taxonomy_counts.get(path_key, 0)

            if is_active is not None and bool(serialized.get("is_active", True)) != is_active:
                continue
            if parent_id == "root" and serialized.get("parent_id") is not None:
                continue
            if parent_id not in {None, "", "root"} and serialized.get("parent_id") != parent_id:
                continue
            if category_1 and serialized.get("category_1") != category_1:
                continue
            if category_2 and serialized.get("category_2") != category_2:
                continue
            if category_3 and serialized.get("category_3") != category_3:
                continue
            if search_lower:
                haystack = " ".join(
                    [
                        str(serialized.get("name", "")),
                        str(serialized.get("slug", "")),
                        str(serialized.get("description", "")),
                        " / ".join(serialized.get("path", [])),
                    ]
                ).lower()
                if search_lower not in haystack:
                    continue

            data.append(serialized)

        reverse = sort_order == "desc"
        sort_field_map = {
            "name": lambda row: row.get("name", "").lower(),
            "slug": lambda row: row.get("slug", "").lower(),
            "status": lambda row: 1 if row.get("is_active", True) else 0,
            "items_count": lambda row: int(row.get("items_count", 0)),
            "created_at": lambda row: row.get("created_at", ""),
            "updated_at": lambda row: row.get("updated_at", ""),
        }
        sort_key = sort_field_map.get(sort_by, sort_field_map["name"])
        data.sort(key=sort_key, reverse=reverse)

        total = len(data)
        if page is not None and per_page is not None:
            skip = (page - 1) * per_page
            paginated = data[skip : skip + per_page]
            return {
                "success": True,
                "data": paginated,
                "pagination": {
                    "total": total,
                    "page": page,
                    "per_page": per_page,
                    "total_pages": max(1, (total + per_page - 1) // per_page),
                },
            }

        return {"success": True, "data": data, "total": total}

    @router.post(
        "/categories",
        dependencies=[Depends(require_cms_permissions("categories.create"))],
    )
    async def create_category(
        payload: CategoryPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        parent_object_id = _ensure_object_id(payload.parent_id) if payload.parent_id else None
        if parent_object_id and not await db.cms_categories.find_one({"_id": parent_object_id}):
            raise HTTPException(status_code=404, detail="Parent category not found")

        slug = payload.slug.strip() if payload.slug else _slugify(payload.name)
        existing = await db.cms_categories.find_one({"slug": slug})
        if existing:
            raise HTTPException(status_code=409, detail="Category slug already exists")

        now = _utcnow()
        document = {
            "parent_id": parent_object_id,
            "name": payload.name.strip(),
            "slug": slug,
            "description": payload.description.strip(),
            "is_active": payload.is_active,
            "created_by": current_user.get("email", ""),
            "updated_by": current_user.get("email", ""),
            "created_at": now,
            "updated_at": now,
        }
        result = await db.cms_categories.insert_one(document)
        created = await db.cms_categories.find_one({"_id": result.inserted_id})
        await log_cms_audit_event(
            db,
            action="create_category",
            entity_type="category",
            entity_id=str(result.inserted_id),
            user=current_user,
            metadata={"name": document["name"], "slug": document["slug"], "is_active": document["is_active"]},
        )
        lookup = _build_category_doc_lookup(await db.cms_categories.find({}).to_list(length=None))
        taxonomy_counts = _build_product_taxonomy_counts(
            await db.products.find({}, {"_id": 0, "Category_1": 1, "Category_2": 1, "Category_3": 1}).to_list(length=None)
        )
        return {"success": True, "data": _serialize_category(created, lookup, _category_items_count(created, lookup, taxonomy_counts))}

    @router.get(
        "/categories/{category_id}",
        dependencies=[Depends(require_cms_permissions("categories.view"))],
    )
    async def get_category(category_id: str) -> Dict[str, Any]:
        doc = await db.cms_categories.find_one({"_id": _ensure_object_id(category_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Category not found")
        lookup = _build_category_doc_lookup(await db.cms_categories.find({}).to_list(length=None))
        taxonomy_counts = _build_product_taxonomy_counts(
            await db.products.find({}, {"_id": 0, "Category_1": 1, "Category_2": 1, "Category_3": 1}).to_list(length=None)
        )
        return {"success": True, "data": _serialize_category(doc, lookup, _category_items_count(doc, lookup, taxonomy_counts))}

    @router.put(
        "/categories/{category_id}",
        dependencies=[Depends(require_cms_permissions("categories.update"))],
    )
    async def update_category(
        category_id: str,
        payload: CategoryPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        category_object_id = _ensure_object_id(category_id)
        existing = await db.cms_categories.find_one({"_id": category_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Category not found")

        parent_object_id = _ensure_object_id(payload.parent_id) if payload.parent_id else None
        if parent_object_id == category_object_id:
            raise HTTPException(status_code=422, detail="Category cannot be its own parent")
        if parent_object_id and not await db.cms_categories.find_one({"_id": parent_object_id}):
            raise HTTPException(status_code=404, detail="Parent category not found")

        slug = payload.slug.strip() if payload.slug else _slugify(payload.name)
        duplicate = await db.cms_categories.find_one({"slug": slug, "_id": {"$ne": category_object_id}})
        if duplicate:
            raise HTTPException(status_code=409, detail="Category slug already exists")

        updates = {
            "parent_id": parent_object_id,
            "name": payload.name.strip(),
            "slug": slug,
            "description": payload.description.strip(),
            "is_active": payload.is_active,
            "updated_by": current_user.get("email", ""),
            "updated_at": _utcnow(),
        }
        await db.cms_categories.update_one({"_id": category_object_id}, {"$set": updates})
        updated = await db.cms_categories.find_one({"_id": category_object_id})
        changed_fields = [
            field
            for field in ("parent_id", "name", "slug", "description", "is_active")
            if existing.get(field) != updates.get(field)
        ]
        if changed_fields:
            await log_cms_audit_event(
                db,
                action="update_category",
                entity_type="category",
                entity_id=category_id,
                user=current_user,
                metadata={"name": updates["name"], "slug": updates["slug"], "changed_fields": changed_fields},
            )
        lookup = _build_category_doc_lookup(await db.cms_categories.find({}).to_list(length=None))
        taxonomy_counts = _build_product_taxonomy_counts(
            await db.products.find({}, {"_id": 0, "Category_1": 1, "Category_2": 1, "Category_3": 1}).to_list(length=None)
        )
        return {"success": True, "data": _serialize_category(updated, lookup, _category_items_count(updated, lookup, taxonomy_counts))}

    @router.get(
        "/items",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def list_items(
        search: str = Query(default="", max_length=120),
        status_filter: str = Query(default="all", pattern="^(all|active|inactive)$"),
        quality_state_filter: str = Query(default="all", pattern="^(all|ready|needs_fix|ready_for_review)$"),
        missing_requirement: str = Query(default="all", pattern="^(all|missing_any_image|missing_text|missing_category)$"),
        photo_source_filter: str = Query(default="all", pattern="^(all|youpharmacy_xml|pharmacy295_excel)$"),
        category_id: Optional[str] = None,
        category_filter: Optional[str] = Query(default=None, max_length=500),
        category_1: Optional[str] = Query(default=None, max_length=255),
        category_2: Optional[str] = Query(default=None, max_length=255),
        category_3: Optional[str] = Query(default=None, max_length=255),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
        sort_by: str = Query(default="updated_at", pattern="^(title|code|barcode|status|created_at|updated_at)$"),
        sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    ) -> Dict[str, Any]:
        query = _build_item_list_query(
            search=search,
            status_filter=status_filter,
            quality_state_filter=quality_state_filter,
            missing_requirement=missing_requirement,
            photo_source_filter=photo_source_filter,
            category_id=category_id,
            category_filter=category_filter,
            category_1=category_1,
            category_2=category_2,
            category_3=category_3,
        )

        sort_map: Dict[str, Tuple[str, int]] = {
            "title": ("cms_title", 1 if sort_order == "asc" else -1),
            "code": ("cms_code", 1 if sort_order == "asc" else -1),
            "barcode": ("cms_barcode", 1 if sort_order == "asc" else -1),
            "status": ("cms_status", 1 if sort_order == "asc" else -1),
            "created_at": ("cms_created_at", 1 if sort_order == "asc" else -1),
            "updated_at": ("cms_updated_at", 1 if sort_order == "asc" else -1),
        }
        sort_field, direction = sort_map[sort_by]
        total = await db.products.count_documents(query)
        skip = (page - 1) * per_page
        docs = (
            await db.products.find(query)
            .sort(sort_field, direction)
            .skip(skip)
            .limit(per_page)
            .to_list(length=per_page)
        )
        category_lookup = await _load_category_lookup(db)
        items = [_map_product_to_cms_item(doc, category_lookup) for doc in docs]
        return {
            "success": True,
            "data": items,
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
        }

    @router.get(
        "/items/filter-categories",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def list_item_filter_categories() -> Dict[str, Any]:
        category_lookup = await _load_category_lookup(db)
        docs = await db.products.find(
            {},
            {
                "_id": 0,
                "cms_category_id": 1,
                "Category_1": 1,
                "Category_2": 1,
                "Category_3": 1,
            },
        ).to_list(length=None)

        counts: Dict[str, Dict[str, Any]] = {}
        for doc in docs:
            descriptor = _build_item_filter_category(doc, category_lookup)
            key = descriptor["key"]
            bucket = counts.setdefault(
                key,
                {"key": key, "label": descriptor["label"], "path": descriptor["path"], "count": 0},
            )
            bucket["count"] += 1

        data = list(counts.values())
        data.sort(key=lambda row: (row["label"] == "Uncategorized", row["label"].lower()))
        return {"success": True, "data": data}

    @router.get(
        "/items/filter-taxonomy",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def list_item_filter_taxonomy(
        category_1: Optional[str] = Query(default=None, max_length=255),
        category_2: Optional[str] = Query(default=None, max_length=255),
    ) -> Dict[str, Any]:
        docs = await db.products.find(
            {},
            {"_id": 0, "Category_1": 1, "Category_2": 1, "Category_3": 1},
        ).to_list(length=None)

        def build_options(level_docs: List[Dict[str, Any]], field_name: str) -> List[Dict[str, Any]]:
            counts: Dict[str, int] = {}
            for row in level_docs:
                value = str(row.get(field_name, "")).strip()
                if not value:
                    continue
                counts[value] = counts.get(value, 0) + 1
            data = [{"value": value, "count": count} for value, count in counts.items()]
            data.sort(key=lambda row: row["value"].lower())
            return data

        level_1_docs = docs
        level_2_docs = [row for row in docs if not category_1 or str(row.get("Category_1", "")).strip() == category_1]
        level_3_docs = [
            row
            for row in docs
            if (not category_1 or str(row.get("Category_1", "")).strip() == category_1)
            and (not category_2 or str(row.get("Category_2", "")).strip() == category_2)
        ]

        return {
            "success": True,
            "data": {
                "category_1": build_options(level_1_docs, "Category_1"),
                "category_2": build_options(level_2_docs, "Category_2"),
                "category_3": build_options(level_3_docs, "Category_3"),
            },
        }

    @router.get(
        "/items/quality-summary",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def get_item_quality_summary() -> Dict[str, Any]:
        total_items = await db.products.count_documents({})
        ready = await db.products.count_documents({"catalog_quality_state": "ready"})
        needs_fix = await db.products.count_documents({"catalog_quality_state": "needs_fix"})
        ready_for_review = await db.products.count_documents({"catalog_quality_state": "ready_for_review"})
        missing_text = await db.products.count_documents({"catalog_missing_requirements": "missing_text"})
        missing_category = await db.products.count_documents({"catalog_missing_requirements": "missing_category"})
        missing_any_image = await db.products.count_documents({"catalog_missing_requirements": "missing_any_image"})

        return {
            "success": True,
            "data": {
                "total_items": total_items,
                "ready": ready,
                "needs_fix": needs_fix,
                "ready_for_review": ready_for_review,
                "missing_text": missing_text,
                "missing_category": missing_category,
                "missing_any_image": missing_any_image,
            },
        }

    @router.post(
        "/items",
        dependencies=[Depends(require_cms_permissions("items.create"))],
    )
    async def create_item(
        payload: ItemPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        category_object_id = _ensure_object_id(payload.category_id) if payload.category_id else None
        _, _, category_path = await _resolve_category_selection(db, category_object_id)

        slug = payload.slug.strip() if payload.slug else _slugify(payload.title)
        now = _utcnow()
        description_html = sanitize_html(payload.description_html) or plain_text_to_html(payload.description)
        description_text = html_to_plain_text(description_html) or payload.description.strip()
        document: Dict[str, Any] = {
            "Barcode": payload.barcode.strip(),
            "Title": payload.title.strip(),
            "Description": description_text,
            "Brand": payload.brand.strip(),
            "Image_url": [payload.main_image.strip()] if payload.main_image.strip() else [],
            "Category_1": category_path[0] if len(category_path) > 0 else "",
            "Category_2": category_path[1] if len(category_path) > 1 else "",
            "Category_3": category_path[2] if len(category_path) > 2 else "",
            "cms_title": payload.title.strip(),
            "cms_slug": slug,
            "cms_code": payload.code.strip(),
            "cms_sku": payload.sku.strip(),
            "cms_barcode": payload.barcode.strip(),
            "cms_description": description_text,
            "cms_description_html": description_html,
            "cms_brand": payload.brand.strip(),
            "cms_unit": payload.unit.strip(),
            "cms_status": payload.status,
            "cms_main_image": payload.main_image.strip(),
            "cms_category_id": str(category_object_id) if category_object_id else "",
            "cms_created_by": current_user.get("email", ""),
            "cms_updated_by": current_user.get("email", ""),
            "cms_created_at": now,
            "cms_updated_at": now,
        }
        quality = evaluate_catalog_quality(document)
        if payload.status == "active" and quality["missing_requirements"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Item cannot be activated until all quality requirements are complete.",
                    "missing_requirements": quality["missing_requirements"],
                },
            )
        document.update(
            build_catalog_quality_updates(
                document,
                evaluator="cms:create",
                manual_review_approved=payload.status == "active" and not quality["missing_requirements"],
                queue_for_review=_should_queue_for_review(payload.status, quality),
                reviewed_by=current_user.get("email", ""),
            )
        )
        result = await db.products.insert_one(document)
        await _insert_item_change(
            db,
            item_id=str(result.inserted_id),
            change_type="created",
            field_name="*",
            old_value=None,
            new_value={"title": payload.title.strip(), "barcode": payload.barcode.strip()},
            changed_by=current_user.get("email", ""),
        )
        created = await db.products.find_one({"_id": result.inserted_id})
        category_lookup = await _load_category_lookup(db)
        created_item = _map_product_to_cms_item(created, category_lookup)
        await log_cms_audit_event(
            db,
            action="create_item",
            entity_type="item",
            entity_id=str(result.inserted_id),
            user=current_user,
            metadata={
                "title": created_item["title"],
                "barcode": created_item["barcode"],
                "category_id": created_item["category_id"],
                "status": created_item["status"],
            },
        )
        await queue_notification_event(
            db,
            event_type="item_created",
            item_id=str(result.inserted_id),
            category_id=str(created.get("cms_category_id", "")).strip(),
            payload={
                **build_item_snapshot(created, created_item["category_name"]),
                "changed_by": current_user.get("email", ""),
                "change_fields": ["created"],
            },
        )
        return {"success": True, "data": created_item}

    @router.post(
        "/items/{item_id}/refresh-from-sources",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def refresh_item_from_sources(
        item_id: str,
        payload: ItemSourceRefreshPayload,
        response: Response,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        barcode = normalize_barcode(payload.barcode or "")
        if not barcode:
            barcode = normalize_barcode(existing.get("cms_barcode") or existing.get("Barcode") or "")
        if not barcode:
            raise HTTPException(status_code=422, detail="Barcode is required to refresh this item from sources")

        refresh_preview = await _build_source_refresh_preview(
            db,
            existing,
            barcode=barcode,
            updated_by=current_user.get("email", "") or "system:source_refresh",
            source_key=payload.source_key or "",
            text_source_key=payload.text_source_key or "",
            image_source_key=payload.image_source_key or "",
            category_source_key=payload.category_source_key or "",
        )
        refreshed_document = refresh_preview["refreshed_document"]
        refreshed_item = refresh_preview["refreshed_item"]

        await log_cms_audit_event(
            db,
            action="refresh_item_from_sources",
            entity_type="item",
            entity_id=item_id,
            user=current_user,
            metadata={
                "barcode": barcode,
                "source_name": refresh_preview["source_name"],
                "text_source_name": refresh_preview["text_source_name"],
                "image_source_name": refresh_preview["image_source_name"],
                "category_source_name": refresh_preview["category_source_name"],
                "product_link": refresh_preview["product_link"],
                "category_resolution_source": refresh_preview["category_resolution_source"],
                "resolved_category_path": refresh_preview["resolved_category_path"],
                "raw_source_images": refresh_preview["raw_source_images"],
                "filtered_source_images": refresh_preview["filtered_source_images"],
                "fresh_hosted_images": refresh_preview["fresh_hosted_images"],
                "has_fresh_hosted_image_set": refresh_preview["has_fresh_hosted_image_set"],
                "draft_only": True,
            },
        )

        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return {
            "success": True,
            "data": {
                "source_name": refresh_preview["source_name"],
                "text_source_name": refresh_preview["text_source_name"],
                "image_source_name": refresh_preview["image_source_name"],
                "category_source_name": refresh_preview["category_source_name"],
                "product_link": refresh_preview["product_link"],
                "category_resolution_source": refresh_preview["category_resolution_source"],
                "resolved_category_path": refresh_preview["resolved_category_path"],
                "raw_source_images": refresh_preview["raw_source_images"],
                "filtered_source_images": refresh_preview["filtered_source_images"],
                "fresh_hosted_images": refresh_preview["fresh_hosted_images"],
                "has_fresh_hosted_image_set": refresh_preview["has_fresh_hosted_image_set"],
                "item": refreshed_item,
            },
        }

    @router.post(
        "/items/{item_id}/approve-go-live",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def approve_item_go_live(
        item_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        quality = evaluate_catalog_quality(existing)
        if quality["missing_requirements"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Item cannot go live until all quality requirements are complete.",
                    "missing_requirements": quality["missing_requirements"],
                },
            )

        updates = {
            "cms_updated_by": current_user.get("email", ""),
            "cms_updated_at": _utcnow(),
        }
        candidate_document = dict(existing)
        candidate_document.update(updates)
        updates.update(
            build_catalog_quality_updates(
                candidate_document,
                evaluator="cms:approve_go_live",
                manual_review_approved=True,
                reviewed_by=current_user.get("email", ""),
            )
        )

        previous_status = str(existing.get("cms_status") or "inactive").strip() or "inactive"
        await db.products.update_one({"_id": item_object_id}, {"$set": updates})

        if previous_status != "active":
            await _insert_item_change(
                db,
                item_id=item_id,
                change_type="updated",
                field_name="status",
                old_value=previous_status,
                new_value="active",
                changed_by=current_user.get("email", ""),
            )

        updated = await db.products.find_one({"_id": item_object_id})
        category_lookup = await _load_category_lookup(db)
        updated_item = _map_product_to_cms_item(updated, category_lookup)

        await log_cms_audit_event(
            db,
            action="approve_item_go_live",
            entity_type="item",
            entity_id=item_id,
            user=current_user,
            metadata={
                "title": updated_item["title"],
                "barcode": updated_item["barcode"],
                "previous_status": previous_status,
                "quality_state": updated_item["catalog_quality_state"],
            },
        )

        if previous_status != "active":
            await queue_notification_event(
                db,
                event_type="item_activated",
                item_id=item_id,
                category_id=str(updated.get("cms_category_id", "")).strip(),
                payload={
                    **build_item_snapshot(updated, updated_item["category_name"]),
                    "changed_by": current_user.get("email", ""),
                    "change_fields": ["status", "review_approved"],
                    "previous_status": previous_status,
                },
            )

        return {"success": True, "data": updated_item}

    @router.get(
        "/bulk-refresh/status",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def get_bulk_refresh_status() -> Dict[str, Any]:
        job = next((row for row in get_source_job_overview(CATALOG_REFRESH_SOURCE_KEY) if row["key"] == CATALOG_REFRESH_JOB_KEY), None)
        return {"success": True, "data": job}

    @router.post(
        "/bulk-refresh/start",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def start_bulk_refresh(
        payload: BulkCatalogRefreshPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        query = _build_item_list_query(
            search=payload.search,
            status_filter=payload.status_filter,
            quality_state_filter=payload.quality_state_filter,
            missing_requirement=payload.missing_requirement,
            photo_source_filter=payload.photo_source_filter,
            category_1=payload.category_1,
            category_2=payload.category_2,
            category_3=payload.category_3,
        )
        matched_total = await db.products.count_documents(query)
        if matched_total <= 0:
            raise HTTPException(status_code=400, detail="No items match the current filters.")

        requested_by = current_user.get("email", "") or "system:bulk_refresh"
        request_document = {
            "requested_at": _utcnow(),
            "requested_by": requested_by,
            "filters": {
                "search": payload.search,
                "status_filter": payload.status_filter,
                "quality_state_filter": payload.quality_state_filter,
                "missing_requirement": payload.missing_requirement,
                "photo_source_filter": payload.photo_source_filter,
                "category_1": payload.category_1 or "",
                "category_2": payload.category_2 or "",
                "category_3": payload.category_3 or "",
            },
            "source_selection": {
                "source_key": payload.source_key or "",
                "text_source_key": payload.text_source_key or "",
                "image_source_key": payload.image_source_key or "",
                "category_source_key": payload.category_source_key or "",
            },
            "limit": int(payload.limit),
            "matched_total": int(matched_total),
        }
        CATALOG_REFRESH_REQUEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        CATALOG_REFRESH_REQUEST_PATH.write_text(json.dumps(request_document, ensure_ascii=True, indent=2), encoding="utf-8")

        try:
            job_start = start_source_job(CATALOG_REFRESH_SOURCE_KEY, CATALOG_REFRESH_JOB_KEY)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        await log_cms_audit_event(
            db,
            action="start_bulk_refresh",
            entity_type="catalog_refresh",
            entity_id=CATALOG_REFRESH_JOB_KEY,
            user=current_user,
            metadata={
                "matched_total": int(matched_total),
                "limit": int(payload.limit),
                "filters": request_document["filters"],
                "source_selection": request_document["source_selection"],
                "started": bool(job_start.get("started")),
                "already_running": bool(job_start.get("already_running")),
                "pid": int(job_start.get("pid", 0)),
            },
        )

        job = next((row for row in get_source_job_overview(CATALOG_REFRESH_SOURCE_KEY) if row["key"] == CATALOG_REFRESH_JOB_KEY), None)
        return {
            "success": True,
            "data": {
                "matched_total": int(matched_total),
                "limit": int(payload.limit),
                "job_start": job_start,
                "job": job,
            },
        }

    @router.post(
        "/bulk-refresh/stop",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def stop_bulk_refresh(
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        try:
            stop_result = stop_source_job(CATALOG_REFRESH_SOURCE_KEY, CATALOG_REFRESH_JOB_KEY)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        await log_cms_audit_event(
            db,
            action="stop_bulk_refresh",
            entity_type="catalog_refresh",
            entity_id=CATALOG_REFRESH_JOB_KEY,
            user=current_user,
            metadata={
                "stopped": bool(stop_result.get("stopped")),
                "already_stopped": bool(stop_result.get("already_stopped")),
                "pid": int(stop_result.get("pid", 0)),
            },
        )

        job = next((row for row in get_source_job_overview(CATALOG_REFRESH_SOURCE_KEY) if row["key"] == CATALOG_REFRESH_JOB_KEY), None)
        return {
            "success": True,
            "data": {
                "stop_result": stop_result,
                "job": job,
            },
        }

    @router.post(
        "/bulk-refresh/cancel",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def cancel_bulk_refresh(
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        try:
            stop_result = cancel_source_job(CATALOG_REFRESH_SOURCE_KEY, CATALOG_REFRESH_JOB_KEY)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        await log_cms_audit_event(
            db,
            action="cancel_bulk_refresh",
            entity_type="catalog_refresh",
            entity_id=CATALOG_REFRESH_JOB_KEY,
            user=current_user,
            metadata={
                "stopped": bool(stop_result.get("stopped")),
                "already_stopped": bool(stop_result.get("already_stopped")),
                "pid": int(stop_result.get("pid", 0)),
            },
        )

        job = next((row for row in get_source_job_overview(CATALOG_REFRESH_SOURCE_KEY) if row["key"] == CATALOG_REFRESH_JOB_KEY), None)
        return {
            "success": True,
            "data": {
                "cancel_result": stop_result,
                "job": job,
            },
        }

    @router.post(
        "/bulk-refresh/restart",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def restart_bulk_refresh(
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        try:
            restart_result = restart_source_job(CATALOG_REFRESH_SOURCE_KEY, CATALOG_REFRESH_JOB_KEY)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

        await log_cms_audit_event(
            db,
            action="restart_bulk_refresh",
            entity_type="catalog_refresh",
            entity_id=CATALOG_REFRESH_JOB_KEY,
            user=current_user,
            metadata={
                "stop_result": restart_result.get("stop_result", {}),
                "start_result": restart_result.get("start_result", {}),
            },
        )

        job = next((row for row in get_source_job_overview(CATALOG_REFRESH_SOURCE_KEY) if row["key"] == CATALOG_REFRESH_JOB_KEY), None)
        return {
            "success": True,
            "data": {
                "restart_result": restart_result,
                "job": job,
            },
        }

    @router.get(
        "/items/{item_id}",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def get_item(
        item_id: str,
        response: Response,
        preview_bypass: str = Query(default="", max_length=64),
    ) -> Dict[str, Any]:
        doc = await db.products.find_one({"_id": _ensure_object_id(item_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Item not found")
        category_lookup = await _load_category_lookup(db)
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return {
            "success": True,
            "data": _map_product_to_cms_item(
                doc,
                category_lookup,
                cache_buster=preview_bypass.strip(),
            ),
        }

    @router.put(
        "/items/{item_id}",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def update_item(
        item_id: str,
        payload: ItemPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        category_object_id = _ensure_object_id(payload.category_id) if payload.category_id else None
        _, _, category_path = await _resolve_category_selection(db, category_object_id)

        slug = payload.slug.strip() if payload.slug else _slugify(payload.title)
        description_html = sanitize_html(payload.description_html) or plain_text_to_html(payload.description)
        description_text = html_to_plain_text(description_html) or payload.description.strip()
        updates = {
            "Barcode": payload.barcode.strip(),
            "Title": payload.title.strip(),
            "Description": description_text,
            "Brand": payload.brand.strip(),
            "Image_url": [payload.main_image.strip()] if payload.main_image.strip() else [],
            "Category_1": category_path[0] if len(category_path) > 0 else "",
            "Category_2": category_path[1] if len(category_path) > 1 else "",
            "Category_3": category_path[2] if len(category_path) > 2 else "",
            "cms_title": payload.title.strip(),
            "cms_slug": slug,
            "cms_code": payload.code.strip(),
            "cms_sku": payload.sku.strip(),
            "cms_barcode": payload.barcode.strip(),
            "cms_description": description_text,
            "cms_description_html": description_html,
            "cms_brand": payload.brand.strip(),
            "cms_unit": payload.unit.strip(),
            "cms_status": payload.status,
            "cms_main_image": payload.main_image.strip(),
            "cms_category_id": str(category_object_id) if category_object_id else "",
            "cms_updated_by": current_user.get("email", ""),
            "cms_updated_at": _utcnow(),
        }
        candidate_document = dict(existing)
        candidate_document.update(updates)
        quality = evaluate_catalog_quality(candidate_document)
        if payload.status == "active" and quality["missing_requirements"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Item cannot be activated until all quality requirements are complete.",
                    "missing_requirements": quality["missing_requirements"],
                },
            )
        updates.update(
            build_catalog_quality_updates(
                candidate_document,
                evaluator="cms:update",
                manual_review_approved=payload.status == "active" and not quality["missing_requirements"],
                queue_for_review=_should_queue_for_review(payload.status, quality),
                reviewed_by=current_user.get("email", ""),
            )
        )

        field_pairs = [
            ("title", existing.get("cms_title") or _first_text(existing.get("Title")), payload.title.strip()),
            ("code", existing.get("cms_code") or str(existing.get("Code", "")).strip(), payload.code.strip()),
            ("sku", existing.get("cms_sku") or str(existing.get("SKU", "")).strip(), payload.sku.strip()),
            ("barcode", existing.get("cms_barcode") or str(existing.get("Barcode", "")).strip(), payload.barcode.strip()),
            ("description", existing.get("cms_description") or _first_text(existing.get("Description")), description_text),
            ("description_html", existing.get("cms_description_html") or plain_text_to_html(existing.get("cms_description") or _first_text(existing.get("Description"))), description_html),
            ("brand", existing.get("cms_brand") or str(existing.get("Brand", "")).strip(), payload.brand.strip()),
            ("unit", existing.get("cms_unit", ""), payload.unit.strip()),
            ("status", existing.get("cms_status") or "active", payload.status),
            ("main_image", existing.get("cms_main_image") or _first_text(existing.get("Image_url")) or str(existing.get("Img_src", "")).strip(), payload.main_image.strip()),
            ("category_id", str(existing.get("cms_category_id", "")).strip(), str(category_object_id) if category_object_id else ""),
            ("category_1", str(existing.get("Category_1", "")).strip(), category_path[0] if len(category_path) > 0 else ""),
            ("category_2", str(existing.get("Category_2", "")).strip(), category_path[1] if len(category_path) > 1 else ""),
            ("category_3", str(existing.get("Category_3", "")).strip(), category_path[2] if len(category_path) > 2 else ""),
        ]

        await db.products.update_one({"_id": item_object_id}, {"$set": updates})
        changed_fields: List[str] = []
        for field_name, old_value, new_value in field_pairs:
            if (old_value or "") != (new_value or ""):
                changed_fields.append(field_name)
                await _insert_item_change(
                    db,
                    item_id=str(item_object_id),
                    change_type="updated",
                    field_name=field_name,
                    old_value=old_value,
                    new_value=new_value,
                    changed_by=current_user.get("email", ""),
                )

        updated = await db.products.find_one({"_id": item_object_id})
        category_lookup = await _load_category_lookup(db)
        updated_item = _map_product_to_cms_item(updated, category_lookup)
        if changed_fields:
            await log_cms_audit_event(
                db,
                action="update_item",
                entity_type="item",
                entity_id=item_id,
                user=current_user,
                metadata={
                    "title": updated_item["title"],
                    "barcode": updated_item["barcode"],
                    "changed_fields": changed_fields,
                },
            )
            payload = {
                **build_item_snapshot(updated, updated_item["category_name"]),
                "changed_by": current_user.get("email", ""),
                "change_fields": changed_fields,
            }
            await queue_notification_event(
                db,
                event_type="item_updated",
                item_id=item_id,
                category_id=str(updated.get("cms_category_id", "")).strip(),
                payload=payload,
            )
            old_status = str(existing.get("cms_status") or "active").strip() or "active"
            new_status = payload["status"]
            if old_status != new_status:
                await queue_notification_event(
                    db,
                    event_type="item_activated" if new_status == "active" else "item_deactivated",
                    item_id=item_id,
                    category_id=str(updated.get("cms_category_id", "")).strip(),
                    payload={**payload, "previous_status": old_status},
                )
            old_category_id = str(existing.get("cms_category_id", "")).strip()
            new_category_id = str(updated.get("cms_category_id", "")).strip()
            if old_category_id != new_category_id:
                await queue_notification_event(
                    db,
                    event_type="category_changed",
                    item_id=item_id,
                    category_id=new_category_id,
                    payload={**payload, "previous_category_id": old_category_id},
                )
        return {"success": True, "data": updated_item}

    @router.delete(
        "/items/{item_id}/images",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def delete_item_image(
        item_id: str,
        image_url: str = Query(..., min_length=1),
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        barcode = normalize_barcode(existing.get("cms_barcode") or existing.get("Barcode") or "")
        target_image_url = str(image_url or "").strip()
        if not target_image_url:
            raise HTTPException(status_code=422, detail="Image URL is required")

        raw_image_urls = _normalize_image_url_list(existing.get("Image_url"))
        raw_source_urls = _normalize_image_url_list(existing.get("Img_src_List"))
        raw_source_main = str(existing.get("Img_src", "")).strip()
        current_main_image = str(existing.get("cms_main_image", "")).strip()

        hosted_image_path = _hosted_image_path_from_url(barcode, target_image_url)
        deleted_hosted_file = False
        if hosted_image_path and hosted_image_path.exists() and hosted_image_path.is_file():
            hosted_image_path.unlink()
            _prune_empty_barcode_dir(hosted_image_path)
            deleted_hosted_file = True

        filtered_image_urls = [url for url in raw_image_urls if url != target_image_url]
        filtered_source_urls = [url for url in raw_source_urls if url != target_image_url]
        filtered_source_main = "" if raw_source_main == target_image_url else raw_source_main
        hosted_image_urls = resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL) if barcode else []

        next_main_image = ""
        if hosted_image_urls:
            next_main_image = hosted_image_urls[0]
        else:
            fallback_candidates: List[str] = []
            if current_main_image and current_main_image != target_image_url:
                fallback_candidates.append(current_main_image)
            fallback_candidates.extend(filtered_image_urls)
            if filtered_source_main:
                fallback_candidates.append(filtered_source_main)
            fallback_candidates.extend(filtered_source_urls)
            for candidate in fallback_candidates:
                if candidate:
                    next_main_image = candidate
                    break

        updates = {
            "Image_url": hosted_image_urls if hosted_image_urls else filtered_image_urls,
            "Img_src_List": filtered_source_urls,
            "Img_src": filtered_source_main,
            "cms_main_image": next_main_image,
            "cms_updated_by": current_user.get("email", ""),
            "cms_updated_at": _utcnow(),
        }
        candidate_document = dict(existing)
        candidate_document.update(updates)
        updates.update(
            build_catalog_quality_updates(
                candidate_document,
                evaluator="cms:delete_item_image",
                reviewed_by=current_user.get("email", ""),
            )
        )

        await db.products.update_one({"_id": item_object_id}, {"$set": updates})

        await _insert_item_change(
            db,
            item_id=str(item_object_id),
            change_type="updated",
            field_name="image_deleted",
            old_value=target_image_url,
            new_value="",
            changed_by=current_user.get("email", ""),
        )
        if current_main_image != next_main_image:
            await _insert_item_change(
                db,
                item_id=str(item_object_id),
                change_type="updated",
                field_name="main_image",
                old_value=current_main_image,
                new_value=next_main_image,
                changed_by=current_user.get("email", ""),
            )

        updated = await db.products.find_one({"_id": item_object_id})
        category_lookup = await _load_category_lookup(db)
        updated_item = _map_product_to_cms_item(updated, category_lookup)

        await log_cms_audit_event(
            db,
            action="delete_item_image",
            entity_type="item",
            entity_id=item_id,
            user=current_user,
            metadata={
                "barcode": updated_item["barcode"],
                "deleted_image_url": target_image_url,
                "deleted_hosted_file": deleted_hosted_file,
                "remaining_images": updated_item.get("image_urls", []),
            },
        )

        return {
            "success": True,
            "data": {
                "deleted_image_url": target_image_url,
                "deleted_hosted_file": deleted_hosted_file,
                "item": updated_item,
            },
        }

    @router.post(
        "/items/{item_id}/images/manual",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def upload_item_images_manual(
        item_id: str,
        files: List[UploadFile] = File(...),
        replace_existing: bool = Form(default=False),
        set_uploaded_as_main: bool = Form(default=True),
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        barcode = normalize_barcode(existing.get("cms_barcode") or existing.get("Barcode") or "")
        if not barcode:
            raise HTTPException(status_code=422, detail="Barcode is required before uploading hosted images")

        uploads = [upload for upload in files if upload and str(getattr(upload, "filename", "") or "").strip()]
        if not uploads:
            raise HTTPException(status_code=422, detail="At least one image file is required")

        written_paths = await _write_manual_uploaded_images(
            barcode=barcode,
            uploads=uploads,
            replace_existing=bool(replace_existing),
        )
        hosted_image_urls = resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL)
        if not hosted_image_urls:
            raise HTTPException(status_code=500, detail="Manual image upload completed but no hosted image URLs were generated")

        uploaded_hosted_urls = [
            public_url_for_image_path(barcode, image_path, IMAGE_PUBLIC_BASE_URL)
            for image_path in written_paths
        ]
        current_main_image = str(existing.get("cms_main_image", "")).strip()
        next_main_image = hosted_image_urls[0]
        if bool(set_uploaded_as_main) and uploaded_hosted_urls:
            next_main_image = uploaded_hosted_urls[0]
        elif current_main_image:
            matched_current = _match_versioned_hosted_url(current_main_image, hosted_image_urls)
            if matched_current:
                next_main_image = matched_current

        now = _utcnow()
        updates = {
            "Image_url": hosted_image_urls,
            "cms_main_image": next_main_image,
            "image_source_domain": MANUAL_UPLOAD_LOCK_SOURCE,
            "image_processing_version": MANUAL_UPLOAD_PROCESSING_VERSION,
            "photo_source_locked": True,
            "photo_source_lock": MANUAL_UPLOAD_LOCK_SOURCE,
            "photo_source_locked_at": now,
            "cms_updated_by": current_user.get("email", ""),
            "cms_updated_at": now,
        }
        candidate_document = dict(existing)
        candidate_document.update(updates)
        updates.update(
            build_catalog_quality_updates(
                candidate_document,
                evaluator="cms:manual_image_upload",
                reviewed_by=current_user.get("email", ""),
            )
        )

        await db.products.update_one({"_id": item_object_id}, {"$set": updates})

        await _insert_item_change(
            db,
            item_id=str(item_object_id),
            change_type="updated",
            field_name="manual_image_upload",
            old_value={
                "replace_existing": bool(replace_existing),
                "previous_main_image": current_main_image,
            },
            new_value={
                "uploaded_count": len(uploaded_hosted_urls),
                "uploaded_urls": uploaded_hosted_urls,
                "next_main_image": next_main_image,
            },
            changed_by=current_user.get("email", ""),
        )

        updated = await db.products.find_one({"_id": item_object_id})
        category_lookup = await _load_category_lookup(db)
        updated_item = _map_product_to_cms_item(updated, category_lookup)

        await log_cms_audit_event(
            db,
            action="manual_item_image_upload",
            entity_type="item",
            entity_id=item_id,
            user=current_user,
            metadata={
                "barcode": barcode,
                "replace_existing": bool(replace_existing),
                "set_uploaded_as_main": bool(set_uploaded_as_main),
                "uploaded_count": len(uploaded_hosted_urls),
                "uploaded_urls": uploaded_hosted_urls,
                "next_main_image": next_main_image,
            },
        )

        return {
            "success": True,
            "data": {
                "uploaded_count": len(uploaded_hosted_urls),
                "uploaded_urls": uploaded_hosted_urls,
                "item": updated_item,
            },
        }

    @router.post(
        "/items/{item_id}/images/import-url",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def import_item_image_from_url(
        item_id: str,
        payload: ManualImageImportUrlPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        barcode = normalize_barcode(existing.get("cms_barcode") or existing.get("Barcode") or "")
        if not barcode:
            raise HTTPException(status_code=422, detail="Barcode is required before importing hosted images")

        written_path = await _write_manual_image_from_remote_url(
            barcode=barcode,
            image_url=payload.image_url,
            replace_existing=bool(payload.replace_existing),
            referer_url=payload.source_page_url,
        )
        hosted_image_urls = resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL)
        if not hosted_image_urls:
            raise HTTPException(status_code=500, detail="Remote image import completed but no hosted image URLs were generated")

        uploaded_hosted_url = public_url_for_image_path(barcode, written_path, IMAGE_PUBLIC_BASE_URL)
        current_main_image = str(existing.get("cms_main_image", "")).strip()
        next_main_image = hosted_image_urls[0]
        if bool(payload.set_uploaded_as_main):
            next_main_image = uploaded_hosted_url
        elif current_main_image:
            matched_current = _match_versioned_hosted_url(current_main_image, hosted_image_urls)
            if matched_current:
                next_main_image = matched_current

        now = _utcnow()
        source_page_url = str(payload.source_page_url or "").strip()
        image_source_domain = MANUAL_UPLOAD_LOCK_SOURCE
        if source_page_url:
            parsed_source = urlsplit(source_page_url)
            image_source_domain = parsed_source.netloc or MANUAL_UPLOAD_LOCK_SOURCE
        else:
            parsed_image = urlsplit(payload.image_url)
            image_source_domain = parsed_image.netloc or MANUAL_UPLOAD_LOCK_SOURCE

        updates = {
            "Image_url": hosted_image_urls,
            "cms_main_image": next_main_image,
            "image_source_domain": image_source_domain,
            "image_processing_version": MANUAL_UPLOAD_PROCESSING_VERSION,
            "photo_source_locked": True,
            "photo_source_lock": MANUAL_UPLOAD_LOCK_SOURCE,
            "photo_source_locked_at": now,
            "cms_updated_by": current_user.get("email", ""),
            "cms_updated_at": now,
        }
        candidate_document = dict(existing)
        candidate_document.update(updates)
        updates.update(
            build_catalog_quality_updates(
                candidate_document,
                evaluator="cms:manual_image_import_url",
                reviewed_by=current_user.get("email", ""),
            )
        )

        await db.products.update_one({"_id": item_object_id}, {"$set": updates})

        await _insert_item_change(
            db,
            item_id=str(item_object_id),
            change_type="updated",
            field_name="manual_image_import_url",
            old_value={
                "replace_existing": bool(payload.replace_existing),
                "previous_main_image": current_main_image,
            },
            new_value={
                "image_url": payload.image_url,
                "source_page_url": source_page_url,
                "uploaded_url": uploaded_hosted_url,
                "next_main_image": next_main_image,
            },
            changed_by=current_user.get("email", ""),
        )

        updated = await db.products.find_one({"_id": item_object_id})
        category_lookup = await _load_category_lookup(db)
        updated_item = _map_product_to_cms_item(updated, category_lookup)

        await log_cms_audit_event(
            db,
            action="manual_item_image_import_url",
            entity_type="item",
            entity_id=item_id,
            user=current_user,
            metadata={
                "barcode": barcode,
                "image_url": payload.image_url,
                "source_page_url": source_page_url,
                "uploaded_url": uploaded_hosted_url,
                "set_uploaded_as_main": bool(payload.set_uploaded_as_main),
            },
        )

        return {
            "success": True,
            "data": {
                "uploaded_count": 1,
                "uploaded_urls": [uploaded_hosted_url],
                "item": updated_item,
            },
        }

    @router.delete(
        "/items/{item_id}",
        dependencies=[Depends(require_cms_permissions("items.delete"))],
    )
    async def delete_item(
        item_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        existing = await db.products.find_one({"_id": item_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Item not found")

        category_lookup = await _load_category_lookup(db)
        existing_item = _map_product_to_cms_item(existing, category_lookup)

        await db.products.delete_one({"_id": item_object_id})
        await db.cms_item_changes.delete_many({"item_id": item_id})

        await log_cms_audit_event(
            db,
            action="delete_item",
            entity_type="item",
            entity_id=item_id,
            user=current_user,
            metadata={
                "title": existing_item["title"],
                "barcode": existing_item["barcode"],
                "code": existing_item["code"],
            },
        )

        return {"success": True, "data": {"id": item_id, "deleted": True}}

    @router.get(
        "/items/{item_id}/changes",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def get_item_changes(item_id: str) -> Dict[str, Any]:
        item_object_id = _ensure_object_id(item_id)
        item = await db.products.find_one({"_id": item_object_id})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        docs = (
            await db.cms_item_changes.find({"item_id": item_id})
            .sort("created_at", -1)
            .to_list(length=100)
        )
        data = [
            {
                "id": str(doc["_id"]),
                "item_id": doc.get("item_id", ""),
                "change_type": doc.get("change_type", ""),
                "field_name": doc.get("field_name", ""),
                "old_value": doc.get("old_value"),
                "new_value": doc.get("new_value"),
                "changed_by": doc.get("changed_by", ""),
                "created_at": doc.get("created_at", ""),
                "old_value_preview": preview_value(doc.get("old_value"), 120),
                "new_value_preview": preview_value(doc.get("new_value"), 120),
            }
            for doc in docs
        ]
        return {"success": True, "data": data}

    return router
