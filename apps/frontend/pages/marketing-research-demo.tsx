/**
 * Marketing Research Demo Page
 * 
 * This page demonstrates the marketing research integration
 */

import React from 'react';
import { EnhancedUnifiedAIChat } from '../components/ai';

const MarketingResearchDemo = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Marketing Research Assistant</h1>
          <p className="text-muted-foreground">
            Ask questions about marketing strategies, customer insights, competitive analysis, 
            or promotional campaigns for restaurants and cafes.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="bg-card rounded-lg shadow-sm border p-1">
            <EnhancedUnifiedAIChat
              title="Marketing Assistant"
              placeholder="Try asking about marketing strategies, customer insights, or competitive analysis..."
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Example Questions</h2>
          <div className="grid gap-2">
            <div className="p-3 bg-primary/5 rounded-md">
              "What are the most effective marketing strategies for a new coffee shop?"
            </div>
            <div className="p-3 bg-primary/5 rounded-md">
              "Can you analyze the competitive landscape for a fine dining restaurant in Chicago?"
            </div>
            <div className="p-3 bg-primary/5 rounded-md">
              "Create a marketing campaign for a farm-to-table restaurant"
            </div>
            <div className="p-3 bg-primary/5 rounded-md">
              "What customer retention strategies work best for family-style restaurants?"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingResearchDemo;
