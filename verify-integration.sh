#!/bin/bash

# BiteBase Integration Verification Script
# This script tests the integration between Frontend, Backend, and Agent

set -e

echo "🧪 BiteBase Integration Verification"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test function
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    print_status "Testing $description..."
    
    if response=$(curl -s -w "%{http_code}" -o /dev/null "$url" 2>/dev/null); then
        if [ "$response" -eq "$expected_status" ]; then
            print_success "$description is responding (HTTP $response)"
            return 0
        else
            print_error "$description returned HTTP $response (expected $expected_status)"
            return 1
        fi
    else
        print_error "$description is not accessible"
        return 1
    fi
}

# Test JSON endpoint
test_json_endpoint() {
    local url=$1
    local description=$2
    
    print_status "Testing $description..."
    
    if response=$(curl -s "$url" 2>/dev/null); then
        if echo "$response" | python3 -m json.tool >/dev/null 2>&1; then
            print_success "$description returned valid JSON"
            echo "   Response: $(echo "$response" | head -c 100)..."
            return 0
        else
            print_error "$description returned invalid JSON"
            echo "   Response: $response"
            return 1
        fi
    else
        print_error "$description is not accessible"
        return 1
    fi
}

# Check if services are running
echo "🔍 Checking Service Availability..."
echo ""

# Test Backend
echo "🔧 Testing Backend (Express.js)..."
test_json_endpoint "http://localhost:12001/health" "Backend Health Check"
test_json_endpoint "http://localhost:12001/api/restaurants" "Backend Restaurant API"

echo ""

# Test Agent
echo "🤖 Testing Agent (Python FastAPI)..."
test_json_endpoint "http://localhost:8000/health" "Agent Health Check"
test_json_endpoint "http://localhost:8000/api/status" "Agent Status API"

echo ""

# Test Frontend (basic connectivity)
echo "📱 Testing Frontend (Next.js)..."
test_endpoint "http://localhost:3000" "Frontend Home Page"

echo ""

# Test Integration Points
echo "🔗 Testing Integration Points..."

# Test if frontend can reach backend
print_status "Testing Frontend → Backend connectivity..."
if curl -s "http://localhost:3000/api/test-backend" >/dev/null 2>&1; then
    print_success "Frontend can reach backend"
else
    print_warning "Frontend-Backend integration test not available"
fi

# Test if backend can reach agent (if proxy exists)
print_status "Testing Backend → Agent connectivity..."
if curl -s "http://localhost:12001/api/agent/status" >/dev/null 2>&1; then
    print_success "Backend can reach agent"
else
    print_warning "Backend-Agent proxy not configured"
fi

echo ""

# Environment Check
echo "⚙️  Environment Configuration Check..."

# Check if environment files exist
if [ -f "apps/frontend/.env.local" ]; then
    print_success "Frontend environment file exists"
    if grep -q "NEXT_PUBLIC_API_URL" apps/frontend/.env.local; then
        print_success "Frontend API URL configured"
    else
        print_warning "Frontend API URL not configured"
    fi
else
    print_error "Frontend environment file missing"
fi

if [ -f "apps/backend/.env" ]; then
    print_success "Backend environment file exists"
else
    print_warning "Backend environment file missing (using defaults)"
fi

if [ -f "apps/backend/agent/.env" ]; then
    print_success "Agent environment file exists"
else
    print_warning "Agent environment file missing (using defaults)"
fi

echo ""

# Dependency Check
echo "📦 Dependency Check..."

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found"
fi

# Check Python version
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python installed: $PYTHON_VERSION"
else
    print_error "Python3 not found"
fi

# Check Poetry
if command -v poetry &> /dev/null; then
    POETRY_VERSION=$(poetry --version)
    print_success "Poetry installed: $POETRY_VERSION"
else
    print_warning "Poetry not found (can use pip instead)"
fi

echo ""

# Port Check
echo "🔌 Port Usage Check..."

check_port() {
    local port=$1
    local service=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        print_success "Port $port is in use ($service)"
    else
        print_error "Port $port is not in use ($service not running?)"
    fi
}

check_port 3000 "Frontend"
check_port 12001 "Backend"
check_port 8000 "Agent"

echo ""

# Final Summary
echo "📊 Integration Summary"
echo "====================="
echo ""

# Count successful tests
BACKEND_OK=0
AGENT_OK=0
FRONTEND_OK=0

if curl -s "http://localhost:12001/health" >/dev/null 2>&1; then
    BACKEND_OK=1
fi

if curl -s "http://localhost:8000/health" >/dev/null 2>&1; then
    AGENT_OK=1
fi

if curl -s "http://localhost:3000" >/dev/null 2>&1; then
    FRONTEND_OK=1
fi

TOTAL_OK=$((BACKEND_OK + AGENT_OK + FRONTEND_OK))

if [ $TOTAL_OK -eq 3 ]; then
    print_success "All services are running and accessible! 🎉"
    echo ""
    echo "🌐 Service URLs:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:12001"
    echo "  - Agent:    http://localhost:8000"
    echo ""
    echo "✅ Your BiteBase system is ready for development!"
elif [ $TOTAL_OK -eq 2 ]; then
    print_warning "2 out of 3 services are running"
    echo "Please check the failed service and restart it"
elif [ $TOTAL_OK -eq 1 ]; then
    print_warning "Only 1 out of 3 services is running"
    echo "Please start the missing services"
else
    print_error "No services are running"
    echo "Please start all services using the integration guide"
fi

echo ""
echo "📖 For detailed setup instructions, see: SYSTEM_INTEGRATION_GUIDE.md"
echo ""