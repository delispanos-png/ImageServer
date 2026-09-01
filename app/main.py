from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pymongo import AsyncMongoClient, ReturnDocument
from pathlib import Path
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv
from typing import Any, Dict, List, Optional, Set, Union
from pydantic import BaseModel, Field
from bson import ObjectId
from skroutzFetch import fetch_product_with_source_priority
from category_lookup import apply_excel_categories
from image_paths import scan_public_image_urls
from source_locks import (
    TRUSTED_PHOTO_PROTECTED_TOP_LEVEL_FIELDS,
    get_trusted_photo_lock_source,
    normalize_source_name,
    should_preserve_trusted_photos,
)
from cms_auth import create_cms_auth_router
from cms_permissions import get_current_cms_user
from cms_audit import create_cms_audit_router
from cms_catalog import create_cms_catalog_router, sync_cms_taxonomy_from_products
from cms_client_services import load_xml_service_clients, sync_legacy_xml_clients_to_cms
from cms_clients import create_cms_clients_router
from cms_dashboard import create_cms_dashboard_router
from cms_customer_remarks import create_cms_customer_remarks_router
from cms_analytics import create_cms_analytics_router
from cms_attributes import create_cms_attributes_router
from cms_brand_queue import create_cms_brand_queue_router
from cms_duplicates import create_cms_duplicates_router
from cms_missing_barcodes import create_cms_missing_barcodes_router
from cms_product_submissions import create_cms_product_submissions_router
from cms_source_scanner import create_cms_source_scanner_router
from cms_header import create_cms_header_router
from cms_notifications import create_cms_notifications_router
from cms_server import create_cms_server_router
from cms_settings import create_cms_settings_router
from cms_sources import create_cms_sources_router
from cms_users import create_cms_users_router
from catalog_quality import build_catalog_quality_updates
from missing_barcodes import log_missing_barcodes, mark_status as mark_missing_status
from portal_auth import create_portal_auth_router
from portal import create_portal_router
from portal_submissions import create_portal_submissions_router
from health import create_health_router
from rate_limit import rate_limit_middleware, start_cleanup_task
from sentry_config import init_sentry
from logging_config import setup_logging, get_logger
import uuid
from structlog.contextvars import bind_contextvars, clear_contextvars
from api_clients import (
    LEGACY_API_CLIENTS,
    build_api_client_key,
    sync_legacy_api_clients_to_cms,
    track_api_client_usage,
    verify_api_client_password,
)
from runtime_settings import (
    get_api_endpoints,
    get_api_settings,
    is_api_endpoint_enabled,
    is_source_enabled_for_images,
)
from xml_service import fetch_xml_file as fetch_xml_service_file
import asyncio 
import traceback
import random
app = FastAPI(
    title="CloudOn Content Sync Platform API",
    version="2.1",
    # Disable default Swagger/ReDoc endpoints so we can serve them from
    # unpkg.com — the default `cdn.jsdelivr.net` is often blocked by
    # ad-blockers (NextDNS, uBlock rules), which shows users a blank page.
    docs_url=None,
    redoc_url=None,
    description=(
        "Product catalog & image delivery API. Clients query one or many "
        "barcodes and receive normalized product records (title, brand, "
        "categories, descriptions, hosted image URLs). Supports incremental "
        "sync: pass `updated_since` / `updated_until` to fetch only records "
        "created or refreshed in a specific window — clients don't need to "
        "re-download the whole catalog every day.\n\n"
        "**Auth**: Basic Auth with the credentials issued per client.\n\n"
        "**Rate limits**: Per-endpoint, tracked against each client's plan.\n\n"
        "**Missing barcodes**: If a requested barcode isn't in the catalog, "
        "we search live sources; a permanent miss is cached for 6h and "
        "returned as an empty entry (still logged in the missing queue)."
    ),
    contact={"name": "CloudOn Support", "email": "support@cloudon.gr"},
    openapi_tags=[
        {"name": "Products", "description": "Query product catalog by barcode and/or last-update window."},
        {"name": "Health", "description": "Service liveness/readiness probes."},
        {"name": "CMS", "description": "Admin CMS operations (auth required)."},
        {"name": "Portal", "description": "Customer portal endpoints."},
    ],
)
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

SKROUTZ_FETCH_ENABLED = os.getenv("SKROUTZ_FETCH_ENABLED", "true").lower() == "true"
SKROUTZ_FETCH_TIMEOUT_SECONDS = int(os.getenv("SKROUTZ_FETCH_TIMEOUT_SECONDS", "180"))
SKROUTZ_FETCH_CONCURRENCY = int(os.getenv("SKROUTZ_FETCH_CONCURRENCY", "1"))
SOURCE_FETCH_MODE = os.getenv("SOURCE_FETCH_MODE", "background").lower()
SOURCE_PER_SITE_TIMEOUT_SECONDS = int(os.getenv("SOURCE_PER_SITE_TIMEOUT_SECONDS", "18"))
SOURCE_FETCH_CHAIN_LENGTH = 1
SKROUTZ_FETCH_CONCURRENCY = max(1, SKROUTZ_FETCH_CONCURRENCY)
skroutz_semaphore = asyncio.Semaphore(SKROUTZ_FETCH_CONCURRENCY)
pending_source_fetches: Set[str] = set()
pending_source_fetches_lock = asyncio.Lock()

# MongoDB Config
MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_HOST = os.getenv("MONGO_HOST", "mongodb")
MONGO_PORT = int(os.getenv("MONGO_PORT", 27017))
MONGO_DB = os.getenv("MONGO_DB", "imageDB")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
IMAGE_PUBLIC_BASE_URL = os.getenv("IMAGE_PUBLIC_BASE_URL", "https://image.cloudon.gr/photos").rstrip("/")
CMS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CMS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://image.cloudon.gr",
    ).split(",")
    if origin.strip()
]

MONGO_URI = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}"
client = AsyncMongoClient(MONGO_URI)
db = client[MONGO_DB]
app.state.cms_db = db

# Add rate limiting middleware (before CORS)
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
    CORSMiddleware,
    allow_origins=CMS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cms_auth_router = create_cms_auth_router(db)
app.include_router(cms_auth_router)
portal_auth_router = create_portal_auth_router(db)
app.include_router(portal_auth_router)
app.include_router(create_portal_router(db, portal_auth_router.get_current_portal_client))  # type: ignore[attr-defined]
app.include_router(create_portal_submissions_router(db, portal_auth_router.get_current_portal_client))  # type: ignore[attr-defined]
app.include_router(create_cms_catalog_router(db))
app.include_router(create_cms_clients_router(db))
app.include_router(create_cms_dashboard_router(db))
app.include_router(create_cms_customer_remarks_router(db))
app.include_router(create_cms_brand_queue_router(db))
app.include_router(create_cms_duplicates_router(db))
app.include_router(create_cms_analytics_router(db))
app.include_router(create_cms_attributes_router(db))
app.include_router(create_cms_header_router(db))
app.include_router(create_cms_server_router(db))
app.include_router(create_cms_audit_router(db))
app.include_router(create_cms_notifications_router(db))
app.include_router(create_cms_settings_router(db))
app.include_router(create_cms_sources_router(db))
app.include_router(create_cms_users_router(db))
app.include_router(create_health_router())


