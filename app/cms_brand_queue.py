"""CMS router for the brand-sync queued items (medium-confidence matches).

Brand sync collects products from manufacturer catalogs that look new but
lack a barcode match in our DB. Without a barcode they can't be safely
auto-imported, so they land here for an admin to review, edit, and
promote to db.products — or to dismiss as duplicates.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from catalog_quality import build_catalog_quality_updates
from cms_permissions import require_cms_permissions


STATUS_PENDING = "pending"
STATUS_APPROVED = "approved"
STATUS_DISMISSED = "dismissed"
STATUS_DUPLICATE = "duplicate"
ALL_STATUSES = (STATUS_PENDING, STATUS_APPROVED, STATUS_DISMISSED, STATUS_DUPLICATE)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class ApprovePayload(BaseModel):
    barcode: str = Field(min_length=4)
    title: Optional[str] = None
    description: str = ""
    category_1: Optional[str] = None
    category_2: Optional[str] = None
    category_3: Optional[str] = None


class DismissPayload(BaseModel):
    reason: str = ""


class BulkActionPayload(BaseModel):
    queue_ids: List[str] = Field(default_factory=list)
    action: str = Field(pattern="^(dismiss|delete)$")
    reason: str = ""


def _serialize(doc: Dict[str, Any]) -> Dict[str, Any]:
    doc["_id"] = str(doc["_id"])
    return doc


def create_cms_brand_queue_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/brand-queue", tags=["cms-brand-queue"])

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("brand_queue.view"))],
    )
    async def list_endpoint(
        status: Optional[str] = Query(default="pending"),
        brand: Optional[str] = Query(default=None),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=200),
        sort_field: str = Query(default="seen_count"),
        sort_dir: int = Query(default=-1),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if status and status != "all":
            if status not in ALL_STATUSES:
                raise HTTPException(status_code=422, detail=f"invalid status {status!r}")
            query["status"] = status
        if brand:
            query["brand"] = brand
        allowed_sort = {"seen_count", "last_seen_at", "first_seen_at", "brand"}
        if sort_field not in allowed_sort:
            sort_field = "seen_count"
        if sort_dir not in (-1, 1):
            sort_dir = -1
        total = await db.pending_brand_imports.count_documents(query)
        cursor = (
            db.pending_brand_imports.find(query)
            .sort(sort_field, sort_dir)
            .skip(max(0, int(skip)))
            .limit(max(1, min(int(limit), 200)))
        )
        items = [_serialize(doc) async for doc in cursor]
        return {"total": total, "items": items}

    @router.post(
        "/{queue_id}/approve",
        dependencies=[Depends(require_cms_permissions("brand_queue.update"))],
    )
    async def approve_endpoint(queue_id: str, payload: ApprovePayload) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(queue_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="queue item not found") from exc

        queue_doc = await db.pending_brand_imports.find_one({"_id": oid})
        if not queue_doc:
            raise HTTPException(status_code=404, detail="queue item not found")

        bc = str(payload.barcode).strip()
        if not bc.isdigit() or len(bc) < 4:
            raise HTTPException(status_code=422, detail="barcode must be numeric (4+ digits)")

        existing_product = await db.products.find_one({"Barcode": bc})
        if existing_product:
            # Treat as duplicate — admin can dismiss the queue row, or merge manually.
            await db.pending_brand_imports.update_one(
                {"_id": oid},
                {"$set": {"status": STATUS_DUPLICATE, "resolved_at": _utcnow_iso(),
                          "resolved_to_barcode": bc}},
            )
            return {"status": STATUS_DUPLICATE, "barcode": bc, "existing_product_id": str(existing_product.get("_id"))}

        title = (payload.title or queue_doc.get("title") or "").strip()
        cats = queue_doc.get("categories") or {}
        c1 = (payload.category_1 if payload.category_1 is not None else cats.get("Category_1") or "").strip()
        c2 = (payload.category_2 if payload.category_2 is not None else cats.get("Category_2") or "").strip()
        c3 = (payload.category_3 if payload.category_3 is not None else cats.get("Category_3") or "").strip()
        description = payload.description.strip()
        brand_name = str(queue_doc.get("brand") or "")
        now = _utcnow_iso()

        new_product: Dict[str, Any] = {
            "Barcode": bc,
            "Site_Id": f"{brand_name}_queue_{bc}",
            "Site": brand_name,
            "Title": title,
            "Description": description,
            "Brand": title.split()[0] if title else brand_name,
            "Category_1": c1,
            "Category_2": c2,
            "Category_3": c3,
            "Img_src": str(queue_doc.get("image") or ""),
            "Img_src_List": [str(queue_doc.get("image"))] if queue_doc.get("image") else [],
            "Product_Link": str(queue_doc.get("source_url") or ""),
            "Other_Sites": {},
            "cms_barcode": bc,
            "cms_title": title,
            "cms_brand": title.split()[0] if title else brand_name,
            "cms_description": description,
            "cms_description_html": f"<p>{description}</p>" if description else "",
            "cms_status": "inactive",
            "cms_main_image": "",
            "cms_updated_at": now,
            "cms_updated_by": "cms:brand_queue:approve",
            "category_source_domain": brand_name,
            "text_source_domain": brand_name,
            "image_source_domain": brand_name,
            "image_processing_version": f"{brand_name}_queue_v1",
            "watermark_cleanup_applied": False,
            "image_reprocessed_at": now,
            "brand_enrichment_source": "cms:brand_queue:approve",
            "brand_enrichment_at": now,
        }
        new_product.update(build_catalog_quality_updates(new_product, evaluator="cms:brand_queue:approve"))

        # Upsert αντί για insert — το Barcode_unique partial index δεν επιτρέπει
        # διπλά. Αν υπάρχει ήδη product με το ίδιο barcode, κάνουμε refresh
        # στα brand-queue πεδία διατηρώντας _id + created metadata.
        existing = await db.products.find_one({"Barcode": bc})
        if existing:
            preserved = {k for k in ("_id", "created_at", "cms_created_by", "cms_created_at") if k in existing}
            updates = {k: v for k, v in new_product.items() if v not in (None, "", [], {}) and k not in preserved}
            await db.products.update_one({"_id": existing["_id"]}, {"$set": updates})
            final_id = existing["_id"]
        else:
            insert_result = await db.products.insert_one(new_product)
            final_id = insert_result.inserted_id
        await db.pending_brand_imports.update_one(
            {"_id": oid},
            {"$set": {"status": STATUS_APPROVED, "resolved_at": now,
                      "resolved_to_barcode": bc}},
        )
        new_product["_id"] = str(final_id)
        return {"status": STATUS_APPROVED, "barcode": bc, "product": new_product}

    @router.post(
        "/{queue_id}/dismiss",
        dependencies=[Depends(require_cms_permissions("brand_queue.update"))],
    )
    async def dismiss_endpoint(queue_id: str, payload: DismissPayload) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(queue_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="queue item not found") from exc
        result = await db.pending_brand_imports.update_one(
            {"_id": oid},
            {"$set": {"status": STATUS_DISMISSED, "resolved_at": _utcnow_iso(),
                      "dismiss_reason": payload.reason}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="queue item not found")
        return {"status": STATUS_DISMISSED}

    @router.delete(
        "/{queue_id}",
        dependencies=[Depends(require_cms_permissions("brand_queue.update"))],
    )
    async def delete_endpoint(queue_id: str) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(queue_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="queue item not found") from exc
        result = await db.pending_brand_imports.delete_one({"_id": oid})
        return {"deleted": result.deleted_count}

    @router.post(
        "/bulk",
        dependencies=[Depends(require_cms_permissions("brand_queue.update"))],
    )
    async def bulk_endpoint(payload: BulkActionPayload) -> Dict[str, Any]:
        from bson import ObjectId
        oids: List[ObjectId] = []
        for raw in payload.queue_ids:
            try:
                oids.append(ObjectId(raw))
            except Exception:
                # skip invalid ids silently — they probably came from a stale UI page
                continue
        if not oids:
            return {"action": payload.action, "matched": 0, "modified": 0}
        if payload.action == "dismiss":
            result = await db.pending_brand_imports.update_many(
                {"_id": {"$in": oids}, "status": STATUS_PENDING},
                {"$set": {"status": STATUS_DISMISSED, "resolved_at": _utcnow_iso(),
                          "dismiss_reason": payload.reason}},
            )
            return {"action": "dismiss", "matched": result.matched_count, "modified": result.modified_count}
        # action == "delete"
        result = await db.pending_brand_imports.delete_many({"_id": {"$in": oids}})
        return {"action": "delete", "matched": result.deleted_count, "modified": result.deleted_count}

    return router
