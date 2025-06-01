/**
 * Keyword Cloud Component
 * 
 * This component displays a visualization of keywords and their frequencies
 * from marketing research data.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@bitebase/ui';
import { Hash } from 'lucide-react';

interface KeywordCloudProps {
  keywords: Array<[string, number]>; // [keyword, frequency]
  className?: string;
  maxKeywords?: number;
}

export const KeywordCloud: React.FC<KeywordCloudProps> = ({
  keywords,
  className = '',
  maxKeywords = 20,
}) => {
  if (!keywords.length) {
    return null;
  }

  // Limit number of keywords
  const displayKeywords = keywords.slice(0, maxKeywords);

  // Find max frequency for scaling
  const maxFrequency = Math.max(...displayKeywords.map(k => k[1]));
  
  // Calculate size for each keyword (1-5)
  const getKeywordSize = (frequency: number) => {
    const normalizedSize = (frequency / maxFrequency) * 5;
    return Math.max(1, Math.min(5, Math.round(normalizedSize)));
  };

  // Get color for keyword based on frequency
  const getKeywordColor = (frequency: number) => {
    const normalizedValue = frequency / maxFrequency;
    if (normalizedValue > 0.8) return 'text-primary font-bold';
    if (normalizedValue > 0.6) return 'text-primary';
    if (normalizedValue > 0.4) return 'text-primary-600';
    if (normalizedValue > 0.2) return 'text-primary-400';
    return 'text-primary-300';
  };

  return (
    <Card className={`keyword-cloud-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <Hash className="h-4 w-4 mr-2" />
          Key Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="keyword-cloud-container flex flex-wrap gap-2 py-2">
          {displayKeywords.map(([keyword, frequency], index) => (
            <div 
              key={index}
              className={`keyword-tag px-2 py-1 rounded-full border border-gray-200 ${getKeywordColor(frequency)}`}
              style={{ 
                fontSize: `${0.75 + (getKeywordSize(frequency) * 0.15)}rem`,
              }}
            >
              {keyword}
              <span className="ml-1 text-xs opacity-50">({frequency})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordCloud;
