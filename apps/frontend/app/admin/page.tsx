"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
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
  Sparkles
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("seo");
  const [isGenerating, setIsGenerating] = useState(false);
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
  
  const [users, setUsers] = useState({
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content, SEO, and features</p>
        </div>
        <div className="flex items-center gap-2">
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
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.totalCount}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ChevronUp className="h-3 w-3 mr-1" /> 12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.activeSubscriptions}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ChevronUp className="h-3 w-3 mr-1" /> 8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Trial Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.trialUsers}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <ChevronDown className="h-3 w-3 mr-1" /> 3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.adminUsers}</div>
            <p className="text-xs text-gray-500 mt-1">No change</p>
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