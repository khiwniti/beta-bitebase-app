# BiteBase Frontend Deployment Script for Vercel (PowerShell)
# This script ensures proper environment variable setup and deployment

Write-Host "🚀 Starting BiteBase Frontend Deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Function to set environment variable
function Set-VercelEnv {
    param($Name, $Value)
    Write-Host "Setting $Name..." -ForegroundColor Yellow
    echo $Value | vercel env add $Name production
}

Write-Host "🔧 Setting up environment variables..." -ForegroundColor Blue

# Core API Configuration
Set-VercelEnv "NEXT_PUBLIC_API_URL" "https://bitebase-backend-prod.bitebase.workers.dev"
Set-VercelEnv "NEXT_PUBLIC_BACKEND_URL" "https://bitebase-backend-prod.bitebase.workers.dev"
Set-VercelEnv "NEXT_PUBLIC_APP_URL" "https://beta.bitebase.app"

# Feature Flags
Set-VercelEnv "NEXT_PUBLIC_ENABLE_MAPS" "true"
Set-VercelEnv "NEXT_PUBLIC_ENABLE_AI_CHAT" "true"
Set-VercelEnv "NEXT_PUBLIC_ENABLE_ANALYTICS" "true"
Set-VercelEnv "NEXT_PUBLIC_ENABLE_REAL_DATA" "true"

# Authentication
Set-VercelEnv "NEXT_PUBLIC_AUTH_ENABLED" "true"
Set-VercelEnv "NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED" "true"
Set-VercelEnv "NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED" "true"

# Debug Settings
Set-VercelEnv "NEXT_PUBLIC_DEBUG_MODE" "false"
Set-VercelEnv "NEXT_PUBLIC_LOG_LEVEL" "info"

# Beta Features
Set-VercelEnv "NEXT_PUBLIC_BETA_FEATURES" "true"
Set-VercelEnv "NEXT_PUBLIC_FEEDBACK_ENABLED" "true"

# Environment
Set-VercelEnv "NODE_ENV" "production"

# API Keys
Set-VercelEnv "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN" "pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ"
Set-VercelEnv "NEXT_PUBLIC_FOURSQUARE_API_KEY" "fsq3Ciis2M5OLrAUQqL2V5z+bsUMKpCCdQe1ULDMN23ISSo="

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Build and deploy
Write-Host "🏗️ Building and deploying to Vercel..." -ForegroundColor Blue

# Deploy to production
vercel --prod --yes

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "📱 Your app should be available at: https://beta.bitebase.app" -ForegroundColor Cyan
Write-Host "🔗 Backend API: https://bitebase-backend-prod.bitebase.workers.dev" -ForegroundColor Cyan

# Test the deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://beta.bitebase.app" -Method Head -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Deployment test passed (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Deployment test warning (Status: $($response.StatusCode))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Could not test deployment: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "🔍 Check your deployment at: https://vercel.com/dashboard" -ForegroundColor Cyan
