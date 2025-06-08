# BiteBase Deployment Guide

This guide will help you deploy the BiteBase application with the frontend on Vercel and the backend on Render.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Vercel account (free tier available)
- Render account (free tier available)

## 🎯 Quick Deployment Summary

### Frontend (Vercel)
- **Platform**: Vercel
- **Framework**: Next.js 14
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Root Directory**: `apps/frontend`

### Backend (Render)
- **Platform**: Render
- **Runtime**: Node.js
- **Start Command**: `npm run start:vercel`
- **Root Directory**: `apps/backend`

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `khiwniti/beta-bitebase-app`
   - Configure the service:
     - **Name**: `bitebase-backend`
     - **Root Directory**: `apps/backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm run start:vercel`

3. **Set Environment Variables**
   Add these environment variables in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://bitebase-backend-xxxx.onrender.com`

### Part 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd apps/frontend
   vercel --prod
   ```

4. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=https://your-frontend-domain.vercel.app
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   ```

5. **Update Backend URL in Frontend**
   - Update the API URL in `apps/frontend/lib/api-client.ts`
   - Replace the base URL with your Render backend URL

## 🔧 Configuration Files

### Frontend Configuration (`apps/frontend/vercel.json`)
```json
{
  "version": 2,
  "name": "bitebase-frontend",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/api/backend/(.*)",
      "destination": "https://your-backend-url.onrender.com/api/$1"
    }
  ]
}
```

### Backend Configuration (`apps/backend/vercel.json`)
```json
{
  "version": 2,
  "name": "bitebase-backend",
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## 🌍 Environment Variables Setup

### Backend Environment Variables
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
GOOGLE_CLIENT_ID=your-google-oauth-client-id.googleusercontent.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-oauth-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

## 🔗 Connecting Frontend and Backend

1. **Update API Client**
   In `apps/frontend/lib/api-client.ts`, update the base URL:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.onrender.com';
   ```

2. **Update CORS Settings**
   In `apps/backend/server.js`, ensure your frontend domain is in the CORS origins:
   ```javascript
   app.use(cors({
     origin: [
       "https://your-frontend-domain.vercel.app",
       "http://localhost:3000",
       process.env.NEXT_PUBLIC_SITE_URL
     ].filter(Boolean),
     credentials: true,
   }));
   ```

## 🧪 Testing the Deployment

1. **Test Backend Health**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```

2. **Test Frontend**
   - Visit your Vercel frontend URL
   - Try logging in with demo credentials
   - Check browser console for any API errors

## 🎨 Brand Colors Applied

The application now uses the BiteBase brand colors:
- **Primary**: Mantis Green (#74C365)
- **Accent Red**: Chilli Red (#E23D28)
- **Accent Yellow**: Saffron (#F4C431)

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend domain is added to backend CORS origins
   - Check environment variables are set correctly

2. **API Connection Failed**
   - Verify backend is deployed and running
   - Check API URL in frontend environment variables

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed

4. **Authentication Issues**
   - Verify JWT_SECRET is set and consistent
   - Check Google OAuth configuration

### Logs and Debugging

- **Render Logs**: Available in Render dashboard under "Logs" tab
- **Vercel Logs**: Available in Vercel dashboard under "Functions" tab
- **Browser Console**: Check for client-side errors

## 📞 Support

If you encounter issues:
1. Check the logs in both Render and Vercel dashboards
2. Verify all environment variables are set correctly
3. Ensure the repository is up to date
4. Test locally first with `npm run dev` in both frontend and backend

## 🎉 Success!

Once deployed successfully, you'll have:
- ✅ Frontend running on Vercel with custom domain
- ✅ Backend API running on Render
- ✅ Seamless communication between services
- ✅ Brand colors and UI properly applied
- ✅ Authentication and core features working

Your BiteBase application is now live and ready for users!