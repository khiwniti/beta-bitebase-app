-- BiteBase Database Schema for Cloudflare D1

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT,
    account_type TEXT CHECK (account_type IN ('restaurant', 'franchise', 'enterprise')) DEFAULT 'restaurant',
    company_name TEXT,
    phone TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
    features TEXT, -- JSON string
    images TEXT, -- JSON string
    platform TEXT, -- google, yelp, etc.
    platform_id TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
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
    results TEXT, -- JSON string
    opportunity_score REAL CHECK (opportunity_score >= 0 AND opportunity_score <= 10),
    competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
    market_size TEXT CHECK (market_size IN ('small', 'medium', 'large')),
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(uid)
);

-- User profiles table (extended user data)
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    business_goals TEXT, -- JSON string
    target_demographics TEXT, -- JSON string
    budget_range TEXT,
    timeline TEXT,
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
    preferences TEXT, -- JSON string
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(uid)
);

-- AI cache table (for caching AI responses)
CREATE TABLE IF NOT EXISTS ai_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key TEXT UNIQUE NOT NULL,
    response TEXT NOT NULL, -- JSON string
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
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
    created_at TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(uid)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_user ON restaurants(user_id);
CREATE INDEX IF NOT EXISTS idx_market_analyses_user ON market_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_market_analyses_location ON market_analyses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON ai_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid);

-- Insert sample data for development
INSERT OR IGNORE INTO users (uid, email, display_name, account_type, created_at) VALUES
('demo-user-1', 'demo@bitebase.app', 'Demo User', 'restaurant', datetime('now')),
('demo-user-2', 'franchise@bitebase.app', 'Franchise Owner', 'franchise', datetime('now'));

INSERT OR IGNORE INTO restaurants (name, latitude, longitude, address, cuisine, price_range, rating, platform, created_at) VALUES
('The Green Fork', 40.7128, -74.0060, '123 Main St, New York, NY', 'American', 'moderate', 4.5, 'google', datetime('now')),
('Pasta Palace', 40.7589, -73.9851, '456 Broadway, New York, NY', 'Italian', 'upscale', 4.2, 'yelp', datetime('now')),
('Sushi Zen', 40.7505, -73.9934, '789 5th Ave, New York, NY', 'Japanese', 'luxury', 4.7, 'google', datetime('now')),
('Burger Barn', 40.7282, -73.7949, '321 Queens Blvd, Queens, NY', 'American', 'budget', 4.0, 'yelp', datetime('now')),
('Taco Fiesta', 40.6782, -73.9442, '654 Atlantic Ave, Brooklyn, NY', 'Mexican', 'budget', 4.3, 'google', datetime('now'));

INSERT OR IGNORE INTO market_analyses (user_id, location, latitude, longitude, analysis_type, status, opportunity_score, competition_level, market_size, created_at) VALUES
('demo-user-1', 'New York, NY', 40.7128, -74.0060, 'comprehensive', 'completed', 8.5, 'high', 'large', datetime('now')),
('demo-user-1', 'Brooklyn, NY', 40.6782, -73.9442, 'location', 'completed', 7.2, 'medium', 'medium', datetime('now'));

-- Clean up expired cache entries (run periodically)
-- DELETE FROM ai_cache WHERE expires_at < datetime('now');
