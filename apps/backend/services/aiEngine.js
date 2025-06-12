/**
 * Advanced AI Recommendation Engine
 * Provides personalized recommendations, competitive analysis, and market insights
 */

const OpenAI = require('openai');
const { Pool } = require('pg');
const Redis = require('redis');

class AIRecommendationEngine {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    this.redis = Redis.createClient({
      url: process.env.REDIS_URL
    });
    
    this.redis.connect().catch(console.error);

    // AI model configurations
    this.models = {
      recommendations: 'gpt-4-turbo-preview',
      analysis: 'gpt-4-turbo-preview',
      embeddings: 'text-embedding-3-large'
    };
  }

  // Generate personalized restaurant recommendations
  async generateRecommendations(userId, preferences = {}) {
    try {
      // Get user profile and history
      const userProfile = await this.getUserProfile(userId);
      const userHistory = await this.getUserHistory(userId);
      
      // Get restaurants data
      const restaurants = await this.getRestaurantsForRecommendation(preferences);
      
      // Create embeddings for user preferences
      const userEmbedding = await this.createUserEmbedding(userProfile, userHistory);
      
      // Calculate similarity scores
      const scoredRestaurants = await this.calculateSimilarityScores(restaurants, userEmbedding);
      
      // Generate AI-powered insights
      const recommendations = await this.generateAIRecommendations(
        userProfile,
        scoredRestaurants.slice(0, 10),
        preferences
      );

      // Cache recommendations
      await this.cacheRecommendations(userId, recommendations);

      return recommendations;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(preferences);
    }
  }

  // Create user embedding based on profile and behavior
  async createUserEmbedding(userProfile, userHistory) {
    try {
      const userText = this.createUserText(userProfile, userHistory);
      
      const response = await this.openai.embeddings.create({
        model: this.models.embeddings,
        input: userText
      });

      return response.data[0].embedding;

    } catch (error) {
      console.error('Error creating user embedding:', error);
      return null;
    }
  }

  // Generate AI-powered recommendation insights
  async generateAIRecommendations(userProfile, restaurants, preferences) {
    try {
      const prompt = this.createRecommendationPrompt(userProfile, restaurants, preferences);
      
      const response = await this.openai.chat.completions.create({
        model: this.models.recommendations,
        messages: [
          {
            role: 'system',
            content: 'You are an expert restaurant recommendation AI that provides personalized, insightful recommendations based on user preferences, dining history, and market data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiInsights = response.choices[0].message.content;
      
      return {
        restaurants: restaurants.map(r => ({
          ...r,
          aiScore: r.similarityScore,
          personalizedReason: this.extractPersonalizedReason(aiInsights, r.name)
        })),
        insights: aiInsights,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return {
        restaurants: restaurants,
        insights: 'Recommendations based on your preferences and dining history.',
        generatedAt: new Date().toISOString()
      };
    }
  }

  // Competitive analysis for restaurants
  async generateCompetitiveAnalysis(restaurantId) {
    try {
      const restaurant = await this.getRestaurantById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // Get competitors in the same area and cuisine type
      const competitors = await this.getCompetitors(restaurant);
      
      // Analyze market positioning
      const marketAnalysis = await this.analyzeMarketPosition(restaurant, competitors);
      
      // Generate AI insights
      const aiAnalysis = await this.generateAICompetitiveInsights(restaurant, competitors, marketAnalysis);

      return {
        restaurant: restaurant,
        competitors: competitors,
        marketAnalysis: marketAnalysis,
        aiInsights: aiAnalysis,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating competitive analysis:', error);
      throw error;
    }
  }

  // Market trend prediction
  async predictMarketTrends(location, timeframe = '6m') {
    try {
      // Get historical data
      const historicalData = await this.getHistoricalMarketData(location, timeframe);
      
      // Get current market indicators
      const currentIndicators = await this.getCurrentMarketIndicators(location);
      
      // Generate AI predictions
      const predictions = await this.generateMarketPredictions(historicalData, currentIndicators);

      return {
        location: location,
        timeframe: timeframe,
        predictions: predictions,
        confidence: this.calculatePredictionConfidence(historicalData),
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error predicting market trends:', error);
      throw error;
    }
  }

  // Generate automated market reports
  async generateMarketReport(userId, reportType = 'weekly') {
    try {
      const user = await this.getUserById(userId);
      const userLocation = user.location || 'Bangkok, Thailand';
      
      // Gather data based on report type
      const reportData = await this.gatherReportData(userLocation, reportType);
      
      // Generate AI-powered report
      const report = await this.generateAIReport(reportData, reportType);

      // Save report
      await this.saveReport(userId, report, reportType);

      return report;

    } catch (error) {
      console.error('Error generating market report:', error);
      throw error;
    }
  }

  // Helper methods
  async getUserProfile(userId) {
    const result = await this.db.query(`
      SELECT u.*, up.* 
      FROM users u 
      LEFT JOIN user_profiles up ON u.id = up.user_id 
      WHERE u.id = $1
    `, [userId]);
    
    return result.rows[0] || {};
  }

  async getUserHistory(userId) {
    const result = await this.db.query(`
      SELECT event_name, properties, created_at
      FROM user_events 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 100
    `, [userId]);
    
    return result.rows;
  }

  async getRestaurantsForRecommendation(preferences) {
    let query = `
      SELECT r.*, 
             AVG(rev.rating) as avg_rating,
             COUNT(rev.id) as review_count
      FROM restaurants r
      LEFT JOIN reviews rev ON r.id = rev.restaurant_id
      WHERE r.status = 'active'
    `;
    
    const params = [];
    
    if (preferences.cuisine) {
      query += ` AND r.cuisine_type = $${params.length + 1}`;
      params.push(preferences.cuisine);
    }
    
    if (preferences.location) {
      query += ` AND r.location ILIKE $${params.length + 1}`;
      params.push(`%${preferences.location}%`);
    }
    
    if (preferences.priceRange) {
      query += ` AND r.price_range = $${params.length + 1}`;
      params.push(preferences.priceRange);
    }
    
    query += ` GROUP BY r.id ORDER BY avg_rating DESC, review_count DESC LIMIT 50`;
    
    const result = await this.db.query(query, params);
    return result.rows;
  }

  createUserText(userProfile, userHistory) {
    const preferences = userProfile.preferences ? JSON.parse(userProfile.preferences) : {};
    const recentEvents = userHistory.slice(0, 20);
    
    return `
      User Profile:
      - Account Type: ${userProfile.account_type || 'individual'}
      - Experience Level: ${userProfile.experience_level || 'beginner'}
      - Budget Range: ${userProfile.budget_range || 'moderate'}
      - Preferences: ${JSON.stringify(preferences)}
      
      Recent Activity:
      ${recentEvents.map(event => `- ${event.event_name}: ${JSON.stringify(event.properties)}`).join('\n')}
    `.trim();
  }

  createRecommendationPrompt(userProfile, restaurants, preferences) {
    return `
      Generate personalized restaurant recommendations for a user with the following profile:
      
      User Profile:
      - Account Type: ${userProfile.account_type || 'individual'}
      - Experience Level: ${userProfile.experience_level || 'beginner'}
      - Budget Range: ${userProfile.budget_range || 'moderate'}
      
      Current Preferences:
      ${JSON.stringify(preferences)}
      
      Top Restaurant Candidates:
      ${restaurants.map(r => `
        - ${r.name}: ${r.cuisine_type}, Rating: ${r.avg_rating}, Price: ${r.price_range}
          Location: ${r.location}, Reviews: ${r.review_count}
      `).join('\n')}
      
      Please provide:
      1. Personalized reasons why each restaurant matches the user
      2. Overall dining recommendations
      3. Market insights relevant to their preferences
      
      Format as JSON with restaurant insights and general recommendations.
    `;
  }

  async calculateSimilarityScores(restaurants, userEmbedding) {
    if (!userEmbedding) {
      return restaurants.map(r => ({ ...r, similarityScore: Math.random() * 0.5 + 0.5 }));
    }

    // For each restaurant, calculate similarity with user embedding
    const scoredRestaurants = [];
    
    for (const restaurant of restaurants) {
      try {
        const restaurantText = `${restaurant.name} ${restaurant.cuisine_type} ${restaurant.description || ''} ${restaurant.location}`;
        
        const response = await this.openai.embeddings.create({
          model: this.models.embeddings,
          input: restaurantText
        });
        
        const restaurantEmbedding = response.data[0].embedding;
        const similarity = this.cosineSimilarity(userEmbedding, restaurantEmbedding);
        
        scoredRestaurants.push({
          ...restaurant,
          similarityScore: similarity
        });
        
      } catch (error) {
        console.error('Error calculating similarity for restaurant:', restaurant.id);
        scoredRestaurants.push({
          ...restaurant,
          similarityScore: 0.5
        });
      }
    }
    
    return scoredRestaurants.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  extractPersonalizedReason(aiInsights, restaurantName) {
    // Extract specific reason for this restaurant from AI insights
    const lines = aiInsights.split('\n');
    const restaurantLine = lines.find(line => line.includes(restaurantName));
    return restaurantLine || 'Matches your dining preferences and style.';
  }

  async cacheRecommendations(userId, recommendations) {
    const cacheKey = `recommendations:${userId}`;
    await this.redis.setex(cacheKey, 3600, JSON.stringify(recommendations)); // Cache for 1 hour
  }

  getFallbackRecommendations(preferences) {
    return {
      restaurants: [],
      insights: 'Unable to generate personalized recommendations at this time. Please try again later.',
      generatedAt: new Date().toISOString()
    };
  }

  async getCompetitors(restaurant) {
    const result = await this.db.query(`
      SELECT r.*, AVG(rev.rating) as avg_rating, COUNT(rev.id) as review_count
      FROM restaurants r
      LEFT JOIN reviews rev ON r.id = rev.restaurant_id
      WHERE r.cuisine_type = $1
        AND r.location ILIKE $2
        AND r.id != $3
        AND r.status = 'active'
      GROUP BY r.id
      ORDER BY avg_rating DESC, review_count DESC
      LIMIT 10
    `, [restaurant.cuisine_type, `%${restaurant.location}%`, restaurant.id]);

    return result.rows;
  }

  async analyzeMarketPosition(restaurant, competitors) {
    const avgRating = parseFloat(restaurant.avg_rating) || 0;
    const competitorRatings = competitors.map(c => parseFloat(c.avg_rating) || 0);
    const marketAvgRating = competitorRatings.reduce((a, b) => a + b, 0) / competitorRatings.length;

    return {
      ratingPosition: avgRating > marketAvgRating ? 'above_average' : 'below_average',
      marketAverage: marketAvgRating,
      restaurantRating: avgRating,
      competitorCount: competitors.length,
      pricePosition: this.analyzePricePosition(restaurant, competitors)
    };
  }

  analyzePricePosition(restaurant, competitors) {
    const priceMap = { 'budget': 1, 'moderate': 2, 'upscale': 3, 'fine_dining': 4 };
    const restaurantPrice = priceMap[restaurant.price_range] || 2;
    const competitorPrices = competitors.map(c => priceMap[c.price_range] || 2);
    const avgPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;

    if (restaurantPrice > avgPrice) return 'premium';
    if (restaurantPrice < avgPrice) return 'value';
    return 'competitive';
  }

  async generateAICompetitiveInsights(restaurant, competitors, marketAnalysis) {
    try {
      const prompt = `
        Analyze the competitive position of ${restaurant.name} in the ${restaurant.cuisine_type} market:

        Restaurant: ${restaurant.name}
        - Rating: ${restaurant.avg_rating}
        - Price Range: ${restaurant.price_range}
        - Location: ${restaurant.location}

        Market Analysis:
        - Market Average Rating: ${marketAnalysis.marketAverage}
        - Position: ${marketAnalysis.ratingPosition}
        - Price Position: ${marketAnalysis.pricePosition}

        Top Competitors:
        ${competitors.slice(0, 5).map(c => `- ${c.name}: Rating ${c.avg_rating}, Price ${c.price_range}`).join('\n')}

        Provide strategic insights on:
        1. Competitive advantages
        2. Areas for improvement
        3. Market opportunities
        4. Positioning recommendations
      `;

      const response = await this.openai.chat.completions.create({
        model: this.models.analysis,
        messages: [
          { role: 'system', content: 'You are a restaurant market analyst providing strategic competitive insights.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating competitive insights:', error);
      return 'Competitive analysis unavailable at this time.';
    }
  }

  async getHistoricalMarketData(location, timeframe) {
    const months = parseInt(timeframe.replace('m', ''));
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const result = await this.db.query(`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_restaurants,
        AVG(CASE WHEN reviews.rating IS NOT NULL THEN reviews.rating END) as avg_rating
      FROM restaurants
      LEFT JOIN reviews ON restaurants.id = reviews.restaurant_id
      WHERE restaurants.location ILIKE $1 AND restaurants.created_at >= $2
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `, [`%${location}%`, startDate]);

    return result.rows;
  }

  async getCurrentMarketIndicators(location) {
    const result = await this.db.query(`
      SELECT
        COUNT(*) as total_restaurants,
        AVG(CASE WHEN reviews.rating IS NOT NULL THEN reviews.rating END) as avg_rating,
        COUNT(DISTINCT cuisine_type) as cuisine_diversity
      FROM restaurants
      LEFT JOIN reviews ON restaurants.id = reviews.restaurant_id
      WHERE restaurants.location ILIKE $1 AND restaurants.status = 'active'
    `, [`%${location}%`]);

    return result.rows[0];
  }

  async generateMarketPredictions(historicalData, currentIndicators) {
    try {
      const prompt = `
        Based on the following market data, predict restaurant market trends:

        Historical Data (${historicalData.length} months):
        ${historicalData.map(d => `${d.month}: ${d.new_restaurants} new restaurants, avg rating ${d.avg_rating}`).join('\n')}

        Current Market:
        - Total Restaurants: ${currentIndicators.total_restaurants}
        - Average Rating: ${currentIndicators.avg_rating}
        - Cuisine Diversity: ${currentIndicators.cuisine_diversity}

        Predict:
        1. Market growth trends
        2. Quality trends
        3. Emerging opportunities
        4. Risk factors
      `;

      const response = await this.openai.chat.completions.create({
        model: this.models.analysis,
        messages: [
          { role: 'system', content: 'You are a market trend analyst specializing in restaurant industry predictions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1200
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating market predictions:', error);
      return 'Market predictions unavailable at this time.';
    }
  }

  calculatePredictionConfidence(historicalData) {
    if (historicalData.length < 3) return 'low';
    if (historicalData.length < 6) return 'medium';
    return 'high';
  }

  async gatherReportData(location, reportType) {
    const timeframes = {
      'daily': 1,
      'weekly': 7,
      'monthly': 30
    };

    const days = timeframes[reportType] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const queries = {
      newRestaurants: `SELECT COUNT(*) as count FROM restaurants WHERE location ILIKE $1 AND created_at >= $2`,
      newReviews: `SELECT COUNT(*) as count FROM reviews r JOIN restaurants rest ON r.restaurant_id = rest.id WHERE rest.location ILIKE $1 AND r.created_at >= $2`,
      avgRating: `SELECT AVG(rating) as avg FROM reviews r JOIN restaurants rest ON r.restaurant_id = rest.id WHERE rest.location ILIKE $1 AND r.created_at >= $2`,
      topCuisines: `SELECT cuisine_type, COUNT(*) as count FROM restaurants WHERE location ILIKE $1 AND created_at >= $2 GROUP BY cuisine_type ORDER BY count DESC LIMIT 5`
    };

    const data = {};
    for (const [key, query] of Object.entries(queries)) {
      const result = await this.db.query(query, [`%${location}%`, startDate]);
      data[key] = key === 'topCuisines' ? result.rows : result.rows[0];
    }

    return data;
  }

  async generateAIReport(reportData, reportType) {
    try {
      const prompt = `
        Generate a ${reportType} restaurant market report with the following data:

        New Restaurants: ${reportData.newRestaurants.count}
        New Reviews: ${reportData.newReviews.count}
        Average Rating: ${reportData.avgRating.avg}

        Top Cuisines:
        ${reportData.topCuisines.map(c => `- ${c.cuisine_type}: ${c.count} restaurants`).join('\n')}

        Provide insights on:
        1. Market activity summary
        2. Quality trends
        3. Popular cuisine trends
        4. Recommendations for restaurant owners
      `;

      const response = await this.openai.chat.completions.create({
        model: this.models.analysis,
        messages: [
          { role: 'system', content: 'You are a restaurant market analyst creating comprehensive market reports.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      return {
        type: reportType,
        data: reportData,
        insights: response.choices[0].message.content,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating AI report:', error);
      return {
        type: reportType,
        data: reportData,
        insights: 'Report generation unavailable at this time.',
        generatedAt: new Date().toISOString()
      };
    }
  }

  async saveReport(userId, report, reportType) {
    await this.db.query(`
      INSERT INTO market_reports (user_id, report_type, report_data, created_at)
      VALUES ($1, $2, $3, $4)
    `, [userId, reportType, JSON.stringify(report), new Date()]);
  }

  async getUserById(userId) {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  }

  async getRestaurantById(restaurantId) {
    const result = await this.db.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
    return result.rows[0] || null;
  }
}

module.exports = AIRecommendationEngine;
