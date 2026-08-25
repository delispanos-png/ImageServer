"""Daily brand catalog sync — auto-imports new manufacturer products.

For each registered brand:
  1. Re-fetch the manufacturer catalog (force refresh)
  2. Compare with our products collection
  3. Auto-import NEW high-confidence products (exact barcode match available)
  4. Queue medium-confidence NEW products for manual review
  5. Post a dashboard notification with the summary

Runs daily at 03:00 Athens via the container cron.
"""

from __future__ import annotations

import json
import os
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Tuple

import requests
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne

sys.path.insert(0, "/app")
from catalog_quality import build_catalog_quality_updates  # noqa: E402
from product_attributes import (  # noqa: E402
    CONF_VERIFIED,
    SRC_MANUFACTURER,
    build_attributes_block,
)


load_dotenv("/app/.env")

IMAGES_DIR = Path("/app/images")
EVALUATOR = "automation:brand_sync_job"
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# Brand registry: each entry specifies fetch+match+L1 fallback
BRAND_REGISTRY = [
    {
        "name": "frezyderm",
        "title_pattern": "FREZYDERM",
        "confidence": "high",  # exact barcode match
        "default_l1": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
        "cache_path": "/app/brand_catalog_frezyderm.json",
        "refresh_module": "brand_enrichment.frezyderm_enrich",
        # load_catalog returns parsed product dicts (gtin/title/image/...).
        # fetch_product_urls only returns URL strings and crashes downstream.
        "refresh_callable": "load_catalog",
    },
    {
        "name": "avene",
        "title_pattern": "AVENE|AVÈNE",
        "confidence": "high",
        "default_l1": "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ",
        "cache_path": "/app/brand_catalog_avene.json",
        "refresh_module": None,  # uses host-side crawler; re-uses cached snapshot
        "refresh_callable": None,
    },
    {
        "name": "mam",
        "title_pattern": r"^MAM\b",
        "confidence": "high",
        "default_l1": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
        "cache_path": "/app/brand_catalog_mam.json",
        "refresh_module": None,
        "refresh_callable": None,
    },
    {
        "name": "apivita",
        "title_pattern": "APIVITA",
        "confidence": "medium",
        "default_l1": "ΟΜΟΡΦΙΑ",
        "cache_path": "/app/brand_catalog_apivita.json",
        "refresh_module": "brand_enrichment.apivita_enrich",
        "refresh_callable": "fetch_apivita_catalog",
    },
    {
        "name": "korres",
        "title_pattern": "KORRES",
        "confidence": "medium",
        "default_l1": "ΟΜΟΡΦΙΑ",
        "cache_path": "/app/brand_catalog_korres.json",
        "refresh_module": "brand_enrichment.korres_enrich",
        "refresh_callable": "fetch_korres_catalog",
    },
    {
        "name": "chicco",
        "title_pattern": "CHICCO",
        "confidence": "medium",
        "default_l1": "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ",
        "cache_path": "/app/brand_catalog_chicco.json",
        "refresh_module": "brand_enrichment.chicco_enrich",
        "refresh_callable": "fetch_catalog",
    },
    {
        "name": "lamberts",
        "title_pattern": "LAMBERTS",
        "confidence": "medium",
        "default_l1": "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ",
        "cache_path": "/app/brand_catalog_lamberts.json",
        "refresh_module": "brand_enrichment.lamberts_enrich",
        "refresh_callable": "fetch_catalog",
    },
]


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


