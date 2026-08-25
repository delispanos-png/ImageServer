from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field

from cms_activity import log_cms_audit_event, serialize_datetime
from cms_client_services import normalize_client_services, validate_client_services
from cms_permissions import get_current_cms_user, require_cms_permissions
from api_clients import _pbkdf2_hash, generate_api_client_password
from client_credentials_mail import send_api_client_credentials_email
from login_lockout import admin_unlock_account, is_account_locked
from secrets_vault import decrypt_secret, encrypt_secret


def _ensure_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except Exception as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=404, detail="Record not found") from exc


class ClientImageServicePayload(BaseModel):
    enabled: bool = True


class ClientXmlServicePayload(BaseModel):
    enabled: bool = False
    domain: str = Field(default="", max_length=255)
    solution_type: str = Field(default="", max_length=32)
    company: str = Field(default="", max_length=64)
    whouse: str = Field(default="E-Shop", max_length=255)
    api_key: str = Field(default="", max_length=500)
    site_xml: str = Field(default="", max_length=2000)
    old_id_field: str = Field(default="", max_length=64)
    product_url_base: str = Field(default="", max_length=500)
    image_url_base: str = Field(default="", max_length=500)
    photo_root: str = Field(default="/app/images", max_length=500)
    default_category: str = Field(default="", max_length=500)
    shopflix_category: str = Field(default="", max_length=500)
    softone_distribution_channels: str = Field(default="", max_length=255)
    require_web_item: bool = True


class ClientServicesPayload(BaseModel):
    image_service: ClientImageServicePayload = Field(default_factory=ClientImageServicePayload)
    xml_service: ClientXmlServicePayload = Field(default_factory=ClientXmlServicePayload)


class ClientPayload(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(default="", max_length=255)
    phone: str = Field(default="", max_length=80)
    company: str = Field(default="", max_length=255)
    is_active: bool = True
    receive_all_categories: bool = False
    notes: str = ""
    category_ids: List[str] = Field(default_factory=list)
    services: ClientServicesPayload = Field(default_factory=ClientServicesPayload)
    is_trial: bool = False
    trial_mode: str = Field(default="whitelist", max_length=16)
    trial_max_requests: int = Field(default=300, ge=1, le=100000)
    trial_barcodes: List[str] = Field(default_factory=list)
    webhook_url: str = Field(default="", max_length=500)
    webhook_secret: str = Field(default="", max_length=120)
    # IP whitelist. When non-empty, API requests are accepted only from these
    # IPs. Entries may be single IPv4/IPv6 addresses or CIDR blocks
    # (e.g. "10.0.0.0/8"). Empty list = no restriction.
    allowed_ips: List[str] = Field(default_factory=list, max_length=32)


class BulkDeleteClientsPayload(BaseModel):
    client_ids: List[str] = Field(default_factory=list)


class ApiClientCredentialsPayload(BaseModel):
    api_username: str = Field(min_length=1, max_length=255)
    password: str = Field(default="", max_length=255)
    generate_password: bool = False
    send_email: bool = True


def _validate_password_complexity(password: str) -> None:
    """Raise 422 if password fails minimum complexity rules."""
    if len(password) < 12:
        raise HTTPException(status_code=422, detail="Ο κωδικός πρέπει να έχει τουλάχιστον 12 χαρακτήρες.")
    has_letter = any(c.isalpha() for c in password)
    has_digit = any(c.isdigit() for c in password)
    if not has_letter or not has_digit:
        raise HTTPException(
            status_code=422,
            detail="Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα γράμμα και ένα ψηφίο.",
        )


def _normalize_trial_mode(raw: Any, is_trial: bool) -> str:
    if not is_trial:
        return "whitelist"
    value = str(raw or "").strip().lower()
    if value in ("random", "quota"):
        return "quota"
    return "whitelist"


def _normalize_trial_barcodes(barcodes: List[str]) -> List[str]:
    seen: set[str] = set()
    result: List[str] = []
    for raw in barcodes or []:
        bc = str(raw).strip()
        if not bc or bc in seen:
            continue
        seen.add(bc)
        result.append(bc)
    return result


def _normalize_allowed_ips(entries: List[str]) -> List[str]:
    """Validate + dedupe IP whitelist entries. Raises 422 on garbage input
    so the operator gets immediate feedback instead of silent drop."""
    from api_clients import normalize_allowed_ip_entry
    seen: set[str] = set()
    result: List[str] = []
    invalid: List[str] = []
    for raw in entries or []:
        v = str(raw).strip()
        if not v:
            continue
        canonical = normalize_allowed_ip_entry(v)
        if not canonical:
            invalid.append(v)
            continue
        if canonical in seen:
            continue
        seen.add(canonical)
        result.append(canonical)
    if invalid:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid IP/CIDR entries: {', '.join(invalid[:5])}",
        )
    return result


def _category_names_from_ids(category_ids: List[str], category_lookup: Dict[str, str]) -> List[Dict[str, str]]:
    return [
        {"id": category_id, "name": category_lookup.get(category_id, category_id)}
        for category_id in category_ids
    ]


def _serialize_client(doc: Dict[str, Any], category_lookup: Dict[str, str]) -> Dict[str, Any]:
    category_ids = [str(category_id).strip() for category_id in doc.get("category_ids", []) if str(category_id).strip()]
    receive_all_categories = bool(doc.get("receive_all_categories", False))
    assigned_categories = _category_names_from_ids(category_ids, category_lookup)
    assigned_categories_count = len(category_lookup) if receive_all_categories else len(assigned_categories)
    services = normalize_client_services(doc.get("services", {}))
    locked_until_dt = is_account_locked(doc)
    return {
        "id": str(doc.get("_id", "")),
        "name": str(doc.get("name", "")).strip(),
        "email": str(doc.get("email", "")).strip(),
        "phone": str(doc.get("phone", "")).strip(),
        "company": str(doc.get("company", "")).strip(),
        "is_active": bool(doc.get("is_active", True)),
        "receive_all_categories": receive_all_categories,
        "subscription_mode": "all_categories" if receive_all_categories else "selected_categories",
        "notes": str(doc.get("notes", "")).strip(),
        "category_ids": category_ids,
        "assigned_categories": assigned_categories,
        "assigned_categories_count": assigned_categories_count,
        "services": services,
        "is_trial": bool(doc.get("is_trial", False)),
        "trial_mode": _normalize_trial_mode(doc.get("trial_mode"), bool(doc.get("is_trial"))),
        "webhook_url": str(doc.get("webhook_url", "")).strip(),
        "webhook_secret": str(doc.get("webhook_secret", "")).strip(),
        "webhook_events": list(doc.get("webhook_events") or []),
        "trial_max_requests": int(
            doc.get("trial_max_requests", doc.get("trial_random_count", 300)) or 300
        ),
        "trial_barcodes": [str(bc).strip() for bc in doc.get("trial_barcodes", []) if str(bc).strip()],
        "source_type": str(doc.get("source_type", "")).strip(),
        "auth_provider": str(doc.get("auth_provider", "")).strip(),
        "api_client_key": str(doc.get("api_client_key", "")).strip(),
        "api_username": str(doc.get("api_username", "")).strip(),
        "api_domain": str(doc.get("api_domain", "")).strip(),
        "api_request_count": int(doc.get("api_request_count", 0) or 0),
        "password_configured": bool(str(doc.get("api_password_hash", "")).strip()),
        "password_last_rotated_at": serialize_datetime(doc.get("password_last_rotated_at")),
        "last_api_access_at": serialize_datetime(doc.get("last_api_access_at")),
        "last_api_endpoint": str(doc.get("last_api_endpoint", "")).strip(),
        "last_api_ip": str(doc.get("last_api_ip", "")).strip(),
        "last_api_origin": str(doc.get("last_api_origin", "")).strip(),
        "last_api_referer": str(doc.get("last_api_referer", "")).strip(),
        "last_api_host": str(doc.get("last_api_host", "")).strip(),
        "last_api_user_agent": str(doc.get("last_api_user_agent", "")).strip(),
        "last_api_barcodes_count": int(doc.get("last_api_barcodes_count", 0) or 0),
        "created_by": str(doc.get("created_by", "")).strip(),
        "updated_by": str(doc.get("updated_by", "")).strip(),
        "created_at": serialize_datetime(doc.get("created_at")),
        "updated_at": serialize_datetime(doc.get("updated_at")),
        "failed_login_count": int(doc.get("failed_login_count", 0) or 0),
        "locked_until": locked_until_dt.isoformat() if locked_until_dt else None,
        "is_locked": locked_until_dt is not None,
        "allowed_ips": [str(x).strip() for x in (doc.get("allowed_ips") or []) if str(x).strip()],
    }


