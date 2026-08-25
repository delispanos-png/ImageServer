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
            # Read the LATEST counts from the state file so the runner's
            # summary message reflects the actual outcome instead of
            # collapsing everything into a bare "exit code N" string.
            from cms_source_jobs import get_source_job_overview
            latest_counts = {"processed": 0, "updated": 0, "skipped": 0, "failed": 0}
            try:
                for row in get_source_job_overview(source_key):
                    if row.get("key") == job_key:
                        for k in latest_counts:
                            latest_counts[k] = int(row.get(k, 0) or 0)
                        break
            except Exception:
                pass
            u, s, f = latest_counts["updated"], latest_counts["skipped"], latest_counts["failed"]
            p = latest_counts["processed"]

            if result.returncode == 0:
                if f > 0 and p > 0:
                    # Batch completed but some individual barcodes couldn't
                    # be refreshed. That's expected — no source has data for
                    # every barcode. Surface as `completed_with_warnings`.
                    status = "completed_with_warnings"
                    msg = (
                        f"Completed with {f} failure(s) out of {p}: "
                        f"updated {u}, skipped {s}."
                    )
                else:
                    status = "completed"
                    msg = f"Completed: updated {u}, skipped {s}, failed {f} out of {p}."
                update_job_state(
                    source_key, job_key,
                    status=status,
                    last_finished_at=finished_at,
                    last_exit_code=0,
                    last_message=msg,
                    pid=0,
                )
            elif result.returncode == 2:
                # Catastrophic outcome from the script itself.
                update_job_state(
                    source_key, job_key,
                    status="failed",
                    last_finished_at=finished_at,
                    last_exit_code=2,
                    last_message=(
                        f"Job aborted: {f}/{p} failures (>=90%) or nothing processed. "
                        f"Check the source pipeline health."
                    ),
                    pid=0,
                )
            else:
                update_job_state(
                    source_key, job_key,
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
