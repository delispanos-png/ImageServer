"""
Unit tests for retry manager

Tests retry logic, exponential backoff, and error handling.
"""

import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
import aiohttp

# Import modules to test
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sources.retry_manager import (
    SourceFetchRetryWrapper,
    RetryableError,
    PermanentError,
    is_retryable_http_status,
    is_permanent_http_status,
)


class TestRetryStatusChecks:
    """Test status code classification"""

    def test_retryable_statuses(self):
        """Test retryable status codes"""
        assert is_retryable_http_status(429) is True  # Rate limited
        assert is_retryable_http_status(502) is True  # Bad gateway
        assert is_retryable_http_status(503) is True  # Service unavailable
        assert is_retryable_http_status(504) is True  # Gateway timeout

    def test_permanent_statuses(self):
        """Test permanent failure status codes"""
        assert is_permanent_http_status(400) is True  # Bad request
        assert is_permanent_http_status(401) is True  # Unauthorized
        assert is_permanent_http_status(403) is True  # Forbidden
        assert is_permanent_http_status(404) is True  # Not found
        assert is_permanent_http_status(410) is True  # Gone

    def test_success_status(self):
        """Test success status code"""
        assert is_retryable_http_status(200) is False
        assert is_permanent_http_status(200) is False


class MockResponse:
    """Mock aiohttp response"""

    def __init__(self, status, json_data=None, text_data=None):
        self.status = status
        self._json_data = json_data or {}
        self._text_data = text_data or ""
        self.headers = {}

    async def json(self):
        return self._json_data

    async def text(self):
        return self._text_data

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass


class MockSession:
    """Mock aiohttp session"""

    def __init__(self, responses):
        """
        Args:
            responses: List of responses to return (one per call)
        """
        self.responses = responses
        self.call_count = 0

    def get(self, url, **kwargs):
        """Mock get method"""
        response = self.responses[self.call_count]
        self.call_count += 1
        return response

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass


@pytest.mark.asyncio
class TestRetryWrapper:
    """Test SourceFetchRetryWrapper"""

    async def test_fetch_json_success_first_try(self):
        """Test successful fetch on first try"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # Mock successful response
        mock_response = MockResponse(200, json_data={"success": True})
        mock_session = MockSession([mock_response])

        result = await wrapper.fetch_json("http://example.com", mock_session)

        assert result == {"success": True}
        assert mock_session.call_count == 1

    async def test_fetch_json_retry_on_503(self):
        """Test retry on 503 status"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # First two calls fail with 503, third succeeds
        responses = [
            MockResponse(503),
            MockResponse(503),
            MockResponse(200, json_data={"success": True}),
        ]
        mock_session = MockSession(responses)

        # Patch to avoid actual delays
        with patch('asyncio.sleep', new_callable=AsyncMock):
            result = await wrapper.fetch_json("http://example.com", mock_session)

        assert result == {"success": True}
        assert mock_session.call_count == 3

    async def test_fetch_json_permanent_error_no_retry(self):
        """Test no retry on 404 (permanent error)"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # 404 should not retry
        mock_response = MockResponse(404)
        mock_session = MockSession([mock_response])

        with pytest.raises(PermanentError):
            await wrapper.fetch_json("http://example.com", mock_session)

        # Should only try once (no retries)
        assert mock_session.call_count == 1

    async def test_fetch_html_success(self):
        """Test HTML fetch"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        mock_response = MockResponse(200, text_data="<html>Success</html>")
        mock_session = MockSession([mock_response])

        result = await wrapper.fetch_html("http://example.com", mock_session)

        assert result == "<html>Success</html>"
        assert mock_session.call_count == 1

    async def test_fetch_html_retry_on_502(self):
        """Test retry on 502 Bad Gateway"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # First call fails, second succeeds
        responses = [
            MockResponse(502),
            MockResponse(200, text_data="<html>Success</html>"),
        ]
        mock_session = MockSession(responses)

        with patch('asyncio.sleep', new_callable=AsyncMock):
            result = await wrapper.fetch_html("http://example.com", mock_session)

        assert result == "<html>Success</html>"
        assert mock_session.call_count == 2

    async def test_fetch_json_empty_on_non_200(self):
        """Test returns empty dict on non-200 non-retryable status"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # 500 is not explicitly retryable or permanent in our mock
        mock_response = MockResponse(500)
        mock_session = MockSession([mock_response])

        result = await wrapper.fetch_json("http://example.com", mock_session)

        # Should return empty dict instead of raising
        assert result == {}

    async def test_max_retries_exhausted(self):
        """Test behavior when max retries exhausted"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # All attempts fail with 503
        responses = [
            MockResponse(503),
            MockResponse(503),
            MockResponse(503),
        ]
        mock_session = MockSession(responses)

        with patch('asyncio.sleep', new_callable=AsyncMock):
            # Should eventually raise RetryableError after exhausting retries
            with pytest.raises(RetryableError):
                await wrapper.fetch_json("http://example.com", mock_session)

        # Should have tried 3 times
        assert mock_session.call_count == 3


@pytest.mark.asyncio
class TestRateLimitHandling:
    """Test rate limit (429) handling"""

    async def test_rate_limit_response(self):
        """Test handling of 429 with Retry-After header"""
        wrapper = SourceFetchRetryWrapper("test_source", max_attempts=3)

        # First call: rate limited, second: success
        rate_limit_response = MockResponse(429)
        rate_limit_response.headers = {"Retry-After": "2"}

        success_response = MockResponse(200, json_data={"success": True})

        responses = [rate_limit_response, success_response]
        mock_session = MockSession(responses)

        # Mock sleep to avoid actual waiting
        with patch('asyncio.sleep', new_callable=AsyncMock) as mock_sleep:
            result = await wrapper.fetch_json("http://example.com", mock_session)

        assert result == {"success": True}
        assert mock_session.call_count == 2

        # Should have slept for the rate limit duration
        mock_sleep.assert_called()


def test_imports():
    """Test that all imports work"""
    from sources.retry_manager import (
        FetchRetryManager,
        SourceFetchRetryWrapper,
        fetch_with_retry,
        RetryableError,
        PermanentError,
    )

    assert FetchRetryManager is not None
    assert SourceFetchRetryWrapper is not None
    assert fetch_with_retry is not None
    assert RetryableError is not None
    assert PermanentError is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
