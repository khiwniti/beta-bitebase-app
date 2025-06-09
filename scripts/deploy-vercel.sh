#!/bin/bash

# BiteBase Vercel Deployment Script
# This script will deploy the BiteBase application to Vercel

echo "🚀 Starting BiteBase Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI is not installed. Installing..."
  npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔑 Checking Vercel authentication..."
VERCEL_TOKEN=$(vercel whoami 2>&1)
if [[ $VERCEL_TOKEN == *"Error"* ]]; then
  echo "🔒 Please login to Vercel:"
  vercel login
fi

# Build the project
echo "🏗️ Building the project..."
yarn build

# Deploy frontend to Vercel
echo "🌐 Deploying frontend to Vercel..."
cd apps/frontend
vercel --prod

# Return to root directory
cd ../..

echo "✅ BiteBase has been successfully deployed to Vercel!"
echo "📊 Your dashboard is now available at your Vercel URL"
echo "🔧 Don't forget to set up your environment variables in the Vercel dashboard"

# Optional: Open the Vercel dashboard
if command -v open &> /dev/null; then
  echo "🔗 Opening Vercel dashboard..."
  open "https://vercel.com/dashboard"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure your custom domain in Vercel dashboard"
echo "2. Set up environment variables for production"
echo "3. Connect your backend API endpoints"
echo "4. Set up monitoring and alerts"
echo ""
echo "For more information, see DEPLOYMENT_GUIDE.md" 