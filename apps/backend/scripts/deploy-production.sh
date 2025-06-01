#!/bin/bash

# BiteBase Production Deployment Script
# This script handles the complete production deployment process

set -e  # Exit on any error

echo "🚀 BiteBase Production Deployment"
echo "=================================="
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
    print_error "package.json not found. Please run this script from the backend directory."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please create it with your production configuration."
    exit 1
fi

print_status "Starting production deployment process..."

# Step 1: Install dependencies
print_status "Installing production dependencies..."
npm ci --only=production
print_success "Dependencies installed"

# Step 2: Initialize database
print_status "Initializing production database..."
npm run db:init:production
if [ $? -eq 0 ]; then
    print_success "Database initialized successfully"
else
    print_error "Database initialization failed"
    exit 1
fi

# Step 3: Build the application
print_status "Building Strapi application..."
NODE_ENV=production npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 4: Run database migrations (if any)
print_status "Running database migrations..."
# Strapi handles migrations automatically on startup

# Step 5: Start the application
print_status "Starting production server..."
print_warning "Make sure to set up a process manager like PM2 for production"
print_warning "Example: pm2 start npm --name 'bitebase-backend' -- run start"

echo ""
print_success "Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. Set up a process manager (PM2 recommended)"
echo "2. Configure reverse proxy (Nginx recommended)"
echo "3. Set up SSL certificates"
echo "4. Configure monitoring and logging"
echo ""
echo "To start the server manually:"
echo "NODE_ENV=production npm run start"
echo ""
echo "The server will be available at:"
echo "- API: http://localhost:1337/api"
echo "- Admin: http://localhost:1337/admin"
echo ""
echo "🎉 BiteBase backend is ready for production!"
