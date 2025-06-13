# 🚀 BiteBase Full-Stack AWS EC2 Deployment Guide

Complete guide for deploying BiteBase (frontend + backend) to AWS EC2 with Docker.

## 🎯 Quick Start (One Command)

For a fresh EC2 instance, run this single command:

```bash
curl -fsSL https://raw.githubusercontent.com/khiwniti/beta-bitebase-app/main/aws-deployment/ec2-one-command-setup.sh | bash
```

This will:
- ✅ Install Docker & Docker Compose
- ✅ Setup firewall and security
- ✅ Clone the repository
- ✅ Deploy the full-stack application
- ✅ Setup monitoring and health checks

## 📋 Prerequisites

### EC2 Instance Requirements
- **Instance Type**: t3.medium or larger (minimum 2 vCPU, 4GB RAM)
- **Operating System**: Ubuntu 22.04 LTS
- **Storage**: 20GB+ SSD
- **Security Group**: Allow ports 22, 80, 443

### Required Services & API Keys
- **Database**: PostgreSQL (included in deployment)
- **Cache**: Redis (included in deployment)
- **OpenAI API Key** (for AI features)
- **Google Maps API Key** (for location services)
- **Stripe Keys** (for payments)
- **Domain Name** (optional but recommended)

## 🛠️ Manual Setup Instructions

### Step 1: Launch EC2 Instance

1. **Launch Instance**:
   ```bash
   # Connect to your EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Update System**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

### Step 2: Install Dependencies

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/khiwniti/beta-bitebase-app/main/aws-deployment/ec2-one-command-setup.sh
chmod +x ec2-one-command-setup.sh
./ec2-one-command-setup.sh
```

### Step 3: Manual Deployment (Alternative)

If you prefer manual control:

```bash
# Clone repository
git clone https://github.com/khiwniti/beta-bitebase-app.git
cd beta-bitebase-app/aws-deployment

# Configure environment
cp .env.fullstack.example .env
nano .env  # Edit with your values

# Deploy
./deploy-fullstack.sh
```

## ⚙️ Configuration

### Environment Variables

Edit `/opt/bitebase/.env` with your values:

```bash
# Database (auto-configured)
DATABASE_URL=postgresql://bitebase:your_password@postgres:5432/bitebase_prod
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# Security
JWT_SECRET=your_super_secure_jwt_secret_32_chars_minimum

# API Keys
OPENAI_API_KEY=sk-your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Domain Configuration
DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com/api
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# AWS (optional for file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=bitebase-uploads-prod
```

### SSL Certificate Setup

#### Option 1: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Option 2: Self-Signed (Development)

The deployment script automatically generates self-signed certificates.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BiteBase Full-Stack                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │     Nginx       │    │   PostgreSQL    │                │
│  │  (Port 80/443)  │    │   (Port 5432)   │                │
│  │                 │    │                 │                │
│  │ • SSL Termination│    │ • Database      │                │
│  │ • Load Balancer │    │ • Persistence   │                │
│  │ • Static Files  │    │ • Backups       │                │
│  └─────────┬───────┘    └─────────────────┘                │
│            │                                                │
│  ┌─────────▼───────┐    ┌─────────────────┐                │
│  │   Frontend      │    │     Redis       │                │
│  │  (Port 3000)    │    │   (Port 6379)   │                │
│  │                 │    │                 │                │
│  │ • Next.js       │    │ • Session Cache │                │
│  │ • React UI      │    │ • Rate Limiting │                │
│  │ • Static Assets │    │ • Temp Storage  │                │
│  └─────────────────┘    └─────────────────┘                │
│            │                                                │
│  ┌─────────▼───────┐                                        │
│  │    Backend      │                                        │
│  │  (Port 8000)    │                                        │
│  │                 │                                        │
│  │ • Express API   │                                        │
│  │ • Authentication│                                        │
│  │ • Business Logic│                                        │
│  │ • AI Integration│                                        │
│  └─────────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Management Commands

### Deployment Commands

```bash
cd /opt/bitebase

# Deploy/Update
./deploy-fullstack.sh

# Start services
./deploy-fullstack.sh start

# Stop services
./deploy-fullstack.sh stop

# Restart services
./deploy-fullstack.sh restart

# View logs
./deploy-fullstack.sh logs

# Check status
./deploy-fullstack.sh status

# Health check
./deploy-fullstack.sh health

# Create backup
./deploy-fullstack.sh backup
```

### Docker Commands

```bash
cd /opt/bitebase

# View running containers
docker-compose -f docker-compose.fullstack.yml ps

# View logs for specific service
docker-compose -f docker-compose.fullstack.yml logs bitebase-backend
docker-compose -f docker-compose.fullstack.yml logs bitebase-frontend

# Execute command in container
docker-compose -f docker-compose.fullstack.yml exec bitebase-backend bash

# Rebuild specific service
docker-compose -f docker-compose.fullstack.yml build bitebase-backend
```

### Database Management

