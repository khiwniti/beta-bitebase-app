# 🚀 BiteBase Render.com Deployment Guide

Complete guide for deploying your production-ready BiteBase SaaS platform to Render.com with Docker containerization.

---

## 📋 **DEPLOYMENT OVERVIEW**

### **What's Being Deployed**
- **Production Backend API** with all SaaS features
- **Docker-containerized** for consistent deployment
- **PostgreSQL Database** for data persistence
- **Redis Cache** for performance optimization
- **Complete AI Integration** with fallback support
- **Enterprise Security** and monitoring

### **Architecture on Render.com**
```
┌─────────────────────────────────────────────────────────────┐
│                    Render.com Infrastructure                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐ │
│  │   Frontend      │    │    Backend      │    │Database │ │
│  │   (Static)      │◄───┤   (Docker)      │◄───┤(Postgres│ │
│  │                 │    │                 │    │         │ │
│  │ • Next.js Build │    │ • Production API│    │ • Managed│ │
│  │ • CDN Delivery  │    │ • Auto-scaling  │    │ • Backups│ │
│  │ • SSL/HTTPS     │    │ • Health Checks │    │ • SSL    │ │
│  └─────────────────┘    └─────────────────┘    └─────────┘ │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐ │
│  │     Redis       │    │   Monitoring    │    │  CDN    │ │
│  │   (Cache)       │    │   (Built-in)    │    │(Global) │ │
│  │                 │    │                 │    │         │ │
│  │ • Session Store │    │ • Logs & Metrics│    │ • Assets│ │
│  │ • AI Cache      │    │ • Health Checks │    │ • Images│ │
│  │ • Rate Limiting │    │ • Alerts        │    │ • Static│ │
│  └─────────────────┘    └─────────────────┘    └─────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ **QUICK DEPLOYMENT**

### **Option 1: Automated Script (Recommended)**
```bash
# 1. Run the deployment preparation script
chmod +x scripts/deploy-render.sh
./scripts/deploy-render.sh

# 2. Follow the generated checklist
cat DEPLOYMENT_CHECKLIST.md

# 3. Deploy to Render.com
# (Manual steps in Render.com dashboard)
```

### **Option 2: Manual Deployment**
```bash
# 1. Test Docker build locally
cd apps/backend
docker build -t bitebase-backend .
docker run -p 3001:3001 bitebase-backend

# 2. Push to GitHub
git add .
git commit -m "Prepare for Render.com deployment"
git push origin main

# 3. Deploy via Render.com dashboard
# (Follow manual steps below)
```

---

## 📝 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: Prepare Your Repository**

1. **Ensure all files are committed:**
   ```bash
   git add .
   git commit -m "Production deployment ready"
   git push origin main
   ```

2. **Verify Docker configuration:**
   - `apps/backend/Dockerfile` ✅
   - `docker-compose.backend.yml` ✅
   - `render.yaml` ✅

### **Step 2: Create Render.com Account**

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your repository

### **Step 3: Deploy Database Services**

#### **PostgreSQL Database**
1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name**: `bitebase-postgres`
   - **Database Name**: `bitebase_production`
   - **User**: `bitebase`
   - **Region**: `Oregon (US West)`
   - **Plan**: `Starter` ($7/month)

#### **Redis Cache**
1. Click "New +" → "Redis"
2. Configure:
   - **Name**: `bitebase-redis`
   - **Region**: `Oregon (US West)`
   - **Plan**: `Starter` ($7/month)

### **Step 4: Deploy Backend Service**

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `bitebase-production-backend`
   - **Environment**: `Docker`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Dockerfile Path**: `./apps/backend/Dockerfile`
   - **Plan**: `Standard` ($25/month)

### **Step 5: Configure Environment Variables**

Copy variables from `.env.render` to your service:

#### **Required Security Variables** (Generate secure values)
```bash
# Generate with: openssl rand -base64 32
JWT_SECRET=your-generated-secret
JWT_REFRESH_SECRET=your-generated-secret
ENCRYPTION_KEY=your-generated-secret
SESSION_SECRET=your-generated-secret
```

#### **Database URLs** (Auto-generated by Render)
```bash
DATABASE_URL=postgresql://...  # From PostgreSQL service
REDIS_URL=redis://...          # From Redis service
```

#### **API Keys** (Your external services)
```bash
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
SENDGRID_API_KEY=your-sendgrid-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### **Step 6: Deploy Frontend (Optional)**

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Name**: `bitebase-frontend`
   - **Build Command**: `cd apps/frontend && npm run build`
   - **Publish Directory**: `apps/frontend/out`

---

## 🔧 **CONFIGURATION DETAILS**

### **Docker Configuration**

The `Dockerfile` is optimized for Render.com:
- **Multi-stage build** for smaller image size
- **Non-root user** for security
- **Health checks** for monitoring
- **Production optimizations**

