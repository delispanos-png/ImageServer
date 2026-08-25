from __future__ import annotations

import re
import time
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from bson import ObjectId
from fastapi import APIRouter, Body, Depends, HTTPException, Query

from cms_activity import log_cms_audit_event, serialize_notification_event, utcnow
from cms_permissions import get_current_cms_user, require_cms_permissions


# Channels group event types by audience. The UI shows them as tabs so a
# security alert (`account_locked`) never disappears under the flood of
# catalog updates.
CHANNEL_CATALOG = "catalog"
CHANNEL_OPERATIONS = "operations"
CHANNEL_SECURITY = "security"

_CHANNEL_BY_EVENT_TYPE: Dict[str, str] = {
    "item_created": CHANNEL_CATALOG,
    "item_updated": CHANNEL_CATALOG,
    "item_activated": CHANNEL_CATALOG,
    "item_deactivated": CHANNEL_CATALOG,
    "category_changed": CHANNEL_CATALOG,
    "bulk_refresh_started": CHANNEL_OPERATIONS,
    "bulk_refresh_completed": CHANNEL_OPERATIONS,
    "brand_sync_completed": CHANNEL_OPERATIONS,
    "account_locked": CHANNEL_SECURITY,
    "watchdog_alert": CHANNEL_SECURITY,
}


def resolve_channel(event_type: str) -> str:
    return _CHANNEL_BY_EVENT_TYPE.get(str(event_type or "").strip(), CHANNEL_CATALOG)


def channel_event_types(channel: str) -> List[str]:
    return [et for et, ch in _CHANNEL_BY_EVENT_TYPE.items() if ch == channel]


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


class _CategoryLookupCache:
    """Small in-process TTL cache so a busy notifications page doesn't
    reload the whole cms_categories collection on every keystroke."""

    def __init__(self, ttl_seconds: float = 60.0) -> None:
        self._ttl = ttl_seconds
        self._lookup: Dict[str, str] = {}
        self._loaded_at: float = 0.0

    async def get(self, db) -> Dict[str, str]:
        now = time.monotonic()
        if self._lookup and (now - self._loaded_at) < self._ttl:
            return self._lookup
        docs = await db.cms_categories.find({}, {"_id": 1, "name": 1}).to_list(length=None)
        self._lookup = {str(doc["_id"]): str(doc.get("name", "")).strip() for doc in docs}
        self._loaded_at = now
        return self._lookup

    def invalidate(self) -> None:
        self._loaded_at = 0.0


_category_cache = _CategoryLookupCache(ttl_seconds=60.0)


def _ensure_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=404, detail="Event not found") from exc


def _regex_search_clause(needle: str) -> Dict[str, Any]:
    escaped = re.escape(needle.strip())
    return {
        "$or": [
            {"payload.title": {"$regex": escaped, "$options": "i"}},
            {"payload.code": {"$regex": escaped, "$options": "i"}},
            {"payload.barcode": {"$regex": escaped, "$options": "i"}},
            {"payload.category_name": {"$regex": escaped, "$options": "i"}},
        ]
    }


def _build_query(
    *,
    search: str,
    event_type: str,
    status_filter: str,
    channel: str,
    date_from: str,
    date_to: str,
) -> Dict[str, Any]:
    query: Dict[str, Any] = {}
    if event_type.strip():
        query["event_type"] = event_type.strip()
    elif channel.strip():
        types = channel_event_types(channel.strip())
        if types:
            query["event_type"] = {"$in": types}
    if status_filter != "all":
        query["status"] = status_filter
    created_at_filters: Dict[str, Any] = {}
    if parsed_from := _parse_date(date_from):
        created_at_filters["$gte"] = parsed_from
    if parsed_to := _parse_date(date_to, end_of_day=True):
        created_at_filters["$lte"] = parsed_to
    if created_at_filters:
        query["created_at"] = created_at_filters
    if search.strip():
        query.update(_regex_search_clause(search))
    return query


