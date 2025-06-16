# BiteBase Beta Deployment Guide

## 🚀 Production Deployment to beta.bitebase.app

### Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Access to BiteBase Vercel project
- Environment variables configured

### Quick Deployment
```bash
# Build and deploy to production
npm run build
npm run deploy:beta

# Or deploy directly with Vercel
vercel --prod
```

### Environment Configuration

#### Production Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.bitebase.app
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ
NEXT_PUBLIC_ENABLE_MAPS=true
NEXT_PUBLIC_ENABLE_REAL_DATA=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NODE_ENV=production
```

### Domain Configuration
- **Production**: https://beta.bitebase.app
- **API Backend**: https://api.bitebase.app
- **Regions**: Singapore, Hong Kong, Mumbai (Asia-Pacific optimized)

### Deployment Steps

1. **Prepare for deployment:**
   ```bash
   # Check build
   npm run build
   
   # Check types
   npm run check-types
   
   # Run linting
   npm run lint
   ```

2. **Deploy to Vercel:**
   ```bash
   # Login to Vercel (if not already)
   vercel login
   
   # Deploy to production
   vercel --prod
   ```

3. **Verify deployment:**
   - Check https://beta.bitebase.app
   - Test API connectivity
   - Verify map functionality
   - Test location features

### Features Deployed
- ✅ Real restaurant data (Foursquare API)
- ✅ Location-based search and tracking
- ✅ Dish-based pricing strategy
- ✅ Enhanced map components
- ✅ AI-powered insights
- ✅ Production-ready error handling

### Troubleshooting

#### If old dashboard is still showing:
1. Clear Vercel cache: `vercel --prod --force`
2. Check domain configuration in Vercel dashboard
3. Verify environment variables are set correctly
4. Check build logs for errors

#### Common Issues:
- **API Connection**: Verify NEXT_PUBLIC_API_URL is set to https://api.bitebase.app
- **Map Loading**: Check MAPBOX_ACCESS_TOKEN is configured
- **Location Features**: Ensure HTTPS is enabled for geolocation

### Monitoring
- **Vercel Analytics**: Enabled for performance monitoring
- **Error Tracking**: Console logs for debugging
- **API Health**: Automatic health checks to backend

### Support
For deployment issues, check:
1. Vercel deployment logs
2. Browser console for errors
3. API backend status at https://api.bitebase.app/health
