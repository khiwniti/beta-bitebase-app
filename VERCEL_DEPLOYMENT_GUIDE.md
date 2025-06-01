# 🚀 BiteBase Vercel Deployment Guide

This guide will help you deploy both the BiteBase backend and frontend to Vercel.

## 📋 Prerequisites

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Required Accounts & Services
- **Vercel Account**: For hosting
- **PostgreSQL Database**: Supabase, PlanetScale, or Neon
- **Redis Instance**: Upstash or Redis Cloud
- **Stripe Account**: For payments
- **Google Cloud Console**: For OAuth and Maps
- **Firebase Project**: For authentication (optional)

## 🏗️ Project Structure

```
beta-bitebase-app/
├── apps/
│   ├── backend/
│   │   ├── vercel.json          # Backend Vercel config
│   │   ├── .env.example         # Backend environment template
│   │   └── minimal-server.js    # Main backend entry point
│   └── frontend/
│       ├── vercel.json          # Frontend Vercel config
│       ├── .env.example         # Frontend environment template
│       └── package.json         # Next.js frontend
├── deploy-vercel.sh             # Deployment script
└── VERCEL_DEPLOYMENT_GUIDE.md   # This guide
```

## 🔧 Configuration Setup

### Backend Environment Variables

Create `.env.local` in `apps/backend/`:

```bash
# Copy the example file
cp apps/backend/.env.example apps/backend/.env.local

# Edit with your values
nano apps/backend/.env.local
```

**Required Variables:**
```env
# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname
REDIS_URL=redis://user:pass@host:port

# Payments
STRIPE_SECRET_KEY=sk_live_or_sk_test_your-stripe-secret

# External APIs
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Frontend Environment Variables

Create `.env.local` in `apps/frontend/`:

```bash
# Copy the example file
cp apps/frontend/.env.example apps/frontend/.env.local

# Edit with your values
nano apps/frontend/.env.local
```

**Required Variables:**
```env
# API Endpoints (will be updated after backend deployment)
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_your-stripe-key

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🚀 Deployment Process

### Option 1: Automated Deployment (Recommended)

Use the provided deployment script:

```bash
# Deploy both services to preview
./deploy-vercel.sh

# Deploy both services to production
./deploy-vercel.sh --production

# Deploy only backend
./deploy-vercel.sh --backend-only

# Deploy only frontend
./deploy-vercel.sh --frontend-only --production
```

### Option 2: Manual Deployment

#### Deploy Backend

```bash
cd apps/backend

# First deployment (creates project)
vercel

# Subsequent deployments
vercel --prod  # for production
# or
vercel         # for preview
```

#### Deploy Frontend

```bash
cd apps/frontend

# First deployment (creates project)
vercel

# Subsequent deployments
vercel --prod  # for production
# or
vercel         # for preview
```

## ⚙️ Vercel Dashboard Configuration

After deployment, configure environment variables in the Vercel dashboard:

### 1. Backend Project Settings

Go to your backend project in Vercel → Settings → Environment Variables

Add all variables from your `.env.local` file:

| Variable | Environment | Value |
|----------|-------------|-------|
| `JWT_SECRET` | Production, Preview | Your JWT secret |
| `GOOGLE_CLIENT_ID` | Production, Preview | Your Google OAuth client ID |
| `DATABASE_URL` | Production, Preview | Your PostgreSQL connection string |
| `REDIS_URL` | Production, Preview | Your Redis connection string |
| `STRIPE_SECRET_KEY` | Production, Preview | Your Stripe secret key |
| `OPENAI_API_KEY` | Production, Preview | Your OpenAI API key |
| `GOOGLE_MAPS_API_KEY` | Production, Preview | Your Google Maps API key |

### 2. Frontend Project Settings

Go to your frontend project in Vercel → Settings → Environment Variables

Add all `NEXT_PUBLIC_*` variables:

| Variable | Environment | Value |
|----------|-------------|-------|
| `NEXT_PUBLIC_API_URL` | Production, Preview | Your backend Vercel URL |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | Your frontend Vercel URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Production, Preview | Your Google OAuth client ID |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production, Preview | Your Stripe publishable key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Production, Preview | Your Google Maps API key |

