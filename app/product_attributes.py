"""Product attribute schema, validation, and helpers.

The product attribute block sits under `attributes` in db.products and
captures e-shop-ready data customers need to import a product into
their own catalog: weight, dimensions, VAT rate, MPN, package size,
ingredients.

Every attribute is paired with provenance ({field}_source) and confidence
({field}_confidence) so admins know which fields came from a trusted
manufacturer feed vs an estimate vs manual entry.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple


# Confidence levels
CONF_VERIFIED = "verified"     # from manufacturer catalog / admin manual approval
CONF_ESTIMATED = "estimated"   # heuristic from title regex + category profile
CONF_MISSING = "missing"       # unknown

# Source tags
SRC_MANUFACTURER = "manufacturer"
SRC_SKROUTZ = "skroutz"
SRC_FARMAKOPOIOSMOU = "farmakopoiosmou"
SRC_VITA4YOU = "vita4you"
SRC_PHARM16 = "pharm16"
SRC_ESTIMATED = "estimated"
SRC_MANUAL = "manual"

# Greek VAT rates that apply to pharmacy/cosmetics SKUs
VAT_RATES = (6, 13, 24)

# Volumetric divisor for shipping companies (5000 = air, 4000 = road)
DEFAULT_VOLUMETRIC_DIVISOR = 5000

# Site-ready requires this minimum set. Catalog quality already requires
# title/description/image/category — these are additive on top.
SITE_READY_REQUIRED = ("weight_kg", "vat_rate", "retail_price")


_SIZE_RE = re.compile(
    r"\b(\d+[.,]?\d*)\s?(ml|mL|ML|gr|g|GR|mg|MG|caps|tabs|τεμ|τμχ|x\d+)\b",
    re.UNICODE,
)


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def extract_package_size_from_title(title: str) -> str:
    """Return the first size token found in the title (e.g. '50ml', '30 caps')."""
    match = _SIZE_RE.search(title or "")
    if not match:
        return ""
    qty = match.group(1).replace(",", ".")
    unit = match.group(2).lower()
    return f"{qty}{unit}"


def parse_size_tuple(label: str) -> Tuple[float, str]:
    """Parse '50ml' -> (50.0, 'ml'). Returns (0.0, '') if not parseable."""
    if not label:
        return 0.0, ""
    match = re.match(r"^\s*(\d+[.,]?\d*)\s?([a-zA-Zτμχ]+)", label)
    if not match:
        return 0.0, ""
    try:
        return float(match.group(1).replace(",", ".")), match.group(2).lower()
    except (TypeError, ValueError):
        return 0.0, ""


# Heuristic weight profiles by Category_1 (Greek labels) and size.
# These are *estimates* and must always be flagged with CONF_ESTIMATED.
# Numbers are the assumed PACKAGED net weight in grams per ml/g of content.
# A 50ml cream → 50g content + ~70g packaging → ratio 2.4.
_CATEGORY_WEIGHT_MULT = {
    "ΟΜΟΡΦΙΑ": 1.8,
    "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ": 2.0,
    "ΦΡΟΝΤΙΔΑ ΜΑΛΛΙΩΝ": 1.5,
    "ΦΑΡΜΑΚΕΥΤΙΚΑ": 1.6,
    "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ": 1.2,
    "ΒΡΕΦΟΣ ΚΑΙ ΠΑΙΔΙ": 1.6,
    "ΜΗΤΕΡΑ & ΠΑΙΔΙ": 1.6,
    "ΣΤΟΜΑΤΙΚΗ ΥΓΙΕΙΝΗ": 1.5,
    "DEFAULT": 1.7,
}

# Heuristic dimensions in cm by category + container hint.
# Format: {category: (length, width, height)} for a "standard" 50ml package.
_CATEGORY_DIMS = {
    "ΟΜΟΡΦΙΑ": (16.0, 5.0, 4.0),
    "ΦΡΟΝΤΙΔΑ ΔΕΡΜΑΤΟΣ": (16.0, 5.0, 4.0),
    "ΦΡΟΝΤΙΔΑ ΜΑΛΛΙΩΝ": (20.0, 6.0, 5.0),
    "ΣΥΜΠΛΗΡΩΜΑΤΑ ΔΙΑΤΡΟΦΗΣ": (12.0, 6.0, 6.0),
    "DEFAULT": (15.0, 6.0, 5.0),
}


def estimate_weight_kg(title: str, category_1: str) -> Optional[float]:
    """Return an estimated package weight in kg, or None if size unknown."""
    label = extract_package_size_from_title(title)
    qty, unit = parse_size_tuple(label)
    if qty <= 0:
        return None
    if unit in ("ml", "g", "gr"):
        # ml → assume density ~1 g/ml for cosmetics (rough)
        content_g = qty
    elif unit == "mg":
        content_g = qty / 1000.0
    elif unit in ("caps", "tabs"):
        content_g = qty * 0.5  # ~0.5g per cap/tab
    else:
        return None
    multiplier = _CATEGORY_WEIGHT_MULT.get(str(category_1 or "").upper(), _CATEGORY_WEIGHT_MULT["DEFAULT"])
    grams = content_g * multiplier + 30  # +30g base packaging
    return round(grams / 1000.0, 3)


def estimate_dimensions_cm(category_1: str) -> Optional[Dict[str, float]]:
    dims = _CATEGORY_DIMS.get(str(category_1 or "").upper(), _CATEGORY_DIMS["DEFAULT"])
    return {"length_cm": dims[0], "width_cm": dims[1], "height_cm": dims[2]}


def compute_volumetric_weight_kg(
    length_cm: float, width_cm: float, height_cm: float,
    *, divisor: int = DEFAULT_VOLUMETRIC_DIVISOR,
) -> float:
    if not (length_cm and width_cm and height_cm):
        return 0.0
    return round((length_cm * width_cm * height_cm) / divisor / 1000.0, 3)


def estimate_vat_rate(category_1: str, title: str) -> Optional[int]:
    """Pharmaceutical products: 6%. Baby products: 13%. Cosmetics: 24%."""
    cat = str(category_1 or "").upper()
    title_upper = str(title or "").upper()
    pharma_keywords = ("ΦΑΡΜΑΚ", "MEDICINE", "ΑΝΑΛΓ", "ΦΥΣΙΟΛΟΓ")
    baby_keywords = ("ΒΡΕΦ", "ΠΑΝΑ", "DIAPER", "ΠΑΙΔ")
    if "ΦΑΡΜΑΚΕΥΤΙΚΑ" in cat or any(k in title_upper for k in pharma_keywords):
        return 6
    if "ΒΡΕΦΟΣ" in cat or "ΜΗΤΕΡΑ" in cat or any(k in title_upper for k in baby_keywords):
        return 13
    return 24


def build_attributes_block(
    doc: Dict[str, Any],
    *,
    existing_attributes: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Compose the `attributes` sub-document from whatever signals are
    present. Existing values that came from trusted sources (manufacturer
    or manual) are preserved; only missing/estimated fields are refreshed.
    """
    existing = dict(existing_attributes or {})
    title = str(doc.get("cms_title") or doc.get("Title") or "")
    category_1 = str(doc.get("Category_1") or "")

    package_size = (
        str(existing.get("package_size_label") or "").strip()
        or extract_package_size_from_title(title)
    )

    def keep_or_fill(field: str, value: Any, source_tag: str, confidence: str) -> None:
        if existing.get(f"{field}_confidence") in (CONF_VERIFIED,):
            return
        if value is None or value == "":
            return
        existing[field] = value
        existing[f"{field}_source"] = source_tag
        existing[f"{field}_confidence"] = confidence

    if package_size and existing.get("package_size_label") != package_size:
        existing["package_size_label"] = package_size
        existing.setdefault("package_size_source", SRC_ESTIMATED)
        existing.setdefault("package_size_confidence", CONF_ESTIMATED)

    if not existing.get("weight_kg"):
        est = estimate_weight_kg(title, category_1)
        if est is not None:
            keep_or_fill("weight_kg", est, SRC_ESTIMATED, CONF_ESTIMATED)

    if not (existing.get("length_cm") and existing.get("width_cm") and existing.get("height_cm")):
        dims = estimate_dimensions_cm(category_1)
        if dims:
            for k, v in dims.items():
                keep_or_fill(k, v, SRC_ESTIMATED, CONF_ESTIMATED)

    if existing.get("length_cm") and existing.get("width_cm") and existing.get("height_cm"):
        existing["volumetric_weight_kg"] = compute_volumetric_weight_kg(
            float(existing["length_cm"]), float(existing["width_cm"]), float(existing["height_cm"]),
        )

    if not existing.get("vat_rate"):
        vat = estimate_vat_rate(category_1, title)
        if vat:
            keep_or_fill("vat_rate", vat, SRC_ESTIMATED, CONF_ESTIMATED)

    if not existing.get("mpn"):
        mpn = str(doc.get("Site_Id") or doc.get("sku") or "").strip()
        if mpn:
            keep_or_fill("mpn", mpn, SRC_MANUFACTURER, CONF_VERIFIED)

    existing["updated_at"] = _utcnow_iso()
    return existing


