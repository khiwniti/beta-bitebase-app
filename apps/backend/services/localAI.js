/**
 * Local AI Service with MPC Integration
 * Provides advanced AI capabilities without external API dependencies
 * Supports Ollama, vLLM, and custom model deployments
 */

const axios = require('axios');
const { Pool } = require('pg');
const Redis = require('redis');
const fs = require('fs').promises;
const path = require('path');

class LocalAIService {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    this.redis = Redis.createClient({
      url: process.env.REDIS_URL
    });
    
    this.redis.connect().catch(console.error);

    // AI Model configurations
    this.models = {
      // Ollama models
      ollama: {
        baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        models: {
          'llama3.1': 'llama3.1:8b',
          'mistral': 'mistral:7b',
          'codellama': 'codellama:13b',
          'neural-chat': 'neural-chat:7b',
          'phi3': 'phi3:mini'
        }
      },
      
      // vLLM models
      vllm: {
        baseUrl: process.env.VLLM_BASE_URL || 'http://localhost:8000',
        models: {
          'llama3.1-8b': 'meta-llama/Meta-Llama-3.1-8B-Instruct',
          'mistral-7b': 'mistralai/Mistral-7B-Instruct-v0.3',
          'qwen2-7b': 'Qwen/Qwen2-7B-Instruct',
          'gemma2-9b': 'google/gemma-2-9b-it'
        }
      },

      // MPC Server models
      mpc: {
        baseUrl: process.env.MPC_SERVER_URL || 'http://localhost:9000',
        models: {
          'ensemble': 'ensemble-model',
          'restaurant-specialist': 'restaurant-domain-model',
          'market-analyst': 'market-analysis-model',
          'recommendation-engine': 'recommendation-model'
        }
      }
    };

    // Model routing for different tasks
    this.taskModels = {
      'restaurant-recommendation': ['mpc.restaurant-specialist', 'ollama.llama3.1', 'vllm.llama3.1-8b'],
      'market-analysis': ['mpc.market-analyst', 'vllm.qwen2-7b', 'ollama.mistral'],
      'competitive-analysis': ['mpc.ensemble', 'vllm.gemma2-9b', 'ollama.neural-chat'],
      'trend-prediction': ['mpc.market-analyst', 'vllm.llama3.1-8b', 'ollama.llama3.1'],
      'content-generation': ['ollama.codellama', 'vllm.mistral-7b', 'ollama.phi3'],
      'data-analysis': ['mpc.ensemble', 'vllm.qwen2-7b', 'ollama.mistral']
    };

