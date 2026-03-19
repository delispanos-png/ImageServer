from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from cms_activity import log_cms_audit_event, serialize_notification_event, utcnow
from cms_permissions import get_current_cms_user, require_cms_permissions


def _parse_date(value: Optional[str], end_of_day: bool = False) -> Optional[datetime]:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        parsed = datetime.fromisoformat(f"{value}T23:59:59+00:00" if end_of_day else f"{value}T00:00:00+00:00")
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


async def _load_category_lookup(db) -> Dict[str, str]:
    docs = await db.cms_categories.find({}, {"_id": 1, "name": 1}).to_list(length=None)
    return {str(doc["_id"]): str(doc.get("name", "")).strip() for doc in docs}


def _ensure_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=404, detail="Event not found") from exc


def create_cms_notifications_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/notifications", tags=["cms-notifications"])

    @router.get(
        "/events",
        dependencies=[Depends(require_cms_permissions("notifications.view"))],
    )
    async def list_notification_events(
        search: str = Query(default="", max_length=120),
        event_type: str = Query(default="", max_length=80),
        status_filter: str = Query(default="all", pattern="^(all|pending|published)$"),
        date_from: str = Query(default=""),
        date_to: str = Query(default=""),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if event_type.strip():
            query["event_type"] = event_type.strip()
        if status_filter != "all":
            query["status"] = status_filter
        created_at_filters: Dict[str, Any] = {}
        if parsed_from := _parse_date(date_from):
            created_at_filters["$gte"] = parsed_from
        if parsed_to := _parse_date(date_to, end_of_day=True):
            created_at_filters["$lte"] = parsed_to
        if created_at_filters:
            query["created_at"] = created_at_filters

        docs = (
            await db.cms_notification_events.find(query)
            .sort("created_at", -1)
            .to_list(length=None)
        )
        category_lookup = await _load_category_lookup(db)
        data = [serialize_notification_event(doc, category_lookup) for doc in docs]

        if search.strip():
            needle = search.strip().lower()
            data = [
                row
                for row in data
                if needle in row.get("item_title", "").lower()
                or needle in row.get("item_code", "").lower()
                or needle in row.get("item_barcode", "").lower()
                or needle in row.get("category_name", "").lower()
                or needle in row.get("payload_preview", "").lower()
            ]

        total = len(data)
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

    @router.post(
        "/events/{event_id}/publish",
        dependencies=[Depends(require_cms_permissions("notifications.publish"))],
    )
    async def publish_notification_event(
        event_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        event_object_id = _ensure_object_id(event_id)
        existing = await db.cms_notification_events.find_one({"_id": event_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Notification event not found")

        if str(existing.get("status", "")).strip() == "published":
            category_lookup = await _load_category_lookup(db)
            return {"success": True, "data": serialize_notification_event(existing, category_lookup)}

        published_at = utcnow()
        await db.cms_notification_events.update_one(
            {"_id": event_object_id},
            {"$set": {"status": "published", "published_at": published_at}},
        )
        updated = await db.cms_notification_events.find_one({"_id": event_object_id})
        await log_cms_audit_event(
            db,
            action="publish_notification",
            entity_type="notification_event",
            entity_id=event_id,
            user=current_user,
            metadata={
                "event_type": updated.get("event_type", ""),
                "item_id": updated.get("item_id", ""),
                "category_id": updated.get("category_id", ""),
            },
        )
        return {"success": True, "data": serialize_notification_event(updated, await _load_category_lookup(db))}

    return router
