from __future__ import annotations

from typing import Any, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from cms_activity import log_cms_audit_event, serialize_datetime, utcnow_iso
from cms_client_services import load_xml_generator_client_configs, load_xml_service_clients
from cms_permissions import get_current_cms_user, require_cms_permissions
from runtime_settings import (
    get_api_settings,
    get_effective_proxy_url,
    get_image_processing_settings,
    get_mail_settings,
    get_proxy_settings,
    get_xml_settings,
    is_proxy_configured,
    is_watermark_cleanup_enabled,
    save_runtime_settings,
)
from xml_service import (
    fetch_xml_service_status,
    get_effective_xml_public_base_url,
    get_effective_xml_service_url,
    trigger_xml_generation,
)


class ProxySettingsPayload(BaseModel):
    enabled: bool = False
    url: str = Field(default="", max_length=500)
    username: str = Field(default="", max_length=255)
    password: str = Field(default="", max_length=255)


class ApiEndpointPayload(BaseModel):
    key: str = Field(default="", max_length=64)
    label: str = Field(default="", max_length=128)
    path: str = Field(default="", max_length=128)
    enabled: bool = True
    public_only: bool = True
    include_internal_fields: bool = False
    allow_external_image_urls: bool = False
    fields: list[str] = Field(default_factory=list)


class ApiSettingsPayload(BaseModel):
    products_enabled: bool = True
    products_internal_enabled: bool = True
    endpoints: list[ApiEndpointPayload] = Field(default_factory=list)
    products_fields: list[str] = Field(default_factory=list)
    products_internal_fields: list[str] = Field(default_factory=list)
    field_registry: list[str] = Field(default_factory=list)


class ApiClientStatusPayload(BaseModel):
    enabled: bool = True


class MailSettingsPayload(BaseModel):
    smtp_host: str = Field(default="", max_length=255)
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_user: str = Field(default="", max_length=255)
    smtp_password: str = Field(default="", max_length=255)
    smtp_from: str = Field(default="", max_length=255)
    starttls: bool = True


class ImageProcessingSettingsPayload(BaseModel):
    watermark_cleanup_enabled: bool = False


class XmlSettingsPayload(BaseModel):
    enabled: bool = False
    service_url: str = Field(default="", max_length=500)
    public_base_url: str = Field(default="", max_length=500)


class XmlClientStatusPayload(BaseModel):
    enabled: bool = True


class XmlRunPayload(BaseModel):
    domain: str = Field(default="", max_length=255)
    mode: str = Field(default="full", max_length=32)


def _serialize_proxy_settings() -> Dict[str, Any]:
    proxy = get_proxy_settings()
    return {
        "enabled": bool(proxy.get("enabled", False)),
        "url": str(proxy.get("url", "")).strip(),
        "username": str(proxy.get("username", "")).strip(),
        "password_configured": bool(str(proxy.get("password", "")).strip()),
        "configured": is_proxy_configured(),
        "effective_proxy_url": get_effective_proxy_url(),
        "updated_at": str(proxy.get("updated_at", "")).strip(),
        "updated_by": str(proxy.get("updated_by", "")).strip(),
    }


def _serialize_api_settings() -> Dict[str, Any]:
    api = get_api_settings()
    raw_endpoints = api.get("endpoints", {})
    endpoints = []
    if isinstance(raw_endpoints, dict):
        endpoints = [
            {
                "key": str(values.get("key", key)).strip(),
                "label": str(values.get("label", f"/products/{key}")).strip(),
                "path": str(values.get("path", f"/products/{key}")).strip(),
                "enabled": bool(values.get("enabled", True)),
                "public_only": bool(values.get("public_only", True)),
                "include_internal_fields": bool(values.get("include_internal_fields", False)),
                "allow_external_image_urls": bool(values.get("allow_external_image_urls", False)),
                "fields": values.get("fields", []) if isinstance(values.get("fields", []), list) else [],
            }
            for key, values in raw_endpoints.items()
            if isinstance(values, dict)
        ]
        endpoints.sort(key=lambda row: (row.get("path") or "", row.get("key") or ""))
    return {
        "products_enabled": bool(api.get("products_enabled", True)),
        "products_internal_enabled": bool(api.get("products_internal_enabled", True)),
        "endpoints": endpoints,
        "products_fields": api.get("products_fields", []),
        "products_internal_fields": api.get("products_internal_fields", []),
        "field_registry": api.get("field_registry", []),
        "updated_at": str(api.get("updated_at", "")).strip(),
        "updated_by": str(api.get("updated_by", "")).strip(),
    }


