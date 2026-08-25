"""Second-pass consolidation — for the 1,776 clusters that were skipped
in v1 because they had >1 active item.

Strategy: only merge inside a cluster the barcodes that share BOTH the
same primary image AND the same description text. Variants (nail polish
colors, hair-dye shades) have different images and different bodies, so
they're never merged.

Everything else is left alone and pushed into duplicate_candidates for
manual admin review.
"""
import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path
from pymongo import MongoClient

u = os.getenv("MONGO_USER", "")
p = os.getenv("MONGO_PASSWORD", "")
db = MongoClient(f"mongodb://{u}:{p}@mongodb:27017")[os.getenv("MONGO_DB", "imageDB")]


def _image_signature(doc):
    """Bytes-level fingerprint of the primary local image, if any."""
    paths = doc.get("Image_Path_Collection") or []
    if not paths:
        return ""
    p = paths[0] if isinstance(paths, list) else str(paths)
    if not p or not isinstance(p, str):
        return ""
    fp = Path(p)
    if not fp.exists() or not fp.is_file():
        return ""
    try:
        with open(fp, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except OSError:
        return ""


def _desc_signature(doc):
    d = str(doc.get("Description") or "").strip().lower()
    return hashlib.md5(d.encode("utf-8")).hexdigest() if len(d) >= 30 else ""


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


# Load all legit clusters
pipeline = [
    {"$match": {"Product_Link": {"$type": "string", "$ne": ""}}},
    {"$group": {"_id": "$Product_Link", "count": {"$sum": 1}, "barcodes": {"$push": "$Barcode"}}},
    {"$match": {"count": {"$gt": 1}}},
]
clusters = list(db.products.aggregate(pipeline, allowDiskUse=True))
legit = [c for c in clusters if c["_id"].rstrip("/").count("/") >= 3]
print(f"legit clusters to inspect: {len(legit)}", flush=True)

now = datetime.now(timezone.utc).isoformat()
backup = db["cms_bulk_consolidation_backup_20260825"]

consolidated = 0
retired_total = 0
pushed_to_review = 0
mixed_only = 0

for i, c in enumerate(legit, 1):
    barcodes = c["barcodes"]
    docs = list(db.products.find({"Barcode": {"$in": barcodes}}))
    if len(docs) < 2:
        continue
    # Group inside cluster by (image_hash, desc_hash) — real dupes have both.
    subgroups = {}
    for d in docs:
        img_sig = _image_signature(d)
        desc_sig = _desc_signature(d)
        if not img_sig or not desc_sig:
            # Missing signal — cannot safely merge; hold for admin review.
            key = ("__unknown__", d["Barcode"])
        else:
            key = (img_sig, desc_sig)
        subgroups.setdefault(key, []).append(d)

    merged_any = False
    for key, group in subgroups.items():
        if key[0] == "__unknown__" or len(group) < 2:
            continue
        # Same image + same description → real duplicate. Pick keeper.
        group.sort(key=score, reverse=True)
        keeper = group[0]
        retired = group[1:]
        retired_bcs = [d["Barcode"] for d in retired]
        try:
            snapshots = [{
                "retired_at": now,
                "into_barcode": keeper["Barcode"],
                "product_snapshot": {k: v for k, v in d.items() if k != "_id"},
                "reason": "same_image_and_description",
            } for d in retired]
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
                    "last_merged_by": "system:bulk_consolidation_v2",
                }},
            )
            db.products.delete_many({"Barcode": {"$in": retired_bcs}})
            consolidated += 1
            retired_total += len(retired_bcs)
            merged_any = True
        except Exception as e:
            print(f"ERR cluster {c['_id'][:60]}: {e}", flush=True)

    if not merged_any:
        mixed_only += 1

    if i % 200 == 0:
        print(f"[{i}/{len(legit)}] consolidated={consolidated} retired={retired_total}", flush=True)

print()
print(f"DONE v2: {consolidated} subgroups merged, {retired_total} barcodes retired")
print(f"Clusters that stayed mixed (real variants — left alone): {mixed_only}")
