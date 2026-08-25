"""
Sentry Configuration for CloudOn Platform
Centralized error tracking and performance monitoring
"""

import os
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.asyncio import AsyncioIntegration
from sentry_sdk.integrations.pymongo import PyMongoIntegration


def init_sentry() -> None:
    """
    Initialize Sentry for error tracking and performance monitoring

    Only initializes if SENTRY_DSN is set in environment variables
    """
    sentry_dsn = os.getenv("SENTRY_DSN")

    if not sentry_dsn:
        print("⚠️  Sentry DSN not configured - error tracking disabled")
        print("   Set SENTRY_DSN in .env to enable error tracking")
        return

    environment = os.getenv("SENTRY_ENVIRONMENT", "development")
    traces_sample_rate = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1"))

    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,

        # Integrations
        integrations=[
            FastApiIntegration(),
            AsyncioIntegration(),
            PyMongoIntegration(),
        ],

        # Performance Monitoring
        traces_sample_rate=traces_sample_rate,

        # Set traces_sample_rate to 1.0 to capture 100% of transactions
        # We recommend adjusting this value in production

        # Send default PII (Personally Identifiable Information)
        send_default_pii=False,  # Set to True to capture user info

        # Max breadcrumbs
        max_breadcrumbs=50,

        # Before send hook (optional - for filtering)
        before_send=before_send_hook,
    )

    print(f"✅ Sentry initialized - Environment: {environment}, Sample rate: {traces_sample_rate}")


def before_send_hook(event, hint):
    """
    Filter or modify events before sending to Sentry

    Example: Don't send 404 errors
    """
    if "exc_info" in hint:
        exc_type, exc_value, tb = hint["exc_info"]

        # Don't send HTTPException with 404 status
        if hasattr(exc_value, "status_code") and exc_value.status_code == 404:
            return None

    return event


def capture_exception(error: Exception, context: dict = None) -> None:
    """
    Manually capture an exception with optional context

    Usage:
        try:
            risky_operation()
        except Exception as e:
            capture_exception(e, {"user_id": user.id, "action": "fetch_product"})
    """
    if context:
        sentry_sdk.set_context("custom", context)

    sentry_sdk.capture_exception(error)


def capture_message(message: str, level: str = "info", context: dict = None) -> None:
    """
    Capture a message (not an exception)

    Levels: 'debug', 'info', 'warning', 'error', 'fatal'

    Usage:
        capture_message("User performed unusual action", level="warning",
                       context={"user_id": 123, "action": "bulk_delete"})
    """
    if context:
        sentry_sdk.set_context("custom", context)

    sentry_sdk.capture_message(message, level=level)


def set_user_context(user_id: str, email: str = None, username: str = None) -> None:
    """
    Set user context for error tracking

    Usage:
        set_user_context(user_id="123", email="user@example.com", username="john")
    """
    sentry_sdk.set_user({
        "id": user_id,
        "email": email,
        "username": username,
    })


def add_breadcrumb(message: str, category: str = "default", level: str = "info", data: dict = None) -> None:
    """
    Add a breadcrumb to trace user actions

    Usage:
        add_breadcrumb("User viewed product", category="navigation",
                      data={"product_id": "123", "barcode": "5200123456789"})
    """
    sentry_sdk.add_breadcrumb(
        message=message,
        category=category,
        level=level,
        data=data or {},
    )
