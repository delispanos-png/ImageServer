"""
Circuit Breaker Pattern for Source Protection

Prevents cascading failures by temporarily disabling sources that are experiencing issues.
Implements the Circuit Breaker pattern with CLOSED, OPEN, and HALF_OPEN states.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from enum import Enum
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class CircuitState(Enum):
    """Circuit breaker states"""
    CLOSED = "closed"  # Normal operation, requests allowed
    OPEN = "open"  # Failures detected, requests blocked
    HALF_OPEN = "half_open"  # Testing if source recovered


@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker behavior"""

    # Failures before opening circuit
    failure_threshold: int = 5

    # Successes needed to close from half-open
    success_threshold: int = 2

    # Seconds before trying again after opening
    timeout_seconds: int = 60

    # Maximum test calls allowed in half-open state
    half_open_max_calls: int = 3


class CircuitBreakerStats:
    """Statistics for circuit breaker"""

    def __init__(self):
        self.total_calls = 0
        self.successful_calls = 0
        self.failed_calls = 0
        self.rejected_calls = 0
        self.state_changes = 0
        self.last_state_change_time = 0.0
        self.total_open_time = 0.0

    def record_call(self):
        """Record a call attempt"""
        self.total_calls += 1

    def record_success(self):
        """Record successful call"""
        self.successful_calls += 1

    def record_failure(self):
        """Record failed call"""
        self.failed_calls += 1

    def record_rejection(self):
        """Record rejected call (circuit open)"""
        self.rejected_calls += 1

    def record_state_change(self):
        """Record state change"""
        self.state_changes += 1
        self.last_state_change_time = time.time()

    def get_success_rate(self) -> float:
        """Get success rate (0.0 - 1.0)"""
        total_executed = self.successful_calls + self.failed_calls
        if total_executed == 0:
            return 0.0
        return self.successful_calls / total_executed

    def get_stats_dict(self) -> dict:
        """Get statistics as dictionary"""
        return {
            "total_calls": self.total_calls,
            "successful_calls": self.successful_calls,
            "failed_calls": self.failed_calls,
            "rejected_calls": self.rejected_calls,
            "state_changes": self.state_changes,
            "success_rate": self.get_success_rate(),
        }


