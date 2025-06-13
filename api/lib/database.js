const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: 'postgresql://bitebase_db_admin:npg_sAvDzUnR40CV@ep-late-sun-a5x0yvpb-pooler.us-east-2.aws.neon.tech/beta-bitebase-prod?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully:', result.rows[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role VARCHAR(50) DEFAULT 'user',
        subscription_plan VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        profile_data JSONB DEFAULT '{}'
      )
    `);

    // Create restaurants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cuisine VARCHAR(100),
        location VARCHAR(255),
        address JSONB,
        rating DECIMAL(3,2),
        price_range VARCHAR(10),
        description TEXT,
        features TEXT[],
        contact_info JSONB,
        business_hours JSONB,
        menu_data JSONB,
        analytics_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    // Create user_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address INET,
        user_agent TEXT
      )
    `);

    // Create analytics_events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB DEFAULT '{}',
        session_id VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user_favorites table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, restaurant_id)
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
      CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(location);
      CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);
    `);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Insert test users
async function insertTestUsers() {
  const bcrypt = require('bcryptjs');
  const client = await pool.connect();
  
  try {
    const testUsers = [
      {
        email: 'admin@bitebase.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        subscription_plan: 'enterprise'
      },
      {
        email: 'john.doe@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        subscription_plan: 'growth'
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'user',
        subscription_plan: 'pro'
      },
      {
        email: 'restaurant.owner@example.com',
        password: 'password123',
        first_name: 'Restaurant',
        last_name: 'Owner',
        role: 'restaurant_owner',
        subscription_plan: 'pro'
      },
      {
        email: 'demo@bitebase.com',
        password: 'demo123',
        first_name: 'Demo',
        last_name: 'User',
        role: 'user',
        subscription_plan: 'free'
      }
    ];

    for (const user of testUsers) {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (existingUser.rows.length === 0) {
        // Hash password
        const passwordHash = await bcrypt.hash(user.password, 10);
        
        // Insert user
        const result = await client.query(`
          INSERT INTO users (email, password_hash, first_name, last_name, role, subscription_plan, email_verified)
          VALUES ($1, $2, $3, $4, $5, $6, true)
          RETURNING id, email, role
        `, [user.email, passwordHash, user.first_name, user.last_name, user.role, user.subscription_plan]);

        console.log(`✅ Created test user: ${result.rows[0].email} (${result.rows[0].role})`);
      } else {
        console.log(`ℹ️  User already exists: ${user.email}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to insert test users:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Insert test restaurants
