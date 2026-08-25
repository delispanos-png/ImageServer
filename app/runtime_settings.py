from __future__ import annotations

import json
import os
from copy import deepcopy
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse, urlunparse


SETTINGS_FILE = Path(os.getenv("CMS_RUNTIME_SETTINGS_FILE", "/app/runtime_settings.json"))

DEFAULT_SOURCE_SETTINGS: Dict[str, Dict[str, Any]] = {
    "farmakopoiosmou": {
        "enabled": True,
        "priority": 1,
        "text_priority": 1,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": False,
    },
    "pharmacy295": {
        "enabled": True,
        "priority": 2,
        "text_priority": 2,
        "image_priority": 1,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "youpharmacy": {
        "enabled": False,
        "priority": 5,
        "text_priority": 0,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "gohealthy": {
        "enabled": False,
        "priority": 6,
        "text_priority": 0,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "cure4u": {
        "enabled": False,
        "priority": 6,
        "text_priority": 0,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "kpdhellas": {
        "enabled": True,
        "priority": 8,
        "text_priority": 8,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": False,
    },
    "vita4you": {
        "enabled": False,
        "priority": 3,
        "text_priority": 3,
        "image_priority": 2,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": False,
    },
    "skroutz": {
        "enabled": False,
        "priority": 4,
        "text_priority": 4,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "boxpharmacy": {
        "enabled": False,
        "priority": 5,
        "text_priority": 0,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "tofarmakeiomou": {
        "enabled": False,
        "priority": 6,
        "text_priority": 4,
        "image_priority": 3,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "pharm16": {
        "enabled": False,
        "priority": 7,
        "text_priority": 0,
        "image_priority": 0,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
    "google_images": {
        "enabled": False,
        "priority": 99,
        "text_priority": 0,
        "image_priority": 5,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": False,
    },
    "newgenpharmacy": {
        "enabled": True,
        "priority": 4,
        "text_priority": 4,
        "image_priority": 4,
        "removed": False,
        "removed_at": "",
        "removed_by": "",
        "use_flaresolverr": True,
    },
}

DEFAULT_SETTINGS: Dict[str, Any] = {
    "proxy": {
        "enabled": False,
        "url": "",
        "username": "",
        "password": "",
        "updated_at": "",
        "updated_by": "",
    },
    "sources": deepcopy(DEFAULT_SOURCE_SETTINGS),
    "api": {
        "products_enabled": True,
        "products_internal_enabled": True,
        "endpoints": {
            "products": {
                "key": "products",
                "label": "/products",
                "path": "/products",
                "enabled": True,
                "public_only": True,
                "include_internal_fields": False,
                "allow_external_image_urls": False,
                "fields": [
                    "Title",
                    "Sml_Title",
                    "Description",
                    "Image_url",
                    "Weight",
                    "Brand",
                    "Category_1",
                    "Category_2",
                    "Category_3",
                ],
            },
            "products_internal": {
                "key": "products_internal",
                "label": "/products_internal",
                "path": "/products_internal",
                "enabled": True,
                "public_only": False,
                "include_internal_fields": True,
                "allow_external_image_urls": True,
                "fields": [
                    "Title",
                    "Sml_Title",
                    "Description",
                    "Image_url",
                    "Weight",
                    "Brand",
                    "Category_1",
                    "Category_2",
                    "Category_3",
                    "Site",
                    "Categ",
                    "Product_Link",
                    "Img_src",
                    "last_source",
                    "last_updated_at",
                ],
            },
        },
        "products_fields": [
            "Title",
            "Sml_Title",
            "Description",
            "Image_url",
            "Weight",
            "Brand",
            "Category_1",
            "Category_2",
            "Category_3",
        ],
        "products_internal_fields": [
            "Title",
            "Sml_Title",
            "Description",
            "Image_url",
            "Weight",
            "Brand",
            "Category_1",
            "Category_2",
            "Category_3",
            "Site",
            "Categ",
            "Product_Link",
            "Img_src",
            "last_source",
            "last_updated_at",
        ],
        "field_registry": [
            "Title",
            "Sml_Title",
            "Description",
            "Image_url",
            "Weight",
            "Brand",
            "Category_1",
            "Category_2",
            "Category_3",
            "Site",
            "Categ",
            "Product_Link",
            "Img_src",
            "last_source",
            "last_updated_at",
        ],
        "updated_at": "",
        "updated_by": "",
    },
    "mail": {
        "smtp_host": "",
        "smtp_port": 587,
        "smtp_user": "",
        "smtp_password": "",
        "smtp_from": "",
        "starttls": True,
        "updated_at": "",
        "updated_by": "",
    },
    "image_processing": {
        "watermark_cleanup_enabled": False,
        "updated_at": "",
        "updated_by": "",
    },
    "xml": {
        "enabled": False,
        "service_url": "http://xml_generator",
        "public_base_url": "/api/xml_generator",
        "clients": {},
        "updated_at": "",
        "updated_by": "",
    },
}


def _normalize_xml_client_settings(raw_clients: Any) -> Dict[str, Dict[str, Any]]:
    normalized: Dict[str, Dict[str, Any]] = {}
    if not isinstance(raw_clients, dict):
        return normalized

    for domain, values in raw_clients.items():
        normalized_domain = str(domain or "").strip()
        if not normalized_domain or not isinstance(values, dict):
            continue
        normalized[normalized_domain] = {
            "enabled": bool(values.get("enabled", True)),
            "updated_at": str(values.get("updated_at", "")).strip(),
            "updated_by": str(values.get("updated_by", "")).strip(),
        }
    return normalized


def _merged_settings(raw: Dict[str, Any] | None) -> Dict[str, Any]:
    settings = deepcopy(DEFAULT_SETTINGS)
    raw = raw or {}
    proxy = raw.get("proxy", {})
    if isinstance(proxy, dict):
        settings["proxy"].update(
            {
                "enabled": bool(proxy.get("enabled", False)),
                "url": str(proxy.get("url", "")).strip(),
                "username": str(proxy.get("username", "")).strip(),
                "password": str(proxy.get("password", "")).strip(),
                "updated_at": str(proxy.get("updated_at", "")).strip(),
                "updated_by": str(proxy.get("updated_by", "")).strip(),
            }
        )

    raw_sources = raw.get("sources", {})
    if isinstance(raw_sources, dict):
        for source_key, defaults in DEFAULT_SOURCE_SETTINGS.items():
            source_raw = raw_sources.get(source_key, {})
            if not isinstance(source_raw, dict):
                continue
            try:
                priority = int(source_raw.get("priority", defaults["priority"]))
            except (TypeError, ValueError):
                priority = int(defaults["priority"])
            if priority < 1:
                priority = int(defaults["priority"])
            try:
                text_priority = int(source_raw.get("text_priority", defaults.get("text_priority", 0)))
            except (TypeError, ValueError):
                text_priority = int(defaults.get("text_priority", 0))
            if text_priority < 0:
                text_priority = int(defaults.get("text_priority", 0))
            try:
                image_priority = int(source_raw.get("image_priority", defaults.get("image_priority", 0)))
            except (TypeError, ValueError):
                image_priority = int(defaults.get("image_priority", 0))
            if image_priority < 0:
                image_priority = int(defaults.get("image_priority", 0))
            settings["sources"][source_key].update(
                {
                    "enabled": bool(source_raw.get("enabled", defaults["enabled"])),
                    "priority": priority,
                    "text_priority": text_priority,
                    "image_priority": image_priority,
                    "removed": bool(source_raw.get("removed", defaults.get("removed", False))),
                    "removed_at": str(source_raw.get("removed_at", defaults.get("removed_at", ""))).strip(),
                    "removed_by": str(source_raw.get("removed_by", defaults.get("removed_by", ""))).strip(),
                }
            )

    def _normalize_api_fields(raw_fields: Any, fallback: list[str]) -> list[str]:
        if not isinstance(raw_fields, list):
            return list(fallback)
        normalized: list[str] = []
        for value in raw_fields:
            field = str(value or "").strip()
            if field and field not in normalized:
                normalized.append(field)
        return normalized or list(fallback)

    raw_api = raw.get("api", {})
    if isinstance(raw_api, dict):
        default_api = DEFAULT_SETTINGS["api"]
        products_fields = _normalize_api_fields(raw_api.get("products_fields"), default_api["products_fields"])
        products_internal_fields = _normalize_api_fields(
            raw_api.get("products_internal_fields"),
            default_api["products_internal_fields"],
        )
        field_registry = _normalize_api_fields(raw_api.get("field_registry"), default_api["field_registry"])
        for field in products_fields + products_internal_fields:
            if field not in field_registry:
                field_registry.append(field)
        raw_endpoints = raw_api.get("endpoints", {})
        endpoints: Dict[str, Dict[str, Any]] = {}
        default_endpoints = default_api.get("endpoints", {})
        if isinstance(raw_endpoints, dict):
            for key, values in raw_endpoints.items():
                endpoint_key = str(key or "").strip()
                if not endpoint_key or not isinstance(values, dict):
                    continue
                fields = _normalize_api_fields(values.get("fields", []), [])
                endpoints[endpoint_key] = {
                    "key": endpoint_key,
                    "label": str(values.get("label", f"/products/{endpoint_key}")).strip() or f"/products/{endpoint_key}",
                    "path": str(values.get("path", f"/products/{endpoint_key}")).strip() or f"/products/{endpoint_key}",
                    "enabled": bool(values.get("enabled", True)),
                    "public_only": bool(values.get("public_only", True)),
                    "include_internal_fields": bool(values.get("include_internal_fields", False)),
                    "allow_external_image_urls": bool(values.get("allow_external_image_urls", False)),
                    "fields": fields,
                }
                for field in fields:
                    if field not in field_registry:
                        field_registry.append(field)
        if isinstance(default_endpoints, dict):
            for key, values in default_endpoints.items():
                if key in endpoints:
                    continue
                endpoints[key] = deepcopy(values)
        products_endpoint = endpoints.get("products")
        products_internal_endpoint = endpoints.get("products_internal")
        settings["api"].update(
            {
                "products_enabled": bool(
                    products_endpoint.get("enabled")
                    if isinstance(products_endpoint, dict)
                    else raw_api.get("products_enabled", True)
                ),
                "products_internal_enabled": bool(
                    products_internal_endpoint.get("enabled")
                    if isinstance(products_internal_endpoint, dict)
                    else raw_api.get("products_internal_enabled", True)
                ),
                "endpoints": endpoints,
                "products_fields": products_fields,
                "products_internal_fields": products_internal_fields,
                "field_registry": field_registry,
                "updated_at": str(raw_api.get("updated_at", "")).strip(),
                "updated_by": str(raw_api.get("updated_by", "")).strip(),
            }
        )

    raw_mail = raw.get("mail", {})
    if isinstance(raw_mail, dict):
        try:
            smtp_port = int(raw_mail.get("smtp_port", 587))
        except (TypeError, ValueError):
            smtp_port = 587
        settings["mail"].update(
            {
                "smtp_host": str(raw_mail.get("smtp_host", "")).strip(),
                "smtp_port": smtp_port,
                "smtp_user": str(raw_mail.get("smtp_user", "")).strip(),
                "smtp_password": str(raw_mail.get("smtp_password", "")).strip(),
                "smtp_from": str(raw_mail.get("smtp_from", "")).strip(),
                "starttls": bool(raw_mail.get("starttls", True)),
                "updated_at": str(raw_mail.get("updated_at", "")).strip(),
                "updated_by": str(raw_mail.get("updated_by", "")).strip(),
            }
        )

    raw_image_processing = raw.get("image_processing", {})
    if isinstance(raw_image_processing, dict):
        settings["image_processing"].update(
            {
                "watermark_cleanup_enabled": bool(raw_image_processing.get("watermark_cleanup_enabled", False)),
                "updated_at": str(raw_image_processing.get("updated_at", "")).strip(),
                "updated_by": str(raw_image_processing.get("updated_by", "")).strip(),
            }
        )

    raw_xml = raw.get("xml", {})
    if isinstance(raw_xml, dict):
        settings["xml"].update(
            {
                "enabled": bool(raw_xml.get("enabled", False)),
                "service_url": str(raw_xml.get("service_url", DEFAULT_SETTINGS["xml"]["service_url"])).strip(),
                "public_base_url": str(raw_xml.get("public_base_url", DEFAULT_SETTINGS["xml"]["public_base_url"])).strip(),
                "clients": _normalize_xml_client_settings(raw_xml.get("clients", {})),
                "updated_at": str(raw_xml.get("updated_at", "")).strip(),
                "updated_by": str(raw_xml.get("updated_by", "")).strip(),
            }
        )

    return settings


def load_runtime_settings() -> Dict[str, Any]:
    if not SETTINGS_FILE.exists():
        return deepcopy(DEFAULT_SETTINGS)
    try:
        raw = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return deepcopy(DEFAULT_SETTINGS)
    if not isinstance(raw, dict):
        return deepcopy(DEFAULT_SETTINGS)
    return _merged_settings(raw)


def save_runtime_settings(settings: Dict[str, Any]) -> Dict[str, Any]:
    current = load_runtime_settings()
    merged_input = deepcopy(current)

    proxy = settings.get("proxy")
    if isinstance(proxy, dict):
        merged_input["proxy"].update(proxy)

    sources = settings.get("sources")
    if isinstance(sources, dict):
        merged_input.setdefault("sources", {})
        for source_key, source_values in sources.items():
            if source_key not in DEFAULT_SOURCE_SETTINGS or not isinstance(source_values, dict):
                continue
            merged_input["sources"].setdefault(source_key, {})
            merged_input["sources"][source_key].update(source_values)

    api = settings.get("api")
    if isinstance(api, dict):
        merged_input["api"] = {
            **merged_input.get("api", {}),
            **api,
        }

    mail = settings.get("mail")
    if isinstance(mail, dict):
        merged_input["mail"] = {
            **merged_input.get("mail", {}),
            **mail,
        }

    image_processing = settings.get("image_processing")
    if isinstance(image_processing, dict):
        merged_input["image_processing"] = {
            **merged_input.get("image_processing", {}),
            **image_processing,
        }

    xml = settings.get("xml")
    if isinstance(xml, dict):
        merged_xml = {
            **merged_input.get("xml", {}),
            **xml,
        }
        existing_clients = merged_input.get("xml", {}).get("clients", {})
        incoming_clients = xml.get("clients", {})
        merged_xml["clients"] = {
            **(existing_clients if isinstance(existing_clients, dict) else {}),
            **(incoming_clients if isinstance(incoming_clients, dict) else {}),
        }
        merged_input["xml"] = merged_xml

    merged = _merged_settings(merged_input)
    SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)
    SETTINGS_FILE.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
    return merged


def get_proxy_settings() -> Dict[str, Any]:
    return load_runtime_settings().get("proxy", {}).copy()


def get_sources_settings() -> Dict[str, Dict[str, Any]]:
    sources = load_runtime_settings().get("sources", {})
    if isinstance(sources, dict):
        return deepcopy(sources)
    return deepcopy(DEFAULT_SOURCE_SETTINGS)


def get_api_settings() -> Dict[str, Any]:
    api = load_runtime_settings().get("api", {})
    if isinstance(api, dict):
        return deepcopy(api)
    return deepcopy(DEFAULT_SETTINGS["api"])


def get_api_endpoints() -> Dict[str, Dict[str, Any]]:
    api = get_api_settings()
    endpoints = api.get("endpoints", {})
    if isinstance(endpoints, dict):
        return deepcopy(endpoints)
    return deepcopy(DEFAULT_SETTINGS["api"].get("endpoints", {}))


def get_mail_settings() -> Dict[str, Any]:
    mail = load_runtime_settings().get("mail", {})
    if isinstance(mail, dict):
        return deepcopy(mail)
    return deepcopy(DEFAULT_SETTINGS["mail"])


def get_image_processing_settings() -> Dict[str, Any]:
    image_processing = load_runtime_settings().get("image_processing", {})
    if isinstance(image_processing, dict):
        return deepcopy(image_processing)
    return deepcopy(DEFAULT_SETTINGS["image_processing"])


def get_xml_settings() -> Dict[str, Any]:
    xml = load_runtime_settings().get("xml", {})
    if isinstance(xml, dict):
        return deepcopy(xml)
    return deepcopy(DEFAULT_SETTINGS["xml"])


def get_xml_client_settings() -> Dict[str, Dict[str, Any]]:
    xml = get_xml_settings()
    return _normalize_xml_client_settings(xml.get("clients", {}))


def get_xml_client_setting(domain: str) -> Dict[str, Any]:
    normalized_domain = str(domain or "").strip()
    if not normalized_domain:
        return {}
    return deepcopy(get_xml_client_settings().get(normalized_domain, {}))


def is_api_endpoint_enabled(endpoint_key: str) -> bool:
    api = get_api_settings()
    endpoints = api.get("endpoints", {})
    if isinstance(endpoints, dict) and endpoint_key in endpoints:
        return bool(endpoints.get(endpoint_key, {}).get("enabled", True))
    if endpoint_key == "products":
        return bool(api.get("products_enabled", True))
    if endpoint_key == "products_internal":
        return bool(api.get("products_internal_enabled", True))
    return True


def get_source_settings(source_key: str) -> Dict[str, Any]:
    return deepcopy(get_sources_settings().get(source_key, DEFAULT_SOURCE_SETTINGS.get(source_key, {})))


def get_enabled_source_chain() -> list[str]:
    sources = get_sources_settings()
    source_order = {key: index for index, key in enumerate(DEFAULT_SOURCE_SETTINGS)}
    enabled_sources = []
    for source_key, values in sources.items():
        if not bool(values.get("enabled", False)):
            continue
        try:
            priority = int(values.get("priority", DEFAULT_SOURCE_SETTINGS.get(source_key, {}).get("priority", 999)))
        except (TypeError, ValueError):
            priority = 999
        if bool(values.get("removed", False)):
            continue
        enabled_sources.append((source_key, priority, source_order.get(source_key, 999)))

    enabled_sources.sort(key=lambda row: (row[1], row[2], row[0]))
    return [source_key for source_key, _, _ in enabled_sources]


def _get_enabled_purpose_source_chain(priority_key: str) -> list[str]:
    sources = get_sources_settings()
    source_order = {key: index for index, key in enumerate(DEFAULT_SOURCE_SETTINGS)}
    enabled_sources = []
    for source_key, values in sources.items():
        if not bool(values.get("enabled", False)):
            continue
        if bool(values.get("removed", False)):
            continue
        try:
            priority = int(values.get(priority_key, DEFAULT_SOURCE_SETTINGS.get(source_key, {}).get(priority_key, 0)))
        except (TypeError, ValueError):
            priority = int(DEFAULT_SOURCE_SETTINGS.get(source_key, {}).get(priority_key, 0) or 0)
        if priority <= 0:
            continue
        enabled_sources.append((source_key, priority, source_order.get(source_key, 999)))

    enabled_sources.sort(key=lambda row: (row[1], row[2], row[0]))
    return [source_key for source_key, _, _ in enabled_sources]


def get_enabled_text_source_chain() -> list[str]:
    return _get_enabled_purpose_source_chain("text_priority")


def get_enabled_image_source_chain() -> list[str]:
    return _get_enabled_purpose_source_chain("image_priority")


def should_use_flaresolverr(source_key: str) -> bool:
    """Return True if the given source should route HTTP through FlareSolverr.

    Reads runtime_settings.json with DEFAULT_SOURCE_SETTINGS as fallback.
    Admins can toggle this per source from the Sources admin page.
    """
    key = str(source_key or "").strip().lower()
    if not key:
        return False
    settings = get_source_settings(key)
    if not settings:
        return False
    if "use_flaresolverr" in settings:
        return bool(settings.get("use_flaresolverr"))
    default = DEFAULT_SOURCE_SETTINGS.get(key, {})
    return bool(default.get("use_flaresolverr", False))


def is_source_enabled_for_purpose(source_key: str, priority_key: str) -> bool:
    source_key = str(source_key or "").strip()
    if not source_key:
        return False
    settings = get_source_settings(source_key)
    if not settings or not bool(settings.get("enabled", False)):
        return False
    if bool(settings.get("removed", False)):
        return False
    try:
        priority = int(settings.get(priority_key, 0))
    except (TypeError, ValueError):
        priority = 0
    return priority > 0


def is_source_enabled_for_images(source_key: str) -> bool:
    return is_source_enabled_for_purpose(source_key, "image_priority")


def is_source_enabled_for_text(source_key: str) -> bool:
    return is_source_enabled_for_purpose(source_key, "text_priority")


def is_watermark_cleanup_enabled() -> bool:
    image_processing = get_image_processing_settings()
    return bool(image_processing.get("watermark_cleanup_enabled", False))


def is_xml_service_enabled() -> bool:
    xml = get_xml_settings()
    return bool(xml.get("enabled", False))


def is_xml_client_enabled(domain: str, default: bool = True) -> bool:
    normalized_domain = str(domain or "").strip()
    if not normalized_domain:
        return default
    client_settings = get_xml_client_setting(normalized_domain)
    if not client_settings:
        return default
    return bool(client_settings.get("enabled", default))


def _build_proxy_url(raw_url: str, username: str = "", password: str = "") -> str:
    raw_url = str(raw_url or "").strip()
    if not raw_url:
        return ""

    parsed = urlparse(raw_url)
    if not parsed.scheme:
        parsed = urlparse(f"http://{raw_url}")

    if parsed.username or not (username and password):
        return urlunparse(parsed)

    netloc = parsed.netloc
    if "@" in netloc:
        return urlunparse(parsed)

    parsed = parsed._replace(netloc=f"{username}:{password}@{netloc}")
    return urlunparse(parsed)


def get_effective_proxy_url() -> str:
    proxy_settings = get_proxy_settings()
    if proxy_settings.get("enabled") and str(proxy_settings.get("url", "")).strip():
        return _build_proxy_url(
            str(proxy_settings.get("url", "")).strip(),
            str(proxy_settings.get("username", "")).strip(),
            str(proxy_settings.get("password", "")).strip(),
        )

    return _build_proxy_url(
        os.getenv("SKROUTZ_PROXY_URL", "").strip(),
        os.getenv("SKROUTZ_PROXY_USERNAME", "").strip(),
        os.getenv("SKROUTZ_PROXY_PASSWORD", "").strip(),
    )


def is_proxy_configured() -> bool:
    return bool(get_effective_proxy_url())