# ---------- Docs endpoints served from unpkg (jsdelivr often ad-blocked) ----------

_SWAGGER_UI_JS = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"
_SWAGGER_UI_CSS = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css"
_REDOC_JS = "https://unpkg.com/redoc@2.1.5/bundles/redoc.standalone.js"


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="CloudOn API — Swagger",
        swagger_js_url=_SWAGGER_UI_JS,
        swagger_css_url=_SWAGGER_UI_CSS,
        swagger_favicon_url="https://image.cloudon.gr/favicon.png",
    )


@app.get("/redoc", include_in_schema=False)
async def custom_redoc_html():
    return get_redoc_html(
        openapi_url="/openapi.json",
        title="CloudOn API — ReDoc",
        redoc_js_url=_REDOC_JS,
        redoc_favicon_url="https://image.cloudon.gr/favicon.png",
    )


security = HTTPBasic()
# folder_path = Path("C:/Users/DevPc/Desktop/dummyPhotos")
# files = [file.name for file in folder_path.iterdir() if file.is_file()]
# for file in files:
#     print("Files in folder:", file[:-4])


clients = LEGACY_API_CLIENTS


@app.on_event("startup")
async def bootstrap_cms_auth() -> None:
    await cms_auth_router.bootstrap_admin_user()  # type: ignore[attr-defined]
    await sync_cms_taxonomy_from_products(db)
    await sync_legacy_api_clients_to_cms(db)
    await sync_legacy_xml_clients_to_cms(db)
    await ensure_cms_clients_indexes()
    # Start rate limiter cleanup task
    start_cleanup_task()

    log.info("application_started", message="CloudOn Platform is ready")


async def ensure_cms_clients_indexes() -> None:
    try:
        await db.cms_clients.create_index(
            [("source_type", 1), ("api_username", 1)],
            name="api_basic_username_unique",
            unique=True,
            partialFilterExpression={"source_type": "api_basic", "api_username": {"$type": "string"}},
        )
        await db.cms_clients.create_index([("email", 1)], name="email_idx", sparse=True)
        await db.cms_clients.create_index([("api_client_key", 1)], name="api_client_key_idx", sparse=True)
        await db.cms_clients.create_index([("services.xml_service.domain", 1)], name="xml_domain_idx", sparse=True)
        await db.cms_categories.create_index([("parent_id", 1)], name="parent_id_idx", sparse=True)
        from customer_submissions import ensure_indexes as ensure_submission_indexes
        await ensure_submission_indexes(db)
        from youpharmacy_url_index import ensure_indexes as ensure_yp_index
        await ensure_yp_index(db)
        from cms_notifications import ensure_notification_indexes
        await ensure_notification_indexes(db)
        await db.pending_brand_imports.create_index([("status", 1), ("seen_count", -1)],
                                                    name="brand_queue_status_seen_idx")
        await db.pending_brand_imports.create_index([("brand", 1), ("status", 1)],
                                                    name="brand_queue_brand_status_idx")
        await db.pending_brand_imports.create_index([("resolved_to_barcode", 1)],
                                                    name="brand_queue_resolved_bc_idx", sparse=True)
        # Normalize orphan notification docs (no status field or invalid
        # value) so counters and filters match reality.
        await db.cms_notification_events.update_many(
            {"status": {"$nin": ["pending", "published"]}},
            {"$set": {"status": "pending"}},
        )
        log.info("cms_indexes_ensured")
    except Exception as exc:
        log.error("cms_indexes_failed", error=str(exc))

def _normalize_trial_mode_value(raw) -> str:
    value = str(raw or "").strip().lower()
    if value in ("random", "quota"):
        return "quota"
    return "whitelist"


async def validate_client(request: Request, credentials: HTTPBasicCredentials = Depends(security)):
    from api_clients import is_request_ip_allowed
    cms_client = await db.cms_clients.find_one(
        {
            "source_type": "api_basic",
            "api_username": credentials.username,
        },
        {
            "is_active": 1,
            "api_password_hash": 1,
            "api_domain": 1,
            "api_username": 1,
            "name": 1,
            "company": 1,
            "api_client_key": 1,
            "is_trial": 1,
            "trial_mode": 1,
            "trial_max_requests": 1,
            "trial_random_count": 1,
            "trial_barcodes": 1,
            "api_request_count": 1,
            "category_ids": 1,
            "receive_all_categories": 1,
            "allowed_ips": 1,
        },
    )
    if cms_client:
        if not bool(cms_client.get("is_active", True)):
            raise HTTPException(status_code=403, detail="API client disabled")
        if not verify_api_client_password(credentials.password, str(cms_client.get("api_password_hash", "")).strip()):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        # IP whitelist enforcement. Empty list = allow any IP (opt-in
        # behavior: existing clients continue to work until the operator
        # populates the list explicitly).
        allowed_ips = [str(x).strip() for x in (cms_client.get("allowed_ips") or []) if str(x).strip()]
        if allowed_ips:
            request_ip = resolve_request_ip(request)
            if not is_request_ip_allowed(request_ip, allowed_ips):
                log.warning(
                    "api_client_ip_rejected",
                    username=credentials.username,
                    request_ip=request_ip,
                    allowed_count=len(allowed_ips),
                )
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied: IP {request_ip or '(unknown)'} is not in the client's allowed list.",
                )
        return {
            "domain": str(cms_client.get("api_domain", "")).strip() or str(cms_client.get("name", "")).strip(),
            "username": str(cms_client.get("api_username", "")).strip(),
            "api_client_key": str(cms_client.get("api_client_key", "")).strip(),
            "cms_client_id": cms_client.get("_id"),
            "company": str(cms_client.get("company", "")).strip(),
            "is_trial": bool(cms_client.get("is_trial", False)),
            "trial_mode": _normalize_trial_mode_value(cms_client.get("trial_mode")),
            "trial_max_requests": int(
                cms_client.get("trial_max_requests", cms_client.get("trial_random_count", 300)) or 300
            ),
            "trial_barcodes": [str(bc).strip() for bc in cms_client.get("trial_barcodes", []) if str(bc).strip()],
            "api_request_count": int(cms_client.get("api_request_count", 0) or 0),
            "category_ids": [str(cid).strip() for cid in cms_client.get("category_ids", []) if str(cid).strip()],
            "receive_all_categories": bool(cms_client.get("receive_all_categories", False)),
            "allowed_ips": allowed_ips,
        }

    for client in clients:
        if (
            credentials.username == client["username"]
            and credentials.password == client["password"]
        ):
            api_client_key = build_api_client_key(client)
            cms_client = await db.cms_clients.find_one(
                {"api_client_key": api_client_key},
                {"is_active": 1, "allowed_ips": 1},
            )
            if cms_client and not bool(cms_client.get("is_active", True)):
                raise HTTPException(status_code=403, detail="API client disabled")
            if cms_client:
                allowed_ips = [str(x).strip() for x in (cms_client.get("allowed_ips") or []) if str(x).strip()]
                if allowed_ips:
                    request_ip = resolve_request_ip(request)
                    if not is_request_ip_allowed(request_ip, allowed_ips):
                        log.warning(
                            "legacy_client_ip_rejected",
                            username=credentials.username,
                            request_ip=request_ip,
                        )
                        raise HTTPException(
                            status_code=403,
                            detail=f"Access denied: IP {request_ip or '(unknown)'} is not in the client's allowed list.",
                        )
            return client
    raise HTTPException(status_code=401, detail="Invalid credentials")