class CircuitBreaker:
    """
    Circuit Breaker implementation for source protection

    States:
    - CLOSED: Normal operation, all requests allowed
    - OPEN: Too many failures, all requests blocked
    - HALF_OPEN: Testing recovery, limited requests allowed

    Transitions:
    - CLOSED → OPEN: After failure_threshold failures
    - OPEN → HALF_OPEN: After timeout_seconds elapsed
    - HALF_OPEN → CLOSED: After success_threshold successes
    - HALF_OPEN → OPEN: On any failure in half-open state
    """

    def __init__(
        self,
        source: str,
        config: Optional[CircuitBreakerConfig] = None
    ):
        """
        Initialize circuit breaker for a source

        Args:
            source: Source name
            config: Circuit breaker configuration (uses defaults if None)
        """
        self.source = source
        self.config = config or CircuitBreakerConfig()
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0.0
        self.opened_at = 0.0
        self.half_open_calls = 0
        self.stats = CircuitBreakerStats()

        logger.info(
            "Circuit breaker initialized for %s",
            source,
            extra={
                "source": source,
                "config": {
                    "failure_threshold": self.config.failure_threshold,
                    "success_threshold": self.config.success_threshold,
                    "timeout_seconds": self.config.timeout_seconds,
                }
            }
        )

    def can_execute(self) -> bool:
        """
        Check if request can proceed

        Returns:
            True if request should be allowed, False otherwise
        """
        self.stats.record_call()

        if self.state == CircuitState.CLOSED:
            # Normal operation
            return True

        if self.state == CircuitState.OPEN:
            # Check if timeout has passed
            elapsed = time.time() - self.opened_at

            if elapsed >= self.config.timeout_seconds:
                # Transition to HALF_OPEN
                logger.info(
                    "Circuit breaker transitioning OPEN → HALF_OPEN for %s",
                    self.source,
                    extra={
                        "source": self.source,
                        "elapsed_seconds": elapsed,
                        "timeout_seconds": self.config.timeout_seconds,
                    }
                )
                self._transition_to_half_open()
                return True
            else:
                # Still in timeout period
                self.stats.record_rejection()
                logger.debug(
                    "Circuit breaker rejecting request (OPEN) for %s",
                    self.source,
                    extra={
                        "source": self.source,
                        "remaining_seconds": self.config.timeout_seconds - elapsed,
                    }
                )
                return False

        if self.state == CircuitState.HALF_OPEN:
            # Allow limited test calls
            if self.half_open_calls < self.config.half_open_max_calls:
                self.half_open_calls += 1
                logger.debug(
                    "Circuit breaker allowing test call (%d/%d) for %s",
                    self.half_open_calls,
                    self.config.half_open_max_calls,
                    self.source,
                    extra={
                        "source": self.source,
                        "test_call": self.half_open_calls,
                        "max_test_calls": self.config.half_open_max_calls,
                    }
                )
                return True
            else:
                # Max test calls reached
                self.stats.record_rejection()
                logger.debug(
                    "Circuit breaker rejecting request (HALF_OPEN limit) for %s",
                    self.source,
                    extra={
                        "source": self.source,
                        "test_calls_exhausted": self.half_open_calls,
                    }
                )
                return False

        return False

    def record_success(self):
        """Record successful request"""
        self.stats.record_success()

        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            logger.info(
                "Circuit breaker success in HALF_OPEN (%d/%d) for %s",
                self.success_count,
                self.config.success_threshold,
                self.source,
                extra={
                    "source": self.source,
                    "success_count": self.success_count,
                    "threshold": self.config.success_threshold,
                }
            )

            if self.success_count >= self.config.success_threshold:
                # Enough successes, close the circuit
                logger.info(
                    "Circuit breaker transitioning HALF_OPEN → CLOSED for %s",
                    self.source,
                    extra={
                        "source": self.source,
                        "success_count": self.success_count,
                    }
                )
                self._transition_to_closed()

        elif self.state == CircuitState.CLOSED:
            # Reset failure count on success in CLOSED state
            if self.failure_count > 0:
                logger.debug(
                    "Circuit breaker resetting failure count for %s",
                    self.source,
                    extra={
                        "source": self.source,
                        "previous_failures": self.failure_count,
                    }
                )
                self.failure_count = 0

    def record_failure(self):
        """Record failed request"""
        self.stats.record_failure()
        self.last_failure_time = time.time()

        if self.state == CircuitState.HALF_OPEN:
            # Any failure in half-open → open again
            logger.warning(
                "Circuit breaker transitioning HALF_OPEN → OPEN (failure) for %s",
                self.source,
                extra={
                    "source": self.source,
                }
            )
            self._transition_to_open()

        elif self.state == CircuitState.CLOSED:
            self.failure_count += 1
            logger.warning(
                "Circuit breaker failure (%d/%d) for %s",
                self.failure_count,
                self.config.failure_threshold,
                self.source,
                extra={
                    "source": self.source,
                    "failure_count": self.failure_count,
                    "threshold": self.config.failure_threshold,
                }
            )

            if self.failure_count >= self.config.failure_threshold:
                # Too many failures, open the circuit
                logger.error(
                    "Circuit breaker transitioning CLOSED → OPEN (threshold) for %s",
                    self.source,
                    extra={
                        "source": self.source,
                        "failure_count": self.failure_count,
                    }
                )
                self._transition_to_open()

    def _transition_to_closed(self):
        """Transition to CLOSED state"""
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.half_open_calls = 0
        self.stats.record_state_change()

        # Track total open time
        if self.opened_at > 0:
            self.stats.total_open_time += time.time() - self.opened_at
            self.opened_at = 0.0

    def _transition_to_open(self):
        """Transition to OPEN state"""
        self.state = CircuitState.OPEN
        self.opened_at = time.time()
        self.success_count = 0
        self.half_open_calls = 0
        self.stats.record_state_change()

    def _transition_to_half_open(self):
        """Transition to HALF_OPEN state"""
        self.state = CircuitState.HALF_OPEN
        self.half_open_calls = 0
        self.success_count = 0
        self.stats.record_state_change()

    def get_state(self) -> CircuitState:
        """Get current state"""
        return self.state

    def get_stats(self) -> dict:
        """
        Get circuit breaker statistics

        Returns:
            Dictionary with statistics
        """
        stats = self.stats.get_stats_dict()
        stats.update({
            "source": self.source,
            "state": self.state.value,
            "failure_count": self.failure_count,
            "success_count": self.success_count,
            "opened_at": self.opened_at,
            "last_failure_time": self.last_failure_time,
        })
        return stats

    def reset(self):
        """Reset circuit breaker to initial state"""
        logger.info(
            "Circuit breaker reset for %s",
            self.source,
            extra={"source": self.source}
        )
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0.0
        self.opened_at = 0.0
        self.half_open_calls = 0


