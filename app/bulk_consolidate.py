"""One-off bulk consolidation of duplicate product records that share the
same Product_Link. For each cluster, pick the highest-scoring "keeper",
move the retired barcodes into keeper.barcode_aliases, snapshot the
retired docs to `cms_bulk_consolidation_backup_20260825`, then delete
them from `db.products`.

Safety:
- Skips clusters where more than one item has cms_status="active" —
  those need a human to reconcile.
- Full snapshot of every retired doc goes to the backup collection so a
  rollback is possible.
"""
import os
from datetime import datetime, timezone
from pymongo import MongoClient

u = os.getenv("MONGO_USER", "")
p = os.getenv("MONGO_PASSWORD", "")
db = MongoClient(f"mongodb://{u}:{p}@mongodb:27017")[os.getenv("MONGO_DB", "imageDB")]


def score(d):
    s = 0
    if d.get("cms_main_image") or (d.get("Image_url") or []):
        s += 100
    if d.get("cms_status") == "active":
        s += 50
    if len(str(d.get("Description") or "")) >= 100:
        s += 30
    if d.get("Category_1"):
        s += 10
    if d.get("cms_title"):
        s += 5
    s += len(str(d.get("Title") or ""))
    return s


pipeline = [
    {"$match": {"Product_Link": {"$type": "string", "$ne": ""}}},
    {"$group": {"_id": "$Product_Link", "count": {"$sum": 1}, "barcodes": {"$push": "$Barcode"}}},
    {"$match": {"count": {"$gt": 1}}},
]
clusters = list(db.products.aggregate(pipeline, allowDiskUse=True))
legit = [c for c in clusters if c["_id"].rstrip("/").count("/") >= 3]
print(f"legit clusters: {len(legit)}", flush=True)

now = datetime.now(timezone.utc).isoformat()
consolidated = 0
retired_total = 0
skipped_multiple_active = 0
errors = 0

backup = db["cms_bulk_consolidation_backup_20260825"]
backup.drop()

for i, c in enumerate(legit, 1):
    barcodes = c["barcodes"]
    docs = list(db.products.find({"Barcode": {"$in": barcodes}}))
    if len(docs) < 2:
        continue
    actives = [d for d in docs if d.get("cms_status") == "active"]
    if len(actives) > 1:
        skipped_multiple_active += 1
        continue
    docs.sort(key=score, reverse=True)
    keeper = docs[0]
    retired = docs[1:]
    retired_bcs = [d["Barcode"] for d in retired]
    try:
        snapshots = []
        for d in retired:
            snap = {k: v for k, v in d.items() if k != "_id"}
            snapshots.append({
                "retired_at": now,
                "into_barcode": keeper["Barcode"],
                "product_snapshot": snap,
            })
        if snapshots:
            backup.insert_many(snapshots)
        existing_aliases = keeper.get("barcode_aliases") or []
        if not isinstance(existing_aliases, list):
            existing_aliases = []
        new_aliases = list(dict.fromkeys(list(existing_aliases) + retired_bcs))
        db.products.update_one(
            {"_id": keeper["_id"]},
            {"$set": {
                "barcode_aliases": new_aliases,
                "last_merged_at": now,
                "last_merged_by": "system:bulk_consolidation",
            }},
        )
        db.products.delete_many({"Barcode": {"$in": retired_bcs}})
        consolidated += 1
        retired_total += len(retired_bcs)
    except Exception as e:
        errors += 1
        print(f"ERR cluster {c['_id'][:60]}: {e}", flush=True)
    if i % 100 == 0:
        print(f"[{i}/{len(legit)}] consolidated={consolidated} retired={retired_total}", flush=True)

print()
print(f"DONE: {consolidated} clusters consolidated, {retired_total} barcodes moved to aliases")
print(f"Skipped (multiple active): {skipped_multiple_active}")
print(f"Errors: {errors}")
