/**
 * Sales Forecast Chart Component
 * Displays AI-generated sales predictions and trends
 */

import { useState } from 'react';

export default function SalesForecastChart({ data }) {
  const [timeframe, setTimeframe] = useState('monthly');
  const [viewType, setViewType] = useState('revenue');

  // Mock sales forecast data - in production, this would come from AI analysis
  const generateForecastData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseRevenue = 50000;
    
    return months.map((month, index) => {
      const seasonalMultiplier = 1 + Math.sin((index / 12) * 2 * Math.PI) * 0.3;
      const trendMultiplier = 1 + (index * 0.02); // 2% growth per month
      const randomVariation = 0.9 + Math.random() * 0.2;
      
      const revenue = Math.round(baseRevenue * seasonalMultiplier * trendMultiplier * randomVariation);
      const customers = Math.round(revenue / 45); // Average ticket $45
      const orders = Math.round(customers * 1.2); // Some customers order multiple times
      
      return {
        month,
        revenue,
        customers,
        orders,
        avgTicket: Math.round(revenue / customers)
      };
    });
  };

  const forecastData = generateForecastData();
  const maxValue = Math.max(...forecastData.map(d => d[viewType]));

  const insights = [
    {
      title: 'Peak Season',
      value: 'Summer (Jun-Aug)',
      description: 'Expected 25% increase in revenue',
      icon: '📈'
    },
    {
      title: 'Growth Rate',
      value: '+24% YoY',
      description: 'Projected annual growth',
      icon: '🚀'
    },
    {
      title: 'Best Month',
      value: 'July',
      description: 'Highest projected revenue',
      icon: '🏆'
    },
    {
      title: 'Avg Ticket',
      value: '$47',
      description: 'Expected average order value',
      icon: '💰'
    }
  ];

  const formatValue = (value, type) => {
    switch (type) {
      case 'revenue':
        return `$${(value / 1000).toFixed(0)}K`;
      case 'customers':
        return value.toLocaleString();
      case 'orders':
        return value.toLocaleString();
      case 'avgTicket':
        return `$${value}`;
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            📈 Sales Forecast
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            AI-powered predictions based on market analysis and industry trends
          </p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="revenue">Revenue</option>
            <option value="customers">Customers</option>
            <option value="orders">Orders</option>
            <option value="avgTicket">Avg Ticket</option>
          </select>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{insight.icon}</span>
              <span className="text-lg font-bold text-gray-900">{insight.value}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">{insight.title}</div>
            <div className="text-xs text-gray-600">{insight.description}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border p-6">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 capitalize">
            {viewType} Forecast - {timeframe}
          </h4>
          <p className="text-sm text-gray-600">
            Projected {viewType} for the next 12 months
          </p>
        </div>
        
        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {forecastData.map((item, index) => {
            const percentage = (item[viewType] / maxValue) * 100;
            const isHighlight = index === 6; // July
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 text-sm text-gray-600 font-medium">
                  {item.month}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className={`h-6 rounded-full transition-all duration-500 ${
                      isHighlight ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {formatValue(item[viewType], viewType)}
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium text-gray-900 mb-4">🌟 Seasonal Trends</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Spring (Mar-May)</span>
              <span className="text-sm text-green-600">+15% growth</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">Summer (Jun-Aug)</span>
              <span className="text-sm text-yellow-600">+25% peak season</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-orange-800">Fall (Sep-Nov)</span>
              <span className="text-sm text-orange-600">+10% steady</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Winter (Dec-Feb)</span>
              <span className="text-sm text-blue-600">-5% slower</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium text-gray-900 mb-4">💡 Optimization Tips</h4>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700 flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Focus marketing spend during spring and summer months
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Prepare inventory for 25% increase in July
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Consider winter promotions to boost slower months
            </li>
            <li className="text-sm text-gray-700 flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Staff accordingly for seasonal variations
            </li>
          </ul>
        </div>
      </div>

      {/* Confidence Intervals */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">📊 Forecast Confidence</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-600">High Confidence</div>
            <div className="text-xs text-gray-500">Next 3 months</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">70%</div>
            <div className="text-sm text-gray-600">Medium Confidence</div>
            <div className="text-xs text-gray-500">Months 4-6</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">55%</div>
            <div className="text-sm text-gray-600">Lower Confidence</div>
            <div className="text-xs text-gray-500">Months 7-12</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Confidence levels based on market volatility, seasonal patterns, and data quality
        </p>
      </div>
    </div>
  );
}