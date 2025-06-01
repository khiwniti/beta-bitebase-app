/**
 * Sentiment Analysis Component
 * 
 * This component visualizes sentiment analysis data from the marketing research agent.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@bitebase/ui';
import { SmilePlus, Meh, Frown } from 'lucide-react';

interface SentimentData {
  compound: number;
  pos: number;
  neu: number;
  neg: number;
}

interface SentimentAnalysisProps {
  sentiment: SentimentData;
  className?: string;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  sentiment,
  className = '',
}) => {
  // Determine overall sentiment
  const overallSentiment = sentiment.compound > 0.05 
    ? 'positive' 
    : sentiment.compound < -0.05 
      ? 'negative' 
      : 'neutral';

  // Format percentage values
  const positivePercentage = Math.round(sentiment.pos * 100);
  const neutralPercentage = Math.round(sentiment.neu * 100);
  const negativePercentage = Math.round(sentiment.neg * 100);

  return (
    <Card className={`sentiment-analysis-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          {overallSentiment === 'positive' ? (
            <SmilePlus className="h-4 w-4 mr-2 text-green-500" />
          ) : overallSentiment === 'negative' ? (
            <Frown className="h-4 w-4 mr-2 text-red-500" />
          ) : (
            <Meh className="h-4 w-4 mr-2 text-gray-500" />
          )}
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="sentiment-score-overall">
          <span className="font-medium">Overall Score:</span> 
          <span className={`ml-2 font-bold ${
            overallSentiment === 'positive' 
              ? 'text-green-500' 
              : overallSentiment === 'negative' 
                ? 'text-red-500' 
                : 'text-gray-500'
          }`}>
            {sentiment.compound.toFixed(2)}
          </span>
        </div>

        <div className="sentiment-bars mt-4">
          <div className="sentiment-bar-container">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Positive</span>
              <span className="text-sm text-green-500">{positivePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${positivePercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="sentiment-bar-container mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Neutral</span>
              <span className="text-sm text-gray-500">{neutralPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gray-500 h-2.5 rounded-full" 
                style={{ width: `${neutralPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="sentiment-bar-container mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Negative</span>
              <span className="text-sm text-red-500">{negativePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-500 h-2.5 rounded-full" 
                style={{ width: `${negativePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
