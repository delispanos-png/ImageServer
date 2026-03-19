from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from cms_activity import log_cms_audit_event, serialize_datetime
from cms_permissions import get_current_cms_user, require_cms_permissions


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Record not found") from exc


class CustomerRemarkUpdatePayload(BaseModel):
    status: str = Field(pattern="^(new|under_review|resolved)$")
    admin_response: str = ""
    resolution_note: str = ""


def _serialize_remark(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc.get("_id", "")),
        "item_id": str(doc.get("item_id", "")),
        "item_barcode": str(doc.get("item_barcode", "")).strip(),
        "item_title_snapshot": str(doc.get("item_title_snapshot", "")).strip(),
        "client_id": str(doc.get("client_id", "")),
        "client_name_snapshot": str(doc.get("client_name_snapshot", "")).strip(),
        "client_email_snapshot": str(doc.get("client_email_snapshot", "")).strip(),
        "comment_text": str(doc.get("comment_text", "")).strip(),
        "comment_type": str(doc.get("comment_type", "")).strip(),
        "status": str(doc.get("status", "new")).strip() or "new",
        "admin_response": str(doc.get("admin_response", "")).strip(),
        "resolution_note": str(doc.get("resolution_note", "")).strip(),
        "created_at": serialize_datetime(doc.get("created_at")),
        "updated_at": serialize_datetime(doc.get("updated_at")),
        "resolved_at": serialize_datetime(doc.get("resolved_at")),
        "resolved_by": str(doc.get("resolved_by", "")).strip(),
    }


def create_cms_customer_remarks_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/customer-remarks", tags=["cms-customer-remarks"])

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("clients.view"))],
    )
    async def list_customer_remarks(
        search: str = Query(default="", max_length=120),
        status_filter: str = Query(default="all", pattern="^(all|new|under_review|resolved)$"),
        client_id: str = Query(default="", max_length=64),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {"is_active": True}
        if status_filter != "all":
            query["status"] = status_filter
        if client_id.strip():
            query["client_id"] = client_id.strip()
        if search.strip():
            pattern = {"$regex": search.strip(), "$options": "i"}
            query["$or"] = [
                {"item_title_snapshot": pattern},
                {"item_barcode": pattern},
                {"client_name_snapshot": pattern},
                {"client_email_snapshot": pattern},
                {"comment_text": pattern},
                {"comment_type": pattern},
            ]

        total = await db.cms_customer_item_comments.count_documents(query)
        skip = (page - 1) * per_page
        docs = (
            await db.cms_customer_item_comments.find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(per_page)
            .to_list(length=per_page)
        )
        return {
            "success": True,
            "data": [_serialize_remark(doc) for doc in docs],
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
        }

    @router.put(
        "/{remark_id}",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def update_customer_remark(
        remark_id: str,
        payload: CustomerRemarkUpdatePayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        remark_object_id = _ensure_object_id(remark_id)
        existing = await db.cms_customer_item_comments.find_one({"_id": remark_object_id, "is_active": True})
        if not existing:
            raise HTTPException(status_code=404, detail="Remark not found")

        now = _utcnow()
        updates: Dict[str, Any] = {
            "status": payload.status,
            "admin_response": payload.admin_response.strip(),
            "resolution_note": payload.resolution_note.strip(),
            "updated_at": now,
            "updated_by": str(current_user.get("email", "")).strip(),
        }
        if payload.status == "resolved":
            updates["resolved_at"] = now
            updates["resolved_by"] = str(current_user.get("email", "")).strip()
        else:
            updates["resolved_at"] = None
            updates["resolved_by"] = ""

        await db.cms_customer_item_comments.update_one({"_id": remark_object_id}, {"$set": updates})
        updated = await db.cms_customer_item_comments.find_one({"_id": remark_object_id})

        await log_cms_audit_event(
            db,
            action="update_customer_remark",
            entity_type="customer_remark",
            entity_id=remark_id,
            user=current_user,
            metadata={
                "item_id": str(existing.get("item_id", "")),
                "barcode": str(existing.get("item_barcode", "")).strip(),
                "status": payload.status,
                "comment_type": str(existing.get("comment_type", "")).strip(),
            },
        )

        return {"success": True, "data": _serialize_remark(updated or existing)}

    return router
