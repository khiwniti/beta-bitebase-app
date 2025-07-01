/**
 * Competitive Intelligence Service for BiteBase
 * Automated competitor monitoring and analysis with AI-powered insights
 */

import { bedrockService } from './bedrock-service'

export interface Competitor {
  id: string;
  name: string;
  cuisine: string[];
  priceRange: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    distance: number; // km from user's restaurant
  };
  contact: {
    phone?: string;
    website?: string;
    socialMedia: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  lastUpdated: Date;
}

export interface CompetitorMetrics {
  competitorId: string;
  timestamp: Date;
  ratings: {
    google: number;
    yelp: number;
    tripadvisor: number;
    averageRating: number;
    totalReviews: number;
  };
  pricing: MenuPricing[];
  traffic: {
    estimatedDailyCustomers: number;
    peakHours: string[];
    occupancyRate: number;
  };
  menuChanges: MenuChange[];
  promotions: Promotion[];
  socialMediaActivity: SocialMediaMetrics;
}

export interface MenuPricing {
  category: string;
  items: {
    name: string;
    price: number;
    description?: string;
    popularity?: number;
  }[];
}

export interface MenuChange {
  type: 'added' | 'removed' | 'price_change' | 'description_change';
  item: string;
  oldValue?: any;
  newValue?: any;
  detectedDate: Date;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'special_menu' | 'event' | 'happy_hour';
  startDate: Date;
  endDate?: Date;
  platforms: string[];
  estimatedImpact: number; // 0-1 scale
}

export interface SocialMediaMetrics {
  platform: string;
  followers: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    posts: number;
  };
  recentPosts: SocialPost[];
}

export interface SocialPost {
  id: string;
  content: string;
  platform: string;
  timestamp: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
}

export interface CompetitorAlert {
  id: string;
  competitorId: string;
  type: 'price_change' | 'menu_update' | 'promotion' | 'rating_change' | 'traffic_spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  data: any;
  actionRequired: boolean;
  suggestions: string[];
  createdAt: Date;
  acknowledged: boolean;
}

export interface CompetitiveAnalysis {
  id: string;
  restaurantId: string;
  competitors: Competitor[];
  marketPosition: MarketPosition;
  insights: CompetitiveInsight[];
  recommendations: CompetitiveRecommendation[];
  threats: CompetitiveThreat[];
  opportunities: CompetitiveOpportunity[];
  generatedAt: Date;
  confidence: number;
}

export interface MarketPosition {
  overall: number; // 0-100 score
  pricing: number;
  quality: number;
  service: number;
  innovation: number;
  marketShare: {
    estimated: number;
    rank: number;
    totalCompetitors: number;
  };
}

export interface CompetitiveInsight {
  id: string;
  type: 'trend' | 'gap' | 'strength' | 'weakness';
  category: 'pricing' | 'menu' | 'service' | 'marketing' | 'operations';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  supportingData: any[];
}

export interface CompetitiveRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'pricing' | 'menu' | 'service' | 'marketing' | 'operations';
  title: string;
  description: string;
  expectedImpact: string;
  implementationEffort: 'low' | 'medium' | 'high';
  timeline: string;
  cost: string;
  kpis: string[];
}

export interface CompetitiveThreat {
  id: string;
  competitorId: string;
  type: 'new_competitor' | 'price_war' | 'menu_innovation' | 'marketing_campaign';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  estimatedImpact: number; // percentage impact on revenue
  timeframe: string;
  mitigation: string[];
}

export interface CompetitiveOpportunity {
  id: string;
  type: 'market_gap' | 'competitor_weakness' | 'trend' | 'location';
  title: string;
  description: string;
  estimatedRevenue: number;
  effort: 'low' | 'medium' | 'high';
  timeToMarket: string;
  requirements: string[];
}

class CompetitiveIntelligenceService {
  private competitorCache: Map<string, Competitor[]> = new Map();
  private metricsCache: Map<string, CompetitorMetrics[]> = new Map();

