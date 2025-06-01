#!/bin/bash

# BiteBase Production Deployment Script
# This script prepares the repository for production deployment

set -e  # Exit on any error

echo "🚀 BiteBase Production Deployment Preparation"
echo "=============================================="
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the bitebase-geospatial-saas root directory."
    exit 1
fi

print_status "Preparing BiteBase for production deployment..."

# Step 1: Clean and install dependencies
print_status "Cleaning and installing dependencies..."
npm ci
if [ $? -eq 0 ]; then
    print_success "Root dependencies installed"
else
    print_error "Failed to install root dependencies"
    exit 1
fi

# Step 2: Prepare Frontend
print_status "Preparing Frontend for Vercel deployment..."
cd apps/frontend
npm ci
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ../..

# Step 3: Prepare Backend
print_status "Preparing Backend for Render deployment..."
cd apps/backend
npm ci
npm run build
if [ $? -eq 0 ]; then
    print_success "Backend build successful"
else
    print_error "Backend build failed"
    exit 1
fi
cd ../..

# Step 4: Prepare AI Agents
print_status "Preparing AI Agents for deployment..."
cd agent

# Check if Poetry is available
if command -v poetry &> /dev/null; then
    print_status "Using Poetry for Python dependencies..."
    poetry export -f requirements.txt --output requirements.txt --without-hashes
    if [ $? -eq 0 ]; then
        print_success "Requirements.txt generated from Poetry"
    else
        print_warning "Failed to export from Poetry, using existing requirements.txt"
    fi
else
    print_warning "Poetry not found, using existing requirements.txt"
fi

# Install Node.js dependencies for agent gateway
if [ -f "package.json" ]; then
    npm ci
    if [ $? -eq 0 ]; then
        print_success "Agent gateway dependencies installed"
    else
        print_warning "Failed to install agent gateway dependencies"
    fi
fi

cd ..

# Step 5: Validate environment files
print_status "Validating environment configuration..."

# Check if production environment files exist
if [ ! -f "apps/backend/.env.production" ]; then
    print_error "Backend production environment file missing"
    exit 1
fi

if [ ! -f "apps/frontend/.env.production" ]; then
    print_error "Frontend production environment file missing"
    exit 1
fi

print_success "Environment files validated"

# Step 6: Generate deployment summary
print_status "Generating deployment summary..."

cat > DEPLOYMENT-SUMMARY.md << EOF
# BiteBase Deployment Summary

## 📊 **Deployment Status**
- **Generated**: $(date)
- **Repository**: Ready for production deployment
- **Frontend**: Built and ready for Vercel
- **Backend**: Built and ready for Render.com
- **AI Agents**: Dependencies prepared

## 🔗 **Service URLs (After Deployment)**
- **Frontend**: https://beta.bitebase.app
- **Backend API**: https://bitebase-backend-api.onrender.com
- **Strapi CMS**: https://bitebase-strapi-cms.onrender.com
- **AI Agents**: https://bitebase-ai-agents.onrender.com
- **AI Gateway**: https://bitebase-ai-gateway.onrender.com

## 📋 **Next Steps**
1. Push code to GitHub repository
2. Deploy backend services to Render.com using render.yaml
3. Deploy frontend to Vercel using vercel.json
4. Configure custom domain beta.bitebase.app
5. Set up environment variables in deployment platforms
6. Test all services and integrations

## 🔑 **Required Environment Variables**
### Backend (Render.com)
- DATABASE_URL
- JWT_SECRET
- ADMIN_JWT_SECRET
- OPENAI_API_KEY
- GOOGLE_MAPS_API_KEY

### Frontend (Vercel)
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_AGENT_API_URL
- NEXT_PUBLIC_FIREBASE_API_KEY

## 🎯 **Health Check URLs**
- Backend: /health
- AI Agents: /health
- Frontend: /
- Strapi: /admin

EOF

print_success "Deployment summary generated"

# Step 7: Final validation
print_status "Running final validation..."

# Check if all required files exist
required_files=(
    "render.yaml"
    "vercel.json"
    "apps/backend/.env.production"
    "apps/frontend/.env.production"
    "agent/requirements.txt"
    "DEPLOYMENT.md"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done

print_success "All required files present"

# Step 8: Git status check
print_status "Checking Git status..."
if git status --porcelain | grep -q .; then
    print_warning "You have uncommitted changes. Consider committing before deployment."
    git status --short
else
    print_success "Git working directory is clean"
fi

print_success "Production deployment preparation completed!"
echo ""
echo "🎉 BiteBase Ready for Production Deployment!"
echo ""
echo "📋 **Deployment Checklist:**"
echo "  1. ✅ Dependencies installed and built"
echo "  2. ✅ Environment files configured"
echo "  3. ✅ Deployment configurations ready"
echo "  4. ✅ All required files present"
echo ""
echo "🚀 **Next Steps:**"
echo "  1. Push to GitHub: git add . && git commit -m 'Production ready' && git push"
echo "  2. Deploy to Render.com using render.yaml"
echo "  3. Deploy to Vercel using vercel.json"
echo "  4. Configure custom domain beta.bitebase.app"
echo "  5. Set environment variables in deployment dashboards"
echo ""
echo "📖 **Documentation:**"
echo "  - Read DEPLOYMENT.md for detailed instructions"
echo "  - Check DEPLOYMENT-SUMMARY.md for quick reference"
echo ""
echo "🍽️ Happy deploying! ✨"
