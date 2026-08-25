"""Resume version of bulk_enrich with hardened error handling."""
import asyncio
import json
import os
import sys
import time
import traceback
from datetime import datetime, timezone

sys.path.insert(0, "/app")
from pymongo import MongoClient

INPUT_FILE = os.getenv("BULK_REMAINING_FILE", "/app/data/remaining.txt")
PROGRESS_FILE = os.getenv("BULK_PROGRESS_FILE", "/app/data/bulk_enrich_progress.json")
RESULTS_FILE = os.getenv("BULK_RESULTS_FILE", "/app/data/bulk_enrich_results.jsonl")
CONCURRENCY = int(os.getenv("BULK_CONCURRENCY", "2"))
TEXT_TIMEOUT = 14.0
IMAGE_TIMEOUT_PER_SOURCE = 18.0

_u = os.getenv("MONGO_USER", "")
_p = os.getenv("MONGO_PASSWORD", "")
_h = os.getenv("MONGO_HOST", "mongodb")
_P = int(os.getenv("MONGO_PORT", "27017"))
mongo_uri = "mongodb://" + _u + ":" + _p + "@" + _h + ":" + str(_P)
db = MongoClient(mongo_uri)[os.getenv("MONGO_DB", "imageDB")]


def _utcnow_iso():
    return datetime.now(timezone.utc).isoformat()


async def text_phase(barcode, text_sources, fetch):
    async def one(src):
        try:
            doc = await asyncio.wait_for(
                fetch(barcode, text_source_chain=[src], image_source_chain=[src],
                      force_source_names={src}, download_images=False, search_terms=[]),
                timeout=TEXT_TIMEOUT,
            )
            return src, doc
        except BaseException:
            return src, None

    results = await asyncio.gather(*[one(s) for s in text_sources], return_exceptions=True)
    out = []
    for r in results:
        if isinstance(r, tuple) and r[1]:
            out.append(r)
    return out


async def image_phase(barcode, image_sources, fetch):
    for src in image_sources:
        try:
            img_doc = await asyncio.wait_for(
                fetch(barcode, text_source_chain=[src], image_source_chain=[src],
                      force_source_names={src}, download_images=True, search_terms=[]),
                timeout=IMAGE_TIMEOUT_PER_SOURCE,
            )
        except BaseException:
            continue
        if img_doc and (img_doc.get("Img_src") or img_doc.get("Img_src_List")):
            return src, img_doc
    return None, None


def merge_text(valid_text):
    import re
    GREEK = re.compile(r"[Ͱ-Ͽἀ-῿]")
    merged = {}
    attribution = {}

    def pick_longest(field, prefer_greek=False):
        best = ""
        best_src = ""
        for src, doc in valid_text:
            v = str(doc.get(field) or "").strip()
            if not v:
                continue
            if prefer_greek:
                if GREEK.search(v) and not GREEK.search(best):
                    best, best_src = v, src
                    continue
                if GREEK.search(best) and not GREEK.search(v):
                    continue
            if len(v) > len(best):
                best, best_src = v, src
        if best:
            merged[field] = best
            attribution[field] = best_src

    for f in ("Title", "Brand", "Weight"):
        pick_longest(f)
    for f in ("Sml_Title", "Description"):
        pick_longest(f, prefer_greek=True)

    best_path = []
    best_path_src = ""
    for src, doc in valid_text:
        p = [str(doc.get(k) or "").strip() for k in ("Category_1", "Category_2", "Category_3")]
        p = [x for x in p if x]
        if len(p) > len(best_path):
            best_path = p
            best_path_src = src
    if best_path:
        keys = ("Category_1", "Category_2", "Category_3")
        for i, key in enumerate(keys):
            if i < len(best_path):
                merged[key] = best_path[i]
        merged["Categ"] = best_path[-1]
        attribution["Category"] = best_path_src

    title_src = attribution.get("Title")
    if title_src:
        for src, doc in valid_text:
            if src == title_src and doc.get("Product_Link"):
                merged["Product_Link"] = doc["Product_Link"]
                break
    return merged, attribution


