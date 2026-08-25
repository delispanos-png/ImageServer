"""Webhook delivery for customer notifications.

When a barcode a customer asked for becomes available in db.products,
this module is called to fan out HTTP POST notifications to every
client that requested it. Delivery is async (fire-and-forget) with
retry-on-startup via the `webhook_outbox` collection.

Webhook payload format:
  {
    "event": "barcode.available",
    "barcode": "5201263890642",
    "product_url": "https://image.cloudon.gr/api/products",
    "title": "...",
    "image_url": "https://image.cloudon.gr/photos/5201263890642/1.jpg",
    "timestamp": "2026-05-19T12:34:56+00:00"
  }
"""
from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

import httpx


OUTBOX_COLLECTION = "webhook_outbox"
DEFAULT_TIMEOUT_SECONDS = 8.0
DEFAULT_MAX_RETRIES = 3


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sign_payload(secret: str, body: bytes) -> str:
    """HMAC-SHA256 signature; customers can verify with the shared secret."""
    return hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()


async def _post_one(
    url: str,
    body: bytes,
    *,
    secret: str = "",
    timeout: float = DEFAULT_TIMEOUT_SECONDS,
) -> Dict[str, Any]:
    headers = {
        "Content-Type": "application/json",
        "X-Cloudon-Event": "barcode.available",
        "X-Cloudon-Delivered-At": _utcnow_iso(),
    }
    if secret:
        headers["X-Cloudon-Signature"] = _sign_payload(secret, body)
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, content=body, headers=headers)
            return {
                "ok": 200 <= response.status_code < 300,
                "status_code": response.status_code,
                "body": response.text[:500],
            }
    except Exception as exc:
        return {"ok": False, "status_code": 0, "error": str(exc)}


async def _subscribers_for_barcode(db, barcode: str) -> List[Dict[str, Any]]:
    """Return cms_clients that asked for this barcode and have a webhook url.

    Cross-reference the missing_barcode_requests row (which lists client
    domains that asked) with cms_clients.webhook_url. Only clients that:
      - have webhook_url set
      - are active
      - are subscribed to 'barcode.available' (default: True if no list)
    are notified.
    """
    barcode = str(barcode or "").strip()
    if not barcode:
        return []
    entry = await db.missing_barcode_requests.find_one({"Barcode": barcode})
    if not entry:
        return []
    domains = list(entry.get("client_domains") or [])
    if not domains:
        return []
    subscribers: List[Dict[str, Any]] = []
    async for client in db.cms_clients.find(
        {
            "$or": [
                {"api_domain": {"$in": domains}},
                {"name": {"$in": domains}},
            ],
            "is_active": True,
            "webhook_url": {"$exists": True, "$ne": ""},
        },
        {
            "api_domain": 1,
            "name": 1,
            "webhook_url": 1,
            "webhook_secret": 1,
            "webhook_events": 1,
            "_id": 1,
        },
    ):
        events = client.get("webhook_events")
        if events and "barcode.available" not in events:
            continue
        subscribers.append(client)
    return subscribers


def _build_payload(barcode: str, product: Dict[str, Any]) -> Dict[str, Any]:
    base_url = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")
    image_url = ""
    if product.get("Image_Path"):
        image_url = f"{base_url.replace('/photos','/')}/{str(product['Image_Path']).lstrip('/')}"
    return {
        "event": "barcode.available",
        "barcode": barcode,
        "title": str(product.get("cms_title") or product.get("Title") or ""),
        "brand": str(product.get("Brand") or ""),
        "category_1": str(product.get("Category_1") or ""),
        "category_2": str(product.get("Category_2") or ""),
        "category_3": str(product.get("Category_3") or ""),
        "image_url": image_url or str(product.get("Img_src") or ""),
        "timestamp": _utcnow_iso(),
    }


async def notify_barcode_available(db, barcode: str) -> Dict[str, Any]:
    """Public entry point: notify all subscribers that a barcode is available.

    Returns delivery summary. Persists each attempt (success or failure)
    into webhook_outbox for retry / audit.
    """
    barcode = str(barcode or "").strip()
    if not barcode:
        return {"sent": 0, "failed": 0, "reason": "empty_barcode"}

    product = await db.products.find_one({"Barcode": barcode})
    if not product:
        return {"sent": 0, "failed": 0, "reason": "product_not_found"}

    subscribers = await _subscribers_for_barcode(db, barcode)
    if not subscribers:
        return {"sent": 0, "failed": 0, "reason": "no_subscribers"}

    payload = _build_payload(barcode, product)
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")

    sent = 0
    failed = 0
    for client in subscribers:
        webhook_url = str(client.get("webhook_url") or "").strip()
        if not webhook_url:
            continue
        secret = str(client.get("webhook_secret") or "")
        result = await _post_one(webhook_url, body, secret=secret)
        outbox_doc = {
            "client_id": str(client.get("_id") or ""),
            "client_domain": str(client.get("api_domain") or client.get("name") or ""),
            "webhook_url": webhook_url,
            "event": "barcode.available",
            "barcode": barcode,
            "payload": payload,
            "result": result,
            "attempts": 1,
            "delivered_at": _utcnow_iso() if result.get("ok") else None,
            "created_at": _utcnow_iso(),
        }
        await db[OUTBOX_COLLECTION].insert_one(outbox_doc)
        if result.get("ok"):
            sent += 1
        else:
            failed += 1
    return {"sent": sent, "failed": failed, "subscribers": len(subscribers)}


async def retry_failed_webhooks(db, *, max_age_hours: int = 24, max_retries: int = DEFAULT_MAX_RETRIES) -> Dict[str, int]:
    """Re-attempt deliveries that previously failed. Safe to run on a cron."""
    cutoff = datetime.now(timezone.utc).timestamp() - max_age_hours * 3600
    cutoff_iso = datetime.fromtimestamp(cutoff, tz=timezone.utc).isoformat()
    cursor = db[OUTBOX_COLLECTION].find({
        "delivered_at": None,
        "attempts": {"$lt": max_retries},
        "created_at": {"$gte": cutoff_iso},
    })
    retried = 0
    succeeded = 0
    async for entry in cursor:
        body = json.dumps(entry.get("payload") or {}, ensure_ascii=False).encode("utf-8")
        client = await db.cms_clients.find_one({"_id": entry.get("client_id")})
        secret = str((client or {}).get("webhook_secret") or "")
        result = await _post_one(entry["webhook_url"], body, secret=secret)
        retried += 1
        if result.get("ok"):
            succeeded += 1
            await db[OUTBOX_COLLECTION].update_one(
                {"_id": entry["_id"]},
                {"$set": {"delivered_at": _utcnow_iso(), "result": result},
                 "$inc": {"attempts": 1}},
            )
        else:
            await db[OUTBOX_COLLECTION].update_one(
                {"_id": entry["_id"]},
                {"$set": {"result": result}, "$inc": {"attempts": 1}},
            )
    return {"retried": retried, "succeeded": succeeded}
