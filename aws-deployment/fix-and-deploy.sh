#!/bin/bash

# Fix and Deploy BiteBase
# Run this after the quick-setup.sh script

set -e

echo "🔧 Fixing project setup and deploying BiteBase..."

# Copy project files from correct location
echo "📁 Copying project files..."
sudo cp -r /home/ec2-user/beta-bitebase-app/* /opt/bitebase/
sudo chown -R ec2-user:ec2-user /opt/bitebase/

# Navigate to project directory
cd /opt/bitebase

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
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
fi

# Check if user is in docker group
if groups $USER | grep -q '\bdocker\b'; then
    echo "✅ User is in docker group"
    
    # Start the application
    echo "🚀 Starting BiteBase application..."
    docker-compose up -d
    
    # Wait a moment for services to start
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Check status
    echo "📊 Checking service status..."
    docker-compose ps
    
    # Test health endpoints
    echo "🔍 Testing health endpoints..."
    echo "Backend health:"
    curl -f http://localhost:8000/health || echo "❌ Backend not ready yet"
    
    echo "Frontend health:"
    curl -f http://localhost:3000 || echo "❌ Frontend not ready yet"
    
    # Get public IP
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    
    echo ""
    echo "🎉 Deployment completed!"
    echo "📊 Access your application:"
    echo "  Frontend: http://$PUBLIC_IP"
    echo "  Backend API: http://$PUBLIC_IP/api/health"
    echo "  Direct Backend: http://$PUBLIC_IP:8000/health"
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop services: docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Check status: docker-compose ps"
    
else
    echo "⚠️  User is not in docker group yet."
    echo "Please log out and log back in, then run this script again:"
    echo ""
    echo "  exit"
    echo "  ssh -i your-key.pem ec2-user@your-instance-ip"
    echo "  cd /opt/bitebase"
    echo "  ./aws-deployment/fix-and-deploy.sh"
fi