/**
 * Enhanced Monitoring Service for BiteBase Backend Services
 * Provides comprehensive observability, alerting, and performance tracking
 */

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface LogEntry {
  timestamp: string;
  level: keyof LogLevel;
  message: string;
  context?: any;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  endpoint?: string;
  duration?: number;
  statusCode?: number;
  error?: Error;
}

interface MetricData {
  timestamp: number;
  value: number;
  tags?: Record<string, string>;
}

interface PerformanceMetrics {
  requestCount: number;
  errorCount: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  uptime: number;
  errorRate: number;
}

interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: PerformanceMetrics) => boolean;
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  cooldown: number; // ms
  lastTriggered?: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private logs: LogEntry[] = [];
  private metrics = new Map<string, MetricData[]>();
  private alerts: AlertRule[] = [];
  private maxLogEntries = 1000;
  private maxMetricEntries = 500;
  private startTime = Date.now();

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  constructor() {
    this.initializeDefaultAlerts();
    this.startMetricsCollection();
  }

  // Logging Methods
  log(level: keyof LogLevel, message: string, context?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: this.getCurrentRequestId(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId()
    };

    this.logs.push(entry);
    
    // Trim logs if too many
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }

    // Console output with formatting
    this.outputToConsole(entry);

    // Send to external logging service if configured
    this.sendToExternalLogger(entry);
  }

  error(message: string, error?: Error, context?: any): void {
    this.log('ERROR', message, { ...context, error: error?.stack });
  }

  warn(message: string, context?: any): void {
    this.log('WARN', message, context);
  }

  info(message: string, context?: any): void {
    this.log('INFO', message, context);
  }

  debug(message: string, context?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, context);
    }
  }

  // API Request Logging
  logApiRequest(endpoint: string, method: string, statusCode: number, duration: number, error?: Error): void {
    const context = {
      endpoint,
      method,
      statusCode,
      duration,
      error: error?.message
    };

    if (statusCode >= 500) {
      this.error(`API Error: ${method} ${endpoint}`, error, context);
    } else if (statusCode >= 400) {
      this.warn(`API Warning: ${method} ${endpoint}`, context);
    } else {
      this.info(`API Request: ${method} ${endpoint}`, context);
    }

    // Record metrics
    this.recordMetric('api.request.count', 1, { endpoint, method, status: statusCode.toString() });
    this.recordMetric('api.request.duration', duration, { endpoint, method });
    
    if (statusCode >= 400) {
      this.recordMetric('api.error.count', 1, { endpoint, method, status: statusCode.toString() });
    }
  }

  // Metrics Collection
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: MetricData = {
      timestamp: Date.now(),
      value,
      tags
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricArray = this.metrics.get(name)!;
    metricArray.push(metric);

    // Trim metrics if too many
    if (metricArray.length > this.maxMetricEntries) {
      this.metrics.set(name, metricArray.slice(-this.maxMetricEntries));
    }
  }

  // Performance Tracking
  startTimer(name: string): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric(`timer.${name}`, duration);
      return duration;
    };
  }

  // Circuit Breaker Monitoring
  logCircuitBreakerStateChange(endpoint: string, newState: string, failures: number): void {
    this.warn(`Circuit breaker state changed for ${endpoint}`, {
      endpoint,
      newState,
      failures
    });
    
    this.recordMetric('circuit_breaker.state_change', 1, {
      endpoint,
      state: newState,
      failures: failures.toString()
    });
  }

  // Cache Monitoring
  logCacheEvent(event: 'hit' | 'miss' | 'set' | 'evict', key: string): void {
    this.debug(`Cache ${event}: ${key}`, { event, key });
    this.recordMetric(`cache.${event}`, 1, { key });
  }

  // Health Check Monitoring
  logHealthCheck(endpoint: string, status: 'healthy' | 'unhealthy', responseTime: number): void {
    if (status === 'unhealthy') {
      this.warn(`Health check failed for ${endpoint}`, { endpoint, responseTime });
    } else {
      this.debug(`Health check passed for ${endpoint}`, { endpoint, responseTime });
    }
    
    this.recordMetric('health_check.response_time', responseTime, { endpoint, status });
    this.recordMetric('health_check.status', status === 'healthy' ? 1 : 0, { endpoint });
  }

  // Alert Management
  private initializeDefaultAlerts(): void {
    this.alerts = [
      {
        id: 'high-error-rate',
        name: 'High Error Rate',
        condition: (metrics) => metrics.errorRate > 0.1, // 10% error rate
        severity: 'critical',
        enabled: true,
        cooldown: 300000 // 5 minutes
      },
      {
        id: 'slow-response-time',
        name: 'Slow Response Time',
        condition: (metrics) => metrics.p95ResponseTime > 5000, // 5 seconds
        severity: 'warning',
        enabled: true,
        cooldown: 600000 // 10 minutes
      },
      {
        id: 'low-uptime',
        name: 'Low Uptime',
        condition: (metrics) => metrics.uptime < 0.99, // 99% uptime
        severity: 'critical',
        enabled: true,
        cooldown: 900000 // 15 minutes
      }
    ];
  }

  checkAlerts(): void {
    const metrics = this.calculatePerformanceMetrics();
    const now = Date.now();

    for (const alert of this.alerts) {
      if (!alert.enabled) continue;

      // Check cooldown
      if (alert.lastTriggered && (now - alert.lastTriggered) < alert.cooldown) {
        continue;
      }

      if (alert.condition(metrics)) {
        this.triggerAlert(alert, metrics);
        alert.lastTriggered = now;
      }
    }
  }

  private triggerAlert(alert: AlertRule, metrics: PerformanceMetrics): void {
    const message = `ALERT: ${alert.name} - ${alert.severity.toUpperCase()}`;
    
    if (alert.severity === 'critical') {
      this.error(message, undefined, { alert: alert.id, metrics });
    } else {
      this.warn(message, { alert: alert.id, metrics });
    }

    // Send to external alerting system
    this.sendAlert(alert, metrics);
  }

  // Analytics and Reporting
  calculatePerformanceMetrics(): PerformanceMetrics {
    const requestMetrics = this.metrics.get('api.request.count') || [];
    const errorMetrics = this.metrics.get('api.error.count') || [];
    const durationMetrics = this.metrics.get('api.request.duration') || [];

    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1 hour

    // Filter metrics for last hour
    const recentRequests = requestMetrics.filter(m => m.timestamp > oneHourAgo);
    const recentErrors = errorMetrics.filter(m => m.timestamp > oneHourAgo);
    const recentDurations = durationMetrics.filter(m => m.timestamp > oneHourAgo);

    const requestCount = recentRequests.reduce((sum, m) => sum + m.value, 0);
    const errorCount = recentErrors.reduce((sum, m) => sum + m.value, 0);
    
    const durations = recentDurations.map(m => m.value).sort((a, b) => a - b);
    const avgResponseTime = durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
      : 0;
    const p95ResponseTime = durations.length > 0 
      ? durations[Math.floor(durations.length * 0.95)] 
      : 0;

    const uptime = (now - this.startTime) / (now - this.startTime + (errorCount * 1000)); // Simplified
    const errorRate = requestCount > 0 ? errorCount / requestCount : 0;

    return {
      requestCount,
      errorCount,
      avgResponseTime,
      p95ResponseTime,
      uptime,
      errorRate
    };
  }

  getLogSummary(level?: keyof LogLevel, hours: number = 1): any {
    const cutoff = Date.now() - (hours * 3600000);
    const filteredLogs = this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > cutoff && (!level || log.level === level);
    });

    return {
      total: filteredLogs.length,
      levels: this.groupBy(filteredLogs, 'level'),
      endpoints: this.groupBy(filteredLogs.filter(l => l.endpoint), 'endpoint'),
      timeRange: `${hours}h`,
      logs: filteredLogs.slice(-50) // Last 50 logs
    };
  }

  getMetricsSummary(): any {
    const summary: any = {};
    
    for (const [name, metrics] of this.metrics.entries()) {
      const recentMetrics = metrics.filter(m => m.timestamp > Date.now() - 3600000);
      if (recentMetrics.length > 0) {
        const values = recentMetrics.map(m => m.value);
        summary[name] = {
          count: values.length,
          sum: values.reduce((a, b) => a + b, 0),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          latest: values[values.length - 1]
        };
      }
    }
    
    return summary;
  }

  // Utility Methods
  private getCurrentRequestId(): string | undefined {
    if (typeof window !== 'undefined') {
      return (window as any).__currentRequestId;
    }
    return undefined;
  }

  private getCurrentUserId(): string | undefined {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || undefined;
    }
    return undefined;
  }

  private getCurrentSessionId(): string | undefined {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sessionId') || undefined;
    }
    return undefined;
  }

  private outputToConsole(entry: LogEntry): void {
    const color = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[90m'  // Gray
    }[entry.level] || '\x1b[0m';

    const reset = '\x1b[0m';
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    
    console.log(
      `${color}[${timestamp}] ${entry.level}: ${entry.message}${reset}`,
      entry.context ? entry.context : ''
    );
  }

  private sendToExternalLogger(entry: LogEntry): void {
    // Implement external logging service integration here
    // e.g., send to DataDog, New Relic, CloudWatch, etc.
  }

  private sendAlert(alert: AlertRule, metrics: PerformanceMetrics): void {
    // Implement external alerting integration here
    // e.g., send to Slack, PagerDuty, email, etc.
    console.warn('🚨 ALERT TRIGGERED:', alert.name, metrics);
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((groups: Record<string, number>, item) => {
      const group = String(item[key]);
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }

  private startMetricsCollection(): void {
    // Run alert checks every minute
    setInterval(() => {
      this.checkAlerts();
    }, 60000);

    // Log system metrics every 5 minutes
    setInterval(() => {
      const metrics = this.calculatePerformanceMetrics();
      this.info('System metrics collected', metrics);
    }, 300000);
  }

  // Public API for external use
  getSystemHealth(): any {
    return {
      uptime: Date.now() - this.startTime,
      metrics: this.calculatePerformanceMetrics(),
      logs: this.getLogSummary(),
      alerts: this.alerts.filter(a => a.enabled),
      cacheSize: this.logs.length,
      metricsSize: this.metrics.size
    };
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'endpoint', 'statusCode', 'duration'];
      const rows = this.logs.map(log => [
        log.timestamp,
        log.level,
        log.message,
        log.endpoint || '',
        log.context?.statusCode || '',
        log.context?.duration || ''
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();

// Export for testing
export { MonitoringService };

// Auto-start monitoring in browser
if (typeof window !== 'undefined') {
  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    monitoring.error('Unhandled error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    monitoring.error('Unhandled promise rejection', undefined, {
      reason: event.reason
    });
  });
}