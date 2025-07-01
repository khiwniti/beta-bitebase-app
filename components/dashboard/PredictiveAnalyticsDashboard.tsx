"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  AdvancedAIModels, 
  PredictiveAnalyticsResult,
  ClusteringResult,
  RegressionResult,
  TimeSeriesResult,
  NLPSentimentResult
} from '@/lib/advanced-ai-models';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  BarChart3, 
  PieChart, 
  LineChart,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Download,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface PredictiveAnalyticsDashboardProps {
  restaurantId?: string;
  className?: string;
}

export default function PredictiveAnalyticsDashboard({ 
  restaurantId = "restaurant_demo", 
  className 
}: PredictiveAnalyticsDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [analysisType, setAnalysisType] = useState<"full" | "clustering" | "regression" | "time_series" | "nlp">("full");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Analytics data
  const [predictiveResults, setPredictiveResults] = useState<PredictiveAnalyticsResult | null>(null);
  const [clusteringData, setClusteringData] = useState<ClusteringResult | null>(null);
  const [regressionData, setRegressionData] = useState<RegressionResult | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesResult | null>(null);
  const [sentimentData, setSentimentData] = useState<NLPSentimentResult | null>(null);
  const [modelPerformance, setModelPerformance] = useState<Record<string, any>>({});

  // Load predictive analytics
  const loadPredictiveAnalytics = async () => {
    setLoading(true);
    try {
      // Load comprehensive analytics
      const results = await AdvancedAIModels.runPredictiveAnalytics(restaurantId, analysisType);
      setPredictiveResults(results);

      // Load individual model results
      if (analysisType === "full" || analysisType === "clustering") {
        const mockRestaurants = Array.from({ length: 50 }, (_, i) => ({
          id: i,
          rating: 3 + Math.random() * 2,
          price_range: Math.floor(Math.random() * 4) + 1,
          review_count: Math.floor(Math.random() * 500) + 10,
          distance: Math.random() * 10
        }));
        const clustering = await AdvancedAIModels.performMarketSegmentation(mockRestaurants);
        setClusteringData(clustering);
      }

      if (analysisType === "full" || analysisType === "regression") {
        const regression = await AdvancedAIModels.predictSales([], []);
        setRegressionData(regression);
      }

      if (analysisType === "full" || analysisType === "time_series") {
        const timeSeries = await AdvancedAIModels.analyzeSeasonalTrends([]);
        setTimeSeriesData(timeSeries);
      }

      if (analysisType === "full" || analysisType === "nlp") {
        const mockReviews = [
          "Great food and excellent service, will definitely come back!",
          "The atmosphere was cozy but the food was a bit overpriced",
          "Amazing flavors and friendly staff, highly recommended",
          "Service was slow and the food was cold when it arrived",
          "Perfect place for a romantic dinner, delicious food and great ambiance"
        ];
        const sentiment = await AdvancedAIModels.analyzeReviewSentiment(mockReviews);
        setSentimentData(sentiment);
      }

      // Load model performance metrics
      const performance = await AdvancedAIModels.getModelPerformanceMetrics();
      setModelPerformance(performance);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load predictive analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and analysis type change
  useEffect(() => {
    loadPredictiveAnalytics();
  }, [analysisType, restaurantId]);

  // Calculate confidence score color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  // Format percentage
  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  // Get sentiment color
  const getSentimentColor = (score: number) => {
    if (score > 0.1) return "text-green-600 bg-green-50";
    if (score < -0.1) return "text-red-600 bg-red-50";
    return "text-yellow-600 bg-yellow-50";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Predictive Analytics
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights and forecasting for strategic decision making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadPredictiveAnalytics} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analysis Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Analysis Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Analysis</SelectItem>
                  <SelectItem value="clustering">Market Segmentation</SelectItem>
                  <SelectItem value="regression">Sales Prediction</SelectItem>
                  <SelectItem value="time_series">Seasonal Trends</SelectItem>
                  <SelectItem value="nlp">Sentiment Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="w-full">
                {lastUpdated && (
                  <div className="text-sm text-muted-foreground mb-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
                <Button onClick={loadPredictiveAnalytics} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="clustering" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Clustering
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {predictiveResults ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Confidence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Analysis Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getConfidenceColor(predictiveResults.confidence)}`}>
                      {formatPercentage(predictiveResults.confidence)}
                    </div>
                    <Progress value={predictiveResults.confidence * 100} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Overall prediction confidence
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {predictiveResults.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {predictiveResults.recommendations.map((recommendation, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Action Item</p>
                            <p className="text-sm text-muted-foreground">{recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Running predictive analysis...</p>
                    </>
                  ) : (
                    <>
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No analysis results available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Clustering Tab */}
        <TabsContent value="clustering" className="space-y-4">
          {clusteringData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clustering Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Market Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {clusteringData.clusters.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Market Segments</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(clusteringData.silhouette_score)}
                      </div>
                      <div className="text-xs text-muted-foreground">Quality Score</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Algorithm:</span>
                      <span className="font-medium">{clusteringData.algorithm.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimal Clusters:</span>
                      <span className="font-medium">{clusteringData.optimal_clusters}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cluster Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Cluster Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {clusteringData.clusters.map((cluster, index) => (
                      <div key={cluster.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Cluster {index + 1}</span>
                          <Badge variant="outline">{cluster.size} members</Badge>
                        </div>
                        <div className="space-y-1">
                          {cluster.characteristics.map((char, i) => (
                            <div key={i} className="text-sm text-muted-foreground">
                              • {char}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Clustering Insights */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Clustering Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {clusteringData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Analyzing market segments...</p>
                    </>
                  ) : (
                    <>
                      <PieChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No clustering analysis available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Prediction */}
            {regressionData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {formatPercentage(regressionData.r_squared)}
                      </div>
                      <div className="text-xs text-muted-foreground">R-Squared</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(regressionData.mae)}
                      </div>
                      <div className="text-xs text-muted-foreground">MAE</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Feature Importance</h4>
                    {Object.entries(regressionData.feature_importance).map(([feature, importance]) => (
                      <div key={feature} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{feature.replace('_', ' ')}</span>
                          <span>{formatPercentage(importance as number)}</span>
                        </div>
                        <Progress value={(importance as number) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Series Analysis */}
            {timeSeriesData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Seasonal Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(timeSeriesData.accuracy_metrics.mape)}%
                      </div>
                      <div className="text-xs text-muted-foreground">MAPE</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {timeSeriesData.forecast_horizon}
                      </div>
                      <div className="text-xs text-muted-foreground">Days Forecast</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Seasonality Detected:</span>
                      <span className="font-medium">
                        {timeSeriesData.seasonality.detected ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trend Direction:</span>
                      <span className="font-medium capitalize">
                        {timeSeriesData.trend.direction}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trend Strength:</span>
                      <span className="font-medium">
                        {formatPercentage(timeSeriesData.trend.strength)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-4">
          {sentimentData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Sentiment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Overall Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getSentimentColor(sentimentData.overall_sentiment.score).split(' ')[0]}`}>
                      {sentimentData.overall_sentiment.score > 0 ? '+' : ''}{(sentimentData.overall_sentiment.score * 100).toFixed(1)}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getSentimentColor(sentimentData.overall_sentiment.score)}
                    >
                      {sentimentData.overall_sentiment.label.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatPercentage(sentimentData.overall_sentiment.confidence)} confidence
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Aspect Sentiment */}
              <Card>
                <CardHeader>
                  <CardTitle>Aspect Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sentimentData.aspect_sentiment.map((aspect, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{aspect.aspect}</span>
                          <Badge variant="outline" className="text-xs">
                            {aspect.mentions} mentions
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={Math.abs(aspect.sentiment_score) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className={`text-sm ${aspect.sentiment_score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {aspect.sentiment_score > 0 ? '+' : ''}{(aspect.sentiment_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Topics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Key Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sentimentData.topics.map((topic, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{topic.topic}</span>
                          <Badge variant="outline">
                            {formatPercentage(topic.relevance)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {topic.keywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Analyzing sentiment...</p>
                    </>
                  ) : (
                    <>
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No sentiment analysis available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {Object.keys(modelPerformance).length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(modelPerformance).map(([modelName, metrics]) => (
                <Card key={modelName}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{modelName.replace('_', ' ')}</span>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(metrics.last_run).toLocaleTimeString()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(metrics).map(([key, value]) => {
                        if (key === 'last_run') return null;
                        return (
                          <div key={key} className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {typeof value === 'number' ?
                                (key.includes('time') ? `${value}ms` :
                                 key.includes('accuracy') || key.includes('r_squared') ? formatPercentage(value) :
                                 value.toLocaleString()) :
                                String(value)}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace('_', ' ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Loading performance metrics...</p>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No performance metrics available</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}