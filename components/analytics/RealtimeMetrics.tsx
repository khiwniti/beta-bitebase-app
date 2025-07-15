/**
 * Real-time Metrics Component
 * Displays live analytics data with trend indicators
 */

import { useState } from 'react';
import { useRealtimeAnalytics } from '../../hooks/useRealtimeAnalytics';

interface RealtimeMetricsProps {
  location?: {
    latitude: number;
    longitude: number;
  };
}

export default function RealtimeMetrics({ location }: RealtimeMetricsProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    isConnected,
    latestMetrics,
    trendData,
    startUpdates,
    stopUpdates
  } = useRealtimeAnalytics({
    location,
    enabled: isEnabled,
    updateInterval: 10000 // 10 seconds for demo
  });

  const toggleRealtime = () => {
    if (isEnabled) {
      setIsEnabled(false);
      stopUpdates();
    } else {
      setIsEnabled(true);
      startUpdates();
    }
  };

  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return '↗️';
    if (value < 0) return '↘️';
    return '➡️';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Real-time Analytics</h3>
          <p className="text-gray-600 text-sm mt-1">
            Live market data updates every 10 seconds
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          
          <button
            onClick={toggleRealtime}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isEnabled ? '⏹️ Stop Live Updates' : '▶️ Start Live Updates'}
          </button>
        </div>
      </div>

      {!isEnabled ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">📊</div>
          <p className="text-gray-600">Click "Start Live Updates" to begin real-time monitoring</p>
        </div>
      ) : !latestMetrics ? (
        <div className="text-center py-8">
          <div className="animate-spin text-2xl mb-3">⏳</div>
          <p className="text-gray-600">Connecting to real-time data stream...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Market Saturation</p>
                  <p className="text-xl font-bold text-gray-900">
                    {latestMetrics.current.marketSaturation.toFixed(1)}/10
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getChangeColor(latestMetrics.changes.marketSaturation)}`}>
                    {getChangeIcon(latestMetrics.changes.marketSaturation)}
                    {formatChange(latestMetrics.changes.marketSaturation)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Competitors</p>
                  <p className="text-xl font-bold text-gray-900">
                    {latestMetrics.current.competitorCount}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getChangeColor(latestMetrics.changes.competitorCount)}`}>
                    {getChangeIcon(latestMetrics.changes.competitorCount)}
                    {formatChange(latestMetrics.changes.competitorCount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Foot Traffic</p>
                  <p className="text-xl font-bold text-gray-900">
                    {latestMetrics.current.footTraffic.toFixed(0)}%
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getChangeColor(latestMetrics.changes.footTraffic)}`}>
                    {getChangeIcon(latestMetrics.changes.footTraffic)}
                    {formatChange(latestMetrics.changes.footTraffic)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sentiment</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(latestMetrics.current.sentiment * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getChangeColor(latestMetrics.changes.sentiment)}`}>
                    {getChangeIcon(latestMetrics.changes.sentiment)}
                    {formatChange(latestMetrics.changes.sentiment * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Trend Chart */}
          {trendData.length > 1 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Trend Overview (Last 10 minutes)</h4>
              <div className="h-20 flex items-end space-x-1">
                {trendData.slice(-10).map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                    style={{
                      height: `${Math.max(10, (point.footTraffic / 100) * 100)}%`
                    }}
                    title={`Foot Traffic: ${point.footTraffic.toFixed(1)}%`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">Foot traffic trend (hover for details)</p>
            </div>
          )}

          {/* Last Update */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(latestMetrics.current.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}