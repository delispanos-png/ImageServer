from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from typing import Any, Dict, List


DEFAULT_NO_SITE_CATEGORY = "ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ > ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ > ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ"
DEFAULT_SHOPFLIX_CATEGORY = "ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ"
DEFAULT_IMAGE_SERVICE = {
    "enabled": True,
}
DEFAULT_XML_SERVICE = {
    "enabled": False,
    "domain": "",
    "solution_type": "",
    "function_name": "",
    "company": "",
    "whouse": "E-Shop",
    "api_key": "",
    "site_xml": "",
    "old_id_field": "",
    "product_url_base": "",
    "image_url_base": "https://image.cloudon.gr/photos",
    "photo_root": "/app/images",
    "default_category": DEFAULT_NO_SITE_CATEGORY,
    "shopflix_category": DEFAULT_SHOPFLIX_CATEGORY,
    "softone_distribution_channels": "",
    "require_web_item": True,
}
DEFAULT_CLIENT_SERVICES = {
    "image_service": DEFAULT_IMAGE_SERVICE,
    "xml_service": DEFAULT_XML_SERVICE,
}
LEGACY_XML_SERVICE_CLIENTS: List[Dict[str, Any]] = [
    {
        "name": "youpharmacy",
        "company": "youpharmacy",
        "services": {
            "image_service": {"enabled": True},
            "xml_service": {
                "enabled": True,
                "domain": "youpharmacy",
                "solution_type": "site",
                "company": "1001",
                "whouse": "E-Shop",
                "api_key": "cGhhcm1hY3lvbmU6D0I2OUIzQkYwMjAzMkM0MkU2MzZFNDI4ODkyMzFFOEQwQjBENzdEM0M5OERDMDJEOUMzNURBRDUzMzVGRjI3MTk=",
                "site_xml": "https://www.youpharmacy.gr/wp-content/uploads/wpallexport/exports/e31365bf49ce8a66b4c968433b08a0c2/current-CRON-Cloudon-Export.xml?wpae_nocache=780919191",
                "old_id_field": "num05",
            },
        },
    },
    {
        "name": "tsitoura",
        "company": "tsitoura",
        "services": {
            "image_service": {"enabled": True},
            "xml_service": {
                "enabled": True,
                "domain": "tsitoura",
                "solution_type": "no_site",
                "company": "1001",
                "whouse": "E-Shop",
                "api_key": "cGhhcm1hY3lvbmU6MjAyMEAjQ2xvdWRPbg==",
                "old_id_field": "barcode",
                "product_url_base": "https://swh.cloudon.gr",
                "image_url_base": "https://image.cloudon.gr/photos",
                "photo_root": "/app/images",
                "default_category": DEFAULT_NO_SITE_CATEGORY,
                "shopflix_category": DEFAULT_SHOPFLIX_CATEGORY,
                "softone_distribution_channels": "skroutz,shopflix",
                "require_web_item": False,
            },
        },
    },
]


def _normalized_text(value: Any, default: str = "") -> str:
    return str(value if value is not None else default).strip()


def _normalized_bool(value: Any, default: bool = False) -> bool:
    if value is None:
        return default
    return bool(value)


def _normalize_solution_type(value: Any) -> str:
    normalized = _normalized_text(value).lower()
    if normalized in {"site", "no_site"}:
        return normalized
    return ""


def _derive_solution_type(raw_xml: Dict[str, Any], enabled: bool) -> str:
    solution_type = _normalize_solution_type(raw_xml.get("solution_type", ""))
    if solution_type:
        return solution_type

    function_name = _normalized_text(raw_xml.get("function_name", "")).lower()
    if function_name == "fast":
        return "no_site"
    if function_name in {"universal", "woocommerce"}:
        return "site"
    return "site" if enabled else ""


