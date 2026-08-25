"""
Retry Manager for Source Fetching

Provides intelligent retry mechanisms with exponential backoff for source fetching operations.
Handles transient failures, rate limiting, and service unavailability.
"""

from __future__ import annotations

import asyncio
from typing import Any, Callable, TypeVar
import logging

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log,
    after_log,
    RetryError,
)
import aiohttp

# Configure logging
logger = logging.getLogger(__name__)

# Type variable for generic return type
T = TypeVar("T")


class RetryableError(Exception):
    """Exception that should trigger a retry"""
    pass


class PermanentError(Exception):
    """Exception that should NOT trigger a retry"""
    pass


def is_retryable_http_status(status: int) -> bool:
    """
    Check if HTTP status code should trigger retry

    Retryable statuses:
    - 429: Rate limited (Too Many Requests)
    - 502: Bad Gateway (temporary proxy/gateway error)
    - 503: Service Unavailable
    - 504: Gateway Timeout

    Args:
        status: HTTP status code

    Returns:
        True if status should trigger retry
    """
    return status in {429, 502, 503, 504}


def is_permanent_http_status(status: int) -> bool:
    """
    Check if HTTP status code indicates permanent failure

    Permanent failures (don't retry):
    - 400: Bad Request
    - 401: Unauthorized
    - 403: Forbidden
    - 404: Not Found
    - 410: Gone

    Args:
        status: HTTP status code

    Returns:
        True if status indicates permanent failure
    """
    return status in {400, 401, 403, 404, 410}


async def handle_rate_limit_response(response: aiohttp.ClientResponse) -> None:
    """
    Handle rate limit response by waiting for the specified duration

    Args:
        response: HTTP response with rate limit info

    Raises:
        RetryableError: After waiting for rate limit duration
    """
    retry_after = response.headers.get("Retry-After", "60")

    try:
        # Retry-After can be seconds or HTTP date
        wait_seconds = int(retry_after)
    except ValueError:
        # If it's a date, default to 60 seconds
        wait_seconds = 60

    # Cap wait time at 5 minutes
    wait_seconds = min(wait_seconds, 300)

    logger.warning(
        "Rate limited, waiting %d seconds before retry",
        wait_seconds,
        extra={
            "retry_after": retry_after,
            "wait_seconds": wait_seconds,
        }
    )

    await asyncio.sleep(wait_seconds)
    raise RetryableError(f"Rate limited, retried after {wait_seconds}s")


class FetchRetryManager:
    """
    Manages retry logic for source fetching operations

    Features:
    - Exponential backoff (2s, 4s, 8s, 16s, 32s, 60s)
    - Configurable max attempts (default: 3)
    - Handles transient network errors
    - Handles rate limiting
    - Distinguishes permanent vs retryable errors
    """

    def __init__(
        self,
        max_attempts: int = 3,
        min_wait_seconds: float = 2.0,
        max_wait_seconds: float = 60.0,
    ):
        """
        Initialize retry manager

        Args:
            max_attempts: Maximum number of retry attempts
            min_wait_seconds: Minimum wait time between retries
            max_wait_seconds: Maximum wait time between retries
        """
        self.max_attempts = max_attempts
        self.min_wait_seconds = min_wait_seconds
        self.max_wait_seconds = max_wait_seconds

    def create_retry_decorator(self, operation_name: str = "fetch"):
        """
        Create a retry decorator for async functions

        Args:
            operation_name: Name of operation for logging

        Returns:
            Tenacity retry decorator configured for this manager
        """
        return retry(
            stop=stop_after_attempt(self.max_attempts),
            wait=wait_exponential(
                multiplier=1,
                min=self.min_wait_seconds,
                max=self.max_wait_seconds
            ),
            retry=retry_if_exception_type((
                RetryableError,
                aiohttp.ClientError,
                asyncio.TimeoutError,
            )),
            before_sleep=before_sleep_log(logger, logging.WARNING),
            after=after_log(logger, logging.DEBUG),
            reraise=True,
        )

    async def fetch_with_retry(
        self,
        fetch_func: Callable[..., T],
        *args,
        operation_name: str = "fetch",
        **kwargs
    ) -> T:
        """
        Execute fetch function with retry logic

        Args:
            fetch_func: Async function to execute
            *args: Positional arguments for fetch_func
            operation_name: Name of operation for logging
            **kwargs: Keyword arguments for fetch_func

        Returns:
            Result from fetch_func

        Raises:
            RetryError: If all retry attempts fail
            PermanentError: If permanent error encountered
        """
        retry_decorator = self.create_retry_decorator(operation_name)
        retryable_func = retry_decorator(fetch_func)

        try:
            return await retryable_func(*args, **kwargs)
        except RetryError as exc:
            # All retries exhausted
            logger.error(
                "All retry attempts exhausted for %s",
                operation_name,
                extra={
                    "operation": operation_name,
                    "attempts": self.max_attempts,
                    "last_exception": str(exc.last_attempt.exception()),
                }
            )
            raise
        except PermanentError:
            # Don't retry permanent errors
            raise


