'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Star,
  Eye,
  ShoppingCart,
  DollarSign,
  Clock,
  Users,
  BarChart3,
  PieChart
} from 'lucide-react';

interface MenuPerformance {
  id: string;
  name: string;
  category: string;
  orders: number;
  revenue: number;
  rating: number;
  reviews: number;
  views: number;
  conversionRate: number;
  avgOrderTime: number;
  profitMargin: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  popularityScore: number;
}

export default function MenuPerformancePage() {
  const [performanceData, setPerformanceData] = useState<MenuPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [sortBy, setSortBy] = useState('revenue');

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      // Mock performance data from Wongnai analytics
      const mockData: MenuPerformance[] = [
        {
          id: '1',
          name: 'Pad Thai',
          category: 'Thai',
          orders: 2100,
          revenue: 378000,
          rating: 4.8,
          reviews: 1250,
          views: 15600,
          conversionRate: 13.5,
          avgOrderTime: 12,
          profitMargin: 65,
          trend: 'up',
          trendPercentage: 15.2,
          popularityScore: 95
        },
        {
          id: '2',
          name: 'Green Curry',
          category: 'Thai',
          orders: 1650,
          revenue: 363000,
          rating: 4.6,
          reviews: 890,
          views: 12400,
          conversionRate: 13.3,
          avgOrderTime: 15,
          profitMargin: 58,
          trend: 'up',
          trendPercentage: 8.7,
          popularityScore: 87
        },
        {
          id: '3',
          name: 'Tom Yum Soup',
          category: 'Thai',
          orders: 1200,
          revenue: 192000,
          rating: 4.5,
          reviews: 650,
          views: 9800,
          conversionRate: 12.2,
          avgOrderTime: 10,
          profitMargin: 72,
          trend: 'stable',
          trendPercentage: 2.1,
          popularityScore: 78
        },
        {
          id: '4',
          name: 'Mango Sticky Rice',
          category: 'Dessert',
          orders: 800,
          revenue: 96000,
          rating: 4.7,
          reviews: 420,
          views: 6200,
          conversionRate: 12.9,
          avgOrderTime: 5,
          profitMargin: 80,
          trend: 'down',
          trendPercentage: -5.3,
          popularityScore: 65
        },
        {
          id: '5',
          name: 'Massaman Curry',
          category: 'Thai',
          orders: 580,
          revenue: 139200,
          rating: 4.4,
          reviews: 320,
          views: 4800,
          conversionRate: 12.1,
          avgOrderTime: 20,
          profitMargin: 55,
          trend: 'down',
          trendPercentage: -12.8,
          popularityScore: 58
        }
      ];

      setTimeout(() => {
        setPerformanceData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setLoading(false);
    }
  };

  const sortedData = [...performanceData].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue - a.revenue;
      case 'orders':
        return b.orders - a.orders;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.popularityScore - a.popularityScore;
      default:
        return 0;
    }
  });

  const totalOrders = performanceData.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRating = performanceData.reduce((sum, item) => sum + item.rating, 0) / performanceData.length;
  const avgConversion = performanceData.reduce((sum, item) => sum + item.conversionRate, 0) / performanceData.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Performance</h1>
            <p className="text-gray-600">Analytics menu and popularity of dishes</p>
          </div>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="revenue">Sort by Revenue</option>
              <option value="orders">Sort by Orders</option>
              <option value="rating">Sort by Rating</option>
              <option value="popularity">Sort by Popularity</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">฿{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgConversion.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu Item Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Popularity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          #{index + 1}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.orders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ฿{item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-900">{item.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({item.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{item.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.conversionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.trend === 'up' && (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="ml-1 text-sm text-green-600">+{item.trendPercentage}%</span>
                          </>
                        )}
                        {item.trend === 'down' && (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <span className="ml-1 text-sm text-red-600">{item.trendPercentage}%</span>
                          </>
                        )}
                        {item.trend === 'stable' && (
                          <span className="text-sm text-gray-500">Stable</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${item.popularityScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{item.popularityScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {sortedData.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">฿{item.revenue.toLocaleString()} revenue</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{item.trendPercentage}%</p>
                    <p className="text-xs text-gray-600">{item.orders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h3>
            <div className="space-y-4">
              {performanceData
                .filter(item => item.trend === 'down')
                .map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        !
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">Low conversion: {item.conversionRate}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">{item.trendPercentage}%</p>
                      <p className="text-xs text-gray-600">vs last period</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Wongnai Analytics Integration */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Wongnai Analytics Integration</h3>
          <p className="text-blue-700 mb-4">
            Performance data is collected from Wongnai platform including customer views, orders, and ratings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Data Sources</h4>
              <p className="text-sm text-gray-600">Wongnai, POS, Reviews</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Update Frequency</h4>
              <p className="text-sm text-gray-600">Real-time</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Accuracy</h4>
              <p className="text-sm text-gray-600">98.5%</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Coverage</h4>
              <p className="text-sm text-gray-600">All menu items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}