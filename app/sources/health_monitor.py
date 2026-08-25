"""
Source Health Monitoring System

Provides periodic health checks and monitoring for all sources.
Tracks availability, response times, and error rates.
"""

from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, Optional, Callable, Awaitable
import logging

import aiohttp

from sources.circuit_breaker import get_circuit_breaker, CircuitState
from sources.timeout_manager import get_source_health, get_all_statistics

logger = logging.getLogger(__name__)


@dataclass
class HealthCheckResult:
    """Result of a health check"""
    source: str
    is_healthy: bool
    response_time: float
    status_code: Optional[int] = None
    error: Optional[str] = None
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class SourceHealthStatus:
    """Health status for a source"""
    source: str
    is_available: bool
    last_check_time: datetime
    last_success_time: Optional[datetime] = None
    last_failure_time: Optional[datetime] = None
    consecutive_failures: int = 0
    consecutive_successes: int = 0
    total_checks: int = 0
    successful_checks: int = 0
    failed_checks: int = 0
    avg_response_time: float = 0.0
    circuit_state: str = "closed"
    health_score: float = 1.0


class SourceHealthMonitor:
    """
    Monitors health of all sources with periodic checks

    Features:
    - Periodic health checks (configurable interval)
    - Health status tracking
    - Alert callbacks for status changes
    - Integration with circuit breakers
    - Automatic source disabling on persistent failures
    """

    def __init__(
        self,
        check_interval: int = 300,  # 5 minutes
        unhealthy_threshold: int = 3,  # Consecutive failures
        healthy_threshold: int = 2,  # Consecutive successes
    ):
        """
        Initialize health monitor

        Args:
            check_interval: Seconds between health checks
            unhealthy_threshold: Failures before marking unhealthy
            healthy_threshold: Successes before marking healthy again
        """
        self.check_interval = check_interval
        self.unhealthy_threshold = unhealthy_threshold
        self.healthy_threshold = healthy_threshold

        self.health_status: Dict[str, SourceHealthStatus] = {}
        self.alert_callbacks: list[Callable[[str, HealthCheckResult], Awaitable[None]]] = []

        self._running = False
        self._task: Optional[asyncio.Task] = None

        logger.info(
            "SourceHealthMonitor initialized",
            extra={
                "check_interval": check_interval,
                "unhealthy_threshold": unhealthy_threshold,
                "healthy_threshold": healthy_threshold,
            }
        )

    def register_alert_callback(
        self,
        callback: Callable[[str, HealthCheckResult], Awaitable[None]]
    ):
        """
        Register callback for health status changes

        Args:
            callback: Async function(source: str, result: HealthCheckResult)
        """
        self.alert_callbacks.append(callback)
        logger.info("Registered health alert callback")

    async def check_source_health(
        self,
        source: str,
        base_url: str,
        timeout: int = 5
    ) -> HealthCheckResult:
        """
        Check health of a single source

        Args:
            source: Source name
            base_url: Base URL to check
            timeout: Timeout in seconds

        Returns:
            HealthCheckResult
        """
        start_time = time.time()

        try:
            timeout_obj = aiohttp.ClientTimeout(total=timeout)
            async with aiohttp.ClientSession(timeout=timeout_obj) as session:
                async with session.get(base_url) as response:
                    response_time = time.time() - start_time

                    is_healthy = response.status == 200

                    result = HealthCheckResult(
                        source=source,
                        is_healthy=is_healthy,
                        response_time=response_time,
                        status_code=response.status,
                    )

                    logger.info(
                        "Health check for %s: %s (status=%d, time=%0.3fs)",
                        source,
                        "healthy" if is_healthy else "unhealthy",
                        response.status,
                        response_time,
                        extra={
                            "source": source,
                            "healthy": is_healthy,
                            "status_code": response.status,
                            "response_time": response_time,
                        }
                    )

                    return result

        except asyncio.TimeoutError:
            response_time = time.time() - start_time
            result = HealthCheckResult(
                source=source,
                is_healthy=False,
                response_time=response_time,
                error="Timeout",
            )

            logger.warning(
                "Health check timeout for %s (%0.1fs)",
                source,
                response_time,
                extra={
                    "source": source,
                    "error": "timeout",
                    "response_time": response_time,
                }
            )

            return result

        except Exception as exc:
            response_time = time.time() - start_time
            result = HealthCheckResult(
                source=source,
                is_healthy=False,
                response_time=response_time,
                error=str(exc),
            )

            logger.error(
                "Health check error for %s: %s",
                source,
                exc,
                extra={
                    "source": source,
                    "error": str(exc),
                    "response_time": response_time,
                }
            )

            return result

    async def update_health_status(
        self,
        source: str,
        result: HealthCheckResult
    ):
        """
        Update health status based on check result

        Args:
            source: Source name
            result: Health check result
        """
        # Get or create status
        if source not in self.health_status:
            self.health_status[source] = SourceHealthStatus(
                source=source,
                is_available=True,
                last_check_time=result.timestamp,
            )

        status = self.health_status[source]
        status.last_check_time = result.timestamp
        status.total_checks += 1

        # Update response time average
        if status.avg_response_time == 0:
            status.avg_response_time = result.response_time
        else:
            # Exponential moving average
            status.avg_response_time = (
                0.8 * status.avg_response_time + 0.2 * result.response_time
            )

        if result.is_healthy:
            status.successful_checks += 1
            status.consecutive_successes += 1
            status.consecutive_failures = 0
            status.last_success_time = result.timestamp

            # Check if source is recovering
            if not status.is_available:
                if status.consecutive_successes >= self.healthy_threshold:
                    logger.info(
                        "Source %s is now HEALTHY (after %d consecutive successes)",
                        source,
                        status.consecutive_successes,
                        extra={
                            "source": source,
                            "consecutive_successes": status.consecutive_successes,
                        }
                    )
                    status.is_available = True

                    # Trigger alert callbacks
                    for callback in self.alert_callbacks:
                        try:
                            await callback(source, result)
                        except Exception as exc:
                            logger.error(
                                "Alert callback failed: %s",
                                exc,
                                extra={"error": str(exc)}
                            )

        else:
            status.failed_checks += 1
            status.consecutive_failures += 1
            status.consecutive_successes = 0
            status.last_failure_time = result.timestamp

            # Check if source is failing
            if status.is_available:
                if status.consecutive_failures >= self.unhealthy_threshold:
                    logger.error(
                        "Source %s is now UNHEALTHY (after %d consecutive failures)",
                        source,
                        status.consecutive_failures,
                        extra={
                            "source": source,
                            "consecutive_failures": status.consecutive_failures,
                        }
                    )
                    status.is_available = False

                    # Trigger alert callbacks
                    for callback in self.alert_callbacks:
                        try:
                            await callback(source, result)
                        except Exception as exc:
                            logger.error(
                                "Alert callback failed: %s",
                                exc,
                                extra={"error": str(exc)}
                            )

        # Update health score from timeout manager
        status.health_score = get_source_health(source)

        # Update circuit state
        breaker = get_circuit_breaker(source)
        status.circuit_state = breaker.get_state().value

    async def check_all_sources(self, sources_config: Dict[str, str]):
        """
        Check health of all configured sources

        Args:
            sources_config: Dict mapping source name to base URL
        """
        tasks = []
        for source, base_url in sources_config.items():
            task = self.check_source_health(source, base_url)
            tasks.append(task)

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for i, (source, base_url) in enumerate(sources_config.items()):
            result = results[i]
            if isinstance(result, Exception):
                logger.error(
                    "Health check exception for %s: %s",
                    source,
                    result,
                    extra={
                        "source": source,
                        "error": str(result),
                    }
                )
                result = HealthCheckResult(
                    source=source,
                    is_healthy=False,
                    response_time=0.0,
                    error=str(result),
                )

            await self.update_health_status(source, result)

    async def start_periodic_checks(self, sources_config: Dict[str, str]):
        """
        Start periodic health checks

        Args:
            sources_config: Dict mapping source name to base URL
        """
        if self._running:
            logger.warning("Health monitor already running")
            return

        self._running = True
        logger.info(
            "Starting periodic health checks (interval=%ds)",
            self.check_interval,
            extra={"check_interval": self.check_interval}
        )

        while self._running:
            try:
                await self.check_all_sources(sources_config)
            except Exception as exc:
                logger.error(
                    "Error in health check cycle: %s",
                    exc,
                    extra={"error": str(exc)}
                )

            await asyncio.sleep(self.check_interval)

    def start_background_checks(
        self,
        sources_config: Dict[str, str]
    ) -> asyncio.Task:
        """
        Start health checks in background task

        Args:
            sources_config: Dict mapping source name to base URL

        Returns:
            asyncio.Task that can be cancelled
        """
        self._task = asyncio.create_task(
            self.start_periodic_checks(sources_config)
        )
        return self._task

    def stop_background_checks(self):
        """Stop background health checks"""
        self._running = False
        if self._task and not self._task.done():
            self._task.cancel()
        logger.info("Stopped periodic health checks")

    def get_all_health_status(self) -> Dict[str, dict]:
        """
        Get health status for all sources

        Returns:
            Dictionary mapping source names to health status
        """
        return {
            source: {
                "source": status.source,
                "is_available": status.is_available,
                "last_check_time": status.last_check_time.isoformat(),
                "last_success_time": status.last_success_time.isoformat() if status.last_success_time else None,
                "last_failure_time": status.last_failure_time.isoformat() if status.last_failure_time else None,
                "consecutive_failures": status.consecutive_failures,
                "consecutive_successes": status.consecutive_successes,
                "total_checks": status.total_checks,
                "successful_checks": status.successful_checks,
                "failed_checks": status.failed_checks,
                "success_rate": status.successful_checks / status.total_checks if status.total_checks > 0 else 0.0,
                "avg_response_time": status.avg_response_time,
                "circuit_state": status.circuit_state,
                "health_score": status.health_score,
            }
            for source, status in self.health_status.items()
        }

    def get_unhealthy_sources(self) -> list[str]:
        """
        Get list of unhealthy sources

        Returns:
            List of source names
        """
        return [
            source
            for source, status in self.health_status.items()
            if not status.is_available
        ]