async def _load_category_lookup(db) -> Dict[str, str]:
    docs = await db.cms_categories.find({}, {"_id": 1, "name": 1}).to_list(length=None)
    return {str(doc["_id"]): str(doc.get("name", "")).strip() for doc in docs}


async def _validate_category_ids(db, category_ids: List[str]) -> List[str]:
    normalized = [str(category_id).strip() for category_id in category_ids if str(category_id).strip()]
    if not normalized:
        return []
    unique_ids = list(dict.fromkeys(normalized))
    if not all(ObjectId.is_valid(category_id) for category_id in unique_ids):
        raise HTTPException(status_code=422, detail="One or more categories are invalid")
    existing = await db.cms_categories.find({"_id": {"$in": [ObjectId(category_id) for category_id in unique_ids]}}).to_list(length=None)
    existing_ids = {str(doc["_id"]) for doc in existing}
    missing = [category_id for category_id in unique_ids if category_id not in existing_ids]
    if missing:
        raise HTTPException(status_code=404, detail=f"Categories not found: {', '.join(missing)}")
    return unique_ids


async def _send_credentials_email_async(
    *,
    to_email: str,
    client_name: str,
    api_username: str,
    api_password: str,
    api_domain: str,
) -> None:
    await asyncio.to_thread(
        send_api_client_credentials_email,
        to_email=to_email,
        client_name=client_name,
        api_username=api_username,
        api_password=api_password,
        api_domain=api_domain,
    )


