#!/bin/bash

# BiteBase Render.com Deployment Script
# Automates deployment to Render.com with all necessary configurations

set -e

echo "🚀 BiteBase Render.com Deployment Script"
echo "========================================"

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

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is required but not installed."
        exit 1
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "This script must be run from a Git repository."
        exit 1
    fi
    
    # Check if Docker is installed (for local testing)
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not found. Local testing will be limited."
    fi
    
    # Check if render CLI is installed
    if ! command -v render &> /dev/null; then
        print_warning "Render CLI not found. Manual deployment will be required."
        print_status "Install Render CLI: https://render.com/docs/cli"
    fi
    
    print_success "Prerequisites check completed"
}

# Validate environment configuration
validate_environment() {
    print_status "Validating environment configuration..."
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating template..."
        create_env_template
    fi
    
    # Check critical environment variables
    critical_vars=(
        "JWT_SECRET"
        "JWT_REFRESH_SECRET"
        "ENCRYPTION_KEY"
        "SESSION_SECRET"
    )
    
    missing_vars=()
    for var in "${critical_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_warning "Missing critical environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_status "These will need to be set in Render.com dashboard"
    fi
    
    print_success "Environment validation completed"
}

# Create environment template
create_env_template() {
    cat > .env.production << EOF
# BiteBase Production Environment Configuration
# Copy this to your Render.com service environment variables

# Security Configuration (REQUIRED - Generate secure values)
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-change-this
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-minimum-32-characters-change-this
ENCRYPTION_KEY=your-32-character-encryption-key-change-this
SESSION_SECRET=your-session-secret-minimum-32-characters-change-this

# Database Configuration (Set in Render.com)
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://user:password@host:port/0

# AI Configuration
AI_MODE=api
AI_FALLBACK_ENABLED=true
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENROUTER_API_KEY=your-openrouter-api-key

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email Services
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# External APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_PLACES_API_KEY=your-google-places-api-key
MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Monitoring
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=your-ga-id
DATADOG_API_KEY=your-datadog-key

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket
AWS_REGION=us-east-1

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
EOF

    print_success "Environment template created: .env.production"
}

# Prepare Docker configuration
prepare_docker() {
    print_status "Preparing Docker configuration..."
    
    # Create .dockerignore if it doesn't exist
    if [ ! -f "apps/backend/.dockerignore" ]; then
        cat > apps/backend/.dockerignore << EOF
# Dependencies
node_modules
npm-debug.log*

# Environment files
.env
.env.local
.env.development
.env.test
.env.production

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
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
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Git
.git
.gitignore

# Documentation
README.md
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
EOF
        print_success "Created .dockerignore file"
    fi
    
    print_success "Docker configuration prepared"
}

# Test Docker build locally
test_docker_build() {
    print_status "Testing Docker build locally..."
    
    if command -v docker &> /dev/null; then
        cd apps/backend
        
        print_status "Building Docker image..."
        if docker build -t bitebase-backend-test .; then
            print_success "Docker build successful"
            
            # Test the image
            print_status "Testing Docker image..."
            if docker run --rm -d --name bitebase-test -p 3001:3001 \
                -e NODE_ENV=production \
                -e PORT=3001 \
                -e DATABASE_URL="postgresql://test:test@localhost:5432/test" \
                -e REDIS_URL="redis://localhost:6379" \
                bitebase-backend-test; then
                
                sleep 5
                
                # Test health endpoint
                if curl -f http://localhost:3001/health > /dev/null 2>&1; then
                    print_success "Docker container is healthy"
                else
                    print_warning "Health check failed (expected without database)"
                fi
                
                # Stop test container
                docker stop bitebase-test
                print_success "Docker test completed"
            else
                print_error "Failed to start Docker container"
            fi
            
            # Clean up test image
            docker rmi bitebase-backend-test
        else
            print_error "Docker build failed"
            return 1
        fi
        
        cd ../..
    else
        print_warning "Docker not available, skipping build test"
    fi
}

# Generate secure secrets
generate_secrets() {
    print_status "Generating secure secrets..."
    
    # Generate secrets using openssl if available
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -base64 32)
        JWT_REFRESH_SECRET=$(openssl rand -base64 32)
        ENCRYPTION_KEY=$(openssl rand -base64 32)
        SESSION_SECRET=$(openssl rand -base64 32)
        
        echo ""
        print_success "Generated secure secrets (copy these to Render.com):"
        echo "JWT_SECRET=$JWT_SECRET"
        echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
        echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
        echo "SESSION_SECRET=$SESSION_SECRET"
        echo ""
    else
        print_warning "OpenSSL not available. Please generate secure secrets manually."
    fi
}

