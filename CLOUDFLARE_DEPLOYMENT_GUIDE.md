# BiteBase Cloudflare Worker Deployment Guide

## Overview
This guide covers deploying the BiteBase backend with authentication endpoints to Cloudflare Workers, accessible at `api.bitebase.app`.

## Current Status
✅ **Auth Page Design**: Completely redesigned with seamless, responsive layout  
✅ **Frontend Configuration**: Updated to use `https://api.bitebase.app` for production  
✅ **Backend Auth Endpoints**: Added complete `/api/auth/*` handlers to Cloudflare Worker  
✅ **Code Committed**: All changes pushed to GitHub repositories  
🔄 **Deployment Needed**: Cloudflare Worker needs to be deployed with new auth endpoints  

## Prerequisites

1. **Cloudflare Account** with Workers enabled
2. **Wrangler CLI** installed and authenticated
3. **Custom Domain** `api.bitebase.app` configured in Cloudflare

## Deployment Steps

### 1. Install Wrangler CLI
```bash
npm install -g wrangler@latest
```

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Navigate to Deployment Directory
```bash
cd /workspace/backend/cloudflare-deploy
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Deploy to Cloudflare Workers
```bash
npm run deploy
```

### 6. Verify Deployment
```bash
# Test health endpoint
curl https://bitebase-backend-prod.bitebase.workers.dev/health

# Test auth endpoint
curl -X POST https://bitebase-backend-prod.bitebase.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Configuration Details

### Worker Configuration (`wrangler.toml`)
```toml
name = "bitebase-backend-prod"
main = "worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"
GOOGLE_MAPS_API_KEY = "AIzaSyCfG9E3ggBc1ZBkhqTEDSBm0eYp152tMLk"

# Optional: Add KV, D1, R2 bindings as needed
# [[kv_namespaces]]
# binding = "CACHE"
# id = "955a6bac6c734235a4bdc0f5801a5dbd"

# [[d1_databases]]
# binding = "DB"
# database_name = "bitebase-db"
# database_id = "76e6f232-5d8b-4e43-b9c8-df2aef026563"
```

### Custom Domain Setup
1. **Add Custom Domain** in Cloudflare Workers dashboard
2. **Configure DNS** for `api.bitebase.app` to point to the worker
3. **SSL Certificate** will be automatically provisioned

## Available Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/password-reset` - Password reset
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/google` - Google OAuth

### Location Endpoints
- `GET /api/location/nearby` - Get nearby restaurants
- `POST /api/location/track` - Track location

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/competitors` - Competitor analysis

### MCP Endpoints
- `GET /api/mcp/tools` - Available tools
- `POST /api/mcp/execute` - Execute tool

### Health Check
- `GET /health` - Service health status

## Frontend Configuration

The frontend is already configured to use the production API:

```typescript
// lib/config.ts
BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
  (isDevelopment 
    ? "http://localhost:56222"
    : "https://api.bitebase.app")
```

## Testing Authentication Flow

### 1. Test Registration
```bash
curl -X POST https://api.bitebase.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "Test User",
    "userType": "NEW_ENTREPRENEUR"
  }'
```

### 2. Test Login
```bash
curl -X POST https://api.bitebase.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### 3. Test Protected Endpoint
```bash
curl -X GET https://api.bitebase.app/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables

### Production Environment Variables
Set these in Cloudflare Workers dashboard or via Wrangler:

```bash
# Required for production
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put OPENAI_API_KEY

# Optional for enhanced features
wrangler secret put FOURSQUARE_API_KEY
wrangler secret put MAPBOX_ACCESS_TOKEN
wrangler secret put GOOGLE_PLACES_API_KEY
```

## Monitoring and Logs

### View Real-time Logs
```bash
wrangler tail
```

### Analytics
- Monitor requests in Cloudflare Workers dashboard
- Set up alerts for error rates
- Track performance metrics

## Security Considerations

### CORS Configuration
The worker includes proper CORS headers:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};
```

### Rate Limiting
Configure rate limiting in `wrangler.toml`:
```toml
[limits]
cpu_ms = 50
```

### Authentication
- JWT tokens with proper expiration
- Secure password handling
- Input validation on all endpoints

## Troubleshooting

### Common Issues

1. **404 Errors on Auth Endpoints**
   - Ensure worker is deployed with latest code
   - Check custom domain configuration
   - Verify DNS propagation

2. **CORS Errors**
   - Confirm CORS headers are properly set
   - Check preflight OPTIONS handling

3. **Authentication Failures**
   - Verify JWT secret is set
   - Check token format and expiration
   - Ensure proper Authorization header format

### Debug Commands
```bash
# Check worker status
wrangler status

# View deployment logs
wrangler tail --format=pretty

# Test specific endpoints
curl -v https://api.bitebase.app/health
```

## Next Steps

1. **Deploy Worker**: Run `wrangler deploy` in `/workspace/backend/cloudflare-deploy`
2. **Configure Custom Domain**: Set up `api.bitebase.app` in Cloudflare dashboard
3. **Test Authentication**: Verify all auth endpoints work correctly
4. **Monitor Performance**: Set up alerts and monitoring
5. **Add Database**: Configure D1 or external database for persistent storage

## Production Checklist

- [ ] Cloudflare Worker deployed successfully
- [ ] Custom domain `api.bitebase.app` configured
- [ ] All auth endpoints responding correctly
- [ ] CORS headers properly configured
- [ ] Rate limiting enabled
- [ ] Environment secrets configured
- [ ] Monitoring and alerts set up
- [ ] Frontend pointing to production API
- [ ] SSL certificate active
- [ ] DNS propagation complete

## Support

For deployment issues:
1. Check Cloudflare Workers documentation
2. Review Wrangler CLI logs
3. Test endpoints individually
4. Verify environment configuration

The auth page theme has been completely redesigned with a seamless, professional layout that eliminates the "mobile crop" feeling. Once the Cloudflare Worker is deployed, the authentication flow will work end-to-end in production.