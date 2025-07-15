/**
 * Business Recommendations Component
 * Displays AI-generated strategic recommendations and action items
 */

import { useState } from 'react';

export default function BusinessRecommendations({ data }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Mock business recommendations - in production, this would come from AI analysis
  const recommendations = [
    {
      id: 1,
      category: 'marketing',
      priority: 'high',
      title: 'Implement Social Media Marketing Strategy',
      description: 'Focus on Instagram and TikTok to reach young professionals who represent 35% of your target market.',
      impact: 'High',
      effort: 'Medium',
      timeline: '2-4 weeks',
      expectedROI: '250%',
      actionItems: [
        'Create Instagram business account with professional photos',
        'Develop content calendar with daily posts',
        'Partner with local food influencers',
        'Run targeted ads for lunch specials'
      ],
      metrics: [
        'Social media followers growth',
        'Engagement rate increase',
        'Traffic from social media',
        'New customer acquisition'
      ]
    },
    {
      id: 2,
      category: 'operations',
      priority: 'high',
      title: 'Optimize Menu for Target Demographics',
      description: 'Adjust menu offerings to better serve identified customer segments, especially families and young professionals.',
      impact: 'High',
      effort: 'Medium',
      timeline: '3-6 weeks',
      expectedROI: '180%',
      actionItems: [
        'Add healthy options for young professionals',
        'Create dedicated kids menu with activities',
        'Introduce quick lunch combos',
        'Offer customizable meal options'
      ],
      metrics: [
        'Average order value increase',
        'Customer satisfaction scores',
        'Menu item popularity',
        'Repeat customer rate'
      ]
    },
    {
      id: 3,
      category: 'pricing',
      priority: 'medium',
      title: 'Implement Dynamic Pricing Strategy',
      description: 'Use AI-recommended pricing tiers to maximize revenue while remaining competitive.',
      impact: 'Medium',
      effort: 'Low',
      timeline: '1-2 weeks',
      expectedROI: '120%',
      actionItems: [
        'Analyze competitor pricing weekly',
        'Implement lunch vs dinner pricing',
        'Create value meal packages',
        'Offer loyalty program discounts'
      ],
      metrics: [
        'Revenue per customer',
        'Price sensitivity analysis',
        'Competitive positioning',
        'Profit margin improvement'
      ]
    },
    {
      id: 4,
      category: 'technology',
      priority: 'high',
      title: 'Launch Online Ordering Platform',
      description: 'Capture the convenience-focused segment with seamless digital ordering experience.',
      impact: 'High',
      effort: 'High',
      timeline: '6-8 weeks',
      expectedROI: '300%',
      actionItems: [
        'Select and implement ordering platform',
        'Integrate with POS system',
        'Train staff on order management',
        'Launch with promotional campaign'
      ],
      metrics: [
        'Online order volume',
        'Average delivery order value',
        'Customer retention rate',
        'Operational efficiency'
      ]
    },
    {
      id: 5,
      category: 'location',
      priority: 'medium',
      title: 'Enhance Outdoor Seating Area',
      description: 'Capitalize on location advantages by creating attractive outdoor dining space.',
      impact: 'Medium',
      effort: 'High',
      timeline: '4-6 weeks',
      expectedROI: '150%',
      actionItems: [
        'Design weather-resistant seating area',
        'Install heating/cooling elements',
        'Add ambient lighting and plants',
        'Create Instagram-worthy photo spots'
      ],
      metrics: [
        'Seating capacity utilization',
        'Customer dwell time',
        'Social media mentions',
        'Revenue per square foot'
      ]
    },
    {
      id: 6,
      category: 'customer_service',
      priority: 'medium',
      title: 'Implement Customer Feedback System',
      description: 'Establish systematic approach to collect and act on customer feedback for continuous improvement.',
      impact: 'Medium',
      effort: 'Low',
      timeline: '2-3 weeks',
      expectedROI: '140%',
      actionItems: [
        'Set up digital feedback collection',
        'Create staff training program',
        'Implement review response strategy',
        'Establish monthly improvement meetings'
      ],
      metrics: [
        'Customer satisfaction scores',
        'Online review ratings',
        'Complaint resolution time',
        'Customer retention rate'
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'marketing', label: 'Marketing', icon: '📢' },
    { value: 'operations', label: 'Operations', icon: '⚙️' },
    { value: 'pricing', label: 'Pricing', icon: '💰' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'location', label: 'Location', icon: '📍' },
    { value: 'customer_service', label: 'Customer Service', icon: '🤝' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const filteredRecommendations = recommendations.filter(rec => {
    const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
    const priorityMatch = priorityFilter === 'all' || rec.priority === priorityFilter;
    return categoryMatch && priorityMatch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            💡 Strategic Recommendations
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            AI-generated action items prioritized by impact and feasibility
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {recommendations.filter(r => r.priority === 'high').length}
          </div>
          <div className="text-sm text-red-800">High Priority</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {recommendations.filter(r => r.priority === 'medium').length}
          </div>
          <div className="text-sm text-yellow-800">Medium Priority</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(recommendations.reduce((sum, r) => sum + parseInt(r.expectedROI), 0) / recommendations.length)}%
          </div>
          <div className="text-sm text-green-800">Avg Expected ROI</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {recommendations.reduce((sum, r) => sum + r.actionItems.length, 0)}
          </div>
          <div className="text-sm text-blue-800">Total Action Items</div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        {filteredRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="bg-white rounded-lg border shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {recommendation.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                      {recommendation.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{recommendation.description}</p>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Impact:</span>
                      <span className={`ml-1 font-medium ${getImpactColor(recommendation.impact)}`}>
                        {recommendation.impact}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Effort:</span>
                      <span className="ml-1 font-medium text-gray-900">{recommendation.effort}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Timeline:</span>
                      <span className="ml-1 font-medium text-gray-900">{recommendation.timeline}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Expected ROI:</span>
                      <span className="ml-1 font-medium text-green-600">{recommendation.expectedROI}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Action Items</h5>
                  <ul className="space-y-2">
                    {recommendation.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Success Metrics</h5>
                  <ul className="space-y-2">
                    {recommendation.metrics.map((metric, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">📊</span>
                        <span className="text-sm text-gray-700">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Implementation Timeline */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📅 Recommended Implementation Timeline
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Weeks 1-2: Quick Wins</div>
              <div className="text-sm text-gray-600">
                Implement customer feedback system and dynamic pricing strategy
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Weeks 3-6: Core Improvements</div>
              <div className="text-sm text-gray-600">
                Launch social media strategy and optimize menu offerings
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Weeks 7-12: Major Initiatives</div>
              <div className="text-sm text-gray-600">
                Implement online ordering platform and enhance outdoor seating
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}