import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, TrendingUp, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LocationRecommendation {
  id: string;
  name: string;
  address: string;
  score: number; // 0-100
  latitude: number;
  longitude: number;
  matchFactors: Array<{
    icon: LucideIcon;
    label: string;
    score: number; // 0-100
    color?: string;
  }>;
  insights: string[];
}

interface LocationRecommenderCardProps {
  recommendation: LocationRecommendation;
  isSelected?: boolean;
  onSelect?: (recommendation: LocationRecommendation) => void;
  className?: string;
}

export default function LocationRecommenderCard({
  recommendation,
  isSelected = false,
  onSelect,
  className,
}: LocationRecommenderCardProps) {
  const scoreColor = 
    recommendation.score >= 80 ? 'text-green-600' :
    recommendation.score >= 60 ? 'text-blue-600' :
    recommendation.score >= 40 ? 'text-amber-600' : 'text-red-600';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect && onSelect(recommendation)}
      className={cn(
        'relative border rounded-xl p-4 cursor-pointer transition-all duration-200',
        isSelected ? 'border-green-500 shadow-md bg-green-50' : 'border-gray-200 hover:shadow-md',
        className
      )}
    >
      {isSelected && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}

      {/* Location Name & Score */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900">{recommendation.name}</h3>
        <div className={cn('text-sm font-semibold flex items-center gap-1', scoreColor)}>
          <Star size={16} className="fill-current" />
          <span>{recommendation.score}/100</span>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 mb-3">
        <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700 line-clamp-2">{recommendation.address}</p>
      </div>

      {/* Match Factors */}
      <div className="space-y-2 mb-4">
        {recommendation.matchFactors.map((factor, index) => {
          const FactorIcon = factor.icon;
          const factorColor = 
            factor.color ?? (
              factor.score >= 80 ? 'text-green-600' :
              factor.score >= 60 ? 'text-blue-600' :
              factor.score >= 40 ? 'text-amber-600' : 'text-red-600'
            );
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FactorIcon size={14} className="text-gray-500" />
                <span className="text-xs text-gray-700">{factor.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={cn('h-full rounded-full', 
                      factor.score >= 80 ? 'bg-green-500' :
                      factor.score >= 60 ? 'bg-blue-500' :
                      factor.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <span className={cn("text-xs font-medium", factorColor)}>
                  {factor.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Insights */}
      {recommendation.insights && recommendation.insights.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Key Insights</h4>
          <ul className="space-y-1">
            {recommendation.insights.slice(0, 3).map((insight, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View button */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(recommendation);
          }}
          className={cn(
            "text-xs font-medium py-1.5 px-3 rounded-md transition-colors",
            isSelected 
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {isSelected ? 'Selected' : 'View Details'}
        </button>
      </div>
    </motion.div>
  );
} 