"""Image backfill for items deactivated because they had no photo at all.

Reads barcodes from BACKFILL_INPUT (defaults to
/app/data/no_image_barcodes.txt), runs the image-only source-fetch chain
for each, persists any image it finds, and — on success — flips
cms_status back to `active`. Resume-safe: writes each outcome to
/app/data/image_backfill_results.jsonl and skips barcodes already in
that file on restart.

Env:
  BACKFILL_INPUT        — input file with 1 barcode per line (default
                          /app/data/no_image_barcodes.txt)
  BACKFILL_RESULTS      — jsonl checkpoint (default
                          /app/data/image_backfill_results.jsonl)
  BACKFILL_CONCURRENCY  — parallel workers (default 2)
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
import time
import traceback
from datetime import datetime, timezone

sys.path.insert(0, "/app")
from pymongo import MongoClient

INPUT_FILE = os.getenv("BACKFILL_INPUT", "/app/data/no_image_barcodes.txt")
RESULTS_FILE = os.getenv("BACKFILL_RESULTS", "/app/data/image_backfill_results.jsonl")
PROGRESS_FILE = os.getenv("BACKFILL_PROGRESS", "/app/data/image_backfill_progress.json")
CONCURRENCY = int(os.getenv("BACKFILL_CONCURRENCY", "2"))
IMAGE_TIMEOUT_PER_SOURCE = 25.0

_u = os.getenv("MONGO_USER", "")
_p = os.getenv("MONGO_PASSWORD", "")
_h = os.getenv("MONGO_HOST", "mongodb")
_P = int(os.getenv("MONGO_PORT", "27017"))
db = MongoClient(f"mongodb://{_u}:{_p}@{_h}:{_P}")[os.getenv("MONGO_DB", "imageDB")]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def _image_phase(barcode: str, image_sources, fetch):
    for src in image_sources:
        try:
            doc = await asyncio.wait_for(
                fetch(
                    barcode,
                    text_source_chain=[src],
                    image_source_chain=[src],
                    force_source_names={src},
                    download_images=True,
                    search_terms=[],
                ),
                timeout=IMAGE_TIMEOUT_PER_SOURCE,
            )
        except BaseException:
            continue
        if doc and (doc.get("Img_src") or doc.get("Img_src_List") or doc.get("Image_Path_Collection")):
            return src, doc
    return None, None


async def _process_one(barcode, fetch, image_sources, sem):
    async with sem:
        t0 = time.time()
        try:
            src_key, img_doc = await _image_phase(barcode, image_sources, fetch)
        except BaseException as exc:
            return {"barcode": barcode, "status": "error", "error": type(exc).__name__}
        if not img_doc:
            db.products.update_one(
                {"Barcode": barcode},
                {"$set": {
                    "image_backfill_attempted_at": _now(),
                    "image_backfill_result": "no_source_match",
                }},
            )
            return {"barcode": barcode, "status": "no_image", "elapsed": round(time.time() - t0, 1)}
        # Merge just the image fields onto the existing product doc so we
        # don't wipe title/category work already done.
        set_doc = {
            "Img_src": img_doc.get("Img_src") or "",
            "Img_src_List": img_doc.get("Img_src_List") or [],
            "Image_Path_Collection": img_doc.get("Image_Path_Collection") or [],
            "Image_url": img_doc.get("Image_url") or [],
            "cms_main_image": img_doc.get("cms_main_image") or (img_doc.get("Image_url") or [None])[0] or "",
            "cms_status": "active",
            "cms_updated_at": _now(),
            "cms_updated_by": "system:image_backfill_reactivate",
            "image_backfill_attempted_at": _now(),
            "image_backfill_result": "found",
            "image_backfill_source": src_key,
        }
        # Drop empty keys so we don't overwrite existing good data with ""
        set_doc = {k: v for k, v in set_doc.items() if v not in ("", [], None) or k in {"cms_status"}}
        try:
            db.products.update_one({"Barcode": barcode}, {"$set": set_doc})
        except BaseException as exc:
            return {"barcode": barcode, "status": "db_error", "error": type(exc).__name__}
        # Log audit change
        db.cms_item_changes.insert_one({
            "item_barcode": barcode,
            "change_type": "updated",
            "field_name": "cms_status",
            "old_value": "inactive",
            "new_value": "active",
            "note": f"image_backfill: found via {src_key}",
            "changed_by": "system:image_backfill_reactivate",
            "changed_at": _now(),
        })
        return {
            "barcode": barcode,
            "status": "reactivated",
            "source": src_key,
            "elapsed": round(time.time() - t0, 1),
        }


async def main():
    from skroutzFetch import fetch_product_with_custom_source_priority as fetch
    from runtime_settings import get_enabled_image_source_chain
    image_sources = get_enabled_image_source_chain() or []
    if not image_sources:
        print("no image source chain enabled — abort")
        return

    with open(INPUT_FILE) as f:
        all_barcodes = [b.strip() for b in f if b.strip()]

    # Load already-processed
    done = set()
    stats = {"reactivated": 0, "no_image": 0, "error": 0, "db_error": 0, "processed": 0}
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
    print(f"backfill: {stats['processed']} already done, {len(remaining)} remaining", flush=True)

    if not remaining:
        stats["finished_at"] = _now()
        with open(PROGRESS_FILE, "w") as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        return

    sem = asyncio.Semaphore(CONCURRENCY)
    results_fh = open(RESULTS_FILE, "a", buffering=1)

    async def runner(bc):
        try:
            result = await _process_one(bc, fetch, image_sources, sem)
        except BaseException as exc:
            result = {"barcode": bc, "status": "error", "error": type(exc).__name__}
        stats[result["status"]] = stats.get(result["status"], 0) + 1
        stats["processed"] += 1
        results_fh.write(json.dumps(result, ensure_ascii=False) + "\n")
        if stats["processed"] % 10 == 0 or stats["processed"] == stats["total"]:
            with open(PROGRESS_FILE, "w") as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            line = "[{p}/{t}] reactivated={r} no_image={n} err={e}".format(
                p=stats["processed"], t=stats["total"],
                r=stats["reactivated"], n=stats["no_image"], e=stats["error"] + stats["db_error"],
            )
            print(line, flush=True)

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
