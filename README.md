# ImageServer / CloudOn ContentSync Platform

CloudOn is a catalog management platform for pharmacy products with:

- Admin CMS
- Customer Portal
- Customer-facing API endpoints
- Source refresh and hosted-image workflows
- XML feed generation support

## Project layout

- Backend application: [`app/`](app/)
- Frontend source: [`frontend/`](frontend/)
- Technical handbook: [`PROJECT_TECHNICAL_HANDBOOK.md`](PROJECT_TECHNICAL_HANDBOOK.md)
- Admin manual: [`ADMIN_CMS_MANUAL.md`](ADMIN_CMS_MANUAL.md)
- Customer portal manual: [`CUSTOMER_PORTAL_MANUAL.md`](CUSTOMER_PORTAL_MANUAL.md)
- Database docs: [`database/`](database/)

## Runtime surfaces

- Admin CMS: `https://image.cloudon.gr/admin/`
- Customer Portal: `https://image.cloudon.gr/`
- Public API: `https://image.cloudon.gr/api/products`
- Internal API: `https://image.cloudon.gr/api/products_internal`

## Docker stack

Run from the project root:

```bash
docker-compose up -d --build
```

Main services:

- `mongodb`
- `fastapi`
- `xml_generator`
- `kpdhellas_bridge`

## Environment configuration

Runtime values are read from `.env`.

Important variables include:

- `MONGO_HOST`
- `MONGO_PORT`
- `MONGO_USER`
- `MONGO_PASSWORD`
- `MONGO_DB`
- `IMAGES_PATH`
- `CATEGORY_LOOKUP_XLSX_HOST_PATH`

Do not hardcode credentials into scripts or documentation.

## Database initialization

If you need to import the initial product dataset, use the values from `.env` and your actual Mongo container name.

Example flow:

```bash
docker cp Cleaned_Products.json mongodb:/tmp/Cleaned_Products.json

docker exec -it mongodb mongoimport \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --authenticationDatabase admin \
  --db "$MONGO_DB" \
  --collection products \
  --file /tmp/Cleaned_Products.json \
  --jsonArray
```

## Mongo shell

Example login flow:

```bash
docker exec -it mongodb mongosh \
  --username "$MONGO_USER" \
  --password "$MONGO_PASSWORD" \
  --authenticationDatabase admin
```

Then:

```javascript
show dbs
use imageDB
show collections
db.products.findOne()
```

Replace `imageDB` with your configured database name when needed.

## Database export

Example export:

```bash
docker exec mongodb mongoexport \
  --username="$MONGO_USER" \
  --password="$MONGO_PASSWORD" \
  --authenticationDatabase=admin \
  --db="$MONGO_DB" \
  --collection=products \
  --out=/data/export.json
```

## Frontend build and deploy

The repo now uses the tracked frontend source inside [`frontend/`](frontend/).

Admin build:

```bash
/home/imageuser/imageDataAPI/build_admin_cms.sh
```

Customer portal build:

```bash
/home/imageuser/imageDataAPI/build_customer_portal.sh
```

Deploy targets:

- Admin dist: `/home/imageuser/cms-admin-dist`
- Portal dist: `/home/imageuser/cms-portal-dist`

## Source control note

The source-of-truth frontend files are inside this repository:

- [`frontend/src`](frontend/src)

Do not treat the old external template workspace as the active source anymore.

## API endpoint model

Built-in endpoints:

- `/products`
- `/products_internal`

Additional runtime endpoints can be configured from Admin CMS settings and are served as:

- `/products/<api_key>`

## Documentation rule

Any change that affects:

- runtime behavior
- UI
- workflows
- source handling
- API output
- customer/admin operations

must update:

- the technical handbook
- the relevant user manual(s)
- this `README` when setup or repository structure changes
