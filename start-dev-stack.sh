#!/bin/bash

# BiteBase Development Stack Starter
# This script starts all three core services for development

set -e

echo "🚀 Starting BiteBase Development Stack"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the bitebase root directory."
    exit 1
fi

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within 60 seconds"
    return 1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    print_error "Python3 is not installed. Please install Python 3.12+ first."
    exit 1
fi

print_success "Prerequisites check passed"

# Check if ports are available
print_status "Checking port availability..."

if ! check_port 3000; then
    print_error "Port 3000 is already in use. Please free it or change the frontend port."
    exit 1
fi

if ! check_port 12001; then
    print_error "Port 12001 is already in use. Please free it or change the backend port."
    exit 1
fi

if ! check_port 8000; then
    print_error "Port 8000 is already in use. Please free it or change the agent port."
    exit 1
fi

print_success "All ports are available"

# Create log directory
mkdir -p logs

# Start Backend
print_status "Starting Backend (Express.js) on port 12001..."
cd apps/backend
npm run dev > ../../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Wait a moment for backend to start
sleep 3

# Start Agent
print_status "Starting Agent (Python FastAPI) on port 8000..."
cd agent

# Check if virtual environment exists and activate it
if [ -d "venv" ]; then
    source venv/bin/activate
elif command -v poetry &> /dev/null; then
    poetry run python run_server.py > ../logs/agent.log 2>&1 &
    AGENT_PID=$!
else
    python3 run_server.py > ../logs/agent.log 2>&1 &
    AGENT_PID=$!
fi

if [ -z "$AGENT_PID" ]; then
    if command -v poetry &> /dev/null; then
        poetry run python run_server.py > ../logs/agent.log 2>&1 &
        AGENT_PID=$!
    else
        python3 run_server.py > ../logs/agent.log 2>&1 &
        AGENT_PID=$!
    fi
fi

cd ..

# Wait a moment for agent to start
sleep 3

# Start Frontend
print_status "Starting Frontend (Next.js) on port 3000..."
cd apps/frontend
npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Store PIDs for cleanup
echo $BACKEND_PID > logs/backend.pid
echo $AGENT_PID > logs/agent.pid
echo $FRONTEND_PID > logs/frontend.pid

print_success "All services started!"

# Wait for services to be ready
echo ""
print_status "Waiting for services to be ready..."

# Wait for backend
if wait_for_service "http://localhost:12001/health" "Backend"; then
    print_success "✅ Backend is ready at http://localhost:12001"
else
    print_error "❌ Backend failed to start"
fi

# Wait for agent
if wait_for_service "http://localhost:8000/health" "Agent"; then
    print_success "✅ Agent is ready at http://localhost:8000"
else
    print_error "❌ Agent failed to start"
fi

# Wait for frontend
if wait_for_service "http://localhost:3000" "Frontend"; then
    print_success "✅ Frontend is ready at http://localhost:3000"
else
    print_error "❌ Frontend failed to start"
fi

echo ""
print_success "🎉 BiteBase Development Stack is running!"
echo ""
echo "📊 Service Status:"
echo "  🌐 Frontend:  http://localhost:3000"
echo "  🔧 Backend:   http://localhost:12001"
echo "  🤖 Agent:     http://localhost:8000"
echo ""
echo "📝 Logs:"
echo "  Backend:  tail -f logs/backend.log"
echo "  Agent:    tail -f logs/agent.log"
echo "  Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop all services:"
echo "  ./stop-dev-stack.sh"
echo ""
echo "🧪 To verify integration:"
echo "  ./verify-integration.sh"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    print_status "Shutting down services..."
    
    if [ -f logs/backend.pid ]; then
        kill $(cat logs/backend.pid) 2>/dev/null || true
        rm logs/backend.pid
    fi
    
    if [ -f logs/agent.pid ]; then
        kill $(cat logs/agent.pid) 2>/dev/null || true
        rm logs/agent.pid
    fi
    
    if [ -f logs/frontend.pid ]; then
        kill $(cat logs/frontend.pid) 2>/dev/null || true
        rm logs/frontend.pid
    fi
    
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
print_status "Press Ctrl+C to stop all services"
wait