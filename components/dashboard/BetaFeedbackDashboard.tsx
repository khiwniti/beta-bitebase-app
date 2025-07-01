/**
 * Beta Feedback Dashboard
 * Comprehensive dashboard for managing beta users and analyzing feedback
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Zap
} from 'lucide-react';
import { BetaUser, BetaReport, FeedbackEntry, UsageReport, betaUserManager } from '@/lib/beta-user-management';

interface BetaFeedbackDashboardProps {
  className?: string;
}

interface BetaMetrics {
  totalUsers: number;
  activeUsers: number;
  totalFeedback: number;
  criticalIssues: number;
  averageNPS: number;
  weeklyRetention: number;
}

export function BetaFeedbackDashboard({ className }: BetaFeedbackDashboardProps) {
  const [betaReport, setBetaReport] = useState<BetaReport | null>(null);
  const [metrics, setMetrics] = useState<BetaMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalFeedback: 0,
    criticalIssues: 0,
    averageNPS: 0,
    weeklyRetention: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBetaData();
  }, [selectedTimeframe]);

  const loadBetaData = async () => {
    try {
      setLoading(true);
      const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90;
      const report = await betaUserManager.generateBetaReport(days);
      setBetaReport(report);
      
      setMetrics({
        totalUsers: report.overview.totalBetaUsers,
        activeUsers: report.overview.activeUsers,
        totalFeedback: report.feedback.totalFeedbackItems,
        criticalIssues: report.feedback.feedbackBySeverity.critical || 0,
        averageNPS: report.overview.averageNPS,
        weeklyRetention: report.engagement.userRetentionRate
      });
    } catch (error) {
      console.error('Error loading beta data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'strategic': return 'bg-purple-500';
      case 'early-adopter': return 'bg-blue-500';
      case 'power-user': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNPSColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Beta Testing Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor beta user engagement and feedback</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe === '7d' ? '7 Days' : timeframe === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beta Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeUsers} active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Items</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.criticalIssues} critical issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Promoter Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getNPSColor(metrics.averageNPS)}`}>
              {metrics.averageNPS.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.averageNPS >= 70 ? 'Excellent' : metrics.averageNPS >= 50 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Retention</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.weeklyRetention.toFixed(1)}%</div>
            <Progress value={metrics.weeklyRetention} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      {metrics.criticalIssues > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{metrics.criticalIssues} critical issues</strong> require immediate attention.
            These issues may be blocking user adoption and should be prioritized.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  User Distribution by Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                {betaReport && (
                  <div className="space-y-3">
                    {Object.entries(betaReport.overview.usersByTier).map(([tier, count]) => (
                      <div key={tier} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getTierColor(tier)}`} />
                          <span className="capitalize">{tier.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <span className="text-sm text-gray-500">
                            ({((count / metrics.totalUsers) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Feedback by Severity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {betaReport && (
                  <div className="space-y-3">
                    {Object.entries(betaReport.feedback.feedbackBySeverity).map(([severity, count]) => (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                          <span className="capitalize">{severity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <span className="text-sm text-gray-500">
                            ({((count / metrics.totalFeedback) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {betaReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {betaReport.performance.systemUptime}%
                    </div>
                    <div className="text-sm text-gray-500">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {betaReport.performance.averageResponseTime}ms
                    </div>
                    <div className="text-sm text-gray-500">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {betaReport.performance.errorRate}%
                    </div>
                    <div className="text-sm text-gray-500">Error Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {betaReport.engagement.totalSessions}
                    </div>
                    <div className="text-sm text-gray-500">Total Sessions</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beta User Management</CardTitle>
              <CardDescription>
                Manage beta users, track onboarding progress, and monitor engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Onboarding Status</h3>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Add Beta User
                  </Button>
                </div>
                
                {/* Onboarding Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-blue-800">In Onboarding</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">28</div>
                        <div className="text-sm text-green-800">Active Users</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">5</div>
                        <div className="text-sm text-yellow-800">At Risk</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Analysis</CardTitle>
              <CardDescription>
                Track and analyze user feedback to improve the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {betaReport && (
                <div className="space-y-6">
                  {/* Feedback Types */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Feedback by Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(betaReport.feedback.feedbackByType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="capitalize text-sm">{type.replace('-', ' ')}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Resolution Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {betaReport.feedback.averageResolutionTime.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-500">Average Resolution Time</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {((betaReport.feedback.totalFeedbackItems - (betaReport.feedback.feedbackBySeverity.open || 0)) / betaReport.feedback.totalFeedbackItems * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">Resolution Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>
                Monitor user activity and platform adoption
              </CardDescription>
            </CardHeader>
            <CardContent>
              {betaReport && (
                <div className="space-y-6">
                  {/* Feature Adoption */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Feature Adoption Rates</h3>
                    <div className="space-y-3">
                      {Object.entries(betaReport.engagement.featureAdoptionRates)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 8)
                        .map(([feature, rate]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{feature.replace('-', ' ')}</span>
                          <div className="flex items-center gap-2 w-32">
                            <Progress value={rate} className="flex-1" />
                            <span className="text-sm font-medium w-12">{rate.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Session Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Session Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {betaReport.engagement.averageSessionDuration.toFixed(1)}m
                        </div>
                        <div className="text-sm text-gray-500">Avg Session Duration</div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-indigo-600">
                          {betaReport.engagement.weeklyActiveUsers}
                        </div>
                        <div className="text-sm text-gray-500">Weekly Active Users</div>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-teal-600">
                          {betaReport.engagement.userRetentionRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">User Retention Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Performing Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                {betaReport && (
                  <div className="space-y-3">
                    {betaReport.insights.topFeatures.slice(0, 5).map((feature, index) => (
                      <div key={feature.feature} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="capitalize">{feature.feature.replace('-', ' ')}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{feature.usage} uses</div>
                          <div className="text-xs text-gray-500">
                            {feature.satisfaction.toFixed(1)}/10 satisfaction
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Action Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {betaReport && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Immediate Actions</h4>
                      <ul className="space-y-1">
                        {betaReport.recommendations.immediate.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-orange-600 mb-2">Short Term</h4>
                      <ul className="space-y-1">
                        {betaReport.recommendations.shortTerm.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Long Term</h4>
                      <ul className="space-y-1">
                        {betaReport.recommendations.longTerm.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Segment Insights */}
          {betaReport && betaReport.insights.userSegmentInsights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>User Segment Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {betaReport.insights.userSegmentInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-lg mb-2">{insight.segment}</h4>
                      <p className="text-gray-600 mb-3">{insight.behavior}</p>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Recommendations:</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {insight.recommendations.map((rec, recIndex) => (
                            <li key={recIndex} className="flex items-start gap-2">
                              <span className="text-blue-500">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BetaFeedbackDashboard;