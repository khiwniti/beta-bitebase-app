/**
 * BiteBase Backend API - Enhanced Cloudflare Worker
 * Modern implementation with D1, KV, R2, and Durable Objects
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { rateLimiter } from 'hono/rate-limiter'

// Initialize Hono app
const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: (origin, c) => {
    const allowedOrigins = [
      'https://bitebase.app',
      'https://www.bitebase.app',
      'https://beta.bitebase.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ]
    return allowedOrigins.includes(origin) ? origin : null
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// Rate limiting
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('cf-connecting-ip') || 'anonymous'
}))

// JWT middleware for protected routes
const jwtMiddleware = jwt({
  secret: async (c) => c.env.JWT_SECRET || 'fallback-secret'
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'bitebase-backend-api',
    version: '2.0.0',
    worker: 'cloudflare',
    region: c.req.header('cf-ray')?.split('-')[1] || 'unknown'
  })
})

// Authentication endpoints
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)
    
    // Store user in D1 database
    const userId = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO users (id, email, password_hash, name, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, email, hashedPassword, name, new Date().toISOString()).run()

    // Generate JWT token
    const token = await generateJWT(userId, c.env.JWT_SECRET)

    return c.json({
      success: true,
      user: { id: userId, email, name },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400)
    }

    // Get user from database
    const user = await c.env.DB.prepare(`
      SELECT id, email, password_hash, name FROM users WHERE email = ?
    `).bind(email).first()

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT token
    const token = await generateJWT(user.id, c.env.JWT_SECRET)

    // Store session in KV
    await c.env.SESSIONS.put(`session:${user.id}`, JSON.stringify({
      userId: user.id,
      email: user.email,
      loginTime: new Date().toISOString()
    }), { expirationTtl: 86400 }) // 24 hours

    return c.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Restaurant endpoints
app.get('/api/restaurants', async (c) => {
  try {
    const { latitude, longitude, radius = 5000, cuisine, priceRange } = c.req.query()
    
    if (!latitude || !longitude) {
      return c.json({ error: 'Missing latitude or longitude' }, 400)
    }

    // Check cache first
    const cacheKey = `restaurants:${latitude}:${longitude}:${radius}:${cuisine || 'all'}:${priceRange || 'all'}`
    const cached = await c.env.CACHE.get(cacheKey)
    
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    // Query database with spatial search
    let query = `
      SELECT id, name, cuisine_type, price_range, rating, latitude, longitude,
             address, phone, website, opening_hours,
             (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
              cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
              sin(radians(latitude)))) AS distance
      FROM restaurants
      WHERE (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
             cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
             sin(radians(latitude)))) <= ?
    `
    
    const params = [latitude, longitude, latitude, latitude, longitude, latitude, radius / 1000]
    
    if (cuisine) {
      query += ` AND cuisine_type = ?`
      params.push(cuisine)
    }
    
    if (priceRange) {
      query += ` AND price_range = ?`
      params.push(priceRange)
    }
    
    query += ` ORDER BY distance LIMIT 50`

    const restaurants = await c.env.DB.prepare(query).bind(...params).all()

    // Cache results for 5 minutes
    await c.env.CACHE.put(cacheKey, JSON.stringify(restaurants), { expirationTtl: 300 })

    return c.json(restaurants)
  } catch (error) {
    console.error('Restaurant search error:', error)
    return c.json({ error: 'Search failed' }, 500)
  }
})

app.get('/api/restaurants/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Check cache first
    const cacheKey = `restaurant:${id}`
    const cached = await c.env.CACHE.get(cacheKey)
    
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const restaurant = await c.env.DB.prepare(`
      SELECT * FROM restaurants WHERE id = ?
    `).bind(id).first()

    if (!restaurant) {
      return c.json({ error: 'Restaurant not found' }, 404)
    }

    // Get reviews
    const reviews = await c.env.DB.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.restaurant_id = ? 
      ORDER BY r.created_at DESC 
      LIMIT 10
    `).bind(id).all()

    const result = {
      ...restaurant,
      reviews: reviews.results || []
    }

    // Cache for 10 minutes
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 600 })

    return c.json(result)
  } catch (error) {
    console.error('Restaurant fetch error:', error)
    return c.json({ error: 'Failed to fetch restaurant' }, 500)
  }
})

// Protected routes
app.use('/api/user/*', jwtMiddleware)
app.use('/api/reviews/*', jwtMiddleware)
app.use('/api/favorites/*', jwtMiddleware)

// User profile endpoints
app.get('/api/user/profile', async (c) => {
  try {
    const payload = c.get('jwtPayload')
    const userId = payload.sub

    const user = await c.env.DB.prepare(`
      SELECT id, email, name, created_at, avatar_url 
      FROM users WHERE id = ?
    `).bind(userId).first()

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// Reviews endpoints
app.post('/api/reviews', async (c) => {
  try {
    const payload = c.get('jwtPayload')
    const userId = payload.sub
    const { restaurantId, rating, comment } = await c.req.json()

    if (!restaurantId || !rating) {
      return c.json({ error: 'Missing required fields' }, 400)
    }

    const reviewId = crypto.randomUUID()
    await c.env.DB.prepare(`
      INSERT INTO reviews (id, user_id, restaurant_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(reviewId, userId, restaurantId, rating, comment, new Date().toISOString()).run()

    // Invalidate restaurant cache
    await c.env.CACHE.delete(`restaurant:${restaurantId}`)

    return c.json({ success: true, reviewId })
  } catch (error) {
    console.error('Review creation error:', error)
    return c.json({ error: 'Failed to create review' }, 500)
  }
})

// AI Assistant endpoint
app.post('/api/ai/chat', async (c) => {
  try {
    const { message, context } = await c.req.json()
    
    if (!message) {
      return c.json({ error: 'Message is required' }, 400)
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful restaurant recommendation assistant for BiteBase. Help users find great restaurants based on their preferences.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    const aiResponse = await response.json()
    
    if (!response.ok) {
      throw new Error('OpenAI API error')
    }

    return c.json({
      response: aiResponse.choices[0].message.content,
      usage: aiResponse.usage
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return c.json({ error: 'AI service unavailable' }, 500)
  }
})

// File upload endpoint
app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file')
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    const fileName = `${crypto.randomUUID()}-${file.name}`
    const arrayBuffer = await file.arrayBuffer()
    
    // Upload to R2
    await c.env.STORAGE.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type
      }
    })

    return c.json({
      success: true,
      fileName,
      url: `https://storage.bitebase.app/${fileName}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Upload failed' }, 500)
  }
})

// Analytics endpoint
app.post('/api/analytics/event', async (c) => {
  try {
    const { event, properties } = await c.req.json()
    
    // Write to Analytics Engine
    c.env.ANALYTICS.writeDataPoint({
      blobs: [event, JSON.stringify(properties)],
      doubles: [Date.now()],
      indexes: [c.req.header('cf-connecting-ip') || 'unknown']
    })

    return c.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return c.json({ error: 'Analytics failed' }, 500)
  }
})

// Queue consumer for background tasks
export default {
  fetch: app.fetch,
  
  async queue(batch, env) {
    for (const message of batch.messages) {
      try {
        const { type, data } = message.body
        
        switch (type) {
          case 'send_email':
            await sendEmail(data, env)
            break
          case 'update_restaurant_rating':
            await updateRestaurantRating(data, env)
            break
          case 'generate_recommendations':
            await generateRecommendations(data, env)
            break
          default:
            console.log('Unknown task type:', type)
        }
        
        message.ack()
      } catch (error) {
        console.error('Queue processing error:', error)
        message.retry()
      }
    }
  }
}

// Utility functions
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function verifyPassword(password, hash) {
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

async function generateJWT(userId, secret) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }
  
  const encoder = new TextEncoder()
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '')
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '')
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`)
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, data)
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '')
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

// Background task functions
async function sendEmail(data, env) {
  // Implement email sending logic
  console.log('Sending email:', data)
}

async function updateRestaurantRating(data, env) {
  // Update restaurant average rating
  const { restaurantId } = data
  
  const result = await env.DB.prepare(`
    SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
    FROM reviews WHERE restaurant_id = ?
  `).bind(restaurantId).first()
  
  await env.DB.prepare(`
    UPDATE restaurants 
    SET rating = ?, review_count = ?
    WHERE id = ?
  `).bind(result.avg_rating, result.review_count, restaurantId).run()
}

async function generateRecommendations(data, env) {
  // Generate personalized recommendations
  console.log('Generating recommendations:', data)
}