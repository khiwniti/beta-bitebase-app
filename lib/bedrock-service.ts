/**
 * AWS Bedrock Service for BiteBase AI-Powered Analytics
 * Integrates Claude 3.5 Sonnet, Claude 3 Haiku, and Amazon Titan models
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export interface ConversationalQuery {
  userInput: string;
  restaurantContext: RestaurantContext;
  conversationHistory: Message[];
}

export interface RestaurantContext {
  id: string;
  name: string;
  cuisine: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  priceRange: number;
  operatingHours: any;
  metadata?: any;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  insights: AnalyticsInsight[];
  visualizations: ChartConfig[];
  narrative: string;
  actionItems: ActionItem[];
  confidence: number;
  sources: string[];
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: DataPoint[];
  impact: {
    financial: number;
    confidence: number;
  };
  createdAt: Date;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title: string;
  data: any[];
  config: any;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  implementationComplexity: 'low' | 'medium' | 'high';
  timeline: string;
}

export interface DataPoint {
  metric: string;
  value: number;
  timestamp: Date;
  source: string;
}

export interface ModelSelectionStrategy {
  queryType: 'simple' | 'complex' | 'analysis' | 'embedding';
  recommendedModel: string;
  costPer1kTokens: number;
  avgResponseTime: number;
}

class BedrockService {
  private client: BedrockRuntimeClient;
  private strategies: ModelSelectionStrategy[] = [
    {
      queryType: 'simple',
      recommendedModel: 'claude-3-haiku',
      costPer1kTokens: 0.00025,
      avgResponseTime: 1.2
    },
    {
      queryType: 'complex',
      recommendedModel: 'claude-3.5-sonnet',
      costPer1kTokens: 0.003,
      avgResponseTime: 3.5
    },
    {
      queryType: 'analysis',
      recommendedModel: 'claude-3.5-sonnet',
      costPer1kTokens: 0.003,
      avgResponseTime: 3.5
    },
    {
      queryType: 'embedding',
      recommendedModel: 'titan-embed-text-v1',
      costPer1kTokens: 0.0001,
      avgResponseTime: 0.8
    }
  ];

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }
    });
  }

  async processQuery(query: ConversationalQuery): Promise<AIResponse> {
    try {
      // 1. Intent classification using Claude 3 Haiku for speed
      const intent = await this.classifyIntent(query.userInput);
      
      // 2. Data retrieval based on intent
      const relevantData = await this.fetchRelevantData(intent, query.restaurantContext);
      
      // 3. Select optimal model based on query complexity
      const modelChoice = this.selectOptimalModel(query.userInput, { intent, relevantData });
      
      // 4. Analysis generation using selected model
      const analysis = await this.generateAnalysis(
        relevantData, 
        query.userInput, 
        query.conversationHistory,
        modelChoice
      );
      
      // 5. Visualization recommendations
      const visualizations = await this.recommendVisualizations(analysis);
      
      return {
        insights: analysis.insights,
        visualizations,
        narrative: analysis.narrative,
        actionItems: analysis.actionItems,
        confidence: analysis.confidence,
        sources: analysis.sources
      };
    } catch (error) {
      console.error('Error processing query:', error);
      throw new Error('Failed to process conversational query');
    }
  }

  async invokeClaude35Sonnet(prompt: string, systemPrompt?: string): Promise<string> {
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 4000,
        temperature: 0.1,
        system: systemPrompt || 'You are an expert restaurant business analyst providing data-driven insights.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  }

  async invokeClaudeHaiku(prompt: string): Promise<string> {
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const command = new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v1',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        inputText: text
      })
    });
    
    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding;
  }

  private async classifyIntent(userInput: string): Promise<string> {
    const intentPrompt = `
    Classify the following restaurant business query into one of these categories:
    - analytics: General data analysis and metrics
    - forecasting: Predicting future performance
    - comparison: Competitive analysis or benchmarking
    - optimization: Menu, pricing, or operational improvements
    - exploration: Discovering trends or insights
    - simple_query: Basic information requests
    
    Query: "${userInput}"
    
    Respond with just the category name.
    `;

    try {
      const result = await this.invokeClaudeHaiku(intentPrompt);
      return result.trim().toLowerCase();
    } catch (error) {
      console.error('Intent classification failed:', error);
      return 'analytics'; // fallback
    }
  }

  private async fetchRelevantData(intent: string, context: RestaurantContext): Promise<any> {
    // This would integrate with your existing data services
    // For now, return mock structure - replace with actual data fetching
    return {
      restaurantMetrics: {
        revenue: 0,
        customerCount: 0,
        averageOrderValue: 0,
        trends: []
      },
      marketData: {
        competitors: [],
        demographics: {},
        trends: []
      },
      context
    };
  }

  private selectOptimalModel(query: string, context: any): string {
    const complexity = this.analyzeQueryComplexity(query, context);
    const strategy = this.strategies.find(s => s.queryType === complexity);
    return strategy?.recommendedModel || 'claude-3-haiku';
  }

  private analyzeQueryComplexity(query: string, context: any): 'simple' | 'complex' | 'analysis' | 'embedding' {
    // Simple heuristics - could be enhanced with ML
    if (query.length < 50 && !context.requiresAnalysis) return 'simple';
    if (context.requiresDeepAnalysis || 
        query.includes('analyze') || 
        query.includes('recommend') ||
        query.includes('compare') ||
        query.includes('forecast')) return 'complex';
    if (context.isSearchQuery) return 'embedding';
    return 'analysis';
  }

  private async generateAnalysis(
    data: any, 
    userInput: string, 
    history: Message[],
    model: string
  ): Promise<any> {
    const systemPrompt = `
    You are an expert restaurant business analyst with access to comprehensive restaurant performance data. 
    Analyze the provided data and user question to generate actionable insights with specific recommendations.
    
    Always structure your response as valid JSON with:
    {
      "insights": [array of insight objects with type, priority, title, description, evidence],
      "narrative": "conversational explanation of findings",
      "actionItems": [array of specific recommendations with priority and impact],
      "confidence": number between 0-1,
      "sources": [array of data sources used]
    }
    
    Focus on practical, implementable recommendations that can drive business results.
    `;

    const userPrompt = `
    Restaurant Data: ${JSON.stringify(data)}
    User Question: ${userInput}
    Conversation History: ${JSON.stringify(history.slice(-5))} // Last 5 messages for context
    
    Please provide a comprehensive analysis with specific recommendations in JSON format.
    `;

    try {
      let result: string;
      if (model === 'claude-3.5-sonnet') {
        result = await this.invokeClaude35Sonnet(userPrompt, systemPrompt);
      } else {
        result = await this.invokeClaudeHaiku(userPrompt);
      }

      // Parse the JSON response
      const parsed = JSON.parse(result);
      return {
        insights: parsed.insights || [],
        narrative: parsed.narrative || result,
        actionItems: parsed.actionItems || [],
        confidence: parsed.confidence || 0.8,
        sources: parsed.sources || ['restaurant_data', 'market_analysis']
      };
    } catch (error) {
      console.error('Analysis generation failed:', error);
      return {
        insights: [],
        narrative: "I'm having trouble analyzing your data right now. Please try again later.",
        actionItems: [],
        confidence: 0.1,
        sources: []
      };
    }
  }

  private async recommendVisualizations(analysis: any): Promise<ChartConfig[]> {
    // Generate visualization recommendations based on the analysis
    const visualizations: ChartConfig[] = [];

    // Add relevant chart configs based on insights
    if (analysis.insights.some((i: any) => i.type === 'trend')) {
      visualizations.push({
        type: 'line',
        title: 'Performance Trends',
        data: [],
        config: {
          xAxis: 'date',
          yAxis: 'value',
          color: 'primary'
        }
      });
    }

    return visualizations;
  }
}

// Export singleton instance
export const bedrockService = new BedrockService();
export default BedrockService;