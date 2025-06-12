/**
 * Intelligent AI Router
 * Routes AI requests to the best available model based on task type, performance, and availability
 */

const LocalAIService = require('./localAI');
const MPCIntegrationService = require('./mpcIntegration');
const { Pool } = require('pg');
const Redis = require('redis');

class AIRouter {
  constructor() {
    this.localAI = new LocalAIService();
    this.mpcService = new MPCIntegrationService();
    
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    this.redis = Redis.createClient({
      url: process.env.REDIS_URL
    });
    
    this.redis.connect().catch(console.error);

    // Model performance tracking
    this.modelPerformance = new Map();
    
    // Task-specific model preferences with fallbacks
    this.taskRouting = {
      'restaurant-recommendation': {
        primary: ['mpc.restaurant-specialist', 'ollama.llama3.1', 'vllm.llama3.1-8b'],
        fallback: ['ollama.mistral', 'vllm.mistral-7b'],
        requiresPrivacy: true,
        complexity: 'high',
        expectedResponseTime: 5000
      },
      'market-analysis': {
        primary: ['mpc.market-analyst', 'vllm.qwen2-7b', 'ollama.neural-chat'],
        fallback: ['ollama.mistral', 'vllm.mistral-7b'],
        requiresPrivacy: false,
        complexity: 'high',
        expectedResponseTime: 8000
      },
      'competitive-analysis': {
        primary: ['mpc.competitive-analyzer', 'vllm.gemma2-9b', 'ollama.llama3.1'],
        fallback: ['ollama.mistral', 'vllm.qwen2-7b'],
        requiresPrivacy: true,
        complexity: 'very-high',
        expectedResponseTime: 10000
      },
      'trend-prediction': {
        primary: ['mpc.market-analyst', 'vllm.llama3.1-8b', 'ollama.llama3.1'],
        fallback: ['ollama.mistral', 'vllm.mistral-7b'],
        requiresPrivacy: false,
        complexity: 'high',
        expectedResponseTime: 7000
      },
      'content-generation': {
        primary: ['ollama.codellama', 'vllm.mistral-7b', 'ollama.phi3'],
        fallback: ['ollama.mistral', 'vllm.qwen2-7b'],
        requiresPrivacy: false,
        complexity: 'medium',
        expectedResponseTime: 3000
      },
      'data-analysis': {
        primary: ['mpc.ensemble', 'vllm.qwen2-7b', 'ollama.neural-chat'],
        fallback: ['ollama.mistral', 'vllm.mistral-7b'],
        requiresPrivacy: true,
        complexity: 'high',
        expectedResponseTime: 6000
      },
      'customer-insights': {
        primary: ['mpc.customer-insights', 'vllm.gemma2-9b'],
        fallback: ['ollama.neural-chat', 'vllm.qwen2-7b'],
        requiresPrivacy: true,
        complexity: 'very-high',
        expectedResponseTime: 12000
      },
      'quick-query': {
        primary: ['ollama.phi3', 'vllm.mistral-7b', 'ollama.mistral'],
        fallback: ['ollama.neural-chat'],
        requiresPrivacy: false,
        complexity: 'low',
        expectedResponseTime: 2000
      }
    };

    // Initialize performance monitoring
    this.initializePerformanceTracking();
  }

