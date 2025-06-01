import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Utensils, 
  Clock, 
  MapPin,
  Star,
  BarChart3,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface MarketMetric {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
}

interface MarketInsight {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
}

interface MarketCompetitor {
  name: string;
  distance: number;
  cuisineType: string;
  rating: number;
  priceRange: string;
  estimatedTraffic?: number;
}

interface MarketInsightPanelProps {
  locationName?: string;
  loading?: boolean;
  metrics?: MarketMetric[];
  insights?: MarketInsight[];
  competitors?: MarketCompetitor[];
  demographicData?: any;
  footTrafficData?: any;
  className?: string;
}

export default function MarketInsightPanel({
  locationName = 'Selected Location',
  loading = false,
  metrics = [],
  insights = [],
  competitors = [],
  demographicData,
  footTrafficData,
  className
}: MarketInsightPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'insights' | 'competitors'>('overview');
  
  if (loading) {
    return (
      <div className={cn('bg-white rounded-xl shadow-lg overflow-hidden h-full', className)}>
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Analyzing market data...</h3>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            {locationName}
          </h2>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
            Analysis Complete
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap',
              activeTab === 'overview'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap',
              activeTab === 'metrics'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Key Metrics
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap',
              activeTab === 'insights'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Insights
          </button>
          <button
            onClick={() => setActiveTab('competitors')}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap',
              activeTab === 'competitors'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Competitors
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Section */}
            <section>
              <h3 className="text-base font-medium text-gray-900 mb-3">Market Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  This location shows {' '}
                  {metrics.find(m => m.label === 'Opportunity Score')?.value || 'moderate'} {' '}
                  potential for a new restaurant venture. The area has {' '}
                  {metrics.find(m => m.label === 'Competition Level')?.value || 'moderate'} {' '}
                  competition with {' '}
                  {competitors.length} similar establishments within a 1km radius.
                </p>
                <p className="mt-2">
                  Demographics indicate a {demographicData?.match || 'good'} match with target customer 
                  profiles, with peak foot traffic during {footTrafficData?.peakHours || 'evenings and weekends'}.
                </p>
              </div>
            </section>
            
            {/* Key Highlights */}
            <section>
              <h3 className="text-base font-medium text-gray-900 mb-3">Key Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Demographics</h4>
                      <p className="text-sm text-blue-800">
                        {demographicData?.summary || 'Young professionals & families'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">Peak Hours</h4>
                      <p className="text-sm text-green-800">
                        {footTrafficData?.peakHours || 'Lunch & dinner time'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Utensils className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">Cuisine Gap</h4>
                      <p className="text-sm text-purple-800">
                        {demographicData?.cuisineGap || 'Asian fusion, health-focused'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900">Price Point</h4>
                      <p className="text-sm text-amber-800">
                        {demographicData?.pricePoint || 'Mid to premium range'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Top Recommendation */}
            {insights.length > 0 && (
              <section>
                <h3 className="text-base font-medium text-gray-900 mb-3">Top Recommendation</h3>
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    {insights[0].recommendation || 
                      "Consider a mid-range Asian fusion restaurant targeting young professionals with focus on dinner service and weekend brunch options."}
                  </p>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{metric.label}</p>
                      <p className="text-2xl font-semibold mt-1">
                        {typeof metric.value === 'number' && !Number.isInteger(metric.value)
                          ? metric.value.toFixed(1)
                          : metric.value}
                      </p>
                    </div>
                    {metric.icon || (
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  {metric.change !== undefined && (
                    <div className="mt-2 flex items-center">
                      {metric.change > 0 ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <TrendingUp size={12} className="mr-1" />
                          <span>+{metric.change}% from average</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 text-xs">
                          <TrendingDown size={12} className="mr-1" />
                          <span>{metric.change}% from average</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {metric.description && (
                    <p className="mt-2 text-xs text-gray-500">{metric.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Additional Chart Section - Placeholder */}
            <div className="mt-6 border rounded-xl p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Interactive charts can be displayed here</p>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={cn(
                  'border rounded-lg p-4',
                  insight.type === 'positive' ? 'bg-green-50 border-green-100' :
                  insight.type === 'negative' ? 'bg-red-50 border-red-100' :
                  'bg-blue-50 border-blue-100'
                )}
              >
                <h4 className={cn(
                  'font-medium mb-1',
                  insight.type === 'positive' ? 'text-green-800' :
                  insight.type === 'negative' ? 'text-red-800' :
                  'text-blue-800'
                )}>
                  {insight.title}
                </h4>
                <p className={cn(
                  'text-sm',
                  insight.type === 'positive' ? 'text-green-700' :
                  insight.type === 'negative' ? 'text-red-700' :
                  'text-blue-700'
                )}>
                  {insight.description}
                </p>
                
                {insight.recommendation && (
                  <div className={cn(
                    'mt-2 pt-2 text-sm border-t',
                    insight.type === 'positive' ? 'border-green-200 text-green-800' :
                    insight.type === 'negative' ? 'border-red-200 text-red-800' :
                    'border-blue-200 text-blue-800'
                  )}>
                    <strong>Recommendation:</strong> {insight.recommendation}
                  </div>
                )}
              </motion.div>
            ))}
            
            {insights.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No insights available for this location</p>
              </div>
            )}
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{competitor.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-gray-700">
                      {competitor.distance < 1 
                        ? `${Math.round(competitor.distance * 1000)}m` 
                        : `${competitor.distance.toFixed(1)}km`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-gray-700">{competitor.cuisineType}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-gray-700">{competitor.priceRange}</span>
                  </div>
                  
                  {competitor.estimatedTraffic && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-700">~{competitor.estimatedTraffic}/day</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {competitors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No competitors found in this area</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <button className="text-sm text-green-600 font-medium hover:text-green-700">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
} 