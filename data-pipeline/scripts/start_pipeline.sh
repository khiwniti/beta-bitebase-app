#!/bin/bash

# BiteBase Data Pipeline Startup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🚀 Starting BiteBase Data Pipeline${NC}"
echo "=================================================="

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "$PIPELINE_DIR/pipeline_manager.py" ]; then
    print_error "Pipeline manager not found. Please run from data-pipeline directory."
    exit 1
fi

cd "$PIPELINE_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_warning "Virtual environment not found. Creating one..."
    python3 -m venv venv
    print_status "Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate
print_status "Virtual environment activated"

# Check if requirements are installed
if [ ! -f "venv/requirements_installed.flag" ]; then
    print_warning "Installing requirements..."
    pip install -r requirements.txt
    touch venv/requirements_installed.flag
    print_status "Requirements installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        print_warning "Creating .env file from .env.example"
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before proceeding"
        exit 1
    else
        print_error ".env.example file not found"
        exit 1
    fi
fi

# Parse command line arguments
ACTION="scheduler"
REGIONS="bangkok"
CATEGORIES="restaurant"
MAX_PAGES=3

while [[ $# -gt 0 ]]; do
    case $1 in
        --action)
            ACTION="$2"
            shift 2
            ;;
        --regions)
            REGIONS="$2"
            shift 2
            ;;
        --categories)
            CATEGORIES="$2"
            shift 2
            ;;
        --max-pages)
            MAX_PAGES="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --action ACTION      Action to perform (scheduler, run-once, status)"
            echo "  --regions REGIONS    Regions to scrape (default: bangkok)"
            echo "  --categories CATS    Categories to scrape (default: restaurant)"
            echo "  --max-pages PAGES    Max pages per category (default: 3)"
            echo "  --help              Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                                    # Start scheduler"
            echo "  $0 --action run-once                  # Run pipeline once"
            echo "  $0 --action status                    # Show status"
            echo "  $0 --action run-once --regions 'bangkok chiang_mai' --max-pages 5"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute based on action
case $ACTION in
    "scheduler")
        print_status "Starting pipeline scheduler..."
        echo "Press Ctrl+C to stop the scheduler"
        python pipeline_manager.py --action start-scheduler
        ;;
    "run-once")
        print_status "Running pipeline once..."
        echo "Regions: $REGIONS"
        echo "Categories: $CATEGORIES"
        echo "Max pages: $MAX_PAGES"
        python pipeline_manager.py --action run-full-pipeline \
            --regions $REGIONS \
            --categories $CATEGORIES \
            --max-pages $MAX_PAGES
        ;;
    "status")
        print_status "Getting pipeline status..."
        python pipeline_manager.py --action status
        ;;
    *)
        print_error "Unknown action: $ACTION"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

print_status "Pipeline operation completed"