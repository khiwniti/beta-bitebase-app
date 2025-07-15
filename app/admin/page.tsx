"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Trash, 
  Plus, 
  RefreshCw, 
  Search, 
  Globe, 
  ArrowUpRight,
  Settings,
  Users,
  MessageSquare,
  BarChart3,
  Sparkles,
  Activity,
  AlertTriangle,
  TrendingUp,
  Server,
  Shield,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Network
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("seo");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Enterprise monitoring state
  const [systemHealth, setSystemHealth] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Top 10 Restaurant Analytics Tools for 2025",
      slug: "top-10-restaurant-analytics-tools-2025",
      seoScore: 87,
      publishDate: "2024-09-15",
      status: "published",
      author: "AI Assistant",
      tags: ["analytics", "tools", "restaurants"],
      excerpt: "Discover the best restaurant analytics tools that will transform your business in 2025...",
      readTime: "8 min read",
    },
    {
      id: 2,
      title: "How to Optimize Your Restaurant Menu Using Data",
      slug: "optimize-restaurant-menu-data",
      seoScore: 92,
      publishDate: "2024-09-10",
      status: "published",
      author: "AI Assistant",
      tags: ["menu optimization", "data analytics"],
      excerpt: "Learn how to use customer data to create the perfect restaurant menu...",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "Restaurant Location Analysis: A Complete Guide",
      slug: "restaurant-location-analysis-guide",
      seoScore: 76,
      publishDate: "2024-09-05",
      status: "draft",
      author: "AI Assistant",
      tags: ["location intelligence", "market analysis"],
      excerpt: "Everything you need to know about choosing the perfect location for your restaurant...",
      readTime: "10 min read",
    },
  ]);
  
  const [boosts, setBoosts] = useState([
    {
      id: 1,
      name: "Market Analysis Pro",
      description: "Enhanced market analysis tools with advanced competitor tracking",
      price: 29.99,
      status: "active",
      usersCount: 156,
      conversionRate: 4.2,
    },
    {
      id: 2,
      name: "SEO Optimizer",
      description: "AI-powered SEO tools to boost your restaurant's online presence",
      price: 19.99,
      status: "active",
      usersCount: 87,
      conversionRate: 3.8,
    },
    {
      id: 3,
      name: "Menu Insights",
      description: "Advanced menu analytics and performance metrics",
      price: 15.99,
      status: "inactive",
      usersCount: 0,
      conversionRate: 0,
    },
  ]);
  
  const [userStats, setUserStats] = useState({
    totalCount: 1250,
    activeSubscriptions: 875,
    trialUsers: 230,
    adminUsers: 5,
    regions: {
      "North America": 540,
      "Europe": 320,
      "Asia": 290,
      "Other": 100
    }
  });
  
  const handleGenerateContent = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate content
    setTimeout(() => {
      const newPost = {
        id: blogPosts.length + 1,
        title: "Emerging Restaurant Technology Trends for 2025",
        slug: "emerging-restaurant-technology-trends-2025",
        seoScore: 84,
        publishDate: new Date().toISOString().split('T')[0],
        status: "draft",
        author: "AI Assistant",
        tags: ["technology", "trends", "innovation"],
        excerpt: "Stay ahead of the competition with these cutting-edge technology trends reshaping the restaurant industry...",
        readTime: "7 min read",
      };
      
      setBlogPosts([newPost, ...blogPosts]);
      setIsGenerating(false);
    }, 3000);
  };
  
  const handleOptimizeSEO = (postId: number) => {
    setBlogPosts(
      blogPosts.map(post => 
        post.id === postId 
          ? { ...post, seoScore: Math.min(post.seoScore + Math.floor(Math.random() * 8) + 3, 100) } 
          : post
      )
    );
  };
  
  const handleDeletePost = (postId: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== postId));
  };
  
  const handleToggleBoostStatus = (boostId: number) => {
    setBoosts(
      boosts.map(boost => 
        boost.id === boostId 
          ? { ...boost, status: boost.status === "active" ? "inactive" : "active" } 
          : boost
      )
    );
  };

  // Enterprise monitoring functions
  const fetchEnterpriseData = async () => {
    try {
      setRefreshing(true);
      
      // Mock enterprise data (in production, fetch from real API)
      setSystemHealth({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: { seconds: 86400, human: '1d 0h 0m' },
        memory: { used: 512, total: 1024, usage_percent: 50 },
        cpu: { user: 1000000, system: 500000, load_average: [0.5, 0.6, 0.7] },
        system: {
          platform: 'linux', arch: 'x64', node_version: 'v18.17.0',
          total_memory: 8, free_memory: 4, cpu_count: 4
        },
        alerts: [], alertCount: 0
      });

      setPerformanceMetrics({
        summary: {
          total_requests: 15420, avg_response_time: 245, p95_response_time: 890,
          error_rate: 1.2, uptime_hours: 24
        },
        requests: {
          total: 15420,
          by_status: { '2xx': 14800, '4xx': 520, '5xx': 100 },
          last_hour: 1250,
          top_endpoints: [
            { endpoint: 'GET /api/restaurants/search', count: 4500 },
            { endpoint: 'POST /api/ai/market-analysis', count: 2800 },
            { endpoint: 'GET /api/analytics/dashboard', count: 2100 }
          ]
        },
        performance: {
          avg_response_time: 245, p95_response_time: 890,
          slowest_endpoints: [
            { endpoint: 'POST /api/ai/market-analysis', avgResponseTime: 1200, requestCount: 2800 },
            { endpoint: 'POST /api/ai/predictive-analytics', avgResponseTime: 980, requestCount: 1500 }
          ]
        },
        errors: { total: 620, by_type: { client_error: 520, server_error: 100 }, error_rate: 1.2, recent_errors: [] }
      });

      setUsers([
        {
          id: 'user_123', email: 'admin@bitebase.com', name: 'Admin User',
          userType: 'ADMIN', subscriptionTier: 'ENTERPRISE', status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          usage: { searches: 150, analyses: 45, apiCalls: 1200 }
        },
        {
          id: 'user_456', email: 'owner@restaurant.com', name: 'Restaurant Owner',
          userType: 'EXISTING_OWNER', subscriptionTier: 'PROFESSIONAL', status: 'active',
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
          usage: { searches: 89, analyses: 23, apiCalls: 0 }
        }
      ]);

      setAuditLogs([
        {
          id: 1, timestamp: new Date().toISOString(), userId: 'user_123',
          userEmail: 'admin@bitebase.com', action: 'LOGIN', resource: '/api/auth/login',
          ip: '192.168.1.100', userAgent: 'Mozilla/5.0...', success: true,
          details: { method: 'email' }
        }
      ]);

      setAlerts([]);
      
    } catch (error) {
      console.error('Error fetching enterprise data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnterpriseData();
    const interval = setInterval(fetchEnterpriseData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content, SEO, and features</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchEnterpriseData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
        </div>
      </div>
      
      {/* Enterprise Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth?.status)}`}></div>
              <div className="text-2xl font-bold capitalize">{systemHealth?.status || 'Unknown'}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime: {systemHealth?.uptime?.human || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth?.memory?.usage_percent || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {systemHealth?.memory?.used || 0}MB / {systemHealth?.memory?.total || 0}MB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics?.summary?.avg_response_time || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              P95: {performanceMetrics?.summary?.p95_response_time || 0}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics?.summary?.error_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {performanceMetrics?.errors?.total || 0} total errors
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs defaultValue="seo" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="seo">
            <Globe className="h-4 w-4 mr-2" />
            SEO & Content
          </TabsTrigger>
          <TabsTrigger value="boosts">
            <Sparkles className="h-4 w-4 mr-2" />
            Feature Boosts
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Activity className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            Support Messages
          </TabsTrigger>
        </TabsList>
        
        {/* SEO & Content Tab */}
        <TabsContent value="seo">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Blog & Content Management</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateContent}
                disabled={isGenerating}
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Generate AI Content
              </Button>
              <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full py-2 pl-10 pr-4 border rounded-md text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select className="py-2 px-3 border rounded-md text-sm">
                    <option>All Posts</option>
                    <option>Published</option>
                    <option>Drafts</option>
                  </select>
                  <select className="py-2 px-3 border rounded-md text-sm">
                    <option>Sort by Date</option>
                    <option>Sort by SEO Score</option>
                    <option>Sort by Title</option>
                  </select>
                </div>
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SEO Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={post.status === "published" ? "success" : "outline"}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-16 rounded-full ${
                            post.seoScore >= 90
                              ? "bg-green-500"
                              : post.seoScore >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          } mr-2`}
                        >
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{ width: `${post.seoScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{post.seoScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.publishDate}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptimizeSEO(post.id)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Optimize SEO
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        {/* Feature Boosts Tab */}
        <TabsContent value="boosts">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Feature Boost Management</h2>
            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Boost
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {boosts.map((boost) => (
              <Card key={boost.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{boost.name}</h3>
                      <p className="text-gray-500 mt-1">{boost.description}</p>
                      <div className="mt-4 flex gap-6">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-semibold">${boost.price}/mo</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Users</p>
                          <p className="font-semibold">{boost.usersCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Conversion Rate</p>
                          <p className="font-semibold">{boost.conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 flex flex-col items-end">
                      <Badge variant={boost.status === "active" ? "default" : "secondary"}>
                        {boost.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant={boost.status === "active" ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleBoostStatus(boost.id)}
                        >
                          {boost.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Placeholder for other tabs */}
        <TabsContent value="analytics">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-gray-500">Advanced analytics features coming soon</p>
          </div>
        </TabsContent>
        
        {/* Performance Monitoring Tab */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Response time and throughput metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Average Response Time</p>
                    <p className="text-2xl font-bold">{performanceMetrics?.performance?.avg_response_time || 0}ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">95th Percentile</p>
                    <p className="text-2xl font-bold">{performanceMetrics?.performance?.p95_response_time || 0}ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Error Rate</p>
                    <p className="text-2xl font-bold">{performanceMetrics?.errors?.error_rate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uptime</p>
                    <p className="text-2xl font-bold">{performanceMetrics?.summary?.uptime_hours || 0}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CPU Load */}
            <Card>
              <CardHeader>
                <CardTitle>CPU Load Average</CardTitle>
                <CardDescription>System load over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemHealth?.cpu?.load_average?.map((load, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{index === 0 ? '1 min' : index === 1 ? '5 min' : '15 min'}</span>
                      <Badge variant={load > 1 ? 'destructive' : load > 0.7 ? 'secondary' : 'default'}>
                        {load.toFixed(2)}
                      </Badge>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Top API Endpoints</CardTitle>
              <CardDescription>Most frequently accessed endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performanceMetrics?.requests?.top_endpoints?.map((endpoint, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded border">
                    <span className="font-mono text-sm">{endpoint.endpoint}</span>
                    <Badge>{endpoint.count.toLocaleString()} requests</Badge>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* User Filters */}
                <div className="flex gap-4">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Subscription Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm">
                    <div>User</div>
                    <div>Type</div>
                    <div>Subscription</div>
                    <div>Status</div>
                    <div>Last Login</div>
                    <div>Usage</div>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div>
                        <Badge variant="outline">{user.userType}</Badge>
                      </div>
                      <div>
                        <Badge variant={user.subscriptionTier === 'ENTERPRISE' ? 'default' : 'secondary'}>
                          {user.subscriptionTier}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        <p>{user.usage.searches} searches</p>
                        <p>{user.usage.analyses} analyses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Audit Logs</CardTitle>
              <CardDescription>Monitor user actions and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Recent Activity</h3>
                    <p className="text-muted-foreground">Security audit logs will appear here</p>
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center space-x-4">
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.action}
                        </Badge>
                        <div>
                          <p className="font-medium">{log.userEmail}</p>
                          <p className="text-sm text-muted-foreground">{log.resource}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{log.ip}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Support Messages</h3>
            <p className="text-gray-500">Support messaging system coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 