# 🌐 Custom Domain Setup Guide: beta.bitebase.app

Complete guide to set up your custom domain with HTTPS, SSL certificates, and production deployment.

## 🎯 Overview

This guide will help you set up:
- ✅ **Custom Domain**: `https://beta.bitebase.app`
- ✅ **SSL Certificate**: Free Let's Encrypt certificate
- ✅ **Reverse Proxy**: Nginx for routing frontend and API
- ✅ **Production Ready**: Optimized for performance and security

## 📋 Prerequisites

1. **Domain Ownership**: You own `bitebase.app` domain
2. **DNS Access**: Can create DNS records
3. **EC2 Instance**: Running with Docker containers
4. **Security Group**: Ports 80 and 443 open

## 🚀 Step 1: DNS Configuration

### Configure DNS Records

Point your domain to your EC2 instance:

```dns
# A Record
beta.bitebase.app → YOUR_EC2_PUBLIC_IP

# Example:
beta.bitebase.app → 3.104.119.79
```

### Verify DNS Propagation

```bash
# Check if DNS is working
nslookup beta.bitebase.app
dig beta.bitebase.app

# Should return your EC2 IP address
```

## 🔧 Step 2: Security Group Configuration

### Open Required Ports

In your AWS Security Group, ensure these ports are open:

```
Port 80 (HTTP)  - Source: 0.0.0.0/0
Port 443 (HTTPS) - Source: 0.0.0.0/0
Port 22 (SSH)   - Source: Your IP
```

## 🛠️ Step 3: Run the Setup Script

### On Your EC2 Instance

```bash
# Navigate to your project
cd ~/beta-bitebase-app

# Pull latest changes
git pull origin main

# Run the domain setup script
./setup-domain.sh
```

### What the Script Does

1. **Installs Nginx** - Web server and reverse proxy
2. **Installs Certbot** - For Let's Encrypt SSL certificates
3. **Configures Nginx** - Routes frontend and API traffic
4. **Obtains SSL Certificate** - Free HTTPS certificate
5. **Sets up Auto-renewal** - Certificates renew automatically
6. **Creates Production Config** - Optimized for production

## 🏗️ Step 4: Architecture Overview

```
Internet → Nginx (Port 443) → Frontend (Port 3000)
                            → API (Port 8000)
                            → Database (Port 5432)
                            → Redis (Port 6379)
```

### URL Routing

| URL | Destination | Description |
|-----|-------------|-------------|
| `https://beta.bitebase.app/` | Frontend (Next.js) | Main application |
| `https://beta.bitebase.app/api/*` | FastAPI Backend | API endpoints |
| `https://beta.bitebase.app/docs` | FastAPI Docs | API documentation |
| `https://beta.bitebase.app/health` | Health Check | System status |

## 🚀 Step 5: Start Production Services

### Option 1: Use the Production Script

```bash
# Start all services
./start-production.sh
```

### Option 2: Manual Start

```bash
# 1. Start Docker containers (API, Database, Redis)
sudo docker-compose -f docker-compose.dev.turbo.yml up -d

# 2. Build and start frontend
cd apps/frontend
npm run build
npm start
```

### Option 3: Systemd Services (Recommended)

```bash
# Enable and start services
sudo systemctl enable bitebase-frontend
sudo systemctl start bitebase-frontend

# Check status
sudo systemctl status bitebase-frontend
```

## 🔍 Step 6: Verify Your Setup

### Test All Endpoints

```bash
# Frontend
curl -I https://beta.bitebase.app

# API Health
curl https://beta.bitebase.app/health

# API Restaurants
curl https://beta.bitebase.app/api/restaurants

# API Documentation
curl -I https://beta.bitebase.app/docs
```

### Browser Testing

1. **Frontend**: https://beta.bitebase.app
2. **API Docs**: https://beta.bitebase.app/docs
3. **Health Check**: https://beta.bitebase.app/health

### SSL Certificate Check

```bash
# Check SSL certificate
openssl s_client -connect beta.bitebase.app:443 -servername beta.bitebase.app

# Or use online tools:
# https://www.ssllabs.com/ssltest/
```

## 🛡️ Security Features

### Enabled Security Features

- ✅ **HTTPS Only** - HTTP redirects to HTTPS
- ✅ **Security Headers** - XSS, CSRF, Content-Type protection
- ✅ **HSTS** - HTTP Strict Transport Security
- ✅ **CORS** - Proper Cross-Origin Resource Sharing
- ✅ **SSL/TLS** - Modern encryption protocols

