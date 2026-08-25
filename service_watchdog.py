#!/usr/bin/env python3
"""Service watchdog for imageDataAPI stack.

Runs every 15 minutes via host crontab. Checks:
  - Docker container state + healthcheck for each known service
  - HTTP /health endpoint for FastAPI services that expose it
  - TCP port connectivity for FastAPI services without /health
  - MongoDB ping via `docker exec` (mongo / mongosh)
  - Nginx via systemctl + TCP probe on :80
  - Daily cron jobs (brand_sync) — last_run timestamp freshness

On failure: attempts recovery (docker restart / nginx restart / re-trigger
cron job), then writes a `watchdog_alert` event to `cms_notification_events`
and to the rolling log file.

Usage:
    python3 service_watchdog.py [--dry-run] [--no-notify] [--verbose]
"""

import argparse
import json
import logging
import os
import socket
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

try:
    from dotenv import load_dotenv
    load_dotenv("/home/imageuser/imageDataAPI/.env")
except Exception:
    pass

try:
    from pymongo import MongoClient
    HAS_PYMONGO = True
except Exception:
    HAS_PYMONGO = False


LOG_FILE = "/home/imageuser/imageDataAPI/logs/service_watchdog.log"
STATE_FILE = "/home/imageuser/imageDataAPI/logs/service_watchdog_state.json"
DOCKER_BIN = "/snap/bin/docker"
RESTART_COOLDOWN_SEC = 600  # 10 minutes between restarts of the same service
POST_RESTART_RECHECK_SEC = 8

SERVICES: List[Dict] = [
    {"name": "fastapi", "container": "fastapi", "kind": "fastapi",
     "port": 4030, "http_path": "/health", "auto_restart": True, "critical": True},
    {"name": "mongodb", "container": "mongodb", "kind": "mongo",
     "exec_cmd": ["mongo", "--quiet", "--eval", "db.adminCommand('ping')"],
     "auto_restart": True, "critical": True},
    {"name": "mongodb_eof", "container": "mongodb_eof", "kind": "mongo",
     "exec_cmd": ["mongosh", "--quiet", "--port", "27020", "--eval", "db.adminCommand('ping')"],
     "auto_restart": True, "critical": False},
    {"name": "kpdhellas_bridge", "container": "kpdhellas_bridge", "kind": "container",
     "auto_restart": True, "critical": False},
    {"name": "xml_generator", "container": "xml_generator", "kind": "container",
     "auto_restart": True, "critical": False},
    {"name": "cyimages", "container": "cyimages-fastapi_cyimages-1", "kind": "tcp",
     "port": 4040, "auto_restart": True, "critical": False},
    {"name": "eof_api", "container": "fastapi_eof_api", "kind": "tcp",
     "port": 4060, "auto_restart": True, "critical": False},
    {"name": "xml_generator_old", "container": "cloudonxmlgeneratornewold-fastapi_xml-1",
     "kind": "tcp", "port": 4090, "auto_restart": True, "critical": False},
    {"name": "xml_gen_app", "container": "cloudonxmlgenerator-app-1", "kind": "tcp",
     "port": 3200, "auto_restart": True, "critical": False},
    {"name": "imageuploader", "container": "imageuploader-api-1", "kind": "tcp",
     "port": 3400, "auto_restart": True, "critical": False},
]

CRON_JOBS: List[Dict] = [
    {"name": "brand_sync",
     "container": "fastapi",
     "last_run_file": "/app/brand_sync_last_run.json",
     "max_age_hours": 26,  # cron runs daily; allow up to 26h
     "recovery": "trigger_brand_sync"},
]

NGINX_ENABLED = True