```bash
# Access PostgreSQL
docker exec -it bitebase-postgres psql -U bitebase -d bitebase_prod

# Create backup
docker exec bitebase-postgres pg_dump -U bitebase bitebase_prod > backup.sql

# Restore backup
docker exec -i bitebase-postgres psql -U bitebase -d bitebase_prod < backup.sql

# View database logs
docker logs bitebase-postgres
```

## 📊 Monitoring & Health Checks

### Built-in Health Checks

The deployment includes automatic health monitoring:

- **Backend API**: `https://yourdomain.com/api/health`
- **Frontend**: `https://yourdomain.com/`
- **Database**: PostgreSQL connection check
- **Cache**: Redis connection check
- **Nginx**: Proxy health check

### Log Locations

```bash
# Application logs
/opt/bitebase/logs/

# Nginx logs
/var/log/nginx/

# Docker logs
docker-compose -f docker-compose.fullstack.yml logs

# System monitoring
/var/log/bitebase-monitor.log
```

### Monitoring Script

A monitoring script runs every 5 minutes to:
- Check service health
- Monitor disk usage
- Clean up old logs
- Restart failed services

## 🔒 Security Features

### Network Security
- **Firewall**: UFW configured for ports 22, 80, 443
- **SSL/TLS**: HTTPS-only with strong ciphers
- **HSTS**: HTTP Strict Transport Security enabled

### Application Security
- **Rate Limiting**: API and auth endpoints protected
- **CORS**: Configured for your domain only
- **Security Headers**: XSS, CSRF, and content type protection
- **Input Validation**: All inputs sanitized and validated

### Container Security
- **Non-root Users**: All containers run as non-root
- **Resource Limits**: Memory and CPU limits configured
- **Health Checks**: Automatic restart on failure

## 🚀 Performance Optimization

### Caching Strategy
- **Redis**: Session and data caching
- **Nginx**: Static file caching
- **Next.js**: Built-in optimization and caching

### Resource Optimization
- **Gzip Compression**: Enabled for all text content
- **Image Optimization**: Next.js automatic image optimization
- **Connection Pooling**: Database connection pooling
- **Keep-Alive**: HTTP keep-alive connections

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Pull latest code
cd ~/beta-bitebase-app
git pull

# Redeploy
cd aws-deployment
./deploy-fullstack.sh
```

### Regular Maintenance

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
cd /opt/bitebase
docker-compose -f docker-compose.fullstack.yml pull
docker-compose -f docker-compose.fullstack.yml up -d

# Clean up old Docker images
docker system prune -f

# Backup database
./deploy-fullstack.sh backup
```

## 🐛 Troubleshooting

### Common Issues

1. **Services won't start**:
   ```bash
   # Check logs
   ./deploy-fullstack.sh logs
   
   # Check disk space
   df -h
   
   # Restart services
   ./deploy-fullstack.sh restart
   ```

2. **SSL certificate issues**:
   ```bash
   # Check certificate
   sudo certbot certificates
   
   # Renew certificate
   sudo certbot renew
   ```

3. **Database connection issues**:
   ```bash
   # Check database logs
   docker logs bitebase-postgres
   
   # Test connection
   docker exec -it bitebase-postgres psql -U bitebase -d bitebase_prod -c "SELECT 1;"
   ```

4. **High memory usage**:
   ```bash
   # Check memory usage
   free -h
   
   # Restart services to free memory
   ./deploy-fullstack.sh restart
   ```

### Log Analysis

```bash
# Check application errors
tail -f /opt/bitebase/logs/app.log

# Check nginx errors
sudo tail -f /var/log/nginx/error.log

# Check system logs
sudo journalctl -u docker -f

# Check monitoring logs
tail -f /var/log/bitebase-monitor.log
```

## 💰 Cost Optimization

### EC2 Instance Optimization
- Use **Reserved Instances** for predictable workloads
- Monitor usage with **CloudWatch**
- Set up **billing alerts**
- Use **Spot Instances** for development

### Storage Optimization
- Regular log cleanup (automated)
- Database optimization and indexing
- Image compression and optimization
- S3 lifecycle policies for backups

## 📞 Support

### Getting Help

1. **Check logs first**: Most issues are visible in logs
2. **Health checks**: Use built-in health endpoints
3. **Documentation**: Refer to this guide and component docs
4. **Community**: Check GitHub issues and discussions

### Emergency Procedures

1. **Service Outage**:
   ```bash
   ./deploy-fullstack.sh health
   ./deploy-fullstack.sh restart
   ```

2. **Database Issues**:
   ```bash
   ./deploy-fullstack.sh backup
   # Restore from backup if needed
   ```

3. **High Traffic**:
   ```bash
   # Scale horizontally (requires load balancer)
   # Or upgrade EC2 instance type
   ```

## 🎉 Success!

Your BiteBase application is now running with:

✅ **Full-Stack Deployment** - Frontend + Backend + Database  
✅ **Production Security** - SSL, firewalls, security headers  
✅ **Auto-Scaling** - Health checks and auto-restart  
✅ **Monitoring** - Logs, health checks, alerts  
✅ **Backup Strategy** - Automated database backups  
✅ **Performance** - Caching, compression, optimization  

**Access your application**: `https://your-domain.com`

Happy coding! 🚀