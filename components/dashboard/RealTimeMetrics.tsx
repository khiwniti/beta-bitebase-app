'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, DollarSign, 
  ShoppingCart, Clock, MapPin, Star, AlertCircle,
  Activity, Target, Zap, Award
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, change, icon, trend, subtitle 
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs">
          {TrendIcon && <TrendIcon className={`h-4 w-4 ${trendColor}`} />}
          <span className={trendColor}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          {subtitle && <span className="text-muted-foreground">• {subtitle}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<any>({
    revenue: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    avgTicket: { current: 0, previous: 0, change: 0 }
  });

  const [salesData, setSalesData] = useState<any[]>([]);
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [popularItems, setPopularItems] = useState<any[]>([]);
  const [competitorData, setCompetitorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(`/api/analytics/realtime?range=${timeRange}`);
      const data = await response.json();

      setMetrics(data.metrics);
      setSalesData(data.salesTrend);
      setCustomerSegments(data.customerSegments);
      setPeakHours(data.peakHours);
      setPopularItems(data.popularItems);
      setCompetitorData(data.competitors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Revenue"
          value={`$${metrics.revenue.current.toLocaleString()}`}
          change={metrics.revenue.change}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={metrics.revenue.change > 0 ? 'up' : 'down'}
          subtitle="vs last period"
        />
        <MetricCard
          title="Customers"
          value={metrics.customers.current.toLocaleString()}
          change={metrics.customers.change}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={metrics.customers.change > 0 ? 'up' : 'down'}
          subtitle="unique visitors"
        />
        <MetricCard
          title="Orders"
          value={metrics.orders.current.toLocaleString()}
          change={metrics.orders.change}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          trend={metrics.orders.change > 0 ? 'up' : 'down'}
          subtitle="total orders"
        />
        <MetricCard
          title="Avg Ticket"
          value={`$${metrics.avgTicket.current.toFixed(2)}`}
          change={metrics.avgTicket.change}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend={metrics.avgTicket.change > 0 ? 'up' : 'down'}
          subtitle="per order"
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Trend</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Real-time sales performance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#82ca9d" 
                    yAxisId="right" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performing menu items today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} sold • ${item.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${item.price}</p>
                        <p className="text-xs text-green-600">
                          +{item.growth}% vs avg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={popularItems}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {popularItems.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution by loyalty tier</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerSegments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Value Analysis</CardTitle>
                <CardDescription>Average spend by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={customerSegments}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="segment" />
                    <PolarRadiusAxis />
                    <Radar 
                      name="Avg Spend" 
                      dataKey="avgSpend" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Radar 
                      name="Visit Frequency" 
                      dataKey="frequency" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior Insights</CardTitle>
              <CardDescription>Real-time patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <Badge variant="outline">68%</Badge>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Satisfaction Score</span>
                    <Badge variant="outline">4.5/5</Badge>
                  </div>
                  <Progress value={90} className="h-2" />
                  <p className="text-xs text-muted-foreground">Based on 234 reviews</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Loyalty Members</span>
                    <Badge variant="outline">1,234</Badge>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-muted-foreground">45% of customer base</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
              <CardDescription>Hourly traffic and sales patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="traffic" fill="#8884d8" name="Foot Traffic" />
                  <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Table Turnover</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2x</div>
                <p className="text-xs text-muted-foreground">
                  Average per shift • Target: 3.5x
                </p>
                <Progress value={91} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kitchen Efficiency</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 min</div>
                <p className="text-xs text-muted-foreground">
                  Avg prep time • -2 min from target
                </p>
                <Progress value={85} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff Productivity</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124</div>
                <p className="text-xs text-muted-foreground">
                  Revenue per labor hour • +8% vs avg
                </p>
                <Progress value={108} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
              <CardDescription>Real-time competitor analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={competitorData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Your Restaurant" 
                    dataKey="yours" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Market Average" 
                    dataKey="average" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Top Competitor" 
                    dataKey="topCompetitor" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.6} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Position</CardTitle>
                <CardDescription>Your ranking in key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Price Competitiveness</span>
                      <Badge>2nd of 15</Badge>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Customer Rating</span>
                      <Badge>3rd of 15</Badge>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Market Share</span>
                      <Badge>4th of 15</Badge>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Online Presence</span>
                      <Badge variant="secondary">1st of 15</Badge>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Alerts</CardTitle>
                <CardDescription>Real-time market changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New Competitor Opening</p>
                      <p className="text-xs text-muted-foreground">
                        Italian restaurant opening 0.5 miles away next month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Market Opportunity</p>
                      <p className="text-xs text-muted-foreground">
                        Vegan options demand up 45% in your area
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Competitor Update</p>
                      <p className="text-xs text-muted-foreground">
                        Main competitor reduced prices by 10%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}