from __future__ import annotations

import json
import os
import subprocess
import sys
from contextlib import suppress
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


SOURCE_JOB_UPLOAD_ROOT = Path(os.getenv("SOURCE_JOB_UPLOAD_ROOT", "/app/source_job_uploads"))
SOURCE_JOB_CONFIGS: Dict[str, List[Dict[str, Any]]] = {
    "catalog_refresh": [
        {
            "key": "bulk_refresh",
            "label": "Bulk Catalog Refresh",
            "description": "Refreshes catalog texts, categories, and hosted images using selected source chains and filters.",
            "command": ["python3", "/app/bulk_catalog_refresh.py", "--config", "/app/catalog_refresh_request.json"],
            "marker": "bulk_catalog_refresh.py",
            "log_path": "/tmp/bulk_catalog_refresh.log",
        }
    ],
    "farmakopoiosmou": [
        {
            "key": "backfill_hosted_images",
            "label": "Start Hosted Backfill",
            "description": "Runs hosted image backfill from the current database image source URLs.",
            "command": ["python3", "/app/backfill_hosted_images.py", "--concurrency", "1"],
            "marker": "backfill_hosted_images.py",
            "log_path": "/tmp/backfill_hosted_images.log",
        }
    ],
    "pharmacy295": [
        {
            "key": "replace_photos",
            "label": "Import Photos",
            "description": "Imports pharmacy295 photos into hosted images using the Excel feed rules.",
            "command": ["python3", "/app/replace_watermarked_with_pharmacy295.py"],
            "marker": "replace_watermarked_with_pharmacy295.py",
            "log_path": "/tmp/replace_watermarked_with_pharmacy295.log",
        },
    ],
    "youpharmacy": [
        {
            "key": "replace_photos_from_xml",
            "label": "Import XML Photos",
            "description": "Uploads a youpharmacy XML feed and replaces degraded farmakopoiosmou hosted photos with clean source images.",
            "command": [
                "python3",
                "/app/replace_farmakopoiosmou_with_youpharmacy_xml.py",
                "--xml-file",
                "/app/source_job_uploads/youpharmacy/latest.xml",
            ],
            "marker": "replace_farmakopoiosmou_with_youpharmacy_xml.py",
            "log_path": "/app/youpharmacy_xml_replace.log",
            "upload": {
                "required": True,
                "label": "Upload XML",
                "accept": ".xml",
                "stored_path": "/app/source_job_uploads/youpharmacy/latest.xml",
            },
        },
    ],
    "vita4you": [],
    "skroutz": [],
    "boxpharmacy": [],
    "tofarmakeiomou": [],
    "pharm16": [],
}

SOURCE_JOB_STATUS_PATH = Path(os.getenv("SOURCE_JOB_STATUS_PATH", "/app/source_job_status.json"))


def _job_state_key(source_key: str, job_key: str) -> str:
    return f"{source_key}:{job_key}"


def _read_job_state() -> Dict[str, Dict[str, Any]]:
    try:
        raw = SOURCE_JOB_STATUS_PATH.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return {}
    except OSError:
        return {}

    if not raw:
        return {}

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    if not isinstance(data, dict):
        return {}
    normalized: Dict[str, Dict[str, Any]] = {}
    for key, value in data.items():
        if isinstance(key, str) and isinstance(value, dict):
            normalized[key] = value
    return normalized


def _write_job_state(state: Dict[str, Dict[str, Any]]) -> None:
    SOURCE_JOB_STATUS_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = SOURCE_JOB_STATUS_PATH.with_suffix(".tmp")
    temp_path.write_text(json.dumps(state, ensure_ascii=True, indent=2, sort_keys=True), encoding="utf-8")
    temp_path.replace(SOURCE_JOB_STATUS_PATH)


def update_job_state(source_key: str, job_key: str, **fields: Any) -> Dict[str, Any]:
    state = _read_job_state()
    entry_key = _job_state_key(source_key, job_key)
    current = dict(state.get(entry_key, {}))
    current.update(fields)
    state[entry_key] = current
    _write_job_state(state)
    return current


