#!/bin/bash

# Fix Docker Issues Script
# This script fixes common Docker setup issues

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔧 Fixing Docker Issues...${NC}"
echo ""

# 1. Create cache table
echo -e "${GREEN}📊 Creating cache table...${NC}"
docker-compose exec -T app php artisan cache:table
echo ""

# 2. Create jobs table if not exists
echo -e "${GREEN}📋 Creating jobs table...${NC}"
docker-compose exec -T app php artisan queue:table
echo ""

# 3. Create failed_jobs table
echo -e "${GREEN}❌ Creating failed_jobs table...${NC}"
docker-compose exec -T app php artisan queue:failed-table
echo ""

# 4. Run all migrations
echo -e "${GREEN}🗄️  Running migrations...${NC}"
docker-compose exec -T app php artisan migrate --force
echo ""

# 5. Clear all caches
echo -e "${GREEN}🧹 Clearing caches...${NC}"
docker-compose exec -T app php artisan cache:clear
docker-compose exec -T app php artisan config:clear
docker-compose exec -T app php artisan route:clear
docker-compose exec -T app php artisan view:clear
echo ""

# 6. Restart queue and reverb services
echo -e "${GREEN}🔄 Restarting services...${NC}"
docker-compose restart queue reverb scheduler
echo ""

# 7. Wait a moment for services to stabilize
echo -e "${YELLOW}⏳ Waiting for services to stabilize...${NC}"
sleep 5
echo ""

# 8. Check service status
echo -e "${GREEN}✅ Checking service status...${NC}"
docker-compose ps
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Issues fixed successfully!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your services should now be running correctly."
echo ""
echo "To verify, run:"
echo -e "  ${YELLOW}docker-compose logs -f queue${NC}"
echo -e "  ${YELLOW}docker-compose logs -f reverb${NC}"
echo ""