def ensure_api_endpoint_enabled(endpoint_key: str) -> None:
    if is_api_endpoint_enabled(endpoint_key):
        return
    if endpoint_key == "products":
        raise HTTPException(status_code=503, detail="/products API is disabled")
    if endpoint_key == "products_internal":
        raise HTTPException(status_code=503, detail="/products_internal API is disabled")
    raise HTTPException(status_code=503, detail="API endpoint is disabled")


async def fetch_from_sources_controlled(barcode: str) -> Dict:
    if not SKROUTZ_FETCH_ENABLED:
        return {}

    async with skroutz_semaphore:
        try:
            print(f"Starting source fetch for barcode {barcode}")
            fetch_task = fetch_product_with_source_priority(str(barcode))
            effective_timeout = SKROUTZ_FETCH_TIMEOUT_SECONDS
            if SOURCE_FETCH_MODE == "sync" and effective_timeout > 0:
                minimum_chain_timeout = (SOURCE_PER_SITE_TIMEOUT_SECONDS * SOURCE_FETCH_CHAIN_LENGTH) + 10
                effective_timeout = max(effective_timeout, minimum_chain_timeout)

            if effective_timeout <= 0:
                result = await fetch_task
                print(f"Completed source fetch for barcode {barcode}: {bool(result)}")
                return result

            result = await asyncio.wait_for(
                fetch_task,
                timeout=effective_timeout,
            )
            print(f"Completed source fetch for barcode {barcode}: {bool(result)}")
            return result
        except asyncio.TimeoutError:
            print(f"⚠️ Source fetch timeout for barcode: {barcode}")
            return {}
        except Exception as exc:
            print(f"⚠️ Source fetch failed for barcode {barcode}: {exc}")
            return {}


async def list_image_urls_by_barcode() -> Dict[str, List[str]]:
    def _scan_images() -> Dict[str, List[str]]:
        folder_path = Path("/app/images")
        if not folder_path.exists() or not folder_path.is_dir():
            raise FileNotFoundError("Image folder not found or inaccessible.")
        return scan_public_image_urls(folder_path, IMAGE_PUBLIC_BASE_URL)

    return await asyncio.to_thread(_scan_images)


def resolve_response_image_urls(
    product: Dict,
    image_urls_by_barcode: Dict[str, List[str]],
    *,
    allow_external_fallback: bool,
) -> List[str]:
    barcode = str(product.get("Barcode", "")).strip()
    if barcode:
        hosted_urls = image_urls_by_barcode.get(barcode, [])
        if hosted_urls:
            return hosted_urls

    if not allow_external_fallback:
        return []

    other_sites = product.get("Other_Sites", {})
    if isinstance(other_sites, dict):
        preferred_sources = ["pharmacy295_excel", "pharmacy295", "farmakopoiosmou"]
        visited_sources = set()
        for source_key in preferred_sources + list(other_sites.keys()):
            if source_key in visited_sources:
                continue
            visited_sources.add(source_key)
            site_data = other_sites.get(source_key, {})
            if not isinstance(site_data, dict):
                continue
            image_url_list = site_data.get("Img_src_List", [])
            if isinstance(image_url_list, list):
                normalized_urls = [str(url).strip() for url in image_url_list if str(url).strip()]
                if normalized_urls:
                    return normalized_urls
            source_image_url = str(site_data.get("Img_src", "")).strip()
            if source_image_url:
                return [source_image_url]

    source_image_url = str(product.get("Img_src", "")).strip()
    if source_image_url:
        return [source_image_url]

    return []


def init_merged_product(include_internal_fields: bool = False) -> Dict:
    merged_product = {
        "Title": [],
        "Sml_Title": [],
        "Description": [],
        "Image_url": [],
        "Weight": "",
        "Brand": "",
        "Category_1": "",
        "Category_2": "",
        "Category_3": "",
        # last_updated_at is always exposed so incremental-sync clients can
        # decide whether their local copy is fresh enough — see
        # ProductsRequest.updated_since.
        "last_updated_at": "",
    }
    if include_internal_fields:
        merged_product.update(
            {
                "Site": "",
                "Categ": "",
                "Product_Link": "",
                "Img_src": "",
                "last_source": "",
            }
        )
    return merged_product


def merge_products(
    raw_results: List[Dict],
    image_urls_by_barcode: Dict[str, List[str]],
    include_internal_fields: bool = False,
    allow_external_image_urls: bool = False,
) -> List[Dict]:
    merged = {}

    for product in raw_results:
        barcode = product.get("Barcode")
        if not barcode:
            continue

        if barcode not in merged:
            merged[barcode] = init_merged_product(include_internal_fields=include_internal_fields)

        def add_unique(field, value):
            if value and value not in merged[barcode][field]:
                merged[barcode][field].append(value)

        add_unique("Title", product.get("Title", ""))
        add_unique("Sml_Title", product.get("Sml_Title", ""))
        add_unique("Description", product.get("Description", ""))

        # `dict.get(k, default)` returns None if the key exists but is
        # explicitly None — which the Pydantic `ProductDetail` schema
        # rejects (fields typed as `str`). Coerce every scalar to a
        # trimmed string here so the response is always serialisable.
        merged[barcode]["Weight"] = str(product.get("Weight") or "").strip()
        merged[barcode]["Brand"] = str(product.get("Brand") or "").strip()
        merged[barcode]["Category_1"] = str(product.get("Category_1") or "").strip()
        merged[barcode]["Category_2"] = str(product.get("Category_2") or "").strip()
        merged[barcode]["Category_3"] = str(product.get("Category_3") or "").strip()
        # Prefer cms_updated_at (admin edits + auto-refresh) over the legacy
        # last_updated_at so incremental-sync clients see the freshest
        # timestamp. Falls back if cms_updated_at is missing.
        merged[barcode]["last_updated_at"] = (
            str(product.get("cms_updated_at") or product.get("last_updated_at") or "").strip()
        )

        if include_internal_fields:
            merged[barcode]["Site"] = product.get("Site", "")
            merged[barcode]["Categ"] = product.get("Categ", "")
            merged[barcode]["Product_Link"] = product.get("Product_Link", "")
            merged[barcode]["Img_src"] = product.get("Img_src", "")
            merged[barcode]["last_source"] = product.get("last_source", "")

        other_sites = product.get("Other_Sites", {})
        for site_data in other_sites.values():
            add_unique("Title", site_data.get("Title", ""))
            add_unique("Sml_Title", site_data.get("Sml_Title", ""))
            add_unique("Description", site_data.get("Description", ""))

        for image_url in resolve_response_image_urls(
            product,
            image_urls_by_barcode,
            allow_external_fallback=allow_external_image_urls,
        ):
            if image_url and image_url not in merged[barcode]["Image_url"]:
                merged[barcode]["Image_url"].append(image_url)
                print(f"Added image URL: {image_url}")

    return [{barcode: details} for barcode, details in merged.items()]