  async getCompetitors(restaurantId: string, radius: number = 2): Promise<Competitor[]> {
    try {
      // In production, this would fetch from your database/APIs
      // For now, return sample competitive data
      const competitors: Competitor[] = [
        {
          id: 'comp-1',
          name: 'Bella Vista Italian',
          cuisine: ['Italian', 'Pizza'],
          priceRange: 3,
          location: {
            lat: 40.7130,
            lng: -74.0070,
            address: '123 Main St, New York, NY',
            distance: 0.3
          },
          contact: {
            phone: '+1 (555) 123-4567',
            website: 'https://bellavista-ny.com',
            socialMedia: {
              instagram: '@bellavistaNY',
              facebook: 'BellaVistaNY'
            }
          },
          operatingHours: {
            monday: { open: '11:00', close: '22:00' },
            tuesday: { open: '11:00', close: '22:00' },
            wednesday: { open: '11:00', close: '22:00' },
            thursday: { open: '11:00', close: '23:00' },
            friday: { open: '11:00', close: '23:00' },
            saturday: { open: '12:00', close: '23:00' },
            sunday: { open: '12:00', close: '21:00' }
          },
          lastUpdated: new Date()
        },
        {
          id: 'comp-2',
          name: 'Marco\'s Pizzeria',
          cuisine: ['Italian', 'Pizza', 'Casual Dining'],
          priceRange: 2,
          location: {
            lat: 40.7125,
            lng: -74.0050,
            address: '456 Broadway, New York, NY',
            distance: 0.5
          },
          contact: {
            phone: '+1 (555) 987-6543',
            website: 'https://marcos-pizza.com',
            socialMedia: {
              instagram: '@marcospizza',
              facebook: 'MarcosPizzeriaNY'
            }
          },
          operatingHours: {
            monday: { open: '10:00', close: '23:00' },
            tuesday: { open: '10:00', close: '23:00' },
            wednesday: { open: '10:00', close: '23:00' },
            thursday: { open: '10:00', close: '24:00' },
            friday: { open: '10:00', close: '01:00' },
            saturday: { open: '10:00', close: '01:00' },
            sunday: { open: '11:00', close: '22:00' }
          },
          lastUpdated: new Date()
        }
      ];

      this.competitorCache.set(restaurantId, competitors);
      return competitors;
    } catch (error) {
      console.error('Failed to fetch competitors:', error);
      return [];
    }
  }

  async getCompetitorMetrics(competitorId: string): Promise<CompetitorMetrics | null> {
    try {
      // Sample metrics data - replace with real API calls
      const metrics: CompetitorMetrics = {
        competitorId,
        timestamp: new Date(),
        ratings: {
          google: 4.2,
          yelp: 4.0,
          tripadvisor: 4.1,
          averageRating: 4.1,
          totalReviews: 847
        },
        pricing: [
          {
            category: 'Appetizers',
            items: [
              { name: 'Bruschetta', price: 12.95, popularity: 0.8 },
              { name: 'Calamari', price: 14.95, popularity: 0.6 },
              { name: 'Caesar Salad', price: 11.95, popularity: 0.7 }
            ]
          },
          {
            category: 'Main Courses',
            items: [
              { name: 'Margherita Pizza', price: 18.95, popularity: 0.9 },
              { name: 'Pasta Carbonara', price: 22.95, popularity: 0.7 },
              { name: 'Grilled Salmon', price: 28.95, popularity: 0.5 }
            ]
          }
        ],
        traffic: {
          estimatedDailyCustomers: 180,
          peakHours: ['12:00-14:00', '19:00-21:00'],
          occupancyRate: 0.75
        },
        menuChanges: [
          {
            type: 'price_change',
            item: 'Margherita Pizza',
            oldValue: 17.95,
            newValue: 18.95,
            detectedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
          }
        ],
        promotions: [
          {
            id: 'promo-1',
            title: 'Happy Hour Special',
            description: '25% off appetizers and drinks 4-6 PM',
            type: 'happy_hour',
            startDate: new Date(),
            platforms: ['website', 'instagram'],
            estimatedImpact: 0.15
          }
        ],
        socialMediaActivity: {
          platform: 'instagram',
          followers: 3250,
          engagement: {
            likes: 450,
            comments: 28,
            shares: 12,
            posts: 15
          },
          recentPosts: [
            {
              id: 'post-1',
              content: 'Fresh pasta made daily with love! 🍝 #FreshPasta #Italian',
              platform: 'instagram',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
              engagement: { likes: 89, comments: 7, shares: 3 },
              sentiment: 'positive',
              topics: ['food', 'quality', 'italian']
            }
          ]
        }
      };

      return metrics;
    } catch (error) {
      console.error('Failed to fetch competitor metrics:', error);
      return null;
    }
  }

  async generateCompetitiveAnalysis(restaurantId: string): Promise<CompetitiveAnalysis> {
    try {
      const competitors = await this.getCompetitors(restaurantId);
      const competitorMetrics = await Promise.all(
        competitors.map(c => this.getCompetitorMetrics(c.id))
      );

      // Use AI to analyze competitive landscape
      const aiAnalysis = await this.analyzeWithAI(competitors, competitorMetrics, restaurantId);

      const analysis: CompetitiveAnalysis = {
        id: `analysis-${Date.now()}`,
        restaurantId,
        competitors,
        marketPosition: aiAnalysis.marketPosition || {
          overall: 72,
          pricing: 68,
          quality: 78,
          service: 75,
          innovation: 65,
          marketShare: {
            estimated: 15.2,
            rank: 3,
            totalCompetitors: competitors.length + 1
          }
        },
        insights: aiAnalysis.insights || [],
        recommendations: aiAnalysis.recommendations || [],
        threats: aiAnalysis.threats || [],
        opportunities: aiAnalysis.opportunities || [],
        generatedAt: new Date(),
        confidence: aiAnalysis.confidence || 0.82
      };

      return analysis;
    } catch (error) {
      console.error('Failed to generate competitive analysis:', error);
      throw new Error('Competitive analysis generation failed');
    }
  }

