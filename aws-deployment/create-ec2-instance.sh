#!/bin/bash

# BiteBase AWS EC2 Instance Creation Script
# This script creates and configures an EC2 instance for BiteBase deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 BiteBase AWS EC2 Instance Creation Script${NC}"

# Configuration variables
INSTANCE_TYPE="t3.medium"
AMI_ID="ami-0c02fb55956c7d316"  # Amazon Linux 2023 AMI (us-east-1)
KEY_NAME="bitebase-key"
SECURITY_GROUP_NAME="bitebase-sg"
INSTANCE_NAME="bitebase-production"
REGION="us-east-1"

# Check if AWS CLI is configured
check_aws_credentials() {
    echo -e "${YELLOW}🔐 Checking AWS credentials...${NC}"
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        echo -e "${RED}❌ AWS credentials not configured or expired.${NC}"
        echo -e "${YELLOW}Please run: aws configure${NC}"
        echo -e "${YELLOW}Or set environment variables:${NC}"
        echo -e "  export AWS_ACCESS_KEY_ID=your_access_key"
        echo -e "  export AWS_SECRET_ACCESS_KEY=your_secret_key"
        echo -e "  export AWS_SESSION_TOKEN=your_session_token  # if using temporary credentials"
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    USER_ARN=$(aws sts get-caller-identity --query Arn --output text)
    echo -e "${GREEN}✅ AWS credentials verified${NC}"
    echo -e "  Account ID: $ACCOUNT_ID"
    echo -e "  User: $USER_ARN"
}

# Create or check key pair
create_key_pair() {
    echo -e "${YELLOW}🔑 Setting up SSH key pair...${NC}"
    
    if aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region "$REGION" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Key pair '$KEY_NAME' already exists${NC}"
    else
        echo -e "${YELLOW}📝 Creating new key pair '$KEY_NAME'...${NC}"
        aws ec2 create-key-pair \
            --key-name "$KEY_NAME" \
            --region "$REGION" \
            --query 'KeyMaterial' \
            --output text > "${KEY_NAME}.pem"
        
        chmod 400 "${KEY_NAME}.pem"
        echo -e "${GREEN}✅ Key pair created and saved as ${KEY_NAME}.pem${NC}"
        echo -e "${YELLOW}⚠️  Keep this file safe! You'll need it to SSH into your instance.${NC}"
    fi
}

# Create security group
create_security_group() {
    echo -e "${YELLOW}🛡️  Setting up security group...${NC}"
    
    # Check if security group exists
    if aws ec2 describe-security-groups --group-names "$SECURITY_GROUP_NAME" --region "$REGION" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Security group '$SECURITY_GROUP_NAME' already exists${NC}"
        SG_ID=$(aws ec2 describe-security-groups --group-names "$SECURITY_GROUP_NAME" --region "$REGION" --query 'SecurityGroups[0].GroupId' --output text)
    else
        echo -e "${YELLOW}📝 Creating security group '$SECURITY_GROUP_NAME'...${NC}"
        
        # Get default VPC ID
        VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --region "$REGION" --query 'Vpcs[0].VpcId' --output text)
        
        # Create security group
        SG_ID=$(aws ec2 create-security-group \
            --group-name "$SECURITY_GROUP_NAME" \
            --description "Security group for BiteBase application" \
            --vpc-id "$VPC_ID" \
            --region "$REGION" \
            --query 'GroupId' \
            --output text)
        
        # Add inbound rules
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 22 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 80 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 443 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        aws ec2 authorize-security-group-ingress \
            --group-id "$SG_ID" \
            --protocol tcp \
            --port 8000 \
            --cidr 0.0.0.0/0 \
            --region "$REGION"
        
        echo -e "${GREEN}✅ Security group created with ID: $SG_ID${NC}"
    fi
}

# Create EC2 instance
create_instance() {
    echo -e "${YELLOW}🖥️  Creating EC2 instance...${NC}"
    
    # Create user data script for initial setup
    cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker git curl wget htop

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Create deployment directory
mkdir -p /opt/bitebase
chown ec2-user:ec2-user /opt/bitebase

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf aws awscliv2.zip

echo "EC2 instance setup completed" > /var/log/bitebase-setup.log
EOF

    # Launch instance
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id "$AMI_ID" \
        --count 1 \
        --instance-type "$INSTANCE_TYPE" \
        --key-name "$KEY_NAME" \
        --security-group-ids "$SG_ID" \
        --user-data file://user-data.sh \
        --region "$REGION" \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME},{Key=Project,Value=BiteBase},{Key=Environment,Value=Production}]" \
        --query 'Instances[0].InstanceId' \
        --output text)
    
    echo -e "${GREEN}✅ EC2 instance created with ID: $INSTANCE_ID${NC}"
    
    # Wait for instance to be running
    echo -e "${YELLOW}⏳ Waiting for instance to be running...${NC}"
    aws ec2 wait instance-running --instance-ids "$INSTANCE_ID" --region "$REGION"
    
    # Get instance details
    INSTANCE_INFO=$(aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --region "$REGION" \
        --query 'Reservations[0].Instances[0]')
    
    PUBLIC_IP=$(echo "$INSTANCE_INFO" | jq -r '.PublicIpAddress')
    PRIVATE_IP=$(echo "$INSTANCE_INFO" | jq -r '.PrivateIpAddress')
    
    echo -e "${GREEN}🎉 Instance is now running!${NC}"
    echo -e "${BLUE}📊 Instance Details:${NC}"
    echo -e "  Instance ID: $INSTANCE_ID"
    echo -e "  Public IP: $PUBLIC_IP"
    echo -e "  Private IP: $PRIVATE_IP"
    echo -e "  Instance Type: $INSTANCE_TYPE"
    echo -e "  Region: $REGION"
    
    # Clean up user data file
    rm -f user-data.sh
}