def filter_api_fields(transformed_result: List[Dict], allowed_fields: List[str]) -> List[Dict]:
    if not allowed_fields:
        return transformed_result
    allowed = set(allowed_fields)
    filtered: List[Dict] = []
    for item in transformed_result:
        if not isinstance(item, dict):
            continue
        for barcode, details in item.items():
            if not isinstance(details, dict):
                filtered.append(item)
                continue
            filtered_details = {key: value for key, value in details.items() if key in allowed}
            filtered.append({barcode: filtered_details})
    return filtered


def get_api_endpoint_config(endpoint_key: str) -> Dict:
    endpoints = get_api_endpoints()
    return endpoints.get(endpoint_key, {})


def _parse_iso_datetime(value: Any, *, field: str) -> Optional[datetime]:
    """Parse an ISO-8601 date or datetime, tolerating a trailing 'Z'.

    Returns None if `value` is falsy. Raises HTTPException(422) on
    unparseable input so callers get a clear error instead of a silent
    "no filter" outcome.
    """
    if not value:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    raw = str(value).strip()
    if not raw:
        return None
    if raw.endswith("Z"):
        raw = raw[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(raw)
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=f"{field} is not a valid ISO-8601 datetime: {value!r}",
        ) from exc
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed


async def handle_products_request(
    body: Dict,
    request: Request,
    client: Dict,
    endpoint_key: str,
    endpoint_path: str,
    config: Dict,
    *,
    skip_source_fetch: bool = False,
) -> Dict:
    log.info(
        "products_request_received",
        endpoint=endpoint_path,
        client_domain=client.get("domain"),
        body_keys=list(body.keys()) if isinstance(body, dict) else [],
        body_values={k: str(v)[:50] for k, v in body.items()} if isinstance(body, dict) else {},
    )
    try:
        barcodes = body.get("barcode")
        # Backwards compat: barcode may be missing when the caller is doing
        # an incremental sync (updated_since only). Only reject when it's
        # present as something other than string/list.
        if barcodes is None:
            barcodes = []
        if isinstance(barcodes, str):
            barcodes = [barcodes]
        elif not isinstance(barcodes, list):
            raise HTTPException(status_code=422, detail="barcode must be string or list of strings")

        updated_since = _parse_iso_datetime(body.get("updated_since"), field="updated_since")
        updated_until = _parse_iso_datetime(body.get("updated_until"), field="updated_until")

        # Incremental-sync mode: no barcodes, at least one date window. Pull
        # matching products directly from the DB (no source-fetch attempt,
        # since we know they already exist).
        incremental_total: Optional[int] = None
        incremental_next_cursor: Optional[str] = None
        incremental_mode: bool = not barcodes
        if not barcodes:
            if not (updated_since or updated_until):
                raise HTTPException(
                    status_code=422,
                    detail="Provide either `barcode` or `updated_since` (or both).",
                )
            date_query: Dict[str, Any] = {}
            if updated_since:
                date_query["$gte"] = updated_since.isoformat()
            if updated_until:
                date_query["$lt"] = updated_until.isoformat()
            date_or = {
                "$or": [
                    {"cms_updated_at": date_query},
                    {"last_updated_at": date_query},
                ],
            }
            # Only surface items that have passed review and are ready to
            # publish — inactive / needs-fix / awaiting-review records must
            # never reach the customer API.
            public_only = bool(config.get("public_only", True))
            if public_only:
                mongo_filter: Dict[str, Any] = {"$and": [date_or, CUSTOMER_READY_MONGO_FILTER]}
            else:
                mongo_filter = date_or
            limit = int(body.get("limit") or 100)
            limit = max(1, min(500, limit))
            # Cursor takes precedence over offset. Cursor is the string
            # ObjectId of the last document from the previous page — new
            # query filters `_id > cursor` for stable pagination even when
            # docs are inserted/deleted concurrently.
            raw_cursor = str(body.get("cursor") or "").strip()
            offset = max(0, int(body.get("offset") or 0)) if not raw_cursor else 0
            # `total` is always the count of the WHOLE window, so callers
            # can render "page X of Y" without every page looking smaller.
            incremental_total = await db.products.count_documents(mongo_filter)
            page_filter = mongo_filter
            if raw_cursor:
                try:
                    cursor_oid = ObjectId(raw_cursor)
                except Exception as exc:
                    raise HTTPException(
                        status_code=422,
                        detail=f"cursor is not a valid ObjectId: {raw_cursor!r}",
                    ) from exc
                page_filter = {"$and": [mongo_filter, {"_id": {"$gt": cursor_oid}}]}
            # Fetch one extra doc to detect a next page without a second query.
            page_docs = await db.products.find(page_filter).sort("_id", 1).limit(limit + 1).to_list(length=limit + 1)
            has_more = len(page_docs) > limit
            if has_more:
                page_docs = page_docs[:limit]
                incremental_next_cursor = str(page_docs[-1]["_id"])
            if raw_cursor or offset == 0:
                # Cursor mode OR first page of offset mode: use page_docs directly.
                pass
            elif offset > 0:
                # Legacy offset mode: re-query with skip (only when caller
                # explicitly asked). Avoids a large skip on typical requests.
                page_docs = await (
                    db.products.find(page_filter).sort("_id", 1).skip(offset).limit(limit + 1).to_list(length=limit + 1)
                )
                has_more = len(page_docs) > limit
                if has_more:
                    page_docs = page_docs[:limit]
                    incremental_next_cursor = str(page_docs[-1]["_id"])
            barcodes = [
                str(row.get("Barcode") or "").strip()
                for row in page_docs
                if row.get("Barcode")
            ]
        try:
            await track_api_client_usage(
                db,
                client=client,
                request=request,
                endpoint=endpoint_path,
                barcode_count=len(barcodes),
            )
        except Exception as tracking_exc:
            log.warning(
                "track_api_client_usage_failed",
                endpoint=endpoint_path,
                error=str(tracking_exc),
            )

        # Incremental sync must never trigger live source fetch — the client
        # is asking "what changed in your DB since X", not "look up fresh
        # data from Skroutz". Historically, records with missing textual
        # data would fall through to source_fetch inside `resolve_product`,
        # and 40+ parallel source fetches easily blew past the 90s HTTP
        # timeout, causing customers to see the whole page hang at a
        # specific cursor.
        effective_skip_source_fetch: bool = skip_source_fetch or incremental_mode

        # 6-hour cache: if a barcode was already source-searched recently and
        # came up empty, skip the live fetch — sources rarely add a brand-new
        # barcode within hours. This caps the worst-case latency for repeated
        # requests on missing barcodes (the 1st request still pays the live
        # fetch cost; the 2nd-Nth get a fast empty stub).
        recently_searched_missing: set = set()
        if not effective_skip_source_fetch and barcodes:
            barcode_strs = [str(b).strip() for b in barcodes if str(b).strip()]
            if barcode_strs:
                cutoff_iso = (datetime.now(timezone.utc) - timedelta(hours=6)).isoformat()
                cursor = db.missing_barcode_requests.find(
                    {
                        "Barcode": {"$in": barcode_strs},
                        "status": "not_found",
                        "searched_at": {"$gte": cutoff_iso},
                    },
                    {"Barcode": 1, "_id": 0},
                )
                async for row in cursor:
                    recently_searched_missing.add(row["Barcode"])

        async def _resolve_with_cache(b: str) -> Dict:
            cached_miss = b in recently_searched_missing
            return await resolve_product(b, skip_source_fetch=(effective_skip_source_fetch or cached_miss))

        raw_results = await asyncio.gather(
            *(_resolve_with_cache(str(barcode).strip()) for barcode in barcodes)
        )
        # Log barcodes that remain empty after the resolve step. log_missing_barcodes
        # is upsert-idempotent so the row gets created on first miss, then
        # request_count just bumps on repeats.
        missing_barcodes = [
            str(barcode).strip()
            for barcode, product in zip(barcodes, raw_results)
            if not has_textual_product_data(product or {})
        ]
        if missing_barcodes:
            try:
                await log_missing_barcodes(
                    db,
                    missing_barcodes,
                    client_domain=str(client.get("domain") or "").strip(),
                    endpoint_path=endpoint_path,
                )
            except Exception as logging_exc:
                log.warning(
                    "log_missing_barcodes_failed",
                    endpoint=endpoint_path,
                    error=str(logging_exc),
                )

        # After the resolve step, mark missing_barcode_requests with the
        # outcome — but only for barcodes we actually source-searched (i.e.
        # not the cached misses). This is what powers the 6h cache above.
        if not effective_skip_source_fetch:
            for barcode, product in zip(barcodes, raw_results):
                bc_str = str(barcode).strip()
                if not bc_str or bc_str in recently_searched_missing:
                    continue
                if has_textual_product_data(product or {}):
                    new_status, notes = "found", "source_match"
                else:
                    new_status, notes = "not_found", "no_source_match"
                try:
                    await mark_missing_status(
                        db, bc_str, status=new_status, notes=notes, increment_attempt=True
                    )
                except Exception as mark_exc:
                    log.warning(
                        "mark_missing_status_failed",
                        endpoint=endpoint_path,
                        barcode=bc_str,
                        error=str(mark_exc),
                    )
        # `public_only` may already be set above (incremental branch); recompute
        # defensively for the barcode-lookup branch that skipped it.
        public_only = bool(config.get("public_only", True))
        if public_only:
            # Stricter than legacy is_publicly_active_product — only items
            # that have completed review AND have real textual content
            # reach the customer. This matches the mongo-side filter used
            # in the incremental branch.
            raw_results = [product for product in raw_results if is_customer_ready_product(product)]
        raw_results = await apply_client_category_filter(raw_results, client)

        # Constrained-sync mode: caller passed both a barcode list AND a
        # date window. Apply the window here (incremental-only mode already
        # queried DB with the same predicate, so this is a no-op there).
        if updated_since or updated_until:
            def _in_window(product: Dict) -> bool:
                ts_str = str(
                    product.get("cms_updated_at") or product.get("last_updated_at") or ""
                ).strip()
                if not ts_str:
                    return False
                parsed = _parse_iso_datetime(ts_str, field="cms_updated_at")
                if not parsed:
                    return False
                if updated_since and parsed < updated_since:
                    return False
                if updated_until and parsed >= updated_until:
                    return False
                return True
            raw_results = [p for p in raw_results if _in_window(p)]

        if not raw_results:
            log.info("products_response_empty", endpoint=endpoint_path, requested_count=len(barcodes))
            empty_response: Dict[str, Any] = {"success": True, "data": []}
            if incremental_total is not None:
                empty_response["total"] = incremental_total
                empty_response["next_cursor"] = incremental_next_cursor
            return empty_response

        allow_external_image_urls = bool(config.get("allow_external_image_urls", False))
        include_internal_fields = bool(config.get("include_internal_fields", False))
        image_urls_by_barcode = await list_image_urls_by_barcode()
        transformed_result = merge_products(
            raw_results,
            image_urls_by_barcode,
            include_internal_fields=include_internal_fields,
            allow_external_image_urls=allow_external_image_urls,
        )

        if public_only:
            TARGET_WORDS_LOWER = [
                "ofarmakopoiosmou", "vita4you", "pharm16",
                "tofarmakeiomou", "boxpharmacy", "box pharmacy",
            ]
            blocked_barcodes: Set[str] = set()
            for item in transformed_result:
                for barcode, details in item.items():
                    for field in ("Title", "Sml_Title", "Description"):
                        for text in details.get(field, []) or []:
                            text_lower = str(text).lower()
                            if any(word in text_lower for word in TARGET_WORDS_LOWER):
                                log.info(
                                    "barcode_blocked_target_word",
                                    barcode=barcode,
                                    field=field,
                                )
                                blocked_barcodes.add(barcode)
                                break
                        if barcode in blocked_barcodes:
                            break
            if blocked_barcodes:
                transformed_result = [
                    item
                    for item in transformed_result
                    if not (set(item.keys()) & blocked_barcodes)
                ]

        filtered_result = filter_api_fields(
            transformed_result,
            config.get("fields", []),
        )
        log.info(
            "products_response_ready",
            endpoint=endpoint_path,
            returned_count=len(filtered_result),
        )
        response_payload: Dict[str, Any] = {"success": True, "data": filtered_result}
        if incremental_total is not None:
            response_payload["total"] = incremental_total
            response_payload["next_cursor"] = incremental_next_cursor
        return response_payload
    except HTTPException:
        raise
    except Exception as e:
        log.error(
            "products_request_failed",
            endpoint=endpoint_path,
            error=str(e),
            traceback=traceback.format_exc(),
        )
        raise HTTPException(status_code=500, detail="Internal server error processing products request")