def get_source_job_config(source_key: str, job_key: str) -> Dict[str, Any] | None:
    return next((row for row in SOURCE_JOB_CONFIGS.get(source_key, []) if row["key"] == job_key), None)


def get_source_job_upload_config(source_key: str, job_key: str) -> Dict[str, Any] | None:
    job_config = get_source_job_config(source_key, job_key)
    if not job_config:
        return None
    upload_config = job_config.get("upload")
    if not isinstance(upload_config, dict):
        return None
    return dict(upload_config)


def get_source_job_upload_path(source_key: str, job_key: str) -> Path | None:
    upload_config = get_source_job_upload_config(source_key, job_key)
    if not upload_config:
        return None
    stored_path = str(upload_config.get("stored_path", "")).strip()
    if not stored_path:
        return None
    return Path(stored_path)


def get_source_job_upload_overview(source_key: str, job_key: str) -> Dict[str, Any] | None:
    upload_config = get_source_job_upload_config(source_key, job_key)
    if not upload_config:
        return None

    upload_path = get_source_job_upload_path(source_key, job_key)
    state = _read_job_state().get(_job_state_key(source_key, job_key), {})
    has_file = bool(upload_path and upload_path.exists() and upload_path.is_file() and upload_path.stat().st_size > 0)
    size_bytes = 0
    if upload_path and has_file:
        with suppress(OSError):
            size_bytes = int(upload_path.stat().st_size)

    return {
        "required": bool(upload_config.get("required", False)),
        "label": str(upload_config.get("label", "Upload File") or "Upload File"),
        "accept": str(upload_config.get("accept", "") or ""),
        "has_file": has_file,
        "file_name": str(state.get("uploaded_file_name", "") or (upload_path.name if upload_path and has_file else "")),
        "file_path": str(upload_path or ""),
        "uploaded_at": str(state.get("uploaded_at", "") or ""),
        "size_bytes": int(state.get("uploaded_size_bytes", size_bytes) or size_bytes or 0),
        "product_count": int(state.get("uploaded_product_count", 0) or 0),
        "image_rows": int(state.get("uploaded_image_rows", 0) or 0),
    }


def update_source_job_upload_state(
    source_key: str,
    job_key: str,
    *,
    uploaded_file_name: str,
    uploaded_at: str,
    uploaded_size_bytes: int,
    uploaded_product_count: int,
    uploaded_image_rows: int,
) -> Dict[str, Any]:
    return update_job_state(
        source_key,
        job_key,
        uploaded_file_name=uploaded_file_name,
        uploaded_at=uploaded_at,
        uploaded_size_bytes=int(uploaded_size_bytes),
        uploaded_product_count=int(uploaded_product_count),
        uploaded_image_rows=int(uploaded_image_rows),
        last_message="Upload received and ready to run.",
    )


def _list_running_processes() -> List[Dict[str, Any]]:
    try:
        result = subprocess.run(
            ["ps", "-eo", "pid,etimes,args", "--sort=-etimes"],
            capture_output=True,
            text=True,
            check=False,
        )
    except Exception:
        return []

    processes: List[Dict[str, Any]] = []
    for raw_line in result.stdout.splitlines()[1:]:
        line = raw_line.strip()
        if not line:
            continue
        parts = line.split(None, 2)
        if len(parts) < 3:
            continue
        pid_text, elapsed_text, command = parts
        try:
            pid = int(pid_text)
        except ValueError:
            pid = 0
        try:
            elapsed_seconds = int(elapsed_text)
        except ValueError:
            elapsed_seconds = 0
        processes.append(
            {
                "pid": pid,
                "elapsed_seconds": elapsed_seconds,
                "command": command,
            }
        )
    return processes


def _format_duration(seconds: int) -> str:
    total = int(max(0, seconds))
    days, rem = divmod(total, 86400)
    hours, rem = divmod(rem, 3600)
    minutes, secs = divmod(rem, 60)
    if days:
        return f"{days}d {hours}h {minutes}m"
    if hours:
        return f"{hours}h {minutes}m {secs}s"
    if minutes:
        return f"{minutes}m {secs}s"
    return f"{secs}s"


