# BiteBase System Integration Guide

## 🎯 Overview

This guide ensures proper integration between the three core components of BiteBase:
- **Frontend** (Next.js) - Port 3000/12000
- **Backend** (Express.js) - Port 3001/12001  
- **Agent** (Python FastAPI) - Port 8000

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     Agent       │
│   (Next.js)     │◄──►│  (Express.js)   │◄──►│  (Python API)   │
│   Port 3000     │    │   Port 12001    │    │   Port 8000     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Prerequisites

### System Requirements
- **Node.js**: 18+ 
- **Python**: 3.12
- **Poetry**: For Python dependency management
- **npm/yarn**: For Node.js dependencies

### Environment Setup
```bash
# Check versions
node --version    # Should be 18+
python --version  # Should be 3.12
poetry --version  # Should be installed
```

## 📋 Step-by-Step Integration Setup

### 1. Environment Configuration

#### Frontend Environment (.env.local)
```bash
cd apps/frontend
cat > .env.local << EOF
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:12001
NEXT_PUBLIC_AGENT_URL=http://localhost:8000

# Development Settings
NEXT_PUBLIC_ENVIRONMENT=development

# Optional: Firebase, Mapbox, etc.
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
EOF
```

#### Backend Environment (.env)
```bash
cd apps/backend
cat > .env << EOF
# Server Configuration
NODE_ENV=development
PORT=12001
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:12000

# Database (if using)
DATABASE_URL=postgresql://user:password@localhost:5432/bitebase

# JWT Secret
JWT_SECRET=your-secret-key-here

# External APIs
GOOGLE_CLIENT_ID=your_google_client_id
STRIPE_SECRET_KEY=your_stripe_key
EOF
```

#### Agent Environment (.env)
```bash
cd agent
cat > .env << EOF
# AI Service Configuration
OPENAI_API_KEY=your_openai_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
TAVILY_API_KEY=your_tavily_key

# Server Configuration
HOST=0.0.0.0
PORT=8000

# Development Settings
ENVIRONMENT=development
LOG_LEVEL=INFO
EOF
```

### 2. Dependency Installation

#### Install All Dependencies
```bash
# Root dependencies
npm install

# Frontend dependencies
cd apps/frontend
npm install

# Backend dependencies
cd ../backend
npm install

# Agent dependencies (Python)
cd ../../agent
poetry install
# OR if using pip:
pip install -r requirements.txt
```

### 3. Service Startup Sequence

#### Option A: Manual Startup (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
# Server starts on http://localhost:12001
```

**Terminal 2 - Agent:**
```bash
cd agent
poetry run python run_server.py
# OR: python run_server.py
# Server starts on http://localhost:8000
```

**Terminal 3 - Frontend:**
```bash
cd apps/frontend
npm run dev
# Server starts on http://localhost:3000
```

#### Option B: Using Scripts
```bash
# Use the provided setup script
./setup-dev-environment.sh

# Or start individual services
cd apps/backend && npm run dev &
cd agent && ./start-servers.sh &
cd apps/frontend && npm run dev &
```

### 4. Integration Verification

#### Health Check Endpoints
```bash
# Backend Health Check
curl http://localhost:12001/health
# Expected: {"status":"ok","message":"Backend is running"}

# Agent Health Check  
curl http://localhost:8000/health
# Expected: {"status":"healthy","service":"BiteBase AI Agent"}

# Frontend (should load in browser)
open http://localhost:3000
```

#### API Integration Tests
```bash
# Test Backend API
curl http://localhost:12001/api/restaurants
# Should return restaurant data

# Test Agent API
curl http://localhost:8000/api/status
# Should return agent status

