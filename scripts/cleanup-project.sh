#!/bin/bash

# BiteBase Project Cleanup Script
# Removes old tech stack files and keeps only production-ready components

set -e

echo "🧹 BiteBase Project Cleanup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Create backup before cleanup
create_backup() {
    print_status "Creating backup before cleanup..."
    
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup important files that will be removed
    cp -r apps/fastapi-backend "$BACKUP_DIR/" 2>/dev/null || true
    cp -r data-pipeline "$BACKUP_DIR/" 2>/dev/null || true
    cp -r packages "$BACKUP_DIR/" 2>/dev/null || true
    cp -r pages "$BACKUP_DIR/" 2>/dev/null || true
    
    print_success "Backup created in $BACKUP_DIR"
}

# Remove old documentation files
cleanup_documentation() {
    print_status "Cleaning up old documentation files..."
    
    # Remove old deployment and status files
    OLD_DOCS=(
        "AGENT_ARCHITECTURE_CLARIFICATION.md"
        "AGENT_MIGRATION_COMPLETE.md"
        "BACKEND_FRONTEND_INTEGRATION_COMPLETE.md"
        "BRANCH_CLEANUP_SUMMARY.md"
        "CLOUDFLARE_DEPLOYMENT_GUIDE.md"
        "CLOUDFLARE_DEPLOYMENT_SUMMARY.md"
        "CLOUDFLARE_SYSTEM_VERIFICATION.md"
        "DATA_PIPELINE_INTEGRATION_GUIDE.md"
        "DEPLOYMENT.md"
        "DEPLOYMENT_GUIDE.md"
        "DEPLOYMENT_INSTRUCTIONS.md"
        "DEPLOYMENT_READY.md"
        "DEPLOYMENT_STATUS.md"
        "DEPLOYMENT_STATUS_UPDATE.md"
        "DEPLOYMENT_SUCCESS.md"
        "DEPLOYMENT_SUCCESS_CONFIRMATION.md"
        "DEPLOYMENT_SUMMARY.md"
        "DEPLOY_TRIGGER_1749519745.md"
        "FINAL_DEPLOYMENT_GUIDE.md"
        "FINAL_DEPLOYMENT_STATUS.md"
        "FORCE_DEPLOY_TRIGGER.md"
        "GITHUB_UPDATE_SOLUTION.md"
        "I18N_IMPLEMENTATION_GUIDE.md"
        "INTEGRATION_SUMMARY.md"
        "LOGO_BRANDING_UPDATE_SUMMARY.md"
        "MANUAL_UPDATE_INSTRUCTIONS.md"
        "PIPELINE_DEPLOYMENT_SUMMARY.md"
        "PRODUCTION_CHECKLIST.md"
        "PRODUCTION_DEPLOYMENT_CONFIG.md"
        "PRODUCTION_READY_SUMMARY.md"
        "README.production.md"
        "READY_FOR_DEPLOYMENT.md"
        "REAL_LOGO_IMPLEMENTATION_SUMMARY.md"
        "RENDER_ENV_SETUP.md"
        "RENDER_SETUP.md"
        "SCRAPING_SYSTEM_STATUS.md"
        "SYSTEM_INTEGRATION_GUIDE.md"
        "SYSTEM_VERIFICATION_REPORT.md"
        "THEME_UPDATE_SUMMARY.md"
        "TYPESCRIPT_BUILD_FIX.md"
        "VERCEL_BUILD_FIX.md"
        "VERCEL_BUILD_ISSUES_RESOLVED.md"
        "VERCEL_DEPLOYMENT_GUIDE.md"
        "VERCEL_DEPLOYMENT_ISSUE_RESOLVED.md"
        "VERCEL_DEPLOYMENT_SOLUTION.md"
        "VERCEL_DEPLOYMENT_STATUS.md"
        "VERCEL_DEPLOYMENT_SUMMARY.md"
        "VERCEL_DEPLOYMENT_TROUBLESHOOTING.md"
        "VERCEL_DEPLOY_TRIGGER.md"
        "VERCEL_ENV_SETUP.md"
        "VERCEL_SETUP.md"
    )
    
    for doc in "${OLD_DOCS[@]}"; do
        if [ -f "$doc" ]; then
            rm "$doc"
            print_success "Removed $doc"
        fi
    done
}

