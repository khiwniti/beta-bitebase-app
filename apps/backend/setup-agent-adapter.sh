#!/bin/bash

echo "🚀 Setting up BiteBase Agent Adapter..."

# Create directory for agent adapter
mkdir -p agent-adapter

# Copy core files
cp agent-adapter.js agent-adapter/
cp agent-adapter-package.json agent-adapter/package.json

# Copy documentation
echo "📄 Copying documentation files..."
cat > agent-adapter/README.md << EOL
# BiteBase Agent Adapter

A lightweight Express server that acts as an adapter between your application and the BiteBase agent system.

## Overview

This adapter provides a simplified API to interact with BiteBase's agent system, handling request routing, error handling, and response formatting. It serves as a bridge between your frontend/backend services and the AI agent functionality.

## Features

- Simple REST API for agent interactions
- Health monitoring of agent services
- Automatic error handling and retries
- Configurable timeouts and endpoints
- CORS support for browser-based applications

## Setup

1. Ensure you have Node.js installed (v14 or later)
2. Install dependencies: \`npm install\`
3. Configure environment variables in \`.env\` file (optional)
4. Start the server: \`npm start\`

## API Endpoints

- Health Check: \`GET /health\`
- Research: \`POST /api/research\`
- Restaurants: \`GET /api/restaurants\`
- Market Analysis: \`GET /api/analyze\`
- Geocode: \`GET /api/geocode\`

For detailed documentation, see the API documentation files.
EOL

# Create example client
echo "📝 Creating example client..."
cat > agent-adapter/example-client.js << EOL
/**
 * Example Client for BiteBase Agent Adapter
 * 
 * This script demonstrates how to interact with the agent adapter endpoints.
 */

const axios = require('axios');

// Agent adapter URL
const ADAPTER_URL = process.env.ADAPTER_URL || 'http://localhost:3002';

/**
 * Check agent health
 */
async function checkHealth() {
  try {
    console.log('Checking agent health...');
    const response = await axios.get(\`\${ADAPTER_URL}/health\`);
    console.log('Health status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return null;
  }
}

/**
 * Research restaurant information
 */
async function researchRestaurant(query) {
  try {
    console.log(\`Researching restaurant: \${query}\`);
    const response = await axios.post(\`\${ADAPTER_URL}/api/research\`, {
      query,
      type: 'restaurant'
    });
    console.log('Research results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Research failed:', error.message);
    return null;
  }
}

/**
 * Get restaurants near a location
 */
async function getNearbyRestaurants(latitude, longitude, radius = 5, platforms = 'all') {
  try {
    console.log(\`Getting restaurants near [\${latitude}, \${longitude}] within \${radius}km\`);
    const response = await axios.get(\`\${ADAPTER_URL}/api/restaurants\`, {
      params: { latitude, longitude, radius, platforms }
    });
    console.log(\`Found \${response.data.length} restaurants\`);
    return response.data;
  } catch (error) {
    console.error('Restaurant search failed:', error.message);
    return null;
  }
}

/**
 * Analyze the market for a location
 */
async function analyzeMarket(latitude, longitude, radius = 5, analysis_type = 'comprehensive') {
  try {
    console.log(\`Analyzing market at [\${latitude}, \${longitude}] within \${radius}km\`);
    const response = await axios.get(\`\${ADAPTER_URL}/api/analyze\`, {
      params: { latitude, longitude, radius, analysis_type }
    });
    console.log('Market analysis:', response.data);
    return response.data;
  } catch (error) {
    console.error('Market analysis failed:', error.message);
    return null;
  }
}

/**
 * Geocode an address
 */
async function geocodeAddress(address) {
  try {
    console.log(\`Geocoding address: \${address}\`);
    const response = await axios.get(\`\${ADAPTER_URL}/api/geocode\`, {
      params: { address }
    });
    console.log('Geocoding results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Geocoding failed:', error.message);
    return null;
  }
}

/**
 * Run example tests
 */
async function runExamples() {
  // Check health first
  const health = await checkHealth();
  
  if (!health || (!health.fastapi.status === 'healthy' && !health.gateway.status === 'healthy')) {
    console.warn('⚠️ Agent services appear to be offline. Examples may fail.');
  }
  
  // Example 1: Research a restaurant
  await researchRestaurant('Thai restaurant business model');
  
  // Example 2: Get nearby restaurants
  await getNearbyRestaurants(40.7128, -74.0060, 2); // New York City
  
  // Example 3: Market analysis
  await analyzeMarket(40.7128, -74.0060, 2, 'competition');
  
  // Example 4: Geocode an address
  await geocodeAddress('350 5th Ave, New York, NY 10118');
}

// If this script is run directly, execute the examples
if (require.main === module) {
  console.log('Running BiteBase Agent Adapter examples...');
  runExamples().catch(error => {
    console.error('Example run failed:', error);
  });
}

// Export functions for use in other modules
module.exports = {
  checkHealth,
  researchRestaurant,
  getNearbyRestaurants,
  analyzeMarket,
  geocodeAddress
};
EOL

# Create Docker configuration
echo "🐳 Creating Docker files..."
cat > agent-adapter/Dockerfile << EOL
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Start the application
CMD ["node", "agent-adapter.js"]
EOL

cat > agent-adapter/docker-compose.yml << EOL
version: '3'

services:
  agent-adapter:
    build: .
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - AGENT_FASTAPI_URL=http://agent-fastapi:8001
      - AGENT_GATEWAY_URL=http://agent-gateway:5000
    restart: unless-stopped
    networks:
      - bitebase-network

  # The following services are commented out but can be enabled
  # if you have the agent services available locally
  
  # agent-fastapi:
  #   image: bitebase/agent-fastapi:latest
  #   ports:
  #     - "8001:8001"
  #   environment:
  #     - PORT=8001
  #   restart: unless-stopped
  #   networks:
  #     - bitebase-network
  
  # agent-gateway:
  #   image: bitebase/agent-gateway:latest
  #   ports:
  #     - "5000:5000"
  #   environment:
  #     - PORT=5000
  #     - AGENT_FASTAPI_URL=http://agent-fastapi:8001
  #   restart: unless-stopped
  #   networks:
  #     - bitebase-network

networks:
  bitebase-network:
    driver: bridge
EOL

# Create .env file
echo "📝 Creating .env file..."
cat > agent-adapter/.env << EOL
# BiteBase Agent Adapter Configuration

# Server settings
PORT=3002

# Agent service URLs
AGENT_FASTAPI_URL=http://localhost:8001
AGENT_GATEWAY_URL=http://localhost:5000

# Timeout settings (milliseconds)
RESEARCH_TIMEOUT=30000
RESTAURANTS_TIMEOUT=30000
ANALYZE_TIMEOUT=45000
GEOCODE_TIMEOUT=15000
HEALTH_TIMEOUT=5000
EOL

# Change to agent adapter directory
cd agent-adapter

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🔧 To start the agent adapter, run:"
echo "cd agent-adapter && npm start"
echo ""
echo "🔗 The adapter will be available at:"
echo "http://localhost:3002"
echo ""
echo "🤖 API endpoints:"
echo "- Health check: GET /health"
echo "- Research: POST /api/research"
echo "- Restaurants: GET /api/restaurants"
echo "- Analyze: GET /api/analyze"
echo "- Geocode: GET /api/geocode" 