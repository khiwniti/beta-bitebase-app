# 🍽️ BiteBase - Restaurant Discovery Platform

A modern restaurant discovery platform built with Next.js, Cloudflare Workers, and AI-powered recommendations.

## 🏗️ Architecture

**BiteBase** uses a modern hybrid deployment strategy:

- **Backend**: Cloudflare Workers (Global edge deployment)
- **Frontend**: Vercel (Optimized Next.js hosting)
- **Database**: Cloudflare D1 (Serverless SQLite)
- **Storage**: Cloudflare R2 (File uploads)
- **Cache**: Cloudflare KV (Session & data caching)

```
┌─────────────────────────────────────────────────────────────┐
│                    BiteBase Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │   Frontend      │         │    Backend      │           │
│  │   (Vercel)      │◄────────┤ (Cloudflare)    │           │
│  │                 │         │                 │           │
│  │ • Next.js       │         │ • Hono API      │           │
│  │ • React UI      │         │ • D1 Database   │           │
│  │ • Maps/Charts   │         │ • KV Storage    │           │
│  │ • AI Chat       │         │ • R2 Files      │           │
│  └─────────────────┘         └─────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/khiwniti/beta-bitebase-app.git
cd beta-bitebase-app

# 2. Run the setup script
./setup-cloudflare.sh

# 3. Set your secrets
cd apps/backend
wrangler secret put JWT_SECRET
wrangler secret put OPENAI_API_KEY
wrangler secret put STRIPE_SECRET_KEY

# 4. Deploy everything
./deploy-cloudflare.sh --production

# 5. Test the deployment
./test-system-integration.sh --production
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+
- Cloudflare account
- Vercel account
- Wrangler CLI: `npm install -g wrangler`
- Vercel CLI: `npm install -g vercel`

#### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/khiwniti/beta-bitebase-app.git
cd beta-bitebase-app

# Backend
cd apps/backend
npm install

# Frontend
cd ../frontend
npm install
cd ../..
```

2. **Setup Cloudflare resources:**
```bash
cd apps/backend

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create bitebase-production

# Create KV namespaces
wrangler kv:namespace create CACHE
wrangler kv:namespace create SESSIONS

# Create R2 bucket
wrangler r2 bucket create bitebase-uploads

# Update wrangler.toml with the generated IDs
```

3. **Configure environment variables:**
```bash
# Backend secrets
wrangler secret put JWT_SECRET
wrangler secret put OPENAI_API_KEY
wrangler secret put STRIPE_SECRET_KEY

# Frontend environment
cd ../frontend
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Deploy:**
```bash
# Deploy backend
cd apps/backend
wrangler deploy --env production

# Deploy frontend
cd ../frontend
vercel login
vercel --prod
```

## 🧪 Testing System Integration

Ensure all components work together properly:

```bash
# Test local development
./test-system-integration.sh --local

# Test production deployment
./test-system-integration.sh --production

# Test specific URLs
./test-system-integration.sh \
  --backend-url https://your-worker.workers.dev \
  --frontend-url https://your-app.vercel.app
