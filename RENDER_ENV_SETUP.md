# Render Environment Variables Setup

## Backend Environment Variables (Render Dashboard)

Add these environment variables in your Render web service dashboard:

### Required Variables
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GOOGLE_CLIENT_ID=your-google-oauth-client-id
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
DATABASE_URL=postgresql://user:pass@host:port/dbname
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
CORS_ORIGIN=https://your-frontend.vercel.app,https://beta.bitebase.app
```

### Optional Variables
```
REDIS_URL=redis://user:pass@host:port
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FORMAT=json
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=your-db-name
DATABASE_USERNAME=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

## How to Add Environment Variables in Render

1. Go to your Render dashboard
2. Select your web service
3. Go to Environment tab
4. Click "Add Environment Variable"
5. Add each variable with:
   - **Key**: Variable name (e.g., `JWT_SECRET`)
   - **Value**: Variable value (e.g., `your-secret-key`)
6. Click "Save Changes"
7. Your service will automatically redeploy

## Service Configuration for Render

### Web Service Settings
```
Name: bitebase-backend
Environment: Node
Region: Oregon (US West) or closest to your users
Branch: main
Root Directory: apps/backend
Build Command: npm ci
Start Command: npm run express:start
```

### Health Check
```
Health Check Path: /health
```

### Auto-Deploy
- Enable "Auto-Deploy" for automatic deployments on git push

## Database Setup Options

### Option 1: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string from dashboard
4. Add as `DATABASE_URL` environment variable

### Option 2: Render PostgreSQL
1. In Render dashboard, create new PostgreSQL database
2. Copy the connection details
3. Add as `DATABASE_URL` environment variable

### Option 3: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add as `DATABASE_URL` environment variable

## Redis Setup (Optional)

### Option 1: Upstash
1. Create account at [upstash.com](https://upstash.com)
2. Create Redis database
3. Get Redis URL from dashboard
4. Add as `REDIS_URL` environment variable

### Option 2: Render Redis
1. In Render dashboard, create new Redis instance
2. Copy the connection URL
3. Add as `REDIS_URL` environment variable

## Important Notes

- Render automatically restarts your service when environment variables change
- Use strong, unique values for `JWT_SECRET`
- Keep API keys secure and rotate them regularly
- Update `CORS_ORIGIN` after deploying your frontend
- Monitor your service logs for any configuration issues
- Consider using Render's secret management for sensitive data