def _load_catalog(cache_path: str) -> List[Dict]:
    if not os.path.exists(cache_path):
        return []
    try:
        with open(cache_path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _refresh_catalog(brand: Dict) -> List[Dict]:
    """Re-fetch the brand catalog. Falls back to cache on error."""
    if not brand.get("refresh_module") or not brand.get("refresh_callable"):
        print(f"  {brand['name']}: no refresh callable, using cached")
        return _load_catalog(brand["cache_path"])
    try:
        sys.path.insert(0, "/app/brand_enrichment")
        module_name = brand["refresh_module"].split(".")[-1]
        module = __import__(module_name)
        fn = getattr(module, brand["refresh_callable"])
        items = fn()
        if items:
            with open(brand["cache_path"], "w", encoding="utf-8") as f:
                json.dump(items, f, ensure_ascii=False, indent=2)
            return items
    except Exception as exc:
        print(f"  {brand['name']}: refresh failed ({exc}); using cache")
    return _load_catalog(brand["cache_path"])


def _normalize_title_tokens(title: str, brand_name: str) -> set:
    text = (title or "").lower().replace(brand_name.lower(), " ")
    text = _strip_accents(text)
    import re
    text = re.sub(r"\b\d+[\s\.,]?\d*\s?(ml|gr|g|mg|τεμ|τμχ|caps|tabs)\b", " ", text, flags=re.I)
    text = re.sub(r"[/\-,\.():&·•\[\]\"']", " ", text)
    return {t for t in text.split() if len(t) >= 3}


def _extract_barcodes(entry: Dict) -> List[str]:
    """Return all barcode variants the entry exposes."""
    out: List[str] = []
    for key in ("gtin", "gtin13", "sitemap_barcode", "barcode"):
        val = str(entry.get(key, "") or "").strip()
        if val and val not in out:
            out.append(val)
        if val:
            stripped = val.lstrip("0")
            if stripped and stripped != val and stripped not in out:
                out.append(stripped)
    return out


def _entry_title(entry: Dict) -> str:
    for key in ("name", "title"):
        v = str(entry.get(key, "") or "").strip()
        if v:
            return v
    return ""


def _entry_image(entry: Dict) -> str:
    img = entry.get("image")
    if isinstance(img, dict):
        return str(img.get("url", "") or "").strip()
    if isinstance(img, str):
        return img.strip()
    images = entry.get("images")
    if isinstance(images, list) and images:
        first = images[0]
        if isinstance(first, dict):
            return str(first.get("src") or first.get("url") or "").strip()
    return ""


def _entry_source_url(entry: Dict) -> str:
    for key in ("source_url", "url", "link", "product_url"):
        v = str(entry.get(key, "") or "").strip()
        if v.startswith(("http://", "https://")):
            return v
    return ""


def _entry_categories(entry: Dict, brand: Dict) -> Tuple[str, str, str]:
    c1 = str(entry.get("category_1", "") or "").strip()
    c2 = str(entry.get("category_2", "") or "").strip()
    c3 = str(entry.get("category_3", "") or "").strip()
    if not c1:
        c1 = brand.get("default_l1", "")
    return c1, c2, c3


def _download_image(url: str, target: Path) -> bool:
    if not url:
        return False
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20, allow_redirects=True)
    except Exception:
        return False
    if r.status_code != 200 or len(r.content) < 1000:
        return False
    head = r.content[:8]
    if not (head[:3] == b"\xff\xd8\xff" or head[:4] == b"\x89PNG" or head[:6] == b"GIF89a"):
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(".dl.tmp")
    with open(tmp, "wb") as f:
        f.write(r.content)
    tmp.rename(target)
    return True


