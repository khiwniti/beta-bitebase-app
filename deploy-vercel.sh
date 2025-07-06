#!/bin/bash

# BiteBase Frontend Deployment Script for Vercel
# This script ensures proper environment variable setup and deployment

echo "🚀 Starting BiteBase Frontend Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Set environment variables for deployment
echo "🔧 Setting up environment variables..."

# Core API Configuration
vercel env add NEXT_PUBLIC_API_URL production <<< "https://bitebase-backend-prod.bitebase.workers.dev"
vercel env add NEXT_PUBLIC_BACKEND_URL production <<< "https://bitebase-backend-prod.bitebase.workers.dev"
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://beta.bitebase.app"

# Feature Flags
vercel env add NEXT_PUBLIC_ENABLE_MAPS production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_AI_CHAT production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_REAL_DATA production <<< "true"

# Authentication
vercel env add NEXT_PUBLIC_AUTH_ENABLED production <<< "true"
vercel env add NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED production <<< "true"
vercel env add NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED production <<< "true"

# Debug Settings
vercel env add NEXT_PUBLIC_DEBUG_MODE production <<< "false"
vercel env add NEXT_PUBLIC_LOG_LEVEL production <<< "info"

# Beta Features
vercel env add NEXT_PUBLIC_BETA_FEATURES production <<< "true"
vercel env add NEXT_PUBLIC_FEEDBACK_ENABLED production <<< "true"

# Environment
vercel env add NODE_ENV production <<< "production"

# Mapbox Token
vercel env add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN production <<< "pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ"

# Foursquare API
vercel env add NEXT_PUBLIC_FOURSQUARE_API_KEY production <<< "fsq3Ciis2M5OLrAUQqL2V5z+bsUMKpCCdQe1ULDMN23ISSo="

echo "✅ Environment variables configured"

# Build and deploy
echo "🏗️ Building and deploying to Vercel..."

# Deploy to production
vercel --prod --yes

echo "🎉 Deployment completed!"
echo "📱 Your app should be available at: https://beta.bitebase.app"
echo "🔗 Backend API: https://bitebase-backend-prod.bitebase.workers.dev"

# Test the deployment
echo "🧪 Testing deployment..."
curl -s -o /dev/null -w "%{http_code}" https://beta.bitebase.app > /tmp/status_code
STATUS_CODE=$(cat /tmp/status_code)

if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ Deployment test passed (Status: $STATUS_CODE)"
else
    echo "⚠️ Deployment test warning (Status: $STATUS_CODE)"
fi

echo "🔍 Check your deployment at: https://vercel.com/dashboard"
