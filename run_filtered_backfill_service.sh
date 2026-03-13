#!/usr/bin/env bash
set -euo pipefail

cd /home/imageuser/imageDataAPI

QUEUE_SRC="/home/imageuser/imageDataAPI/recoverable_backfill_queue.json"
QUEUE_DST="/home/imageuser/imageDataAPI/app/recoverable_backfill_queue.json"

if [[ ! -f "$QUEUE_SRC" ]]; then
  echo "recoverable queue not found: $QUEUE_SRC" >&2
  exit 1
fi

cp "$QUEUE_SRC" "$QUEUE_DST"

exec docker exec fastapi sh -lc '
  BACKFILL_MIN_INTERVAL_SECONDS=6.0
  BACKFILL_INTERVAL_JITTER_SECONDS=2.0
  export BACKFILL_MIN_INTERVAL_SECONDS BACKFILL_INTERVAL_JITTER_SECONDS
  python /app/backfill_hosted_images.py \
    --concurrency 1 \
    --input-file /app/recoverable_backfill_queue.json \
    --resume \
    --state-file /app/backfill_resume_state.json
'
