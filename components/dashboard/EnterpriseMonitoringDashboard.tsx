"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PerformanceOptimization, 
  PerformanceMetrics 
} from '@/lib/performance-optimization-service';
import { 
  EnterpriseSecurity 
} from '@/lib/enterprise-security-service';
import { 
  Shield, 
  Activity, 
  Server, 
  Database, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Lock,
  Loader2,
  RefreshCw,
  Download,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface EnterpriseMonitoringDashboardProps {
  className?: string;
}

export default function EnterpriseMonitoringDashboard({ className }: EnterpriseMonitoringDashboardProps) {
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Performance data
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceMetrics[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<{
    insights: string[];
    recommendations: string[];
    alerts: Array<{ level: 'warning' | 'critical'; message: string }>;
  }>({ insights: [], recommendations: [], alerts: [] });

  // Security data
  const [securityMetrics, setSecurityMetrics] = useState<Record<string, any>>({});
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Cache data
  const [cacheStats, setCacheStats] = useState<any>({});

  // Load monitoring data
  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      // Load performance metrics
      const metrics = await PerformanceOptimization.collectPerformanceMetrics();
      setPerformanceMetrics(metrics);

      // Load performance history
      const history = PerformanceOptimization.getPerformanceHistory(24);
      setPerformanceHistory(history);

      // Load performance insights
      const insights = await PerformanceOptimization.getPerformanceInsights();
      setPerformanceInsights(insights);

      // Load security metrics
      const security = await EnterpriseSecurity.getSecurityMetrics();
      setSecurityMetrics(security);

      // Load recent audit logs
      const logs = await EnterpriseSecurity.getAuditLogs({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      });
      setAuditLogs(logs.slice(0, 50)); // Latest 50 logs

      // Load cache statistics
      const cache = PerformanceOptimization.getCacheStats();
      setCacheStats(cache);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    loadMonitoringData();
    
    if (autoRefresh) {
      const interval = setInterval(loadMonitoringData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Calculate trends
  const trends = useMemo(() => {
    if (performanceHistory.length < 2) return {};

    const recent = performanceHistory.slice(-10);
    const older = performanceHistory.slice(-20, -10);

    const recentAvg = {
      responseTime: recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length,
      memoryUsage: recent.reduce((sum, m) => sum + m.memoryUsage.percentage, 0) / recent.length,
      cacheHitRate: recent.reduce((sum, m) => sum + m.cacheMetrics.hitRate, 0) / recent.length
    };

    const olderAvg = {
      responseTime: older.reduce((sum, m) => sum + m.responseTime, 0) / older.length,
      memoryUsage: older.reduce((sum, m) => sum + m.memoryUsage.percentage, 0) / older.length,
      cacheHitRate: older.reduce((sum, m) => sum + m.cacheMetrics.hitRate, 0) / older.length
    };

    return {
      responseTime: recentAvg.responseTime - olderAvg.responseTime,
      memoryUsage: recentAvg.memoryUsage - olderAvg.memoryUsage,
      cacheHitRate: recentAvg.cacheHitRate - olderAvg.cacheHitRate
    };
  }, [performanceHistory]);

  // Get trend icon
  const getTrendIcon = (value: number) => {
    if (value > 0.1) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value < -0.1) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  // Get status color
  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-600 bg-red-50";
    if (value >= thresholds.warning) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Enterprise Monitoring
          </h2>
          <p className="text-muted-foreground">
            Real-time system performance, security, and health monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 text-green-700" : ""}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={loadMonitoringData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      {performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">{performanceMetrics.responseTime.toFixed(0)}ms</p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trends.responseTime || 0)}
                  <Server className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Memory Usage</p>
                  <p className="text-2xl font-bold">{performanceMetrics.memoryUsage.percentage.toFixed(1)}%</p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trends.memoryUsage || 0)}
                  <Database className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">{(performanceMetrics.cacheMetrics.hitRate * 100).toFixed(1)}%</p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(trends.cacheHitRate || 0)}
                  <Zap className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold">{securityMetrics.activeSessions || 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts */}
      {performanceInsights.alerts.length > 0 && (
        <div className="space-y-2">
          {performanceInsights.alerts.map((alert, index) => (
            <Alert key={index} className={alert.level === 'critical' ? 'border-red-500' : 'border-yellow-500'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                <Badge variant={alert.level === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.level.toUpperCase()}
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Monitoring Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="cache" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Cache
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            {performanceMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm font-medium">
                        {performanceMetrics.systemHealth.cpuUsage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={performanceMetrics.systemHealth.cpuUsage} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-medium">
                        {performanceMetrics.memoryUsage.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={performanceMetrics.memoryUsage.percentage} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Disk Usage</span>
                      <span className="text-sm font-medium">
                        {performanceMetrics.systemHealth.diskUsage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={performanceMetrics.systemHealth.diskUsage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceInsights.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
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
                  <Settings className="h-5 w-5" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {performanceInsights.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Optimization Opportunity</p>
                          <p className="text-sm text-muted-foreground">{recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {performanceMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {performanceMetrics.apiMetrics.totalRequests.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Requests</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {performanceMetrics.apiMetrics.averageResponseTime.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Error Rate:</span>
                      <span className={getStatusColor(performanceMetrics.apiMetrics.errorRate * 100, { warning: 1, critical: 5 })}>
                        {(performanceMetrics.apiMetrics.errorRate * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Slow Queries:</span>
                      <span>{performanceMetrics.apiMetrics.slowQueries}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Network & Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {performanceMetrics.systemHealth.networkLatency.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Network Latency</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {performanceMetrics.systemHealth.activeConnections}
                      </div>
                      <div className="text-xs text-muted-foreground">Active Connections</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {securityMetrics.successfulLoginsLast24h || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Successful Logins</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {securityMetrics.failedLoginsLast24h || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed Logins</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Sessions:</span>
                    <span className="font-medium">{securityMetrics.activeSessions || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Locked Accounts:</span>
                    <span className="font-medium">{securityMetrics.lockedAccounts || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Security Events:</span>
                    <span className="font-medium">{securityMetrics.securityEvents || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {auditLogs.filter(log => !log.success).slice(0, 5).map((log, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 border rounded-lg">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{log.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(new Date(log.timestamp))} • {log.resource}
                        </div>
                      </div>
                    </div>
                  ))}
                  {auditLogs.filter(log => !log.success).length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>No recent security events</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cache Tab */}
        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cache Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {(cacheStats.hitRate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Hit Rate</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {cacheStats.size || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Cache Size</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Requests:</span>
                    <span className="font-medium">{cacheStats.totalRequests || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cache Evictions:</span>
                    <span className="font-medium">{cacheStats.evictions || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Miss Rate:</span>
                    <span className="font-medium">{(cacheStats.missRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cache Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Cache Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Default TTL:</span>
                    <span className="font-medium">15 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max Size:</span>
                    <span className="font-medium">1000 entries</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Compression:</span>
                    <Badge variant="outline" className="text-green-600">Enabled</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cleanup Interval:</span>
                    <span className="font-medium">5 minutes</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Cache
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Audit Logs
                </span>
                <Badge variant="outline">
                  {auditLogs.length} entries
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {log.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{log.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.resource} • {formatTimeAgo(new Date(log.timestamp))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={log.success ? "outline" : "destructive"} className="text-xs">
                        {log.success ? "Success" : "Failed"}
                      </Badge>
                      {log.userId && (
                        <div className="text-xs text-muted-foreground mt-1">
                          User: {log.userId}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No audit logs available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      {lastUpdated && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
          {autoRefresh && " • Auto-refreshing every 30 seconds"}
        </div>
      )}
    </div>
  );
}