async def persist_source_product(product: Dict) -> None:
    barcode = str(product.get("Barcode", "")).strip()
    if not barcode:
        return

    try:
        # Defense-in-depth: strip any source-domain suffix that leaked into
        # Title/Sml_Title/Description from a fetcher. Every individual
        # fetcher SHOULD do this, but centralising it here guarantees new
        # fetchers can't accidentally poison the catalog.
        try:
            from skroutzFetch import _strip_site_title_suffix
            for f in ("Title", "Sml_Title"):
                v = product.get(f)
                if isinstance(v, str) and v.strip():
                    cleaned = _strip_site_title_suffix(v)
                    if cleaned != v:
                        product[f] = cleaned
        except Exception:
            pass
        # If this incoming product is from farmakopoiosmou and has an image,
        # the download path already ran `_remove_farmakopoiosmou_watermark`
        # via `_prepare_image_bytes_for_storage`. Reflect that in the flag
        # so downstream watermark-remediation pipelines don't try to fix
        # an already-clean image (which would waste work / risk corruption).
        try:
            from skroutzFetch import was_watermark_cleanup_applied_for_source
            incoming_site = str(product.get("Site") or product.get("last_source") or "").strip().lower()
            has_image_payload = bool(
                product.get("Image_Path")
                or product.get("Image_Path_Collection")
                or product.get("Img_src")
                or product.get("Img_src_List")
            )
            if has_image_payload and was_watermark_cleanup_applied_for_source(incoming_site):
                product["watermark_cleanup_applied"] = True
        except Exception:
            pass
        product = apply_excel_categories(dict(product))
        barcode = str(product.get("Barcode", "")).strip()
        existing = await db.products.find_one({"Barcode": barcode}) or {}
        merged_product = dict(existing)
        merged_product.pop("_id", None)
        now_iso = datetime.now(timezone.utc).isoformat()
        incoming_source = normalize_source_name(
            product.get("Site", ""),
            product.get("last_source", ""),
            product.get("Img_src", ""),
            product.get("Product_Link", ""),
        )
        if incoming_source and not is_source_enabled_for_images(incoming_source):
            for image_field in ("Img_src", "Img_src_List"):
                product.pop(image_field, None)
            other_sites_incoming = product.get("Other_Sites")
            if isinstance(other_sites_incoming, dict):
                site_block = other_sites_incoming.get(incoming_source)
                if isinstance(site_block, dict):
                    site_block.pop("Img_src", None)
                    site_block.pop("Img_src_List", None)
        preserve_locked_photos = should_preserve_trusted_photos(existing, incoming_source)
        existing_photo_lock_source = get_trusted_photo_lock_source(existing)

        for key, value in product.items():
            if key == "_id":
                continue
            if preserve_locked_photos and key in TRUSTED_PHOTO_PROTECTED_TOP_LEVEL_FIELDS:
                continue
            if isinstance(value, str):
                if value.strip():
                    merged_product[key] = value
                elif key not in merged_product:
                    merged_product[key] = value
                continue
            if isinstance(value, dict):
                current_value = merged_product.get(key, {})
                if not isinstance(current_value, dict):
                    current_value = {}
                merged_nested = dict(current_value)
                for nested_key, nested_value in value.items():
                    if isinstance(nested_value, str):
                        if nested_value.strip():
                            merged_nested[nested_key] = nested_value
                        elif nested_key not in merged_nested:
                            merged_nested[nested_key] = nested_value
                    elif nested_value not in (None, "", [], {}):
                        merged_nested[nested_key] = nested_value
                    elif nested_key not in merged_nested:
                        merged_nested[nested_key] = nested_value
                merged_product[key] = merged_nested
                continue
            if value not in (None, "", [], {}):
                merged_product[key] = value
            elif key not in merged_product:
                merged_product[key] = value

        merged_product["Barcode"] = barcode
        if preserve_locked_photos:
            merged_product["photo_source_locked"] = True
            merged_product["photo_source_lock"] = existing_photo_lock_source
            merged_product["photo_source_locked_at"] = existing.get("photo_source_locked_at", now_iso)
            if incoming_source:
                merged_product["last_non_photo_source"] = incoming_source
                merged_product["last_non_photo_updated_at"] = now_iso
        else:
            merged_product["last_source"] = product.get("Site", "") or product.get("last_source", "")
            merged_photo_lock_source = get_trusted_photo_lock_source(merged_product)
            if merged_photo_lock_source:
                merged_product["photo_source_locked"] = True
                merged_product["photo_source_lock"] = merged_photo_lock_source
                merged_product["photo_source_locked_at"] = merged_product.get("photo_source_locked_at", now_iso)
        merged_product["last_updated_at"] = now_iso
        merged_product.update(
            build_catalog_quality_updates(
                merged_product,
                evaluator=f"source:{incoming_source or 'unknown'}",
            )
        )

        await db.products.update_one(
            {"Barcode": barcode},
            {"$set": merged_product},
            upsert=True,
        )
        # If this barcode was on the missing-barcode wishlist, mark it as
        # found and dispatch webhooks to every customer that asked for it.
        try:
            from missing_barcodes import resolve_after_ingest
            await resolve_after_ingest(db, barcode)
        except Exception as notify_exc:
            print(f"⚠️ Webhook notify failed for {barcode}: {notify_exc}")
    except Exception as exc:
        print(f"⚠️ Failed to persist source product for barcode {barcode}: {exc}")


