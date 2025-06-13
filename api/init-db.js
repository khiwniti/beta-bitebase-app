const { 
  testConnection, 
  initializeDatabase, 
  insertTestUsers, 
  insertTestRestaurants 
} = require('./lib/database');

async function initializeCompleteDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Test connection
    console.log('1️⃣ Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }
    console.log('✅ Database connection successful\n');

    // Initialize tables
    console.log('2️⃣ Creating database tables...');
    await initializeDatabase();
    console.log('✅ Database tables created successfully\n');

    // Insert test users
    console.log('3️⃣ Inserting test users...');
    await insertTestUsers();
    console.log('✅ Test users inserted successfully\n');

    // Insert test restaurants
    console.log('4️⃣ Inserting test restaurants...');
    await insertTestRestaurants();
    console.log('✅ Test restaurants inserted successfully\n');

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📋 Test Users Created:');
    console.log('   • admin@bitebase.com (password: admin123) - Admin');
    console.log('   • john.doe@example.com (password: password123) - User');
    console.log('   • jane.smith@example.com (password: password123) - User');
    console.log('   • restaurant.owner@example.com (password: password123) - Restaurant Owner');
    console.log('   • demo@bitebase.com (password: demo123) - Demo User');
    
    console.log('\n🍽️ Test Restaurants Created:');
    console.log('   • Bella Italia (Italian, $$)');
    console.log('   • Sushi Zen (Japanese, $$$)');
    console.log('   • Taco Libre (Mexican, $)');
    console.log('   • The French Bistro (French, $$$)');
    console.log('   • Burger Palace (American, $$)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run initialization
initializeCompleteDatabase();