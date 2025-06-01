#!/bin/bash

# BiteBase Development Stack Stopper
# This script stops all running development services

echo "🛑 Stopping BiteBase Development Stack"
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

# Function to stop service by PID file
stop_service() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill "$pid" 2>/dev/null
            sleep 2
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Force killing $service_name..."
                kill -9 "$pid" 2>/dev/null
            fi
            
            print_success "$service_name stopped"
        else
            print_warning "$service_name was not running"
        fi
        rm "$pid_file"
    else
        print_warning "No PID file found for $service_name"
    fi
}

# Function to stop services by port
stop_by_port() {
    local port=$1
    local service_name=$2
    
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        print_status "Stopping $service_name on port $port..."
        echo "$pids" | xargs kill 2>/dev/null || true
        sleep 1
        
        # Force kill if still running
        local remaining_pids=$(lsof -ti :$port 2>/dev/null || true)
        if [ -n "$remaining_pids" ]; then
            print_warning "Force killing $service_name..."
            echo "$remaining_pids" | xargs kill -9 2>/dev/null || true
        fi
        
        print_success "$service_name stopped"
    else
        print_warning "$service_name was not running on port $port"
    fi
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop services using PID files first
print_status "Stopping services using PID files..."
stop_service "Backend" "logs/backend.pid"
stop_service "Agent" "logs/agent.pid"
stop_service "Frontend" "logs/frontend.pid"

echo ""

# Stop any remaining services by port
print_status "Checking for remaining services on ports..."
stop_by_port 3000 "Frontend"
stop_by_port 12001 "Backend"
stop_by_port 8000 "Agent"

echo ""

# Stop any Node.js processes that might be related
print_status "Stopping any remaining Node.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "minimal-server.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Stop any Python processes that might be related
print_status "Stopping any remaining Python processes..."
pkill -f "run_server.py" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true

echo ""

# Verify all services are stopped
print_status "Verifying services are stopped..."

check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        print_error "$service_name is still running on port $port"
        return 1
    else
        print_success "$service_name is stopped (port $port free)"
        return 0
    fi
}

ALL_STOPPED=true

if ! check_port 3000 "Frontend"; then
    ALL_STOPPED=false
fi

if ! check_port 12001 "Backend"; then
    ALL_STOPPED=false
fi

if ! check_port 8000 "Agent"; then
    ALL_STOPPED=false
fi

echo ""

if [ "$ALL_STOPPED" = true ]; then
    print_success "🎉 All BiteBase services have been stopped successfully!"
    echo ""
    echo "📊 Port Status:"
    echo "  ✅ Port 3000 (Frontend) - Free"
    echo "  ✅ Port 12001 (Backend) - Free"
    echo "  ✅ Port 8000 (Agent) - Free"
else
    print_error "❌ Some services may still be running"
    echo ""
    echo "🔍 Manual cleanup may be required:"
    echo "  lsof -i :3000   # Check frontend port"
    echo "  lsof -i :12001  # Check backend port"
    echo "  lsof -i :8000   # Check agent port"
    echo ""
    echo "  kill -9 <PID>   # Force kill if needed"
fi

echo ""
echo "🚀 To start services again:"
echo "  ./start-dev-stack.sh"
echo ""