# Validate render.yaml
validate_render_config() {
    print_status "Validating render.yaml configuration..."
    
    if [ ! -f "render.yaml" ]; then
        print_error "render.yaml not found!"
        exit 1
    fi
    
    # Check if render.yaml has required services
    if grep -q "bitebase-production-backend" render.yaml; then
        print_success "Production backend service found in render.yaml"
    else
        print_error "Production backend service not found in render.yaml"
        exit 1
    fi
    
    print_success "render.yaml validation completed"
}

# Deploy to Render.com
deploy_to_render() {
    print_status "Deploying to Render.com..."
    
    # Check if render CLI is available
    if command -v render &> /dev/null; then
        print_status "Using Render CLI for deployment..."
        
        # Deploy using render CLI
        if render deploy; then
            print_success "Deployment initiated successfully"
        else
            print_error "Deployment failed"
            exit 1
        fi
    else
        print_status "Manual deployment required:"
        echo ""
        echo "1. Go to https://dashboard.render.com"
        echo "2. Connect your GitHub repository"
        echo "3. Create a new Blueprint deployment"
        echo "4. Upload the render.yaml file"
        echo "5. Set environment variables in the dashboard"
        echo "6. Deploy the services"
        echo ""
        print_warning "Render CLI not available. Please deploy manually."
    fi
}

# Create deployment checklist
create_deployment_checklist() {
    print_status "Creating deployment checklist..."
    
    cat > DEPLOYMENT_CHECKLIST.md << EOF
# BiteBase Render.com Deployment Checklist

## Pre-Deployment
- [ ] Repository pushed to GitHub
- [ ] Docker build tested locally
- [ ] Environment variables configured
- [ ] Database schema ready
- [ ] render.yaml validated

## Render.com Setup
- [ ] Account created on Render.com
- [ ] GitHub repository connected
- [ ] Blueprint deployment created
- [ ] Environment variables set in dashboard:
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] ENCRYPTION_KEY
  - [ ] SESSION_SECRET
  - [ ] DATABASE_URL (if using external DB)
  - [ ] REDIS_URL (if using external Redis)
  - [ ] OPENAI_API_KEY
  - [ ] STRIPE_SECRET_KEY
  - [ ] SENDGRID_API_KEY
  - [ ] Other API keys as needed

## Post-Deployment
- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] Redis connection working
- [ ] API endpoints functional
- [ ] Frontend can connect to backend
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring alerts set up

## Testing
- [ ] User registration/login working
- [ ] AI features functional
- [ ] Payment processing working
- [ ] Email delivery working
- [ ] File uploads working
- [ ] Performance acceptable

## Production Readiness
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Error tracking active
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] CORS configuration correct

## Generated Secrets
Copy these to your Render.com environment variables:

\`\`\`
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
SESSION_SECRET=$SESSION_SECRET
\`\`\`

## Useful Commands
- View logs: Check Render.com dashboard
- Restart service: Use Render.com dashboard
- Update environment: Render.com dashboard > Environment
- Manual deploy: Push to connected GitHub branch

## Support
- Render.com Docs: https://render.com/docs
- BiteBase Issues: https://github.com/your-repo/issues
EOF

    print_success "Deployment checklist created: DEPLOYMENT_CHECKLIST.md"
}

# Main deployment function
main() {
    echo "🚀 Starting BiteBase Render.com Deployment"
    echo "This will prepare your application for deployment on Render.com"
    echo ""
    
    read -p "Continue with deployment preparation? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment preparation cancelled."
        exit 1
    fi
    
    check_prerequisites
    validate_environment
    prepare_docker
    test_docker_build
    generate_secrets
    validate_render_config
    create_deployment_checklist
    
    echo ""
    echo "🎉 Render.com Deployment Preparation Complete!"
    echo "============================================="
    echo ""
    print_success "Your BiteBase application is ready for Render.com deployment!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Review DEPLOYMENT_CHECKLIST.md"
    echo "2. Set environment variables in Render.com dashboard"
    echo "3. Deploy using Render.com Blueprint or CLI"
    echo "4. Test the deployed application"
    echo ""
    echo "🔗 Useful Links:"
    echo "  Render.com Dashboard: https://dashboard.render.com"
    echo "  Render.com Docs: https://render.com/docs"
    echo "  Blueprint Guide: https://render.com/docs/blueprint-spec"
    echo ""
    echo "🚀 Happy deploying!"
}

# Run main function
main "$@"
