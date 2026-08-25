"""
Integrated Fetcher - All Protection Systems Combined

Example implementation showing how to use all protection mechanisms together:
- Retry with exponential backoff
- Circuit breaker protection
- Adaptive timeouts
- Rate limiting
- Health monitoring
- Metrics collection
"""

from __future__ import annotations

import time
from typing import Dict, Any, Optional
import logging

import aiohttp

from sources.retry_manager import SourceFetchRetryWrapper, RetryableError, PermanentError
from sources.circuit_breaker import get_circuit_breaker
from sources.timeout_manager import get_timeout, record_success, record_failure, record_timeout
from sources.rate_limiter import acquire_rate_limit, get_concurrency_limiter

logger = logging.getLogger(__name__)


class IntegratedSourceFetcher:
    """
    Source fetcher with all protection mechanisms integrated

    This class demonstrates the proper way to combine:
    - Retry logic
    - Circuit breakers
    - Adaptive timeouts
    - Rate limiting
    - Performance tracking
    """

    def __init__(self, source_name: str):
        """
        Initialize integrated fetcher

        Args:
            source_name: Name of the source
        """
        self.source_name = source_name
        self.retry_wrapper = SourceFetchRetryWrapper(source_name, max_attempts=3)
        self.logger = logging.getLogger(f"sources.{source_name}")

    async def fetch_with_all_protections(
        self,
        url: str,
        operation: str = "fetch",
        response_type: str = "json",
        **kwargs
    ) -> Any:
        """
        Fetch with all protection mechanisms

        Args:
            url: URL to fetch
            operation: Operation name for metrics
            response_type: "json" or "html"
            **kwargs: Additional arguments for aiohttp

        Returns:
            Parsed response (dict for JSON, str for HTML)

        Example:
            fetcher = IntegratedSourceFetcher("farmakopoiosmou")
            data = await fetcher.fetch_with_all_protections(
                "https://www.ofarmakopoiosmou.gr/instant-search?text=12345",
                operation="search",
                response_type="json"
            )
        """

        # 1. CHECK CIRCUIT BREAKER
        breaker = get_circuit_breaker(self.source_name)

        if not breaker.can_execute():
            self.logger.info(
                "Request blocked by circuit breaker",
                extra={
                    "source": self.source_name,
                    "operation": operation,
                    "circuit_state": breaker.get_state().value,
                }
            )
            return {} if response_type == "json" else ""

        # 2. ACQUIRE RATE LIMIT
        await acquire_rate_limit(self.source_name)

        # 3. GET ADAPTIVE TIMEOUT
        timeout_seconds = get_timeout(self.source_name, operation)

        # 4. USE CONCURRENCY LIMITER
        concurrency_limiter = get_concurrency_limiter(self.source_name)

        async with concurrency_limiter:
            # 5. EXECUTE WITH RETRY LOGIC AND TIMEOUT TRACKING
            start_time = time.time()

            try:
                timeout_obj = aiohttp.ClientTimeout(total=timeout_seconds)
                async with aiohttp.ClientSession(timeout=timeout_obj) as session:
                    # Use retry wrapper for the actual fetch
                    if response_type == "json":
                        result = await self.retry_wrapper.fetch_json(
                            url,
                            session,
                            **kwargs
                        )
                    else:
                        result = await self.retry_wrapper.fetch_html(
                            url,
                            session,
                            **kwargs
                        )

                    # 6. RECORD SUCCESS
                    duration = time.time() - start_time
                    record_success(self.source_name, operation, duration)
                    breaker.record_success()

                    self.logger.info(
                        "Fetch successful",
                        extra={
                            "source": self.source_name,
                            "operation": operation,
                            "url": url,
                            "duration": duration,
                            "timeout_used": timeout_seconds,
                        }
                    )

                    return result

            except asyncio.TimeoutError:
                # 7. RECORD TIMEOUT
                duration = time.time() - start_time
                record_timeout(self.source_name, operation, timeout_seconds)
                breaker.record_failure()

                self.logger.warning(
                    "Fetch timeout",
                    extra={
                        "source": self.source_name,
                        "operation": operation,
                        "url": url,
                        "timeout": timeout_seconds,
                        "duration": duration,
                    }
                )

                return {} if response_type == "json" else ""

            except PermanentError as exc:
                # 8. RECORD PERMANENT FAILURE (don't update circuit breaker)
                duration = time.time() - start_time
                record_failure(self.source_name, operation)

                self.logger.error(
                    "Permanent error",
                    extra={
                        "source": self.source_name,
                        "operation": operation,
                        "url": url,
                        "error": str(exc),
                        "duration": duration,
                    }
                )

                return {} if response_type == "json" else ""

            except Exception as exc:
                # 9. RECORD RETRYABLE FAILURE
                duration = time.time() - start_time
                record_failure(self.source_name, operation)
                breaker.record_failure()

                self.logger.error(
                    "Fetch failed",
                    extra={
                        "source": self.source_name,
                        "operation": operation,
                        "url": url,
                        "error": str(exc),
                        "error_type": type(exc).__name__,
                        "duration": duration,
                    },
                    exc_info=True
                )

                return {} if response_type == "json" else ""


# Convenience function for quick usage
async def fetch_from_source(
    source_name: str,
    url: str,
    operation: str = "fetch",
    response_type: str = "json",
    **kwargs
) -> Any:
    """
    Convenience function to fetch from source with all protections

    Args:
        source_name: Source name
        url: URL to fetch
        operation: Operation name
        response_type: "json" or "html"
        **kwargs: Additional aiohttp arguments

    Returns:
        Parsed response

    Example:
        data = await fetch_from_source(
            "farmakopoiosmou",
            "https://www.ofarmakopoiosmou.gr/instant-search?text=12345",
            operation="search",
            response_type="json"
        )
    """
    fetcher = IntegratedSourceFetcher(source_name)
    return await fetcher.fetch_with_all_protections(
        url,
        operation,
        response_type,
        **kwargs
    )


# Example usage for farmakopoiosmou
async def fetch_farmakopoiosmou_with_protections(barcode: str) -> Dict[str, Any]:
    """
    Example: Fetch from farmakopoiosmou with all protections

    This is how you should refactor existing fetch_from_farmakopoiosmou function.

    Args:
        barcode: Product barcode

    Returns:
        Product data dictionary
    """
    fetcher = IntegratedSourceFetcher("farmakopoiosmou")

    # Search via instant-search API
    search_url = f"https://www.ofarmakopoiosmou.gr/instant-search?text={barcode}"

    search_results = await fetcher.fetch_with_all_protections(
        url=search_url,
        operation="search",
        response_type="json",
        headers={
            "Accept": "application/json",
            "Referer": "https://www.ofarmakopoiosmou.gr/",
        }
    )

    if not search_results:
        logger.info(
            "No search results for barcode %s",
            barcode,
            extra={
                "source": "farmakopoiosmou",
                "barcode": barcode,
            }
        )
        return {}

    # Get first product URL
    products = search_results.get("products", [])
    if not products:
        return {}

    product_url = products[0].get("url")
    if not product_url:
        return {}

    # Fetch product details
    product_html = await fetcher.fetch_with_all_protections(
        url=product_url,
        operation="fetch_product",
        response_type="html",
        headers={
            "Accept": "text/html",
            "Referer": search_url,
        }
    )

    if not product_html:
        return {}

    # Parse HTML and extract product data
    # (existing parsing logic would go here)

    return {
        "Site": "farmakopoiosmou",
        "Barcode": barcode,
        "Product_Link": product_url,
        # ... other fields
    }


# Example: Batch processing with concurrent fetching
async def batch_fetch_with_protections(
    source_name: str,
    urls: list[str],
    operation: str = "fetch"
) -> list[Dict[str, Any]]:
    """
    Batch fetch multiple URLs with protections

    Rate limiting and concurrency limiting ensure we don't overwhelm the source.

    Args:
        source_name: Source name
        urls: List of URLs to fetch
        operation: Operation name

    Returns:
        List of results

    Example:
        urls = [
            "https://example.com/product/1",
            "https://example.com/product/2",
            "https://example.com/product/3",
        ]
        results = await batch_fetch_with_protections("example", urls, "fetch_product")
    """
    fetcher = IntegratedSourceFetcher(source_name)
    tasks = []

    for url in urls:
        task = fetcher.fetch_with_all_protections(
            url,
            operation=operation,
            response_type="json"
        )
        tasks.append(task)

    # Gather all results (rate limiting and concurrency handled automatically)
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Filter out exceptions
    return [
        result for result in results
        if isinstance(result, dict) and result
    ]
