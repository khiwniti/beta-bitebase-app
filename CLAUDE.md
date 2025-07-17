# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Environment Setup
```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.development

# Load nvm and use Node.js v20+ (required for Wrangler)
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### Development Server
```bash
# Start development server (Express backend on port 56222)
npm run dev

# Start enhanced development server (port 12001)
npm run dev-enhanced

# Start Bedrock AI gateway
npm run start-bedrock
```

### Production & Deployment
```bash
# Build for production
npm run build

# Build for Cloudflare Workers
npm run build:cloudflare

# Deploy to Cloudflare Workers
npm run deploy:cloudflare

# Deploy to staging
npm run deploy:staging

# Start production server
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# CI test run
npm run test:ci
```

### Maintenance
```bash
# Lint and validate code
npm run lint

# Clean build artifacts
npm run clean
```

### Cloudflare Wrangler (Node.js v20+ required)
```bash
# Check wrangler status
npx wrangler --version

# Login to Cloudflare
npx wrangler login

# Create resources
npx wrangler kv namespace list
npx wrangler d1 list
npx wrangler r2 bucket list

# Set secrets
npx wrangler secret put GOOGLE_PLACES_API_KEY
npx wrangler secret put JWT_SECRET
npx wrangler secret put CORS_ORIGIN
```

## Architecture Overview

### Hybrid Full-Stack Application
This is a complex hybrid application combining:
- **Next.js 15 Frontend** (app directory structure)
- **Express.js Backend** (REST API server)
- **Cloudflare Workers** (edge deployment target)

### Backend Architecture (Express.js)

#### Main Server (`index.js`)
- **Port**: 56222 (development/production)
- **Database**: PostgreSQL with connection pooling (fallback to mock mode)
- **AI Integration**: AWS Bedrock with Claude models
- **Security**: Enterprise-grade with rate limiting, CORS, security headers
- **Payment**: Stripe integration

#### Route Structure
The main server orchestrates modular routes:

**Authentication Routes** (`/api/auth`)
- JWT-based authentication with mock fallback
- Rate limited for security

**Restaurant Routes** (`/api/restaurants`) 
- Multi-source restaurant data (Foursquare, Wongnai, Google Places)
- Real-time search with geospatial filtering
- Analytics and performance metrics

**AI Routes** (`/api/ai`)
- Chat interface with context-aware responses
- Market analysis and predictive analytics
- Integration with real restaurant data

**Location Intelligence** (`/api/location`)
- Real-time location tracking and streaming
- Geospatial analysis and recommendations

**Admin Routes** (`/api/admin`)
- Dashboard and analytics
- Content management (blog, SEO)
- User management

**Analytics Routes** (`/api/analytics`)
- Performance tracking and monitoring
- Business intelligence dashboards

**Payment Routes** (`/api/payments`)
- Stripe payment intent creation
- Webhook handling

#### Key Services

**Bedrock AI Service** (`bedrock-ai.js`)
- Multi-model AI integration (Claude 3.5 Sonnet, Haiku)
- Context-aware restaurant analytics
- Multilingual support

**API Client** (`lib/api-client.ts`)
- Centralized API client with comprehensive endpoint definitions
- Type-safe request/response handling

### Frontend Architecture (Next.js 15)

#### App Router Structure
- **Hybrid rendering**: Server and client components
- **Internationalization**: next-intl with English/Thai support
- **Authentication**: Firebase Auth + custom JWT backend integration
- **State Management**: React Context + custom hooks

#### Key Components

**Dashboard Components** (`components/dashboard/`)
- Business intelligence hub
- Real-time metrics and analytics
- Market research and competitive analysis

**AI Components** (`components/ai/`)
- Unified AI chat interface
- Marketing research visualizations
- Floating chatbot widget

**Mapping Components** (`components/map/`)
- Interactive restaurant maps (Mapbox integration)
- Geospatial analysis overlays
- Real-time location tracking

**Authentication** (`components/auth/`)
- Google OAuth integration
- Protected route management
- User session handling

#### Data Flow
```
Frontend (Next.js) → API Proxy (next.config.js) → Express Backend → External APIs
                                                                  → Database
                                                                  → AI Services
```

### Deployment Targets

#### Vercel (Primary)
- Next.js frontend on Vercel
- Express backend on Vercel Functions
- Environment variables configured in Vercel dashboard

#### Cloudflare Workers (Secondary)
- Workers deployment via Wrangler
- KV storage for caching
- D1 database for data persistence
- R2 bucket for file storage

### Database Schema
PostgreSQL with these key entities:
- `restaurants` - Restaurant master data
- `restaurant_metrics` - Performance analytics
- `users` - User accounts and profiles
- `user_locations` - Location tracking data

### External Integrations

**AI & ML**
- AWS Bedrock (Claude models)
- Custom AI gateway for enhanced features

**Mapping & Location**
- Mapbox (primary mapping)
- Google Maps (fallback)
- Real-time geospatial processing

**Restaurant Data**
- Foursquare API (global restaurant data)
- Wongnai API (Thai restaurant data)
- Google Places API (local business data)

**Payments**
- Stripe (payment processing)
- Multiple currency support

### Environment Configuration

#### Required Environment Variables
```env
NODE_ENV=development
PORT=56222
DATABASE_URL=postgresql://localhost:5432/bitebase
MAPBOX_API_KEY=pk.your_token_here
GOOGLE_PLACES_API_KEY=your_key_here
FOURSQUARE_API_KEY=your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:12000
```

#### Cloudflare Specific
```env
CLOUDFLARE_ACCOUNT_ID=5adf62efd6cf179a8939c211b155e229
```

### Testing Strategy

#### Jest Configuration
- **Environment**: Node.js
- **Test Location**: `tests/` directory
- **Coverage**: Routes, middleware, services
- **Timeout**: 10 seconds for integration tests

#### Test Types
- **Unit Tests**: Individual component/service testing
- **Integration Tests**: End-to-end API testing
- **Performance Tests**: Load testing and benchmarking

### Development Workflow

#### Local Development
1. Ensure Node.js v20+ is installed (required for Wrangler)
2. Copy `.env.example` to `.env.development`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Access backend: `http://localhost:56222`
6. Access frontend: `http://localhost:12000` (if running separately)

#### Code Organization
- **Backend**: Express routes, middleware, services in root directory
- **Frontend**: Next.js app in `app/` directory
- **Shared**: Components, utilities, types in `components/`, `lib/`
- **Configuration**: Environment files, build configs in root

### Important Notes

#### Missing Route Files
The main server references route modules in `./routes/` directory that don't exist yet. When creating these files, ensure they export Express router instances matching the expected API endpoints documented in the main server file.

#### Security Considerations
- All routes have enterprise-grade rate limiting
- CORS configured for multiple environments
- Security headers applied automatically
- JWT authentication required for protected endpoints

#### Performance Monitoring
- Request/response logging enabled
- Performance tracking middleware active
- Database connection pooling optimized for production

#### AI Integration
- Context-aware responses using real restaurant data
- Multi-model support (chat, reasoning, fast responses)
- Automatic language detection and multilingual support