  private async analyzeWithAI(
    competitors: Competitor[],
    metrics: (CompetitorMetrics | null)[],
    restaurantId: string
  ): Promise<any> {
    try {
      const analysisPrompt = `
      As an expert restaurant industry analyst, analyze the competitive landscape and provide strategic insights.

      Competitors Data:
      ${JSON.stringify(competitors.map(c => ({
        name: c.name,
        cuisine: c.cuisine,
        priceRange: c.priceRange,
        distance: c.location.distance
      })))}

      Competitor Metrics:
      ${JSON.stringify(metrics.filter(m => m !== null).map(m => ({
        ratings: m!.ratings,
        pricing: m!.pricing,
        traffic: m!.traffic,
        recentChanges: m!.menuChanges
      })))}

      Please provide a comprehensive competitive analysis including:

      1. Market Position Assessment (scores 0-100)
      2. Key Competitive Insights
      3. Strategic Recommendations
      4. Competitive Threats
      5. Market Opportunities

      Respond in JSON format:
      {
        "marketPosition": {
          "overall": number,
          "pricing": number,
          "quality": number,
          "service": number,
          "innovation": number
        },
        "insights": [
          {
            "type": "trend|gap|strength|weakness",
            "category": "pricing|menu|service|marketing|operations",
            "title": "string",
            "description": "string",
            "impact": "high|medium|low",
            "confidence": number
          }
        ],
        "recommendations": [
          {
            "priority": "high|medium|low",
            "category": "string",
            "title": "string",
            "description": "string",
            "expectedImpact": "string",
            "timeline": "string"
          }
        ],
        "threats": [
          {
            "type": "string",
            "severity": "low|medium|high|critical",
            "title": "string",
            "description": "string",
            "estimatedImpact": number,
            "mitigation": ["string"]
          }
        ],
        "opportunities": [
          {
            "type": "string",
            "title": "string",
            "description": "string",
            "estimatedRevenue": number,
            "effort": "low|medium|high"
          }
        ],
        "confidence": number
      }
      `;

      const aiResponse = await bedrockService.invokeClaude35Sonnet(analysisPrompt);
      return JSON.parse(aiResponse);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return {
        confidence: 0.5,
        insights: [],
        recommendations: [],
        threats: [],
        opportunities: []
      };
    }
  }

  async monitorCompetitorChanges(restaurantId: string): Promise<CompetitorAlert[]> {
    try {
      const competitors = await this.getCompetitors(restaurantId);
      const alerts: CompetitorAlert[] = [];

      for (const competitor of competitors) {
        const metrics = await this.getCompetitorMetrics(competitor.id);
        if (!metrics) continue;

        // Check for significant changes
        if (metrics.menuChanges.length > 0) {
          metrics.menuChanges.forEach(change => {
            if (change.type === 'price_change') {
              const priceChange = ((change.newValue - change.oldValue) / change.oldValue) * 100;
              if (Math.abs(priceChange) > 10) { // Significant price change
                alerts.push({
                  id: `alert-${Date.now()}-${competitor.id}`,
                  competitorId: competitor.id,
                  type: 'price_change',
                  severity: Math.abs(priceChange) > 20 ? 'high' : 'medium',
                  title: `${competitor.name} Price Change`,
                  description: `${change.item} price changed by ${priceChange.toFixed(1)}%`,
                  data: change,
                  actionRequired: true,
                  suggestions: [
                    'Review your pricing strategy',
                    'Consider competitive response',
                    'Monitor customer reaction'
                  ],
                  createdAt: new Date(),
                  acknowledged: false
                });
              }
            }
          });
        }

        // Check for new promotions
        if (metrics.promotions.length > 0) {
          metrics.promotions.forEach(promotion => {
            alerts.push({
              id: `alert-${Date.now()}-promo-${competitor.id}`,
              competitorId: competitor.id,
              type: 'promotion',
              severity: promotion.estimatedImpact > 0.2 ? 'high' : 'medium',
              title: `${competitor.name} New Promotion`,
              description: promotion.description,
              data: promotion,
              actionRequired: promotion.estimatedImpact > 0.15,
              suggestions: [
                'Consider counter-promotion',
                'Analyze promotion effectiveness',
                'Monitor impact on foot traffic'
              ],
              createdAt: new Date(),
              acknowledged: false
            });
          });
        }
      }

      return alerts;
    } catch (error) {
      console.error('Failed to monitor competitor changes:', error);
      return [];
    }
  }

  async analyzeSentiment(restaurantId: string, timeframe: number = 30): Promise<any> {
    try {
      const competitors = await this.getCompetitors(restaurantId);
      const sentimentData = [];

      for (const competitor of competitors) {
        const metrics = await this.getCompetitorMetrics(competitor.id);
        if (!metrics) continue;

        // Analyze social media sentiment
        const socialSentiment = metrics.socialMediaActivity.recentPosts.reduce((acc, post) => {
          acc[post.sentiment] = (acc[post.sentiment] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        sentimentData.push({
          competitor: competitor.name,
          sentiment: socialSentiment,
          engagement: metrics.socialMediaActivity.engagement,
          rating: metrics.ratings.averageRating
        });
      }

      return sentimentData;
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      return [];
    }
  }
}

// Export singleton instance
export const competitiveIntelligenceService = new CompetitiveIntelligenceService();
export default CompetitiveIntelligenceService;