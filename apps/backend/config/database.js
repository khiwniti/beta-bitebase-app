const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  // Neon.tech PostgreSQL connection string from README
  connectionString: process.env.DATABASE_URL || 'postgresql://bitebasedb_staging_owner:npg_vzp02ERAaXoQ@ep-damp-tooth-a4orgq86-pooler.us-east-1.aws.neon.tech/bitebasedb_staging?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Database helper functions
class Database {
  static async query(text, params) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('📊 Query executed', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('❌ Database query error:', error);
      throw error;
    }
  }

  static async getClient() {
    return await pool.connect();
  }

  // User operations
  static async createUser(userData) {
    const { uid, email, display_name, account_type, company_name, phone } = userData;
    const query = `
      INSERT INTO users (uid, email, display_name, account_type, company_name, phone)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (uid) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        account_type = EXCLUDED.account_type,
        company_name = EXCLUDED.company_name,
        phone = EXCLUDED.phone,
        updated_at = NOW()
      RETURNING *
    `;
    const result = await this.query(query, [uid, email, display_name, account_type, company_name, phone]);
    return result.rows[0];
  }

  static async getUserByUid(uid) {
    const query = 'SELECT * FROM users WHERE uid = $1';
    const result = await this.query(query, [uid]);
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.query(query, [email]);
    return result.rows[0];
  }

  // Restaurant operations
  static async createRestaurant(restaurantData) {
    const { name, latitude, longitude, address, cuisine, price_range, rating, phone, website, user_id } = restaurantData;
    const query = `
      INSERT INTO restaurants (name, latitude, longitude, address, cuisine, price_range, rating, phone, website, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await this.query(query, [name, latitude, longitude, address, cuisine, price_range, rating, phone, website, user_id]);
    return result.rows[0];
  }

  static async getRestaurants(limit = 50, offset = 0) {
    const query = 'SELECT * FROM restaurants ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await this.query(query, [limit, offset]);
    return result.rows;
  }

  static async getRestaurantsByLocation(latitude, longitude, radius = 5000) {
    // Simple distance calculation (for more accurate results, use PostGIS)
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) * 1000 as distance
      FROM restaurants
      WHERE (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) * 1000 <= $3
      ORDER BY distance
    `;
    const result = await this.query(query, [latitude, longitude, radius]);
    return result.rows;
  }

  // Market analysis operations
  static async createMarketAnalysis(analysisData) {
    const { user_id, location, latitude, longitude, radius, analysis_type, results, opportunity_score, competition_level, market_size } = analysisData;
    const query = `
      INSERT INTO market_analyses (user_id, location, latitude, longitude, radius, analysis_type, results, opportunity_score, competition_level, market_size, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'completed')
      RETURNING *
    `;
    const result = await this.query(query, [user_id, location, latitude, longitude, radius, analysis_type, JSON.stringify(results), opportunity_score, competition_level, market_size]);
    return result.rows[0];
  }

  static async getMarketAnalysesByUser(user_id) {
    const query = 'SELECT * FROM market_analyses WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await this.query(query, [user_id]);
    return result.rows;
  }

  // AI cache operations
  static async getCachedResponse(cache_key) {
    const query = 'SELECT * FROM ai_cache WHERE cache_key = $1 AND expires_at > NOW()';
    const result = await this.query(query, [cache_key]);
    return result.rows[0];
  }

  static async setCachedResponse(cache_key, response, ttl_hours = 24) {
    const expires_at = new Date(Date.now() + ttl_hours * 60 * 60 * 1000);
    const query = `
      INSERT INTO ai_cache (cache_key, response, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (cache_key) DO UPDATE SET
        response = EXCLUDED.response,
        expires_at = EXCLUDED.expires_at,
        created_at = NOW()
    `;
    await this.query(query, [cache_key, JSON.stringify(response), expires_at]);
  }

  // Cleanup expired cache entries
  static async cleanupExpiredCache() {
    const query = 'DELETE FROM ai_cache WHERE expires_at < NOW()';
    const result = await this.query(query);
    console.log(`🧹 Cleaned up ${result.rowCount} expired cache entries`);
  }

  // Health check
  static async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as current_time, version() as version');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        version: result.rows[0].version
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}

module.exports = { Database, pool };