"""
Sources Package - Advanced Source Management System

This package provides intelligent source management with:
- Retry mechanisms with exponential backoff
- Circuit breakers for failing sources
- Adaptive timeouts based on historical performance
- Rate limiting and concurrency control
- Health monitoring and metrics collection
"""

from sources.retry_manager import (
    FetchRetryManager,
    SourceFetchRetryWrapper,
    fetch_with_retry,
    RetryableError,
    PermanentError,
)

from sources.circuit_breaker import (
    CircuitBreaker,
    CircuitState,
    CircuitBreakerConfig,
    get_circuit_breaker,
    get_all_circuit_stats,
    configure_circuit_breaker,
)

from sources.timeout_manager import (
    AdaptiveTimeoutManager,
    get_timeout,
    record_success,
    record_failure,
    record_timeout,
    get_source_health,
    get_all_statistics as get_all_timeout_stats,
)

from sources.rate_limiter import (
    TokenBucketRateLimiter,
    ConcurrencyLimiter,
    RateLimitConfig,
    acquire_rate_limit,
    get_concurrency_limiter,
    configure_source_rate_limit,
    get_all_rate_limit_stats,
)

__all__ = [
    # Retry Manager
    "FetchRetryManager",
    "SourceFetchRetryWrapper",
    "fetch_with_retry",
    "RetryableError",
    "PermanentError",
    # Circuit Breaker
    "CircuitBreaker",
    "CircuitState",
    "CircuitBreakerConfig",
    "get_circuit_breaker",
    "get_all_circuit_stats",
    "configure_circuit_breaker",
    # Timeout Manager
    "AdaptiveTimeoutManager",
    "get_timeout",
    "record_success",
    "record_failure",
    "record_timeout",
    "get_source_health",
    "get_all_timeout_stats",
    # Rate Limiter
    "TokenBucketRateLimiter",
    "ConcurrencyLimiter",
    "RateLimitConfig",
    "acquire_rate_limit",
    "get_concurrency_limiter",
    "configure_source_rate_limit",
    "get_all_rate_limit_stats",
]

__version__ = "1.0.0"
