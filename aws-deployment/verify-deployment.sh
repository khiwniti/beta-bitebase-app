#!/bin/bash

# BiteBase Deployment Verification Script
# This script verifies that all services are running correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 BiteBase Deployment Verification${NC}"
echo -e "${BLUE}===================================${NC}"

# Configuration
DEPLOY_DIR="/opt/bitebase"
COMPOSE_FILE="docker-compose.fullstack.yml"

# Function to print test results
print_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name${NC}"
        if [ -n "$details" ]; then
            echo -e "   ${CYAN}$details${NC}"
        fi
    else
        echo -e "${RED}❌ $test_name${NC}"
        if [ -n "$details" ]; then
            echo -e "   ${RED}$details${NC}"
        fi
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local url="$1"
    local expected_status="$2"
    local timeout="${3:-10}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $timeout "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo "PASS"
    else
        echo "FAIL"
    fi
}

# Function to test service health
test_service_health() {
    local service_name="$1"
    local container_name="$2"
    
    if docker ps | grep -q "$container_name.*Up"; then
        local health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "no-health-check")
        if [ "$health_status" = "healthy" ] || [ "$health_status" = "no-health-check" ]; then
            echo "PASS"
        else
            echo "FAIL"
        fi
    else
        echo "FAIL"
    fi
}

echo -e "\n${PURPLE}🐳 Docker Services${NC}"
echo -e "${PURPLE}==================${NC}"

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    print_test "Deployment Directory" "FAIL" "Directory $DEPLOY_DIR not found"
    exit 1
else
    print_test "Deployment Directory" "PASS" "$DEPLOY_DIR exists"
fi

cd "$DEPLOY_DIR"

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    print_test "Docker Compose File" "FAIL" "$COMPOSE_FILE not found"
    exit 1
else
    print_test "Docker Compose File" "PASS" "$COMPOSE_FILE exists"
fi

# Test individual services
services=("bitebase-backend" "bitebase-frontend" "bitebase-postgres" "bitebase-redis" "bitebase-nginx")

for service in "${services[@]}"; do
    result=$(test_service_health "$service" "$service")
    if [ "$result" = "PASS" ]; then
        status=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep "$service" | awk '{print $2}')
        print_test "$service" "PASS" "Status: $status"
    else
        print_test "$service" "FAIL" "Container not running or unhealthy"
    fi
done

echo -e "\n${PURPLE}🌐 Network Connectivity${NC}"
echo -e "${PURPLE}========================${NC}"

# Test internal network connectivity
backend_result=$(test_endpoint "http://localhost:8000/health" "200")
print_test "Backend Health (Internal)" "$backend_result" "http://localhost:8000/health"

frontend_result=$(test_endpoint "http://localhost:3000/api/health" "200")
print_test "Frontend Health (Internal)" "$frontend_result" "http://localhost:3000/api/health"

# Test external access through nginx
nginx_health_result=$(test_endpoint "http://localhost/health" "200")
print_test "Nginx Health Check" "$nginx_health_result" "http://localhost/health"

nginx_frontend_result=$(test_endpoint "http://localhost/" "200")
print_test "Frontend via Nginx" "$nginx_frontend_result" "http://localhost/"

nginx_backend_result=$(test_endpoint "http://localhost/api/health" "200")
print_test "Backend API via Nginx" "$nginx_backend_result" "http://localhost/api/health"

echo -e "\n${PURPLE}🔒 SSL/HTTPS${NC}"
echo -e "${PURPLE}==============${NC}"

# Test HTTPS if certificates exist
if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
    print_test "SSL Certificates" "PASS" "Certificates found"
    
    https_result=$(test_endpoint "https://localhost/health" "200")
    print_test "HTTPS Access" "$https_result" "https://localhost/health"
else
    print_test "SSL Certificates" "FAIL" "Certificates not found"
fi

echo -e "\n${PURPLE}💾 Database Connectivity${NC}"
echo -e "${PURPLE}=========================${NC}"

# Test PostgreSQL connection
postgres_test=$(docker exec bitebase-postgres psql -U bitebase -d bitebase_prod -c "SELECT 1;" 2>/dev/null && echo "PASS" || echo "FAIL")
print_test "PostgreSQL Connection" "$postgres_test" "Database connection test"

