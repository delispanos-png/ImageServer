"""Full-product audit for farmakopoiosmou items: re-fetch text + images +
categories, merge into db.products, then move to review queue for a human
final check.

Scope: any product where Site (case-insensitive) matches farmakopoiosmou AND
has at least one deficiency:
    - short Description (<200 chars)
    - no hosted image (cms_main_image empty)
    - no Category_1
    - catalog_quality_state == 'needs_fix'

Strategy per item:
    1. Call fetch_from_farmakopoiosmou(barcode) with download_images=True.
       Uses the Anubis fast-path (session reuse) and shared Playwright
       browsers — cheap per call after the first.
    2. If the fetch returned useful text/image data, merge non-empty fields
       into the existing doc (preserving stronger existing values via a
       "longer wins" rule for text, "any wins" for images).
    3. Call build_catalog_quality_updates(..., queue_for_review=True). This
       flips the doc into `catalog_quality_state=ready_for_review` +
       `cms_status=inactive` so an admin can final-review it in the CMS
       "queue for review" view before re-activation.
    4. Log an audit change entry noting the audit source.

Resume-safe via /app/data/farm_audit_results.jsonl.

Env:
    FARM_AUDIT_CONCURRENCY     — parallel workers (default 2)
    FARM_AUDIT_ITEM_TIMEOUT    — per-barcode timeout, seconds (default 45)
    FARM_AUDIT_RESULTS         — jsonl checkpoint
    FARM_AUDIT_PROGRESS        — json progress snapshot
"""
from __future__ import annotations

import asyncio
import json
import os
import re
import sys
import time
import traceback
from datetime import datetime, timezone
from typing import Any, Dict, List

sys.path.insert(0, "/app")
from pymongo import MongoClient

CONCURRENCY = int(os.getenv("FARM_AUDIT_CONCURRENCY", "2"))
PER_ITEM_TIMEOUT = float(os.getenv("FARM_AUDIT_ITEM_TIMEOUT", "45"))
RESULTS_FILE = os.getenv("FARM_AUDIT_RESULTS", "/app/data/farm_audit_results.jsonl")
PROGRESS_FILE = os.getenv("FARM_AUDIT_PROGRESS", "/app/data/farm_audit_progress.json")

_u = os.getenv("MONGO_USER", "")
_p = os.getenv("MONGO_PASSWORD", "")
_h = os.getenv("MONGO_HOST", "mongodb")
_P = int(os.getenv("MONGO_PORT", "27017"))
db = MongoClient(f"mongodb://{_u}:{_p}@{_h}:{_P}")[os.getenv("MONGO_DB", "imageDB")]

GREEK = re.compile(r"[Ͱ-Ͽἀ-῿]")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _pick_stronger_text(existing: str, incoming: str, prefer_greek: bool = False) -> str:
    e = str(existing or "").strip()
    i = str(incoming or "").strip()
    if not i:
        return e
    if not e:
        return i
    if prefer_greek:
        if GREEK.search(i) and not GREEK.search(e):
            return i
        if GREEK.search(e) and not GREEK.search(i):
            return e
    return i if len(i) > len(e) else e


def _merge_fields(existing: Dict[str, Any], fetched: Dict[str, Any]) -> Dict[str, Any]:
    """Return $set updates that improve the record without wiping good data."""
    updates: Dict[str, Any] = {}
    # Text fields: longer / Greek preferred
    for f in ("Title", "Sml_Title", "Description"):
        new_val = _pick_stronger_text(existing.get(f), fetched.get(f), prefer_greek=(f in ("Sml_Title", "Description")))
        if new_val and new_val != str(existing.get(f) or "").strip():
            updates[f] = new_val
    # Categories: fill missing only
    for f in ("Brand", "Weight", "Category_1", "Category_2", "Category_3", "Categ"):
        cur = str(existing.get(f) or "").strip()
        new_val = str(fetched.get(f) or "").strip()
        if not cur and new_val:
            updates[f] = new_val
    # Image fields: prefer newly-hosted over none; merge lists
    for list_field in ("Img_src_List", "Image_Path_Collection", "Image_url"):
        cur_list = existing.get(list_field) or []
        new_list = fetched.get(list_field) or []
        if not isinstance(cur_list, list):
            cur_list = []
        if not isinstance(new_list, list):
            new_list = []
        merged = list(cur_list)
        for u in new_list:
            if u and u not in merged:
                merged.append(u)
        if merged != cur_list:
            updates[list_field] = merged
    for f in ("Img_src", "cms_main_image"):
        cur = str(existing.get(f) or "").strip()
        new_val = str(fetched.get(f) or "").strip()
        if not cur and new_val:
            updates[f] = new_val
    if fetched.get("Product_Link") and not existing.get("Product_Link"):
        updates["Product_Link"] = fetched["Product_Link"]
    return updates


