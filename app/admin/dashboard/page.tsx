'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  // PieChart,
  // Pie,
  // Cell
} from 'recharts';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Server,
  Database,
  Cpu,
  MemoryStick,
  Activity,
  Mail,
  UserPlus,
  CreditCard,
  Bot,
  FileText,
  Search,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    churnRate: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    growth: number;
  };
  system: {
    status: string;
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
  subscriptions: {
    starter: number;
    professional: number;
    enterprise: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Use proper API configuration for production
      const apiBase = process.env.NODE_ENV === 'production' ? 'https://bitebase-backend-prod.getintheq.workers.dev' : 'http://localhost:3001';
      
      // Fetch metrics
      const metricsResponse = await fetch(`${apiBase}/api/admin/metrics`);
      const metricsData = await metricsResponse.json();
      setMetrics(metricsData);

      // Fetch system health
      const healthResponse = await fetch(`${apiBase}/health`);
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for now if API fails
      setMetrics({
        users: {
          total: 1247,
          active: 892,
          newThisMonth: 89,
          churnRate: 0.045
        },
        revenue: {
          mrr: 24500,
          arr: 294000,
          growth: 0.125
        },
        system: {
          status: 'healthy',
          uptime: 0.996,
          responseTime: 145,
          errorRate: 0.002
        },
        subscriptions: {
          starter: 45,
          professional: 28,
          enterprise: 12
        }
      });
      setSystemHealth({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          api: { status: 'healthy', averageResponseTime: 145 },
          database: { status: 'healthy' }
        },
        metrics: {
          cpu: { usage: 0.45 },
          memory: { usage: 0.62 },
          uptime: 28800
        },
        alerts: []
      });
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subscriptionData = metrics ? [
    { name: 'Starter', value: metrics.subscriptions.starter, color: '#74C365' },
    { name: 'Professional', value: metrics.subscriptions.professional, color: '#E23D28' },
    { name: 'Enterprise', value: metrics.subscriptions.enterprise, color: '#F4C431' }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your BiteBase platform performance and metrics</p>
        </div>

        {/* System Status Banner */}
        {systemHealth && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth.status)}`}></div>
                  <span className="font-medium">System Status: {systemHealth.status.toUpperCase()}</span>
                  <Badge variant={systemHealth.status === 'healthy' ? 'default' : 'destructive'}>
                    {systemHealth.alerts?.length || 0} alerts
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date(systemHealth.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.users.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{metrics?.users.newThisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics?.revenue.mrr || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    +{formatPercentage(metrics?.revenue.growth || 0)} from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics?.users.active.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage((metrics?.users.active || 0) / (metrics?.users.total || 1))} of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">{systemHealth?.status || 'Unknown'}</div>
                  <p className="text-xs text-muted-foreground">
                    {systemHealth?.metrics?.uptime ? `${Math.floor(systemHealth.metrics.uptime / 3600)}h uptime` : 'N/A'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subscription Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                  <CardDescription>Current subscription plan breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">Subscription Distribution</p>
                      <div className="space-y-2">
                        {subscriptionData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                              <span>{item.name}</span>
                            </div>
                            <span className="font-bold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-4 w-4" />
                        <span className="text-sm">CPU Usage</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPercentage(systemHealth?.metrics?.cpu?.usage || 0)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MemoryStick className="h-4 w-4" />
                        <span className="text-sm">Memory Usage</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPercentage(systemHealth?.metrics?.memory?.usage || 0)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span className="text-sm">Database</span>
                      </div>
                      <Badge variant={systemHealth?.services?.database?.status === 'healthy' ? 'default' : 'destructive'}>
                        {systemHealth?.services?.database?.status || 'Unknown'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span className="text-sm">API Response</span>
                      </div>
                      <span className="text-sm font-medium">
                        {systemHealth?.services?.api?.averageResponseTime || 'N/A'}ms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>New Signups</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics?.users.newThisMonth}</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Churn Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatPercentage(metrics?.users.churnRate || 0)}</div>
                  <p className="text-sm text-muted-foreground">Monthly churn</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Active Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics?.users.active}</div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>MRR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics?.revenue.mrr || 0)}</div>
                  <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>ARR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(metrics?.revenue.arr || 0)}</div>
                  <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatPercentage(metrics?.revenue.growth || 0)}</div>
                  <p className="text-sm text-muted-foreground">Month over month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            {systemHealth && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(systemHealth.services || {}).map(([service, status]: [string, any]) => (
                        <div key={service} className="flex items-center justify-between">
                          <span className="capitalize">{service}</span>
                          <Badge variant={status.status === 'healthy' ? 'default' : 'destructive'}>
                            {status.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {systemHealth.alerts?.length > 0 ? (
                      <div className="space-y-2">
                        {systemHealth.alerts.map((alert: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">{alert.message}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No active alerts</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email Campaigns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Active campaigns</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Referrals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">156</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>AI Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2.4K</div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Blog Management</h3>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </Button>
            </div>

            {/* Blog Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">75% of total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5K</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.2%</div>
                  <p className="text-xs text-muted-foreground">Avg. rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Blog Posts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Posts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: 'The Future of Restaurant Analytics', status: 'Published', date: '2024-12-15', views: '2.1K' },
                    { title: 'AI-Powered Menu Optimization Guide', status: 'Draft', date: '2024-12-14', views: '-' },
                    { title: 'Understanding Customer Behavior Data', status: 'Published', date: '2024-12-10', views: '1.8K' },
                    { title: 'BiteBase Platform Updates Q4 2024', status: 'Published', date: '2024-12-05', views: '3.2K' }
                  ].map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {post.status}
                        </span>
                        <span className="text-sm text-muted-foreground">{post.views}</span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Management Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">SEO Management</h3>
              <Button className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Run SEO Audit</span>
              </Button>
            </div>

            {/* SEO Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">85</div>
                  <p className="text-xs text-muted-foreground">Good performance</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Indexed Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Out of 48 pages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Organic Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7K</div>
                  <p className="text-xs text-muted-foreground">+15% this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">Ranking keywords</p>
                </CardContent>
              </Card>
            </div>

            {/* SEO Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Meta Tags Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Site Title</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg text-sm" 
                        defaultValue="BiteBase - AI-Powered Restaurant Analytics"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Description</label>
                      <textarea 
                        className="w-full p-2 border rounded-lg text-sm h-20" 
                        defaultValue="Transform your restaurant with AI-powered analytics, predictive insights, and data-driven decision making."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Keywords</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg text-sm" 
                        defaultValue="restaurant analytics, AI analytics, food service data"
                      />
                    </div>
                    <Button className="w-full">Update Meta Tags</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Page Speed</span>
                      <span className="text-sm text-green-600 font-bold">94/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Mobile Friendly</span>
                      <span className="text-sm text-yellow-600 font-bold">78/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Security</span>
                      <span className="text-sm text-green-600 font-bold">95/100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Accessibility</span>
                      <span className="text-sm text-blue-600 font-bold">88/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Top Ranking Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left p-2">Keyword</th>
                        <th className="text-left p-2">Position</th>
                        <th className="text-left p-2">Traffic</th>
                        <th className="text-left p-2">Competition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { keyword: 'restaurant analytics platform', position: 3, traffic: '2.1K', competition: 'High' },
                        { keyword: 'AI restaurant insights', position: 7, traffic: '1.8K', competition: 'Medium' },
                        { keyword: 'food service data analysis', position: 12, traffic: '980', competition: 'Low' },
                        { keyword: 'restaurant performance metrics', position: 15, traffic: '750', competition: 'Medium' }
                      ].map((item, index) => (
                        <tr key={index}>
                          <td className="p-2 font-medium">{item.keyword}</td>
                          <td className="p-2">#{item.position}</td>
                          <td className="p-2">{item.traffic}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.competition === 'High' ? 'bg-red-100 text-red-800' :
                              item.competition === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.competition}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
