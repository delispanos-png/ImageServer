"""
Rate Limiter for Source Fetching

Implements token bucket algorithm for rate limiting with per-source configuration.
Prevents overwhelming sources with too many concurrent requests.
"""

from __future__ import annotations

import asyncio
import time
from collections import defaultdict
from dataclasses import dataclass
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


@dataclass
class RateLimitConfig:
    """Configuration for rate limiting"""

    # Requests allowed per minute
    requests_per_minute: int = 12

    # Maximum burst size (tokens in bucket)
    burst_size: int = 3

    # Maximum concurrent requests
    max_concurrent: int = 2


class TokenBucketRateLimiter:
    """
    Token bucket rate limiter implementation

    The token bucket algorithm allows for bursts of requests while maintaining
    an average rate limit over time.

    Example:
        - requests_per_minute=12 means 1 request per 5 seconds on average
        - burst_size=3 allows up to 3 rapid requests before rate limiting kicks in
        - Tokens refill at rate of 12/60 = 0.2 tokens per second
    """

    def __init__(
        self,
        source: str,
        requests_per_minute: int = 12,
        burst_size: int = 3
    ):
        """
        Initialize token bucket rate limiter

        Args:
            source: Source name (for logging)
            requests_per_minute: Maximum requests per minute
            burst_size: Maximum burst size (initial tokens)
        """
        self.source = source
        self.rate = requests_per_minute / 60.0  # Tokens per second
        self.capacity = burst_size
        self.tokens = float(burst_size)
        self.last_update = time.time()
        self.lock = asyncio.Lock()

        # Statistics
        self.total_requests = 0
        self.total_wait_time = 0.0
        self.max_wait_time = 0.0

        logger.info(
            "TokenBucketRateLimiter initialized for %s",
            source,
            extra={
                "source": source,
                "requests_per_minute": requests_per_minute,
                "burst_size": burst_size,
                "rate_per_second": self.rate,
            }
        )

    async def acquire(self, tokens: int = 1):
        """
        Acquire tokens (wait if necessary)

        Args:
            tokens: Number of tokens to acquire (default: 1)

        This method will block until enough tokens are available.
        """
        async with self.lock:
            while True:
                now = time.time()
                elapsed = now - self.last_update

                # Refill tokens based on elapsed time
                new_tokens = elapsed * self.rate
                self.tokens = min(
                    self.capacity,
                    self.tokens + new_tokens
                )
                self.last_update = now

                # Check if we have enough tokens
                if self.tokens >= tokens:
                    self.tokens -= tokens
                    self.total_requests += 1
                    return

                # Not enough tokens, calculate wait time
                needed = tokens - self.tokens
                wait_time = needed / self.rate

                # Track statistics
                self.total_wait_time += wait_time
                self.max_wait_time = max(self.max_wait_time, wait_time)

                logger.debug(
                    "Rate limit: waiting %0.2fs for %s",
                    wait_time,
                    self.source,
                    extra={
                        "source": self.source,
                        "tokens_available": self.tokens,
                        "tokens_needed": tokens,
                        "wait_seconds": wait_time,
                    }
                )

                await asyncio.sleep(wait_time)

    def get_stats(self) -> dict:
        """Get rate limiter statistics"""
        return {
            "source": self.source,
            "requests_per_minute": self.rate * 60,
            "burst_size": self.capacity,
            "current_tokens": self.tokens,
            "total_requests": self.total_requests,
            "total_wait_time": self.total_wait_time,
            "max_wait_time": self.max_wait_time,
            "avg_wait_time": self.total_wait_time / self.total_requests if self.total_requests > 0 else 0.0,
        }


