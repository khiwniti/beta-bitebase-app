/**
 * Comprehensive Reliability Dashboard
 * Displays system reliability metrics, logs, and allows management actions
 */

"use client"

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Download, 
  Filter,
  Gauge,
  LineChart,
  RefreshCw, 
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';
import { monitoring } from '../../services/monitoring-service';
import { ApiReliability } from '../../services/api';

interface ReliabilityMetrics {
  uptime: number;
  responseTime: {
    avg: number;
    p95: number;
  };
  errorRate: number;
  requestCount: number;
  cacheHitRate: number;
  circuitBreakerStatus: Array<{
    endpoint: string;
    state: 'OPEN' | 'CLOSED' | 'HALF_OPEN';
    failures: number;
  }>;
}

interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  endpoint?: string;
  statusCode?: number;
  duration?: number;
}

export default function ReliabilityDashboard() {
  const [metrics, setMetrics] = useState<ReliabilityMetrics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Get system health and metrics
      const systemHealth = monitoring.getSystemHealth();
      const logSummary = monitoring.getLogSummary(
        selectedLevel === 'all' ? undefined : selectedLevel as any,
        parseInt(timeRange.replace('h', ''))
      );
      const apiStats = ApiReliability.getCacheStats();
      const circuitStats = ApiReliability.getCircuitBreakerStats();

      // Transform data for display
      const transformedMetrics: ReliabilityMetrics = {
        uptime: systemHealth.uptime / (1000 * 60 * 60 * 24), // Convert to days
        responseTime: {
          avg: systemHealth.metrics.avgResponseTime,
          p95: systemHealth.metrics.p95ResponseTime
        },
        errorRate: systemHealth.metrics.errorRate * 100, // Convert to percentage
        requestCount: systemHealth.metrics.requestCount,
        cacheHitRate: 0, // TODO: Implement cache hit rate tracking
        circuitBreakerStatus: Object.entries(circuitStats).map(([endpoint, breaker]: [string, any]) => ({
          endpoint,
          state: breaker.state,
          failures: breaker.failures
        }))
      };

      setMetrics(transformedMetrics);
      setLogs(logSummary.logs);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to refresh reliability data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedLevel, timeRange]);

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 0.99) return 'text-green-600';
    if (uptime >= 0.95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate <= 1) return 'text-green-600';
    if (errorRate <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime <= 200) return 'text-green-600';
    if (responseTime <= 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      case 'DEBUG': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const exportLogs = (format: 'json' | 'csv') => {
    const logsData = monitoring.exportLogs(format);
    const blob = new Blob([logsData], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reliability-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Reliability Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Uptime</p>
                <p className={`text-2xl font-bold ${getUptimeColor(metrics.uptime)}`}>
                  {(metrics.uptime * 100).toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className={`text-2xl font-bold ${getErrorRateColor(metrics.errorRate)}`}>
                  {metrics.errorRate.toFixed(2)}%
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className={`text-2xl font-bold ${getResponseTimeColor(metrics.responseTime.avg)}`}>
                  {metrics.responseTime.avg.toFixed(0)}ms
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Request Count</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.requestCount.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Circuit Breaker Status */}
      {metrics?.circuitBreakerStatus.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Circuit Breaker Status
          </h2>
          <div className="space-y-3">
            {metrics.circuitBreakerStatus.map((breaker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{breaker.endpoint}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    breaker.state === 'OPEN' ? 'bg-red-100 text-red-800' :
                    breaker.state === 'HALF_OPEN' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {breaker.state}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Failures: {breaker.failures}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics Chart Placeholder */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          Performance Trends
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Performance charts will be implemented here</p>
            <p className="text-sm">Response time, error rate, and throughput over time</p>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Logs
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARN">Warning</option>
              <option value="INFO">Info</option>
              <option value="DEBUG">Debug</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => exportLogs('json')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={() => exportLogs('csv')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.endpoint && (
                      <span className="font-mono text-xs text-blue-600">
                        {log.endpoint}
                      </span>
                    )}
                    {log.statusCode && (
                      <span className={`text-xs font-medium ${
                        log.statusCode >= 500 ? 'text-red-600' :
                        log.statusCode >= 400 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {log.statusCode}
                      </span>
                    )}
                    {log.duration && (
                      <span className="text-xs text-gray-500">
                        {log.duration}ms
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-900 mt-1">{log.message}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No logs found for the selected criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions Panel */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              ApiReliability.clearCache();
              monitoring.info('Cache cleared by user');
              refreshData();
            }}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Clear Response Cache
          </button>
          <button
            onClick={() => {
              ApiReliability.resetCircuitBreakers();
              monitoring.info('Circuit breakers reset by user');
              refreshData();
            }}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Gauge className="w-5 h-5" />
            Reset Circuit Breakers
          </button>
          <button
            onClick={() => {
              const healthData = monitoring.getSystemHealth();
              console.log('System Health:', healthData);
              navigator.clipboard?.writeText(JSON.stringify(healthData, null, 2));
              monitoring.info('System health exported by user');
            }}
            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Health Data
          </button>
        </div>
      </div>
    </div>
  );
}