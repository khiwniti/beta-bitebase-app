# BiteBase Intelligence - Frontend

Next.js 15.3.4 application for the BiteBase Intelligence platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_FOURSQUARE_CLIENT_ID=...
NEXT_PUBLIC_FOURSQUARE_API_KEY=...
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=...
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...
```

## 📦 Deployment

This app is configured for Vercel deployment. See `DEPLOYMENT.md` for detailed instructions.

## 🔧 Tech Stack

- Next.js 15.3.4
- React 18
- Tailwind CSS
- Radix UI
- TypeScript
- Stripe
- Mapbox/Leaflet
