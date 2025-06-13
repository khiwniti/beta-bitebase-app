const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'MCP API Server is running',
    version: '1.0.0',
    mcp: {
      enabled: true,
      servers: 10,
      tools: 25
    }
  });
});

// MCP Tools registry
app.get('/api/mcp/tools', (req, res) => {
  res.json({
    success: true,
    data: {
      tools: [
        {
          name: 'search_restaurants',
          description: 'Search for restaurants with AI-powered filtering',
          server: 'restaurant',
          available: true
        },
        {
          name: 'get_restaurant_details',
          description: 'Get detailed restaurant information',
          server: 'restaurant',
          available: true
        },
        {
          name: 'chat_with_ai',
          description: 'Chat with AI assistant about restaurants',
          server: 'ai',
          available: true
        },
        {
          name: 'get_personalized_recommendations',
          description: 'Get AI-powered restaurant recommendations',
          server: 'recommendation',
          available: true
        },
        {
          name: 'track_event',
          description: 'Track user events and analytics',
          server: 'analytics',
          available: true
        }
      ],
      servers: {
        restaurant: { connected: true, status: 'healthy' },
        ai: { connected: true, status: 'healthy' },
        analytics: { connected: true, status: 'healthy' },
        payment: { connected: true, status: 'healthy' },
        location: { connected: true, status: 'healthy' },
        notification: { connected: true, status: 'healthy' },
        database: { connected: true, status: 'healthy' },
        file: { connected: true, status: 'healthy' },
        search: { connected: true, status: 'healthy' },
        recommendation: { connected: true, status: 'healthy' }
      },
      meta: {
        totalTools: 25,
        totalServers: 10,
        activeServers: 10,
        timestamp: new Date().toISOString(),
        mcpVersion: '1.0.0'
      }
    }
  });
});

// Restaurant search
app.get('/api/restaurants/search', (req, res) => {
  const { location, cuisine, priceRange, rating, limit = 10 } = req.query;
  
  // Mock restaurant data
  const mockRestaurants = [
    {
      id: '1',
      name: 'Bella Italia',
      cuisine: 'Italian',
      location: location || 'New York',
      rating: 4.5,
      priceRange: '$$',
      description: 'Authentic Italian cuisine with fresh ingredients',
      features: ['outdoor_seating', 'delivery', 'reservations'],
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    },
    {
      id: '2',
      name: 'Sushi Zen',
      cuisine: 'Japanese',
      location: location || 'New York',
      rating: 4.8,
      priceRange: '$$$',
      description: 'Premium sushi and Japanese cuisine',
      features: ['takeout', 'reservations', 'sake_bar'],
      address: {
        street: '456 Park Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10002'
      }
    },
    {
      id: '3',
      name: 'Taco Libre',
      cuisine: 'Mexican',
      location: location || 'New York',
      rating: 4.2,
      priceRange: '$',
      description: 'Fresh Mexican street food and tacos',
      features: ['delivery', 'casual_dining', 'vegetarian_options'],
      address: {
        street: '789 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10003'
      }
    }
  ];

  // Filter by cuisine if specified
  let filteredRestaurants = mockRestaurants;
  if (cuisine) {
    filteredRestaurants = mockRestaurants.filter(r => 
      r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );
  }

  // Limit results
  filteredRestaurants = filteredRestaurants.slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      restaurants: filteredRestaurants,
      recommendations: [
        {
          restaurantId: '1',
          name: 'Bella Italia',
          score: 0.95,
          reason: 'Highly rated Italian restaurant matching your preferences'
        }
      ],
      total: filteredRestaurants.length,
      location: location || 'New York',
      filters: { cuisine, priceRange, rating },
      pagination: {
        page: 1,
        limit: parseInt(limit),
        total: filteredRestaurants.length
      },
      meta: {
        timestamp: new Date().toISOString(),
        via: 'mcp-restaurant-server',
        searchType: 'location_based'
      }
    }
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', (req, res) => {
  const { message, context, userId } = req.body;
  
  res.json({
    success: true,
    data: {
      response: `I understand you're looking for restaurant recommendations! Based on your message "${message}", I can help you find great places to eat. Would you like me to search for specific cuisines or locations?`,
      suggestions: [
        'Find Italian restaurants nearby',
        'Show me highly rated sushi places',
        'What are the best budget-friendly options?'
      ],
      sentiment: {
        sentiment: 'positive',
        confidence: 0.85
      },
      meta: {
        timestamp: new Date().toISOString(),
        via: 'mcp-ai',
        messageId: `msg_${Date.now()}`
      }
    }
  });
});

// Analytics tracking
app.post('/api/analytics/track', (req, res) => {
  const { event, properties, userId } = req.body;
  
  res.json({
    success: true,
    data: {
      eventId: `evt_${Date.now()}`,
      tracked: true,
      event,
      timestamp: new Date().toISOString(),
      meta: {
        via: 'mcp-analytics',
        server: 'analytics'
      }
    }
  });
});

// Location geocoding
app.get('/api/location/geocode', (req, res) => {
  const { address, lat, lng } = req.query;
  
  if (address) {
    // Forward geocoding
    res.json({
      success: true,
      data: {
        address,
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        formatted_address: address,
        components: {
          city: 'New York',
          state: 'NY',
          country: 'USA'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        via: 'mcp-location',
        type: 'forward_geocoding'
      }
    });
  } else if (lat && lng) {
    // Reverse geocoding
    res.json({
      success: true,
      data: {
        coordinates: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        },
        address: '123 Main St, New York, NY 10001',
        components: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        via: 'mcp-location',
        type: 'reverse_geocoding'
      }
    });
  } else {
    res.status(400).json({
      error: 'Either address or lat/lng parameters are required'
    });
  }
});

// Catch all for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found', 
    path: req.path,
    method: req.method,
    available_endpoints: [
      'GET /api/health',
      'GET /api/mcp/tools',
      'GET /api/restaurants/search',
      'POST /api/ai/chat',
      'POST /api/analytics/track',
      'GET /api/location/geocode'
    ]
  });
});

const PORT = 12001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 MCP API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Health Check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`🛠️  MCP Tools: http://0.0.0.0:${PORT}/api/mcp/tools`);
  console.log(`🔍 Restaurant Search: http://0.0.0.0:${PORT}/api/restaurants/search`);
  console.log(`🤖 AI Chat: POST http://0.0.0.0:${PORT}/api/ai/chat`);
  console.log(`📈 Analytics: POST http://0.0.0.0:${PORT}/api/analytics/track`);
  console.log(`📍 Geocoding: http://0.0.0.0:${PORT}/api/location/geocode`);
});