async def enrich_one(barcode, fetch, text_sources, image_sources, sem):
    async with sem:
        t0 = time.time()
        try:
            valid = await text_phase(barcode, text_sources, fetch)
        except BaseException as exc:
            return {"barcode": barcode, "status": "error", "error": "text:" + type(exc).__name__}
        if not valid:
            return {"barcode": barcode, "status": "no_data", "elapsed": round(time.time() - t0, 1)}
        merged, attribution = merge_text(valid)
        if not merged:
            return {"barcode": barcode, "status": "no_data", "elapsed": round(time.time() - t0, 1)}
        try:
            img_src_key, img_doc = await image_phase(barcode, image_sources, fetch)
        except BaseException:
            img_src_key, img_doc = None, None
        if img_doc:
            for k in ("Img_src", "Img_src_List", "Image_Path_Collection"):
                if img_doc.get(k):
                    merged[k] = img_doc[k]
            attribution["Image"] = img_src_key
        merged["Barcode"] = barcode
        merged["Site"] = attribution.get("Title") or attribution.get("Image") or ""
        merged["last_source"] = merged["Site"]
        try:
            from catalog_quality import build_catalog_quality_updates
            existing = db.products.find_one({"Barcode": barcode}) or {}
            candidate = {**existing, **merged}
            merged.update(build_catalog_quality_updates(candidate, evaluator="bulk_enrich:pdf_2026_06_25"))
        except BaseException as exc:
            print("quality eval failed for " + barcode + ": " + str(exc), flush=True)
        merged["bulk_enriched_at"] = _utcnow_iso()
        merged["bulk_enriched_attribution"] = attribution
        try:
            db.products.update_one(
                {"Barcode": barcode},
                {"$set": merged, "$setOnInsert": {"created_at": _utcnow_iso()}},
                upsert=True,
            )
        except BaseException as exc:
            return {"barcode": barcode, "status": "error", "error": "db:" + type(exc).__name__}
        cms_status = merged.get("cms_status", "inactive")
        return {
            "barcode": barcode,
            "status": "saved_active" if cms_status == "active" else "saved_partial",
            "elapsed": round(time.time() - t0, 1),
            "cms_status": cms_status,
            "missing": merged.get("catalog_missing_requirements", []) or [],
            "attribution": attribution,
        }


def write_progress(state):
    state["updated_at"] = _utcnow_iso()
    with open(PROGRESS_FILE, "w") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


async def main():
    from skroutzFetch import fetch_product_with_custom_source_priority as fetch
    from runtime_settings import get_enabled_text_source_chain, get_enabled_image_source_chain
    text_sources = get_enabled_text_source_chain() or []
    image_sources = get_enabled_image_source_chain() or []

    with open(INPUT_FILE) as f:
        barcodes = [b.strip() for b in f if b.strip()]

    prev = {"saved_active": 0, "saved_partial": 0, "no_data": 0, "error": 0, "processed": 0}
    try:
        for line in open(RESULTS_FILE):
            r = json.loads(line)
            prev[r["status"]] = prev.get(r["status"], 0) + 1
            prev["processed"] += 1
    except FileNotFoundError:
        pass
    print("resume: " + str(prev["processed"]) + " already done, " + str(len(barcodes)) + " remaining", flush=True)

    sem = asyncio.Semaphore(CONCURRENCY)
    stats = {"total": prev["processed"] + len(barcodes), **prev, "started_at": _utcnow_iso()}
    write_progress(stats)
    results_fh = open(RESULTS_FILE, "a", buffering=1)

    async def runner(b):
        try:
            result = await enrich_one(b, fetch, text_sources, image_sources, sem)
        except BaseException as exc:
            result = {"barcode": b, "status": "error", "error": "runner:" + type(exc).__name__}
        stats[result["status"]] = stats.get(result["status"], 0) + 1
        stats["processed"] += 1
        results_fh.write(json.dumps(result, ensure_ascii=False) + "\n")
        if stats["processed"] % 25 == 0 or stats["processed"] == stats["total"]:
            write_progress(stats)
            line = "[{p}/{t}] active={a} partial={pp} no_data={n} err={e}".format(
                p=stats["processed"], t=stats["total"],
                a=stats["saved_active"], pp=stats["saved_partial"],
                n=stats["no_data"], e=stats["error"],
            )
            print(line, flush=True)

    await asyncio.gather(*(runner(b) for b in barcodes), return_exceptions=True)
    stats["finished_at"] = _utcnow_iso()
    write_progress(stats)
    results_fh.close()
    print("DONE: " + json.dumps(stats, ensure_ascii=False))


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except BaseException:
        traceback.print_exc()
        sys.exit(1)
