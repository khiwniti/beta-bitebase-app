/**
 * Beta User Management System
 * Comprehensive system for managing beta users, tracking usage, and collecting feedback
 */

export interface ContactInfo {
  email: string;
  phone?: string;
  name: string;
  title?: string;
  company: string;
  linkedIn?: string;
}

export interface OnboardingStatus {
  stage: 'registered' | 'welcomed' | 'setup' | 'training' | 'active' | 'completed';
  completedSteps: string[];
  currentStep?: string;
  startDate: Date;
  completionDate?: Date;
  assignedCSM?: string; // Customer Success Manager
}

export interface UsageMetrics {
  totalSessions: number;
  totalTimeSpent: number; // in minutes
  lastActiveDate: Date;
  featuresUsed: string[];
  dashboardViews: Record<string, number>;
  apiCalls: number;
  dataQueriesRun: number;
  reportsGenerated: number;
  averageSessionDuration: number;
  weeklyActiveStatus: boolean;
}

export interface FeedbackEntry {
  id: string;
  userId: string;
  timestamp: Date;
  type: 'bug' | 'feature-request' | 'improvement' | 'praise' | 'complaint' | 'question';
  category: 'ui-ux' | 'performance' | 'accuracy' | 'features' | 'integration' | 'support';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  screenshot?: string;
  reproductionSteps?: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  browserInfo?: string;
  deviceInfo?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'wont-fix';
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: Date;
  userSatisfaction?: number; // 1-10 scale
  tags: string[];
}

export interface BetaUser {
  id: string;
  tier: 'strategic' | 'early-adopter' | 'power-user';
  organization: string;
  industry: 'restaurant-chain' | 'franchise' | 'independent-restaurant' | 'consultant' | 'real-estate' | 'academic' | 'other';
  contactInfo: ContactInfo;
  onboardingStatus: OnboardingStatus;
  usageMetrics: UsageMetrics;
  feedbackHistory: FeedbackEntry[];
  permissions: string[];
  testingFocus: string[]; // Areas they're specifically testing
  businessGoals: string[];
  registrationDate: Date;
  lastLoginDate?: Date;
  isActive: boolean;
  notes: string[];
  npsScore?: number; // Net Promoter Score
  testimonial?: string;
}

export interface BetaUserRegistration {
  contactInfo: ContactInfo;
  organization: string;
  industry: BetaUser['industry'];
  tier: BetaUser['tier'];
  testingFocus: string[];
  businessGoals: string[];
  referralSource?: string;
  expectedUsage?: string;
  technicalBackground?: string;
  currentTools?: string[];
}

