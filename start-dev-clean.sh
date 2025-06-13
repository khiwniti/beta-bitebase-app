#!/bin/bash

# BiteBase Clean Development Start Script
# This script ensures a clean development environment

echo "🚀 Starting BiteBase Development Environment..."

# Set environment
export NODE_ENV=development
export NEXT_PUBLIC_API_URL=http://localhost:3001
export NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf apps/frontend/.next
rm -rf apps/frontend/node_modules/.cache
rm -rf .turbo

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development servers
echo "🌟 Starting development servers..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:3001"
echo "API will be available at: http://localhost:8000"

# Use npm instead of turbo to avoid corepack issues
npm run dev:frontend &
FRONTEND_PID=$!

npm run dev:backend &
BACKEND_PID=$!

npm run dev:api &
API_PID=$!

# Wait for user to stop
echo "✅ All services started! Press Ctrl+C to stop all services."

# Trap Ctrl+C and kill all background processes
trap 'echo "🛑 Stopping all services..."; kill $FRONTEND_PID $BACKEND_PID $API_PID 2>/dev/null; exit 0' INT

# Wait for all background processes
wait