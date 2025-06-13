#!/bin/bash

# 🚀 BiteBase One-Command Setup Script
# This script will clean everything and set up BiteBase from scratch

set -e

echo "🧹 Starting BiteBase Clean Setup..."
echo "This will remove all existing containers and start fresh."
echo ""

# Navigate to project directory
cd /opt/bitebase

echo "🛑 Step 1: Stopping and cleaning old containers..."
docker-compose down -v 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
docker volume prune -f
docker network prune -f

echo "🗑️ Step 2: Cleaning old files..."
rm -f docker-compose*.yml
rm -rf apps/ backend-app/ node_modules/ .next/ dist/ build/ logs/
rm -f package-lock.json yarn.lock .env.local .env.production

echo "📝 Step 3: Creating clean configuration..."

# Create simple docker-compose.yml
cat > docker-compose.yml << 'EOF'
services:
  # Main BiteBase Application
  app:
    image: node:18-alpine
    container_name: bitebase-app
    working_dir: /app
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://bitebase:password123@postgres:5432/bitebase
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped
    command: sh -c "
      echo '🔧 Installing dependencies...' &&
      npm install --legacy-peer-deps --force &&
      echo '🚀 Starting BiteBase...' &&
      npm run dev
    "

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: bitebase-postgres
    environment:
      POSTGRES_USER: bitebase
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: bitebase
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bitebase"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: bitebase-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
EOF

# Create clean environment file
cat > .env << 'EOF'
# =============================================================================
# BiteBase Environment Configuration
# =============================================================================

# Database
DATABASE_URL=postgresql://bitebase:password123@postgres:5432/bitebase
POSTGRES_USER=bitebase
POSTGRES_PASSWORD=password123
POSTGRES_DB=bitebase

# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT Secret (change this in production!)
JWT_SECRET=bitebase_jwt_secret_key_change_this_in_production_make_it_long_and_secure

# Redis
REDIS_URL=redis://redis:6379

# =============================================================================
# Optional API Keys (uncomment and add your keys when ready)
# =============================================================================

# Authentication
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
# CLERK_SECRET_KEY=sk_test_your_clerk_secret

# AI Features
# OPENAI_API_KEY=sk-your_openai_key

# Maps
# GOOGLE_MAPS_API_KEY=your_google_maps_key

# AWS (for file uploads)
# AWS_ACCESS_KEY_ID=your_aws_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret
# AWS_REGION=us-east-1
# S3_BUCKET_NAME=your_bucket

# Payment
# STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
# STRIPE_SECRET_KEY=sk_test_your_stripe_secret
EOF

echo "🐳 Step 4: Starting BiteBase services..."
docker-compose up -d

echo "⏳ Step 5: Waiting for services to start..."
sleep 30

echo "📊 Step 6: Checking service status..."
docker-compose ps

echo ""
echo "🔍 Step 7: Testing services..."

# Test database
echo "Database status:"
docker exec bitebase-postgres pg_isready -U bitebase || echo "❌ Database not ready"

# Test Redis
echo "Redis status:"
docker exec bitebase-redis redis-cli ping || echo "❌ Redis not ready"

# Test application
echo "Application status:"
curl -f http://localhost:3000 >/dev/null 2>&1 && echo "✅ Frontend is running" || echo "⏳ Frontend starting..."

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

echo ""
echo "🎉 BiteBase Setup Complete!"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "🌐 Access Your Application:"
echo "  Frontend: http://$PUBLIC_IP:3000"
echo "  Database: $PUBLIC_IP:5432"
echo "  Redis: $PUBLIC_IP:6379"
echo ""
echo "📋 Useful Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Check status: docker-compose ps"
echo ""
echo "🔧 Next Steps:"
echo "  1. Edit .env file to add your API keys"
echo "  2. Set up SSL: sudo certbot --nginx"
echo "  3. Configure your domain DNS"
echo ""
echo "📝 View application logs:"
echo "  docker-compose logs -f app"
echo ""
echo "💡 If you see any issues, check the logs above!"

# Show recent logs
echo ""
echo "📋 Recent Application Logs:"
docker-compose logs --tail=20 app