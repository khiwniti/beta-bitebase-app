#!/bin/bash

# BiteBase Deployment Verification Script
# This script tests all deployed services

set -e

echo "🧪 BiteBase Deployment Verification"
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
        if echo "$response" | jq . >/dev/null 2>&1; then
            print_success "$description returned valid JSON"
            return 0
        else
            print_error "$description returned invalid JSON"
            return 1
        fi
    else
        print_error "$description is not accessible"
        return 1
    fi
}

echo "🌐 Testing Frontend..."
test_endpoint "https://beta.bitebase.app" "Frontend"

echo ""
echo "🔧 Testing Backend API..."
test_json_endpoint "https://api.bitebase.app/health" "Backend Health Check"

echo ""
echo "🤖 Testing AI Agents..."
test_json_endpoint "https://ai.bitebase.app/health" "AI Agents Health Check"

echo ""
echo "📊 Testing API Endpoints..."
test_json_endpoint "https://api.bitebase.app/api/restaurants?latitude=40.7128&longitude=-74.0060&radius=5" "Restaurant API"

echo ""
echo "🗺️ Testing Geocoding..."
test_json_endpoint "https://ai.bitebase.app/api/geocode?address=New York, NY" "Geocoding API"

echo ""
echo "🔍 Testing Market Analysis..."
test_json_endpoint "https://ai.bitebase.app/api/analyze?latitude=40.7128&longitude=-74.0060&radius=5" "Market Analysis API"

echo ""
echo "🧠 Testing AI Research..."
if curl -s -X POST "https://ai.bitebase.app/research" \
   -H "Content-Type: application/json" \
   -d '{"location": "New York", "cuisine_type": "Italian"}' \
   | jq . >/dev/null 2>&1; then
    print_success "AI Research API returned valid JSON"
else
    print_error "AI Research API failed"
fi

echo ""
echo "📈 Deployment Verification Complete!"
echo ""
echo "🎯 **Service Status Summary:**"
echo "  - Frontend: https://beta.bitebase.app"
echo "  - Backend API: https://api.bitebase.app"
echo "  - AI Agents: https://ai.bitebase.app"
echo ""
echo "🍽️ Your BiteBase platform is ready for use! ✨"
