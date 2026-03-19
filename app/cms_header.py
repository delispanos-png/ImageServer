from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field

from cms_activity import parse_datetime, serialize_audit_log, serialize_notification_event
from cms_permissions import get_current_cms_user, has_cms_permission, normalize_cms_role


def _humanize(value: str) -> str:
    text = str(value or "").strip().replace("_", " ")
    return text.title() if text else ""


def _parse_created_at(value: Any) -> datetime:
    parsed = parse_datetime(value)
    if parsed:
        return parsed
    return datetime.fromtimestamp(0, tz=timezone.utc)


def _build_audit_event(log: Dict[str, Any]) -> Dict[str, Any]:
    user_label = log.get("user_name") or log.get("user_email") or "System"
    entity_type = _humanize(log.get("entity_type", ""))
    action = _humanize(log.get("action", ""))
    entity_id = str(log.get("entity_id", "")).strip()
    subtitle_parts = [part for part in [entity_type, entity_id or None, f"by {user_label}"] if part]
    route = "/audit-log"
    if str(log.get("entity_type", "")).strip().lower() == "item" and entity_id:
        route = f"/items?focus={entity_id}"
    return {
        "id": f"audit:{log.get('id', '')}",
        "source": "audit",
        "kind": str(log.get("action", "")).strip() or "audit",
        "title": action or "Audit Event",
        "subtitle": " • ".join(subtitle_parts),
        "status": "recorded",
        "created_at": log.get("created_at", ""),
        "item_id": entity_id if entity_id else "",
        "route": route,
    }


def _build_notification_event(event: Dict[str, Any]) -> Dict[str, Any]:
    item_label = event.get("item_title") or event.get("item_barcode") or event.get("item_code") or "Item"
    category_name = event.get("category_name", "")
    subtitle_parts = [item_label]
    if category_name:
        subtitle_parts.append(category_name)
    status = str(event.get("status", "")).strip() or "pending"
    item_id = str(event.get("item_id", "")).strip()
    route = f"/items?focus={item_id}" if item_id else "/notifications"
    return {
        "id": f"notification:{event.get('id', '')}",
        "source": "notification",
        "kind": str(event.get("event_type", "")).strip() or "notification",
        "title": _humanize(event.get("event_type", "")) or "Notification Event",
        "subtitle": " • ".join(part for part in subtitle_parts if part),
        "status": status,
        "created_at": event.get("created_at", ""),
        "item_id": item_id,
        "route": route,
    }


def _build_api_client_event(event: Dict[str, Any]) -> Dict[str, Any]:
    client_label = (
        str(event.get("api_domain", "")).strip()
        or str(event.get("api_username", "")).strip()
        or "API Client"
    )
    endpoint = str(event.get("endpoint", "")).strip() or "/api/products"
    request_ip = str(event.get("request_ip", "")).strip()
    subtitle_parts = [client_label, endpoint]
    if request_ip:
        subtitle_parts.append(request_ip)
    return {
        "id": f"api-client:{event.get('_id', '')}",
        "source": "api_client",
        "kind": "api_access",
        "title": "API Access",
        "subtitle": " • ".join(part for part in subtitle_parts if part),
        "status": "recorded",
        "created_at": str(event.get("created_at", "")).strip(),
        "route": "/clients",
    }


def _header_actor_id(user: Dict[str, Any]) -> str:
    return str(user.get("id") or user.get("_id") or user.get("email") or "").strip()


class HeaderEventsReadPayload(BaseModel):
    event_ids: List[str] = Field(default_factory=list, max_length=50)


def create_cms_header_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/header", tags=["cms-header"])

    @router.get("/events")
    async def get_header_events(
        limit: int = Query(default=12, ge=1, le=30),
        unread_only: bool = Query(default=True),
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        role = normalize_cms_role(current_user.get("role"))
        events: List[Dict[str, Any]] = []
        pending_notifications = 0

        if has_cms_permission(role, "notifications.view"):
            notification_docs = (
                await db.cms_notification_events.find({})
                .sort("created_at", -1)
                .limit(limit)
                .to_list(length=limit)
            )
            category_lookup_docs = await db.cms_categories.find({}, {"_id": 1, "name": 1}).to_list(length=None)
            category_lookup = {str(doc["_id"]): str(doc.get("name", "")).strip() for doc in category_lookup_docs}
            events.extend(
                _build_notification_event(serialize_notification_event(doc, category_lookup))
                for doc in notification_docs
            )
            pending_notifications = await db.cms_notification_events.count_documents({"status": "pending"})

        if has_cms_permission(role, "audit.view"):
            audit_docs = (
                await db.cms_audit_logs.find({})
                .sort("created_at", -1)
                .limit(limit)
                .to_list(length=limit)
            )
            events.extend(_build_audit_event(serialize_audit_log(doc)) for doc in audit_docs)

        if has_cms_permission(role, "clients.view"):
            client_event_docs = (
                await db.cms_client_api_events.find({})
                .sort("created_at", -1)
                .limit(limit)
                .to_list(length=limit)
            )
            events.extend(_build_api_client_event(doc) for doc in client_event_docs)

        events.sort(key=lambda event: _parse_created_at(event.get("created_at")), reverse=True)
        actor_id = _header_actor_id(current_user)
        read_event_ids: set[str] = set()
        if actor_id:
            read_docs = await db.cms_header_event_reads.find(
                {"user_id": actor_id},
                {"_id": 0, "event_id": 1},
            ).to_list(length=500)
            read_event_ids = {str(doc.get("event_id", "")).strip() for doc in read_docs if str(doc.get("event_id", "")).strip()}

        if unread_only:
            events = [event for event in events if event["id"] not in read_event_ids]

        events = events[:limit]

        return {
            "success": True,
            "data": events,
            "meta": {
                "pending_notifications": pending_notifications,
                "visible_events": len(events),
                "unread_events": len(events),
            },
        }

    @router.post("/events/mark-read")
    async def mark_header_events_read(
        payload: HeaderEventsReadPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        actor_id = _header_actor_id(current_user)
        if not actor_id:
            return {"success": True, "data": {"marked": 0}}

        unique_ids = [event_id.strip() for event_id in payload.event_ids if str(event_id).strip()]
        now = datetime.now(timezone.utc).isoformat()
        marked = 0
        for event_id in dict.fromkeys(unique_ids):
            await db.cms_header_event_reads.update_one(
                {"user_id": actor_id, "event_id": event_id},
                {"$set": {"read_at": now}, "$setOnInsert": {"user_id": actor_id, "event_id": event_id}},
                upsert=True,
            )
            marked += 1

        return {"success": True, "data": {"marked": marked}}

    return router
