#!/usr/bin/env bash
set -euo pipefail

UNIT_NAME="${1:-unknown}"
RESULT="${2:-unknown}"
EXIT_CODE="${3:-unknown}"
EXIT_STATUS="${4:-unknown}"

if [[ "$RESULT" == "success" ]]; then
  exit 0
fi

exec /usr/bin/python3 /home/imageuser/imageDataAPI/backfill_failure_email.py \
  "$UNIT_NAME" "$RESULT" "$EXIT_CODE" "$EXIT_STATUS"
