"""Persistent barcode → URL index for youpharmacy.gr.

The site's on-page search is JS-rendered, so we can't discover product URLs
live from a barcode query. Instead we crawl the public product sitemap
(38 paginated XML files) and persist every product URL we find, then visit
each one through FlareSolverr to extract its barcode and other key fields.

The lookup path used by `fetch_from_youpharmacy` queries this collection
first, falling back to the legacy `db.products.Product_Link` mappings that
came from the March 2026 XML import.

Collection: `youpharmacy_url_index`
Document shape:
  {
    "_id": ObjectId,
    "url": "https://www.youpharmacy.gr/product/<slug>/",
    "slug": "<slug>",
    "barcode": "5203069090653" | "",      # filled by the discovery worker
    "title": "Korres Eau de Toilette ...", # optional, filled when scraped
    "brand": "Korres",
    "discovered_at": iso-string,           # when slug entered the index
    "barcoded_at": iso-string,             # when we resolved its barcode
    "last_fetched_at": iso-string,         # last live page fetch
    "fetch_status": "pending" | "barcoded" | "no_barcode" | "error",
    "error_count": int,
  }
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

COLLECTION = "youpharmacy_url_index"

STATUS_PENDING = "pending"
STATUS_BARCODED = "barcoded"
STATUS_NO_BARCODE = "no_barcode"
STATUS_ERROR = "error"


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _slug_from_url(url: str) -> str:
    url = (url or "").strip().rstrip("/")
    if "/product/" not in url:
        return ""
    return url.split("/product/", 1)[1].strip("/")


async def ensure_indexes(db) -> None:
    coll = db[COLLECTION]
    await coll.create_index([("url", 1)], unique=True)
    await coll.create_index([("barcode", 1)], sparse=True)
    await coll.create_index([("slug", 1)], sparse=True)
    await coll.create_index([("fetch_status", 1), ("discovered_at", 1)])


async def upsert_urls(db, urls: List[str]) -> Dict[str, int]:
    """Insert any sitemap URL we haven't seen before. Idempotent."""
    inserted = 0
    seen = 0
    coll = db[COLLECTION]
    now = _utcnow_iso()
    for raw in urls:
        url = str(raw or "").strip()
        if not url or "/product/" not in url:
            continue
        seen += 1
        slug = _slug_from_url(url)
        result = await coll.update_one(
            {"url": url},
            {
                "$setOnInsert": {
                    "url": url,
                    "slug": slug,
                    "barcode": "",
                    "title": "",
                    "brand": "",
                    "discovered_at": now,
                    "barcoded_at": "",
                    "last_fetched_at": "",
                    "fetch_status": STATUS_PENDING,
                    "error_count": 0,
                }
            },
            upsert=True,
        )
        if result.upserted_id is not None:
            inserted += 1
    return {"seen": seen, "inserted": inserted}


async def lookup_url_for_barcode(db, barcode: str) -> str:
    """Return the youpharmacy product URL for a barcode, or "" if unknown."""
    barcode = str(barcode or "").strip()
    if not barcode:
        return ""
    doc = await db[COLLECTION].find_one(
        {"barcode": barcode, "fetch_status": STATUS_BARCODED},
        {"url": 1},
    )
    return str((doc or {}).get("url", "") or "")


async def attach_barcode(
    db,
    url: str,
    *,
    barcode: str,
    title: str = "",
    brand: str = "",
) -> None:
    await db[COLLECTION].update_one(
        {"url": url},
        {
            "$set": {
                "barcode": str(barcode or "").strip(),
                "title": str(title or "").strip(),
                "brand": str(brand or "").strip(),
                "barcoded_at": _utcnow_iso(),
                "last_fetched_at": _utcnow_iso(),
                "fetch_status": STATUS_BARCODED,
            }
        },
    )


async def mark_no_barcode(db, url: str) -> None:
    await db[COLLECTION].update_one(
        {"url": url},
        {
            "$set": {
                "last_fetched_at": _utcnow_iso(),
                "fetch_status": STATUS_NO_BARCODE,
            }
        },
    )


async def mark_error(db, url: str, *, reason: str = "") -> None:
    await db[COLLECTION].update_one(
        {"url": url},
        {
            "$set": {
                "last_fetched_at": _utcnow_iso(),
                "fetch_status": STATUS_ERROR,
            },
            "$inc": {"error_count": 1},
        },
    )


async def next_pending_batch(db, limit: int = 50) -> List[Dict[str, Any]]:
    """Return URLs that still need discovery (pending or transient errors)."""
    query = {
        "$or": [
            {"fetch_status": STATUS_PENDING},
            {"fetch_status": STATUS_ERROR, "error_count": {"$lt": 3}},
        ]
    }
    cursor = (
        db[COLLECTION]
        .find(query)
        .sort([("error_count", 1), ("discovered_at", 1)])
        .limit(int(limit))
    )
    return [doc async for doc in cursor]


async def stats(db) -> Dict[str, int]:
    coll = db[COLLECTION]
    total = await coll.count_documents({})
    barcoded = await coll.count_documents({"fetch_status": STATUS_BARCODED})
    pending = await coll.count_documents({"fetch_status": STATUS_PENDING})
    no_barcode = await coll.count_documents({"fetch_status": STATUS_NO_BARCODE})
    error = await coll.count_documents({"fetch_status": STATUS_ERROR})
    return {
        "total": total,
        "barcoded": barcoded,
        "pending": pending,
        "no_barcode": no_barcode,
        "error": error,
    }
