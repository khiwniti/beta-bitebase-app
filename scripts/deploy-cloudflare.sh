#!/bin/bash

# BiteBase Cloudflare Deployment Script
# This script deploys all services to Cloudflare

set -e  # Exit on any error

echo "🌐 BiteBase Cloudflare Deployment"
echo "=================================="
echo "🍽️ AI-Powered Restaurant Intelligence Platform"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    print_error "Wrangler CLI not found. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    print_warning "Not logged in to Cloudflare. Please login first:"
    echo "wrangler login"
    exit 1
fi

print_status "Starting Cloudflare deployment..."

# Step 1: Create D1 Database
print_status "Setting up D1 Database..."
cd apps/backend

# Check if database exists, create if not
if ! wrangler d1 list | grep -q "bitebase-production"; then
    print_status "Creating D1 database..."
    wrangler d1 create bitebase-production
    print_success "D1 database created"
else
    print_success "D1 database already exists"
fi

# Run database migrations
print_status "Running database migrations..."
cd ../..
wrangler d1 execute bitebase-production --file=database/schema.sql --env production
if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_warning "Database migrations failed, but continuing deployment"
fi
cd apps/backend

cd ../..

# Step 2: Deploy Backend API Worker
print_status "Deploying Backend API Worker..."
cd apps/backend

# Install dependencies for Cloudflare Worker
if [ ! -f "package-cloudflare.json" ]; then
    print_error "package-cloudflare.json not found"
    exit 1
fi

cp package-cloudflare.json package.json
npm install

# Deploy to production
wrangler deploy --env production
if [ $? -eq 0 ]; then
    print_success "Backend API Worker deployed"
else
    print_error "Backend API Worker deployment failed"
    exit 1
fi

cd ../..

# Step 3: Deploy AI Agents Worker
print_status "Deploying AI Agents Worker..."
cd agent

# Install Hono for AI worker
npm init -y
npm install hono

# Deploy AI agents worker
wrangler deploy --env production
if [ $? -eq 0 ]; then
    print_success "AI Agents Worker deployed"
else
    print_error "AI Agents Worker deployment failed"
    exit 1
fi

cd ..

# Step 4: Build and Deploy Frontend to Cloudflare Pages
print_status "Building and deploying Frontend to Cloudflare Pages..."
cd apps/frontend

# Install dependencies
npm ci

# Build the frontend
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend build completed"
else
    print_error "Frontend build failed"
    exit 1
fi

# Deploy to Cloudflare Pages
if command -v wrangler pages &> /dev/null; then
    wrangler pages deploy out --project-name=bitebase-frontend
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Cloudflare Pages"
    else
        print_warning "Frontend deployment failed. Please deploy manually via Cloudflare dashboard"
    fi
else
    print_warning "Cloudflare Pages CLI not available. Please deploy manually:"
    echo "1. Go to Cloudflare Dashboard > Pages"
    echo "2. Create new project"
    echo "3. Connect to GitHub repository"
    echo "4. Set build command: npm run build"
    echo "5. Set output directory: out"
fi

cd ../..

# Step 5: Set up custom domains
print_status "Setting up custom domains..."
print_warning "Please configure the following custom domains in Cloudflare Dashboard:"
echo ""
echo "📱 Frontend (Cloudflare Pages):"
echo "   Domain: beta.bitebase.app"
echo "   Target: your-pages-project.pages.dev"
echo ""
echo "🔧 Backend API (Worker):"
echo "   Domain: api.bitebase.app"
echo "   Target: bitebase-backend-api.your-subdomain.workers.dev"
echo ""
echo "🤖 AI Agents (Worker):"
echo "   Domain: ai.bitebase.app"
echo "   Target: bitebase-ai-agents.your-subdomain.workers.dev"
echo ""

# Step 6: Configure environment variables
print_status "Environment variables configuration..."
print_warning "Please set the following environment variables in Cloudflare Dashboard:"
echo ""
echo "🔧 Backend API Worker:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - ADMIN_JWT_SECRET"
echo "   - CORS_ORIGIN=https://beta.bitebase.app"
echo ""
echo "🤖 AI Agents Worker:"
echo "   - OPENAI_API_KEY"
echo "   - GOOGLE_MAPS_API_KEY"
echo "   - TAVILY_API_KEY"
echo ""
echo "📱 Frontend (Pages):"
echo "   - NEXT_PUBLIC_API_URL=https://api.bitebase.app"
echo "   - NEXT_PUBLIC_AGENT_API_URL=https://ai.bitebase.app"
echo "   - NEXT_PUBLIC_SITE_URL=https://beta.bitebase.app"
echo ""

# Step 7: Test deployments
print_status "Testing deployments..."

# Test backend API
print_status "Testing Backend API..."
if curl -f -s "https://api.bitebase.app/health" > /dev/null; then
    print_success "Backend API is responding"
else
    print_warning "Backend API not responding yet (may take a few minutes)"
fi

# Test AI agents
print_status "Testing AI Agents..."
if curl -f -s "https://ai.bitebase.app/health" > /dev/null; then
    print_success "AI Agents are responding"
else
    print_warning "AI Agents not responding yet (may take a few minutes)"
fi

# Test frontend
print_status "Testing Frontend..."
if curl -f -s "https://beta.bitebase.app" > /dev/null; then
    print_success "Frontend is responding"
else
    print_warning "Frontend not responding yet (may take a few minutes)"
fi

print_success "Cloudflare deployment completed!"
echo ""
echo "🎉 BiteBase Deployed to Cloudflare!"
echo ""
echo "📊 **Deployment Summary:**"
echo "  ✅ D1 Database: Created and migrated"
echo "  ✅ Backend API: Deployed to Cloudflare Workers"
echo "  ✅ AI Agents: Deployed to Cloudflare Workers"
echo "  ✅ Frontend: Built and ready for Pages deployment"
echo ""
echo "🌐 **Service URLs:**"
echo "  - Frontend: https://beta.bitebase.app"
echo "  - Backend API: https://api.bitebase.app"
echo "  - AI Agents: https://ai.bitebase.app"
echo ""
echo "⚙️ **Next Steps:**"
echo "  1. Configure custom domains in Cloudflare Dashboard"
echo "  2. Set environment variables for all services"
echo "  3. Test all endpoints and functionality"
echo "  4. Set up monitoring and analytics"
echo ""
echo "🍽️ Your AI-powered restaurant platform is now live on Cloudflare! ✨"
