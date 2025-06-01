#!/bin/bash

# Simple frontend startup script
echo "🚀 Starting BiteBase Frontend..."

cd bitebase-geospatial-saas/apps/frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌐 Starting Next.js development server..."
npx next dev -p 3000

echo "✅ Frontend started on http://localhost:3000"
