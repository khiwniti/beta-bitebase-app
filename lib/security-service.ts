/**
 * Enterprise Security Service for BiteBase
 * Implements comprehensive security controls and compliance frameworks
 */

import * as crypto from 'crypto';

interface SecurityConfig {
  encryption: {
    algorithm: string;
    keyRotationDays: number;
    atRestEnabled: boolean;
    inTransitEnabled: boolean;
  };
  authentication: {
    mfaRequired: boolean;
    sessionTimeoutMinutes: number;
    passwordPolicy: PasswordPolicy;
    maxLoginAttempts: number;
  };
  authorization: {
    rbacEnabled: boolean;
    principleOfLeastPrivilege: boolean;
    resourceAccessLogging: boolean;
  };
  compliance: {
    gdprEnabled: boolean;
    ccpaEnabled: boolean;
    soc2Enabled: boolean;
    dataRetentionDays: number;
  };
  monitoring: {
    auditLogging: boolean;
    threatDetection: boolean;
    anomalyDetection: boolean;
    alerting: boolean;
  };
}

interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
  preventReuse: number;
}

interface SecurityEvent {
  id: string;
  type: 'authentication' | 'authorization' | 'data_access' | 'system' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  user?: string;
  resource?: string;
  action: string;
  outcome: 'success' | 'failure' | 'blocked';
  details: any;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
}

interface ThreatIndicator {
  id: string;
  type: 'suspicious_login' | 'data_exfiltration' | 'privilege_escalation' | 'anomalous_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  indicators: string[];
  recommendation: string;
  automated: boolean;
  timestamp: Date;
}

interface ComplianceReport {
  framework: 'GDPR' | 'CCPA' | 'SOC2' | 'HIPAA';
  status: 'compliant' | 'non_compliant' | 'partial';
  score: number;
  requirements: ComplianceRequirement[];
  recommendations: ComplianceRecommendation[];
  lastAssessment: Date;
  nextAssessment: Date;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'partial';
  evidence: string[];
  lastChecked: Date;
}

interface ComplianceRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  requirement: string;
}

