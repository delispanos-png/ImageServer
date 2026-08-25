from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
import os
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from pydantic import BaseModel, Field

from cms_activity import log_cms_audit_event, parse_datetime, serialize_datetime
from cms_html import plain_text_to_html
from image_paths import resolve_public_image_urls


IMAGE_FILES_BASE_DIR = os.getenv("IMAGE_FILES_BASE_DIR", "/app/images")
IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")


def _first_text(value: Any) -> str:
    if isinstance(value, list):
        for item in value:
            if isinstance(item, str) and item.strip():
                return item.strip()
        return ""
    if isinstance(value, str):
        return value.strip()
    return ""


def _as_utc(value: Any) -> datetime | None:
    parsed = parse_datetime(value)
    if parsed:
        return parsed.astimezone(timezone.utc)
    return None


def _serialize_portal_category_doc(doc: Dict[str, Any], lookup: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    path: List[str] = []
    visited: Set[str] = set()
    current = doc
    while current:
        current_id = str(current.get("_id", ""))
        if not current_id or current_id in visited:
            break
        visited.add(current_id)
        name = str(current.get("name", "")).strip()
        if name:
            path.insert(0, name)
        parent_id = current.get("parent_id")
        current = lookup.get(str(parent_id)) if parent_id else None
    return {
        "id": str(doc.get("_id", "")),
        "parent_id": str(doc.get("parent_id", "")) if doc.get("parent_id") else None,
        "name": str(doc.get("name", "")).strip(),
        "slug": str(doc.get("slug", "")).strip(),
        "path": path,
        "level": len(path) or 1,
        "category_1": path[0] if len(path) > 0 else "",
        "category_2": path[1] if len(path) > 1 else "",
        "category_3": path[2] if len(path) > 2 else "",
    }


async def _load_category_lookup(db) -> Dict[str, Dict[str, Any]]:
    docs = await db.cms_categories.find({}).to_list(length=None)
    raw_lookup = {str(doc["_id"]): doc for doc in docs}
    return {category_id: _serialize_portal_category_doc(doc, raw_lookup) for category_id, doc in raw_lookup.items()}


def _extract_item_category_path(doc: Dict[str, Any], category_lookup: Dict[str, Dict[str, Any]]) -> List[str]:
    fallback_path = [
        part
        for part in (
            str(doc.get("Category_1", "")).strip(),
            str(doc.get("Category_2", "")).strip(),
            str(doc.get("Category_3", "")).strip(),
        )
        if part
    ]
    if fallback_path:
        return fallback_path[:3]
    category_id = str(doc.get("cms_category_id", "")).strip()
    if category_id and category_id in category_lookup:
        return list(category_lookup[category_id].get("path", []))[:3]
    return []


def _append_cache_buster(url: str, cache_buster: str) -> str:
    normalized = str(url or "").strip()
    if not normalized or not cache_buster:
        return normalized
    parsed = urlsplit(normalized)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query["_preview"] = cache_buster
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, urlencode(query), parsed.fragment))


def _serialize_portal_item(
    doc: Dict[str, Any],
    category_lookup: Dict[str, Dict[str, Any]],
    *,
    cache_buster: str = "",
) -> Dict[str, Any]:
    title = str(doc.get("cms_title", "")).strip() or _first_text(doc.get("Title"))
    code = str(doc.get("cms_code", "")).strip() or str(doc.get("Code", "")).strip() or str(doc.get("Barcode", "")).strip()
    sku = str(doc.get("cms_sku", "")).strip() or str(doc.get("SKU", "")).strip()
    barcode = str(doc.get("cms_barcode", "")).strip() or str(doc.get("Barcode", "")).strip()
    description = str(doc.get("cms_description", "")).strip() or _first_text(doc.get("Description"))
    description_html = str(doc.get("cms_description_html", "")).strip() or plain_text_to_html(description)
    brand = str(doc.get("cms_brand", "")).strip() or str(doc.get("Brand", "")).strip()
    unit = str(doc.get("cms_unit", "")).strip()
    category_id = str(doc.get("cms_category_id", "")).strip()
    category_path = _extract_item_category_path(doc, category_lookup)
    hosted_urls = resolve_public_image_urls(IMAGE_FILES_BASE_DIR, barcode, IMAGE_PUBLIC_BASE_URL) if barcode else []
    if cache_buster:
        hosted_urls = [_append_cache_buster(url, cache_buster) for url in hosted_urls]
    created_at = serialize_datetime(doc.get("cms_created_at") or doc.get("created_at"))
    updated_at = serialize_datetime(doc.get("cms_updated_at") or doc.get("last_updated_at") or doc.get("updated_at"))
    return {
        "id": str(doc.get("_id", "")),
        "title": title,
        "slug": str(doc.get("cms_slug", "")).strip(),
        "code": code,
        "sku": sku,
        "barcode": barcode,
        "description": description,
        "description_html": description_html,
        "brand": brand,
        "unit": unit,
        "status": "active",
        "main_image": hosted_urls[0] if hosted_urls else "",
        "image_urls": hosted_urls,
        "category_id": category_id or None,
        "category_path": category_path,
        "category_1": category_path[0] if len(category_path) > 0 else "",
        "category_2": category_path[1] if len(category_path) > 1 else "",
        "category_3": category_path[2] if len(category_path) > 2 else "",
        "created_at": created_at,
        "updated_at": updated_at,
        "catalog_public_image_enabled": bool(hosted_urls),
        "catalog_image_visibility": "hosted" if hosted_urls else "hidden_external",
    }