# Test Frontend-Backend Connection
curl http://localhost:12001/api/test-backend
# Should confirm connectivity
```

## 🔗 API Integration Points

### Frontend → Backend Communication

**API Client Configuration:**
```typescript
// apps/frontend/lib/api-client.ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
```

**Key Endpoints:**
- `GET /health` - Health check
- `GET /api/restaurants` - Restaurant data
- `POST /api/restaurants/search` - Location-based search
- `GET /api/market-analyses` - Market analysis data

### Frontend → Agent Communication

**Direct API Calls:**
```typescript
// Frontend can call agent directly for AI features
const agentUrl = process.env.NEXT_PUBLIC_AGENT_URL || 'http://localhost:8000';
```

**Key Endpoints:**
- `GET /api/status` - Agent health
- `POST /api/research` - Market research
- `POST /api/market/analyze` - Market analysis
- `POST /api/chat` - AI chat interface

### Backend → Agent Communication

**Backend can proxy agent requests:**
```javascript
// apps/backend/minimal-server.js
const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8000';
```

## 🛠️ Troubleshooting Common Issues

### 1. CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
```javascript
// In apps/backend/minimal-server.js
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:12000"
  ],
  credentials: true
}));
```

### 2. Port Conflicts
**Problem:** Ports already in use
**Solution:**
```bash
# Check what's using ports
lsof -i :3000
lsof -i :12001
lsof -i :8000

# Kill processes if needed
kill -9 <PID>

# Or use different ports in .env files
```

### 3. Python Dependencies
**Problem:** Agent won't start due to missing packages
**Solution:**
```bash
cd agent
# Using Poetry (recommended)
poetry install
poetry shell

# Or using pip
pip install -r requirements.txt
```

### 4. API Connection Issues
**Problem:** Frontend can't reach backend/agent
**Solution:**
```bash
# Check if services are running
curl http://localhost:12001/health
curl http://localhost:8000/health

# Check environment variables
echo $NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_AGENT_URL
```

## 📊 Service Monitoring

### Development Monitoring
```bash
# Check all services status
echo "Backend:" && curl -s http://localhost:12001/health
echo "Agent:" && curl -s http://localhost:8000/health
echo "Frontend: Check http://localhost:3000"
```

### Log Monitoring
```bash
# Backend logs
tail -f apps/backend/backend.log

# Agent logs (if configured)
tail -f agent/agent.log

# Frontend logs (in browser console)
```

## 🚀 Production Deployment

### Environment Variables for Production
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AGENT_URL=https://ai.yourdomain.com

# Backend
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com

# Agent
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000
```

### Docker Deployment
```bash
# Use the provided docker-compose
docker-compose up --build

# Or individual services
docker build -t bitebase-frontend apps/frontend
docker build -t bitebase-backend apps/backend
docker build -t bitebase-agent agent
```

## ✅ Integration Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Backend starts successfully on port 12001
- [ ] Agent starts successfully on port 8000
- [ ] Frontend starts successfully on port 3000
- [ ] Backend health check passes
- [ ] Agent health check passes
- [ ] Frontend can load in browser
- [ ] Frontend can fetch data from backend
- [ ] Frontend can communicate with agent
- [ ] CORS is properly configured
- [ ] All API endpoints respond correctly

## 🔧 Development Workflow

### Daily Development
1. Start backend: `cd apps/backend && npm run dev`
2. Start agent: `cd agent && python run_server.py`
3. Start frontend: `cd apps/frontend && npm run dev`
4. Open browser: `http://localhost:3000`

### Making Changes
- **Frontend changes**: Auto-reload on save
- **Backend changes**: Restart backend service
- **Agent changes**: Restart agent service

### Testing Integration
```bash
# Test full stack
curl http://localhost:12001/api/restaurants
curl http://localhost:8000/api/status
open http://localhost:3000
```

## 📞 Support

If you encounter issues:
1. Check this integration guide
2. Verify all services are running
3. Check environment variables
4. Review logs for errors
5. Test individual components

---

**Status**: Ready for Development ✅  
**Last Updated**: 2024-01-20  
**Components**: Frontend (Next.js) + Backend (Express.js) + Agent (Python FastAPI)