async function insertTestRestaurants() {
  const client = await pool.connect();
  
  try {
    const testRestaurants = [
      {
        name: 'Bella Italia',
        cuisine: 'Italian',
        location: 'New York, NY',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        rating: 4.5,
        price_range: '$$',
        description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
        features: ['outdoor_seating', 'delivery', 'reservations', 'wine_bar'],
        contact_info: {
          phone: '+1-555-0123',
          email: 'info@bellaitalia.com',
          website: 'https://bellaitalia.com'
        },
        business_hours: {
          monday: '11:00-22:00',
          tuesday: '11:00-22:00',
          wednesday: '11:00-22:00',
          thursday: '11:00-22:00',
          friday: '11:00-23:00',
          saturday: '11:00-23:00',
          sunday: '12:00-21:00'
        }
      },
      {
        name: 'Sushi Zen',
        cuisine: 'Japanese',
        location: 'New York, NY',
        address: {
          street: '456 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA'
        },
        rating: 4.8,
        price_range: '$$$',
        description: 'Premium sushi and Japanese cuisine with the freshest fish',
        features: ['takeout', 'reservations', 'sake_bar', 'omakase'],
        contact_info: {
          phone: '+1-555-0456',
          email: 'reservations@sushizen.com',
          website: 'https://sushizen.com'
        },
        business_hours: {
          monday: 'closed',
          tuesday: '17:00-22:00',
          wednesday: '17:00-22:00',
          thursday: '17:00-22:00',
          friday: '17:00-23:00',
          saturday: '17:00-23:00',
          sunday: '17:00-21:00'
        }
      },
      {
        name: 'Taco Libre',
        cuisine: 'Mexican',
        location: 'New York, NY',
        address: {
          street: '789 Broadway',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          country: 'USA'
        },
        rating: 4.2,
        price_range: '$',
        description: 'Fresh Mexican street food and authentic tacos',
        features: ['delivery', 'casual_dining', 'vegetarian_options', 'late_night'],
        contact_info: {
          phone: '+1-555-0789',
          email: 'orders@tacolibre.com',
          website: 'https://tacolibre.com'
        },
        business_hours: {
          monday: '11:00-24:00',
          tuesday: '11:00-24:00',
          wednesday: '11:00-24:00',
          thursday: '11:00-24:00',
          friday: '11:00-02:00',
          saturday: '11:00-02:00',
          sunday: '11:00-22:00'
        }
      },
      {
        name: 'The French Bistro',
        cuisine: 'French',
        location: 'New York, NY',
        address: {
          street: '321 Fifth Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10004',
          country: 'USA'
        },
        rating: 4.6,
        price_range: '$$$',
        description: 'Classic French bistro with traditional dishes and extensive wine list',
        features: ['reservations', 'wine_bar', 'romantic_dining', 'private_events'],
        contact_info: {
          phone: '+1-555-0321',
          email: 'contact@frenchbistro.com',
          website: 'https://frenchbistro.com'
        },
        business_hours: {
          monday: 'closed',
          tuesday: '17:30-22:00',
          wednesday: '17:30-22:00',
          thursday: '17:30-22:00',
          friday: '17:30-23:00',
          saturday: '17:30-23:00',
          sunday: '17:30-21:00'
        }
      },
      {
        name: 'Burger Palace',
        cuisine: 'American',
        location: 'New York, NY',
        address: {
          street: '654 Seventh Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10005',
          country: 'USA'
        },
        rating: 4.0,
        price_range: '$$',
        description: 'Gourmet burgers and craft beer in a casual atmosphere',
        features: ['delivery', 'takeout', 'sports_bar', 'craft_beer', 'outdoor_seating'],
        contact_info: {
          phone: '+1-555-0654',
          email: 'info@burgerpalace.com',
          website: 'https://burgerpalace.com'
        },
        business_hours: {
          monday: '11:00-23:00',
          tuesday: '11:00-23:00',
          wednesday: '11:00-23:00',
          thursday: '11:00-23:00',
          friday: '11:00-24:00',
          saturday: '11:00-24:00',
          sunday: '11:00-22:00'
        }
      }
    ];

    for (const restaurant of testRestaurants) {
      // Check if restaurant already exists
      const existingRestaurant = await client.query(
        'SELECT id FROM restaurants WHERE name = $1 AND location = $2',
        [restaurant.name, restaurant.location]
      );

      if (existingRestaurant.rows.length === 0) {
        const result = await client.query(`
          INSERT INTO restaurants (
            name, cuisine, location, address, rating, price_range, 
            description, features, contact_info, business_hours
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id, name, cuisine
        `, [
          restaurant.name,
          restaurant.cuisine,
          restaurant.location,
          JSON.stringify(restaurant.address),
          restaurant.rating,
          restaurant.price_range,
          restaurant.description,
          restaurant.features,
          JSON.stringify(restaurant.contact_info),
          JSON.stringify(restaurant.business_hours)
        ]);

        console.log(`✅ Created test restaurant: ${result.rows[0].name} (${result.rows[0].cuisine})`);
      } else {
        console.log(`ℹ️  Restaurant already exists: ${restaurant.name}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to insert test restaurants:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Get user by email
async function getUserByEmail(email) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

// Get restaurants with filters
async function getRestaurants(filters = {}) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM restaurants WHERE is_active = true';
    const params = [];
    let paramCount = 0;

    if (filters.cuisine) {
      paramCount++;
      query += ` AND LOWER(cuisine) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.cuisine}%`);
    }

    if (filters.location) {
      paramCount++;
      query += ` AND LOWER(location) LIKE LOWER($${paramCount})`;
      params.push(`%${filters.location}%`);
    }

    if (filters.priceRange) {
      paramCount++;
      query += ` AND price_range = $${paramCount}`;
      params.push(filters.priceRange);
    }

    if (filters.minRating) {
      paramCount++;
      query += ` AND rating >= $${paramCount}`;
      params.push(parseFloat(filters.minRating));
    }

    query += ' ORDER BY rating DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(parseInt(filters.limit));
    }

    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Track analytics event
async function trackEvent(eventData) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO analytics_events (user_id, event_type, event_data, session_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [
      eventData.userId || null,
      eventData.eventType,
      JSON.stringify(eventData.eventData || {}),
      eventData.sessionId || null,
      eventData.ipAddress || null,
      eventData.userAgent || null
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  insertTestUsers,
  insertTestRestaurants,
  getUserByEmail,
  getRestaurants,
  trackEvent
};