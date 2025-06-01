#!/bin/bash

# BiteBase Services Startup Script
# This script installs dependencies and starts both backend and frontend services

set -e  # Exit on any error

echo "🚀 Starting BiteBase Services Setup and Launch"
echo "================================================"

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

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_status "Node.js version: $(node --version)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_status "npm version: $(npm --version)"
}

# Kill any existing processes on the ports we need
kill_existing_processes() {
    print_header "Cleaning up existing processes..."
    
    # Kill processes on port 3000 (frontend)
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Killing existing process on port 3000"
        lsof -Pi :3000 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
    fi
    
    # Kill processes on port 12001 (backend)
    if lsof -Pi :12001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Killing existing process on port 12001"
        lsof -Pi :12001 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
    fi
    
    # Kill processes on port 3002 (agent adapter)
    if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Killing existing process on port 3002"
        lsof -Pi :3002 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
    fi
    
    # Kill processes on port 8000 (agent service)
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Killing existing process on port 8000"
        lsof -Pi :8000 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
    fi
    
    sleep 2
}

# Install root dependencies
install_root_dependencies() {
    print_header "Installing root dependencies..."
    if [ -f "package.json" ]; then
        npm install
        print_status "Root dependencies installed"
    else
        print_warning "No package.json found in root directory"
    fi
}

# Install backend dependencies
install_backend_dependencies() {
    print_header "Installing backend dependencies..."
    
    if [ -d "apps/backend" ]; then
        cd apps/backend
        if [ -f "package.json" ]; then
            npm install
            print_status "Backend dependencies installed"
        else
            print_warning "No package.json found in apps/backend"
        fi
        cd ../..
    else
        print_error "Backend directory not found: apps/backend"
        exit 1
    fi
}

# Install frontend dependencies
install_frontend_dependencies() {
    print_header "Installing frontend dependencies..."
    
    if [ -d "apps/frontend" ]; then
        cd apps/frontend
        if [ -f "package.json" ]; then
            npm install
            print_status "Frontend dependencies installed"
        else
            print_warning "No package.json found in apps/frontend"
        fi
        cd ../..
    else
        print_error "Frontend directory not found: apps/frontend"
        exit 1
    fi
}

# Install agent dependencies
install_agent_dependencies() {
    print_header "Installing agent dependencies..."
    
    if [ -d "agent" ]; then
        cd agent
        
        # Check if Python is available
        if ! command -v python3 &> /dev/null; then
            print_warning "Python3 not found. Agent service will be skipped."
            cd ..
            return
        fi
        
        # Install Python dependencies
        if [ -f "requirements.txt" ]; then
            print_status "Installing Python dependencies..."
            python3 -m pip install -r requirements.txt --user
            print_status "Agent Python dependencies installed"
        else
            print_warning "No requirements.txt found in agent directory"
        fi
        
        # Install Node.js dependencies if package.json exists
        if [ -f "package.json" ]; then
            print_status "Installing Agent Node.js dependencies..."
            npm install
            print_status "Agent Node.js dependencies installed"
        fi
        
        cd ..
    else
        print_warning "Agent directory not found. Agent service will be skipped."
    fi
}

# Start backend service
start_backend() {
    print_header "Starting backend service..."
    
    cd apps/backend
    
    # Install backend dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    if [ -f "minimal-server.js" ]; then
        print_status "Starting backend on port 12001..."
        nohup node minimal-server.js > backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > backend.pid
        print_status "Backend started with PID: $BACKEND_PID"
        
        # Wait a moment and check if the process is still running
        sleep 3
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_status "Backend is running successfully"
        else
            print_error "Backend failed to start. Check backend.log for details."
            cat backend.log
            exit 1
        fi
    else
        print_error "minimal-server.js not found in apps/backend"
        exit 1
    fi
    cd ../..
}

# Start frontend service
start_frontend() {
    print_header "Starting frontend service..."
    
    cd apps/frontend
    if [ -f "package.json" ]; then
        print_status "Starting frontend on port 3000..."
        nohup npm run dev > frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > frontend.pid
        print_status "Frontend started with PID: $FRONTEND_PID"
        
        # Wait a moment and check if the process is still running
        sleep 5
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_status "Frontend is running successfully"
        else
            print_error "Frontend failed to start. Check frontend.log for details."
            cat frontend.log
            exit 1
        fi
    else
        print_error "package.json not found in apps/frontend"
        exit 1
    fi
    cd ../..
}

# Start agent service
start_agent() {
    print_header "Starting agent service..."
    
    if [ -d "agent" ]; then
        cd agent
        
        # Check if Python is available
        if ! command -v python3 &> /dev/null; then
            print_warning "Python3 not found. Skipping agent service."
            cd ..
            return
        fi
        
        if [ -f "run_server.py" ]; then
            print_status "Starting agent service on port 8000..."
            
            # Set up Python path
            export PYTHONPATH=$PYTHONPATH:$(pwd):$(pwd)/..
            
            # Create static directory if it doesn't exist
            if [ ! -d "static" ]; then
                mkdir -p static
            fi
            
            nohup python3 run_server.py > agent.log 2>&1 &
            AGENT_PID=$!
            echo $AGENT_PID > agent.pid
            print_status "Agent service started with PID: $AGENT_PID"
            
            # Wait a moment and check if the process is still running
            sleep 3
            if kill -0 $AGENT_PID 2>/dev/null; then
                print_status "Agent service is running successfully"
            else
                print_warning "Agent service may have failed to start. Check agent.log for details."
                if [ -f "agent.log" ]; then
                    tail -10 agent.log
                fi
            fi
        else
            print_warning "run_server.py not found in agent directory"
        fi
        cd ..
    else
        print_warning "Agent directory not found. Skipping agent service."
    fi
}

# Wait for services to be ready
wait_for_services() {
    print_header "Waiting for services to be ready..."
    
    # Wait for backend
    print_status "Checking backend health..."
    for i in {1..30}; do
        if curl -s http://localhost:12001/health > /dev/null 2>&1; then
            print_status "Backend is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend failed to become ready after 30 seconds"
            exit 1
        fi
        sleep 1
    done
    
    # Wait for frontend
    print_status "Checking frontend..."
    for i in {1..60}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_status "Frontend is ready!"
            break
        fi
        if [ $i -eq 60 ]; then
            print_error "Frontend failed to become ready after 60 seconds"
            exit 1
        fi
        sleep 1
    done
    
    # Wait for agent service (optional)
    if [ -f "agent/agent.pid" ]; then
        print_status "Checking agent service..."
        for i in {1..30}; do
            if curl -s http://localhost:8000/health > /dev/null 2>&1; then
                print_status "Agent service is ready!"
                break
            fi
            if [ $i -eq 30 ]; then
                print_warning "Agent service failed to become ready after 30 seconds (this is optional)"
                break
            fi
            sleep 1
        done
    fi
}

# Display service information
show_service_info() {
    print_header "Service Information"
    echo "================================================"
    print_status "✅ Backend API: http://localhost:12001"
    print_status "✅ Frontend App: http://localhost:3000"
    print_status "📊 Backend Health: http://localhost:12001/health"
    
    if [ -f "agent/agent.pid" ]; then
        print_status "🤖 Agent Service: http://localhost:8000"
        print_status "📊 Agent Health: http://localhost:8000/health"
    fi
    
    echo ""
    print_status "📝 Log files:"
    print_status "   Backend: apps/backend/backend.log"
    print_status "   Frontend: apps/frontend/frontend.log"
    
    if [ -f "agent/agent.log" ]; then
        print_status "   Agent: agent/agent.log"
    fi
    
    echo ""
    print_status "🔧 Process IDs:"
    if [ -f "apps/backend/backend.pid" ]; then
        print_status "   Backend PID: $(cat apps/backend/backend.pid)"
    fi
    if [ -f "apps/frontend/frontend.pid" ]; then
        print_status "   Frontend PID: $(cat apps/frontend/frontend.pid)"
    fi
    if [ -f "agent/agent.pid" ]; then
        print_status "   Agent PID: $(cat agent/agent.pid)"
    fi
    echo "================================================"
}

# Cleanup function
cleanup() {
    print_header "Cleaning up..."
    
    if [ -f "apps/backend/backend.pid" ]; then
        BACKEND_PID=$(cat apps/backend/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_status "Backend process stopped"
        fi
        rm -f apps/backend/backend.pid
    fi
    
    if [ -f "apps/frontend/frontend.pid" ]; then
        FRONTEND_PID=$(cat apps/frontend/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_status "Frontend process stopped"
        fi
        rm -f apps/frontend/frontend.pid
    fi
    
    if [ -f "agent/agent.pid" ]; then
        AGENT_PID=$(cat agent/agent.pid)
        if kill -0 $AGENT_PID 2>/dev/null; then
            kill $AGENT_PID
            print_status "Agent process stopped"
        fi
        rm -f agent/agent.pid
    fi
}

# Trap cleanup on script exit
trap cleanup EXIT

# Main execution
main() {
    print_header "Starting BiteBase Services"
    
    # Check prerequisites
    check_node
    check_npm
    
    # Clean up existing processes
    kill_existing_processes
    
    # Install dependencies
    install_root_dependencies
    install_backend_dependencies
    install_frontend_dependencies
    install_agent_dependencies
    
    # Start services
    start_backend
    start_frontend
    start_agent
    
    # Wait for services to be ready
    wait_for_services
    
    # Show service information
    show_service_info
    
    print_status "🎉 All services are running successfully!"
    print_status "Press Ctrl+C to stop all services"
    
    # Keep the script running
    while true; do
        sleep 10
        
        # Check if processes are still running
        if [ -f "apps/backend/backend.pid" ]; then
            BACKEND_PID=$(cat apps/backend/backend.pid)
            if ! kill -0 $BACKEND_PID 2>/dev/null; then
                print_error "Backend process died unexpectedly"
                exit 1
            fi
        fi
        
        if [ -f "apps/frontend/frontend.pid" ]; then
            FRONTEND_PID=$(cat apps/frontend/frontend.pid)
            if ! kill -0 $FRONTEND_PID 2>/dev/null; then
                print_error "Frontend process died unexpectedly"
                exit 1
            fi
        fi
        
        if [ -f "agent/agent.pid" ]; then
            AGENT_PID=$(cat agent/agent.pid)
            if ! kill -0 $AGENT_PID 2>/dev/null; then
                print_warning "Agent process died unexpectedly (this is optional)"
            fi
        fi
    done
}

# Run main function
main "$@"
