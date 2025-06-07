#!/bin/bash

# Development server for Restaurant Market Research Agent
# This script starts the FastAPI server in development mode with auto-reload

# Set environment variables if .env file exists
if [ -f .env ]; then
    echo "Loading environment variables from .env file"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set up Python path to include the necessary directories
export PYTHONPATH=$PYTHONPATH:$(pwd):$(pwd)/..

# Check if Python virtual environment exists
if [ -d "venv" ]; then
    echo "Activating virtual environment"
    source venv/bin/activate
fi

# Install dependencies if needed
pip install -r requirements.txt

# Create a static directory if it doesn't exist
if [ ! -d "static" ]; then
    echo "Creating static directory"
    mkdir -p static
fi

# Start the server in development mode
echo "Starting Restaurant Market Research Agent development server..."
cd $(dirname "$0")
uvicorn run_server:app --reload --host 0.0.0.0 --port 8000
