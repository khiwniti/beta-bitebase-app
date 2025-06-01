#!/bin/bash

# BiteBase Development Environment Setup Script
# This script sets up the complete development environment including:
# - Frontend (Next.js)
# - Backend (Express.js API)
# - AI Agents (Python FastAPI)
# - Database (PostgreSQL)

set -e  # Exit on any error

echo "🚀 BiteBase Development Environment Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the bitebase-geospatial-saas root directory."
    exit 1
fi

print_status "Setting up BiteBase development environment..."

# Step 1: Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Node.js dependencies installed"
else
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# Step 2: Setup Frontend
print_status "Setting up Frontend (Next.js)..."
cd apps/frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ../..

# Step 3: Setup Backend
print_status "Setting up Backend (Express.js)..."
cd apps/backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ../..

# Step 4: Setup AI Agents (Python)
print_status "Setting up AI Agents (Python)..."
cd agent

# Check if Poetry is installed
if ! command -v poetry &> /dev/null; then
    print_warning "Poetry not found. Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

# Install Python dependencies
poetry install
if [ $? -eq 0 ]; then
    print_success "AI Agent dependencies installed"
else
    print_error "Failed to install AI Agent dependencies"
    exit 1
fi

# Install Node.js dependencies for agent server
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Agent Node.js dependencies installed"
    else
        print_warning "Failed to install agent Node.js dependencies"
    fi
fi

cd ..

# Step 5: Setup Environment Files
print_status "Setting up environment files..."

# Frontend environment
if [ ! -f "apps/frontend/.env.local" ]; then
    print_status "Creating frontend environment file..."
    cat > apps/frontend/.env.local << EOF
# BiteBase Frontend Environment
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_AGENT_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
EOF
    print_success "Frontend environment file created"
fi

# Backend environment
if [ ! -f "apps/backend/.env" ]; then
    print_status "Creating backend environment file..."
    cp apps/backend/.env.production apps/backend/.env
    print_success "Backend environment file created"
fi

# Agent environment
if [ ! -f "agent/.env" ]; then
    print_status "Creating agent environment file..."
    cp agent/.env.example agent/.env
    print_success "Agent environment file created"
    print_warning "Please update agent/.env with your API keys"
fi

# Step 6: Make scripts executable
print_status "Making scripts executable..."
chmod +x agent/dev-servers.sh
chmod +x agent/start-servers.sh
chmod +x apps/backend/scripts/*.sh 2>/dev/null || true
print_success "Scripts made executable"

# Step 7: Test database connection
print_status "Testing database connection..."
cd apps/backend
npm run db:init > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Database connection verified"
else
    print_warning "Database connection test failed - check your DATABASE_URL"
fi
cd ../..

print_success "Development environment setup completed!"
echo ""
echo "🎉 BiteBase Development Environment Ready!"
echo ""
echo "Available commands:"
echo "==================="
echo ""
echo "📱 Frontend Development:"
echo "  cd apps/frontend && npm run dev"
echo "  → Runs on http://localhost:3000"
echo ""
echo "🔧 Backend API Development:"
echo "  cd apps/backend && npm run express:dev"
echo "  → Runs on http://localhost:1337"
echo ""
echo "🤖 AI Agents Development:"
echo "  cd apps/backend && npm run agent:dev"
echo "  → FastAPI on http://localhost:8001"
echo "  → Express Gateway on http://localhost:5000"
echo ""
echo "🚀 Full Stack Development:"
echo "  cd apps/backend && npm run dev:full"
echo "  → Runs Backend API + AI Agents together"
echo ""
echo "📊 Database Management:"
echo "  cd apps/backend && npm run db:init"
echo "  → Initialize/test database connection"
echo ""
echo "⚙️  Environment Configuration:"
echo "  - Frontend: apps/frontend/.env.local"
echo "  - Backend: apps/backend/.env"
echo "  - Agents: agent/.env"
echo ""
echo "🔑 Required API Keys (update in agent/.env):"
echo "  - OPENAI_API_KEY"
echo "  - GOOGLE_MAPS_API_KEY"
echo "  - TAVILY_API_KEY (optional)"
echo ""
echo "Happy coding! 🍽️✨"