class ConcurrencyLimiter:
    """
    Limits concurrent requests for a source

    Uses asyncio.Semaphore to limit the number of simultaneous requests.
    """

    def __init__(
        self,
        source: str,
        max_concurrent: int = 2
    ):
        """
        Initialize concurrency limiter

        Args:
            source: Source name (for logging)
            max_concurrent: Maximum concurrent requests
        """
        self.source = source
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)

        # Statistics
        self.total_acquired = 0
        self.current_active = 0
        self.max_active = 0

        logger.info(
            "ConcurrencyLimiter initialized for %s",
            source,
            extra={
                "source": source,
                "max_concurrent": max_concurrent,
            }
        )

    async def __aenter__(self):
        """Acquire semaphore"""
        await self.semaphore.acquire()
        self.total_acquired += 1
        self.current_active += 1
        self.max_active = max(self.max_active, self.current_active)

        logger.debug(
            "Concurrency limit acquired for %s (%d/%d active)",
            self.source,
            self.current_active,
            self.max_concurrent,
            extra={
                "source": self.source,
                "active": self.current_active,
                "max": self.max_concurrent,
            }
        )
        return self

    async def __aexit__(self, *args):
        """Release semaphore"""
        self.semaphore.release()
        self.current_active -= 1

        logger.debug(
            "Concurrency limit released for %s (%d/%d active)",
            self.source,
            self.current_active,
            self.max_concurrent,
            extra={
                "source": self.source,
                "active": self.current_active,
                "max": self.max_concurrent,
            }
        )

    def get_stats(self) -> dict:
        """Get concurrency limiter statistics"""
        return {
            "source": self.source,
            "max_concurrent": self.max_concurrent,
            "current_active": self.current_active,
            "max_active": self.max_active,
            "total_acquired": self.total_acquired,
        }


