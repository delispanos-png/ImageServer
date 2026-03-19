import argparse
import asyncio
import json
import os
import random
import time
from pathlib import Path
from urllib.parse import urlparse

import aiohttp
from dotenv import load_dotenv
from pymongo import MongoClient

from skroutzFetch import _download_image_with_retries
from image_paths import has_any_local_image, primary_image_path
from catalog_quality import build_catalog_quality_updates


BACKFILL_MIN_INTERVAL_SECONDS = float(os.getenv("BACKFILL_MIN_INTERVAL_SECONDS", "4.0"))
BACKFILL_INTERVAL_JITTER_SECONDS = float(os.getenv("BACKFILL_INTERVAL_JITTER_SECONDS", "1.0"))
_BACKFILL_REQUEST_LOCK = asyncio.Lock()
_BACKFILL_LAST_REQUEST_AT = 0.0
FAILURE_LOG_PATH = Path("/app/backfill_failures.jsonl")
STATE_PATH = Path("/app/backfill_resume_state.json")


async def apply_backfill_rate_limit() -> None:
    global _BACKFILL_LAST_REQUEST_AT

    async with _BACKFILL_REQUEST_LOCK:
        target_at = _BACKFILL_LAST_REQUEST_AT + BACKFILL_MIN_INTERVAL_SECONDS + random.uniform(
            0, BACKFILL_INTERVAL_JITTER_SECONDS
        )
        now = time.monotonic()
        wait_seconds = target_at - now
        if wait_seconds > 0:
            await asyncio.sleep(wait_seconds)
        _BACKFILL_LAST_REQUEST_AT = time.monotonic()


def infer_site_name(img_src: str, last_source: str) -> str:
    if last_source:
        return last_source

    host = urlparse(img_src).netloc.lower()
    if "ofarmakopoiosmou" in host:
        return "farmakopoiosmou"
    if "skroutz" in host:
        return "skroutz"
    if "pharmacy295" in host:
        return "pharmacy295"
    return ""


def refresh_catalog_quality(db, barcode: str) -> None:
    doc = db.products.find_one({"Barcode": barcode})
    if not doc:
        return
    updates = build_catalog_quality_updates(
        doc,
        evaluator="automation:backfill_hosted_images",
    )
    db.products.update_one({"_id": doc["_id"]}, {"$set": updates})


async def process_record(record: dict, images_dir: Path, semaphore: asyncio.Semaphore, db) -> str:
    barcode = str(record.get("Barcode", "")).strip()
    img_src = str(record.get("Img_src", "")).strip()
    last_source = str(record.get("last_source", "")).strip()

    if not barcode or not img_src:
        return "skipped"

    if has_any_local_image(images_dir, barcode):
        return "exists"
    image_path = primary_image_path(images_dir, barcode)

    async with semaphore:
        await apply_backfill_rate_limit()
        status = await probe_image_url(img_src)
        if status and status != 200:
            await append_failure(
                {
                    "Barcode": barcode,
                    "Img_src": img_src,
                    "site_name": infer_site_name(img_src, last_source),
                    "reason": f"http_{status}",
                }
            )
            print(f"backfill failed barcode={barcode} reason=http_{status} url={img_src}", flush=True)
            return "failed"
        saved_path = await _download_image_with_retries(
            img_src,
            str(image_path),
            site_name=infer_site_name(img_src, last_source),
        )

    if saved_path and image_path.exists():
        refresh_catalog_quality(db, barcode)
        return "downloaded"
    await append_failure(
        {
            "Barcode": barcode,
            "Img_src": img_src,
            "site_name": infer_site_name(img_src, last_source),
            "reason": "download_failed_after_200",
        }
    )
    print(f"backfill failed barcode={barcode} reason=download_failed_after_200 url={img_src}", flush=True)
    return "failed"


async def probe_image_url(img_src: str) -> int:
    timeout = aiohttp.ClientTimeout(total=20)
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(img_src, headers=headers, allow_redirects=True, ssl=False) as response:
                return int(response.status)
    except Exception:
        return 0


async def append_failure(payload: dict) -> None:
    payload = {**payload, "logged_at": time.time()}
    async with _BACKFILL_REQUEST_LOCK:
        with FAILURE_LOG_PATH.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(payload, ensure_ascii=False) + "\n")


def load_state(state_file: Path) -> dict:
    if not state_file.exists():
        return {"next_index": 0, "scheduled": 0, "counts": {"downloaded": 0, "exists": 0, "failed": 0, "skipped": 0}}
    try:
        return json.loads(state_file.read_text(encoding="utf-8"))
    except Exception:
        return {"next_index": 0, "scheduled": 0, "counts": {"downloaded": 0, "exists": 0, "failed": 0, "skipped": 0}}


