/**
 * Real-time Analytics Hook
 * Provides WebSocket connection for live analytics updates
 */

import { useState, useEffect, useRef } from 'react';

interface RealtimeData {
  timestamp: string;
  marketSaturation: number;
  competitorCount: number;
  footTraffic: number;
  priceIndex: number;
  sentiment: number;
}

interface UseRealtimeAnalyticsProps {
  location?: {
    latitude: number;
    longitude: number;
  };
  enabled?: boolean;
  updateInterval?: number;
}

export function useRealtimeAnalytics({
  location,
  enabled = false,
  updateInterval = 30000 // 30 seconds
}: UseRealtimeAnalyticsProps) {
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time data updates (in production, this would be WebSocket)
  const generateMockRealtimeData = (): RealtimeData => {
    const baseValues = {
      marketSaturation: 6,
      competitorCount: 5,
      footTraffic: 75,
      priceIndex: 85,
      sentiment: 0.7
    };

    return {
      timestamp: new Date().toISOString(),
      marketSaturation: baseValues.marketSaturation + (Math.random() - 0.5) * 2,
      competitorCount: Math.max(1, baseValues.competitorCount + Math.floor((Math.random() - 0.5) * 3)),
      footTraffic: Math.max(0, baseValues.footTraffic + (Math.random() - 0.5) * 20),
      priceIndex: Math.max(0, baseValues.priceIndex + (Math.random() - 0.5) * 15),
      sentiment: Math.max(0, Math.min(1, baseValues.sentiment + (Math.random() - 0.5) * 0.3))
    };
  };

  const startRealtimeUpdates = () => {
    if (!enabled || !location) return;

    setIsConnected(true);
    setError(null);

    // Add initial data point
    setRealtimeData([generateMockRealtimeData()]);

    // Set up interval for mock updates
    intervalRef.current = setInterval(() => {
      const newData = generateMockRealtimeData();
      setRealtimeData(prev => {
        const updated = [...prev, newData];
        // Keep only last 20 data points
        return updated.slice(-20);
      });
    }, updateInterval);
  };

  const stopRealtimeUpdates = () => {
    setIsConnected(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    if (enabled && location) {
      startRealtimeUpdates();
    } else {
      stopRealtimeUpdates();
    }

    return () => {
      stopRealtimeUpdates();
    };
  }, [enabled, location?.latitude, location?.longitude, updateInterval]);

  const getLatestMetrics = () => {
    if (realtimeData.length === 0) return null;
    
    const latest = realtimeData[realtimeData.length - 1];
    const previous = realtimeData.length > 1 ? realtimeData[realtimeData.length - 2] : latest;
    
    return {
      current: latest,
      changes: {
        marketSaturation: latest.marketSaturation - previous.marketSaturation,
        competitorCount: latest.competitorCount - previous.competitorCount,
        footTraffic: latest.footTraffic - previous.footTraffic,
        priceIndex: latest.priceIndex - previous.priceIndex,
        sentiment: latest.sentiment - previous.sentiment
      }
    };
  };

  const getTrendData = () => {
    return realtimeData.map(data => ({
      timestamp: new Date(data.timestamp).getTime(),
      marketSaturation: data.marketSaturation,
      footTraffic: data.footTraffic,
      sentiment: data.sentiment * 100
    }));
  };

  return {
    realtimeData,
    isConnected,
    error,
    latestMetrics: getLatestMetrics(),
    trendData: getTrendData(),
    startUpdates: startRealtimeUpdates,
    stopUpdates: stopRealtimeUpdates
  };
}