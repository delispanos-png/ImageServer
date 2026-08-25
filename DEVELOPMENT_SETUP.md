# CloudOn Platform - Development Setup Guide

## Prerequisites

### Required Software
- **Python**: 3.10 or higher
  ```bash
  python3 --version  # Should be 3.10+
  ```

- **Node.js**: 20.x LTS or higher
  ```bash
  node --version  # Should be v20.x or v22.x
  npm --version   # Should be 10.x+
  ```

- **Docker**: 20.x or higher
  ```bash
  docker --version  # Should be 20.x+
  docker compose version
  ```

- **Git**: Latest version
  ```bash
  git --version
  ```

### Recommended Tools
- **VS Code** with extensions:
  - Python
  - ESLint
  - Prettier
  - Docker
  - GitLens

- **MongoDB Compass** for database management
- **Postman** or **Insomnia** for API testing

---

## Initial Setup

### 1. Clone Repository
```bash
cd /home/imageuser
# If not already cloned
git clone <repository-url> imageDataAPI
cd imageDataAPI
```

### 2. Environment Configuration

#### Backend Environment
```bash
cd /home/imageuser/imageDataAPI

# Copy example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env  # or vim .env
```

Required environment variables:
```env
MONGO_USER=your_username
MONGO_PASSWORD=your_secure_password
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DB=imageDB

USERNAME=api_username
PASSWORD=api_password

IMAGE_PUBLIC_BASE_URL=https://image.cloudon.gr/photos
IMAGES_PATH=/path/to/images

CMS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Python Environment Setup

#### Install Python Dependencies
```bash
cd /home/imageuser/imageDataAPI/app

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install pytest pytest-asyncio pytest-cov black flake8 mypy
```

#### Create requirements.txt (if missing)
```bash
cat > requirements.txt << 'EOF'
fastapi==0.109.0
uvicorn[standard]==0.27.0
pymongo==4.6.1
motor==3.3.2
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
httpx==0.26.0
pandas==2.1.4
openpyxl==3.1.2
requests==2.31.0
bcrypt==4.1.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
EOF
```

### 4. Frontend Environment Setup

#### Install Node.js (if not installed or outdated)
```bash
# Remove old Node.js
sudo apt-get remove nodejs npm

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### Install Frontend Dependencies
```bash
cd /home/imageuser/Template\ /Azea-Typescript

# Install dependencies
npm install

# Or if you prefer clean install
npm ci
```

### 5. Database Setup

#### Start MongoDB
```bash
cd /home/imageuser/imageDataAPI

# Start MongoDB container
docker compose up -d mongodb

# Verify MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker logs mongodb
```

#### Initialize Database (Optional)
```bash
# Connect to MongoDB shell
docker exec -it mongodb mongosh -u $MONGO_USER -p $MONGO_PASSWORD

# Inside MongoDB shell
use imageDB

# Create collections with validation (optional)
db.createCollection("products")
db.createCollection("cms_users")
db.createCollection("cms_clients")
db.createCollection("cms_categories")
```

### 6. XML Generator Setup

```bash
cd /home/imageuser/CloudonXMLGeneratorNew

# Install Python dependencies
pip install -r requirements.txt

# Start XML generator service
docker compose up -d xml_generator

# Check logs
docker logs xml_generator
```

---

## Running the Application

### Development Mode

#### 1. Start Backend (FastAPI)
```bash
cd /home/imageuser/imageDataAPI

# Start all services
docker compose up -d

# Or start only backend for development
cd app
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 4030
```

Backend will be available at:
- API: http://localhost:4030
- Docs: http://localhost:4030/docs
- ReDoc: http://localhost:4030/redoc

#### 2. Start Frontend (Admin CMS)
```bash
cd /home/imageuser/Template\ /Azea-Typescript

# Development server with hot reload
npm run dev

# Build for production
npm run build
```

Frontend dev server will be available at:
- http://localhost:5173

#### 3. Start Frontend (Customer Portal)
```bash
cd /home/imageuser/Template\ /Azea-Typescript

# Development server for portal
npm run dev:portal

# Build for production
npm run build:portal
```

---

## Building for Production

### Backend Build
```bash
cd /home/imageuser/imageDataAPI

# Build and start all containers
docker compose build
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f fastapi
```

### Frontend Build (Admin)
```bash
cd /home/imageuser/imageDataAPI

# Run build script
./build_admin_cms.sh

# Output will be in /home/imageuser/cms-admin-dist
```