# Test Redis connection
redis_test=$(docker exec bitebase-redis redis-cli ping 2>/dev/null | grep -q "PONG" && echo "PASS" || echo "FAIL")
print_test "Redis Connection" "$redis_test" "Cache connection test"

echo -e "\n${PURPLE}📊 Resource Usage${NC}"
echo -e "${PURPLE}==================${NC}"

# Check disk usage
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$disk_usage" -lt 80 ]; then
    print_test "Disk Usage" "PASS" "${disk_usage}% used"
else
    print_test "Disk Usage" "FAIL" "${disk_usage}% used (>80%)"
fi

# Check memory usage
memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$memory_usage" -lt 90 ]; then
    print_test "Memory Usage" "PASS" "${memory_usage}% used"
else
    print_test "Memory Usage" "FAIL" "${memory_usage}% used (>90%)"
fi

echo -e "\n${PURPLE}📝 Configuration${NC}"
echo -e "${PURPLE}=================${NC}"

# Check environment file
if [ -f ".env" ]; then
    print_test "Environment File" "PASS" ".env file exists"
    
    # Check for required variables
    required_vars=("DATABASE_URL" "JWT_SECRET" "POSTGRES_PASSWORD" "REDIS_PASSWORD")
    for var in "${required_vars[@]}"; do
        if grep -q "^$var=" .env && ! grep -q "^$var=your_" .env; then
            print_test "$var" "PASS" "Configured"
        else
            print_test "$var" "FAIL" "Not configured or using default value"
        fi
    done
else
    print_test "Environment File" "FAIL" ".env file not found"
fi

echo -e "\n${PURPLE}🔍 Log Analysis${NC}"
echo -e "${PURPLE}================${NC}"

# Check for recent errors in logs
error_count=$(docker-compose -f $COMPOSE_FILE logs --since="1h" 2>/dev/null | grep -i error | wc -l)
if [ "$error_count" -eq 0 ]; then
    print_test "Recent Errors" "PASS" "No errors in last hour"
else
    print_test "Recent Errors" "FAIL" "$error_count errors found in last hour"
fi

# Check if all containers started successfully
startup_errors=$(docker-compose -f $COMPOSE_FILE logs 2>/dev/null | grep -i "failed\|error\|exception" | grep -v "health" | wc -l)
if [ "$startup_errors" -eq 0 ]; then
    print_test "Startup Errors" "PASS" "Clean startup"
else
    print_test "Startup Errors" "FAIL" "$startup_errors startup issues found"
fi

echo -e "\n${PURPLE}📋 Summary${NC}"
echo -e "${PURPLE}==========${NC}"

# Get public IP
public_ip=$(curl -s ifconfig.me 2>/dev/null || echo "Unable to detect")

echo -e "${CYAN}🌐 Access URLs:${NC}"
echo -e "  ${GREEN}Public IP:${NC}        $public_ip"
echo -e "  ${GREEN}Frontend (HTTP):${NC}  http://$public_ip"
echo -e "  ${GREEN}Frontend (HTTPS):${NC} https://$public_ip"
echo -e "  ${GREEN}Backend API:${NC}      https://$public_ip/api"
echo -e "  ${GREEN}Health Check:${NC}     https://$public_ip/health"

echo -e "\n${CYAN}🔧 Quick Commands:${NC}"
echo -e "  ${GREEN}View logs:${NC}     docker-compose -f $COMPOSE_FILE logs -f"
echo -e "  ${GREEN}Restart:${NC}       docker-compose -f $COMPOSE_FILE restart"
echo -e "  ${GREEN}Status:${NC}        docker-compose -f $COMPOSE_FILE ps"
echo -e "  ${GREEN}Stop:${NC}          docker-compose -f $COMPOSE_FILE down"

echo -e "\n${GREEN}✅ Verification completed!${NC}"

# Exit with error code if any critical services are down
critical_services=("bitebase-backend" "bitebase-frontend" "bitebase-postgres" "bitebase-nginx")
for service in "${critical_services[@]}"; do
    if ! docker ps | grep -q "$service.*Up"; then
        echo -e "\n${RED}❌ Critical service $service is not running!${NC}"
        exit 1
    fi
done

echo -e "${GREEN}🎉 All critical services are running successfully!${NC}"