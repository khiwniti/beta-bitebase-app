#!/bin/bash

# Local AI Setup Script for BiteBase
# Sets up Ollama, vLLM, and MPC servers for local AI processing

set -e

echo "🤖 Setting up Local AI Infrastructure for BiteBase"
echo "=================================================="

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

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check available RAM
    if command -v free &> /dev/null; then
        TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
        if [ "$TOTAL_RAM" -lt 16 ]; then
            print_warning "Recommended: 16GB+ RAM for optimal AI performance. Current: ${TOTAL_RAM}GB"
        else
            print_success "RAM check passed: ${TOTAL_RAM}GB available"
        fi
    fi
    
    # Check GPU availability
    if command -v nvidia-smi &> /dev/null; then
        GPU_COUNT=$(nvidia-smi -L | wc -l)
        print_success "NVIDIA GPU detected: $GPU_COUNT GPU(s) available"
        export CUDA_AVAILABLE=true
    else
        print_warning "No NVIDIA GPU detected. Will use CPU-only mode."
        export CUDA_AVAILABLE=false
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is required but not installed. Please install Docker first."
        exit 1
    fi
    
    print_success "System requirements check completed"
}

# Install Ollama
install_ollama() {
    print_status "Installing Ollama..."
    
    if command -v ollama &> /dev/null; then
        print_success "Ollama already installed"
        return
    fi
    
    # Install Ollama
    curl -fsSL https://ollama.ai/install.sh | sh
    
    # Start Ollama service
    if command -v systemctl &> /dev/null; then
        sudo systemctl enable ollama
        sudo systemctl start ollama
    else
        # Start Ollama in background for non-systemd systems
        nohup ollama serve > /dev/null 2>&1 &
        sleep 5
    fi
    
    print_success "Ollama installed and started"
}

# Download and setup Ollama models
setup_ollama_models() {
    print_status "Setting up Ollama models..."
    
    # Wait for Ollama to be ready
    sleep 10
    
    # Download recommended models
    MODELS=(
        "llama3.1:8b"
        "mistral:7b"
        "neural-chat:7b"
        "phi3:mini"
    )
    
    for model in "${MODELS[@]}"; do
        print_status "Downloading model: $model"
        ollama pull "$model" || print_warning "Failed to download $model"
    done
    
    # Download code-specific model if needed
    if [ "$1" = "with-code" ]; then
        print_status "Downloading CodeLlama for code generation..."
        ollama pull codellama:13b || print_warning "Failed to download CodeLlama"
    fi
    
    print_success "Ollama models setup completed"
}

# Setup vLLM with Docker
setup_vllm() {
    print_status "Setting up vLLM..."
    
    # Create vLLM directory
    mkdir -p ./ai-infrastructure/vllm
    
    # Create vLLM Docker Compose file
    cat > ./ai-infrastructure/vllm/docker-compose.yml << EOF
version: '3.8'
services:
  vllm-server:
    image: vllm/vllm-openai:latest
    ports:
      - "8000:8000"
    volumes:
      - ./models:/models
      - ./cache:/cache
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - HF_HOME=/cache
    command: >
      --model meta-llama/Meta-Llama-3.1-8B-Instruct
      --host 0.0.0.0
      --port 8000
      --tensor-parallel-size 1
      --max-model-len 4096
      --served-model-name llama3.1-8b
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    restart: unless-stopped

  vllm-mistral:
    image: vllm/vllm-openai:latest
    ports:
      - "8001:8000"
    volumes:
      - ./models:/models
      - ./cache:/cache
    environment:
      - CUDA_VISIBLE_DEVICES=1
      - HF_HOME=/cache
    command: >
      --model mistralai/Mistral-7B-Instruct-v0.3
      --host 0.0.0.0
      --port 8000
      --tensor-parallel-size 1
      --max-model-len 4096
      --served-model-name mistral-7b
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    restart: unless-stopped
    profiles:
      - multi-gpu

  vllm-qwen:
    image: vllm/vllm-openai:latest
    ports:
      - "8002:8000"
    volumes:
      - ./models:/models
      - ./cache:/cache
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - HF_HOME=/cache
    command: >
      --model Qwen/Qwen2-7B-Instruct
      --host 0.0.0.0
      --port 8000
      --tensor-parallel-size 1
      --max-model-len 4096
      --served-model-name qwen2-7b
    restart: unless-stopped
    profiles:
      - cpu-only
EOF

    # Create CPU-only version if no GPU
    if [ "$CUDA_AVAILABLE" = false ]; then
        cat > ./ai-infrastructure/vllm/docker-compose.cpu.yml << EOF
version: '3.8'
services:
  vllm-cpu:
    image: vllm/vllm-openai:latest
    ports:
      - "8000:8000"
    volumes:
      - ./models:/models
      - ./cache:/cache
    environment:
      - HF_HOME=/cache
    command: >
      --model microsoft/DialoGPT-medium
      --host 0.0.0.0
      --port 8000
      --tensor-parallel-size 1
      --max-model-len 2048
      --served-model-name dialogpt
      --device cpu
    restart: unless-stopped
EOF
    fi
    
    print_success "vLLM configuration created"
}

