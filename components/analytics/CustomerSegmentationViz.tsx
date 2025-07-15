/**
 * Customer Segmentation Visualization Component
 * Displays AI-generated customer segments and targeting insights
 */

import { useState } from 'react';

export default function CustomerSegmentationViz({ data }) {
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Mock customer segmentation data - in production, this would come from AI analysis
  const customerSegments = [
    {
      id: 'young_professionals',
      name: 'Young Professionals',
      size: 35,
      avgAge: 28,
      income: '$65,000',
      characteristics: [
        'Tech-savvy and mobile-first',
        'Values convenience and speed',
        'Active on social media',
        'Willing to pay for quality'
      ],
      preferences: [
        'Online ordering and delivery',
        'Healthy and trendy options',
        'Quick service during lunch',
        'Instagram-worthy presentation'
      ],
      marketingChannels: [
        'Instagram and TikTok ads',
        'LinkedIn professional content',
        'Food delivery app promotions',
        'Influencer partnerships'
      ],
      avgSpend: '$42',
      frequency: '2.3x/week',
      color: 'blue'
    },
    {
      id: 'families',
      name: 'Families with Children',
      size: 28,
      avgAge: 38,
      income: '$85,000',
      characteristics: [
        'Value-conscious decision makers',
        'Prioritize family-friendly environment',
        'Plan dining experiences in advance',
        'Seek variety for different tastes'
      ],
      preferences: [
        'Kids menu and activities',
        'Spacious seating arrangements',
        'Weekend family dining',
        'Reasonable pricing for groups'
      ],
      marketingChannels: [
        'Facebook family groups',
        'Local school partnerships',
        'Family event sponsorships',
        'Email newsletters with deals'
      ],
      avgSpend: '$78',
      frequency: '1.5x/week',
      color: 'green'
    },
    {
      id: 'seniors',
      name: 'Senior Diners',
      size: 22,
      avgAge: 65,
      income: '$55,000',
      characteristics: [
        'Loyal to preferred establishments',
        'Value personal service',
        'Prefer traditional dining experiences',
        'Price-sensitive but quality-focused'
      ],
      preferences: [
        'Early dining hours',
        'Comfortable seating',
        'Traditional menu options',
        'Senior discounts and specials'
      ],
      marketingChannels: [
        'Local newspaper ads',
        'Community center partnerships',
        'Word-of-mouth referrals',
        'Direct mail campaigns'
      ],
      avgSpend: '$35',
      frequency: '2.1x/week',
      color: 'purple'
    },
    {
      id: 'date_night',
      name: 'Date Night Couples',
      size: 15,
      avgAge: 32,
      income: '$95,000',
      characteristics: [
        'Seeking romantic atmosphere',
        'Willing to spend on experiences',
        'Value ambiance and service',
        'Celebrate special occasions'
      ],
      preferences: [
        'Intimate seating arrangements',
        'Wine and cocktail selection',
        'Evening dining hours',
        'Special occasion packages'
      ],
      marketingChannels: [
        'Google Ads for romantic dining',
        'Wedding venue partnerships',
        'Valentine\'s Day promotions',
        'Couples\' social media content'
      ],
      avgSpend: '$125',
      frequency: '0.8x/week',
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', accent: 'bg-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', accent: 'bg-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', accent: 'bg-purple-500' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', accent: 'bg-pink-500' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          👥 Customer Segmentation Analysis
        </h3>
        <p className="text-gray-600 mb-6">
          AI-identified customer segments based on demographics, behavior patterns, and spending habits.
        </p>
        
        {/* Segment Size Visualization */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Market Share by Segment</h4>
          <div className="flex rounded-lg overflow-hidden h-8">
            {customerSegments.map((segment) => {
              const colors = getColorClasses(segment.color);
              return (
                <div
                  key={segment.id}
                  className={`${colors.accent} flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                  style={{ width: `${segment.size}%` }}
                  onClick={() => setSelectedSegment(segment)}
                  title={`${segment.name}: ${segment.size}%`}
                >
                  {segment.size}%
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {customerSegments.map((segment) => {
              const colors = getColorClasses(segment.color);
              return (
                <div key={segment.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${colors.accent}`}></div>
                  <span className="text-sm text-gray-700">{segment.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customerSegments.map((segment) => {
          const colors = getColorClasses(segment.color);
          const isSelected = selectedSegment?.id === segment.id;
          
          return (
            <div
              key={segment.id}
              className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                isSelected ? `${colors.border} shadow-lg` : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedSegment(isSelected ? null : segment)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{segment.name}</h4>
                  <p className="text-sm text-gray-600">{segment.size}% of customer base</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                  {segment.size}%
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{segment.avgSpend}</div>
                  <div className="text-xs text-gray-600">Avg Spend</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{segment.frequency}</div>
                  <div className="text-xs text-gray-600">Visit Frequency</div>
                </div>
              </div>

              {/* Demographics */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Demographics</h5>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>Average Age: <span className="font-medium">{segment.avgAge}</span></div>
                  <div>Household Income: <span className="font-medium">{segment.income}</span></div>
                </div>
              </div>

              {/* Characteristics Preview */}
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 mb-2">Key Characteristics</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {segment.characteristics.slice(0, 2).map((char, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {char}
                    </li>
                  ))}
                  {segment.characteristics.length > 2 && (
                    <li className="text-gray-500 text-xs">
                      +{segment.characteristics.length - 2} more...
                    </li>
                  )}
                </ul>
              </div>

              {/* Expand Button */}
              <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected 
                  ? `${colors.accent} text-white` 
                  : `${colors.bg} ${colors.text} hover:opacity-80`
              }`}>
                {isSelected ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Detailed View */}
      {selectedSegment && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedSegment.name} - Detailed Analysis
            </h3>
            <button
              onClick={() => setSelectedSegment(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Characteristics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Characteristics</h4>
              <ul className="space-y-2">
                {selectedSegment.characteristics.map((char, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
              <ul className="space-y-2">
                {selectedSegment.preferences.map((pref, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {pref}
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketing Channels */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Marketing Channels</h4>
              <ul className="space-y-2">
                {selectedSegment.marketingChannels.map((channel, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {channel}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Targeting Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Targeting Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Primary Target</h4>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Young Professionals</span>
                <span className="text-sm text-gray-600">(35% market share)</span>
              </div>
              <p className="text-sm text-gray-700">
                Highest frequency and digital engagement. Focus on mobile ordering, 
                social media marketing, and premium convenience offerings.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Growth Opportunity</h4>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Families with Children</span>
                <span className="text-sm text-gray-600">(28% market share)</span>
              </div>
              <p className="text-sm text-gray-700">
                Highest average spend per visit. Develop family-friendly amenities, 
                kids menu, and weekend promotions to capture this segment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}