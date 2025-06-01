#!/bin/bash

# BiteBase Vercel Setup Script
# This script helps set up the project for Vercel deployment

set -e

echo "🔧 BiteBase Vercel Setup"
echo "======================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Vercel...${NC}"
    vercel login
else
    echo -e "${GREEN}✅ Already logged in to Vercel${NC}"
fi

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PATH="$SCRIPT_DIR/apps/backend"
FRONTEND_PATH="$SCRIPT_DIR/apps/frontend"

echo -e "\n${BLUE}📁 Project Structure:${NC}"
echo "Backend: $BACKEND_PATH"
echo "Frontend: $FRONTEND_PATH"

# Setup backend environment
echo -e "\n${BLUE}🔧 Setting up Backend Environment...${NC}"
if [ ! -f "$BACKEND_PATH/.env.local" ]; then
    cp "$BACKEND_PATH/.env.example" "$BACKEND_PATH/.env.local"
    echo -e "${YELLOW}📝 Created backend .env.local from example${NC}"
    echo -e "${YELLOW}⚠️  Please edit $BACKEND_PATH/.env.local with your actual values${NC}"
else
    echo -e "${GREEN}✅ Backend .env.local already exists${NC}"
fi

# Setup frontend environment
echo -e "\n${BLUE}🔧 Setting up Frontend Environment...${NC}"
if [ ! -f "$FRONTEND_PATH/.env.local" ]; then
    cp "$FRONTEND_PATH/.env.example" "$FRONTEND_PATH/.env.local"
    echo -e "${YELLOW}📝 Created frontend .env.local from example${NC}"
    echo -e "${YELLOW}⚠️  Please edit $FRONTEND_PATH/.env.local with your actual values${NC}"
else
    echo -e "${GREEN}✅ Frontend .env.local already exists${NC}"
fi

# Install dependencies
echo -e "\n${BLUE}📦 Installing Dependencies...${NC}"

echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd "$BACKEND_PATH"
npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd "$FRONTEND_PATH"
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd "$SCRIPT_DIR"

# Test builds locally
echo -e "\n${BLUE}🧪 Testing Local Builds...${NC}"

echo -e "${YELLOW}Testing backend build...${NC}"
cd "$BACKEND_PATH"
npm run build
echo -e "${GREEN}✅ Backend build successful${NC}"

echo -e "${YELLOW}Testing frontend build...${NC}"
cd "$FRONTEND_PATH"
npm run build
echo -e "${GREEN}✅ Frontend build successful${NC}"

cd "$SCRIPT_DIR"

# Create deployment checklist
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "\n${BLUE}📋 Pre-Deployment Checklist:${NC}"
echo "1. ✅ Vercel CLI installed and configured"
echo "2. ✅ Dependencies installed"
echo "3. ✅ Local builds tested"
echo "4. ⚠️  Configure environment variables in .env.local files"
echo "5. ⚠️  Set up external services (database, Redis, Stripe, etc.)"
echo "6. ⚠️  Test local development servers"

echo -e "\n${BLUE}🔗 Required External Services:${NC}"
echo "• PostgreSQL Database (Supabase, PlanetScale, or Neon)"
echo "• Redis Instance (Upstash or Redis Cloud)"
echo "• Stripe Account (for payments)"
echo "• Google Cloud Console (for OAuth and Maps)"
echo "• OpenAI API Key (for AI features)"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo "1. Edit environment files:"
echo "   - $BACKEND_PATH/.env.local"
echo "   - $FRONTEND_PATH/.env.local"
echo ""
echo "2. Test locally:"
echo "   - cd apps/backend && npm run dev"
echo "   - cd apps/frontend && npm run dev"
echo ""
echo "3. Deploy to Vercel:"
echo "   - ./deploy-vercel.sh --production"
echo ""
echo "4. Configure environment variables in Vercel dashboard"
echo ""
echo "5. Set up custom domains (optional)"

echo -e "\n${YELLOW}📖 For detailed instructions, see: VERCEL_DEPLOYMENT_GUIDE.md${NC}"