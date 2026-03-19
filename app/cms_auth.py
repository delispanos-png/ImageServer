import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel
from cms_activity import log_cms_audit_event
from cms_permissions import (
    get_current_cms_user,
    get_permissions_for_role,
    normalize_cms_role,
    require_cms_permissions,
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _pbkdf2_hash(password: str, salt: Optional[str] = None, iterations: int = 390000) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    ).hex()
    return f"pbkdf2_sha256${iterations}${salt}${digest}"


def _verify_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations_str, salt, digest = stored_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = _pbkdf2_hash(password, salt=salt, iterations=int(iterations_str))
        return hmac.compare_digest(candidate, stored_hash)
    except Exception:
        return False


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


def create_cms_auth_router(db) -> APIRouter:
    router = APIRouter(prefix="/cms/auth", tags=["cms-auth"])

    users_collection = db.cms_users
    sessions_collection = db.cms_sessions
    reset_collection = db.cms_password_reset_tokens

    cookie_name = os.getenv("CMS_SESSION_COOKIE_NAME", "cloudon_cms_session")
    cookie_secure = os.getenv("CMS_SESSION_COOKIE_SECURE", "false").lower() == "true"
    session_days = int(os.getenv("CMS_SESSION_DAYS", "7"))
    reset_minutes = int(os.getenv("CMS_RESET_TOKEN_MINUTES", "60"))
    expose_reset_token = os.getenv("CMS_EXPOSE_RESET_TOKEN", "true").lower() == "true"

    async def _serialize_user(user_doc: Dict[str, Any]) -> Dict[str, Any]:
        role = normalize_cms_role(user_doc.get("role", "client"))
        return {
            "id": str(user_doc["_id"]),
            "email": user_doc["email"],
            "full_name": user_doc.get("full_name", ""),
            "role": role,
            "is_active": bool(user_doc.get("is_active", True)),
            "last_login_at": user_doc.get("last_login_at"),
            "permissions": get_permissions_for_role(role),
        }

    async def _get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        if not ObjectId.is_valid(user_id):
            return None
        return await users_collection.find_one({"_id": ObjectId(user_id)})

    async def _delete_session_by_token(token: str) -> None:
        await sessions_collection.delete_one({"token_hash": _sha256(token)})

    async def bootstrap_admin_user() -> None:
        admin_email = _normalize_email(os.getenv("CMS_ADMIN_EMAIL", "admin@cloudon.local"))
        admin_password = os.getenv("CMS_ADMIN_PASSWORD", "ChangeMe123!")
        admin_name = os.getenv("CMS_ADMIN_NAME", "Cloudon Admin")

        existing = await users_collection.find_one({"email": admin_email})
        if existing:
            return

        now = _utcnow()
        await users_collection.insert_one(
            {
                "email": admin_email,
                "password_hash": _pbkdf2_hash(admin_password),
                "full_name": admin_name,
                "role": normalize_cms_role("super_admin"),
                "is_active": True,
                "created_at": now,
                "updated_at": now,
                "last_login_at": None,
                "password_reset_required": admin_password == "ChangeMe123!",
            }
        )
        print(f"CMS bootstrap admin created for {admin_email}")

    @router.post("/login")
    async def login(payload: LoginRequest, request: Request, response: Response):
        email = _normalize_email(payload.email)
        user_doc = await users_collection.find_one({"email": email})
        if not user_doc or not user_doc.get("is_active", True):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not _verify_password(payload.password, user_doc.get("password_hash", "")):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        token = secrets.token_urlsafe(48)
        now = _utcnow()
        await sessions_collection.insert_one(
            {
                "token_hash": _sha256(token),
                "user_id": str(user_doc["_id"]),
                "created_at": now,
                "last_seen_at": now,
                "expires_at": now + timedelta(days=session_days),
                "ip": request.client.host if request.client else "",
                "user_agent": request.headers.get("user-agent", ""),
            }
        )

        await users_collection.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {"last_login_at": now, "updated_at": now}},
        )
        await log_cms_audit_event(
            db,
            action="login",
            entity_type="session",
            entity_id=str(user_doc["_id"]),
            user=user_doc,
            metadata={
                "ip": request.client.host if request.client else "",
                "user_agent": request.headers.get("user-agent", ""),
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
        return {"success": True, "user": await _serialize_user(user_doc)}

    @router.post("/logout")
    async def logout(request: Request, response: Response):
        token = request.cookies.get(cookie_name)
        user_doc: Optional[Dict[str, Any]] = None
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.removeprefix("Bearer ").strip()
        if token:
            session_doc = await sessions_collection.find_one({"token_hash": _sha256(token)})
            if session_doc:
                user_doc = await _get_user_by_id(str(session_doc.get("user_id", "")))
            await _delete_session_by_token(token)
        if user_doc:
            await log_cms_audit_event(
                db,
                action="logout",
                entity_type="session",
                entity_id=str(user_doc["_id"]),
                user=user_doc,
                metadata={"via": "session_cookie"},
            )
        response.delete_cookie(cookie_name, path="/")
        return {"success": True}

    @router.get("/me")
    async def me(current_user: Dict[str, Any] = Depends(get_current_cms_user)):
        return {"success": True, "user": await _serialize_user(current_user)}

    @router.get("/permissions")
    async def my_permissions(current_user: Dict[str, Any] = Depends(get_current_cms_user)):
        role = normalize_cms_role(current_user.get("role", "client"))
        return {
            "success": True,
            "role": role,
            "permissions": get_permissions_for_role(role),
        }

    @router.get("/role-catalog")
    async def role_catalog(_current_user: Dict[str, Any] = Depends(require_cms_permissions("roles.view"))):
        return {
            "success": True,
            "roles": {
                role: get_permissions_for_role(role)
                for role in ("super_admin", "admin", "editor", "client")
            },
        }

    @router.post("/forgot-password")
    async def forgot_password(payload: ForgotPasswordRequest):
        email = _normalize_email(payload.email)
        user_doc = await users_collection.find_one({"email": email, "is_active": True})
        if not user_doc:
            return {"success": True, "message": "If the account exists, a reset token has been issued."}

        raw_token = secrets.token_urlsafe(48)
        now = _utcnow()
        await reset_collection.insert_one(
            {
                "token_hash": _sha256(raw_token),
                "user_id": str(user_doc["_id"]),
                "created_at": now,
                "expires_at": now + timedelta(minutes=reset_minutes),
                "used_at": None,
            }
        )

        payload_out: Dict[str, Any] = {
            "success": True,
            "message": "If the account exists, a reset token has been issued.",
        }
        if expose_reset_token:
            payload_out["reset_token"] = raw_token
        return payload_out

    @router.post("/reset-password")
    async def reset_password(payload: ResetPasswordRequest):
        token_hash = _sha256(payload.token)
        reset_doc = await reset_collection.find_one({"token_hash": token_hash})
        if not reset_doc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
        if reset_doc.get("used_at"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token already used")
        expires_at = reset_doc.get("expires_at")
        if isinstance(expires_at, datetime) and expires_at < _utcnow():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token expired")

        user_doc = await _get_user_by_id(reset_doc.get("user_id", ""))
        if not user_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        now = _utcnow()
        await users_collection.update_one(
            {"_id": user_doc["_id"]},
            {
                "$set": {
                    "password_hash": _pbkdf2_hash(payload.password),
                    "updated_at": now,
                    "password_reset_required": False,
                }
            },
        )
        await reset_collection.update_one({"_id": reset_doc["_id"]}, {"$set": {"used_at": now}})
        await sessions_collection.delete_many({"user_id": str(user_doc["_id"])})
        return {"success": True}

    @router.post("/change-password")
    async def change_password(payload: ChangePasswordRequest, current_user: Dict[str, Any] = Depends(get_current_cms_user)):
        if not _verify_password(payload.current_password, current_user.get("password_hash", "")):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
        now = _utcnow()
        await users_collection.update_one(
            {"_id": current_user["_id"]},
            {
                "$set": {
                    "password_hash": _pbkdf2_hash(payload.new_password),
                    "updated_at": now,
                    "password_reset_required": False,
                }
            },
        )
        await sessions_collection.delete_many({"user_id": str(current_user["_id"])})
        return {"success": True}

    router.bootstrap_admin_user = bootstrap_admin_user  # type: ignore[attr-defined]
    return router