async def _process_one(barcode: str, sem: asyncio.Semaphore) -> Dict[str, Any]:
    from skroutzFetch import fetch_from_farmakopoiosmou
    from catalog_quality import build_catalog_quality_updates
    async with sem:
        t0 = time.time()
        try:
            fetched = await asyncio.wait_for(
                fetch_from_farmakopoiosmou(barcode), timeout=PER_ITEM_TIMEOUT
            )
        except asyncio.TimeoutError:
            return {"barcode": barcode, "status": "timeout", "elapsed": round(time.time() - t0, 1)}
        except BaseException as exc:
            return {"barcode": barcode, "status": "fetch_error", "error": type(exc).__name__}

        if not fetched or not (fetched.get("Title") or fetched.get("Description") or fetched.get("Image_url")):
            return {"barcode": barcode, "status": "no_data", "elapsed": round(time.time() - t0, 1)}

        existing = db.products.find_one({"Barcode": barcode})
        if not existing:
            return {"barcode": barcode, "status": "not_in_db"}

        merged_updates = _merge_fields(existing, fetched)
        if not merged_updates:
            # No new data to add — still transition to review so admin can decide.
            merged_updates = {}
        # Combine with existing for the quality evaluation
        candidate_doc = {**existing, **merged_updates}
        merged_updates.update(
            build_catalog_quality_updates(
                candidate_doc,
                evaluator="system:farm_full_audit",
                queue_for_review=True,
                reviewed_by="",
            )
        )
        merged_updates["cms_updated_at"] = _now()
        merged_updates["cms_updated_by"] = "system:farm_full_audit"
        merged_updates["farm_audit_at"] = _now()

        try:
            db.products.update_one({"Barcode": barcode}, {"$set": merged_updates})
        except BaseException as exc:
            return {"barcode": barcode, "status": "db_error", "error": type(exc).__name__}

        # Audit trail — one entry per field that we actually changed (excluding
        # bookkeeping fields) so the CMS "changes" tab shows the diff.
        BOOKKEEPING = {
            "cms_updated_at", "cms_updated_by", "farm_audit_at",
            "catalog_last_evaluated_at", "catalog_last_evaluated_by",
        }
        change_docs: List[Dict[str, Any]] = []
        for field, new_val in merged_updates.items():
            if field in BOOKKEEPING:
                continue
            old_val = existing.get(field, "")
            if old_val == new_val:
                continue
            change_docs.append({
                "item_barcode": barcode,
                "change_type": "updated",
                "field_name": field,
                "old_value": str(old_val)[:500] if not isinstance(old_val, (list, dict)) else old_val,
                "new_value": str(new_val)[:500] if not isinstance(new_val, (list, dict)) else new_val,
                "note": "farm_full_audit",
                "changed_by": "system:farm_full_audit",
                "changed_at": _now(),
            })
        if change_docs:
            try:
                db.cms_item_changes.insert_many(change_docs)
            except BaseException:
                pass

        return {
            "barcode": barcode,
            "status": "updated",
            "field_changes": len(change_docs),
            "quality_state": merged_updates.get("catalog_quality_state"),
            "moved_to_review": bool(merged_updates.get("catalog_review_required")),
            "elapsed": round(time.time() - t0, 1),
        }


async def main():
    short_desc = {"$expr": {"$lt": [{"$strLenCP": {"$ifNull": ["$Description", ""]}}, 200]}}
    no_hosted = {"$or": [{"cms_main_image": {"$exists": False}}, {"cms_main_image": ""}, {"cms_main_image": None}]}
    no_cat = {"$or": [{"Category_1": ""}, {"Category_1": {"$exists": False}}, {"Category_1": None}]}
    needs_fix = {"catalog_quality_state": "needs_fix"}

    query = {
        "Site": {"$regex": "farmakopoiosmou", "$options": "i"},
        "$or": [short_desc, no_hosted, no_cat, needs_fix],
    }
    all_barcodes = [
        str(d["Barcode"])
        for d in db.products.find(query, {"Barcode": 1, "_id": 0})
        if d.get("Barcode")
    ]

    done = set()
    stats: Dict[str, Any] = {
        "updated": 0, "no_data": 0, "not_in_db": 0,
        "timeout": 0, "fetch_error": 0, "db_error": 0,
        "processed": 0,
    }
    try:
        for line in open(RESULTS_FILE):
            r = json.loads(line)
            bc = r.get("barcode")
            if bc:
                done.add(bc)
                s = r.get("status", "unknown")
                stats[s] = stats.get(s, 0) + 1
                stats["processed"] += 1
    except FileNotFoundError:
        pass

    remaining = [b for b in all_barcodes if b not in done]
    stats["total"] = len(all_barcodes)
    stats["started_at"] = _now()
    with open(PROGRESS_FILE, "w") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    print(f"farm_full_audit: {stats['processed']} already done, {len(remaining)} remaining "
          f"(concurrency={CONCURRENCY}, per-item timeout={PER_ITEM_TIMEOUT}s)", flush=True)

    if not remaining:
        stats["finished_at"] = _now()
        with open(PROGRESS_FILE, "w") as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        return

    sem = asyncio.Semaphore(CONCURRENCY)
    results_fh = open(RESULTS_FILE, "a", buffering=1)

    async def runner(bc):
        try:
            result = await _process_one(bc, sem)
        except BaseException as exc:
            result = {"barcode": bc, "status": "fetch_error", "error": type(exc).__name__}
        stats[result["status"]] = stats.get(result["status"], 0) + 1
        stats["processed"] += 1
        results_fh.write(json.dumps(result, ensure_ascii=False) + "\n")
        if stats["processed"] % 20 == 0 or stats["processed"] == stats["total"]:
            with open(PROGRESS_FILE, "w") as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            print(
                "[{p}/{t}] updated={u} no_data={n} timeout={to} err={e}".format(
                    p=stats["processed"], t=stats["total"],
                    u=stats["updated"], n=stats["no_data"],
                    to=stats["timeout"], e=stats["fetch_error"] + stats["db_error"],
                ), flush=True,
            )

    await asyncio.gather(*(runner(b) for b in remaining), return_exceptions=True)
    stats["finished_at"] = _now()
    with open(PROGRESS_FILE, "w") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    results_fh.close()
    print("DONE: " + json.dumps(stats, ensure_ascii=False))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except BaseException:
        traceback.print_exc()
        sys.exit(1)
