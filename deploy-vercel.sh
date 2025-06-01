#!/bin/bash

# BiteBase Vercel Deployment Script
# This script deploys both backend and frontend to Vercel

set -e

echo "🚀 Starting BiteBase Vercel Deployment"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed${NC}"
    echo "Please install it with: npm install -g vercel"
    exit 1
fi

# Function to deploy a service
deploy_service() {
    local service_name=$1
    local service_path=$2
    local project_name=$3
    
    echo -e "\n${BLUE}📦 Deploying $service_name...${NC}"
    echo "Path: $service_path"
    echo "Project: $project_name"
    
    cd "$service_path"
    
    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        echo -e "${RED}❌ vercel.json not found in $service_path${NC}"
        return 1
    fi
    
    # Deploy to Vercel
    if [ "$PRODUCTION" = "true" ]; then
        echo -e "${YELLOW}🚀 Deploying to production...${NC}"
        vercel --prod --yes
    else
        echo -e "${YELLOW}🧪 Deploying to preview...${NC}"
        vercel --yes
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $service_name deployed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to deploy $service_name${NC}"
        return 1
    fi
    
    cd - > /dev/null
}

# Parse command line arguments
PRODUCTION=false
BACKEND_ONLY=false
FRONTEND_ONLY=false

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
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --production, -p     Deploy to production"
            echo "  --backend-only, -b   Deploy only backend"
            echo "  --frontend-only, -f  Deploy only frontend"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                   Deploy both services to preview"
            echo "  $0 --production      Deploy both services to production"
            echo "  $0 --backend-only    Deploy only backend to preview"
            echo "  $0 -p -f            Deploy only frontend to production"
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

echo -e "${BLUE}Configuration:${NC}"
echo "Production: $PRODUCTION"
echo "Backend only: $BACKEND_ONLY"
echo "Frontend only: $FRONTEND_ONLY"
echo "Script directory: $SCRIPT_DIR"

# Verify paths exist
if [ ! -d "$BACKEND_PATH" ] && [ "$FRONTEND_ONLY" != "true" ]; then
    echo -e "${RED}❌ Backend path not found: $BACKEND_PATH${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_PATH" ] && [ "$BACKEND_ONLY" != "true" ]; then
    echo -e "${RED}❌ Frontend path not found: $FRONTEND_PATH${NC}"
    exit 1
fi

# Deploy services
if [ "$FRONTEND_ONLY" != "true" ]; then
    deploy_service "Backend" "$BACKEND_PATH" "bitebase-backend"
fi

if [ "$BACKEND_ONLY" != "true" ]; then
    deploy_service "Frontend" "$FRONTEND_PATH" "bitebase-frontend"
fi

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Set up custom domains if needed"
echo "3. Configure database connections"
echo "4. Test the deployed applications"

if [ "$PRODUCTION" = "true" ]; then
    echo -e "\n${YELLOW}🔗 Production URLs:${NC}"
    echo "Frontend: https://bitebase-frontend.vercel.app"
    echo "Backend: https://bitebase-backend.vercel.app"
else
    echo -e "\n${YELLOW}🔗 Preview URLs will be shown in the Vercel CLI output above${NC}"
fi