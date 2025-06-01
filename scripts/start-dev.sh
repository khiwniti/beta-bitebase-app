#!/bin/bash

# BiteBase Development Startup Script
# This script starts all services in development mode

set -e

echo "🚀 Starting BiteBase Development Environment"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed - some services may not work"
    fi
    
    print_status "Dependencies check completed"
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Start PostgreSQL and Redis with Docker if available
    if command -v docker &> /dev/null; then
        print_status "Starting PostgreSQL..."
        docker run -d --name bitebase-postgres \
            -e POSTGRES_DB=bitebase \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=password \
            -p 5432:5432 \
            postgis/postgis:15-3.3 || print_warning "PostgreSQL container already running"
        
        print_status "Starting Redis..."
        docker run -d --name bitebase-redis \
            -p 6379:6379 \
            redis:7-alpine || print_warning "Redis container already running"
        
        print_status "Starting Ollama..."
        docker run -d --name bitebase-ollama \
            -p 11434:11434 \
            -v ollama_data:/root/.ollama \
            ollama/ollama:latest || print_warning "Ollama container already running"
    else
        print_warning "Docker not available - please start PostgreSQL, Redis, and Ollama manually"
    fi
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    
    # User Frontend
    cd apps/frontend
    print_status "Installing User Frontend dependencies..."
    npm install
    cd ../..
    
    # Staff Frontend
    cd apps/staff-frontend
    print_status "Installing Staff Frontend dependencies..."
    npm install
    cd ../..
    
    # Tools Frontend
    cd apps/tools-frontend
    print_status "Installing Tools Frontend dependencies..."
    npm install
    cd ../..
    
    # Workflows Frontend
    cd apps/workflows-frontend
    print_status "Installing Workflows Frontend dependencies..."
    npm install
    cd ../..
    
    # Backend Tasks Frontend
    cd apps/backend-tasks-frontend
    print_status "Installing Backend Tasks Frontend dependencies..."
    npm install
    cd ../..
}

# Install backend dependencies
install_backend_deps() {
    print_status "Installing backend dependencies..."
    
    # User Backend
    cd apps/user-backend
    print_status "Installing User Backend dependencies..."
    pip install -r requirements.txt
    cd ../..
    
    # CopilotKit Service
    cd apps/copilotkit-service
    print_status "Installing CopilotKit Service dependencies..."
    pip install -r requirements.txt
    cd ../..
    
    # MCP Gateway
    cd apps/mcp-gateway
    print_status "Installing MCP Gateway dependencies..."
    pip install -r requirements.txt
    cd ../..
}

# Start backend services
start_backends() {
    print_status "Starting backend services..."
    
    # Start User Backend
    cd apps/user-backend
    print_status "Starting User Backend on port 8000..."
    python main.py &
    USER_BACKEND_PID=$!
    cd ../..
    
    # Wait a bit for the first service to start
    sleep 3
    
    # Start CopilotKit Service
    cd apps/copilotkit-service
    print_status "Starting CopilotKit Service on port 8001..."
    python main.py &
    COPILOTKIT_PID=$!
    cd ../..
    
    # Wait a bit
    sleep 3
    
    # Start MCP Gateway
    cd apps/mcp-gateway
    print_status "Starting MCP Gateway on port 8002..."
    python main.py &
    MCP_GATEWAY_PID=$!
    cd ../..
    
    # Store PIDs for cleanup
    echo $USER_BACKEND_PID > .user-backend.pid
    echo $COPILOTKIT_PID > .copilotkit.pid
    echo $MCP_GATEWAY_PID > .mcp-gateway.pid
}

