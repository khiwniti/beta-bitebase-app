# BiteBase - Restaurant Intelligence Platform

A comprehensive geospatial SaaS platform for restaurant market analysis and business intelligence.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/khiwniti/beta-bitebase.git
   cd beta-bitebase
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd apps/frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.production .env.local
   # Update with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd apps/frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **UI**: Tailwind CSS + Radix UI components
- **State Management**: React Query
- **Maps**: Leaflet with React Leaflet
- **Charts**: Chart.js + Recharts

### Backend (Node.js)
- **Framework**: Express.js
- **API**: RESTful endpoints
- **CORS**: Configured for cross-origin requests
- **Data**: Mock data with extensible structure

## 📦 Deployment

### Option 1: Using Docker
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.production.yml up --build
```

### Option 2: Manual Deployment
```bash
# Run the deployment script
./deploy.sh

# Deploy the generated dist/ folder to your hosting platform
```

### Option 3: Platform-Specific

#### Vercel (Frontend)
```bash
cd apps/frontend
vercel --prod
```

#### Railway/Heroku (Backend)
```bash
cd apps/backend
# Follow platform-specific deployment instructions
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-token
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## 📊 Features

- **Market Analysis**: Interactive maps and market metrics
- **Restaurant Explorer**: Browse and analyze restaurant data
- **AI Insights**: Market opportunities and recommendations
- **Dashboard**: Comprehensive business intelligence
- **Multi-language**: English and Thai support

## 🛠️ Development

### Project Structure
```
beta-bitebase/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Express.js API
├── database/              # Database schemas
├── agent/                 # AI agent services
└── deploy.sh             # Deployment script
```

### API Endpoints
- `GET /health` - Health check
- `GET /api/restaurants` - Restaurant data
- `GET /api/market-analyses` - Market analysis data

### Adding New Features
1. Backend: Add routes in `apps/backend/minimal-server.js`
2. Frontend: Create components in `apps/frontend/components/`
3. API: Update client in `apps/frontend/lib/api-client.ts`

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API URL

2. **Build Failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run check-types`

3. **Port Conflicts**
   - Frontend: Change PORT in package.json
   - Backend: Update PORT environment variable

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.