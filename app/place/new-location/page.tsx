'use client';

import React, { useState } from 'react';
import { useTranslations } from '../../../hooks/useTranslations';
import { MapPin, Search, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export default function NewLocationPage() {
  const t = useTranslations('place');
  const [location, setLocation] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        score: 85,
        footTraffic: 'High',
        competition: 'Medium',
        demographics: 'Young professionals',
        recommendations: [
          'High foot traffic area with good visibility',
          'Strong demographic match for casual dining',
          'Moderate competition allows for differentiation'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('place.newLocation.title') || 'New Location Analysis'}
          </h1>
          <p className="text-gray-600">
            {t('place.newLocation.description') || 'Analyze potential restaurant locations with AI-powered insights'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location address or coordinates..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !location}
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Location'}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Score</h3>
              <div className="text-3xl font-bold text-emerald-600 mb-2">{analysis.score}/100</div>
              <p className="text-gray-600">Overall suitability for restaurant business</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Foot Traffic:</span>
                  <span className="font-medium">{analysis.footTraffic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competition:</span>
                  <span className="font-medium">{analysis.competition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Demographics:</span>
                  <span className="font-medium">{analysis.demographics}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}