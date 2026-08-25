#!/usr/bin/env bash
# Service watchdog — checks active services every 15 minutes, auto-recovers.
# Installed via host crontab: */15 * * * * /home/imageuser/imageDataAPI/run_service_watchdog.sh
set -euo pipefail

LOG_DIR="/home/imageuser/imageDataAPI/logs"
mkdir -p "${LOG_DIR}"
CRON_LOG="${LOG_DIR}/service_watchdog_cron.log"

# Keep the cron-side stdout/stderr capture small — the script does its own rotation
# for service_watchdog.log via RotatingFileHandler. This file just catches anything
# that escapes the Python logging (e.g. import errors, segfaults).
{
  echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') run ==="
  /usr/bin/python3 /home/imageuser/imageDataAPI/service_watchdog.py
  echo "exit=$? at $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo
} >> "${CRON_LOG}" 2>&1

# Trim cron log if it grows past ~1MB (keep last ~500 lines)
if [ -f "${CRON_LOG}" ] && [ "$(stat -c%s "${CRON_LOG}")" -gt 1048576 ]; then
  tail -n 500 "${CRON_LOG}" > "${CRON_LOG}.trim" && mv "${CRON_LOG}.trim" "${CRON_LOG}"
fi