class SourceRateLimitManager:
    """
    Manages rate limiting and concurrency for all sources

    Combines token bucket rate limiting with concurrency limiting.
    """

    def __init__(self):
        """Initialize rate limit manager"""
        self._rate_limiters: Dict[str, TokenBucketRateLimiter] = {}
        self._concurrency_limiters: Dict[str, ConcurrencyLimiter] = {}
        self._configs: Dict[str, RateLimitConfig] = {}

        # Default configurations per source
        self._default_configs = {
            "farmakopoiosmou": RateLimitConfig(
                requests_per_minute=12,
                burst_size=3,
                max_concurrent=3
            ),
            "pharmacy295": RateLimitConfig(
                requests_per_minute=10,
                burst_size=2,
                max_concurrent=2
            ),
            "kpdhellas": RateLimitConfig(
                requests_per_minute=8,
                burst_size=2,
                max_concurrent=2
            ),
            "vita4you": RateLimitConfig(
                requests_per_minute=6,
                burst_size=1,
                max_concurrent=1  # Serial only (unstable source)
            ),
            "youpharmacy": RateLimitConfig(
                requests_per_minute=10,
                burst_size=2,
                max_concurrent=2
            ),
            "gohealthy": RateLimitConfig(
                requests_per_minute=10,
                burst_size=2,
                max_concurrent=2
            ),
            "cure4u": RateLimitConfig(
                requests_per_minute=10,
                burst_size=2,
                max_concurrent=2
            ),
            "tofarmakeiomou": RateLimitConfig(
                requests_per_minute=8,
                burst_size=2,
                max_concurrent=2
            ),
            "skroutz": RateLimitConfig(
                requests_per_minute=6,
                burst_size=1,
                max_concurrent=1
            ),
        }

        # Fallback default for unknown sources
        self._fallback_config = RateLimitConfig(
            requests_per_minute=6,
            burst_size=1,
            max_concurrent=1
        )

    def configure_source(
        self,
        source: str,
        requests_per_minute: Optional[int] = None,
        burst_size: Optional[int] = None,
        max_concurrent: Optional[int] = None
    ):
        """
        Configure rate limiting for a source

        Args:
            source: Source name
            requests_per_minute: Requests per minute (optional)
            burst_size: Burst size (optional)
            max_concurrent: Max concurrent requests (optional)
        """
        current_config = self._configs.get(
            source,
            self._default_configs.get(source, self._fallback_config)
        )

        new_config = RateLimitConfig(
            requests_per_minute=requests_per_minute or current_config.requests_per_minute,
            burst_size=burst_size or current_config.burst_size,
            max_concurrent=max_concurrent or current_config.max_concurrent
        )

        self._configs[source] = new_config

        # Recreate limiters if they exist
        if source in self._rate_limiters:
            self._rate_limiters[source] = TokenBucketRateLimiter(
                source,
                new_config.requests_per_minute,
                new_config.burst_size
            )

        if source in self._concurrency_limiters:
            self._concurrency_limiters[source] = ConcurrencyLimiter(
                source,
                new_config.max_concurrent
            )

        logger.info(
            "Configured rate limiting for %s",
            source,
            extra={
                "source": source,
                "requests_per_minute": new_config.requests_per_minute,
                "burst_size": new_config.burst_size,
                "max_concurrent": new_config.max_concurrent,
            }
        )

    def _get_rate_limiter(self, source: str) -> TokenBucketRateLimiter:
        """Get or create rate limiter for source"""
        if source not in self._rate_limiters:
            config = self._configs.get(
                source,
                self._default_configs.get(source, self._fallback_config)
            )
            self._rate_limiters[source] = TokenBucketRateLimiter(
                source,
                config.requests_per_minute,
                config.burst_size
            )
        return self._rate_limiters[source]

    def _get_concurrency_limiter(self, source: str) -> ConcurrencyLimiter:
        """Get or create concurrency limiter for source"""
        if source not in self._concurrency_limiters:
            config = self._configs.get(
                source,
                self._default_configs.get(source, self._fallback_config)
            )
            self._concurrency_limiters[source] = ConcurrencyLimiter(
                source,
                config.max_concurrent
            )
        return self._concurrency_limiters[source]

    async def acquire(self, source: str):
        """
        Acquire rate limit token for source

        Args:
            source: Source name

        This method will block until rate limit allows the request.
        """
        rate_limiter = self._get_rate_limiter(source)
        await rate_limiter.acquire()

    def get_concurrency_limiter(self, source: str) -> ConcurrencyLimiter:
        """
        Get concurrency limiter for source

        Args:
            source: Source name

        Returns:
            ConcurrencyLimiter instance (use as async context manager)
        """
        return self._get_concurrency_limiter(source)

    def get_all_stats(self) -> dict:
        """
        Get statistics for all sources

        Returns:
            Dictionary mapping source names to their stats
        """
        stats = {}

        # Combine rate limiter and concurrency limiter stats
        all_sources = set(self._rate_limiters.keys()) | set(self._concurrency_limiters.keys())

        for source in all_sources:
            source_stats = {}

            if source in self._rate_limiters:
                source_stats["rate_limiting"] = self._rate_limiters[source].get_stats()

            if source in self._concurrency_limiters:
                source_stats["concurrency"] = self._concurrency_limiters[source].get_stats()

            stats[source] = source_stats

        return stats


# Global instance
_rate_limit_manager = SourceRateLimitManager()


async def acquire_rate_limit(source: str):
    """
    Acquire rate limit for source

    Args:
        source: Source name
    """
    await _rate_limit_manager.acquire(source)


def get_concurrency_limiter(source: str) -> ConcurrencyLimiter:
    """
    Get concurrency limiter for source

    Args:
        source: Source name

    Returns:
        ConcurrencyLimiter instance
    """
    return _rate_limit_manager.get_concurrency_limiter(source)


def configure_source_rate_limit(
    source: str,
    requests_per_minute: Optional[int] = None,
    burst_size: Optional[int] = None,
    max_concurrent: Optional[int] = None
):
    """
    Configure rate limiting for source

    Args:
        source: Source name
        requests_per_minute: Requests per minute
        burst_size: Burst size
        max_concurrent: Max concurrent requests
    """
    _rate_limit_manager.configure_source(
        source,
        requests_per_minute,
        burst_size,
        max_concurrent
    )


def get_all_rate_limit_stats() -> dict:
    """
    Get rate limiting statistics for all sources

    Returns:
        Dictionary of statistics
    """
    return _rate_limit_manager.get_all_stats()
