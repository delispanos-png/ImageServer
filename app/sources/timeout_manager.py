"""
Adaptive Timeout Manager for Source Fetching

Dynamically adjusts timeouts based on historical response times for each source.
Uses percentile-based approach to set realistic timeouts that adapt to network conditions.
"""

from __future__ import annotations

import time
from collections import defaultdict, deque
from dataclasses import dataclass
from statistics import mean, median
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


@dataclass
class SourceMetrics:
    """Metrics for a source operation"""

    # Rolling window of response times (last N measurements)
    response_times: deque  # deque of float

    # Success/failure counts
    success_count: int = 0
    failure_count: int = 0
    timeout_count: int = 0

    # Timestamps
    last_success_time: float = 0.0
    last_failure_time: float = 0.0
    last_timeout_time: float = 0.0

    # Calculated metrics
    min_response_time: float = float('inf')
    max_response_time: float = 0.0


class AdaptiveTimeoutManager:
    """
    Manages adaptive timeouts for source operations

    Features:
    - Per-source, per-operation timeout tracking
    - Percentile-based timeout calculation (default: 95th percentile)
    - Rolling window of recent measurements
    - Automatic adjustment based on success/failure patterns
    - Safety buffers to prevent premature timeouts
    """

    def __init__(
        self,
        default_timeout: float = 20.0,
        min_timeout: float = 5.0,
        max_timeout: float = 60.0,
        percentile: float = 0.95,
        window_size: int = 100,
        safety_buffer: float = 1.3,
    ):
        """
        Initialize adaptive timeout manager

        Args:
            default_timeout: Default timeout for sources without history
            min_timeout: Minimum allowed timeout
            max_timeout: Maximum allowed timeout
            percentile: Percentile to use for timeout calculation (0.0-1.0)
            window_size: Number of recent measurements to keep
            safety_buffer: Multiplier for calculated timeout (e.g., 1.3 = +30%)
        """
        self.default_timeout = default_timeout
        self.min_timeout = min_timeout
        self.max_timeout = max_timeout
        self.percentile = percentile
        self.window_size = window_size
        self.safety_buffer = safety_buffer

        # Metrics per source:operation
        self.metrics: Dict[str, SourceMetrics] = defaultdict(
            lambda: SourceMetrics(
                response_times=deque(maxlen=self.window_size)
            )
        )

        logger.info(
            "AdaptiveTimeoutManager initialized",
            extra={
                "default_timeout": default_timeout,
                "min_timeout": min_timeout,
                "max_timeout": max_timeout,
                "percentile": percentile,
                "window_size": window_size,
                "safety_buffer": safety_buffer,
            }
        )

    def _get_key(self, source: str, operation: str) -> str:
        """Get metrics key for source:operation pair"""
        return f"{source}:{operation}"

    def get_timeout(
        self,
        source: str,
        operation: str = "fetch"
    ) -> float:
        """
        Calculate adaptive timeout for source operation

        Args:
            source: Source name
            operation: Operation type (e.g., "fetch", "search", "image_download")

        Returns:
            Calculated timeout in seconds
        """
        key = self._get_key(source, operation)
        metrics = self.metrics[key]

        if not metrics.response_times:
            # No history yet, use default
            logger.debug(
                "No history for %s, using default timeout %0.1fs",
                key,
                self.default_timeout,
                extra={
                    "source": source,
                    "operation": operation,
                    "timeout": self.default_timeout,
                    "reason": "no_history",
                }
            )
            return self.default_timeout

        # Calculate percentile
        sorted_times = sorted(metrics.response_times)
        sample_size = len(sorted_times)

        if sample_size == 1:
            # Only one sample, use it with buffer
            base_timeout = sorted_times[0]
        else:
            # Calculate percentile index
            idx = int(sample_size * self.percentile)
            idx = max(0, min(idx, sample_size - 1))
            base_timeout = sorted_times[idx]

        # Apply safety buffer
        adaptive_timeout = base_timeout * self.safety_buffer

        # Clamp to min/max bounds
        timeout = max(
            self.min_timeout,
            min(adaptive_timeout, self.max_timeout)
        )

        # Calculate statistics for logging
        avg_time = mean(metrics.response_times)
        med_time = median(metrics.response_times)

        logger.debug(
            "Calculated adaptive timeout for %s: %0.1fs (p%d=%0.1fs, avg=%0.1fs, med=%0.1fs, samples=%d)",
            key,
            timeout,
            int(self.percentile * 100),
            base_timeout,
            avg_time,
            med_time,
            sample_size,
            extra={
                "source": source,
                "operation": operation,
                "timeout": timeout,
                "percentile_value": base_timeout,
                "average": avg_time,
                "median": med_time,
                "samples": sample_size,
                "buffer": self.safety_buffer,
            }
        )

        return timeout

    def record_success(
        self,
        source: str,
        operation: str,
        duration: float
    ):
        """
        Record successful operation

        Args:
            source: Source name
            operation: Operation type
            duration: Operation duration in seconds
        """
        key = self._get_key(source, operation)
        metrics = self.metrics[key]

        # Update response times
        metrics.response_times.append(duration)

        # Update counts
        metrics.success_count += 1
        metrics.last_success_time = time.time()

        # Update min/max
        metrics.min_response_time = min(metrics.min_response_time, duration)
        metrics.max_response_time = max(metrics.max_response_time, duration)

        logger.debug(
            "Recorded success for %s: %0.3fs",
            key,
            duration,
            extra={
                "source": source,
                "operation": operation,
                "duration": duration,
                "success_count": metrics.success_count,
            }
        )

    def record_failure(
        self,
        source: str,
        operation: str
    ):
        """
        Record failed operation (non-timeout)

        Args:
            source: Source name
            operation: Operation type
        """
        key = self._get_key(source, operation)
        metrics = self.metrics[key]

        metrics.failure_count += 1
        metrics.last_failure_time = time.time()

        logger.debug(
            "Recorded failure for %s",
            key,
            extra={
                "source": source,
                "operation": operation,
                "failure_count": metrics.failure_count,
            }
        )

    def record_timeout(
        self,
        source: str,
        operation: str,
        timeout_value: float
    ):
        """
        Record timeout occurrence

        Args:
            source: Source name
            operation: Operation type
            timeout_value: The timeout value that was exceeded
        """
        key = self._get_key(source, operation)
        metrics = self.metrics[key]

        metrics.timeout_count += 1
        metrics.last_timeout_time = time.time()

        # Don't add timeout value to response_times
        # (we don't know the actual response time)

        logger.warning(
            "Recorded timeout for %s (timeout=%0.1fs)",
            key,
            timeout_value,
            extra={
                "source": source,
                "operation": operation,
                "timeout_value": timeout_value,
                "timeout_count": metrics.timeout_count,
            }
        )

    def get_source_health(self, source: str) -> float:
        """
        Calculate health score for a source (0.0 - 1.0)

        Health is based on success rate across all operations.

        Args:
            source: Source name

        Returns:
            Health score between 0.0 (unhealthy) and 1.0 (healthy)
        """
        total_success = 0
        total_failure = 0
        total_timeout = 0

        # Aggregate across all operations for this source
        for key, metrics in self.metrics.items():
            if key.startswith(f"{source}:"):
                total_success += metrics.success_count
                total_failure += metrics.failure_count
                total_timeout += metrics.timeout_count

        total = total_success + total_failure + total_timeout

        if total == 0:
            # No data yet, assume neutral health
            return 0.5

        # Weight timeouts more heavily than failures
        weighted_failures = total_failure + (total_timeout * 1.5)
        health = total_success / (total_success + weighted_failures)

        return max(0.0, min(1.0, health))

    def get_statistics(
        self,
        source: Optional[str] = None,
        operation: Optional[str] = None
    ) -> dict:
        """
        Get statistics for sources

        Args:
            source: Filter by source name (optional)
            operation: Filter by operation (optional)

        Returns:
            Dictionary of statistics
        """
        stats = {}

        for key, metrics in self.metrics.items():
            key_source, key_operation = key.split(":", 1)

            # Apply filters
            if source and key_source != source:
                continue
            if operation and key_operation != operation:
                continue

            if metrics.response_times:
                sorted_times = sorted(metrics.response_times)
                percentile_idx = int(len(sorted_times) * self.percentile)
                percentile_value = sorted_times[percentile_idx]
            else:
                percentile_value = 0.0

            stats[key] = {
                "source": key_source,
                "operation": key_operation,
                "success_count": metrics.success_count,
                "failure_count": metrics.failure_count,
                "timeout_count": metrics.timeout_count,
                "samples": len(metrics.response_times),
                "min_response_time": metrics.min_response_time if metrics.min_response_time != float('inf') else 0.0,
                "max_response_time": metrics.max_response_time,
                "avg_response_time": mean(metrics.response_times) if metrics.response_times else 0.0,
                "median_response_time": median(metrics.response_times) if metrics.response_times else 0.0,
                f"p{int(self.percentile * 100)}_response_time": percentile_value,
                "current_timeout": self.get_timeout(key_source, key_operation),
                "last_success_time": metrics.last_success_time,
                "last_failure_time": metrics.last_failure_time,
                "last_timeout_time": metrics.last_timeout_time,
            }

        return stats

    def reset_source(self, source: str):
        """
        Reset all metrics for a source

        Args:
            source: Source name
        """
        keys_to_delete = [
            key for key in self.metrics.keys()
            if key.startswith(f"{source}:")
        ]

        for key in keys_to_delete:
            del self.metrics[key]

        logger.info(
            "Reset metrics for source %s (%d operations)",
            source,
            len(keys_to_delete),
            extra={
                "source": source,
                "operations_reset": len(keys_to_delete),
            }
        )


