#!/bin/bash

# BiteBase Cloudflare Workers + Vercel Deployment Script
# Backend: Cloudflare Workers with D1, KV, R2, Durable Objects
# Frontend: Vercel with Next.js

set -e

echo "🚀 Starting BiteBase Cloudflare Workers + Vercel Deployment"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if required CLIs are installed
check_cli() {
    local cli_name=$1
    local install_cmd=$2
    
    if ! command -v $cli_name &> /dev/null; then
        echo -e "${RED}❌ $cli_name CLI is not installed${NC}"
        echo "Please install it with: $install_cmd"
        exit 1
    else
        echo -e "${GREEN}✅ $cli_name CLI is installed${NC}"
    fi
}

echo -e "${BLUE}🔍 Checking required tools...${NC}"
check_cli "wrangler" "npm install -g wrangler"
check_cli "vercel" "npm install -g vercel"

# Check authentication
echo -e "\n${BLUE}🔐 Checking authentication...${NC}"

if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Please login to Cloudflare...${NC}"
    wrangler login
else
    echo -e "${GREEN}✅ Logged in to Cloudflare${NC}"
fi

if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Please login to Vercel...${NC}"
    vercel login
else
    echo -e "${GREEN}✅ Logged in to Vercel${NC}"
fi

# Parse command line arguments
PRODUCTION=false
BACKEND_ONLY=false
FRONTEND_ONLY=false
SETUP_RESOURCES=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --production|-p)
            PRODUCTION=true
            shift
            ;;
        --backend-only|-b)
            BACKEND_ONLY=true
            shift
            ;;
        --frontend-only|-f)
            FRONTEND_ONLY=true
            shift
            ;;
        --setup-resources|-s)
            SETUP_RESOURCES=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --production, -p        Deploy to production"
            echo "  --backend-only, -b      Deploy only backend (Cloudflare)"
            echo "  --frontend-only, -f     Deploy only frontend (Vercel)"
            echo "  --setup-resources, -s   Setup Cloudflare resources (D1, KV, R2)"
            echo "  --help, -h             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                      Deploy both services to preview/staging"
            echo "  $0 --production         Deploy both services to production"
            echo "  $0 --backend-only -p    Deploy only backend to production"
            echo "  $0 --setup-resources    Setup Cloudflare resources first"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PATH="$SCRIPT_DIR/apps/backend"
FRONTEND_PATH="$SCRIPT_DIR/apps/frontend"

echo -e "\n${BLUE}📁 Project Configuration:${NC}"
echo "Production: $PRODUCTION"
echo "Backend only: $BACKEND_ONLY"
echo "Frontend only: $FRONTEND_ONLY"
echo "Setup resources: $SETUP_RESOURCES"
echo "Backend path: $BACKEND_PATH"
echo "Frontend path: $FRONTEND_PATH"

# Verify paths exist
if [ ! -d "$BACKEND_PATH" ] && [ "$FRONTEND_ONLY" != "true" ]; then
    echo -e "${RED}❌ Backend path not found: $BACKEND_PATH${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_PATH" ] && [ "$BACKEND_ONLY" != "true" ]; then
    echo -e "${RED}❌ Frontend path not found: $FRONTEND_PATH${NC}"
    exit 1
fi

# Setup Cloudflare resources if requested
setup_cloudflare_resources() {
    echo -e "\n${PURPLE}🏗️ Setting up Cloudflare resources...${NC}"
    
    cd "$BACKEND_PATH"
    
    echo -e "${YELLOW}📊 Creating D1 database...${NC}"
    if wrangler d1 list | grep -q "bitebase-production"; then
        echo -e "${GREEN}✅ D1 database already exists${NC}"
    else
        wrangler d1 create bitebase-production
        echo -e "${GREEN}✅ D1 database created${NC}"
    fi
    
    echo -e "${YELLOW}🗄️ Creating KV namespaces...${NC}"
    if wrangler kv:namespace list | grep -q "CACHE"; then
        echo -e "${GREEN}✅ KV namespaces already exist${NC}"
    else
        wrangler kv:namespace create CACHE
        wrangler kv:namespace create SESSIONS
        echo -e "${GREEN}✅ KV namespaces created${NC}"
    fi
    
    echo -e "${YELLOW}📦 Creating R2 bucket...${NC}"
    if wrangler r2 bucket list | grep -q "bitebase-uploads"; then
        echo -e "${GREEN}✅ R2 bucket already exists${NC}"
    else
        wrangler r2 bucket create bitebase-uploads
        echo -e "${GREEN}✅ R2 bucket created${NC}"
    fi
    
    echo -e "${YELLOW}🗃️ Running database migrations...${NC}"
    if [ -f "database/schema.sql" ]; then
        wrangler d1 execute bitebase-production --file=database/schema.sql
        echo -e "${GREEN}✅ Database schema migrated${NC}"
    else
        echo -e "${YELLOW}⚠️ No schema.sql found, skipping migration${NC}"
    fi
    
    echo -e "${PURPLE}🎉 Cloudflare resources setup complete!${NC}"
    echo -e "${YELLOW}⚠️ Don't forget to update wrangler.toml with the actual resource IDs${NC}"
    
    cd "$SCRIPT_DIR"
}

