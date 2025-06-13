# 🚀 BiteBase Deployment Guide: Vercel + EC2

This guide shows how to deploy BiteBase with **Frontend on Vercel** and **Backend on EC2**.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   EC2 Instance  │
│   (Frontend)    │◄──►│   (Backend)     │
│                 │    │                 │
│ • Next.js App   │    │ • FastAPI       │
│ • Static Files  │    │ • PostgreSQL    │
│ • Global CDN    │    │ • Redis         │
└─────────────────┘    └─────────────────┘
```

## 🖥️ EC2 Backend Setup

### 1. Deploy Backend on EC2

```bash
# On your EC2 instance
cd /opt/bitebase
./aws-deployment/deploy-backend.sh
```

This will start:
- ✅ **FastAPI API** on port 8000
- 🗄️ **PostgreSQL** on port 5432  
- 📊 **Redis** on port 6379

### 2. Configure Security Group

Make sure your EC2 security group allows:
- **Port 8000** (FastAPI API)
- **Port 22** (SSH)
- **Port 80/443** (if using Nginx)

### 3. Get Your API URL

```bash
# Your backend will be available at:
http://YOUR_EC2_PUBLIC_IP:8000

# API Documentation:
http://YOUR_EC2_PUBLIC_IP:8000/docs
```

## 🌐 Vercel Frontend Setup

### 1. Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import your `beta-bitebase-app` repository

### 2. Configure Vercel Project

**Root Directory:** `apps/frontend`

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=http://YOUR_EC2_PUBLIC_IP:8000
NEXT_PUBLIC_ENVIRONMENT=production
```

### 3. Deploy

Vercel will automatically deploy when you push to GitHub!

## 🔧 Configuration Files

### Backend Configuration
- `backend/main.py` - FastAPI application
- `backend/requirements.txt` - Python dependencies
- `docker-compose.backend.yml` - Docker services

### Frontend Configuration
- `apps/frontend/.env.production` - Production environment
- `apps/frontend/lib/api.ts` - API client
- `vercel.json` - Vercel configuration

## 📊 API Endpoints

Your FastAPI backend provides:

```
GET  /                     - API info
GET  /health              - Health check
GET  /docs                - API documentation
GET  /api/restaurants     - List restaurants
GET  /api/restaurants/{id} - Get restaurant details
GET  /api/menu            - Get menu items
```

## 🔄 Development Workflow

### 1. Backend Changes
```bash
# Make changes to backend/main.py
git add . && git commit -m "Update backend"
git push origin main

# Deploy to EC2
ssh ec2-user@YOUR_EC2_IP
cd /opt/bitebase
git pull origin main
docker-compose -f docker-compose.backend.yml restart api
```

### 2. Frontend Changes
```bash
# Make changes to apps/frontend/
git add . && git commit -m "Update frontend"
git push origin main

# Vercel automatically deploys!
```

## 🛠️ Useful Commands

### EC2 Backend Commands
```bash
# Check status
docker-compose -f docker-compose.backend.yml ps

# View logs
docker-compose -f docker-compose.backend.yml logs -f api

# Restart services
docker-compose -f docker-compose.backend.yml restart

# Stop services
docker-compose -f docker-compose.backend.yml down
```

### Test API
```bash
# Health check
curl http://YOUR_EC2_IP:8000/health

# Get restaurants
curl http://YOUR_EC2_IP:8000/api/restaurants

# Get menu
curl http://YOUR_EC2_IP:8000/api/menu
```

## 🔒 Security Considerations

### EC2 Security
- ✅ Use security groups to limit access
- ✅ Keep EC2 instance updated
- ✅ Use strong database passwords
- ✅ Consider using SSL/TLS

### API Security
- ✅ Configure CORS properly
- ✅ Add rate limiting
- ✅ Use authentication for sensitive endpoints
- ✅ Validate all inputs

## 🚀 Production Optimizations

### Backend Optimizations
- Use multiple FastAPI workers
- Add Redis caching
- Set up database connection pooling
- Add monitoring and logging

### Frontend Optimizations
- Vercel automatically handles:
  - Global CDN
  - Image optimization
  - Static file caching
  - Automatic HTTPS

## 📈 Monitoring

### Backend Monitoring
```bash
# Check API health
curl http://YOUR_EC2_IP:8000/health

# Monitor logs
docker-compose -f docker-compose.backend.yml logs -f

# Check resource usage
docker stats
```

### Frontend Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Set up error tracking

## 🆘 Troubleshooting

### Common Issues

**API not accessible:**
- Check EC2 security group
- Verify Docker containers are running
- Check API logs

**CORS errors:**
- Update CORS settings in `backend/main.py`
- Verify API URL in Vercel environment variables

**Database connection issues:**
- Check PostgreSQL container status
- Verify database credentials

### Debug Commands
```bash
# Check all containers
docker ps -a

# Check specific service logs
docker logs bitebase-api
docker logs bitebase-postgres
docker logs bitebase-redis

# Test database connection
docker exec bitebase-postgres pg_isready -U bitebase
```

## 🎉 Success!

Once deployed, you'll have:
- ✅ **Fast, scalable frontend** on Vercel's global CDN
- ✅ **Powerful backend API** on your EC2 instance
- ✅ **Automatic deployments** from GitHub
- ✅ **Production-ready architecture**

Your BiteBase application is now live and ready for users! 🚀