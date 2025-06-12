#!/usr/bin/env node

/**
 * BiteBase Database Initialization Script
 * Initializes PostgreSQL database with schema and sample data
 */

const fs = require('fs');
const path = require('path');
const { Database } = require('../config/database');

console.log('🚀 BiteBase Database Initialization');
console.log('===================================\n');

async function initializeDatabase() {
  try {
    console.log('🔌 Testing database connection...');
    const health = await Database.healthCheck();
    
    if (health.status === 'healthy') {
      console.log('✅ Database connection successful');
      console.log(`📅 Current time: ${health.timestamp}`);
      console.log(`🗄️  Database version: ${health.version.split(' ')[0]} ${health.version.split(' ')[1]}\n`);
    } else {
      throw new Error(`Database health check failed: ${health.error}`);
    }

    console.log('📋 Initializing database schema...');
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../database/postgresql-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await Database.query(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            console.error(`❌ Statement ${i + 1}/${statements.length} failed:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('\n🧪 Testing database operations...');
    
    // Test user creation
    const testUser = await Database.createUser({
      uid: 'test-user-' + Date.now(),
      email: 'test@bitebase.app',
      display_name: 'Test User',
      account_type: 'restaurant'
    });
    console.log('✅ User creation test passed');

    // Test restaurant creation
    const testRestaurant = await Database.createRestaurant({
      name: 'Test Restaurant',
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'Test Address',
      cuisine: 'Test Cuisine',
      price_range: 'moderate',
      rating: 4.5,
      user_id: testUser.uid
    });
    console.log('✅ Restaurant creation test passed');

    // Test market analysis creation
    const testAnalysis = await Database.createMarketAnalysis({
      user_id: testUser.uid,
      location: 'Test Location',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 1000,
      analysis_type: 'test',
      results: { test: true },
      opportunity_score: 8.5,
      competition_level: 'medium',
      market_size: 'large'
    });
    console.log('✅ Market analysis creation test passed');

    // Test AI cache
    await Database.setCachedResponse('test-key', { test: 'response' }, 1);
    const cachedResponse = await Database.getCachedResponse('test-key');
    if (cachedResponse) {
      console.log('✅ AI cache test passed');
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    
    // Get table counts
    const userCount = await Database.query('SELECT COUNT(*) as count FROM users');
    const restaurantCount = await Database.query('SELECT COUNT(*) as count FROM restaurants');
    const analysisCount = await Database.query('SELECT COUNT(*) as count FROM market_analyses');
    
    console.log(`👥 Users: ${userCount.rows[0].count}`);
    console.log(`🍽️  Restaurants: ${restaurantCount.rows[0].count}`);
    console.log(`📈 Market Analyses: ${analysisCount.rows[0].count}`);

    console.log('\n✨ Ready to start the backend server!');
    console.log('Run: npm start');

  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your DATABASE_URL environment variable');
    console.error('2. Verify network connectivity to the database');
    console.error('3. Ensure database credentials are correct');
    console.error('4. Check if the database exists and is accessible');
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase().catch(console.error);