#!/bin/bash

# BiteBase Production Cleanup Script
# This script removes demo data and prepares the application for production

echo "🚀 Starting BiteBase Production Cleanup..."

# Remove demo user files
echo "📝 Removing demo user documentation..."
rm -f DEMO_USERS.md

# Remove demo login pages
echo "🔐 Removing demo authentication pages..."
rm -rf apps/frontend/app/demo-login
rm -rf apps/frontend/app/demo-portal

# Remove demo API endpoints
echo "🔌 Removing demo API endpoints..."
rm -rf apps/frontend/app/api/test-backend

# Remove demo pages
echo "📄 Removing demo pages..."
rm -f apps/frontend/pages/marketing-research-demo.tsx

# Remove test files
echo "🧪 Removing test files..."
rm -f apps/backend/integration-test.html
rm -f apps/backend/test-page.html
rm -f test-system-integration.sh
rm -f test-cloudflare-integration.js

# Remove mock servers and test adapters
echo "🎭 Removing mock servers..."
rm -f apps/backend/agent-adapter/start-with-mock.js
rm -f apps/backend/agent-adapter/test-adapter.js
rm -f apps/backend/agent-adapter/mock-server.js

# Remove test data pipeline files
echo "📊 Cleaning test data..."
rm -rf data-pipeline/datalake/raw/test
rm -f data-pipeline/test_pipeline.py
rm -f data-pipeline/logs/test.log

# Remove agent test files
echo "🤖 Removing agent test files..."
rm -f apps/backend/agent/examples/test_api_aiq_integration.py
rm -f apps/backend/agent/examples/run_aiq_tests.py
rm -f apps/backend/agent/examples/test_aiq_integration.py

# Remove test scripts
echo "📜 Removing test scripts..."
rm -f scripts/test-enhanced-features.js

# Clean up log files (keep structure but remove content)
echo "📋 Cleaning log files..."
find . -name "*.log" -type f -exec truncate -s 0 {} \;

# Remove development environment files
echo "🔧 Cleaning development files..."
rm -f .env.local
rm -f .env.development

# Create production environment template
echo "🌟 Creating production environment template..."
cat > .env.production.template << 'EOF'
# BiteBase Production Environment Variables
# Copy this file to .env.production and fill in your values

# Database
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://host:port

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-domain.com

# External APIs
OPENROUTER_API_KEY=your-openrouter-api-key
MAPBOX_ACCESS_TOKEN=your-mapbox-token
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_AI_FEATURES=true
ENABLE_PAYMENTS=true
EOF

# Update package.json to remove dev dependencies
echo "📦 Updating package.json for production..."
cd apps/frontend
npm prune --production
cd ../..

# Create production deployment checklist
echo "✅ Creating production deployment checklist..."
cat > PRODUCTION_CHECKLIST.md << 'EOF'
# BiteBase Production Deployment Checklist

## Pre-Deployment
- [ ] Environment variables configured in .env.production
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] CDN configured for static assets
- [ ] Monitoring and logging configured

## Security
- [ ] JWT secrets are secure and unique
- [ ] Database credentials are secure
- [ ] API keys are production keys (not test/dev)
- [ ] CORS origins configured for production domain
- [ ] Rate limiting configured
- [ ] Security headers configured

## Performance
- [ ] Images optimized and compressed
- [ ] Bundle size analyzed and optimized
- [ ] Caching strategies implemented
- [ ] Database indexes optimized
- [ ] CDN configured for static assets

## Monitoring
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring configured
- [ ] Uptime monitoring configured
- [ ] Log aggregation configured
- [ ] Backup strategy implemented

## Testing
- [ ] All tests passing
- [ ] Load testing completed
- [ ] Security testing completed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

## Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup verification
- [ ] Performance baseline established
- [ ] Documentation updated
EOF

# Create production README
echo "📖 Creating production README..."
cat > README.production.md << 'EOF'
# BiteBase Intelligence - Production Deployment

## Overview
BiteBase Intelligence is a comprehensive restaurant analytics platform that provides AI-powered insights, market analysis, and operational optimization tools for restaurant owners, franchisees, and food service professionals.

## Features
- Real-time restaurant analytics
- AI-powered market analysis
- Location intelligence
- Competitor benchmarking
- Financial performance tracking
- Menu optimization tools
- Multi-location management
- SEO-optimized blog management
- Admin dashboard with AI content generation

## Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL, Redis
- **AI/ML:** OpenRouter API integration
- **Maps:** Mapbox, Google Maps
- **Payments:** Stripe
- **Deployment:** Vercel (Frontend), Railway/Render (Backend)

## Environment Setup
1. Copy `.env.production.template` to `.env.production`
2. Fill in all required environment variables
3. Run database migrations
4. Deploy to your hosting platform

## Deployment Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npm run db:migrate

# Seed production data (if needed)
npm run db:seed
```

## Support
For technical support or questions, contact: support@bitebase.com
EOF

echo "✨ Production cleanup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Review and configure .env.production.template"
echo "2. Complete items in PRODUCTION_CHECKLIST.md"
echo "3. Test the application thoroughly"
echo "4. Deploy to your production environment"
echo ""
echo "🎉 Your BiteBase application is ready for production!"