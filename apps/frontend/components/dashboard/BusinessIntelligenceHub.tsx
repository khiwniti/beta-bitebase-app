import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, Globe, Calendar, Users, TrendingUp, Utensils, MapPin, Info, DollarSign } from 'lucide-react';
import InsightsDashboard from './InsightsDashboard';
import TrendsChart from './TrendsChart';
import { cn } from '../../lib/utils';

interface BusinessIntelligenceHubProps {
  userId?: string;
  locationId?: string;
  className?: string;
}

export default function BusinessIntelligenceHub({
  userId,
  locationId,
  className
}: BusinessIntelligenceHubProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');

  const [insights, setInsights] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [competitiveMetrics, setCompetitiveMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (locationId) {
      loadInsightsData();
      loadTrendsData();
      loadCompetitiveMetrics();
    }
  }, [locationId, timeRange]);

  const loadInsightsData = async () => {
    setInsightsLoading(true);

    // Mock data - this would be an API call in production
    setTimeout(() => {
      const mockInsights = [
        {
          id: 'opportunity-1',
          title: 'High Growth Area',
          description: 'This location has shown a 12% increase in foot traffic over the last 6 months',
          icon: TrendingUp,
          category: 'opportunity',
          actionText: 'View detailed analysis',
        },
        {
          id: 'warning-1',
          title: 'High Competition',
          description: 'There are 8 similar restaurants within a 1km radius',
          icon: Info,
          category: 'warning',
          actionText: 'Explore competition',
        },
        {
          id: 'positive-1',
          title: 'Prime Location',
          description: 'This location is within 500m of multiple high-traffic areas',
          icon: MapPin,
          category: 'positive',
          actionText: 'View location details',
        },
        {
          id: 'neutral-1',
          title: 'Demographic Match',
          description: 'Area demographics align well with your target customer profile',
          icon: Users,
          category: 'neutral',
          actionText: 'View demographics',
        },
      ];

      setInsights(mockInsights);
      setInsightsLoading(false);
    }, 1000);
  };

  const loadTrendsData = async () => {
    setTrendsLoading(true);

    // Mock data - this would be an API call in production
    setTimeout(() => {
      // Create dynamic data points based on time range
      const today = new Date();
      const dataPoints: Array<{ date: string, value: number }> = [];
      const visitorDataPoints: Array<{ date: string, value: number }> = [];
      const competitorDataPoints: Array<{ date: string, value: number }> = [];

      let days = 30;
      switch (timeRange) {
        case 'day':
          days = 1;
          break;
        case 'week':
          days = 7;
          break;
        case 'month':
          days = 30;
          break;
        case 'quarter':
          days = 90;
          break;
        case 'year':
          days = 365;
          break;
      }

      for (let i = 0; i < (timeRange === 'day' ? 24 : days); i++) {
        const date = new Date();
        if (timeRange === 'day') {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }

        // Create somewhat realistic data with some randomization
        const baseValue = 1000;
        const randomFactor = Math.random() * 0.4 + 0.8; // 0.8-1.2x
        const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
        const timeBasedPattern = Math.sin((i / (timeRange === 'day' ? 24 : days)) * Math.PI * 2) * 0.2 + 1;

        const value = Math.round(baseValue * randomFactor * weekendBoost * timeBasedPattern);
        const visitorValue = Math.round(value * 0.2);
        const competitorValue = Math.round(baseValue * 0.7 * randomFactor * weekendBoost * timeBasedPattern);

        dataPoints.unshift({
          date: date.toISOString(),
          value
        });

        visitorDataPoints.unshift({
          date: date.toISOString(),
          value: visitorValue
        });

        competitorDataPoints.unshift({
          date: date.toISOString(),
          value: competitorValue
        });
      }

      const mockTrendsData = [
        {
          id: 'revenue',
          label: 'Revenue',
          data: dataPoints,
          color: '#22c55e',
          fill: true
        },
        {
          id: 'visitors',
          label: 'Visitors',
          data: visitorDataPoints,
          color: '#3b82f6'
        },
        {
          id: 'competitors',
          label: 'Competitor Revenue',
          data: competitorDataPoints,
          color: '#ef4444',
          dashed: true
        }
      ];

      setTrendsData(mockTrendsData);
      setTrendsLoading(false);
    }, 1200);
  };

  const loadCompetitiveMetrics = async () => {
    // Mock data - this would be an API call in production
    setTimeout(() => {
      const mockMetrics = [
        {
          title: 'Market Share',
          value: '23%',
          change: +2.5,
          icon: <DollarSign className="h-5 w-5" />,
          description: 'Market share in your area'
        },
        {
          title: 'Competitive Rank',
          value: '3rd',
          change: +1,
          icon: <TrendingUp className="h-5 w-5" />,
          description: 'Among similar businesses'
        },
        {
          title: 'Customer Loyalty',
          value: '76%',
          change: -1.2,
          icon: <Users className="h-5 w-5" />,
          description: 'Return rate within 30 days'
        },
        {
          title: 'Growth Rate',
          value: '+12%',
          change: +3.8,
          icon: <BarChart3 className="h-5 w-5" />,
          description: 'Year-over-year growth'
        },
      ];

      setCompetitiveMetrics(mockMetrics);
    }, 800);
  };

  const handleInsightAction = (insightId: string) => {
    console.log(`Insight action clicked: ${insightId}`);
    // Implementation: navigate to detailed analysis page or open modal
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Business Intelligence</h2>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 size={16} />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <Globe size={16} />
            <span>Market Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitiveMetrics.map((metric, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-gray-600 font-medium">{metric.title}</CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {metric.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change !== undefined && (
                    <div className={`text-xs font-medium flex items-center ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                      <span className="text-gray-500 ml-1">from previous {timeRange}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TrendsChart
                title="Revenue & Visitors"
                datasets={trendsData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                loading={trendsLoading}
                height={280}
              />
            </div>
            <div>
              <Card className="shadow-sm h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Top Insights</CardTitle>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {insights.length} New
                    </span>
                  </div>
                  <CardDescription>Key findings from your data</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  {insightsLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-green-600"></div>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {insights.slice(0, 3).map((insight, index) => (
                        <li key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="font-medium text-gray-900">{insight.title}</div>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View All Insights →
                  </button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Competitive Market Analysis</CardTitle>
                <CardDescription>
                  Compare your performance against similar establishments in your area.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px] flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Market analysis map visualization would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <InsightsDashboard
            isLoading={insightsLoading}
            onExplore={handleInsightAction}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <TrendsChart
              title="Revenue Trends"
              datasets={trendsData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              loading={trendsLoading}
              height={400}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-gray-600 font-medium">Peak Hours</CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <div className="h-5 w-5 text-gray-600">🕐</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Dinner (6-9pm)</div>
                  <div className="text-sm text-gray-600 mt-1">Weekends show 32% higher traffic</div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-gray-600 font-medium">Avg. Transaction</CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">$27.50</div>
                  <div className="text-xs text-green-600 font-medium">↑ 3.2% from last month</div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-gray-600 font-medium">Customer Return Rate</CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">42%</div>
                  <div className="text-xs text-green-600 font-medium">↑ 5.7% from last month</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}