# Remove old backend implementations
cleanup_old_backends() {
    print_status "Cleaning up old backend implementations..."
    
    # Remove FastAPI backend (we're using Node.js production backend)
    if [ -d "apps/fastapi-backend" ]; then
        rm -rf "apps/fastapi-backend"
        print_success "Removed FastAPI backend"
    fi
    
    # Remove old backend files
    OLD_BACKEND_FILES=(
        "apps/backend/cloudflare-worker-enhanced.js"
        "apps/backend/cloudflare-worker-simple.js"
        "apps/backend/cloudflare-worker.js"
        "apps/backend/bitebase-api-server.js"
        "apps/backend/server.js"
        "apps/backend/start-strapi.js"
        "apps/backend/wongnai-scraper.js"
        "apps/backend/ai-assistant.js"
        "apps/backend/package-cloudflare.json"
        "apps/backend/agent-adapter-package.json"
        "apps/backend/setup-agent-adapter.sh"
        "apps/backend/start-agent.sh"
        "apps/backend/wrangler.toml"
        "apps/backend/vercel.json"
        "apps/backend/tsconfig.json"
    )
    
    for file in "${OLD_BACKEND_FILES[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            print_success "Removed $file"
        fi
    done
    
    # Remove old backend directories
    OLD_BACKEND_DIRS=(
        "apps/backend/agent"
        "apps/backend/agent-adapter"
        "apps/backend/src"
        "apps/backend/types"
        "apps/backend/scripts"
    )
    
    for dir in "${OLD_BACKEND_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            rm -rf "$dir"
            print_success "Removed directory $dir"
        fi
    done
}

# Remove old data pipeline and scraping systems
cleanup_data_systems() {
    print_status "Cleaning up old data pipeline and scraping systems..."
    
    # Remove data pipeline (replaced with AI-powered system)
    if [ -d "data-pipeline" ]; then
        rm -rf "data-pipeline"
        print_success "Removed data-pipeline directory"
    fi
    
    # Remove datalake
    if [ -d "datalake" ]; then
        rm -rf "datalake"
        print_success "Removed datalake directory"
    fi
    
    # Remove old Python scripts
    OLD_PYTHON_FILES=(
        "populate_sample_data.py"
        "test_scraping.py"
        "test_scraping_live.py"
    )
    
    for file in "${OLD_PYTHON_FILES[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            print_success "Removed $file"
        fi
    done
}

# Remove old deployment scripts
cleanup_old_deployment() {
    print_status "Cleaning up old deployment scripts..."
    
    OLD_DEPLOY_SCRIPTS=(
        "deploy-cloudflare.sh"
        "deploy-setup.sh"
        "deploy-vercel.sh"
        "deploy.sh"
        "setup-cloudflare.sh"
        "setup-dev-environment.sh"
        "setup-vercel.sh"
        "start-backends.sh"
        "start-dev-stack.sh"
        "start-frontend.sh"
        "start-services.sh"
        "stop-dev-stack.sh"
        "update-repository.sh"
        "verify-integration.sh"
    )
    
    for script in "${OLD_DEPLOY_SCRIPTS[@]}"; do
        if [ -f "$script" ]; then
            rm "$script"
            print_success "Removed $script"
        fi
    done
    
    # Remove old deployment scripts from scripts directory
    OLD_SCRIPTS_DIR=(
        "scripts/deploy-cloudflare.sh"
        "scripts/deploy-production.sh"
        "scripts/deploy-vercel.sh"
        "scripts/production-cleanup.sh"
        "scripts/setup-api-keys.sh"
        "scripts/setup-monitoring.js"
        "scripts/start-dev.sh"
        "scripts/verify-deployment.sh"
    )
    
    for script in "${OLD_SCRIPTS_DIR[@]}"; do
        if [ -f "$script" ]; then
            rm "$script"
            print_success "Removed $script"
        fi
    done
}

# Remove old configuration files
cleanup_old_configs() {
    print_status "Cleaning up old configuration files..."
    
    OLD_CONFIGS=(
        "wrangler.toml"
        "vercel.json"
        "turbo.json"
        "yarn.lock"
        "docker-compose.production.yml"
    )
    
    for config in "${OLD_CONFIGS[@]}"; do
        if [ -f "$config" ]; then
            rm "$config"
            print_success "Removed $config"
        fi
    done
    
    # Remove old config directories
    if [ -d "config" ]; then
        rm -rf "config"
        print_success "Removed config directory"
    fi
    
    if [ -d "packages" ]; then
        rm -rf "packages"
        print_success "Removed packages directory"
    fi
    
    if [ -d "pages" ]; then
        rm -rf "pages"
        print_success "Removed pages directory"
    fi
}

# Remove old frontend files
cleanup_old_frontend() {
    print_status "Cleaning up old frontend files..."
    
    OLD_FRONTEND_FILES=(
        "apps/frontend/wrangler.toml"
        "apps/frontend/middleware.old.ts"
        "apps/frontend/next.config.old.js"
        "apps/frontend/update-app-theme.sh"
        "apps/frontend/update-theme.sh"
        "apps/frontend/FORCE_DEPLOY.md"
        "apps/frontend/THEME_IMPLEMENTATION_COMPLETE.md"
        "apps/frontend/BRAND_THEME_GUIDE.md"
    )
    
    for file in "${OLD_FRONTEND_FILES[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            print_success "Removed $file"
        fi
    done
}

