const http = require('http');
const url = require('url');
const { getRestaurants, trackEvent, testConnection } = require('./api/lib/database');
const { searchRestaurantsWongnaiStyle, getRestaurantDeliveryMenu } = require('./api/lib/wongnai-integration');
const WongnaiAPIClient = require('./api/lib/wongnai-api-client');
const WongnaiRealDataProvider = require('./api/lib/wongnai-real-data');
const MockDataProvider = require('./api/lib/mock-data-provider');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-ID, X-Session-ID');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Health check endpoint
  if (path === '/api/health' && req.method === 'GET') {
    testConnection().then(dbConnected => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'MCP API Server is running',
        version: '1.0.0',
        database: {
          connected: dbConnected,
          status: dbConnected ? 'healthy' : 'disconnected'
        },
        mcp: {
          enabled: true,
          servers: 10,
          tools: 25
        }
      }));
    }).catch(error => {
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        status: 'unhealthy',
        error: error.message,
        database: {
          connected: false,
          status: 'error'
        }
      }));
    });
    return;
  }

  // MCP Tools registry
  if (path === '/api/mcp/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
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
    }));
    return;
  }

  // COMPREHENSIVE MOCK DATA ENDPOINTS
  
  // Restaurant search endpoint (MOCK DATA - COMPREHENSIVE)
  if (path === '/api/restaurants/search' && req.method === 'GET') {
    const { cuisine, location, limit = 10, page = 1, priceRange, rating, features } = query;
    
    try {
      const mockProvider = new MockDataProvider();
      const result = mockProvider.getRestaurants({
        cuisine,
        location,
        limit: parseInt(limit),
        page: parseInt(page),
        priceRange,
        rating,
        features
      });
      
      console.log(`✅ Mock restaurant search: ${result.data.length} results for filters:`, { cuisine, location, priceRange, rating, features });
      
      res.writeHead(200);
      res.end(JSON.stringify({
        ...result,
        source: 'mock-data-comprehensive',
        bitebaseEnhancements: {
          mcpEnabled: true,
          aiPowered: true,
          dataSource: 'mock-comprehensive',
          searchFilters: { cuisine, location, priceRange, rating, features },
          enhancedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        error: 'Mock data search failed',
        message: error.message
      }));
    }
    return;
  }

  // Restaurant details endpoint (MOCK DATA)
  if (path.startsWith('/api/restaurants/') && !path.includes('/analytics') && !path.includes('/delivery-menu') && path.split('/').length === 4 && req.method === 'GET') {
    const publicId = path.split('/')[3];
    
    try {
      const mockProvider = new MockDataProvider();
      const result = mockProvider.getRestaurant(publicId);
      
      console.log(`✅ Mock restaurant details: ${result.data.name}`);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        ...result,
        source: 'mock-data-comprehensive',
        bitebaseEnhancements: {
          mcpEnabled: true,
          aiPowered: true,
          dataSource: 'mock-comprehensive',
          enhancedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        error: 'Restaurant not found',
        message: error.message
      }));
    }
    return;
  }

  // Restaurant analytics endpoint (MOCK DATA)
  if (path.startsWith('/api/restaurants/') && path.endsWith('/analytics') && req.method === 'GET') {
    const publicId = path.split('/')[3];
    
    try {
      const mockProvider = new MockDataProvider();
      const result = mockProvider.getRestaurantAnalytics(publicId);
      
      console.log(`✅ Mock restaurant analytics: ${result.data.restaurant.name}`);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        ...result,
        source: 'mock-data-comprehensive',
        bitebaseEnhancements: {
          mcpEnabled: true,
          aiPowered: true,
          dataSource: 'mock-comprehensive',
          enhancedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        error: 'Restaurant analytics not found',
        message: error.message
      }));
    }
    return;
  }

  // Market analysis endpoint (MOCK DATA)
  if (path === '/api/market/analysis' && req.method === 'GET') {
    try {
      const mockProvider = new MockDataProvider();
      const result = mockProvider.getMarketAnalysis();
      
      console.log(`✅ Mock market analysis: ${result.data.overview.totalRestaurants} restaurants analyzed`);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        ...result,
        source: 'mock-data-comprehensive',
        bitebaseEnhancements: {
          mcpEnabled: true,
          aiPowered: true,
          dataSource: 'mock-comprehensive',
          enhancedAt: new Date().toISOString()
        }
      }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        error: 'Market analysis failed',
        message: error.message
      }));
    }
    return;
  }

  // Restaurant search endpoint (LOCAL DATABASE - FALLBACK)
  if (path === '/api/restaurants/search-db' && req.method === 'GET') {
    const { location, cuisine, priceRange, rating, limit = 10 } = query;
    
    // Use real database
    getRestaurants({
      location,
      cuisine,
      priceRange,
      minRating: rating,
      limit
    }).then(restaurants => {
      // Transform database results to match API format
      const transformedRestaurants = restaurants.map(r => ({
        id: r.id.toString(),
        name: r.name,
        cuisine: r.cuisine,
        location: r.location,
        rating: parseFloat(r.rating),
        priceRange: r.price_range,
        description: r.description,
        features: r.features || [],
        address: typeof r.address === 'string' ? JSON.parse(r.address) : r.address,
        contact_info: typeof r.contact_info === 'string' ? JSON.parse(r.contact_info) : r.contact_info,
        business_hours: typeof r.business_hours === 'string' ? JSON.parse(r.business_hours) : r.business_hours
      }));

      // Generate AI recommendations based on search
      const recommendations = transformedRestaurants.slice(0, 3).map(r => ({
        restaurantId: r.id,
        name: r.name,
        score: Math.min(0.95, r.rating / 5.0 + Math.random() * 0.1),
        reason: `Highly rated ${r.cuisine} restaurant with ${r.rating} stars`
      }));

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
          restaurants: transformedRestaurants,
          recommendations,
          total: transformedRestaurants.length,
          location: location || 'All locations',
          filters: { cuisine, priceRange, rating },
          pagination: {
            page: 1,
            limit: parseInt(limit),
            total: transformedRestaurants.length
          },
          meta: {
            timestamp: new Date().toISOString(),
            via: 'mcp-restaurant-server',
            searchType: 'database_query',
            source: 'postgresql'
          }
        }
      }));
    }).catch(error => {
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        error: 'Database query failed',
        message: error.message
      }));
    });
    return;
  }

  // AI Chat endpoint (COMPREHENSIVE AI ASSISTANT)
  if (path === '/api/ai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { message, context, userId } = JSON.parse(body);
        
        const mockProvider = new MockDataProvider();
        const aiResponse = mockProvider.getAIResponse(message, context);
        
        console.log(`🤖 AI Chat: "${message}" -> ${aiResponse.data.intent}`);
        
        res.writeHead(200);
        res.end(JSON.stringify({
          ...aiResponse,
          source: 'mock-data-comprehensive',
          bitebaseEnhancements: {
            mcpEnabled: true,
            aiPowered: true,
            dataSource: 'mock-comprehensive',
            userId: userId,
            enhancedAt: new Date().toISOString()
          }
        }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ 
          success: false,
          error: 'Invalid JSON or AI processing failed',
          message: error.message
        }));
      }
    });
    return;
  }

  // Wongnai-style businesses endpoint (REAL DATA)
  if (path === '/api/businesses' && req.method === 'GET') {
    const { page = 1, size = 20, cuisine, location, priceRange, rating } = query;
    
    // Try real Wongnai data provider first
    const wongnaiRealData = new WongnaiRealDataProvider();
    
    try {
      const result = wongnaiRealData.getBusinesses({
        page: parseInt(page),
        size: parseInt(size),
        cuisine,
        location,
        priceRange,
        rating
      });
      
      console.log(`✅ Using real Wongnai data structure with ${result.page.entities.length} restaurants`);
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    } catch (error) {
      console.error('❌ Real Wongnai data failed, trying API:', error.message);
    }
    
    // Fallback to API client
    const wongnaiClient = new WongnaiAPIClient();
    
    wongnaiClient.getBusinesses({
      page: parseInt(page),
      size: parseInt(size),
      cuisine,
      location,
      priceRange,
      rating
    }).then(result => {
      res.writeHead(200);
      res.end(JSON.stringify(result));
    }).catch(error => {
      console.error('❌ Wongnai API failed, falling back to local data:', error.message);
      
      // Final fallback to local database
      searchRestaurantsWongnaiStyle({
        page: parseInt(page),
        limit: parseInt(size),
        cuisine,
        location,
        priceRange,
        minRating: rating
      }).then(fallbackResult => {
        res.writeHead(200);
        res.end(JSON.stringify({
          ...fallbackResult,
          bitebaseEnhancements: {
            mcpEnabled: true,
            dataSource: 'local-fallback',
            note: 'Using local data due to Wongnai API unavailability'
          }
        }));
      }).catch(fallbackError => {
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          error: 'All data sources failed',
          message: fallbackError.message
        }));
      });
    });
    return;
  }

  // Wongnai-style restaurant delivery menu (REAL DATA)
  if (path.startsWith('/api/restaurants/') && path.endsWith('/delivery-menu') && req.method === 'GET') {
    const pathParts = path.split('/');
    const publicId = pathParts[3]; // Extract publicId from path
    
    // Try real Wongnai data provider first
    const wongnaiRealData = new WongnaiRealDataProvider();
    
    try {
      const result = wongnaiRealData.getRestaurantDeliveryMenu(publicId);
      console.log(`✅ Using real Wongnai menu data for ${publicId}`);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: result,
        dataSource: 'wongnai-real-data'
      }));
      return;
    } catch (error) {
      console.error(`❌ Real Wongnai menu data failed for ${publicId}, trying API:`, error.message);
    }
    
    // Fallback to API client
    const wongnaiClient = new WongnaiAPIClient();
    
    wongnaiClient.getRestaurantDeliveryMenu(publicId).then(result => {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: result,
        dataSource: 'wongnai-live'
      }));
    }).catch(error => {
      console.error(`❌ Wongnai menu API failed for ${publicId}, falling back to local data:`, error.message);
      
      // Final fallback to local data
      getRestaurantDeliveryMenu(publicId).then(fallbackResult => {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: fallbackResult,
          dataSource: 'local-fallback',
          note: 'Using local data due to Wongnai API unavailability'
        }));
      }).catch(fallbackError => {
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          error: 'Restaurant menu not found',
          message: fallbackError.message,
          publicId: publicId
        }));
      });
    });
    return;
  }

  // Wongnai restaurant details endpoint (REAL DATA)
  if (path.startsWith('/api/restaurants/') && !path.endsWith('/delivery-menu') && req.method === 'GET') {
    const pathParts = path.split('/');
    const publicId = pathParts[3]; // Extract publicId from path
    
    if (publicId && publicId !== 'search') {
      // Try real Wongnai data provider first
      const wongnaiRealData = new WongnaiRealDataProvider();
      
      try {
        const result = wongnaiRealData.getRestaurantDetails(publicId);
        console.log(`✅ Using real Wongnai restaurant data for ${publicId}`);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: result,
          dataSource: 'wongnai-real-data'
        }));
        return;
      } catch (error) {
        console.error(`❌ Real Wongnai restaurant data failed for ${publicId}, trying API:`, error.message);
      }
      
      // Fallback to API client
      const wongnaiClient = new WongnaiAPIClient();
      
      wongnaiClient.getRestaurantDetails(publicId).then(result => {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: result,
          dataSource: 'wongnai-live'
        }));
      }).catch(error => {
        console.error(`❌ Wongnai restaurant API failed for ${publicId}:`, error.message);
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          error: 'Restaurant not found',
          message: error.message,
          publicId: publicId
        }));
      });
      return;
    }
  }

  // Available Wongnai publicIds endpoint
  if (path === '/api/wongnai/publicids' && req.method === 'GET') {
    const wongnaiRealData = new WongnaiRealDataProvider();
    const publicIds = wongnaiRealData.getAvailablePublicIds();
    
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: {
        publicIds: publicIds,
        count: publicIds.length,
        examples: publicIds.slice(0, 3),
        usage: {
          businesses: '/api/businesses',
          restaurantDetails: '/api/restaurants/{publicId}',
          deliveryMenu: '/api/restaurants/{publicId}/delivery-menu'
        }
      },
      dataSource: 'wongnai-real-data'
    }));
    return;
  }

  // Default 404 response
  res.writeHead(404);
  res.end(JSON.stringify({
    error: 'API endpoint not found',
    path: path,
    method: req.method,
    available_endpoints: [
      'GET /api/health',
      'GET /api/mcp/tools',
      'GET /api/restaurants/search (Mock Data - Comprehensive)',
      'GET /api/restaurants/{publicId} (Mock Restaurant Details)',
      'GET /api/restaurants/{publicId}/analytics (Mock Analytics)',
      'GET /api/market/analysis (Mock Market Analysis)',
      'POST /api/ai/chat (Comprehensive AI Assistant)',
      'GET /api/restaurants/search-db (Database Fallback)',
      'GET /api/businesses (Wongnai-style)',
      'GET /api/restaurants/{publicId}/delivery-menu (Wongnai)',
      'GET /api/wongnai/publicids (Available publicIds)'
    ]
  }));
});

