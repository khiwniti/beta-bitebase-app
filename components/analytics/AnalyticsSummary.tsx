/**
 * Analytics Summary Component
 * High-level overview of key metrics and insights
 */

export default function AnalyticsSummary({ data }) {
  const { summary, marketAnalysis } = data;

  const metrics = [
    {
      label: 'Overall Score',
      value: summary.overallScore,
      max: 100,
      color: 'blue',
      icon: '🎯'
    },
    {
      label: 'Success Probability',
      value: marketAnalysis.successProbability,
      max: 100,
      color: 'green',
      icon: '📈'
    },
    {
      label: 'Market Saturation',
      value: marketAnalysis.marketSaturation,
      max: 10,
      color: 'yellow',
      icon: '🏪'
    },
    {
      label: 'Location Score',
      value: marketAnalysis.locationScore,
      max: 100,
      color: 'purple',
      icon: '📍'
    }
  ];

  const getColorClasses = (color, value, max) => {
    const percentage = (value / max) * 100;
    
    if (percentage >= 80) {
      return {
        bg: `bg-${color}-100`,
        text: `text-${color}-800`,
        progress: `bg-${color}-500`
      };
    } else if (percentage >= 60) {
      return {
        bg: `bg-yellow-100`,
        text: `text-yellow-800`,
        progress: `bg-yellow-500`
      };
    } else {
      return {
        bg: `bg-red-100`,
        text: `text-red-800`,
        progress: `bg-red-500`
      };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color, metric.value, metric.max);
        const percentage = (metric.value / metric.max) * 100;
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">{metric.icon}</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                {metric.value}{metric.max === 100 ? '%' : '/10'}
              </div>
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {metric.value}{metric.max === 100 ? '%' : '/10'}
              </h3>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${colors.progress}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            
            {/* Status Text */}
            <div className="mt-2 text-xs text-gray-500">
              {percentage >= 80 ? 'Excellent' : 
               percentage >= 60 ? 'Good' : 
               percentage >= 40 ? 'Fair' : 'Needs Attention'}
            </div>
          </div>
        );
      })}
    </div>
  );
}