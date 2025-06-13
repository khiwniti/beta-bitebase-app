#!/bin/bash

# 🚀 BiteBase Development Startup Script
# This script starts both frontend and backend in parallel using Turborepo

echo "🍽️ Starting BiteBase Development Environment..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

if [ ! -d "apps/api/venv" ]; then
    echo "Setting up Python virtual environment..."
    cd apps/api
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ../..
fi

echo ""
echo "🚀 Starting development servers..."
echo ""
echo "📊 Services starting:"
echo "  • Frontend (Next.js): http://localhost:3000"
echo "  • API (FastAPI): http://localhost:8000"
echo "  • API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start both frontend and API in parallel using Turborepo
npm run dev