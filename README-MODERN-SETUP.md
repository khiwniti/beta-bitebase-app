# BiteBase Modern Setup Guide

## Overview

BiteBase has been updated with a modern Vercel-inspired design while maintaining the original BiteBase colors and fonts. The application now features:

- ✨ Modern Vercel-inspired UI design
- 🎨 Clean, minimalist interface with improved typography
- 🚀 Enhanced user experience with smooth animations
- 🔧 Simplified Docker development setup
- 📱 Responsive design optimized for all devices

## Quick Start

### Development Mode (Recommended)

1. **Start Frontend and Backend Separately:**
   ```bash
   # Terminal 1 - Frontend (Port 12000)
   cd apps/frontend
   npm install
   npm run dev

   # Terminal 2 - Backend (Port 12001)
   cd apps/backend
   npm install
   npm run dev
   ```

2. **Access the Application:**
   - Frontend: http://localhost:12000
   - Backend API: http://localhost:12001
   - Health Check: http://localhost:12001/health

### Docker Development Setup

1. **Using Docker Compose (Development):**
   ```bash
   # Start all services
   docker-compose -f docker-compose.dev.yml up --build

   # Stop all services
   docker-compose -f docker-compose.dev.yml down
   ```

2. **Using Docker Compose (Production):**
   ```bash
   # Start production services
   docker-compose -f docker-compose.backend.yml up --build

   # Stop production services
   docker-compose -f docker-compose.backend.yml down
   ```

## Design Updates

### Modern Vercel-Inspired Theme

The application now features a modern design inspired by Vercel's changelog and landing pages:

- **Typography**: Large, bold headings with improved hierarchy
- **Colors**: Maintained BiteBase primary colors with modern gray palette
- **Components**: Clean cards with subtle shadows and rounded corners
- **Animations**: Smooth transitions and hover effects
- **Layout**: Improved spacing and visual hierarchy

### Key Design Features

1. **Landing Page**:
   - Hero section with gradient text and animated badge
   - Modern feature cards with hover effects
   - Clean CTA section with elevated white card
   - Improved stats display with hover interactions

2. **Changelog Page**:
   - Large, centered header with status badge
   - Modern search and filter interface
   - Clean entry cards with proper spacing
   - Twitter follow CTA with icon

3. **Navigation**:
   - Clean, minimal navigation bar
   - Improved hover states and transitions
   - Better mobile responsiveness

## Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for smooth interactions
- **TypeScript**: Full type safety throughout

### Backend (Node.js/Express)
- **Framework**: Express.js with modern middleware
- **Development**: Simple server for development (server-simple.js)
- **Production**: Full-featured server with all integrations (server-production.js)
- **Security**: Helmet, CORS, rate limiting, and sanitization
- **APIs**: RESTful API design with proper error handling

### Database & Infrastructure
- **Database**: PostgreSQL with PostGIS extensions
- **Cache**: Redis for session and data caching
- **Monitoring**: Built-in health checks and logging
- **Deployment**: Docker-ready with multi-stage builds

## Development Workflow

### Frontend Development
```bash
cd apps/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd apps/backend
npm run dev          # Start with nodemon (simple server)
npm run simple       # Start simple server
npm run start        # Start production server
```

### Environment Variables

Create `.env.local` files in respective directories:

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:12001
NEXT_PUBLIC_SITE_URL=http://localhost:12000
```

**Backend (.env):**
```env
NODE_ENV=development
PORT=12001
DATABASE_URL=postgresql://postgres:password@localhost:5432/bitebase_dev
REDIS_URL=redis://localhost:6379/0
```

## Production Deployment

### Using Docker

1. **Build and Deploy:**
   ```bash
   # Build production images
   docker-compose -f docker-compose.backend.yml build

   # Deploy to production
   docker-compose -f docker-compose.backend.yml up -d
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Configure all required environment variables
   - Set up SSL certificates for HTTPS

### Manual Deployment

1. **Frontend (Vercel/Netlify):**
   ```bash
   cd apps/frontend
   npm run build
   # Deploy dist folder to your hosting provider
   ```

2. **Backend (Any Node.js hosting):**
   ```bash
   cd apps/backend
   npm install --production
   npm start
   ```

## API Documentation

### Health Check
```
GET /health
Response: { "status": "healthy", "service": "bitebase-backend", "timestamp": "..." }
```

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Restaurants
```
GET /api/restaurants
POST /api/restaurants
GET /api/restaurants/:id
PUT /api/restaurants/:id
DELETE /api/restaurants/:id
```

### Users
```
GET /api/users/profile
PUT /api/users/profile
```

## Troubleshooting

### Common Issues

1. **Port Conflicts:**
   - Frontend default: 12000
   - Backend default: 12001
   - Change ports in package.json or environment variables

2. **Database Connection:**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL environment variable
   - Run database migrations if needed

3. **CORS Issues:**
   - Backend CORS is configured for localhost:12000
   - Update CORS settings for production domains

4. **Build Errors:**
   - Clear node_modules and reinstall dependencies
   - Check for TypeScript errors
   - Ensure all required environment variables are set

### Getting Help

- Check the console for detailed error messages
- Review the logs in development mode
- Ensure all dependencies are properly installed
- Verify environment variables are correctly set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details