export interface UserActivity {
  userId: string;
  timestamp: Date;
  action: string;
  feature: string;
  duration?: number;
  metadata?: Record<string, any>;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UsageReport {
  userId: string;
  reportPeriod: {
    start: Date;
    end: Date;
  };
  summary: {
    totalSessions: number;
    totalTimeSpent: number;
    averageSessionDuration: number;
    featuresUsed: string[];
    mostUsedFeatures: Array<{ feature: string; usage: number }>;
    leastUsedFeatures: Array<{ feature: string; usage: number }>;
  };
  engagement: {
    dailyActiveStatus: boolean[];
    weeklyActiveStatus: boolean[];
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
    riskLevel: 'low' | 'medium' | 'high';
  };
  performance: {
    averageLoadTime: number;
    errorRate: number;
    successfulQueries: number;
    failedQueries: number;
  };
  feedback: {
    totalFeedbackItems: number;
    feedbackByType: Record<string, number>;
    averageSatisfaction: number;
    openIssues: number;
  };
  recommendations: string[];
}

export interface BetaReport {
  generatedAt: Date;
  reportPeriod: {
    start: Date;
    end: Date;
  };
  overview: {
    totalBetaUsers: number;
    activeUsers: number;
    usersByTier: Record<string, number>;
    usersByIndustry: Record<string, number>;
    averageNPS: number;
  };
  engagement: {
    totalSessions: number;
    averageSessionDuration: number;
    featureAdoptionRates: Record<string, number>;
    userRetentionRate: number;
    weeklyActiveUsers: number;
  };
  feedback: {
    totalFeedbackItems: number;
    feedbackByType: Record<string, number>;
    feedbackBySeverity: Record<string, number>;
    averageResolutionTime: number;
    userSatisfactionTrend: number[];
  };
  performance: {
    systemUptime: number;
    averageResponseTime: number;
    errorRate: number;
    performanceIssues: Array<{ issue: string; frequency: number; impact: string }>;
  };
  insights: {
    topFeatures: Array<{ feature: string; usage: number; satisfaction: number }>;
    improvementAreas: Array<{ area: string; priority: 'high' | 'medium' | 'low'; impact: string }>;
    userSegmentInsights: Array<{ segment: string; behavior: string; recommendations: string[] }>;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

class BetaUserManager {
  private betaUsers: Map<string, BetaUser> = new Map();
  private activities: UserActivity[] = [];
  private feedbackItems: FeedbackEntry[] = [];

  /**
   * Register a new beta user
   */
  async registerBetaUser(userData: BetaUserRegistration): Promise<BetaUser> {
    const userId = this.generateUserId();
    
    const betaUser: BetaUser = {
      id: userId,
      tier: userData.tier,
      organization: userData.organization,
      industry: userData.industry,
      contactInfo: userData.contactInfo,
      onboardingStatus: {
        stage: 'registered',
        completedSteps: [],
        startDate: new Date(),
        assignedCSM: this.assignCustomerSuccessManager(userData.tier)
      },
      usageMetrics: {
        totalSessions: 0,
        totalTimeSpent: 0,
        lastActiveDate: new Date(),
        featuresUsed: [],
        dashboardViews: {},
        apiCalls: 0,
        dataQueriesRun: 0,
        reportsGenerated: 0,
        averageSessionDuration: 0,
        weeklyActiveStatus: false
      },
      feedbackHistory: [],
      permissions: this.getDefaultPermissions(userData.tier),
      testingFocus: userData.testingFocus,
      businessGoals: userData.businessGoals,
      registrationDate: new Date(),
      isActive: true,
      notes: [`Registered as ${userData.tier} tier user`]
    };

    this.betaUsers.set(userId, betaUser);
    
    // Trigger welcome email and onboarding sequence
    await this.initiateOnboarding(betaUser);
    
    return betaUser;
  }

  /**
   * Track user activity and usage
   */
  async trackUsage(userId: string, activity: UserActivity): Promise<void> {
    const user = this.betaUsers.get(userId);
    if (!user) {
      throw new Error(`Beta user ${userId} not found`);
    }

    // Store activity
    this.activities.push(activity);

    // Update usage metrics
    user.usageMetrics.lastActiveDate = activity.timestamp;
    user.usageMetrics.apiCalls++;
    
    if (!user.usageMetrics.featuresUsed.includes(activity.feature)) {
      user.usageMetrics.featuresUsed.push(activity.feature);
    }

    // Update dashboard views
    if (activity.action === 'view_dashboard') {
      user.usageMetrics.dashboardViews[activity.feature] = 
        (user.usageMetrics.dashboardViews[activity.feature] || 0) + 1;
    }

    // Update session tracking
    if (activity.action === 'session_start') {
      user.usageMetrics.totalSessions++;
    }

    if (activity.duration) {
      user.usageMetrics.totalTimeSpent += activity.duration;
      user.usageMetrics.averageSessionDuration = 
        user.usageMetrics.totalTimeSpent / user.usageMetrics.totalSessions;
    }

    // Check weekly active status
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    user.usageMetrics.weeklyActiveStatus = activity.timestamp > oneWeekAgo;

    this.betaUsers.set(userId, user);
  }

  /**
   * Collect and process user feedback
   */
  async collectFeedback(userId: string, feedback: Omit<FeedbackEntry, 'id' | 'userId' | 'timestamp' | 'status'>): Promise<void> {
    const user = this.betaUsers.get(userId);
    if (!user) {
      throw new Error(`Beta user ${userId} not found`);
    }

    const feedbackEntry: FeedbackEntry = {
      id: this.generateFeedbackId(),
      userId,
      timestamp: new Date(),
      status: 'open',
      ...feedback
    };

    this.feedbackItems.push(feedbackEntry);
    user.feedbackHistory.push(feedbackEntry);

    // Auto-assign based on category and severity
    feedbackEntry.assignedTo = this.assignFeedbackHandler(feedbackEntry);

    // Trigger notifications for high/critical issues
    if (feedbackEntry.severity === 'high' || feedbackEntry.severity === 'critical') {
      await this.notifyTeam(feedbackEntry);
    }

    this.betaUsers.set(userId, user);
  }

  /**
   * Generate comprehensive usage report for a user
   */
  async generateUsageReport(userId: string, periodDays: number = 30): Promise<UsageReport> {
    const user = this.betaUsers.get(userId);
    if (!user) {
      throw new Error(`Beta user ${userId} not found`);
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

    // Filter activities for the period
    const periodActivities = this.activities.filter(
      activity => activity.userId === userId && 
      activity.timestamp >= startDate && 
      activity.timestamp <= endDate
    );

    // Calculate feature usage
    const featureUsage = periodActivities.reduce((acc, activity) => {
      acc[activity.feature] = (acc[activity.feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedFeatures = Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .map(([feature, usage]) => ({ feature, usage }));

    // Calculate engagement metrics
    const dailyActivity = this.calculateDailyActivity(periodActivities, periodDays);
    const weeklyActivity = this.calculateWeeklyActivity(dailyActivity);

    // Get feedback for the period
    const periodFeedback = user.feedbackHistory.filter(
      feedback => feedback.timestamp >= startDate && feedback.timestamp <= endDate
    );

    const report: UsageReport = {
      userId,
      reportPeriod: { start: startDate, end: endDate },
      summary: {
        totalSessions: periodActivities.filter(a => a.action === 'session_start').length,
        totalTimeSpent: periodActivities.reduce((sum, a) => sum + (a.duration || 0), 0),
        averageSessionDuration: user.usageMetrics.averageSessionDuration,
        featuresUsed: Object.keys(featureUsage),
        mostUsedFeatures: sortedFeatures.slice(0, 5),
        leastUsedFeatures: sortedFeatures.slice(-5).reverse()
      },
      engagement: {
        dailyActiveStatus: dailyActivity,
        weeklyActiveStatus: weeklyActivity,
        engagementTrend: this.calculateEngagementTrend(dailyActivity),
        riskLevel: this.calculateRiskLevel(user, periodActivities)
      },
      performance: {
        averageLoadTime: this.calculateAverageLoadTime(periodActivities),
        errorRate: this.calculateErrorRate(periodActivities),
        successfulQueries: periodActivities.filter(a => a.action === 'query_success').length,
        failedQueries: periodActivities.filter(a => a.action === 'query_error').length
      },
      feedback: {
        totalFeedbackItems: periodFeedback.length,
        feedbackByType: this.groupFeedbackByType(periodFeedback),
        averageSatisfaction: this.calculateAverageSatisfaction(periodFeedback),
        openIssues: periodFeedback.filter(f => f.status === 'open').length
      },
      recommendations: this.generateUserRecommendations(user, periodActivities, periodFeedback)
    };

    return report;
  }

  /**
   * Generate comprehensive beta testing report
   */
  async generateBetaReport(periodDays: number = 30): Promise<BetaReport> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const allUsers = Array.from(this.betaUsers.values());
    const activeUsers = allUsers.filter(user => user.usageMetrics.weeklyActiveStatus);

    // Calculate NPS
    const npsScores = allUsers.filter(user => user.npsScore !== undefined).map(user => user.npsScore!);
    const averageNPS = npsScores.length > 0 ? npsScores.reduce((sum, score) => sum + score, 0) / npsScores.length : 0;

    // Aggregate feedback
    const allFeedback = this.feedbackItems.filter(
      feedback => feedback.timestamp >= startDate && feedback.timestamp <= endDate
    );

    const report: BetaReport = {
      generatedAt: new Date(),
      reportPeriod: { start: startDate, end: endDate },
      overview: {
        totalBetaUsers: allUsers.length,
        activeUsers: activeUsers.length,
        usersByTier: this.groupUsersByTier(allUsers),
        usersByIndustry: this.groupUsersByIndustry(allUsers),
        averageNPS
      },
      engagement: {
        totalSessions: allUsers.reduce((sum, user) => sum + user.usageMetrics.totalSessions, 0),
        averageSessionDuration: this.calculateOverallAverageSessionDuration(allUsers),
        featureAdoptionRates: this.calculateFeatureAdoptionRates(allUsers),
        userRetentionRate: this.calculateUserRetentionRate(allUsers, periodDays),
        weeklyActiveUsers: activeUsers.length
      },
      feedback: {
        totalFeedbackItems: allFeedback.length,
        feedbackByType: this.groupFeedbackByType(allFeedback),
        feedbackBySeverity: this.groupFeedbackBySeverity(allFeedback),
        averageResolutionTime: this.calculateAverageResolutionTime(allFeedback),
        userSatisfactionTrend: this.calculateSatisfactionTrend(allFeedback, periodDays)
      },
      performance: {
        systemUptime: 99.9, // This would come from monitoring systems
        averageResponseTime: 150, // This would come from performance monitoring
        errorRate: 0.1, // This would come from error tracking
        performanceIssues: this.identifyPerformanceIssues(allFeedback)
      },
      insights: {
        topFeatures: this.identifyTopFeatures(allUsers, allFeedback),
        improvementAreas: this.identifyImprovementAreas(allFeedback),
        userSegmentInsights: this.generateUserSegmentInsights(allUsers)
      },
      recommendations: {
        immediate: this.generateImmediateRecommendations(allFeedback),
        shortTerm: this.generateShortTermRecommendations(allUsers, allFeedback),
        longTerm: this.generateLongTermRecommendations(allUsers, allFeedback)
      }
    };

    return report;
  }

  // Helper methods
  private generateUserId(): string {
    return `beta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFeedbackId(): string {
    return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private assignCustomerSuccessManager(tier: BetaUser['tier']): string {
    const csmAssignments = {
      'strategic': 'senior-csm',
      'early-adopter': 'mid-csm',
      'power-user': 'junior-csm'
    };
    return csmAssignments[tier];
  }

  private getDefaultPermissions(tier: BetaUser['tier']): string[] {
    const permissions = {
      'strategic': ['all-features', 'priority-support', 'custom-integrations', 'advanced-analytics'],
      'early-adopter': ['core-features', 'standard-support', 'basic-integrations'],
      'power-user': ['basic-features', 'community-support']
    };
    return permissions[tier];
  }

  private async initiateOnboarding(user: BetaUser): Promise<void> {
    // This would trigger email sequences, calendar invites, etc.
    console.log(`Initiating onboarding for ${user.contactInfo.name} (${user.tier})`);
  }

  private assignFeedbackHandler(feedback: FeedbackEntry): string {
    const assignments = {
      'ui-ux': 'design-team',
      'performance': 'engineering-team',
      'accuracy': 'data-science-team',
      'features': 'product-team',
      'integration': 'engineering-team',
      'support': 'customer-success-team'
    };
    return assignments[feedback.category] || 'general-support';
  }

  private async notifyTeam(feedback: FeedbackEntry): Promise<void> {
    // This would send notifications to relevant team members
    console.log(`High priority feedback received: ${feedback.title}`);
  }

  private calculateDailyActivity(activities: UserActivity[], days: number): boolean[] {
    const dailyActivity = new Array(days).fill(false);
    const today = new Date();
    
    activities.forEach(activity => {
      const daysDiff = Math.floor((today.getTime() - activity.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff >= 0 && daysDiff < days) {
        dailyActivity[days - 1 - daysDiff] = true;
      }
    });
    
    return dailyActivity;
  }

  private calculateWeeklyActivity(dailyActivity: boolean[]): boolean[] {
    const weeklyActivity = [];
    for (let i = 0; i < dailyActivity.length; i += 7) {
      const weekSlice = dailyActivity.slice(i, i + 7);
      weeklyActivity.push(weekSlice.some(day => day));
    }
    return weeklyActivity;
  }

  private calculateEngagementTrend(dailyActivity: boolean[]): 'increasing' | 'stable' | 'decreasing' {
    const firstHalf = dailyActivity.slice(0, Math.floor(dailyActivity.length / 2));
    const secondHalf = dailyActivity.slice(Math.floor(dailyActivity.length / 2));
    
    const firstHalfActive = firstHalf.filter(day => day).length;
    const secondHalfActive = secondHalf.filter(day => day).length;
    
    if (secondHalfActive > firstHalfActive * 1.2) return 'increasing';
    if (secondHalfActive < firstHalfActive * 0.8) return 'decreasing';
    return 'stable';
  }

  private calculateRiskLevel(user: BetaUser, activities: UserActivity[]): 'low' | 'medium' | 'high' {
    const recentActivity = activities.filter(a => 
      a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const negativeFeedback = user.feedbackHistory.filter(f => 
      f.type === 'complaint' || f.severity === 'high' || f.severity === 'critical'
    ).length;
    
    if (recentActivity === 0 || negativeFeedback > 3) return 'high';
    if (recentActivity < 5 || negativeFeedback > 1) return 'medium';
    return 'low';
  }

  private calculateAverageLoadTime(activities: UserActivity[]): number {
    const loadTimes = activities
      .filter(a => a.metadata?.loadTime)
      .map(a => a.metadata!.loadTime);
    
    return loadTimes.length > 0 ? 
      loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length : 0;
  }

  private calculateErrorRate(activities: UserActivity[]): number {
    const totalActions = activities.length;
    const errorActions = activities.filter(a => a.action.includes('error')).length;
    return totalActions > 0 ? (errorActions / totalActions) * 100 : 0;
  }

  private groupFeedbackByType(feedback: FeedbackEntry[]): Record<string, number> {
    return feedback.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupFeedbackBySeverity(feedback: FeedbackEntry[]): Record<string, number> {
    return feedback.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateAverageSatisfaction(feedback: FeedbackEntry[]): number {
    const satisfactionScores = feedback
      .filter(f => f.userSatisfaction !== undefined)
      .map(f => f.userSatisfaction!);
    
    return satisfactionScores.length > 0 ? 
      satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length : 0;
  }

  private generateUserRecommendations(user: BetaUser, activities: UserActivity[], feedback: FeedbackEntry[]): string[] {
    const recommendations = [];
    
    if (activities.length < 10) {
      recommendations.push("Increase platform engagement with guided tutorials");
    }
    
    if (feedback.filter(f => f.type === 'feature-request').length > 2) {
      recommendations.push("Schedule feature discussion session");
    }
    
    if (user.usageMetrics.featuresUsed.length < 5) {
      recommendations.push("Explore additional platform features");
    }
    
    return recommendations;
  }

  private groupUsersByTier(users: BetaUser[]): Record<string, number> {
    return users.reduce((acc, user) => {
      acc[user.tier] = (acc[user.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupUsersByIndustry(users: BetaUser[]): Record<string, number> {
    return users.reduce((acc, user) => {
      acc[user.industry] = (acc[user.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateOverallAverageSessionDuration(users: BetaUser[]): number {
    const durations = users.map(user => user.usageMetrics.averageSessionDuration);
    return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  }

  private calculateFeatureAdoptionRates(users: BetaUser[]): Record<string, number> {
    const allFeatures = new Set<string>();
    users.forEach(user => {
      user.usageMetrics.featuresUsed.forEach(feature => allFeatures.add(feature));
    });

    const adoptionRates: Record<string, number> = {};
    allFeatures.forEach(feature => {
      const usersWithFeature = users.filter(user => 
        user.usageMetrics.featuresUsed.includes(feature)
      ).length;
      adoptionRates[feature] = (usersWithFeature / users.length) * 100;
    });

    return adoptionRates;
  }

  private calculateUserRetentionRate(users: BetaUser[], periodDays: number): number {
    const cutoffDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const eligibleUsers = users.filter(user => user.registrationDate < cutoffDate);
    const retainedUsers = eligibleUsers.filter(user => user.usageMetrics.weeklyActiveStatus);
    
    return eligibleUsers.length > 0 ? (retainedUsers.length / eligibleUsers.length) * 100 : 0;
  }

  private calculateAverageResolutionTime(feedback: FeedbackEntry[]): number {
    const resolvedFeedback = feedback.filter(f => f.resolutionDate);
    if (resolvedFeedback.length === 0) return 0;

    const resolutionTimes = resolvedFeedback.map(f => {
      const resolutionTime = f.resolutionDate!.getTime() - f.timestamp.getTime();
      return resolutionTime / (1000 * 60 * 60); // Convert to hours
    });

    return resolutionTimes.reduce((sum, time) => sum + time, 0) / resolutionTimes.length;
  }

  private calculateSatisfactionTrend(feedback: FeedbackEntry[], periodDays: number): number[] {
    const trend = [];
    const daysPerPoint = Math.max(1, Math.floor(periodDays / 10));
    
    for (let i = 0; i < periodDays; i += daysPerPoint) {
      const startDate = new Date(Date.now() - (periodDays - i) * 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() - (periodDays - i - daysPerPoint) * 24 * 60 * 60 * 1000);
      
      const periodFeedback = feedback.filter(f => 
        f.timestamp >= startDate && f.timestamp < endDate && f.userSatisfaction !== undefined
      );
      
      const avgSatisfaction = periodFeedback.length > 0 ? 
        periodFeedback.reduce((sum, f) => sum + f.userSatisfaction!, 0) / periodFeedback.length : 0;
      
      trend.push(avgSatisfaction);
    }
    
    return trend;
  }

  private identifyPerformanceIssues(feedback: FeedbackEntry[]): Array<{ issue: string; frequency: number; impact: string }> {
    const performanceFeedback = feedback.filter(f => f.category === 'performance');
    const issueGroups: Record<string, number> = {};
    
    performanceFeedback.forEach(f => {
      const issue = f.title.toLowerCase();
      issueGroups[issue] = (issueGroups[issue] || 0) + 1;
    });
    
    return Object.entries(issueGroups).map(([issue, frequency]) => ({
      issue,
      frequency,
      impact: frequency > 5 ? 'high' : frequency > 2 ? 'medium' : 'low'
    }));
  }

  private identifyTopFeatures(users: BetaUser[], feedback: FeedbackEntry[]): Array<{ feature: string; usage: number; satisfaction: number }> {
    const featureUsage: Record<string, number> = {};
    const featureSatisfaction: Record<string, number[]> = {};
    
    users.forEach(user => {
      user.usageMetrics.featuresUsed.forEach(feature => {
        featureUsage[feature] = (featureUsage[feature] || 0) + 1;
      });
    });
    
    feedback.forEach(f => {
      if (f.userSatisfaction && f.tags.length > 0) {
        f.tags.forEach(tag => {
          if (!featureSatisfaction[tag]) featureSatisfaction[tag] = [];
          featureSatisfaction[tag].push(f.userSatisfaction!);
        });
      }
    });
    
    return Object.entries(featureUsage).map(([feature, usage]) => ({
      feature,
      usage,
      satisfaction: featureSatisfaction[feature] ? 
        featureSatisfaction[feature].reduce((sum, score) => sum + score, 0) / featureSatisfaction[feature].length : 0
    })).sort((a, b) => b.usage - a.usage);
  }

  private identifyImprovementAreas(feedback: FeedbackEntry[]): Array<{ area: string; priority: 'high' | 'medium' | 'low'; impact: string }> {
    const areas: Record<string, { count: number; severity: string[] }> = {};
    
    feedback.forEach(f => {
      if (!areas[f.category]) {
        areas[f.category] = { count: 0, severity: [] };
      }
      areas[f.category].count++;
      areas[f.category].severity.push(f.severity);
    });
    
    return Object.entries(areas).map(([area, data]) => {
      const highSeverityCount = data.severity.filter(s => s === 'high' || s === 'critical').length;
      const priority = highSeverityCount > 2 ? 'high' : data.count > 5 ? 'medium' : 'low';
      
      return {
        area,
        priority,
        impact: this.calculateImpactDescription(data.count, highSeverityCount)
      };
    });
  }

  private calculateImpactDescription(count: number, highSeverityCount: number): string {
    if (highSeverityCount > 2) return 'Critical user experience issues affecting adoption';
    if (count > 5) return 'Moderate impact on user satisfaction and engagement';
    return 'Minor improvements that could enhance user experience';
  }

  private generateUserSegmentInsights(users: BetaUser[]): Array<{ segment: string; behavior: string; recommendations: string[] }> {
    const insights = [];
    
    // Strategic users insights
    const strategicUsers = users.filter(u => u.tier === 'strategic');
    if (strategicUsers.length > 0) {
      const avgSessions = strategicUsers.reduce((sum, u) => sum + u.usageMetrics.totalSessions, 0) / strategicUsers.length;
      insights.push({
        segment: 'Strategic Partners',
        behavior: `High engagement with ${avgSessions.toFixed(1)} average sessions, focus on enterprise features`,
        recommendations: ['Prioritize enterprise integrations', 'Provide dedicated support', 'Custom feature development']
      });
    }
    
    // Early adopters insights
    const earlyAdopters = users.filter(u => u.tier === 'early-adopter');
    if (earlyAdopters.length > 0) {
      const activeRate = earlyAdopters.filter(u => u.usageMetrics.weeklyActiveStatus).length / earlyAdopters.length;
      insights.push({
        segment: 'Early Adopters',
        behavior: `${(activeRate * 100).toFixed(1)}% weekly active rate, strong feature exploration`,
        recommendations: ['Focus on feature completeness', 'Gather detailed feedback', 'Beta feature access']
      });
    }
    
    // Power users insights
    const powerUsers = users.filter(u => u.tier === 'power-user');
    if (powerUsers.length > 0) {
      const avgFeatures = powerUsers.reduce((sum, u) => sum + u.usageMetrics.featuresUsed.length, 0) / powerUsers.length;
      insights.push({
        segment: 'Power Users',
        behavior: `Exploring ${avgFeatures.toFixed(1)} features on average, diverse use cases`,
        recommendations: ['Improve onboarding', 'Create feature tutorials', 'Community building']
      });
    }
    
    return insights;
  }

  private generateImmediateRecommendations(feedback: FeedbackEntry[]): string[] {
    const recommendations = [];
    
    const criticalIssues = feedback.filter(f => f.severity === 'critical' && f.status === 'open');
    if (criticalIssues.length > 0) {
      recommendations.push(`Address ${criticalIssues.length} critical issues immediately`);
    }
    
    const highPriorityBugs = feedback.filter(f => f.type === 'bug' && f.severity === 'high');
    if (highPriorityBugs.length > 2) {
      recommendations.push('Implement emergency bug fix release');
    }
    
    const performanceComplaints = feedback.filter(f => f.category === 'performance');
    if (performanceComplaints.length > 3) {
      recommendations.push('Optimize system performance and response times');
    }
    
    return recommendations;
  }

  private generateShortTermRecommendations(users: BetaUser[], feedback: FeedbackEntry[]): string[] {
    const recommendations = [];
    
    const lowEngagementUsers = users.filter(u => !u.usageMetrics.weeklyActiveStatus);
    if (lowEngagementUsers.length > users.length * 0.3) {
      recommendations.push('Implement user re-engagement campaign');
    }
    
    const featureRequests = feedback.filter(f => f.type === 'feature-request');
    if (featureRequests.length > 5) {
      recommendations.push('Prioritize top requested features for next release');
    }
    
    const uiUxFeedback = feedback.filter(f => f.category === 'ui-ux');
    if (uiUxFeedback.length > 3) {
      recommendations.push('Conduct UX review and implement interface improvements');
    }
    
    return recommendations;
  }

  private generateLongTermRecommendations(users: BetaUser[], feedback: FeedbackEntry[]): string[] {
    const recommendations = [];
    
    const industryDistribution = this.groupUsersByIndustry(users);
    const dominantIndustry = Object.entries(industryDistribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (dominantIndustry && dominantIndustry[1] > users.length * 0.4) {
      recommendations.push(`Develop industry-specific features for ${dominantIndustry[0]} sector`);
    }
    
    const integrationRequests = feedback.filter(f =>
      f.category === 'integration' || f.description.toLowerCase().includes('integration')
    );
    if (integrationRequests.length > 3) {
      recommendations.push('Build comprehensive integration marketplace');
    }
    
    const scalabilityFeedback = feedback.filter(f =>
      f.description.toLowerCase().includes('scale') || f.description.toLowerCase().includes('performance')
    );
    if (scalabilityFeedback.length > 2) {
      recommendations.push('Invest in advanced scalability and performance architecture');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const betaUserManager = new BetaUserManager();