### Security Headers Applied

```nginx
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self' http: https: data: blob: 'unsafe-inline'
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## ⚡ Performance Optimizations

### Enabled Optimizations

- ✅ **GZIP Compression** - Reduces bandwidth usage
- ✅ **Static File Caching** - 1-year cache for assets
- ✅ **HTTP/2** - Faster protocol support
- ✅ **Connection Keep-Alive** - Reduces connection overhead

## 🔄 Maintenance

### SSL Certificate Renewal

Certificates auto-renew, but you can manually renew:

```bash
# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Application Logs

```bash
# Docker container logs
sudo docker-compose -f docker-compose.dev.turbo.yml logs -f

# Frontend logs (if using systemd)
sudo journalctl -u bitebase-frontend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

## 🚨 Troubleshooting

### Common Issues

**1. DNS Not Propagating**
```bash
# Check DNS
nslookup beta.bitebase.app
# Wait up to 24 hours for global propagation
```

**2. SSL Certificate Failed**
```bash
# Check if domain points to server
curl -I http://beta.bitebase.app
# Ensure ports 80/443 are open
```

**3. 502 Bad Gateway**
```bash
# Check if backend services are running
sudo docker ps
curl http://localhost:8000/health
curl http://localhost:3000
```

**4. Frontend Not Loading**
```bash
# Check if frontend is built and running
cd apps/frontend
npm run build
npm start
```

### Reset Everything

```bash
# Stop all services
sudo systemctl stop nginx
sudo docker-compose -f docker-compose.dev.turbo.yml down

# Remove SSL certificates (if needed)
sudo certbot delete --cert-name beta.bitebase.app

# Restart setup
./setup-domain.sh
```

## 📊 Monitoring

### Health Checks

```bash
# API Health
curl https://beta.bitebase.app/health

# Frontend Health
curl -I https://beta.bitebase.app

# SSL Certificate Expiry
curl -I https://beta.bitebase.app | grep -i date
```

### Performance Testing

```bash
# Load testing with curl
for i in {1..10}; do
  curl -w "%{time_total}\n" -o /dev/null -s https://beta.bitebase.app
done

# Or use online tools:
# https://gtmetrix.com/
# https://pagespeed.web.dev/
```

## 🎉 Success Checklist

After setup, verify these work:

- [ ] ✅ `https://beta.bitebase.app` loads the frontend
- [ ] ✅ `https://beta.bitebase.app/docs` shows API documentation
- [ ] ✅ `https://beta.bitebase.app/health` returns health status
- [ ] ✅ `https://beta.bitebase.app/api/restaurants` returns restaurant data
- [ ] ✅ SSL certificate is valid (green lock in browser)
- [ ] ✅ HTTP redirects to HTTPS
- [ ] ✅ All security headers are present
- [ ] ✅ GZIP compression is working

## 🔗 Useful Commands

### Quick Status Check

```bash
# One-liner to check everything
echo "🔍 Checking BiteBase Status..." && \
curl -s https://beta.bitebase.app/health | jq && \
echo "✅ Frontend: $(curl -s -o /dev/null -w "%{http_code}" https://beta.bitebase.app)" && \
echo "✅ API: $(curl -s -o /dev/null -w "%{http_code}" https://beta.bitebase.app/api/restaurants)" && \
echo "✅ Docs: $(curl -s -o /dev/null -w "%{http_code}" https://beta.bitebase.app/docs)"
```

### Backup Configuration

```bash
# Backup nginx config
sudo cp /etc/nginx/sites-available/beta.bitebase.app ~/nginx-backup-$(date +%Y%m%d).conf

# Backup SSL certificates
sudo tar -czf ~/ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

---

## 🎯 Next Steps

After your domain is set up:

1. **Update DNS for subdomains** (if needed):
   - `api.beta.bitebase.app` → API only
   - `admin.beta.bitebase.app` → Admin panel

2. **Set up monitoring**:
   - Uptime monitoring
   - Performance monitoring
   - Error tracking

3. **Configure CDN** (optional):
   - CloudFlare for global performance
   - AWS CloudFront integration

4. **Set up CI/CD**:
   - Automated deployments
   - GitHub Actions integration

Your BiteBase application is now running on a custom domain with enterprise-grade security and performance! 🚀