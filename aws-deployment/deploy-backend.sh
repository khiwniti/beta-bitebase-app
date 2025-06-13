#!/bin/bash

# 🚀 BiteBase Backend Deployment Script for EC2
# This script deploys only the FastAPI backend with PostgreSQL and Redis

set -e

echo "🚀 Starting BiteBase Backend Deployment..."
echo "This will deploy FastAPI backend with PostgreSQL and Redis on EC2"
echo ""

# Navigate to project directory
cd /opt/bitebase

echo "🛑 Step 1: Stopping existing containers..."
docker-compose -f docker-compose.backend.yml down -v 2>/dev/null || true
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "🧹 Step 2: Cleaning up..."
docker volume prune -f
docker network prune -f

echo "📝 Step 3: Starting FastAPI Backend Services..."
docker-compose -f docker-compose.backend.yml up -d

echo "⏳ Step 4: Waiting for services to start..."
sleep 30

echo "📊 Step 5: Checking service status..."
docker-compose -f docker-compose.backend.yml ps

echo ""
echo "🔍 Step 6: Testing services..."

# Test database
echo "Database status:"
docker exec bitebase-postgres pg_isready -U bitebase || echo "❌ Database not ready"

# Test Redis
echo "Redis status:"
docker exec bitebase-redis redis-cli ping || echo "❌ Redis not ready"

# Test API
echo "API status:"
curl -f http://localhost:8000/health >/dev/null 2>&1 && echo "✅ API is running" || echo "⏳ API starting..."

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

echo ""
echo "🎉 BiteBase Backend Deployment Complete!"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.backend.yml ps
echo ""
echo "🌐 Access Your Backend API:"
echo "  API Base URL: http://$PUBLIC_IP:8000"
echo "  API Documentation: http://$PUBLIC_IP:8000/docs"
echo "  Health Check: http://$PUBLIC_IP:8000/health"
echo "  Restaurants API: http://$PUBLIC_IP:8000/api/restaurants"
echo "  Menu API: http://$PUBLIC_IP:8000/api/menu"
echo ""
echo "🗄️ Database & Cache:"
echo "  PostgreSQL: $PUBLIC_IP:5432"
echo "  Redis: $PUBLIC_IP:6379"
echo ""
echo "📋 Useful Commands:"
echo "  View API logs: docker-compose -f docker-compose.backend.yml logs -f api"
echo "  Stop services: docker-compose -f docker-compose.backend.yml down"
echo "  Restart: docker-compose -f docker-compose.backend.yml restart"
echo "  Check status: docker-compose -f docker-compose.backend.yml ps"
echo ""
echo "🔧 For Vercel Frontend:"
echo "  Set NEXT_PUBLIC_API_URL=http://$PUBLIC_IP:8000"
echo ""
echo "🔒 Security Group Settings:"
echo "  Make sure port 8000 is open in your EC2 security group"
echo ""
echo "📝 Recent API Logs:"
docker-compose -f docker-compose.backend.yml logs --tail=20 api