def _build_enrichment_updates(
    existing: Dict[str, Any],
    entry: Dict[str, Any],
    brand: Dict[str, Any],
    title: str,
    c1: str,
    c2: str,
    c3: str,
    now: str,
) -> Any:
    """Return $set updates to enrich an existing INACTIVE product with brand
    catalog data, or None if the product is active (skip) or no data to add.

    Strategy: fill only empty/missing fields on the primary doc; always
    refresh the per-brand snapshot under Other_Sites.<brand>. Never overwrite
    photo_source_locked images.
    """
    status = str(existing.get("cms_status", "") or "").strip().lower() or "inactive"
    if status == "active":
        return None

    def _missing(field: str) -> bool:
        value = existing.get(field)
        if isinstance(value, list):
            return not any(isinstance(v, str) and v.strip() for v in value)
        return not (isinstance(value, str) and value.strip())

    description = str(entry.get("description", "") or "").strip()
    img_url = _entry_image(entry)
    source_url = str(entry.get("source_url", "") or "").strip()

    updates: Dict[str, Any] = {}

    if title and _missing("Title"):
        updates["Title"] = title
    if title and _missing("cms_title"):
        updates["cms_title"] = title
    if description and _missing("Description"):
        updates["Description"] = description
    if description and _missing("cms_description"):
        updates["cms_description"] = description
    if description and _missing("cms_description_html"):
        updates["cms_description_html"] = f"<p>{description}</p>"
    if c1 and _missing("Category_1"):
        updates["Category_1"] = c1
    if c2 and _missing("Category_2"):
        updates["Category_2"] = c2
    if c3 and _missing("Category_3"):
        updates["Category_3"] = c3
    if _missing("Brand"):
        updates["Brand"] = brand["name"]

    photo_locked = bool(existing.get("photo_source_locked"))
    if img_url and not photo_locked:
        if _missing("Img_src"):
            updates["Img_src"] = img_url
        if _missing("Img_src_List"):
            updates["Img_src_List"] = [img_url]
        # If hosted image is missing, download it. Hosted images are the
        # primary source for the public API; without one the product cannot
        # be activated regardless of the catalog snapshot.
        barcode = str(existing.get("Barcode", "") or "").strip()
        if barcode:
            hosted_path = IMAGES_DIR / barcode / "1.jpg"
            if not hosted_path.exists() and _download_image(img_url, hosted_path):
                updates["image_source_domain"] = brand["name"]
                updates["image_processing_version"] = f"{brand['name']}_auto_v1"
                updates["image_reprocessed_at"] = now
                updates["watermark_cleanup_applied"] = False

    # Always refresh the brand-specific snapshot and the enrichment marker.
    updates[f"Other_Sites.{brand['name']}"] = {
        "Title": title,
        "Img_src": img_url,
        "Img_src_List": [img_url] if img_url else [],
        "Category_1": c1,
        "Category_2": c2,
        "Category_3": c3,
        "Product_Link": source_url,
        "Updated_At": now,
    }
    updates["brand_enrichment_at"] = now
    updates["brand_enrichment_source"] = EVALUATOR

    # Persist manufacturer-verified attributes when the catalog provides
    # them (Shopify variants expose `grams`, some feeds expose dimensions).
    weight_kg = entry.get("weight_kg")
    if weight_kg:
        existing_attrs = existing.get("attributes") or {}
        if existing_attrs.get("weight_kg_confidence") != CONF_VERIFIED:
            existing_attrs["weight_kg"] = float(weight_kg)
            existing_attrs["weight_kg_source"] = SRC_MANUFACTURER
            existing_attrs["weight_kg_confidence"] = CONF_VERIFIED
            updates["attributes"] = existing_attrs

    # Recompute catalog quality flags against the merged candidate so
    # cms_status / missing_requirements stay in sync.
    candidate = dict(existing)
    candidate.update(updates)
    updates.update(build_catalog_quality_updates(candidate, evaluator=EVALUATOR + ":enrich"))
    return updates


