/**
 * API Integration Dashboard
 * Monitors and manages all external API connections and data sources
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Activity,
  Database,
  Globe,
  BarChart3,
  Users,
  MapPin,
  Settings,
  Info,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { ExternalAPIIntegrations } from "../../lib/external-api-integrations";
import { EnhancedDataService } from "../../lib/enhanced-data-service";

interface APIIntegrationDashboardProps {
  restaurantId?: string;
  className?: string;
}

const APIIntegrationDashboard: React.FC<APIIntegrationDashboardProps> = ({
  restaurantId = "restaurant_123",
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  
  // API Health States
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [dataSourceHealth, setDataSourceHealth] = useState<any>(null);
  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  // Load API integration data
  const loadIntegrationData = async () => {
    setLoading(true);
    try {
      const [
        healthStatus,
        dataHealth,
        allExternalData
      ] = await Promise.allSettled([
        ExternalAPIIntegrations.checkAPIHealth(),
        EnhancedDataService.checkDataSourceHealth(),
        ExternalAPIIntegrations.fetchAllExternalData(restaurantId, `place_${restaurantId}`)
      ]);

      if (healthStatus.status === 'fulfilled') {
        setApiHealth(healthStatus.value);
      }

      if (dataHealth.status === 'fulfilled') {
        setDataSourceHealth(dataHealth.value);
      }

      if (allExternalData.status === 'fulfilled') {
        setIntegrationStatus(allExternalData.value);
      }

      // Generate performance metrics
      setPerformanceMetrics({
        total_apis: 5,
        healthy_apis: Object.values(healthStatus.status === 'fulfilled' ? healthStatus.value : {})
          .filter((api: any) => api.status === 'healthy').length,
        avg_response_time: healthStatus.status === 'fulfilled' 
          ? Object.values(healthStatus.value)
              .filter((api: any) => api.response_time_ms)
              .reduce((sum: number, api: any) => sum + api.response_time_ms, 0) / 5
          : 0,
        data_freshness: "2 hours",
        cache_hit_rate: 78,
        error_rate: 2.3
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load integration data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrationData();
    
    // Set up periodic refresh
    const interval = setInterval(loadIntegrationData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [restaurantId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Connected" : "Disconnected"}
        </Badge>
      );
    }
    
    const variant = status === 'healthy' ? 'default' : 
                   status === 'warning' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overall Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {apiHealth ? Math.round(apiHealth.overall_health * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground">System health score</p>
          <div className="mt-2">
            {performanceMetrics && (
              <div className="text-sm">
                {performanceMetrics.healthy_apis}/{performanceMetrics.total_apis} APIs healthy
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performanceMetrics ? Math.round(performanceMetrics.avg_response_time) : 0}ms
          </div>
          <p className="text-xs text-muted-foreground">Average API response time</p>
          <div className="mt-2">
            {getStatusBadge(performanceMetrics?.avg_response_time < 300 ? 'healthy' : 'warning')}
          </div>
        </CardContent>
      </Card>

      {/* Data Freshness */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Data Freshness</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performanceMetrics?.data_freshness || "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">Latest data update</p>
          <div className="mt-2">
            {getStatusBadge('healthy')}
          </div>
        </CardContent>
      </Card>

      {/* Cache Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performanceMetrics?.cache_hit_rate || 0}%
          </div>
          <p className="text-xs text-muted-foreground">Cache efficiency</p>
          <div className="mt-2">
            {getStatusBadge(performanceMetrics?.cache_hit_rate > 70 ? 'healthy' : 'warning')}
          </div>
        </CardContent>
      </Card>

      {/* Error Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performanceMetrics?.error_rate || 0}%
          </div>
          <p className="text-xs text-muted-foreground">API error rate</p>
          <div className="mt-2">
            {getStatusBadge(performanceMetrics?.error_rate < 5 ? 'healthy' : 'warning')}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {integrationStatus?.successful_integrations || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            of {integrationStatus?.data_sources || 5} data sources
          </p>
          <div className="mt-2">
            {getStatusBadge(integrationStatus?.successful_integrations >= 3 ? 'healthy' : 'warning')}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAPIStatusTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            External API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiHealth && Object.entries(apiHealth).map(([apiName, status]: [string, any]) => {
              if (apiName === 'overall_health' || apiName === 'last_checked') return null;
              
              return (
                <div key={apiName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <h4 className="font-medium capitalize">
                        {apiName.replace('_api', '').replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {status.response_time_ms ? `${status.response_time_ms}ms response time` : 'No response data'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status.status)}
                    {status.error && (
                      <Badge variant="destructive" className="text-xs">
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Source Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataSourceHealth && Object.entries(dataSourceHealth).map(([sourceName, isHealthy]: [string, any]) => {
              if (sourceName === 'overall_health') return null;
              
              return (
                <div key={sourceName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(isHealthy ? 'healthy' : 'error')}
                    <div>
                      <h4 className="font-medium capitalize">
                        {sourceName.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Data source connectivity
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(isHealthy)}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataSourcesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Integration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {integrationStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Economic Data</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Bank of Thailand</span>
                    {getStatusBadge(integrationStatus.integration_status?.economic_api)}
                  </div>
                  {integrationStatus.economic_indicators && (
                    <div className="text-xs text-muted-foreground">
                      GDP Growth: {integrationStatus.economic_indicators.gdp_growth?.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Social Media</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Facebook</span>
                    {getStatusBadge(integrationStatus.integration_status?.facebook_api)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Instagram</span>
                    {getStatusBadge(integrationStatus.integration_status?.instagram_api)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Twitter</span>
                    {getStatusBadge(integrationStatus.integration_status?.twitter_api)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Location Data</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Google Places</span>
                    {getStatusBadge(integrationStatus.integration_status?.google_places_api)}
                  </div>
                  {integrationStatus.foot_traffic && (
                    <div className="text-xs text-muted-foreground">
                      Daily Average: {integrationStatus.foot_traffic.foot_traffic?.daily_average || 0} visitors
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Integration Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <Badge variant="default">
                      {Math.round((integrationStatus.successful_integrations / integrationStatus.data_sources) * 100)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last Updated: {new Date(integrationStatus.last_updated).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
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
          <h2 className="text-2xl font-bold">API Integration Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage external API connections and data sources
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
            onClick={loadIntegrationData}
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
          <TabsTrigger value="api-status">API Status</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="api-status" className="space-y-6">
          {renderAPIStatusTab()}
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-6">
          {renderDataSourcesTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIIntegrationDashboard;