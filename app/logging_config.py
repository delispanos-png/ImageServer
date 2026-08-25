"""
Structured Logging Configuration for CloudOn Platform
Uses structlog for JSON-formatted, searchable logs
"""

import logging
import sys
from typing import Any

import structlog
from structlog.types import EventDict, Processor


def setup_logging(log_level: str = "INFO", json_logs: bool = True) -> None:
    """
    Configure structured logging for the application

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        json_logs: If True, output JSON format. If False, human-readable format
    """

    # Configure timestamper
    timestamper = structlog.processors.TimeStamper(fmt="iso")

    # Shared processors for both structlog and stdlib logging
    shared_processors: list[Processor] = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.ExtraAdder(),
        timestamper,
    ]

    if json_logs:
        # JSON output for production
        structlog.configure(
            processors=shared_processors + [
                structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
            ],
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )

        formatter = structlog.stdlib.ProcessorFormatter(
            processors=[
                structlog.stdlib.ProcessorFormatter.remove_processors_meta,
                structlog.processors.JSONRenderer(),
            ],
            foreign_pre_chain=shared_processors,
        )
    else:
        # Human-readable output for development
        structlog.configure(
            processors=shared_processors + [
                structlog.dev.ConsoleRenderer(),
            ],
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )

        formatter = structlog.stdlib.ProcessorFormatter(
            processors=[
                structlog.stdlib.ProcessorFormatter.remove_processors_meta,
                structlog.dev.ConsoleRenderer(colors=True),
            ],
            foreign_pre_chain=shared_processors,
        )

    # Configure stdlib logging
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level.upper())

    # Set levels for noisy libraries
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.WARNING)


def get_logger(name: str = None) -> Any:
    """
    Get a structured logger instance

    Usage:
        log = get_logger(__name__)
        log.info("product_updated", product_id=123, barcode="5200123456789")
    """
    return structlog.get_logger(name)


# Request ID processor (for tracking requests)
def add_request_id(logger: Any, method_name: str, event_dict: EventDict) -> EventDict:
    """
    Add request_id to all log entries during request processing
    """
    request_id = structlog.contextvars.get_contextvars().get("request_id")
    if request_id:
        event_dict["request_id"] = request_id
    return event_dict


# User context processor
def add_user_context(logger: Any, method_name: str, event_dict: EventDict) -> EventDict:
    """
    Add user context to log entries
    """
    user_id = structlog.contextvars.get_contextvars().get("user_id")
    if user_id:
        event_dict["user_id"] = user_id
    return event_dict
