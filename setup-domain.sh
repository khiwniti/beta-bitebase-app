#!/bin/bash

# 🌐 BiteBase Custom Domain Setup Script
# Sets up https://beta.bitebase.app with SSL certificates

set -e

DOMAIN="beta.bitebase.app"
EMAIL="admin@bitebase.app"  # Change this to your email

echo "🌐 Setting up custom domain: $DOMAIN"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root for security reasons"
   echo "Please run as a regular user with sudo privileges"
   exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install -y nginx
fi

# Install Certbot for Let's Encrypt SSL
if ! command -v certbot &> /dev/null; then
    echo "🔒 Installing Certbot for SSL certificates..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Stop Nginx temporarily
echo "⏸️ Stopping Nginx temporarily..."
sudo systemctl stop nginx

# Create nginx configuration directory if it doesn't exist
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# Copy our nginx configuration
echo "⚙️ Setting up Nginx configuration..."
sudo cp nginx/beta.bitebase.app.conf /etc/nginx/sites-available/beta.bitebase.app

# Create a temporary configuration for SSL certificate generation
echo "🔒 Creating temporary configuration for SSL setup..."
sudo tee /etc/nginx/sites-available/beta.bitebase.app.temp > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF

# Enable the temporary site
sudo ln -sf /etc/nginx/sites-available/beta.bitebase.app.temp /etc/nginx/sites-enabled/beta.bitebase.app
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Start Nginx
echo "▶️ Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Get SSL certificate
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
echo "📧 Using email: $EMAIL"
echo "🌐 For domain: $DOMAIN"
echo ""
echo "⚠️  Make sure $DOMAIN points to this server's IP address!"
echo "   DNS A record: $DOMAIN -> $(curl -s ifconfig.me)"
echo ""
read -p "Press Enter when DNS is configured and propagated..."

# Obtain SSL certificate
sudo certbot certonly --webroot -w /var/www/html -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Check if certificate was obtained successfully
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Now use the full configuration with SSL
    echo "⚙️ Updating Nginx configuration with SSL..."
    sudo ln -sf /etc/nginx/sites-available/beta.bitebase.app /etc/nginx/sites-enabled/beta.bitebase.app
    
    # Test configuration
    sudo nginx -t
    
    # Reload Nginx
    sudo systemctl reload nginx
    
    echo "✅ Nginx reloaded with SSL configuration!"
else
    echo "❌ Failed to obtain SSL certificate"
    echo "Please check:"
    echo "1. DNS is pointing to this server"
    echo "2. Port 80 is open in security group"
    echo "3. Domain is accessible from internet"
    exit 1
fi

# Set up automatic certificate renewal
echo "🔄 Setting up automatic certificate renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Update frontend environment for production
echo "⚙️ Updating frontend environment..."
cat > apps/frontend/.env.production <<EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN
NEXT_PUBLIC_ENVIRONMENT=production
EOF

# Create systemd service for the application
echo "🚀 Creating systemd services..."

# Frontend service
sudo tee /etc/systemd/system/bitebase-frontend.service > /dev/null <<EOF
[Unit]
Description=BiteBase Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/beta-bitebase-app/apps/frontend
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_API_URL=https://$DOMAIN
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create a startup script for the full stack
cat > start-production.sh <<EOF
#!/bin/bash

echo "🚀 Starting BiteBase Production Environment..."

# Start Docker containers (API, Database, Redis)
echo "🐳 Starting Docker containers..."
sudo docker-compose -f docker-compose.dev.turbo.yml up -d

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 10

# Start frontend
echo "🌐 Starting frontend..."
cd apps/frontend
npm run build
npm start &

echo "✅ BiteBase is running at https://$DOMAIN"
echo "📊 API Documentation: https://$DOMAIN/docs"
echo "🔍 Health Check: https://$DOMAIN/health"
EOF

chmod +x start-production.sh

echo ""
echo "🎉 Domain setup complete!"
echo ""
echo "📋 Summary:"
echo "  🌐 Domain: https://$DOMAIN"
echo "  🔒 SSL: Let's Encrypt certificate installed"
echo "  ⚙️ Nginx: Configured as reverse proxy"
echo "  🔄 Auto-renewal: Enabled for SSL certificates"
echo ""
echo "🚀 Next steps:"
echo "1. Make sure your Docker containers are running:"
echo "   sudo docker-compose -f docker-compose.dev.turbo.yml up -d"
echo ""
echo "2. Start the frontend:"
echo "   cd apps/frontend && npm run build && npm start"
echo ""
echo "3. Or use the production startup script:"
echo "   ./start-production.sh"
echo ""
echo "🔍 Test your setup:"
echo "  • Frontend: https://$DOMAIN"
echo "  • API Docs: https://$DOMAIN/docs"
echo "  • Health: https://$DOMAIN/health"
echo ""
echo "🛡️ Security features enabled:"
echo "  ✅ HTTPS with Let's Encrypt"
echo "  ✅ Security headers"
echo "  ✅ GZIP compression"
echo "  ✅ Static file caching"
echo "  ✅ CORS configuration"
echo ""