#!/bin/bash

# BiteBase API Keys Setup Script
# This script helps you configure all necessary API keys for production

echo "🔑 BiteBase API Keys Configuration Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}📋 Required API Keys for Production:${NC}"
echo ""

# Function to update environment variable
update_env_var() {
    local var_name=$1
    local var_value=$2
    local env_file=".env"
    
    if grep -q "^${var_name}=" "$env_file"; then
        # Variable exists, update it
        sed -i "s/^${var_name}=.*/${var_name}=${var_value}/" "$env_file"
    else
        # Variable doesn't exist, add it
        echo "${var_name}=${var_value}" >> "$env_file"
    fi
}

# Function to prompt for API key
prompt_for_key() {
    local service_name=$1
    local var_name=$2
    local description=$3
    local signup_url=$4
    local is_required=$5
    
    echo -e "${YELLOW}🔧 ${service_name}${NC}"
    echo "   Description: ${description}"
    echo "   Sign up at: ${signup_url}"
    echo "   Variable: ${var_name}"
    
    if [ "$is_required" = "true" ]; then
        echo -e "   ${RED}⚠️  REQUIRED for production${NC}"
    else
        echo -e "   ${BLUE}ℹ️  Optional (recommended)${NC}"
    fi
    
    read -p "   Enter your API key (or press Enter to skip): " api_key
    
    if [ ! -z "$api_key" ]; then
        update_env_var "$var_name" "$api_key"
        echo -e "   ${GREEN}✅ ${var_name} configured${NC}"
    else
        echo -e "   ${YELLOW}⏭️  Skipped${NC}"
    fi
    echo ""
}

# Essential APIs
echo -e "${RED}🚨 ESSENTIAL APIs (Required for core functionality):${NC}"
echo ""

prompt_for_key "Mapbox" "NEXT_PUBLIC_MAPBOX_TOKEN" "Maps and geospatial services" "https://account.mapbox.com/" "true"
prompt_for_key "OpenAI" "OPENAI_API_KEY" "AI-powered insights and analysis" "https://platform.openai.com/api-keys" "true"

# Restaurant Data APIs
echo -e "${BLUE}🍽️  RESTAURANT DATA APIs (Recommended for real data):${NC}"
echo ""

prompt_for_key "Yelp" "YELP_API_KEY" "Restaurant data and reviews" "https://www.yelp.com/developers/v3/manage_app" "false"
prompt_for_key "Foursquare" "FOURSQUARE_API_KEY" "Location and venue data" "https://developer.foursquare.com/" "false"
prompt_for_key "Google Places" "GOOGLE_MAPS_API_KEY" "Google Places and Maps data" "https://console.cloud.google.com/apis/credentials" "false"

# Analytics and Monitoring
echo -e "${GREEN}📊 ANALYTICS & MONITORING (Recommended for production):${NC}"
echo ""

prompt_for_key "Google Analytics" "GOOGLE_ANALYTICS_ID" "Website analytics and tracking" "https://analytics.google.com/" "false"
prompt_for_key "Mixpanel" "MIXPANEL_TOKEN" "Advanced user analytics" "https://mixpanel.com/" "false"
prompt_for_key "Sentry" "SENTRY_DSN" "Error tracking and monitoring" "https://sentry.io/" "false"
prompt_for_key "Hotjar" "HOTJAR_ID" "User behavior analytics" "https://www.hotjar.com/" "false"

# Authentication Services
echo -e "${YELLOW}🔐 AUTHENTICATION (Choose one):${NC}"
echo ""

echo "Choose your authentication provider:"
echo "1) Firebase Authentication (Recommended)"
echo "2) Clerk Authentication"
echo "3) Skip authentication setup"
read -p "Enter your choice (1-3): " auth_choice

