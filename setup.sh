#!/bin/bash

echo "=========================================="
echo "Timetable ERP System - Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}Checking Node.js installation...${NC}"
if command -v node &> /dev/null
then
    echo -e "${GREEN}✓ Node.js is installed: $(node --version)${NC}"
else
    echo "✗ Node.js is not installed. Please install Node.js v16 or higher"
    exit 1
fi

echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo "=========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. ${YELLOW}Set up Supabase Database:${NC}"
echo "   - Go to https://app.supabase.com"
echo "   - Navigate to SQL Editor"
echo "   - Copy all content from DATABASE_SCHEMA.sql"
echo "   - Paste into Supabase SQL Editor"
echo "   - Click 'Run'"
echo ""
echo "2. ${YELLOW}Start Backend (Terminal 1):${NC}"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. ${YELLOW}Start Frontend (Terminal 2):${NC}"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. ${YELLOW}Open Application:${NC}"
echo "   http://localhost:3000"
echo ""
echo -e "${GREEN}Happy coding!${NC}"
