// Real Wongnai API Integration
// Fetches live data from Wongnai's actual APIs

const https = require('https');
const http = require('http');
const zlib = require('zlib');

class WongnaiAPIClient {
  constructor() {
    this.baseURL = 'https://www.wongnai.com/_api';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Referer': 'https://www.wongnai.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    };
  }

  // Make HTTP request to Wongnai API
  async makeRequest(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;
      
      console.log(`🌐 Fetching from Wongnai: ${url}`);
      
      const options = {
        method: 'GET',
        headers: this.headers,
        timeout: 10000
      };

      const req = https.request(url, options, (res) => {
        let stream = res;
        
        // Handle gzip compression
        if (res.headers['content-encoding'] === 'gzip') {
          stream = res.pipe(zlib.createGunzip());
        } else if (res.headers['content-encoding'] === 'deflate') {
          stream = res.pipe(zlib.createInflate());
        } else if (res.headers['content-encoding'] === 'br') {
          stream = res.pipe(zlib.createBrotliDecompress());
        }
        
        let data = '';
        
        stream.on('data', (chunk) => {
          data += chunk;
        });
        
        stream.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            console.log(`✅ Wongnai API response received (${res.statusCode})`);
            resolve(jsonData);
          } catch (error) {
            console.error('❌ Failed to parse Wongnai response:', error.message);
            console.error('Raw response:', data.substring(0, 200));
            reject(new Error('Invalid JSON response from Wongnai'));
          }
        });
        
