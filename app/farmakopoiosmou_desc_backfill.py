"""Backfill full description for products whose primary source is
farmakopoiosmou but whose stored Description is still the short (~150 char)
search summary — pre-dated the Anubis full-page enrichment fix.

Reads candidates directly from db.products, calls fetch_from_farmakopoiosmou
(which now runs the Anubis enrichment on both JSON-match and fast-path
returns), and persists the longer Description back.

Resume-safe: writes each outcome to /app/data/farm_desc_backfill_results.jsonl
and skips barcodes already in that file on restart.

Env:
  DESC_MIN_LENGTH        — only refresh products whose Description is shorter
                           than this (default 200)
  DESC_BACKFILL_CONCURRENCY — parallel workers (default 2 — must stay low so
                           the shared Anubis session survives)
  DESC_BACKFILL_RESULTS  — jsonl checkpoint (default
                           /app/data/farm_desc_backfill_results.jsonl)
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

DESC_MIN_LENGTH = int(os.getenv("DESC_MIN_LENGTH", "200"))
CONCURRENCY = int(os.getenv("DESC_BACKFILL_CONCURRENCY", "2"))
RESULTS_FILE = os.getenv("DESC_BACKFILL_RESULTS", "/app/data/farm_desc_backfill_results.jsonl")
PROGRESS_FILE = os.getenv("DESC_BACKFILL_PROGRESS", "/app/data/farm_desc_backfill_progress.json")
PER_ITEM_TIMEOUT = 40.0

_u = os.getenv("MONGO_USER", "")
_p = os.getenv("MONGO_PASSWORD", "")
_h = os.getenv("MONGO_HOST", "mongodb")
_P = int(os.getenv("MONGO_PORT", "27017"))
db = MongoClient(f"mongodb://{_u}:{_p}@{_h}:{_P}")[os.getenv("MONGO_DB", "imageDB")]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def _process_one(barcode: str, sem: asyncio.Semaphore):
    from skroutzFetch import fetch_from_farmakopoiosmou
    async with sem:
        t0 = time.time()
        try:
            result = await asyncio.wait_for(
                fetch_from_farmakopoiosmou(barcode), timeout=PER_ITEM_TIMEOUT
            )
        except asyncio.TimeoutError:
            return {"barcode": barcode, "status": "timeout", "elapsed": round(time.time() - t0, 1)}
        except BaseException as exc:
            return {"barcode": barcode, "status": "error", "error": type(exc).__name__}

        if not result or not result.get("Description"):
            return {"barcode": barcode, "status": "no_desc", "elapsed": round(time.time() - t0, 1)}

        new_desc = str(result.get("Description") or "").strip()
        existing = db.products.find_one({"Barcode": barcode}, {"Description": 1})
        existing_desc = str((existing or {}).get("Description") or "").strip()
        if len(new_desc) <= len(existing_desc):
            return {
                "barcode": barcode, "status": "not_longer",
                "old_len": len(existing_desc), "new_len": len(new_desc),
                "elapsed": round(time.time() - t0, 1),
            }
        db.products.update_one(
            {"Barcode": barcode},
            {"$set": {
                "Description": new_desc,
                "cms_updated_at": _now(),
                "cms_updated_by": "system:farm_desc_backfill",
                "farm_desc_backfill_at": _now(),
                "farm_desc_backfill_from": len(existing_desc),
                "farm_desc_backfill_to": len(new_desc),
            }},
        )
        return {
            "barcode": barcode, "status": "updated",
            "old_len": len(existing_desc), "new_len": len(new_desc),
            "elapsed": round(time.time() - t0, 1),
        }


async def main():
    print(f"farm_desc_backfill: min={DESC_MIN_LENGTH} concurrency={CONCURRENCY}", flush=True)

    query = {
        "Site": {"$regex": "farmakopoiosmou", "$options": "i"},
        "$expr": {"$lt": [{"$strLenCP": {"$ifNull": ["$Description", ""]}}, DESC_MIN_LENGTH]},
    }
    all_barcodes = [
        str(d["Barcode"])
        for d in db.products.find(query, {"Barcode": 1, "_id": 0})
        if d.get("Barcode")
    ]

    done = set()
    stats = {"updated": 0, "no_desc": 0, "not_longer": 0, "timeout": 0, "error": 0, "processed": 0}
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
    print(f"{stats['processed']} already done, {len(remaining)} remaining", flush=True)

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
            result = {"barcode": bc, "status": "error", "error": type(exc).__name__}
        stats[result["status"]] = stats.get(result["status"], 0) + 1
        stats["processed"] += 1
        results_fh.write(json.dumps(result, ensure_ascii=False) + "\n")
        if stats["processed"] % 10 == 0 or stats["processed"] == stats["total"]:
            with open(PROGRESS_FILE, "w") as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
            print(
                "[{p}/{t}] updated={u} no_desc={n} not_longer={nl} timeout={to} err={e}".format(
                    p=stats["processed"], t=stats["total"],
                    u=stats["updated"], n=stats["no_desc"],
                    nl=stats["not_longer"], to=stats["timeout"], e=stats["error"],
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
