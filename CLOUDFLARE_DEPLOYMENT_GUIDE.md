# ☁️ BiteBase Cloudflare Workers + Vercel Deployment Guide

This guide will help you deploy the BiteBase backend to Cloudflare Workers and frontend to Vercel for optimal performance and cost efficiency.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BiteBase Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │   Frontend      │         │    Backend      │           │
│  │   (Vercel)      │◄────────┤ (Cloudflare)    │           │
│  │                 │         │                 │           │
│  │ • Next.js       │         │ • Hono API      │           │
│  │ • React UI      │         │ • D1 Database   │           │
│  │ • Maps/Charts   │         │ • KV Storage    │           │
│  │ • AI Chat       │         │ • R2 Files      │           │
│  └─────────────────┘         └─────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Cloudflare Services                          │
├─────────────────────────────────────────────────────────────┤
│ • D1 Database (SQLite)                                     │
│ • KV Storage (Cache & Sessions)                            │
│ • R2 Storage (File Uploads)                                │
│ • Durable Objects (Real-time Chat)                         │
│ • Analytics Engine (Logging)                               │
│ • Workers AI (Optional AI Features)                        │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

### 1. Required Accounts
- **Cloudflare Account**: For Workers and services
- **Vercel Account**: For frontend hosting
- **Stripe Account**: For payments (optional)
- **OpenAI Account**: For AI features (optional)

### 2. Install Required CLIs
```bash
# Install Wrangler CLI (Cloudflare)
npm install -g wrangler

# Install Vercel CLI
npm install -g vercel

# Login to both services
wrangler login
vercel login
```

### 3. Domain Setup (Optional)
- Domain registered with Cloudflare DNS
- SSL certificates (automatic with Cloudflare)

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

```bash
# Setup Cloudflare resources first
./deploy-cloudflare.sh --setup-resources

# Deploy both services to production
./deploy-cloudflare.sh --production

# Or deploy individually
./deploy-cloudflare.sh --backend-only --production
./deploy-cloudflare.sh --frontend-only --production
```

### Option 2: Manual Step-by-Step Deployment

Follow the detailed steps below for manual deployment.

## 🔧 Cloudflare Workers Backend Setup

### 1. Configure wrangler.toml

The `wrangler.toml` file is already configured. Update the resource IDs after creating them:

```toml
# apps/backend/wrangler.toml
name = "bitebase-backend"
main = "cloudflare-worker-enhanced.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "bitebase-backend-prod"

[env.staging]
name = "bitebase-backend-staging"
```

### 2. Create Cloudflare Resources

#### D1 Database
```bash
cd apps/backend

# Create D1 database
wrangler d1 create bitebase-production

# Note the database ID and update wrangler.toml
# [[d1_databases]]
# binding = "DB"
# database_name = "bitebase-production"
# database_id = "your-actual-database-id"
```

#### KV Namespaces
```bash
# Create KV namespaces for caching and sessions
wrangler kv:namespace create CACHE
wrangler kv:namespace create SESSIONS

# Note the namespace IDs and update wrangler.toml
# [[kv_namespaces]]
# binding = "CACHE"
# id = "your-cache-namespace-id"
```

#### R2 Storage
```bash
# Create R2 bucket for file uploads
wrangler r2 bucket create bitebase-uploads

# Update wrangler.toml with bucket name
# [[r2_buckets]]
# binding = "STORAGE"
# bucket_name = "bitebase-uploads"
```

### 3. Database Migration

```bash
# Run database migrations
wrangler d1 execute bitebase-production --file=database/schema.sql

# For local development
wrangler d1 execute bitebase-production --local --file=database/schema.sql
```

### 4. Set Environment Secrets

```bash
# Set required secrets
wrangler secret put JWT_SECRET
# Enter: your-super-secret-jwt-key-min-32-chars

wrangler secret put OPENAI_API_KEY
# Enter: sk-your-openai-api-key

wrangler secret put STRIPE_SECRET_KEY
# Enter: sk_live_or_sk_test_your-stripe-secret

wrangler secret put GOOGLE_CLIENT_ID
# Enter: your-google-oauth-client-id

# List all secrets
wrangler secret list
```

