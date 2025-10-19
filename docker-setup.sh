#!/bin/bash

# Docker Setup Script for Laravel Crypto Exchange
# This script sets up the Docker environment for the application

set -e

echo "🚀 Starting Docker setup for Crypto Exchange..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Create docker directories if they don't exist
echo "📁 Creating Docker configuration directories..."
mkdir -p docker/nginx docker/php docker/mysql docker/nginx/ssl
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker..."
    cp .env.docker .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update your .env file with appropriate values${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi
echo ""

# Generate application key if not set
if grep -q "APP_KEY=$" .env || grep -q "APP_KEY=base64:/w/YquCKfg0ACun/wjTCtNnm9n7rCzCHET6OKiQUffc=" .env; then
    echo "🔑 Generating application key..."
    docker-compose run --rm app php artisan key:generate
    echo -e "${GREEN}✅ Application key generated${NC}"
else
    echo -e "${GREEN}✅ Application key already set${NC}"
fi
echo ""

# Build and start containers
echo "🏗️  Building Docker containers..."
docker-compose build
echo -e "${GREEN}✅ Containers built successfully${NC}"
echo ""

echo "🚀 Starting Docker containers..."
docker-compose up -d
echo -e "${GREEN}✅ Containers started successfully${NC}"
echo ""

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Check MySQL connection
until docker-compose exec -T mysql mysqladmin ping -h localhost --silent; do
    echo "⏳ Waiting for MySQL..."
    sleep 2
done
echo -e "${GREEN}✅ MySQL is ready${NC}"
echo ""

# Install Composer dependencies
echo "📦 Installing Composer dependencies..."
docker-compose exec -T app composer install --no-interaction
echo -e "${GREEN}✅ Composer dependencies installed${NC}"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec -T app php artisan migrate --force
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Create storage link
echo "🔗 Creating storage link..."
docker-compose exec -T app php artisan storage:link
echo -e "${GREEN}✅ Storage link created${NC}"
echo ""

# Install NPM dependencies and build assets
echo "📦 Installing NPM dependencies..."
docker-compose exec -T node npm install
echo -e "${GREEN}✅ NPM dependencies installed${NC}"
echo ""

# Set permissions
echo "🔒 Setting permissions..."
docker-compose exec -T app chown -R appuser:www-data /var/www/html/storage /var/www/html/bootstrap/cache
docker-compose exec -T app chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
echo -e "${GREEN}✅ Permissions set${NC}"
echo ""

# Display information
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your application is now running at:"
echo -e "  ${GREEN}🌐 Application:${NC} http://localhost"
echo -e "  ${GREEN}📊 PHPMyAdmin:${NC} http://localhost:8081"
echo -e "  ${GREEN}📧 Mailhog:${NC} http://localhost:8025"
echo -e "  ${GREEN}⚡ Vite Dev Server:${NC} http://localhost:5173"
echo -e "  ${GREEN}🔌 WebSocket (Reverb):${NC} http://localhost:8080"
echo ""
echo "Useful commands:"
echo "  ${YELLOW}docker-compose up -d${NC}          - Start all containers"
echo "  ${YELLOW}docker-compose down${NC}           - Stop all containers"
echo "  ${YELLOW}docker-compose logs -f${NC}        - View logs"
echo "  ${YELLOW}docker-compose exec app bash${NC}  - Access app container shell"
echo "  ${YELLOW}./docker-run.sh artisan migrate${NC} - Run migrations"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo "  1. Update your .env file with production values"
echo "  2. Configure your OAuth credentials (Google)"
echo "  3. Set up your mail service (Resend)"
echo "  4. Configure AI chatbot API keys"
echo ""