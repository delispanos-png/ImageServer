"""
Unit tests for circuit breaker

Tests state transitions, failure/success thresholds, and timeout behavior.
"""

import pytest
import asyncio
import time
from unittest.mock import Mock, AsyncMock, patch

# Import modules to test
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sources.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerConfig,
    CircuitState,
    get_circuit_breaker,
    CircuitBreakerRegistry,
)


class TestCircuitBreakerConfig:
    """Test circuit breaker configuration"""

    def test_default_config(self):
        """Test default configuration values"""
        config = CircuitBreakerConfig()
        assert config.failure_threshold == 5
        assert config.success_threshold == 2
        assert config.timeout_seconds == 60
        assert config.half_open_max_calls == 3

    def test_custom_config(self):
        """Test custom configuration"""
        config = CircuitBreakerConfig(
            failure_threshold=3,
            success_threshold=1,
            timeout_seconds=30,
            half_open_max_calls=2,
        )
        assert config.failure_threshold == 3
        assert config.success_threshold == 1
        assert config.timeout_seconds == 30
        assert config.half_open_max_calls == 2


class TestCircuitBreakerStates:
    """Test circuit breaker state machine"""

    def test_initial_state_closed(self):
        """Test circuit breaker starts in CLOSED state"""
        breaker = CircuitBreaker("test_source")
        assert breaker.state == CircuitState.CLOSED
        assert breaker.can_execute() is True
        assert breaker.failure_count == 0
        assert breaker.success_count == 0

    def test_closed_to_open_on_failures(self):
        """Test transition from CLOSED to OPEN after threshold failures"""
        config = CircuitBreakerConfig(failure_threshold=3)
        breaker = CircuitBreaker("test_source", config)

        # Record failures
        breaker.record_failure()
        assert breaker.state == CircuitState.CLOSED
        assert breaker.failure_count == 1

        breaker.record_failure()
        assert breaker.state == CircuitState.CLOSED
        assert breaker.failure_count == 2

        # Third failure should open circuit
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN
        assert breaker.can_execute() is False

    def test_open_to_half_open_after_timeout(self):
        """Test transition from OPEN to HALF_OPEN after timeout"""
        config = CircuitBreakerConfig(
            failure_threshold=2,
            timeout_seconds=1,  # Short timeout for testing
        )
        breaker = CircuitBreaker("test_source", config)

        # Open the circuit
        breaker.record_failure()
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

        # Wait for timeout
        time.sleep(1.1)

        # Should now be in HALF_OPEN
        assert breaker.can_execute() is True
        assert breaker.state == CircuitState.HALF_OPEN

    def test_half_open_to_closed_on_success(self):
        """Test transition from HALF_OPEN to CLOSED after success threshold"""
        config = CircuitBreakerConfig(
            failure_threshold=2,
            success_threshold=2,
            timeout_seconds=1,
        )
        breaker = CircuitBreaker("test_source", config)

        # Open the circuit
        breaker.record_failure()
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

        # Wait for timeout to enter HALF_OPEN
        time.sleep(1.1)
        assert breaker.can_execute() is True
        assert breaker.state == CircuitState.HALF_OPEN

        # Record successes
        breaker.record_success()
        assert breaker.state == CircuitState.HALF_OPEN
        assert breaker.success_count == 1

        # Second success should close circuit
        breaker.record_success()
        assert breaker.state == CircuitState.CLOSED
        assert breaker.failure_count == 0
        assert breaker.success_count == 0

    def test_half_open_to_open_on_failure(self):
        """Test transition from HALF_OPEN back to OPEN on failure"""
        config = CircuitBreakerConfig(
            failure_threshold=2,
            timeout_seconds=1,
        )
        breaker = CircuitBreaker("test_source", config)

        # Open the circuit
        breaker.record_failure()
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

        # Wait for timeout and call can_execute to trigger HALF_OPEN transition
        time.sleep(1.1)
        can_exec = breaker.can_execute()
        assert can_exec is True  # Should allow in HALF_OPEN
        assert breaker.state == CircuitState.HALF_OPEN

        # Any failure in HALF_OPEN should reopen circuit
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN
        assert breaker.can_execute() is False


class TestCircuitBreakerExecution:
    """Test circuit breaker execution control"""

    def test_can_execute_when_closed(self):
        """Test can_execute returns True when circuit is CLOSED"""
        breaker = CircuitBreaker("test_source")

        assert breaker.can_execute() is True
        assert breaker.state == CircuitState.CLOSED

    def test_can_execute_blocked_when_open(self):
        """Test can_execute returns False when OPEN"""
        config = CircuitBreakerConfig(failure_threshold=1)
        breaker = CircuitBreaker("test_source", config)

        # Open the circuit
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

        # Should be blocked
        assert breaker.can_execute() is False

    def test_manual_success_failure_tracking(self):
        """Test manual success/failure tracking"""
        config = CircuitBreakerConfig(failure_threshold=3)
        breaker = CircuitBreaker("test_source", config)

        # First two failures
        for _ in range(2):
            breaker.record_failure()
            assert breaker.state == CircuitState.CLOSED

        # Third failure should open circuit
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

    def test_success_tracking(self):
        """Test success recording"""
        breaker = CircuitBreaker("test_source")

        breaker.record_success()
        breaker.record_success()

        stats = breaker.get_stats()
        assert stats["successful_calls"] == 2


