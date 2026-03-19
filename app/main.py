from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pymongo import AsyncMongoClient
from pathlib import Path
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from typing import Dict, List, Set
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
from cms_audit import create_cms_audit_router
from cms_catalog import create_cms_catalog_router, sync_cms_taxonomy_from_products
from cms_client_services import load_xml_service_clients, sync_legacy_xml_clients_to_cms
from cms_clients import create_cms_clients_router
from cms_dashboard import create_cms_dashboard_router
from cms_customer_remarks import create_cms_customer_remarks_router
from cms_header import create_cms_header_router
from cms_notifications import create_cms_notifications_router
from cms_server import create_cms_server_router
from cms_settings import create_cms_settings_router
from cms_sources import create_cms_sources_router
from cms_users import create_cms_users_router
from catalog_quality import build_catalog_quality_updates
from portal_auth import create_portal_auth_router
from portal import create_portal_router
from api_clients import (
    LEGACY_API_CLIENTS,
    build_api_client_key,
    sync_legacy_api_clients_to_cms,
    track_api_client_usage,
    verify_api_client_password,
)
from runtime_settings import get_api_endpoints, get_api_settings, is_api_endpoint_enabled
from xml_service import fetch_xml_file as fetch_xml_service_file
import asyncio 
import traceback
import random
app = FastAPI()
load_dotenv()

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
app.include_router(create_cms_catalog_router(db))
app.include_router(create_cms_clients_router(db))
app.include_router(create_cms_dashboard_router(db))
app.include_router(create_cms_customer_remarks_router(db))
app.include_router(create_cms_header_router(db))
app.include_router(create_cms_server_router(db))
app.include_router(create_cms_audit_router(db))
app.include_router(create_cms_notifications_router(db))
app.include_router(create_cms_settings_router(db))
app.include_router(create_cms_sources_router(db))
app.include_router(create_cms_users_router(db))

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

