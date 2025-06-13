# BiteBase AWS EC2 Deployment Guide

## Overview

This guide provides complete instructions for deploying BiteBase to AWS EC2 with Docker, including production-ready configurations for security, monitoring, and scalability.

## Prerequisites

- AWS Account with EC2 access
- Domain name (optional but recommended)
- Basic knowledge of AWS services
- SSH access to EC2 instance

## Quick Start

### 1. Launch EC2 Instance

**Recommended Instance Type:** t3.medium or larger
**Operating System:** Ubuntu 22.04 LTS
**Storage:** 20GB+ SSD
**Security Group:** Allow ports 22, 80, 443, 8000

### 2. Initial Server Setup

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Download and run the setup script
wget https://raw.githubusercontent.com/your-repo/beta-bitebase-app/main/aws-deployment/ec2-setup.sh
chmod +x ec2-setup.sh
./ec2-setup.sh

# Reboot the instance
sudo reboot
```

### 3. Deploy BiteBase

```bash
# Clone the repository
git clone https://github.com/your-repo/beta-bitebase-app.git
cd beta-bitebase-app/aws-deployment

# Configure environment variables
cp .env.production.example .env
nano .env  # Edit with your actual values

# Deploy the application
./deploy.sh
```

## Detailed Setup Instructions

### Environment Configuration

Create a `.env` file with your production values:

```bash
# Database Configuration
DATABASE_URL=postgresql://bitebase:your_password@postgres:5432/bitebase_prod
POSTGRES_PASSWORD=your_secure_postgres_password

# Redis Configuration
REDIS_PASSWORD=your_secure_redis_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=sk-your_openai_api_key

# Google Maps Configuration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=bitebase-uploads-prod

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Domain Configuration
DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### SSL Certificate Setup

#### Option 1: Let's Encrypt (Recommended for production)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Stop nginx temporarily
sudo systemctl stop nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to deployment directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/bitebase/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/bitebase/ssl/key.pem
sudo chown -R $USER:$USER /opt/bitebase/ssl/

# Restart services
./deploy.sh restart
```

#### Option 2: Self-signed (Development only)

The deployment script automatically generates self-signed certificates for development.

### AWS Services Integration

#### S3 Bucket Setup

```bash
# Create S3 bucket for uploads
aws s3 mb s3://bitebase-uploads-prod

# Set bucket policy for public read access to uploads
aws s3api put-bucket-policy --bucket bitebase-uploads-prod --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bitebase-uploads-prod/public/*"
    }
  ]
}'
```

#### CloudWatch Setup

```bash
# Configure CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
    -s

# Start CloudWatch agent
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent
```

#### RDS Setup (Optional - for managed database)

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
    --db-instance-identifier bitebase-prod \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username bitebase \
    --master-user-password your_secure_password \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-your-security-group \
    --db-subnet-group-name your-subnet-group

# Update DATABASE_URL in .env to point to RDS endpoint
```

## Management Commands

### Deployment Commands

```bash
# Deploy/Update application
./deploy.sh

# Start services
./deploy.sh start

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# View logs
./deploy.sh logs

# Check health
./deploy.sh health

# Create backup
./deploy.sh backup
```

### Docker Commands

```bash
# View running containers
docker-compose -f docker-compose.aws.yml ps

# View logs for specific service
docker-compose -f docker-compose.aws.yml logs bitebase-backend

# Execute command in container
docker-compose -f docker-compose.aws.yml exec bitebase-backend bash

# Scale services (if needed)
docker-compose -f docker-compose.aws.yml up -d --scale bitebase-backend=2
```

### Database Management

```bash
# Access PostgreSQL
docker-compose -f docker-compose.aws.yml exec postgres psql -U bitebase -d bitebase_prod

# Create database backup
docker exec bitebase-postgres pg_dump -U bitebase bitebase_prod > backup.sql

# Restore database backup
docker exec -i bitebase-postgres psql -U bitebase -d bitebase_prod < backup.sql

# Run migrations (if needed)
docker-compose -f docker-compose.aws.yml exec bitebase-backend npm run db:migrate
```

## Monitoring and Maintenance

### Health Checks

The deployment includes automatic health checks for:
- Backend API (`/health` endpoint)
- Database connectivity
- Redis connectivity
- Nginx proxy

### Log Management

Logs are automatically rotated and can be found in:
- Application logs: `/opt/bitebase/logs/`
- Nginx logs: `/var/log/nginx/`
- Docker logs: `docker-compose logs`

### Monitoring Script

A monitoring script runs every 5 minutes to check:
- Service health
- Disk usage
- Memory usage
- Log cleanup

### Backup Strategy

Automated daily backups include:
- Database dump
- Uploaded files
- Configuration files

Backups are stored locally and can be configured to upload to S3.

## Security Considerations

### Firewall Configuration

```bash
# Check firewall status
sudo ufw status

# Allow specific IPs only (recommended)
sudo ufw allow from YOUR_IP_ADDRESS to any port 22
sudo ufw deny 22
```

### SSL/TLS Configuration

- TLS 1.2+ only
- Strong cipher suites
- HSTS headers
- Security headers (XSS, CSRF protection)

### Database Security

- Non-root database user
- Strong passwords
- Network isolation
- Regular security updates

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   sudo netstat -tulpn | grep :8000
   sudo systemctl stop nginx  # If needed
   ```

2. **Permission issues**
   ```bash
   sudo chown -R $USER:$USER /opt/bitebase
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Database connection issues**
   ```bash
   docker-compose -f docker-compose.aws.yml logs postgres
   ```

### Log Analysis

```bash
# Check application logs
tail -f /opt/bitebase/logs/app.log

# Check nginx logs
tail -f /var/log/nginx/error.log

# Check system logs
sudo journalctl -u docker -f
```

### Performance Optimization

1. **Enable Redis caching**
2. **Configure CDN for static assets**
3. **Optimize database queries**
4. **Enable gzip compression**
5. **Use connection pooling**

## Scaling Considerations

### Horizontal Scaling

```bash
# Scale backend instances
docker-compose -f docker-compose.aws.yml up -d --scale bitebase-backend=3

# Use load balancer (ALB/ELB)
# Configure auto-scaling groups
```

### Vertical Scaling

- Upgrade EC2 instance type
- Increase storage capacity
- Optimize memory allocation

## Cost Optimization

1. **Use Reserved Instances for predictable workloads**
2. **Enable CloudWatch detailed monitoring**
3. **Set up billing alerts**
4. **Use S3 lifecycle policies for backups**
5. **Optimize Docker image sizes**

## Support and Maintenance

### Regular Maintenance Tasks

- [ ] Update system packages monthly
- [ ] Renew SSL certificates (automated with Let's Encrypt)
- [ ] Review and rotate secrets quarterly
- [ ] Monitor disk usage and clean up logs
- [ ] Update Docker images for security patches
- [ ] Review CloudWatch metrics and alerts

### Emergency Procedures

1. **Service outage**: Check health endpoints and restart services
2. **Database issues**: Restore from latest backup
3. **Security breach**: Rotate all secrets and review access logs
4. **High traffic**: Scale horizontally or upgrade instance

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

For support, please check the main repository documentation or create an issue.