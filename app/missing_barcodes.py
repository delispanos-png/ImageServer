"""Track barcodes requested by customer-facing API endpoints that are not in DB.

Used to surface to admins which products are in customer demand but not yet
ingested, and to enable manual or batched source-chain searches without
blocking the public API.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

COLLECTION_NAME = "missing_barcode_requests"

STATUS_PENDING = "pending"
STATUS_SEARCHING = "searching"
STATUS_FOUND = "found"
STATUS_NOT_FOUND = "not_found"
STATUS_DISMISSED = "dismissed"

ALL_STATUSES = (
    STATUS_PENDING,
    STATUS_SEARCHING,
    STATUS_FOUND,
    STATUS_NOT_FOUND,
    STATUS_DISMISSED,
)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def log_missing_barcodes(
    db,
    barcodes: Iterable[str],
    *,
    client_domain: str = "",
    endpoint_path: str = "",
) -> None:
    """Upsert one entry per missing barcode.

    Idempotent: increments request_count and updates last_requested_at;
    seeds Barcode/first_requested_at/status on first insert; never overwrites
    a status that an admin (or search) has set to found/not_found/dismissed.
    """
    now = _utcnow_iso()
    seen: set[str] = set()
    for raw in barcodes:
        bc = str(raw or "").strip()
        if not bc or bc in seen:
            continue
        seen.add(bc)
        update_doc: Dict[str, Any] = {
            "$inc": {"request_count": 1},
            "$set": {
                "last_requested_at": now,
                "last_endpoint": endpoint_path,
            },
            "$setOnInsert": {
                "Barcode": bc,
                "first_requested_at": now,
                "status": STATUS_PENDING,
                "search_attempts": 0,
            },
        }
        if client_domain:
            update_doc["$addToSet"] = {"client_domains": client_domain}
        await db[COLLECTION_NAME].update_one(
            {"Barcode": bc},
            update_doc,
            upsert=True,
        )


async def list_missing_barcodes(
    db,
    *,
    status: Optional[str] = None,
    client_domain: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    sort_field: str = "request_count",
    sort_dir: int = -1,
) -> Dict[str, Any]:
    query: Dict[str, Any] = {}
    if status and status in ALL_STATUSES:
        query["status"] = status
    if client_domain:
        query["client_domains"] = client_domain
    total = await db[COLLECTION_NAME].count_documents(query)
    cursor = (
        db[COLLECTION_NAME]
        .find(query)
        .sort(sort_field, sort_dir)
        .skip(max(0, int(skip)))
        .limit(max(1, min(int(limit), 200)))
    )
    items: List[Dict[str, Any]] = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return {"total": total, "items": items}


async def get_missing_barcode(db, barcode: str) -> Optional[Dict[str, Any]]:
    doc = await db[COLLECTION_NAME].find_one({"Barcode": str(barcode).strip()})
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


async def mark_status(
    db,
    barcode: str,
    *,
    status: str,
    notes: str = "",
    increment_attempt: bool = False,
) -> None:
    if status not in ALL_STATUSES:
        raise ValueError(f"Invalid status: {status}")
    set_doc: Dict[str, Any] = {
        "status": status,
        "status_updated_at": _utcnow_iso(),
    }
    if notes:
        set_doc["notes"] = notes
    if status in (STATUS_FOUND, STATUS_NOT_FOUND):
        set_doc["searched_at"] = _utcnow_iso()
    update: Dict[str, Any] = {"$set": set_doc}
    if increment_attempt:
        update["$inc"] = {"search_attempts": 1}
    await db[COLLECTION_NAME].update_one({"Barcode": str(barcode).strip()}, update)


async def remove_missing_barcode(db, barcode: str) -> int:
    result = await db[COLLECTION_NAME].delete_one({"Barcode": str(barcode).strip()})
    return result.deleted_count


async def resolve_after_ingest(db, barcode: str) -> None:
    """Called after a barcode is successfully ingested into db.products.
    Marks the missing entry as found (if present) and dispatches webhooks
    to every client that originally asked for this barcode.
    """
    existing = await db[COLLECTION_NAME].find_one({"Barcode": str(barcode).strip()})
    was_pending = bool(existing) and existing.get("status") in (STATUS_PENDING, STATUS_SEARCHING, STATUS_NOT_FOUND)
    await mark_status(db, barcode, status=STATUS_FOUND)
    if was_pending:
        try:
            # Local import keeps this module free of httpx at top-level
            # (so legacy callers that import it without webhooks dependencies still work).
            from webhooks import notify_barcode_available
            await notify_barcode_available(db, barcode)
        except Exception:
            # Webhook errors must not block the ingest path; we already
            # persist outbox rows for retry inside notify_barcode_available.
            pass