# Clean up log files
cleanup_logs() {
    print_status "Cleaning up log files..."
    
    # Remove all log files but keep the logs directory
    if [ -d "logs" ]; then
        rm -f logs/*.log
        print_success "Cleaned up log files"
    fi
    
    # Remove log files from apps
    find apps -name "*.log" -type f -delete 2>/dev/null || true
    print_success "Cleaned up application log files"
}

# Remove old bundles and patches
cleanup_bundles() {
    print_status "Cleaning up old bundles and patches..."
    
    OLD_BUNDLES=(
        "bitebase-production-ready.bundle"
        "bitebase-production-ready.patch"
    )
    
    for bundle in "${OLD_BUNDLES[@]}"; do
        if [ -f "$bundle" ]; then
            rm "$bundle"
            print_success "Removed $bundle"
        fi
    done
}

# Update .gitignore to exclude cleaned files
update_gitignore() {
    print_status "Updating .gitignore..."
    
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
.next/
out/
dist/
build/

# Environment files
.env
.env.local
.env.development
.env.test
.env.production

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.dockerignore

# Backup directories
backup_*/

# AI infrastructure data
ai-infrastructure/*/data/
ai-infrastructure/*/models/
ai-infrastructure/*/cache/

# Database
*.db
*.sqlite

# Uploads
uploads/
EOF

    print_success "Updated .gitignore"
}

# Create clean project structure summary
create_clean_summary() {
    print_status "Creating clean project structure summary..."
    
    cat > PROJECT_STRUCTURE_CLEAN.md << EOF
# 🧹 BiteBase Clean Project Structure

## 📁 **Current Project Structure**

\`\`\`
bitebase/
├── apps/
│   ├── backend/                    # Production Node.js Backend
│   │   ├── Dockerfile             # Production Docker configuration
│   │   ├── server-production.js   # Main production server
│   │   ├── package.json           # Backend dependencies
│   │   ├── middleware/            # Security & validation middleware
│   │   └── services/              # Business logic services
│   └── frontend/                  # Next.js Frontend
│       ├── app/                   # App router pages
│       ├── components/            # React components
│       ├── Dockerfile             # Frontend Docker config
│       └── package.json           # Frontend dependencies
├── database/
│   └── production-schema.sql      # Production database schema
├── scripts/
│   ├── deploy-render.sh           # Render.com deployment
│   ├── deploy-production-saas.sh  # Production SaaS deployment
│   └── setup-local-ai.sh          # Local AI setup
├── docker-compose.backend.yml     # Backend development stack
├── docker-compose.local-ai.yml    # Complete AI infrastructure
├── render.yaml                    # Render.com deployment config
├── .env.render                    # Environment template
└── README-PRODUCTION-SAAS.md      # Production documentation
\`\`\`

## 🗑️ **Removed Components**

### **Old Backend Implementations**
- FastAPI backend (apps/fastapi-backend/)
- Cloudflare Workers (cloudflare-worker-*.js)
- Strapi CMS integration
- Old Express server implementations

### **Data Pipeline System**
- Python scraping system (data-pipeline/)
- Wongnai scraper
- Data lake infrastructure
- ETL pipelines

### **Old Deployment Configurations**
- Vercel deployment files
- Cloudflare deployment scripts
- Multiple Docker Compose variants
- Legacy configuration files

### **Documentation Cleanup**
- 40+ old deployment status files
- Legacy integration guides
- Outdated troubleshooting docs
- Duplicate README files

## ✅ **What Remains (Production-Ready)**

### **Core Application**
- **Production Backend**: Node.js with enterprise features
- **Modern Frontend**: Next.js with TypeScript
- **Database**: PostgreSQL with production schema
- **AI Integration**: Local + cloud AI capabilities

### **Deployment Ready**
- **Docker**: Production-optimized containers
- **Render.com**: Complete deployment configuration
- **Environment**: Comprehensive variable templates
- **Monitoring**: Health checks and observability

### **Development Tools**
- **Local Development**: Docker Compose stack
- **AI Infrastructure**: Complete local AI setup
- **Deployment Scripts**: Automated deployment tools
- **Documentation**: Clean, focused guides

## 🎯 **Benefits of Cleanup**

✅ **Reduced Complexity**: Single, clear tech stack  
✅ **Faster Development**: No confusion about which files to use  
✅ **Easier Deployment**: Clear deployment path  
✅ **Better Maintenance**: Focused codebase  
✅ **Improved Performance**: Smaller repository size  
✅ **Clear Documentation**: Focused, relevant guides  

## 🚀 **Next Steps**

1. **Test the cleaned setup**:
   \`\`\`bash
   docker-compose -f docker-compose.backend.yml up -d
   \`\`\`

2. **Deploy to production**:
   \`\`\`bash
   ./scripts/deploy-render.sh
   \`\`\`

3. **Set up local AI** (optional):
   \`\`\`bash
   ./scripts/setup-local-ai.sh
   \`\`\`

**Your BiteBase project is now clean, focused, and production-ready!** 🎉
EOF

    print_success "Created PROJECT_STRUCTURE_CLEAN.md"
}

# Main cleanup function
main() {
    echo "🧹 Starting BiteBase Project Cleanup"
    echo "This will remove old tech stack files and keep only production-ready components"
    echo ""
    
    read -p "Continue with cleanup? This action cannot be undone easily. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup cancelled."
        exit 1
    fi
    
    create_backup
    cleanup_documentation
    cleanup_old_backends
    cleanup_data_systems
    cleanup_old_deployment
    cleanup_old_configs
    cleanup_old_frontend
    cleanup_logs
    cleanup_bundles
    update_gitignore
    create_clean_summary
    
    echo ""
    echo "🎉 BiteBase Project Cleanup Complete!"
    echo "===================================="
    echo ""
    print_success "Your project is now clean and production-ready!"
    echo ""
    echo "📋 What was cleaned:"
    echo "  ✅ Old backend implementations (FastAPI, Cloudflare Workers)"
    echo "  ✅ Data pipeline and scraping systems"
    echo "  ✅ 40+ old documentation files"
    echo "  ✅ Legacy deployment scripts and configs"
    echo "  ✅ Unused frontend files"
    echo "  ✅ Log files and temporary data"
    echo ""
    echo "📁 What remains:"
    echo "  ✅ Production Node.js backend"
    echo "  ✅ Modern Next.js frontend"
    echo "  ✅ Docker deployment configuration"
    echo "  ✅ Render.com deployment setup"
    echo "  ✅ Local AI infrastructure"
    echo "  ✅ Clean documentation"
    echo ""
    echo "🔧 Next steps:"
    echo "  1. Test: docker-compose -f docker-compose.backend.yml up -d"
    echo "  2. Deploy: ./scripts/deploy-render.sh"
    echo "  3. Review: cat PROJECT_STRUCTURE_CLEAN.md"
    echo ""
    echo "🚀 Your BiteBase project is ready for production!"
}

# Run main function
main "$@"