# Start frontend services
start_frontends() {
    print_status "Starting frontend services..."
    
    # Start User Frontend
    cd apps/frontend
    print_status "Starting User Frontend on port 3000..."
    npm run dev &
    USER_FRONTEND_PID=$!
    cd ../..
    
    # Start Staff Frontend
    cd apps/staff-frontend
    print_status "Starting Staff Frontend on port 3001..."
    npm run dev &
    STAFF_FRONTEND_PID=$!
    cd ../..
    
    # Start Tools Frontend
    cd apps/tools-frontend
    print_status "Starting Tools Frontend on port 3002..."
    npm run dev &
    TOOLS_FRONTEND_PID=$!
    cd ../..
    
    # Start Workflows Frontend
    cd apps/workflows-frontend
    print_status "Starting Workflows Frontend on port 3003..."
    npm run dev &
    WORKFLOWS_FRONTEND_PID=$!
    cd ../..
    
    # Start Backend Tasks Frontend
    cd apps/backend-tasks-frontend
    print_status "Starting Backend Tasks Frontend on port 3004..."
    npm run dev &
    BACKEND_TASKS_PID=$!
    cd ../..
    
    # Store PIDs for cleanup
    echo $USER_FRONTEND_PID > .user-frontend.pid
    echo $STAFF_FRONTEND_PID > .staff-frontend.pid
    echo $TOOLS_FRONTEND_PID > .tools-frontend.pid
    echo $WORKFLOWS_FRONTEND_PID > .workflows-frontend.pid
    echo $BACKEND_TASKS_PID > .backend-tasks.pid
}

# Display service URLs
show_services() {
    print_status "BiteBase services are starting up..."
    echo ""
    echo -e "${BLUE}Frontend Services:${NC}"
    echo "  🌐 User Frontend:        http://localhost:3000"
    echo "  👥 Staff Frontend:       http://localhost:3001"
    echo "  🔧 Tools Frontend:       http://localhost:3002"
    echo "  ⚡ Workflows Frontend:   http://localhost:3003"
    echo "  📊 Backend Tasks:        http://localhost:3004"
    echo ""
    echo -e "${BLUE}Backend Services:${NC}"
    echo "  🔌 User Backend API:     http://localhost:8000"
    echo "  🤖 CopilotKit Service:   http://localhost:8001"
    echo "  🚪 MCP Gateway:          http://localhost:8002"
    echo ""
    echo -e "${BLUE}Infrastructure:${NC}"
    echo "  🐘 PostgreSQL:           localhost:5432"
    echo "  📦 Redis:                localhost:6379"
    echo "  🦙 Ollama:               localhost:11434"
    echo ""
    echo -e "${GREEN}✅ All services started successfully!${NC}"
    echo ""
    echo "Press Ctrl+C to stop all services"
}

# Cleanup function
cleanup() {
    print_status "Stopping all services..."
    
    # Kill frontend processes
    if [ -f .user-frontend.pid ]; then
        kill $(cat .user-frontend.pid) 2>/dev/null || true
        rm .user-frontend.pid
    fi
    
    if [ -f .staff-frontend.pid ]; then
        kill $(cat .staff-frontend.pid) 2>/dev/null || true
        rm .staff-frontend.pid
    fi
    
    if [ -f .tools-frontend.pid ]; then
        kill $(cat .tools-frontend.pid) 2>/dev/null || true
        rm .tools-frontend.pid
    fi
    
    if [ -f .workflows-frontend.pid ]; then
        kill $(cat .workflows-frontend.pid) 2>/dev/null || true
        rm .workflows-frontend.pid
    fi
    
    if [ -f .backend-tasks.pid ]; then
        kill $(cat .backend-tasks.pid) 2>/dev/null || true
        rm .backend-tasks.pid
    fi
    
    # Kill backend processes
    if [ -f .user-backend.pid ]; then
        kill $(cat .user-backend.pid) 2>/dev/null || true
        rm .user-backend.pid
    fi
    
    if [ -f .copilotkit.pid ]; then
        kill $(cat .copilotkit.pid) 2>/dev/null || true
        rm .copilotkit.pid
    fi
    
    if [ -f .mcp-gateway.pid ]; then
        kill $(cat .mcp-gateway.pid) 2>/dev/null || true
        rm .mcp-gateway.pid
    fi
    
    print_status "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    check_dependencies
    start_infrastructure
    
    # Install dependencies if --install flag is provided
    if [[ "$1" == "--install" ]]; then
        install_frontend_deps
        install_backend_deps
    fi
    
    start_backends
    sleep 5  # Wait for backends to start
    start_frontends
    sleep 5  # Wait for frontends to start
    
    show_services
    
    # Keep script running
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"
