import React from 'react';
import { TrendingUp, AlertTriangle, MapPin, Users, Star, DollarSign, Clock, Utensils } from 'lucide-react';
import InsightCard from './InsightCard';

interface InsightsDashboardProps {
  locationData?: any;
  restaurantData?: any;
  competitionData?: any;
  demographicData?: any;
  isLoading?: boolean;
  onExplore?: (insightType: string) => void;
  className?: string;
}

export default function InsightsDashboard({
  locationData,
  restaurantData,
  competitionData,
  demographicData,
  isLoading = false,
  onExplore,
  className,
}: InsightsDashboardProps) {
  // Mock data - would be replaced with actual API data
  const insights = [
    {
      id: 'opportunity-1',
      title: 'High Growth Area',
      description: 'This location has shown a 12% increase in foot traffic over the last 6 months',
      icon: TrendingUp,
      category: 'opportunity',
      actionText: 'View detailed analysis',
    },
    {
      id: 'warning-1',
      title: 'High Competition',
      description: 'There are 8 similar restaurants within a 1km radius',
      icon: AlertTriangle,
      category: 'warning',
      actionText: 'Explore competition',
    },
    {
      id: 'positive-1',
      title: 'Prime Location',
      description: 'This location is within 500m of multiple high-traffic areas',
      icon: MapPin,
      category: 'positive',
      actionText: 'View location details',
    },
    {
      id: 'neutral-1',
      title: 'Demographic Match',
      description: 'Area demographics align well with your target customer profile',
      icon: Users,
      category: 'neutral',
      actionText: 'View demographics',
    },
    {
      id: 'positive-2',
      title: 'High Rating Potential',
      description: 'Similar restaurants in this area have an average rating of 4.5 stars',
      icon: Star,
      category: 'positive',
      actionText: 'View ratings breakdown',
    },
    {
      id: 'opportunity-2',
      title: 'Price Opportunity',
      description: 'The average price point in this area is higher than market average',
      icon: DollarSign,
      category: 'opportunity',
      actionText: 'View pricing analysis',
    },
    {
      id: 'neutral-2',
      title: 'Peak Hours',
      description: 'Busiest times are weekdays 12-2pm and weekends 6-9pm',
      icon: Clock,
      category: 'neutral',
      actionText: 'View foot traffic data',
    },
    {
      id: 'warning-2',
      title: 'Cuisine Saturation',
      description: 'This cuisine type is well represented in the area',
      icon: Utensils,
      category: 'warning',
      actionText: 'View cuisine distribution',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const handleAction = (insightId: string) => {
    if (onExplore) {
      onExplore(insightId);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          title={insight.title}
          description={insight.description}
          icon={insight.icon}
          category={insight.category as any}
          actionText={insight.actionText}
          onAction={() => handleAction(insight.id)}
        />
      ))}
    </div>
  );
} 