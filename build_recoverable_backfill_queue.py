import argparse
import asyncio
import json
from pathlib import Path

import aiohttp


DEFAULT_INPUT = Path("/home/imageuser/imageDataAPI/current_missing_hosted_images_numeric.json")
DEFAULT_RECOVERABLE = Path("/home/imageuser/imageDataAPI/recoverable_backfill_queue.json")
DEFAULT_DEAD = Path("/home/imageuser/imageDataAPI/dead_img_src_queue.json")


async def probe(session: aiohttp.ClientSession, record: dict, semaphore: asyncio.Semaphore) -> tuple[dict, int]:
    img_src = str(record.get("Img_src", "")).strip()
    if not img_src:
        return record, 0

    async with semaphore:
        try:
            async with session.get(img_src, allow_redirects=True, ssl=False) as response:
                return record, int(response.status)
        except Exception:
            return record, 0


async def build_queue(input_path: Path, recoverable_path: Path, dead_path: Path, concurrency: int, limit: int) -> None:
    records = json.loads(input_path.read_text(encoding="utf-8"))
    if limit:
        records = records[:limit]

    timeout = aiohttp.ClientTimeout(total=20)
    headers = {"User-Agent": "Mozilla/5.0"}
    semaphore = asyncio.Semaphore(max(1, concurrency))

    recoverable: list[dict] = []
    dead: list[dict] = []

    async with aiohttp.ClientSession(timeout=timeout, headers=headers) as session:
        tasks = [asyncio.create_task(probe(session, record, semaphore)) for record in records]

        processed = 0
        for task in asyncio.as_completed(tasks):
            record, status = await task
            processed += 1
            payload = {
                "Barcode": str(record.get("Barcode", "")).strip(),
                "Title": record.get("Title", ""),
                "Img_src": str(record.get("Img_src", "")).strip(),
                "last_source": str(record.get("last_source", "")).strip(),
                "probe_status": status,
            }

            if status == 200:
                recoverable.append(payload)
            else:
                dead.append(payload)

            if processed % 100 == 0:
                print(
                    f"progress processed={processed} recoverable={len(recoverable)} dead={len(dead)}",
                    flush=True,
                )

    recoverable_path.write_text(json.dumps(recoverable, ensure_ascii=False, indent=2), encoding="utf-8")
    dead_path.write_text(json.dumps(dead, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"done processed={len(records)} recoverable={len(recoverable)} dead={len(dead)} "
        f"recoverable_file={recoverable_path} dead_file={dead_path}",
        flush=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a recoverable/dead backfill queue from current missing image records.")
    parser.add_argument("--input-file", default=str(DEFAULT_INPUT), help="Input JSON file with missing-image records.")
    parser.add_argument("--recoverable-file", default=str(DEFAULT_RECOVERABLE), help="Output JSON for live Img_src records.")
    parser.add_argument("--dead-file", default=str(DEFAULT_DEAD), help="Output JSON for dead Img_src records.")
    parser.add_argument("--concurrency", type=int, default=4, help="Concurrent probe requests.")
    parser.add_argument("--limit", type=int, default=0, help="Optional limit for testing.")
    args = parser.parse_args()

    asyncio.run(
        build_queue(
            Path(args.input_file),
            Path(args.recoverable_file),
            Path(args.dead_file),
            args.concurrency,
            args.limit,
        )
    )


if __name__ == "__main__":
    main()
