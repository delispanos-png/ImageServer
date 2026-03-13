from fastapi import Depends, FastAPI, HTTPException, status
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
from cms_auth import create_cms_auth_router
from cms_catalog import create_cms_catalog_router
from cms_dashboard import create_cms_dashboard_router
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
app.include_router(create_cms_catalog_router(db))
app.include_router(create_cms_dashboard_router(db))

security = HTTPBasic()  
# folder_path = Path("C:/Users/DevPc/Desktop/dummyPhotos")
# files = [file.name for file in folder_path.iterdir() if file.is_file()]
# for file in files:
#     print("Files in folder:", file[:-4])


clients = [
    {
        "domain":"hellas-pharmacy",
        "username":"hellaspharmacy",
        "password":"Y9l0sz8p3CmNO5zkO144fOo1n7KhJrnE"
    },
    {
        "domain":"farmakeio-express",
        "username":"CloudOn",
        "password":"imageDB_password"
    },
]


@app.on_event("startup")
async def bootstrap_cms_auth() -> None:
    await cms_auth_router.bootstrap_admin_user()  # type: ignore[attr-defined]

async def validate_client(credentials: HTTPBasicCredentials = Depends(security)):
    for client in clients:
        if (
            credentials.username == client["username"]
            and credentials.password == client["password"]
        ):
            return client
    raise HTTPException(status_code=401, detail="Invalid credentials")


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
def resolve_response_image_urls(product: Dict, image_urls_by_barcode: Dict[str, List[str]]) -> List[str]:
    barcode = str(product.get("Barcode", "")).strip()
    if barcode:
        hosted_urls = image_urls_by_barcode.get(barcode, [])
        if hosted_urls:
            return hosted_urls

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


def merge_products(raw_results: List[Dict], image_urls_by_barcode: Dict[str, List[str]], include_internal_fields: bool = False) -> List[Dict]:
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

        for image_url in resolve_response_image_urls(product, image_urls_by_barcode):
            if image_url and image_url not in merged[barcode]["Image_url"]:
                merged[barcode]["Image_url"].append(image_url)
                print(f"Added image URL: {image_url}")

    return [{barcode: details} for barcode, details in merged.items()]


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

        for key, value in product.items():
            if key == "_id":
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
        merged_product["last_source"] = product.get("Site", "") or product.get("last_source", "")
        merged_product["last_updated_at"] = datetime.now(timezone.utc).isoformat()

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

@app.post("/products")
# async def get_product_by_barcode(body: Dict, credentials: HTTPBasicCredentials = Depends(security)):
async def get_product_by_barcode(body: Dict, client = Depends(validate_client)):
    print('*'*100)
    print(f"Request Body: {body}")
    print(client['domain'])
    
    try:
        # if credentials.username != USERNAME or credentials.password != PASSWORD:
        #  raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
        barcodes = body.get('barcode')
        if isinstance(barcodes, str):
            barcodes = [barcodes]  # wrap single string into list
        elif not isinstance(barcodes, list):
            raise HTTPException(status_code=422, detail="barcode must be string or list of strings")
        raw_results = await asyncio.gather(*(resolve_product(str(barcode)) for barcode in barcodes))
        if not raw_results:
            print('*'*100)
            print("Response Data: No Data")
            print('*'*100)
            return {"success": True, "data": {"Title":[], "Description":[], "Sml_Title":[],"Image_url":[]}}
            # raise HTTPException(status_code=404, detail="Product not found")
        TARGET_WORDS =  ["ofarmakopoiosmou","vita4you","pharm16","tofarmakeiomou","boxpharmacy", "box pharmacy"]
        image_urls_by_barcode = await list_image_urls_by_barcode()
        transformed_result = merge_products(raw_results, image_urls_by_barcode, include_internal_fields=False)
        merged = {barcode: details for item in transformed_result for barcode, details in item.items()}
        
        for word in TARGET_WORDS:
            
            word_lower = word.lower()
            for barcode, details in merged.items():
                for field in ["Title", "Sml_Title", "Description"]:
                    for text in details[field]:
                        if word_lower in text.lower():
                            print(f"Word '{word}' found in barcode '{barcode}', field '{field}', text: {text}")
                            # Return empty data immediately if found
                            return {"success": True, "data": []}

        print('*'*100)
        print(f"Response Data: {transformed_result}")
        print('*'*100)
        return {"success": True, "data": transformed_result}
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        traceback.print_exc()
        return {"success": False, "error": str(e)}


@app.post("/products_internal")
async def get_product_by_barcode_internal(body: Dict, client = Depends(validate_client)):
    print('*'*100)
    print(f"Internal Request Body: {body}")
    print(client['domain'])

    try:
        barcodes = body.get('barcode')
        if isinstance(barcodes, str):
            barcodes = [barcodes]
        elif not isinstance(barcodes, list):
            raise HTTPException(status_code=422, detail="barcode must be string or list of strings")

        raw_results = await asyncio.gather(*(resolve_product(str(barcode)) for barcode in barcodes))
        if not raw_results:
            return {"success": True, "data": []}

        image_urls_by_barcode = await list_image_urls_by_barcode()
        transformed_result = merge_products(raw_results, image_urls_by_barcode, include_internal_fields=True)
        print('*'*100)
        print(f"Internal Response Data: {transformed_result}")
        print('*'*100)
        return {"success": True, "data": transformed_result}
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        traceback.print_exc()
        return {"success": False, "error": str(e)}


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
        transformed_result = merge_products(raw_results, image_urls_by_barcode, include_internal_fields=False)

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
