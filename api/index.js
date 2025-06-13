// Express.js server for Vercel deployment
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://bitebase_db_admin:npg_sAvDzUnR40CV@ep-late-sun-a5x0yvpb-pooler.us-east-2.aws.neon.tech/beta-bitebase-prod?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(cors({
  origin: ['https://beta.bitebase.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', result.rows[0]);
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'bitebase-backend',
      version: '3.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        type: 'postgresql',
        provider: 'neon'
      },
      services: {
        api: true,
        database: true,
        analytics: true,
        search: true
      }
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'bitebase-backend',
      error: 'Database connection failed',
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Initialize database endpoint
app.post('/api/init-database', async (req, res) => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cuisine_type VARCHAR(100),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(50),
        zip_code VARCHAR(20),
        country VARCHAR(50) DEFAULT 'US',
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        price_range INTEGER CHECK (price_range >= 1 AND price_range <= 4),
        rating DECIMAL(3, 2) DEFAULT 0.0,
        review_count INTEGER DEFAULT 0,
        hours JSONB,
        features TEXT[],
        images TEXT[],
        menu_url VARCHAR(255),
        delivery_available BOOLEAN DEFAULT false,
        takeout_available BOOLEAN DEFAULT true,
        reservations_available BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, restaurant_id)
      );
    `);

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine_type);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(city, state);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_restaurants_price ON restaurants(price_range);');

    // Insert test data
    const testRestaurants = [
      {
        name: "Bella Vista Ristorante",
        description: "Authentic Italian cuisine with a modern twist",
        cuisine_type: "Italian",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip_code: "10001",
        latitude: 40.7589,
        longitude: -73.9851,
        phone: "(555) 123-4567",
        price_range: 3,
        rating: 4.5,
        review_count: 127,
        features: ["outdoor_seating", "wine_bar", "romantic"],
        delivery_available: true,
        takeout_available: true,
        reservations_available: true
      },
      {
        name: "Sakura Sushi Bar",
        description: "Fresh sushi and traditional Japanese dishes",
        cuisine_type: "Japanese",
        address: "456 Oak Ave",
        city: "San Francisco",
        state: "CA",
        zip_code: "94102",
        latitude: 37.7749,
        longitude: -122.4194,
        phone: "(555) 987-6543",
        price_range: 4,
        rating: 4.8,
        review_count: 89,
        features: ["sushi_bar", "sake_selection", "omakase"],
        delivery_available: false,
        takeout_available: true,
        reservations_available: true
      },
      {
        name: "El Corazón Mexicano",
        description: "Traditional Mexican flavors with locally sourced ingredients",
        cuisine_type: "Mexican",
        address: "789 Sunset Blvd",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90028",
        latitude: 34.0522,
        longitude: -118.2437,
        phone: "(555) 456-7890",
        price_range: 2,
        rating: 4.3,
        review_count: 203,
        features: ["margaritas", "live_music", "patio"],
        delivery_available: true,
        takeout_available: true,
        reservations_available: false
      },
      {
        name: "Le Petit Bistro",
        description: "Classic French bistro experience",
        cuisine_type: "French",
        address: "321 Park Ave",
        city: "Chicago",
        state: "IL",
        zip_code: "60611",
        latitude: 41.8781,
        longitude: -87.6298,
        phone: "(555) 234-5678",
        price_range: 4,
        rating: 4.6,
        review_count: 156,
        features: ["wine_cellar", "chef_specials", "intimate"],
        delivery_available: false,
        takeout_available: false,
        reservations_available: true
      },
      {
        name: "The Burger Joint",
        description: "Gourmet burgers and craft beer",
        cuisine_type: "American",
        address: "654 Broadway",
        city: "Nashville",
        state: "TN",
        zip_code: "37203",
        latitude: 36.1627,
        longitude: -86.7816,
        phone: "(555) 345-6789",
        price_range: 2,
        rating: 4.2,
        review_count: 312,
        features: ["craft_beer", "outdoor_seating", "sports_bar"],
        delivery_available: true,
        takeout_available: true,
        reservations_available: false
      }
    ];

    for (const restaurant of testRestaurants) {
      await pool.query(`
        INSERT INTO restaurants (name, description, cuisine_type, address, city, state, zip_code, latitude, longitude, phone, price_range, rating, review_count, features, delivery_available, takeout_available, reservations_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (name) DO NOTHING
      `, [
        restaurant.name, restaurant.description, restaurant.cuisine_type,
        restaurant.address, restaurant.city, restaurant.state, restaurant.zip_code,
        restaurant.latitude, restaurant.longitude, restaurant.phone,
        restaurant.price_range, restaurant.rating, restaurant.review_count,
        restaurant.features, restaurant.delivery_available,
        restaurant.takeout_available, restaurant.reservations_available
      ]);
    }

    // Insert test users
    const testUsers = [
      {
        email: "admin@bitebase.app",
        password: "admin123",
        first_name: "Admin",
        last_name: "User",
        role: "admin"
      },
      {
        email: "maria@bellavista.com",
        password: "maria123",
        first_name: "Maria",
        last_name: "Rodriguez",
        role: "restaurant_owner"
      },
      {
        email: "john@example.com",
        password: "john123",
        first_name: "John",
        last_name: "Doe",
        role: "user"
      },
      {
        email: "sarah@example.com",
        password: "sarah123",
        first_name: "Sarah",
        last_name: "Johnson",
        role: "user"
      },
      {
        email: "demo@bitebase.app",
        password: "demo123",
        first_name: "Demo",
        last_name: "User",
        role: "user"
      }
    ];

    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, [user.email, hashedPassword, user.first_name, user.last_name, user.role]);
    }

    res.status(200).json({
      success: true,
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString(),
      tables_created: ['users', 'restaurants', 'user_sessions', 'analytics_events', 'user_favorites'],
      test_data: {
        restaurants: testRestaurants.length,
        users: testUsers.length
      }
    });

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database initialization failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Restaurant search endpoint
app.get('/api/restaurants/search', async (req, res) => {
  try {
    const {
      location,
      cuisine,
      price_range,
      rating,
      delivery,
      takeout,
      reservations,
      features,
      limit = 20,
      offset = 0
    } = req.query;

    let query = 'SELECT * FROM restaurants WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (location) {
      paramCount++;
      query += ` AND (city ILIKE $${paramCount} OR state ILIKE $${paramCount} OR address ILIKE $${paramCount})`;
      params.push(`%${location}%`);
    }

    if (cuisine) {
      paramCount++;
      query += ` AND cuisine_type ILIKE $${paramCount}`;
      params.push(`%${cuisine}%`);
    }

    if (price_range) {
      paramCount++;
      query += ` AND price_range <= $${paramCount}`;
      params.push(parseInt(price_range));
    }

    if (rating) {
      paramCount++;
      query += ` AND rating >= $${paramCount}`;
      params.push(parseFloat(rating));
    }

    if (delivery === 'true') {
      query += ' AND delivery_available = true';
    }

    if (takeout === 'true') {
      query += ' AND takeout_available = true';
    }

    if (reservations === 'true') {
      query += ' AND reservations_available = true';
    }

    if (features) {
      const featureList = Array.isArray(features) ? features : [features];
      paramCount++;
      query += ` AND features && $${paramCount}`;
      params.push(featureList);
    }

    query += ' ORDER BY rating DESC, review_count DESC';
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(parseInt(offset));

    const result = await pool.query(query, params);

    // Track search event
    await pool.query(`
      INSERT INTO analytics_events (event_type, event_data, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
    `, [
      'restaurant_search',
      JSON.stringify({ location, cuisine, price_range, rating, results_count: result.rows.length }),
      req.ip,
      req.get('User-Agent')
    ]);

    res.status(200).json({
      success: true,
      data: {
        restaurants: result.rows,
        total: result.rows.length,
        filters: {
          location,
          cuisine,
          price_range,
          rating,
          delivery,
          takeout,
          reservations,
          features
        },
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: result.rows.length === parseInt(limit)
        }
      },
      meta: {
        searchVia: 'database',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Restaurant search failed:', error);
    res.status(500).json({
      success: false,
      message: 'Restaurant search failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Restaurant details endpoint
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
        timestamp: new Date().toISOString()
      });
    }

    const restaurant = result.rows[0];

    // Get similar restaurants
    const similarResult = await pool.query(`
      SELECT * FROM restaurants 
      WHERE cuisine_type = $1 AND id != $2 
      ORDER BY rating DESC 
      LIMIT 3
    `, [restaurant.cuisine_type, id]);

    // Track view event
    await pool.query(`
      INSERT INTO analytics_events (event_type, event_data, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
    `, [
      'restaurant_view',
      JSON.stringify({ restaurant_id: id, restaurant_name: restaurant.name }),
      req.ip,
      req.get('User-Agent')
    ]);

    res.status(200).json({
      success: true,
      data: {
        restaurant,
        similar_restaurants: similarResult.rows
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Restaurant details failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get restaurant details',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Analytics dashboard endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    let dateFilter = "created_at >= NOW() - INTERVAL '7 days'";
    if (timeframe === '1d') dateFilter = "created_at >= NOW() - INTERVAL '1 day'";
    if (timeframe === '30d') dateFilter = "created_at >= NOW() - INTERVAL '30 days'";
    if (timeframe === '90d') dateFilter = "created_at >= NOW() - INTERVAL '90 days'";

    // Get basic metrics
    const [
      totalRestaurants,
      totalUsers,
      recentSearches,
      recentViews,
      popularCuisines,
      topRatedRestaurants
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM restaurants'),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query(`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'restaurant_search' AND ${dateFilter}`),
      pool.query(`SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'restaurant_view' AND ${dateFilter}`),
      pool.query(`
        SELECT cuisine_type, COUNT(*) as count 
        FROM restaurants 
        GROUP BY cuisine_type 
        ORDER BY count DESC 
        LIMIT 5
      `),
      pool.query(`
        SELECT name, rating, review_count 
        FROM restaurants 
        ORDER BY rating DESC, review_count DESC 
        LIMIT 5
      `)
    ]);

    // Track dashboard access
    await pool.query(`
      INSERT INTO analytics_events (event_type, event_data, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
    `, [
      'dashboard_access',
      JSON.stringify({ timeframe }),
      req.ip,
      req.get('User-Agent')
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total_restaurants: parseInt(totalRestaurants.rows[0].count),
          total_users: parseInt(totalUsers.rows[0].count),
          recent_searches: parseInt(recentSearches.rows[0].count),
          recent_views: parseInt(recentViews.rows[0].count)
        },
        popular_cuisines: popularCuisines.rows,
        top_rated_restaurants: topRatedRestaurants.rows,
        timeframe
      },
      meta: {
        timestamp: new Date().toISOString(),
        generated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Analytics dashboard failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    message: "Express.js API is working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    version: "3.0.0"
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: "BiteBase API Server",
    version: "3.0.0",
    status: "operational",
    endpoints: [
      "GET /api/health",
      "POST /api/init-database",
      "GET /api/restaurants/search",
      "GET /api/restaurants/:id",
      "GET /api/analytics/dashboard",
      "GET /api/test"
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    timestamp: new Date().toISOString(),
    available_endpoints: [
      "GET /api/health",
      "POST /api/init-database", 
      "GET /api/restaurants/search",
      "GET /api/restaurants/:id",
      "GET /api/analytics/dashboard",
      "GET /api/test"
    ]
  });
});

// Export for Vercel
module.exports = app;