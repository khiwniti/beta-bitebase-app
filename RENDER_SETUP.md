# Render Backend Deployment Setup

## Quick Setup for Render

### 1. Service Configuration
- **Service Type**: Web Service
- **Repository**: `khiwniti/beta-bitebase-app`
- **Root Directory**: `apps/backend`
- **Environment**: Node
- **Node Version**: 18
- **Build Command**: `npm install`
- **Start Command**: `npm run start:vercel`

### 2. Environment Variables

Copy and paste these environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=bitebase-super-secret-jwt-key-for-production-use-32-chars-minimum
GOOGLE_CLIENT_ID=your-google-oauth-client-id.googleusercontent.com
```

### 3. Auto-Deploy Settings
- **Branch**: `main`
- **Auto-Deploy**: Yes

### 4. Health Check
- **Health Check Path**: `/health`

### 5. After Deployment
1. Note your service URL: `https://bitebase-backend-xxxx.onrender.com`
2. Test the health endpoint: `https://your-url.onrender.com/health`
3. Update the frontend environment variables with this URL

## Important Notes

- Render free tier may have cold starts (first request after inactivity takes longer)
- The service will sleep after 15 minutes of inactivity on free tier
- For production, consider upgrading to a paid plan for better performance

## Testing Commands

```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/health

# Test API endpoint
curl https://your-backend-url.onrender.com/api/health

# Test restaurant search
curl "https://your-backend-url.onrender.com/api/restaurants/search?query=thai"
```