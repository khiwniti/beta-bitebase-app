import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, TrendingUp, MapPin, Users, DollarSign } from 'lucide-react';

interface MarketingResearchVisualizerProps {
  data?: any;
  type?: string;
  charts?: { [key: string]: string };
  sentiment?: {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
  };
  keywords?: Array<[string, number]>;
  className?: string;
}

const MarketingResearchVisualizer: React.FC<MarketingResearchVisualizerProps> = ({ 
  data, 
  type = 'default',
  charts,
  sentiment,
  keywords,
  className = ''
}) => {
  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-600">
            <BarChart3 className="h-5 w-5" />
            Market Research Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No data available for visualization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderVisualization = () => {
    switch (type) {
      case 'market-analysis':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-primary-800">Growth Rate</span>
                </div>
                <p className="text-2xl font-bold text-primary-600">+12.5%</p>
                <p className="text-sm text-primary-600">vs last quarter</p>
              </div>
              <div className="bg-accent-red-50 p-4 rounded-lg border border-accent-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-accent-red-600" />
                  <span className="font-medium text-accent-red-800">Market Size</span>
                </div>
                <p className="text-2xl font-bold text-accent-red-600">2.4M</p>
                <p className="text-sm text-accent-red-600">potential customers</p>
              </div>
              <div className="bg-accent-saffron-50 p-4 rounded-lg border border-accent-saffron-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-accent-saffron-600" />
                  <span className="font-medium text-accent-saffron-800">Revenue Potential</span>
                </div>
                <p className="text-2xl font-bold text-accent-saffron-600">$1.2M</p>
                <p className="text-sm text-accent-saffron-600">annual projection</p>
              </div>
            </div>
          </div>
        );
      
      case 'location-insights':
        return (
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-primary-800">Location Score</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Foot Traffic</span>
                  <span className="text-sm font-medium">85/100</span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary-400" />
            <p className="text-gray-600">Visualization will appear here</p>
          </div>
        );
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-600">
          <BarChart3 className="h-5 w-5" />
          Research Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};

export default MarketingResearchVisualizer;