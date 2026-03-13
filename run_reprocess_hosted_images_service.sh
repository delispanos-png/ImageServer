#!/usr/bin/env bash
set -euo pipefail

cd /home/imageuser/imageDataAPI

REPROCESS_SOURCE="${REPROCESS_SOURCE:-farmakopoiosmou}"
REPROCESS_LIMIT="${REPROCESS_LIMIT:-0}"
REPROCESS_EXTRA_ARGS="${REPROCESS_EXTRA_ARGS:-}"
DOCKER_BIN="${DOCKER_BIN:-/snap/bin/docker}"
LOG_FILE="${REPROCESS_LOG_FILE:-/tmp/reprocess_hosted_images.log}"
REPROCESS_QUEUE_FILE="${REPROCESS_QUEUE_FILE:-/app/reprocess_farmakopoiosmou_queue.json}"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"
exec >>"$LOG_FILE" 2>&1

echo "[$(date -u +%FT%TZ)] starting reprocess wrapper source=$REPROCESS_SOURCE limit=$REPROCESS_LIMIT docker_bin=$DOCKER_BIN"

if [[ ! -x "$DOCKER_BIN" ]]; then
  echo "docker binary not found or not executable: $DOCKER_BIN" >&2
  exit 1
fi

LIMIT_ARGS=()
if [[ "$REPROCESS_LIMIT" != "0" ]]; then
  LIMIT_ARGS=(--limit "$REPROCESS_LIMIT")
fi

INPUT_FILE_ARGS=()
if [[ -n "$REPROCESS_QUEUE_FILE" ]]; then
  INPUT_FILE_ARGS=(--input-file "$REPROCESS_QUEUE_FILE")
fi

exec "$DOCKER_BIN" exec fastapi sh -lc "
  python /app/reprocess_hosted_images.py \
    --source '$REPROCESS_SOURCE' \
    --skip-current-version \
    ${INPUT_FILE_ARGS[*]:-} \
    ${LIMIT_ARGS[*]:-} \
    $REPROCESS_EXTRA_ARGS
"
