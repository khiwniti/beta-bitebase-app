'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, BarChart3, Utensils, Target, PieChart, MapPin, Star, Users, CheckCircle } from 'lucide-react';

export default function PricePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Dish-Based Pricing Strategy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Optimize your restaurant's menu pricing with real market data and AI-powered insights from actual restaurants
            </p>

            <div className="flex justify-center space-x-4 mb-8">
              <Link
                href="/price/analysis"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Dish Price Analysis
              </Link>
              <Link
                href="/price/restaurant-menu"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                <Utensils className="w-5 h-5 mr-2" />
                Restaurant Menu Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Dish-Based Pricing Strategy?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Move beyond subscription models to optimize individual dish pricing for maximum profitability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                Revenue Optimization
              </h3>
              <p className="text-gray-600">
                Maximize profit margins by pricing each dish based on market demand, cost analysis, and competitor data from real restaurants
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                Real Market Data
              </h3>
              <p className="text-gray-600">
                Access live pricing data from Foursquare API and Wongnai delivery menus to stay competitive in your market
              </p>
            </div>
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Get intelligent recommendations based on cuisine type, location, customer behavior, and market trends
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Dish Price Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Dish Price Analysis
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Compare dish prices across restaurants
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Analyze pricing trends by cuisine type
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Identify pricing opportunities and gaps
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Market positioning insights
                </li>
              </ul>
              <Link
                href="/price/analysis"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Start Analysis →
              </Link>
            </div>

            {/* Restaurant Menu Pricing */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Utensils className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Restaurant Menu Pricing
                </h3>
              </div>
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Analyze complete menu pricing strategies
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Real Wongnai delivery menu data
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Popular items and pricing insights
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Category-based pricing analysis
                </li>
              </ul>
              <Link
                href="/price/restaurant-menu"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Analyze Menus →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Transform Your Pricing Strategy Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join restaurants using data-driven dish pricing to increase revenue by up to 25%
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/price/analysis"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <PieChart className="w-5 h-5 mr-2" />
              Start Analysis
            </Link>
            <Link
              href="/price/restaurant-menu"
              className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explore Restaurants
            </Link>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Data, Real Results
            </h2>
            <p className="text-lg text-gray-600">
              Powered by live restaurant data from Foursquare API and Wongnai delivery menus
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Real-time Analytics</h3>
              <p className="text-neutral-600">Get instant insights into your restaurant's performance with live data updates.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-saffron-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">AI-Powered Insights</h3>
              <p className="text-neutral-600">Leverage artificial intelligence to discover hidden opportunities and optimize operations.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Enterprise Security</h3>
              <p className="text-neutral-600">Your data is protected with enterprise-grade security and compliance standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
