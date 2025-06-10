/**
 * Marketing Research Actions Component
 * 
 * This component provides action buttons for marketing research functionality
 */

import React from 'react';
import { Button } from '@bitebase/ui';
import { BarChart2, Users, TrendingUp, LightbulbIcon } from 'lucide-react';

interface MarketingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const MarketingActionButton: React.FC<MarketingActionButtonProps> = ({
  onClick,
  icon,
  label,
  description,
}) => (
  <Button
    variant="outline"
    className="w-full flex items-center justify-start gap-3 px-4 py-3 h-auto text-left"
    onClick={onClick}
  >
    <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  </Button>
);

interface MarketingResearchActionsProps {
  onRequestAction: (action: string, parameters: Record<string, any>) => void;
  query?: string;
  className?: string;
}

export const MarketingResearchActions: React.FC<MarketingResearchActionsProps> = ({
  onRequestAction,
  query = '',
  className = '',
}) => {
  // Actions
  const requestComprehensiveResearch = () => {
    onRequestAction('marketing_research', { query });
  };

  const requestCompetitiveAnalysis = () => {
    onRequestAction('competitive_analysis', { query });
  };

  const requestMarketingCampaign = () => {
    onRequestAction('marketing_campaign', { query });
  };

  const suggestMarketingIdeas = () => {
    // This could be a different action or a specific query
    onRequestAction('marketing_ideas', { query });
  };

  if (!query) {
    return null;
  }

  return (
    <div className={`marketing-research-actions space-y-2 ${className}`}>
      <MarketingActionButton
        onClick={requestComprehensiveResearch}
        icon={<BarChart2 className="h-4 w-4" />}
        label="Comprehensive Research"
        description="Get detailed marketing research and insights"
      />
      
      <MarketingActionButton
        onClick={requestCompetitiveAnalysis}
        icon={<Users className="h-4 w-4" />}
        label="Competitive Analysis"
        description="Analyze competitors and market positioning"
      />
      
      <MarketingActionButton
        onClick={requestMarketingCampaign}
        icon={<TrendingUp className="h-4 w-4" />}
        label="Marketing Campaign Plan"
        description="Generate a complete marketing campaign strategy"
      />
      
      <MarketingActionButton
        onClick={suggestMarketingIdeas}
        icon={<LightbulbIcon className="h-4 w-4" />}
        label="Suggest Marketing Ideas"
        description="Get creative marketing ideas and suggestions"
      />
    </div>
  );
};

export default MarketingResearchActions;