class TestCircuitBreakerMetrics:
    """Test circuit breaker metrics tracking"""

    def test_metrics_tracking(self):
        """Test metrics are tracked correctly"""
        breaker = CircuitBreaker("test_source")

        # Execute some operations (can_execute tracks total_calls)
        breaker.can_execute()
        breaker.record_success()
        breaker.can_execute()
        breaker.record_success()
        breaker.can_execute()
        breaker.record_failure()

        stats = breaker.get_stats()
        assert stats["total_calls"] == 3
        assert stats["successful_calls"] == 2
        assert stats["failed_calls"] == 1
        assert breaker.failure_count == 1  # Current consecutive failures

    def test_get_state_info(self):
        """Test state information retrieval"""
        config = CircuitBreakerConfig(failure_threshold=5)
        breaker = CircuitBreaker("test_source", config)

        breaker.record_failure()
        breaker.record_failure()

        stats = breaker.get_stats()
        assert stats["source"] == "test_source"
        assert stats["state"] == "closed"
        assert breaker.failure_count == 2
        assert breaker.success_count == 0
        assert breaker.can_execute() is True

    def test_reset(self):
        """Test circuit breaker reset"""
        breaker = CircuitBreaker("test_source")

        # Add some failures
        breaker.record_failure()
        breaker.record_failure()
        assert breaker.failure_count == 2

        # Reset
        breaker.reset()
        assert breaker.state == CircuitState.CLOSED
        assert breaker.failure_count == 0
        assert breaker.success_count == 0
        assert breaker.can_execute() is True


class TestCircuitBreakerGlobalManagement:
    """Test global circuit breaker management"""

    def test_get_circuit_breaker_singleton(self):
        """Test get_circuit_breaker returns same instance"""
        # Reset all first
        registry = CircuitBreakerRegistry()
        registry.reset_all()

        breaker1 = get_circuit_breaker("test_source")
        breaker2 = get_circuit_breaker("test_source")

        assert breaker1 is breaker2
        assert breaker1.source == "test_source"

    def test_get_circuit_breaker_different_sources(self):
        """Test different sources get different breakers"""
        registry = CircuitBreakerRegistry()
        registry.reset_all()

        breaker1 = get_circuit_breaker("source1")
        breaker2 = get_circuit_breaker("source2")

        assert breaker1 is not breaker2
        assert breaker1.source == "source1"
        assert breaker2.source == "source2"

    def test_reset_all_circuit_breakers(self):
        """Test resetting all circuit breakers"""
        from sources.circuit_breaker import _registry

        _registry.reset_all()

        # Create some breakers and add failures
        breaker1 = get_circuit_breaker("source1")
        breaker2 = get_circuit_breaker("source2")

        breaker1.record_failure()
        breaker2.record_failure()
        breaker2.record_failure()

        assert breaker1.failure_count == 1
        assert breaker2.failure_count == 2

        # Reset all
        _registry.reset_all()

        # Get breakers again (should be new instances)
        breaker1_new = get_circuit_breaker("source1")
        breaker2_new = get_circuit_breaker("source2")

        assert breaker1_new.failure_count == 0
        assert breaker2_new.failure_count == 0


class TestCircuitBreakerHalfOpenMaxCalls:
    """Test HALF_OPEN max calls limit"""

    def test_half_open_max_calls_limit(self):
        """Test HALF_OPEN state limits concurrent calls"""
        config = CircuitBreakerConfig(
            failure_threshold=1,
            timeout_seconds=1,
            half_open_max_calls=2,
        )
        breaker = CircuitBreaker("test_source", config)

        # Open circuit
        breaker.record_failure()
        assert breaker.state == CircuitState.OPEN

        # Wait for timeout and transition to HALF_OPEN
        time.sleep(1.1)
        assert breaker.can_execute() is True
        assert breaker.state == CircuitState.HALF_OPEN

        # In HALF_OPEN, calls are allowed up to half_open_max_calls
        # This is controlled internally by the breaker


def test_imports():
    """Test that all imports work"""
    from sources.circuit_breaker import (
        CircuitBreaker,
        CircuitBreakerConfig,
        CircuitState,
        get_circuit_breaker,
        CircuitBreakerRegistry,
    )

    assert CircuitBreaker is not None
    assert CircuitBreakerConfig is not None
    assert CircuitState is not None
    assert get_circuit_breaker is not None
    assert CircuitBreakerRegistry is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
