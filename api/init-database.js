/**
 * Database Initialization Endpoint for Vercel
 * This endpoint initializes the database with tables and test data
 */

const { 
  testConnection, 
  initializeDatabase, 
  insertTestUsers, 
  insertTestRestaurants 
} = require('./lib/database.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = {
      connection: false,
      tables: false,
      users: false,
      restaurants: false,
      errors: []
    };

    // Test connection
    console.log('Testing database connection...');
    results.connection = await testConnection();
    if (!results.connection) {
      results.errors.push('Database connection failed');
    }

    // Initialize tables
    if (results.connection) {
      console.log('Creating database tables...');
      try {
        await initializeDatabase();
        results.tables = true;
      } catch (error) {
        results.errors.push(`Table creation failed: ${error.message}`);
      }
    }

    // Insert test users
    if (results.tables) {
      console.log('Inserting test users...');
      try {
        await insertTestUsers();
        results.users = true;
      } catch (error) {
        results.errors.push(`User insertion failed: ${error.message}`);
      }
    }

    // Insert test restaurants
    if (results.users) {
      console.log('Inserting test restaurants...');
      try {
        await insertTestRestaurants();
        results.restaurants = true;
      } catch (error) {
        results.errors.push(`Restaurant insertion failed: ${error.message}`);
      }
    }

    const success = results.connection && results.tables && results.users && results.restaurants;

    res.status(success ? 200 : 500).json({
      success,
      message: success ? 'Database initialized successfully' : 'Database initialization failed',
      results,
      testUsers: success ? [
        'admin@bitebase.com (password: admin123) - Admin',
        'john.doe@example.com (password: password123) - User',
        'jane.smith@example.com (password: password123) - User',
        'restaurant.owner@example.com (password: password123) - Restaurant Owner',
        'demo@bitebase.com (password: demo123) - Demo User'
      ] : [],
      testRestaurants: success ? [
        'Bella Italia (Italian, $$)',
        'Sushi Zen (Japanese, $$$)',
        'Taco Libre (Mexican, $)',
        'The French Bistro (French, $$$)',
        'Burger Palace (American, $$)'
      ] : [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};