def save_state(state_file: Path, next_index: int, scheduled: int, counts: dict) -> None:
    payload = {
        "next_index": next_index,
        "scheduled": scheduled,
        "counts": counts,
        "updated_at": time.time(),
    }
    state_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def load_records_from_file(input_file: str) -> list[dict]:
    path = Path(input_file)
    if not path.exists():
        raise FileNotFoundError(f"input file not found: {input_file}")

    if path.suffix.lower() == ".jsonl":
        records = []
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                records.append(json.loads(line))
        return records

    return json.loads(path.read_text(encoding="utf-8"))


async def run_backfill(limit: int, concurrency: int, barcode_filter: str, input_file: str, resume: bool, state_file: str) -> None:
    load_dotenv()
    FAILURE_LOG_PATH.touch(exist_ok=True)
    state_path = Path(state_file) if state_file else STATE_PATH

    mongo_user = os.getenv("MONGO_USER")
    mongo_password = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    mongo_uri = f"mongodb://{mongo_user}:{mongo_password}@{mongo_host}:{mongo_port}"
    client = MongoClient(mongo_uri)
    db = client[mongo_db]

    images_dir = Path("/app/images")
    images_dir.mkdir(parents=True, exist_ok=True)

    semaphore = asyncio.Semaphore(max(1, concurrency))
    pending = set()
    counts = {"downloaded": 0, "exists": 0, "failed": 0, "skipped": 0}
    scheduled = 0
    start_index = 0
    current_index = 0

    cursor = None
    records = None
    if input_file:
        records = load_records_from_file(input_file)
        if barcode_filter:
            records = [r for r in records if str(r.get("Barcode", "")).strip() == barcode_filter]
        if resume:
            state = load_state(state_path)
            start_index = max(0, int(state.get("next_index", 0)))
            scheduled = int(state.get("scheduled", 0))
            saved_counts = state.get("counts", {})
            counts.update({k: int(saved_counts.get(k, 0)) for k in counts})
            if start_index:
                print(
                    f"resuming from index={start_index} scheduled={scheduled} "
                    f"downloaded={counts['downloaded']} exists={counts['exists']} "
                    f"failed={counts['failed']} skipped={counts['skipped']}",
                    flush=True,
                )
            records = records[start_index:]
    else:
        query = {"Img_src": {"$exists": True, "$ne": ""}}
        if barcode_filter:
            query["Barcode"] = barcode_filter

        projection = {"_id": 0, "Barcode": 1, "Img_src": 1, "last_source": 1}
        cursor = db.products.find(query, projection, no_cursor_timeout=True)

    try:
        source_iterable = records if records is not None else cursor
        for local_index, record in enumerate(source_iterable, start=1):
            if limit and scheduled >= limit:
                break

            task = asyncio.create_task(process_record(record, images_dir, semaphore, db))
            pending.add(task)
            scheduled += 1
            current_index = start_index + local_index

            if len(pending) >= max(4, concurrency * 4):
                done, pending = await asyncio.wait(pending, return_when=asyncio.FIRST_COMPLETED)
                for finished in done:
                    counts[finished.result()] += 1
                if input_file and resume:
                    save_state(state_path, current_index, scheduled, counts)

            if scheduled % 100 == 0:
                print(
                    f"progress scheduled={scheduled} "
                    f"downloaded={counts['downloaded']} exists={counts['exists']} "
                    f"failed={counts['failed']} skipped={counts['skipped']}"
                , flush=True)
                if input_file and resume:
                    save_state(state_path, current_index, scheduled, counts)

        if pending:
            for finished in await asyncio.gather(*pending):
                counts[finished] += 1
            if input_file and resume:
                save_state(state_path, current_index, scheduled, counts)
    finally:
        if cursor is not None:
            cursor.close()
        client.close()

    print(
        f"done scheduled={scheduled} "
        f"downloaded={counts['downloaded']} exists={counts['exists']} "
        f"failed={counts['failed']} skipped={counts['skipped']}"
    , flush=True)
    if input_file and resume:
        save_state(state_path, current_index, scheduled, counts)


def main() -> None:
    parser = argparse.ArgumentParser(description="Backfill missing hosted images from Img_src URLs.")
    parser.add_argument("--limit", type=int, default=0, help="Max number of records to process. 0 means no limit.")
    parser.add_argument("--concurrency", type=int, default=2, help="Concurrent downloads.")
    parser.add_argument("--barcode", default="", help="Only process a single barcode.")
    parser.add_argument("--input-file", default="", help="Optional JSON/JSONL file with records to process.")
    parser.add_argument("--resume", action="store_true", help="Resume from a state file when using --input-file.")
    parser.add_argument("--state-file", default=str(STATE_PATH), help="Path to resume state JSON file.")
    args = parser.parse_args()

    asyncio.run(
        run_backfill(
            args.limit,
            args.concurrency,
            args.barcode.strip(),
            args.input_file.strip(),
            args.resume,
            args.state_file.strip(),
        )
    )


if __name__ == "__main__":
    main()