def get_source_job_overview(source_key: str) -> List[Dict[str, Any]]:
    running_processes = _list_running_processes()
    job_state = _read_job_state()
    job_rows: List[Dict[str, Any]] = []
    state_changed = False
    for job_config in SOURCE_JOB_CONFIGS.get(source_key, []):
        marker = str(job_config.get("marker", "")).strip()
        process = next((row for row in running_processes if marker and marker in row["command"]), None)
        entry_key = _job_state_key(source_key, job_config["key"])
        state = dict(job_state.get(entry_key, {}))
        stored_status = str(state.get("status", "idle") or "idle")
        if not process and stored_status in {"running", "starting"}:
            state.update(
                {
                    "status": "stopped",
                    "pid": 0,
                    "last_exit_code": None,
                    "last_finished_at": str(state.get("last_finished_at", "") or _iso_now()),
                    "last_message": "Job is not running. Stale running state was cleared.",
                }
            )
            job_state[entry_key] = state
            state_changed = True
        running = bool(process)
        status = "running" if running else str(state.get("status", "idle") or "idle")
        job_rows.append(
            {
                "key": job_config["key"],
                "label": job_config["label"],
                "description": job_config["description"],
                "running": running,
                "status": status,
                "pid": int(process["pid"]) if process else 0,
                "elapsed_seconds": int(process["elapsed_seconds"]) if process else 0,
                "elapsed_human": _format_duration(int(process["elapsed_seconds"])) if process else "",
                "log_path": job_config["log_path"],
                "last_started_at": str(state.get("last_started_at", "") or ""),
                "last_finished_at": str(state.get("last_finished_at", "") or ""),
                "last_exit_code": int(state["last_exit_code"]) if isinstance(state.get("last_exit_code"), int) else None,
                "last_message": str(state.get("last_message", "") or ""),
                "matched_total": int(state.get("matched_total", 0) or 0),
                "selected_total": int(state.get("selected_total", 0) or 0),
                "processed": int(state.get("processed", 0) or 0),
                "updated": int(state.get("updated", 0) or 0),
                "skipped": int(state.get("skipped", 0) or 0),
                "failed": int(state.get("failed", 0) or 0),
                "last_barcode": str(state.get("last_barcode", "") or ""),
                "last_item_id": str(state.get("last_item_id", "") or ""),
                "upload": get_source_job_upload_overview(source_key, job_config["key"]),
            }
        )
    if state_changed:
        _write_job_state(job_state)
    return job_rows


def start_source_job(source_key: str, job_key: str) -> Dict[str, Any]:
    job_config = get_source_job_config(source_key, job_key)
    if not job_config:
        raise ValueError("Unsupported source job")

    upload_config = get_source_job_upload_config(source_key, job_key)
    if upload_config and bool(upload_config.get("required", False)):
        upload_path = get_source_job_upload_path(source_key, job_key)
        if upload_path is None or not upload_path.exists() or not upload_path.is_file() or upload_path.stat().st_size <= 0:
            raise ValueError("Upload the required XML file before starting this job")

    job_overview = get_source_job_overview(source_key)
    running_job = next((row for row in job_overview if row["key"] == job_key and row["running"]), None)
    if running_job:
        return {
            "started": False,
            "already_running": True,
            "pid": running_job["pid"],
            "log_path": running_job["log_path"],
            "elapsed_human": running_job["elapsed_human"],
        }

    log_path = Path(job_config["log_path"])
    log_path.parent.mkdir(parents=True, exist_ok=True)
    started_at = _iso_now()
    update_job_state(
        source_key,
        job_key,
        status="starting",
        last_started_at=started_at,
        last_finished_at="",
        last_exit_code=None,
        last_message="Job launch requested.",
        pid=0,
    )
    # start_new_session=True → runner + all descendants (bulk_catalog_refresh
    # → Playwright → chromium subprocesses) share a NEW process group.
    # Without this, `Stop` could kill only the runner and leave chromium
    # zombies running, blocking future job runs and eating CPU.
    process = subprocess.Popen(
        [sys.executable or "python3", "/app/source_job_runner.py", source_key, job_key],
        stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd="/app",
        env=os.environ.copy(),
        close_fds=True,
        start_new_session=True,
    )
    update_job_state(
        source_key,
        job_key,
        status="running",
        last_started_at=started_at,
        last_message="Job started.",
        pid=int(process.pid),
    )

    return {
        "started": True,
        "already_running": False,
        "pid": int(process.pid),
        "log_path": str(log_path),
    }


