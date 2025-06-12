# BiteBase Production Deployment Configuration

## Environment Variables Setup

### Frontend (Vercel/Netlify)
```bash
# Production Environment
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production

# API Configuration
NEXT_PUBLIC_API_URL=https://beta-bitebase-app-hhyk.onrender.com
NEXT_PUBLIC_SITE_URL=https://beta.bitebase.app

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bitebase-3d5f9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bitebase-3d5f9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bitebase-3d5f9.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=104778038046
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

# Maps Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao
```

### Backend (Render)
```bash
# Server Configuration
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-calm-brook-a4g8i8te-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require

# CORS Configuration
CORS_ORIGIN=https://beta.bitebase.app

# API Keys
OPENROUTER_API_KEY=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
MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoia2hpd25pdGkiLCJhIjoiY205eDFwMzl0MHY1YzJscjB3bm4xcnh5ZyJ9.ANGVE0tiA9NslBn8ft_9fQ

# Security Keys (Generate new ones for production)
JWT_SECRET=4RnZ3V+sClxdkd2xjgYj/Q==
APP_KEYS=2ebuMok3H/O96/o1n/nOyg==,mLN9bGnz5IIzz0tR81ng8g==,vxFi1WuR/zifZJpZkZWVEw==,zr61pBkrMFUG80JQv6L1CA==
```

## Deployment Steps

### 1. Backend Deployment (Render)
1. Connect GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm run start:vercel`
4. Add all environment variables from backend section above
5. Deploy from main branch

### 2. Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Set framework preset: Next.js
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add all environment variables from frontend section above
6. Deploy from main branch

### 3. Database Setup (Neon)
- Database is already configured and running
- Connection string: `postgresql://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-calm-brook-a4g8i8te-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require`

### 4. Firebase Setup
- Project ID: `bitebase-3d5f9`
- Service account configured for backend authentication
- Client configuration set for frontend

## Security Notes

1. **Firebase Service Account**: The service account key is stored in `firebase-service-account.json` and should be added to the backend deployment environment as a file or environment variable.

2. **API Keys**: All API keys are configured for production use. Ensure they are properly secured in deployment platforms.

3. **CORS**: Backend is configured to only allow requests from `https://beta.bitebase.app`.

4. **Database**: Using SSL-enabled PostgreSQL connection with proper authentication.

## Monitoring & Health Checks

- Backend health check: `https://beta-bitebase-app-hhyk.onrender.com/health`
- Frontend health check: Available at root URL
- Database connection: Monitored through application logs

## Build Status

✅ TypeScript compilation: PASSING
✅ Frontend build: PASSING  
✅ Backend server: PASSING
✅ Environment configuration: COMPLETE
✅ Security configuration: COMPLETE

## Next Steps

1. Deploy backend to Render with provided configuration
2. Deploy frontend to Vercel with provided configuration
3. Test end-to-end functionality
4. Monitor deployment logs for any issues
5. Set up domain DNS if using custom domain

## Support

For deployment issues, check:
1. Build logs in respective platforms
2. Environment variable configuration
3. Database connectivity
4. API key validity