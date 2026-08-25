"""CMS router for duplicate-barcode review and merge.

`detect_duplicate_products.py` produces a `duplicate_candidates`
collection. Admins use this router to:

  - browse candidate groups (sorted by impact)
  - inspect a group's individual products
  - merge a group: keep one product, retire the rest, append their
    barcodes to the keeper's `barcode_aliases`
  - dismiss false positives (different products with similar names)
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from cms_permissions import require_cms_permissions


STATUS_PENDING = "pending"
STATUS_MERGED = "merged"
STATUS_DISMISSED = "dismissed"
STATUS_STALE = "stale"


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class MergePayload(BaseModel):
    keeper_barcode: str = Field(min_length=1)
    retire_barcodes: List[str] = Field(default_factory=list)


class DismissPayload(BaseModel):
    reason: str = ""


def _serialize(doc: Dict[str, Any]) -> Dict[str, Any]:
    doc["_id"] = str(doc["_id"])
    return doc


def create_cms_duplicates_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/duplicates", tags=["cms-duplicates"])

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("duplicates.view"))],
    )
    async def list_endpoint(
        status: Optional[str] = Query(default="pending"),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=200),
        sort_field: str = Query(default="barcode_count"),
        sort_dir: int = Query(default=-1),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if status and status != "all":
            query["status"] = status
        allowed = {"barcode_count", "items_active_count", "items_with_image", "first_seen_at", "last_scanned_at"}
        if sort_field not in allowed:
            sort_field = "barcode_count"
        if sort_dir not in (-1, 1):
            sort_dir = -1
        total = await db.duplicate_candidates.count_documents(query)
        cursor = (
            db.duplicate_candidates.find(query)
            .sort(sort_field, sort_dir)
            .skip(max(0, int(skip)))
            .limit(max(1, min(int(limit), 200)))
        )
        items = [_serialize(doc) async for doc in cursor]
        return {"total": total, "items": items}

    @router.get(
        "/{group_id}/products",
        dependencies=[Depends(require_cms_permissions("duplicates.view"))],
    )
    async def group_products_endpoint(group_id: str) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(group_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="group not found") from exc
        group = await db.duplicate_candidates.find_one({"_id": oid})
        if not group:
            raise HTTPException(status_code=404, detail="group not found")
        barcodes = list(group.get("barcodes") or [])
        if not barcodes:
            return {"group": _serialize(group), "products": []}
        projection = {
            "Barcode": 1, "Title": 1, "cms_title": 1, "cms_status": 1,
            "cms_description": 1, "Brand": 1, "Category_1": 1, "Category_2": 1,
            "Img_src": 1, "Image_Path": 1, "cms_updated_at": 1,
            "barcode_aliases": 1, "_id": 0,
        }
        products = await db.products.find({"Barcode": {"$in": barcodes}}, projection).to_list(length=len(barcodes))
        return {"group": _serialize(group), "products": products}

    @router.post(
        "/{group_id}/merge",
        dependencies=[Depends(require_cms_permissions("duplicates.update"))],
    )
    async def merge_endpoint(group_id: str, payload: MergePayload) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(group_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="group not found") from exc

        group = await db.duplicate_candidates.find_one({"_id": oid})
        if not group:
            raise HTTPException(status_code=404, detail="group not found")

        keeper_bc = str(payload.keeper_barcode).strip()
        retire = [str(b).strip() for b in payload.retire_barcodes if str(b).strip() and str(b).strip() != keeper_bc]
        if not keeper_bc or not retire:
            raise HTTPException(status_code=422, detail="keeper_barcode and at least one retire_barcodes required")

        keeper = await db.products.find_one({"Barcode": keeper_bc})
        if not keeper:
            raise HTTPException(status_code=404, detail=f"keeper barcode {keeper_bc} not found")

        retired_docs = await db.products.find({"Barcode": {"$in": retire}}).to_list(length=len(retire))
        retired_found = {str(d.get("Barcode") or "").strip() for d in retired_docs}
        missing = set(retire) - retired_found
        if missing:
            raise HTTPException(status_code=404, detail=f"retire barcodes not found: {sorted(missing)}")

        now = _utcnow_iso()
        # Update keeper: extend aliases, log the merge.
        existing_aliases = keeper.get("barcode_aliases") or []
        if not isinstance(existing_aliases, list):
            existing_aliases = []
        new_aliases = list(existing_aliases)
        for bc in retire:
            if bc not in new_aliases:
                new_aliases.append(bc)
        await db.products.update_one(
            {"Barcode": keeper_bc},
            {"$set": {
                "barcode_aliases": new_aliases,
                "last_merged_at": now,
                "last_merged_by": "cms:duplicates:merge",
            }},
        )

        # Audit-log each retired product before deletion.
        for d in retired_docs:
            d_clean = {k: v for k, v in d.items() if k != "_id"}
            await db.cms_retired_products.insert_one({
                "retired_at": now,
                "retired_by": "cms:duplicates:merge",
                "into_barcode": keeper_bc,
                "product_snapshot": d_clean,
            })
        delete_result = await db.products.delete_many({"Barcode": {"$in": retire}})

        await db.duplicate_candidates.update_one(
            {"_id": oid},
            {"$set": {
                "status": STATUS_MERGED,
                "resolved_at": now,
                "keeper_barcode": keeper_bc,
                "retired_barcodes": retire,
            }},
        )
        return {
            "status": STATUS_MERGED,
            "keeper": keeper_bc,
            "retired": retire,
            "retired_deleted": delete_result.deleted_count,
        }

    @router.post(
        "/{group_id}/dismiss",
        dependencies=[Depends(require_cms_permissions("duplicates.update"))],
    )
    async def dismiss_endpoint(group_id: str, payload: DismissPayload) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(group_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="group not found") from exc
        result = await db.duplicate_candidates.update_one(
            {"_id": oid},
            {"$set": {
                "status": STATUS_DISMISSED,
                "resolved_at": _utcnow_iso(),
                "dismiss_reason": payload.reason,
            }},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="group not found")
        return {"status": STATUS_DISMISSED}

    @router.delete(
        "/{group_id}",
        dependencies=[Depends(require_cms_permissions("duplicates.update"))],
    )
    async def delete_endpoint(group_id: str) -> Dict[str, Any]:
        from bson import ObjectId
        try:
            oid = ObjectId(group_id)
        except Exception as exc:
            raise HTTPException(status_code=404, detail="group not found") from exc
        result = await db.duplicate_candidates.delete_one({"_id": oid})
        return {"deleted": result.deleted_count}

    return router
