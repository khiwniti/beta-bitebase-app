#!/bin/bash

# AWS EC2 Initial Setup Script for BiteBase
# Run this script on a fresh EC2 instance to prepare it for BiteBase deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up AWS EC2 instance for BiteBase...${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update -y
sudo apt-get upgrade -y

# Install essential packages
echo -e "${YELLOW}📦 Installing essential packages...${NC}"
sudo apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    htop \
    nginx \
    certbot \
    python3-certbot-nginx \
    ufw \
    fail2ban \
    logrotate

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
rm get-docker.sh

# Install Docker Compose
echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (for utilities)
echo -e "${YELLOW}📦 Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw --force enable

# Configure fail2ban
echo -e "${YELLOW}🛡️  Configuring fail2ban...${NC}"
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure log rotation
echo -e "${YELLOW}📋 Configuring log rotation...${NC}"
sudo tee /etc/logrotate.d/bitebase > /dev/null <<EOF
/opt/bitebase/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /opt/bitebase/docker-compose.aws.yml restart bitebase-backend
    endscript
}
EOF

# Create swap file (if not exists)
echo -e "${YELLOW}💾 Setting up swap file...${NC}"
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Configure system limits
echo -e "${YELLOW}⚙️  Configuring system limits...${NC}"
sudo tee -a /etc/security/limits.conf > /dev/null <<EOF
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536
EOF

# Configure sysctl
sudo tee -a /etc/sysctl.conf > /dev/null <<EOF
# BiteBase optimizations
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_fin_timeout = 30
vm.swappiness = 10
EOF

sudo sysctl -p

# Install AWS CLI
echo -e "${YELLOW}☁️  Installing AWS CLI...${NC}"
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# Install CloudWatch agent
echo -e "${YELLOW}📊 Installing CloudWatch agent...${NC}"
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
rm amazon-cloudwatch-agent.deb

# Create CloudWatch config
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOF
{
    "agent": {
        "metrics_collection_interval": 60,
        "run_as_user": "cwagent"
    },
    "metrics": {
        "namespace": "BiteBase/EC2",
        "metrics_collected": {
            "cpu": {
                "measurement": [
                    "cpu_usage_idle",
                    "cpu_usage_iowait",
                    "cpu_usage_user",
                    "cpu_usage_system"
                ],
                "metrics_collection_interval": 60
            },
            "disk": {
                "measurement": [
                    "used_percent"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "diskio": {
                "measurement": [
                    "io_time"
                ],
                "metrics_collection_interval": 60,
                "resources": [
                    "*"
                ]
            },
            "mem": {
                "measurement": [
                    "mem_used_percent"
                ],
                "metrics_collection_interval": 60
            },
            "netstat": {
                "measurement": [
                    "tcp_established",
                    "tcp_time_wait"
                ],
                "metrics_collection_interval": 60
            },
            "swap": {
                "measurement": [
                    "swap_used_percent"
                ],
                "metrics_collection_interval": 60
            }
        }
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                    {
                        "file_path": "/opt/bitebase/logs/app.log",
                        "log_group_name": "bitebase-application",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/nginx/access.log",
                        "log_group_name": "bitebase-nginx-access",
                        "log_stream_name": "{instance_id}"
                    },
                    {
                        "file_path": "/var/log/nginx/error.log",
                        "log_group_name": "bitebase-nginx-error",
                        "log_stream_name": "{instance_id}"
                    }
                ]
            }
        }
    }
}
EOF

# Create deployment directory
echo -e "${YELLOW}📁 Creating deployment directory...${NC}"
sudo mkdir -p /opt/bitebase
sudo chown -R $USER:$USER /opt/bitebase

# Create monitoring script
echo -e "${YELLOW}📊 Creating monitoring script...${NC}"
tee /opt/bitebase/monitor.sh > /dev/null <<'EOF'
#!/bin/bash

# BiteBase Health Monitoring Script

LOG_FILE="/opt/bitebase/logs/monitor.log"
mkdir -p /opt/bitebase/logs

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_service() {
    local service_name=$1
    local url=$2
    
    if curl -f -s "$url" > /dev/null; then
        log "✅ $service_name is healthy"
        return 0
    else
        log "❌ $service_name is unhealthy"
        return 1
    fi
}

# Check services
check_service "Backend" "http://localhost:8000/health"
check_service "Nginx" "http://localhost/health"

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    log "⚠️  Disk usage is high: ${DISK_USAGE}%"
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEM_USAGE" -gt 80 ]; then
    log "⚠️  Memory usage is high: ${MEM_USAGE}%"
fi

# Cleanup old logs
find /opt/bitebase/logs -name "*.log" -mtime +30 -delete
EOF

chmod +x /opt/bitebase/monitor.sh

# Setup cron job for monitoring
echo -e "${YELLOW}⏰ Setting up monitoring cron job...${NC}"
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/bitebase/monitor.sh") | crontab -

# Create backup script
echo -e "${YELLOW}💾 Creating backup script...${NC}"
tee /opt/bitebase/backup.sh > /dev/null <<'EOF'
#!/bin/bash

# BiteBase Backup Script

BACKUP_DIR="/opt/bitebase-backups"
DATE=$(date +%Y%m%d_%H%M%S)
S3_BUCKET="your-bitebase-backups-bucket"

mkdir -p "$BACKUP_DIR"

# Backup database
docker exec bitebase-postgres pg_dump -U bitebase bitebase_prod > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" -C /opt/bitebase uploads/

# Upload to S3 (uncomment when configured)
# aws s3 cp "$BACKUP_DIR/db_backup_$DATE.sql" "s3://$S3_BUCKET/database/"
# aws s3 cp "$BACKUP_DIR/uploads_backup_$DATE.tar.gz" "s3://$S3_BUCKET/uploads/"

# Cleanup old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /opt/bitebase/backup.sh

# Setup daily backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/bitebase/backup.sh") | crontab -

# Final system configuration
echo -e "${YELLOW}⚙️  Final system configuration...${NC}"
sudo systemctl enable docker
sudo systemctl start docker

# Create deployment user
sudo useradd -m -s /bin/bash bitebase || true
sudo usermod -aG docker bitebase

echo -e "${GREEN}🎉 EC2 setup completed successfully!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "  1. Configure AWS credentials: aws configure"
echo -e "  2. Clone your repository to /opt/bitebase"
echo -e "  3. Copy .env.production.example to .env and configure"
echo -e "  4. Run the deployment script: ./deploy.sh"
echo -e "  5. Configure SSL certificates with Let's Encrypt"
echo -e "${YELLOW}⚠️  Remember to reboot the instance to apply all changes${NC}"