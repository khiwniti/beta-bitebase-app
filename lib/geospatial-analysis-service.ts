/**
 * Geospatial Analysis Service for BiteBase
 * Advanced geospatial tools including heat maps, competitor analysis, and catchment areas
 */

import { EnhancedDataService } from "./enhanced-data-service";
import { AdvancedAIModels } from "./advanced-ai-models";

// Types for geospatial analysis
export interface HeatMapData {
  coordinates: [number, number];
  intensity: number;
  value: number;
  category: "demand" | "competition" | "foot_traffic" | "revenue_potential";
  metadata: {
    restaurant_count?: number;
    avg_rating?: number;
    foot_traffic?: number;
    predicted_revenue?: number;
  };
}

export interface CompetitorAnalysis {
  target_location: [number, number];
  competitors: Array<{
    id: string;
    name: string;
    coordinates: [number, number];
    distance_km: number;
    threat_level: "low" | "medium" | "high" | "critical";
    similarity_score: number;
    competitive_advantages: string[];
    market_share_estimate: number;
  }>;
  market_saturation: {
    level: "undersaturated" | "optimal" | "saturated" | "oversaturated";
    score: number;
    recommendation: string;
  };
  opportunity_zones: Array<{
    coordinates: [number, number];
    radius_km: number;
    opportunity_score: number;
    reasons: string[];
  }>;
}

export interface CatchmentArea {
  center: [number, number];
  primary_zone: {
    radius_km: number;
    population: number;
    demographics: Record<string, number>;
    spending_power: number;
  };
  secondary_zone: {
    radius_km: number;
    population: number;
    demographics: Record<string, number>;
    spending_power: number;
  };
  accessibility: {
    public_transport_score: number;
    parking_availability: number;
    walkability_score: number;
    traffic_congestion: number;
  };
  market_potential: {
    total_addressable_market: number;
    estimated_daily_customers: number;
    revenue_potential: number;
    confidence_level: number;
  };
}

export interface SpatialCluster {
  id: string;
  center: [number, number];
  radius_km: number;
  restaurants: Array<{
    id: string;
    name: string;
    coordinates: [number, number];
    cuisine: string;
    rating: number;
  }>;
  characteristics: {
    dominant_cuisine: string;
    avg_price_range: number;
    avg_rating: number;
    total_reviews: number;
  };
  market_dynamics: {
    competition_intensity: number;
    growth_potential: number;
    customer_loyalty: number;
  };
}

// Geospatial Analysis Service
export class GeospatialAnalysisService {
  private static readonly CACHE_DURATION = 20 * 60 * 1000; // 20 minutes
  private static cache = new Map<string, { data: any; timestamp: number }>();

