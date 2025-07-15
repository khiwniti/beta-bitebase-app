/**
 * Analytics Dashboard Component
 * Main dashboard displaying comprehensive AI analytics
 */

import { useState } from 'react';
import MarketAnalysisCard from './MarketAnalysisCard';
import SalesForecastChart from './SalesForecastChart';
import CustomerSegmentationViz from './CustomerSegmentationViz';
import BusinessRecommendations from './BusinessRecommendations';
import AnalyticsSummary from './AnalyticsSummary';
import RealtimeMetrics from './RealtimeMetrics';

export default function AnalyticsDashboard({ 
  data, 
  location, 
  onRegenerateAnalysis, 
  onChangeLocation 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessType, setBusinessType] = useState('restaurant');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'market', name: 'Market Analysis', icon: '🏪' },
    { id: 'forecast', name: 'Sales Forecast', icon: '📈' },
    { id: 'customers', name: 'Customer Segments', icon: '👥' },
    { id: 'recommendations', name: 'Recommendations', icon: '💡' },
    { id: 'realtime', name: 'Live Data', icon: '📡' }
  ];

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'fast_food', label: 'Fast Food' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'fine_dining', label: 'Fine Dining' },
    { value: 'casual_dining', label: 'Casual Dining' },
    { value: 'food_truck', label: 'Food Truck' }
  ];

  const handleBusinessTypeChange = (newType) => {
    setBusinessType(newType);
    onRegenerateAnalysis(newType);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Business Intelligence Report
            </h2>
            <p className="text-gray-600 mt-1">
              AI-powered analysis for {location.address}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Business Type Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Business Type:
              </label>
              <select
                value={businessType}
                onChange={(e) => handleBusinessTypeChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {businessTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => onRegenerateAnalysis(businessType)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh Analysis
              </button>
              <button
                onClick={onChangeLocation}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                📍 Change Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <AnalyticsSummary data={data} />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketAnalysisCard data={data.marketAnalysis} />
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Key Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {data.summary.overallScore}
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {data.marketAnalysis.successProbability}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Quick Insights</h3>
                  <ul className="space-y-2">
                    {data.summary.keyInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <MarketAnalysisCard data={data.marketAnalysis} detailed={true} />
          )}

          {activeTab === 'forecast' && (
            <SalesForecastChart data={data.salesForecast} />
          )}

          {activeTab === 'customers' && (
            <CustomerSegmentationViz data={data.customerSegmentation} />
          )}

          {activeTab === 'recommendations' && (
            <BusinessRecommendations data={data.businessRecommendations} />
          )}

          {activeTab === 'realtime' && (
            <RealtimeMetrics location={location} />
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Report</h3>
            <p className="text-gray-600 text-sm mt-1">
              Download your analysis in various formats
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => window.print()}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              🖨️ Print Report
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `bitebase-analysis-${Date.now()}.json`;
                link.click();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              💾 Download Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}