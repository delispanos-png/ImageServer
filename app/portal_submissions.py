"""Portal endpoints for customers to submit unknown-product info.

When a customer submits a barcode + whatever metadata they have, we:
  1. Persist a record in `customer_product_submissions`.
  2. Immediately fire a background task that scans every enabled source.
  3. The scan results land back on the submission record for admin review.
"""
from __future__ import annotations

import asyncio
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from customer_submissions import (
    STATUS_NEEDS_REVIEW,
    attach_search_results,
    count_pending_for_client,
    create_submission,
    get_submission,
    list_submissions,
    mark_search_failed,
    mark_search_started,
)
from source_scanner import scan_all_sources


class SubmitPayload(BaseModel):
    barcode: str = Field(min_length=1, max_length=64)
    title: str = Field(default="", max_length=300)
    brand: str = Field(default="", max_length=120)
    description: str = Field(default="", max_length=2000)
    image_url: str = Field(default="", max_length=600)
    notes: str = Field(default="", max_length=1000)


def create_portal_submissions_router(db, get_current_portal_client) -> APIRouter:
    router = APIRouter(prefix="/portal/product-submissions", tags=["portal-submissions"])

    async def _run_scan(submission_id: str, barcode: str) -> None:
        """Background task: scan all sources and attach results to the submission."""
        try:
            await mark_search_started(db, submission_id)
            scan = await scan_all_sources(barcode, download_images=False)
            await attach_search_results(db, submission_id, results=scan,
                                          status=STATUS_NEEDS_REVIEW)
        except BaseException as exc:
            try:
                await mark_search_failed(db, submission_id, reason=f"{type(exc).__name__}: {exc}")
            except BaseException:
                pass

    @router.post("")
    async def submit_endpoint(
        payload: SubmitPayload,
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        barcode = payload.barcode.strip()
        if not barcode:
            raise HTTPException(status_code=422, detail="Barcode is required")
        client_id = str(current_client.get("_id", "")).strip()
        if not client_id:
            raise HTTPException(status_code=401, detail="Unable to resolve portal client")

        submission = await create_submission(
            db,
            barcode=barcode,
            client_id=client_id,
            client_email=str(current_client.get("email", "") or ""),
            client_name=str(current_client.get("name", "") or current_client.get("company", "") or ""),
            submitted_title=payload.title,
            submitted_brand=payload.brand,
            submitted_description=payload.description,
            submitted_image_url=payload.image_url,
            submitted_notes=payload.notes,
        )
        asyncio.create_task(_run_scan(submission["id"], barcode))
        return {"success": True, "data": submission}

    @router.get("")
    async def list_my_submissions(
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        client_id = str(current_client.get("_id", "")).strip()
        listing = await list_submissions(
            db,
            client_id=client_id,
            status=status,
            skip=skip,
            limit=limit,
        )
        # Strip the bulky `raw` source payloads + scan results from list view.
        for item in listing["items"]:
            item.pop("auto_search_results", None)
        return {"success": True, "data": listing["items"], "total": listing["total"]}

    @router.get("/pending-count")
    async def get_pending_count(
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        client_id = str(current_client.get("_id", "")).strip()
        n = await count_pending_for_client(db, client_id)
        return {"success": True, "data": {"pending": n}}

    @router.get("/{submission_id}")
    async def get_my_submission(
        submission_id: str,
        current_client: Dict[str, Any] = Depends(get_current_portal_client),
    ) -> Dict[str, Any]:
        client_id = str(current_client.get("_id", "")).strip()
        doc = await get_submission(db, submission_id)
        if not doc or doc.get("client_id") != client_id:
            raise HTTPException(status_code=404, detail="Submission not found")
        return {"success": True, "data": doc}

    return router
