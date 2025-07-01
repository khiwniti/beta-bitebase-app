'use client';

import React from 'react';
import { Star, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

export default function ReviewsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <Star className="h-8 w-8 text-yellow-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
            <p className="text-gray-600">Monitor and respond to customer reviews across platforms</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">4.6</p>
                <Star className="h-5 w-5 text-yellow-500 ml-1" />
              </div>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">1,847</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Response</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Management Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive review monitoring, automated responses, and sentiment analysis across all major platforms.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Get Notified
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            View Demo
          </button>
        </div>
      </div>
    </div>
  );
}
