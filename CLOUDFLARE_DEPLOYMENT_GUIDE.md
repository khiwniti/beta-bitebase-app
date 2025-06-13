# 🌐 BiteBase Cloudflare Deployment Guide

Deploy your BiteBase backend using Cloudflare for global performance and reliability.

## 🚀 Option 1: Cloudflare Tunnel (Recommended)

Keep your FastAPI on EC2 but expose it securely through Cloudflare.

### Step 1: Install Cloudflared on EC2

```bash
# On your EC2 instance
cd /opt/bitebase

# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verify installation
cloudflared --version
```

### Step 2: Login to Cloudflare

```bash
# Login to your Cloudflare account
cloudflared tunnel login
```

This opens a browser. Login to Cloudflare and authorize the tunnel.

### Step 3: Create a Tunnel

```bash
# Create a tunnel
cloudflared tunnel create bitebase-api

# Note the tunnel ID from the output
```

### Step 4: Configure the Tunnel

```bash
# Create config directory
sudo mkdir -p /etc/cloudflared

# Create tunnel configuration (replace YOUR_TUNNEL_ID and yourdomain.com)
sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/ec2-user/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
EOF
```

### Step 5: Create DNS Record

```bash
# Create DNS record (replace with your domain)
cloudflared tunnel route dns bitebase-api api.yourdomain.com
```

### Step 6: Run the Tunnel

```bash
# Test the tunnel
cloudflared tunnel run bitebase-api

# If it works, install as a service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

### ✅ Result: Your API is now available at `https://api.yourdomain.com`

---

## ⚡ Option 2: Cloudflare Workers (Serverless)

Deploy your backend as serverless functions for ultimate scalability.

### Step 1: Install Wrangler CLI

```bash
# Install Node.js and npm (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Step 2: Deploy the Worker

```bash
# Navigate to the workers directory
cd /opt/bitebase/cloudflare-workers

# Install dependencies
npm install

# Deploy to staging
npm run deploy:staging

# Deploy to production (after testing)
npm run deploy:production
```

### Step 3: Configure Custom Domain

1. **Go to Cloudflare Dashboard** → **Workers & Pages**
2. **Select your worker** → **Settings** → **Triggers**
3. **Add Custom Domain**: `api.yourdomain.com`

### ✅ Result: Your API is now available at `https://api.yourdomain.com`

---

## 🔧 Configuration for Frontend

### Update Frontend Environment Variables

For **Vercel deployment**, update your environment variables:

```env
# For Cloudflare Tunnel
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# For Cloudflare Workers
NEXT_PUBLIC_API_URL=https://bitebase-api.your-subdomain.workers.dev
```

### Update API Client

Update `apps/frontend/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }
};
```

---

## 🌍 Benefits of Cloudflare Deployment

### Cloudflare Tunnel Benefits:
- ✅ **No open ports** on EC2 (more secure)
- ✅ **Automatic HTTPS** with Cloudflare SSL
- ✅ **DDoS protection** and security features
- ✅ **Global CDN** for faster response times
- ✅ **Keep existing FastAPI** code unchanged

### Cloudflare Workers Benefits:
- ⚡ **Serverless** - no server management
- 🌍 **Global edge deployment** - ultra-fast responses
- 💰 **Cost-effective** - pay per request
- 🔄 **Auto-scaling** - handles any traffic load
- 🛡️ **Built-in security** and DDoS protection

---

## 📊 API Endpoints Available

Both deployment options provide these endpoints:

```
GET  /                     - API info
GET  /health              - Health check
GET  /docs                - API documentation
GET  /manifest.json       - PWA manifest
GET  /api/restaurants     - List restaurants
GET  /api/restaurants/{id} - Get restaurant details
GET  /api/menu            - Get menu items
POST /api/auth/login      - User login
POST /api/auth/register   - User registration
GET  /privacy             - Privacy policy
GET  /terms               - Terms of service
GET  /reset-password      - Password reset
```

---

## 🔍 Testing Your Deployment

### Test API Endpoints

```bash
# Health check
curl https://api.yourdomain.com/health

# Get restaurants
curl https://api.yourdomain.com/api/restaurants

# Get menu
curl https://api.yourdomain.com/api/menu

# API documentation
curl https://api.yourdomain.com/docs
```

### Test from Frontend

```javascript
// Test API connectivity
fetch('https://api.yourdomain.com/health')
  .then(response => response.json())
  .then(data => console.log('API Health:', data))
  .catch(error => console.error('API Error:', error));
```

---

## 🛠️ Useful Commands

### Cloudflare Tunnel Commands

```bash
# Check tunnel status
cloudflared tunnel list

# View tunnel logs
sudo journalctl -u cloudflared -f

# Restart tunnel service
sudo systemctl restart cloudflared

# Stop tunnel
sudo systemctl stop cloudflared
```

### Cloudflare Workers Commands

```bash
# Local development
npm run dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# View logs
wrangler tail

# List deployments
wrangler deployments list
```

---

## 🔒 Security Considerations

### Cloudflare Tunnel Security:
- ✅ No inbound ports open on EC2
- ✅ Encrypted tunnel connection
- ✅ Cloudflare's security features
- ✅ Access control via Cloudflare

### Cloudflare Workers Security:
- ✅ Serverless - no server to secure
- ✅ Built-in DDoS protection
- ✅ Automatic security updates
- ✅ Edge-level security

---

## 🚀 Recommended Architecture

```
Frontend (Vercel) ←→ Cloudflare ←→ Backend
     ↓                   ↓           ↓
  Global CDN         Edge Network   EC2/Workers
```

This gives you:
- ⚡ **Ultra-fast global performance**
- 🛡️ **Enterprise-level security**
- 💰 **Cost-effective scaling**
- 🔧 **Easy management**

Choose **Cloudflare Tunnel** if you want to keep your FastAPI code unchanged, or **Cloudflare Workers** for maximum performance and scalability! 🌟