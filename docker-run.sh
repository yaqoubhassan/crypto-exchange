#!/bin/bash

# Docker Run Helper Script
# Provides shortcuts for common Docker commands

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: ./docker-run.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  ${GREEN}artisan [args]${NC}       - Run artisan commands"
    echo "  ${GREEN}composer [args]${NC}      - Run composer commands"
    echo "  ${GREEN}npm [args]${NC}           - Run npm commands"
    echo "  ${GREEN}test${NC}                 - Run PHPUnit tests"
    echo "  ${GREEN}bash${NC}                 - Access app container shell"
    echo "  ${GREEN}mysql${NC}                - Access MySQL shell"
    echo "  ${GREEN}redis${NC}                - Access Redis CLI"
    echo "  ${GREEN}logs [service]${NC}       - View container logs"
    echo "  ${GREEN}fresh${NC}                - Fresh database with seeders"
    echo "  ${GREEN}optimize${NC}             - Optimize Laravel application"
    echo ""
    exit 0
fi

COMMAND=$1
shift

case $COMMAND in
    artisan)
        echo -e "${GREEN}Running artisan command...${NC}"
        docker-compose exec app php artisan "$@"
        ;;
    
    composer)
        echo -e "${GREEN}Running composer command...${NC}"
        docker-compose exec app composer "$@"
        ;;
    
    npm)
        echo -e "${GREEN}Running npm command...${NC}"
        docker-compose exec node npm "$@"
        ;;
    
    test)
        echo -e "${GREEN}Running tests...${NC}"
        docker-compose exec app php artisan test "$@"
        ;;
    
    bash)
        echo -e "${GREEN}Accessing app container shell...${NC}"
        docker-compose exec app bash
        ;;
    
    mysql)
        echo -e "${GREEN}Accessing MySQL shell...${NC}"
        docker-compose exec mysql mysql -u${DB_USERNAME:-crypto_user} -p${DB_PASSWORD:-crypto_password} ${DB_DATABASE:-crypto_exchange}
        ;;
    
    redis)
        echo -e "${GREEN}Accessing Redis CLI...${NC}"
        docker-compose exec redis redis-cli
        ;;
    
    logs)
        if [ -z "$1" ]; then
            echo -e "${GREEN}Showing all logs...${NC}"
            docker-compose logs -f
        else
            echo -e "${GREEN}Showing logs for $1...${NC}"
            docker-compose logs -f "$1"
        fi
        ;;
    
    fresh)
        echo -e "${YELLOW}⚠️  This will reset your database!${NC}"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${GREEN}Refreshing database...${NC}"
            docker-compose exec app php artisan migrate:fresh --seed
            echo -e "${GREEN}✅ Database refreshed successfully${NC}"
        else
            echo "Cancelled."
        fi
        ;;
    
    optimize)
        echo -e "${GREEN}Optimizing Laravel application...${NC}"
        docker-compose exec app php artisan optimize
        docker-compose exec app php artisan config:cache
        docker-compose exec app php artisan route:cache
        docker-compose exec app php artisan view:cache
        echo -e "${GREEN}✅ Application optimized${NC}"
        ;;
    
    *)
        echo "Unknown command: $COMMAND"
        echo "Run './docker-run.sh' without arguments to see available commands"
        exit 1
        ;;
esac