class SourceFetchRetryWrapper:
    """
    Wrapper for source fetch operations with built-in retry logic

    Example usage:
        wrapper = SourceFetchRetryWrapper(source_name="farmakopoiosmou")
        result = await wrapper.fetch_json(url, session)
    """

    def __init__(
        self,
        source_name: str,
        max_attempts: int = 3,
    ):
        """
        Initialize wrapper for a specific source

        Args:
            source_name: Name of the source (for logging)
            max_attempts: Maximum retry attempts
        """
        self.source_name = source_name
        self.retry_manager = FetchRetryManager(max_attempts=max_attempts)
        self.logger = logging.getLogger(f"sources.{source_name}")

    async def fetch_json(
        self,
        url: str,
        session: aiohttp.ClientSession,
        **kwargs
    ) -> dict[str, Any]:
        """
        Fetch JSON with retry logic

        Args:
            url: URL to fetch
            session: aiohttp session
            **kwargs: Additional arguments for session.get()

        Returns:
            Parsed JSON response

        Raises:
            RetryError: If all attempts fail
            PermanentError: If permanent error encountered
        """
        async def _fetch() -> dict[str, Any]:
            async with session.get(url, **kwargs) as response:
                # Check for rate limiting
                if response.status == 429:
                    await handle_rate_limit_response(response)

                # Check for permanent errors
                if is_permanent_http_status(response.status):
                    self.logger.error(
                        "Permanent HTTP error %d for %s",
                        response.status,
                        url,
                        extra={
                            "source": self.source_name,
                            "status": response.status,
                            "url": url,
                        }
                    )
                    raise PermanentError(f"HTTP {response.status}")

                # Check for retryable errors
                if is_retryable_http_status(response.status):
                    self.logger.warning(
                        "Retryable HTTP error %d for %s",
                        response.status,
                        url,
                        extra={
                            "source": self.source_name,
                            "status": response.status,
                            "url": url,
                        }
                    )
                    raise RetryableError(f"HTTP {response.status}")

                # Success path
                if response.status != 200:
                    self.logger.warning(
                        "Unexpected HTTP status %d for %s",
                        response.status,
                        url,
                        extra={
                            "source": self.source_name,
                            "status": response.status,
                            "url": url,
                        }
                    )
                    return {}

                try:
                    return await response.json()
                except Exception as exc:
                    self.logger.error(
                        "JSON parse error for %s: %s",
                        url,
                        exc,
                        extra={
                            "source": self.source_name,
                            "url": url,
                            "error": str(exc),
                        }
                    )
                    raise RetryableError(f"JSON parse failed: {exc}")

        return await self.retry_manager.fetch_with_retry(
            _fetch,
            operation_name=f"{self.source_name}_fetch_json"
        )

    async def fetch_html(
        self,
        url: str,
        session: aiohttp.ClientSession,
        **kwargs
    ) -> str:
        """
        Fetch HTML with retry logic

        Args:
            url: URL to fetch
            session: aiohttp session
            **kwargs: Additional arguments for session.get()

        Returns:
            HTML text response

        Raises:
            RetryError: If all attempts fail
            PermanentError: If permanent error encountered
        """
        async def _fetch() -> str:
            async with session.get(url, **kwargs) as response:
                # Check for rate limiting
                if response.status == 429:
                    await handle_rate_limit_response(response)

                # Check for permanent errors
                if is_permanent_http_status(response.status):
                    raise PermanentError(f"HTTP {response.status}")

                # Check for retryable errors
                if is_retryable_http_status(response.status):
                    raise RetryableError(f"HTTP {response.status}")

                # Success path
                if response.status != 200:
                    self.logger.warning(
                        "Non-200 status for HTML fetch: %d",
                        response.status,
                        extra={
                            "source": self.source_name,
                            "status": response.status,
                            "url": url,
                        }
                    )
                    return ""

                try:
                    return await response.text()
                except Exception as exc:
                    self.logger.error(
                        "HTML decode error for %s: %s",
                        url,
                        exc,
                        extra={
                            "source": self.source_name,
                            "url": url,
                            "error": str(exc),
                        }
                    )
                    raise RetryableError(f"HTML decode failed: {exc}")

        return await self.retry_manager.fetch_with_retry(
            _fetch,
            operation_name=f"{self.source_name}_fetch_html"
        )


# Convenience function for quick usage
async def fetch_with_retry(
    url: str,
    session: aiohttp.ClientSession,
    source_name: str = "unknown",
    response_type: str = "json",
    max_attempts: int = 3,
    **kwargs
) -> Any:
    """
    Convenience function to fetch with retry logic

    Args:
        url: URL to fetch
        session: aiohttp session
        source_name: Name of source (for logging)
        response_type: "json" or "html"
        max_attempts: Maximum retry attempts
        **kwargs: Additional arguments for session.get()

    Returns:
        Parsed response (dict for JSON, str for HTML)

    Example:
        async with aiohttp.ClientSession() as session:
            data = await fetch_with_retry(
                url="https://example.com/api/data",
                session=session,
                source_name="example",
                response_type="json"
            )
    """
    wrapper = SourceFetchRetryWrapper(
        source_name=source_name,
        max_attempts=max_attempts
    )

    if response_type == "json":
        return await wrapper.fetch_json(url, session, **kwargs)
    elif response_type == "html":
        return await wrapper.fetch_html(url, session, **kwargs)
    else:
        raise ValueError(f"Unsupported response_type: {response_type}")
