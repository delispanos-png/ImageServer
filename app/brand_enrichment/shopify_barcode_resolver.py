"""Resolve missing barcodes for Shopify-format brand catalogs.

The public Shopify `/products.json` bulk feed returns variants where
`barcode` is null. The per-product endpoint `/products/{handle}.json`
exposes the real barcode. This module enriches an existing brand catalog
by fetching each product page once and writing the barcode back.

Idempotent: only fetches entries that don't already have a top-level gtin.
Caches the enriched catalog back to its original path so the daily brand
sync can match by barcode the next morning.

Use:
  python3 -m brand_enrichment.shopify_barcode_resolver --catalog-path /app/brand_catalog_korres.json --base-url https://www.korres.com
"""
from __future__ import annotations

import argparse
import json
import subprocess
import time
from pathlib import Path
from typing import Dict, List, Optional


USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def _fetch_product_json(base_url: str, handle: str) -> Optional[Dict]:
    url = f"{base_url.rstrip('/')}/products/{handle}.json"
    completed = subprocess.run(
        ["curl", "-s", "-L", "-H", f"User-Agent: {USER_AGENT}", "--max-time", "15", url],
        capture_output=True, check=False, timeout=20,
    )
    if completed.returncode != 0 or not completed.stdout:
        return None
    try:
        return json.loads(completed.stdout.decode("utf-8", "ignore"))
    except Exception:
        return None


def _extract_barcode(product_json: Dict) -> str:
    variants = (product_json.get("product") or {}).get("variants") or []
    for variant in variants:
        bc = str(variant.get("barcode") or "").strip()
        if bc and bc.isdigit():
            return bc
    return ""


def _extract_weight_kg(product_json: Dict) -> float:
    """Shopify variants expose 'grams'. Return weight in kg or 0 if unknown."""
    variants = (product_json.get("product") or {}).get("variants") or []
    for variant in variants:
        grams = variant.get("grams")
        try:
            grams_f = float(grams or 0)
        except (TypeError, ValueError):
            continue
        if grams_f > 0:
            return round(grams_f / 1000.0, 3)
    return 0.0


def enrich_catalog(catalog_path: Path, base_url: str, *, delay: float = 0.3) -> Dict[str, int]:
    items = json.loads(catalog_path.read_text(encoding="utf-8"))
    stats = {"total": len(items), "already_has_gtin": 0, "fetched": 0,
             "found_barcode": 0, "no_barcode": 0, "fetch_failed": 0}

    for i, entry in enumerate(items):
        if not isinstance(entry, dict):
            continue
        if entry.get("gtin"):
            stats["already_has_gtin"] += 1
            continue
        handle = str(entry.get("handle") or "").strip()
        if not handle:
            continue

        data = _fetch_product_json(base_url, handle)
        stats["fetched"] += 1
        if data is None:
            stats["fetch_failed"] += 1
            time.sleep(delay)
            continue

        barcode = _extract_barcode(data)
        if barcode:
            entry["gtin"] = barcode
            stats["found_barcode"] += 1
        else:
            stats["no_barcode"] += 1
        weight_kg = _extract_weight_kg(data)
        if weight_kg > 0:
            entry["weight_kg"] = weight_kg
            stats["found_weight"] = stats.get("found_weight", 0) + 1
        if (i + 1) % 25 == 0:
            print(f"  {catalog_path.stem}: {i+1}/{len(items)} found={stats['found_barcode']}", flush=True)
        time.sleep(delay)

    # Write enriched catalog back in place.
    catalog_path.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    return stats


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog-path", required=True)
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--delay", type=float, default=0.3)
    args = parser.parse_args()

    stats = enrich_catalog(Path(args.catalog_path), args.base_url, delay=args.delay)
    print(json.dumps(stats, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
