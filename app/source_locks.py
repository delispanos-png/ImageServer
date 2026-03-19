from __future__ import annotations

from typing import Any, Dict
from urllib.parse import urlparse


PHARMACY295_LOCK_SOURCE = "pharmacy295_excel"
YOUPHARMACY_XML_LOCK_SOURCE = "youpharmacy_xml"
MANUAL_UPLOAD_LOCK_SOURCE = "manual_upload"
PHARMACY295_REPLACE_PROCESSING_VERSION = "pharmacy295_excel_replace_v1"
YOUPHARMACY_XML_REPLACE_PROCESSING_VERSION = "youpharmacy_xml_replace_v1"
MANUAL_UPLOAD_PROCESSING_VERSION = "manual_upload_v1"
TRUSTED_PHOTO_PROTECTED_TOP_LEVEL_FIELDS = {
    "Img_src",
    "Img_src_List",
    "Image_Path",
    "Image_Path_Collection",
    "Product_Link",
    "Site",
    "Site_Id",
    "last_source",
    "image_source_domain",
}
PHARMACY295_PROTECTED_TOP_LEVEL_FIELDS = TRUSTED_PHOTO_PROTECTED_TOP_LEVEL_FIELDS


def normalize_source_name(*candidates: Any) -> str:
    for candidate in candidates:
        raw_value = str(candidate or "").strip()
        if not raw_value:
            continue

        normalized = raw_value.lower()
        parsed = urlparse(raw_value if "://" in raw_value else f"https://{raw_value}")
        host = parsed.netloc.lower()
        path = parsed.path.lower()
        combined = " ".join(filter(None, [normalized, host, path]))

        if "pharmacy295" in combined:
            return "pharmacy295"
        if "youpharmacy" in combined:
            return "youpharmacy"
        if "gohealthy" in combined:
            return "gohealthy"
        if "manual_upload" in combined or "manual upload" in combined:
            return "manual_upload"
        if "kpdhellas" in combined:
            return "kpdhellas"
        if "cure4u" in combined:
            return "cure4u"
        if "ofarmakopoiosmou" in combined or "farmakopoiosmou" in combined:
            return "farmakopoiosmou"
        if "vita4you" in combined:
            return "vita4you"
        if "boxpharmacy" in combined or "box pharmacy" in combined:
            return "boxpharmacy"
        if "tofarmakeiomou" in combined:
            return "tofarmakeiomou"
        if "pharm16" in combined:
            return "pharm16"
        if "skroutz" in combined:
            return "skroutz"

        if host:
            return host
        return normalized

    return ""


def _site_has_images(site_payload: Any) -> bool:
    if not isinstance(site_payload, dict):
        return False
    image_url = str(site_payload.get("Img_src", "")).strip()
    image_url_list = site_payload.get("Img_src_List", [])
    if image_url:
        return True
    if isinstance(image_url_list, list):
        return any(str(item or "").strip() for item in image_url_list)
    return False


def has_pharmacy295_excel_data(product: Dict[str, Any]) -> bool:
    if not isinstance(product, dict):
        return False
    other_sites = product.get("Other_Sites", {})
    if not isinstance(other_sites, dict):
        return False
    return _site_has_images(other_sites.get("pharmacy295_excel"))


def has_youpharmacy_xml_data(product: Dict[str, Any]) -> bool:
    if not isinstance(product, dict):
        return False
    other_sites = product.get("Other_Sites", {})
    if not isinstance(other_sites, dict):
        return False
    return _site_has_images(other_sites.get(YOUPHARMACY_XML_LOCK_SOURCE))


def is_pharmacy295_photo_locked(product: Dict[str, Any]) -> bool:
    if not isinstance(product, dict):
        return False

    if has_pharmacy295_excel_data(product):
        return True

    if bool(product.get("photo_source_locked")) and str(product.get("photo_source_lock", "")).strip() == PHARMACY295_LOCK_SOURCE:
        return True

    if normalize_source_name(
        product.get("image_source_domain", ""),
        product.get("Site", ""),
        product.get("last_source", ""),
        product.get("Img_src", ""),
        product.get("Product_Link", ""),
    ) == "pharmacy295":
        if str(product.get("Img_src", "")).strip():
            return True
        image_url_list = product.get("Img_src_List", [])
        if isinstance(image_url_list, list) and any(str(item or "").strip() for item in image_url_list):
            return True

    if str(product.get("image_processing_version", "")).strip() == PHARMACY295_REPLACE_PROCESSING_VERSION:
        return True

    return False


def is_youpharmacy_xml_photo_locked(product: Dict[str, Any]) -> bool:
    if not isinstance(product, dict):
        return False

    if has_youpharmacy_xml_data(product):
        return True

    if bool(product.get("photo_source_locked")) and str(product.get("photo_source_lock", "")).strip() == YOUPHARMACY_XML_LOCK_SOURCE:
        return True

    if normalize_source_name(
        product.get("image_source_domain", ""),
        product.get("Site", ""),
        product.get("last_source", ""),
        product.get("Img_src", ""),
        product.get("Product_Link", ""),
    ) == "youpharmacy":
        if str(product.get("Img_src", "")).strip():
            return True
        image_url_list = product.get("Img_src_List", [])
        if isinstance(image_url_list, list) and any(str(item or "").strip() for item in image_url_list):
            return True

    if str(product.get("image_processing_version", "")).strip() == YOUPHARMACY_XML_REPLACE_PROCESSING_VERSION:
        return True

    return False


def is_manual_upload_photo_locked(product: Dict[str, Any]) -> bool:
    if not isinstance(product, dict):
        return False

    if bool(product.get("photo_source_locked")) and str(product.get("photo_source_lock", "")).strip() == MANUAL_UPLOAD_LOCK_SOURCE:
        return True

    if normalize_source_name(
        product.get("image_source_domain", ""),
        product.get("Site", ""),
        product.get("last_source", ""),
        product.get("Img_src", ""),
        product.get("Product_Link", ""),
    ) == MANUAL_UPLOAD_LOCK_SOURCE:
        return True

    if str(product.get("image_processing_version", "")).strip() == MANUAL_UPLOAD_PROCESSING_VERSION:
        return True

    return False


def get_trusted_photo_lock_source(product: Dict[str, Any]) -> str:
    if is_manual_upload_photo_locked(product):
        return MANUAL_UPLOAD_LOCK_SOURCE
    if is_pharmacy295_photo_locked(product):
        return PHARMACY295_LOCK_SOURCE
    if is_youpharmacy_xml_photo_locked(product):
        return YOUPHARMACY_XML_LOCK_SOURCE
    return ""


def has_trusted_photo_lock(product: Dict[str, Any]) -> bool:
    return bool(get_trusted_photo_lock_source(product))


def should_preserve_trusted_photos(existing_product: Dict[str, Any], incoming_source: str) -> bool:
    return has_trusted_photo_lock(existing_product) and normalize_source_name(incoming_source) == "farmakopoiosmou"


def should_preserve_pharmacy295_photos(existing_product: Dict[str, Any], incoming_source: str) -> bool:
    return should_preserve_trusted_photos(existing_product, incoming_source)
