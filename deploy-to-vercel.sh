#!/bin/bash

# 🚀 BiteBase MCP-Powered Vercel Deployment Script

set -e

echo "🚀 Starting BiteBase MCP deployment to Vercel..."

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing..."
    npm install -g vercel
    print_success "Vercel CLI installed successfully"
fi

# Check if user is logged in to Vercel
print_status "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in..."
    vercel login
fi

print_success "Vercel authentication verified"

# Install dependencies
print_status "Installing dependencies..."

# Install root dependencies
if [ -f "package.json" ]; then
    npm install
    print_success "Root dependencies installed"
fi

# Install API dependencies
if [ -f "api/package.json" ]; then
    cd api
    npm install
    cd ..
    print_success "API dependencies installed"
fi

# Install frontend dependencies
if [ -f "apps/frontend/package.json" ]; then
    cd apps/frontend
    npm install
    cd ../..
    print_success "Frontend dependencies installed"
fi

# Validate vercel.json configuration
print_status "Validating Vercel configuration..."
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found!"
    exit 1
fi

# Check for required environment variables
print_status "Checking environment variables..."
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    print_warning "No .env.local file found. Creating template..."
    cat > .env.local << 'EOF'
# Core Configuration
NODE_ENV=production
MCP_ENABLED=true

# API Keys (REPLACE WITH YOUR ACTUAL KEYS)
OPENAI_API_KEY=your_openai_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Database (Optional - for external databases)
DATABASE_URL=your_database_url_here
REDIS_URL=your_redis_url_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Frontend URLs (Will be updated after deployment)
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
EOF
    print_warning "Please update .env.local with your actual API keys before deploying!"
    print_warning "You can also set these in the Vercel dashboard after deployment."
fi

# Build check
print_status "Running build check..."
cd apps/frontend
if npm run build; then
    print_success "Frontend build successful"
else
    print_error "Frontend build failed. Please fix build errors before deploying."
    exit 1
fi
cd ../..

# Deploy to Vercel
print_status "Deploying to Vercel..."

# Check if this is the first deployment
if vercel ls 2>/dev/null | grep -q "bitebase"; then
    print_status "Updating existing deployment..."
    vercel --prod
else
    print_status "Creating new deployment..."
    vercel --prod
fi

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --scope=$(vercel whoami) | grep "bitebase" | head -1 | awk '{print $2}')

if [ -n "$DEPLOYMENT_URL" ]; then
    print_success "Deployment successful!"
    echo ""
    echo "🎉 Your BiteBase MCP application is now live!"
    echo ""
    echo "📱 Application URL: https://$DEPLOYMENT_URL"
    echo "🔍 Health Check: https://$DEPLOYMENT_URL/api/health"
    echo "🛠️  MCP Tools: https://$DEPLOYMENT_URL/api/mcp/tools"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Update environment variables in Vercel dashboard if needed"
    echo "2. Test all API endpoints"
    echo "3. Configure custom domain (optional)"
    echo "4. Set up monitoring and analytics"
    echo ""
    echo "📚 Documentation: See VERCEL-MCP-DEPLOYMENT.md for detailed guide"
    echo ""
    
    # Test deployment
    print_status "Testing deployment..."
    
    echo "Testing health endpoint..."
    if curl -s "https://$DEPLOYMENT_URL/api/health" | grep -q "healthy"; then
        print_success "Health check passed ✅"
    else
        print_warning "Health check failed ⚠️"
    fi
    
    echo "Testing MCP tools endpoint..."
    if curl -s "https://$DEPLOYMENT_URL/api/mcp/tools" | grep -q "tools"; then
        print_success "MCP tools endpoint working ✅"
    else
        print_warning "MCP tools endpoint failed ⚠️"
    fi
    
    echo ""
    print_success "Deployment testing completed!"
    
else
    print_error "Could not retrieve deployment URL. Please check Vercel dashboard."
fi

# Optional: Open in browser
read -p "Would you like to open the application in your browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://$DEPLOYMENT_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://$DEPLOYMENT_URL"
    else
        print_status "Please open https://$DEPLOYMENT_URL in your browser"
    fi
fi

print_success "BiteBase MCP deployment completed! 🎉"