def _serialize_mail_settings() -> Dict[str, Any]:
    mail = get_mail_settings()
    return {
        "smtp_host": str(mail.get("smtp_host", "")).strip(),
        "smtp_port": int(mail.get("smtp_port", 587) or 587),
        "smtp_user": str(mail.get("smtp_user", "")).strip(),
        "smtp_from": str(mail.get("smtp_from", "")).strip(),
        "starttls": bool(mail.get("starttls", True)),
        "password_configured": bool(str(mail.get("smtp_password", "")).strip()),
        "configured": bool(str(mail.get("smtp_host", "")).strip() and str(mail.get("smtp_from", "")).strip()),
        "updated_at": str(mail.get("updated_at", "")).strip(),
        "updated_by": str(mail.get("updated_by", "")).strip(),
    }


def _serialize_image_processing_settings() -> Dict[str, Any]:
    image_processing = get_image_processing_settings()
    return {
        "watermark_cleanup_enabled": bool(image_processing.get("watermark_cleanup_enabled", False)),
        "updated_at": str(image_processing.get("updated_at", "")).strip(),
        "updated_by": str(image_processing.get("updated_by", "")).strip(),
        "effective_watermark_cleanup_enabled": is_watermark_cleanup_enabled(),
    }


async def _serialize_xml_settings(db) -> Dict[str, Any]:
    xml = get_xml_settings()
    configured_clients = await load_xml_service_clients(db)
    service_status = await fetch_xml_service_status(configured_clients=configured_clients)
    configured_clients = service_status.get("configured_clients", configured_clients)
    outputs = service_status.get("outputs", [])
    last_run = service_status.get("last_run", {})
    return {
        "enabled": bool(xml.get("enabled", False)),
        "service_url": str(xml.get("service_url", "")).strip() or get_effective_xml_service_url(),
        "public_base_url": str(xml.get("public_base_url", "")).strip() or get_effective_xml_public_base_url(),
        "updated_at": str(xml.get("updated_at", "")).strip(),
        "updated_by": str(xml.get("updated_by", "")).strip(),
        "service_reachable": bool(service_status.get("reachable", False)),
        "service_error": str(service_status.get("error", "")).strip(),
        "service_running": bool(service_status.get("running", False)),
        "configured_clients": configured_clients if isinstance(configured_clients, list) else [],
        "outputs": outputs if isinstance(outputs, list) else [],
        "last_run": last_run if isinstance(last_run, dict) else {},
    }


def _serialize_api_client(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc.get("_id", "")),
        "name": str(doc.get("name", "")).strip(),
        "company": str(doc.get("company", "")).strip(),
        "is_active": bool(doc.get("is_active", True)),
        "source_type": str(doc.get("source_type", "")).strip(),
        "auth_provider": str(doc.get("auth_provider", "")).strip(),
        "api_client_key": str(doc.get("api_client_key", "")).strip(),
        "api_username": str(doc.get("api_username", "")).strip(),
        "api_domain": str(doc.get("api_domain", "")).strip(),
        "api_request_count": int(doc.get("api_request_count", 0) or 0),
        "last_api_access_at": serialize_datetime(doc.get("last_api_access_at")),
        "last_api_endpoint": str(doc.get("last_api_endpoint", "")).strip(),
        "last_api_ip": str(doc.get("last_api_ip", "")).strip(),
        "last_api_host": str(doc.get("last_api_host", "")).strip(),
        "last_api_origin": str(doc.get("last_api_origin", "")).strip(),
        "last_api_referer": str(doc.get("last_api_referer", "")).strip(),
        "last_api_barcodes_count": int(doc.get("last_api_barcodes_count", 0) or 0),
        "updated_at": serialize_datetime(doc.get("updated_at")),
    }


async def _load_api_clients(db) -> list[Dict[str, Any]]:
    docs = (
        await db.cms_clients.find(
            {"source_type": "api_basic"},
            {
                "name": 1,
                "company": 1,
                "is_active": 1,
                "source_type": 1,
                "auth_provider": 1,
                "api_client_key": 1,
                "api_username": 1,
                "api_domain": 1,
                "api_request_count": 1,
                "last_api_access_at": 1,
                "last_api_endpoint": 1,
                "last_api_ip": 1,
                "last_api_host": 1,
                "last_api_origin": 1,
                "last_api_referer": 1,
                "last_api_barcodes_count": 1,
                "updated_at": 1,
            },
        )
        .sort([("api_domain", 1), ("api_username", 1)])
        .to_list(length=None)
    )
    return [_serialize_api_client(doc) for doc in docs]


async def _serialize_settings_payload(db) -> Dict[str, Any]:
    return {
        "proxy": _serialize_proxy_settings(),
        "api": _serialize_api_settings(),
        "mail": _serialize_mail_settings(),
        "image_processing": _serialize_image_processing_settings(),
        "xml": await _serialize_xml_settings(db),
        "api_clients": await _load_api_clients(db),
    }


