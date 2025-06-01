/**
 * market-analysis service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::market-analysis.market-analysis', ({ strapi }) => ({
  // Run comprehensive market analysis
  async runAnalysis(analysisId: string, params: {
    latitude: number;
    longitude: number;
    radius: number;
    analysisType: string;
    targetCuisine?: string;
  }) {
    const { latitude, longitude, radius, analysisType, targetCuisine } = params;

    try {
      // Get nearby restaurants
      const nearbyRestaurants = await strapi.service('api::restaurant.restaurant')
        .findNearby(latitude, longitude, radius);

      // Run different types of analysis based on type
      let results: any = {};

      switch (analysisType) {
        case 'market-opportunity':
          results = await this.analyzeMarketOpportunity(latitude, longitude, radius, nearbyRestaurants);
          break;
        case 'competition':
          results = await this.analyzeCompetition(latitude, longitude, radius, nearbyRestaurants, targetCuisine);
          break;
        case 'demographics':
          results = await this.analyzeDemographics(latitude, longitude, radius);
          break;
        case 'comprehensive':
          results = await this.runComprehensiveAnalysis(latitude, longitude, radius, nearbyRestaurants, targetCuisine);
          break;
        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }

      return results;
    } catch (error) {
      strapi.log.error('Error running market analysis:', error);
      throw error;
    }
  },

  // Analyze market opportunity
  async analyzeMarketOpportunity(latitude: number, longitude: number, radius: number, restaurants: any[]) {
    const restaurantDensity = restaurants.length / (Math.PI * radius * radius);
    const averageRating = restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / restaurants.length || 0;
    
    // Calculate opportunity score (simplified algorithm)
    let opportunityScore = 10;
    
    // Reduce score based on density
    if (restaurantDensity > 5) opportunityScore -= 3;
    else if (restaurantDensity > 2) opportunityScore -= 1;
    
    // Adjust based on average rating
    if (averageRating < 3.5) opportunityScore += 1;
    else if (averageRating > 4.5) opportunityScore -= 1;

    // Generate recommendations
    const recommendations = [];
    if (restaurantDensity < 2) {
      recommendations.push('Low competition area - excellent opportunity for new restaurant');
    }
    if (averageRating < 4.0) {
      recommendations.push('Room for improvement in service quality - focus on customer experience');
    }

    return {
      opportunityScore: Math.max(1, Math.min(10, opportunityScore)),
      competitionLevel: restaurantDensity > 3 ? 'high' : restaurantDensity > 1 ? 'medium' : 'low',
      estimatedRevenue: this.calculateRevenueEstimate(restaurantDensity, averageRating),
      recommendations,
      results: {
        restaurantCount: restaurants.length,
        restaurantDensity,
        averageRating,
        analysisArea: Math.PI * radius * radius,
      }
    };
  },

  // Analyze competition
  async analyzeCompetition(latitude: number, longitude: number, radius: number, restaurants: any[], targetCuisine?: string) {
    let competitors = restaurants;
    if (targetCuisine) {
      competitors = restaurants.filter(r => 
        r.cuisine.toLowerCase() === targetCuisine.toLowerCase()
      );
    }

    const cuisineDistribution = restaurants.reduce((acc, restaurant) => {
      const cuisine = restaurant.cuisine;
      acc[cuisine] = (acc[cuisine] || 0) + 1;
      return acc;
    }, {});

    const competitionLevel = competitors.length > 5 ? 'high' : competitors.length > 2 ? 'medium' : 'low';
    
    const recommendations = [];
    if (competitors.length <= 2) {
      recommendations.push('Low direct competition - good market entry opportunity');
    }
    
    // Find underrepresented cuisines
    const underrepresented = Object.entries(cuisineDistribution)
      .filter(([_, count]) => (count as number) <= 1)
      .map(([cuisine, _]) => cuisine);
    
    if (underrepresented.length > 0) {
      recommendations.push(`Consider these underrepresented cuisines: ${underrepresented.join(', ')}`);
    }

    return {
      competitionLevel,
      directCompetitors: competitors.length,
      totalRestaurants: restaurants.length,
      cuisineDistribution,
      recommendations,
      results: {
        competitorAnalysis: competitors.map(c => ({
          name: c.name,
          cuisine: c.cuisine,
          rating: c.rating,
          distance: c.distance,
        })),
        marketGaps: underrepresented,
      }
    };
  },

  // Analyze demographics (mock implementation)
  async analyzeDemographics(latitude: number, longitude: number, radius: number) {
    // In a real implementation, this would integrate with demographic data APIs
    const mockDemographics = {
      population: Math.floor(Math.random() * 50000) + 10000,
      medianIncome: Math.floor(Math.random() * 50000) + 40000,
      ageGroups: {
        '18-25': Math.floor(Math.random() * 20) + 10,
        '26-35': Math.floor(Math.random() * 25) + 20,
        '36-50': Math.floor(Math.random() * 20) + 15,
        '51-65': Math.floor(Math.random() * 15) + 10,
        '65+': Math.floor(Math.random() * 10) + 5,
      },
      educationLevel: {
        'high_school': Math.floor(Math.random() * 30) + 20,
        'college': Math.floor(Math.random() * 40) + 30,
        'graduate': Math.floor(Math.random() * 20) + 10,
      }
    };

    const recommendations = [];
    if (mockDemographics.medianIncome > 70000) {
      recommendations.push('High-income area - consider upscale dining options');
    }
    if (mockDemographics.ageGroups['26-35'] > 25) {
      recommendations.push('Young professional demographic - focus on quick, healthy options');
    }

    return {
      demographics: mockDemographics,
      recommendations,
      results: {
        targetDemographicMatch: Math.floor(Math.random() * 30) + 70, // 70-100%
        marketPotential: mockDemographics.medianIncome > 60000 ? 'high' : 'medium',
      }
    };
  },

  // Run comprehensive analysis
  async runComprehensiveAnalysis(latitude: number, longitude: number, radius: number, restaurants: any[], targetCuisine?: string) {
    const [opportunity, competition, demographics] = await Promise.all([
      this.analyzeMarketOpportunity(latitude, longitude, radius, restaurants),
      this.analyzeCompetition(latitude, longitude, radius, restaurants, targetCuisine),
      this.analyzeDemographics(latitude, longitude, radius),
    ]);

    // Combine all analyses
    const overallScore = (
      opportunity.opportunityScore + 
      (competition.competitionLevel === 'low' ? 8 : competition.competitionLevel === 'medium' ? 5 : 2) +
      (demographics.results.marketPotential === 'high' ? 8 : 5)
    ) / 3;

    return {
      opportunityScore: overallScore,
      competitionLevel: competition.competitionLevel,
      estimatedRevenue: opportunity.estimatedRevenue,
      recommendations: [
        ...opportunity.recommendations,
        ...competition.recommendations,
        ...demographics.recommendations,
      ],
      results: {
        opportunity: opportunity.results,
        competition: competition.results,
        demographics: demographics.results,
        overallAssessment: {
          score: overallScore,
          recommendation: overallScore > 7 ? 'Highly Recommended' : overallScore > 5 ? 'Recommended' : 'Consider Alternatives',
        }
      }
    };
  },

  // Calculate revenue estimate (simplified)
  calculateRevenueEstimate(density: number, averageRating: number): number {
    const baseRevenue = 500000; // Base annual revenue
    const densityMultiplier = Math.max(0.5, 2 - density * 0.2);
    const ratingMultiplier = averageRating / 5;
    
    return Math.floor(baseRevenue * densityMultiplier * ratingMultiplier);
  },

  // Enhance results with additional data
  async enhanceResults(analysis: any) {
    // Add real-time market trends, seasonal adjustments, etc.
    const enhanced = {
      ...analysis.results,
      marketTrends: {
        growth: Math.random() > 0.5 ? 'increasing' : 'stable',
        seasonality: 'moderate',
        emergingTrends: ['healthy eating', 'sustainable dining', 'tech integration'],
      },
      riskFactors: [
        'Economic uncertainty',
        'Changing consumer preferences',
        'Regulatory changes',
      ],
      successFactors: [
        'Location accessibility',
        'Unique value proposition',
        'Quality service',
        'Marketing strategy',
      ],
    };

    return enhanced;
  },
}));
