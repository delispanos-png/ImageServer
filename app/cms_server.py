from __future__ import annotations

import os
import shutil
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

from fastapi import APIRouter, Depends

from cms_auth import get_current_cms_user
from cms_permissions import require_cms_permissions


IMAGE_FILES_BASE_DIR = os.getenv("IMAGE_FILES_BASE_DIR", "/app/images")
SERVER_JOB_MARKERS = [
    "replace_watermarked_with_pharmacy295.py",
    "backfill_hosted_images.py",
    "reprocess_hosted_images.py",
    "update_pharmacy295_from_excel.py",
]


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _read_text(path: str) -> str:
    try:
        return Path(path).read_text(encoding="utf-8").strip()
    except Exception:
        return ""


def _read_meminfo() -> Dict[str, int]:
    values: Dict[str, int] = {}
    for line in _read_text("/proc/meminfo").splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        raw = value.strip().split()[0] if value.strip() else "0"
        if raw.isdigit():
            values[key] = int(raw) * 1024
    return values


def _system_uptime_seconds() -> float:
    raw = _read_text("/proc/uptime").split()
    if not raw:
        return 0.0
    try:
        return float(raw[0])
    except ValueError:
        return 0.0


def _process_elapsed_seconds(pid: int) -> int:
    try:
        result = subprocess.run(
            ["ps", "-o", "etimes=", "-p", str(pid)],
            capture_output=True,
            text=True,
            check=False,
        )
        value = result.stdout.strip()
        return int(value) if value.isdigit() else 0
    except Exception:
        return 0


def _format_duration(seconds: float | int) -> str:
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


def _disk_usage(path: str) -> Dict[str, Any]:
    try:
        usage = shutil.disk_usage(path)
        used = usage.used
        total = usage.total
        free = usage.free
        used_percent = round((used / total) * 100, 2) if total else 0.0
        return {
            "path": path,
            "total_bytes": total,
            "used_bytes": used,
            "free_bytes": free,
            "used_percent": used_percent,
        }
    except Exception:
        return {
            "path": path,
            "total_bytes": 0,
            "used_bytes": 0,
            "free_bytes": 0,
            "used_percent": 0.0,
        }


def _background_jobs() -> List[Dict[str, Any]]:
    try:
        result = subprocess.run(
            ["ps", "-eo", "pid,etimes,%cpu,%mem,args", "--sort=-etimes"],
            capture_output=True,
            text=True,
            check=False,
        )
    except Exception:
        return []

    jobs: List[Dict[str, Any]] = []
    for raw_line in result.stdout.splitlines()[1:]:
        line = raw_line.strip()
        if not line:
            continue
        parts = line.split(None, 4)
        if len(parts) < 5:
            continue
        pid_text, elapsed_text, cpu_text, mem_text, command = parts
        if not any(marker in command for marker in SERVER_JOB_MARKERS):
            continue
        try:
            pid = int(pid_text)
        except ValueError:
            pid = 0
        try:
            elapsed = int(elapsed_text)
        except ValueError:
            elapsed = 0
        try:
            cpu_percent = float(cpu_text)
        except ValueError:
            cpu_percent = 0.0
        try:
            memory_percent = float(mem_text)
        except ValueError:
            memory_percent = 0.0

        job_name = next((marker for marker in SERVER_JOB_MARKERS if marker in command), command)
        jobs.append(
            {
                "pid": pid,
                "name": job_name,
                "elapsed_seconds": elapsed,
                "elapsed_human": _format_duration(elapsed),
                "cpu_percent": cpu_percent,
                "memory_percent": memory_percent,
                "command": command,
            }
        )
    return jobs


def _top_processes(limit: int = 8) -> List[Dict[str, Any]]:
    try:
        result = subprocess.run(
            ["ps", "-eo", "pid,%cpu,%mem,args", "--sort=-%cpu"],
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
        parts = line.split(None, 3)
        if len(parts) < 4:
            continue
        pid_text, cpu_text, mem_text, command = parts
        try:
            pid = int(pid_text)
        except ValueError:
            pid = 0
        try:
            cpu_percent = float(cpu_text)
        except ValueError:
            cpu_percent = 0.0
        try:
            memory_percent = float(mem_text)
        except ValueError:
            memory_percent = 0.0
        processes.append(
            {
                "pid": pid,
                "cpu_percent": cpu_percent,
                "memory_percent": memory_percent,
                "command": command,
            }
        )
        if len(processes) >= limit:
            break
    return processes


def create_cms_server_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/server", tags=["cms-server"])

    @router.get(
        "/overview",
        dependencies=[Depends(require_cms_permissions("server.view"))],
    )
    async def get_server_overview(current_user: Dict[str, Any] = Depends(get_current_cms_user)) -> Dict[str, Any]:
        del current_user

        meminfo = _read_meminfo()
        mem_total = meminfo.get("MemTotal", 0)
        mem_available = meminfo.get("MemAvailable", meminfo.get("MemFree", 0))
        mem_used = max(0, mem_total - mem_available)
        mem_used_percent = round((mem_used / mem_total) * 100, 2) if mem_total else 0.0

        load_1, load_5, load_15 = os.getloadavg()
        cpu_count = os.cpu_count() or 1
        system_uptime = _system_uptime_seconds()
        app_uptime = _process_elapsed_seconds(os.getpid())
        images_dir = IMAGE_FILES_BASE_DIR

        mongo_started = time.perf_counter()
        mongo_ok = True
        mongo_error = ""
        try:
            await db.command("ping")
        except Exception as exc:
            mongo_ok = False
            mongo_error = str(exc)
        mongo_latency_ms = round((time.perf_counter() - mongo_started) * 1000, 2)

        products_count = await db.products.count_documents({})
        categories_count = await db.cms_categories.count_documents({})
        clients_count = await db.cms_clients.count_documents({})
        audit_count = await db.cms_audit_logs.count_documents({})

        return {
            "success": True,
            "data": {
                "captured_at": _iso_now(),
                "hostname": os.uname().nodename,
                "python_version": os.sys.version.split()[0],
                "cpu_count": cpu_count,
                "load_average": {
                    "load_1": round(load_1, 2),
                    "load_5": round(load_5, 2),
                    "load_15": round(load_15, 2),
                    "per_cpu_1": round(load_1 / cpu_count, 2) if cpu_count else 0.0,
                },
                "uptime": {
                    "system_seconds": int(system_uptime),
                    "system_human": _format_duration(system_uptime),
                    "app_seconds": app_uptime,
                    "app_human": _format_duration(app_uptime),
                },
                "memory": {
                    "total_bytes": mem_total,
                    "available_bytes": mem_available,
                    "used_bytes": mem_used,
                    "used_percent": mem_used_percent,
                },
                "disks": [
                    _disk_usage("/"),
                    _disk_usage("/app"),
                    _disk_usage(images_dir),
                ],
                "mongo": {
                    "ok": mongo_ok,
                    "latency_ms": mongo_latency_ms,
                    "error": mongo_error,
                },
                "app_collections": {
                    "products": products_count,
                    "cms_categories": categories_count,
                    "cms_clients": clients_count,
                    "cms_audit_logs": audit_count,
                },
                "background_jobs": _background_jobs(),
                "top_processes": _top_processes(),
            },
        }

    return router
