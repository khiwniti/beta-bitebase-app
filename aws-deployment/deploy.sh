#!/bin/bash

# BiteBase AWS EC2 Deployment Script
# This script deploys BiteBase to AWS EC2 using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/opt/bitebase"
BACKUP_DIR="/opt/bitebase-backups"
SERVICE_NAME="bitebase"

echo -e "${BLUE}🚀 Starting BiteBase deployment to AWS EC2...${NC}"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Function to create backup
create_backup() {
    if [ -d "$DEPLOY_DIR" ]; then
        echo -e "${YELLOW}📦 Creating backup...${NC}"
        sudo mkdir -p "$BACKUP_DIR"
        BACKUP_NAME="bitebase-backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        echo -e "${GREEN}✅ Backup created: $BACKUP_DIR/$BACKUP_NAME${NC}"
    fi
}

# Function to setup directories
setup_directories() {
    echo -e "${YELLOW}📁 Setting up directories...${NC}"
    sudo mkdir -p "$DEPLOY_DIR"
    sudo mkdir -p "$DEPLOY_DIR/ssl"
    sudo mkdir -p "$DEPLOY_DIR/logs"
    sudo mkdir -p "$DEPLOY_DIR/uploads"
    sudo chown -R $USER:$USER "$DEPLOY_DIR"
}

# Function to copy files
copy_files() {
    echo -e "${YELLOW}📋 Copying deployment files...${NC}"
    cp docker-compose.aws.yml "$DEPLOY_DIR/"
    cp Dockerfile.production "$DEPLOY_DIR/"
    cp nginx.conf "$DEPLOY_DIR/"
    
    # Copy environment file if it exists
    if [ -f ".env" ]; then
        cp .env "$DEPLOY_DIR/"
    else
        echo -e "${YELLOW}⚠️  No .env file found. Please create one from .env.production.example${NC}"
        cp .env.production.example "$DEPLOY_DIR/"
    fi
}

# Function to generate SSL certificates (self-signed for development)
generate_ssl() {
    echo -e "${YELLOW}🔐 Generating SSL certificates...${NC}"
    if [ ! -f "$DEPLOY_DIR/ssl/cert.pem" ]; then
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$DEPLOY_DIR/ssl/key.pem" \
            -out "$DEPLOY_DIR/ssl/cert.pem" \
            -subj "/C=US/ST=State/L=City/O=BiteBase/CN=localhost"
        echo -e "${GREEN}✅ SSL certificates generated${NC}"
    else
        echo -e "${GREEN}✅ SSL certificates already exist${NC}"
    fi
}

# Function to pull latest images
pull_images() {
    echo -e "${YELLOW}📥 Pulling latest Docker images...${NC}"
    cd "$DEPLOY_DIR"
    docker-compose -f docker-compose.aws.yml pull
}

# Function to stop existing services
stop_services() {
    echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
    cd "$DEPLOY_DIR"
    docker-compose -f docker-compose.aws.yml down || true
}

# Function to start services
start_services() {
    echo -e "${YELLOW}🚀 Starting services...${NC}"
    cd "$DEPLOY_DIR"
    docker-compose -f docker-compose.aws.yml up -d --build
}

# Function to check health
check_health() {
    echo -e "${YELLOW}🏥 Checking service health...${NC}"
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
        return 1
    fi
    
    # Check nginx
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx is healthy${NC}"
    else
        echo -e "${RED}❌ Nginx health check failed${NC}"
        return 1
    fi
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Recent logs:${NC}"
    cd "$DEPLOY_DIR"
    docker-compose -f docker-compose.aws.yml logs --tail=20
}

# Function to setup systemd service
setup_systemd() {
    echo -e "${YELLOW}⚙️  Setting up systemd service...${NC}"
    
    sudo tee /etc/systemd/system/bitebase.service > /dev/null <<EOF
[Unit]
Description=BiteBase Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.aws.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.aws.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable bitebase.service
    echo -e "${GREEN}✅ Systemd service configured${NC}"
}

# Main deployment process
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    
    # Create backup if deployment exists
    create_backup
    
    # Setup directories
    setup_directories
    
    # Copy files
    copy_files
    
    # Generate SSL certificates
    generate_ssl
    
    # Stop existing services
    stop_services
    
    # Pull latest images
    pull_images
    
    # Start services
    start_services
    
    # Check health
    if check_health; then
        echo -e "${GREEN}🎉 Deployment successful!${NC}"
        echo -e "${BLUE}📊 Service Status:${NC}"
        cd "$DEPLOY_DIR"
        docker-compose -f docker-compose.aws.yml ps
        
        echo -e "${BLUE}🌐 Access URLs:${NC}"
        echo -e "  HTTP:  http://$(curl -s ifconfig.me)"
        echo -e "  HTTPS: https://$(curl -s ifconfig.me)"
        echo -e "  API:   https://$(curl -s ifconfig.me)/api/health"
        
        # Setup systemd service
        setup_systemd
        
    else
        echo -e "${RED}❌ Deployment failed. Showing logs...${NC}"
        show_logs
        exit 1
    fi
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        stop_services
        ;;
    "start")
        start_services
        ;;
    "restart")
        stop_services
        start_services
        ;;
    "logs")
        show_logs
        ;;
    "health")
        check_health
        ;;
    "backup")
        create_backup
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|logs|health|backup}"
        exit 1
        ;;
esac