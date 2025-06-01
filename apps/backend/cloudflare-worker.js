// BiteBase Backend API - Cloudflare Worker
// This worker handles the Express.js API on Cloudflare Workers

// Simple CORS handler
function handleCORS(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  return corsHeaders
}

// Main request handler
async function handleRequest(request, env) {
  const corsHeaders = handleCORS(request)
  if (request.method === 'OPTIONS') {
    return corsHeaders
  }

  const url = new URL(request.url)
  const path = url.pathname

  try {
    // Health check endpoint
    if (path === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'bitebase-backend-api',
        version: '1.0.0'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Restaurant endpoints
    if (path === '/api/restaurants' && request.method === 'GET') {
      const { latitude, longitude, radius } = Object.fromEntries(url.searchParams)

      if (!latitude || !longitude || !radius) {
        return new Response(JSON.stringify({ error: 'Missing required parameters: latitude, longitude, radius' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      try {
        // Query D1 database
        const db = env.DB
        const stmt = db.prepare(`
          SELECT * FROM restaurants
          WHERE latitude BETWEEN ? AND ?
          AND longitude BETWEEN ? AND ?
          LIMIT 50
        `)

        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        const rad = parseFloat(radius) * 0.01

        const results = await stmt.bind(
          lat - rad, lat + rad,
          lng - rad, lng + rad
        ).all()

        return new Response(JSON.stringify({
          restaurants: results.results || [],
          count: results.results?.length || 0,
          query: { latitude: lat, longitude: lng, radius }
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('Restaurant query error:', error)
        return new Response(JSON.stringify({ error: 'Database query failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    if (path === '/api/restaurants' && request.method === 'POST') {
      const body = await request.json()
      const { name, latitude, longitude, cuisine, priceRange, rating } = body

      if (!name || !latitude || !longitude) {
        return new Response(JSON.stringify({ error: 'Missing required fields: name, latitude, longitude' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      try {
        const db = env.DB
        const stmt = db.prepare(`
          INSERT INTO restaurants (name, latitude, longitude, cuisine, price_range, rating, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)

        const result = await stmt.bind(
          name, latitude, longitude, cuisine, priceRange, rating, new Date().toISOString()
        ).run()

        return new Response(JSON.stringify({
          id: result.meta.last_row_id,
          message: 'Restaurant created successfully'
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('Restaurant creation error:', error)
        return new Response(JSON.stringify({ error: 'Database insert failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    // Market analysis endpoints
    if (path === '/api/market-analyses' && request.method === 'GET') {
      try {
        const db = env.DB
        const stmt = db.prepare('SELECT * FROM market_analyses ORDER BY created_at DESC LIMIT 20')
        const results = await stmt.all()

        return new Response(JSON.stringify({
          analyses: results.results || [],
          count: results.results?.length || 0
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('Market analysis query error:', error)
        return new Response(JSON.stringify({ error: 'Database query failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    if (path === '/api/market-analyses' && request.method === 'POST') {
      const body = await request.json()
      const { location, analysisType, results, opportunityScore } = body

      try {
        const db = env.DB
        const stmt = db.prepare(`
          INSERT INTO market_analyses (location, analysis_type, results, opportunity_score, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `)

        const result = await stmt.bind(
          location, analysisType, JSON.stringify(results), opportunityScore, 'completed', new Date().toISOString()
        ).run()

        return new Response(JSON.stringify({
          id: result.meta.last_row_id,
          message: 'Market analysis created successfully'
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('Market analysis creation error:', error)
        return new Response(JSON.stringify({ error: 'Database insert failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    // AI integration endpoints
    if (path === '/api/ai/research' && request.method === 'POST') {
      try {
        const body = await request.json()

        // Call AI Agents worker directly via HTTP
        const aiResponse = await fetch('https://ai.bitebase.app/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        const result = await aiResponse.json()
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('AI research error:', error)
        return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    if (path === '/api/ai/restaurants' && request.method === 'GET') {
      try {
        const query = Object.fromEntries(url.searchParams)
        const aiUrl = new URL('/api/restaurants', 'https://ai.bitebase.app')
        Object.entries(query).forEach(([key, value]) => {
          aiUrl.searchParams.append(key, value)
        })

        const aiResponse = await fetch(aiUrl.toString())
        const result = await aiResponse.json()
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('AI restaurant data error:', error)
        return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    // User management endpoints
    if (path === '/api/users' && request.method === 'POST') {
      try {
        const body = await request.json()
        const { uid, email, displayName, accountType } = body

        const db = env.DB
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO users (uid, email, display_name, account_type, created_at)
          VALUES (?, ?, ?, ?, ?)
        `)

        await stmt.bind(uid, email, displayName, accountType, new Date().toISOString()).run()

        return new Response(JSON.stringify({ message: 'User created/updated successfully' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('User creation error:', error)
        return new Response(JSON.stringify({ error: 'Database operation failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    if (path.startsWith('/api/users/') && request.method === 'GET') {
      try {
        const uid = path.split('/api/users/')[1]
        const db = env.DB
        const stmt = db.prepare('SELECT * FROM users WHERE uid = ?')
        const result = await stmt.bind(uid).first()

        if (!result) {
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          })
        }

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      } catch (error) {
        console.error('User query error:', error)
        return new Response(JSON.stringify({ error: 'Database query failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
    }

    // 404 handler
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('Worker error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
}

// Export the worker
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env)
  }
}