  // Main routing function - intelligently selects best model
  async routeAIRequest(task, payload, options = {}) {
    try {
      const startTime = Date.now();
      
      // Get task configuration
      const taskConfig = this.taskRouting[task];
      if (!taskConfig) {
        throw new Error(`Unknown task type: ${task}`);
      }

      // Determine privacy requirements
      const privacyLevel = this.determinePrivacyLevel(payload, taskConfig, options);
      
      // Get available models with current performance metrics
      const availableModels = await this.getAvailableModels(taskConfig, privacyLevel);
      
      // Select optimal model based on performance, availability, and task requirements
      const selectedModel = await this.selectOptimalModel(availableModels, taskConfig, payload);
      
      if (!selectedModel) {
        throw new Error('No suitable AI models available');
      }

      // Execute the AI request
      const result = await this.executeAIRequest(selectedModel, task, payload, privacyLevel);
      
      // Track performance
      await this.trackModelPerformance(selectedModel, task, Date.now() - startTime, true);
      
      return {
        result: result,
        metadata: {
          modelUsed: selectedModel.id,
          modelType: selectedModel.type,
          privacyLevel: privacyLevel,
          responseTime: Date.now() - startTime,
          taskComplexity: taskConfig.complexity,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error(`AI routing error for task ${task}:`, error);
      
      // Try fallback models
      const fallbackResult = await this.tryFallbackModels(task, payload, options);
      if (fallbackResult) {
        return fallbackResult;
      }
      
      throw error;
    }
  }

  // Enhanced restaurant recommendations with ensemble approach
  async getRestaurantRecommendations(userId, preferences = {}, options = {}) {
    try {
      // Use ensemble approach for critical recommendations
      if (options.useEnsemble !== false) {
        return await this.getEnsembleRecommendations(userId, preferences, options);
      }

      // Single model approach
      const payload = {
        userId: userId,
        preferences: preferences,
        context: options.context || {},
        requireHighAccuracy: true
      };

      return await this.routeAIRequest('restaurant-recommendation', payload, {
        privacyLevel: 'high',
        timeout: 10000
      });

    } catch (error) {
      console.error('Error getting restaurant recommendations:', error);
      return this.getFallbackRecommendations(preferences);
    }
  }

  // Ensemble recommendations using multiple models
  async getEnsembleRecommendations(userId, preferences, options) {
    try {
      const taskConfig = this.taskRouting['restaurant-recommendation'];
      const availableModels = await this.getAvailableModels(taskConfig, 'high');
      
      // Use top 3 models for ensemble
      const ensembleModels = availableModels.slice(0, 3);
      
      if (ensembleModels.length < 2) {
        // Fall back to single model
        return await this.routeAIRequest('restaurant-recommendation', {
          userId, preferences, context: options.context || {}
        });
      }

      // Execute parallel requests
      const ensemblePromises = ensembleModels.map(async (model) => {
        try {
          const result = await this.executeAIRequest(model, 'restaurant-recommendation', {
            userId, preferences, context: options.context || {}
          }, 'high');
          
          return {
            model: model.id,
            result: result,
            weight: model.performanceScore || 0.8
          };
        } catch (error) {
          console.warn(`Ensemble model ${model.id} failed:`, error.message);
          return null;
        }
      });

      const ensembleResults = (await Promise.allSettled(ensemblePromises))
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);

      if (ensembleResults.length === 0) {
        throw new Error('All ensemble models failed');
      }

      // Combine results intelligently
      const combinedResult = await this.combineEnsembleResults(ensembleResults, 'restaurant-recommendation');
      
      return {
        result: combinedResult,
        metadata: {
          ensembleModels: ensembleResults.map(r => r.model),
          ensembleSize: ensembleResults.length,
          combinationMethod: 'weighted_average',
          confidence: this.calculateEnsembleConfidence(ensembleResults),
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Ensemble recommendations failed:', error);
      throw error;
    }
  }

  // Advanced market intelligence with multi-model analysis
  async getMarketIntelligence(location, timeframe, analysisType = 'comprehensive') {
    try {
      const payload = {
        location: location,
        timeframe: timeframe,
        analysisType: analysisType,
        requiresDeepAnalysis: true
      };

      // For comprehensive analysis, use multiple specialized models
      if (analysisType === 'comprehensive') {
        return await this.getComprehensiveMarketAnalysis(payload);
      }

      return await this.routeAIRequest('market-analysis', payload, {
        privacyLevel: 'medium',
        timeout: 15000
      });

    } catch (error) {
      console.error('Error getting market intelligence:', error);
      throw error;
    }
  }

  // Comprehensive market analysis using specialized models
  async getComprehensiveMarketAnalysis(payload) {
    try {
      // Use different models for different aspects of analysis
      const analysisPromises = [
        this.routeAIRequest('market-analysis', { ...payload, focus: 'trends' }),
        this.routeAIRequest('competitive-analysis', { ...payload, focus: 'competition' }),
        this.routeAIRequest('trend-prediction', { ...payload, focus: 'predictions' })
      ];

      const results = await Promise.allSettled(analysisPromises);
      const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulResults.length === 0) {
        throw new Error('All market analysis models failed');
      }

      // Synthesize comprehensive analysis
      const comprehensiveAnalysis = await this.synthesizeMarketAnalysis(successfulResults);
      
      return {
        result: comprehensiveAnalysis,
        metadata: {
          analysisComponents: successfulResults.length,
          modelsUsed: successfulResults.map(r => r.metadata.modelUsed),
          comprehensiveScore: this.calculateComprehensiveScore(successfulResults),
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Comprehensive market analysis failed:', error);
      throw error;
    }
  }

  // Execute AI request on selected model
  async executeAIRequest(model, task, payload, privacyLevel) {
    const [provider, modelName] = model.id.split('.');
    
    switch (provider) {
      case 'mpc':
        return await this.mpcService.computeRestaurantIntelligence(payload, privacyLevel);
      
      case 'ollama':
      case 'vllm':
        return await this.localAI.queryModel(model.id, {
          task: task,
          ...payload
        });
      
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  }

  // Select optimal model based on performance and requirements
  async selectOptimalModel(availableModels, taskConfig, payload) {
    if (availableModels.length === 0) {
      return null;
    }

    // Score models based on multiple factors
    const scoredModels = await Promise.all(
      availableModels.map(async (model) => {
        const score = await this.calculateModelScore(model, taskConfig, payload);
        return { ...model, score };
      })
    );

    // Sort by score and return best model
    scoredModels.sort((a, b) => b.score - a.score);
    return scoredModels[0];
  }

  // Calculate model score based on performance, availability, and task fit
  async calculateModelScore(model, taskConfig, payload) {
    let score = 0;

    // Base score from model type preference
    const preferenceIndex = taskConfig.primary.indexOf(model.id);
    if (preferenceIndex !== -1) {
      score += (taskConfig.primary.length - preferenceIndex) * 20;
    }

    // Performance score
    const performanceData = await this.getModelPerformance(model.id);
    score += (performanceData.successRate || 0.8) * 30;
    score += Math.max(0, 20 - (performanceData.avgResponseTime || 5000) / 250);

    // Availability score
    if (model.available) {
      score += 20;
    }

    // Load balancing - prefer less loaded models
    const currentLoad = await this.getModelLoad(model.id);
    score += Math.max(0, 10 - currentLoad * 2);

    // Privacy compliance
    if (taskConfig.requiresPrivacy && model.id.startsWith('mpc.')) {
      score += 15;
    }

    return Math.max(0, score);
  }

  // Get available models with current status
  async getAvailableModels(taskConfig, privacyLevel) {
    const allModels = [...taskConfig.primary, ...taskConfig.fallback];
    const modelStatus = await this.checkModelAvailability(allModels);
    
    return allModels
      .map(modelId => ({
        id: modelId,
        type: modelId.split('.')[0],
        available: modelStatus[modelId] || false,
        performanceScore: this.modelPerformance.get(modelId)?.score || 0.8
      }))
      .filter(model => model.available);
  }

  // Check availability of all models
  async checkModelAvailability(modelIds) {
    const availability = {};
    
    for (const modelId of modelIds) {
      try {
        const [provider] = modelId.split('.');
        
        switch (provider) {
          case 'ollama':
            availability[modelId] = await this.checkOllamaModel(modelId);
            break;
          case 'vllm':
            availability[modelId] = await this.checkVLLMModel(modelId);
            break;
          case 'mpc':
            availability[modelId] = await this.checkMPCModel(modelId);
            break;
          default:
            availability[modelId] = false;
        }
      } catch (error) {
        availability[modelId] = false;
      }
    }
    
    return availability;
  }

  // Performance tracking and monitoring
  async trackModelPerformance(model, task, responseTime, success) {
    const key = `${model.id}:${task}`;
    const performance = this.modelPerformance.get(key) || {
      totalRequests: 0,
      successfulRequests: 0,
      totalResponseTime: 0,
      lastUpdated: Date.now()
    };

    performance.totalRequests++;
    if (success) {
      performance.successfulRequests++;
    }
    performance.totalResponseTime += responseTime;
    performance.avgResponseTime = performance.totalResponseTime / performance.totalRequests;
    performance.successRate = performance.successfulRequests / performance.totalRequests;
    performance.lastUpdated = Date.now();

    this.modelPerformance.set(key, performance);
    
    // Cache in Redis
    await this.redis.setex(`model_perf:${key}`, 3600, JSON.stringify(performance));
  }

  // Initialize performance tracking
  async initializePerformanceTracking() {
    // Load cached performance data
    const keys = await this.redis.keys('model_perf:*');
    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const modelKey = key.replace('model_perf:', '');
        this.modelPerformance.set(modelKey, JSON.parse(data));
      }
    }

    // Start periodic performance cleanup
    setInterval(() => {
      this.cleanupOldPerformanceData();
    }, 3600000); // Every hour
  }

  // Helper methods
  determinePrivacyLevel(payload, taskConfig, options) {
    if (options.privacyLevel) return options.privacyLevel;
    if (taskConfig.requiresPrivacy) return 'high';
    if (payload.userId || payload.personalData) return 'medium';
    return 'low';
  }

  async getModelPerformance(modelId) {
    const cached = await this.redis.get(`model_perf:${modelId}`);
    if (cached) {
      return JSON.parse(cached);
    }
    return { successRate: 0.8, avgResponseTime: 5000 };
  }

  async getModelLoad(modelId) {
    const load = await this.redis.get(`model_load:${modelId}`);
    return load ? parseInt(load) : 0;
  }

  getFallbackRecommendations(preferences) {
    return {
      result: {
        recommendations: [],
        message: 'AI models temporarily unavailable'
      },
      metadata: {
        fallback: true,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = AIRouter;
