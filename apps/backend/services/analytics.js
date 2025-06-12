/**
 * SaaS Analytics and Business Intelligence Service
 * Tracks user behavior, subscription metrics, and business KPIs
 */

const { Pool } = require('pg');
const Redis = require('redis');

class AnalyticsService {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    this.redis = Redis.createClient({
      url: process.env.REDIS_URL
    });
    
    this.redis.connect().catch(console.error);
  }

  // Track user events
  async trackEvent(userId, eventName, properties = {}, metadata = {}) {
    try {
      const eventData = {
        user_id: userId,
        event_name: eventName,
        properties: JSON.stringify(properties),
        metadata: JSON.stringify({
          ...metadata,
          timestamp: new Date().toISOString(),
          session_id: metadata.sessionId,
          ip_address: metadata.ipAddress,
          user_agent: metadata.userAgent
        }),
        created_at: new Date()
      };

      // Store in database
      await this.db.query(`
        INSERT INTO user_events (user_id, event_name, properties, metadata, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [eventData.user_id, eventData.event_name, eventData.properties, eventData.metadata, eventData.created_at]);

      // Cache recent events in Redis for real-time analytics
      const cacheKey = `events:${userId}:recent`;
      await this.redis.lpush(cacheKey, JSON.stringify(eventData));
      await this.redis.ltrim(cacheKey, 0, 99); // Keep last 100 events
      await this.redis.expire(cacheKey, 86400); // 24 hours

      // Update real-time counters
      await this.updateRealTimeCounters(eventName, properties);

      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  }

  // Update real-time counters for dashboard
  async updateRealTimeCounters(eventName, properties) {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();

    // Daily counters
    await this.redis.hincrby(`counters:daily:${today}`, eventName, 1);
    await this.redis.expire(`counters:daily:${today}`, 86400 * 7); // Keep for 7 days

    // Hourly counters
    await this.redis.hincrby(`counters:hourly:${today}:${hour}`, eventName, 1);
    await this.redis.expire(`counters:hourly:${today}:${hour}`, 86400); // Keep for 24 hours

    // Feature usage counters
    if (properties.feature) {
      await this.redis.hincrby(`counters:features:${today}`, properties.feature, 1);
      await this.redis.expire(`counters:features:${today}`, 86400 * 30); // Keep for 30 days
    }
  }

  // Get user behavior analytics
  async getUserAnalytics(userId, timeframe = '30d') {
    try {
      const days = parseInt(timeframe.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const query = `
        SELECT 
          event_name,
          COUNT(*) as count,
          DATE_TRUNC('day', created_at) as date
        FROM user_events 
        WHERE user_id = $1 AND created_at >= $2
        GROUP BY event_name, DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;

      const result = await this.db.query(query, [userId, startDate]);
      
      // Process data for frontend consumption
      const analytics = {
        totalEvents: result.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        eventsByDay: this.groupEventsByDay(result.rows),
        topEvents: this.getTopEvents(result.rows),
        activityScore: await this.calculateActivityScore(userId, days)
      };

      return analytics;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  // Calculate user activity score
  async calculateActivityScore(userId, days) {
    try {
      const query = `
        SELECT COUNT(DISTINCT DATE_TRUNC('day', created_at)) as active_days
        FROM user_events 
        WHERE user_id = $1 AND created_at >= $2
      `;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const result = await this.db.query(query, [userId, startDate]);
      const activeDays = parseInt(result.rows[0].active_days);
      
      return Math.round((activeDays / days) * 100);
    } catch (error) {
      console.error('Error calculating activity score:', error);
      return 0;
    }
  }

  // Get subscription metrics
  async getSubscriptionMetrics(timeframe = '30d') {
    try {
      const days = parseInt(timeframe.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const queries = {
        // Monthly Recurring Revenue (MRR)
        mrr: `
          SELECT 
            SUM(CASE WHEN billing_cycle = 'monthly' THEN amount ELSE amount/12 END) as mrr
          FROM subscriptions 
          WHERE status = 'active'
        `,
        
        // Customer acquisition
        newCustomers: `
          SELECT COUNT(*) as count
          FROM users 
          WHERE created_at >= $1
        `,
        
        // Churn rate
        churnedCustomers: `
          SELECT COUNT(*) as count
          FROM subscriptions 
          WHERE status = 'cancelled' AND updated_at >= $1
        `,
        
        // Subscription distribution
        subscriptionTiers: `
          SELECT 
            plan_name,
            COUNT(*) as count,
            SUM(amount) as revenue
          FROM subscriptions 
          WHERE status = 'active'
          GROUP BY plan_name
        `
      };

      const results = {};
      for (const [key, query] of Object.entries(queries)) {
        const result = await this.db.query(query, key === 'mrr' || key === 'subscriptionTiers' ? [] : [startDate]);
        results[key] = result.rows;
      }

      return {
        mrr: results.mrr[0]?.mrr || 0,
        newCustomers: results.newCustomers[0]?.count || 0,
        churnedCustomers: results.churnedCustomers[0]?.count || 0,
        subscriptionTiers: results.subscriptionTiers,
        churnRate: this.calculateChurnRate(results.newCustomers[0]?.count, results.churnedCustomers[0]?.count)
      };
    } catch (error) {
      console.error('Error getting subscription metrics:', error);
      return null;
    }
  }

  // Get real-time dashboard data
  async getRealTimeDashboard() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const hour = new Date().getHours();

      // Get today's counters
      const dailyCounters = await this.redis.hgetall(`counters:daily:${today}`);
      const hourlyCounters = await this.redis.hgetall(`counters:hourly:${today}:${hour}`);
      const featureCounters = await this.redis.hgetall(`counters:features:${today}`);

      // Get active users (users who made requests in last 5 minutes)
      const activeUsersKey = 'active_users';
      const activeUsers = await this.redis.scard(activeUsersKey);

      return {
        dailyStats: dailyCounters || {},
        hourlyStats: hourlyCounters || {},
        featureUsage: featureCounters || {},
        activeUsers,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting real-time dashboard:', error);
      return null;
    }
  }

  // Track active user
  async trackActiveUser(userId) {
    try {
      const activeUsersKey = 'active_users';
      await this.redis.sadd(activeUsersKey, userId);
      await this.redis.expire(activeUsersKey, 300); // 5 minutes
    } catch (error) {
      console.error('Error tracking active user:', error);
    }
  }

  // Cohort analysis
  async getCohortAnalysis(months = 12) {
    try {
      const query = `
        WITH user_cohorts AS (
          SELECT 
            user_id,
            DATE_TRUNC('month', created_at) as cohort_month
          FROM users
          WHERE created_at >= NOW() - INTERVAL '${months} months'
        ),
        user_activities AS (
          SELECT 
            ue.user_id,
            uc.cohort_month,
            DATE_TRUNC('month', ue.created_at) as activity_month
          FROM user_events ue
          JOIN user_cohorts uc ON ue.user_id = uc.user_id
          WHERE ue.created_at >= NOW() - INTERVAL '${months} months'
        )
        SELECT 
          cohort_month,
          activity_month,
          COUNT(DISTINCT user_id) as active_users
        FROM user_activities
        GROUP BY cohort_month, activity_month
        ORDER BY cohort_month, activity_month
      `;

      const result = await this.db.query(query);
      return this.processCohortData(result.rows);
    } catch (error) {
      console.error('Error getting cohort analysis:', error);
      return null;
    }
  }

  // Helper methods
  groupEventsByDay(rows) {
    const grouped = {};
    rows.forEach(row => {
      const date = row.date.toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = {};
      grouped[date][row.event_name] = parseInt(row.count);
    });
    return grouped;
  }

  getTopEvents(rows) {
    const eventCounts = {};
    rows.forEach(row => {
      eventCounts[row.event_name] = (eventCounts[row.event_name] || 0) + parseInt(row.count);
    });
    
    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));
  }

  calculateChurnRate(newCustomers, churnedCustomers) {
    if (!newCustomers || newCustomers === 0) return 0;
    return Math.round((churnedCustomers / newCustomers) * 100);
  }

  processCohortData(rows) {
    // Process cohort data for visualization
    const cohorts = {};
    rows.forEach(row => {
      const cohort = row.cohort_month.toISOString().split('T')[0];
      const period = row.activity_month.toISOString().split('T')[0];
      
      if (!cohorts[cohort]) cohorts[cohort] = {};
      cohorts[cohort][period] = parseInt(row.active_users);
    });
    
    return cohorts;
  }
}

module.exports = AnalyticsService;
