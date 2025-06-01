/**
 * restaurant service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::restaurant.restaurant', ({ strapi }) => ({
  // Custom service method for geospatial queries
  async findNearby(latitude: number, longitude: number, radius: number = 5) {
    const restaurants = await strapi.entityService.findMany('api::restaurant.restaurant', {
      filters: {
        latitude: {
          $gte: latitude - radius * 0.01,
          $lte: latitude + radius * 0.01,
        },
        longitude: {
          $gte: longitude - radius * 0.01,
          $lte: longitude + radius * 0.01,
        },
      },
      populate: ['images'],
    });

    // Calculate actual distances and sort by proximity
    return restaurants
      .map(restaurant => ({
        ...restaurant,
        distance: this.calculateDistance(
          latitude,
          longitude,
          restaurant.latitude || 0,
          restaurant.longitude || 0
        ),
      }))
      .filter(restaurant => restaurant.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  },

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  // Analyze market competition for a location
  async analyzeCompetition(latitude: number, longitude: number, cuisine?: string) {
    const nearbyRestaurants = await this.findNearby(latitude, longitude, 2); // 2km radius

    let competitors = nearbyRestaurants;
    if (cuisine) {
      competitors = nearbyRestaurants.filter(r => r.cuisine && r.cuisine.toLowerCase() === cuisine.toLowerCase());
    }

    const analysis = {
      totalNearby: nearbyRestaurants.length,
      directCompetitors: competitors.length,
      averageRating: competitors.reduce((sum, r) => sum + (r.rating || 0), 0) / competitors.length || 0,
      competitionLevel: this.getCompetitionLevel(competitors.length),
      cuisineDistribution: this.getCuisineDistribution(nearbyRestaurants),
      recommendations: this.generateRecommendations(competitors.length, nearbyRestaurants),
    };

    return analysis;
  },

  getCompetitionLevel(competitorCount: number): string {
    if (competitorCount <= 3) return 'Low';
    if (competitorCount <= 8) return 'Medium';
    return 'High';
  },

  getCuisineDistribution(restaurants: any[]): Record<string, number> {
    return restaurants.reduce((acc, restaurant) => {
      const cuisine = restaurant.cuisine;
      acc[cuisine] = (acc[cuisine] || 0) + 1;
      return acc;
    }, {});
  },

  generateRecommendations(competitorCount: number, nearbyRestaurants: any[]): string[] {
    const recommendations = [];

    if (competitorCount <= 3) {
      recommendations.push('Low competition area - good opportunity for new restaurant');
    } else if (competitorCount > 8) {
      recommendations.push('High competition - consider differentiation strategy');
    }

    const cuisines = this.getCuisineDistribution(nearbyRestaurants);
    const underrepresentedCuisines = Object.entries(cuisines)
      .filter(([_, count]) => count <= 2)
      .map(([cuisine, _]) => cuisine);

    if (underrepresentedCuisines.length > 0) {
      recommendations.push(`Consider these underrepresented cuisines: ${underrepresentedCuisines.join(', ')}`);
    }

    return recommendations;
  },
}));