### **Environment Variables**

#### **Critical Variables (Must Set)**
| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | `openssl rand -base64 32` |
| `DATABASE_URL` | PostgreSQL connection | Auto-generated by Render |
| `REDIS_URL` | Redis connection | Auto-generated by Render |
| `OPENAI_API_KEY` | AI functionality | `sk-...` |
| `STRIPE_SECRET_KEY` | Payment processing | `sk_live_...` |

#### **Optional Variables**
| Variable | Description | Default |
|----------|-------------|---------|
| `AI_MODE` | AI processing mode | `api` |
| `CORS_ORIGIN` | Allowed origins | Your domain |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit | `100` |

### **Database Schema**

The database will be automatically initialized with:
- **Production schema** (`database/production-schema.sql`)
- **Multi-tenant support**
- **Analytics tables**
- **Subscription management**
- **AI cache tables**

---

## 📊 **MONITORING & MAINTENANCE**

### **Health Monitoring**

Render.com provides built-in monitoring:
- **Health checks** via `/health` endpoint
- **Automatic restarts** on failure
- **Resource usage** metrics
- **Log aggregation**

### **Performance Optimization**

#### **Scaling Configuration**
```yaml
# In render.yaml
plan: standard  # Auto-scales based on traffic
region: oregon  # Choose closest to users
```

#### **Resource Limits**
```dockerfile
# In Dockerfile
ENV NODE_OPTIONS="--max-old-space-size=1024"
```

### **Backup Strategy**

1. **Database Backups**: Automatic daily backups by Render
2. **File Storage**: Use AWS S3 for user uploads
3. **Configuration**: Store in version control

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Build Failures**
```bash
# Check Docker build locally
cd apps/backend
docker build -t test .

# Check logs in Render dashboard
# Go to Service → Logs tab
```

#### **Database Connection Issues**
```bash
# Verify DATABASE_URL format
postgresql://user:password@host:port/database

# Check database service status in Render dashboard
```

#### **Environment Variable Issues**
```bash
# Verify all required variables are set
# Check for typos in variable names
# Ensure secrets are properly generated
```

### **Performance Issues**

#### **Slow Response Times**
1. Check database query performance
2. Verify Redis cache is working
3. Monitor resource usage
4. Consider upgrading plan

#### **Memory Issues**
1. Increase `NODE_OPTIONS` memory limit
2. Optimize database queries
3. Implement better caching
4. Upgrade to higher plan

---

## 💰 **COST ESTIMATION**

### **Render.com Pricing**
| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Backend API | Standard | $25 |
| PostgreSQL | Starter | $7 |
| Redis | Starter | $7 |
| Frontend | Static Site | $0 |
| **Total** | | **$39/month** |

### **External Services**
| Service | Estimated Cost |
|---------|----------------|
| OpenAI API | $20-100/month |
| Stripe | 2.9% + 30¢/transaction |
| SendGrid | $15/month (40K emails) |
| AWS S3 | $5-20/month |

---

## 🔗 **USEFUL LINKS**

### **Render.com Resources**
- [Dashboard](https://dashboard.render.com)
- [Documentation](https://render.com/docs)
- [Docker Guide](https://render.com/docs/docker)
- [Environment Variables](https://render.com/docs/environment-variables)

### **BiteBase Resources**
- [GitHub Repository](https://github.com/your-repo)
- [API Documentation](./docs/api.md)
- [Local Development](./README.md)

---

## ✅ **POST-DEPLOYMENT CHECKLIST**

### **Immediate Testing**
- [ ] Health endpoint responding: `https://your-service.onrender.com/health`
- [ ] Database connection working
- [ ] Redis cache functional
- [ ] API endpoints accessible
- [ ] Authentication working

### **Feature Testing**
- [ ] User registration/login
- [ ] AI recommendations
- [ ] Payment processing
- [ ] Email delivery
- [ ] File uploads

### **Security Verification**
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Security headers present
- [ ] Environment variables secure

### **Performance Monitoring**
- [ ] Response times acceptable (<500ms)
- [ ] Memory usage stable
- [ ] Database performance good
- [ ] Error rates low (<1%)

---

## 🎉 **DEPLOYMENT COMPLETE!**

Your BiteBase SaaS platform is now running on Render.com with:

✅ **Production-Ready Backend** with all enterprise features  
✅ **Managed Database** with automatic backups  
✅ **Redis Caching** for optimal performance  
✅ **Docker Containerization** for consistency  
✅ **Auto-Scaling** based on traffic  
✅ **Built-in Monitoring** and health checks  
✅ **SSL/HTTPS** enabled by default  
✅ **Global CDN** for fast content delivery  

**Your restaurant intelligence platform is now live and ready for customers!** 🚀

For support: [Render.com Support](https://render.com/support) | [BiteBase Issues](https://github.com/your-repo/issues)