    // Initialize model health monitoring
    this.initializeHealthMonitoring();
  }

  // Enhanced AI recommendation with ensemble approach
  async generateAdvancedRecommendations(userId, preferences = {}, context = {}) {
    try {
      // Get user profile and history
      const userProfile = await this.getUserProfile(userId);
      const userHistory = await this.getUserHistory(userId);
      const restaurantData = await this.getRestaurantData(preferences);

      // Use ensemble of models for better accuracy
      const models = this.taskModels['restaurant-recommendation'];
      const recommendations = [];

      for (const modelId of models) {
        try {
          const result = await this.queryModel(modelId, {
            task: 'restaurant-recommendation',
            userProfile,
            userHistory,
            restaurantData,
            preferences,
            context
          });
          
          if (result && result.recommendations) {
            recommendations.push({
              model: modelId,
              recommendations: result.recommendations,
              confidence: result.confidence || 0.8,
              reasoning: result.reasoning
            });
          }
        } catch (error) {
          console.warn(`Model ${modelId} failed:`, error.message);
        }
      }

      // Ensemble the results
      const finalRecommendations = await this.ensembleRecommendations(recommendations);
      
      // Cache the results
      await this.cacheRecommendations(userId, finalRecommendations);

      return {
        recommendations: finalRecommendations,
        metadata: {
          modelsUsed: recommendations.map(r => r.model),
          ensembleConfidence: this.calculateEnsembleConfidence(recommendations),
          generatedAt: new Date().toISOString(),
          processingTime: Date.now() - Date.now()
        }
      };

    } catch (error) {
      console.error('Error generating advanced recommendations:', error);
      return this.getFallbackRecommendations(preferences);
    }
  }

  // Advanced market analysis with MPC integration
  async generateMarketIntelligence(location, timeframe = '6m', analysisType = 'comprehensive') {
    try {
      // Gather comprehensive market data
      const marketData = await this.gatherMarketData(location, timeframe);
      const competitorData = await this.getCompetitorData(location);
      const trendData = await this.getTrendData(location, timeframe);

      // Use specialized models for different aspects
      const analyses = await Promise.allSettled([
        this.queryModel('mpc.market-analyst', {
          task: 'market-overview',
          data: marketData,
          location,
          timeframe
        }),
        this.queryModel('vllm.qwen2-7b', {
          task: 'competitive-landscape',
          data: competitorData,
          location
        }),
        this.queryModel('ollama.mistral', {
          task: 'trend-analysis',
          data: trendData,
          timeframe
        })
      ]);

      // Combine insights from multiple models
      const marketIntelligence = await this.synthesizeMarketAnalysis(analyses);

      return {
        intelligence: marketIntelligence,
        confidence: this.calculateAnalysisConfidence(analyses),
        dataPoints: marketData.length + competitorData.length + trendData.length,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating market intelligence:', error);
      throw error;
    }
  }

  // Query specific AI model
  async queryModel(modelId, payload) {
    const [provider, model] = modelId.split('.');
    
    switch (provider) {
      case 'ollama':
        return await this.queryOllama(model, payload);
      case 'vllm':
        return await this.queryVLLM(model, payload);
      case 'mpc':
        return await this.queryMPC(model, payload);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  // Ollama integration
  async queryOllama(model, payload) {
    try {
      const modelName = this.models.ollama.models[model];
      if (!modelName) {
        throw new Error(`Ollama model ${model} not configured`);
      }

      const prompt = this.createPrompt(payload);
      
      const response = await axios.post(`${this.models.ollama.baseUrl}/api/generate`, {
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          num_predict: 2048
        }
      }, {
        timeout: 60000
      });

      return this.parseModelResponse(response.data.response, payload.task);

    } catch (error) {
      console.error(`Ollama query error for model ${model}:`, error.message);
      throw error;
    }
  }

  // vLLM integration
  async queryVLLM(model, payload) {
    try {
      const modelName = this.models.vllm.models[model];
      if (!modelName) {
        throw new Error(`vLLM model ${model} not configured`);
      }

      const prompt = this.createPrompt(payload);
      
      const response = await axios.post(`${this.models.vllm.baseUrl}/v1/completions`, {
        model: modelName,
        prompt: prompt,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }, {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const completion = response.data.choices[0].text;
      return this.parseModelResponse(completion, payload.task);

    } catch (error) {
      console.error(`vLLM query error for model ${model}:`, error.message);
      throw error;
    }
  }

  // MPC Server integration
  async queryMPC(model, payload) {
    try {
      const modelName = this.models.mpc.models[model];
      if (!modelName) {
        throw new Error(`MPC model ${model} not configured`);
      }

      const response = await axios.post(`${this.models.mpc.baseUrl}/inference`, {
        model: modelName,
        task: payload.task,
        data: payload,
        privacy_level: 'high',
        ensemble: true
      }, {
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json',
          'X-Privacy-Mode': 'enabled'
        }
      });

      return response.data;

    } catch (error) {
      console.error(`MPC query error for model ${model}:`, error.message);
      throw error;
    }
  }

  // Create optimized prompts for different tasks
  createPrompt(payload) {
    const { task, userProfile, userHistory, restaurantData, preferences, context } = payload;

    const prompts = {
      'restaurant-recommendation': `
        You are an expert restaurant recommendation AI. Analyze the following data and provide personalized restaurant recommendations.

        User Profile:
        - Account Type: ${userProfile?.account_type || 'individual'}
        - Experience Level: ${userProfile?.experience_level || 'intermediate'}
        - Budget Range: ${userProfile?.budget_range || 'moderate'}
        - Location: ${userProfile?.location || 'Bangkok'}

        User Preferences:
        ${JSON.stringify(preferences, null, 2)}

        Recent Activity:
        ${userHistory?.slice(0, 10).map(h => `- ${h.event_name}: ${JSON.stringify(h.properties)}`).join('\n') || 'No recent activity'}

        Available Restaurants:
        ${restaurantData?.slice(0, 20).map(r => `- ${r.name}: ${r.cuisine_type}, Rating: ${r.avg_rating}, Price: ${r.price_range}, Location: ${r.location}`).join('\n') || 'No restaurants available'}

        Provide recommendations in JSON format with:
        {
          "recommendations": [
            {
              "restaurant_id": "id",
              "name": "Restaurant Name",
              "score": 0.95,
              "reasoning": "Why this restaurant matches the user",
              "highlights": ["feature1", "feature2"]
            }
          ],
          "confidence": 0.9,
          "reasoning": "Overall recommendation strategy"
        }
      `,

      'market-analysis': `
        You are a restaurant market analyst. Analyze the following market data and provide comprehensive insights.

        Market Data:
        ${JSON.stringify(payload.data, null, 2)}

        Location: ${payload.location}
        Timeframe: ${payload.timeframe}

        Provide analysis in JSON format with market trends, opportunities, and recommendations.
      `,

      'competitive-landscape': `
        Analyze the competitive landscape for restaurants in the given market.

        Competitor Data:
        ${JSON.stringify(payload.data, null, 2)}

        Provide competitive analysis with positioning, strengths, weaknesses, and market gaps.
      `,

      'trend-analysis': `
        Analyze restaurant industry trends based on the provided data.

        Trend Data:
        ${JSON.stringify(payload.data, null, 2)}

        Identify emerging trends, seasonal patterns, and future predictions.
      `
    };

    return prompts[task] || `Analyze the following data and provide insights: ${JSON.stringify(payload, null, 2)}`;
  }

  // Parse model responses into structured format
  parseModelResponse(response, task) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback parsing based on task
      switch (task) {
        case 'restaurant-recommendation':
          return this.parseRecommendationResponse(response);
        case 'market-analysis':
          return this.parseMarketAnalysisResponse(response);
        default:
          return { content: response, confidence: 0.7 };
      }

    } catch (error) {
      console.warn('Failed to parse model response:', error.message);
      return { content: response, confidence: 0.5 };
    }
  }

  // Ensemble multiple model recommendations
  async ensembleRecommendations(recommendations) {
    if (recommendations.length === 0) return [];

    // Weight recommendations by model confidence and performance history
    const weights = await this.getModelWeights(recommendations.map(r => r.model));
    
    // Aggregate recommendations
    const restaurantScores = {};
    
    recommendations.forEach((rec, index) => {
      const weight = weights[rec.model] || 0.5;
      
      rec.recommendations.forEach(restaurant => {
        const id = restaurant.restaurant_id || restaurant.id;
        if (!restaurantScores[id]) {
          restaurantScores[id] = {
            ...restaurant,
            totalScore: 0,
            weightSum: 0,
            sources: []
          };
        }
        
        restaurantScores[id].totalScore += (restaurant.score || 0.5) * weight;
        restaurantScores[id].weightSum += weight;
        restaurantScores[id].sources.push({
          model: rec.model,
          score: restaurant.score,
          reasoning: restaurant.reasoning
        });
      });
    });

    // Calculate final scores and sort
    const finalRecommendations = Object.values(restaurantScores)
      .map(restaurant => ({
        ...restaurant,
        finalScore: restaurant.totalScore / restaurant.weightSum,
        confidence: Math.min(restaurant.weightSum / recommendations.length, 1.0)
      }))
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 10);

    return finalRecommendations;
  }

  // Initialize health monitoring for AI models
  async initializeHealthMonitoring() {
    setInterval(async () => {
      await this.checkModelHealth();
    }, 60000); // Check every minute
  }

  // Check health of all AI models
  async checkModelHealth() {
    const healthStatus = {
      ollama: await this.checkOllamaHealth(),
      vllm: await this.checkVLLMHealth(),
      mpc: await this.checkMPCHealth()
    };

    await this.redis.setex('ai_model_health', 300, JSON.stringify(healthStatus));
    return healthStatus;
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
      LIMIT 50
    `, [userId]);
    return result.rows;
  }

  async getRestaurantData(preferences) {
    let query = `
      SELECT r.*, AVG(rev.rating) as avg_rating, COUNT(rev.id) as review_count
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
    
    query += ` GROUP BY r.id ORDER BY avg_rating DESC, review_count DESC LIMIT 100`;
    
    const result = await this.db.query(query, params);
    return result.rows;
  }

  async getModelWeights(models) {
    // Get historical performance weights from cache/database
    const weights = {};
    for (const model of models) {
      const cachedWeight = await this.redis.get(`model_weight:${model}`);
      weights[model] = cachedWeight ? parseFloat(cachedWeight) : 0.8;
    }
    return weights;
  }

  async cacheRecommendations(userId, recommendations) {
    const cacheKey = `local_ai_recommendations:${userId}`;
    await this.redis.setex(cacheKey, 1800, JSON.stringify(recommendations)); // Cache for 30 minutes
  }

  getFallbackRecommendations(preferences) {
    return {
      recommendations: [],
      metadata: {
        fallback: true,
        message: 'AI models unavailable, using fallback recommendations'
      }
    };
  }
}

module.exports = LocalAIService;