def has_textual_product_data(product: Dict) -> bool:
    if not product:
        return False

    def has_meaningful_text(value) -> bool:
        if isinstance(value, str):
            return bool(value.strip())
        return False

    direct_fields = ("Title", "Sml_Title", "Description")
    if any(has_meaningful_text(product.get(field, "")) for field in direct_fields):
        return True

    for site_data in product.get("Other_Sites", {}).values():
        if any(has_meaningful_text(site_data.get(field, "")) for field in direct_fields):
            return True

    return False


async def enqueue_source_fetch(barcode: str) -> None:
    barcode = str(barcode).strip()
    if not barcode or not SKROUTZ_FETCH_ENABLED:
        return

    async with pending_source_fetches_lock:
        if barcode in pending_source_fetches:
            return
        pending_source_fetches.add(barcode)

    async def _run() -> None:
        try:
            source_result = await fetch_from_sources_controlled(barcode)
            if source_result:
                await persist_source_product(source_result)
        finally:
            async with pending_source_fetches_lock:
                pending_source_fetches.discard(barcode)

    asyncio.create_task(_run())


async def resolve_product(barcode: str, *, skip_source_fetch: bool = False) -> Dict:
    # Look up by primary Barcode OR by any alias — after the bulk-consolidation
    # we merge duplicate barcodes into one keeper record and move the others
    # into `barcode_aliases`. Without this OR-clause, customers who query an
    # aliased barcode would get an empty response and re-trigger source fetch.
    product = await db.products.find_one({
        "$or": [
            {"Barcode": barcode},
            {"barcode_aliases": barcode},
        ]
    })
    if product and has_textual_product_data(product):
        print(f"Using populated DB record for barcode {barcode}")
        product["_id"] = str(product["_id"])
        return product

    if skip_source_fetch:
        if product:
            product.pop("_id", None)
        return product or {"Barcode": barcode}

    if product:
        print(f"⚠️ Incomplete DB record for barcode {barcode}, fetching from sources")
        product.pop("_id", None)
    else:
        print(f"No DB record for barcode {barcode}, fetching from sources")

    if SOURCE_FETCH_MODE == "background":
        await enqueue_source_fetch(barcode)
        return product or {"Barcode": barcode, "Pending_Source_Fetch": True}

    source_result = await fetch_from_sources_controlled(barcode)
    if source_result:
        await persist_source_product(source_result)
        persisted_product = await db.products.find_one({"Barcode": barcode})
        if persisted_product:
            print(f"Using freshly persisted DB record for barcode {barcode}")
            persisted_product["_id"] = str(persisted_product["_id"])
            return persisted_product
        return source_result

    print(f"⚠️ Source fetch returned no data for barcode {barcode}")
    return product or {"Barcode": barcode}


def is_publicly_active_product(product: Dict) -> bool:
    return (str(product.get("cms_status", "")).strip() or "active") == "active"


def is_customer_ready_product(product: Dict) -> bool:
    """Stricter than `is_publicly_active_product` — used by the customer
    API to guarantee that only reviewed, complete items ever leave the
    building. A record qualifies only if:
      - cms_status is 'active'
      - catalog_quality_state is 'ready' (or absent — legacy records
        pre-quality-flag are treated as ready when they're active)
      - catalog_review_required is not True
      - textual data is present (Title / Description)
    """
    if not is_publicly_active_product(product):
        return False
    quality_state = str(product.get("catalog_quality_state") or "").strip()
    if quality_state and quality_state != "ready":
        return False
    if product.get("catalog_review_required") is True:
        return False
    if not has_textual_product_data(product):
        return False
    return True


# Server-side filter that mirrors is_customer_ready_product for the
# incremental-sync mongo query. Keeps count/paging accurate.
CUSTOMER_READY_MONGO_FILTER: Dict[str, Any] = {
    "cms_status": "active",
    "$and": [
        {"$or": [
            {"catalog_quality_state": "ready"},
            {"catalog_quality_state": {"$exists": False}},
            {"catalog_quality_state": ""},
        ]},
        {"catalog_review_required": {"$ne": True}},
    ],
}


