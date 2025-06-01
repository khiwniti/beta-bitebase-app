#!/bin/bash

echo "🚀 Starting BiteBase Backend Services..."

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $port is already in use"
        return 0
    else
        return 1
    fi
}

# Start User Backend (Port 8000)
echo "🔌 Starting User Backend on port 8000..."
if check_port 8000; then
    echo "✅ User Backend already running on port 8000"
else
    cd bitebase-geospatial-saas/apps/user-backend
    python3 main.py &
    USER_BACKEND_PID=$!
    echo "✅ User Backend started with PID $USER_BACKEND_PID"
    cd ../..
fi

sleep 2

# Start CopilotKit Service (Port 8001)
echo "🤖 Starting CopilotKit Service on port 8001..."
if check_port 8001; then
    echo "✅ CopilotKit Service already running on port 8001"
else
    cd bitebase-geospatial-saas/apps/copilotkit-service
    python3 main.py &
    COPILOTKIT_PID=$!
    echo "✅ CopilotKit Service started with PID $COPILOTKIT_PID"
    cd ../..
fi

sleep 2

# Start MCP Gateway (Port 8002)
echo "🚪 Starting MCP Gateway on port 8002..."
if check_port 8002; then
    echo "✅ MCP Gateway already running on port 8002"
else
    cd bitebase-geospatial-saas/apps/mcp-gateway
    python3 main.py &
    MCP_GATEWAY_PID=$!
    echo "✅ MCP Gateway started with PID $MCP_GATEWAY_PID"
    cd ../..
fi

echo ""
echo "🎉 Backend services startup complete!"
echo ""
echo "📊 Service Status:"
echo "  🌐 Frontend:        http://localhost:3000 (Already running)"
echo "  🔌 User Backend:    http://localhost:8000"
echo "  🤖 CopilotKit:      http://localhost:8001"
echo "  🚪 MCP Gateway:     http://localhost:8002"
echo ""
echo "📚 API Documentation:"
echo "  📖 User Backend:    http://localhost:8000/docs"
echo "  📖 CopilotKit:      http://localhost:8001/docs"
echo "  📖 MCP Gateway:     http://localhost:8002/docs"
echo ""
echo "✅ All services are now running!"
