// BiteBase AI Agents - Cloudflare Worker
// This worker handles AI agent requests on Cloudflare Workers

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
        service: 'bitebase-ai-agents',
        version: '1.0.0'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Restaurant research endpoint
    if (path === '/research' && request.method === 'POST') {
      const body = await request.json()
      const { location, cuisine_type, additional_context } = body

      if (!location) {
        return new Response(JSON.stringify({ error: 'Location is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      // Call OpenRouter API for restaurant research
      const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://beta.bitebase.app',
          'X-Title': 'BiteBase Restaurant Intelligence'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a restaurant market research expert. Provide comprehensive analysis including market opportunities, competition, demographics, and recommendations.'
            },
            {
              role: 'user',
              content: `Analyze the restaurant market for ${cuisine_type || 'general dining'} in ${location}. Include market size, competition level, demographic insights, opportunity score (1-10), and specific recommendations.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      })

      const openrouterResult = await openrouterResponse.json()

      if (!openrouterResponse.ok) {
        throw new Error(`OpenRouter API error: ${openrouterResult.error?.message}`)
      }

      const analysis = openrouterResult.choices[0].message.content

      // Structure the response
      const result = {
        location,
        cuisine_type: cuisine_type || 'general',
        analysis,
        opportunity_score: Math.floor(Math.random() * 3) + 7, // 7-9 for demo
        competition_level: 'medium',
        market_size: 'large',
        recommendations: [
          'Focus on unique menu offerings',
          'Consider delivery partnerships',
          'Optimize for local SEO'
        ],
        timestamp: new Date().toISOString()
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Restaurant data endpoint
    if (path === '/api/restaurants' && request.method === 'GET') {
      const { latitude, longitude, radius, platforms } = Object.fromEntries(url.searchParams)

      if (!latitude || !longitude || !radius) {
        return new Response(JSON.stringify({ error: 'Missing required parameters: latitude, longitude, radius' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      // Simulate restaurant data (in production, this would call actual APIs)
      const mockRestaurants = [
        {
          id: 1,
          name: 'The Green Fork',
          latitude: parseFloat(latitude) + (Math.random() - 0.5) * 0.01,
          longitude: parseFloat(longitude) + (Math.random() - 0.5) * 0.01,
          cuisine: 'American',
          rating: 4.5,
          price_range: 'moderate',
          platform: 'google'
        },
        {
          id: 2,
          name: 'Pasta Palace',
          latitude: parseFloat(latitude) + (Math.random() - 0.5) * 0.01,
          longitude: parseFloat(longitude) + (Math.random() - 0.5) * 0.01,
          cuisine: 'Italian',
          rating: 4.2,
          price_range: 'upscale',
          platform: 'yelp'
        },
        {
          id: 3,
          name: 'Sushi Zen',
          latitude: parseFloat(latitude) + (Math.random() - 0.5) * 0.01,
          longitude: parseFloat(longitude) + (Math.random() - 0.5) * 0.01,
          cuisine: 'Japanese',
          rating: 4.7,
          price_range: 'luxury',
          platform: 'google'
        }
      ]

      const result = {
        restaurants: mockRestaurants,
        count: mockRestaurants.length,
        query: { latitude, longitude, radius },
        timestamp: new Date().toISOString()
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Geocoding endpoint using Mapbox
    if (path === '/api/geocode' && request.method === 'GET') {
      const { address } = Object.fromEntries(url.searchParams)

      if (!address) {
        return new Response(JSON.stringify({ error: 'Address parameter is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      // Call Mapbox Geocoding API
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${env.MAPBOX_API_KEY}&limit=1`

      const response = await fetch(geocodeUrl)
      const data = await response.json()

      if (!data.features || data.features.length === 0) {
        return new Response(JSON.stringify({ error: 'Geocoding failed', details: 'No results found' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }

      // Transform Mapbox response to consistent format
      const feature = data.features[0]
      const [longitude, latitude] = feature.center

      // Extract city and country from context
      let city = ''
      let country = ''
      let postal_code = ''

      if (feature.context) {
        for (const ctx of feature.context) {
          if (ctx.id.startsWith('place.')) {
            city = ctx.text
          } else if (ctx.id.startsWith('country.')) {
            country = ctx.text
          } else if (ctx.id.startsWith('postcode.')) {
            postal_code = ctx.text
          }
        }
      }

      const result = {
        address,
        latitude,
        longitude,
        formatted_address: feature.place_name,
        place_id: feature.id,
        city,
        country,
        postal_code,
        source: 'mapbox',
        timestamp: new Date().toISOString()
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // 404 handler
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('AI Worker error:', error)
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
