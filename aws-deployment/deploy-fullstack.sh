#!/bin/bash

# BiteBase Full-Stack AWS EC2 Deployment Script
# This script deploys both frontend and backend to AWS EC2 using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/opt/bitebase"
BACKUP_DIR="/opt/bitebase-backups"
SERVICE_NAME="bitebase"
COMPOSE_FILE="docker-compose.fullstack.yml"

echo -e "${BLUE}🚀 Starting BiteBase Full-Stack deployment to AWS EC2...${NC}"

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

# Function to print section headers
print_section() {
    echo -e "\n${PURPLE}============================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}============================================${NC}\n"
}

# Function to create backup
create_backup() {
    if [ -d "$DEPLOY_DIR" ]; then
        print_section "Creating Backup"
        sudo mkdir -p "$BACKUP_DIR"
        BACKUP_NAME="bitebase-backup-$(date +%Y%m%d-%H%M%S)"
        sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        echo -e "${GREEN}✅ Backup created: $BACKUP_DIR/$BACKUP_NAME${NC}"
    fi
}

# Function to setup directories
setup_directories() {
    print_section "Setting Up Directories"
    sudo mkdir -p "$DEPLOY_DIR"
    sudo mkdir -p "$DEPLOY_DIR/ssl"
    sudo mkdir -p "$DEPLOY_DIR/logs"
    sudo mkdir -p "$DEPLOY_DIR/uploads"
    sudo chown -R $USER:$USER "$DEPLOY_DIR"
    echo -e "${GREEN}✅ Directories created and permissions set${NC}"
}

# Function to copy files
copy_files() {
    print_section "Copying Deployment Files"
    
    # Copy Docker files
    cp $COMPOSE_FILE "$DEPLOY_DIR/"
    cp Dockerfile.backend "$DEPLOY_DIR/"
    cp Dockerfile.frontend "$DEPLOY_DIR/"
    cp nginx.fullstack.conf "$DEPLOY_DIR/"
    
    # Copy the entire app directory for building
    echo -e "${YELLOW}📋 Copying application source code...${NC}"
    cp -r ../apps "$DEPLOY_DIR/"
    cp -r ../database "$DEPLOY_DIR/"
    
    # Copy environment file
    if [ -f ".env" ]; then
        cp .env "$DEPLOY_DIR/"
        echo -e "${GREEN}✅ Environment file copied${NC}"
    else
        echo -e "${YELLOW}⚠️  No .env file found. Creating from template...${NC}"
        cp .env.fullstack.example "$DEPLOY_DIR/.env"
        echo -e "${RED}❗ Please edit $DEPLOY_DIR/.env with your actual values before continuing${NC}"
        read -p "Press Enter after you've configured the .env file..."
    fi
}

# Function to generate SSL certificates (self-signed for development)
generate_ssl() {
    print_section "Generating SSL Certificates"
    if [ ! -f "$DEPLOY_DIR/ssl/cert.pem" ]; then
        sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$DEPLOY_DIR/ssl/key.pem" \
            -out "$DEPLOY_DIR/ssl/cert.pem" \
            -subj "/C=US/ST=State/L=City/O=BiteBase/CN=localhost"
        sudo chown -R $USER:$USER "$DEPLOY_DIR/ssl"
        echo -e "${GREEN}✅ SSL certificates generated${NC}"
        echo -e "${YELLOW}⚠️  Using self-signed certificates. For production, use Let's Encrypt${NC}"
    else
        echo -e "${GREEN}✅ SSL certificates already exist${NC}"
    fi
}

# Function to stop existing services
stop_services() {
    print_section "Stopping Existing Services"
    cd "$DEPLOY_DIR"
    docker-compose -f $COMPOSE_FILE down --remove-orphans || true
    echo -e "${GREEN}✅ Services stopped${NC}"
}

# Function to build and start services
start_services() {
    print_section "Building and Starting Services"
    cd "$DEPLOY_DIR"
    
    echo -e "${YELLOW}🔨 Building Docker images...${NC}"
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    echo -e "${YELLOW}🚀 Starting services...${NC}"
    docker-compose -f $COMPOSE_FILE up -d
    
    echo -e "${GREEN}✅ Services started${NC}"
}

# Function to check health
check_health() {
    print_section "Checking Service Health"
    echo -e "${YELLOW}⏳ Waiting for services to start (60 seconds)...${NC}"
    sleep 60
    
    local health_ok=true
    
    # Check backend health
    echo -e "${CYAN}🔍 Checking backend health...${NC}"
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
    else
        echo -e "${RED}❌ Backend health check failed${NC}"
        health_ok=false
    fi
    
    # Check frontend health
    echo -e "${CYAN}🔍 Checking frontend health...${NC}"
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}"
        health_ok=false
    fi
    
    # Check nginx
    echo -e "${CYAN}🔍 Checking nginx health...${NC}"
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx is healthy${NC}"
    else
        echo -e "${RED}❌ Nginx health check failed${NC}"
        health_ok=false
    fi
    
    if [ "$health_ok" = true ]; then
        return 0
    else
        return 1
    fi
}

