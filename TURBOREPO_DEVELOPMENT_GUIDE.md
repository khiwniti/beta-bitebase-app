# 🚀 BiteBase Turborepo Development Guide

Complete guide for running both frontend and backend in parallel using Turborepo.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Turborepo Monorepo                      │
├─────────────────────┬───────────────────┬───────────────────┤
│   Frontend          │   FastAPI         │   Node.js         │
│   (Next.js)         │   (Python)        │   (Express)       │
│   Port: 3000        │   Port: 8000      │   Port: 4000      │
│                     │                   │                   │
│ • React Components  │ • REST API        │ • Legacy API      │
│ • Tailwind CSS      │ • Auto Docs       │ • Auth Routes     │
│ • TypeScript        │ • CORS Enabled    │ • Middleware      │
└─────────────────────┴───────────────────┴───────────────────┘
```

## 🚀 Quick Start

### Option 1: One Command Start (Recommended)

```bash
# Start everything with one command
./dev-start.sh
```

This will start:
- ✅ **Frontend** at http://localhost:3000
- ✅ **FastAPI** at http://localhost:8000
- ✅ **API Docs** at http://localhost:8000/docs

### Option 2: Manual Setup

```bash
# Install all dependencies
npm run setup

# Start all services in parallel
npm run dev

# Or start individual services
npm run dev:frontend    # Frontend only
npm run dev:api        # FastAPI only
npm run dev:backend    # Node.js backend only
```

### Option 3: Docker Development

```bash
# Start everything with Docker
docker-compose -f docker-compose.dev.turbo.yml up

# Or with database services
docker-compose -f docker-compose.dev.turbo.yml up -d
```

## 📁 Project Structure

```
bitebase/
├── apps/
│   ├── frontend/          # Next.js Frontend
│   │   ├── components/    # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── lib/           # API client & utilities
│   │   └── package.json   # Frontend dependencies
│   │
│   ├── api/              # FastAPI Backend (NEW)
│   │   ├── main.py       # FastAPI application
│   │   ├── requirements.txt
│   │   └── package.json  # For Turborepo integration
│   │
│   └── backend/          # Node.js Backend (Legacy)
│       ├── server-production.js
│       ├── routes/
│       └── package.json
│
├── turbo.json           # Turborepo configuration
├── package.json         # Root package.json
└── dev-start.sh         # Development startup script
```

## 🔧 Available Scripts

### Root Level Scripts

```bash
# Development
npm run dev              # Start all services
npm run dev:frontend     # Frontend only
npm run dev:api         # FastAPI only
npm run dev:backend     # Node.js backend only

# Production
npm run build           # Build all apps
npm run start           # Start all apps in production
npm run start:frontend  # Frontend production
npm run start:api      # FastAPI production

# Utilities
npm run lint           # Lint all apps
npm run check-types    # TypeScript checking
npm run format         # Format code
npm run setup          # Install all dependencies
```

### Individual App Scripts

**Frontend (apps/frontend):**
```bash
cd apps/frontend
npm run dev            # Development server
npm run build          # Production build
npm run start          # Production server
npm run lint           # ESLint
npm run check-types    # TypeScript check
```

**FastAPI (apps/api):**
```bash
cd apps/api
python -m uvicorn main:app --reload  # Development
python -m uvicorn main:app --workers 4  # Production
pip install -r requirements.txt     # Install dependencies
```

**Node.js Backend (apps/backend):**
```bash
cd apps/backend
npm run dev            # Development with nodemon
npm run start          # Production server
```

## 🌐 Service URLs

| Service | Development | Production | Description |
|---------|-------------|------------|-------------|
| Frontend | http://localhost:3000 | https://your-domain.com | Next.js React app |
| FastAPI | http://localhost:8000 | https://api.your-domain.com | Python REST API |
| API Docs | http://localhost:8000/docs | https://api.your-domain.com/docs | Interactive API docs |
| Node.js API | http://localhost:4000 | https://legacy-api.your-domain.com | Legacy Express API |

## 🔄 Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Start all services
./dev-start.sh

# Or use Turborepo directly
npm run dev
```

### 2. Make Changes

**Frontend Changes:**
- Edit files in `apps/frontend/`
- Hot reload automatically updates browser
- TypeScript errors show in terminal

**API Changes:**
- Edit `apps/api/main.py`
- FastAPI auto-reloads on file changes
- Test at http://localhost:8000/docs

### 3. Test Integration