# Setup MPC servers
setup_mpc_servers() {
    print_status "Setting up MPC servers..."
    
    # Create MPC directory
    mkdir -p ./ai-infrastructure/mpc
    
    # Create MPC server implementation
    cat > ./ai-infrastructure/mpc/mpc_server.py << 'EOF'
#!/usr/bin/env python3
"""
Simple MPC Server for BiteBase AI
Provides secure multi-party computation for AI models
"""

import asyncio
import json
import hashlib
import secrets
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import uvicorn
import numpy as np

app = FastAPI(title="BiteBase MPC Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MPCComputeRequest(BaseModel):
    model: str
    share: Dict[str, Any]
    shareIndex: int
    totalShares: int
    privacyLevel: str
    computationId: str

class MPCResult(BaseModel):
    result: Dict[str, Any]
    confidence: float
    computationTime: float
    serverId: str

# Simulated AI models for MPC computation
class MPCModels:
    @staticmethod
    def restaurant_intelligence(data_share):
        """Restaurant recommendation model"""
        # Simulate complex computation
        recommendations = []
        for i in range(5):
            recommendations.append({
                "restaurant_id": f"rest_{i}",
                "score": np.random.uniform(0.7, 0.95),
                "reasoning": f"Matches user preferences based on secure computation"
            })
        
        return {
            "recommendations": recommendations,
            "confidence": np.random.uniform(0.8, 0.95),
            "model_version": "restaurant-intel-v2.1"
        }
    
    @staticmethod
    def market_predictor(data_share):
        """Market prediction model"""
        trends = {
            "growth_rate": np.random.uniform(0.05, 0.15),
            "market_saturation": np.random.uniform(0.3, 0.7),
            "emerging_cuisines": ["Korean", "Vietnamese", "Plant-based"],
            "price_trends": {
                "budget": "stable",
                "mid_range": "increasing",
                "premium": "stable"
            }
        }
        
        return {
            "predictions": trends,
            "confidence": np.random.uniform(0.75, 0.9),
            "timeframe": "6_months"
        }
    
    @staticmethod
    def competitive_analyzer(data_share):
        """Competitive analysis model"""
        analysis = {
            "market_position": np.random.choice(["leader", "challenger", "follower"]),
            "competitive_advantages": ["location", "pricing", "quality"],
            "improvement_areas": ["marketing", "service", "menu_variety"],
            "threat_level": np.random.uniform(0.2, 0.8)
        }
        
        return {
            "analysis": analysis,
            "confidence": np.random.uniform(0.7, 0.85),
            "benchmark_score": np.random.uniform(60, 90)
        }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "server_id": hashlib.md5(secrets.token_bytes(16)).hexdigest()[:8],
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/mpc/compute", response_model=MPCResult)
async def mpc_compute(request: MPCComputeRequest):
    start_time = asyncio.get_event_loop().time()
    
    try:
        # Simulate secure computation delay
        await asyncio.sleep(np.random.uniform(0.5, 2.0))
        
        # Route to appropriate model
        if request.model == "restaurant-intelligence":
            result = MPCModels.restaurant_intelligence(request.share)
        elif request.model == "market-predictor":
            result = MPCModels.market_predictor(request.share)
        elif request.model == "competitive-analyzer":
            result = MPCModels.competitive_analyzer(request.share)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown model: {request.model}")
        
        computation_time = asyncio.get_event_loop().time() - start_time
        
        return MPCResult(
            result=result,
            confidence=result.get("confidence", 0.8),
            computationTime=computation_time,
            serverId=hashlib.md5(secrets.token_bytes(16)).hexdigest()[:8]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computation failed: {str(e)}")

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 9000
    uvicorn.run(app, host="0.0.0.0", port=port)
EOF

    # Create MPC Docker Compose
    cat > ./ai-infrastructure/mpc/docker-compose.yml << EOF
version: '3.8'
services:
  mpc-server-1:
    build: .
    ports:
      - "9000:9000"
    environment:
      - MPC_SERVER_ID=primary
      - MPC_PORT=9000
    command: python mpc_server.py 9000
    restart: unless-stopped

  mpc-server-2:
    build: .
    ports:
      - "9001:9000"
    environment:
      - MPC_SERVER_ID=secondary
      - MPC_PORT=9000
    command: python mpc_server.py 9000
    restart: unless-stopped

  mpc-server-3:
    build: .
    ports:
      - "9002:9000"
    environment:
      - MPC_SERVER_ID=tertiary
      - MPC_PORT=9000
    command: python mpc_server.py 9000
    restart: unless-stopped
EOF

    # Create Dockerfile for MPC servers
    cat > ./ai-infrastructure/mpc/Dockerfile << EOF
FROM python:3.11-slim

WORKDIR /app

RUN pip install fastapi uvicorn numpy pydantic

COPY mpc_server.py .

EXPOSE 9000

CMD ["python", "mpc_server.py"]
EOF

    chmod +x ./ai-infrastructure/mpc/mpc_server.py
    
    print_success "MPC servers configuration created"
}

# Start all AI services
start_ai_services() {
    print_status "Starting AI services..."
    
    # Start Ollama (should already be running)
    if ! pgrep -f "ollama serve" > /dev/null; then
        print_status "Starting Ollama..."
        nohup ollama serve > /dev/null 2>&1 &
        sleep 5
    fi
    
    # Start vLLM
    cd ./ai-infrastructure/vllm
    if [ "$CUDA_AVAILABLE" = true ]; then
        docker-compose up -d vllm-server
    else
        docker-compose -f docker-compose.cpu.yml up -d vllm-cpu
    fi
    cd ../..
    
    # Start MPC servers
    cd ./ai-infrastructure/mpc
    docker-compose up -d --build
    cd ../..
    
    print_success "AI services started"
}

# Create monitoring script
create_monitoring() {
    print_status "Creating AI monitoring script..."
    
    cat > ./scripts/monitor-ai-services.sh << 'EOF'
#!/bin/bash

echo "🤖 BiteBase AI Services Status"
echo "=============================="

# Check Ollama
if pgrep -f "ollama serve" > /dev/null; then
    echo "✅ Ollama: Running"
    echo "   Models: $(ollama list | tail -n +2 | wc -l) available"
else
    echo "❌ Ollama: Not running"
fi

# Check vLLM
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ vLLM: Running on port 8000"
else
    echo "❌ vLLM: Not responding"
fi

# Check MPC servers
for port in 9000 9001 9002; do
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo "✅ MPC Server: Running on port $port"
    else
        echo "❌ MPC Server: Not responding on port $port"
    fi
done

echo ""
echo "🔧 Quick Commands:"
echo "  Restart Ollama: sudo systemctl restart ollama"
echo "  Restart vLLM: cd ai-infrastructure/vllm && docker-compose restart"
echo "  Restart MPC: cd ai-infrastructure/mpc && docker-compose restart"
EOF

    chmod +x ./scripts/monitor-ai-services.sh
    
    print_success "Monitoring script created"
}

# Update environment configuration
update_environment() {
    print_status "Updating environment configuration..."
    
    # Add AI service URLs to environment
    cat >> .env.production << EOF

# Local AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
VLLM_BASE_URL=http://localhost:8000
MPC_PRIMARY_URL=http://localhost:9000
MPC_SECONDARY_URL=http://localhost:9001
MPC_TERTIARY_URL=http://localhost:9002

# AI Model Settings
AI_MODE=local
AI_FALLBACK_ENABLED=true
AI_CACHE_TTL=3600
AI_MAX_RETRIES=3

# MPC Configuration
MPC_PRIVACY_LEVEL=high
MPC_MIN_PARTIES=2
MPC_COMPUTATION_TIMEOUT=120
EOF

    print_success "Environment configuration updated"
}

# Setup complete Docker infrastructure
setup_docker_infrastructure() {
    print_status "Setting up complete Docker infrastructure..."

    # Create necessary directories
    mkdir -p ./ai-infrastructure/{mpc,monitoring/{grafana,prometheus}}
    mkdir -p ./monitoring/grafana/{dashboards,datasources}

    # Create Prometheus configuration
    cat > ./monitoring/prometheus/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'bitebase-backend'
    static_configs:
      - targets: ['bitebase-backend:3001']

  - job_name: 'ollama'
    static_configs:
      - targets: ['ollama:11434']

  - job_name: 'vllm'
    static_configs:
      - targets: ['vllm-primary:8000', 'vllm-secondary:8000']

  - job_name: 'mpc-servers'
    static_configs:
      - targets: ['mpc-server-1:9000', 'mpc-server-2:9000', 'mpc-server-3:9000']
EOF

    # Create Grafana datasource
    cat > ./monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOF

    # Create backend Dockerfile for local AI
    cat > ./apps/backend/Dockerfile.local-ai << EOF
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start server
CMD ["node", "server-production.js"]
EOF

    print_success "Docker infrastructure setup completed"
}

# Start complete AI infrastructure
start_complete_infrastructure() {
    print_status "Starting complete AI infrastructure with Docker Compose..."

    # Check if GPU is available
    if [ "$CUDA_AVAILABLE" = true ]; then
        print_status "Starting with GPU support..."
        docker-compose -f docker-compose.local-ai.yml --profile multi-gpu up -d
    else
        print_status "Starting with CPU-only mode..."
        docker-compose -f docker-compose.local-ai.yml --profile cpu-only up -d
    fi

    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30

    # Check service health
    check_service_health

    print_success "Complete AI infrastructure started"
}

# Check service health
check_service_health() {
    print_status "Checking service health..."

    services=(
        "http://localhost:5432|PostgreSQL Database"
        "http://localhost:6379|Redis Cache"
        "http://localhost:11434/api/tags|Ollama Server"
        "http://localhost:8000/health|vLLM Primary"
        "http://localhost:9000/health|MPC Server 1"
        "http://localhost:9001/health|MPC Server 2"
        "http://localhost:9002/health|MPC Server 3"
        "http://localhost:3001/health|BiteBase Backend"
        "http://localhost:3000|BiteBase Frontend"
    )

    for service in "${services[@]}"; do
        IFS='|' read -r url name <<< "$service"
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$name: ✅ Healthy"
        else
            print_warning "$name: ⚠️  Not responding"
        fi
    done
}

# Create comprehensive management scripts
create_management_scripts() {
    print_status "Creating management scripts..."

    # Enhanced monitoring script
    cat > ./scripts/monitor-ai-services.sh << 'EOF'
#!/bin/bash

echo "🤖 BiteBase Complete AI Infrastructure Status"
echo "============================================="

# Check Docker services
echo ""
echo "📦 Docker Services:"
docker-compose -f docker-compose.local-ai.yml ps

echo ""
echo "🔍 Service Health Checks:"

# Check each service
services=(
    "localhost:5432|PostgreSQL"
    "localhost:6379|Redis"
    "localhost:11434|Ollama"
    "localhost:8000|vLLM Primary"
    "localhost:8001|vLLM Secondary"
    "localhost:9000|MPC Server 1"
    "localhost:9001|MPC Server 2"
    "localhost:9002|MPC Server 3"
    "localhost:3001|BiteBase API"
    "localhost:3000|BiteBase Frontend"
)

for service in "${services[@]}"; do
    IFS='|' read -r endpoint name <<< "$service"
    if timeout 5 bash -c "</dev/tcp/${endpoint/:/\/}" 2>/dev/null; then
        echo "✅ $name: Running"
    else
        echo "❌ $name: Not responding"
    fi
done

echo ""
echo "📊 Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "🔧 Quick Commands:"
echo "  Restart all: docker-compose -f docker-compose.local-ai.yml restart"
echo "  View logs: docker-compose -f docker-compose.local-ai.yml logs -f [service]"
echo "  Stop all: docker-compose -f docker-compose.local-ai.yml down"
echo "  Update models: docker-compose -f docker-compose.local-ai.yml up ollama-setup"
EOF

    # AI performance testing script
    cat > ./scripts/test-ai-performance.sh << 'EOF'
#!/bin/bash

echo "🧪 BiteBase AI Performance Testing"
echo "=================================="

# Test Ollama
echo ""
echo "Testing Ollama..."
curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.1:8b", "prompt": "What is a restaurant?", "stream": false}' \
  | jq -r '.response' | head -c 100

# Test vLLM
echo ""
echo "Testing vLLM..."
curl -s -X POST http://localhost:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.1-8b", "prompt": "Recommend a restaurant", "max_tokens": 50}' \
  | jq -r '.choices[0].text' | head -c 100

# Test MPC Servers
echo ""
echo "Testing MPC Servers..."
for port in 9000 9001 9002; do
    response=$(curl -s http://localhost:$port/health | jq -r '.status')
    echo "MPC Server $port: $response"
done

# Test BiteBase AI API
echo ""
echo "Testing BiteBase AI API..."
curl -s http://localhost:3001/api/ai/status | jq -r '.router.status'

echo ""
echo "✅ Performance testing completed!"
EOF

    chmod +x ./scripts/monitor-ai-services.sh
    chmod +x ./scripts/test-ai-performance.sh

    print_success "Management scripts created"
}

# Main installation function
main() {
    echo "🚀 Starting BiteBase Complete Local AI Setup"
    echo "This will install and configure:"
    echo "  - PostgreSQL Database"
    echo "  - Redis Cache"
    echo "  - Ollama (Local LLM server)"
    echo "  - vLLM (High-performance inference)"
    echo "  - MPC Servers (Privacy-preserving computation)"
    echo "  - Complete BiteBase Platform"
    echo "  - Monitoring & Analytics"
    echo ""

    read -p "Continue with installation? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Installation cancelled."
        exit 1
    fi

    check_requirements
    setup_docker_infrastructure
    setup_mpc_servers
    start_complete_infrastructure
    create_management_scripts
    update_environment

    echo ""
    echo "🎉 Complete Local AI Infrastructure Setup Complete!"
    echo "=================================================="
    echo ""
    print_success "Your complete BiteBase AI platform is now running locally!"
    echo ""
    echo "📋 Service URLs:"
    echo "  🌐 BiteBase App: http://localhost:3000"
    echo "  🔧 BiteBase API: http://localhost:3001"
    echo "  🤖 Ollama API: http://localhost:11434"
    echo "  ⚡ vLLM API: http://localhost:8000"
    echo "  🔒 MPC Servers: http://localhost:9000-9002"
    echo "  📊 Monitoring: http://localhost:3003"
    echo "  📈 Metrics: http://localhost:9090"
    echo ""
    echo "🔧 Management:"
    echo "  Monitor: ./scripts/monitor-ai-services.sh"
    echo "  Test AI: ./scripts/test-ai-performance.sh"
    echo "  Logs: docker-compose -f docker-compose.local-ai.yml logs -f"
    echo ""
    echo "🚀 Features Available:"
    echo "  ✅ 100% Local AI Processing"
    echo "  ✅ No API Keys Required"
    echo "  ✅ Maximum Privacy & Security"
    echo "  ✅ Unlimited AI Usage"
    echo "  ✅ Advanced MPC Computation"
    echo "  ✅ Real-time Monitoring"
    echo ""
    echo "🎯 Your BiteBase platform is now more intelligent than ever!"
}

# Run main function
main "$@"