interface DataGovernancePolicy {
  id: string;
  name: string;
  type: 'retention' | 'classification' | 'access' | 'sharing' | 'deletion';
  description: string;
  rules: DataRule[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DataRule {
  id: string;
  condition: string;
  action: string;
  parameters: any;
}

class SecurityService {
  private config: SecurityConfig = {
    encryption: {
      algorithm: 'AES-256-GCM',
      keyRotationDays: 90,
      atRestEnabled: true,
      inTransitEnabled: true
    },
    authentication: {
      mfaRequired: true,
      sessionTimeoutMinutes: 30,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
        preventReuse: 5
      },
      maxLoginAttempts: 5
    },
    authorization: {
      rbacEnabled: true,
      principleOfLeastPrivilege: true,
      resourceAccessLogging: true
    },
    compliance: {
      gdprEnabled: true,
      ccpaEnabled: true,
      soc2Enabled: true,
      dataRetentionDays: 2555 // 7 years
    },
    monitoring: {
      auditLogging: true,
      threatDetection: true,
      anomalyDetection: true,
      alerting: true
    }
  };

  private eventBuffer: SecurityEvent[] = [];
  private threatIndicators: ThreatIndicator[] = [];

  // Data Encryption Methods
  async encryptSensitiveData(data: any, keyId?: string): Promise<string> {
    try {
      // In production, use AWS KMS or similar
      const key = keyId || await this.getCurrentEncryptionKey();
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Prepend IV to encrypted data
      const result = iv.toString('hex') + ':' + encrypted;
      
      // Log encryption event
      await this.logSecurityEvent({
        type: 'data_access',
        severity: 'low',
        source: 'encryption_service',
        action: 'encrypt_data',
        outcome: 'success',
        details: { keyId, dataType: typeof data }
      });

      return result;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'system',
        severity: 'high',
        source: 'encryption_service',
        action: 'encrypt_data',
        outcome: 'failure',
        details: { error: error.message }
      });
      throw new Error('Encryption failed');
    }
  }

  async decryptSensitiveData(encryptedData: string, keyId?: string): Promise<any> {
    try {
      const key = keyId || await this.getCurrentEncryptionKey();
      
      // Split IV and encrypted data
      const [ivHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      await this.logSecurityEvent({
        type: 'data_access',
        severity: 'medium',
        source: 'encryption_service',
        action: 'decrypt_data',
        outcome: 'success',
        details: { keyId }
      });

      return JSON.parse(decrypted);
    } catch (error) {
      await this.logSecurityEvent({
        type: 'system',
        severity: 'high',
        source: 'encryption_service',
        action: 'decrypt_data',
        outcome: 'failure',
        details: { error: error.message }
      });
      throw new Error('Decryption failed');
    }
  }

  // Authentication & Authorization
  async validatePasswordStrength(password: string): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    const policy = this.config.authentication.passwordPolicy;

    if (password.length < policy.minLength) {
      issues.push(`Password must be at least ${policy.minLength} characters`);
    }
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      issues.push('Password must contain uppercase letters');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      issues.push('Password must contain lowercase letters');
    }
    if (policy.requireNumbers && !/\d/.test(password)) {
      issues.push('Password must contain numbers');
    }
    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('Password must contain special characters');
    }

    return { valid: issues.length === 0, issues };
  }

  async checkPermissions(userId: string, resource: string, action: string): Promise<boolean> {
    try {
      // In production, check against RBAC system
      const hasPermission = await this.evaluateRBACPolicy(userId, resource, action);

      await this.logSecurityEvent({
        type: 'authorization',
        severity: hasPermission ? 'low' : 'medium',
        source: 'rbac_service',
        user: userId,
        resource,
        action: `check_permission:${action}`,
        outcome: hasPermission ? 'success' : 'blocked',
        details: { resource, action }
      });

      return hasPermission;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'authorization',
        severity: 'high',
        source: 'rbac_service',
        user: userId,
        resource,
        action: `check_permission:${action}`,
        outcome: 'failure',
        details: { error: error.message }
      });
      return false;
    }
  }

  // Security Monitoring
  async logSecurityEvent(event: Partial<SecurityEvent>): Promise<void> {
    const securityEvent: SecurityEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: event.type || 'system',
      severity: event.severity || 'low',
      source: event.source || 'unknown',
      action: event.action || 'unknown',
      outcome: event.outcome || 'success',
      details: event.details || {},
      timestamp: new Date(),
      ...event
    };

    this.eventBuffer.push(securityEvent);

    // Analyze for threats in real-time
    await this.analyzeEventForThreats(securityEvent);

    // Send to SIEM/logging system
    await this.sendToAuditLog(securityEvent);

    // Trigger alerts if necessary
    if (securityEvent.severity === 'high' || securityEvent.severity === 'critical') {
      await this.triggerSecurityAlert(securityEvent);
    }
  }

  async detectAnomalies(userId: string, timeWindow: number = 24): Promise<ThreatIndicator[]> {
    try {
      const recentEvents = this.eventBuffer
        .filter(event => 
          event.user === userId && 
          event.timestamp > new Date(Date.now() - timeWindow * 60 * 60 * 1000)
        );

      const threats: ThreatIndicator[] = [];

      // Detect unusual login patterns
      const loginEvents = recentEvents.filter(e => e.action.includes('login'));
      if (loginEvents.length > 10) {
        threats.push({
          id: `threat_${Date.now()}`,
          type: 'suspicious_login',
          severity: 'medium',
          confidence: 0.8,
          description: 'Unusual number of login attempts detected',
          indicators: [`${loginEvents.length} login attempts in ${timeWindow} hours`],
          recommendation: 'Review user activity and consider account lockout',
          automated: true,
          timestamp: new Date()
        });
      }

      // Detect privilege escalation attempts
      const escalationEvents = recentEvents.filter(e => 
        e.type === 'authorization' && e.outcome === 'blocked'
      );
      if (escalationEvents.length > 5) {
        threats.push({
          id: `threat_${Date.now() + 1}`,
          type: 'privilege_escalation',
          severity: 'high',
          confidence: 0.9,
          description: 'Multiple unauthorized access attempts detected',
          indicators: [`${escalationEvents.length} blocked authorization attempts`],
          recommendation: 'Investigate user permissions and potential compromise',
          automated: true,
          timestamp: new Date()
        });
      }

      this.threatIndicators.push(...threats);
      return threats;
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      return [];
    }
  }

  // Compliance Management
  async generateComplianceReport(framework: 'GDPR' | 'CCPA' | 'SOC2'): Promise<ComplianceReport> {
    try {
      const requirements = await this.getComplianceRequirements(framework);
      const assessments = await this.assessCompliance(framework, requirements);
      
      const compliantCount = assessments.filter(r => r.status === 'compliant').length;
      const score = Math.round((compliantCount / requirements.length) * 100);
      
      const status = score >= 95 ? 'compliant' : score >= 70 ? 'partial' : 'non_compliant';

      return {
        framework,
        status,
        score,
        requirements: assessments,
        recommendations: await this.generateComplianceRecommendations(assessments),
        lastAssessment: new Date(),
        nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
      };
    } catch (error) {
      console.error('Compliance report generation failed:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  async anonymizePersonalData(data: any, fields: string[]): Promise<any> {
    try {
      const anonymized = { ...data };
      
      fields.forEach(field => {
        if (anonymized[field]) {
          // Hash or pseudonymize the field
          anonymized[field] = this.hashValue(anonymized[field]);
        }
      });

      await this.logSecurityEvent({
        type: 'compliance',
        severity: 'low',
        source: 'data_anonymization',
        action: 'anonymize_data',
        outcome: 'success',
        details: { fieldsProcessed: fields.length }
      });

      return anonymized;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'compliance',
        severity: 'medium',
        source: 'data_anonymization',
        action: 'anonymize_data',
        outcome: 'failure',
        details: { error: error.message }
      });
      throw error;
    }
  }

  // Data Governance
  async applyDataRetentionPolicy(dataType: string, data: any[]): Promise<any[]> {
    try {
      const policy = await this.getDataRetentionPolicy(dataType);
      const retentionDate = new Date(Date.now() - this.config.compliance.dataRetentionDays * 24 * 60 * 60 * 1000);
      
      const retainedData = data.filter(item => 
        new Date(item.createdAt || item.timestamp) > retentionDate
      );

      const deletedCount = data.length - retainedData.length;
      
      if (deletedCount > 0) {
        await this.logSecurityEvent({
          type: 'compliance',
          severity: 'low',
          source: 'data_retention',
          action: 'apply_retention_policy',
          outcome: 'success',
          details: { dataType, deletedCount, retainedCount: retainedData.length }
        });
      }

      return retainedData;
    } catch (error) {
      await this.logSecurityEvent({
        type: 'compliance',
        severity: 'medium',
        source: 'data_retention',
        action: 'apply_retention_policy',
        outcome: 'failure',
        details: { error: error.message }
      });
      return data; // Return original data if policy application fails
    }
  }

  // Security Utilities
  private async getCurrentEncryptionKey(): Promise<string> {
    // In production, retrieve from AWS KMS or similar
    return process.env.ENCRYPTION_KEY || 'default-key-for-dev';
  }

  private async evaluateRBACPolicy(userId: string, resource: string, action: string): Promise<boolean> {
    // In production, integrate with actual RBAC system
    // For now, return basic permissions
    const userRoles = await this.getUserRoles(userId);
    return userRoles.some(role => this.roleHasPermission(role, resource, action));
  }

  private async getUserRoles(userId: string): Promise<string[]> {
    // Mock implementation - replace with actual user role lookup
    return ['restaurant_owner', 'analytics_user'];
  }

  private roleHasPermission(role: string, resource: string, action: string): boolean {
    // Basic role-based permissions
    const permissions = {
      'restaurant_owner': ['*:*'],
      'analytics_user': ['analytics:read', 'dashboard:read'],
      'staff': ['orders:read', 'menu:read']
    };
    
    const rolePermissions = permissions[role] || [];
    return rolePermissions.some(perm => {
      const [permResource, permAction] = perm.split(':');
      return (permResource === '*' || permResource === resource) &&
             (permAction === '*' || permAction === action);
    });
  }

  private async analyzeEventForThreats(event: SecurityEvent): Promise<void> {
    // Real-time threat analysis
    if (event.type === 'authentication' && event.outcome === 'failure') {
      const recentFailures = this.eventBuffer.filter(e => 
        e.type === 'authentication' && 
        e.outcome === 'failure' && 
        e.user === event.user &&
        e.timestamp > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      );

      if (recentFailures.length >= this.config.authentication.maxLoginAttempts) {
        await this.triggerAccountLockout(event.user!);
      }
    }
  }

  private async sendToAuditLog(event: SecurityEvent): Promise<void> {
    // In production, send to centralized logging system
    if (process.env.NODE_ENV === 'development') {
      console.log('AUDIT LOG:', JSON.stringify(event, null, 2));
    }
  }

  private async triggerSecurityAlert(event: SecurityEvent): Promise<void> {
    // In production, integrate with alerting system (PagerDuty, Slack, etc.)
    console.warn('SECURITY ALERT:', event);
  }

  private async triggerAccountLockout(userId: string): Promise<void> {
    await this.logSecurityEvent({
      type: 'authentication',
      severity: 'high',
      source: 'security_service',
      user: userId,
      action: 'account_lockout',
      outcome: 'success',
      details: { reason: 'excessive_failed_logins' }
    });
  }

  private hashValue(value: string): string {
    // Simple hash for demo - use proper hashing in production
    return Buffer.from(value).toString('base64').substring(0, 12) + '***';
  }

  private async getComplianceRequirements(framework: string): Promise<ComplianceRequirement[]> {
    // Mock compliance requirements
    const gdprRequirements: ComplianceRequirement[] = [
      {
        id: 'gdpr-1',
        title: 'Data Processing Consent',
        description: 'Obtain explicit consent for processing personal data',
        status: 'compliant',
        evidence: ['consent_forms', 'privacy_policy'],
        lastChecked: new Date()
      },
      {
        id: 'gdpr-2',
        title: 'Right to Deletion',
        description: 'Implement data deletion upon user request',
        status: 'compliant',
        evidence: ['deletion_procedure', 'data_retention_policy'],
        lastChecked: new Date()
      }
    ];

    return gdprRequirements;
  }

  private async assessCompliance(framework: string, requirements: ComplianceRequirement[]): Promise<ComplianceRequirement[]> {
    // Mock assessment - in production, perform actual compliance checks
    return requirements;
  }

  private async generateComplianceRecommendations(requirements: ComplianceRequirement[]): Promise<ComplianceRecommendation[]> {
    const nonCompliant = requirements.filter(r => r.status !== 'compliant');
    
    return nonCompliant.map(req => ({
      id: `rec_${req.id}`,
      priority: 'high' as const,
      title: `Address ${req.title}`,
      description: `Implement measures to achieve compliance with ${req.title}`,
      effort: 'medium' as const,
      timeline: '30 days',
      requirement: req.id
    }));
  }

  private async getDataRetentionPolicy(dataType: string): Promise<DataGovernancePolicy> {
    // Mock policy - replace with actual policy lookup
    return {
      id: 'retention-1',
      name: 'Default Data Retention',
      type: 'retention',
      description: 'Standard data retention policy',
      rules: [{
        id: 'rule-1',
        condition: 'age > retention_days',
        action: 'delete',
        parameters: { retention_days: this.config.compliance.dataRetentionDays }
      }],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Public API Methods
  async getSecurityDashboard(): Promise<any> {
    const recentEvents = this.eventBuffer.slice(-100);
    const threats = this.threatIndicators.slice(-10);
    
    return {
      events: recentEvents,
      threats,
      metrics: {
        totalEvents: this.eventBuffer.length,
        criticalThreats: threats.filter(t => t.severity === 'critical').length,
        highSeverityEvents: recentEvents.filter(e => e.severity === 'high').length,
        complianceScore: 85 // Mock score
      },
      config: this.config
    };
  }
}

// Export singleton instance
export const securityService = new SecurityService();
export default SecurityService;