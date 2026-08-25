from datetime import datetime, timezone
import hashlib
import os
from typing import Any, Dict, List, Optional

from bson import ObjectId
from fastapi import Depends, HTTPException, Request, status


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _coerce_utc_datetime(value: Any) -> Optional[datetime]:
    if not isinstance(value, datetime):
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def normalize_cms_role(role: Optional[str]) -> str:
    normalized = (role or "").strip().lower().replace(" ", "_")
    if normalized in {"super_admin", "admin", "editor", "client"}:
        return normalized
    return "client"


ALL_CMS_PERMISSIONS: List[str] = [
    "dashboard.view",
    "server.view",
    "sources.view",
    "sources.update",
    "sources.run",
    "items.view",
    "items.create",
    "items.update",
    "items.delete",
    "missing_barcodes.view",
    "missing_barcodes.update",
    "brand_queue.view",
    "brand_queue.update",
    "duplicates.view",
    "duplicates.update",
    "categories.view",
    "categories.create",
    "categories.update",
    "categories.delete",
    "clients.view",
    "clients.create",
    "clients.update",
    "clients.delete",
    "users.view",
    "users.create",
    "users.update",
    "users.delete",
    "roles.view",
    "roles.create",
    "roles.update",
    "roles.delete",
    "notifications.view",
    "notifications.publish",
    "audit.view",
    "settings.view",
    "settings.update",
]


ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "super_admin": ALL_CMS_PERMISSIONS[:],
    "admin": [
        "dashboard.view",
        "server.view",
        "sources.view",
        "sources.update",
        "sources.run",
        "items.view",
        "items.create",
        "items.update",
        "items.delete",
        "missing_barcodes.view",
        "missing_barcodes.update",
        "brand_queue.view",
        "brand_queue.update",
        "duplicates.view",
        "duplicates.update",
        "categories.view",
        "categories.create",
        "categories.update",
        "categories.delete",
        "clients.view",
        "clients.create",
        "clients.update",
        "clients.delete",
        "notifications.view",
        "notifications.publish",
        "settings.view",
        "settings.update",
    ],
    "editor": [
        "dashboard.view",
        "sources.view",
        "items.view",
        "items.update",
        "missing_barcodes.view",
        "missing_barcodes.update",
        "brand_queue.view",
        "brand_queue.update",
        "duplicates.view",
        "duplicates.update",
        "categories.view",
        "notifications.view",
        "notifications.publish",
        "settings.view",
    ],
    "client": [
        "dashboard.view",
        "notifications.view",
        "settings.view",
    ],
}


def get_permissions_for_role(role: Optional[str]) -> List[str]:
    normalized_role = normalize_cms_role(role)
    return ROLE_PERMISSIONS.get(normalized_role, ROLE_PERMISSIONS["client"])


def has_cms_permission(role: Optional[str], permission: str) -> bool:
    normalized_role = normalize_cms_role(role)
    if normalized_role == "super_admin":
        return True
    return permission in get_permissions_for_role(normalized_role)


async def get_current_cms_user(request: Request) -> Dict[str, Any]:
    db = getattr(request.app.state, "cms_db", None)
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="CMS database unavailable")

    cookie_name = os.getenv("CMS_SESSION_COOKIE_NAME", "cloudon_cms_session")
    token = request.cookies.get(cookie_name)
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.removeprefix("Bearer ").strip()

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    sessions_collection = db.cms_sessions
    users_collection = db.cms_users
    session_doc = await sessions_collection.find_one({"token_hash": _sha256(token)})
    if not session_doc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

    expires_at = _coerce_utc_datetime(session_doc.get("expires_at"))
    if expires_at and expires_at < _utcnow():
        await sessions_collection.delete_one({"_id": session_doc["_id"]})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")

    user_id = str(session_doc.get("user_id", ""))
    if not ObjectId.is_valid(user_id):
        await sessions_collection.delete_one({"_id": session_doc["_id"]})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable")

    user_doc = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user_doc or not user_doc.get("is_active", True):
        await sessions_collection.delete_one({"_id": session_doc["_id"]})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable")

    await sessions_collection.update_one(
        {"_id": session_doc["_id"]},
        {"$set": {"last_seen_at": _utcnow()}},
    )
    return user_doc


def require_cms_permissions(*permissions: str, require_all: bool = True):
    async def _dependency(current_user: Dict[str, Any] = Depends(get_current_cms_user)) -> Dict[str, Any]:
        user_role = normalize_cms_role(current_user.get("role"))
        if user_role == "super_admin":
            return current_user

        granted = set(get_permissions_for_role(user_role))
        required = set(permissions)
        if require_all:
            allowed = required.issubset(granted)
        else:
            allowed = bool(required & granted)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": "Insufficient permissions",
                    "required_permissions": sorted(required),
                    "granted_permissions": sorted(granted),
                },
            )

        return current_user

    return _dependency