```bash
# Test API connection from frontend
curl http://localhost:8000/health

# Test frontend API calls
# Open browser console at http://localhost:3000
# Check for API connection logs
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

**FastAPI (apps/api/.env):**
```env
ENVIRONMENT=development
DATABASE_URL=postgresql://user:pass@localhost:5432/bitebase
REDIS_URL=redis://localhost:6379
```

### API Client Configuration

The frontend uses a centralized API client in `apps/frontend/lib/api.ts`:

```typescript
import { api, apiEndpoints, testApiConnection } from '@/lib/api';

// Test API connection
await testApiConnection();

// Get restaurants
const restaurants = await api.get(apiEndpoints.restaurants);

// Login user
const result = await api.post(apiEndpoints.auth.login, {
  email: 'user@example.com',
  password: 'password'
});
```

## 🐳 Docker Development

### Start with Docker

```bash
# Start all services
docker-compose -f docker-compose.dev.turbo.yml up

# Start in background
docker-compose -f docker-compose.dev.turbo.yml up -d

# View logs
docker-compose -f docker-compose.dev.turbo.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.turbo.yml down
```

### Docker Services

- **Frontend**: Node.js 18 Alpine with hot reload
- **API**: Python 3.11 Slim with uvicorn reload
- **PostgreSQL**: Development database
- **Redis**: Caching and sessions

## 🔍 Debugging

### Check Service Status

```bash
# Check if services are running
curl http://localhost:3000        # Frontend
curl http://localhost:8000/health # FastAPI
curl http://localhost:4000        # Node.js backend

# Check Turborepo status
npx turbo run dev --dry-run
```

### Common Issues

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :3000  # Frontend
lsof -i :8000  # API
lsof -i :4000  # Backend

# Kill processes if needed
kill -9 $(lsof -t -i:3000)
```

**API connection issues:**
```bash
# Test API directly
curl -v http://localhost:8000/health

# Check CORS settings in apps/api/main.py
# Verify NEXT_PUBLIC_API_URL in frontend
```

**Turborepo cache issues:**
```bash
# Clear Turborepo cache
npx turbo clean

# Clear all node_modules
rm -rf node_modules apps/*/node_modules
npm install
```

## 📊 Monitoring

### Development Logs

```bash
# View all logs
npm run dev

# View specific service logs
npm run dev:frontend  # Frontend only
npm run dev:api      # API only

# Docker logs
docker-compose -f docker-compose.dev.turbo.yml logs -f frontend
docker-compose -f docker-compose.dev.turbo.yml logs -f api
```

### Performance Monitoring

- **Frontend**: Next.js dev tools and React DevTools
- **FastAPI**: Built-in `/docs` endpoint with request timing
- **Turborepo**: Build cache and task parallelization

## 🚀 Production Deployment

### Build for Production

```bash
# Build all apps
npm run build

# Build specific apps
npm run build --filter=bitebase-frontend
npm run build --filter=bitebase-api
```

### Deploy Options

1. **Vercel + EC2**: Frontend on Vercel, API on EC2
2. **Docker**: Full containerized deployment
3. **Cloudflare**: Workers for API, Pages for frontend

## 🎯 Benefits of This Setup

### ✅ Development Benefits
- **Parallel Development**: Work on frontend and backend simultaneously
- **Hot Reload**: Instant feedback on changes
- **Type Safety**: Shared TypeScript types between frontend and API
- **Unified Commands**: Single command to start everything

### ✅ Production Benefits
- **Independent Deployment**: Deploy frontend and backend separately
- **Scalability**: Scale services independently
- **Technology Choice**: Use best tool for each service
- **Maintainability**: Clear separation of concerns

### ✅ Team Benefits
- **Developer Experience**: Easy onboarding with `./dev-start.sh`
- **Consistency**: Same development environment for everyone
- **Productivity**: Fast feedback loops and efficient workflows
- **Collaboration**: Clear project structure and documentation

## 🆘 Troubleshooting

### Reset Everything

```bash
# Nuclear option - reset everything
./dev-start.sh --reset

# Or manually:
docker-compose -f docker-compose.dev.turbo.yml down -v
rm -rf node_modules apps/*/node_modules
npm install
npm run setup
```

### Get Help

```bash
# Check Turborepo help
npx turbo --help

# Check available scripts
npm run

# View this guide
cat TURBOREPO_DEVELOPMENT_GUIDE.md
```

---

## 🎉 You're Ready!

Your BiteBase development environment is now set up with:
- ✅ **Turborepo** for monorepo management
- ✅ **Parallel development** of frontend and backend
- ✅ **Hot reload** for instant feedback
- ✅ **Type-safe API** integration
- ✅ **Docker support** for consistent environments
- ✅ **Production-ready** build and deployment

Start developing with: `./dev-start.sh` 🚀