def _sync_brand(db, brand: Dict, *, dry_run: bool = False) -> Dict[str, Any]:
    print(f"=== Sync {brand['name']} ===")
    catalog = _refresh_catalog(brand)
    if not catalog:
        return {"brand": brand["name"], "status": "no_catalog", "examined": 0, "new": 0, "queued": 0, "imported": 0}

    print(f"  catalog: {len(catalog)} entries")

    # Build sets of barcodes/titles from catalog
    catalog_barcodes = set()
    for entry in catalog:
        for bc in _extract_barcodes(entry):
            catalog_barcodes.add(bc)

    # Query DB for products matching this brand (full docs — needed for enrichment of inactive items)
    db_query = {"Title": {"$regex": brand["title_pattern"], "$options": "i"}}
    db_products = list(db.products.find(db_query))
    db_by_barcode: Dict[str, Dict[str, Any]] = {}
    for p in db_products:
        bc = str(p.get("Barcode", "") or "").strip()
        if not bc:
            continue
        db_by_barcode[bc] = p
        stripped = bc.lstrip("0")
        if stripped and stripped != bc and stripped not in db_by_barcode:
            db_by_barcode[stripped] = p
    db_barcodes = set(db_by_barcode.keys())
    db_titles = [p.get("Title", "") for p in db_products if p.get("Title")]

    stats = {"brand": brand["name"], "status": "ok", "examined": len(catalog),
             "new": 0, "queued": 0, "imported": 0, "high_match": 0, "low_match": 0,
             "enriched": 0, "enrich_skipped_active": 0}
    imported_samples: List[Dict[str, Any]] = []
    queued_samples: List[Dict[str, Any]] = []
    ops: List[UpdateOne] = []

    confidence = brand.get("confidence", "medium")
    now = _utcnow()

    for entry in catalog:
        # Defensive: tolerate cache files that contain raw URL strings
        # (older frezyderm_enrich.fetch_product_urls output, pre-fix).
        if not isinstance(entry, dict):
            continue

        barcodes = _extract_barcodes(entry)
        title = _entry_title(entry)
        c1, c2, c3 = _entry_categories(entry, brand)

        # High-confidence: exact barcode match
        if barcodes:
            matched_bc = next((bc for bc in barcodes if bc in db_barcodes), None)
            if matched_bc is not None:
                stats["high_match"] += 1
                # Enrich existing INACTIVE products with catalog data.
                # Active products are left untouched (admins may have hand-curated them).
                existing = db_by_barcode.get(matched_bc) or {}
                enrich_updates = _build_enrichment_updates(
                    existing, entry, brand, title, c1, c2, c3, now
                )
                if enrich_updates is None:
                    stats["enrich_skipped_active"] += 1
                elif enrich_updates:
                    real_bc = str(existing.get("Barcode", matched_bc) or matched_bc).strip()
                    ops.append(UpdateOne({"Barcode": real_bc}, {"$set": enrich_updates}))
                    stats["enriched"] += 1
                continue
            # NEW with high-conf barcode → auto-import (if brand confidence = high)
            stats["new"] += 1
            if confidence != "high":
                stats["queued"] += 1
                if len(queued_samples) < 50:
                    queued_samples.append({"brand": brand["name"], "barcodes": barcodes, "title": title})
                continue
            primary_bc = barcodes[0]
            new_doc = {
                "Barcode": primary_bc,
                "Site_Id": f"{brand['name']}_auto_{primary_bc}",
                "Site": brand["name"],
                "Title": title,
                "Description": str(entry.get("description", "") or ""),
                "Brand": title.split()[0] if title else brand["name"],
                "Category_1": c1,
                "Category_2": c2,
                "Category_3": c3,
                "Img_src": _entry_image(entry),
                "Image_url": [],
                "Img_src_List": [_entry_image(entry)] if _entry_image(entry) else [],
                "Product_Link": str(entry.get("source_url", "") or ""),
                "Other_Sites": {},
                "cms_barcode": primary_bc,
                "cms_title": title,
                "cms_brand": title.split()[0] if title else brand["name"],
                "cms_description": str(entry.get("description", "") or ""),
                "cms_description_html": f"<p>{str(entry.get('description', '') or '')}</p>",
                "cms_status": "inactive",
                "cms_main_image": "",
                "cms_updated_at": now,
                "cms_updated_by": EVALUATOR,
                "category_resolution_source": "source",
                "category_source_domain": brand["name"],
                "text_source_domain": brand["name"],
                "image_source_domain": brand["name"],
                "image_processing_version": f"{brand['name']}_auto_v1",
                "watermark_cleanup_applied": False,
                "image_reprocessed_at": now,
                "brand_enrichment_source": EVALUATOR,
                "brand_enrichment_at": now,
            }
            # Try downloading the image into our hosted folder
            img_url = _entry_image(entry)
            if img_url:
                target = IMAGES_DIR / primary_bc / "1.jpg"
                if _download_image(img_url, target):
                    new_doc["Image_Path"] = f"Images/{brand['name']}/{primary_bc}.jpg"
                    new_doc["Image_Path_Collection"] = new_doc["Image_Path"]
            new_doc.update(build_catalog_quality_updates(new_doc, evaluator=EVALUATOR))
            ops.append(UpdateOne({"Barcode": primary_bc}, {"$setOnInsert": new_doc}, upsert=True))
            stats["imported"] += 1
            if len(imported_samples) < 50:
                imported_samples.append({"brand": brand["name"], "barcode": primary_bc, "title": title})
            continue

        # Medium-confidence: no barcode → check by title
        if not title:
            continue
        cat_tokens = _normalize_title_tokens(title, brand["name"])
        if not cat_tokens:
            continue
        is_in_db = False
        for db_title in db_titles:
            db_tokens = _normalize_title_tokens(db_title, brand["name"])
            if not db_tokens:
                continue
            overlap = len(cat_tokens & db_tokens)
            if overlap >= max(2, int(len(cat_tokens) * 0.6)):
                is_in_db = True
                break
        if is_in_db:
            stats["low_match"] += 1
            continue
        stats["new"] += 1
        stats["queued"] += 1
        if len(queued_samples) < 50:
            queued_samples.append({"brand": brand["name"], "barcodes": [], "title": title})
        # Persist the queued candidate so admins can review/approve it via the
        # CMS instead of losing it to an in-memory sample list. Idempotent:
        # the same brand+title pair upserts onto the existing row, refreshing
        # last_seen_at and incrementing seen_count.
        try:
            queue_key = {
                "brand": brand["name"],
                "title_key": _strip_accents(title.lower())[:200],
            }
            queue_update = {
                "$set": {
                    "brand": brand["name"],
                    "title": title,
                    "image": _entry_image(entry),
                    "source_url": _entry_source_url(entry),
                    "categories": {"Category_1": c1, "Category_2": c2, "Category_3": c3},
                    "last_seen_at": now,
                    "last_seen_in_run": EVALUATOR,
                },
                "$setOnInsert": {
                    "first_seen_at": now,
                    "status": "pending",
                    "title_key": queue_key["title_key"],
                },
                "$inc": {"seen_count": 1},
            }
            db.pending_brand_imports.update_one(queue_key, queue_update, upsert=True)
        except Exception as queue_exc:
            print(f"  queue persist failed for {brand['name']}/{title[:40]}: {queue_exc}")

    if ops and not dry_run:
        # Use unordered bulk_write and inspect upserted_count to distinguish
        # actual inserts from no-op upserts ($setOnInsert hits where the doc
        # already existed). Without this, stats["imported"] reports the
        # candidate count rather than the truly-new count.
        inserted_total = 0
        for i in range(0, len(ops), 500):
            try:
                result = db.products.bulk_write(ops[i:i + 500], ordered=False)
                inserted_total += int(getattr(result, "upserted_count", 0) or 0)
            except Exception as exc:
                print(f"  bulk_write error for {brand['name']}: {exc}")
        # imported counter above represents candidates fed to the bulk op;
        # split it into actually-inserted and noop_existing.
        imported_candidates = stats.get("imported", 0)
        stats["imported"] = inserted_total
        stats["noop_existing"] = max(0, imported_candidates - inserted_total)
    # In dry-run we keep stats["imported"] as the would-import count for visibility.
    stats["dry_run"] = dry_run

    return {**stats, "imported_samples": imported_samples, "queued_samples": queued_samples}


