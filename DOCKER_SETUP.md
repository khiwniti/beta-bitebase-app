# BiteBase Docker Setup Guide

## Overview

BiteBase includes comprehensive Docker configurations for both development and production environments.

## Available Docker Configurations

### 1. Full Stack Development (`docker-compose.yml`)
Complete development environment with all services:
- Frontend applications (user, staff, tools, workflows, backend-tasks)
- Backend services (user-backend, staff-backend, copilotkit, mcp-gateway, langgraph-agent)
- Infrastructure (PostgreSQL, Redis, Ollama, Prometheus, Grafana)
- Reverse proxy (Nginx)

```bash
docker-compose up -d
```

### 2. Production Backend (`docker-compose.backend.yml`)
Optimized for production deployment with:
- PostgreSQL database with PostGIS
- Redis cache
- Production-ready backend
- Optional Nginx reverse proxy

```bash
docker-compose -f docker-compose.backend.yml up -d
```

### 3. Simple Backend Test (`docker-test.yml`)
Minimal setup for testing backend Docker build:

```bash
docker-compose -f docker-test.yml up -d
```

## Backend Docker Features

### Multi-stage Build
- **Builder stage**: Installs dependencies and builds application
- **Production stage**: Optimized runtime with minimal footprint

### Security Features
- Non-root user execution
- Minimal Alpine Linux base
- Security headers and middleware
- Environment variable configuration

### Health Checks
- Built-in health check endpoint (`/health`)
- Docker health check configuration
- Automatic restart on failure

### Environment Variables

#### Core Configuration
- `NODE_ENV`: Environment (production/development)
- `PORT`: Server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

#### Security
- `JWT_SECRET`: JWT signing secret
- `ENCRYPTION_KEY`: Data encryption key
- `SESSION_SECRET`: Session signing secret

#### External Services
- `OPENAI_API_KEY`: OpenAI API key
- `STRIPE_SECRET_KEY`: Stripe payment processing
- `SENDGRID_API_KEY`: Email service
- `GOOGLE_MAPS_API_KEY`: Maps integration

## Quick Start

### Development
```bash
# Start full development stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Backend Only
```bash
# Start production backend
docker-compose -f docker-compose.backend.yml up -d

# Check health
curl http://localhost:3001/health

# View backend logs
docker-compose -f docker-compose.backend.yml logs backend
```

### Simple Test
```bash
# Test backend Docker build
docker-compose -f docker-test.yml up -d

# Check if running
docker ps

# Test health endpoint
curl http://localhost:3001/health
```

## Environment Setup

Create a `.env` file with required variables:

```env
# Database
POSTGRES_DB=bitebase_production
POSTGRES_USER=bitebase
POSTGRES_PASSWORD=your_secure_password

# Redis
REDIS_PASSWORD=your_redis_password

# Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
ENCRYPTION_KEY=your-32-character-encryption-key
SESSION_SECRET=your-session-secret-minimum-32-characters

# External APIs (optional)
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
```

## Monitoring

### Health Checks
- Backend: `http://localhost:3001/health`
- Database: Built-in PostgreSQL health check
- Redis: Built-in Redis health check

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Follow logs
docker-compose logs -f --tail=100 backend
```

### Metrics (Full Stack)
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3005` (admin/admin)

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3001, 5432, 6379 are available
2. **Permission errors**: Check Docker daemon permissions
3. **Build failures**: Ensure sufficient disk space and memory

### Debug Commands
```bash
# Check container status
docker ps -a

# Inspect container
docker inspect <container_name>

# Execute shell in container
docker exec -it <container_name> /bin/sh

# View container logs
docker logs <container_name>
```

## Production Deployment

### Render.com
The backend is optimized for Render.com deployment:
1. Use `docker-compose.backend.yml`
2. Set environment variables in Render dashboard
3. Configure health check endpoint: `/health`

### Other Platforms
The Docker configuration works with:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## Current Status

✅ **Working Components:**
- Frontend with modern Vercel-inspired theme
- Simple backend API (port 8000)
- Docker configurations ready
- Health check endpoints
- Production-ready Dockerfile

🔄 **Ready for Deployment:**
- Docker backend can be built and deployed
- Environment variables configured
- Health checks implemented
- Security middleware in place

## Next Steps

1. **Deploy Backend**: Use Docker configuration for production
2. **Environment Setup**: Configure production environment variables
3. **Database Migration**: Run database schema setup
4. **Monitoring**: Set up logging and metrics collection