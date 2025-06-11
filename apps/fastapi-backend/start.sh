#!/bin/bash

# BiteBase FastAPI Backend Startup Script

set -e

echo "🚀 Starting BiteBase FastAPI Backend..."

# Check if we're in development or production
if [ "$ENVIRONMENT" = "production" ]; then
    echo "📦 Production mode detected"
    
    # Run database migrations
    echo "🔄 Running database migrations..."
    alembic upgrade head
    
    # Start the application with production settings
    echo "🌟 Starting production server..."
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4
else
    echo "🛠️ Development mode detected"
    
    # Install dependencies if requirements.txt is newer
    if [ requirements.txt -nt .requirements_installed ]; then
        echo "📦 Installing/updating dependencies..."
        pip install -r requirements.txt
        touch .requirements_installed
    fi
    
    # Run database migrations
    echo "🔄 Running database migrations..."
    alembic upgrade head
    
    # Start the application with development settings
    echo "🌟 Starting development server with auto-reload..."
    uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --reload
fi