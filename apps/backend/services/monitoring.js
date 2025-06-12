/**
 * Production Monitoring and Observability Service
 * Handles health checks, performance monitoring, error tracking, and alerting
 */

const { Pool } = require('pg');
const Redis = require('redis');
const os = require('os');
const fs = require('fs').promises;

class MonitoringService {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    this.redis = Redis.createClient({
      url: process.env.REDIS_URL
    });
    
    this.redis.connect().catch(console.error);

    // Monitoring configuration
    this.config = {
      healthCheckInterval: 30000, // 30 seconds
      metricsRetention: 86400, // 24 hours in seconds
      alertThresholds: {
        responseTime: 5000, // 5 seconds
        errorRate: 0.05, // 5%
        cpuUsage: 0.8, // 80%
        memoryUsage: 0.85, // 85%
        diskUsage: 0.9 // 90%
      }
    };

    // Start monitoring
    this.startHealthChecks();
    this.startMetricsCollection();
  }

  // System health check
  async getSystemHealth() {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {},
        metrics: {},
        alerts: []
      };

      // Database health
      health.services.database = await this.checkDatabaseHealth();
      
      // Redis health
      health.services.redis = await this.checkRedisHealth();
      
      // System metrics
      health.metrics = await this.getSystemMetrics();
      
      // API health
      health.services.api = await this.checkApiHealth();
      
      // Check for alerts
      health.alerts = await this.checkAlerts(health);
      
      // Overall status
      const hasUnhealthyServices = Object.values(health.services).some(service => service.status !== 'healthy');
      const hasCriticalAlerts = health.alerts.some(alert => alert.severity === 'critical');
      
      if (hasUnhealthyServices || hasCriticalAlerts) {
        health.status = 'unhealthy';
      } else if (health.alerts.length > 0) {
        health.status = 'warning';
      }

      // Cache health status
      await this.cacheHealthStatus(health);

      return health;

    } catch (error) {
      console.error('Error getting system health:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  // Database health check
  async checkDatabaseHealth() {
    try {
      const start = Date.now();
      await this.db.query('SELECT 1');
      const responseTime = Date.now() - start;

      // Check connection pool
      const poolStatus = {
        totalConnections: this.db.totalCount,
        idleConnections: this.db.idleCount,
        waitingClients: this.db.waitingCount
      };

      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        pool: poolStatus
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Redis health check
  async checkRedisHealth() {
    try {
      const start = Date.now();
      await this.redis.ping();
      const responseTime = Date.now() - start;

      // Get Redis info
      const info = await this.redis.info('memory');
      const memoryUsage = this.parseRedisMemoryInfo(info);

      return {
        status: 'healthy',
        responseTime: `${responseTime}ms`,
        memory: memoryUsage
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // API health check
  async checkApiHealth() {
    try {
      // Check recent API performance
      const recentMetrics = await this.getRecentApiMetrics();
      
      return {
        status: 'healthy',
        averageResponseTime: recentMetrics.avgResponseTime,
        errorRate: recentMetrics.errorRate,
        requestCount: recentMetrics.requestCount
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Get system metrics
  async getSystemMetrics() {
    try {
      const metrics = {
        cpu: {
          usage: await this.getCpuUsage(),
          loadAverage: os.loadavg()
        },
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          usage: (os.totalmem() - os.freemem()) / os.totalmem()
        },
        disk: await this.getDiskUsage(),
        uptime: os.uptime(),
        platform: os.platform(),
        nodeVersion: process.version
      };

      return metrics;

    } catch (error) {
      console.error('Error getting system metrics:', error);
      return {};
    }
  }

  // CPU usage calculation
  async getCpuUsage() {
    return new Promise((resolve) => {
      const startUsage = process.cpuUsage();
      const startTime = Date.now();

      setTimeout(() => {
        const endUsage = process.cpuUsage(startUsage);
        const endTime = Date.now();
        
        const userUsage = endUsage.user / 1000; // Convert to milliseconds
        const systemUsage = endUsage.system / 1000;
        const totalTime = endTime - startTime;
        
        const usage = (userUsage + systemUsage) / totalTime;
        resolve(Math.min(1, usage)); // Cap at 100%
      }, 100);
    });
  }

  // Disk usage check
  async getDiskUsage() {
    try {
      const stats = await fs.stat('.');
      // This is a simplified version - in production, use a proper disk usage library
      return {
        total: 'N/A',
        free: 'N/A',
        usage: 0
      };
    } catch (error) {
      return {
        total: 'N/A',
        free: 'N/A',
        usage: 0,
        error: error.message
      };
    }
  }

  // Check for alerts
  async checkAlerts(health) {
    const alerts = [];

    // CPU usage alert
    if (health.metrics.cpu?.usage > this.config.alertThresholds.cpuUsage) {
      alerts.push({
        type: 'high_cpu_usage',
        severity: 'warning',
        message: `CPU usage is ${(health.metrics.cpu.usage * 100).toFixed(1)}%`,
        threshold: `${this.config.alertThresholds.cpuUsage * 100}%`
      });
    }

    // Memory usage alert
    if (health.metrics.memory?.usage > this.config.alertThresholds.memoryUsage) {
      alerts.push({
        type: 'high_memory_usage',
        severity: 'warning',
        message: `Memory usage is ${(health.metrics.memory.usage * 100).toFixed(1)}%`,
        threshold: `${this.config.alertThresholds.memoryUsage * 100}%`
      });
    }

    // Database connection alert
    if (health.services.database?.status !== 'healthy') {
      alerts.push({
        type: 'database_unhealthy',
        severity: 'critical',
        message: 'Database connection is unhealthy',
        details: health.services.database
      });
    }

    // Redis connection alert
    if (health.services.redis?.status !== 'healthy') {
      alerts.push({
        type: 'redis_unhealthy',
        severity: 'critical',
        message: 'Redis connection is unhealthy',
        details: health.services.redis
      });
    }

    return alerts;
  }

  // Track API request metrics
  async trackApiRequest(req, res, responseTime) {
    try {
      const metrics = {
        method: req.method,
        endpoint: req.route?.path || req.path,
        statusCode: res.statusCode,
        responseTime: responseTime,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
      };

      // Store in Redis for real-time metrics
      const key = `api_metrics:${Date.now()}`;
      await this.redis.setex(key, this.config.metricsRetention, JSON.stringify(metrics));

      // Update counters
      await this.updateApiCounters(metrics);

      // Store in database for long-term analysis
      await this.db.query(`
        INSERT INTO api_usage (user_id, endpoint, method, status_code, response_time, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [req.user?.id, metrics.endpoint, metrics.method, metrics.statusCode, responseTime, new Date()]);

    } catch (error) {
      console.error('Error tracking API request:', error);
    }
  }

  // Update API counters
  async updateApiCounters(metrics) {
    const minute = Math.floor(Date.now() / 60000);
    
    // Request count
    await this.redis.hincrby(`api_counters:${minute}`, 'requests', 1);
    
    // Error count
    if (metrics.statusCode >= 400) {
      await this.redis.hincrby(`api_counters:${minute}`, 'errors', 1);
    }
    
    // Response time sum for average calculation
    await this.redis.hincrby(`api_counters:${minute}`, 'response_time_sum', metrics.responseTime);
    
    // Set expiration
    await this.redis.expire(`api_counters:${minute}`, this.config.metricsRetention);
  }

  // Get recent API metrics
  async getRecentApiMetrics() {
    try {
      const currentMinute = Math.floor(Date.now() / 60000);
      const minutes = [];
      
      // Get last 5 minutes of data
      for (let i = 0; i < 5; i++) {
        minutes.push(currentMinute - i);
      }

      let totalRequests = 0;
      let totalErrors = 0;
      let totalResponseTime = 0;

      for (const minute of minutes) {
        const counters = await this.redis.hgetall(`api_counters:${minute}`);
        
        totalRequests += parseInt(counters.requests || 0);
        totalErrors += parseInt(counters.errors || 0);
        totalResponseTime += parseInt(counters.response_time_sum || 0);
      }

      return {
        requestCount: totalRequests,
        errorRate: totalRequests > 0 ? totalErrors / totalRequests : 0,
        avgResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0
      };

    } catch (error) {
      console.error('Error getting recent API metrics:', error);
      return {
        requestCount: 0,
        errorRate: 0,
        avgResponseTime: 0
      };
    }
  }

  // Start health checks
  startHealthChecks() {
    setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        
        // Send alerts if needed
        if (health.status === 'unhealthy' || health.alerts.length > 0) {
          await this.sendAlerts(health);
        }
        
      } catch (error) {
        console.error('Error in health check:', error);
      }
    }, this.config.healthCheckInterval);
  }

  // Start metrics collection
  startMetricsCollection() {
    // Clean up old metrics every hour
    setInterval(async () => {
      try {
        await this.cleanupOldMetrics();
      } catch (error) {
        console.error('Error cleaning up metrics:', error);
      }
    }, 3600000); // 1 hour
  }

  // Cache health status
  async cacheHealthStatus(health) {
    await this.redis.setex('system_health', 60, JSON.stringify(health));
  }

  // Send alerts (placeholder - integrate with your alerting system)
  async sendAlerts(health) {
    console.log('ALERT:', JSON.stringify(health.alerts, null, 2));
    
    // TODO: Integrate with:
    // - Slack notifications
    // - Email alerts
    // - PagerDuty
    // - Discord webhooks
  }

  // Clean up old metrics
  async cleanupOldMetrics() {
    const cutoff = Date.now() - (this.config.metricsRetention * 1000);
    const keys = await this.redis.keys('api_metrics:*');
    
    for (const key of keys) {
      const timestamp = parseInt(key.split(':')[1]);
      if (timestamp < cutoff) {
        await this.redis.del(key);
      }
    }
  }

  // Parse Redis memory info
  parseRedisMemoryInfo(info) {
    const lines = info.split('\r\n');
    const memory = {};
    
    lines.forEach(line => {
      if (line.includes('used_memory:')) {
        memory.used = parseInt(line.split(':')[1]);
      }
      if (line.includes('used_memory_peak:')) {
        memory.peak = parseInt(line.split(':')[1]);
      }
    });
    
    return memory;
  }

  // Middleware for request tracking
  requestTrackingMiddleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const responseTime = Date.now() - start;
        this.trackApiRequest(req, res, responseTime);
      });
      
      next();
    };
  }
}

module.exports = MonitoringService;