  // Heat Map Generation
  static async generateHeatMap(
    bounds: { north: number; south: number; east: number; west: number },
    category: "demand" | "competition" | "foot_traffic" | "revenue_potential",
    resolution: number = 50
  ): Promise<HeatMapData[]> {
    const cacheKey = `heatmap_${category}_${JSON.stringify(bounds)}_${resolution}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const heatMapPoints: HeatMapData[] = [];
      
      // Generate grid points within bounds
      const latStep = (bounds.north - bounds.south) / resolution;
      const lngStep = (bounds.east - bounds.west) / resolution;

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const lat = bounds.south + (i * latStep);
          const lng = bounds.west + (j * lngStep);
          
          let intensity = 0;
          let value = 0;
          const metadata: any = {};

          switch (category) {
            case "demand":
              // Simulate demand based on population density and economic factors
              const economicData = await EnhancedDataService.getThaiEconomicIndicators();
              const baseIntensity = 0.3 + (economicData.consumer_confidence / 100) * 0.4;
              intensity = baseIntensity + (Math.random() * 0.3);
              value = intensity * 1000; // Estimated daily demand
              metadata.predicted_customers = Math.floor(value);
              break;

            case "competition":
              // Simulate competition density
              const competitorDensity = Math.random() * 0.8;
              intensity = competitorDensity;
              value = competitorDensity * 10; // Number of competitors in area
              metadata.restaurant_count = Math.floor(value);
              metadata.avg_rating = 3.5 + Math.random() * 1.5;
              break;

            case "foot_traffic":
              // Use foot traffic data if available
              const footTrafficData = await EnhancedDataService.getFootTrafficData(`${lat}_${lng}`);
              intensity = (footTrafficData.daily_average / 100) || (0.2 + Math.random() * 0.6);
              value = footTrafficData.daily_average || (intensity * 500);
              metadata.foot_traffic = Math.floor(value);
              break;

            case "revenue_potential":
              // Combine demand, competition, and foot traffic for revenue potential
              const demandFactor = 0.4 + Math.random() * 0.4;
              const competitionFactor = 1 - (Math.random() * 0.6); // Lower competition = higher potential
              const trafficFactor = 0.3 + Math.random() * 0.5;
              intensity = (demandFactor * competitionFactor * trafficFactor);
              value = intensity * 50000; // Estimated monthly revenue
              metadata.predicted_revenue = Math.floor(value);
              break;
          }

          heatMapPoints.push({
            coordinates: [lat, lng],
            intensity: Math.min(1, Math.max(0, intensity)),
            value,
            category,
            metadata
          });
        }
      }

      this.setCachedData(cacheKey, heatMapPoints);
      return heatMapPoints;

    } catch (error) {
      console.error("Heat map generation failed:", error);
      return [];
    }
  }

  // Competitor Analysis
  static async analyzeCompetitors(
    targetLocation: [number, number],
    radiusKm: number = 2,
    restaurantData?: any[]
  ): Promise<CompetitorAnalysis> {
    const cacheKey = `competitor_analysis_${targetLocation.join('_')}_${radiusKm}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Generate mock competitor data if not provided
      const mockRestaurants = restaurantData || Array.from({ length: 20 }, (_, i) => ({
        id: `restaurant_${i}`,
        name: `Restaurant ${i + 1}`,
        coordinates: [
          targetLocation[0] + (Math.random() - 0.5) * (radiusKm / 50),
          targetLocation[1] + (Math.random() - 0.5) * (radiusKm / 50)
        ] as [number, number],
        cuisine: ["Thai", "Italian", "Japanese", "American", "Chinese"][Math.floor(Math.random() * 5)],
        rating: 3 + Math.random() * 2,
        price_range: Math.floor(Math.random() * 4) + 1,
        review_count: Math.floor(Math.random() * 500) + 10
      }));

      // Calculate distances and analyze competitors
      const competitors = mockRestaurants
        .map(restaurant => {
          const distance = this.calculateDistance(targetLocation, restaurant.coordinates);
          if (distance > radiusKm) return null;

          // Calculate threat level based on distance, rating, and similarity
          const proximityThreat = Math.max(0, 1 - (distance / radiusKm));
          const qualityThreat = restaurant.rating / 5;
          const overallThreat = (proximityThreat * 0.6) + (qualityThreat * 0.4);

          let threatLevel: "low" | "medium" | "high" | "critical";
          if (overallThreat < 0.3) threatLevel = "low";
          else if (overallThreat < 0.6) threatLevel = "medium";
          else if (overallThreat < 0.8) threatLevel = "high";
          else threatLevel = "critical";

          return {
            id: restaurant.id,
            name: restaurant.name,
            coordinates: restaurant.coordinates,
            distance_km: distance,
            threat_level: threatLevel,
            similarity_score: 0.5 + Math.random() * 0.4,
            competitive_advantages: this.generateCompetitiveAdvantages(restaurant),
            market_share_estimate: Math.random() * 0.15 + 0.05 // 5-20%
          };
        })
        .filter(Boolean) as any[];

      // Analyze market saturation
      const competitorDensity = competitors.length / (Math.PI * radiusKm * radiusKm);
      let saturationLevel: "undersaturated" | "optimal" | "saturated" | "oversaturated";
      let saturationScore: number;

      if (competitorDensity < 2) {
        saturationLevel = "undersaturated";
        saturationScore = 0.8 + Math.random() * 0.2;
      } else if (competitorDensity < 5) {
        saturationLevel = "optimal";
        saturationScore = 0.6 + Math.random() * 0.2;
      } else if (competitorDensity < 10) {
        saturationLevel = "saturated";
        saturationScore = 0.3 + Math.random() * 0.2;
      } else {
        saturationLevel = "oversaturated";
        saturationScore = Math.random() * 0.3;
      }

      // Identify opportunity zones
      const opportunityZones = this.identifyOpportunityZones(targetLocation, competitors, radiusKm);

      const analysis: CompetitorAnalysis = {
        target_location: targetLocation,
        competitors: competitors.sort((a, b) => b.similarity_score - a.similarity_score),
        market_saturation: {
          level: saturationLevel,
          score: saturationScore,
          recommendation: this.generateSaturationRecommendation(saturationLevel, saturationScore)
        },
        opportunity_zones: opportunityZones
      };

      this.setCachedData(cacheKey, analysis);
      return analysis;

    } catch (error) {
      console.error("Competitor analysis failed:", error);
      throw new Error("Unable to analyze competitors");
    }
  }

  // Catchment Area Analysis
  static async analyzeCatchmentArea(
    location: [number, number],
    businessType: string = "restaurant"
  ): Promise<CatchmentArea> {
    const cacheKey = `catchment_${location.join('_')}_${businessType}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Get demographic and economic data
      const economicData = await EnhancedDataService.getThaiEconomicIndicators();
      const footTrafficData = await EnhancedDataService.getFootTrafficData(location.join('_'));

      // Define primary and secondary zones
      const primaryRadius = businessType === "restaurant" ? 1.5 : 2.0; // km
      const secondaryRadius = primaryRadius * 2;

      // Calculate population and demographics for each zone
      const primaryPopulation = Math.floor(5000 + Math.random() * 15000);
      const secondaryPopulation = Math.floor(15000 + Math.random() * 35000);

      const demographics = {
        "18-25": 20 + Math.random() * 10,
        "26-35": 30 + Math.random() * 10,
        "36-45": 25 + Math.random() * 10,
        "46-55": 15 + Math.random() * 10,
        "55+": 10 + Math.random() * 10
      };

      // Calculate spending power based on economic indicators
      const baseSpendingPower = 25000 + (economicData.gdp_growth * 2000);
      const primarySpendingPower = baseSpendingPower * (1 + Math.random() * 0.3);
      const secondarySpendingPower = baseSpendingPower * (0.8 + Math.random() * 0.4);

      // Accessibility analysis
      const accessibility = {
        public_transport_score: 60 + Math.random() * 30,
        parking_availability: 50 + Math.random() * 40,
        walkability_score: 70 + Math.random() * 25,
        traffic_congestion: 30 + Math.random() * 50
      };

      // Market potential calculation
      const totalAddressableMarket = (primaryPopulation * 0.6 + secondaryPopulation * 0.3) * 
                                   (primarySpendingPower * 0.05 / 365); // 5% of income on dining
      const estimatedDailyCustomers = Math.floor(totalAddressableMarket / 200); // Average spend per visit
      const revenuePerCustomer = 200 + Math.random() * 300;
      const revenuePotential = estimatedDailyCustomers * revenuePerCustomer * 30; // Monthly

      const catchmentArea: CatchmentArea = {
        center: location,
        primary_zone: {
          radius_km: primaryRadius,
          population: primaryPopulation,
          demographics,
          spending_power: primarySpendingPower
        },
        secondary_zone: {
          radius_km: secondaryRadius,
          population: secondaryPopulation,
          demographics: { ...demographics }, // Similar demographics
          spending_power: secondarySpendingPower
        },
        accessibility,
        market_potential: {
          total_addressable_market: Math.floor(totalAddressableMarket),
          estimated_daily_customers: estimatedDailyCustomers,
          revenue_potential: Math.floor(revenuePotential),
          confidence_level: 0.75 + Math.random() * 0.2
        }
      };

      this.setCachedData(cacheKey, catchmentArea);
      return catchmentArea;

    } catch (error) {
      console.error("Catchment area analysis failed:", error);
      throw new Error("Unable to analyze catchment area");
    }
  }

  // Spatial Clustering
  static async performSpatialClustering(
    restaurants: any[],
    algorithm: "kmeans" | "dbscan" = "kmeans"
  ): Promise<SpatialCluster[]> {
    const cacheKey = `spatial_clustering_${algorithm}_${restaurants.length}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Use AI clustering from Phase 2
      const clusteringResult = await AdvancedAIModels.performMarketSegmentation(restaurants);
      
      // Convert to spatial clusters
      const spatialClusters: SpatialCluster[] = clusteringResult.clusters.map((cluster, index) => {
        const clusterRestaurants = cluster.members;
        
        // Calculate cluster center (centroid)
        const centerLat = clusterRestaurants.reduce((sum: number, r: any) => 
          sum + (r.coordinates?.[0] || r.latitude || 0), 0) / clusterRestaurants.length;
        const centerLng = clusterRestaurants.reduce((sum: number, r: any) => 
          sum + (r.coordinates?.[1] || r.longitude || 0), 0) / clusterRestaurants.length;

        // Calculate cluster radius
        const distances = clusterRestaurants.map((r: any) => 
          this.calculateDistance([centerLat, centerLng], 
            [r.coordinates?.[0] || r.latitude || 0, r.coordinates?.[1] || r.longitude || 0])
        );
        const radius = Math.max(...distances, 0.5); // Minimum 0.5km radius

        // Analyze cluster characteristics
        const cuisines = clusterRestaurants.map((r: any) => r.cuisine || "General");
        const dominantCuisine = this.getMostFrequent(cuisines);
        const avgPriceRange = clusterRestaurants.reduce((sum: number, r: any) => 
          sum + (r.price_range || 2), 0) / clusterRestaurants.length;
        const avgRating = clusterRestaurants.reduce((sum: number, r: any) => 
          sum + (r.rating || 0), 0) / clusterRestaurants.length;
        const totalReviews = clusterRestaurants.reduce((sum: number, r: any) => 
          sum + (r.review_count || 0), 0);

        return {
          id: `cluster_${index}`,
          center: [centerLat, centerLng],
          radius_km: radius,
          restaurants: clusterRestaurants.map((r: any) => ({
            id: r.id || `restaurant_${Math.random()}`,
            name: r.name || "Unknown Restaurant",
            coordinates: [r.coordinates?.[0] || r.latitude || 0, r.coordinates?.[1] || r.longitude || 0],
            cuisine: r.cuisine || "General",
            rating: r.rating || 0
          })),
          characteristics: {
            dominant_cuisine: dominantCuisine,
            avg_price_range: Math.round(avgPriceRange * 10) / 10,
            avg_rating: Math.round(avgRating * 10) / 10,
            total_reviews: totalReviews
          },
          market_dynamics: {
            competition_intensity: Math.min(1, clusterRestaurants.length / 10),
            growth_potential: 0.4 + Math.random() * 0.4,
            customer_loyalty: avgRating / 5
          }
        };
      });

      this.setCachedData(cacheKey, spatialClusters);
      return spatialClusters;

    } catch (error) {
      console.error("Spatial clustering failed:", error);
      return [];
    }
  }

  // Utility Methods
  private static calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2[0] - coord1[0]);
    const dLon = this.toRadians(coord2[1] - coord1[1]);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(coord1[0])) * Math.cos(this.toRadians(coord2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static generateCompetitiveAdvantages(restaurant: any): string[] {
    const advantages = [];
    if (restaurant.rating > 4.0) advantages.push("High customer satisfaction");
    if (restaurant.price_range <= 2) advantages.push("Competitive pricing");
    if (restaurant.review_count > 100) advantages.push("Strong online presence");
    if (restaurant.cuisine === "Thai") advantages.push("Local cuisine expertise");
    return advantages.length > 0 ? advantages : ["Established presence"];
  }

  private static generateSaturationRecommendation(level: string, score: number): string {
    switch (level) {
      case "undersaturated":
        return "Excellent opportunity for market entry with high success potential";
      case "optimal":
        return "Good market conditions with balanced competition and demand";
      case "saturated":
        return "Challenging market requiring strong differentiation strategy";
      case "oversaturated":
        return "High-risk market entry - consider alternative locations";
      default:
        return "Market analysis inconclusive";
    }
  }

  private static identifyOpportunityZones(
    center: [number, number], 
    competitors: any[], 
    maxRadius: number
  ): Array<{ coordinates: [number, number]; radius_km: number; opportunity_score: number; reasons: string[] }> {
    const zones = [];
    const gridSize = 8;
    const step = (maxRadius * 2) / gridSize;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = center[0] - maxRadius + (i * step);
        const lng = center[1] - maxRadius + (j * step);
        const zoneCenter: [number, number] = [lat, lng];

        // Calculate distance to nearest competitors
        const nearestCompetitorDistance = Math.min(
          ...competitors.map(c => this.calculateDistance(zoneCenter, c.coordinates))
        );

        // Calculate opportunity score
        let opportunityScore = Math.min(1, nearestCompetitorDistance / 0.5); // Higher score for areas farther from competitors
        const reasons = [];

        if (nearestCompetitorDistance > 0.8) {
          opportunityScore += 0.2;
          reasons.push("Low competitor density");
        }
        if (nearestCompetitorDistance > 1.2) {
          opportunityScore += 0.1;
          reasons.push("Underserved area");
        }

        // Only include zones with decent opportunity
        if (opportunityScore > 0.6) {
          zones.push({
            coordinates: zoneCenter,
            radius_km: 0.3,
            opportunity_score: Math.min(1, opportunityScore),
            reasons: reasons.length > 0 ? reasons : ["Potential market gap"]
          });
        }
      }
    }

    return zones.sort((a, b) => b.opportunity_score - a.opportunity_score).slice(0, 5);
  }

  private static getMostFrequent(arr: string[]): string {
    const frequency: Record<string, number> = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  // Cache Management
  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Export the service
export const GeospatialAnalysis = GeospatialAnalysisService;