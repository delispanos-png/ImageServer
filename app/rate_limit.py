"""
Rate Limiting Middleware for CloudOn Platform
Protects API endpoints from abuse
"""

from fastapi import Request, HTTPException, status
from typing import Dict, Tuple
from datetime import datetime, timedelta
import asyncio
import base64
from collections import defaultdict


class RateLimiter:
    """
    In-memory rate limiter
    For production, consider using Redis-backed rate limiting
    """

    def __init__(self):
        # Store: {client_id: [(timestamp, count), ...]}
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = asyncio.Lock()

        # Rate limit rules (requests per minute)
        self.limits = {
            "trial": 30,  # Trial endpoint: 30 req/min per client
            "products": 120,  # Production /products & variants
            "cms": 240,  # CMS admin
            "portal": 100,  # Portal endpoints
            "default": 60,  # Default
        }

    def _basic_auth_username(self, request: Request) -> str:
        auth = request.headers.get("Authorization", "")
        if not auth.lower().startswith("basic "):
            return ""
        try:
            decoded = base64.b64decode(auth[6:].strip()).decode("utf-8", errors="ignore")
            return decoded.split(":", 1)[0].strip()
        except Exception:
            return ""

    def _get_client_identifier(self, request: Request) -> str:
        """
        Get unique client identifier.
        Priority: request.state user → Basic Auth username → IP address.
        """
        if hasattr(request.state, "user") and request.state.user:
            return f"user:{request.state.user.get('username', 'unknown')}"

        if hasattr(request.state, "api_client") and request.state.api_client:
            return f"api:{request.state.api_client.get('username', 'unknown')}"

        basic_user = self._basic_auth_username(request)
        if basic_user:
            return f"basic:{basic_user.lower()}"

        client_host = request.client.host if request.client else "unknown"
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_host = forwarded_for.split(",")[0].strip()

        return f"ip:{client_host}"

    def _get_limit_for_path(self, path: str) -> int:
        """Determine rate limit based on path"""
        # Most specific first
        if path == "/products/trial" or path.startswith("/products/trial/"):
            return self.limits["trial"]
        if path == "/products" or path == "/products_internal" or path.startswith("/products/"):
            return self.limits["products"]
        if path.startswith("/cms/"):
            return self.limits["cms"]
        if path.startswith("/portal/"):
            return self.limits["portal"]
        return self.limits["default"]

    async def check_rate_limit(self, request: Request) -> Tuple[bool, Dict]:
        """
        Check if request exceeds rate limit

        Returns:
            Tuple of (is_allowed: bool, info: dict)
        """
        client_id = self._get_client_identifier(request)
        limit = self._get_limit_for_path(request.url.path)
        now = datetime.now()
        window_start = now - timedelta(minutes=1)

        async with self.lock:
            # Clean old entries
            self.requests[client_id] = [
                timestamp for timestamp in self.requests[client_id]
                if timestamp > window_start
            ]

            # Count requests in current window
            current_count = len(self.requests[client_id])

            if current_count >= limit:
                return False, {
                    "client_id": client_id,
                    "limit": limit,
                    "current": current_count,
                    "reset_at": (window_start + timedelta(minutes=1)).isoformat()
                }

            # Add current request
            self.requests[client_id].append(now)

            return True, {
                "client_id": client_id,
                "limit": limit,
                "remaining": limit - current_count - 1,
                "current": current_count + 1
            }

    async def cleanup_old_entries(self):
        """
        Periodic cleanup of old entries
        Should be run as background task
        """
        while True:
            await asyncio.sleep(300)  # Run every 5 minutes
            now = datetime.now()
            cutoff = now - timedelta(minutes=5)

            async with self.lock:
                # Remove entries older than 5 minutes
                clients_to_remove = []
                for client_id, timestamps in self.requests.items():
                    self.requests[client_id] = [
                        ts for ts in timestamps if ts > cutoff
                    ]
                    if not self.requests[client_id]:
                        clients_to_remove.append(client_id)

                for client_id in clients_to_remove:
                    del self.requests[client_id]


# Global rate limiter instance
rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request, call_next):
    """
    Rate limiting middleware
    Add this to your FastAPI app
    """
    # Skip rate limiting for health checks
    if request.url.path.startswith("/health"):
        return await call_next(request)

    # Check rate limit
    allowed, info = await rate_limiter.check_rate_limit(request)

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "limit": info["limit"],
                "current": info["current"],
                "reset_at": info["reset_at"]
            },
            headers={
                "X-RateLimit-Limit": str(info["limit"]),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": info["reset_at"],
                "Retry-After": "60"
            }
        )

    # Add rate limit headers to response
    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(info["limit"])
    response.headers["X-RateLimit-Remaining"] = str(info["remaining"])

    return response


def start_cleanup_task():
    """
    Start background cleanup task
    Call this from your app startup event
    """
    asyncio.create_task(rate_limiter.cleanup_old_entries())
