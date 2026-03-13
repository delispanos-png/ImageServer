from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from cms_permissions import get_current_cms_user, require_cms_permissions


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


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
    brand: str = ""
    unit: str = ""
    status: str = Field(default="active", pattern="^(active|inactive)$")
    main_image: str = ""


def _serialize_category(doc: Dict[str, Any], items_count: int = 0) -> Dict[str, Any]:
    return {
        "id": str(doc["_id"]),
        "parent_id": str(doc["parent_id"]) if doc.get("parent_id") else None,
        "name": doc.get("name", ""),
        "slug": doc.get("slug", ""),
        "description": doc.get("description", ""),
        "is_active": bool(doc.get("is_active", True)),
        "items_count": items_count,
        "created_by": doc.get("created_by", ""),
        "updated_by": doc.get("updated_by", ""),
        "created_at": doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", ""),
    }


def _map_product_to_cms_item(
    doc: Dict[str, Any], category_lookup: Dict[str, Dict[str, Any]]
) -> Dict[str, Any]:
    category_id = str(doc.get("cms_category_id", "")).strip()
    category = category_lookup.get(category_id)
    legacy_title = _first_text(doc.get("Title"))
    legacy_description = _first_text(doc.get("Description"))
    legacy_main_image = _first_text(doc.get("Image_url")) or str(doc.get("Img_src", "")).strip()

    title = str(doc.get("cms_title", "")).strip() or legacy_title
    code = str(doc.get("cms_code", "")).strip() or str(doc.get("Code", "")).strip() or str(doc.get("Barcode", "")).strip()
    sku = str(doc.get("cms_sku", "")).strip() or str(doc.get("SKU", "")).strip()
    barcode = str(doc.get("cms_barcode", "")).strip() or str(doc.get("Barcode", "")).strip()
    description = str(doc.get("cms_description", "")).strip() or legacy_description
    brand = str(doc.get("cms_brand", "")).strip() or str(doc.get("Brand", "")).strip()
    unit = str(doc.get("cms_unit", "")).strip()
    main_image = str(doc.get("cms_main_image", "")).strip() or legacy_main_image
    slug = str(doc.get("cms_slug", "")).strip() or _slugify(title or code or barcode)
    status = str(doc.get("cms_status", "")).strip() or "active"

    if not category:
        fallback_parts = [
            str(doc.get("Category_1", "")).strip(),
            str(doc.get("Category_2", "")).strip(),
            str(doc.get("Category_3", "")).strip(),
        ]
        fallback_parts = [part for part in fallback_parts if part]
        category_name = " / ".join(fallback_parts)
    else:
        category_name = category.get("name", "")

    return {
        "id": str(doc["_id"]),
        "title": title,
        "slug": slug,
        "code": code,
        "sku": sku,
        "barcode": barcode,
        "description": description,
        "brand": brand,
        "unit": unit,
        "status": status,
        "main_image": main_image,
        "category_id": category_id or None,
        "category_name": category_name,
        "created_by": doc.get("cms_created_by", ""),
        "updated_by": doc.get("cms_updated_by", ""),
        "created_at": doc.get("cms_created_at", "") or doc.get("created_at", ""),
        "updated_at": doc.get("cms_updated_at", "") or doc.get("last_updated_at", "") or doc.get("updated_at", ""),
    }