def create_cms_settings_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/settings", tags=["cms-settings"])

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("settings.view"))],
    )
    async def get_settings(current_user: Dict[str, Any] = Depends(get_current_cms_user)) -> Dict[str, Any]:
        del current_user
        return {
            "success": True,
            "data": await _serialize_settings_payload(db),
        }

    @router.put(
        "/proxy",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_proxy_settings(
        payload: ProxySettingsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        existing = get_proxy_settings()
        updated_password = payload.password.strip() or str(existing.get("password", "")).strip()
        saved = save_runtime_settings(
            {
                "proxy": {
                    "enabled": payload.enabled,
                    "url": payload.url.strip(),
                    "username": payload.username.strip(),
                    "password": updated_password,
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_proxy_settings",
            entity_type="settings",
            entity_id="proxy",
            user=current_user,
            metadata={
                "enabled": bool(saved["proxy"]["enabled"]),
                "url": str(saved["proxy"]["url"]).strip(),
                "username": str(saved["proxy"]["username"]).strip(),
                "password_configured": bool(str(saved["proxy"]["password"]).strip()),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    @router.put(
        "/api",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_api_settings(
        payload: ApiSettingsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        def normalize_fields(raw: list[str]) -> list[str]:
            normalized: list[str] = []
            for value in raw:
                field = str(value or "").strip()
                if field and field not in normalized:
                    normalized.append(field)
            return normalized
        def normalize_endpoint_key(raw: str) -> str:
            return "".join(ch for ch in str(raw or "").strip().lower() if ch.isalnum() or ch in {"_", "-"})

        products_fields = normalize_fields(payload.products_fields)
        products_internal_fields = normalize_fields(payload.products_internal_fields)
        field_registry = normalize_fields(payload.field_registry)
        endpoints: Dict[str, Dict[str, Any]] = {}
        existing_endpoints = get_api_settings().get("endpoints", {})
        if not isinstance(existing_endpoints, dict):
            existing_endpoints = {}
        for endpoint in payload.endpoints:
            key = normalize_endpoint_key(endpoint.key)
            if not key:
                continue
            fields = normalize_fields(endpoint.fields)
            for field in fields:
                if field not in field_registry:
                    field_registry.append(field)
            if key in {"products", "products_internal"}:
                path = endpoint.path.strip() or f"/{key}"
            else:
                path = f"/products/{key}"
            label = endpoint.label.strip() or path
            endpoints[key] = {
                "key": key,
                "label": label,
                "path": path,
                "enabled": endpoint.enabled,
                "public_only": endpoint.public_only,
                "include_internal_fields": endpoint.include_internal_fields,
                "allow_external_image_urls": endpoint.allow_external_image_urls,
                "fields": fields,
            }
        products_endpoint = endpoints.get("products")
        products_internal_endpoint = endpoints.get("products_internal")
        for legacy_key, legacy_defaults in existing_endpoints.items():
            if legacy_key not in endpoints and isinstance(legacy_defaults, dict):
                endpoints[legacy_key] = legacy_defaults
        if products_endpoint:
            payload.products_enabled = bool(products_endpoint.get("enabled", payload.products_enabled))
        if products_internal_endpoint:
            payload.products_internal_enabled = bool(
                products_internal_endpoint.get("enabled", payload.products_internal_enabled)
            )
        saved = save_runtime_settings(
            {
                "api": {
                    "products_enabled": payload.products_enabled,
                    "products_internal_enabled": payload.products_internal_enabled,
                    "endpoints": endpoints,
                    "products_fields": products_fields,
                    "products_internal_fields": products_internal_fields,
                    "field_registry": field_registry,
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_api_settings",
            entity_type="settings",
            entity_id="api",
            user=current_user,
            metadata={
                "products_enabled": bool(saved["api"]["products_enabled"]),
                "products_internal_enabled": bool(saved["api"]["products_internal_enabled"]),
                "endpoints": list(saved["api"].get("endpoints", {}).keys()),
                "products_fields": saved["api"].get("products_fields", []),
                "products_internal_fields": saved["api"].get("products_internal_fields", []),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    @router.put(
        "/image-processing",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_image_processing_settings(
        payload: ImageProcessingSettingsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        saved = save_runtime_settings(
            {
                "image_processing": {
                    "watermark_cleanup_enabled": payload.watermark_cleanup_enabled,
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_image_processing_settings",
            entity_type="settings",
            entity_id="image_processing",
            user=current_user,
            metadata={
                "watermark_cleanup_enabled": bool(saved["image_processing"]["watermark_cleanup_enabled"]),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    @router.put(
        "/xml",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_xml_settings(
        payload: XmlSettingsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        saved = save_runtime_settings(
            {
                "xml": {
                    "enabled": payload.enabled,
                    "service_url": payload.service_url.strip().rstrip("/"),
                    "public_base_url": payload.public_base_url.strip().rstrip("/"),
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_xml_settings",
            entity_type="settings",
            entity_id="xml",
            user=current_user,
            metadata={
                "enabled": bool(saved["xml"]["enabled"]),
                "service_url": str(saved["xml"]["service_url"]).strip(),
                "public_base_url": str(saved["xml"]["public_base_url"]).strip(),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    @router.put(
        "/xml/clients/{domain}",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_xml_client_status(
        domain: str,
        payload: XmlClientStatusPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        normalized_domain = str(domain or "").strip()
        if not normalized_domain:
            raise HTTPException(status_code=404, detail="XML client not found")

        configured_clients = await load_xml_service_clients(db)
        configured_domains = {
            str(row.get("domain", "")).strip()
            for row in configured_clients
            if isinstance(row, dict) and str(row.get("domain", "")).strip()
        }
        if configured_domains and normalized_domain not in configured_domains:
            raise HTTPException(status_code=404, detail="XML client not found")

        saved = save_runtime_settings(
            {
                "xml": {
                    "clients": {
                        normalized_domain: {
                            "enabled": payload.enabled,
                            "updated_at": utcnow_iso(),
                            "updated_by": current_user.get("email", ""),
                        }
                    },
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_xml_client_status",
            entity_type="settings",
            entity_id=f"xml:{normalized_domain}",
            user=current_user,
            metadata={
                "domain": normalized_domain,
                "enabled": payload.enabled,
                "client_settings": saved.get("xml", {}).get("clients", {}).get(normalized_domain, {}),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    @router.post(
        "/xml/run",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def run_xml_generation(
        payload: XmlRunPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        mode = str(payload.mode or "full").strip().lower()
        if mode not in {"full", "incremental"}:
            raise HTTPException(status_code=400, detail="Unsupported XML generation mode")

        configured_clients = await load_xml_service_clients(db)
        generator_clients = await load_xml_generator_client_configs(db)
        try:
            job = await trigger_xml_generation(
                configured_clients=configured_clients,
                generator_clients=generator_clients,
                domain=payload.domain.strip(),
                mode=mode,
            )
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

        await log_cms_audit_event(
            db,
            action="run_xml_generation",
            entity_type="settings",
            entity_id="xml",
            user=current_user,
            metadata={
                "started": bool(job.get("started", False)),
                "already_running": bool(job.get("already_running", False)),
                "requested_domain": str(job.get("requested_domain", "")).strip(),
                "requested_domains": job.get("requested_domains", []),
                "mode": str(job.get("mode", mode)).strip(),
            },
        )
        return {
            "success": True,
            "data": {
                "job": job,
                "settings": await _serialize_settings_payload(db),
            },
        }

    @router.put(
        "/api-clients/{client_id}",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_api_client_status(
        client_id: str,
        payload: ApiClientStatusPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        if not ObjectId.is_valid(client_id):
            raise HTTPException(status_code=404, detail="API client not found")
        object_id = ObjectId(client_id)
        existing = await db.cms_clients.find_one({"_id": object_id, "source_type": "api_basic"})
        if not existing:
            raise HTTPException(status_code=404, detail="API client not found")

        await db.cms_clients.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "is_active": payload.enabled,
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            },
        )
        await log_cms_audit_event(
            db,
            action="update_api_client_status",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={
                "api_domain": str(existing.get("api_domain", "")).strip(),
                "api_username": str(existing.get("api_username", "")).strip(),
                "enabled": bool(payload.enabled),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    @router.put(
        "/mail",
        dependencies=[Depends(require_cms_permissions("settings.update"))],
    )
    async def update_mail_settings(
        payload: MailSettingsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        existing = get_mail_settings()
        updated_password = payload.smtp_password.strip() or str(existing.get("smtp_password", "")).strip()
        saved = save_runtime_settings(
            {
                "mail": {
                    "smtp_host": payload.smtp_host.strip(),
                    "smtp_port": payload.smtp_port,
                    "smtp_user": payload.smtp_user.strip(),
                    "smtp_password": updated_password,
                    "smtp_from": payload.smtp_from.strip(),
                    "starttls": payload.starttls,
                    "updated_at": utcnow_iso(),
                    "updated_by": current_user.get("email", ""),
                }
            }
        )
        await log_cms_audit_event(
            db,
            action="update_mail_settings",
            entity_type="settings",
            entity_id="mail",
            user=current_user,
            metadata={
                "smtp_host": str(saved["mail"]["smtp_host"]).strip(),
                "smtp_port": int(saved["mail"]["smtp_port"]),
                "smtp_user": str(saved["mail"]["smtp_user"]).strip(),
                "smtp_from": str(saved["mail"]["smtp_from"]).strip(),
                "starttls": bool(saved["mail"]["starttls"]),
                "password_configured": bool(str(saved["mail"]["smtp_password"]).strip()),
            },
        )
        return {"success": True, "data": await _serialize_settings_payload(db)}

    return router