# Global instance
_health_monitor = SourceHealthMonitor()


async def check_source_health(
    source: str,
    base_url: str,
    timeout: int = 5
) -> HealthCheckResult:
    """
    Check health of a source

    Args:
        source: Source name
        base_url: Base URL
        timeout: Timeout in seconds

    Returns:
        HealthCheckResult
    """
    return await _health_monitor.check_source_health(source, base_url, timeout)


def register_health_alert_callback(
    callback: Callable[[str, HealthCheckResult], Awaitable[None]]
):
    """
    Register alert callback

    Args:
        callback: Async function to call on health status changes
    """
    _health_monitor.register_alert_callback(callback)


def start_health_monitoring(sources_config: Dict[str, str]) -> asyncio.Task:
    """
    Start background health monitoring

    Args:
        sources_config: Dict mapping source names to base URLs

    Returns:
        asyncio.Task
    """
    return _health_monitor.start_background_checks(sources_config)


def stop_health_monitoring():
    """Stop background health monitoring"""
    _health_monitor.stop_background_checks()


def get_all_health_status() -> Dict[str, dict]:
    """
    Get health status for all sources

    Returns:
        Dictionary of health statuses
    """
    return _health_monitor.get_all_health_status()


def get_unhealthy_sources() -> list[str]:
    """
    Get list of unhealthy sources

    Returns:
        List of source names
    """
    return _health_monitor.get_unhealthy_sources()