## 🔗 Domain Configuration

### Custom Domains (Optional)

1. **Backend Domain**: `api.yourdomain.com`
   - Go to backend project → Settings → Domains
   - Add custom domain
   - Configure DNS records

2. **Frontend Domain**: `yourdomain.com` or `app.yourdomain.com`
   - Go to frontend project → Settings → Domains
   - Add custom domain
   - Configure DNS records

### Update Environment Variables

After setting up custom domains, update:

```env
# Frontend .env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Run database migrations:

```bash
# Connect to your database and run
psql "your-connection-string" -f database/schema.sql
```

### Option 2: PlanetScale

1. Create database at [planetscale.com](https://planetscale.com)
2. Get connection string
3. Import schema using their CLI or dashboard

### Option 3: Neon

1. Create database at [neon.tech](https://neon.tech)
2. Get connection string
3. Run migrations via their SQL editor

## 🔴 Redis Setup

### Option 1: Upstash (Recommended)

1. Create database at [upstash.com](https://upstash.com)
2. Get Redis URL from dashboard
3. Add to environment variables

### Option 2: Redis Cloud

1. Create database at [redis.com](https://redis.com)
2. Get connection details
3. Format as: `redis://user:pass@host:port`

## 🔐 Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `https://your-frontend.vercel.app`
   - `https://your-backend.vercel.app`

### Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Add webhook endpoints:
   - `https://your-backend.vercel.app/api/webhooks/stripe`

## 🧪 Testing Deployment

### 1. Backend Health Check

```bash
curl https://your-backend.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Frontend Access

Visit `https://your-frontend.vercel.app` and verify:
- ✅ Page loads without errors
- ✅ API calls work (check browser console)
- ✅ Authentication flow works
- ✅ Maps display correctly

### 3. Integration Test

Test the complete flow:
1. User registration/login
2. Restaurant search
3. AI assistant interaction
4. Payment processing (if enabled)

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
- **Problem**: Variables not available in runtime
- **Solution**: Ensure variables are set in Vercel dashboard, not just local files

#### 2. CORS Errors
- **Problem**: Frontend can't connect to backend
- **Solution**: Update `ALLOWED_ORIGINS` in backend environment

#### 3. Database Connection Errors
- **Problem**: Can't connect to database
- **Solution**: Check connection string format and firewall settings

#### 4. Build Failures
- **Problem**: Deployment fails during build
- **Solution**: Check build logs in Vercel dashboard

### Debug Commands

```bash
# Check Vercel project status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable in project settings:
1. Go to project → Analytics
2. Enable Web Analytics
3. Add to frontend code if needed

### Error Monitoring

Consider adding:
- **Sentry**: For error tracking
- **LogRocket**: For session replay
- **DataDog**: For comprehensive monitoring

## 🔄 CI/CD Setup

### GitHub Integration

1. Connect repository to Vercel
2. Enable automatic deployments
3. Configure branch protection rules

### Deployment Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Performance Optimization

### Backend Optimization

1. **Enable caching**: Use Redis for session storage
2. **Database indexing**: Optimize queries
3. **Rate limiting**: Prevent abuse
4. **Compression**: Enable gzip compression

### Frontend Optimization

1. **Image optimization**: Use Next.js Image component
2. **Code splitting**: Lazy load components
3. **Caching**: Configure proper cache headers
4. **Bundle analysis**: Use `@next/bundle-analyzer`

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] Security headers configured

## 📞 Support & Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Community
- [Vercel Discord](https://discord.gg/vercel)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

### Emergency Contacts
- **Vercel Support**: support@vercel.com
- **Database Issues**: Check your database provider's support
- **Payment Issues**: Stripe support

---

## 🎉 Deployment Complete!

Your BiteBase application is now deployed to Vercel! 

**Next Steps:**
1. ✅ Test all functionality
2. ✅ Configure monitoring
3. ✅ Set up custom domains
4. ✅ Enable analytics
5. ✅ Plan scaling strategy

**Production URLs:**
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`

Happy deploying! 🚀