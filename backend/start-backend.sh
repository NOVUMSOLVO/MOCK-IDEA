#!/bin/bash

echo "🖥️  Starting MOCK IDEA Backend with Dynamic Port Detection"
echo "========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to find next available port
find_available_port() {
    local start_port=$1
    local port=$start_port

    while ! check_port $port; do
        port=$((port + 1))
        if [ $port -gt $((start_port + 100)) ]; then
            echo -e "${RED}❌ Could not find available port after checking 100 ports from $start_port${NC}"
            exit 1
        fi
    done

    echo $port
}

# Check if PostgreSQL container is running
if ! docker ps | grep -q "mock-idea-postgres"; then
    echo -e "${YELLOW}⚠️  PostgreSQL container not running. Starting it...${NC}"

    # Remove existing container if it exists
    docker rm -f mock-idea-postgres 2>/dev/null || true

    # Find available port for PostgreSQL (starting from 5433)
    DB_PORT=$(find_available_port 5433)
    echo -e "${BLUE}📊 Starting PostgreSQL on port $DB_PORT${NC}"

    docker run --name mock-idea-postgres \
        -e POSTGRES_PASSWORD=password \
        -e POSTGRES_DB=mock_idea \
        -p $DB_PORT:5432 \
        -d postgres:15

    # Update .env file with the new database port
    sed -i.bak "s|postgresql://postgres:password@localhost:[0-9]*/mock_idea|postgresql://postgres:password@localhost:$DB_PORT/mock_idea|g" .env

    echo -e "${GREEN}✅ PostgreSQL started on port $DB_PORT${NC}"

    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
else
    echo -e "${GREEN}✅ PostgreSQL container is already running${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    export PATH="/usr/local/bin:$PATH"
    npm install
fi

# Setup database
echo -e "${BLUE}🔧 Setting up database...${NC}"
export PATH="/usr/local/bin:$PATH"
npx prisma generate
npx prisma db push

# Seed database
echo -e "${YELLOW}🌱 Seeding database...${NC}"
npx tsx prisma/seed.ts || echo -e "${YELLOW}⚠️  Database seeding skipped (may already be seeded)${NC}"

echo -e "${GREEN}✅ Backend setup complete${NC}"

# Start the server
echo -e "${BLUE}🚀 Starting backend server...${NC}"
export PATH="/usr/local/bin:$PATH"
npm run dev