def _stop_job_with_status(source_key: str, job_key: str, *, status: str, message: str) -> Dict[str, Any]:
    job_config = get_source_job_config(source_key, job_key)
    if not job_config:
        raise ValueError("Unsupported source job")

    marker = str(job_config.get("marker", "")).strip()
    if not marker:
        raise ValueError("Missing job marker")

    running_processes = _list_running_processes()
    matching = [row for row in running_processes if marker in row.get("command", "")]
    # Also kill the parent source_job_runner.py wrapper for the same job
    runner_marker = f"source_job_runner.py {source_key} {job_key}"
    matching.extend([row for row in running_processes if runner_marker in row.get("command", "") and row not in matching])

    if not matching:
        update_job_state(
            source_key,
            job_key,
            status=status,
            pid=0,
            last_exit_code=None,
            last_finished_at=_iso_now(),
            last_message=message if "not running" in message else "Stop requested but job was not running.",
        )
        return {
            "stopped": False,
            "already_stopped": True,
            "pid": 0,
            "log_path": str(job_config.get("log_path", "")),
        }

    # Kill by PROCESS GROUP so we take out chromium/Playwright descendants
    # too, not just the runner. Falls back to plain PID kill on any error.
    import signal as _signal
    killed_pids = []
    for proc in matching:
        pid = int(proc.get("pid", 0) or 0)
        if not pid:
            continue
        try:
            pgid = os.getpgid(pid)
            os.killpg(pgid, _signal.SIGTERM)
        except (ProcessLookupError, PermissionError, OSError):
            subprocess.run(["kill", "-TERM", str(pid)], check=False)
        killed_pids.append(pid)
    import time as _time
    _time.sleep(1.0)  # give them 1s to shut down cleanly
    for proc in matching:
        pid = int(proc.get("pid", 0) or 0)
        if not pid:
            continue
        try:
            pgid = os.getpgid(pid)
            os.killpg(pgid, _signal.SIGKILL)
        except (ProcessLookupError, PermissionError, OSError):
            subprocess.run(["kill", "-KILL", str(pid)], check=False)
    # Belt-and-braces: reap any orphaned chromium/playwright zombies.
    subprocess.run(["pkill", "-9", "-f", "playwright.*run-driver"], check=False)
    subprocess.run(["pkill", "-9", "-f", "/usr/lib/chromium/chromium"], check=False)
    process = matching[0]
    pid = int(process.get("pid", 0) or 0)

    update_job_state(
        source_key,
        job_key,
        status=status,
        pid=0,
        last_exit_code=-15,
        last_finished_at=_iso_now(),
        last_message=message,
    )
    return {
        "stopped": True,
        "already_stopped": False,
        "pid": pid,
        "log_path": str(job_config.get("log_path", "")),
    }


def stop_source_job(source_key: str, job_key: str) -> Dict[str, Any]:
    return _stop_job_with_status(source_key, job_key, status="stopped", message="Job stopped by user.")


def cancel_source_job(source_key: str, job_key: str) -> Dict[str, Any]:
    result = _stop_job_with_status(source_key, job_key, status="canceled", message="Job canceled by user.")
    # Cancel resets progress counters so the next run starts clean.
    update_job_state(
        source_key,
        job_key,
        matched_total=0,
        selected_total=0,
        processed=0,
        updated=0,
        skipped=0,
        failed=0,
        last_barcode="",
        last_item_id="",
    )
    return result


def restart_source_job(source_key: str, job_key: str) -> Dict[str, Any]:
    stop_result = stop_source_job(source_key, job_key)
    start_result = start_source_job(source_key, job_key)
    return {
        "stop_result": stop_result,
        "start_result": start_result,
    }