        stream.on('error', (error) => {
          console.error('❌ Stream error:', error.message);
          reject(error);
        });
      });

      req.on('error', (error) => {
        console.error('❌ Wongnai API request failed:', error.message);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Wongnai API request timeout'));
      });

      req.end();
    });
  }

  // Get businesses (restaurants) from Wongnai
  async getBusinesses(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        size: filters.size || 20
      };

      // Add location filter if provided
      if (filters.location) {
        params.location = filters.location;
      }

      // Add cuisine filter if provided
      if (filters.cuisine) {
        params.categoryId = this.getCuisineId(filters.cuisine);
      }

      // Add price range filter if provided
      if (filters.priceRange) {
        params.priceRange = filters.priceRange;
      }

      const response = await this.makeRequest('/businesses', params);
      
      // Transform response to include BiteBase enhancements
      return this.enhanceBusinessesResponse(response, filters);
    } catch (error) {
      console.error('❌ Failed to fetch businesses from Wongnai:', error.message);
      throw error;
    }
  }

  // Get restaurant delivery menu from Wongnai
  async getRestaurantDeliveryMenu(publicId) {
    try {
      const response = await this.makeRequest(`/restaurants/${publicId}/delivery-menu`);
      
      // Transform response to include BiteBase enhancements
      return this.enhanceMenuResponse(response, publicId);
    } catch (error) {
      console.error(`❌ Failed to fetch menu for ${publicId} from Wongnai:`, error.message);
      throw error;
    }
  }

  // Get single restaurant details
  async getRestaurantDetails(publicId) {
    try {
      const response = await this.makeRequest(`/restaurants/${publicId}`);
      return this.enhanceRestaurantResponse(response);
    } catch (error) {
      console.error(`❌ Failed to fetch restaurant ${publicId} from Wongnai:`, error.message);
      throw error;
    }
  }

  // Map cuisine names to Wongnai category IDs
  getCuisineId(cuisine) {
    const cuisineMap = {
      'Italian': 15,
      'Japanese': 8,
      'Mexican': 25,
      'French': 16,
      'American': 20,
      'Thai': 1,
      'Chinese': 2,
      'Korean': 9,
      'Indian': 18,
      'Cafe': 59
    };
    return cuisineMap[cuisine] || null;
  }

  // Enhance businesses response with BiteBase features
  enhanceBusinessesResponse(wongnaiResponse, filters) {
    if (!wongnaiResponse || !wongnaiResponse.page) {
      return {
        page: {
          pageInformation: { number: 1, size: 0 },
          first: 1,
          last: 0,
          totalNumberOfPages: 0,
          totalNumberOfEntities: 0,
          entities: []
        },
        bitebaseEnhancements: {
          mcpEnabled: true,
          aiRecommendations: [],
          searchFilters: filters,
          dataSource: 'wongnai-live'
        }
      };
    }

    // Add BiteBase enhancements to each restaurant
    const enhancedEntities = wongnaiResponse.page.entities.map(restaurant => {
      return {
        ...restaurant,
        bitebaseEnhancements: {
          mcpAnalysis: this.generateMCPAnalysis(restaurant),
          aiRecommendationScore: this.calculateRecommendationScore(restaurant),
          deliveryOptimized: restaurant.pickupInformation?.available || false,
          popularityTrend: this.calculatePopularityTrend(restaurant),
          priceEfficiency: this.calculatePriceEfficiency(restaurant)
        }
      };
    });

    return {
      ...wongnaiResponse,
      page: {
        ...wongnaiResponse.page,
        entities: enhancedEntities
      },
      bitebaseEnhancements: {
        mcpEnabled: true,
        totalRestaurants: wongnaiResponse.page.totalNumberOfEntities,
        aiRecommendations: this.generateAIRecommendations(enhancedEntities),
        searchFilters: filters,
        dataSource: 'wongnai-live',
        enhancedAt: new Date().toISOString()
      }
    };
  }

  // Enhance menu response with BiteBase features
  enhanceMenuResponse(wongnaiResponse, publicId) {
    return {
      ...wongnaiResponse,
      bitebaseEnhancements: {
        mcpEnabled: true,
        aiMenuAnalysis: this.generateMenuAnalysis(wongnaiResponse),
        nutritionEstimates: this.generateNutritionEstimates(wongnaiResponse),
        recommendedItems: this.getRecommendedMenuItems(wongnaiResponse),
        priceAnalysis: this.analyzeMenuPricing(wongnaiResponse),
        dataSource: 'wongnai-live',
        enhancedAt: new Date().toISOString()
      }
    };
  }

  // Enhance single restaurant response
  enhanceRestaurantResponse(wongnaiResponse) {
    return {
      ...wongnaiResponse,
      bitebaseEnhancements: {
        mcpEnabled: true,
        aiInsights: this.generateRestaurantInsights(wongnaiResponse),
        competitorAnalysis: this.generateCompetitorAnalysis(wongnaiResponse),
        marketPosition: this.calculateMarketPosition(wongnaiResponse),
        dataSource: 'wongnai-live',
        enhancedAt: new Date().toISOString()
      }
    };
  }

  // Generate MCP analysis for restaurant
  generateMCPAnalysis(restaurant) {
    return {
      qualityScore: Math.min(100, (restaurant.rating || 0) * 20),
      popularityScore: Math.min(100, (restaurant.statistic?.numberOfReviews || 0) / 10),
      valueScore: this.calculateValueScore(restaurant),
      serviceScore: restaurant.features?.length * 10 || 50,
      overallScore: Math.round(((restaurant.rating || 0) * 20 + 50) / 2)
    };
  }

  // Calculate recommendation score
  calculateRecommendationScore(restaurant) {
    const rating = restaurant.rating || 0;
    const reviews = restaurant.statistic?.numberOfReviews || 0;
    const features = restaurant.features?.length || 0;
    
    return Math.min(1.0, (rating / 5) * 0.5 + (Math.min(reviews, 100) / 100) * 0.3 + (features / 10) * 0.2);
  }

  // Calculate popularity trend
  calculatePopularityTrend(restaurant) {
    const reviews = restaurant.statistic?.numberOfReviews || 0;
    const bookmarks = restaurant.statistic?.numberOfBookmarks || 0;
    
    if (reviews > 100 && restaurant.rating > 4.0) return 'trending_up';
    if (reviews > 50) return 'stable';
    if (reviews < 10) return 'new';
    return 'stable';
  }

  // Calculate price efficiency
  calculatePriceEfficiency(restaurant) {
    const rating = restaurant.rating || 0;
    const priceValue = restaurant.priceRange?.value || 2;
    
    return Math.round((rating / priceValue) * 20);
  }

  // Calculate value score
  calculateValueScore(restaurant) {
    const rating = restaurant.rating || 0;
    const priceRange = restaurant.priceRange?.value || 2;
    
    // Higher rating with lower price = better value
    return Math.round((rating / Math.max(priceRange, 1)) * 25);
  }

  // Generate AI recommendations
  generateAIRecommendations(restaurants) {
    return restaurants
      .filter(r => r.bitebaseEnhancements.aiRecommendationScore > 0.7)
      .slice(0, 3)
      .map(r => ({
        publicId: r.publicId,
        name: r.name,
        reason: `Highly rated ${r.categories?.[0]?.internationalName || 'restaurant'} with excellent reviews`,
        score: r.bitebaseEnhancements.aiRecommendationScore,
        highlights: [
          `${r.rating}/5 rating`,
          `${r.statistic?.numberOfReviews || 0} reviews`,
          r.priceRange?.name || 'Good value'
        ]
      }));
  }

  // Generate menu analysis
  generateMenuAnalysis(menuResponse) {
    if (!menuResponse.menu?.items) {
      return { itemCount: 0, categories: 0, averagePrice: 0 };
    }

    const items = menuResponse.menu.items;
    const categories = new Set(items.map(item => item.categoryId)).size;
    const averagePrice = items.reduce((sum, item) => sum + (item.price || 0), 0) / items.length;

    return {
      itemCount: items.length,
      categories: categories,
      averagePrice: Math.round(averagePrice),
      priceRange: {
        min: Math.min(...items.map(item => item.price || 0)),
        max: Math.max(...items.map(item => item.price || 0))
      }
    };
  }

  // Generate nutrition estimates
  generateNutritionEstimates(menuResponse) {
    // This would integrate with nutrition APIs in production
    return {
      healthyOptions: Math.floor(Math.random() * 5) + 1,
      vegetarianOptions: Math.floor(Math.random() * 3) + 1,
      lowCalorieOptions: Math.floor(Math.random() * 4) + 1
    };
  }

  // Get recommended menu items
  getRecommendedMenuItems(menuResponse) {
    if (!menuResponse.menu?.items) return [];
    
    return menuResponse.menu.items
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 3)
      .map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        reason: 'Popular choice among customers'
      }));
  }

  // Analyze menu pricing
  analyzeMenuPricing(menuResponse) {
    if (!menuResponse.menu?.items) {
      return { competitive: true, averagePrice: 0 };
    }

    const averagePrice = menuResponse.menu.items.reduce((sum, item) => sum + (item.price || 0), 0) / menuResponse.menu.items.length;
    
    return {
      competitive: averagePrice < 300, // Competitive if under 300 THB average
      averagePrice: Math.round(averagePrice),
      recommendation: averagePrice < 200 ? 'budget_friendly' : averagePrice < 400 ? 'moderate' : 'premium'
    };
  }

  // Generate restaurant insights
  generateRestaurantInsights(restaurant) {
    return {
      strengths: [
        restaurant.rating > 4.0 ? 'High customer satisfaction' : null,
        restaurant.statistic?.numberOfReviews > 50 ? 'Well-established reputation' : null,
        restaurant.features?.includes('delivery') ? 'Delivery available' : null
      ].filter(Boolean),
      opportunities: [
        restaurant.statistic?.numberOfPhotos < 10 ? 'Add more photos' : null,
        !restaurant.features?.includes('delivery') ? 'Consider delivery service' : null
      ].filter(Boolean)
    };
  }

  // Generate competitor analysis
  generateCompetitorAnalysis(restaurant) {
    return {
      marketPosition: restaurant.rating > 4.0 ? 'leader' : restaurant.rating > 3.5 ? 'competitive' : 'challenger',
      differentiators: restaurant.features || [],
      competitiveAdvantages: [
        restaurant.rating > 4.0 ? 'Superior rating' : null,
        restaurant.priceRange?.value < 3 ? 'Competitive pricing' : null
      ].filter(Boolean)
    };
  }

  // Calculate market position
  calculateMarketPosition(restaurant) {
    const rating = restaurant.rating || 0;
    const reviews = restaurant.statistic?.numberOfReviews || 0;
    
    if (rating > 4.5 && reviews > 100) return 'market_leader';
    if (rating > 4.0 && reviews > 50) return 'strong_competitor';
    if (rating > 3.5) return 'average_performer';
    return 'needs_improvement';
  }
}

module.exports = WongnaiAPIClient;