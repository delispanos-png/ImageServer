"""CMS admin router for the customer-product-submissions review queue.

Lists submissions customers sent from the portal, shows the pre-loaded
source scan results, lets admin import a chosen source's data into the
catalog or reject the submission.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from cms_permissions import require_cms_permissions
from customer_submissions import (
    ALL_STATUSES,
    STATUS_APPROVED,
    STATUS_REJECTED,
    get_submission,
    list_submissions,
    update_review,
)
from source_scanner import scan_all_sources


class ApprovePayload(BaseModel):
    source_key: str = Field(min_length=1, max_length=64)
    admin_notes: str = Field(default="", max_length=2000)


class RejectPayload(BaseModel):
    admin_notes: str = Field(default="", max_length=2000)


class RescanPayload(BaseModel):
    download_images: bool = False


def create_cms_product_submissions_router(
    db,
    *,
    get_current_cms_user,
    persist_source_product,
) -> APIRouter:
    router = APIRouter(prefix="/cms/product-submissions", tags=["cms-product-submissions"])

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.view"))],
    )
    async def list_endpoint(
        status: Optional[str] = Query(default=None),
        barcode: Optional[str] = Query(default=None),
        client_id: Optional[str] = Query(default=None),
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=50, ge=1, le=200),
    ) -> Dict[str, Any]:
        listing = await list_submissions(
            db,
            status=status if status in ALL_STATUSES else None,
            barcode=barcode,
            client_id=client_id,
            skip=skip,
            limit=limit,
        )
        return {"success": True, "data": listing["items"], "total": listing["total"]}

    @router.get(
        "/{submission_id}",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.view"))],
    )
    async def get_endpoint(submission_id: str) -> Dict[str, Any]:
        doc = await get_submission(db, submission_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Submission not found")
        return {"success": True, "data": doc}

    @router.post(
        "/{submission_id}/rescan",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def rescan_endpoint(submission_id: str, payload: RescanPayload) -> Dict[str, Any]:
        doc = await get_submission(db, submission_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Submission not found")
        scan = await scan_all_sources(
            str(doc.get("Barcode", "")).strip(),
            download_images=payload.download_images,
        )
        from customer_submissions import attach_search_results, STATUS_NEEDS_REVIEW
        await attach_search_results(db, submission_id, results=scan, status=STATUS_NEEDS_REVIEW)
        return {"success": True, "data": await get_submission(db, submission_id)}

    @router.post(
        "/{submission_id}/approve",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def approve_endpoint(
        submission_id: str,
        payload: ApprovePayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        doc = await get_submission(db, submission_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Submission not found")
        barcode = str(doc.get("Barcode", "")).strip()

        # Re-run only the chosen source (with images this time) to get a fresh
        # canonical doc, then push it through the existing persist pipeline.
        scan = await scan_all_sources(
            barcode,
            download_images=True,
            sources=[payload.source_key],
        )
        sources = scan.get("sources") or []
        if not sources:
            raise HTTPException(status_code=404, detail="Chosen source returned no data")
        entry = sources[0]
        if entry.get("status") != "hit":
            raise HTTPException(
                status_code=400,
                detail=f"Source {payload.source_key} did not return data "
                       f"(status={entry.get('status')})",
            )
        raw = entry.get("raw") or {}
        if not raw:
            raise HTTPException(status_code=500, detail="Scanner returned empty payload")
        await persist_source_product(raw)

        updated = await update_review(
            db,
            submission_id,
            status=STATUS_APPROVED,
            reviewed_by=str(current_user.get("email", "") or "system"),
            admin_notes=payload.admin_notes,
            imported_source_key=payload.source_key,
        )
        return {"success": True, "data": updated}

    @router.post(
        "/{submission_id}/reject",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def reject_endpoint(
        submission_id: str,
        payload: RejectPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        doc = await get_submission(db, submission_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Submission not found")
        updated = await update_review(
            db,
            submission_id,
            status=STATUS_REJECTED,
            reviewed_by=str(current_user.get("email", "") or "system"),
            admin_notes=payload.admin_notes,
        )
        return {"success": True, "data": updated}

    return router