### Frontend Build (Portal)
```bash
cd /home/imageuser/imageDataAPI

# Run build script
./build_customer_portal.sh

# Output will be in /home/imageuser/cms-portal-dist
```

---

## Testing

### Backend Tests
```bash
cd /home/imageuser/imageDataAPI/app
source venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_catalog.py

# Run with verbose output
pytest -v
```

### Frontend Tests
```bash
cd /home/imageuser/Template\ /Azea-Typescript

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

---

## Database Management

### Backup Database
```bash
# Create backup
docker exec mongodb mongodump \
  --username=$MONGO_USER \
  --password=$MONGO_PASSWORD \
  --authenticationDatabase=admin \
  --out=/backup/$(date +%Y%m%d_%H%M%S)

# Copy backup from container
docker cp mongodb:/backup ./backups/
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backups/20260429_120000 mongodb:/restore/

# Restore
docker exec mongodb mongorestore \
  --username=$MONGO_USER \
  --password=$MONGO_PASSWORD \
  --authenticationDatabase=admin \
  /restore/20260429_120000
```

### View Database
```bash
# Using MongoDB Compass
# Connection string: mongodb://username:password@localhost:27017

# Using mongosh
docker exec -it mongodb mongosh -u $MONGO_USER -p $MONGO_PASSWORD

# Inside mongosh
use imageDB
db.products.find().limit(10)
db.cms_users.countDocuments()
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker logs mongodb

# Restart MongoDB
docker compose restart mongodb

# Verify environment variables
cat .env | grep MONGO
```

### Issue: Port Already in Use
```bash
# Find process using port 4030
lsof -i :4030

# Kill process
kill -9 <PID>

# Or use different port
uvicorn main:app --port 4031
```

### Issue: Frontend Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest
```

### Issue: Permission Denied (Docker)
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
# Or
newgrp docker
```

### Issue: Image Upload Fails
```bash
# Check images directory permissions
ls -la /home/imageuser/CloudonXMLGenerator/Photos/CloudOn

# Fix permissions
sudo chown -R imageuser:imageuser /home/imageuser/CloudonXMLGenerator/Photos/CloudOn
chmod -R 755 /home/imageuser/CloudonXMLGenerator/Photos/CloudOn
```

---

## Development Workflow

### 1. Before Starting Work
```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd app && pip install -r requirements.txt
cd ../frontend && npm install

# Start services
docker compose up -d
```

### 2. During Development
```bash
# Make changes to code
# Backend: Edit files in app/
# Frontend: Edit files in src/

# Backend auto-reloads with uvicorn --reload
# Frontend auto-reloads with vite dev server
```

### 3. Before Committing
```bash
# Format Python code
black app/

# Lint Python code
flake8 app/

# Type check Python code
mypy app/

# Format TypeScript code
cd frontend
npm run format

# Lint TypeScript code
npm run lint

# Run tests
pytest
npm test

# Commit changes
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
```

---

## Useful Commands

### Docker
```bash
# View all containers
docker compose ps

# View logs
docker compose logs -f [service_name]

# Restart service
docker compose restart [service_name]

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild service
docker compose build [service_name]
docker compose up -d [service_name]
```

### Database
```bash
# Export collection
docker exec mongodb mongoexport \
  --username=$MONGO_USER \
  --password=$MONGO_PASSWORD \
  --db=imageDB \
  --collection=products \
  --out=/tmp/products.json

# Import collection
docker exec mongodb mongoimport \
  --username=$MONGO_USER \
  --password=$MONGO_PASSWORD \
  --db=imageDB \
  --collection=products \
  --file=/tmp/products.json
```

### Monitoring
```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df

# Clean up unused images/containers
docker system prune -a
```

---

## Next Steps

1. Read [PROJECT_TECHNICAL_HANDBOOK.md](PROJECT_TECHNICAL_HANDBOOK.md)
2. Review [ADMIN_CMS_MANUAL.md](ADMIN_CMS_MANUAL.md)
3. Check [API documentation](http://localhost:4030/docs)
4. Set up your IDE with recommended extensions
5. Run the test suite to ensure everything works
6. Start contributing!

---

## Getting Help

- **Documentation**: Check PROJECT_TECHNICAL_HANDBOOK.md
- **API Docs**: http://localhost:4030/docs
- **Logs**: `docker compose logs -f`
- **Database**: Use MongoDB Compass

---

**Last Updated**: 29 April 2026
