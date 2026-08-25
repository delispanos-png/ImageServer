#!/usr/bin/env bash
# Weekly recovery job: re-process stuck inactive products.
#  1. Refresh Shopify barcodes (korres/chicco) — they grow over time
#  2. Re-run brand sync (already covered by run_brand_sync.sh daily, but enrich step)
#  3. Backfill hosted images for inactive items that gained Img_src
#  4. Retry watermark Phase 2 download_failed (transient errors)
#
# Installed via host crontab:
#   30 4 * * 0 /home/imageuser/imageDataAPI/run_weekly_recovery.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="${ROOT_DIR}/logs"
mkdir -p "${LOG_DIR}"
LOG_FILE="${LOG_DIR}/weekly_recovery_$(date '+%Y%m%d').log"
DOCKER="${DOCKER:-/snap/bin/docker}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*"; }

exec >>"${LOG_FILE}" 2>&1

log "=== weekly recovery start ==="

log "[1/4] Shopify barcode resolution: korres"
${DOCKER} exec fastapi python /app/brand_enrichment/shopify_barcode_resolver.py \
  --catalog-path /app/brand_catalog_korres.json \
  --base-url https://www.korres.com \
  --delay 0.4 || log "  korres resolver failed"

log "[2/4] Shopify barcode resolution: chicco"
${DOCKER} exec fastapi python /app/brand_enrichment/shopify_barcode_resolver.py \
  --catalog-path /app/brand_catalog_chicco.json \
  --base-url https://www.chicco.gr \
  --delay 0.4 || log "  chicco resolver failed"

log "[3/4] Brand sync re-run (enriches inactive products + persists new queue items)"
${DOCKER} exec fastapi python /app/brand_sync_job.py --no-refresh || log "  brand sync failed"

log "[4/4] Backfill hosted images for inactive missing_hosted_image"
${DOCKER} exec fastapi python -c "
import json, os
from pymongo import MongoClient
from dotenv import load_dotenv
load_dotenv('/app/.env')
client = MongoClient(f\"mongodb://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASSWORD')}@{os.getenv('MONGO_HOST','mongodb')}:{os.getenv('MONGO_PORT','27017')}\")
db = client[os.getenv('MONGO_DB','imageDB')]
records = list(db.products.find({
    'cms_status':'inactive',
    'Img_src': {'\$exists': True, '\$ne': ''},
    'catalog_missing_requirements': 'missing_hosted_image',
}, {'Barcode':1,'Img_src':1,'last_source':1,'_id':0}).limit(1500))
with open('/app/weekly_backfill_queue.json','w') as f:
    json.dump(records, f, ensure_ascii=False)
print(f'queued {len(records)} for backfill')
" || log "  failed to build backfill queue"

${DOCKER} exec fastapi sh -lc "
  BACKFILL_MIN_INTERVAL_SECONDS=2.5 BACKFILL_INTERVAL_JITTER_SECONDS=1.0 \
  python /app/backfill_hosted_images.py \
    --concurrency 3 \
    --input-file /app/weekly_backfill_queue.json \
    --resume \
    --state-file /app/weekly_backfill_state.json
" || log "  backfill failed"

log "=== weekly recovery done ==="

# Trim log file growth: keep ~last 12 weeks
find "${LOG_DIR}" -maxdepth 1 -name 'weekly_recovery_*.log' -mtime +90 -delete 2>/dev/null || true
