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


def normalize_allowed_ip_entry(raw: str) -> str:
    """Return a canonical form of one IP whitelist entry, or '' if invalid.

    Accepts:
      - IPv4 / IPv6 address:      "1.2.3.4"       -> "1.2.3.4"
      - CIDR block (any prefix):  "10.0.0.0/8"    -> "10.0.0.0/8"
      - Wrapped/paddedstrings are stripped. Anything unparseable returns "".
    """
    import ipaddress
    value = str(raw or "").strip()
    if not value:
        return ""
    try:
        if "/" in value:
            return str(ipaddress.ip_network(value, strict=False))
        return str(ipaddress.ip_address(value))
    except (ValueError, TypeError):
        return ""


def is_request_ip_allowed(request_ip: str, allowed_entries) -> bool:
    """Check whether request_ip matches any entry in allowed_entries.

    - Empty allowed_entries means "no whitelist configured" → allow all.
      Enforcement of "must be non-empty" happens at the caller (feature flag).
    - Entries may be single IPs or CIDR blocks (any format
      `normalize_allowed_ip_entry` produces).
    """
    import ipaddress
    if not allowed_entries:
        return True
    ip = str(request_ip or "").strip()
    if not ip:
        return False
    try:
        parsed_ip = ipaddress.ip_address(ip)
    except (ValueError, TypeError):
        return False
    for entry in allowed_entries:
        canonical = normalize_allowed_ip_entry(entry)
        if not canonical:
            continue
        try:
            if "/" in canonical:
                if parsed_ip in ipaddress.ip_network(canonical, strict=False):
                    return True
            else:
                if parsed_ip == ipaddress.ip_address(canonical):
                    return True
        except (ValueError, TypeError):
            continue
    return False


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

    cms_client_id = client.get("cms_client_id")
    set_fields = {
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
    }

    if cms_client_id is not None:
        await db.cms_clients.update_one(
            {"_id": cms_client_id},
            {
                "$set": {**set_fields, "api_client_key": api_client_key},
            },
        )
    else:
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
                    "api_request_count": 0,
                },
                "$set": {
                    **set_fields,
                    "api_domain": client.get("domain", ""),
                    "api_username": client.get("username", ""),
                    "source_type": "api_basic",
                    "auth_provider": "legacy_basic",
                },
            },
            upsert=True,
        )

    cms_client = (
        await db.cms_clients.find_one({"_id": cms_client_id}, {"_id": 1})
        if cms_client_id is not None
        else await db.cms_clients.find_one({"api_client_key": api_client_key}, {"_id": 1})
    )
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
