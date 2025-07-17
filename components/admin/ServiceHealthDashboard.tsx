/**
 * Service Health Dashboard
 * Monitor backend services and API health
 */

"use client"

import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Database,
  Activity,
  Clock
} from 'lucide-react';
import { useServiceHealth } from '../../hooks/useRestaurantData';
import { ApiReliability } from '../../services/api';

export default function ServiceHealthDashboard() {
  const { backendHealth, agentHealth, loading, refetch } = useServiceHealth();
  const [reliabilityStats, setReliabilityStats] = React.useState<any>(null);
  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  // Fetch reliability stats
  React.useEffect(() => {
    const updateStats = () => {
      const stats = {
        cache: ApiReliability.getCacheStats(),
        circuitBreakers: ApiReliability.getCircuitBreakerStats(),
        health: ApiReliability.getHealthStatus()
      };
      setReliabilityStats(stats);
      setLastUpdate(new Date());
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return <CheckCircle className="w-5 h-5 text-primary-500" />;
      case 'unhealthy':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return 'bg-primary-50 border-primary-200';
      case 'unhealthy':
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Service Health
        </h2>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Service */}
        <div className={`rounded-lg border p-4 ${getStatusColor(backendHealth?.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Restaurant Data API</h3>
            </div>
            {getStatusIcon(backendHealth?.status)}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium capitalize">
                {backendHealth?.status || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Endpoint:</span>
              <span className="font-mono text-xs">
                work-2-iedxpnjtcfddboej.prod-runtime.all-hands.dev
              </span>
            </div>
            {backendHealth?.message && (
              <div className="mt-2">
                <span className="text-gray-600">Message:</span>
                <p className="text-gray-800 mt-1">{backendHealth.message}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Available Endpoints:</h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span>/api/restaurants</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span>/api/wongnai/search</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span>/api/restaurants/:id/menu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <span>/api/restaurants/fetch-real-data</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Service */}
        <div className={`rounded-lg border p-4 ${getStatusColor(agentHealth?.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">AI Agent Service</h3>
            </div>
            {getStatusIcon(agentHealth?.status)}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium capitalize">
                {agentHealth?.status || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-mono text-xs">
                {agentHealth?.version || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port:</span>
              <span className="font-mono text-xs">8000</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Available Features:</h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Market Research</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Location Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Business Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Recommendation Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/restaurant-explorer"
            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Server className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Test Restaurant API</span>
          </a>
          <a
            href="/market-analysis"
            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Database className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Run Market Analysis</span>
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm">View Dashboard</span>
          </a>
        </div>
      </div>

      {/* Reliability Metrics */}
      {reliabilityStats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Reliability Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cache Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">Response Cache</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Cached Entries:</span>
                  <span className="font-mono">{reliabilityStats.cache.entries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">TTL:</span>
                  <span className="font-mono">5m</span>
                </div>
              </div>
            </div>

            {/* Circuit Breaker Stats */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <h4 className="font-medium text-yellow-900">Circuit Breakers</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Active:</span>
                  <span className="font-mono">{Object.keys(reliabilityStats.circuitBreakers).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Open:</span>
                  <span className="font-mono">
                    {Object.values(reliabilityStats.circuitBreakers).filter((cb: any) => cb.state === 'OPEN').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Monitoring */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-900">Health Monitoring</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Endpoints:</span>
                  <span className="font-mono">{Object.keys(reliabilityStats.health).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Healthy:</span>
                  <span className="font-mono">
                    {Object.values(reliabilityStats.health).filter((h: any) => h.status === 'healthy').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Circuit Breaker Details */}
          {Object.keys(reliabilityStats.circuitBreakers).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Circuit Breaker Status</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-2">
                  {Object.entries(reliabilityStats.circuitBreakers).map(([key, breaker]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-xs">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          breaker.state === 'OPEN' ? 'bg-red-100 text-red-800' :
                          breaker.state === 'HALF_OPEN' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {breaker.state}
                        </span>
                        <span className="text-gray-600">Failures: {breaker.failures}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Health Check Details */}
          {Object.keys(reliabilityStats.health).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Health Check Status</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-2">
                  {Object.entries(reliabilityStats.health).map(([endpoint, health]: [string, any]) => (
                    <div key={endpoint} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-xs">{endpoint}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          health.status === 'healthy' ? 'bg-green-100 text-green-800' :
                          health.status === 'unhealthy' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {health.status}
                        </span>
                        <span className="text-gray-600">Failures: {health.consecutive_failures || 0}</span>
                        {health.lastCheck && (
                          <span className="text-gray-500 text-xs">
                            {new Date(health.lastCheck).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Reliability Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            onClick={() => {
              ApiReliability.clearCache();
              setReliabilityStats(prev => prev ? {...prev, cache: ApiReliability.getCacheStats()} : null);
            }}
            className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Cache
          </button>
          <button
            onClick={() => {
              ApiReliability.resetCircuitBreakers();
              setReliabilityStats(prev => prev ? {...prev, circuitBreakers: ApiReliability.getCircuitBreakerStats()} : null);
            }}
            className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            Reset Breakers
          </button>
          <button
            onClick={() => window.open('/api/health', '_blank')}
            className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Activity className="w-4 h-4" />
            API Health
          </button>
          <button
            onClick={() => {
              const stats = {
                cache: ApiReliability.getCacheStats(),
                circuitBreakers: ApiReliability.getCircuitBreakerStats(),
                health: ApiReliability.getHealthStatus()
              };
              console.log('Reliability Stats:', stats);
              navigator.clipboard?.writeText(JSON.stringify(stats, null, 2));
            }}
            className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Database className="w-4 h-4" />
            Export Stats
          </button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}