def normalize_client_services(raw_services: Any) -> Dict[str, Dict[str, Any]]:
    services = deepcopy(DEFAULT_CLIENT_SERVICES)
    if not isinstance(raw_services, dict):
        return services

    raw_image = raw_services.get("image_service", {})
    if isinstance(raw_image, dict):
        services["image_service"]["enabled"] = _normalized_bool(raw_image.get("enabled"), True)

    raw_xml = raw_services.get("xml_service", {})
    if isinstance(raw_xml, dict):
        enabled = _normalized_bool(raw_xml.get("enabled"), False)
        solution_type = _derive_solution_type(raw_xml, enabled)
        function_name = ""
        old_id_field = _normalized_text(raw_xml.get("old_id_field", ""))
        softone_distribution_channels = _normalized_text(raw_xml.get("softone_distribution_channels", ""))
        require_web_item = raw_xml.get("require_web_item")

        if solution_type == "site":
            function_name = "universal"
            if not old_id_field:
                old_id_field = "num05"
            if not softone_distribution_channels:
                softone_distribution_channels = "skroutz"
            if require_web_item is None:
                require_web_item = True
        elif solution_type == "no_site":
            function_name = "fast"
            if not old_id_field:
                old_id_field = "barcode"
            if not softone_distribution_channels:
                softone_distribution_channels = "skroutz,shopflix"
            if require_web_item is None:
                require_web_item = False

        services["xml_service"].update(
            {
                "enabled": enabled,
                "domain": _normalized_text(raw_xml.get("domain", "")),
                "solution_type": solution_type,
                "function_name": function_name,
                "company": _normalized_text(raw_xml.get("company", "")),
                "whouse": _normalized_text(raw_xml.get("whouse", "E-Shop")) or "E-Shop",
                "api_key": _normalized_text(raw_xml.get("api_key", "")),
                "site_xml": _normalized_text(raw_xml.get("site_xml", "")),
                "old_id_field": old_id_field,
                "product_url_base": _normalized_text(raw_xml.get("product_url_base", "")),
                "image_url_base": _normalized_text(raw_xml.get("image_url_base", DEFAULT_XML_SERVICE["image_url_base"]))
                or DEFAULT_XML_SERVICE["image_url_base"],
                "photo_root": _normalized_text(raw_xml.get("photo_root", DEFAULT_XML_SERVICE["photo_root"]))
                or DEFAULT_XML_SERVICE["photo_root"],
                "default_category": _normalized_text(
                    raw_xml.get("default_category", DEFAULT_NO_SITE_CATEGORY)
                )
                or DEFAULT_NO_SITE_CATEGORY,
                "shopflix_category": _normalized_text(
                    raw_xml.get("shopflix_category", DEFAULT_SHOPFLIX_CATEGORY)
                )
                or DEFAULT_SHOPFLIX_CATEGORY,
                "softone_distribution_channels": softone_distribution_channels,
                "require_web_item": _normalized_bool(require_web_item, True),
            }
        )

    return services


def validate_client_services(services: Dict[str, Dict[str, Any]]) -> List[str]:
    xml_service = normalize_client_services(services).get("xml_service", {})
    if not xml_service.get("enabled"):
        return []

    errors: List[str] = []
    if not _normalized_text(xml_service.get("domain", "")):
        errors.append("XML domain is required when XML service is enabled")
    if _normalize_solution_type(xml_service.get("solution_type", "")) not in {"site", "no_site"}:
        errors.append("XML solution type must be site or no_site")
    if not _normalized_text(xml_service.get("company", "")):
        errors.append("XML company is required when XML service is enabled")
    if not _normalized_text(xml_service.get("whouse", "")):
        errors.append("XML warehouse is required when XML service is enabled")
    if not _normalized_text(xml_service.get("api_key", "")):
        errors.append("XML SoftOne API key is required when XML service is enabled")

    if xml_service.get("solution_type") == "site":
        if not _normalized_text(xml_service.get("site_xml", "")):
            errors.append("Site XML URL is required for site XML clients")
    elif xml_service.get("solution_type") == "no_site":
        if not _normalized_text(xml_service.get("product_url_base", "")):
            errors.append("Product URL base is required for no-site XML clients")
        if not _normalized_text(xml_service.get("image_url_base", "")):
            errors.append("Image URL base is required for no-site XML clients")
        if not _normalized_text(xml_service.get("photo_root", "")):
            errors.append("Photo root is required for no-site XML clients")

    return errors


def build_xml_service_summary(doc: Dict[str, Any]) -> Dict[str, Any] | None:
    services = normalize_client_services(doc.get("services", {}))
    xml_service = services["xml_service"]
    if not xml_service.get("enabled") or not xml_service.get("domain"):
        return None
    return {
        "client_id": str(doc.get("_id", "")),
        "client_name": _normalized_text(doc.get("name", "")),
        "domain": xml_service["domain"],
        "company": xml_service["company"],
        "function_name": xml_service["function_name"],
        "solution_type": xml_service["solution_type"],
    }


