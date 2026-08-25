import json, os, sys
sys.path.insert(0, '/app')
from datetime import datetime, timezone
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv
load_dotenv('/app/.env')
from catalog_quality import build_catalog_quality_updates

with open('/app/nivea_apply_plan.json', encoding='utf-8') as f:
    plan = json.load(f)
print(f"Plan: {len(plan)}")

client = MongoClient(f"mongodb://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASSWORD')}@mongodb:27017")
db = client[os.getenv('MONGO_DB', 'imageDB')]

EVALUATOR = "automation:brand_enrichment:nivea"
matched, activated = 0, 0
ops = []
seen_ids = set()

for entry in plan:
    bc = entry['barcode']
    variants = list({bc, bc.lstrip('0')})
    docs = list(db.products.find({"Barcode": {"$in": variants}, "Title": {"$regex": "NIVEA", "$options": "i"}}))
    for doc in docs:
        if doc['_id'] in seen_ids:
            continue
        seen_ids.add(doc['_id'])
        matched += 1
        updates = {
            "brand_enrichment_source": EVALUATOR,
            "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
            "Category_1": entry['category_1'] or "ΟΜΟΡΦΙΑ",
            "Category_2": entry['category_2'] or "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ",
        }
        if entry.get('category_3'):
            updates["Category_3"] = entry['category_3']
        cand = dict(doc); cand.update(updates)
        updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR))
        if doc.get('cms_status') == 'inactive' and updates.get('cms_status') == 'active':
            activated += 1
        ops.append(UpdateOne({"_id": doc["_id"]}, {"$set": updates}, upsert=False))

print(f"Detailed: matched={matched}, would activate={activated}")

inactive_remaining = list(db.products.find({
    "Title": {"$regex": "NIVEA", "$options": "i"},
    "cms_status": "inactive",
    "_id": {"$nin": list(seen_ids)},
}))
print(f"Remaining inactive NIVEA: {len(inactive_remaining)}")

fallback_activated = 0
for doc in inactive_remaining:
    updates = {
        "brand_enrichment_source": EVALUATOR + ":fallback",
        "brand_enrichment_at": datetime.now(timezone.utc).isoformat(),
        "Category_1": "ΟΜΟΡΦΙΑ",
        "Category_2": "ΠΕΡΙΠΟΙΗΣΗ ΔΕΡΜΑΤΟΣ",
    }
    cand = dict(doc); cand.update(updates)
    updates.update(build_catalog_quality_updates(cand, evaluator=EVALUATOR + ":fallback"))
    if updates.get('cms_status') == 'active':
        fallback_activated += 1
    ops.append(UpdateOne({"_id": doc["_id"]}, {"$set": updates}, upsert=False))

print(f"Fallback would activate: {fallback_activated}")

total_mod = 0
for i in range(0, len(ops), 500):
    r = db.products.bulk_write(ops[i:i+500], ordered=False)
    total_mod += r.modified_count
print(f"Total modified: {total_mod}")
print(f"Total NIVEA activations: {activated + fallback_activated}")
