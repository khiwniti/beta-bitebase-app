#!/bin/bash

# BiteBase Deployment Script
# This script helps prepare and deploy the BiteBase application

set -e

echo "🚀 BiteBase Deployment Script"
echo "=============================="

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/frontend" ] || [ ! -d "apps/backend" ]; then
    print_error "Please run this script from the root of the BiteBase project"
    exit 1
fi

print_status "Checking project structure..."
print_success "Project structure verified"

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Install dependencies
print_status "Installing dependencies..."

print_status "Installing root dependencies..."
npm install

print_status "Installing frontend dependencies..."
cd apps/frontend
npm install
cd ../..

print_status "Installing backend dependencies..."
cd apps/backend
npm install
cd ../..

print_success "All dependencies installed"

# Build frontend to check for errors
print_status "Building frontend to check for errors..."
cd apps/frontend
if npm run build; then
    print_success "Frontend build successful"
else
    print_error "Frontend build failed. Please fix errors before deploying."
    exit 1
fi
cd ../..

print_success "Pre-deployment checks completed!"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - Create new Web Service"
echo "   - Connect repository: khiwniti/beta-bitebase-app"
echo "   - Root directory: apps/backend"
echo "   - Build command: npm install"
echo "   - Start command: npm run start:vercel"
echo "   - See RENDER_SETUP.md for detailed instructions"
echo ""
echo "2. Deploy Frontend to Vercel:"
echo "   - Run: cd apps/frontend && vercel --prod"
echo "   - See VERCEL_SETUP.md for detailed instructions"
echo ""
echo "3. Configure Environment Variables:"
echo "   - Backend: Set JWT_SECRET, GOOGLE_CLIENT_ID in Render"
echo "   - Frontend: Set NEXT_PUBLIC_API_URL in Vercel"
echo ""
echo "4. Test the deployment:"
echo "   - Visit your frontend URL"
echo "   - Test login and API functionality"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    print_success "Vercel CLI is installed"
    echo ""
    echo "🚀 Quick Deploy Frontend:"
    echo "========================"
    echo "Run: cd apps/frontend && vercel --prod"
else
    print_warning "Vercel CLI not installed"
    echo ""
    echo "📦 Install Vercel CLI:"
    echo "====================="
    echo "Run: npm install -g vercel"
fi

echo ""
print_success "Deployment preparation complete!"
print_status "See DEPLOYMENT_GUIDE.md for full instructions"