/**
 * Production Configuration for BiteBase Geospatial SaaS
 * 
 * This file contains production-ready configuration settings
 * that replace placeholder values and mock data with real implementations.
 */

export const PRODUCTION_CONFIG = {
  // Application Settings
  app: {
    name: process.env.APP_NAME || 'BiteBase Intelligence',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    url: process.env.APP_URL || 'https://bitebase.ai',
    supportEmail: 'support@bitebase.ai',
    salesEmail: 'sales@bitebase.ai'
  },

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.bitebase.ai',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Database Configuration
  database: {
    client: process.env.DATABASE_CLIENT || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    name: process.env.DATABASE_NAME || 'bitebase_production',
    username: process.env.DATABASE_USERNAME || 'bitebase_user',
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === 'true',
    pool: {
      min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
      max: parseInt(process.env.DATABASE_POOL_MAX || '10')
    }
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    ttl: 3600 // 1 hour default TTL
  },

  // External API Keys
  apis: {
    mapbox: {
      token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      apiKey: process.env.MAPBOX_API_KEY
    },
    googleMaps: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY
    },
    here: {
      apiKey: process.env.HERE_API_KEY
    },
    yelp: {
      apiKey: process.env.YELP_API_KEY
    },
    foursquare: {
      apiKey: process.env.FOURSQUARE_API_KEY
    },
    tripadvisor: {
      apiKey: process.env.TRIPADVISOR_API_KEY
    },
    zomato: {
      apiKey: process.env.ZOMATO_API_KEY
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY
    },
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY
    },
    googleAI: {
      apiKey: process.env.GOOGLE_AI_API_KEY
    },
    tavily: {
      apiKey: process.env.TAVILY_API_KEY
    },
    serp: {
      apiKey: process.env.SERP_API_KEY
    }
  },

  // Authentication Configuration
  auth: {
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    },
    clerk: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    }
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@bitebase.ai'
    }
  },

  // File Storage Configuration
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_BUCKET || 'bitebase-uploads-production'
    },
    cloudflareR2: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      bucket: process.env.CLOUDFLARE_R2_BUCKET || 'bitebase-uploads',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT
    }
  },

  // Analytics Configuration
  analytics: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTICS_ID
    },
    mixpanel: {
      token: process.env.MIXPANEL_TOKEN
    },
    sentry: {
      dsn: process.env.SENTRY_DSN
    },
    hotjar: {
      id: process.env.HOTJAR_ID
    }
  },

  // Payment Configuration
  payments: {
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    }
  },

  // Social Media APIs
  social: {
    twitter: {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET
    },
    instagram: {
      apiKey: process.env.INSTAGRAM_API_KEY
    },
    facebook: {
      apiKey: process.env.FACEBOOK_API_KEY
    }
  },

  // Security Configuration
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    sessionSecret: process.env.SESSION_SECRET,
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  },

  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    notifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    betaFeatures: process.env.ENABLE_BETA_FEATURES === 'true',
    debugMode: process.env.ENABLE_DEBUG_MODE === 'true'
  },

  // Deployment Configuration
  deployment: {
    environment: process.env.DEPLOYMENT_ENV || 'production',
    healthCheckEndpoint: process.env.HEALTH_CHECK_ENDPOINT || '/health',
    metricsEndpoint: process.env.METRICS_ENDPOINT || '/metrics'
  }
}

// Validation function to ensure required environment variables are set
export function validateConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_MAPBOX_TOKEN',
    'DATABASE_PASSWORD',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'SESSION_SECRET'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  return {
    isValid: missingVars.length === 0,
    missingVars
  }
}

// Export individual configurations for easier imports
export const { app, api, database, redis, apis, auth, email, storage, analytics, payments, social, security, rateLimit, logging, features, deployment } = PRODUCTION_CONFIG

export default PRODUCTION_CONFIG
