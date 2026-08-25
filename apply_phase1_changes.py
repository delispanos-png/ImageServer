#!/usr/bin/env python3
"""
Script to apply Phase 1 changes to main.py
Adds Sentry and Structured Logging
"""

import sys

# Read main.py
with open('/home/imageuser/imageDataAPI/app/main.py', 'r') as f:
    content = f.read()

# Check if changes already applied
if 'sentry_config' in content and 'logging_config' in content:
    print("✅ Phase 1 changes already applied!")
    sys.exit(0)

# Apply changes
changes_made = []

# 1. Add imports after rate_limit import
if 'from rate_limit import' in content and 'from sentry_config import' not in content:
    content = content.replace(
        'from rate_limit import rate_limit_middleware, start_cleanup_task',
        '''from rate_limit import rate_limit_middleware, start_cleanup_task
from sentry_config import init_sentry
from logging_config import setup_logging, get_logger
import uuid
from structlog.contextvars import bind_contextvars, clear_contextvars'''
    )
    changes_made.append("Added imports")

# 2. Add logging and sentry init after load_dotenv()
if 'load_dotenv()' in content and 'setup_logging(' not in content:
    content = content.replace(
        '''app = FastAPI()
load_dotenv()

SKROUTZ_FETCH_ENABLED''',
        '''app = FastAPI()
load_dotenv()

# Setup structured logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
JSON_LOGS = os.getenv("JSON_LOGS", "true").lower() == "true"
setup_logging(log_level=LOG_LEVEL, json_logs=JSON_LOGS)

log = get_logger(__name__)

# Initialize Sentry error tracking
init_sentry()

log.info("application_starting",
         mongo_host=os.getenv("MONGO_HOST", "mongodb"),
         mongo_db=os.getenv("MONGO_DB", "imageDB"))

SKROUTZ_FETCH_ENABLED'''
    )
    changes_made.append("Added logging and Sentry initialization")

# 3. Add logging middleware after rate limiting
if 'app.middleware("http")(rate_limit_middleware)' in content and 'logging_middleware' not in content:
    content = content.replace(
        '''# Add rate limiting middleware (before CORS)
app.middleware("http")(rate_limit_middleware)

app.add_middleware(
    CORSMiddleware,''',
        '''# Add rate limiting middleware (before CORS)
app.middleware("http")(rate_limit_middleware)

# Add logging middleware with request tracking
@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """Add request logging with request_id tracking"""
    request_id = str(uuid.uuid4())
    bind_contextvars(request_id=request_id)

    log.info(
        "request_started",
        method=request.method,
        path=request.url.path,
        client_ip=request.client.host if request.client else None,
    )

    try:
        response = await call_next(request)
        log.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
        )
        response.headers["X-Request-ID"] = request_id
        return response
    except Exception as e:
        log.error(
            "request_failed",
            method=request.method,
            path=request.url.path,
            error=str(e),
            error_type=type(e).__name__,
        )
        raise
    finally:
        clear_contextvars()

app.add_middleware(
    CORSMiddleware,'''
    )
    changes_made.append("Added logging middleware")

# 4. Update startup event
if 'start_cleanup_task()' in content and 'log.info("application_started"' not in content:
    content = content.replace(
        '''    await sync_legacy_xml_clients_to_cms(db)
    # Start rate limiter cleanup task
    start_cleanup_task()''',
        '''    await sync_legacy_xml_clients_to_cms(db)
    # Start rate limiter cleanup task
    start_cleanup_task()

    log.info("application_started", message="CloudOn Platform is ready")'''
    )
    changes_made.append("Updated startup event")

# Write updated file
if changes_made:
    with open('/home/imageuser/imageDataAPI/app/main.py', 'w') as f:
        f.write(content)

    print("✅ Phase 1 changes applied successfully!")
    print("\nChanges made:")
    for change in changes_made:
        print(f"  - {change}")
    print("\n📝 Next steps:")
    print("  1. Add SENTRY_DSN to .env file")
    print("  2. Install dependencies: pip install sentry-sdk[fastapi] structlog")
    print("  3. Restart application: docker compose restart fastapi")
else:
    print("⚠️  No changes applied - check if imports already exist")