# Global instance
_timeout_manager = AdaptiveTimeoutManager()


def get_timeout(source: str, operation: str = "fetch") -> float:
    """
    Get adaptive timeout for source operation

    Args:
        source: Source name
        operation: Operation type

    Returns:
        Timeout in seconds
    """
    return _timeout_manager.get_timeout(source, operation)


def record_success(source: str, operation: str, duration: float):
    """
    Record successful operation

    Args:
        source: Source name
        operation: Operation type
        duration: Duration in seconds
    """
    _timeout_manager.record_success(source, operation, duration)


def record_failure(source: str, operation: str):
    """
    Record failed operation

    Args:
        source: Source name
        operation: Operation type
    """
    _timeout_manager.record_failure(source, operation)


def record_timeout(source: str, operation: str, timeout_value: float):
    """
    Record timeout occurrence

    Args:
        source: Source name
        operation: Operation type
        timeout_value: Timeout value that was exceeded
    """
    _timeout_manager.record_timeout(source, operation, timeout_value)


def get_source_health(source: str) -> float:
    """
    Get health score for source

    Args:
        source: Source name

    Returns:
        Health score (0.0-1.0)
    """
    return _timeout_manager.get_source_health(source)


def get_all_statistics() -> dict:
    """
    Get all timeout statistics

    Returns:
        Dictionary of statistics
    """
    return _timeout_manager.get_statistics()
