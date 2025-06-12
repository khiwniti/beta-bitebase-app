/**
 * Multi-Tenancy Service
 * Handles tenant isolation, white-labeling, and enterprise features
 */

const { Pool } = require('pg');
const crypto = require('crypto');

class MultiTenantService {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }

  // Create a new tenant
  async createTenant(data) {
    try {
      const tenantId = crypto.randomUUID();
      const apiKey = this.generateApiKey();
      
      const tenantData = {
        id: tenantId,
        name: data.name,
        domain: data.domain,
        subdomain: data.subdomain,
        api_key: apiKey,
        settings: JSON.stringify({
          branding: {
            logo: data.logo || null,
            primaryColor: data.primaryColor || '#74C365',
            secondaryColor: data.secondaryColor || '#E23D28',
            fontFamily: data.fontFamily || 'Inter'
          },
          features: {
            whiteLabel: data.whiteLabel || false,
            customDomain: data.customDomain || false,
            sso: data.sso || false,
            apiAccess: data.apiAccess || true,
            analytics: data.analytics || 'basic'
          },
          limits: {
            users: data.userLimit || 10,
            restaurants: data.restaurantLimit || 100,
            apiCalls: data.apiCallLimit || 10000,
            storage: data.storageLimit || 1000 // MB
          }
        }),
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(`
        INSERT INTO tenants 
        (id, name, domain, subdomain, api_key, settings, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, Object.values(tenantData));

      // Create default admin user for tenant
      if (data.adminUser) {
        await this.createTenantAdmin(tenantId, data.adminUser);
      }

      return {
        tenantId,
        apiKey,
        settings: JSON.parse(tenantData.settings),
        status: 'success'
      };

    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  // Create tenant admin user
  async createTenantAdmin(tenantId, adminData) {
    try {
      const userId = crypto.randomUUID();
      const hashedPassword = await this.hashPassword(adminData.password);

      await this.db.query(`
        INSERT INTO users 
        (id, tenant_id, email, display_name, hashed_password, role, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        userId,
        tenantId,
        adminData.email,
        adminData.name,
        hashedPassword,
        'tenant_admin',
        'active',
        new Date(),
        new Date()
      ]);

      return userId;

    } catch (error) {
      console.error('Error creating tenant admin:', error);
      throw error;
    }
  }

  // Get tenant by domain or subdomain
  async getTenantByDomain(domain) {
    try {
      const result = await this.db.query(
        'SELECT * FROM tenants WHERE domain = $1 OR subdomain = $2',
        [domain, domain]
      );

      const tenant = result.rows[0];
      if (!tenant) {
        return null;
      }

      return {
        ...tenant,
        settings: JSON.parse(tenant.settings)
      };

    } catch (error) {
      console.error('Error getting tenant by domain:', error);
      return null;
    }
  }

  // Get tenant by API key
  async getTenantByApiKey(apiKey) {
    try {
      const result = await this.db.query(
        'SELECT * FROM tenants WHERE api_key = $1 AND status = $2',
        [apiKey, 'active']
      );

      const tenant = result.rows[0];
      if (!tenant) {
        return null;
      }

      return {
        ...tenant,
        settings: JSON.parse(tenant.settings)
      };

    } catch (error) {
      console.error('Error getting tenant by API key:', error);
      return null;
    }
  }

  // Update tenant settings
  async updateTenantSettings(tenantId, settings) {
    try {
      // Get current settings
      const currentResult = await this.db.query(
        'SELECT settings FROM tenants WHERE id = $1',
        [tenantId]
      );

      if (currentResult.rows.length === 0) {
        throw new Error('Tenant not found');
      }

      const currentSettings = JSON.parse(currentResult.rows[0].settings);
      const updatedSettings = { ...currentSettings, ...settings };

      await this.db.query(
        'UPDATE tenants SET settings = $1, updated_at = $2 WHERE id = $3',
        [JSON.stringify(updatedSettings), new Date(), tenantId]
      );

      return updatedSettings;

    } catch (error) {
      console.error('Error updating tenant settings:', error);
      throw error;
    }
  }

  // Check tenant limits
  async checkTenantLimit(tenantId, limitType) {
    try {
      const tenant = await this.getTenantById(tenantId);
      if (!tenant) {
        return { allowed: false, reason: 'Tenant not found' };
      }

      const limits = tenant.settings.limits;
      const limit = limits[limitType];

      if (limit === 'unlimited') {
        return { allowed: true, unlimited: true };
      }

      // Get current usage
      const usage = await this.getTenantUsage(tenantId, limitType);
      
      if (usage >= limit) {
        return {
          allowed: false,
          reason: 'Limit exceeded',
          limit: limit,
          current: usage
        };
      }

      return {
        allowed: true,
        limit: limit,
        current: usage,
        remaining: limit - usage
      };

    } catch (error) {
      console.error('Error checking tenant limit:', error);
      return { allowed: false, reason: 'Error checking limits' };
    }
  }

  // Get tenant usage statistics
  async getTenantUsage(tenantId, limitType) {
    try {
      let query;
      
      switch (limitType) {
        case 'users':
          query = 'SELECT COUNT(*) as count FROM users WHERE tenant_id = $1 AND status = $2';
          break;
        case 'restaurants':
          query = 'SELECT COUNT(*) as count FROM restaurants WHERE tenant_id = $1';
          break;
        case 'apiCalls':
          const currentMonth = new Date();
          currentMonth.setDate(1);
          currentMonth.setHours(0, 0, 0, 0);
          query = `
            SELECT COUNT(*) as count 
            FROM user_events ue
            JOIN users u ON ue.user_id = u.id
            WHERE u.tenant_id = $1 AND ue.event_name = 'api_call' AND ue.created_at >= '${currentMonth.toISOString()}'
          `;
          break;
        case 'storage':
          query = `
            SELECT COALESCE(SUM(file_size), 0) as count 
            FROM file_uploads fu
            JOIN users u ON fu.user_id = u.id
            WHERE u.tenant_id = $1
          `;
          break;
        default:
          return 0;
      }

      const result = await this.db.query(query, [tenantId, 'active']);
      return parseInt(result.rows[0].count) || 0;

    } catch (error) {
      console.error('Error getting tenant usage:', error);
      return 0;
    }
  }

  // Get tenant by ID
  async getTenantById(tenantId) {
    try {
      const result = await this.db.query(
        'SELECT * FROM tenants WHERE id = $1',
        [tenantId]
      );

      const tenant = result.rows[0];
      if (!tenant) {
        return null;
      }

      return {
        ...tenant,
        settings: JSON.parse(tenant.settings)
      };

    } catch (error) {
      console.error('Error getting tenant by ID:', error);
      return null;
    }
  }

  // Middleware to extract tenant context
  tenantMiddleware() {
    return async (req, res, next) => {
      try {
        let tenant = null;

        // Try to get tenant from API key
        const apiKey = req.headers['x-api-key'];
        if (apiKey) {
          tenant = await this.getTenantByApiKey(apiKey);
        }

        // Try to get tenant from domain
        if (!tenant) {
          const host = req.get('host');
          if (host) {
            tenant = await this.getTenantByDomain(host);
          }
        }

        // Try to get tenant from subdomain
        if (!tenant) {
          const subdomain = req.subdomains[0];
          if (subdomain) {
            tenant = await this.getTenantByDomain(subdomain);
          }
        }

        // Default to main tenant if none found
        if (!tenant) {
          tenant = await this.getTenantByDomain('app.bitebase.app');
        }

        req.tenant = tenant;
        next();

      } catch (error) {
        console.error('Error in tenant middleware:', error);
        res.status(500).json({
          error: 'Tenant resolution failed',
          message: 'Unable to determine tenant context'
        });
      }
    };
  }

  // Generate API key
  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password (placeholder - use proper bcrypt in production)
  async hashPassword(password) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Get tenant analytics
  async getTenantAnalytics(tenantId, timeframe = '30d') {
    try {
      const days = parseInt(timeframe.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const queries = {
        activeUsers: `
          SELECT COUNT(DISTINCT u.id) as count
          FROM users u
          JOIN user_events ue ON u.id = ue.user_id
          WHERE u.tenant_id = $1 AND ue.created_at >= $2
        `,
        totalEvents: `
          SELECT COUNT(*) as count
          FROM user_events ue
          JOIN users u ON ue.user_id = u.id
          WHERE u.tenant_id = $1 AND ue.created_at >= $2
        `,
        apiCalls: `
          SELECT COUNT(*) as count
          FROM user_events ue
          JOIN users u ON ue.user_id = u.id
          WHERE u.tenant_id = $1 AND ue.event_name = 'api_call' AND ue.created_at >= $2
        `,
        newUsers: `
          SELECT COUNT(*) as count
          FROM users
          WHERE tenant_id = $1 AND created_at >= $2
        `
      };

      const analytics = {};
      for (const [key, query] of Object.entries(queries)) {
        const result = await this.db.query(query, [tenantId, startDate]);
        analytics[key] = parseInt(result.rows[0].count);
      }

      // Get usage against limits
      const usage = {};
      const tenant = await this.getTenantById(tenantId);
      if (tenant) {
        for (const limitType of ['users', 'restaurants', 'apiCalls', 'storage']) {
          usage[limitType] = await this.getTenantUsage(tenantId, limitType);
        }
      }

      return {
        analytics,
        usage,
        limits: tenant?.settings?.limits || {}
      };

    } catch (error) {
      console.error('Error getting tenant analytics:', error);
      return null;
    }
  }

  // List all tenants (admin function)
  async listTenants(page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      
      const result = await this.db.query(`
        SELECT id, name, domain, subdomain, status, created_at, updated_at
        FROM tenants
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      const countResult = await this.db.query('SELECT COUNT(*) as total FROM tenants');
      const total = parseInt(countResult.rows[0].total);

      return {
        tenants: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      console.error('Error listing tenants:', error);
      return null;
    }
  }
}

module.exports = MultiTenantService;
