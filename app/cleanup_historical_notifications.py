"""One-off cleanup: the notifications queue accumulated ~12k pending
events from May 2026 onward but no consumer ever drained them. Since
"published" today is just an admin acknowledgement (no downstream side
effect), mark everything older than N days as auto-acknowledged so the
badge counter reflects reality and only genuinely new events show up
pending.

Run:  docker exec fastapi python /app/cleanup_historical_notifications.py [days]
Defaults to 7 (anything older than a week auto-published).
"""
import os
import sys
from datetime import datetime, timedelta, timezone
from pymongo import MongoClient

u = os.getenv("MONGO_USER", "")
p = os.getenv("MONGO_PASSWORD", "")
db = MongoClient(f"mongodb://{u}:{p}@mongodb:27017")[os.getenv("MONGO_DB", "imageDB")]

days = int(sys.argv[1]) if len(sys.argv) > 1 else 7
cutoff = datetime.now(timezone.utc) - timedelta(days=days)

# Normalize orphan-status docs first
orphans = db.cms_notification_events.update_many(
    {"status": {"$nin": ["pending", "published"]}},
    {"$set": {"status": "pending"}},
)
print(f"Normalized {orphans.modified_count} orphan-status events -> pending")

pending_old = db.cms_notification_events.count_documents(
    {"status": "pending", "created_at": {"$lt": cutoff}}
)
print(f"Pending events older than {days} days: {pending_old}")

if pending_old == 0:
    print("Nothing to do.")
    sys.exit(0)

now = datetime.now(timezone.utc)
result = db.cms_notification_events.update_many(
    {"status": "pending", "created_at": {"$lt": cutoff}},
    {"$set": {
        "status": "published",
        "published_at": now,
        "published_by": "system:historical_backfill",
    }},
)
print(f"Auto-published {result.modified_count} historical pending events.")

remaining = db.cms_notification_events.count_documents({"status": "pending"})
print(f"Remaining pending: {remaining}")