def _collect_descendants(selected_ids: Iterable[str], category_lookup: Dict[str, Dict[str, Any]]) -> Set[str]:
    children_map: Dict[str, List[str]] = defaultdict(list)
    for category_id, doc in category_lookup.items():
        parent_id = str(doc.get("parent_id", "")).strip()
        if parent_id:
            children_map[parent_id].append(category_id)

    collected: Set[str] = set()
    stack: List[str] = [str(category_id).strip() for category_id in selected_ids if str(category_id).strip()]
    while stack:
        current = stack.pop()
        if not current or current in collected:
            continue
        collected.add(current)
        stack.extend(children_map.get(current, []))
    return collected


def _build_scope_spec(client_doc: Dict[str, Any], category_lookup: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    receive_all_categories = bool(client_doc.get("receive_all_categories", False))
    selected_ids = [
        str(category_id).strip()
        for category_id in client_doc.get("category_ids", [])
        if str(category_id).strip() in category_lookup
    ]
    if receive_all_categories:
        return {
            "receive_all_categories": True,
            "allowed_ids": set(),
            "allowed_paths": [],
        }

    allowed_ids = _collect_descendants(selected_ids, category_lookup)
    allowed_paths: List[Tuple[str, ...]] = []
    for category_id in allowed_ids:
        path = tuple(part for part in category_lookup.get(category_id, {}).get("path", []) if part)
        if path:
            allowed_paths.append(path[:3])
    allowed_paths = sorted(set(allowed_paths), key=lambda value: (len(value), list(value)))
    return {
        "receive_all_categories": False,
        "allowed_ids": allowed_ids,
        "allowed_paths": allowed_paths,
    }


def _path_to_query(path: Tuple[str, ...]) -> Dict[str, Any]:
    query: Dict[str, Any] = {}
    if len(path) > 0:
        query["Category_1"] = path[0]
    if len(path) > 1:
        query["Category_2"] = path[1]
    if len(path) > 2:
        query["Category_3"] = path[2]
    return query


def _build_active_scope_query(scope_spec: Dict[str, Any]) -> Dict[str, Any]:
    query: Dict[str, Any] = {"cms_status": "active"}
    if scope_spec.get("receive_all_categories"):
        return query

    allowed_ids: Set[str] = set(scope_spec.get("allowed_ids", set()))
    allowed_paths: List[Tuple[str, ...]] = list(scope_spec.get("allowed_paths", []))
    if not allowed_ids and not allowed_paths:
        query["_id"] = {"$exists": False}
        return query

    or_conditions: List[Dict[str, Any]] = []
    if allowed_ids:
        or_conditions.append({"cms_category_id": {"$in": list(allowed_ids)}})
    or_conditions.extend(_path_to_query(path) for path in allowed_paths if path)
    query["$or"] = or_conditions
    return query


def _and_query(*parts: Dict[str, Any]) -> Dict[str, Any]:
    cleaned = [part for part in parts if part]
    if not cleaned:
        return {}
    if len(cleaned) == 1:
        return cleaned[0]
    return {"$and": cleaned}


def _item_in_scope(doc: Dict[str, Any], scope_spec: Dict[str, Any], category_lookup: Dict[str, Dict[str, Any]]) -> bool:
    if str(doc.get("cms_status", "")).strip() != "active":
        return False
    if scope_spec.get("receive_all_categories"):
        return True
    category_id = str(doc.get("cms_category_id", "")).strip()
    if category_id and category_id in scope_spec.get("allowed_ids", set()):
        return True
    item_path = tuple(_extract_item_category_path(doc, category_lookup))
    if not item_path:
        return False
    for allowed_path in scope_spec.get("allowed_paths", []):
        if tuple(item_path[: len(allowed_path)]) == tuple(allowed_path):
            return True
    return False


class PortalCommentPayload(BaseModel):
    comment_text: str = Field(min_length=3, max_length=4000)
    comment_type: str = Field(default="generic_remark", max_length=80)


def create_portal_router(db, get_current_portal_client) -> APIRouter:
    router = APIRouter(prefix="/portal", tags=["portal"])

    @router.get("/profile")
    async def get_profile(current_client: Dict[str, Any] = Depends(get_current_portal_client)) -> Dict[str, Any]:
        category_lookup = await _load_category_lookup(db)
        assigned_categories = []
        for category_id in current_client.get("category_ids", []):
            normalized_id = str(category_id).strip()
            if not normalized_id or normalized_id not in category_lookup:
                continue
            category_doc = category_lookup[normalized_id]
            assigned_categories.append(
                {
                    "id": normalized_id,
                    "label": " / ".join(category_doc.get("path", [])),
                    "level": category_doc.get("level", 1),
                    "category_1": category_doc.get("category_1", ""),
                    "category_2": category_doc.get("category_2", ""),
                    "category_3": category_doc.get("category_3", ""),
                }
            )
        return {
            "success": True,
            "data": {
                "id": str(current_client.get("_id", "")),
                "name": str(current_client.get("name", "")).strip(),
                "email": str(current_client.get("email", "")).strip(),
                "company": str(current_client.get("company", "")).strip(),
                "phone": str(current_client.get("phone", "")).strip(),
                "api_username": str(current_client.get("api_username", "")).strip(),
                "subscription_mode": "all_categories" if bool(current_client.get("receive_all_categories", False)) else "selected_categories",
                "receive_all_categories": bool(current_client.get("receive_all_categories", False)),
                "category_ids": [str(category_id).strip() for category_id in current_client.get("category_ids", []) if str(category_id).strip()],
                "assigned_categories": assigned_categories,
            },
        }

    @router.get("/dashboard/overview")
    async def get_portal_dashboard(current_client: Dict[str, Any] = Depends(get_current_portal_client)) -> Dict[str, Any]:
        category_lookup = await _load_category_lookup(db)
        scope_spec = _build_scope_spec(current_client, category_lookup)
        items = await db.products.find(
            _build_active_scope_query(scope_spec),
            {
                "cms_title": 1,
                "Title": 1,
                "cms_code": 1,
                "Code": 1,
                "cms_barcode": 1,
                "Barcode": 1,
                "cms_created_at": 1,
                "created_at": 1,
                "cms_updated_at": 1,
                "updated_at": 1,
                "last_updated_at": 1,
                "cms_category_id": 1,
                "Category_1": 1,
                "Category_2": 1,
                "Category_3": 1,
            },
        ).to_list(length=None)

        now = datetime.now(timezone.utc)
        recent_cutoff = now - timedelta(days=30)
        active_items = len(items)
        new_items = 0
        category_counter: Counter[str] = Counter()
        recent_updated_items: List[Tuple[datetime, Dict[str, Any]]] = []
        for doc in items:
            created_at = _as_utc(doc.get("cms_created_at") or doc.get("created_at"))
            updated_at = _as_utc(doc.get("cms_updated_at") or doc.get("last_updated_at") or doc.get("updated_at"))
            if created_at and created_at >= recent_cutoff:
                new_items += 1
            if updated_at:
                recent_updated_items.append((updated_at, doc))

            category_path = _extract_item_category_path(doc, category_lookup)
            category_label = " / ".join(category_path) if category_path else "Uncategorized"
            category_counter[category_label] += 1

        recent_updated_items.sort(key=lambda row: row[0], reverse=True)
        client_id = str(current_client.get("_id", ""))
        open_remarks = await db.cms_customer_item_comments.count_documents(
            {"client_id": client_id, "status": {"$in": ["new", "under_review"]}, "is_active": True}
        )
        total_remarks = await db.cms_customer_item_comments.count_documents(
            {"client_id": client_id, "is_active": True}
        )

        return {
            "success": True,
            "data": {
                "metrics": {
                    "active_items": active_items,
                    "new_items_last_30_days": new_items,
                    "items_with_my_remarks": total_remarks,
                    "open_remarks": open_remarks,
                },
                "items_by_category": [
                    {"category": category, "count": count}
                    for category, count in category_counter.most_common(12)
                ],
                "recently_updated_items": [
                    {
                        "id": str(doc.get("_id", "")),
                        "title": str(doc.get("cms_title", "")).strip() or _first_text(doc.get("Title")),
                        "code": str(doc.get("cms_code", "")).strip() or str(doc.get("Code", "")).strip(),
                        "barcode": str(doc.get("cms_barcode", "")).strip() or str(doc.get("Barcode", "")).strip(),
                        "updated_at": serialize_datetime(updated_at),
                    }
                    for updated_at, doc in recent_updated_items[:10]
                ],
            },
        }

    @router.get("/items")
    async def list_portal_items(
        search: str = Query(default="", max_length=120),
        category_1: Optional[str] = Query(default=None, max_length=255),
        category_2: Optional[str] = Query(default=None, max_length=255),
        category_3: Optional[str] = Query(default=None, max_length=255),
        created_since_days: Optional[int] = Query(default=None, ge=1, le=3650),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
        sort_by: str = Query(default="updated_at", pattern="^(title|code|barcode|created_at|updated_at)$"),
        sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        category_lookup = await _load_category_lookup(db)
        scope_spec = _build_scope_spec(current_client, category_lookup)
        query_parts: List[Dict[str, Any]] = [_build_active_scope_query(scope_spec)]
        if category_1:
            query_parts.append({"Category_1": category_1})
        if category_2:
            query_parts.append({"Category_2": category_2})
        if category_3:
            query_parts.append({"Category_3": category_3})
        if created_since_days:
            cutoff = datetime.now(timezone.utc) - timedelta(days=created_since_days)
            cutoff_iso = cutoff.isoformat()
            # Prefer the activation timestamp (cms_activated_at); fall back to
            # cms_updated_at / created_at for legacy products without it.
            query_parts.append(
                {
                    "$or": [
                        {"cms_activated_at": {"$gte": cutoff_iso}},
                        {"cms_activated_at": {"$gte": cutoff}},
                        {"$and": [
                            {"$or": [{"cms_activated_at": {"$exists": False}}, {"cms_activated_at": ""}]},
                            {"$or": [
                                {"cms_updated_at": {"$gte": cutoff_iso}},
                                {"cms_updated_at": {"$gte": cutoff}},
                                {"cms_created_at": {"$gte": cutoff}},
                                {"created_at": {"$gte": cutoff}},
                            ]},
                        ]},
                    ]
                }
            )
        if search.strip():
            pattern = {"$regex": search.strip(), "$options": "i"}
            query_parts.append(
                {
                    "$or": [
                        {"cms_title": pattern},
                        {"Title": pattern},
                        {"cms_code": pattern},
                        {"Code": pattern},
                        {"cms_barcode": pattern},
                        {"Barcode": pattern},
                        {"cms_brand": pattern},
                        {"Brand": pattern},
                    ]
                }
            )
        query = _and_query(*query_parts)

        sort_map = {
            "title": ("cms_title", 1 if sort_order == "asc" else -1),
            "code": ("cms_code", 1 if sort_order == "asc" else -1),
            "barcode": ("cms_barcode", 1 if sort_order == "asc" else -1),
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
        return {
            "success": True,
            "data": [_serialize_portal_item(doc, category_lookup) for doc in docs],
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
        }

    @router.get("/items/{item_id}")
    async def get_portal_item(
        item_id: str,
        response: Response,
        preview_bypass: str = Query(default="", max_length=64),
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        if not ObjectId.is_valid(item_id):
            raise HTTPException(status_code=404, detail="Item not found")
        doc = await db.products.find_one({"_id": ObjectId(item_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Item not found")
        category_lookup = await _load_category_lookup(db)
        scope_spec = _build_scope_spec(current_client, category_lookup)
        if not _item_in_scope(doc, scope_spec, category_lookup):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        # The detail preview must bypass CDN/browser cache so editors always see fresh text and media.
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return {
            "success": True,
            "data": _serialize_portal_item(
                doc,
                category_lookup,
                cache_buster=preview_bypass.strip(),
            ),
        }

    @router.get("/categories")
    async def list_portal_categories(
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        category_lookup = await _load_category_lookup(db)
        scope_spec = _build_scope_spec(current_client, category_lookup)
        docs = await db.products.find(
            _build_active_scope_query(scope_spec),
            {"Category_1": 1, "Category_2": 1, "Category_3": 1, "cms_category_id": 1},
        ).to_list(length=None)

        counts: Dict[Tuple[str, ...], int] = defaultdict(int)
        for doc in docs:
            path = _extract_item_category_path(doc, category_lookup)
            if not path:
                continue
            for index in range(len(path)):
                counts[tuple(path[: index + 1])] += 1

        rows = []
        for path, count in sorted(counts.items(), key=lambda row: (len(row[0]), list(row[0]))):
            rows.append(
                {
                    "level": len(path),
                    "category_1": path[0] if len(path) > 0 else "",
                    "category_2": path[1] if len(path) > 1 else "",
                    "category_3": path[2] if len(path) > 2 else "",
                    "label": " / ".join(path),
                    "items_count": count,
                }
            )

        return {"success": True, "data": rows}

    @router.get("/comments")
    async def list_portal_comments(
        item_id: Optional[str] = Query(default=None),
        status_filter: str = Query(default="all", pattern="^(all|new|under_review|resolved)$"),
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {
            "client_id": str(current_client.get("_id", "")),
            "is_active": True,
        }
        if item_id:
            query["item_id"] = item_id
        if status_filter != "all":
            query["status"] = status_filter
        docs = (
            await db.cms_customer_item_comments.find(query)
            .sort("created_at", -1)
            .to_list(length=200)
        )
        return {
            "success": True,
            "data": [
                {
                    "id": str(doc.get("_id", "")),
                    "item_id": str(doc.get("item_id", "")),
                    "item_barcode": str(doc.get("item_barcode", "")).strip(),
                    "item_title_snapshot": str(doc.get("item_title_snapshot", "")).strip(),
                    "comment_text": str(doc.get("comment_text", "")).strip(),
                    "comment_type": str(doc.get("comment_type", "")).strip(),
                    "status": str(doc.get("status", "new")).strip() or "new",
                    "admin_response": str(doc.get("admin_response", "")).strip(),
                    "resolution_note": str(doc.get("resolution_note", "")).strip(),
                    "created_at": serialize_datetime(doc.get("created_at")),
                    "updated_at": serialize_datetime(doc.get("updated_at")),
                }
                for doc in docs
            ],
        }

    @router.post("/items/{item_id}/comments")
    async def create_portal_comment(
        item_id: str,
        payload: PortalCommentPayload,
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        if not ObjectId.is_valid(item_id):
            raise HTTPException(status_code=404, detail="Item not found")
        item_doc = await db.products.find_one({"_id": ObjectId(item_id)})
        if not item_doc:
            raise HTTPException(status_code=404, detail="Item not found")

        category_lookup = await _load_category_lookup(db)
        scope_spec = _build_scope_spec(current_client, category_lookup)
        if not _item_in_scope(item_doc, scope_spec, category_lookup):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

        now = datetime.now(timezone.utc)
        portal_item = _serialize_portal_item(item_doc, category_lookup)
        document = {
            "item_id": item_id,
            "item_barcode": portal_item["barcode"],
            "item_title_snapshot": portal_item["title"],
            "client_id": str(current_client.get("_id", "")),
            "client_name_snapshot": str(current_client.get("name", "")).strip(),
            "client_email_snapshot": str(current_client.get("email", "")).strip(),
            "comment_text": payload.comment_text.strip(),
            "comment_type": str(payload.comment_type or "generic_remark").strip() or "generic_remark",
            "status": "new",
            "admin_response": "",
            "resolution_note": "",
            "created_at": now,
            "updated_at": now,
            "created_by": str(current_client.get("api_username", "")).strip() or str(current_client.get("email", "")).strip(),
            "updated_by": "",
            "resolved_at": None,
            "resolved_by": "",
            "is_active": True,
        }
        result = await db.cms_customer_item_comments.insert_one(document)

        await log_cms_audit_event(
            db,
            action="customer_remark_created",
            entity_type="customer_remark",
            entity_id=str(result.inserted_id),
            user={
                "_id": str(current_client.get("_id", "")),
                "email": str(current_client.get("email", "")).strip(),
                "full_name": str(current_client.get("name", "")).strip(),
            },
            metadata={
                "item_id": item_id,
                "barcode": portal_item["barcode"],
                "title": portal_item["title"],
                "comment_type": document["comment_type"],
            },
        )

        return {
            "success": True,
            "data": {
                "id": str(result.inserted_id),
                "status": "new",
                "item_id": item_id,
            },
        }

    return router
