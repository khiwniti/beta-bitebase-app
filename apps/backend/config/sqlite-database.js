const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../database/bitebase.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite connection error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Database helper functions
class Database {
  static async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sql, params, (err, rows) => {
          const duration = Date.now() - start;
          if (err) {
            console.error('❌ Database query error:', err);
            reject(err);
          } else {
            console.log('📊 Query executed', { text: sql.substring(0, 50) + '...', duration, rows: rows.length });
            resolve({ rows });
          }
        });
      } else {
        db.run(sql, params, function(err) {
          const duration = Date.now() - start;
          if (err) {
            console.error('❌ Database query error:', err);
            reject(err);
          } else {
            console.log('📊 Query executed', { text: sql.substring(0, 50) + '...', duration, changes: this.changes });
            resolve({ rowCount: this.changes, lastID: this.lastID });
          }
        });
      }
    });
  }

  // User operations
  static async createUser(userData) {
    const { uid, email, display_name, account_type, company_name, phone } = userData;
    const sql = `
      INSERT OR REPLACE INTO users (uid, email, display_name, account_type, company_name, phone, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    await this.query(sql, [uid, email, display_name, account_type, company_name, phone]);
    return await this.getUserByUid(uid);
  }

  static async getUserByUid(uid) {
    const sql = 'SELECT * FROM users WHERE uid = ?';
    const result = await this.query(sql, [uid]);
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const result = await this.query(sql, [email]);
    return result.rows[0];
  }

  // Restaurant operations
  static async createRestaurant(restaurantData) {
    const { name, latitude, longitude, address, cuisine, price_range, rating, phone, website, user_id } = restaurantData;
    const sql = `
      INSERT INTO restaurants (name, latitude, longitude, address, cuisine, price_range, rating, phone, website, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    const result = await this.query(sql, [name, latitude, longitude, address, cuisine, price_range, rating, phone, website, user_id]);
    return { id: result.lastID, ...restaurantData };
  }

  static async getRestaurants(limit = 50, offset = 0) {
    const sql = 'SELECT * FROM restaurants ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const result = await this.query(sql, [limit, offset]);
    return result.rows;
  }

  static async getRestaurantsByLocation(latitude, longitude, radius = 5000) {
    // Simple distance calculation
    const sql = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) * 1000 as distance
      FROM restaurants
      WHERE (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) * 1000 <= ?
      ORDER BY distance
    `;
    const result = await this.query(sql, [latitude, longitude, latitude, latitude, longitude, latitude, radius]);
    return result.rows;
  }

  // Market analysis operations
  static async createMarketAnalysis(analysisData) {
    const { user_id, location, latitude, longitude, radius, analysis_type, results, opportunity_score, competition_level, market_size } = analysisData;
    const sql = `
      INSERT INTO market_analyses (user_id, location, latitude, longitude, radius, analysis_type, results, opportunity_score, competition_level, market_size, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', datetime('now'))
    `;
    const result = await this.query(sql, [user_id, location, latitude, longitude, radius, analysis_type, JSON.stringify(results), opportunity_score, competition_level, market_size]);
    return { id: result.lastID, ...analysisData };
  }

  static async getMarketAnalysesByUser(user_id) {
    const sql = 'SELECT * FROM market_analyses WHERE user_id = ? ORDER BY created_at DESC';
    const result = await this.query(sql, [user_id]);
    return result.rows;
  }

  // AI cache operations
  static async getCachedResponse(cache_key) {
    const sql = 'SELECT * FROM ai_cache WHERE cache_key = ? AND expires_at > datetime("now")';
    const result = await this.query(sql, [cache_key]);
    return result.rows[0];
  }

  static async setCachedResponse(cache_key, response, ttl_hours = 24) {
    const expires_at = new Date(Date.now() + ttl_hours * 60 * 60 * 1000).toISOString();
    const sql = `
      INSERT OR REPLACE INTO ai_cache (cache_key, response, expires_at, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;
    await this.query(sql, [cache_key, JSON.stringify(response), expires_at]);
  }

  // Cleanup expired cache entries
  static async cleanupExpiredCache() {
    const sql = 'DELETE FROM ai_cache WHERE expires_at < datetime("now")';
    const result = await this.query(sql);
    console.log(`🧹 Cleaned up ${result.rowCount} expired cache entries`);
  }

  // Health check
  static async healthCheck() {
    try {
      const result = await this.query('SELECT datetime("now") as current_time, sqlite_version() as version');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        version: 'SQLite ' + result.rows[0].version,
        type: 'sqlite'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        type: 'sqlite'
      };
    }
  }

  // Initialize database schema
  static async initializeSchema() {
    const schema = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uid TEXT UNIQUE NOT NULL,
          email TEXT NOT NULL,
          display_name TEXT,
          account_type TEXT CHECK (account_type IN ('restaurant', 'franchise', 'enterprise')) DEFAULT 'restaurant',
          company_name TEXT,
          phone TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
      );

      -- Restaurants table
      CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          address TEXT,
          cuisine TEXT,
          price_range TEXT CHECK (price_range IN ('budget', 'moderate', 'upscale', 'luxury')),
          rating REAL CHECK (rating >= 0 AND rating <= 5),
          review_count INTEGER DEFAULT 0,
          phone TEXT,
          website TEXT,
          hours TEXT,
          features TEXT,
          images TEXT,
          platform TEXT,
          platform_id TEXT,
          user_id TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(uid)
      );

      -- Market analyses table
      CREATE TABLE IF NOT EXISTS market_analyses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          location TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          radius REAL,
          analysis_type TEXT NOT NULL,
          status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
          results TEXT,
          opportunity_score REAL CHECK (opportunity_score >= 0 AND opportunity_score <= 10),
          competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
          market_size TEXT CHECK (market_size IN ('small', 'medium', 'large')),
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(uid)
      );

      -- User profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT UNIQUE NOT NULL,
          business_goals TEXT,
          target_demographics TEXT,
          budget_range TEXT,
          timeline TEXT,
          experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
          preferences TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(uid)
      );

      -- AI cache table
      CREATE TABLE IF NOT EXISTS ai_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cache_key TEXT UNIQUE NOT NULL,
          response TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      -- Subscriptions table
      CREATE TABLE IF NOT EXISTS subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'trial',
          stripe_subscription_id TEXT,
          current_period_start TEXT,
          current_period_end TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (user_id) REFERENCES users(uid)
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
      CREATE INDEX IF NOT EXISTS idx_restaurants_user ON restaurants(user_id);
      CREATE INDEX IF NOT EXISTS idx_market_analyses_user ON market_analyses(user_id);
      CREATE INDEX IF NOT EXISTS idx_market_analyses_location ON market_analyses(latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_cache(cache_key);
      CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON ai_cache(expires_at);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

      -- Insert sample data
      INSERT OR IGNORE INTO users (uid, email, display_name, account_type, created_at) VALUES
      ('demo-user-1', 'demo@bitebase.app', 'Demo User', 'restaurant', datetime('now')),
      ('demo-user-2', 'franchise@bitebase.app', 'Franchise Owner', 'franchise', datetime('now')),
      ('admin-user-001', 'admin@bitebase.app', 'BiteBase Admin', 'restaurant', datetime('now'));

      INSERT OR IGNORE INTO restaurants (name, latitude, longitude, address, cuisine, price_range, rating, platform, created_at) VALUES
      ('The Green Fork', 40.7128, -74.0060, '123 Main St, New York, NY', 'American', 'moderate', 4.5, 'google', datetime('now')),
      ('Pasta Palace', 40.7589, -73.9851, '456 Broadway, New York, NY', 'Italian', 'upscale', 4.2, 'yelp', datetime('now')),
      ('Sushi Zen', 40.7505, -73.9934, '789 5th Ave, New York, NY', 'Japanese', 'luxury', 4.7, 'google', datetime('now')),
      ('Burger Barn', 40.7282, -73.7949, '321 Queens Blvd, Queens, NY', 'American', 'budget', 4.0, 'yelp', datetime('now')),
      ('Taco Fiesta', 40.6782, -73.9442, '654 Atlantic Ave, Brooklyn, NY', 'Mexican', 'budget', 4.3, 'google', datetime('now'));

      INSERT OR IGNORE INTO market_analyses (user_id, location, latitude, longitude, analysis_type, status, opportunity_score, competition_level, market_size, created_at) VALUES
      ('demo-user-1', 'New York, NY', 40.7128, -74.0060, 'comprehensive', 'completed', 8.5, 'high', 'large', datetime('now')),
      ('demo-user-1', 'Brooklyn, NY', 40.6782, -73.9442, 'location', 'completed', 7.2, 'medium', 'medium', datetime('now'));
    `;

    // Split schema into statements and execute
    const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for (const statement of statements) {
      try {
        await this.query(statement);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.error('Schema error:', error.message);
        }
      }
    }
    
    console.log('✅ Database schema initialized');
  }
}

module.exports = { Database, db };