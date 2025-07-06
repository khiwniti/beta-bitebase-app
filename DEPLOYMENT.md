# BiteBase Frontend Deployment Guide

This guide explains how to properly deploy the BiteBase frontend to Vercel with correct environment variable configuration.

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)
```bash
# Run the automated deployment script
npm run deploy:full
```

### Option 2: Manual Deployment
```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔧 Environment Variables Configuration

### Required Environment Variables

The following environment variables must be set in Vercel for proper functionality:

#### Core API Configuration
- `NEXT_PUBLIC_API_URL`: `https://bitebase-backend-prod.bitebase.workers.dev`
- `NEXT_PUBLIC_BACKEND_URL`: `https://bitebase-backend-prod.bitebase.workers.dev`
- `NEXT_PUBLIC_APP_URL`: `https://beta.bitebase.app`

#### Authentication
- `NEXT_PUBLIC_AUTH_ENABLED`: `true`
- `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED`: `true`
- `NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED`: `true`

#### Feature Flags
- `NEXT_PUBLIC_ENABLE_MAPS`: `true`
- `NEXT_PUBLIC_ENABLE_AI_CHAT`: `true`
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: `true`
- `NEXT_PUBLIC_ENABLE_REAL_DATA`: `true`

#### API Keys
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Your Mapbox token
- `NEXT_PUBLIC_FOURSQUARE_API_KEY`: Your Foursquare API key

#### Debug & Development
- `NEXT_PUBLIC_DEBUG_MODE`: `false`
- `NEXT_PUBLIC_LOG_LEVEL`: `info`
- `NODE_ENV`: `production`

## 📋 Manual Environment Setup

If you need to set environment variables manually in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the values listed above

## 🔍 Vercel Configuration

The `vercel.json` file includes:

### Environment Variables
- All required environment variables are pre-configured
- Build-time environment variables for optimization

### Headers
- Security headers (HSTS, XSS Protection, etc.)
- CORS headers for API routes
- Proper manifest.json headers

### Routing
- API proxy routes to backend
- Cache control for authentication pages
- Clean URLs and trailing slash handling

### Functions
- 30-second timeout for API functions
- Optimized for serverless deployment

## 🧪 Testing Deployment

After deployment, test the following:

1. **Frontend Access**: Visit `https://beta.bitebase.app`
2. **API Connectivity**: Check browser console for CORS errors
3. **Authentication**: Test login/register functionality
4. **Maps**: Verify map loading and functionality
5. **AI Chat**: Test AI chat feature

## 🐛 Troubleshooting

### CORS Issues
If you see CORS errors:
1. Check that `NEXT_PUBLIC_API_URL` is correctly set
2. Verify backend CORS configuration allows your domain
3. Clear browser cache and try again

### Environment Variables Not Loading
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding new variables

### Build Failures
1. Check for TypeScript errors: `npm run check-types`
2. Verify all dependencies are installed
3. Check build logs in Vercel dashboard

## 📁 File Structure

```
beta-bitebase-app/
├── vercel.json              # Vercel configuration
├── .env.vercel             # Environment variables template
├── deploy-vercel.ps1       # PowerShell deployment script
├── deploy-vercel.sh        # Bash deployment script
├── DEPLOYMENT.md           # This file
└── package.json            # Updated with deployment scripts
```

## 🔄 Continuous Deployment

The project is configured for automatic deployment:
- Push to main branch triggers production deployment
- Pull requests create preview deployments
- Environment variables are automatically applied

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test backend API endpoints directly
4. Check browser console for errors

## 🎯 Production Checklist

Before deploying to production:
- [ ] All environment variables configured
- [ ] Backend API is accessible
- [ ] Authentication endpoints tested
- [ ] Maps functionality verified
- [ ] AI chat feature working
- [ ] No console errors
- [ ] Performance optimized
- [ ] Security headers configured
