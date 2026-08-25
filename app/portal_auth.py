from __future__ import annotations

import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel

from api_clients import resolve_request_ip, verify_api_client_password
from cms_activity import log_cms_audit_event
from login_lockout import (
    raise_if_locked,
    record_failed_login,
    record_successful_login,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _normalize_login(value: str) -> str:
    return str(value or "").strip().lower()


class PortalLoginRequest(BaseModel):
    login: str
    password: str


def _portal_actor_from_client(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "_id": str(doc.get("_id", "")),
        "email": str(doc.get("email", "")).strip(),
        "full_name": str(doc.get("name", "")).strip() or str(doc.get("company", "")).strip(),
    }


async def _load_assigned_categories(db, category_ids: list[str]) -> list[Dict[str, Any]]:
    normalized_ids = [value for value in category_ids if ObjectId.is_valid(value)]
    if not normalized_ids:
        return []
    docs = await db.cms_categories.find({"_id": {"$in": [ObjectId(value) for value in normalized_ids]}}).to_list(length=None)
    raw_lookup = {str(doc["_id"]): doc for doc in docs}
    serialized_lookup: Dict[str, Dict[str, Any]] = {}
    for category_id, doc in raw_lookup.items():
        path: list[str] = []
        visited: set[str] = set()
        current = doc
        while current:
            current_id = str(current.get("_id", ""))
            if not current_id or current_id in visited:
                break
            visited.add(current_id)
            name = str(current.get("name", "")).strip()
            if name:
                path.insert(0, name)
            parent_id = current.get("parent_id")
            current = raw_lookup.get(str(parent_id)) if parent_id else None
        serialized_lookup[category_id] = {
            "id": category_id,
            "label": " / ".join(path),
            "level": len(path) or 1,
            "category_1": path[0] if len(path) > 0 else "",
            "category_2": path[1] if len(path) > 1 else "",
            "category_3": path[2] if len(path) > 2 else "",
        }
    return [serialized_lookup[category_id] for category_id in category_ids if category_id in serialized_lookup]


async def _portal_client_payload(db, doc: Dict[str, Any]) -> Dict[str, Any]:
    category_ids = [
        str(category_id).strip()
        for category_id in doc.get("category_ids", [])
        if str(category_id).strip()
    ]
    assigned_categories = await _load_assigned_categories(db, category_ids)
    return {
        "id": str(doc.get("_id", "")),
        "name": str(doc.get("name", "")).strip(),
        "email": str(doc.get("email", "")).strip(),
        "company": str(doc.get("company", "")).strip(),
        "phone": str(doc.get("phone", "")).strip(),
        "api_username": str(doc.get("api_username", "")).strip(),
        "is_active": bool(doc.get("is_active", True)),
        "receive_all_categories": bool(doc.get("receive_all_categories", False)),
        "subscription_mode": "all_categories" if bool(doc.get("receive_all_categories", False)) else "selected_categories",
        "category_ids": category_ids,
        "assigned_categories": assigned_categories,
        "last_api_access_at": doc.get("last_api_access_at"),
        "last_api_endpoint": str(doc.get("last_api_endpoint", "")).strip(),
    }


def create_portal_auth_router(db) -> APIRouter:
    router = APIRouter(prefix="/portal/auth", tags=["portal-auth"])

    clients_collection = db.cms_clients
    sessions_collection = db.portal_sessions

    cookie_name = os.getenv("PORTAL_SESSION_COOKIE_NAME", "cloudon_portal_session")
    cookie_secure = os.getenv("PORTAL_SESSION_COOKIE_SECURE", "false").lower() == "true"
    session_days = int(os.getenv("PORTAL_SESSION_DAYS", "7"))

    async def _get_client_by_id(client_id: str) -> Optional[Dict[str, Any]]:
        if not ObjectId.is_valid(client_id):
            return None
        return await clients_collection.find_one({"_id": ObjectId(client_id)})

    async def _delete_session_by_token(token: str) -> None:
        await sessions_collection.delete_one({"token_hash": _sha256(token)})

    @router.post("/login")
    async def portal_login(payload: PortalLoginRequest, request: Request, response: Response) -> Dict[str, Any]:
        normalized_login = _normalize_login(payload.login)
        client_doc = await clients_collection.find_one(
            {
                "$or": [
                    {"api_username": normalized_login},
                    {"email": normalized_login},
                ]
            }
        )
        if not client_doc or not bool(client_doc.get("is_active", True)):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        raise_if_locked(client_doc)

        password_hash = str(client_doc.get("api_password_hash", "")).strip()
        if not password_hash or not verify_api_client_password(payload.password, password_hash):
            outcome = await record_failed_login(
                db, clients_collection, client_doc,
                kind="portal_client", request=request, identifier=normalized_login,
            )
            if outcome["locked"]:
                client_doc["locked_until"] = outcome["locked_until"]
                raise_if_locked(client_doc)
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        await record_successful_login(clients_collection, client_doc)

        token = secrets.token_urlsafe(48)
        now = _utcnow()
        await sessions_collection.insert_one(
            {
                "token_hash": _sha256(token),
                "client_id": str(client_doc.get("_id", "")),
                "created_at": now,
                "last_seen_at": now,
                "expires_at": now + timedelta(days=session_days),
                "ip": resolve_request_ip(request),
                "user_agent": request.headers.get("user-agent", "").strip(),
            }
        )

        await log_cms_audit_event(
            db,
            action="portal_login",
            entity_type="portal_session",
            entity_id=str(client_doc.get("_id", "")),
            user=_portal_actor_from_client(client_doc),
            metadata={
                "api_username": str(client_doc.get("api_username", "")).strip(),
                "ip": resolve_request_ip(request),
                "user_agent": request.headers.get("user-agent", "").strip(),
            },
        )

        response.set_cookie(
            key=cookie_name,
            value=token,
            httponly=True,
            samesite="lax",
            secure=cookie_secure,
            max_age=session_days * 24 * 60 * 60,
            path="/",
        )
        return {"success": True, "client": await _portal_client_payload(db, client_doc)}

    @router.post("/logout")
    async def portal_logout(request: Request, response: Response) -> Dict[str, Any]:
        token = request.cookies.get(cookie_name)
        client_doc: Optional[Dict[str, Any]] = None
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.removeprefix("Bearer ").strip()
        if token:
            session_doc = await sessions_collection.find_one({"token_hash": _sha256(token)})
            if session_doc:
                client_doc = await _get_client_by_id(str(session_doc.get("client_id", "")))
            await _delete_session_by_token(token)
        if client_doc:
            await log_cms_audit_event(
                db,
                action="portal_logout",
                entity_type="portal_session",
                entity_id=str(client_doc.get("_id", "")),
                user=_portal_actor_from_client(client_doc),
                metadata={"via": "portal_session_cookie"},
            )
        response.delete_cookie(cookie_name, path="/")
        return {"success": True}

    async def get_current_portal_client(request: Request) -> Dict[str, Any]:
        token = request.cookies.get(cookie_name)
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.removeprefix("Bearer ").strip()

        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

        session_doc = await sessions_collection.find_one({"token_hash": _sha256(token)})
        if not session_doc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

        expires_at = session_doc.get("expires_at")
        if isinstance(expires_at, datetime):
            expiry = expires_at if expires_at.tzinfo else expires_at.replace(tzinfo=timezone.utc)
            if expiry.astimezone(timezone.utc) < _utcnow():
                await sessions_collection.delete_one({"_id": session_doc["_id"]})
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")

        client_doc = await _get_client_by_id(str(session_doc.get("client_id", "")))
        if not client_doc or not bool(client_doc.get("is_active", True)):
            await sessions_collection.delete_one({"_id": session_doc["_id"]})
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Client unavailable")

        await sessions_collection.update_one(
            {"_id": session_doc["_id"]},
            {"$set": {"last_seen_at": _utcnow()}},
        )
        return client_doc

    @router.get("/me")
    async def portal_me(current_client: Dict[str, Any] = Depends(get_current_portal_client)) -> Dict[str, Any]:
        return {"success": True, "client": await _portal_client_payload(db, current_client)}

    router.get_current_portal_client = get_current_portal_client  # type: ignore[attr-defined]
    return router