def main() -> int:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Don't write to DB; just report what would happen")
    parser.add_argument("--no-refresh", action="store_true", help="Use cached catalogs instead of fetching from source")
    parser.add_argument("--brand", default="", help="Only sync this brand (e.g. 'apivita')")
    args = parser.parse_args()
    mongo_user = os.getenv("MONGO_USER")
    mongo_pw = os.getenv("MONGO_PASSWORD")
    mongo_host = os.getenv("MONGO_HOST", "mongodb")
    mongo_port = int(os.getenv("MONGO_PORT", "27017"))
    mongo_db = os.getenv("MONGO_DB", "imageDB")

    client = MongoClient(f"mongodb://{mongo_user}:{mongo_pw}@{mongo_host}:{mongo_port}")
    db = client[mongo_db]

    if args.no_refresh:
        for b in BRAND_REGISTRY:
            b["refresh_module"] = None
            b["refresh_callable"] = None

    overall: List[Dict[str, Any]] = []
    total_imported = 0
    total_queued = 0
    total_enriched = 0
    try:
        for brand in BRAND_REGISTRY:
            if args.brand and brand["name"] != args.brand.lower():
                continue
            try:
                result = _sync_brand(db, brand, dry_run=args.dry_run)
            except Exception as exc:
                print(f"  ERROR for {brand['name']}: {exc}")
                result = {"brand": brand["name"], "status": "error", "error": str(exc),
                          "examined": 0, "new": 0, "queued": 0, "imported": 0}
            overall.append(result)
            total_imported += int(result.get("imported", 0))
            total_queued += int(result.get("queued", 0))
            total_enriched += int(result.get("enriched", 0))

        summary = {
            "run_at": _utcnow(),
            "brands": overall,
            "totals": {
                "imported": total_imported,
                "queued": total_queued,
                "enriched": total_enriched,
            },
        }
        report_path = "/app/brand_sync_last_run.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        print(json.dumps(summary["totals"]))

        # Post a dashboard notification if there's anything actionable (skip in dry-run)
        if not args.dry_run and (total_imported > 0 or total_queued > 0):
            db.cms_notification_events.insert_one({
                "item_id": "",
                "category_id": "",
                "event_type": "brand_sync_completed",
                "status": "pending",
                "payload": {
                    "imported": total_imported,
                    "queued": total_queued,
                    "brands": [
                        {"name": b["brand"], "status": b.get("status"),
                         "imported": b.get("imported", 0), "queued": b.get("queued", 0)}
                        for b in overall
                    ],
                    "run_at": summary["run_at"],
                    "report_path": report_path,
                },
                "created_at": summary["run_at"],
                "published_at": None,
            })
    finally:
        client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