# Function to show logs
show_logs() {
    print_section "Recent Logs"
    cd "$DEPLOY_DIR"
    docker-compose -f $COMPOSE_FILE logs --tail=20
}

# Function to show service status
show_status() {
    print_section "Service Status"
    cd "$DEPLOY_DIR"
    docker-compose -f $COMPOSE_FILE ps
}

# Function to setup systemd service
setup_systemd() {
    print_section "Setting Up Systemd Service"
    
    sudo tee /etc/systemd/system/bitebase.service > /dev/null <<EOF
[Unit]
Description=BiteBase Full-Stack Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/local/bin/docker-compose -f $COMPOSE_FILE up -d
ExecStop=/usr/local/bin/docker-compose -f $COMPOSE_FILE down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable bitebase.service
    echo -e "${GREEN}✅ Systemd service configured${NC}"
}

# Function to display access information
show_access_info() {
    print_section "Access Information"
    
    local public_ip=$(curl -s ifconfig.me 2>/dev/null || echo "Unable to detect")
    
    echo -e "${CYAN}🌐 Access URLs:${NC}"
    echo -e "  ${GREEN}Frontend (HTTP):${NC}  http://$public_ip"
    echo -e "  ${GREEN}Frontend (HTTPS):${NC} https://$public_ip"
    echo -e "  ${GREEN}Backend API:${NC}      https://$public_ip/api"
    echo -e "  ${GREEN}Health Check:${NC}     https://$public_ip/health"
    echo -e ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo -e "  1. Configure your domain DNS to point to: $public_ip"
    echo -e "  2. Update .env file with your actual domain"
    echo -e "  3. For production, setup Let's Encrypt SSL certificates"
    echo -e "  4. Configure your API keys and secrets in .env"
    echo -e ""
    echo -e "${CYAN}🔧 Management Commands:${NC}"
    echo -e "  ${GREEN}View logs:${NC}     ./deploy-fullstack.sh logs"
    echo -e "  ${GREEN}Check status:${NC}  ./deploy-fullstack.sh status"
    echo -e "  ${GREEN}Restart:${NC}       ./deploy-fullstack.sh restart"
    echo -e "  ${GREEN}Stop:${NC}          ./deploy-fullstack.sh stop"
}

# Main deployment process
main() {
    print_section "Starting Full-Stack Deployment"
    
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
    
    # Start services
    start_services
    
    # Check health
    if check_health; then
        print_section "Deployment Successful! 🎉"
        
        # Show service status
        show_status
        
        # Setup systemd service
        setup_systemd
        
        # Show access information
        show_access_info
        
        echo -e "\n${GREEN}🎉 BiteBase Full-Stack deployment completed successfully!${NC}\n"
        
    else
        print_section "Deployment Failed ❌"
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
        print_section "Stopping Services"
        cd "$DEPLOY_DIR"
        docker-compose -f $COMPOSE_FILE down
        ;;
    "start")
        print_section "Starting Services"
        cd "$DEPLOY_DIR"
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "restart")
        print_section "Restarting Services"
        cd "$DEPLOY_DIR"
        docker-compose -f $COMPOSE_FILE down
        docker-compose -f $COMPOSE_FILE up -d
        ;;
    "logs")
        cd "$DEPLOY_DIR"
        docker-compose -f $COMPOSE_FILE logs -f
        ;;
    "status")
        cd "$DEPLOY_DIR"
        docker-compose -f $COMPOSE_FILE ps
        ;;
    "health")
        check_health
        ;;
    "backup")
        create_backup
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 {deploy|start|stop|restart|logs|status|health|backup}${NC}"
        echo -e ""
        echo -e "${CYAN}Commands:${NC}"
        echo -e "  ${GREEN}deploy${NC}   - Full deployment (default)"
        echo -e "  ${GREEN}start${NC}    - Start services"
        echo -e "  ${GREEN}stop${NC}     - Stop services"
        echo -e "  ${GREEN}restart${NC}  - Restart services"
        echo -e "  ${GREEN}logs${NC}     - View logs (follow mode)"
        echo -e "  ${GREEN}status${NC}   - Show service status"
        echo -e "  ${GREEN}health${NC}   - Check service health"
        echo -e "  ${GREEN}backup${NC}   - Create backup"
        exit 1
        ;;
esac