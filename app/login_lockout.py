"""Login lockout helpers shared between CMS admin auth and Portal client auth.

Rule: after MAX_FAILED_ATTEMPTS consecutive failures, the account is locked
for LOCKOUT_MINUTES. The lockout window auto-expires; a successful login
resets the counter.

Both `cms_users` and `cms_clients` documents are extended with:
  - failed_login_count : int   (0 when reset)
  - last_failed_login_at : ISO string
  - locked_until : ISO string | None  (None when not locked)
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, Request, status


MAX_FAILED_ATTEMPTS = 3
LOCKOUT_MINUTES = 15


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _parse_iso(value: Any) -> Optional[datetime]:
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    if isinstance(value, str) and value:
        try:
            ts = datetime.fromisoformat(value.replace("Z", "+00:00"))
            return ts if ts.tzinfo else ts.replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    return None


def _client_ip(request: Optional[Request]) -> str:
    if request is None:
        return ""
    if request.client and request.client.host:
        return request.client.host
    forwarded = request.headers.get("x-forwarded-for", "")
    return forwarded.split(",")[0].strip() if forwarded else ""


def is_account_locked(user_doc: Dict[str, Any]) -> Optional[datetime]:
    """Returns the UTC `locked_until` datetime if the account is currently locked, else None."""
    locked_until = _parse_iso(user_doc.get("locked_until"))
    if locked_until and locked_until > _utcnow():
        return locked_until
    return None


def raise_if_locked(user_doc: Dict[str, Any]) -> None:
    locked_until = is_account_locked(user_doc)
    if not locked_until:
        return
    minutes_left = max(1, int((locked_until - _utcnow()).total_seconds() / 60 + 0.5))
    raise HTTPException(
        status_code=status.HTTP_423_LOCKED,
        detail={
            "message": (
                f"Ο λογαριασμός είναι προσωρινά κλειδωμένος λόγω αποτυχημένων προσπαθειών "
                f"εισόδου. Δοκιμάστε ξανά σε {minutes_left} λεπτά."
            ),
            "locked_until": locked_until.isoformat(),
            "minutes_remaining": minutes_left,
        },
    )


async def record_failed_login(
    db,
    collection,
    user_doc: Dict[str, Any],
    *,
    kind: str,
    request: Optional[Request] = None,
    identifier: str = "",
) -> Dict[str, Any]:
    """Increment counter, lock account if threshold reached, alert if locked.

    Returns a small summary dict: {"locked": bool, "count": int, "locked_until": iso|None}.
    """
    now = _utcnow()
    new_count = int(user_doc.get("failed_login_count", 0) or 0) + 1
    update: Dict[str, Any] = {
        "failed_login_count": new_count,
        "last_failed_login_at": now.isoformat(),
    }
    locked = False
    locked_until: Optional[datetime] = None
    if new_count >= MAX_FAILED_ATTEMPTS:
        locked_until = now + timedelta(minutes=LOCKOUT_MINUTES)
        update["locked_until"] = locked_until.isoformat()
        locked = True

    await collection.update_one({"_id": user_doc["_id"]}, {"$set": update})

    if locked:
        ip = _client_ip(request)
        ua = request.headers.get("user-agent", "") if request else ""
        try:
            await db.cms_notification_events.insert_one({
                "item_id": "",
                "category_id": "",
                "event_type": "account_locked",
                "status": "pending",
                "payload": {
                    "title": "Λογαριασμός κλειδώθηκε λόγω αποτυχημένων logins",
                    "kind": kind,
                    "user_id": str(user_doc.get("_id", "")),
                    "identifier": identifier or str(
                        user_doc.get("email") or user_doc.get("api_username") or ""
                    ),
                    "failed_attempts": new_count,
                    "locked_until": locked_until.isoformat() if locked_until else None,
                    "locked_for_minutes": LOCKOUT_MINUTES,
                    "ip": ip,
                    "user_agent": ua,
                },
                "created_at": now.isoformat(),
                "published_at": None,
            })
        except Exception:
            pass

    return {
        "locked": locked,
        "count": new_count,
        "locked_until": locked_until.isoformat() if locked_until else None,
    }


async def record_successful_login(collection, user_doc: Dict[str, Any]) -> None:
    """Reset the failed-login counters on successful authentication."""
    if int(user_doc.get("failed_login_count", 0) or 0) == 0 and not user_doc.get("locked_until"):
        return
    await collection.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {"failed_login_count": 0, "locked_until": None}},
    )


async def admin_unlock_account(collection, user_id) -> bool:
    """Manually unlock — clears counter and lock window. Returns True if a doc was modified."""
    result = await collection.update_one(
        {"_id": user_id},
        {"$set": {"failed_login_count": 0, "locked_until": None}},
    )
    return result.modified_count > 0
