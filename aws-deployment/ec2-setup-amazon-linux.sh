#!/bin/bash

# AWS EC2 Initial Setup Script for BiteBase (Amazon Linux 2023)
# Run this script on a fresh Amazon Linux EC2 instance to prepare it for BiteBase deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Amazon Linux EC2 instance for BiteBase...${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo yum update -y

# Install essential packages
echo -e "${YELLOW}📦 Installing essential packages...${NC}"
sudo yum install -y \
    curl \
    wget \
    git \
    unzip \
    htop \
    nginx \
    python3-certbot-nginx

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 18 LTS
echo -e "${YELLOW}📦 Installing Node.js 18 LTS...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
echo -e "${YELLOW}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Create application directory
echo -e "${YELLOW}📁 Creating application directories...${NC}"
sudo mkdir -p /opt/bitebase
sudo chown ec2-user:ec2-user /opt/bitebase

# Create logs directory
sudo mkdir -p /var/log/bitebase
sudo chown ec2-user:ec2-user /var/log/bitebase

# Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
sudo systemctl start nginx
sudo systemctl enable nginx

# Create Nginx configuration for BiteBase
sudo tee /etc/nginx/conf.d/bitebase.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Configure firewall (if firewalld is running)
if systemctl is-active --quiet firewalld; then
    echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --permanent --add-port=3000/tcp
    sudo firewall-cmd --permanent --add-port=8000/tcp
    sudo firewall-cmd --reload
fi

# Create environment file template
echo -e "${YELLOW}📝 Creating environment file template...${NC}"
cat > /opt/bitebase/.env.example << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://bitebase:your_password@localhost:5432/bitebase"
POSTGRES_USER=bitebase
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=bitebase

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# API Configuration
API_PORT=8000
FRONTEND_PORT=3000
NODE_ENV=production

# External APIs
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# AWS Configuration (for S3, etc.)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_s3_bucket

# Stripe Configuration (if using payments)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Domain Configuration
DOMAIN=your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
EOF

# Create deployment script
echo -e "${YELLOW}📝 Creating deployment script...${NC}"
cat > /opt/bitebase/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Deploying BiteBase..."

# Navigate to project directory
cd /opt/bitebase

# Pull latest changes
git pull origin main

# Build and start services
docker-compose down
docker-compose build
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check health
curl -f http://localhost:8000/health || echo "⚠️ Backend health check failed"
curl -f http://localhost:3000 || echo "⚠️ Frontend health check failed"

echo "✅ Deployment completed!"
EOF

chmod +x /opt/bitebase/deploy.sh

# Create backup script
echo -e "${YELLOW}📝 Creating backup script...${NC}"
cat > /opt/bitebase/backup.sh << 'EOF'
#!/bin/bash

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/bitebase/backups"

mkdir -p $BACKUP_DIR

echo "📦 Creating backup..."

# Backup database
docker-compose exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup uploaded files (if any)
if [ -d "/opt/bitebase/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" /opt/bitebase/uploads
fi

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed: $BACKUP_DIR"
EOF

chmod +x /opt/bitebase/backup.sh

# Set up log rotation
echo -e "${YELLOW}📝 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/bitebase > /dev/null << 'EOF'
/var/log/bitebase/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 ec2-user ec2-user
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Create systemd service for automatic startup
echo -e "${YELLOW}📝 Creating systemd service...${NC}"
sudo tee /etc/systemd/system/bitebase.service > /dev/null << 'EOF'
[Unit]
Description=BiteBase Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/bitebase
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ec2-user

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable bitebase

# Display system information
echo -e "${GREEN}✅ EC2 instance setup completed!${NC}"
echo -e "${BLUE}📊 System Information:${NC}"
echo -e "  OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo -e "  Docker: $(docker --version)"
echo -e "  Docker Compose: $(docker-compose --version)"
echo -e "  Node.js: $(node --version)"
echo -e "  NPM: $(npm --version)"
echo -e "  Nginx: $(nginx -v 2>&1)"

echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. Copy your project to /opt/bitebase/"
echo -e "2. Configure environment variables in /opt/bitebase/.env"
echo -e "3. Run the deployment: /opt/bitebase/deploy.sh"
echo -e "4. Set up SSL with: sudo certbot --nginx"
echo -e "5. Configure your domain DNS to point to this instance"

echo -e "${YELLOW}⚠️  Important:${NC}"
echo -e "  • Log out and log back in to apply Docker group membership"
echo -e "  • Configure your .env file before deployment"
echo -e "  • Set up regular backups with the backup script"
echo -e "  • Monitor logs in /var/log/bitebase/"

echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
EOF