"""Priority backfill for the hive-pharmacy barcode list.

Reads /app/data/hive_priority_barcodes.txt and, for each barcode:
    1. Skips if the record is already complete (has an image AND
       Description ≥ 100 chars).
    2. Otherwise runs the FULL source chain (text + image phase) — same
       pipeline as bulk_enrich_resume.py.
    3. Merges the fetched fields into the existing product (or upserts if
       the barcode was entirely missing), moves the doc to the review
       queue via build_catalog_quality_updates(queue_for_review=True), and
       logs an audit trail entry.

Resume-safe checkpoint at /app/data/hive_priority_results.jsonl.

Env:
    HIVE_CONCURRENCY   — parallel workers (default 3)
    HIVE_ITEM_TIMEOUT  — per-barcode timeout, seconds (default 40)
    HIVE_INPUT         — path to barcode list (default /app/data/hive_priority_barcodes.txt)
    HIVE_RESULTS       — checkpoint file (default /app/data/hive_priority_results.jsonl)
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

CONCURRENCY = int(os.getenv("HIVE_CONCURRENCY", "3"))
PER_ITEM_TIMEOUT = float(os.getenv("HIVE_ITEM_TIMEOUT", "40"))
INPUT_FILE = os.getenv("HIVE_INPUT", "/app/data/hive_priority_barcodes.txt")
RESULTS_FILE = os.getenv("HIVE_RESULTS", "/app/data/hive_priority_results.jsonl")
PROGRESS_FILE = os.getenv("HIVE_PROGRESS", "/app/data/hive_priority_progress.json")

_u = os.getenv("MONGO_USER", "")
_p = os.getenv("MONGO_PASSWORD", "")
_h = os.getenv("MONGO_HOST", "mongodb")
_P = int(os.getenv("MONGO_PORT", "27017"))
db = MongoClient(f"mongodb://{_u}:{_p}@{_h}:{_P}")[os.getenv("MONGO_DB", "imageDB")]

GREEK = re.compile(r"[Ͱ-Ͽἀ-῿]")
TEXT_TIMEOUT_PER_SOURCE = 14.0
IMAGE_TIMEOUT_PER_SOURCE = 18.0


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


def _is_complete(existing: Dict[str, Any]) -> bool:
    has_img = bool(
        existing.get("cms_main_image") or existing.get("Image_url") or existing.get("Img_src")
    )
    desc_len = len(str(existing.get("Description") or "").strip())
    return has_img and desc_len >= 100


async def _text_phase(barcode: str, sources, fetch) -> List[tuple]:
    """Serial with early-exit: try each source in priority order and stop
    the moment one returns data. Trims the wasted-timeout cost for barcodes
    that don't exist anywhere (~5×15s → ~15s). Priority is set so
    farmakopoiosmou runs first — currently 100% of hits — so this rarely
    misses a fallback opportunity."""
    results: List[tuple] = []
    for src in sources:
        try:
            doc = await asyncio.wait_for(
                fetch(barcode, text_source_chain=[src], image_source_chain=[src],
                      force_source_names={src}, download_images=False, search_terms=[]),
                timeout=TEXT_TIMEOUT_PER_SOURCE,
            )
        except BaseException:
            doc = None
        if doc:
            results.append((src, doc))
            break  # early-exit: first hit wins for the hive batch job
    return results


async def _image_phase(barcode: str, sources, fetch):
    for src in sources:
        try:
            doc = await asyncio.wait_for(
                fetch(barcode, text_source_chain=[src], image_source_chain=[src],
                      force_source_names={src}, download_images=True, search_terms=[]),
                timeout=IMAGE_TIMEOUT_PER_SOURCE,
            )
        except BaseException:
            continue
        if doc and (doc.get("Img_src") or doc.get("Img_src_List") or doc.get("Image_Path_Collection")):
            return src, doc
    return None, None


def _merge_text(existing: Dict[str, Any], valid_text: List[tuple]) -> Dict[str, Any]:
    merged: Dict[str, Any] = {}
    def stronger(field, prefer_greek=False):
        best_val = str(existing.get(field) or "").strip()
        best_src = ""
        for src, doc in valid_text:
            candidate = str(doc.get(field) or "").strip()
            if not candidate:
                continue
            if prefer_greek:
                if GREEK.search(candidate) and not GREEK.search(best_val):
                    best_val, best_src = candidate, src
                    continue
                if GREEK.search(best_val) and not GREEK.search(candidate):
                    continue
            if len(candidate) > len(best_val):
                best_val, best_src = candidate, src
        if best_val and best_val != str(existing.get(field) or "").strip():
            merged[field] = best_val
        return best_src

    stronger("Title")
    stronger("Brand")
    stronger("Weight")
    stronger("Sml_Title", prefer_greek=True)
    stronger("Description", prefer_greek=True)

    # Categories: prefer the longest path
    best_path: List[str] = []
    best_path_src = ""
    for src, doc in valid_text:
        p = [str(doc.get(k) or "").strip() for k in ("Category_1", "Category_2", "Category_3")]
        p = [x for x in p if x]
        if len(p) > len(best_path):
            best_path, best_path_src = p, src
    if best_path:
        for i, key in enumerate(("Category_1", "Category_2", "Category_3")):
            if i < len(best_path):
                merged[key] = best_path[i]
        merged["Categ"] = best_path[-1]
        if best_path_src:
            merged["last_source"] = best_path_src
    return merged


async def _process_one(barcode: str, text_sources, image_sources, fetch, sem) -> Dict[str, Any]:
    from catalog_quality import build_catalog_quality_updates
    async with sem:
        t0 = time.time()
        existing = db.products.find_one({"Barcode": barcode}) or {}
        if _is_complete(existing):
            return {"barcode": barcode, "status": "already_complete", "elapsed": round(time.time() - t0, 1)}

        try:
            valid_text = await _text_phase(barcode, text_sources, fetch)
        except BaseException as exc:
            return {"barcode": barcode, "status": "text_error", "error": type(exc).__name__}

        try:
            img_src_key, img_doc = await _image_phase(barcode, image_sources, fetch)
        except BaseException:
            img_src_key, img_doc = None, None

        if not valid_text and not img_doc:
            return {"barcode": barcode, "status": "no_data", "elapsed": round(time.time() - t0, 1)}

        updates = _merge_text(existing, valid_text)
        primary_src = ""
        if valid_text:
            primary_src = valid_text[0][0]
        # Farmakopoiosmou downloads run the watermark stripper inside
        # `_prepare_image_bytes_for_storage`. Reflect that in the DB flag
        # so downstream cleanup jobs don't touch already-clean pixels.
        if img_src_key == "farmakopoiosmou" and img_doc and (
            img_doc.get("Img_src") or img_doc.get("Image_Path_Collection")
        ):
            try:
                from skroutzFetch import was_watermark_cleanup_applied_for_source
                if was_watermark_cleanup_applied_for_source("farmakopoiosmou"):
                    updates["watermark_cleanup_applied"] = True
            except Exception:
                pass
        # Image merge: fill missing / extend list
        if img_doc:
            for lf in ("Img_src_List", "Image_Path_Collection", "Image_url"):
                cur = existing.get(lf) or []
                nxt = img_doc.get(lf) or []
                if not isinstance(cur, list): cur = []
                if not isinstance(nxt, list): nxt = []
                merged_list = list(cur)
                for u in nxt:
                    if u and u not in merged_list:
                        merged_list.append(u)
                if merged_list != cur:
                    updates[lf] = merged_list
            for sf in ("Img_src", "cms_main_image"):
                cur = str(existing.get(sf) or "").strip()
                nxt = str(img_doc.get(sf) or "").strip()
                if not cur and nxt:
                    updates[sf] = nxt

        if not updates:
            return {"barcode": barcode, "status": "no_new_data", "elapsed": round(time.time() - t0, 1)}

        updates["Barcode"] = barcode
        if primary_src and "Site" not in updates:
            updates["Site"] = existing.get("Site") or primary_src
        updates["cms_updated_at"] = _now()
        updates["cms_updated_by"] = "system:hive_priority_backfill"
        updates["hive_backfill_at"] = _now()

        candidate_doc = {**existing, **updates}
        updates.update(
            build_catalog_quality_updates(
                candidate_doc,
                evaluator="system:hive_priority_backfill",
                queue_for_review=True,
                reviewed_by="",
            )
        )
        try:
            db.products.update_one(
                {"Barcode": barcode},
                {"$set": updates, "$setOnInsert": {"created_at": _now()}},
                upsert=True,
            )
        except BaseException as exc:
            return {"barcode": barcode, "status": "db_error", "error": type(exc).__name__}

        db.cms_item_changes.insert_one({
            "item_barcode": barcode,
            "change_type": "updated",
            "field_name": "hive_priority_backfill",
            "old_value": "",
            "new_value": {
                "text_sources_hit": [s for s, _ in valid_text],
                "image_source": img_src_key or "",
                "was_missing": not existing,
            },
            "note": "hive_priority",
            "changed_by": "system:hive_priority_backfill",
            "changed_at": _now(),
        })

        # Update missing_barcode_requests status if this was previously
        # missing — moves it out of "pending" so admins don't chase it.
        try:
            from missing_barcodes import mark_status
            new_status = "found" if (valid_text or img_doc) else "not_found"
            await mark_status(db, barcode, status=new_status,
                              notes="hive_priority_backfill", increment_attempt=True)
        except BaseException:
            pass

        return {
            "barcode": barcode, "status": "enriched",
            "text_hits": len(valid_text),
            "image": img_src_key or "",
            "was_missing": not existing,
            "elapsed": round(time.time() - t0, 1),
        }


async def main():
    from skroutzFetch import fetch_product_with_custom_source_priority as fetch
    from runtime_settings import get_enabled_text_source_chain, get_enabled_image_source_chain
    text_sources = get_enabled_text_source_chain() or []
    image_sources = get_enabled_image_source_chain() or []

    with open(INPUT_FILE) as f:
        all_barcodes = [b.strip() for b in f if b.strip()]

    done = set()
    stats = {
        "enriched": 0, "already_complete": 0, "no_data": 0, "no_new_data": 0,
        "text_error": 0, "db_error": 0, "processed": 0,
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
    print(f"hive_priority: {stats['processed']} already done, {len(remaining)} remaining "
          f"(concurrency={CONCURRENCY})", flush=True)

    if not remaining:
        stats["finished_at"] = _now()
        with open(PROGRESS_FILE, "w") as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        return

    sem = asyncio.Semaphore(CONCURRENCY)
    results_fh = open(RESULTS_FILE, "a", buffering=1)

    async def runner(bc):
        try:
            result = await _process_one(bc, text_sources, image_sources, fetch, sem)
        except BaseException as exc:
            result = {"barcode": bc, "status": "text_error", "error": type(exc).__name__}
        stats[result["status"]] = stats.get(result["status"], 0) + 1
        stats["processed"] += 1
        results_fh.write(json.dumps(result, ensure_ascii=False) + "\n")
        if stats["processed"] % 10 == 0 or stats["processed"] == stats["total"]:
            with open(PROGRESS_FILE, "w") as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            print(
                "[{p}/{t}] enriched={e} already={a} no_data={n} err={err}".format(
                    p=stats["processed"], t=stats["total"],
                    e=stats["enriched"], a=stats["already_complete"],
                    n=stats["no_data"], err=stats["text_error"] + stats["db_error"],
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
