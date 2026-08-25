"""CMS endpoint to view and update product attributes (weight/dims/pricing).

Lives separately from cms_catalog.update_item so admins can edit
e-shop attributes (weight, dimensions, prices, VAT) without going
through the full item-edit flow. Updates are flagged as manual ⇒
confidence=verified so they win over heuristic estimates.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from catalog_quality import build_catalog_quality_updates
from cms_permissions import require_cms_permissions
from product_attributes import (
    CONF_VERIFIED,
    SRC_MANUAL,
    SITE_READY_REQUIRED,
    build_attributes_block,
    compute_pricing_summary,
    compute_volumetric_weight_kg,
    is_site_ready,
)


class AttributesPayload(BaseModel):
    weight_kg: Optional[float] = None
    length_cm: Optional[float] = None
    width_cm: Optional[float] = None
    height_cm: Optional[float] = None
    vat_rate: Optional[float] = None
    package_size_label: Optional[str] = None
    mpn: Optional[str] = None
    wholesale_price: Optional[float] = None
    retail_price: Optional[float] = None
    discount_percent: Optional[float] = Field(default=None, ge=0, le=100)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def create_cms_attributes_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/products", tags=["cms-attributes"])

    @router.get(
        "/{barcode}/attributes",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def get_attributes(barcode: str) -> Dict[str, Any]:
        product = await db.products.find_one({"Barcode": str(barcode).strip()})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        attrs = dict(product.get("attributes") or {})
        # Always refresh the auto-filled estimates so the UI reflects the
        # current schema even before the admin opens the form.
        refreshed = build_attributes_block(product, existing_attributes=attrs)
        return {
            "barcode": str(product.get("Barcode") or ""),
            "title": str(product.get("cms_title") or product.get("Title") or ""),
            "category_1": str(product.get("Category_1") or ""),
            "attributes": refreshed,
            "pricing_summary": compute_pricing_summary(refreshed),
            "site_ready_for_export": is_site_ready(refreshed),
            "site_ready_required": list(SITE_READY_REQUIRED),
        }

    @router.put(
        "/{barcode}/attributes",
        dependencies=[Depends(require_cms_permissions("items.update"))],
    )
    async def update_attributes(barcode: str, payload: AttributesPayload) -> Dict[str, Any]:
        product = await db.products.find_one({"Barcode": str(barcode).strip()})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        attrs = dict(product.get("attributes") or {})

        # Manual edits get CONF_VERIFIED so they outrank any estimate.
        def apply(field: str, value: Any) -> None:
            if value is None:
                return
            attrs[field] = value
            attrs[f"{field}_source"] = SRC_MANUAL
            attrs[f"{field}_confidence"] = CONF_VERIFIED

        apply("weight_kg", payload.weight_kg)
        apply("length_cm", payload.length_cm)
        apply("width_cm", payload.width_cm)
        apply("height_cm", payload.height_cm)
        apply("vat_rate", payload.vat_rate)
        apply("package_size_label", payload.package_size_label)
        apply("mpn", payload.mpn)
        apply("wholesale_price", payload.wholesale_price)
        apply("retail_price", payload.retail_price)
        apply("discount_percent", payload.discount_percent)

        # Recompute volumetric weight whenever dimensions change.
        if attrs.get("length_cm") and attrs.get("width_cm") and attrs.get("height_cm"):
            attrs["volumetric_weight_kg"] = compute_volumetric_weight_kg(
                float(attrs["length_cm"]), float(attrs["width_cm"]), float(attrs["height_cm"]),
            )

        attrs["updated_at"] = _utcnow_iso()
        attrs["updated_by"] = "cms:attributes:update"

        set_updates: Dict[str, Any] = {"attributes": attrs}
        # Re-evaluate catalog quality so site_ready_for_export reflects the new state.
        candidate = dict(product)
        candidate.update(set_updates)
        set_updates.update(
            build_catalog_quality_updates(candidate, evaluator="cms:attributes:update")
        )

        await db.products.update_one({"Barcode": product["Barcode"]}, {"$set": set_updates})
        return {
            "barcode": str(product.get("Barcode") or ""),
            "attributes": attrs,
            "pricing_summary": compute_pricing_summary(attrs),
            "site_ready_for_export": is_site_ready(attrs),
        }

    @router.get(
        "/site-ready-export",
        dependencies=[Depends(require_cms_permissions("items.view"))],
    )
    async def export_site_ready(limit: int = 1000, format: str = "json") -> Any:
        cursor = db.products.find(
            {"catalog_site_ready_for_export": True, "cms_status": "active"},
            {
                "Barcode": 1, "cms_title": 1, "Title": 1, "cms_description": 1,
                "Brand": 1, "Category_1": 1, "Category_2": 1, "Category_3": 1,
                "Image_Path": 1, "Img_src": 1, "attributes": 1, "_id": 0,
            },
        ).limit(max(1, min(int(limit), 10000)))
        items = []
        async for doc in cursor:
            attrs = doc.get("attributes") or {}
            items.append({
                "barcode": doc.get("Barcode"),
                "title": doc.get("cms_title") or doc.get("Title"),
                "description": doc.get("cms_description"),
                "brand": doc.get("Brand"),
                "category_1": doc.get("Category_1"),
                "category_2": doc.get("Category_2"),
                "category_3": doc.get("Category_3"),
                "image_path": doc.get("Image_Path"),
                "weight_kg": attrs.get("weight_kg"),
                "length_cm": attrs.get("length_cm"),
                "width_cm": attrs.get("width_cm"),
                "height_cm": attrs.get("height_cm"),
                "volumetric_weight_kg": attrs.get("volumetric_weight_kg"),
                "vat_rate": attrs.get("vat_rate"),
                "wholesale_price": attrs.get("wholesale_price"),
                "retail_price": attrs.get("retail_price"),
                "discount_percent": attrs.get("discount_percent"),
                "package_size_label": attrs.get("package_size_label"),
                "mpn": attrs.get("mpn"),
                **compute_pricing_summary(attrs),
            })
        return {"count": len(items), "items": items}

    return router