class CircuitBreakerRegistry:
    """
    Registry for managing circuit breakers across all sources

    Provides centralized access to circuit breakers and aggregate statistics.
    """

    def __init__(self):
        """Initialize circuit breaker registry"""
        self._breakers: Dict[str, CircuitBreaker] = {}
        self._default_config = CircuitBreakerConfig()

    def get_breaker(
        self,
        source: str,
        config: Optional[CircuitBreakerConfig] = None
    ) -> CircuitBreaker:
        """
        Get or create circuit breaker for source

        Args:
            source: Source name
            config: Optional custom configuration

        Returns:
            Circuit breaker instance
        """
        if source not in self._breakers:
            self._breakers[source] = CircuitBreaker(
                source,
                config or self._default_config
            )
        return self._breakers[source]

    def get_all_stats(self) -> dict:
        """
        Get statistics for all circuit breakers

        Returns:
            Dictionary mapping source names to their stats
        """
        return {
            source: breaker.get_stats()
            for source, breaker in self._breakers.items()
        }

    def get_unhealthy_sources(self) -> list[str]:
        """
        Get list of sources with open circuits

        Returns:
            List of source names with OPEN circuits
        """
        return [
            source
            for source, breaker in self._breakers.items()
            if breaker.get_state() == CircuitState.OPEN
        ]

    def reset_all(self):
        """Reset all circuit breakers"""
        for breaker in self._breakers.values():
            breaker.reset()

    def configure_source(
        self,
        source: str,
        failure_threshold: Optional[int] = None,
        success_threshold: Optional[int] = None,
        timeout_seconds: Optional[int] = None,
    ):
        """
        Configure circuit breaker for specific source

        Args:
            source: Source name
            failure_threshold: Failures before opening (optional)
            success_threshold: Successes to close (optional)
            timeout_seconds: Timeout before retrying (optional)
        """
        config = CircuitBreakerConfig(
            failure_threshold=failure_threshold or self._default_config.failure_threshold,
            success_threshold=success_threshold or self._default_config.success_threshold,
            timeout_seconds=timeout_seconds or self._default_config.timeout_seconds,
        )

        if source in self._breakers:
            # Reset existing breaker with new config
            self._breakers[source] = CircuitBreaker(source, config)
        else:
            # Create new breaker
            self._breakers[source] = CircuitBreaker(source, config)


# Global registry instance
_registry = CircuitBreakerRegistry()


def get_circuit_breaker(source: str) -> CircuitBreaker:
    """
    Convenience function to get circuit breaker for source

    Args:
        source: Source name

    Returns:
        Circuit breaker instance
    """
    return _registry.get_breaker(source)


def get_all_circuit_stats() -> dict:
    """
    Get statistics for all circuit breakers

    Returns:
        Dictionary of source stats
    """
    return _registry.get_all_stats()


def configure_circuit_breaker(
    source: str,
    failure_threshold: Optional[int] = None,
    success_threshold: Optional[int] = None,
    timeout_seconds: Optional[int] = None,
):
    """
    Configure circuit breaker for a source

    Args:
        source: Source name
        failure_threshold: Failures before opening (optional)
        success_threshold: Successes to close (optional)
        timeout_seconds: Timeout before retrying (optional)
    """
    _registry.configure_source(
        source,
        failure_threshold,
        success_threshold,
        timeout_seconds
    )