async def ensure_notification_indexes(db) -> None:
    """Create the indexes the list/filter/bulk endpoints depend on, plus
    a TTL that drops published events after 90 days so the collection
    doesn't grow forever."""
    coll = db.cms_notification_events
    await coll.create_index([("status", 1), ("created_at", -1)], name="status_created_idx")
    await coll.create_index([("event_type", 1), ("created_at", -1)], name="type_created_idx")
    await coll.create_index([("created_at", -1)], name="created_idx")
    # Text-ish search fields — regex still uses collection scan but at
    # least the equality filters above narrow it first.
    await coll.create_index([("payload.barcode", 1)], name="payload_barcode_idx", sparse=True)
    # TTL: after 90 days a published event is discarded. Uses
    # expireAfterSeconds on the published_at field, so pending events
    # (published_at=null) are never removed.
    try:
        await coll.create_index(
            "published_at",
            name="published_at_ttl",
            expireAfterSeconds=90 * 24 * 3600,
            partialFilterExpression={"status": "published"},
        )
    except Exception:
        # TTL creation may fail if a same-named index exists with a
        # different definition — non-fatal, safe to ignore on re-runs.
        pass


def create_cms_notifications_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/notifications", tags=["cms-notifications"])

    @router.get(
        "/summary",
        dependencies=[Depends(require_cms_permissions("notifications.view"))],
    )
    async def notifications_summary() -> Dict[str, Any]:
        """Per-channel counters so the UI can render badges on each tab."""
        by_channel: Dict[str, Dict[str, int]] = {
            CHANNEL_CATALOG: {"pending": 0, "total": 0},
            CHANNEL_OPERATIONS: {"pending": 0, "total": 0},
            CHANNEL_SECURITY: {"pending": 0, "total": 0},
        }
        pipeline = [
            {"$group": {
                "_id": {"event_type": "$event_type", "status": "$status"},
                "n": {"$sum": 1},
            }}
        ]
        cursor = await db.cms_notification_events.aggregate(pipeline)
        async for row in cursor:
            key = row.get("_id") or {}
            channel = resolve_channel(key.get("event_type", ""))
            bucket = by_channel.setdefault(channel, {"pending": 0, "total": 0})
            bucket["total"] += int(row.get("n") or 0)
            if str(key.get("status", "")).strip() == "pending":
                bucket["pending"] += int(row.get("n") or 0)
        return {"success": True, "data": {"channels": by_channel}}

    @router.get(
        "/events",
        dependencies=[Depends(require_cms_permissions("notifications.view"))],
    )
    async def list_notification_events(
        search: str = Query(default="", max_length=120),
        event_type: str = Query(default="", max_length=80),
        channel: str = Query(default="", pattern=r"^(catalog|operations|security|)$"),
        status_filter: str = Query(default="all", pattern=r"^(all|pending|published)$"),
        date_from: str = Query(default=""),
        date_to: str = Query(default=""),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
    ) -> Dict[str, Any]:
        query = _build_query(
            search=search,
            event_type=event_type,
            status_filter=status_filter,
            channel=channel,
            date_from=date_from,
            date_to=date_to,
        )
        total = await db.cms_notification_events.count_documents(query)
        skip = (page - 1) * per_page
        cursor = (
            db.cms_notification_events.find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(per_page)
        )
        docs = await cursor.to_list(length=per_page)
        category_lookup = await _category_cache.get(db)
        data = [serialize_notification_event(doc, category_lookup) for doc in docs]
        for row in data:
            row["channel"] = resolve_channel(row.get("event_type", ""))
        return {
            "success": True,
            "data": data,
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
            category_lookup = await _category_cache.get(db)
            return {"success": True, "data": serialize_notification_event(existing, category_lookup)}

        published_at = utcnow()
        await db.cms_notification_events.update_one(
            {"_id": event_object_id},
            {"$set": {
                "status": "published",
                "published_at": published_at,
                "published_by": str(current_user.get("email") or current_user.get("_id") or ""),
            }},
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
        return {"success": True, "data": serialize_notification_event(updated, await _category_cache.get(db))}

    @router.post(
        "/events/bulk-publish",
        dependencies=[Depends(require_cms_permissions("notifications.publish"))],
    )
    async def bulk_publish_notifications(
        payload: Dict[str, Any] = Body(default_factory=dict),
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        """Two modes:
          - `ids`: publish exactly this list.
          - `filter`: publish every pending event that matches the same
            filter the list endpoint accepts. This is what enables
            "publish all filtered" from the UI.
        """
        raw_ids = payload.get("ids") or []
        if raw_ids:
            object_ids = []
            for raw in raw_ids:
                try:
                    object_ids.append(ObjectId(str(raw)))
                except Exception:
                    continue
            if not object_ids:
                return {"success": True, "data": {"updated": 0}}
            query: Dict[str, Any] = {"_id": {"$in": object_ids}, "status": {"$ne": "published"}}
        else:
            f = payload.get("filter") or {}
            query = _build_query(
                search=str(f.get("search") or ""),
                event_type=str(f.get("event_type") or ""),
                status_filter="pending",  # bulk publish only touches pending
                channel=str(f.get("channel") or ""),
                date_from=str(f.get("date_from") or ""),
                date_to=str(f.get("date_to") or ""),
            )

        result = await db.cms_notification_events.update_many(
            query,
            {"$set": {
                "status": "published",
                "published_at": utcnow(),
                "published_by": str(current_user.get("email") or current_user.get("_id") or ""),
            }},
        )
        updated = int(getattr(result, "modified_count", 0))
        if updated:
            await log_cms_audit_event(
                db,
                action="bulk_publish_notifications",
                entity_type="notification_event",
                entity_id="",
                user=current_user,
                metadata={"updated": updated, "mode": "ids" if raw_ids else "filter"},
            )
        return {"success": True, "data": {"updated": updated}}

    @router.post(
        "/events/bulk-dismiss",
        dependencies=[Depends(require_cms_permissions("notifications.publish"))],
    )
    async def bulk_dismiss_notifications(
        payload: Dict[str, Any] = Body(default_factory=dict),
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        """Hard-delete events. Same two modes as bulk-publish, but the
        `filter` mode requires at least one non-empty filter field to
        avoid wiping the whole collection by accident."""
        raw_ids = payload.get("ids") or []
        if raw_ids:
            object_ids = []
            for raw in raw_ids:
                try:
                    object_ids.append(ObjectId(str(raw)))
                except Exception:
                    continue
            if not object_ids:
                return {"success": True, "data": {"deleted": 0}}
            query: Dict[str, Any] = {"_id": {"$in": object_ids}}
        else:
            f = payload.get("filter") or {}
            has_any_filter = any(
                str(f.get(k) or "").strip()
                for k in ("search", "event_type", "channel", "date_from", "date_to")
            ) or str(f.get("status_filter") or "all") != "all"
            if not has_any_filter:
                raise HTTPException(status_code=400, detail="Bulk dismiss requires at least one filter")
            query = _build_query(
                search=str(f.get("search") or ""),
                event_type=str(f.get("event_type") or ""),
                status_filter=str(f.get("status_filter") or "all"),
                channel=str(f.get("channel") or ""),
                date_from=str(f.get("date_from") or ""),
                date_to=str(f.get("date_to") or ""),
            )

        result = await db.cms_notification_events.delete_many(query)
        deleted = int(getattr(result, "deleted_count", 0))
        if deleted:
            await log_cms_audit_event(
                db,
                action="bulk_dismiss_notifications",
                entity_type="notification_event",
                entity_id="",
                user=current_user,
                metadata={"deleted": deleted, "mode": "ids" if raw_ids else "filter"},
            )
        return {"success": True, "data": {"deleted": deleted}}

    return router
