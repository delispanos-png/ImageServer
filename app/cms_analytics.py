"""CMS analytics router: business intelligence views over API usage and
catalog operations. Read-only aggregations meant for admin dashboards.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query

from cms_permissions import require_cms_permissions


def _iso(value: Any) -> str:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc).isoformat()
    return str(value or "")


def _days_window(days: int) -> datetime:
    days = max(1, min(int(days or 7), 90))
    return datetime.now(timezone.utc) - timedelta(days=days)


def create_cms_analytics_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/analytics", tags=["cms-analytics"])

    @router.get(
        "/api-usage",
        dependencies=[Depends(require_cms_permissions("dashboard.view"))],
    )
    async def api_usage(days: int = Query(default=7, ge=1, le=90)) -> Dict[str, Any]:
        """Per-day request counts, plus top endpoints and top clients."""
        since = _days_window(days)

        # Per-day series — cms_client_api_events.created_at is stored as
        # ISO string in some rows and datetime in others, so we normalize on
        # the python side after pulling the events we need.
        events = (
            await db.cms_client_api_events.find(
                {"created_at": {"$gte": since.isoformat()}},
                {"endpoint": 1, "api_domain": 1, "api_username": 1, "barcodes_count": 1, "created_at": 1, "_id": 0},
            )
            .to_list(length=20000)
        )
        # Also include datetime-typed rows.
        events += (
            await db.cms_client_api_events.find(
                {"created_at": {"$gte": since}},
                {"endpoint": 1, "api_domain": 1, "api_username": 1, "barcodes_count": 1, "created_at": 1, "_id": 0},
            )
            .to_list(length=20000)
        )

        by_day: Dict[str, int] = {}
        by_endpoint: Dict[str, int] = {}
        by_client: Dict[str, int] = {}
        total_barcodes = 0

        seen = set()
        for ev in events:
            # Dedupe events that come back from both queries (string + datetime).
            sig = (str(ev.get("api_client_key", "")), str(ev.get("endpoint", "")), str(ev.get("created_at", "")))
            if sig in seen:
                continue
            seen.add(sig)

            created = ev.get("created_at")
            if isinstance(created, datetime):
                day = created.astimezone(timezone.utc).strftime("%Y-%m-%d")
            else:
                try:
                    day = str(created)[:10]
                except Exception:
                    continue
            by_day[day] = by_day.get(day, 0) + 1

            endpoint = str(ev.get("endpoint") or "").strip() or "(unknown)"
            by_endpoint[endpoint] = by_endpoint.get(endpoint, 0) + 1

            client_label = (
                str(ev.get("api_domain") or ev.get("api_username") or "").strip() or "(anon)"
            )
            by_client[client_label] = by_client.get(client_label, 0) + 1

            try:
                total_barcodes += int(str(ev.get("barcodes_count") or 0) or 0)
            except (TypeError, ValueError):
                pass

        # Fill missing days with 0 so the chart spans the whole window.
        timeline: List[Dict[str, Any]] = []
        for delta in range(int(days)):
            day = (since + timedelta(days=delta + 1)).strftime("%Y-%m-%d")
            timeline.append({"date": day, "count": by_day.get(day, 0)})

        return {
            "since": since.isoformat(),
            "total_events": len(seen),
            "total_barcodes_requested": total_barcodes,
            "timeline": timeline,
            "top_endpoints": sorted(
                [{"endpoint": k, "count": v} for k, v in by_endpoint.items()],
                key=lambda x: x["count"], reverse=True,
            )[:10],
            "top_clients": sorted(
                [{"client": k, "count": v} for k, v in by_client.items()],
                key=lambda x: x["count"], reverse=True,
            )[:10],
        }

    @router.get(
        "/top-missing-barcodes",
        dependencies=[Depends(require_cms_permissions("dashboard.view"))],
    )
    async def top_missing(limit: int = Query(default=20, ge=1, le=100)) -> Dict[str, Any]:
        cursor = (
            db.missing_barcode_requests.find({"status": "pending"})
            .sort("request_count", -1)
            .limit(limit)
        )
        items = []
        async for doc in cursor:
            items.append({
                "barcode": str(doc.get("Barcode") or ""),
                "request_count": int(doc.get("request_count") or 0),
                "client_domains": list(doc.get("client_domains") or [])[:5],
                "first_requested_at": _iso(doc.get("first_requested_at")),
                "last_requested_at": _iso(doc.get("last_requested_at")),
            })
        return {"items": items}

    @router.get(
        "/top-clients",
        dependencies=[Depends(require_cms_permissions("dashboard.view"))],
    )
    async def top_clients(limit: int = Query(default=10, ge=1, le=50)) -> Dict[str, Any]:
        cursor = (
            db.cms_clients.find(
                {"api_request_count": {"$gt": 0}},
                {"api_username": 1, "api_domain": 1, "name": 1, "company": 1, "api_request_count": 1, "last_api_access_at": 1, "is_active": 1},
            )
            .sort("api_request_count", -1)
            .limit(limit)
        )
        items = []
        async for doc in cursor:
            items.append({
                "username": str(doc.get("api_username") or ""),
                "domain": str(doc.get("api_domain") or doc.get("company") or ""),
                "name": str(doc.get("name") or ""),
                "request_count": int(doc.get("api_request_count") or 0),
                "last_access_at": _iso(doc.get("last_api_access_at")),
                "is_active": bool(doc.get("is_active", True)),
            })
        return {"items": items}

    return router