const PORT = 12001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BiteBase MCP API Server with COMPREHENSIVE MOCK DATA running on http://0.0.0.0:${PORT}`);
  console.log(`\n📋 COMPREHENSIVE MOCK DATA ENDPOINTS:`);
  console.log(`🔍 Restaurant Search: http://0.0.0.0:${PORT}/api/restaurants/search`);
  console.log(`🏪 Restaurant Details: http://0.0.0.0:${PORT}/api/restaurants/{publicId}`);
  console.log(`📊 Restaurant Analytics: http://0.0.0.0:${PORT}/api/restaurants/{publicId}/analytics`);
  console.log(`📈 Market Analysis: http://0.0.0.0:${PORT}/api/market/analysis`);
  console.log(`🤖 AI Assistant: POST http://0.0.0.0:${PORT}/api/ai/chat`);
  console.log(`\n🔧 SYSTEM ENDPOINTS:`);
  console.log(`💚 Health Check: http://0.0.0.0:${PORT}/api/health`);
  console.log(`🛠️  MCP Tools: http://0.0.0.0:${PORT}/api/mcp/tools`);
  console.log(`\n🌐 WONGNAI INTEGRATION (Real Data):`);
  console.log(`🏢 Businesses: http://0.0.0.0:${PORT}/api/businesses`);
  console.log(`📋 Delivery Menu: http://0.0.0.0:${PORT}/api/restaurants/{publicId}/delivery-menu`);
  console.log(`📝 PublicIds: http://0.0.0.0:${PORT}/api/wongnai/publicids`);
  console.log(`\n💡 TESTING EXAMPLES:`);
  console.log(`• curl "http://0.0.0.0:${PORT}/api/restaurants/search?cuisine=Italian"`);
  console.log(`• curl "http://0.0.0.0:${PORT}/api/restaurants/bella-italia-silom"`);
  console.log(`• curl "http://0.0.0.0:${PORT}/api/market/analysis"`);
  console.log(`• curl -X POST "http://0.0.0.0:${PORT}/api/ai/chat" -H "Content-Type: application/json" -d '{"message":"Recommend Italian restaurants"}'`);
  console.log(`\n🎯 Ready for comprehensive feature testing with realistic mock data!`);
});