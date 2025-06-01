#!/bin/bash

# BiteBase Agent Adapter Startup Script

echo "🚀 Starting BiteBase Agent Adapter..."

# Check if setup script exists and is executable
if [ ! -f "./setup-agent-adapter.sh" ] || [ ! -x "./setup-agent-adapter.sh" ]; then
  echo "❌ Setup script not found or not executable. Please ensure setup-agent-adapter.sh exists and has execute permissions."
  exit 1
fi

# Check if agent adapter directory exists
if [ ! -d "./agent-adapter" ]; then
  echo "🔍 Agent adapter directory not found. Running setup script..."
  ./setup-agent-adapter.sh
  
  # Check if setup was successful
  if [ $? -ne 0 ]; then
    echo "❌ Setup failed. Please check the error messages above."
    exit 1
  fi
fi

# Change to agent adapter directory
cd agent-adapter || { echo "❌ Failed to change to agent-adapter directory"; exit 1; }

# Check if node_modules directory exists, if not, install dependencies
if [ ! -d "./node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  
  # Check if npm install was successful
  if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Please check your npm and internet connection."
    exit 1
  fi
fi

# Check if .env file exists, create if not
if [ ! -f ".env" ]; then
  echo "📝 Creating default .env file..."
  cat > .env << EOL
# BiteBase Agent Adapter Configuration

# Server settings
PORT=3002
HOST=0.0.0.0
NODE_ENV=development

# Agent service URLs
AGENT_FASTAPI_URL=http://localhost:8001
AGENT_GATEWAY_URL=http://localhost:5000

# Timeout settings (milliseconds)
RESEARCH_TIMEOUT=30000
RESTAURANTS_TIMEOUT=30000
ANALYZE_TIMEOUT=45000
GEOCODE_TIMEOUT=15000
HEALTH_TIMEOUT=5000

# CORS settings
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Origin,X-Requested-With,Content-Type,Accept,Authorization

# Logging settings
LOG_LEVEL=info
ENABLE_LOGGING=true
EOL
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if port is available
port=$(grep -oP 'PORT=\K\d+' .env || echo 3002)
if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
  echo "⚠️ Warning: Port $port is already in use. The adapter might not start correctly."
fi

# Start the agent adapter
echo "✨ Starting agent adapter on port $port..."
npm start 