### 5. Deploy Backend

```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production

# Check deployment
curl https://bitebase-backend-prod.your-subdomain.workers.dev/health
```

## 🌐 Vercel Frontend Setup

### 1. Configure Environment Variables

Update `apps/frontend/.env.local`:

```env
# API Endpoints - Update with your Cloudflare Worker URL
NEXT_PUBLIC_API_URL=https://bitebase-backend-prod.your-subdomain.workers.dev
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_your-stripe-key

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 2. Deploy Frontend

```bash
cd apps/frontend

# Install dependencies
npm install

# Build and test locally
npm run build
npm run dev

# Deploy to Vercel
vercel --prod
```

### 3. Configure Vercel Environment Variables

In the Vercel dashboard, add all `NEXT_PUBLIC_*` variables from your `.env.local` file.

## 🔗 Custom Domain Configuration

### 1. Backend Domain (Cloudflare)

```bash
# Add custom domain to worker
wrangler route add "api.yourdomain.com/*" bitebase-backend-prod

# Or configure in wrangler.toml
[env.production.route]
pattern = "api.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### 2. Frontend Domain (Vercel)

1. Go to Vercel project → Settings → Domains
2. Add `yourdomain.com` and `www.yourdomain.com`
3. Configure DNS records as instructed

### 3. Update Environment Variables

After setting up custom domains:

```env
# Frontend .env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🗄️ Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  preferences TEXT, -- JSON
  created_at TEXT NOT NULL,
  updated_at TEXT
);

-- Restaurants table
CREATE TABLE restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT,
  rating REAL,
  price_range TEXT,
  latitude REAL,
  longitude REAL,
  address TEXT,
  phone TEXT,
  website TEXT,
  features TEXT, -- JSON array
  hours TEXT, -- JSON object
  created_at TEXT NOT NULL
);

-- Reviews table
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  restaurant_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);

-- Sessions table (for KV fallback)
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  data TEXT, -- JSON
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔐 Security Configuration

### 1. CORS Setup

The worker is configured with secure CORS:

```javascript
app.use('*', cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://beta.yourdomain.com',
    'http://localhost:3000'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
```

### 2. Rate Limiting

```javascript
app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}))
```

### 3. JWT Authentication

```javascript
const jwtMiddleware = jwt({
  secret: (c) => c.env.JWT_SECRET
})

app.use('/api/protected/*', jwtMiddleware)
```

## 📊 Monitoring & Analytics

### 1. Cloudflare Analytics

```javascript
// Log events to Analytics Engine
app.post('/api/analytics/event', async (c) => {
  const event = await c.req.json()
  
  c.env.ANALYTICS.writeDataPoint({
    blobs: [event.type, event.category],
    doubles: [event.value || 1],
    indexes: [event.userId || 'anonymous']
  })
  
  return c.json({ logged: true })
})
```

### 2. Real-time Logs

```bash
# View real-time logs
wrangler tail

# Pretty formatted logs
wrangler tail --format pretty

# Filter logs
wrangler tail --grep "ERROR"
```

### 3. Performance Monitoring

- **Cloudflare Dashboard**: Worker analytics and performance
- **Vercel Analytics**: Frontend performance and user metrics
- **D1 Analytics**: Database query performance

## 🧪 Testing & Development

### 1. Local Development

```bash
# Backend (Cloudflare Workers)
cd apps/backend
wrangler dev --local

# Frontend (Next.js)
cd apps/frontend
npm run dev
```

### 2. Testing Endpoints

```bash
# Health check
curl https://your-worker.workers.dev/health

# Authentication
curl -X POST https://your-worker.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Protected endpoint
curl https://your-worker.workers.dev/api/users/profile \
  -H "Authorization: Bearer your-jwt-token"
```

### 3. Database Testing

```bash
# Query database directly
wrangler d1 execute bitebase-production --command="SELECT * FROM users LIMIT 5"

