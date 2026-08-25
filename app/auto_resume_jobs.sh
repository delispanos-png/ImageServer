#!/bin/sh
# Auto-resume long-running background jobs when the fastapi container starts.
# Runs as a sidecar process to uvicorn — see docker-compose `command:` for
# how this script is chained with the API.
#
# Two jobs are managed:
#   1. /app/bulk_enrich_resume.py  — bulk barcode enrichment, resumes from
#      checkpoint in /app/data/bulk_enrich_results.jsonl. Skipped if the
#      progress file has `finished_at`.
#   2. /app/youpharmacy_index_builder.py --phase=barcodes — keeps populating
#      the sitemap-derived index. Skipped when there are zero pending URLs.
#
# Pre-flight: kills any stale chromium / playwright / chromedriver processes
# left over from prior crashes. Without this guard, a crashed run that
# detached a browser would leave the renderer holding CPU + memory after the
# Python parent died, and the new auto-resumed jobs would happily spawn
# *more* browsers on top — that's the fork-bomb pattern that took load
# average to 67 on 2026-06-27.
#
# Tunables (env vars):
#   BULK_CONCURRENCY        — barcodes processed in parallel (default 2)
#   YP_INDEX_BATCH          — batch size for index builder (default 20)
#   YP_INDEX_RATE_DELAY     — seconds between FlareSolverr calls (default 6)
#   AUTO_RESUME_START_DELAY — seconds to wait before launching jobs (default 60)

set -u
DATA_DIR=/app/data
LOG_DIR=/app/data
mkdir -p "$DATA_DIR" "$LOG_DIR"

BULK_CONCURRENCY=${BULK_CONCURRENCY:-2}
YP_INDEX_BATCH=${YP_INDEX_BATCH:-20}
YP_INDEX_RATE_DELAY=${YP_INDEX_RATE_DELAY:-6.0}
AUTO_RESUME_START_DELAY=${AUTO_RESUME_START_DELAY:-60}

(
    # ---- pre-flight: kill stale browser processes ----
    # Use pkill -9 because crashed browsers tend to ignore SIGTERM. Failing
    # the kill (none running) is fine — we just want a clean baseline.
    for pat in \
        "youpharmacy_index_builder.py" \
        "bulk_enrich_resume.py" \
        "playwright.*run-driver" \
        "playwright_chromiumdev_profile" \
        "chromedriver" \
        "chrome_crashpad_handler" \
        ; do
        pkill -9 -f "$pat" 2>/dev/null
    done
    # Generic chromium sweep, but only chromium spawned by ourselves
    # (not the FlareSolverr sidecar — that runs in its own container and
    # is not visible from here anyway).
    pkill -9 -f "/usr/lib/chromium/chromium" 2>/dev/null
    pkill -9 -f "/usr/local/lib/python3.10/site-packages/playwright" 2>/dev/null
    sleep 2
    echo "[auto-resume] pre-flight cleanup done; sleeping ${AUTO_RESUME_START_DELAY}s before launch" >&2

    # Let uvicorn bind and the healthcheck go green before we start hammering.
    sleep "$AUTO_RESUME_START_DELAY"

    # ---- bulk_enrich_resume ----
    PROGRESS_FILE="$DATA_DIR/bulk_enrich_progress.json"
    if [ -f /app/bulk_enrich_resume.py ] && [ -f "$DATA_DIR/newbarcodes_clean.txt" ]; then
        if grep -q '"finished_at"' "$PROGRESS_FILE" 2>/dev/null; then
            echo "[auto-resume] bulk_enrich already finished — skipping" >&2
        else
            python -c "
import json, os
done = set()
results = '$DATA_DIR/bulk_enrich_results.jsonl'
inp = '$DATA_DIR/newbarcodes_clean.txt'
out = '$DATA_DIR/remaining.txt'
if os.path.exists(results):
    for line in open(results):
        try: done.add(json.loads(line)['barcode'])
        except: pass
with open(inp) as f:
    barcodes = [b.strip() for b in f if b.strip()]
remaining = [b for b in barcodes if b not in done]
open(out, 'w').write('\\n'.join(remaining) + '\\n')
print(f'[auto-resume] bulk_enrich: {len(done)} done, {len(remaining)} remaining', flush=True)
"
            echo "[auto-resume] starting bulk_enrich_resume.py (concurrency=${BULK_CONCURRENCY})" >&2
            BULK_CONCURRENCY="$BULK_CONCURRENCY" setsid nohup python -u /app/bulk_enrich_resume.py \
                >> "$LOG_DIR/bulk_enrich.log" 2>&1 &
        fi
    else
        echo "[auto-resume] bulk_enrich files missing — skipping" >&2
    fi

    # ---- youpharmacy index builder ----
    PENDING_COUNT=$(python -c "
import asyncio, os, sys
sys.path.insert(0, '/app')
from pymongo import AsyncMongoClient
async def main():
    u = os.getenv('MONGO_USER',''); p = os.getenv('MONGO_PASSWORD','')
    h = os.getenv('MONGO_HOST','mongodb')
    db = AsyncMongoClient(f'mongodb://{u}:{p}@{h}:27017')[os.getenv('MONGO_DB','imageDB')]
    from youpharmacy_url_index import stats
    s = await stats(db)
    print(s.get('pending', 0))
asyncio.run(main())
" 2>/dev/null)
    if [ -n "$PENDING_COUNT" ] && [ "$PENDING_COUNT" -gt 0 ] 2>/dev/null; then
        echo "[auto-resume] youpharmacy index: $PENDING_COUNT pending — starting builder (batch=${YP_INDEX_BATCH} delay=${YP_INDEX_RATE_DELAY}s)" >&2
        setsid nohup python -u /app/youpharmacy_index_builder.py \
            --phase=barcodes --batch="$YP_INDEX_BATCH" --rate-delay="$YP_INDEX_RATE_DELAY" \
            >> "$LOG_DIR/yp_index_builder.log" 2>&1 &
    else
        echo "[auto-resume] youpharmacy index complete (pending=$PENDING_COUNT) — skipping" >&2
    fi
) &
