/**
 * Enhanced Analytics Dashboard
 * Comprehensive dashboard showcasing enhanced data integration and AI capabilities
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart3,
  Brain,
  Database,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  Globe,
  Users,
  DollarSign,
  LineChart,
  Cpu,
  RefreshCw,
  Settings,
  Info,
  Lightbulb
} from "lucide-react";
import { EnhancedDataService } from "../../lib/enhanced-data-service";
import { AdvancedAIModels } from "../../lib/advanced-ai-models";
import { RealDataService } from "../../lib/real-data-service";
import { DataValidation } from "../../lib/data-validation-service";

interface EnhancedAnalyticsDashboardProps {
  restaurantId?: string;
  className?: string;
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  restaurantId = "restaurant_123",
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Data states
  const [economicData, setEconomicData] = useState<any>(null);
  const [socialSentiment, setSocialSentiment] = useState<any[]>([]);
  const [footTraffic, setFootTraffic] = useState<any>(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<any>(null);
  const [dataQuality, setDataQuality] = useState<any>(null);
  const [comprehensiveInsights, setComprehensiveInsights] = useState<any>(null);

  // Load all enhanced data
  const loadEnhancedData = async () => {
    setLoading(true);
    try {
      const [
        economic,
        social,
        traffic,
        predictive,
        quality,
        insights
      ] = await Promise.all([
        EnhancedDataService.getThaiEconomicIndicators(),
        EnhancedDataService.getSocialMediaSentiment(restaurantId),
        EnhancedDataService.getFootTrafficData(restaurantId),
        AdvancedAIModels.runPredictiveAnalytics(restaurantId, "full"),
        EnhancedDataService.getDataQualityMetrics(),
        RealDataService.EnhancedDataIntegration.getComprehensiveBusinessInsights(restaurantId, "month")
      ]);

      setEconomicData(economic);
      setSocialSentiment(social);
      setFootTraffic(traffic);
      setPredictiveAnalytics(predictive);
      setDataQuality(quality);
      setComprehensiveInsights(insights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load enhanced data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnhancedData();
  }, [restaurantId]);

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Economic Indicators */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Economic Environment</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {economicData ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {economicData.restaurant_sector_growth.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Restaurant sector growth</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>GDP: {economicData.gdp_growth.toFixed(1)}%</div>
                <div>Inflation: {economicData.inflation_rate.toFixed(1)}%</div>
                <div>Tourism: {economicData.tourism_index.toFixed(0)}</div>
                <div>Confidence: {economicData.consumer_confidence.toFixed(0)}</div>
              </div>
              <Badge variant={economicData.restaurant_sector_growth > 3 ? "default" : "secondary"}>
                {economicData.restaurant_sector_growth > 3 ? "Favorable" : "Challenging"}
              </Badge>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* Social Media Sentiment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social Sentiment</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {socialSentiment.length > 0 ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {(socialSentiment.reduce((sum, s) => sum + s.sentiment_score, 0) / socialSentiment.length).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Average sentiment score</p>
              <div className="space-y-1">
                {socialSentiment.slice(0, 3).map((platform, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="capitalize">{platform.platform}</span>
                    <Badge variant={platform.sentiment_score > 0.3 ? "default" : "secondary"} className="text-xs">
                      {platform.sentiment_score.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* Foot Traffic */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Foot Traffic</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {footTraffic ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">{footTraffic.daily_average}</div>
              <p className="text-xs text-muted-foreground">Daily average visitors</p>
              <div className="text-xs">
                <div>Peak hours: {footTraffic.weekly_pattern[0]?.peak_hours.slice(0, 3).join(", ")}:00</div>
                <div>Weekend boost: +{Math.round((footTraffic.weekly_pattern[5]?.average_traffic / footTraffic.weekly_pattern[0]?.average_traffic - 1) * 100)}%</div>
              </div>
              <Badge variant="default">
                {footTraffic.seasonal_trends.find((t: any) => t.month === new Date().toLocaleString('default', { month: 'long' }))?.traffic_multiplier > 1 ? "Peak Season" : "Regular Season"}
              </Badge>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Predictions</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {predictiveAnalytics ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {Math.round(predictiveAnalytics.confidence * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Prediction confidence</p>
              <div className="text-xs space-y-1">
                <div>Models: {predictiveAnalytics.predictions.length}</div>
                <div>Insights: {predictiveAnalytics.insights.length}</div>
                <div>Recommendations: {predictiveAnalytics.recommendations.length}</div>
              </div>
              <Badge variant={predictiveAnalytics.confidence > 0.8 ? "default" : "secondary"}>
                {predictiveAnalytics.confidence > 0.8 ? "High Confidence" : "Moderate Confidence"}
              </Badge>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* Data Quality */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {dataQuality ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {Math.round(dataQuality.reduce((sum: number, dq: any) => sum + dq.completeness_score, 0) / dataQuality.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Overall quality score</p>
              <div className="space-y-1">
                {dataQuality.slice(0, 3).map((source: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{source.source.replace('_', ' ')}</span>
                    <Badge variant={source.completeness_score > 85 ? "default" : "secondary"} className="text-xs">
                      {source.completeness_score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Integration Status</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {comprehensiveInsights ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {Math.round(comprehensiveInsights.integration_quality.confidence * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Integration health</p>
              <div className="space-y-1">
                {Object.entries(comprehensiveInsights.data_sources).map(([source, status]) => (
                  <div key={source} className="flex justify-between items-center text-xs">
                    <span>{source.replace('_', ' ')}</span>
                    {status ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {comprehensiveInsights?.insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Comprehensive Business Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {comprehensiveInsights.insights.map((insight: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                    <Badge variant={insight.category === "opportunity" ? "default" : insight.category === "warning" ? "destructive" : "secondary"}>
                      {insight.category}
                    </Badge>
                  </div>
                  {insight.actionText && (
                    <Button variant="outline" size="sm" className="mt-2">
                      {insight.actionText}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {predictiveAnalytics?.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictiveAnalytics.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-400">
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDataSourcesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Sources Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataQuality ? (
            <div className="space-y-4">
              {dataQuality.map((source: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{source.source.replace('_', ' ')}</h4>
                    <Badge variant={source.completeness_score > 85 ? "default" : "secondary"}>
                      {source.completeness_score}% Complete
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>
                      <div className="font-medium">{source.accuracy_score}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Freshness:</span>
                      <div className="font-medium">{source.freshness_hours}h ago</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Consistency:</span>
                      <div className="font-medium">{source.consistency_score}%</div>
                    </div>
                  </div>
                  {source.validation_errors.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-muted-foreground">Issues:</span>
                      <ul className="text-xs text-red-600 mt-1">
                        {source.validation_errors.map((error: string, errorIdx: number) => (
                          <li key={errorIdx}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse">Loading data sources...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive business intelligence with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadEnhancedData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {renderInsightsTab()}
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-6">
          {renderDataSourcesTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;