async def _load_category_lookup(db) -> Dict[str, Dict[str, Any]]:
    docs = await db.cms_categories.find({}).to_list(length=None)
    return {str(doc["_id"]): _serialize_category(doc) for doc in docs}


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
        page: Optional[int] = Query(default=None, ge=1),
        per_page: Optional[int] = Query(default=None, ge=1, le=100),
        sort_by: str = Query(default="name"),
        sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if is_active is not None:
            query["is_active"] = is_active
        if parent_id == "root":
            query["parent_id"] = None
        elif parent_id:
            query["parent_id"] = _ensure_object_id(parent_id)
        if search.strip():
            query["$or"] = [
                {"name": {"$regex": search.strip(), "$options": "i"}},
                {"slug": {"$regex": search.strip(), "$options": "i"}},
                {"description": {"$regex": search.strip(), "$options": "i"}},
            ]

        docs = await db.cms_categories.find(query).sort("name", 1).to_list(length=None)
        counts = {}
        async for row in db.products.aggregate(
            [
                {"$match": {"cms_category_id": {"$exists": True, "$ne": ""}}},
                {"$group": {"_id": "$cms_category_id", "count": {"$sum": 1}}},
            ]
        ):
            counts[str(row["_id"])] = int(row["count"])

        data = [_serialize_category(doc, counts.get(str(doc["_id"]), 0)) for doc in docs]
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
        return {"success": True, "data": _serialize_category(created)}

    @router.get(
        "/categories/{category_id}",
        dependencies=[Depends(require_cms_permissions("categories.view"))],
    )
    async def get_category(category_id: str) -> Dict[str, Any]:
        doc = await db.cms_categories.find_one({"_id": _ensure_object_id(category_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Category not found")
        count = await db.products.count_documents({"cms_category_id": str(doc["_id"])})
        return {"success": True, "data": _serialize_category(doc, count)}

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
        count = await db.products.count_documents({"cms_category_id": str(category_object_id)})
        return {"success": True, "data": _serialize_category(updated, count)}

    @router.get(
        "/items",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def list_items(
        search: str = Query(default="", max_length=120),
        status_filter: str = Query(default="all", pattern="^(all|active|inactive)$"),
        category_id: Optional[str] = None,
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
        sort_by: str = Query(default="updated_at", pattern="^(title|code|status|created_at|updated_at)$"),
        sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if status_filter != "all":
            query["cms_status"] = status_filter
        if category_id:
            query["cms_category_id"] = category_id
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

        sort_map: Dict[str, Tuple[str, int]] = {
            "title": ("cms_title", 1 if sort_order == "asc" else -1),
            "code": ("cms_code", 1 if sort_order == "asc" else -1),
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

    @router.post(
        "/items",
        dependencies=[Depends(require_cms_permissions("items.create"))],
    )
    async def create_item(
        payload: ItemPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        category_object_id = _ensure_object_id(payload.category_id) if payload.category_id else None
        if category_object_id and not await db.cms_categories.find_one({"_id": category_object_id}):
            raise HTTPException(status_code=404, detail="Category not found")

        slug = payload.slug.strip() if payload.slug else _slugify(payload.title)
        now = _utcnow()
        document: Dict[str, Any] = {
            "Barcode": payload.barcode.strip(),
            "Title": payload.title.strip(),
            "Description": payload.description.strip(),
            "Brand": payload.brand.strip(),
            "Image_url": [payload.main_image.strip()] if payload.main_image.strip() else [],
            "cms_title": payload.title.strip(),
            "cms_slug": slug,
            "cms_code": payload.code.strip(),
            "cms_sku": payload.sku.strip(),
            "cms_barcode": payload.barcode.strip(),
            "cms_description": payload.description.strip(),
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
        return {"success": True, "data": _map_product_to_cms_item(created, category_lookup)}

    @router.get(
        "/items/{item_id}",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def get_item(item_id: str) -> Dict[str, Any]:
        doc = await db.products.find_one({"_id": _ensure_object_id(item_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Item not found")
        category_lookup = await _load_category_lookup(db)
        return {"success": True, "data": _map_product_to_cms_item(doc, category_lookup)}

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
        if category_object_id and not await db.cms_categories.find_one({"_id": category_object_id}):
            raise HTTPException(status_code=404, detail="Category not found")

        slug = payload.slug.strip() if payload.slug else _slugify(payload.title)
        updates = {
            "Barcode": payload.barcode.strip(),
            "Title": payload.title.strip(),
            "Description": payload.description.strip(),
            "Brand": payload.brand.strip(),
            "Image_url": [payload.main_image.strip()] if payload.main_image.strip() else [],
            "cms_title": payload.title.strip(),
            "cms_slug": slug,
            "cms_code": payload.code.strip(),
            "cms_sku": payload.sku.strip(),
            "cms_barcode": payload.barcode.strip(),
            "cms_description": payload.description.strip(),
            "cms_brand": payload.brand.strip(),
            "cms_unit": payload.unit.strip(),
            "cms_status": payload.status,
            "cms_main_image": payload.main_image.strip(),
            "cms_category_id": str(category_object_id) if category_object_id else "",
            "cms_updated_by": current_user.get("email", ""),
            "cms_updated_at": _utcnow(),
        }

        field_pairs = [
            ("title", existing.get("cms_title") or _first_text(existing.get("Title")), payload.title.strip()),
            ("code", existing.get("cms_code") or str(existing.get("Code", "")).strip(), payload.code.strip()),
            ("sku", existing.get("cms_sku") or str(existing.get("SKU", "")).strip(), payload.sku.strip()),
            ("barcode", existing.get("cms_barcode") or str(existing.get("Barcode", "")).strip(), payload.barcode.strip()),
            ("description", existing.get("cms_description") or _first_text(existing.get("Description")), payload.description.strip()),
            ("brand", existing.get("cms_brand") or str(existing.get("Brand", "")).strip(), payload.brand.strip()),
            ("unit", existing.get("cms_unit", ""), payload.unit.strip()),
            ("status", existing.get("cms_status") or "active", payload.status),
            ("main_image", existing.get("cms_main_image") or _first_text(existing.get("Image_url")) or str(existing.get("Img_src", "")).strip(), payload.main_image.strip()),
            ("category_id", str(existing.get("cms_category_id", "")).strip(), str(category_object_id) if category_object_id else ""),
        ]

        await db.products.update_one({"_id": item_object_id}, {"$set": updates})
        for field_name, old_value, new_value in field_pairs:
            if (old_value or "") != (new_value or ""):
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
        return {"success": True, "data": _map_product_to_cms_item(updated, category_lookup)}

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
            }
            for doc in docs
        ]
        return {"success": True, "data": data}

    return router
