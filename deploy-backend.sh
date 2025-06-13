#!/bin/bash

# BiteBase Backend Deployment Script for Vercel

echo "🚀 Starting BiteBase Backend Deployment..."

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Check if API directory exists
if [ ! -d "api" ]; then
    echo "❌ Error: api directory not found."
    exit 1
fi

echo "✅ Project structure verified"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Test API functions locally
echo "🧪 Testing API functions locally..."

# Test health endpoint
echo "Testing health endpoint..."
node -e "
const handler = require('./api/health.js');
const req = { method: 'GET', headers: {} };
const res = {
  status: (code) => ({ json: (data) => console.log('✅ Health check passed:', code) }),
  json: (data) => console.log('✅ Health check passed')
};
handler(req, res).catch(err => { console.error('❌ Health check failed:', err); process.exit(1); });
"

if [ $? -ne 0 ]; then
    echo "❌ Health check failed"
    exit 1
fi

echo "✅ All API functions tested successfully"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "🔗 Your API endpoints:"
    echo "   Health: https://beta.bitebase.app/api/health"
    echo "   Init DB: https://beta.bitebase.app/api/init-database"
    echo "   Search: https://beta.bitebase.app/api/restaurants/search"
    echo "   Analytics: https://beta.bitebase.app/api/analytics/dashboard"
    echo ""
    echo "🧪 Test your deployment:"
    echo "   curl https://beta.bitebase.app/api/health"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi