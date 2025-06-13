#!/bin/bash

# Configure Environment Variables for BiteBase
# This script helps you set up all required environment variables

set -e

echo "🔧 Configuring BiteBase Environment Variables..."

# Navigate to project directory
cd /opt/bitebase

# Create comprehensive environment file
echo "📝 Creating comprehensive .env file..."

cat > .env << 'EOF'
# =============================================================================
# BiteBase Environment Configuration
# =============================================================================

# Database Configuration
DATABASE_URL="postgresql://bitebase:secure_password_123@postgres:5432/bitebase"
POSTGRES_USER=bitebase
POSTGRES_PASSWORD=secure_password_123
POSTGRES_DB=bitebase

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_long_and_secure
JWT_EXPIRES_IN=7d

# API Configuration
API_PORT=8000
FRONTEND_PORT=3000
NODE_ENV=production

# =============================================================================
# Authentication Services (Choose one or configure multiple)
# =============================================================================

# Clerk Authentication (Recommended)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Auth0 Authentication (Alternative)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# =============================================================================
# External API Keys
# =============================================================================

# OpenAI API (for AI features)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Google Maps API (for location features)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Slack Integration (optional)
SLACK_BOT_TOKEN=xoxb-your_slack_bot_token_here

# =============================================================================
# AWS Configuration (for file uploads, etc.)
# =============================================================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_s3_bucket_name

# =============================================================================
# Payment Processing (optional)
# =============================================================================
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# =============================================================================
# Domain and URL Configuration
# =============================================================================
DOMAIN=localhost
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# =============================================================================
# Email Configuration (optional)
# =============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# =============================================================================
# Redis Configuration (for caching, optional)
# =============================================================================
REDIS_URL=redis://redis:6379

# =============================================================================
# Monitoring and Analytics (optional)
# =============================================================================
SENTRY_DSN=your_sentry_dsn_here
GOOGLE_ANALYTICS_ID=GA-your_analytics_id

EOF

echo "✅ Environment file created at /opt/bitebase/.env"
echo ""
echo "🔧 Next Steps:"
echo ""
echo "1. Edit the environment file with your actual API keys:"
echo "   nano /opt/bitebase/.env"
echo ""
echo "2. At minimum, configure these for basic functionality:"
echo "   • JWT_SECRET (make it long and secure)"
echo "   • NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY"
echo "   • OPENAI_API_KEY (for AI features)"
echo "   • GOOGLE_MAPS_API_KEY (for location features)"
echo ""
echo "3. Restart the application after editing:"
echo "   docker-compose down"
echo "   docker-compose up -d"
echo ""
echo "4. Check the logs:"
echo "   docker-compose logs -f"
echo ""
echo "📋 Quick Setup Guide:"
echo ""
echo "For Clerk Authentication:"
echo "  1. Go to https://clerk.com"
echo "  2. Create a free account"
echo "  3. Create a new application"
echo "  4. Copy the publishable key and secret key"
echo ""
echo "For OpenAI API:"
echo "  1. Go to https://platform.openai.com"
echo "  2. Create an account and add billing"
echo "  3. Generate an API key"
echo ""
echo "For Google Maps API:"
echo "  1. Go to https://console.cloud.google.com"
echo "  2. Enable Maps JavaScript API"
echo "  3. Create credentials (API key)"
echo ""
echo "💡 Pro tip: You can start with just Clerk auth and add other services later!"