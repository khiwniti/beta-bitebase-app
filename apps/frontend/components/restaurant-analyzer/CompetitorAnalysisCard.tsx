import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Utensils, 
  DollarSign, 
  Clock, 
  Info,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface CompetitorData {
  name: string;
  distance: number; // in km
  rating: number;
  cuisine: string;
  priceLevel: number; // 1-4
  popularity: 'high' | 'medium' | 'low';
  operatingHours?: {
    open: string;
    close: string;
  };
  estimatedTraffic?: number; // per day
}

interface CompetitorAnalysisCardProps {
  competitor: CompetitorData;
  similarity?: number; // 0 to 1, how similar to user's concept
  className?: string;
  onClick?: () => void;
}

export default function CompetitorAnalysisCard({
  competitor,
  similarity = 0.5,
  className,
  onClick
}: CompetitorAnalysisCardProps) {
  const similarityPercentage = Math.round(similarity * 100);
  
  // Convert price level to dollar signs
  const priceIndicator = Array(competitor.priceLevel)
    .fill('$')
    .join('');
  
  const distanceFormatted = competitor.distance < 1 
    ? `${Math.round(competitor.distance * 1000)}m` 
    : `${competitor.distance.toFixed(1)}km`;

  const getSimilarityColor = () => {
    if (similarity >= 0.7) return 'text-red-600';
    if (similarity >= 0.4) return 'text-amber-600';
    return 'text-green-600';
  };
  
  const getPopularityIcon = () => {
    switch (competitor.popularity) {
      case 'high': return <TrendingUp className="text-green-500" size={16} />;
      case 'medium': return <Activity className="text-amber-500" size={16} />;
      case 'low': return <TrendingDown className="text-red-500" size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border shadow-sm p-4 cursor-pointer',
        'hover:shadow-md transition-all duration-200',
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 truncate max-w-[70%]">{competitor.name}</h3>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">
            <Star size={16} fill="currentColor" />
          </span>
          <span className="text-sm font-medium">{competitor.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
        <div className="flex items-center gap-1.5">
          <Utensils size={14} className="text-gray-500" />
          <span className="text-gray-700 truncate">{competitor.cuisine}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <DollarSign size={14} className="text-gray-500" />
          <span className="text-gray-700">{priceIndicator}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-500" />
          <span className="text-gray-700">{distanceFormatted}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {getPopularityIcon()}
          <span className="text-gray-700 capitalize">{competitor.popularity}</span>
        </div>
      </div>
      
      {competitor.operatingHours && (
        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
          <Clock size={14} />
          <span>{competitor.operatingHours.open} - {competitor.operatingHours.close}</span>
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AlertCircle size={14} className={getSimilarityColor()} />
          <span className={cn("text-sm font-medium", getSimilarityColor())}>
            {similarityPercentage}% similar
          </span>
        </div>
        
        {competitor.estimatedTraffic && (
          <div className="text-xs text-gray-500">
            ~{competitor.estimatedTraffic} visits/day
          </div>
        )}
      </div>
    </motion.div>
  );
} 