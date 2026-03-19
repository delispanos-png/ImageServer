from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timezone
from typing import Any, Dict, List


LEGACY_API_CLIENTS: List[Dict[str, str]] = [
    {
        "domain": "hellas-pharmacy",
        "username": "hellaspharmacy",
        "password": "Y9l0sz8p3CmNO5zkO144fOo1n7KhJrnE",
    },
    {
        "domain": "farmakeio-express",
        "username": "CloudOn",
        "password": "imageDB_password",
    },
]


def _pbkdf2_hash(password: str, salt: str | None = None, iterations: int = 390000) -> str:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    ).hex()
    return f"pbkdf2_sha256${iterations}${salt}${digest}"


def verify_api_client_password(password: str, stored_hash: str) -> bool:
    try:
        algorithm, iterations_str, salt, _digest = stored_hash.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        candidate = _pbkdf2_hash(password, salt=salt, iterations=int(iterations_str))
        return hmac.compare_digest(candidate, stored_hash)
    except Exception:
        return False


def generate_api_client_password(length: int = 20) -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*"
    return "".join(secrets.choice(alphabet) for _ in range(max(12, length)))


def build_api_client_key(client: Dict[str, Any]) -> str:
    domain = str(client.get("domain", "")).strip().lower()
    if domain:
        return f"legacy_basic:{domain}"
    return f"legacy_basic:{str(client.get('username', '')).strip().lower()}"


def build_legacy_username_key(client: Dict[str, Any]) -> str:
    return f"legacy_basic:{str(client.get('username', '')).strip().lower()}"


def resolve_request_ip(request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "").strip()
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client and request.client.host:
        return str(request.client.host).strip()
    return ""


async def sync_legacy_api_clients_to_cms(db) -> None:
    now = datetime.now(timezone.utc)
    for client in LEGACY_API_CLIENTS:
        api_client_key = build_api_client_key(client)
        existing = await db.cms_clients.find_one(
            {
                "$or": [
                    {"api_client_key": api_client_key},
                    {"api_client_key": build_legacy_username_key(client)},
                ]
            }
        )
        set_updates = {
            "name": client["domain"],
            "company": client["domain"],
            "source_type": "api_basic",
            "auth_provider": "legacy_basic",
            "api_client_key": api_client_key,
            "api_domain": client["domain"],
            "updated_at": now,
            "updated_by": "system:legacy_api_client_sync",
        }
        set_on_insert = {
            "email": "",
            "phone": "",
            "is_active": True,
            "receive_all_categories": False,
            "notes": "Auto-synced from legacy /api/products basic-auth client.",
            "category_ids": [],
            "api_request_count": 0,
            "api_username": client["username"],
            "api_password_hash": _pbkdf2_hash(client["password"]),
            "password_last_rotated_at": now,
            "password_managed_by": "system:legacy_api_client_sync",
            "created_at": now,
            "created_by": "system:legacy_api_client_sync",
        }
        if existing:
            if not str(existing.get("api_username", "")).strip():
                set_updates["api_username"] = client["username"]
            if not str(existing.get("api_password_hash", "")).strip():
                set_updates["api_password_hash"] = _pbkdf2_hash(client["password"])
                set_updates["password_last_rotated_at"] = now
                set_updates["password_managed_by"] = "system:legacy_api_client_sync"
            await db.cms_clients.update_one({"_id": existing["_id"]}, {"$set": set_updates})
        else:
            await db.cms_clients.update_one(
                {"api_client_key": api_client_key},
                {"$set": set_updates, "$setOnInsert": set_on_insert},
                upsert=True,
            )


async def track_api_client_usage(
    db,
    *,
    client: Dict[str, Any],
    request,
    endpoint: str,
    barcode_count: int,
) -> None:
    now = datetime.now(timezone.utc)
    api_client_key = build_api_client_key(client)
    request_ip = resolve_request_ip(request)
    user_agent = request.headers.get("user-agent", "").strip()
    origin = request.headers.get("origin", "").strip()
    referer = request.headers.get("referer", "").strip()
    host = request.headers.get("host", "").strip()

    await db.cms_clients.update_one(
        {"api_client_key": api_client_key},
        {
            "$setOnInsert": {
                "name": client.get("domain", "") or client.get("username", ""),
                "company": client.get("domain", ""),
                "email": "",
                "phone": "",
                "is_active": True,
                "receive_all_categories": False,
                "notes": "Auto-synced from legacy /api/products basic-auth client.",
                "category_ids": [],
                "created_at": now,
                "created_by": "system:api_usage_tracker",
            },
            "$set": {
                "updated_at": now,
                "updated_by": "system:api_usage_tracker",
                "last_api_access_at": now,
                "last_api_endpoint": endpoint,
                "last_api_ip": request_ip,
                "last_api_user_agent": user_agent,
                "last_api_origin": origin,
                "last_api_referer": referer,
                "last_api_host": host,
                "last_api_barcodes_count": int(max(0, barcode_count)),
                "api_domain": client.get("domain", ""),
                "api_username": client.get("username", ""),
                "source_type": "api_basic",
                "auth_provider": "legacy_basic",
            },
            "$inc": {"api_request_count": 1},
        },
        upsert=True,
    )

    cms_client = await db.cms_clients.find_one({"api_client_key": api_client_key}, {"_id": 1})
    await db.cms_client_api_events.insert_one(
        {
            "client_id": str(cms_client.get("_id")) if cms_client else "",
            "api_client_key": api_client_key,
            "api_username": client.get("username", ""),
            "api_domain": client.get("domain", ""),
            "endpoint": endpoint,
            "request_ip": request_ip,
            "origin": origin,
            "referer": referer,
            "host": host,
            "user_agent": user_agent,
            "barcodes_count": int(max(0, barcode_count)),
            "created_at": now,
        }
    )