case $auth_choice in
    1)
        echo ""
        echo -e "${BLUE}Setting up Firebase Authentication...${NC}"
        prompt_for_key "Firebase API Key" "NEXT_PUBLIC_FIREBASE_API_KEY" "Firebase authentication" "https://console.firebase.google.com/" "false"
        prompt_for_key "Firebase Auth Domain" "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "Firebase auth domain" "https://console.firebase.google.com/" "false"
        prompt_for_key "Firebase Project ID" "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "Firebase project ID" "https://console.firebase.google.com/" "false"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Setting up Clerk Authentication...${NC}"
        prompt_for_key "Clerk Publishable Key" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "Clerk authentication" "https://clerk.com/" "false"
        prompt_for_key "Clerk Secret Key" "CLERK_SECRET_KEY" "Clerk secret key" "https://clerk.com/" "false"
        ;;
    3)
        echo -e "${YELLOW}⏭️  Authentication setup skipped${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        ;;
esac

# Payment Processing
echo ""
echo -e "${GREEN}💳 PAYMENT PROCESSING (For subscription features):${NC}"
echo ""

prompt_for_key "Stripe Publishable Key" "STRIPE_PUBLISHABLE_KEY" "Payment processing" "https://dashboard.stripe.com/apikeys" "false"
prompt_for_key "Stripe Secret Key" "STRIPE_SECRET_KEY" "Payment processing secret" "https://dashboard.stripe.com/apikeys" "false"

# Email Services
echo -e "${BLUE}📧 EMAIL SERVICES (For notifications):${NC}"
echo ""

echo "Choose your email service:"
echo "1) SMTP (Gmail, etc.)"
echo "2) SendGrid"
echo "3) Skip email setup"
read -p "Enter your choice (1-3): " email_choice

case $email_choice in
    1)
        echo ""
        echo -e "${BLUE}Setting up SMTP...${NC}"
        prompt_for_key "SMTP Username" "SMTP_USERNAME" "SMTP email username" "Your email provider" "false"
        prompt_for_key "SMTP Password" "SMTP_PASSWORD" "SMTP email password/app password" "Your email provider" "false"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Setting up SendGrid...${NC}"
        prompt_for_key "SendGrid API Key" "SENDGRID_API_KEY" "SendGrid email service" "https://sendgrid.com/" "false"
        ;;
    3)
        echo -e "${YELLOW}⏭️  Email setup skipped${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        ;;
esac

# Generate secure secrets
echo ""
echo -e "${YELLOW}🔐 Generating secure secrets...${NC}"

# Generate JWT secret
jwt_secret=$(openssl rand -hex 32)
update_env_var "JWT_SECRET" "$jwt_secret"
echo -e "${GREEN}✅ JWT_SECRET generated${NC}"

# Generate encryption key
encryption_key=$(openssl rand -hex 32)
update_env_var "ENCRYPTION_KEY" "$encryption_key"
echo -e "${GREEN}✅ ENCRYPTION_KEY generated${NC}"

# Generate session secret
session_secret=$(openssl rand -hex 32)
update_env_var "SESSION_SECRET" "$session_secret"
echo -e "${GREEN}✅ SESSION_SECRET generated${NC}"

echo ""
echo -e "${GREEN}🎉 API Keys Configuration Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "   • Environment file: .env"
echo "   • Security secrets: Generated automatically"
echo "   • API keys: Configured based on your input"
echo ""
echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
echo "   • Never commit .env file to version control"
echo "   • Use different keys for development and production"
echo "   • Regularly rotate your API keys"
echo "   • Monitor API usage and costs"
echo ""
echo -e "${GREEN}🚀 Next Steps:${NC}"
echo "   1. Test your API keys: npm run test:api"
echo "   2. Start development server: npm run dev"
echo "   3. Deploy to production: npm run deploy"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   • API Setup Guide: ./docs/api-setup.md"
echo "   • Deployment Guide: ./PRODUCTION_IMPROVEMENTS.md"
echo "   • Security Best Practices: ./docs/security.md"
