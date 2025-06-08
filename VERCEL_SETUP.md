# Vercel Frontend Deployment Setup

## Quick Setup for Vercel

### 1. CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd apps/frontend

# Deploy to production
vercel --prod
```

### 2. Project Configuration

When prompted by Vercel CLI:
- **Set up and deploy**: Yes
- **Which scope**: Your personal account or team
- **Link to existing project**: No (create new)
- **Project name**: `bitebase-frontend`
- **Directory**: `./` (current directory)
- **Override settings**: No

### 3. Environment Variables

Add these in your Vercel dashboard (Settings → Environment Variables):

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain.vercel.app
NEXTAUTH_SECRET=bitebase-nextauth-secret-key-for-production-32-chars-min
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-oauth-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 4. Domain Configuration

1. **Custom Domain** (Optional):
   - Go to Vercel dashboard → Your project → Settings → Domains
   - Add your custom domain (e.g., `app.bitebase.com`)
   - Follow DNS configuration instructions

2. **Default Domain**:
   - Your app will be available at: `https://bitebase-frontend-xxxx.vercel.app`

### 5. Build Configuration

The project is already configured with `vercel.json`:

```json
{
  "version": 2,
  "name": "bitebase-frontend",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### 6. API Proxy Configuration

The frontend is configured to proxy backend API calls:

```json
{
  "rewrites": [
    {
      "source": "/api/backend/(.*)",
      "destination": "https://your-backend-url.onrender.com/api/$1"
    }
  ]
}
```

## Post-Deployment Steps

### 1. Update Backend URL
After deploying backend to Render, update the API URL:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` with your Render backend URL
3. Redeploy the frontend

### 2. Update CORS in Backend
Ensure your Vercel frontend domain is added to the backend CORS configuration.

### 3. Test the Connection
1. Visit your Vercel frontend URL
2. Open browser developer tools
3. Try logging in or making API calls
4. Check for any CORS or connection errors

## Automatic Deployments

- **Git Integration**: Vercel automatically deploys when you push to the `main` branch
- **Preview Deployments**: Every pull request gets a preview deployment
- **Production Deployments**: Pushes to `main` branch deploy to production

## Performance Optimization

The frontend includes:
- ✅ Next.js 14 with App Router
- ✅ Static generation where possible
- ✅ Image optimization
- ✅ Code splitting
- ✅ Compression and caching headers

## Monitoring

- **Analytics**: Available in Vercel dashboard
- **Performance**: Core Web Vitals tracking
- **Logs**: Function logs for API routes

## Troubleshooting

### Build Failures
```bash
# Test build locally first
cd apps/frontend
npm run build
```

### Environment Variable Issues
- Ensure all required variables are set
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Redeploy after changing environment variables

### API Connection Issues
- Check CORS configuration in backend
- Verify API URL is correct
- Test backend health endpoint directly