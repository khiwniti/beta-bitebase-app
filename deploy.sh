#!/bin/bash

# BiteBase Deployment Script
set -e

echo "🚀 Starting BiteBase deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "apps" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Load environment variables
if [ -f ".env.production" ]; then
    echo "📋 Loading production environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "⚠️  Warning: .env.production file not found. Using default values."
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Frontend dependencies
echo "Installing frontend dependencies..."
cd apps/frontend
npm ci --production
echo "✅ Frontend dependencies installed"

# Backend dependencies
echo "Installing backend dependencies..."
cd ../backend
npm ci --production
echo "✅ Backend dependencies installed"

cd ../..

# Build frontend
echo "🏗️  Building frontend..."
cd apps/frontend
npm run build
echo "✅ Frontend built successfully"

cd ../..

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p dist

# Copy frontend build
cp -r apps/frontend/.next dist/frontend-build
cp -r apps/frontend/public dist/frontend-public
cp apps/frontend/package.json dist/frontend-package.json

# Copy backend
cp -r apps/backend dist/backend
cp apps/backend/package.json dist/backend/package.json

# Copy environment files
cp .env.production dist/.env

echo "✅ Deployment package created in ./dist directory"

# Display deployment instructions
echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.production with your actual production values"
echo "2. Deploy the frontend (./dist/frontend-*) to your hosting platform"
echo "3. Deploy the backend (./dist/backend) to your server"
echo "4. Update CORS settings in backend to match your frontend domain"
echo ""
echo "🔧 Quick deployment commands:"
echo "Frontend: npm start (from dist/frontend-build directory)"
echo "Backend: npm start (from dist/backend directory)"
echo ""
echo "📚 For detailed deployment instructions, see the deployment documentation."