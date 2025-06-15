# BiteBase Frontend - Simplified Deployment Guide

## 🎯 Overview

After the dependency cleanup, BiteBase is now a **frontend-only application** that connects to the external API at `api.bitebase.app`. This dramatically simplifies deployment and maintenance.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- External API access to `https://api.bitebase.app`

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Required
NEXT_PUBLIC_API_URL=https://api.bitebase.app

# Optional (for enhanced features)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### 3. Run Development Server
```bash
npm run dev:frontend
# or
yarn dev:frontend
```

Visit: `http://localhost:12000`

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/frontend
vercel

# Set environment variables in Vercel dashboard
```

### Option 2: Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
# Set environment variables in Netlify dashboard
```

### Option 3: Docker
```bash
# Use the existing Dockerfile in apps/frontend
cd apps/frontend
docker build -t bitebase-frontend .
docker run -p 12000:12000 bitebase-frontend
```

### Option 4: Static Hosting (Cloudflare Pages, GitHub Pages)
```bash
# Build static version
npm run build
npm run export

# Deploy the 'out' folder to your static host
```

## 🔧 Environment Variables

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | External API endpoint | `https://api.bitebase.app` |

### Optional Variables
| Variable | Description | Required For |
|----------|-------------|--------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox access token | Map features |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Authentication |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Authentication |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Authentication |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Payments |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics ID | Analytics |

## 📊 Build Configuration

### Production Build
```bash
npm run build
```

### Development Build
```bash
npm run dev:frontend
```

### Type Checking
```bash
npm run check-types
```

### Linting
```bash
npm run lint
```

## 🔍 Health Checks

### API Connectivity Test
```bash
node test-external-api.js
```

Expected output:
```
✅ Health Check: healthy
✅ Restaurant Search Success
✅ API Response Time: <500ms
```

### Frontend Health Check
Once deployed, visit: `https://your-domain.com/health`

## 🚨 Troubleshooting

### Common Issues

#### 1. API Connection Failed
```bash
# Check if external API is accessible
curl https://api.bitebase.app/health

# Verify environment variables
echo $NEXT_PUBLIC_API_URL
```

#### 2. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### 3. Map Not Loading
- Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Check Mapbox account limits
- Ensure domain is whitelisted in Mapbox dashboard

#### 4. Authentication Issues
- Verify Firebase configuration
- Check Firebase project settings
- Ensure domain is authorized in Firebase console

## 📈 Performance Optimization

### 1. Enable Caching
```javascript
// In next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=60, stale-while-revalidate'
          }
        ]
      }
    ]
  }
}
```

### 2. Image Optimization
- Use Next.js Image component
- Configure image domains in next.config.js
- Enable WebP format

### 3. Bundle Analysis
```bash
npm install --save-dev @next/bundle-analyzer
npm run analyze
```

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use different API keys for development/production
- Rotate API keys regularly

### 2. API Security
- External API handles authentication and authorization
- No sensitive data stored in frontend
- All API calls are HTTPS

### 3. Content Security Policy
```javascript
// In next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
]
```

## 📱 Mobile Deployment

### Progressive Web App (PWA)
The app includes PWA configuration:
- Offline support
- App-like experience
- Push notifications (if configured)

### Mobile-Specific Considerations
- Responsive design included
- Touch-friendly interface
- Optimized for mobile networks

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## 📞 Support

### API Issues
- External API status: `https://api.bitebase.app/health`
- API documentation: Contact API provider

### Frontend Issues
- Check browser console for errors
- Verify environment variables
- Test with different browsers

### Performance Issues
- Use browser dev tools
- Check network requests
- Monitor Core Web Vitals

## 🎉 Success Metrics

After deployment, you should see:
- ✅ Fast loading times (<3s)
- ✅ Responsive design on all devices
- ✅ Working API integration
- ✅ Proper error handling
- ✅ SEO-friendly URLs
- ✅ Accessibility compliance

The simplified architecture ensures reliable, fast, and maintainable deployment with minimal infrastructure requirements.