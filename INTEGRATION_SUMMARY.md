# BiteBase Integration Summary

## 🎯 System Overview

Your BiteBase application consists of three core components that work together:

### 1. **Frontend** (Next.js)
- **Location**: `apps/frontend/`
- **Port**: 3000 (development)
- **Technology**: Next.js 14, React, TypeScript, Tailwind CSS
- **Purpose**: User interface and client-side logic

### 2. **Backend** (Express.js)
- **Location**: `apps/backend/`
- **Port**: 12001 (development)
- **Technology**: Express.js, Node.js
- **Purpose**: REST API, data management, authentication

### 3. **Agent** (Python FastAPI)
- **Location**: `apps/backend/agent/`
- **Port**: 8000 (development)
- **Technology**: Python, FastAPI, LangChain, OpenAI
- **Purpose**: AI-powered market research and analysis

## 🚀 Quick Start Commands

### Start All Services
```bash
./start-dev-stack.sh
```

### Stop All Services
```bash
./stop-dev-stack.sh
```

### Verify Integration
```bash
./verify-integration.sh
```

### Manual Start (Alternative)
```bash
# Terminal 1 - Backend
cd apps/backend && npm run dev

# Terminal 2 - Agent  
cd agent && python run_server.py

# Terminal 3 - Frontend
cd apps/frontend && npm run dev
```

## 🔗 Service URLs

| Service | Development URL | Purpose |
|---------|----------------|---------|
| Frontend | http://localhost:3000 | Main application interface |
| Backend | http://localhost:12001 | REST API endpoints |
| Agent | http://localhost:8000 | AI services and analysis |

## 📋 Integration Points

### Frontend ↔ Backend
- **API Client**: `apps/frontend/lib/api-client.ts`
- **Base URL**: `NEXT_PUBLIC_API_URL=http://localhost:12001`
- **Key Endpoints**:
  - `GET /health` - Health check
  - `GET /api/restaurants` - Restaurant data
  - `POST /api/restaurants/search` - Location search
  - `GET /api/market-analyses` - Market analysis

### Frontend ↔ Agent
- **Direct API calls** for AI features
- **Base URL**: `NEXT_PUBLIC_AGENT_URL=http://localhost:8000`
- **Key Endpoints**:
  - `GET /health` - Agent health
  - `POST /api/research` - Market research
  - `POST /api/market/analyze` - Market analysis
  - `POST /api/chat` - AI chat

### Backend ↔ Agent
- **Optional proxy** for agent requests
- **Internal communication** for data processing
- **Shared data models** and validation

## ⚙️ Environment Configuration

### Required Environment Files

1. **Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:12001
NEXT_PUBLIC_AGENT_URL=http://localhost:8000
```

2. **Backend** (`apps/backend/.env`):
```env
NODE_ENV=development
PORT=12001
CORS_ORIGIN=http://localhost:3000
```

3. **Agent** (`apps/backend/agent/.env`):
```env
OPENAI_API_KEY=your_openai_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
PORT=8000
```

## 🛠️ Development Workflow

### Daily Development
1. Run `./start-dev-stack.sh` to start all services
2. Open http://localhost:3000 in your browser
3. Make changes to any component
4. Services auto-reload on file changes
5. Use `./verify-integration.sh` to test connectivity

### Making Changes
- **Frontend**: Auto-reload on save
- **Backend**: Restart with `cd apps/backend && npm run dev`
- **Agent**: Restart with `cd agent && python run_server.py`

### Testing
```bash
# Test individual services
curl http://localhost:12001/health  # Backend
curl http://localhost:8000/health   # Agent
open http://localhost:3000          # Frontend

# Test integration
./verify-integration.sh
```

## 🔧 Troubleshooting

### Common Issues & Solutions

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   lsof -i :3000 :12001 :8000
   
   # Kill processes if needed
   ./stop-dev-stack.sh
   ```

2. **CORS Errors**
   - Check `CORS_ORIGIN` in backend `.env`
   - Ensure frontend URL is allowed

3. **API Connection Issues**
   - Verify environment variables
   - Check if all services are running
   - Test endpoints individually

4. **Python Dependencies**
   ```bash
   cd agent
   poetry install  # or pip install -r requirements.txt
   ```

5. **Node.js Dependencies**
   ```bash
   npm install  # in root, frontend, and backend
   ```

## 📊 Health Checks

### Service Status
```bash
# Backend
curl http://localhost:12001/health
# Expected: {"status":"ok","message":"Backend is running"}

# Agent
curl http://localhost:8000/health  
# Expected: {"status":"healthy","service":"BiteBase AI Agent"}

# Frontend
curl http://localhost:3000
# Expected: HTML response (Next.js app)
```

### Integration Test
```bash
./verify-integration.sh
# Runs comprehensive integration tests
```

## 📁 Key Files

### Configuration
- `SYSTEM_INTEGRATION_GUIDE.md` - Detailed setup guide
- `apps/frontend/.env.local` - Frontend environment
- `apps/backend/.env` - Backend environment  
- `apps/backend/agent/.env` - Agent environment

### Scripts
- `start-dev-stack.sh` - Start all services
- `stop-dev-stack.sh` - Stop all services
- `verify-integration.sh` - Test integration
- `setup-dev-environment.sh` - Initial setup

### API Integration
- `apps/frontend/lib/api-client.ts` - Frontend API client
- `apps/backend/minimal-server.js` - Backend server
- `apps/backend/agent/run_server.py` - Agent server

## ✅ Success Criteria

Your system is properly integrated when:

- [ ] All three services start without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:12001/health
- [ ] Agent responds at http://localhost:8000/health
- [ ] Frontend can fetch data from backend
- [ ] Frontend can communicate with agent
- [ ] No CORS errors in browser console
- [ ] `./verify-integration.sh` passes all tests

## 🎯 Next Steps

1. **Start Development**: Run `./start-dev-stack.sh`
2. **Verify Setup**: Run `./verify-integration.sh`
3. **Configure APIs**: Add your API keys to environment files
4. **Customize**: Modify components as needed
5. **Deploy**: Use Docker or platform-specific deployment

## 📞 Support

If you encounter issues:
1. Check the detailed `SYSTEM_INTEGRATION_GUIDE.md`
2. Run `./verify-integration.sh` for diagnostics
3. Check service logs in `logs/` directory
4. Verify environment variables are set correctly
5. Ensure all dependencies are installed

---

**Status**: Ready for Development ✅  
**Components**: Frontend + Backend + Agent  
**Integration**: Fully Configured  
**Last Updated**: 2024-01-20