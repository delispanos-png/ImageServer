from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from cms_activity import log_cms_audit_event, serialize_datetime
from cms_auth import _pbkdf2_hash
from cms_permissions import normalize_cms_role
from cms_permissions import require_cms_permissions


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _normalize_email(value: str) -> str:
    return str(value or "").strip().lower()


class CmsUserCreatePayload(BaseModel):
    full_name: str
    email: str
    role: str
    password: str
    is_active: bool = True


class CmsUserUpdatePayload(BaseModel):
    full_name: str
    email: str
    role: str
    password: str = ""
    is_active: bool = True


def _serialize_user(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc.get("_id", "")),
        "email": str(doc.get("email", "")).strip(),
        "full_name": str(doc.get("full_name", "")).strip(),
        "role": str(doc.get("role", "")).strip(),
        "is_active": bool(doc.get("is_active", True)),
        "last_login_at": serialize_datetime(doc.get("last_login_at")),
        "created_at": serialize_datetime(doc.get("created_at")),
        "updated_at": serialize_datetime(doc.get("updated_at")),
        "password_reset_required": bool(doc.get("password_reset_required", False)),
    }


def create_cms_users_router(db):
    router = APIRouter(prefix="/cms/users", tags=["cms-users"])
    users_collection = db.cms_users

    @router.post(
        "",
        dependencies=[Depends(require_cms_permissions("users.create"))],
    )
    async def create_user(
        payload: CmsUserCreatePayload,
        current_user: Dict[str, Any] = Depends(require_cms_permissions("users.create")),
    ):
        full_name = str(payload.full_name or "").strip()
        email = _normalize_email(payload.email)
        role = normalize_cms_role(payload.role)
        password = str(payload.password or "")

        if not full_name:
            raise HTTPException(status_code=422, detail="Full name is required")
        if not email:
            raise HTTPException(status_code=422, detail="Email is required")
        if len(password) < 10:
            raise HTTPException(status_code=422, detail="Password must be at least 10 characters")

        existing = await users_collection.find_one({"email": email})
        if existing:
            raise HTTPException(status_code=409, detail="A user with this email already exists")

        now = _utcnow()
        user_doc = {
            "email": email,
            "password_hash": _pbkdf2_hash(password),
            "full_name": full_name,
            "role": role,
            "is_active": bool(payload.is_active),
            "created_at": now,
            "updated_at": now,
            "last_login_at": None,
            "password_reset_required": True,
        }
        result = await users_collection.insert_one(user_doc)
        created = await users_collection.find_one({"_id": result.inserted_id})
        await log_cms_audit_event(
            db,
            action="create_user",
            entity_type="cms_user",
            entity_id=str(result.inserted_id),
            user=current_user,
            metadata={
                "email": email,
                "role": role,
                "is_active": bool(payload.is_active),
            },
        )
        return {"success": True, "data": _serialize_user(created or user_doc)}

    @router.get(
        "",
        dependencies=[Depends(require_cms_permissions("users.view"))],
    )
    async def list_users(
        search: str = "",
        role_filter: str = "",
        status_filter: str = "all",
        page: int = 1,
        per_page: int = 20,
        sort_by: str = "updated_at",
        sort_order: str = "desc",
    ):
        page = max(page, 1)
        per_page = max(1, min(per_page, 100))

        query: Dict[str, Any] = {}
        if search.strip():
            pattern = {"$regex": search.strip(), "$options": "i"}
            query["$or"] = [
                {"email": pattern},
                {"full_name": pattern},
                {"role": pattern},
            ]

        if role_filter.strip():
            query["role"] = role_filter.strip()

        if status_filter == "active":
            query["is_active"] = True
        elif status_filter == "inactive":
            query["is_active"] = False

        sort_map = {
            "name": "full_name",
            "email": "email",
            "role": "role",
            "status": "is_active",
            "last_login_at": "last_login_at",
            "created_at": "created_at",
            "updated_at": "updated_at",
        }
        sort_field = sort_map.get(sort_by, "updated_at")
        sort_direction = -1 if sort_order == "desc" else 1

        total = await users_collection.count_documents(query)
        total_pages = max(1, (total + per_page - 1) // per_page)
        skip = (page - 1) * per_page

        docs = (
            await users_collection.find(query)
            .sort(sort_field, sort_direction)
            .skip(skip)
            .limit(per_page)
            .to_list(length=per_page)
        )

        return {
            "success": True,
            "data": [_serialize_user(doc) for doc in docs],
            "pagination": {
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages,
            },
        }

    @router.get(
        "/{user_id}",
        dependencies=[Depends(require_cms_permissions("users.view"))],
    )
    async def get_user(user_id: str):
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=404, detail="User not found")

        doc = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")

        return {"success": True, "data": _serialize_user(doc)}

    @router.put(
        "/{user_id}",
        dependencies=[Depends(require_cms_permissions("users.update"))],
    )
    async def update_user(
        user_id: str,
        payload: CmsUserUpdatePayload,
        current_user: Dict[str, Any] = Depends(require_cms_permissions("users.update")),
    ):
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=404, detail="User not found")

        existing = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="User not found")

        full_name = str(payload.full_name or "").strip()
        email = _normalize_email(payload.email)
        role = normalize_cms_role(payload.role)
        password = str(payload.password or "")

        if not full_name:
            raise HTTPException(status_code=422, detail="Full name is required")
        if not email:
            raise HTTPException(status_code=422, detail="Email is required")

        email_owner = await users_collection.find_one({"email": email, "_id": {"$ne": ObjectId(user_id)}})
        if email_owner:
            raise HTTPException(status_code=409, detail="A user with this email already exists")

        now = _utcnow()
        updates: Dict[str, Any] = {
            "full_name": full_name,
            "email": email,
            "role": role,
            "is_active": bool(payload.is_active),
            "updated_at": now,
        }
        if password:
            if len(password) < 10:
                raise HTTPException(status_code=422, detail="Password must be at least 10 characters")
            updates["password_hash"] = _pbkdf2_hash(password)
            updates["password_reset_required"] = True

        await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
        updated = await users_collection.find_one({"_id": ObjectId(user_id)})
        await log_cms_audit_event(
            db,
            action="update_user",
            entity_type="cms_user",
            entity_id=user_id,
            user=current_user,
            metadata={
                "email": email,
                "role": role,
                "is_active": bool(payload.is_active),
                "password_changed": bool(password),
            },
        )
        return {"success": True, "data": _serialize_user(updated or existing)}

    return router
