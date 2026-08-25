#!/bin/bash

# CloudOn MongoDB Backup Script
# Automated backup with retention policy

set -e  # Exit on error

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="/home/imageuser/imageDataAPI/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="mongodb_backup_${DATE}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "====================================="
echo "CloudOn MongoDB Backup"
echo "====================================="
echo "Start time: $(date)"
echo "Backup location: ${BACKUP_PATH}"
echo ""

# Perform backup
echo "Creating backup..."
docker exec mongodb mongodump \
    --username="${MONGO_USER}" \
    --password="${MONGO_PASSWORD}" \
    --authenticationDatabase=admin \
    --out="/tmp/${BACKUP_NAME}"

# Copy from container to host
echo "Copying backup from container..."
docker cp mongodb:/tmp/${BACKUP_NAME} "${BACKUP_PATH}"

# Compress backup
echo "Compressing backup..."
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
rm -rf "${BACKUP_NAME}"

# Clean up container
docker exec mongodb rm -rf "/tmp/${BACKUP_NAME}"

# Calculate backup size
BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
echo "Backup size: ${BACKUP_SIZE}"

# Remove old backups (retention policy)
echo "Cleaning old backups (retention: ${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "mongodb_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# Count remaining backups
BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "mongodb_backup_*.tar.gz" | wc -l)
echo "Total backups: ${BACKUP_COUNT}"

echo ""
echo "====================================="
echo "Backup completed successfully!"
echo "End time: $(date)"
echo "====================================="

# Optional: Send notification (uncomment to enable)
# echo "MongoDB backup completed: ${BACKUP_NAME}" | mail -s "CloudOn Backup Success" admin@yourdomain.com
