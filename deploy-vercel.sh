#!/bin/bash

echo "🚀 BiteBase Frontend - Vercel Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Vercel authentication...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}❌ Not authenticated. Please login to Vercel...${NC}"
    vercel login
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Build the project
echo -e "${BLUE}🔨 Building the project...${NC}"
npm run build

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployment successful!${NC}"
    echo ""
    echo -e "${BLUE}📝 Next steps:${NC}"
    echo "1. Configure environment variables in Vercel Dashboard"
    echo "2. Set up custom domain (optional)"
    echo "3. Update backend CORS with your Vercel domain"
    echo ""
    echo -e "${YELLOW}🔧 Required Environment Variables:${NC}"
    echo "NEXT_PUBLIC_API_URL=https://api.bitebase.app"
    echo "NEXT_PUBLIC_APP_URL=https://beta.bitebase.app"
    echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ"
    echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCfG9E3ggBc1ZBkhqTEDSBm0eYp152tMLk"
    echo "NEXT_PUBLIC_ENABLE_MAPS=true"
    echo "NEXT_PUBLIC_ENABLE_AI_CHAT=true"
    echo "NEXT_PUBLIC_ENABLE_REAL_DATA=true"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    exit 1
fi