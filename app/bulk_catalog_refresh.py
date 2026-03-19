from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path
from typing import Any, Dict, List

from pymongo import AsyncMongoClient

from catalog_quality import build_catalog_quality_updates
from category_lookup import normalize_barcode
from cms_activity import queue_notification_event
from cms_catalog import _build_item_list_query, _build_source_refresh_preview, _utcnow
from cms_source_jobs import update_job_state


SOURCE_KEY = "catalog_refresh"
JOB_KEY = "bulk_refresh"


def _mongo_uri() -> str:
    host = os.getenv("MONGO_HOST", "127.0.0.1")
    port = os.getenv("MONGO_PORT", "27017")
    user = os.getenv("MONGO_USER", "")
    password = os.getenv("MONGO_PASSWORD", "")
    if user:
        return f"mongodb://{user}:{password}@{host}:{port}"
    return f"mongodb://{host}:{port}"


def _mongo_db_name() -> str:
    return str(os.getenv("MONGO_DB", "pharmacy") or "pharmacy").strip()


def _load_request(path: Path) -> Dict[str, Any]:
    raw = path.read_text(encoding="utf-8").strip()
    if not raw:
        raise RuntimeError("Bulk refresh request file is empty.")
    data = json.loads(raw)
    if not isinstance(data, dict):
        raise RuntimeError("Bulk refresh request file must contain a JSON object.")
    return data


def _log(message: str) -> None:
    print(message, flush=True)