# Local database testing
wrangler d1 execute bitebase-production --local --command="SELECT COUNT(*) FROM users"
```

## 🚀 Performance Optimization

### 1. Cloudflare Workers Optimization

```javascript
// Use KV for caching
const cached = await c.env.CACHE.get(`restaurants:${latitude}:${longitude}`)
if (cached) {
  return c.json(JSON.parse(cached))
}

// Cache the result
await c.env.CACHE.put(
  `restaurants:${latitude}:${longitude}`,
  JSON.stringify(restaurants),
  { expirationTtl: 300 } // 5 minutes
)
```

### 2. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Frontend Optimization

```javascript
// Use SWR for data fetching
import useSWR from 'swr'

const { data, error } = useSWR(
  `/api/restaurants?lat=${lat}&lng=${lng}`,
  fetcher,
  { revalidateOnFocus: false }
)
```

## 💰 Cost Optimization

### Cloudflare Workers Pricing

- **Free Tier**: 100,000 requests/day
- **Paid Plan**: $5/month for 10M requests
- **D1**: 25M row reads/month free
- **KV**: 10M reads/month free
- **R2**: 10GB storage free

### Vercel Pricing

- **Hobby**: Free for personal projects
- **Pro**: $20/month for commercial use
- **Enterprise**: Custom pricing

### Cost-Saving Tips

1. **Use KV for caching** to reduce D1 queries
2. **Implement request deduplication**
3. **Use R2 for large file storage** instead of external services
4. **Optimize bundle sizes** for faster cold starts

## 🔧 Troubleshooting

### Common Issues

#### 1. Worker Deployment Fails
```bash
# Check wrangler.toml syntax
wrangler validate

# Check for missing dependencies
npm install

# Deploy with verbose logging
wrangler deploy --verbose
```

#### 2. Database Connection Issues
```bash
# Verify database exists
wrangler d1 list

# Check database schema
wrangler d1 execute bitebase-production --command="SELECT name FROM sqlite_master WHERE type='table'"

# Test database connection
wrangler d1 execute bitebase-production --command="SELECT 1"
```

#### 3. CORS Errors
- Verify allowed origins in worker code
- Check if frontend URL is correctly configured
- Ensure preflight requests are handled

#### 4. Authentication Issues
- Verify JWT secret is set correctly
- Check token expiration
- Validate token format

### Debug Commands

```bash
# View worker logs
wrangler tail --format pretty

# Check environment variables
wrangler secret list

# Test worker locally
wrangler dev --local

# Validate configuration
wrangler validate
```

## 📈 Scaling Considerations

### 1. Database Scaling

- **D1 Limitations**: Single-region, eventual consistency
- **Scaling Strategy**: Use KV for frequently accessed data
- **Backup Strategy**: Regular exports to R2

### 2. Worker Scaling

- **Automatic Scaling**: Workers scale automatically
- **Cold Start Optimization**: Keep bundle size small
- **Regional Deployment**: Use multiple regions for global apps

### 3. Frontend Scaling

- **Vercel Edge Functions**: For dynamic content
- **CDN Optimization**: Automatic with Vercel
- **Image Optimization**: Use Next.js Image component

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare and Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        working-directory: apps/backend
      
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: apps/backend
          command: deploy --env production

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/frontend
```

## 📞 Support & Resources

### Documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Community
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Vercel Discord](https://discord.gg/vercel)
- [Hono Discord](https://discord.gg/hono)

### Monitoring
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Sentry](https://sentry.io/) for error tracking

---

## 🎉 Deployment Complete!

Your BiteBase application is now deployed with:

✅ **Backend**: Cloudflare Workers with D1, KV, and R2  
✅ **Frontend**: Vercel with Next.js and global CDN  
✅ **Database**: D1 SQLite with automatic backups  
✅ **Storage**: R2 for file uploads  
✅ **Caching**: KV for session and data caching  
✅ **Security**: JWT auth, CORS, and rate limiting  
✅ **Monitoring**: Real-time logs and analytics  

**Production URLs:**
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com`

**Next Steps:**
1. Configure custom domains
2. Set up monitoring and alerts
3. Implement backup strategies
4. Plan for scaling

Happy deploying! ☁️🚀