def build_xml_generator_client_config(doc: Dict[str, Any]) -> Dict[str, Any] | None:
    services = normalize_client_services(doc.get("services", {}))
    xml_service = services["xml_service"]
    if not xml_service.get("enabled") or not xml_service.get("domain"):
        return None

    config: Dict[str, Any] = {
        "domain": xml_service["domain"],
        "company": xml_service["company"],
        "whouse": xml_service["whouse"],
        "api_key": xml_service["api_key"],
        "function": xml_service["function_name"],
        "solution_type": xml_service["solution_type"],
        "softone_distribution_channels": xml_service["softone_distribution_channels"],
        "require_web_item": bool(xml_service["require_web_item"]),
        "xml_parameters": {
            "old_id_field": xml_service["old_id_field"],
        },
    }
    if xml_service["solution_type"] == "site":
        config["site_xml"] = xml_service["site_xml"]
    elif xml_service["solution_type"] == "no_site":
        config.update(
            {
                "product_url_base": xml_service["product_url_base"],
                "image_url_base": xml_service["image_url_base"],
                "photo_root": xml_service["photo_root"],
                "default_category": xml_service["default_category"],
                "shopflix_category": xml_service["shopflix_category"],
            }
        )
    return config


async def load_xml_service_clients(db) -> List[Dict[str, Any]]:
    docs = await db.cms_clients.find({}, {"name": 1, "services": 1}).to_list(length=None)
    rows = []
    for doc in docs:
        summary = build_xml_service_summary(doc)
        if summary:
            rows.append(summary)
    rows.sort(key=lambda row: (str(row.get("domain", "")).lower(), str(row.get("client_name", "")).lower()))
    return rows


async def load_xml_generator_client_configs(db, requested_domains: List[str] | None = None) -> List[Dict[str, Any]]:
    requested_domain_set = {str(domain).strip() for domain in (requested_domains or []) if str(domain).strip()}
    docs = await db.cms_clients.find({}, {"services": 1}).to_list(length=None)
    rows: List[Dict[str, Any]] = []
    for doc in docs:
        config = build_xml_generator_client_config(doc)
        if not config:
            continue
        if requested_domain_set and str(config.get("domain", "")).strip() not in requested_domain_set:
            continue
        rows.append(config)
    rows.sort(key=lambda row: str(row.get("domain", "")).lower())
    return rows


async def sync_legacy_xml_clients_to_cms(db) -> None:
    now = datetime.now(timezone.utc)
    for legacy_client in LEGACY_XML_SERVICE_CLIENTS:
        legacy_services = normalize_client_services(legacy_client.get("services", {}))
        xml_domain = str(legacy_services["xml_service"]["domain"]).strip()
        if not xml_domain:
            continue

        existing = await db.cms_clients.find_one({"services.xml_service.domain": xml_domain})
        if existing:
            continue

        fallback = await db.cms_clients.find_one(
            {
                "$or": [
                    {"name": legacy_client.get("name", "")},
                    {"company": legacy_client.get("company", "")},
                    {"api_domain": xml_domain},
                ]
            }
        )

        if fallback:
            merged_services = normalize_client_services(fallback.get("services", {}))
            merged_services["xml_service"] = legacy_services["xml_service"]
            await db.cms_clients.update_one(
                {"_id": fallback["_id"]},
                {
                    "$set": {
                        "services": merged_services,
                        "updated_at": now,
                        "updated_by": "system:legacy_xml_client_sync",
                    }
                },
            )
            continue

        await db.cms_clients.insert_one(
            {
                "name": legacy_client.get("name", xml_domain),
                "email": "",
                "phone": "",
                "company": legacy_client.get("company", xml_domain),
                "is_active": True,
                "receive_all_categories": False,
                "notes": "Auto-synced from legacy XML client configuration.",
                "category_ids": [],
                "services": legacy_services,
                "created_by": "system:legacy_xml_client_sync",
                "updated_by": "system:legacy_xml_client_sync",
                "created_at": now,
                "updated_at": now,
            }
        )
