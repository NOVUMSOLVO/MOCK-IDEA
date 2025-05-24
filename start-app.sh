#!/bin/bash

echo "🚀 Starting MOCK IDEA Application with Dynamic Port Detection"
echo "============================================================"

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

# Check if Docker is running (for database)
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

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

    # Update backend .env file with the new database port
    sed -i.bak "s|postgresql://postgres:password@localhost:[0-9]*/mock_idea|postgresql://postgres:password@localhost:$DB_PORT/mock_idea|g" backend/.env

    echo -e "${GREEN}✅ PostgreSQL started on port $DB_PORT${NC}"

    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 5
else
    echo -e "${GREEN}✅ PostgreSQL container is already running${NC}"
fi

# Setup backend database if needed
echo -e "${BLUE}🔧 Setting up backend database...${NC}"
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    export PATH="/usr/local/bin:$PATH"
    npm install
fi

# Generate Prisma client and push schema
export PATH="/usr/local/bin:$PATH"
npx prisma generate >/dev/null 2>&1
npx prisma db push >/dev/null 2>&1

# Seed database if needed
echo -e "${YELLOW}🌱 Seeding database...${NC}"
npx tsx prisma/seed.ts >/dev/null 2>&1 || echo -e "${YELLOW}⚠️  Database seeding skipped (may already be seeded)${NC}"

echo -e "${GREEN}✅ Backend database setup complete${NC}"

# Start backend server
echo -e "${BLUE}🖥️  Starting backend server...${NC}"
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}🌐 Starting frontend...${NC}"
cd ../frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    export PATH="/usr/local/bin:$PATH"
    npm install
fi

# Start frontend with dynamic port
export PATH="/usr/local/bin:$PATH"
npm run dev &
FRONTEND_PID=$!

# Wait for services to start
sleep 5

echo ""
echo -e "${GREEN}🎉 MOCK IDEA Application Started Successfully!${NC}"
echo "=============================================="
echo ""
echo -e "${BLUE}📊 Database:${NC} PostgreSQL running in Docker"
echo -e "${BLUE}🖥️  Backend:${NC} Check terminal output for port"
echo -e "${BLUE}🌐 Frontend:${NC} Check terminal output for port"
echo ""
echo -e "${YELLOW}Demo Credentials:${NC}"
echo "  Email: demo@mockidea.com"
echo "  Password: demo123"
echo ""
echo -e "${YELLOW}To stop the application:${NC}"
echo "  Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down MOCK IDEA Application...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Application stopped${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