async def validate_client(credentials: HTTPBasicCredentials = Depends(security)):
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
        },
    )
    if cms_client:
        if not bool(cms_client.get("is_active", True)):
            raise HTTPException(status_code=403, detail="API client disabled")
        if not verify_api_client_password(credentials.password, str(cms_client.get("api_password_hash", "")).strip()):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {
            "domain": str(cms_client.get("api_domain", "")).strip() or str(cms_client.get("name", "")).strip(),
            "username": str(cms_client.get("api_username", "")).strip(),
            "api_client_key": str(cms_client.get("api_client_key", "")).strip(),
            "company": str(cms_client.get("company", "")).strip(),
        }

    for client in clients:
        if (
            credentials.username == client["username"]
            and credentials.password == client["password"]
        ):
            api_client_key = build_api_client_key(client)
            cms_client = await db.cms_clients.find_one(
                {"api_client_key": api_client_key},
                {"is_active": 1},
            )
            if cms_client and not bool(cms_client.get("is_active", True)):
                raise HTTPException(status_code=403, detail="API client disabled")
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
    }
    if include_internal_fields:
        merged_product.update(
            {
                "Site": "",
                "Categ": "",
                "Product_Link": "",
                "Img_src": "",
                "last_source": "",
                "last_updated_at": "",
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

        merged[barcode]["Weight"] = product.get("Weight", "")
        merged[barcode]["Brand"] = product.get("Brand", "")
        merged[barcode]["Category_1"] = product.get("Category_1", "")
        merged[barcode]["Category_2"] = product.get("Category_2", "")
        merged[barcode]["Category_3"] = product.get("Category_3", "")

        if include_internal_fields:
            merged[barcode]["Site"] = product.get("Site", "")
            merged[barcode]["Categ"] = product.get("Categ", "")
            merged[barcode]["Product_Link"] = product.get("Product_Link", "")
            merged[barcode]["Img_src"] = product.get("Img_src", "")
            merged[barcode]["last_source"] = product.get("last_source", "")
            merged[barcode]["last_updated_at"] = product.get("last_updated_at", "")

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


async def handle_products_request(
    body: Dict,
    request: Request,
    client: Dict,
    endpoint_key: str,
    endpoint_path: str,
    config: Dict,
) -> Dict:
    print("*" * 100)
    print(f"Request Body: {body}")
    print(client.get("domain"))
    try:
        barcodes = body.get("barcode")
        if isinstance(barcodes, str):
            barcodes = [barcodes]
        elif not isinstance(barcodes, list):
            raise HTTPException(status_code=422, detail="barcode must be string or list of strings")
        try:
            await track_api_client_usage(
                db,
                client=client,
                request=request,
                endpoint=endpoint_path,
                barcode_count=len(barcodes),
            )
        except Exception as tracking_exc:
            print(f"⚠️ Failed to track API client usage for {endpoint_path}: {tracking_exc}")

        raw_results = await asyncio.gather(*(resolve_product(str(barcode)) for barcode in barcodes))
        public_only = bool(config.get("public_only", True))
        if public_only:
            raw_results = [product for product in raw_results if is_publicly_active_product(product)]
        if not raw_results:
            print("*" * 100)
            print("Response Data: No Data")
            print("*" * 100)
            return {"success": True, "data": []}

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
            TARGET_WORDS = ["ofarmakopoiosmou", "vita4you", "pharm16", "tofarmakeiomou", "boxpharmacy", "box pharmacy"]
            merged = {barcode: details for item in transformed_result for barcode, details in item.items()}
            for word in TARGET_WORDS:
                word_lower = word.lower()
                for barcode, details in merged.items():
                    for field in ["Title", "Sml_Title", "Description"]:
                        for text in details.get(field, []):
                            if word_lower in text.lower():
                                print(
                                    f"Word '{word}' found in barcode '{barcode}', field '{field}', text: {text}"
                                )
                                return {"success": True, "data": []}

        filtered_result = filter_api_fields(
            transformed_result,
            config.get("fields", []),
        )
        print("*" * 100)
        print(f"Response Data: {filtered_result}")
        print("*" * 100)
        return {"success": True, "data": filtered_result}
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        traceback.print_exc()
        return {"success": False, "error": str(e)}


async def persist_source_product(product: Dict) -> None:
    barcode = str(product.get("Barcode", "")).strip()
    if not barcode:
        return

    try:
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


async def resolve_product(barcode: str) -> Dict:
    product = await db.products.find_one({"Barcode": barcode})
    if product and has_textual_product_data(product):
        print(f"Using populated DB record for barcode {barcode}")
        product["_id"] = str(product["_id"])
        return product

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

@app.post("/products")
# async def get_product_by_barcode(body: Dict, credentials: HTTPBasicCredentials = Depends(security)):
async def get_product_by_barcode(body: Dict, request: Request, client = Depends(validate_client)):
    ensure_api_endpoint_enabled("products")
    config = get_api_endpoint_config("products")
    return await handle_products_request(
        body,
        request,
        client,
        endpoint_key="products",
        endpoint_path="/products",
        config=config,
    )


@app.post("/products_internal")
async def get_product_by_barcode_internal(body: Dict, request: Request, client = Depends(validate_client)):
    ensure_api_endpoint_enabled("products_internal")
    config = get_api_endpoint_config("products_internal")
    return await handle_products_request(
        body,
        request,
        client,
        endpoint_key="products_internal",
        endpoint_path="/products_internal",
        config=config,
    )


@app.post("/products/{endpoint_key}")
async def get_product_by_barcode_custom(endpoint_key: str, body: Dict, request: Request, client=Depends(validate_client)):
    ensure_api_endpoint_enabled(endpoint_key)
    config = get_api_endpoint_config(endpoint_key)
    if not config:
        raise HTTPException(status_code=404, detail="API endpoint not found")
    endpoint_path = str(config.get("path") or f"/products/{endpoint_key}")
    return await handle_products_request(
        body,
        request,
        client,
        endpoint_key=endpoint_key,
        endpoint_path=endpoint_path,
        config=config,
    )


@app.get("/get_sample")
async def get_samples():
    try:
        raw_results = []
        image_urls_by_barcode = await list_image_urls_by_barcode()
        image_barcodes = list(image_urls_by_barcode.keys())

        if not image_barcodes:
            return {"success": True, "data": []}

        # Get all matching products
        cursor = db.products.find({"Barcode": {"$in": image_barcodes}})
        products = await cursor.to_list(length=None)  # fetch all matching

        # Shuffle and take 300
        random.shuffle(products)
        products = products[:300]

        for product in products:
            product["_id"] = str(product["_id"])
            raw_results.append(product)

        if not raw_results:
            return {"success": True, "data": []}

        # Merge and transform like before
        TARGET_WORDS = ["ofarmakopoiosmou","vita4you","pharm16","tofarmakeiomou","boxpharmacy", "box pharmacy"]
        transformed_result = merge_products(
            raw_results,
            image_urls_by_barcode,
            include_internal_fields=False,
            allow_external_image_urls=False,
        )

        # Filter TARGET_WORDS
        # for word in TARGET_WORDS:
        #     word_lower = word.lower()
        #     for barcode, details in merged.items():
        #         for field in ["Title", "Sml_Title", "Description"]:
        #             for text in details[field]:
        #                 if word_lower in text.lower():
        #                     return {"success": True, "data": []}

        return {"success": True, "data": transformed_result}

    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"success": False, "error": str(e)}

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
