/**
 * AI-Enhanced Sales Forecasting Engine for BiteBase
 * Combines statistical models with AWS Bedrock AI analysis
 */

import { bedrockService } from './bedrock-service'

export interface ForecastRequest {
  restaurantId: string;
  forecastDays: number;
  includeExternalFactors: boolean;
  granularity: 'hourly' | 'daily' | 'weekly';
}

export interface ForecastResult {
  predictions: ForecastPrediction[];
  confidence: number;
  factors: ExternalFactor[];
  scenarios: ForecastScenario[];
  recommendations: ForecastRecommendation[];
  lastUpdated: Date;
  modelAccuracy: number;
}

export interface ForecastPrediction {
  date: Date;
  hour?: number;
  predictedRevenue: number;
  predictedCustomers: number;
  predictedAOV: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: string[];
}

export interface ExternalFactor {
  type: 'weather' | 'events' | 'seasonal' | 'economic' | 'competitor';
  name: string;
  impact: number; // -1 to 1
  confidence: number;
  description: string;
  date?: Date;
}

export interface ForecastScenario {
  name: string;
  type: 'optimistic' | 'pessimistic' | 'realistic';
  adjustment: number;
  description: string;
  predictions: ForecastPrediction[];
}

export interface ForecastRecommendation {
  id: string;
  type: 'staffing' | 'inventory' | 'marketing' | 'pricing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  implementation: string;
  timeline: string;
}

export interface HistoricalData {
  date: Date;
  revenue: number;
  customers: number;
  weather: WeatherData;
  events: EventData[];
  dayOfWeek: number;
  isHoliday: boolean;
  season: 'spring' | 'summer' | 'fall' | 'winter';
}

export interface WeatherData {
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface EventData {
  name: string;
  type: string;
  distance: number; // km from restaurant
  attendees: number;
  impact: number;
}

class ForecastingEngine {
  private historicalData: Map<string, HistoricalData[]> = new Map();
  private modelCache: Map<string, any> = new Map();

  async generateSalesForecast(request: ForecastRequest): Promise<ForecastResult> {
    try {
      // 1. Load historical data
      const historicalData = await this.loadHistoricalData(request.restaurantId);
      
      // 2. Generate base statistical forecast
      const baseForecast = await this.generateBaseForecast(historicalData, request);
      
      // 3. Gather external factors
      const externalFactors = await this.gatherExternalFactors(request);
      
      // 4. Enhance forecast with AI analysis
      const enhancedForecast = await this.enhanceForecastWithAI(
        baseForecast,
        externalFactors,
        historicalData,
        request
      );
      
      // 5. Generate scenarios
      const scenarios = await this.generateScenarios(enhancedForecast, externalFactors);
      
      // 6. Generate recommendations
      const recommendations = await this.generateRecommendations(
        enhancedForecast,
        externalFactors,
        request
      );

      return {
        predictions: enhancedForecast.predictions,
        confidence: enhancedForecast.confidence,
        factors: externalFactors,
        scenarios,
        recommendations,
        lastUpdated: new Date(),
        modelAccuracy: await this.getModelAccuracy(request.restaurantId)
      };
    } catch (error) {
      console.error('Forecasting failed:', error);
      throw new Error('Failed to generate sales forecast');
    }
  }

