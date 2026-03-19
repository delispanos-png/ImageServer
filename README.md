# Build docker inside root project folder
docker-compose up -d --build
# Steps to initialize database

1. docker cp Cleaned_Products.json mongodb:/tmp/Cleaned_Products.json

2. docker exec -it mongodb mongoimport \
  --username root \
  --password de3Rfsz#l \
  --authenticationDatabase admin \
  --db imageDB \
  --collection products \
  --file /tmp/Cleaned_Products.json \
  --jsonArray


# Login to database

docker exec -it mongodb mongo -u root -p de3Rfsz#l --authenticationDatabase admin
show dbs
show collections
use imageDB -> connect to db
db.products.findOne()

# Export database

docker exec mongodb \
  mongoexport \
    --username=root \
    --password=de3Rfsz#l \
    --authenticationDatabase=admin \
    --db=imageDB \
    --collection=products \
    --out=/data/export.json# ImageServer


# CMS documentation

- Architecture principles: `CMS_Architecture_Principles.md`
- Database design: `database/CMS_Database_Design.md`
- PostgreSQL schema: `database/cms_schema_postgres.sql`
