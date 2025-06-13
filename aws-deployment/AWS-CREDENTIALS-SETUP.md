# AWS Credentials Setup for BiteBase Deployment

## Quick Setup with Your Credentials

Since your session token has expired, you'll need to get fresh AWS credentials. Here's how to set them up:

### Option 1: Using AWS CLI Configure (Recommended)

```bash
aws configure
```

Enter your credentials when prompted:
- AWS Access Key ID: `ASIA4TALKUC6S674XHQ7` (or get a new one)
- AWS Secret Access Key: `D0kBJJWoGxbDxv9GGt0KWAeH8HOpnR5ExEq+QzCd` (or get a new one)
- Default region: `us-east-1` (or your preferred region)
- Default output format: `json`

### Option 2: Using Environment Variables

```bash
export AWS_ACCESS_KEY_ID="your_new_access_key"
export AWS_SECRET_ACCESS_KEY="your_new_secret_key"
export AWS_SESSION_TOKEN="your_new_session_token"  # Only if using temporary credentials
```

### Option 3: Get New Temporary Credentials

If you're using AWS Academy or temporary credentials:

1. Go to your AWS Console
2. Click on your username in the top right
3. Select "Security credentials" or "AWS Details"
4. Copy the new credentials (they refresh periodically)

## Creating EC2 Instance

Once your credentials are set up, run:

```bash
cd /path/to/beta-bitebase-app/aws-deployment
./create-ec2-instance.sh
```

This script will:
1. ✅ Verify your AWS credentials
2. 🔑 Create SSH key pair for secure access
3. 🛡️ Set up security group with required ports (22, 80, 443, 8000)
4. 🖥️ Launch t3.medium EC2 instance with Amazon Linux 2023
5. 📦 Create deployment package with all necessary files
6. 📋 Provide detailed connection and deployment instructions

## What You'll Get

After running the script:

- **EC2 Instance**: Ready-to-use server with Docker and dependencies pre-installed
- **SSH Key**: `bitebase-key.pem` file for secure connection
- **Security Group**: Properly configured firewall rules
- **Deployment Package**: All files needed for BiteBase deployment
- **Instructions**: Step-by-step guide for deployment

## Instance Specifications

- **Type**: t3.medium (2 vCPU, 4 GB RAM)
- **Storage**: 8 GB SSD (expandable)
- **OS**: Amazon Linux 2023
- **Pre-installed**: Docker, Docker Compose, Node.js, AWS CLI, Git

## Estimated Costs

- **t3.medium**: ~$30-40/month (24/7 usage)
- **Storage**: ~$1/month for 8GB
- **Data Transfer**: Varies based on usage

## Security Features

- SSH access only with key pair
- Firewall configured for web traffic only
- Regular security updates
- Non-root user setup

## Next Steps After Instance Creation

1. **Connect**: SSH into your instance
2. **Configure**: Set up environment variables
3. **Deploy**: Run the deployment script
4. **Secure**: Set up SSL certificates
5. **Monitor**: Configure CloudWatch monitoring

## Troubleshooting

### Credentials Issues
```bash
# Test your credentials
aws sts get-caller-identity

# If expired, get new ones from AWS Console
```

### Permission Issues
Make sure your AWS user has these permissions:
- EC2 full access
- VPC access
- IAM basic access (for role creation)

### Region Issues
```bash
# Check available regions
aws ec2 describe-regions

# Set your preferred region
aws configure set region us-east-1
```

## Support

If you encounter any issues:
1. Check the AWS CloudFormation console for detailed error messages
2. Verify your IAM permissions
3. Ensure your account has sufficient limits for EC2 instances
4. Check the deployment logs in `/var/log/bitebase-setup.log` on the instance

## Manual Alternative

If the automated script doesn't work, you can manually:
1. Create EC2 instance through AWS Console
2. Use the provided `ec2-setup.sh` script for initial configuration
3. Follow the deployment guide in `README-AWS-DEPLOYMENT.md`