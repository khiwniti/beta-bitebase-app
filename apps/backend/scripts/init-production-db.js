#!/usr/bin/env node

/**
 * BiteBase Production Database Initialization Script
 *
 * This script initializes the PostgreSQL database for production deployment.
 * It connects to the Neon PostgreSQL database and sets up the required schema.
 */

const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load production environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.production') });

console.log('🚀 BiteBase Production Database Initialization');
console.log('===============================================\n');

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

console.log('📊 Database Configuration:');
console.log(`Host: ${process.env.DATABASE_HOST}`);
console.log(`Database: ${process.env.DATABASE_NAME}`);
console.log(`User: ${process.env.DATABASE_USERNAME}`);
console.log(`SSL: ${process.env.DATABASE_SSL}`);
console.log('');

async function initializeDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Test basic connection
    console.log('🧪 Testing database connection...');
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log(`Current time: ${result.rows[0].current_time}`);
    console.log(`PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}\n`);

    // Check if PostGIS extension is available
    console.log('🗺️  Checking for PostGIS extension...');
    try {
      const postgisCheck = await client.query(`
        SELECT extname, extversion
        FROM pg_extension
        WHERE extname = 'postgis'
      `);

      if (postgisCheck.rows.length > 0) {
        console.log(`✅ PostGIS ${postgisCheck.rows[0].extversion} is available`);
      } else {
        console.log('⚠️  PostGIS extension not found. Installing...');
        try {
          await client.query('CREATE EXTENSION IF NOT EXISTS postgis');
          console.log('✅ PostGIS extension installed successfully');
        } catch (error) {
          console.log('⚠️  Could not install PostGIS. Geospatial features may be limited.');
          console.log('   This is normal for some cloud providers.');
        }
      }
    } catch (error) {
      console.log('⚠️  Could not check PostGIS availability');
    }

    // Check database size and permissions
    console.log('\n📏 Database information:');
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size($1)) as size
    `, [process.env.DATABASE_NAME]);
    console.log(`Database size: ${sizeResult.rows[0].size}`);

    // Check existing tables
    const permissionsResult = await client.query(`
      SELECT
        schemaname,
        tablename,
        tableowner
      FROM pg_tables
      WHERE schemaname = 'public'
      LIMIT 5
    `);

    if (permissionsResult.rows.length > 0) {
      console.log('\n📋 Existing tables:');
      permissionsResult.rows.forEach(row => {
        console.log(`  - ${row.tablename} (owner: ${row.tableowner})`);
      });
    } else {
      console.log('\n📋 No existing tables found - ready for Strapi initialization');
    }

    // Create a test table to verify write permissions
    console.log('\n🔧 Testing write permissions...');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS bitebase_init_test (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP DEFAULT NOW(),
          test_data TEXT
        )
      `);

      await client.query(`
        INSERT INTO bitebase_init_test (test_data)
        VALUES ('Database initialization test')
      `);

      const testResult = await client.query(`
        SELECT COUNT(*) as count FROM bitebase_init_test
      `);

      console.log(`✅ Write permissions verified (${testResult.rows[0].count} test records)`);

      // Clean up test table
      await client.query('DROP TABLE IF EXISTS bitebase_init_test');
      console.log('✅ Test table cleaned up');

    } catch (error) {
      console.error('❌ Write permission test failed:', error.message);
      throw error;
    }

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Run: npm run start');
    console.log('3. Access Strapi admin at: http://localhost:1337/admin');
    console.log('\nStrapi will automatically create the required tables on first run.');

  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your DATABASE_URL in .env.production');
    console.error('2. Verify network connectivity to the database');
    console.error('3. Ensure database credentials are correct');
    console.error('4. Check if the database exists and is accessible');
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
