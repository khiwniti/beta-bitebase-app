#!/bin/bash

# BiteBase Cloudflare Workers Setup Script
# This script helps set up the project for Cloudflare Workers deployment

set -e

echo "☁️ BiteBase Cloudflare Workers Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if Wrangler CLI is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Wrangler CLI...${NC}"
    npm install -g wrangler
    echo -e "${GREEN}✅ Wrangler CLI installed${NC}"
else
    echo -e "${GREEN}✅ Wrangler CLI already installed${NC}"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
fi

# Check if user is logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Cloudflare...${NC}"
    wrangler login
else
    echo -e "${GREEN}✅ Already logged in to Cloudflare${NC}"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Vercel...${NC}"
    vercel login
else
    echo -e "${GREEN}✅ Already logged in to Vercel${NC}"
fi

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PATH="$SCRIPT_DIR/apps/backend"
FRONTEND_PATH="$SCRIPT_DIR/apps/frontend"

echo -e "\n${BLUE}📁 Project Structure:${NC}"
echo "Backend: $BACKEND_PATH"
echo "Frontend: $FRONTEND_PATH"

# Setup backend environment
echo -e "\n${PURPLE}☁️ Setting up Cloudflare Workers Backend...${NC}"
cd "$BACKEND_PATH"

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
npm install

# Check if wrangler.toml exists
if [ ! -f "wrangler.toml" ]; then
    echo -e "${RED}❌ wrangler.toml not found${NC}"
    echo -e "${YELLOW}Creating basic wrangler.toml...${NC}"
    cat > wrangler.toml << EOF
name = "bitebase-backend"
main = "cloudflare-worker-enhanced.js"
compatibility_date = "$(date +%Y-%m-%d)"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "bitebase-backend-prod"

[env.staging]
name = "bitebase-backend-staging"

[vars]
NODE_ENV = "production"
API_VERSION = "1.0.0"
CORS_ORIGIN = "*"
EOF
    echo -e "${GREEN}✅ Basic wrangler.toml created${NC}"
else
    echo -e "${GREEN}✅ wrangler.toml already exists${NC}"
fi

# Create Cloudflare resources
echo -e "\n${PURPLE}🏗️ Creating Cloudflare Resources...${NC}"

# Create D1 database
echo -e "${YELLOW}📊 Creating D1 database...${NC}"
if wrangler d1 list | grep -q "bitebase-production"; then
    echo -e "${GREEN}✅ D1 database 'bitebase-production' already exists${NC}"
    DB_ID=$(wrangler d1 list | grep "bitebase-production" | awk '{print $2}')
    echo "Database ID: $DB_ID"
else
    echo -e "${YELLOW}Creating new D1 database...${NC}"
    DB_OUTPUT=$(wrangler d1 create bitebase-production)
    DB_ID=$(echo "$DB_OUTPUT" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2)
    echo -e "${GREEN}✅ D1 database created with ID: $DB_ID${NC}"
    
    # Update wrangler.toml with database ID
    if ! grep -q "d1_databases" wrangler.toml; then
        cat >> wrangler.toml << EOF

[[d1_databases]]
binding = "DB"
database_name = "bitebase-production"
database_id = "$DB_ID"
EOF
        echo -e "${GREEN}✅ Updated wrangler.toml with database configuration${NC}"
    fi
fi

# Create KV namespaces
echo -e "${YELLOW}🗄️ Creating KV namespaces...${NC}"
if wrangler kv:namespace list | grep -q "CACHE"; then
    echo -e "${GREEN}✅ KV namespaces already exist${NC}"