def create_cms_clients_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/clients", tags=["cms-clients"])

    @router.get(
        "/my-ip",
        dependencies=[Depends(require_cms_permissions("clients.view"))],
    )
    async def get_admin_request_ip(request: Request) -> Dict[str, Any]:
        """Return the IP the CMS admin sees for its own request. Useful when
        setting up a client whitelist and the operator wants to confirm what
        the API sees (helps with reverse proxies / X-Forwarded-For)."""
        from api_clients import resolve_request_ip
        return {
            "success": True,
            "data": {
                "request_ip": resolve_request_ip(request),
                "x_forwarded_for": request.headers.get("x-forwarded-for", ""),
                "remote_addr": request.client.host if request.client else "",
            },
        }

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("clients.view"))],
    )
    async def list_clients(
        search: str = Query(default="", max_length=120),
        status_filter: str = Query(default="all", pattern="^(all|active|inactive)$"),
        subscription_filter: str = Query(default="all", pattern="^(all|all_categories|selected_categories)$"),
        page: int = Query(default=1, ge=1),
        per_page: int = Query(default=20, ge=1, le=100),
        sort_by: str = Query(default="updated_at", pattern="^(name|email|company|status|assigned_categories|api_requests|last_api_access_at|created_at|updated_at)$"),
        sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        if status_filter == "active":
            query["is_active"] = True
        elif status_filter == "inactive":
            query["is_active"] = False
        if subscription_filter == "all_categories":
            query["receive_all_categories"] = True
        elif subscription_filter == "selected_categories":
            query["receive_all_categories"] = False
        if search.strip():
            pattern = {"$regex": search.strip(), "$options": "i"}
            query["$or"] = [
                {"name": pattern},
                {"email": pattern},
                {"phone": pattern},
                {"company": pattern},
                {"notes": pattern},
                {"api_domain": pattern},
                {"api_username": pattern},
                {"services.xml_service.domain": pattern},
                {"last_api_ip": pattern},
                {"last_api_referer": pattern},
                {"last_api_origin": pattern},
            ]

        category_lookup = await _load_category_lookup(db)
        docs = await db.cms_clients.find(query).to_list(length=None)
        data = [_serialize_client(doc, category_lookup) for doc in docs]

        reverse = sort_order == "desc"
        sort_map = {
            "name": lambda row: row.get("name", "").lower(),
            "email": lambda row: row.get("email", "").lower(),
            "company": lambda row: row.get("company", "").lower(),
            "status": lambda row: 1 if row.get("is_active") else 0,
            "assigned_categories": lambda row: int(row.get("assigned_categories_count", 0)),
            "api_requests": lambda row: int(row.get("api_request_count", 0)),
            "last_api_access_at": lambda row: row.get("last_api_access_at", ""),
            "created_at": lambda row: row.get("created_at", ""),
            "updated_at": lambda row: row.get("updated_at", ""),
        }
        data.sort(key=sort_map.get(sort_by, sort_map["updated_at"]), reverse=reverse)

        total = len(data)
        skip = (page - 1) * per_page
        paginated = data[skip : skip + per_page]
        return {
            "success": True,
            "data": paginated,
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
        }

    @router.post(
        "",
        dependencies=[Depends(require_cms_permissions("clients.create"))],
    )
    async def create_client(
        payload: ClientPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        category_ids = [] if payload.receive_all_categories else await _validate_category_ids(db, payload.category_ids)
        services = normalize_client_services(payload.services.dict())
        service_errors = validate_client_services(services)
        if service_errors:
            raise HTTPException(status_code=422, detail="; ".join(service_errors))
        normalized_email = payload.email.strip().lower()
        if normalized_email and await db.cms_clients.find_one({"email": normalized_email}):
            raise HTTPException(status_code=409, detail="Client email already exists")
        xml_domain = str(services.get("xml_service", {}).get("domain", "")).strip()
        if bool(services.get("xml_service", {}).get("enabled")) and xml_domain:
            duplicate_xml_domain = await db.cms_clients.find_one({"services.xml_service.domain": xml_domain})
            if duplicate_xml_domain:
                raise HTTPException(status_code=409, detail="XML domain already exists")
        now = datetime.now(timezone.utc)
        trial_barcodes = _normalize_trial_barcodes(payload.trial_barcodes)
        trial_mode = _normalize_trial_mode(payload.trial_mode, bool(payload.is_trial))
        allowed_ips = _normalize_allowed_ips(payload.allowed_ips)
        document = {
            "name": payload.name.strip(),
            "email": normalized_email,
            "phone": payload.phone.strip(),
            "company": payload.company.strip(),
            "is_active": payload.is_active,
            "receive_all_categories": payload.receive_all_categories,
            "notes": payload.notes.strip(),
            "category_ids": category_ids,
            "services": services,
            "is_trial": bool(payload.is_trial),
            "trial_mode": trial_mode,
            "trial_max_requests": int(payload.trial_max_requests),
            "trial_barcodes": trial_barcodes,
            "allowed_ips": allowed_ips,
            "webhook_url": payload.webhook_url.strip(),
            "webhook_secret": payload.webhook_secret.strip(),
            "webhook_events": ["barcode.available"] if payload.webhook_url.strip() else [],
            "created_by": current_user.get("email", ""),
            "updated_by": current_user.get("email", ""),
            "created_at": now,
            "updated_at": now,
        }
        needs_api_access = bool(payload.is_trial) or bool(services.get("image_service", {}).get("enabled"))
        if needs_api_access:
            document["source_type"] = "api_basic"
            document["auth_provider"] = "trial" if payload.is_trial else "legacy_basic"
        result = await db.cms_clients.insert_one(document)
        created = await db.cms_clients.find_one({"_id": result.inserted_id})
        await log_cms_audit_event(
            db,
            action="create_client",
            entity_type="client",
            entity_id=str(result.inserted_id),
            user=current_user,
            metadata={
                "name": document["name"],
                "email": document["email"],
                "subscription_mode": "all_categories" if payload.receive_all_categories else "selected_categories",
                "image_service_enabled": bool(services["image_service"]["enabled"]),
                "xml_service_enabled": bool(services["xml_service"]["enabled"]),
                "xml_domain": str(services["xml_service"]["domain"]).strip(),
            },
        )
        return {"success": True, "data": _serialize_client(created, await _load_category_lookup(db))}

    @router.get(
        "/{client_id}",
        dependencies=[Depends(require_cms_permissions("clients.view"))],
    )
    async def get_client(client_id: str) -> Dict[str, Any]:
        doc = await db.cms_clients.find_one({"_id": _ensure_object_id(client_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Client not found")
        return {"success": True, "data": _serialize_client(doc, await _load_category_lookup(db))}

    @router.put(
        "/{client_id}",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def update_client(
        client_id: str,
        payload: ClientPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")

        category_ids = [] if payload.receive_all_categories else await _validate_category_ids(db, payload.category_ids)
        normalized_email = payload.email.strip().lower()
        if normalized_email:
            duplicate = await db.cms_clients.find_one({"email": normalized_email, "_id": {"$ne": client_object_id}})
            if duplicate:
                raise HTTPException(status_code=409, detail="Client email already exists")
        services = normalize_client_services(payload.services.dict())
        service_errors = validate_client_services(services)
        if service_errors:
            raise HTTPException(status_code=422, detail="; ".join(service_errors))
        xml_domain = str(services.get("xml_service", {}).get("domain", "")).strip()
        if bool(services.get("xml_service", {}).get("enabled")) and xml_domain:
            duplicate_xml_domain = await db.cms_clients.find_one(
                {"services.xml_service.domain": xml_domain, "_id": {"$ne": client_object_id}}
            )
            if duplicate_xml_domain:
                raise HTTPException(status_code=409, detail="XML domain already exists")
        trial_barcodes = _normalize_trial_barcodes(payload.trial_barcodes)
        trial_mode = _normalize_trial_mode(payload.trial_mode, bool(payload.is_trial))
        allowed_ips = _normalize_allowed_ips(payload.allowed_ips)
        updates = {
            "name": payload.name.strip(),
            "email": normalized_email,
            "phone": payload.phone.strip(),
            "company": payload.company.strip(),
            "is_active": payload.is_active,
            "receive_all_categories": payload.receive_all_categories,
            "notes": payload.notes.strip(),
            "category_ids": category_ids,
            "services": services,
            "is_trial": bool(payload.is_trial),
            "trial_mode": trial_mode,
            "trial_max_requests": int(payload.trial_max_requests),
            "trial_barcodes": trial_barcodes,
            "allowed_ips": allowed_ips,
            "webhook_url": payload.webhook_url.strip(),
            "webhook_secret": payload.webhook_secret.strip(),
            "webhook_events": ["barcode.available"] if payload.webhook_url.strip() else [],
            "updated_by": current_user.get("email", ""),
            "updated_at": datetime.now(timezone.utc),
        }
        needs_api_access = bool(payload.is_trial) or bool(services.get("image_service", {}).get("enabled"))
        if needs_api_access and str(existing.get("source_type", "")).strip() != "api_basic":
            updates["source_type"] = "api_basic"
            if not str(existing.get("auth_provider", "")).strip():
                updates["auth_provider"] = "trial" if payload.is_trial else "legacy_basic"
        await db.cms_clients.update_one({"_id": client_object_id}, {"$set": updates})
        updated = await db.cms_clients.find_one({"_id": client_object_id})
        changed_fields = [
            field
            for field, new_value in updates.items()
            if field not in {"updated_by", "updated_at"} and existing.get(field) != new_value
        ]
        if changed_fields:
            await log_cms_audit_event(
                db,
                action="update_client",
                entity_type="client",
                entity_id=client_id,
                user=current_user,
                metadata={
                    "name": updates["name"],
                    "email": updates["email"],
                    "changed_fields": changed_fields,
                    "subscription_mode": "all_categories" if payload.receive_all_categories else "selected_categories",
                    "image_service_enabled": bool(services["image_service"]["enabled"]),
                    "xml_service_enabled": bool(services["xml_service"]["enabled"]),
                    "xml_domain": str(services["xml_service"]["domain"]).strip(),
                },
            )
        return {"success": True, "data": _serialize_client(updated, await _load_category_lookup(db))}

    @router.put(
        "/{client_id}/api-credentials",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def update_api_client_credentials(
        client_id: str,
        payload: ApiClientCredentialsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")
        if str(existing.get("source_type", "")).strip() != "api_basic":
            raise HTTPException(status_code=422, detail="API credentials can only be managed for API clients")

        normalized_username = payload.api_username.strip()
        if not normalized_username:
            raise HTTPException(status_code=422, detail="API username is required")

        duplicate = await db.cms_clients.find_one(
            {
                "_id": {"$ne": client_object_id},
                "source_type": "api_basic",
                "api_username": normalized_username,
            }
        )
        if duplicate:
            raise HTTPException(status_code=409, detail="API username already exists")

        issued_password = payload.password.strip()
        password_changed = False
        if payload.generate_password:
            issued_password = generate_api_client_password()
            password_changed = True
        elif issued_password:
            _validate_password_complexity(issued_password)
            password_changed = True

        if payload.send_email and not str(existing.get("email", "")).strip():
            raise HTTPException(status_code=422, detail="Client email is required to send credentials")
        if payload.send_email and not password_changed:
            raise HTTPException(status_code=422, detail="Set or generate a new password before sending credentials")

        now = datetime.now(timezone.utc)
        updates = {
            "api_username": normalized_username,
            "updated_by": current_user.get("email", ""),
            "updated_at": now,
        }
        changed_fields = []
        if str(existing.get("api_username", "")).strip() != normalized_username:
            changed_fields.append("api_username")
        if password_changed:
            updates["api_password_hash"] = _pbkdf2_hash(issued_password)
            updates["api_password_plain"] = encrypt_secret(issued_password)
            updates["password_last_rotated_at"] = now
            updates["password_managed_by"] = current_user.get("email", "")
            changed_fields.append("api_password")

        await db.cms_clients.update_one({"_id": client_object_id}, {"$set": updates})

        email_sent = False
        email_error = ""
        if payload.send_email:
            try:
                await _send_credentials_email_async(
                    to_email=str(existing.get("email", "")).strip(),
                    client_name=str(existing.get("name", "")).strip(),
                    api_username=normalized_username,
                    api_password=issued_password,
                    api_domain=str(existing.get("api_domain", "")).strip(),
                )
                email_sent = True
            except Exception as exc:
                email_error = str(exc) or exc.__class__.__name__
                print(f"⚠️ Credentials updated but email send failed for client {client_id}: {email_error}")

        updated = await db.cms_clients.find_one({"_id": client_object_id})
        await log_cms_audit_event(
            db,
            action="update_api_client_credentials",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={
                "api_domain": str(existing.get("api_domain", "")).strip(),
                "api_username": normalized_username,
                "changed_fields": changed_fields or ["api_username"],
                "email_sent": email_sent,
            },
        )
        return {
            "success": True,
            "data": _serialize_client(updated, await _load_category_lookup(db)),
            "credentials": {
                "api_username": normalized_username,
                "generated_password": issued_password if password_changed else "",
                "email_sent": email_sent,
                "email_error": email_error,
            },
        }

    @router.get(
        "/{client_id}/api-credentials/reveal",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def reveal_api_client_password(
        client_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")
        if str(existing.get("source_type", "")).strip() != "api_basic":
            raise HTTPException(status_code=422, detail="Client is not an API client")
        plain = decrypt_secret(str(existing.get("api_password_plain", "") or ""))
        await log_cms_audit_event(
            db,
            action="reveal_api_client_password",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={
                "api_username": str(existing.get("api_username", "")).strip(),
                "has_plaintext": bool(plain),
            },
        )
        if not plain:
            return {
                "success": False,
                "detail": "Δεν υπάρχει αποθηκευμένος κωδικός για αυτόν τον πελάτη. Όρισε νέο κωδικό για να μπορείς να τον δεις στο μέλλον.",
                "password": "",
            }
        return {
            "success": True,
            "password": plain,
            "api_username": str(existing.get("api_username", "")).strip(),
        }

    @router.post(
        "/{client_id}/api-credentials/resend",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def resend_api_client_credentials(
        client_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")
        if str(existing.get("source_type", "")).strip() != "api_basic":
            raise HTTPException(status_code=422, detail="Client is not an API client")
        email = str(existing.get("email", "")).strip()
        if not email:
            raise HTTPException(status_code=422, detail="Ο πελάτης δεν έχει email")
        plain = decrypt_secret(str(existing.get("api_password_plain", "") or ""))
        if not plain:
            raise HTTPException(
                status_code=422,
                detail="Δεν υπάρχει αποθηκευμένος κωδικός — όρισε νέο για να μπορείς να τον αποστείλεις.",
            )
        email_sent = False
        email_error = ""
        try:
            await _send_credentials_email_async(
                to_email=email,
                client_name=str(existing.get("name", "")).strip(),
                api_username=str(existing.get("api_username", "")).strip(),
                api_password=plain,
                api_domain=str(existing.get("api_domain", "")).strip(),
            )
            email_sent = True
        except Exception as exc:
            email_error = str(exc) or exc.__class__.__name__
            print(f"⚠️ Resend credentials email failed for client {client_id}: {email_error}")
        await log_cms_audit_event(
            db,
            action="resend_api_client_credentials",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={
                "api_username": str(existing.get("api_username", "")).strip(),
                "email": email,
                "email_sent": email_sent,
                "email_error": email_error,
            },
        )
        return {"success": True, "email_sent": email_sent, "email_error": email_error, "email": email}

    @router.post(
        "/{client_id}/reset-trial-usage",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def reset_trial_usage(
        client_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")
        if not bool(existing.get("is_trial", False)):
            raise HTTPException(status_code=422, detail="Client is not a trial account")
        previous_count = int(existing.get("api_request_count", 0) or 0)
        await db.cms_clients.update_one(
            {"_id": client_object_id},
            {"$set": {"api_request_count": 0, "updated_at": datetime.now(timezone.utc), "updated_by": current_user.get("email", "")}},
        )
        await log_cms_audit_event(
            db,
            action="reset_trial_usage",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={"previous_count": previous_count, "api_username": str(existing.get("api_username", "")).strip()},
        )
        return {"success": True, "previous_count": previous_count, "current_count": 0}

    @router.post(
        "/bulk-delete",
        dependencies=[Depends(require_cms_permissions("clients.delete"))],
    )
    async def bulk_delete_clients(
        payload: BulkDeleteClientsPayload,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        object_ids: List[ObjectId] = []
        invalid: List[str] = []
        for cid in payload.client_ids:
            try:
                object_ids.append(ObjectId(cid))
            except Exception:
                invalid.append(cid)
        if not object_ids:
            raise HTTPException(status_code=422, detail="No valid client ids provided")
        existing_docs = await db.cms_clients.find(
            {"_id": {"$in": object_ids}},
            {"name": 1, "email": 1, "api_username": 1, "source_type": 1, "is_trial": 1},
        ).to_list(length=None)
        existing_ids = [d["_id"] for d in existing_docs]
        if not existing_ids:
            return {"success": True, "deleted_count": 0, "invalid_ids": invalid, "missing_ids": [str(oid) for oid in object_ids]}
        result = await db.cms_clients.delete_many({"_id": {"$in": existing_ids}})
        for doc in existing_docs:
            await log_cms_audit_event(
                db,
                action="bulk_delete_client",
                entity_type="client",
                entity_id=str(doc["_id"]),
                user=current_user,
                metadata={
                    "name": str(doc.get("name", "")).strip(),
                    "email": str(doc.get("email", "")).strip(),
                    "api_username": str(doc.get("api_username", "")).strip(),
                    "source_type": str(doc.get("source_type", "")).strip(),
                    "is_trial": bool(doc.get("is_trial", False)),
                },
            )
        return {
            "success": True,
            "deleted_count": int(result.deleted_count or 0),
            "invalid_ids": invalid,
            "missing_ids": [str(oid) for oid in object_ids if oid not in existing_ids],
        }

    @router.post(
        "/{client_id}/unlock",
        dependencies=[Depends(require_cms_permissions("clients.update"))],
    )
    async def unlock_client(
        client_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")
        await admin_unlock_account(db.cms_clients, client_object_id)
        await log_cms_audit_event(
            db,
            action="unlock_client",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={"api_username": str(existing.get("api_username", "")).strip()},
        )
        return {"success": True}

    @router.delete(
        "/{client_id}",
        dependencies=[Depends(require_cms_permissions("clients.delete"))],
    )
    async def delete_client(
        client_id: str,
        current_user: Dict[str, Any] = Depends(get_current_cms_user),
    ) -> Dict[str, Any]:
        client_object_id = _ensure_object_id(client_id)
        existing = await db.cms_clients.find_one({"_id": client_object_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Client not found")
        await db.cms_clients.delete_one({"_id": client_object_id})
        await log_cms_audit_event(
            db,
            action="delete_client",
            entity_type="client",
            entity_id=client_id,
            user=current_user,
            metadata={
                "name": str(existing.get("name", "")).strip(),
                "email": str(existing.get("email", "")).strip(),
                "api_username": str(existing.get("api_username", "")).strip(),
                "source_type": str(existing.get("source_type", "")).strip(),
                "is_trial": bool(existing.get("is_trial", False)),
            },
        )
        return {"success": True, "deleted_id": client_id}

    return router
