/**
 * Production-Grade Security Middleware for BiteBase
 * Implements enterprise-level security measures
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const validator = require('validator');
const xss = require('xss');
const hpp = require('hpp');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiting configurations
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests from this IP',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // General API rate limiting
  general: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests per window
    'Too many requests from this IP, please try again later'
  ),

  // Strict rate limiting for auth endpoints
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // 5 attempts per window
    'Too many authentication attempts, please try again later'
  ),

  // AI endpoints rate limiting
  ai: createRateLimiter(
    60 * 1000, // 1 minute
    10, // 10 AI requests per minute
    'AI request limit exceeded, please wait before making more requests'
  ),

  // Premium user rate limiting
  premium: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    1000, // 1000 requests per window for premium users
    'Premium rate limit exceeded'
  )
};

// Input validation middleware
const validateInput = (req, res, next) => {
  try {
    // Sanitize all string inputs
    const sanitizeObject = (obj) => {
      if (typeof obj === 'string') {
        return xss(validator.escape(obj));
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
      }
      return obj;
    };

    // Sanitize request body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid input',
      message: 'Request contains invalid or malicious content'
    });
  }
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-eval'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.openai.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'https://app.bitebase.app',
      'https://admin.bitebase.app',
      'https://api.bitebase.app'
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining']
};

// API key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key required',
      message: 'Please provide a valid API key in the X-API-Key header'
    });
  }

  // Validate API key format and existence
  if (!validator.isUUID(apiKey)) {
    return res.status(401).json({
      error: 'Invalid API key format',
      message: 'API key must be a valid UUID'
    });
  }

  // TODO: Validate against database
  // For now, we'll just check if it's provided
  req.apiKey = apiKey;
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    console.log(JSON.stringify(logData));
  });
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: isDevelopment ? err.message : 'Invalid input provided'
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'File size exceeds the maximum allowed limit'
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong'
  });
};

// Apply rate limiting based on user subscription
const dynamicRateLimit = (req, res, next) => {
  const user = req.user;
  
  if (user && user.subscription === 'premium') {
    return rateLimiters.premium(req, res, next);
  }
  
  return rateLimiters.general(req, res, next);
};

module.exports = {
  rateLimiters,
  validateInput,
  securityHeaders,
  corsOptions,
  validateApiKey,
  requestLogger,
  errorHandler,
  dynamicRateLimit,
  compression: compression(),
  mongoSanitize: mongoSanitize(),
  hpp: hpp()
};
