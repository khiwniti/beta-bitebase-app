#!/usr/bin/env node

const { Database } = require('../config/database');
const bcrypt = require('bcrypt');

async function initializeDatabase() {
  console.log('🚀 Initializing PostgreSQL database...');

  try {
    // Create tables
    console.log('📋 Creating tables...');

    // Users table
    await Database.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        display_name VARCHAR(255),
        account_type VARCHAR(50) DEFAULT 'restaurant_owner',
        company_name VARCHAR(255),
        phone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Restaurants table
    await Database.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        address TEXT,
        cuisine VARCHAR(100),
        price_range VARCHAR(10),
        rating DECIMAL(3, 2),
        phone VARCHAR(50),
        website VARCHAR(255),
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Market analyses table
    await Database.query(`
      CREATE TABLE IF NOT EXISTS market_analyses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        location VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        radius INTEGER DEFAULT 1000,
        analysis_type VARCHAR(100),
        results JSONB,
        opportunity_score INTEGER,
        competition_level VARCHAR(50),
        market_size VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // AI cache table
    await Database.query(`
      CREATE TABLE IF NOT EXISTS ai_cache (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(255) UNIQUE NOT NULL,
        response JSONB,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Subscriptions table
    await Database.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        plan_name VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        stripe_subscription_id VARCHAR(255),
        current_period_start TIMESTAMP,
        current_period_end TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created successfully');

    // Create indexes
    console.log('📊 Creating indexes...');
    
    await Database.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await Database.query('CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid)');
    await Database.query('CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude)');
    await Database.query('CREATE INDEX IF NOT EXISTS idx_market_analyses_user ON market_analyses(user_id)');
    await Database.query('CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_cache(cache_key)');
    await Database.query('CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON ai_cache(expires_at)');

    console.log('✅ Indexes created successfully');

    // Insert admin user
    console.log('👤 Creating admin user...');
    
    const adminPassword = 'Libralytics1234!*';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await Database.query(`
      INSERT INTO users (uid, email, password_hash, display_name, role, account_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        updated_at = CURRENT_TIMESTAMP
    `, ['admin-user-001', 'admin@bitebase.app', hashedPassword, 'BiteBase Admin', 'admin', 'admin']);

    console.log('✅ Admin user created/updated');

    // Insert sample data
    console.log('📊 Inserting sample data...');

    // Sample restaurants
    const sampleRestaurants = [
      {
        name: 'The Golden Spoon',
        latitude: 13.7563,
        longitude: 100.5018,
        address: '123 Sukhumvit Road, Bangkok',
        cuisine: 'Thai',
        price_range: '$$',
        rating: 4.5,
        phone: '+66-2-123-4567'
      },
      {
        name: 'Pasta Paradise',
        latitude: 13.7440,
        longitude: 100.5332,
        address: '456 Silom Road, Bangkok',
        cuisine: 'Italian',
        price_range: '$$$',
        rating: 4.2,
        phone: '+66-2-234-5678'
      },
      {
        name: 'Sushi Zen',
        latitude: 13.7308,
        longitude: 100.5418,
        address: '789 Sathorn Road, Bangkok',
        cuisine: 'Japanese',
        price_range: '$$$$',
        rating: 4.8,
        phone: '+66-2-345-6789'
      }
    ];

    for (const restaurant of sampleRestaurants) {
      await Database.query(`
        INSERT INTO restaurants (name, latitude, longitude, address, cuisine, price_range, rating, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
        restaurant.name,
        restaurant.latitude,
        restaurant.longitude,
        restaurant.address,
        restaurant.cuisine,
        restaurant.price_range,
        restaurant.rating,
        restaurant.phone
      ]);
    }

    console.log('✅ Sample data inserted');

    // Test database health
    const health = await Database.healthCheck();
    console.log('🏥 Database health check:', health);

    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database initialization script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database initialization script failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };