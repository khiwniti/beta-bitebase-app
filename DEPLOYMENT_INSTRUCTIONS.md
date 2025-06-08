# 🚀 BiteBase Deployment Instructions

This guide will help you deploy the BiteBase application with:
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Render

## 📋 Prerequisites

### Required Accounts
1. **Vercel Account**: [vercel.com](https://vercel.com) - for frontend hosting
2. **Render Account**: [render.com](https://render.com) - for backend hosting
3. **GitHub Account**: Connected to both Vercel and Render
4. **Database**: PostgreSQL (Neon, Supabase, or PlanetScale)
5. **Redis**: Upstash or Redis Cloud (optional but recommended)

### Required API Keys
- Google OAuth Client ID
- Stripe API Keys (if using payments)
- OpenAI API Key (for AI features)
- Google Maps API Key
- Any other third-party service keys

## 🎯 Deployment Strategy

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (Vercel)      │◄──►│   (Render)      │
│   Next.js       │    │   Express.js    │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Static CDN    │    │   PostgreSQL    │
│   (Vercel)      │    │   (Neon/Other)  │
└─────────────────┘    └─────────────────┘
```

## 🔧 Step 1: Prepare Environment Variables

### Backend Environment Variables (for Render)
Create these in your Render dashboard:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GOOGLE_CLIENT_ID=your-google-oauth-client-id
STRIPE_SECRET_KEY=sk_live_or_sk_test_your-stripe-secret
DATABASE_URL=postgresql://user:pass@host:port/dbname
REDIS_URL=redis://user:pass@host:port
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app,https://beta.bitebase.app
```

### Frontend Environment Variables (for Vercel)
Create these in your Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_your-stripe-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
```

## 🚀 Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `khiwniti/beta-bitebase-app`

2. **Configure Service**:
   - **Name**: `bitebase-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm ci`
   - **Start Command**: `npm run express:start`

3. **Environment Variables**:
   - Add all the backend environment variables listed above
   - Use the Render dashboard to add them securely

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-service-name.onrender.com`

### Option B: Using render.yaml (Alternative)

The repository already includes a `render.yaml` file. You can:

1. Fork the repository to your GitHub account
2. Connect it to Render
3. Render will automatically detect the `render.yaml` and deploy all services

## 🌐 Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `khiwniti/beta-bitebase-app`

2. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - Add all the frontend environment variables listed above
   - Make sure to update `NEXT_PUBLIC_API_URL` with your Render backend URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL: `https://your-project.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd apps/frontend
vercel --prod

# Deploy backend (if you prefer Vercel for backend too)
cd ../backend
vercel --prod
```

## 🔗 Step 4: Update Cross-References

After both deployments are complete:

1. **Update Frontend Environment**:
   - In Vercel dashboard, update `NEXT_PUBLIC_API_URL` with your Render backend URL
   - Redeploy frontend

2. **Update Backend CORS**:
   - In Render dashboard, update `CORS_ORIGIN` with your Vercel frontend URL
   - Redeploy backend

## 🗄️ Step 5: Database Setup

### Option A: Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string
4. Update `DATABASE_URL` in Render environment variables

### Option B: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Update `DATABASE_URL` in Render environment variables

### Option C: PlanetScale

1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Update `DATABASE_URL` in Render environment variables

## 🔴 Step 6: Redis Setup (Optional)

### Upstash (Recommended)

1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Get Redis URL
4. Update `REDIS_URL` in Render environment variables

## 🔐 Step 7: Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - Your Vercel frontend URL
   - Your Render backend URL
6. Update `GOOGLE_CLIENT_ID` in both environments

### Stripe (if using payments)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Update `STRIPE_SECRET_KEY` (backend) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (frontend)

## 🧪 Step 8: Testing

### Backend Health Check
```bash
curl https://your-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### Frontend Access
Visit your Vercel URL and verify:
- ✅ Page loads without errors
- ✅ API calls work (check browser console)
- ✅ Authentication flow works

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `CORS_ORIGIN` in backend includes your frontend URL
   - Check that URLs don't have trailing slashes

2. **Environment Variables Not Loading**:
   - Verify variables are set in the correct dashboard
   - Redeploy after adding new variables

3. **Database Connection Errors**:
   - Check connection string format
   - Ensure database allows connections from Render IPs

4. **Build Failures**:
   - Check build logs in respective dashboards
   - Ensure all dependencies are listed in package.json

## 📊 Monitoring

### Render Monitoring
- View logs in Render dashboard
- Set up health checks
- Monitor resource usage

### Vercel Monitoring
- View function logs in Vercel dashboard
- Enable Vercel Analytics
- Monitor build times and errors

## 🔄 CI/CD Setup (Optional)

### Automatic Deployments

Both Render and Vercel support automatic deployments:

1. **Render**: Automatically deploys on push to main branch
2. **Vercel**: Automatically deploys on push to main branch

### Branch Deployments

- **Vercel**: Creates preview deployments for pull requests
- **Render**: Can be configured for staging environments

## 📈 Scaling Considerations

### Render Scaling
- Start with Starter plan ($7/month)
- Upgrade to Standard for more resources
- Enable auto-scaling if needed

### Vercel Scaling
- Hobby plan for development
- Pro plan for production
- Enterprise for high-traffic applications

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enforced on both platforms
- [ ] CORS properly configured
- [ ] Database connections encrypted
- [ ] API keys rotated regularly
- [ ] Security headers configured

## 📞 Support Resources

### Documentation
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Community
- [Render Community](https://community.render.com)
- [Vercel Discord](https://discord.gg/vercel)

---

## 🎉 Deployment Complete!

Your BiteBase application should now be live:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-service.onrender.com`

### Next Steps:
1. ✅ Test all functionality
2. ✅ Set up monitoring
3. ✅ Configure custom domains (optional)
4. ✅ Set up analytics
5. ✅ Plan backup strategy

Happy deploying! 🚀