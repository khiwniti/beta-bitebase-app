#!/bin/bash

# Simple cleanup script for BiteBase project
# Removes specific old files while preserving the current architecture

echo "🧹 BiteBase Simple Cleanup"
echo "========================="

# Create backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup in $BACKUP_DIR..."

# Function to safely remove file/directory
safe_remove() {
    local item="$1"
    if [ -e "$item" ]; then
        echo "🗑️  Removing: $item"
        # Create backup first
        cp -r "$item" "$BACKUP_DIR/" 2>/dev/null || true
        rm -rf "$item"
    fi
}

# Remove old backend config files that conflict with production setup
echo ""
echo "🔧 Cleaning backend config files..."
safe_remove "apps/backend/config"
safe_remove "apps/backend/database"
safe_remove "apps/backend/favicon.ico"
safe_remove "apps/backend/BACKEND-IMPROVEMENTS.md"

# Remove any old log files
echo ""
echo "📜 Cleaning log files..."
find . -name "*.log" -type f -exec rm -f {} \; 2>/dev/null || true

# Remove old bundle/patch files
echo ""
echo "📦 Cleaning bundle files..."
safe_remove "bitebase-production-ready.bundle"
safe_remove "bitebase-production-ready.patch"

# Clean up any old backup directories
echo ""
echo "🗂️  Cleaning old backup directories..."
find . -maxdepth 1 -name "backup_*" -type d ! -name "$BACKUP_DIR" -exec rm -rf {} \; 2>/dev/null || true

# Update .dockerignore for backend
echo ""
echo "🐳 Updating .dockerignore..."
cat > apps/backend/.dockerignore << 'EOF'
# Dependencies
node_modules
npm-debug.log*

# Environment files
.env*

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage

# Temporary folders
tmp
temp

# IDE files
.vscode
.idea
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
Thumbs.db

# Git
.git
.gitignore

# Documentation
README*.md
docs/
*.md

# Test files
test/
tests/
*.test.js
*.spec.js

# Build artifacts
dist/
build/

# Old config files
config/
database/
EOF

echo ""
echo "✅ Simple cleanup completed!"
echo ""
echo "📋 What was cleaned:"
echo "  ✅ Old backend config files"
echo "  ✅ Log files"
echo "  ✅ Bundle/patch files"
echo "  ✅ Old backup directories"
echo "  ✅ Updated .dockerignore"
echo ""
echo "💾 Backup created in: $BACKUP_DIR"
echo ""
echo "🚀 Now test your Docker build:"
echo "   cd apps/backend"
echo "   docker build -t bitebase-backend-test ."
echo ""
