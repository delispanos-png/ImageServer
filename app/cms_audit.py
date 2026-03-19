from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Query

from cms_activity import serialize_audit_log
from cms_permissions import require_cms_permissions


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


def create_cms_audit_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/audit", tags=["cms-audit"])

    @router.get(
        "/logs",
        dependencies=[Depends(require_cms_permissions("audit.view"))],
    )
    async def list_audit_logs(
        search: str = Query(default="", max_length=120),
        user: str = Query(default="", max_length=120),
        entity: str = Query(default="", max_length=80),
        action: str = Query(default="", max_length=80),
        date_from: str = Query(default=""),
        date_to: str = Query(default=""),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if user.strip():
            pattern = {"$regex": user.strip(), "$options": "i"}
            query["$or"] = [
                {"user_email": pattern},
                {"user_name": pattern},
                {"user_id": pattern},
            ]
        if entity.strip():
            query["entity_type"] = entity.strip()
        if action.strip():
            query["action"] = action.strip()
        created_at_filters: Dict[str, Any] = {}
        if parsed_from := _parse_date(date_from):
            created_at_filters["$gte"] = parsed_from
        if parsed_to := _parse_date(date_to, end_of_day=True):
            created_at_filters["$lte"] = parsed_to
        if created_at_filters:
            query["created_at"] = created_at_filters
        if search.strip():
            pattern = {"$regex": search.strip(), "$options": "i"}
            extra_query = {
                "$or": [
                    {"entity_id": pattern},
                    {"user_email": pattern},
                    {"user_name": pattern},
                ]
            }
            if "$or" in query:
                query = {"$and": [query, extra_query]}
            else:
                query.update(extra_query)

        total = await db.cms_audit_logs.count_documents(query)
        skip = (page - 1) * per_page
        docs = (
            await db.cms_audit_logs.find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(per_page)
            .to_list(length=per_page)
        )
        return {
            "success": True,
            "data": [serialize_audit_log(doc) for doc in docs],
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
        }

    return router
