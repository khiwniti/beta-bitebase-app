# Vercel Environment Variables Setup

## Frontend Environment Variables (Vercel Dashboard)

Add these environment variables in your Vercel project dashboard:

### Required Variables
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Optional Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_DEBUG_MODE=false
```

## Backend Environment Variables (if deploying to Vercel)

Add these environment variables in your Vercel backend project dashboard:

### Required Variables
```
NODE_ENV=production
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
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_API_URL`)
   - **Value**: Variable value (e.g., `https://your-backend.onrender.com`)
   - **Environment**: Select Production, Preview, and Development as needed

## Important Notes

- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put sensitive data in `NEXT_PUBLIC_*` variables
- Backend environment variables are kept secure on the server
- After adding variables, redeploy your application
- Update `NEXT_PUBLIC_API_URL` after deploying your backend
- Update backend `CORS_ORIGIN` after deploying your frontend