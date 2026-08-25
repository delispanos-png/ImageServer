"""Second-tier auto-merge — process the `needs_human` clusters that
`auto_merge_duplicates.py` skipped because Brand/Category didn't match
exactly.

Additions vs v1:
  - Brand is case-insensitive AND empty-tolerant (empty side matches any
    non-empty side).
  - Category_1 check is DROPPED. Sources classify the same product under
    different taxonomies (Μαλλιά vs Γυναίκα vs ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ) and
    that alone is not a signal of "different item".
  - Extra guard: size tokens embedded in titles must match. A cluster of
    "Body Milk 75 ml" + "Body Milk 200 ml" is NOT merged — different
    bottle sizes are legit distinct SKUs even if the base title tokenises
    the same way. Sizes: \\d+ (ml|gr|g|mg|caps|tabs|τεμ|τμχ|softgels).
  - Rejects clusters where brands look like garbage ("3x", "-", etc.) —
    only single-token strippable brands are accepted as canonical.

Everything else works exactly like v1: keeper by score, aliases,
snapshot to cms_retired_products, delete retired, mark
duplicate_candidates row `merged`.
"""
import os
import re
from datetime import datetime, timezone
from pymongo import MongoClient

u = os.getenv("MONGO_USER", "")
p = os.getenv("MONGO_PASSWORD", "")
db = MongoClient(f"mongodb://{u}:{p}@mongodb:27017")[os.getenv("MONGO_DB", "imageDB")]

# Extract "75 ml", "200ml", "30 caps", "60 τεμ" — the unit tokens the
# duplicate-detector stripped when building its title hash.
_SIZE_RE = re.compile(
    r"(\d+(?:[.,]\d+)?)\s*(ml|gr|g|mg|kg|l|caps|capsules|tabs|tablets|softgels|τεμ|τμχ|sachets|patches)",
    re.IGNORECASE,
)


def extract_sizes(title: str) -> frozenset:
    """Return a normalised set of size tokens found in the title.
    Example: "Body Milk 75 ml, 30 caps" -> {('75', 'ml'), ('30', 'caps')}."""
    if not title:
        return frozenset()
    return frozenset(
        (m.group(1).replace(",", "."), m.group(2).lower())
        for m in _SIZE_RE.finditer(title)
    )


def _norm_brand(v: str) -> str:
    s = str(v or "").strip()
    # Guard against garbage brands like "3x", "-", "1σετ", numbers
    if not s or re.fullmatch(r"[\d.,x×\-\s]+", s):
        return ""
    return s.casefold()


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


def is_safe_v2(docs, cluster_size_limit=20):
    if len(docs) < 2 or len(docs) > cluster_size_limit:
        return False, "cluster_too_large" if len(docs) > cluster_size_limit else "too_small"

    # Brand: after normalisation, non-empty values must agree; empties are OK.
    brands = {_norm_brand(d.get("Brand")) for d in docs}
    brands.discard("")
    if len(brands) > 1:
        return False, "brand_conflict"
    if len(brands) == 0:
        # Everyone had garbage/empty brand — inspect titles instead: the
        # first word usually IS the brand, and if that agrees we're safe.
        first_words = {str(d.get("Title") or "").strip().split()[:1] and str(d.get("Title", "")).strip().split()[0].casefold() for d in docs if d.get("Title")}
        first_words.discard("")
        if len(first_words) > 1:
            return False, "no_brand_and_title_first_word_conflict"

    # Sizes in title: they must all match. This is the guard that stops
    # "Body Milk 75 ml" from merging with "Body Milk 200 ml".
    size_sets = [extract_sizes(d.get("Title") or "") for d in docs]
    non_empty_sizes = [s for s in size_sets if s]
    if non_empty_sizes:
        first = non_empty_sizes[0]
        for s in non_empty_sizes[1:]:
            if s != first:
                return False, "size_mismatch"
    # If any doc has no size but others do, be conservative and skip.
    if non_empty_sizes and len(non_empty_sizes) != len(size_sets):
        return False, "size_partial"

    return True, ""


now = datetime.now(timezone.utc).isoformat()
pending = list(db.duplicate_candidates.find({"status": "needs_human"}))
print(f"needs_human clusters to re-evaluate: {len(pending)}", flush=True)

merged_ok = 0
retired_total = 0
still_skipped = {}

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

    safe, reason = is_safe_v2(docs)
    if not safe:
        still_skipped[reason] = still_skipped.get(reason, 0) + 1
        db.duplicate_candidates.update_one(
            {"_id": cluster["_id"]},
            {"$set": {"skip_reason": reason, "reviewed_at": now}},
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
                "retired_by": "system:auto_merge_duplicates_v2",
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
                "last_merged_by": "system:auto_merge_duplicates_v2",
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
        still_skipped["error"] = still_skipped.get("error", 0) + 1
        print(f"ERR cluster {cluster['_id']}: {e}", flush=True)

    if i % 500 == 0:
        print(f"[{i}/{len(pending)}] merged={merged_ok} retired={retired_total}", flush=True)

print()
print(f"DONE v2: {merged_ok} clusters auto-merged, {retired_total} barcodes retired")
print(f"Still needs_human: {still_skipped}")
