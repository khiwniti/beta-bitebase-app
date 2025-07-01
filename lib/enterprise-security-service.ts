/**
 * Enterprise Security Service for BiteBase
 * Comprehensive security implementation with authentication, authorization, encryption, and audit logging
 */

import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Types for security service
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  organizationId?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: 'admin' | 'manager' | 'analyst' | 'viewer';
}

export interface Permission {
  id: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
  conditions?: Record<string, any>;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  userId: string;
  sessionId: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  encryptionKey: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireMFA: boolean;
  auditRetentionDays: number;
}

// Enterprise Security Service
export class EnterpriseSecurityService {
  private static readonly DEFAULT_CONFIG: SecurityConfig = {
    jwtSecret: process.env.JWT_SECRET || 'bitebase-jwt-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'bitebase-encryption-key',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireMFA: false,
    auditRetentionDays: 90
  };

  private static config: SecurityConfig = this.DEFAULT_CONFIG;
  private static sessions = new Map<string, { userId: string; expiresAt: Date; data: any }>();
  private static loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();
  private static auditLogs: AuditLog[] = [];

  // Authentication Methods
  static async authenticateUser(email: string, password: string, ipAddress: string, userAgent: string): Promise<{ user: User; token: AuthToken } | null> {
    try {
      // Check login attempts
      const attempts = this.loginAttempts.get(email);
      if (attempts && attempts.count >= this.config.maxLoginAttempts) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
        if (timeSinceLastAttempt < 15 * 60 * 1000) { // 15 minutes lockout
          await this.logAuditEvent('', 'authentication', 'login', { email, reason: 'account_locked' }, ipAddress, userAgent, false, 'Account locked due to too many failed attempts');
          throw new Error('Account temporarily locked due to too many failed login attempts');
        } else {
          this.loginAttempts.delete(email);
        }
      }

      // Simulate user lookup and password verification
      const user = await this.getUserByEmail(email);
      if (!user || !user.isActive) {
        await this.recordFailedLogin(email, ipAddress, userAgent);
        return null;
      }

      const isValidPassword = await this.verifyPassword(password, user.id);
      if (!isValidPassword) {
        await this.recordFailedLogin(email, ipAddress, userAgent);
        return null;
      }

      // Generate authentication token
      const token = await this.generateAuthToken(user);
      
      // Clear failed login attempts
      this.loginAttempts.delete(email);

      // Update last login
      user.lastLogin = new Date();

      // Log successful authentication
      await this.logAuditEvent(user.id, 'authentication', 'login', { email }, ipAddress, userAgent, true);

      return { user, token };

    } catch (error) {
      await this.logAuditEvent('', 'authentication', 'login', { email, error: error instanceof Error ? error.message : 'Unknown error' }, ipAddress, userAgent, false);
      throw error;
    }
  }

  static async generateAuthToken(user: User): Promise<AuthToken> {
    const sessionId = this.generateSecureId();
    const tokenPayload = {
      userId: user.id,
      sessionId,
      role: user.role.name,
      organizationId: user.organizationId,
      iat: Date.now()
    };

    const token = this.encodeJWT(tokenPayload);
    const refreshToken = this.generateSecureId();
    const expiresAt = new Date(Date.now() + this.config.sessionTimeout);

    // Store session
    this.sessions.set(sessionId, {
      userId: user.id,
      expiresAt,
      data: { refreshToken }
    });

    return {
      token,
      refreshToken,
      expiresAt,
      userId: user.id,
      sessionId
    };
  }

  static async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.decodeJWT(token);
      if (!payload || !payload.sessionId) return null;

      const session = this.sessions.get(payload.sessionId);
      if (!session || session.expiresAt < new Date()) {
        this.sessions.delete(payload.sessionId);
        return null;
      }

      const user = await this.getUserById(payload.userId);
      if (!user || !user.isActive) return null;

      return user;
    } catch (error) {
      return null;
    }
  }

  static async refreshToken(refreshToken: string, sessionId: string): Promise<AuthToken | null> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session || session.data.refreshToken !== refreshToken) return null;

      const user = await this.getUserById(session.userId);
      if (!user) return null;

      return await this.generateAuthToken(user);
    } catch (error) {
      return null;
    }
  }

  static async revokeSession(sessionId: string, userId: string): Promise<void> {
    this.sessions.delete(sessionId);
    await this.logAuditEvent(userId, 'authentication', 'logout', { sessionId }, '', '', true);
  }

  // Authorization Methods
  static async checkPermission(user: User, resource: string, action: string, context?: Record<string, any>): Promise<boolean> {
    try {
      // Check user permissions
      const hasPermission = user.permissions.some(permission => {
        if (permission.resource !== resource || permission.action !== action) return false;
        
        // Check conditions if present
        if (permission.conditions && context) {
          return this.evaluateConditions(permission.conditions, context);
        }
        
        return true;
      });

      // Check role permissions
      const hasRolePermission = user.role.permissions.some(permission => {
        if (permission.resource !== resource || permission.action !== action) return false;
        
        if (permission.conditions && context) {
          return this.evaluateConditions(permission.conditions, context);
        }
        
        return true;
      });

      const authorized = hasPermission || hasRolePermission;

      // Log authorization check
      await this.logAuditEvent(user.id, 'authorization', 'check_permission', {
        resource,
        action,
        authorized,
        context
      }, '', '', authorized);

      return authorized;
    } catch (error) {
      await this.logAuditEvent(user.id, 'authorization', 'check_permission', {
        resource,
        action,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, '', '', false);
      return false;
    }
  }

  static async enforcePermission(user: User, resource: string, action: string, context?: Record<string, any>): Promise<void> {
    const hasPermission = await this.checkPermission(user, resource, action, context);
    if (!hasPermission) {
      throw new Error(`Access denied: insufficient permissions for ${action} on ${resource}`);
    }
  }

  // Encryption Methods
  static encryptData(data: string): string {
    try {
      const iv = randomBytes(16);
      const key = createHash('sha256').update(this.config.encryptionKey).digest();
      const cipher = createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  static decryptData(encryptedData: string): string {
    try {
      const [ivHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const key = createHash('sha256').update(this.config.encryptionKey).digest();
      const decipher = createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  static hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(password + salt).digest('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, userId: string): Promise<boolean> {
    // Simulate password verification
    // In real implementation, this would check against stored hash
    return Promise.resolve(password.length >= this.config.passwordMinLength);
  }

  // Audit Logging
  static async logAuditEvent(
    userId: string,
    action: string,
    resource: string,
    details: Record<string, any>,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    const auditLog: AuditLog = {
      id: this.generateSecureId(),
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      success,
      errorMessage
    };

    this.auditLogs.push(auditLog);

    // Clean up old audit logs
    const cutoffDate = new Date(Date.now() - (this.config.auditRetentionDays * 24 * 60 * 60 * 1000));
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > cutoffDate);
  }

  static async getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    success?: boolean;
  }): Promise<AuditLog[]> {
    let logs = [...this.auditLogs];

    if (filters) {
      if (filters.userId) logs = logs.filter(log => log.userId === filters.userId);
      if (filters.action) logs = logs.filter(log => log.action === filters.action);
      if (filters.resource) logs = logs.filter(log => log.resource === filters.resource);
      if (filters.startDate) logs = logs.filter(log => log.timestamp >= filters.startDate!);
      if (filters.endDate) logs = logs.filter(log => log.timestamp <= filters.endDate!);
      if (filters.success !== undefined) logs = logs.filter(log => log.success === filters.success);
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // User Management
  static async getUserById(userId: string): Promise<User | null> {
    // Simulate user lookup
    const mockUsers: User[] = [
      {
        id: 'admin-001',
        email: 'admin@bitebase.com',
        name: 'System Administrator',
        role: {
          id: 'role-admin',
          name: 'Administrator',
          description: 'Full system access',
          permissions: [
            { id: 'perm-all', resource: '*', action: 'create' },
            { id: 'perm-all-read', resource: '*', action: 'read' },
            { id: 'perm-all-update', resource: '*', action: 'update' },
            { id: 'perm-all-delete', resource: '*', action: 'delete' },
            { id: 'perm-all-execute', resource: '*', action: 'execute' }
          ],
          level: 'admin'
        },
        permissions: [],
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'analyst-001',
        email: 'analyst@bitebase.com',
        name: 'Market Analyst',
        role: {
          id: 'role-analyst',
          name: 'Analyst',
          description: 'Market research and analytics access',
          permissions: [
            { id: 'perm-analytics-read', resource: 'analytics', action: 'read' },
            { id: 'perm-geospatial-read', resource: 'geospatial', action: 'read' },
            { id: 'perm-reports-create', resource: 'reports', action: 'create' }
          ],
          level: 'analyst'
        },
        permissions: [],
        organizationId: 'org-001',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }
    ];

    return mockUsers.find(user => user.id === userId) || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    // Simulate user lookup by email
    const mockUsers = await Promise.resolve([
      { id: 'admin-001', email: 'admin@bitebase.com' },
      { id: 'analyst-001', email: 'analyst@bitebase.com' }
    ]);

    const userRecord = mockUsers.find(user => user.email === email);
    if (!userRecord) return null;

    return await this.getUserById(userRecord.id);
  }

  // Security Configuration
  static updateSecurityConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  static getSecurityConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Utility Methods
  private static generateSecureId(): string {
    return randomBytes(32).toString('hex');
  }

  private static encodeJWT(payload: any): string {
    // Simplified JWT encoding (in production, use a proper JWT library)
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = createHash('sha256')
      .update(`${encodedHeader}.${encodedPayload}.${this.config.jwtSecret}`)
      .digest('base64url');
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private static decodeJWT(token: string): any {
    try {
      const [header, payload, signature] = token.split('.');
      const expectedSignature = createHash('sha256')
        .update(`${header}.${payload}.${this.config.jwtSecret}`)
        .digest('base64url');
      
      if (signature !== expectedSignature) return null;
      
      return JSON.parse(Buffer.from(payload, 'base64url').toString());
    } catch (error) {
      return null;
    }
  }

  private static evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    // Simple condition evaluation (can be extended for complex rules)
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) return false;
    }
    return true;
  }

  private static async recordFailedLogin(email: string, ipAddress: string, userAgent: string): Promise<void> {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: new Date() };
    attempts.count++;
    attempts.lastAttempt = new Date();
    this.loginAttempts.set(email, attempts);

    await this.logAuditEvent('', 'authentication', 'login', {
      email,
      failedAttempt: attempts.count,
      reason: 'invalid_credentials'
    }, ipAddress, userAgent, false, 'Invalid credentials');
  }

  // System Health and Security Monitoring
  static async getSecurityMetrics(): Promise<Record<string, any>> {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentLogs = this.auditLogs.filter(log => log.timestamp > last24Hours);
    const failedLogins = recentLogs.filter(log => log.action === 'login' && !log.success);
    const successfulLogins = recentLogs.filter(log => log.action === 'login' && log.success);
    const activeSessions = Array.from(this.sessions.values()).filter(session => session.expiresAt > now);

    return {
      activeSessions: activeSessions.length,
      failedLoginsLast24h: failedLogins.length,
      successfulLoginsLast24h: successfulLogins.length,
      lockedAccounts: Array.from(this.loginAttempts.values()).filter(attempt => attempt.count >= this.config.maxLoginAttempts).length,
      auditLogsCount: this.auditLogs.length,
      securityEvents: recentLogs.filter(log => !log.success).length,
      lastSecurityEvent: recentLogs.filter(log => !log.success)[0]?.timestamp || null
    };
  }
}

// Export the service
export const EnterpriseSecurity = EnterpriseSecurityService;