```

## 📁 Project Structure

```
beta-bitebase-app/
├── apps/
│   ├── backend/                           # Cloudflare Workers Backend
│   │   ├── cloudflare-worker-enhanced.js  # Main worker file
│   │   ├── wrangler.toml                  # Cloudflare configuration
│   │   ├── database/                      # Database schema
│   │   └── package.json                   # Backend dependencies
│   └── frontend/                          # Vercel Frontend
│       ├── vercel.json                    # Vercel configuration
│       ├── .env.example                   # Environment template
│       └── package.json                   # Frontend dependencies
├── deploy-cloudflare.sh                   # Automated deployment
├── setup-cloudflare.sh                    # Initial setup
├── test-system-integration.sh             # Integration testing
├── CLOUDFLARE_DEPLOYMENT_GUIDE.md         # Detailed guide
└── CLOUDFLARE_DEPLOYMENT_SUMMARY.md       # Quick reference
```

## 🛠️ Tech Stack

### Frontend (Vercel)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **React Hook Form** - Form handling
- **SWR** - Data fetching and caching

### Backend (Cloudflare Workers)
- **Hono** - Fast web framework for Workers
- **D1 Database** - Serverless SQLite
- **KV Storage** - Edge caching and sessions
- **R2 Storage** - File uploads and assets
- **Workers AI** - Built-in AI capabilities

### Services & APIs
- **OpenAI GPT** - AI recommendations and chat
- **Google Maps** - Location and mapping services
- **Stripe** - Payment processing
- **Google OAuth** - Authentication

## 🌟 Features

- 🔍 **Restaurant Discovery** - Location-based search with filters
- 🤖 **AI Assistant** - Personalized recommendations and chat
- 📍 **Maps Integration** - Interactive maps with restaurant locations
- 💳 **Secure Payments** - Stripe integration for reservations
- 👤 **User Profiles** - Preferences and dining history
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🔐 **JWT Authentication** - Secure user sessions
- ⚡ **Edge Performance** - Global CDN and edge computing
- 🔄 **Real-time Updates** - Live data synchronization

## 🚀 Deployment Options

### Production Deployment

```bash
# Full production deployment
./deploy-cloudflare.sh --production

# Backend only
./deploy-cloudflare.sh --backend-only --production

# Frontend only
./deploy-cloudflare.sh --frontend-only --production
```

### Staging Deployment

```bash
# Deploy to staging environment
./deploy-cloudflare.sh

# Test staging deployment
./test-system-integration.sh --backend-url https://staging-worker.workers.dev
```

### Local Development

```bash
# Start backend (Cloudflare Workers)
cd apps/backend
wrangler dev --local

# Start frontend (Next.js)
cd apps/frontend
npm run dev

# Test local integration
./test-system-integration.sh --local
```

## 🔧 Configuration

### Environment Variables

#### Backend (Cloudflare Secrets)
```bash
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
OPENAI_API_KEY=sk-your-openai-api-key
STRIPE_SECRET_KEY=sk_live_or_sk_test_your-stripe-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-worker.workers.dev
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_your-stripe-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## 📖 Documentation

- [**Deployment Guide**](CLOUDFLARE_DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [**Deployment Summary**](CLOUDFLARE_DEPLOYMENT_SUMMARY.md) - Quick reference guide
- [**API Documentation**](apps/backend/README.md) - Backend API reference
- [**Frontend Guide**](apps/frontend/README.md) - Frontend development guide

## 🔧 Troubleshooting

### Common Issues

#### Worker Deployment Fails
```bash
wrangler validate
wrangler deploy --verbose
```

#### Database Connection Issues
```bash
wrangler d1 list
wrangler d1 execute bitebase-production --command="SELECT 1"
```

#### CORS Errors
- Check allowed origins in worker configuration
- Verify frontend URL in environment variables

#### Authentication Issues
- Verify JWT secret: `wrangler secret list`
- Check token format and expiration

### Debug Commands

```bash
# Real-time logs
wrangler tail --format pretty

# Test locally
wrangler dev --local

# Database queries
wrangler d1 execute bitebase-production --command="YOUR_SQL"

# KV operations
wrangler kv:key list --binding CACHE
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test integration: `./test-system-integration.sh --local`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Vercel Documentation](https://vercel.com/docs)
- [Hono Framework](https://hono.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

### Community
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Vercel Discord](https://discord.gg/vercel)

### Contact
- Email: support@bitebase.app
- Issues: [GitHub Issues](https://github.com/khiwniti/beta-bitebase-app/issues)

---

## 🎉 Ready to Deploy!

Your BiteBase application is configured for modern, scalable deployment:

✅ **Global Edge Backend** with Cloudflare Workers  
✅ **Optimized Frontend** with Vercel  
✅ **Serverless Database** with D1  
✅ **Edge Caching** with KV  
✅ **File Storage** with R2  
✅ **Automated Deployment** scripts  
✅ **Integration Testing** tools  

**Quick Deploy:**
```bash
./deploy-cloudflare.sh --production
```

**Test Integration:**
```bash
./test-system-integration.sh --production
```

Happy coding! 🚀☁️