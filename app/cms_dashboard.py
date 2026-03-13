from __future__ import annotations

from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, Depends

from cms_auth import get_current_cms_user
from cms_catalog import _first_text
from cms_permissions import require_cms_permissions


def _iso(value: Any) -> str:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc).isoformat()
    return ""


def _parse_datetime(value: Any) -> datetime | None:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc)
    if isinstance(value, str) and value:
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError:
            return None
    return None


def _status_from_item(doc: Dict[str, Any]) -> str:
    return str(doc.get("cms_status") or "active").strip() or "active"


def _title_from_item(doc: Dict[str, Any]) -> str:
    return str(doc.get("cms_title") or _first_text(doc.get("Title"))).strip()


def _user_activity_name(doc: Dict[str, Any]) -> str:
    return (
        str(doc.get("changed_by") or doc.get("user_id") or doc.get("cms_updated_by") or doc.get("cms_created_by") or "")
        .strip()
    )


def create_cms_dashboard_router(db):
    router = APIRouter(prefix="/cms/dashboard", tags=["cms-dashboard"])

    @router.get(
        "/overview",
        dependencies=[Depends(require_cms_permissions("dashboard.view"))],
    )
    async def get_overview(current_user: Dict[str, Any] = Depends(get_current_cms_user)) -> Dict[str, Any]:
        del current_user
        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=29)

        total_items = await db.products.count_documents({})
        active_items = await db.products.count_documents(
            {"$or": [{"cms_status": "active"}, {"cms_status": {"$exists": False}}, {"cms_status": ""}]}
        )
        inactive_items = max(0, total_items - active_items)
        total_categories = await db.cms_categories.count_documents({})
        active_clients = await db.cms_clients.count_documents({"is_active": True})

        recent_items_docs = await db.products.find({}).sort("cms_created_at", -1).limit(8).to_list(length=8)
        recent_changes_docs = (
            await db.cms_item_changes.find({}).sort("created_at", -1).limit(8).to_list(length=8)
        )
        recent_audit_docs = await db.cms_audit_logs.find({}).sort("created_at", -1).limit(8).to_list(length=8)

        category_docs = await db.cms_categories.find({}, {"_id": 1, "name": 1}).to_list(length=5000)
        category_lookup = {str(doc["_id"]): str(doc.get("name", "")).strip() for doc in category_docs}

        items_for_category_chart = await db.products.find(
            {},
            {"cms_category_id": 1, "Category_1": 1, "Category_2": 1, "Category_3": 1},
        ).to_list(length=10000)

        category_counter: Counter[str] = Counter()
        for doc in items_for_category_chart:
            category_name = category_lookup.get(str(doc.get("cms_category_id", "")).strip())
            if not category_name:
                category_name = (
                    str(doc.get("Category_3", "")).strip()
                    or str(doc.get("Category_2", "")).strip()
                    or str(doc.get("Category_1", "")).strip()
                    or "Uncategorized"
                )
            category_counter[category_name] += 1

        items_for_timeline = await db.products.find({}, {"cms_created_at": 1}).to_list(length=10000)
        timeline_map: Dict[str, int] = defaultdict(int)
        for doc in items_for_timeline:
            created_at = _parse_datetime(doc.get("cms_created_at"))
            if created_at and created_at >= thirty_days_ago:
                timeline_map[created_at.strftime("%Y-%m-%d")] += 1

        timeline_points: List[Dict[str, Any]] = []
        for index in range(30):
            day = thirty_days_ago + timedelta(days=index)
            key = day.strftime("%Y-%m-%d")
            timeline_points.append({"date": key, "count": timeline_map.get(key, 0)})

        recent_item_changes = [
            {
                "id": str(doc.get("_id", "")),
                "item_id": str(doc.get("item_id", "")),
                "change_type": str(doc.get("change_type", "")).strip(),
                "field_name": str(doc.get("field_name", "")).strip(),
                "changed_by": _user_activity_name(doc),
                "created_at": _iso(doc.get("created_at")),
                "new_value_preview": str(doc.get("new_value", ""))[:120],
            }
            for doc in recent_changes_docs
        ]

        recent_user_activity = [
            {
                "id": str(doc.get("_id", "")),
                "user_id": str(doc.get("user_id", "")).strip(),
                "entity_type": str(doc.get("entity_type", "")).strip(),
                "entity_id": str(doc.get("entity_id", "")).strip(),
                "action": str(doc.get("action", "")).strip(),
                "metadata": doc.get("metadata"),
                "created_at": _iso(doc.get("created_at")),
            }
            for doc in recent_audit_docs
        ]

        recent_added_items = [
            {
                "id": str(doc.get("_id", "")),
                "title": _title_from_item(doc),
                "code": str(doc.get("cms_code") or doc.get("Code", "")).strip(),
                "barcode": str(doc.get("cms_barcode") or doc.get("Barcode", "")).strip(),
                "status": _status_from_item(doc),
                "created_at": _iso(doc.get("cms_created_at")),
                "updated_at": _iso(doc.get("cms_updated_at")),
            }
            for doc in recent_items_docs
        ]

        items_by_category = [
            {"category": name, "count": count}
            for name, count in category_counter.most_common(10)
        ]

        return {
            "success": True,
            "data": {
                "metrics": {
                    "total_items": total_items,
                    "active_items": active_items,
                    "inactive_items": inactive_items,
                    "total_categories": total_categories,
                    "active_clients": active_clients,
                },
                "recent_item_changes": recent_item_changes,
                "recent_user_activity": recent_user_activity,
                "recent_added_items": recent_added_items,
                "items_by_category": items_by_category,
                "items_added_last_30_days": timeline_points,
            },
        }

    return router
