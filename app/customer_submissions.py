"""Customer product submissions collection helpers.

Customers from the portal submit barcodes for products that are NOT in our
catalog yet, along with whatever info they have (title, brand, photo, ...).
The system immediately fires a source scan in the background and stores the
results on the submission record so admins can review with pre-loaded data.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from bson import ObjectId

COLLECTION = "customer_product_submissions"

STATUS_PENDING = "pending"          # just submitted, scan not started yet
STATUS_SEARCHING = "searching"      # background scan in progress
STATUS_NEEDS_REVIEW = "needs_review"  # scan done, admin to decide
STATUS_APPROVED = "approved"        # admin imported into catalog
STATUS_REJECTED = "rejected"        # admin dismissed
STATUS_FAILED = "failed"            # scan errored out

ALL_STATUSES = (
    STATUS_PENDING,
    STATUS_SEARCHING,
    STATUS_NEEDS_REVIEW,
    STATUS_APPROVED,
    STATUS_REJECTED,
    STATUS_FAILED,
)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _to_objectid(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise ValueError("invalid submission id")
    return ObjectId(value)


def _serialize(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return {}
    out = dict(doc)
    out["id"] = str(out.pop("_id", ""))
    return out


async def create_submission(
    db,
    *,
    barcode: str,
    client_id: str,
    client_email: str = "",
    client_name: str = "",
    submitted_title: str = "",
    submitted_brand: str = "",
    submitted_description: str = "",
    submitted_image_url: str = "",
    submitted_notes: str = "",
) -> Dict[str, Any]:
    barcode = str(barcode or "").strip()
    if not barcode:
        raise ValueError("barcode is required")
    now = _utcnow_iso()
    doc = {
        "Barcode": barcode,
        "client_id": str(client_id or "").strip(),
        "client_email": str(client_email or "").strip().lower(),
        "client_name": str(client_name or "").strip(),
        "submitted": {
            "title": str(submitted_title or "").strip(),
            "brand": str(submitted_brand or "").strip(),
            "description": str(submitted_description or "").strip(),
            "image_url": str(submitted_image_url or "").strip(),
            "notes": str(submitted_notes or "").strip(),
        },
        "status": STATUS_PENDING,
        "auto_search_results": None,
        "auto_search_status": "",
        "auto_search_started_at": "",
        "auto_search_finished_at": "",
        "admin_notes": "",
        "reviewed_by": "",
        "reviewed_at": "",
        "imported_source_key": "",
        "created_at": now,
        "updated_at": now,
    }
    result = await db[COLLECTION].insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize(doc)


async def attach_search_results(
    db,
    submission_id: str,
    *,
    results: Dict[str, Any],
    status: str = STATUS_NEEDS_REVIEW,
) -> None:
    await db[COLLECTION].update_one(
        {"_id": _to_objectid(submission_id)},
        {"$set": {
            "auto_search_results": results,
            "auto_search_status": "done",
            "auto_search_finished_at": _utcnow_iso(),
            "status": status,
            "updated_at": _utcnow_iso(),
        }},
    )


async def mark_search_started(db, submission_id: str) -> None:
    await db[COLLECTION].update_one(
        {"_id": _to_objectid(submission_id)},
        {"$set": {
            "auto_search_status": "running",
            "auto_search_started_at": _utcnow_iso(),
            "status": STATUS_SEARCHING,
            "updated_at": _utcnow_iso(),
        }},
    )


async def mark_search_failed(db, submission_id: str, *, reason: str) -> None:
    await db[COLLECTION].update_one(
        {"_id": _to_objectid(submission_id)},
        {"$set": {
            "auto_search_status": "failed",
            "auto_search_finished_at": _utcnow_iso(),
            "status": STATUS_FAILED,
            "admin_notes": (reason or "")[:500],
            "updated_at": _utcnow_iso(),
        }},
    )


async def list_submissions(
    db,
    *,
    status: Optional[str] = None,
    client_id: Optional[str] = None,
    barcode: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> Dict[str, Any]:
    query: Dict[str, Any] = {}
    if status and status in ALL_STATUSES:
        query["status"] = status
    if client_id:
        query["client_id"] = str(client_id).strip()
    if barcode:
        query["Barcode"] = str(barcode).strip()
    total = await db[COLLECTION].count_documents(query)
    cursor = (
        db[COLLECTION]
        .find(query)
        .sort([("created_at", -1)])
        .skip(max(int(skip or 0), 0))
        .limit(max(min(int(limit or 50), 200), 1))
    )
    items = [_serialize(d) async for d in cursor]
    return {"items": items, "total": total}


async def get_submission(db, submission_id: str) -> Optional[Dict[str, Any]]:
    doc = await db[COLLECTION].find_one({"_id": _to_objectid(submission_id)})
    return _serialize(doc) if doc else None


async def update_review(
    db,
    submission_id: str,
    *,
    status: str,
    reviewed_by: str,
    admin_notes: str = "",
    imported_source_key: str = "",
) -> Optional[Dict[str, Any]]:
    if status not in ALL_STATUSES:
        raise ValueError(f"invalid status {status}")
    await db[COLLECTION].update_one(
        {"_id": _to_objectid(submission_id)},
        {"$set": {
            "status": status,
            "reviewed_by": reviewed_by or "",
            "reviewed_at": _utcnow_iso(),
            "admin_notes": admin_notes or "",
            "imported_source_key": imported_source_key or "",
            "updated_at": _utcnow_iso(),
        }},
    )
    return await get_submission(db, submission_id)


async def count_pending_for_client(db, client_id: str) -> int:
    return await db[COLLECTION].count_documents({
        "client_id": str(client_id).strip(),
        "status": {"$in": [STATUS_PENDING, STATUS_SEARCHING, STATUS_NEEDS_REVIEW]},
    })


async def ensure_indexes(db) -> None:
    coll = db[COLLECTION]
    await coll.create_index([("Barcode", 1), ("client_id", 1)])
    await coll.create_index([("status", 1), ("created_at", -1)])
    await coll.create_index([("client_id", 1), ("created_at", -1)])
