#!/usr/bin/env bash
# Daily brand catalog sync — auto-imports new manufacturer products.
# Runs at 03:00 Athens (00:00 UTC) via host crontab.

set -euo pipefail

LOG_DIR="/home/imageuser/imageDataAPI/logs"
mkdir -p "${LOG_DIR}"
LOG_FILE="${LOG_DIR}/brand_sync_$(date '+%Y%m%d').log"

{
  echo "=== Brand sync starting $(date '+%Y-%m-%d %H:%M:%S %Z') ==="
  /snap/bin/docker exec -w /app fastapi python3 /app/brand_sync_job.py
  echo "=== Brand sync done $(date '+%Y-%m-%d %H:%M:%S %Z') ==="
} >> "${LOG_FILE}" 2>&1
