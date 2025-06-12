#!/bin/bash

# Script to identify files that should be cleaned up
echo "🔍 Identifying files for cleanup..."

echo ""
echo "📄 OLD DOCUMENTATION FILES TO REMOVE:"
find . -maxdepth 1 -name "*.md" | grep -E "(DEPLOYMENT|VERCEL|CLOUDFLARE|AGENT|BACKEND|FRONTEND|INTEGRATION|STATUS|SUMMARY|GUIDE)" | sort

echo ""
echo "🐍 PYTHON/FASTAPI FILES TO REMOVE:"
find . -name "*.py" -o -name "requirements.txt" -o -name "alembic*" | grep -v "__pycache__" | sort

echo ""
echo "📁 OLD DIRECTORIES TO REMOVE:"
echo "apps/fastapi-backend/"
echo "data-pipeline/"
echo "datalake/"
echo "packages/"
echo "pages/"
echo "config/"

echo ""
echo "🔧 OLD BACKEND FILES TO REMOVE:"
find apps/backend -name "cloudflare-*" -o -name "bitebase-api-server.js" -o -name "server.js" -o -name "wongnai-*" -o -name "ai-assistant.js" -o -name "start-*" -o -name "wrangler.toml" -o -name "vercel.json" -o -name "tsconfig.json" | sort

echo ""
echo "📦 OLD CONFIG FILES TO REMOVE:"
find . -maxdepth 1 -name "wrangler.toml" -o -name "vercel.json" -o -name "turbo.json" -o -name "yarn.lock" | sort

echo ""
echo "📜 OLD SCRIPTS TO REMOVE:"
find . -name "deploy-*.sh" -o -name "setup-*.sh" -o -name "start-*.sh" -o -name "stop-*.sh" -o -name "verify-*.sh" | grep -v "deploy-render.sh" | grep -v "setup-local-ai.sh" | grep -v "deploy-production-saas.sh" | sort

echo ""
echo "📊 LOG FILES TO CLEAN:"
find . -name "*.log" | sort

echo ""
echo "🎁 BUNDLE FILES TO REMOVE:"
find . -name "*.bundle" -o -name "*.patch" | sort

echo ""
echo "✅ FILES TO KEEP (Production-ready):"
echo "apps/backend/Dockerfile"
echo "apps/backend/server-production.js"
echo "apps/backend/package.json"
echo "apps/backend/middleware/"
echo "apps/backend/services/"
echo "apps/frontend/"
echo "database/production-schema.sql"
echo "scripts/deploy-render.sh"
echo "scripts/deploy-production-saas.sh"
echo "scripts/setup-local-ai.sh"
echo "docker-compose.backend.yml"
echo "docker-compose.local-ai.yml"
echo "render.yaml"
echo ".env.render"
echo "README-PRODUCTION-SAAS.md"
echo "LOCAL_AI_INTEGRATION_COMPLETE.md"
echo "DOCKER_RENDER_DEPLOYMENT_COMPLETE.md"
