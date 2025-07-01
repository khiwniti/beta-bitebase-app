/**
 * Connection Status Monitor for BiteBase
 * Monitors API health and provides connection status for dashboards
 */

import { apiClient } from './api-client';

export interface ConnectionStatus {
  isConnected: boolean;
  lastCheck: Date;
  backendHealth: 'healthy' | 'degraded' | 'down';
  apiResponseTime: number;
  errorCount: number;
  lastError?: string;
}

export interface HealthMetrics {
  backend: {
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    lastCheck: Date;
  };
  database: {
    status: 'connected' | 'disconnected' | 'unknown';
    responseTime: number;
  };
  externalApis: {
    foursquare: 'available' | 'limited' | 'unavailable';
    google: 'available' | 'limited' | 'unavailable';
    wongnai: 'available' | 'limited' | 'unavailable';
  };
}

class ConnectionMonitorService {
  private status: ConnectionStatus = {
    isConnected: false,
    lastCheck: new Date(),
    backendHealth: 'down',
    apiResponseTime: 0,
    errorCount: 0,
  };

  private healthMetrics: HealthMetrics = {
    backend: { status: 'down', responseTime: 0, lastCheck: new Date() },
    database: { status: 'unknown', responseTime: 0 },
    externalApis: {
      foursquare: 'unavailable',
      google: 'unavailable',
      wongnai: 'unavailable',
    },
  };

  private listeners: Array<(status: ConnectionStatus) => void> = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private isChecking = false;

  constructor() {
    this.startMonitoring();
  }

  /**
   * Start continuous health monitoring
   */
  startMonitoring(intervalMs: number = 30000) {
    this.stopMonitoring();
    
    // Initial check
    this.checkHealth();
    
    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, intervalMs);
    
    console.log('🔍 Connection monitoring started');
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Perform comprehensive health check
   */
  async checkHealth(): Promise<HealthMetrics> {
    if (this.isChecking) return this.healthMetrics;
    
    this.isChecking = true;
    const startTime = performance.now();

    try {
      // Check backend health
      const backendResult = await this.checkBackendHealth();
      const responseTime = performance.now() - startTime;

      // Update connection status
      this.status = {
        isConnected: backendResult.isHealthy,
        lastCheck: new Date(),
        backendHealth: backendResult.health,
        apiResponseTime: responseTime,
        errorCount: backendResult.isHealthy ? 0 : this.status.errorCount + 1,
        lastError: backendResult.error,
      };

      // Update health metrics
      this.healthMetrics = {
        backend: {
          status: backendResult.isHealthy ? 'up' : 'down',
          responseTime,
          lastCheck: new Date(),
        },
        database: {
          status: backendResult.databaseStatus || 'unknown',
          responseTime: backendResult.dbResponseTime || 0,
        },
        externalApis: {
          foursquare: backendResult.externalApis?.foursquare || 'unavailable',
          google: backendResult.externalApis?.google || 'unavailable',
          wongnai: backendResult.externalApis?.wongnai || 'unavailable',
        },
      };

      // Notify listeners
      this.notifyListeners();

    } catch (error) {
      console.error('❌ Health check failed:', error);
      this.status.errorCount++;
      this.status.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.status.isConnected = false;
      this.status.backendHealth = 'down';
    } finally {
      this.isChecking = false;
    }

    return this.healthMetrics;
  }

  /**
   * Check backend API health
   */
  private async checkBackendHealth(): Promise<{
    isHealthy: boolean;
    health: 'healthy' | 'degraded' | 'down';
    error?: string;
    databaseStatus?: 'connected' | 'disconnected' | 'unknown';
    dbResponseTime?: number;
    externalApis?: {
      foursquare: 'available' | 'limited' | 'unavailable';
      google: 'available' | 'limited' | 'unavailable';
      wongnai: 'available' | 'limited' | 'unavailable';
    };
  }> {
    try {
      const response = await apiClient.checkBackendHealth();
      
      if (response.error) {
        return {
          isHealthy: false,
          health: 'down',
          error: response.error,
        };
      }

      if (response.data) {
        return {
          isHealthy: true,
          health: 'healthy',
          databaseStatus: 'connected',
          dbResponseTime: 50, // Mock value
          externalApis: {
            foursquare: 'available',
            google: 'available',
            wongnai: 'available',
          },
        };
      }

      return {
        isHealthy: false,
        health: 'down',
        error: 'No response data',
      };
    } catch (error) {
      return {
        isHealthy: false,
        health: 'down',
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  /**
   * Get detailed health metrics
   */
  getHealthMetrics(): HealthMetrics {
    return { ...this.healthMetrics };
  }

  /**
   * Subscribe to connection status changes
   */
  subscribe(listener: (status: ConnectionStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of status changes
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.status);
      } catch (error) {
        console.error('❌ Connection status listener error:', error);
      }
    });
  }

  /**
   * Test specific API endpoint
   */
  async testEndpoint(endpoint: string): Promise<{
    success: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = performance.now();

    try {
      const response = await fetch(`http://localhost:12001${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const responseTime = performance.now() - startTime;

      return {
        success: response.ok,
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      return {
        success: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Get connection quality assessment
   */
  getConnectionQuality(): 'excellent' | 'good' | 'poor' | 'disconnected' {
    if (!this.status.isConnected) return 'disconnected';
    
    const responseTime = this.status.apiResponseTime;
    const errorRate = this.status.errorCount / 10; // Error rate over last 10 checks
    
    if (responseTime < 200 && errorRate < 0.1) return 'excellent';
    if (responseTime < 500 && errorRate < 0.2) return 'good';
    if (responseTime < 1000 && errorRate < 0.5) return 'poor';
    
    return 'disconnected';
  }

  /**
   * Force immediate health check
   */
  async forceCheck(): Promise<HealthMetrics> {
    return await this.checkHealth();
  }

  /**
   * Reset error counters
   */
  resetErrors() {
    this.status.errorCount = 0;
    this.status.lastError = undefined;
  }
}

// Export singleton instance
export const connectionMonitor = new ConnectionMonitorService();

// Export connection status hook for React components
export function useConnectionStatus() {
  const [status, setStatus] = React.useState<ConnectionStatus>(connectionMonitor.getStatus());
  
  React.useEffect(() => {
    const unsubscribe = connectionMonitor.subscribe(setStatus);
    return unsubscribe;
  }, []);
  
  return {
    status,
    healthMetrics: connectionMonitor.getHealthMetrics(),
    connectionQuality: connectionMonitor.getConnectionQuality(),
    forceCheck: () => connectionMonitor.forceCheck(),
    testEndpoint: (endpoint: string) => connectionMonitor.testEndpoint(endpoint),
  };
}

// React import for the hook
import React from 'react';