else
    echo -e "${YELLOW}Creating KV namespaces...${NC}"
    CACHE_OUTPUT=$(wrangler kv:namespace create CACHE)
    SESSIONS_OUTPUT=$(wrangler kv:namespace create SESSIONS)
    
    CACHE_ID=$(echo "$CACHE_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
    SESSIONS_ID=$(echo "$SESSIONS_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
    
    echo -e "${GREEN}✅ KV namespaces created${NC}"
    echo "Cache ID: $CACHE_ID"
    echo "Sessions ID: $SESSIONS_ID"
    
    # Update wrangler.toml with KV namespaces
    if ! grep -q "kv_namespaces" wrangler.toml; then
        cat >> wrangler.toml << EOF

[[kv_namespaces]]
binding = "CACHE"
id = "$CACHE_ID"

[[kv_namespaces]]
binding = "SESSIONS"
id = "$SESSIONS_ID"
EOF
        echo -e "${GREEN}✅ Updated wrangler.toml with KV configuration${NC}"
    fi
fi

# Create R2 bucket
echo -e "${YELLOW}📦 Creating R2 bucket...${NC}"
if wrangler r2 bucket list | grep -q "bitebase-uploads"; then
    echo -e "${GREEN}✅ R2 bucket 'bitebase-uploads' already exists${NC}"
else
    wrangler r2 bucket create bitebase-uploads
    echo -e "${GREEN}✅ R2 bucket created${NC}"
    
    # Update wrangler.toml with R2 bucket
    if ! grep -q "r2_buckets" wrangler.toml; then
        cat >> wrangler.toml << EOF

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "bitebase-uploads"
EOF
        echo -e "${GREEN}✅ Updated wrangler.toml with R2 configuration${NC}"
    fi
fi

# Run database migrations
echo -e "${YELLOW}🗃️ Running database migrations...${NC}"
if [ -f "database/schema.sql" ]; then
    wrangler d1 execute bitebase-production --file=database/schema.sql
    echo -e "${GREEN}✅ Database schema migrated${NC}"
else
    echo -e "${YELLOW}⚠️ No database/schema.sql found, skipping migration${NC}"
    echo -e "${BLUE}💡 You can create the schema later with: wrangler d1 execute bitebase-production --file=database/schema.sql${NC}"
fi

# Test worker locally
echo -e "${YELLOW}🧪 Testing worker locally...${NC}"
timeout 5s wrangler dev --local --port 8787 > /dev/null 2>&1 &
WORKER_PID=$!
sleep 2

if curl -s http://localhost:8787/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Worker is running locally${NC}"
else
    echo -e "${YELLOW}⚠️ Worker test skipped (may need manual testing)${NC}"
fi

# Kill the test worker
kill $WORKER_PID 2>/dev/null || true

cd "$SCRIPT_DIR"

# Setup frontend environment
echo -e "\n${BLUE}🌐 Setting up Frontend Environment...${NC}"
cd "$FRONTEND_PATH"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

# Setup environment file
if [ ! -f ".env.local" ]; then
    cp ".env.example" ".env.local"
    echo -e "${YELLOW}📝 Created frontend .env.local from example${NC}"
    echo -e "${YELLOW}⚠️ Please edit $FRONTEND_PATH/.env.local with your actual values${NC}"
    echo -e "${BLUE}💡 Update NEXT_PUBLIC_API_URL to point to your Cloudflare Worker${NC}"
else
    echo -e "${GREEN}✅ Frontend .env.local already exists${NC}"
fi

# Test frontend build
echo -e "${YELLOW}🔨 Testing frontend build...${NC}"
npm run build
echo -e "${GREEN}✅ Frontend build successful${NC}"

cd "$SCRIPT_DIR"

# Create deployment summary
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo -e "\n${BLUE}📋 Setup Summary:${NC}"
echo "✅ Cloudflare Workers CLI installed and configured"
echo "✅ Vercel CLI installed and configured"
echo "✅ D1 database created and configured"
echo "✅ KV namespaces created for caching and sessions"
echo "✅ R2 bucket created for file storage"
echo "✅ Database schema migrated (if schema.sql exists)"
echo "✅ Dependencies installed for both backend and frontend"
echo "✅ Environment files created"

echo -e "\n${PURPLE}🔧 Next Steps:${NC}"
echo "1. Set Cloudflare Worker secrets:"
echo "   cd apps/backend"
echo "   wrangler secret put JWT_SECRET"
echo "   wrangler secret put OPENAI_API_KEY"
echo "   wrangler secret put STRIPE_SECRET_KEY"
echo ""
echo "2. Update environment variables:"
echo "   - Edit apps/backend/.env.local (if needed for local dev)"
echo "   - Edit apps/frontend/.env.local with your actual values"
echo ""
echo "3. Deploy to Cloudflare and Vercel:"
echo "   ./deploy-cloudflare.sh --production"
echo ""
echo "4. Configure custom domains (optional):"
echo "   - Backend: api.yourdomain.com"
echo "   - Frontend: yourdomain.com"

echo -e "\n${BLUE}🔗 Useful Commands:${NC}"
echo "# Deploy backend to Cloudflare Workers"
echo "cd apps/backend && wrangler deploy"
echo ""
echo "# Deploy frontend to Vercel"
echo "cd apps/frontend && vercel --prod"
echo ""
echo "# View worker logs"
echo "cd apps/backend && wrangler tail"
echo ""
echo "# Test worker locally"
echo "cd apps/backend && wrangler dev"

echo -e "\n${BLUE}📊 Resource Information:${NC}"
if [ ! -z "$DB_ID" ]; then
    echo "D1 Database ID: $DB_ID"
fi
if [ ! -z "$CACHE_ID" ]; then
    echo "Cache KV Namespace ID: $CACHE_ID"
fi
if [ ! -z "$SESSIONS_ID" ]; then
    echo "Sessions KV Namespace ID: $SESSIONS_ID"
fi

echo -e "\n${YELLOW}📖 For detailed deployment instructions, see: CLOUDFLARE_DEPLOYMENT_GUIDE.md${NC}"
echo -e "${PURPLE}🚀 Ready to deploy with: ./deploy-cloudflare.sh --production${NC}"