-- BiteBase PostgreSQL Database Schema
-- Compatible with Neon.tech PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    account_type VARCHAR(50) CHECK (account_type IN ('restaurant', 'franchise', 'enterprise')) DEFAULT 'restaurant',
    company_name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    cuisine VARCHAR(100),
    price_range VARCHAR(50) CHECK (price_range IN ('budget', 'moderate', 'upscale', 'luxury')),
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    phone VARCHAR(50),
    website TEXT,
    hours JSONB,
    features JSONB,
    images JSONB,
    platform VARCHAR(50),
    platform_id VARCHAR(255),
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(uid)
);

-- Market analyses table
CREATE TABLE IF NOT EXISTS market_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    radius DECIMAL(8,2),
    analysis_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    results JSONB,
    opportunity_score DECIMAL(3,1) CHECK (opportunity_score >= 0 AND opportunity_score <= 10),
    competition_level VARCHAR(50) CHECK (competition_level IN ('low', 'medium', 'high')),
    market_size VARCHAR(50) CHECK (market_size IN ('small', 'medium', 'large')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(uid)
);

-- User profiles table (extended user data)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    business_goals JSONB,
    target_demographics JSONB,
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    experience_level VARCHAR(50) CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(uid)
);

-- AI cache table (for caching AI responses)
CREATE TABLE IF NOT EXISTS ai_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    response JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    plan_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'trial',
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
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
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample data for development
INSERT INTO users (uid, email, display_name, account_type, created_at) VALUES
('demo-user-1', 'demo@bitebase.app', 'Demo User', 'restaurant', NOW()),
('demo-user-2', 'franchise@bitebase.app', 'Franchise Owner', 'franchise', NOW()),
('admin-user-001', 'admin@bitebase.app', 'BiteBase Admin', 'restaurant', NOW())
ON CONFLICT (uid) DO NOTHING;

INSERT INTO restaurants (name, latitude, longitude, address, cuisine, price_range, rating, platform, created_at) VALUES
('The Green Fork', 40.7128, -74.0060, '123 Main St, New York, NY', 'American', 'moderate', 4.5, 'google', NOW()),
('Pasta Palace', 40.7589, -73.9851, '456 Broadway, New York, NY', 'Italian', 'upscale', 4.2, 'yelp', NOW()),
('Sushi Zen', 40.7505, -73.9934, '789 5th Ave, New York, NY', 'Japanese', 'luxury', 4.7, 'google', NOW()),
('Burger Barn', 40.7282, -73.7949, '321 Queens Blvd, Queens, NY', 'American', 'budget', 4.0, 'yelp', NOW()),
('Taco Fiesta', 40.6782, -73.9442, '654 Atlantic Ave, Brooklyn, NY', 'Mexican', 'budget', 4.3, 'google', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO market_analyses (user_id, location, latitude, longitude, analysis_type, status, opportunity_score, competition_level, market_size, created_at) VALUES
('demo-user-1', 'New York, NY', 40.7128, -74.0060, 'comprehensive', 'completed', 8.5, 'high', 'large', NOW()),
('demo-user-1', 'Brooklyn, NY', 40.6782, -73.9442, 'location', 'completed', 7.2, 'medium', 'medium', NOW())
ON CONFLICT DO NOTHING;