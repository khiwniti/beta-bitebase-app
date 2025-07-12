import React from 'react';
import { Button } from '../ui/button';
import { TrendingUp, MapPin, BarChart3, Users, DollarSign } from 'lucide-react';

interface MarketingResearchActionsProps {
  onActionSelect: (action: string) => void;
}

export function MarketingResearchActions({ onActionSelect }: MarketingResearchActionsProps) {
  const actions = [
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Analyze market trends and opportunities',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      id: 'location-insights',
      title: 'Location Insights',
      description: 'Get insights about specific locations',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-accent-red-500 hover:bg-accent-red-600'
    },
    {
      id: 'competitor-analysis',
      title: 'Competitor Analysis',
      description: 'Analyze competitor performance',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-accent-saffron-500 hover:bg-accent-saffron-600'
    },
    {
      id: 'customer-demographics',
      title: 'Customer Demographics',
      description: 'Understand your target audience',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      id: 'revenue-forecast',
      title: 'Revenue Forecast',
      description: 'Predict future revenue trends',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-accent-red-600 hover:bg-accent-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          className={`h-auto p-4 flex flex-col items-start space-y-2 text-left hover:shadow-md transition-all ${action.color} text-white border-none`}
          onClick={() => onActionSelect(action.id)}
        >
          <div className="flex items-center space-x-2">
            {action.icon}
            <span className="font-medium">{action.title}</span>
          </div>
          <p className="text-sm opacity-90">{action.description}</p>
        </Button>
      ))}
    </div>
  );
}