# BiteBase - Geospatial Restaurant SaaS Platform

A modern, full-stack SaaS platform for restaurant discovery and management with advanced geospatial capabilities.

## 🚀 Features

- **Geospatial Restaurant Discovery**: Advanced location-based search and mapping
- **Real-time Analytics**: Comprehensive dashboard with business insights
- **Multi-tenant SaaS**: Secure user management and subscription handling
- **AI-Powered Recommendations**: Smart restaurant suggestions
- **Mobile-First Design**: Responsive UI optimized for all devices
- **Stripe Integration**: Secure payment processing
- **Firebase Authentication**: Robust user authentication system

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Query for server state
- **Maps**: Leaflet with React Leaflet
- **Charts**: Recharts for analytics visualization
- **Authentication**: Firebase Auth integration

### Backend (Vercel Serverless + FastAPI)
- **API**: Vercel serverless functions for core services
- **Alternative**: FastAPI (Python) for complex operations
- **Database**: PostgreSQL with geospatial extensions
- **Payments**: Stripe for subscription billing
- **Authentication**: Firebase Auth integration

## 📁 Project Structure

```
beta-bitebase-app/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   ├── api/              # FastAPI backend services  
│   └── backend/          # Node.js production backend
├── api/                  # Vercel serverless functions
├── database/            # Database schemas and migrations
└── turbo.json          # Turborepo configuration
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.9+ (for FastAPI backend)
- PostgreSQL 14+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/khiwniti/beta-bitebase-app.git
   cd beta-bitebase-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment files
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

4. **Start development servers**
   ```bash
   # Start all services with Turborepo
   npm run dev

   # Or start individual services
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:api      # API on http://localhost:8000
   npm run dev:backend  # Backend on http://localhost:5000
   ```

## 🚀 Deployment

### Vercel (Recommended)
The application is configured for Vercel deployment with:
- Frontend: Next.js app in `apps/frontend/`
- Backend: Serverless functions in `api/`

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### API (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-xxx
```

## 📊 Core Features

### Restaurant Management
- Geospatial search with radius filtering
- Category and cuisine type filtering
- Interactive map with restaurant markers
- Real-time analytics dashboard

### User Management
- Firebase authentication integration
- Role-based access control (Admin/User)
- Subscription management with Stripe
- Mobile-responsive tour system

### Analytics & Insights
- Real-time visitor analytics
- Geographic distribution insights
- User engagement tracking
- Revenue and subscription metrics

## 🔧 API Endpoints

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/restaurants/search` - Geospatial restaurant search
- `GET /api/analytics/dashboard` - Dashboard metrics
- `POST /api/analytics/track` - Track user events

## 🎨 Recent Updates

### Font Size Optimization
- Systematic font size reduction (text-lg → text-base, etc.)
- Improved visual hierarchy and readability
- Mobile-first responsive design

### Mobile Tour Responsiveness
- Bottom-positioned tour cards on mobile
- Touch-friendly interface with larger buttons
- Dynamic sizing based on screen size
- Improved accessibility and UX

### Enhanced Middleware
- Comprehensive security headers
- CORS configuration for API endpoints
- Role-based route protection
- Improved authentication flow

## 🧪 Testing

```bash
# Build all packages
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run check-types
```

## 🔒 Security

- **Authentication**: Firebase Auth with JWT tokens
- **Authorization**: Role-based access control
- **Security Headers**: Comprehensive security headers via middleware
- **CORS**: Properly configured cross-origin requests
- **Rate Limiting**: API protection and abuse prevention

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach
- **Touch Targets**: Minimum 44px touch targets
- **Tour System**: Mobile-optimized guided tours
- **Performance**: Optimized for mobile networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/khiwniti/beta-bitebase-app/issues)
- **Email**: support@bitebase.app

---

Built with ❤️ using Next.js, Vercel, and modern web technologies