# Deploy backend to Cloudflare Workers
deploy_backend() {
    echo -e "\n${PURPLE}☁️ Deploying Backend to Cloudflare Workers...${NC}"
    
    cd "$BACKEND_PATH"
    
    # Check if wrangler.toml exists
    if [ ! -f "wrangler.toml" ]; then
        echo -e "${RED}❌ wrangler.toml not found in $BACKEND_PATH${NC}"
        return 1
    fi
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
    
    # Build worker if needed
    if [ -f "package.json" ] && grep -q "build:worker" package.json; then
        echo -e "${YELLOW}🔨 Building worker...${NC}"
        npm run build:worker
    fi
    
    # Deploy to Cloudflare Workers
    if [ "$PRODUCTION" = "true" ]; then
        echo -e "${YELLOW}🚀 Deploying to production...${NC}"
        wrangler deploy --env production
    else
        echo -e "${YELLOW}🧪 Deploying to staging...${NC}"
        wrangler deploy --env staging
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend deployed successfully to Cloudflare Workers${NC}"
    else
        echo -e "${RED}❌ Failed to deploy backend${NC}"
        return 1
    fi
    
    cd "$SCRIPT_DIR"
}

# Deploy frontend to Vercel
deploy_frontend() {
    echo -e "\n${BLUE}🌐 Deploying Frontend to Vercel...${NC}"
    
    cd "$FRONTEND_PATH"
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        echo -e "${RED}❌ vercel.json not found in $FRONTEND_PATH${NC}"
        return 1
    fi
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
    
    # Build frontend
    echo -e "${YELLOW}🔨 Building frontend...${NC}"
    npm run build
    
    # Deploy to Vercel
    if [ "$PRODUCTION" = "true" ]; then
        echo -e "${YELLOW}🚀 Deploying to production...${NC}"
        vercel --prod --yes
    else
        echo -e "${YELLOW}🧪 Deploying to preview...${NC}"
        vercel --yes
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend deployed successfully to Vercel${NC}"
    else
        echo -e "${RED}❌ Failed to deploy frontend${NC}"
        return 1
    fi
    
    cd "$SCRIPT_DIR"
}

# Main deployment flow
if [ "$SETUP_RESOURCES" = "true" ]; then
    setup_cloudflare_resources
fi

if [ "$FRONTEND_ONLY" != "true" ]; then
    deploy_backend
fi

if [ "$BACKEND_ONLY" != "true" ]; then
    deploy_frontend
fi

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "\n${BLUE}📋 Post-deployment checklist:${NC}"
echo "1. ✅ Backend deployed to Cloudflare Workers"
echo "2. ✅ Frontend deployed to Vercel"
echo "3. ⚠️ Configure environment variables/secrets"
echo "4. ⚠️ Update frontend API URLs to point to Cloudflare Worker"
echo "5. ⚠️ Test all functionality"
echo "6. ⚠️ Set up custom domains if needed"

if [ "$PRODUCTION" = "true" ]; then
    echo -e "\n${YELLOW}🔗 Production URLs:${NC}"
    echo "Backend (Cloudflare): https://bitebase-backend-prod.your-subdomain.workers.dev"
    echo "Frontend (Vercel): https://bitebase-frontend.vercel.app"
else
    echo -e "\n${YELLOW}🔗 Staging URLs:${NC}"
    echo "Backend (Cloudflare): https://bitebase-backend-staging.your-subdomain.workers.dev"
    echo "Frontend (Vercel): Preview URL shown in Vercel CLI output above"
fi

echo -e "\n${BLUE}🔧 Next steps:${NC}"
echo "1. Set Cloudflare Worker secrets:"
echo "   wrangler secret put JWT_SECRET"
echo "   wrangler secret put OPENAI_API_KEY"
echo "   wrangler secret put STRIPE_SECRET_KEY"
echo ""
echo "2. Update frontend environment variables in Vercel:"
echo "   NEXT_PUBLIC_API_URL=https://your-worker.workers.dev"
echo ""
echo "3. Configure custom domains:"
echo "   - Cloudflare: api.yourdomain.com"
echo "   - Vercel: yourdomain.com"
echo ""
echo "4. Test the deployment:"
echo "   curl https://your-worker.workers.dev/health"

echo -e "\n${PURPLE}📖 For detailed setup instructions, see: CLOUDFLARE_DEPLOYMENT_GUIDE.md${NC}"