"""Auto-merge every `pending` cluster in `duplicate_candidates` that meets
a strict safety filter — no admin click needed.

Safety filter (ALL must hold for auto-merge):
  1. Every barcode in the cluster has the same non-empty Brand (case-insensitive).
  2. Every barcode has the same non-empty Category_1 (case-insensitive).
  3. Cluster size <= 20 — anything wider almost always has real variants.

Anything that fails the filter is marked `status="needs_human"` on the
`duplicate_candidates` row so the admin UI can still find it, but it's
not touched in `db.products`.

Consolidation itself uses the same pattern as the manual `/duplicates/merge`
endpoint:
  - Pick the highest-scoring barcode as keeper.
  - Add the others to keeper.barcode_aliases.
  - Snapshot each retired doc to `cms_retired_products` for audit/rollback.
  - Delete retired rows from `db.products`.
  - Mark the `duplicate_candidates` row `status="merged"`.
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


def _norm(v):
    return str(v or "").strip().casefold()


def is_safe_to_merge(docs, cluster_size_limit=20):
    if len(docs) < 2 or len(docs) > cluster_size_limit:
        return False, "cluster_too_large" if len(docs) > cluster_size_limit else "too_small"
    brands = {_norm(d.get("Brand")) for d in docs}
    cats = {_norm(d.get("Category_1")) for d in docs}
    if len(brands) != 1 or "" in brands:
        return False, "brand_mismatch_or_empty"
    if len(cats) != 1 or "" in cats:
        return False, "category_mismatch_or_empty"
    return True, ""


now = datetime.now(timezone.utc).isoformat()
pending = list(db.duplicate_candidates.find({"status": "pending"}))
print(f"pending clusters: {len(pending)}", flush=True)

merged_ok = 0
retired_total = 0
skipped_reasons = {}

for i, cluster in enumerate(pending, 1):
    barcodes = list(cluster.get("barcodes") or [])
    if len(barcodes) < 2:
        continue
    docs = list(db.products.find({"Barcode": {"$in": barcodes}}))
    if len(docs) < 2:
        db.duplicate_candidates.update_one(
            {"_id": cluster["_id"]},
            {"$set": {"status": "stale", "resolved_at": now}},
        )
        continue

    safe, reason = is_safe_to_merge(docs)
    if not safe:
        skipped_reasons[reason] = skipped_reasons.get(reason, 0) + 1
        db.duplicate_candidates.update_one(
            {"_id": cluster["_id"]},
            {"$set": {"status": "needs_human", "skip_reason": reason, "reviewed_at": now}},
        )
        continue

    docs.sort(key=score, reverse=True)
    keeper = docs[0]
    retired = docs[1:]
    retired_bcs = [d["Barcode"] for d in retired]

    try:
        for d in retired:
            snap = {k: v for k, v in d.items() if k != "_id"}
            db.cms_retired_products.insert_one({
                "retired_at": now,
                "retired_by": "system:auto_merge_duplicates",
                "into_barcode": keeper["Barcode"],
                "product_snapshot": snap,
                "duplicate_group_id": str(cluster["_id"]),
            })
        existing_aliases = keeper.get("barcode_aliases") or []
        if not isinstance(existing_aliases, list):
            existing_aliases = []
        new_aliases = list(dict.fromkeys(list(existing_aliases) + retired_bcs))
        db.products.update_one(
            {"_id": keeper["_id"]},
            {"$set": {
                "barcode_aliases": new_aliases,
                "last_merged_at": now,
                "last_merged_by": "system:auto_merge_duplicates",
            }},
        )
        db.products.delete_many({"Barcode": {"$in": retired_bcs}})
        db.duplicate_candidates.update_one(
            {"_id": cluster["_id"]},
            {"$set": {
                "status": "merged",
                "resolved_at": now,
                "keeper_barcode": keeper["Barcode"],
                "retired_barcodes": retired_bcs,
            }},
        )
        merged_ok += 1
        retired_total += len(retired_bcs)
    except Exception as e:
        skipped_reasons["error"] = skipped_reasons.get("error", 0) + 1
        print(f"ERR cluster {cluster['_id']}: {e}", flush=True)

    if i % 500 == 0:
        print(f"[{i}/{len(pending)}] merged={merged_ok} retired={retired_total}", flush=True)

print()
print(f"DONE: {merged_ok} clusters auto-merged, {retired_total} barcodes retired")
print(f"Skipped (needs_human or error): {skipped_reasons}")
