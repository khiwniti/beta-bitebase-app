#!/bin/bash

# Quick BiteBase Setup Script for Amazon Linux 2023
# Avoids package conflicts and gets you running quickly

set -e

echo "🚀 Quick BiteBase Setup for Amazon Linux 2023..."

# Skip curl installation (already installed) and install other packages
echo "📦 Installing essential packages (skipping curl)..."
sudo yum install -y --skip-broken \
    wget \
    git \
    unzip \
    htop \
    nginx \
    python3-certbot-nginx

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js 18 LTS
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create directories
echo "📁 Creating directories..."
sudo mkdir -p /opt/bitebase
sudo chown ec2-user:ec2-user /opt/bitebase
sudo mkdir -p /var/log/bitebase
sudo chown ec2-user:ec2-user /var/log/bitebase

# Start and enable Nginx
echo "🌐 Setting up Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Create basic Nginx config
sudo tee /etc/nginx/conf.d/bitebase.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

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

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Copy project files to /opt/bitebase
echo "📁 Setting up project directory..."
cp -r ~/beta-bitebase-app/* /opt/bitebase/
cd /opt/bitebase

# Create environment file
echo "📝 Creating environment file..."
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://bitebase:secure_password_123@localhost:5432/bitebase"
POSTGRES_USER=bitebase
POSTGRES_PASSWORD=secure_password_123
POSTGRES_DB=bitebase

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# API Configuration
API_PORT=8000
FRONTEND_PORT=3000
NODE_ENV=production

# External APIs (add your keys)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Domain Configuration
DOMAIN=localhost
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

echo "✅ Quick setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Log out and log back in to apply Docker group membership:"
echo "   exit"
echo "   ssh -i your-key.pem ec2-user@your-instance-ip"
echo ""
echo "2. Navigate to project directory:"
echo "   cd /opt/bitebase"
echo ""
echo "3. Start the application:"
echo "   docker-compose up -d"
echo ""
echo "4. Check if it's running:"
echo "   docker-compose ps"
echo "   curl http://localhost:8000/health"
echo ""
echo "5. Access your application:"
echo "   http://your-instance-public-ip"
echo ""
echo "⚠️  Remember to:"
echo "   • Edit /opt/bitebase/.env with your actual API keys"
echo "   • Set up SSL with: sudo certbot --nginx"
echo "   • Configure your domain DNS"