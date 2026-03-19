from __future__ import annotations

import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from cms_source_jobs import get_source_job_config, update_job_state


def iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def main() -> int:
    if len(sys.argv) != 3:
        return 2

    source_key = str(sys.argv[1]).strip()
    job_key = str(sys.argv[2]).strip()
    job_config = get_source_job_config(source_key, job_key)
    if not job_config:
        update_job_state(
            source_key,
            job_key,
            status="failed",
            last_finished_at=iso_now(),
            last_exit_code=2,
            last_message="Unsupported source job.",
        )
        return 2

    log_path = Path(str(job_config["log_path"]))
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("a", encoding="utf-8") as log_handle:
        log_handle.write(f"[{iso_now()}] starting {source_key}:{job_key}\n")
        log_handle.flush()
        try:
            update_job_state(
                source_key,
                job_key,
                status="running",
                last_message="Job is running.",
                last_started_at=iso_now(),
                pid=os.getpid(),
            )
            result = subprocess.run(
                job_config["command"],
                stdin=subprocess.DEVNULL,
                stdout=log_handle,
                stderr=subprocess.STDOUT,
                cwd="/app",
                env=os.environ.copy(),
                check=False,
            )
            finished_at = iso_now()
            if result.returncode == 0:
                update_job_state(
                    source_key,
                    job_key,
                    status="completed",
                    last_finished_at=finished_at,
                    last_exit_code=0,
                    last_message="Job completed successfully.",
                    pid=0,
                )
            else:
                update_job_state(
                    source_key,
                    job_key,
                    status="failed",
                    last_finished_at=finished_at,
                    last_exit_code=int(result.returncode),
                    last_message=f"Job failed with exit code {result.returncode}.",
                    pid=0,
                )
            return int(result.returncode)
        except Exception as exc:
            update_job_state(
                source_key,
                job_key,
                status="failed",
                last_finished_at=iso_now(),
                last_exit_code=1,
                last_message=f"Job runner crashed: {exc}",
                pid=0,
            )
            raise


if __name__ == "__main__":
    raise SystemExit(main())