async def _run(config_path: Path) -> int:
    request = _load_request(config_path)
    filters = dict(request.get("filters") or {})
    source_selection = dict(request.get("source_selection") or {})
    limit = int(request.get("limit", 250) or 250)
    requested_by = str(request.get("requested_by", "") or "system:bulk_refresh")

    query = _build_item_list_query(
        search=str(filters.get("search", "") or ""),
        status_filter=str(filters.get("status_filter", "all") or "all"),
        quality_state_filter=str(filters.get("quality_state_filter", "all") or "all"),
        missing_requirement=str(filters.get("missing_requirement", "all") or "all"),
        photo_source_filter=str(filters.get("photo_source_filter", "all") or "all"),
        category_1=str(filters.get("category_1", "") or "") or None,
        category_2=str(filters.get("category_2", "") or "") or None,
        category_3=str(filters.get("category_3", "") or "") or None,
    )

    mongo_client = AsyncMongoClient(_mongo_uri())
    db = mongo_client[_mongo_db_name()]

    try:
        matched_total = await db.products.count_documents(query)
        docs: List[Dict[str, Any]] = await (
            db.products.find(query)
            .sort("cms_updated_at", -1)
            .limit(limit)
            .to_list(length=limit)
        )
        selected_total = len(docs)
        if not selected_total:
            update_job_state(
                SOURCE_KEY,
                JOB_KEY,
                matched_total=int(matched_total),
                selected_total=int(selected_total),
                processed=0,
                updated=0,
                skipped=0,
                failed=0,
                last_message="No items matched the current bulk refresh filters.",
            )
            _log("No items matched the current bulk refresh filters.")
            return 0

        _log(
            f"Bulk refresh request loaded. matched_total={matched_total} selected_total={selected_total} limit={limit}"
        )
        update_job_state(
            SOURCE_KEY,
            JOB_KEY,
            matched_total=int(matched_total),
            selected_total=int(selected_total),
            processed=0,
            updated=0,
            skipped=0,
            failed=0,
            last_message=(
                f"Starting bulk refresh for {selected_total} items "
                f"(matched {matched_total}, limit {limit})."
            ),
        )
        await queue_notification_event(
            db,
            event_type="bulk_refresh_started",
            item_id="",
            payload={
                "title": "Bulk Refresh Started",
                "barcode": "",
                "code": "",
                "matched_total": int(matched_total),
                "selected_total": int(selected_total),
                "limit": int(limit),
                "requested_by": requested_by,
            },
        )

        processed = 0
        updated = 0
        skipped = 0
        failed = 0

        for index, existing in enumerate(docs, start=1):
            item_id = str(existing.get("_id", "")).strip()
            barcode = normalize_barcode(existing.get("cms_barcode") or existing.get("Barcode") or "")
            if not barcode:
                skipped += 1
                processed += 1
                _log(f"[{index}/{selected_total}] skip item={item_id} reason=no_barcode")
                continue

            try:
                refresh_preview = await _build_source_refresh_preview(
                    db,
                    existing,
                    barcode=barcode,
                    updated_by=requested_by,
                    source_key=str(source_selection.get("source_key", "") or ""),
                    text_source_key=str(source_selection.get("text_source_key", "") or ""),
                    image_source_key=str(source_selection.get("image_source_key", "") or ""),
                    category_source_key=str(source_selection.get("category_source_key", "") or ""),
                )
                updates = dict(refresh_preview["refreshed_document"])
                updates["cms_updated_by"] = requested_by
                updates["cms_updated_at"] = _utcnow()
                candidate_document = dict(existing)
                candidate_document.update(updates)
                updates.update(
                    build_catalog_quality_updates(
                        candidate_document,
                        evaluator="cms:bulk_refresh",
                        queue_for_review=str(candidate_document.get("cms_status") or "").strip().lower() != "active",
                    )
                )
                await db.products.update_one({"_id": existing["_id"]}, {"$set": updates})
                updated += 1
                processed += 1
                update_job_state(
                    SOURCE_KEY,
                    JOB_KEY,
                    processed=int(processed),
                    updated=int(updated),
                    skipped=int(skipped),
                    failed=int(failed),
                    last_barcode=barcode,
                    last_item_id=item_id,
                )
                _log(
                    f"[{index}/{selected_total}] updated barcode={barcode} "
                    f"text={refresh_preview['text_source_name'] or '-'} "
                    f"image={refresh_preview['image_source_name'] or '-'} "
                    f"category={refresh_preview['category_source_name'] or '-'}"
                )
            except Exception as exc:  # pragma: no cover - defensive runtime path
                failed += 1
                processed += 1
                update_job_state(
                    SOURCE_KEY,
                    JOB_KEY,
                    processed=int(processed),
                    updated=int(updated),
                    skipped=int(skipped),
                    failed=int(failed),
                    last_barcode=barcode,
                    last_item_id=item_id,
                )
                _log(f"[{index}/{selected_total}] failed barcode={barcode} error={exc}")

            if index == 1 or index % 10 == 0 or index == selected_total:
                update_job_state(
                    SOURCE_KEY,
                    JOB_KEY,
                    processed=int(processed),
                    updated=int(updated),
                    skipped=int(skipped),
                    failed=int(failed),
                    last_message=(
                        f"Processed {processed}/{selected_total} "
                        f"(updated {updated}, skipped {skipped}, failed {failed})."
                    ),
                )

        summary = (
            f"Bulk refresh finished. processed={processed} updated={updated} "
            f"skipped={skipped} failed={failed} matched_total={matched_total} limit={limit}"
        )
        update_job_state(
            SOURCE_KEY,
            JOB_KEY,
            processed=int(processed),
            updated=int(updated),
            skipped=int(skipped),
            failed=int(failed),
            last_message=summary,
        )
        _log(summary)
        await queue_notification_event(
            db,
            event_type="bulk_refresh_completed",
            item_id="",
            payload={
                "title": "Bulk Refresh Completed",
                "barcode": "",
                "code": "",
                "matched_total": int(matched_total),
                "selected_total": int(selected_total),
                "processed": int(processed),
                "updated": int(updated),
                "skipped": int(skipped),
                "failed": int(failed),
                "limit": int(limit),
                "requested_by": requested_by,
            },
        )
        return 0 if failed == 0 else 1
    finally:
        close_result = mongo_client.close()
        if asyncio.iscoroutine(close_result):
            await close_result


def main() -> int:
    parser = argparse.ArgumentParser(description="Bulk catalog refresh for the current Fix Queue filters.")
    parser.add_argument("--config", required=True, help="Path to the JSON request file.")
    args = parser.parse_args()
    return asyncio.run(_run(Path(args.config)))


if __name__ == "__main__":
    raise SystemExit(main())
