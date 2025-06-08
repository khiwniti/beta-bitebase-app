#!/bin/bash

# BiteBase Deployment Setup Script
# This script helps prepare the project for deployment

set -e

echo "🚀 BiteBase Deployment Setup"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Checking project structure...${NC}"

# Check frontend
if [ -d "apps/frontend" ] && [ -f "apps/frontend/package.json" ]; then
    echo -e "${GREEN}✅ Frontend found${NC}"
else
    echo -e "${RED}❌ Frontend not found${NC}"
    exit 1
fi

# Check backend
if [ -d "apps/backend" ] && [ -f "apps/backend/package.json" ]; then
    echo -e "${GREEN}✅ Backend found${NC}"
else
    echo -e "${RED}❌ Backend not found${NC}"
    exit 1
fi

# Check if server.js exists
if [ -f "apps/backend/server.js" ]; then
    echo -e "${GREEN}✅ Production server file found${NC}"
else
    echo -e "${RED}❌ Production server file not found${NC}"
    exit 1
fi

echo -e "\n${BLUE}🔧 Installing dependencies...${NC}"

# Install root dependencies
echo -e "${YELLOW}Installing root dependencies...${NC}"
npm install

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd apps/frontend
npm install
cd ../..

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd apps/backend
npm install
cd ../..

echo -e "\n${BLUE}🧪 Running build tests...${NC}"

# Test frontend build
echo -e "${YELLOW}Testing frontend build...${NC}"
cd apps/frontend
if npm run build; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    cd ../..
    exit 1
fi
cd ../..

# Test backend
echo -e "${YELLOW}Testing backend...${NC}"
cd apps/backend
if npm run build; then
    echo -e "${GREEN}✅ Backend builds successfully${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    cd ../..
    exit 1
fi
cd ../..

echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
echo -e "\n${BLUE}📋 Next steps:${NC}"
echo "1. 📖 Read DEPLOYMENT_INSTRUCTIONS.md for detailed deployment guide"
echo "2. 🔧 Set up your database (Neon, Supabase, or PlanetScale)"
echo "3. 🔑 Prepare your API keys (Google, Stripe, OpenAI, etc.)"
echo "4. 🚀 Deploy backend to Render using RENDER_ENV_SETUP.md"
echo "5. 🌐 Deploy frontend to Vercel using VERCEL_ENV_SETUP.md"
echo "6. 🔗 Update cross-references between frontend and backend"
echo "7. 🧪 Test your deployed application"

echo -e "\n${YELLOW}📁 Important files created:${NC}"
echo "- DEPLOYMENT_INSTRUCTIONS.md - Complete deployment guide"
echo "- VERCEL_ENV_SETUP.md - Vercel environment variables"
echo "- RENDER_ENV_SETUP.md - Render environment variables"
echo "- apps/backend/server.js - Production server file"

echo -e "\n${BLUE}🔗 Quick links:${NC}"
echo "- Vercel: https://vercel.com"
echo "- Render: https://render.com"
echo "- Neon (Database): https://neon.tech"
echo "- Upstash (Redis): https://upstash.com"

echo -e "\n${GREEN}Happy deploying! 🚀${NC}"