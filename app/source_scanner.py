"""Per-source barcode scanner.

Given a barcode, query every enabled source in parallel and return the raw
result from each. Unlike `fetch_from_sources_controlled` (which merges into
one best document), the scanner preserves source-by-source data so admins
can compare and pick.
"""
from __future__ import annotations

import asyncio
import time
from typing import Any, Dict, List, Optional

from runtime_settings import (
    get_enabled_image_source_chain,
    get_enabled_text_source_chain,
    is_source_enabled_for_images,
    is_source_enabled_for_text,
)
from skroutzFetch import fetch_product_with_custom_source_priority


# Tight per-source cap for the scanner: real hits from every active source
# come back in <15s. Sources that need longer almost certainly aren't going
# to find the barcode anyway, so capping at 18s keeps the wall-clock scan
# time bounded without losing real matches.
_PER_SOURCE_TIMEOUT_SECONDS = 18.0


def _enabled_sources(include_images: bool) -> List[str]:
    """Union of every source enabled for either text or image phase."""
    keys = list(dict.fromkeys(
        list(get_enabled_text_source_chain() or [])
        + list(get_enabled_image_source_chain() or [])
    ))
    if include_images:
        return keys
    return [k for k in keys if is_source_enabled_for_text(k)]


def _summarize_doc(source_key: str, doc: Dict[str, Any]) -> Dict[str, Any]:
    """Project the source response into a stable shape for the admin UI."""
    if not doc:
        return {"hit": False}
    img_list = doc.get("Img_src_List") or []
    if isinstance(img_list, str):
        img_list = [img_list]
    return {
        "hit": bool(doc.get("Title") or doc.get("Img_src") or doc.get("Img_src_List")),
        "title": str(doc.get("Title", "") or "").strip(),
        "short_title": str(doc.get("Sml_Title", "") or "").strip(),
        "brand": str(doc.get("Brand", "") or "").strip(),
        "description": str(doc.get("Description", "") or "").strip(),
        "category_1": str(doc.get("Category_1", "") or "").strip(),
        "category_2": str(doc.get("Category_2", "") or "").strip(),
        "category_3": str(doc.get("Category_3", "") or "").strip(),
        "image_url": str(doc.get("Img_src", "") or "").strip(),
        "image_urls": [str(u or "").strip() for u in img_list if u],
        "product_link": str(doc.get("Product_Link", "") or "").strip(),
    }


async def _scan_one(barcode: str, source_key: str, download_images: bool) -> Dict[str, Any]:
    started = time.time()
    try:
        doc = await asyncio.wait_for(
            fetch_product_with_custom_source_priority(
                barcode,
                text_source_chain=[source_key],
                image_source_chain=[source_key],
                force_source_names={source_key},
                download_images=download_images,
                search_terms=[],
            ),
            timeout=_PER_SOURCE_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        return {
            "source_key": source_key,
            "status": "timeout",
            "elapsed_ms": int((time.time() - started) * 1000),
            "data": {"hit": False},
        }
    except BaseException as exc:
        return {
            "source_key": source_key,
            "status": "error",
            "error": f"{type(exc).__name__}: {exc}"[:200],
            "elapsed_ms": int((time.time() - started) * 1000),
            "data": {"hit": False},
        }

    summary = _summarize_doc(source_key, doc or {})
    return {
        "source_key": source_key,
        "status": "hit" if summary["hit"] else "miss",
        "elapsed_ms": int((time.time() - started) * 1000),
        "data": summary,
        "raw": doc or {},
    }


async def scan_all_sources(
    barcode: str,
    *,
    download_images: bool = False,
    sources: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Scan every enabled source in parallel for one barcode.

    Returns:
        {
            "barcode": "...",
            "scanned_at_ms": int,
            "elapsed_ms": int,
            "sources": [
                {"source_key": "...", "status": "hit"|"miss"|"timeout"|"error",
                 "elapsed_ms": int, "data": {...}, "raw"?: {...}},
                ...
            ],
            "hits": ["source_key", ...],
        }
    """
    barcode = str(barcode or "").strip()
    if not barcode:
        return {"barcode": "", "sources": [], "hits": [], "elapsed_ms": 0}

    keys = sources if sources is not None else _enabled_sources(include_images=True)
    keys = [k for k in keys if k]
    if not keys:
        return {"barcode": barcode, "sources": [], "hits": [], "elapsed_ms": 0}

    t0 = time.time()
    results = await asyncio.gather(
        *[_scan_one(barcode, k, download_images=download_images) for k in keys],
        return_exceptions=True,
    )

    sources_out: List[Dict[str, Any]] = []
    hits: List[str] = []
    for k, r in zip(keys, results):
        if isinstance(r, dict):
            sources_out.append(r)
            if r.get("status") == "hit":
                hits.append(k)
        else:
            sources_out.append({
                "source_key": k,
                "status": "error",
                "error": f"{type(r).__name__}: {r}"[:200],
                "elapsed_ms": 0,
                "data": {"hit": False},
            })

    return {
        "barcode": barcode,
        "scanned_at_ms": int(t0 * 1000),
        "elapsed_ms": int((time.time() - t0) * 1000),
        "sources": sources_out,
        "hits": hits,
    }
