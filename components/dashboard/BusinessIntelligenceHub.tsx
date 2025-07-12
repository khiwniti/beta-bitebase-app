import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  BarChart3,
  Globe,
  Calendar,
  Users,
  TrendingUp,
  Utensils,
  MapPin,
  Info,
  DollarSign,
} from "lucide-react";
import InsightsDashboard from "./InsightsDashboard";
import TrendsChart from "./TrendsChart";
import { cn } from "../../lib/utils";
import { apiClient, Restaurant } from "../../lib/api-client";
import { RealDataService } from "../../lib/real-data-service";

interface BusinessIntelligenceHubProps {
  userId?: string;
  locationId?: string;
  className?: string;
}

export default function BusinessIntelligenceHub({
  userId,
  locationId,
  className,
}: BusinessIntelligenceHubProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<
    "day" | "week" | "month" | "quarter" | "year"
  >("month");

  const [insights, setInsights] = useState<any[]>([]);
  const [trendsData, setTrendsData] = useState<any[]>([]);
  const [competitiveMetrics, setCompetitiveMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (locationId) {
      loadRestaurantData();
    }
  }, [locationId]);

  useEffect(() => {
    if (restaurant) {
      loadInsightsData();
      loadTrendsData();
      loadCompetitiveMetrics();
    }
  }, [restaurant, timeRange]);

  const loadRestaurantData = async () => {
    if (!locationId) return;
    setLoading(true);
    const response = await apiClient.getRestaurantById(locationId);
    if (response.data) {
      setRestaurant(response.data);
    }
    setLoading(false);
  };

  const loadInsightsData = async () => {
    if (!restaurant) return;
    setInsightsLoading(true);

    try {
      // Use real data service instead of mock data
      const realInsights =
        await RealDataService.BusinessIntelligence.getRestaurantInsights(
          restaurant.id.toString(),
          timeRange,
        );

      // Add icons to insights
      const insightsWithIcons = realInsights.map((insight) => ({
        ...insight,
        icon:
          insight.category === "opportunity"
            ? TrendingUp
            : insight.category === "warning"
              ? Info
              : insight.category === "positive"
                ? MapPin
                : Users,
      }));

      setInsights(insightsWithIcons);
    } catch (error) {
      console.error("Failed to load insights:", error);
      setInsights([]);
    } finally {
      setInsightsLoading(false);
    }
  };

  const loadTrendsData = async () => {
    if (!restaurant) return;
    setTrendsLoading(true);

    try {
      // Use real data service instead of mock data
      const realTrendsData =
        await RealDataService.BusinessIntelligence.getTrendsData(
          restaurant.id.toString(),
          timeRange,
        );

      setTrendsData(realTrendsData);
    } catch (error) {
      console.error("Failed to load trends data:", error);
      setTrendsData([]);
    } finally {
      setTrendsLoading(false);
    }
  };

  const loadCompetitiveMetrics = async () => {
    if (!restaurant) return;

    try {
      // Use real data service instead of mock data
      const realMetrics =
        await RealDataService.BusinessIntelligence.getCompetitiveMetrics(
          restaurant.id.toString(),
        );

      // Add icons to metrics
      const metricsWithIcons = realMetrics.map((metric, index) => ({
        ...metric,
        icon:
          index === 0 ? (
            <DollarSign className="h-5 w-5" />
          ) : index === 1 ? (
            <TrendingUp className="h-5 w-5" />
          ) : index === 2 ? (
            <Users className="h-5 w-5" />
          ) : (
            <BarChart3 className="h-5 w-5" />
          ),
      }));

      setCompetitiveMetrics(metricsWithIcons);
    } catch (error) {
      console.error("Failed to load competitive metrics:", error);
      setCompetitiveMetrics([]);
    }
  };

  const handleInsightAction = (insightId: string) => {
    console.log(`Insight action clicked: ${insightId}`);
    // Implementation: navigate to detailed analysis page or open modal
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Business Intelligence
        </h2>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
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
                    <CardTitle className="text-sm text-gray-600 font-medium">
                      {metric.title}
                    </CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {metric.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change !== undefined && (
                    <div
                      className={`text-xs font-medium flex items-center ${metric.change > 0 ? "text-primary-600" : "text-red-600"}`}
                    >
                      {metric.change > 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
                      <span className="text-gray-500 ml-1">
                        from previous {timeRange}
                      </span>
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
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-800">
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
                        <li
                          key={index}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="font-medium text-gray-900">
                            {insight.title}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {insight.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
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
                  Compare your performance against similar establishments in
                  your area.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[400px] flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Market analysis map visualization would be displayed here
                    </p>
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
                    <CardTitle className="text-sm text-gray-600 font-medium">
                      Peak Hours
                    </CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <div className="h-5 w-5 text-gray-600">🕐</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Dinner (6-9pm)</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Weekends show 32% higher traffic
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-gray-600 font-medium">
                      Avg. Transaction
                    </CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">$27.50</div>
                  <div className="text-xs text-primary-600 font-medium">
                    ↑ 3.2% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm text-gray-600 font-medium">
                      Customer Return Rate
                    </CardTitle>
                    <div className="p-2 bg-gray-100 rounded-md">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">42%</div>
                  <div className="text-xs text-primary-600 font-medium">
                    ↑ 5.7% from last month
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
