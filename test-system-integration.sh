#!/bin/bash

# BiteBase System Integration Test Script
# This script tests that all system components work together properly

set -e

echo "🧪 BiteBase System Integration Testing"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "\n${CYAN}🧪 Test $TESTS_TOTAL: $test_name${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local expected_content="$4"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "\n${CYAN}🌐 Test $TESTS_TOTAL: $name${NC}"
    echo "URL: $url"
    
    # Make HTTP request and capture response
    response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null || echo -e "\nERROR")
    http_code=$(echo "$response" | tail -n1)
    content=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        if [ -z "$expected_content" ] || echo "$content" | grep -q "$expected_content"; then
            echo -e "${GREEN}✅ PASS: $name (Status: $http_code)${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
            return 0
        else
            echo -e "${RED}❌ FAIL: $name - Content mismatch${NC}"
            echo "Expected: $expected_content"
            echo "Got: $content"
            TESTS_FAILED=$((TESTS_FAILED + 1))
            return 1
        fi
    else
        echo -e "${RED}❌ FAIL: $name - Status code mismatch${NC}"
        echo "Expected: $expected_status, Got: $http_code"
        echo "Response: $content"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Parse command line arguments
BACKEND_URL=""
FRONTEND_URL=""
LOCAL_TEST=false
PRODUCTION_TEST=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-url)
            BACKEND_URL="$2"
            shift 2
            ;;
        --frontend-url)
            FRONTEND_URL="$2"
            shift 2
            ;;
        --local)
            LOCAL_TEST=true
            BACKEND_URL="http://localhost:8787"
            FRONTEND_URL="http://localhost:3000"
            shift
            ;;
        --production)
            PRODUCTION_TEST=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --backend-url URL    Backend URL to test"
            echo "  --frontend-url URL   Frontend URL to test"
            echo "  --local             Test local development servers"
            echo "  --production        Test production deployment"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 --local"
            echo "  $0 --production"
            echo "  $0 --backend-url https://api.example.com --frontend-url https://app.example.com"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Auto-detect URLs if not provided
if [ "$PRODUCTION_TEST" = "true" ] && [ -z "$BACKEND_URL" ]; then
    echo -e "${YELLOW}🔍 Auto-detecting production URLs...${NC}"
    
    # Try to get backend URL from wrangler
    if command -v wrangler &> /dev/null; then
        cd apps/backend 2>/dev/null || true
        BACKEND_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://[^/]*workers.dev' | head -1)
        if [ -z "$BACKEND_URL" ]; then
            BACKEND_URL="https://bitebase-backend-prod.your-subdomain.workers.dev"
        fi
        cd - > /dev/null 2>&1 || true
    fi
    
    # Try to get frontend URL from vercel
    if command -v vercel &> /dev/null && [ -z "$FRONTEND_URL" ]; then
        cd apps/frontend 2>/dev/null || true
        FRONTEND_URL=$(vercel ls 2>/dev/null | grep -o 'https://[^[:space:]]*vercel.app' | head -1)
        if [ -z "$FRONTEND_URL" ]; then
            FRONTEND_URL="https://bitebase-frontend.vercel.app"
        fi
        cd - > /dev/null 2>&1 || true
    fi
fi

# Default URLs if still not set
if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL="http://localhost:8787"
fi
if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="http://localhost:3000"
fi

echo -e "${BLUE}🎯 Testing Configuration:${NC}"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "Local Test: $LOCAL_TEST"
echo "Production Test: $PRODUCTION_TEST"

# Check if URLs are accessible
echo -e "\n${PURPLE}🔍 Connectivity Tests${NC}"

test_endpoint "Backend Health Check" "$BACKEND_URL/health" "200" "healthy"
test_endpoint "Backend API Info" "$BACKEND_URL/api" "200" "BiteBase Backend API"

if [ "$LOCAL_TEST" = "false" ]; then
    test_endpoint "Frontend Accessibility" "$FRONTEND_URL" "200" ""
fi

# API Endpoint Tests
echo -e "\n${PURPLE}🔌 API Endpoint Tests${NC}"

# Test restaurant endpoints
test_endpoint "Get Restaurants (No Auth)" "$BACKEND_URL/api/restaurants?latitude=13.7563&longitude=100.5018&radius=5000" "200" "restaurants"

# Test authentication endpoints
echo -e "\n${CYAN}🔐 Testing Authentication Flow${NC}"

# Register a test user
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"
TEST_NAME="Test User"

REGISTER_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"name\":\"$TEST_NAME\"}" \
    2>/dev/null || echo "ERROR")

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS: User Registration${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Extract token
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    
    if [ ! -z "$TOKEN" ]; then
        echo -e "${GREEN}✅ PASS: JWT Token Generated${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        
        # Test protected endpoint
        PROFILE_RESPONSE=$(curl -s "$BACKEND_URL/api/users/profile" \
            -H "Authorization: Bearer $TOKEN" \
            2>/dev/null || echo "ERROR")
        
        if echo "$PROFILE_RESPONSE" | grep -q "$TEST_EMAIL"; then
            echo -e "${GREEN}✅ PASS: Protected Endpoint Access${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL: Protected Endpoint Access${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "${RED}❌ FAIL: JWT Token Generation${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${RED}❌ FAIL: User Registration${NC}"
    echo "Response: $REGISTER_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

TESTS_TOTAL=$((TESTS_TOTAL + 3))

# Test login
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
    2>/dev/null || echo "ERROR")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ PASS: User Login${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: User Login${NC}"
    echo "Response: $LOGIN_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Database Integration Tests
echo -e "\n${PURPLE}🗄️ Database Integration Tests${NC}"

if [ "$LOCAL_TEST" = "false" ] && command -v wrangler &> /dev/null; then
    cd apps/backend 2>/dev/null || true
    
    # Test database connection
    if wrangler d1 execute bitebase-production --command="SELECT 1" &>/dev/null; then
        echo -e "${GREEN}✅ PASS: Database Connection${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        
        # Test table existence
        TABLES=$(wrangler d1 execute bitebase-production --command="SELECT name FROM sqlite_master WHERE type='table'" 2>/dev/null || echo "ERROR")
        if echo "$TABLES" | grep -q "users"; then
            echo -e "${GREEN}✅ PASS: Database Schema (users table exists)${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL: Database Schema (users table missing)${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
        
        # Test user count
        USER_COUNT=$(wrangler d1 execute bitebase-production --command="SELECT COUNT(*) as count FROM users" 2>/dev/null | grep -o '[0-9]*' | tail -1)
        if [ ! -z "$USER_COUNT" ] && [ "$USER_COUNT" -ge 0 ]; then
            echo -e "${GREEN}✅ PASS: Database Query (user count: $USER_COUNT)${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAIL: Database Query${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "${RED}❌ FAIL: Database Connection${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${YELLOW}⚠️ Skipping database tests${NC}"
    fi
    
    cd - > /dev/null 2>&1 || true
    TESTS_TOTAL=$((TESTS_TOTAL + 3))
else
    echo -e "${YELLOW}⚠️ Skipping database tests (local mode or wrangler not available)${NC}"
fi

# Frontend-Backend Integration Tests
echo -e "\n${PURPLE}🔗 Frontend-Backend Integration Tests${NC}"

if [ "$LOCAL_TEST" = "false" ]; then
    # Test if frontend can reach backend
    FRONTEND_API_TEST=$(curl -s "$FRONTEND_URL/api/backend/health" 2>/dev/null || echo "ERROR")
    if echo "$FRONTEND_API_TEST" | grep -q "healthy"; then
        echo -e "${GREEN}✅ PASS: Frontend-Backend Proxy${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAIL: Frontend-Backend Proxy${NC}"
        echo "Response: $FRONTEND_API_TEST"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
else
    echo -e "${YELLOW}⚠️ Skipping frontend-backend integration tests (local mode)${NC}"
fi

# CORS Tests
echo -e "\n${PURPLE}🌐 CORS Configuration Tests${NC}"

# Test CORS preflight
CORS_RESPONSE=$(curl -s -X OPTIONS "$BACKEND_URL/api/restaurants" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -w "%{http_code}" \
    2>/dev/null || echo "ERROR")

if echo "$CORS_RESPONSE" | grep -q "200"; then
    echo -e "${GREEN}✅ PASS: CORS Preflight${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: CORS Preflight${NC}"
    echo "Response: $CORS_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Performance Tests
echo -e "\n${PURPLE}⚡ Performance Tests${NC}"

# Test response time
START_TIME=$(date +%s%N)
curl -s "$BACKEND_URL/health" > /dev/null 2>&1
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 )) # Convert to milliseconds

if [ "$RESPONSE_TIME" -lt 1000 ]; then
    echo -e "${GREEN}✅ PASS: Response Time (${RESPONSE_TIME}ms < 1000ms)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️ SLOW: Response Time (${RESPONSE_TIME}ms >= 1000ms)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

TESTS_TOTAL=$((TESTS_TOTAL + 1))

# Security Tests
echo -e "\n${PURPLE}🔒 Security Tests${NC}"

# Test that sensitive endpoints require authentication
PROTECTED_RESPONSE=$(curl -s -w "%{http_code}" "$BACKEND_URL/api/users/profile" 2>/dev/null | tail -1)
if [ "$PROTECTED_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ PASS: Protected Endpoint Security${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}❌ FAIL: Protected Endpoint Security (Expected 401, got $PROTECTED_RESPONSE)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Test security headers
SECURITY_HEADERS=$(curl -s -I "$BACKEND_URL/health" 2>/dev/null || echo "ERROR")
if echo "$SECURITY_HEADERS" | grep -qi "x-content-type-options"; then
    echo -e "${GREEN}✅ PASS: Security Headers Present${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${YELLOW}⚠️ WARNING: Security Headers Missing${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

TESTS_TOTAL=$((TESTS_TOTAL + 2))

# Configuration Tests
echo -e "\n${PURPLE}⚙️ Configuration Tests${NC}"

# Check if required files exist
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_test "Backend wrangler.toml exists" "[ -f '$SCRIPT_DIR/apps/backend/wrangler.toml' ]"
run_test "Frontend vercel.json exists" "[ -f '$SCRIPT_DIR/apps/frontend/vercel.json' ]"
run_test "Backend package.json exists" "[ -f '$SCRIPT_DIR/apps/backend/package.json' ]"
run_test "Frontend package.json exists" "[ -f '$SCRIPT_DIR/apps/frontend/package.json' ]"
run_test "Deployment script exists" "[ -f '$SCRIPT_DIR/deploy-cloudflare.sh' ]"
run_test "Setup script exists" "[ -f '$SCRIPT_DIR/setup-cloudflare.sh' ]"

# Check if scripts are executable
run_test "Deployment script is executable" "[ -x '$SCRIPT_DIR/deploy-cloudflare.sh' ]"
run_test "Setup script is executable" "[ -x '$SCRIPT_DIR/setup-cloudflare.sh' ]"

# Environment Tests
echo -e "\n${PURPLE}🌍 Environment Tests${NC}"

# Check if required CLIs are available
run_test "Node.js is available" "command -v node > /dev/null"
run_test "NPM is available" "command -v npm > /dev/null"

if [ "$LOCAL_TEST" = "false" ]; then
    run_test "Wrangler CLI is available" "command -v wrangler > /dev/null"
    run_test "Vercel CLI is available" "command -v vercel > /dev/null"
    
    # Check authentication
    if command -v wrangler &> /dev/null; then
        run_test "Wrangler authentication" "wrangler whoami > /dev/null 2>&1"
    fi
    
    if command -v vercel &> /dev/null; then
        run_test "Vercel authentication" "vercel whoami > /dev/null 2>&1"
    fi
fi

# Generate Test Report
echo -e "\n${BLUE}📊 Test Results Summary${NC}"
echo "=================================="
echo -e "Total Tests: ${CYAN}$TESTS_TOTAL${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Your system components are working together properly.${NC}"
    OVERALL_STATUS="PASS"
else
    echo -e "\n${RED}❌ Some tests failed. Please review the failures above.${NC}"
    OVERALL_STATUS="FAIL"
fi

# Calculate success rate
SUCCESS_RATE=$(( (TESTS_PASSED * 100) / TESTS_TOTAL ))
echo -e "Success Rate: ${CYAN}$SUCCESS_RATE%${NC}"

# Recommendations based on test results
echo -e "\n${BLUE}💡 Recommendations:${NC}"

if [ $TESTS_FAILED -gt 0 ]; then
    echo "1. Review failed tests and fix configuration issues"
    echo "2. Check environment variables and secrets"
    echo "3. Verify network connectivity and CORS settings"
    echo "4. Ensure all required services are deployed and running"
fi

if [ "$SUCCESS_RATE" -lt 80 ]; then
    echo "5. Consider running setup script: ./setup-cloudflare.sh"
    echo "6. Check deployment guide: CLOUDFLARE_DEPLOYMENT_GUIDE.md"
fi

if [ "$SUCCESS_RATE" -ge 80 ]; then
    echo "✅ Your system is mostly working correctly!"
    echo "🚀 Ready for production deployment with: ./deploy-cloudflare.sh --production"
fi

# Exit with appropriate code
if [ "$OVERALL_STATUS" = "PASS" ]; then
    exit 0
else
    exit 1
fi