# Generate connection instructions
generate_instructions() {
    echo -e "${BLUE}📋 Connection Instructions:${NC}"
    echo -e "${YELLOW}1. SSH into your instance:${NC}"
    echo -e "   ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
    echo ""
    echo -e "${YELLOW}2. Clone BiteBase repository:${NC}"
    echo -e "   git clone https://github.com/khiwniti/beta-bitebase-app.git"
    echo -e "   cd beta-bitebase-app/aws-deployment"
    echo ""
    echo -e "${YELLOW}3. Configure environment:${NC}"
    echo -e "   cp .env.production.example .env"
    echo -e "   nano .env  # Edit with your actual values"
    echo ""
    echo -e "${YELLOW}4. Run initial setup:${NC}"
    echo -e "   sudo ./ec2-setup.sh"
    echo ""
    echo -e "${YELLOW}5. Deploy BiteBase:${NC}"
    echo -e "   ./deploy.sh"
    echo ""
    echo -e "${BLUE}🌐 Access URLs (after deployment):${NC}"
    echo -e "  HTTP:  http://$PUBLIC_IP"
    echo -e "  HTTPS: https://$PUBLIC_IP"
    echo -e "  API:   https://$PUBLIC_IP/api/health"
    echo ""
    echo -e "${YELLOW}⚠️  Important Notes:${NC}"
    echo -e "  • Keep the ${KEY_NAME}.pem file secure"
    echo -e "  • Configure your domain DNS to point to $PUBLIC_IP"
    echo -e "  • Set up SSL certificates for production use"
    echo -e "  • Configure environment variables in .env file"
    echo -e "  • Monitor costs in AWS console"
}

# Create deployment package
create_deployment_package() {
    echo -e "${YELLOW}📦 Creating deployment package...${NC}"
    
    # Create a deployment package with all necessary files
    mkdir -p bitebase-deployment
    cp -r ../aws-deployment/* bitebase-deployment/
    cp "${KEY_NAME}.pem" bitebase-deployment/ 2>/dev/null || true
    
    # Create deployment instructions
    cat > bitebase-deployment/DEPLOYMENT-INSTRUCTIONS.md << EOF
# BiteBase AWS Deployment Instructions

## Instance Details
- Instance ID: $INSTANCE_ID
- Public IP: $PUBLIC_IP
- Private IP: $PRIVATE_IP
- Region: $REGION
- Key Pair: $KEY_NAME

## Quick Start

1. **Connect to your instance:**
   \`\`\`bash
   ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP
   \`\`\`

2. **Upload deployment files:**
   \`\`\`bash
   scp -i ${KEY_NAME}.pem -r bitebase-deployment ec2-user@$PUBLIC_IP:~/
   \`\`\`

3. **Run setup on the instance:**
   \`\`\`bash
   ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP
   cd bitebase-deployment
   sudo chmod +x *.sh
   sudo ./ec2-setup.sh
   \`\`\`

4. **Configure environment:**
   \`\`\`bash
   cp .env.production.example .env
   nano .env  # Edit with your actual values
   \`\`\`

5. **Deploy BiteBase:**
   \`\`\`bash
   ./deploy.sh
   \`\`\`

## Environment Variables to Configure

Edit the \`.env\` file with your actual values:

- Database passwords
- JWT secret
- Stripe keys (if using payments)
- OpenAI API key (if using AI features)
- Google Maps API key
- AWS credentials for S3
- Domain configuration

## Access URLs

After deployment:
- HTTP: http://$PUBLIC_IP
- HTTPS: https://$PUBLIC_IP (after SSL setup)
- API Health: http://$PUBLIC_IP:8000/health

## Next Steps

1. Configure your domain DNS
2. Set up SSL certificates with Let's Encrypt
3. Configure monitoring and backups
4. Set up CI/CD pipeline (optional)

## Support

Refer to README-AWS-DEPLOYMENT.md for detailed documentation.
EOF

    echo -e "${GREEN}✅ Deployment package created in 'bitebase-deployment' directory${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting BiteBase EC2 instance creation...${NC}"
    
    check_aws_credentials
    create_key_pair
    create_security_group
    create_instance
    create_deployment_package
    generate_instructions
    
    echo -e "${GREEN}🎉 BiteBase EC2 instance setup completed successfully!${NC}"
    echo -e "${YELLOW}💡 Next: Upload the 'bitebase-deployment' directory to your instance and follow the deployment instructions.${NC}"
}

# Handle command line arguments
case "${1:-create}" in
    "create")
        main
        ;;
    "help")
        echo "Usage: $0 {create|help}"
        echo ""
        echo "Commands:"
        echo "  create  - Create new EC2 instance for BiteBase"
        echo "  help    - Show this help message"
        echo ""
        echo "Prerequisites:"
        echo "  - AWS CLI configured with valid credentials"
        echo "  - Appropriate IAM permissions for EC2, VPC operations"
        echo ""
        echo "The script will create:"
        echo "  - EC2 instance (t3.medium)"
        echo "  - Security group with required ports"
        echo "  - SSH key pair"
        echo "  - Deployment package with instructions"
        ;;
    *)
        echo "Usage: $0 {create|help}"
        exit 1
        ;;
esac