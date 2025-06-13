#!/bin/bash

# BiteBase EC2 One-Command Setup Script
# This script sets up a fresh EC2 instance and deploys BiteBase

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 BiteBase EC2 One-Command Setup${NC}"
echo -e "${BLUE}===================================${NC}"

# Function to print section headers
print_section() {
    echo -e "\n${PURPLE}============================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}============================================${NC}\n"
}

# Check if running on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release; then
    echo -e "${RED}❌ This script is designed for Ubuntu. Please use Ubuntu 22.04 LTS.${NC}"
    exit 1
fi

# Update system
print_section "Updating System"
sudo apt-get update -y
sudo apt-get upgrade -y
echo -e "${GREEN}✅ System updated${NC}"

# Install Docker
print_section "Installing Docker"
if ! command -v docker &> /dev/null; then
    # Remove old versions
    sudo apt-get remove -y docker docker-engine docker.io containerd runc || true
    
    # Install dependencies
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
print_section "Installing Docker Compose"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Install additional tools
print_section "Installing Additional Tools"
sudo apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    htop \
    nginx-extras \
    certbot \
    python3-certbot-nginx \
    ufw
echo -e "${GREEN}✅ Additional tools installed${NC}"

# Configure firewall
print_section "Configuring Firewall"
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000
echo -e "${GREEN}✅ Firewall configured${NC}"

# Clone repository
print_section "Cloning BiteBase Repository"
if [ ! -d "beta-bitebase-app" ]; then
    git clone https://github.com/khiwniti/beta-bitebase-app.git
    echo -e "${GREEN}✅ Repository cloned${NC}"
else
    echo -e "${YELLOW}⚠️  Repository already exists, pulling latest changes...${NC}"
    cd beta-bitebase-app
    git pull
    cd ..
    echo -e "${GREEN}✅ Repository updated${NC}"
fi

# Setup environment
print_section "Setting Up Environment"
cd beta-bitebase-app/aws-deployment

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.fullstack.example .env
    echo -e "${YELLOW}⚠️  Environment file created from template${NC}"
    echo -e "${RED}❗ IMPORTANT: You need to edit .env with your actual values${NC}"
    echo -e "${CYAN}📝 Required configurations:${NC}"
    echo -e "   - Database passwords"
    echo -e "   - JWT secret"
    echo -e "   - API keys (OpenAI, Google Maps, Stripe)"
    echo -e "   - Domain name"
    echo -e "   - AWS credentials"
    echo -e ""
    read -p "Press Enter to open the .env file for editing..."
    nano .env
fi

# Start Docker service
print_section "Starting Docker Service"
sudo systemctl start docker
sudo systemctl enable docker
echo -e "${GREEN}✅ Docker service started${NC}"

# Deploy BiteBase
print_section "Deploying BiteBase"
echo -e "${YELLOW}🚀 Starting BiteBase deployment...${NC}"
./deploy-fullstack.sh

# Setup monitoring
print_section "Setting Up Monitoring"
# Create monitoring script
sudo tee /opt/bitebase-monitor.sh > /dev/null <<'EOF'
#!/bin/bash
# BiteBase monitoring script

LOG_FILE="/var/log/bitebase-monitor.log"
DEPLOY_DIR="/opt/bitebase"

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check if services are running
cd $DEPLOY_DIR
if ! docker-compose -f docker-compose.fullstack.yml ps | grep -q "Up"; then
    log_message "ERROR: Some services are down, attempting restart"
    docker-compose -f docker-compose.fullstack.yml up -d
else
    log_message "INFO: All services are running"
fi

# Check disk usage
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    log_message "WARNING: Disk usage is at ${DISK_USAGE}%"
fi

# Clean up old logs
find /opt/bitebase/logs -name "*.log" -mtime +7 -delete 2>/dev/null || true
EOF

sudo chmod +x /opt/bitebase-monitor.sh

# Setup cron job for monitoring
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/bitebase-monitor.sh") | crontab -

echo -e "${GREEN}✅ Monitoring setup complete${NC}"

# Final information
print_section "Setup Complete! 🎉"

PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "Unable to detect")

echo -e "${GREEN}🎉 BiteBase has been successfully deployed on your EC2 instance!${NC}"
echo -e ""
echo -e "${CYAN}🌐 Access Information:${NC}"
echo -e "  ${GREEN}Public IP:${NC}        $PUBLIC_IP"
echo -e "  ${GREEN}Frontend (HTTP):${NC}  http://$PUBLIC_IP"
echo -e "  ${GREEN}Frontend (HTTPS):${NC} https://$PUBLIC_IP"
echo -e "  ${GREEN}Backend API:${NC}      https://$PUBLIC_IP/api"
echo -e "  ${GREEN}Health Check:${NC}     https://$PUBLIC_IP/health"
echo -e ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "  1. ${CYAN}Configure your domain:${NC} Point your domain DNS to $PUBLIC_IP"
echo -e "  2. ${CYAN}Update environment:${NC} Edit /opt/bitebase/.env with your domain"
echo -e "  3. ${CYAN}Setup SSL:${NC} Run 'sudo certbot --nginx' for Let's Encrypt SSL"
echo -e "  4. ${CYAN}Configure APIs:${NC} Add your API keys to the .env file"
echo -e ""
echo -e "${CYAN}🔧 Management Commands:${NC}"
echo -e "  ${GREEN}View logs:${NC}     cd /opt/bitebase && docker-compose -f docker-compose.fullstack.yml logs -f"
echo -e "  ${GREEN}Restart:${NC}       cd /opt/bitebase && docker-compose -f docker-compose.fullstack.yml restart"
echo -e "  ${GREEN}Update app:${NC}    cd ~/beta-bitebase-app && git pull && cd aws-deployment && ./deploy-fullstack.sh"
echo -e ""
echo -e "${PURPLE}🔒 Security Reminders:${NC}"
echo -e "  - Change default passwords in .env file"
echo -e "  - Setup proper SSL certificates for production"
echo -e "  - Configure proper firewall rules"
echo -e "  - Regularly update the system and Docker images"
echo -e ""
echo -e "${GREEN}Happy coding! 🚀${NC}"