def compute_pricing_summary(attributes: Dict[str, Any]) -> Dict[str, float]:
    """Compute derived pricing from retail_price / discount_percent / vat_rate.

    All input prices are treated as net (pre-VAT) wholesale and retail.
    Returns wholesale, retail, discount %, final consumer (after discount + VAT).
    """
    def _f(v):
        try:
            return float(v or 0)
        except (TypeError, ValueError):
            return 0.0
    wholesale = _f(attributes.get("wholesale_price"))
    retail = _f(attributes.get("retail_price"))
    discount = _f(attributes.get("discount_percent"))
    vat = _f(attributes.get("vat_rate"))

    margin_pct = 0.0
    if wholesale > 0 and retail > 0:
        margin_pct = round((retail - wholesale) / wholesale * 100, 2)
    after_discount = round(retail * (1 - discount / 100.0), 4) if retail else 0.0
    final_consumer = round(after_discount * (1 + vat / 100.0), 2) if after_discount else 0.0

    return {
        "wholesale_price": wholesale,
        "retail_price": retail,
        "discount_percent": discount,
        "vat_rate": vat,
        "margin_percent": margin_pct,
        "consumer_price_with_vat": final_consumer,
    }


def is_site_ready(attributes: Dict[str, Any]) -> bool:
    """Site-ready when all required fields are present *and* their confidence
    is verified or manually approved (estimates require admin sign-off).
    """
    if not attributes:
        return False
    for field in SITE_READY_REQUIRED:
        if not attributes.get(field):
            return False
        conf = attributes.get(f"{field}_confidence")
        if conf and conf != CONF_VERIFIED:
            return False
    return True
