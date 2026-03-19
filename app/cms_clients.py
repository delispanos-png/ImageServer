from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from cms_activity import log_cms_audit_event, serialize_datetime
from cms_client_services import normalize_client_services, validate_client_services
from cms_permissions import get_current_cms_user, require_cms_permissions
from api_clients import _pbkdf2_hash, generate_api_client_password
from client_credentials_mail import send_api_client_credentials_email


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


class ApiClientCredentialsPayload(BaseModel):
    api_username: str = Field(min_length=1, max_length=255)
    password: str = Field(default="", max_length=255)
    generate_password: bool = False
    send_email: bool = True


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
            "created_by": current_user.get("email", ""),
            "updated_by": current_user.get("email", ""),
            "created_at": now,
            "updated_at": now,
        }
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
            "updated_by": current_user.get("email", ""),
            "updated_at": datetime.now(timezone.utc),
        }
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
            updates["password_last_rotated_at"] = now
            updates["password_managed_by"] = current_user.get("email", "")
            changed_fields.append("api_password")

        await db.cms_clients.update_one({"_id": client_object_id}, {"$set": updates})

        email_sent = False
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
                raise HTTPException(status_code=500, detail=f"Credentials updated but email failed: {exc}") from exc

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
            },
        }

    return router