async def _load_client_category_names(category_ids: List[str]) -> Set[str]:
    if not category_ids:
        return set()
    seed_ids = []
    for cid in category_ids:
        try:
            seed_ids.append(ObjectId(cid))
        except Exception:
            continue
    if not seed_ids:
        return set()

    collected_names: Set[str] = set()
    visited: Set[ObjectId] = set()
    frontier: List[ObjectId] = list(seed_ids)

    while frontier:
        batch = [oid for oid in frontier if oid not in visited]
        visited.update(batch)
        frontier = []
        if not batch:
            break

        docs = await db.cms_categories.find(
            {"$or": [{"_id": {"$in": batch}}, {"parent_id": {"$in": batch}}]},
            {"_id": 1, "name": 1, "parent_id": 1},
        ).to_list(length=None)

        for d in docs:
            name = str(d.get("name", "")).strip()
            if name:
                collected_names.add(name.casefold())
            child_id = d.get("_id")
            if isinstance(child_id, ObjectId) and child_id not in visited:
                frontier.append(child_id)

    return collected_names


async def apply_client_category_filter(products: List[Dict], client: Dict) -> List[Dict]:
    if not products:
        return products
    if client.get("receive_all_categories"):
        return products
    category_ids = client.get("category_ids") or []
    if not category_ids:
        return []
    allowed = await _load_client_category_names(category_ids)
    if not allowed:
        return []
    result: List[Dict] = []
    for product in products:
        names = {
            str(product.get(field, "")).strip().casefold()
            for field in ("Category_1", "Category_2", "Category_3")
            if str(product.get(field, "")).strip()
        }
        if names & allowed:
            result.append(product)
    return result

def _reject_trial_on_regular_endpoint(client: Dict) -> None:
    if client.get("is_trial"):
        raise HTTPException(status_code=403, detail="Trial accounts must use /products/trial")


async def _bump_request_count(client: Dict, *, limit: int | None = None) -> tuple[bool, int]:
    cms_client_id = client.get("cms_client_id")
    if cms_client_id is not None:
        query: Dict = {"_id": cms_client_id}
    else:
        api_client_key = client.get("api_client_key") or build_api_client_key(client)
        if not api_client_key:
            return True, 0
        query = {"api_client_key": api_client_key}
    if limit is not None:
        query["api_request_count"] = {"$lt": int(limit)}
    result = await db.cms_clients.find_one_and_update(
        query,
        {"$inc": {"api_request_count": 1}},
        return_document=ReturnDocument.AFTER,
        projection={"api_request_count": 1},
    )
    if result is None:
        return False, int(client.get("api_request_count") or 0)
    return True, int(result.get("api_request_count", 0) or 0)


# ---------- Products API — request/response models ----------

class ProductsRequest(BaseModel):
    """Query the product catalog.

    Three usage modes (combine freely):

    - **By barcode**: pass `barcode` (single string or list). Returns the
      matching products. Barcodes not in the catalog trigger a live
      source-search; permanent misses return an empty entry.
    - **Incremental sync**: pass `updated_since` (and optionally
      `updated_until`) without `barcode`. Returns *every* product whose
      `cms_updated_at` falls in the window, paginated via `limit`/`offset`.
    - **Constrained sync**: pass both `barcode` list and `updated_since`.
      Returns only the requested barcodes whose last update falls in the
      window.

    Timestamps are ISO-8601 (`2026-07-01T00:00:00Z`). `updated_since` is
    inclusive; `updated_until` is exclusive."""

    barcode: Optional[Union[str, List[str]]] = Field(
        default=None,
        description="Single barcode or a list of barcodes to fetch.",
        examples=[["5200410665362", "5201279049584"]],
    )
    updated_since: Optional[str] = Field(
        default=None,
        description="Return only products with `cms_updated_at >= updated_since` (ISO-8601).",
        examples=["2026-07-01T00:00:00Z"],
    )
    updated_until: Optional[str] = Field(
        default=None,
        description="Return only products with `cms_updated_at < updated_until` (ISO-8601).",
        examples=["2026-07-08T00:00:00Z"],
    )
    limit: Optional[int] = Field(
        default=None,
        ge=1,
        le=500,
        description="For incremental-sync mode only (no barcode list). Max 500. Defaults to 100.",
    )
    cursor: Optional[str] = Field(
        default=None,
        description=(
            "Cursor for incremental-sync mode. Pass the `next_cursor` value "
            "from the previous response to fetch the next page. Stable "
            "across concurrent inserts/deletes (unlike `offset`)."
        ),
        examples=["68a1c2b3d4e5f60789012345"],
    )
    offset: Optional[int] = Field(
        default=None,
        ge=0,
        description=(
            "[Legacy] Offset-based pagination. Prefer `cursor` for stable "
            "results — offset shifts when records are added/removed."
        ),
    )


class ProductDetail(BaseModel):
    """Normalized product record. Fields marked *internal* are only
    returned when the client's endpoint config sets
    `include_internal_fields=true`."""

    Title: List[str] = Field(default_factory=list, description="All discovered product titles (deduplicated).")
    Sml_Title: List[str] = Field(default_factory=list, description="Short / marketing titles.")
    Description: List[str] = Field(default_factory=list, description="Long-form descriptions.")
    Image_url: List[str] = Field(default_factory=list, description="Hosted image URLs (cloudon.gr CDN).")
    # `Optional[str]` (not bare `str`) so a legacy DB row where these
    # fields are stored as JSON `null` doesn't crash response validation
    # with a 500 mid-pagination. The merge layer coerces them to "" but
    # the schema stays tolerant either way.
    Weight: Optional[str] = Field(default="", description="Product weight/volume label as displayed on-site.")
    Brand: Optional[str] = Field(default="", description="Brand name.")
    Category_1: Optional[str] = Field(default="", description="Top-level category.")
    Category_2: Optional[str] = Field(default="", description="Mid-level category.")
    Category_3: Optional[str] = Field(default="", description="Leaf category.")
    last_updated_at: Optional[str] = Field(
        default="",
        description="ISO-8601 timestamp of the most recent update to this record.",
    )
    # internal / include_internal_fields fields (documented but nullable)
    Site: Optional[str] = Field(default=None, description="[internal] Primary source domain.")
    Product_Link: Optional[str] = Field(default=None, description="[internal] Origin product URL.")
    Img_src: Optional[str] = Field(default=None, description="[internal] Source image URL before hosting.")
    last_source: Optional[str] = Field(default=None, description="[internal] Last source that refreshed the record.")


class ProductsResponse(BaseModel):
    success: bool = Field(description="True when the request completed. Individual barcode misses are still `success=true` with empty entries.")
    data: List[Dict[str, ProductDetail]] = Field(
        description="List of `{barcode: ProductDetail}` objects.",
        examples=[[{"5200410665362": {
            "Title": ["Frezyderm Prodilac Immuno Shield Start"],
            "Sml_Title": [], "Description": [],
            "Image_url": ["https://image.cloudon.gr/photos/5200410665362/1.png?v=1783348391310752036"],
            "Weight": "", "Brand": "Frezyderm",
            "Category_1": "Συμπληρώματα Διατροφής", "Category_2": "", "Category_3": "",
            "last_updated_at": "2026-07-06T14:35:44.882401+00:00",
        }}]],
    )
    total: Optional[int] = Field(
        default=None,
        description="For incremental-sync mode: total records matching the window (across all pages).",
    )
    next_cursor: Optional[str] = Field(
        default=None,
        description=(
            "Cursor for the next page. Non-null only in incremental-sync "
            "mode when more results remain. Pass verbatim back as "
            "`cursor` in the next request. Null when the page is the last."
        ),
    )
    rejected_barcodes: Optional[List[str]] = Field(
        default=None,
        description="Trial-only: barcodes rejected because they are not whitelisted.",
    )


