"""CMS admin endpoint that returns per-source results for a barcode.

Powers the admin "Source Scanner" page: input one barcode, get back which of
the enabled sources have data for it, with the raw fields each returned so
the admin can compare and pick what to import.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from cms_permissions import require_cms_permissions
from source_scanner import scan_all_sources


class ScanPayload(BaseModel):
    barcode: str = Field(min_length=1, max_length=64)
    sources: Optional[List[str]] = None
    download_images: bool = False


class IngestPayload(BaseModel):
    barcode: str = Field(min_length=1, max_length=64)
    source_key: str = Field(min_length=1, max_length=64)


def create_cms_source_scanner_router(
    db,
    *,
    persist_source_product,
) -> APIRouter:
    """Wire the scanner router. `persist_source_product` is the same callable
    used by the missing-barcodes router so admin imports go through the
    canonical ingest path.
    """
    router = APIRouter(prefix="/cms/sources/scan", tags=["cms-source-scanner"])

    @router.post(
        "",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.view"))],
    )
    async def scan_endpoint(payload: ScanPayload) -> Dict[str, Any]:
        result = await scan_all_sources(
            payload.barcode.strip(),
            download_images=payload.download_images,
            sources=payload.sources,
        )
        return {"success": True, "data": result}

    @router.post(
        "/ingest",
        dependencies=[Depends(require_cms_permissions("missing_barcodes.update"))],
    )
    async def ingest_endpoint(payload: IngestPayload) -> Dict[str, Any]:
        scan = await scan_all_sources(
            payload.barcode.strip(),
            download_images=True,
            sources=[payload.source_key],
        )
        sources = scan.get("sources") or []
        if not sources:
            raise HTTPException(status_code=404, detail="No result from that source")
        entry = sources[0]
        if entry.get("status") != "hit":
            raise HTTPException(
                status_code=404,
                detail=f"Source {payload.source_key} did not return data for this barcode "
                       f"(status={entry.get('status')})",
            )
        raw = entry.get("raw") or {}
        if not raw:
            raise HTTPException(status_code=500, detail="Scanner returned empty raw payload")
        await persist_source_product(raw)
        return {"success": True, "data": {"barcode": payload.barcode.strip(),
                                            "source_key": payload.source_key,
                                            "title": entry.get("data", {}).get("title", "")}}

    return router
