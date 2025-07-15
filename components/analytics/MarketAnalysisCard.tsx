/**
 * Market Analysis Card Component
 * Displays comprehensive market analysis results
 */

export default function MarketAnalysisCard({ data, detailed = false }) {
  const {
    marketSaturation,
    competitionDensity,
    pricingStrategy,
    targetSegments,
    opportunities,
    threats,
    successProbability,
    recommendations,
    summary,
    competitorMetrics,
    demographicInsights
  } = data;

  if (!detailed) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏪 Market Analysis
        </h3>
        
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {marketSaturation}/10
              </div>
              <div className="text-sm text-gray-600">Market Saturation</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {successProbability}%
              </div>
              <div className="text-sm text-gray-600">Success Probability</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
          
          {/* Top Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Top Recommendations</h4>
            <ul className="space-y-1">
              {recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {marketSaturation}/10
          </div>
          <div className="text-sm font-medium text-blue-800">Market Saturation</div>
          <div className="text-xs text-blue-600 mt-1">
            {marketSaturation <= 3 ? 'Low Competition' :
             marketSaturation <= 6 ? 'Moderate Competition' :
             'High Competition'}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {successProbability}%
          </div>
          <div className="text-sm font-medium text-green-800">Success Probability</div>
          <div className="text-xs text-green-600 mt-1">
            {successProbability >= 80 ? 'Very High' :
             successProbability >= 60 ? 'High' :
             successProbability >= 40 ? 'Moderate' : 'Low'}
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {competitorMetrics.totalCompetitors}
          </div>
          <div className="text-sm font-medium text-purple-800">Competitors</div>
          <div className="text-xs text-purple-600 mt-1">
            Avg Rating: {competitorMetrics.averageRating || 'N/A'}
          </div>
        </div>
      </div>

      {/* Pricing Strategy */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Pricing Strategy
        </h3>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="font-medium text-yellow-800 mb-2">
            Recommended Range: {pricingStrategy.recommendedRange}
          </div>
          <p className="text-sm text-yellow-700">
            {pricingStrategy.reasoning}
          </p>
        </div>
      </div>

      {/* Target Segments */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Target Customer Segments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {targetSegments.map((segment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="font-medium text-gray-900">{segment}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities & Threats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            ✅ Opportunities
          </h3>
          <ul className="space-y-2">
            {opportunities.map((opportunity, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-green-500 mr-2">+</span>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4">
            ⚠️ Threats
          </h3>
          <ul className="space-y-2">
            {threats.map((threat, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-red-500 mr-2">-</span>
                {threat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Demographic Insights */}
      {demographicInsights && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            👥 Demographic Insights
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Key Insights</h4>
              <ul className="space-y-2">
                {demographicInsights.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Target Demographics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Target Demographics</h4>
              <div className="space-y-3">
                {demographicInsights.targetDemographics.map((demo, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{demo.segment}</span>
                      <span className="text-sm text-gray-600">{Math.round(demo.size)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${demo.size}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Strategic Recommendations
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Executive Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}