@app.post(
    "/products",
    response_model=ProductsResponse,
    tags=["Products"],
    summary="Query products by barcode and/or last-update window",
    description=(
        "Primary customer endpoint. Accepts a barcode list, an "
        "`updated_since` window, or both. See `ProductsRequest` for "
        "the three usage modes."
    ),
    responses={
        200: {
            "description": (
                "Products found or empty entries for misses.\n\n"
                "**Rate-limit response headers**:\n"
                "- `X-RateLimit-Limit` — quota window\n"
                "- `X-RateLimit-Remaining` — requests left in the window\n"
                "- `X-RateLimit-Reset` — ISO-8601 time when the window resets"
            ),
        },
        401: {"description": "Missing / invalid Basic Auth credentials."},
        403: {"description": "Client not authorized for this endpoint."},
        422: {"description": "Malformed body (bad `barcode` type, invalid ISO datetime, bad cursor)."},
        429: {"description": "Rate limit / plan quota exceeded. See `X-RateLimit-Reset` header."},
    },
)
# async def get_product_by_barcode(body: Dict, credentials: HTTPBasicCredentials = Depends(security)):
async def get_product_by_barcode(body: ProductsRequest, request: Request, client = Depends(validate_client)):
    _reject_trial_on_regular_endpoint(client)
    ensure_api_endpoint_enabled("products")
    await _bump_request_count(client)
    config = get_api_endpoint_config("products")
    return await handle_products_request(
        body.model_dump(exclude_none=True),
        request,
        client,
        endpoint_key="products",
        endpoint_path="/products",
        config=config,
        skip_source_fetch=False,
    )


@app.post(
    "/products_internal",
    response_model=ProductsResponse,
    tags=["Products"],
    summary="Products endpoint with internal metadata included",
)
async def get_product_by_barcode_internal(body: ProductsRequest, request: Request, client = Depends(validate_client)):
    _reject_trial_on_regular_endpoint(client)
    ensure_api_endpoint_enabled("products_internal")
    await _bump_request_count(client)
    config = get_api_endpoint_config("products_internal")
    return await handle_products_request(
        body.model_dump(exclude_none=True),
        request,
        client,
        endpoint_key="products_internal",
        endpoint_path="/products_internal",
        config=config,
        skip_source_fetch=False,
    )


@app.post(
    "/products/trial",
    response_model=ProductsResponse,
    tags=["Products"],
    summary="Trial endpoint (quota or whitelist based on client config)",
)
async def get_product_by_barcode_trial(body: ProductsRequest, request: Request, client = Depends(validate_client)):
    if not client.get("is_trial"):
        raise HTTPException(status_code=403, detail="/products/trial is only available for trial accounts")

    body_dict = body.model_dump(exclude_none=True)
    raw_barcodes = body_dict.get("barcode")
    if isinstance(raw_barcodes, str):
        raw_barcodes = [raw_barcodes]
    elif raw_barcodes is None:
        raw_barcodes = []
    elif not isinstance(raw_barcodes, list):
        raise HTTPException(status_code=422, detail="barcode must be string or list of strings")
    raw_barcodes = [str(bc).strip() for bc in raw_barcodes if str(bc).strip()]

    trial_mode = _normalize_trial_mode_value(client.get("trial_mode"))
    rejected_barcodes: List[str] = []
    if trial_mode == "quota":
        limit = int(client.get("trial_max_requests") or 300)
        ok, current = await _bump_request_count(client, limit=limit)
        if not ok:
            raise HTTPException(
                status_code=429,
                detail=f"Trial limit reached ({limit} requests). Contact the administrator.",
            )
        barcodes = raw_barcodes
    else:
        ok, _ = await _bump_request_count(client)
        allowed = set(client.get("trial_barcodes") or [])
        barcodes = [bc for bc in raw_barcodes if bc in allowed]
        rejected_barcodes = [bc for bc in raw_barcodes if bc not in allowed]

    products_config = get_api_endpoint_config("products") or {}
    # Preserve any date-window filter the trial client sent along with the
    # barcode list, but drop the raw `barcode` field so the trial's
    # whitelist-filtered version wins.
    inner_body = {k: v for k, v in body_dict.items() if k != "barcode"}
    inner_body["barcode"] = barcodes
    response = await handle_products_request(
        inner_body,
        request,
        client,
        endpoint_key="products",
        endpoint_path="/products/trial",
        config=products_config,
        skip_source_fetch=False,
    )
    if rejected_barcodes and isinstance(response, dict):
        response["rejected_barcodes"] = rejected_barcodes
        response["rejection_reason"] = "not_in_trial_whitelist"
    return response


@app.post(
    "/products/{endpoint_key}",
    response_model=ProductsResponse,
    tags=["Products"],
    summary="Custom endpoint variant (per-client rebrand of /products)",
)
async def get_product_by_barcode_custom(endpoint_key: str, body: ProductsRequest, request: Request, client=Depends(validate_client)):
    _reject_trial_on_regular_endpoint(client)
    ensure_api_endpoint_enabled(endpoint_key)
    await _bump_request_count(client)
    config = get_api_endpoint_config(endpoint_key)
    if not config:
        raise HTTPException(status_code=404, detail="API endpoint not found")
    endpoint_path = str(config.get("path") or f"/products/{endpoint_key}")
    return await handle_products_request(
        body.model_dump(exclude_none=True),
        request,
        client,
        endpoint_key=endpoint_key,
        endpoint_path=endpoint_path,
        config=config,
        skip_source_fetch=False,
    )


@app.get("/xml_generator/{domain}/{marketplace_xml}")
async def proxy_xml_generator_file(domain: str, marketplace_xml: str):
    configured_xml_clients = await load_xml_service_clients(db)
    allowed_domains = {
        str(client.get("domain", "")).strip()
        for client in configured_xml_clients
        if str(client.get("domain", "")).strip()
    }
    if allowed_domains and str(domain or "").strip() not in allowed_domains:
        raise HTTPException(status_code=404, detail="XML client not found")

    try:
        xml_payload = await fetch_xml_service_file(domain, marketplace_xml)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return Response(
        content=xml_payload["content"],
        media_type=xml_payload.get("content_type", "application/xml"),
    )


app.include_router(
    create_cms_missing_barcodes_router(
        db,
        fetch_from_sources_controlled=fetch_from_sources_controlled,
        persist_source_product=persist_source_product,
    )
)
app.include_router(
    create_cms_source_scanner_router(
        db,
        persist_source_product=persist_source_product,
    )
)
app.include_router(
    create_cms_product_submissions_router(
        db,
        get_current_cms_user=get_current_cms_user,
        persist_source_product=persist_source_product,
    )
)
