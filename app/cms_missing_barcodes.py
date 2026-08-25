"""CMS router for the 'missing barcodes' admin queue.

Surfaces barcodes that customer-facing API endpoints requested but were not
present in the products collection. Admins can trigger a one-off source
search per barcode, dismiss noisy entries, or batch-search the top N.
"""
from __future__ import annotations

import asyncio
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from cms_permissions import require_cms_permissions
from missing_barcodes import (
    ALL_STATUSES,
    STATUS_FOUND,
    STATUS_NOT_FOUND,
    STATUS_SEARCHING,
    get_missing_barcode,
    list_missing_barcodes,
    mark_status,
    remove_missing_barcode,
)


class BulkSearchPayload(BaseModel):
    barcodes: List[str] = Field(default_factory=list)
    top_n: int = Field(default=0, ge=0, le=200)
    status: str = Field(default="pending", pattern="^(pending|not_found)$")


class DismissPayload(BaseModel):
    notes: str = ""


def create_cms_missing_barcodes_router(
    db,
    *,
    fetch_from_sources_controlled,
    persist_source_product,
) -> APIRouter:
    """Wire the missing-barcodes router using callables injected from main.

    Avoids a circular import on main.py by accepting the fetcher/persister
    as parameters instead of importing them at module load time.
    """
    router = APIRouter(prefix="/cms/missing-barcodes", tags=["cms-missing-barcodes"])

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.view"))],
    )
    async def list_endpoint(
        status: Optional[str] = Query(default=None),
        client_domain: Optional[str] = Query(default=None),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=200),
        sort_field: str = Query(default="request_count"),
        sort_dir: int = Query(default=-1),
    ) -> Dict[str, Any]:
        allowed_sort = {"request_count", "last_requested_at", "first_requested_at", "search_attempts"}
        if sort_field not in allowed_sort:
            sort_field = "request_count"
        if sort_dir not in (-1, 1):
            sort_dir = -1
        return await list_missing_barcodes(
            db,
            status=status,
            client_domain=client_domain,
            skip=skip,
            limit=limit,
            sort_field=sort_field,
            sort_dir=sort_dir,
        )

    @router.get(
        "/{barcode}",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.view"))],
    )
    async def get_endpoint(barcode: str) -> Dict[str, Any]:
        doc = await get_missing_barcode(db, barcode)
        if not doc:
            raise HTTPException(status_code=404, detail="Missing barcode entry not found")
        return doc

    async def _search_one(barcode: str) -> Dict[str, Any]:
        """Run the source-chain fetcher for one barcode and update status.

        Returns the resulting product dict (possibly empty).
        """
        bc = str(barcode).strip()
        if not bc:
            raise HTTPException(status_code=422, detail="Empty barcode")
        await mark_status(db, bc, status=STATUS_SEARCHING, increment_attempt=True)
        try:
            existing = await db.products.find_one({"Barcode": bc})
            if existing and (str(existing.get("Title") or "").strip() or str(existing.get("cms_title") or "").strip()):
                from missing_barcodes import resolve_after_ingest
                await resolve_after_ingest(db, bc)
                return {"barcode": bc, "status": STATUS_FOUND, "source": "db"}

            source_result = await fetch_from_sources_controlled(bc)
            if not source_result:
                await mark_status(db, bc, status=STATUS_NOT_FOUND, notes="no_source_match")
                return {"barcode": bc, "status": STATUS_NOT_FOUND}

            await persist_source_product(source_result)
            from missing_barcodes import resolve_after_ingest
            await resolve_after_ingest(db, bc)
            return {"barcode": bc, "status": STATUS_FOUND, "source": str(source_result.get("Site") or source_result.get("last_source") or "")}
        except Exception as exc:
            await mark_status(db, bc, status=STATUS_NOT_FOUND, notes=f"error: {exc}")
            return {"barcode": bc, "status": STATUS_NOT_FOUND, "error": str(exc)}

    @router.post(
        "/{barcode}/search",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def search_endpoint(barcode: str) -> Dict[str, Any]:
        return await _search_one(barcode)

    @router.post(
        "/bulk-search",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def bulk_search_endpoint(payload: BulkSearchPayload) -> Dict[str, Any]:
        targets: List[str] = [str(bc).strip() for bc in payload.barcodes if str(bc).strip()]
        if not targets and payload.top_n > 0:
            listing = await list_missing_barcodes(
                db,
                status=payload.status,
                skip=0,
                limit=payload.top_n,
                sort_field="request_count",
                sort_dir=-1,
            )
            targets = [str(item.get("Barcode") or "").strip() for item in listing.get("items", []) if item.get("Barcode")]
        if not targets:
            return {"started": 0, "results": []}
        # Run serially: the source-chain semaphore already serializes externally,
        # but keep iteration explicit so admins see progressive updates.
        results: List[Dict[str, Any]] = []
        for bc in targets:
            results.append(await _search_one(bc))
        found = sum(1 for r in results if r.get("status") == STATUS_FOUND)
        return {"started": len(targets), "found": found, "results": results}

    @router.post(
        "/{barcode}/dismiss",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def dismiss_endpoint(barcode: str, payload: DismissPayload) -> Dict[str, Any]:
        from missing_barcodes import STATUS_DISMISSED
        await mark_status(db, barcode, status=STATUS_DISMISSED, notes=payload.notes)
        doc = await get_missing_barcode(db, barcode)
        if not doc:
            raise HTTPException(status_code=404, detail="Missing barcode entry not found")
        return doc

    @router.delete(
        "/{barcode}",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def delete_endpoint(barcode: str) -> Dict[str, Any]:
        deleted = await remove_missing_barcode(db, barcode)
        return {"deleted": deleted}

    return router