  private async loadHistoricalData(restaurantId: string): Promise<HistoricalData[]> {
    // In production, this would load from your data warehouse
    // For now, return simulated data structure
    const days = 90; // 3 months of data
    const data: HistoricalData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date,
        revenue: this.generateRealisticRevenue(date),
        customers: Math.floor(Math.random() * 100) + 50,
        weather: this.generateWeatherData(date),
        events: this.generateEventsData(date),
        dayOfWeek: date.getDay(),
        isHoliday: this.isHoliday(date),
        season: this.getSeason(date)
      });
    }
    
    return data;
  }

  private generateRealisticRevenue(date: Date): number {
    const baseRevenue = 2000;
    const dayOfWeek = date.getDay();
    
    // Weekend boost
    const weekendMultiplier = (dayOfWeek === 5 || dayOfWeek === 6) ? 1.4 : 1.0;
    
    // Seasonal variation
    const month = date.getMonth();
    const seasonalMultiplier = month >= 5 && month <= 8 ? 1.2 : 0.9; // Summer boost
    
    // Random variation
    const randomVariation = 0.8 + (Math.random() * 0.4); // ±20%
    
    return Math.round(baseRevenue * weekendMultiplier * seasonalMultiplier * randomVariation);
  }

  private generateWeatherData(date: Date): WeatherData {
    return {
      temperature: 20 + Math.random() * 15,
      condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
      precipitation: Math.random() * 10,
      windSpeed: Math.random() * 20,
      humidity: 40 + Math.random() * 40
    };
  }

  private generateEventsData(date: Date): EventData[] {
    if (Math.random() > 0.85) { // 15% chance of event
      return [{
        name: 'Local Festival',
        type: 'community',
        distance: Math.random() * 2,
        attendees: Math.floor(Math.random() * 1000) + 500,
        impact: Math.random() * 0.3 + 0.1
      }];
    }
    return [];
  }

  private isHoliday(date: Date): boolean {
    // Simplified holiday detection
    const month = date.getMonth();
    const day = date.getDate();
    
    return (month === 11 && day === 25) || // Christmas
           (month === 0 && day === 1) ||   // New Year
           (month === 6 && day === 4);     // July 4th
  }

  private getSeason(date: Date): 'spring' | 'summer' | 'fall' | 'winter' {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  private async generateBaseForecast(
    historicalData: HistoricalData[],
    request: ForecastRequest
  ): Promise<{ predictions: ForecastPrediction[]; confidence: number }> {
    const predictions: ForecastPrediction[] = [];
    
    // Simple moving average with trend analysis
    const recentData = historicalData.slice(-30); // Last 30 days
    const averageRevenue = recentData.reduce((sum, d) => sum + d.revenue, 0) / recentData.length;
    
    // Calculate trend
    const trend = this.calculateTrend(recentData);
    
    for (let i = 1; i <= request.forecastDays; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      const dayOfWeek = futureDate.getDay();
      const weekendBoost = (dayOfWeek === 5 || dayOfWeek === 6) ? 1.4 : 1.0;
      
      const baseRevenue = averageRevenue * weekendBoost * (1 + trend * i / 30);
      const variance = baseRevenue * 0.2; // ±20% confidence interval
      
      predictions.push({
        date: futureDate,
        predictedRevenue: Math.round(baseRevenue),
        predictedCustomers: Math.round(baseRevenue / 25), // Assume $25 AOV
        predictedAOV: 25,
        confidenceInterval: {
          lower: Math.round(baseRevenue - variance),
          upper: Math.round(baseRevenue + variance)
        },
        factors: ['historical_trend', 'day_of_week']
      });
    }
    
    return {
      predictions,
      confidence: 0.75 // Base statistical model confidence
    };
  }

  private calculateTrend(data: HistoricalData[]): number {
    if (data.length < 2) return 0;
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.revenue, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.revenue, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg; // Percentage change
  }

  private async gatherExternalFactors(request: ForecastRequest): Promise<ExternalFactor[]> {
    const factors: ExternalFactor[] = [];
    
    // Weather factors (mock - replace with real weather API)
    factors.push({
      type: 'weather',
      name: 'Sunny Weather Expected',
      impact: 0.15,
      confidence: 0.8,
      description: 'Clear skies and warm temperatures boost outdoor dining'
    });
    
    // Seasonal factors
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 5 && currentMonth <= 8) {
      factors.push({
        type: 'seasonal',
        name: 'Summer Season',
        impact: 0.2,
        confidence: 0.9,
        description: 'Summer months typically show increased dining activity'
      });
    }
    
    // Economic factors
    factors.push({
      type: 'economic',
      name: 'Consumer Confidence Index',
      impact: 0.05,
      confidence: 0.7,
      description: 'Current economic conditions support dining out'
    });
    
    return factors;
  }

  private async enhanceForecastWithAI(
    baseForecast: { predictions: ForecastPrediction[]; confidence: number },
    externalFactors: ExternalFactor[],
    historicalData: HistoricalData[],
    request: ForecastRequest
  ): Promise<{ predictions: ForecastPrediction[]; confidence: number }> {
    try {
      const aiAnalysisPrompt = `
      As an expert restaurant sales forecaster, analyze the provided statistical forecast and external factors to provide enhanced predictions with qualitative adjustments.

      Base Statistical Forecast:
      ${JSON.stringify(baseForecast.predictions.slice(0, 7))} // First 7 days

      External Factors:
      ${JSON.stringify(externalFactors)}

      Historical Context:
      - Average daily revenue: $${Math.round(historicalData.reduce((sum, d) => sum + d.revenue, 0) / historicalData.length)}
      - Recent trend: ${this.calculateTrend(historicalData.slice(-30)) > 0 ? 'Growing' : 'Declining'}
      - Seasonal pattern: Current season shows typical patterns

      Please provide:
      1. Adjusted daily sales predictions with reasoning
      2. Updated confidence intervals considering external factors
      3. Key factors influencing each day's forecast
      4. Overall confidence level (0-1)
      5. Risk scenarios to consider

      Respond in JSON format:
      {
        "adjustedPredictions": [array of predictions with adjustments],
        "confidence": number,
        "keyInsights": [array of insights],
        "riskFactors": [array of risk factors]
      }
      `;

      const aiResponse = await bedrockService.invokeClaude35Sonnet(aiAnalysisPrompt);
      const aiAnalysis = JSON.parse(aiResponse);

      // Apply AI adjustments to predictions
      const enhancedPredictions = baseForecast.predictions.map((prediction, index) => {
        const aiPrediction = aiAnalysis.adjustedPredictions?.[index];
        if (aiPrediction) {
          return {
            ...prediction,
            predictedRevenue: aiPrediction.adjustedRevenue || prediction.predictedRevenue,
            confidenceInterval: aiPrediction.confidenceInterval || prediction.confidenceInterval,
            factors: [...prediction.factors, ...(aiPrediction.factors || [])]
          };
        }
        return prediction;
      });

      return {
        predictions: enhancedPredictions,
        confidence: Math.min(aiAnalysis.confidence || baseForecast.confidence, baseForecast.confidence + 0.1)
      };
    } catch (error) {
      console.error('AI enhancement failed:', error);
      return baseForecast; // Fallback to statistical forecast
    }
  }

  private async generateScenarios(
    forecast: { predictions: ForecastPrediction[]; confidence: number },
    factors: ExternalFactor[]
  ): Promise<ForecastScenario[]> {
    const scenarios: ForecastScenario[] = [];

    // Optimistic scenario
    scenarios.push({
      name: 'Best Case',
      type: 'optimistic',
      adjustment: 0.25,
      description: 'All positive factors align, exceptional performance',
      predictions: forecast.predictions.map(p => ({
        ...p,
        predictedRevenue: Math.round(p.predictedRevenue * 1.25),
        predictedCustomers: Math.round(p.predictedCustomers * 1.25)
      }))
    });

    // Pessimistic scenario
    scenarios.push({
      name: 'Worst Case',
      type: 'pessimistic',
      adjustment: -0.20,
      description: 'Negative factors impact performance significantly',
      predictions: forecast.predictions.map(p => ({
        ...p,
        predictedRevenue: Math.round(p.predictedRevenue * 0.8),
        predictedCustomers: Math.round(p.predictedCustomers * 0.8)
      }))
    });

    // Realistic scenario (baseline)
    scenarios.push({
      name: 'Most Likely',
      type: 'realistic',
      adjustment: 0,
      description: 'Expected performance based on current trends',
      predictions: forecast.predictions
    });

    return scenarios;
  }

  private async generateRecommendations(
    forecast: { predictions: ForecastPrediction[]; confidence: number },
    factors: ExternalFactor[],
    request: ForecastRequest
  ): Promise<ForecastRecommendation[]> {
    const recommendations: ForecastRecommendation[] = [];

    // Analyze patterns for recommendations
    const weekdayAvg = forecast.predictions
      .filter(p => p.date.getDay() >= 1 && p.date.getDay() <= 5)
      .reduce((sum, p) => sum + p.predictedRevenue, 0) / 5;
    
    const weekendAvg = forecast.predictions
      .filter(p => p.date.getDay() === 0 || p.date.getDay() === 6)
      .reduce((sum, p) => sum + p.predictedRevenue, 0) / 2;

    if (weekendAvg > weekdayAvg * 1.5) {
      recommendations.push({
        id: 'weekend-staffing',
        type: 'staffing',
        priority: 'high',
        title: 'Increase Weekend Staffing',
        description: 'Weekend sales are significantly higher than weekdays. Consider increasing staff by 40%.',
        expectedImpact: 'Improved service quality and customer satisfaction',
        implementation: 'Schedule additional servers and kitchen staff',
        timeline: 'Immediate'
      });
    }

    // Weather-based recommendations
    const positiveWeatherFactors = factors.filter(f => f.type === 'weather' && f.impact > 0);
    if (positiveWeatherFactors.length > 0) {
      recommendations.push({
        id: 'weather-promotion',
        type: 'marketing',
        priority: 'medium',
        title: 'Weather-Based Promotions',
        description: 'Good weather expected. Promote outdoor seating and seasonal items.',
        expectedImpact: '10-15% increase in sales during good weather',
        implementation: 'Social media promotion and special menu items',
        timeline: '24 hours'
      });
    }

    return recommendations;
  }

  private async getModelAccuracy(restaurantId: string): Promise<number> {
    // In production, this would calculate actual vs predicted accuracy
    // For now, return a realistic accuracy score
    return 0.83; // 83% accuracy
  }

  async explainForecastChanges(
    oldForecast: ForecastResult,
    newForecast: ForecastResult
  ): Promise<string> {
    try {
      const explanationPrompt = `
      Explain the key differences between these restaurant sales forecasts and what factors drove the changes:

      Previous Forecast (avg daily revenue): $${Math.round(
        oldForecast.predictions.reduce((sum, p) => sum + p.predictedRevenue, 0) / oldForecast.predictions.length
      )}

      Updated Forecast (avg daily revenue): $${Math.round(
        newForecast.predictions.reduce((sum, p) => sum + p.predictedRevenue, 0) / newForecast.predictions.length
      )}

      Key Changes:
      - Confidence: ${oldForecast.confidence} → ${newForecast.confidence}
      - New factors: ${newForecast.factors.map(f => f.name).join(', ')}

      Provide a clear, concise explanation of what changed and why, suitable for a restaurant manager.
      `;

      return await bedrockService.invokeClaude35Sonnet(explanationPrompt);
    } catch (error) {
      console.error('Explanation generation failed:', error);
      return 'Forecast has been updated with the latest data and market conditions.';
    }
  }
}

// Export singleton instance
export const forecastingEngine = new ForecastingEngine();
export default ForecastingEngine;