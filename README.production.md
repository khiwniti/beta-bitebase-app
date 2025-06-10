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