def setup_logging(verbose: bool) -> logging.Logger:
    Path(LOG_FILE).parent.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger("watchdog")
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    logger.handlers.clear()

    file_handler = RotatingFileHandler(LOG_FILE, maxBytes=2_000_000, backupCount=5)
    file_handler.setFormatter(logging.Formatter(
        "%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    ))
    logger.addHandler(file_handler)

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
    logger.addHandler(stream_handler)
    return logger


def load_state() -> Dict:
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except Exception:
        return {}


def save_state(state: Dict) -> None:
    Path(STATE_FILE).parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f, indent=2)
    os.replace(tmp, STATE_FILE)


def can_restart(name: str, state: Dict) -> bool:
    last = state.get("last_restart", {}).get(name, 0)
    return (time.time() - last) > RESTART_COOLDOWN_SEC


def record_restart(name: str, state: Dict) -> None:
    state.setdefault("last_restart", {})[name] = time.time()


def docker_inspect(container: str) -> Tuple[Optional[str], Optional[str]]:
    """Returns (status, health) — health is 'none' if no healthcheck defined."""
    try:
        fmt = ("{{.State.Status}}|{{if .State.Health}}"
               "{{.State.Health.Status}}{{else}}none{{end}}")
        r = subprocess.run(
            [DOCKER_BIN, "inspect", "--format", fmt, container],
            capture_output=True, text=True, timeout=10,
        )
        if r.returncode != 0:
            return None, None
        parts = r.stdout.strip().split("|", 1)
        if len(parts) == 2:
            return parts[0], parts[1]
        return parts[0], "none"
    except Exception:
        return None, None


def docker_restart(container: str, logger: logging.Logger) -> bool:
    try:
        r = subprocess.run(
            [DOCKER_BIN, "restart", container],
            capture_output=True, text=True, timeout=60,
        )
        if r.returncode != 0:
            logger.error("docker restart %s failed: %s", container, r.stderr.strip())
            return False
        return True
    except Exception as e:
        logger.error("docker restart %s exception: %s", container, e)
        return False


def http_probe(port: int, path: str = "/health", timeout: float = 5.0) -> Tuple[bool, Optional[int]]:
    """Returns (ok, status_code). 2xx/3xx/4xx = up. 5xx/no-response = down."""
    url = f"http://127.0.0.1:{port}{path}"
    try:
        with urlopen(url, timeout=timeout) as resp:
            return resp.status < 500, resp.status
    except HTTPError as e:
        return e.code < 500, e.code
    except (URLError, socket.timeout, ConnectionError, OSError):
        return False, None


def tcp_probe(port: int, timeout: float = 3.0) -> bool:
    """TCP connect + tiny HTTP GET — rejects servers that accept then reset."""
    try:
        with socket.create_connection(("127.0.0.1", port), timeout=timeout) as s:
            s.settimeout(timeout)
            s.sendall(b"GET / HTTP/1.0\r\nHost: localhost\r\n\r\n")
            data = s.recv(64)
            return data.startswith(b"HTTP/")
    except Exception:
        return False


def mongo_ping(container: str, exec_cmd: List[str]) -> bool:
    try:
        r = subprocess.run(
            [DOCKER_BIN, "exec", container, *exec_cmd],
            capture_output=True, text=True, timeout=10,
        )
        return r.returncode == 0 and "ok" in r.stdout.lower()
    except Exception:
        return False


def check_service(svc: Dict) -> Dict:
    container = svc["container"]
    status, health = docker_inspect(container)
    result = {"name": svc["name"], "container": container, "kind": svc["kind"],
              "ok": True, "reasons": [], "container_status": status, "health": health}

    if status is None:
        result["ok"] = False
        result["reasons"].append("container_not_found")
        return result

    if status != "running":
        result["ok"] = False
        result["reasons"].append(f"container_{status}")
        return result

    if health == "unhealthy":
        result["ok"] = False
        result["reasons"].append("docker_health_unhealthy")

    kind = svc["kind"]
    if kind == "fastapi":
        ok, code = http_probe(svc["port"], svc.get("http_path", "/health"))
        result["http_code"] = code
        if not ok:
            result["ok"] = False
            result["reasons"].append(f"http_fail_{code}")
    elif kind == "tcp":
        if not tcp_probe(svc["port"]):
            result["ok"] = False
            result["reasons"].append("tcp_fail")
    elif kind == "mongo":
        if not mongo_ping(container, svc["exec_cmd"]):
            result["ok"] = False
            result["reasons"].append("mongo_ping_fail")
    # kind == "container" → trust docker state/health only

    return result


def check_nginx() -> Dict:
    result = {"name": "nginx", "ok": True, "reasons": []}
    try:
        r = subprocess.run(
            ["systemctl", "is-active", "nginx"],
            capture_output=True, text=True, timeout=5,
        )
        if r.stdout.strip() != "active":
            result["ok"] = False
            result["reasons"].append(f"systemd_{r.stdout.strip() or 'unknown'}")
    except Exception as e:
        result["ok"] = False
        result["reasons"].append(f"systemctl_error:{e}")
        return result

    if not tcp_probe(80):
        result["ok"] = False
        result["reasons"].append("port_80_closed")
    return result


def restart_nginx(logger: logging.Logger) -> bool:
    try:
        r = subprocess.run(
            ["sudo", "-n", "systemctl", "restart", "nginx"],
            capture_output=True, text=True, timeout=30,
        )
        if r.returncode != 0:
            logger.error("nginx restart failed (sudoers NOPASSWD missing?): %s",
                         r.stderr.strip())
            return False
        return True
    except Exception as e:
        logger.error("nginx restart exception: %s", e)
        return False


def check_cron_job(job: Dict) -> Dict:
    result = {"name": job["name"], "ok": True, "reasons": []}
    try:
        r = subprocess.run(
            [DOCKER_BIN, "exec", job["container"], "cat", job["last_run_file"]],
            capture_output=True, text=True, timeout=10,
        )
        if r.returncode != 0:
            result["ok"] = False
            result["reasons"].append("no_last_run_file")
            return result
        data = json.loads(r.stdout)
        run_at = data.get("run_at")
        if not run_at:
            result["ok"] = False
            result["reasons"].append("no_run_at_field")
            return result
        ts = datetime.fromisoformat(run_at.replace("Z", "+00:00"))
        age = datetime.now(timezone.utc) - ts
        result["last_run"] = run_at
        result["age_hours"] = round(age.total_seconds() / 3600, 1)
        if age > timedelta(hours=job["max_age_hours"]):
            result["ok"] = False
            result["reasons"].append(f"stale_{result['age_hours']}h")
    except Exception as e:
        result["ok"] = False
        result["reasons"].append(f"check_error:{e}")
    return result


def trigger_brand_sync(logger: logging.Logger) -> bool:
    try:
        subprocess.Popen(
            ["/home/imageuser/imageDataAPI/run_brand_sync.sh"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        return True
    except Exception as e:
        logger.error("brand_sync trigger failed: %s", e)
        return False


def write_cms_notification(payload: Dict, logger: logging.Logger) -> None:
    if not HAS_PYMONGO:
        logger.warning("pymongo unavailable; CMS notification skipped")
        return
    try:
        user = os.getenv("MONGO_USER", "root")
        pw = os.getenv("MONGO_PASSWORD", "")
        client = MongoClient(
            f"mongodb://{user}:{pw}@127.0.0.1:27017",
            serverSelectionTimeoutMS=3000,
        )
        db = client[os.getenv("MONGO_DB", "imageDB")]
        now_iso = datetime.now(timezone.utc).isoformat()
        db.cms_notification_events.insert_one({
            "item_id": "",
            "category_id": "",
            "event_type": "watchdog_alert",
            "status": "pending",
            "payload": payload,
            "created_at": now_iso,
            "published_at": None,
        })
        client.close()
    except Exception as e:
        logger.error("CMS notification write failed: %s", e)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true",
                        help="Check only, no recovery actions, no notifications")
    parser.add_argument("--no-notify", action="store_true",
                        help="Skip CMS notification writes")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    logger = setup_logging(args.verbose)
    state = load_state()
    logger.info("=== Watchdog run starting (dry_run=%s) ===", args.dry_run)

    results: List[Dict] = []
    recovered: List[str] = []
    failed_recovery: List[str] = []

    for svc in SERVICES:
        r = check_service(svc)
        results.append(r)
        if r["ok"]:
            logger.debug("OK  %-22s status=%s health=%s",
                         r["name"], r["container_status"], r["health"])
            continue
        logger.warning("FAIL %-22s reasons=%s", r["name"], r["reasons"])
        if not svc.get("auto_restart") or args.dry_run:
            continue
        if not can_restart(svc["name"], state):
            logger.info("skip restart %s (cooldown active)", svc["name"])
            r["recovery"] = "skipped_cooldown"
            continue
        if docker_restart(svc["container"], logger):
            record_restart(svc["name"], state)
            time.sleep(POST_RESTART_RECHECK_SEC)
            r2 = check_service(svc)
            r["recovery"] = "restarted"
            r["after_restart"] = {"ok": r2["ok"], "reasons": r2["reasons"]}
            if r2["ok"]:
                recovered.append(svc["name"])
                logger.info("recovered %s after restart", svc["name"])
            else:
                failed_recovery.append(svc["name"])
                logger.error("still failing after restart: %s reasons=%s",
                             svc["name"], r2["reasons"])
        else:
            r["recovery"] = "restart_failed"
            failed_recovery.append(svc["name"])

    if NGINX_ENABLED:
        ng = check_nginx()
        results.append(ng)
        if not ng["ok"]:
            logger.warning("FAIL nginx reasons=%s", ng["reasons"])
            if not args.dry_run and can_restart("nginx", state):
                if restart_nginx(logger):
                    record_restart("nginx", state)
                    time.sleep(3)
                    ng2 = check_nginx()
                    ng["recovery"] = "restarted"
                    ng["after_restart"] = {"ok": ng2["ok"], "reasons": ng2["reasons"]}
                    if ng2["ok"]:
                        recovered.append("nginx")
                    else:
                        failed_recovery.append("nginx")
                else:
                    ng["recovery"] = "restart_failed"
                    failed_recovery.append("nginx")

    for job in CRON_JOBS:
        r = check_cron_job(job)
        results.append(r)
        if r["ok"]:
            logger.debug("OK  cron %-15s age=%sh", r["name"], r.get("age_hours"))
            continue
        logger.warning("FAIL cron %s reasons=%s", r["name"], r["reasons"])
        if args.dry_run or job.get("recovery") != "trigger_brand_sync":
            continue
        if not can_restart(f"cron_{job['name']}", state):
            r["recovery"] = "skipped_cooldown"
            continue
        if trigger_brand_sync(logger):
            record_restart(f"cron_{job['name']}", state)
            r["recovery"] = "triggered"
            recovered.append(f"cron_{job['name']}")
        else:
            r["recovery"] = "trigger_failed"
            failed_recovery.append(f"cron_{job['name']}")

    save_state(state)

    failures = [r for r in results if not r.get("ok")]
    summary = {
        "checked": len(results),
        "ok": len(results) - len(failures),
        "failed": len(failures),
        "recovered": recovered,
        "failed_recovery": failed_recovery,
        "failures": [{"name": f["name"], "reasons": f["reasons"]} for f in failures],
    }
    logger.info("Summary: %s", json.dumps(summary, ensure_ascii=False))

    if (failures or failed_recovery) and not args.dry_run and not args.no_notify:
        write_cms_notification({
            "title": ("Watchdog: unrecovered service failures"
                      if failed_recovery else "Watchdog: services recovered after auto-restart"),
            "summary": summary,
            "results": results,
            "run_at": datetime.now(timezone.utc).isoformat(),
        }, logger)

    return 1 if failed_recovery else 0


if __name__ == "__main__":
    sys.exit(main())
