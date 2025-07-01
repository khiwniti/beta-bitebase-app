'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MetricCard } from "../../components/ui/metric-card";
import { DataTable } from "../../components/ui/data-table";
import { ChartContainer, SimpleLineChart, SimpleBarChart } from "../../components/ui/chart-container";
import {
  MapPin,
  Users,
  TrendingUp,
  Building,
  Eye,
  Target,
  Star,
  Navigation,
  Clock,
  BarChart3,
  Sparkles,
  ArrowRight,
  Activity
} from 'lucide-react';

export default function PlacePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className={`flex flex-col space-y-8 transition-all duration-1000 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">
              Location Intelligence Hub
            </h1>
            <p className="text-gray-600 text-lg">Discover insights, optimize locations, and stay ahead of the competition</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/place/new-location"
              className="group relative px-6 py-3 bg-primary text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Analyze New Location
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group transform transition-all duration-500 hover:scale-105">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary rounded-xl text-white shadow-lg">
                  <Eye className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">1,240</div>
                  <div className="text-sm text-green-600 font-medium">↗ +12.7%</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Daily Foot Traffic</h3>
              <p className="text-sm text-gray-500">vs last week</p>
            </div>
          </div>
        </div>

        <div className="group transform transition-all duration-500 hover:scale-105">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary rounded-xl text-white shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">87/100</div>
                  <div className="text-sm text-green-600 font-medium">↗ +8.2%</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Market Potential</h3>
              <p className="text-sm text-gray-500">vs last month</p>
            </div>
          </div>
        </div>

        <div className="group transform transition-all duration-500 hover:scale-105">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary rounded-xl text-white shadow-lg">
                  <Building className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-red-600 font-medium">↘ -3.4%</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Competitor Density</h3>
              <p className="text-sm text-gray-500">vs last quarter</p>
            </div>
          </div>
        </div>

        <div className="group transform transition-all duration-500 hover:scale-105">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary rounded-xl text-white shadow-lg">
                  <Star className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">8.5/10</div>
                  <div className="text-sm text-green-600 font-medium">↗ +0.5</div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Location Score</h3>
              <p className="text-sm text-gray-500">vs last assessment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured: Location Intelligence */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 transform transition-all duration-500 hover:scale-[1.02]">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-3xl"></div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Enhanced Location Intelligence
                </h3>
                <p className="text-gray-600 text-lg">Real-time insights powered by Foursquare API</p>
              </div>
            </div>
            <Link
              href="/place/intelligence"
              className="group/btn relative px-8 py-4 bg-primary text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                <Activity className="h-5 w-5" />
                Explore Intelligence
                <ArrowRight className="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="text-xl font-bold text-primary mb-1">Real-time</div>
              <div className="text-primary-600 font-medium">Foot Traffic Data</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="text-xl font-bold text-primary mb-1">AI-Powered</div>
              <div className="text-primary-600 font-medium">Competitor Analysis</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="text-xl font-bold text-primary mb-1">Event</div>
              <div className="text-primary-600 font-medium">Impact Tracking</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300">
              <div className="text-xl font-bold text-primary mb-1">Demographics</div>
              <div className="text-primary-600 font-medium">Insights</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Location Map */}
        <Link
          href="/place/map"
          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
          onMouseEnter={() => setHoveredCard('map')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-6 mb-6">
              <div className={`h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-all duration-500 ${
                hoveredCard === 'map' ? 'rotate-6 scale-110' : ''
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                  <line x1="8" y1="2" x2="8" y2="18"></line>
                  <line x1="16" y1="6" x2="16" y2="22"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Location Map</h3>
                <p className="text-gray-600">Interactive map of your locations and competitors</p>
              </div>
            </div>
            <div className="flex items-center text-primary font-medium group-hover:text-primary-600 transition-colors">
              <span>Explore Locations</span>
              <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>

        {/* Demographic Analysis */}
        <Link
          href="/place/demographics"
          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
          onMouseEnter={() => setHoveredCard('demographics')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-6 mb-6">
              <div className={`h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-all duration-500 ${
                hoveredCard === 'demographics' ? 'rotate-6 scale-110' : ''
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Demographic Analysis</h3>
                <p className="text-gray-600">Analyze customer demographics by location</p>
              </div>
            </div>
            <div className="flex items-center text-primary font-medium group-hover:text-primary-600 transition-colors">
              <span>View Demographics</span>
              <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>

        {/* Foot Traffic Analysis */}
        <Link
          href="/place/foot-traffic"
          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
          onMouseEnter={() => setHoveredCard('traffic')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative">
            <div className="flex items-center gap-6 mb-6">
              <div className={`h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-all duration-500 ${
                hoveredCard === 'traffic' ? 'rotate-6 scale-110' : ''
              }`}>
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Foot Traffic Analysis</h3>
                <p className="text-gray-600">Track customer traffic patterns</p>
              </div>
            </div>
            <div className="flex items-center text-primary font-medium group-hover:text-primary-600 transition-colors">
              <span>Analyze Traffic</span>
              <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </div>

      {/* Sub-categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Competitor Locations */}
        <Link
          href="/place/competitors"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" x2="19" y1="8" y2="14"></line>
                <line x1="22" x2="16" y1="11" y2="11"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Competitor Locations</h3>
              <p className="text-sm text-gray-500">Map and analyze competitor locations</p>
            </div>
          </div>
        </Link>

        {/* Site Selection */}
        <Link
          href="/place/site-selection"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Site Selection</h3>
              <p className="text-sm text-gray-500">Find and evaluate new potential locations</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Location Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Location Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              💡
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">High Growth Area</h4>
                <span className="text-xs text-gray-500">High Impact</span>
              </div>
              <p className="text-sm text-gray-500">Downtown West location shows 22% growth potential based on new residential developments</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              💡
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Peak Hours Shift</h4>
                <span className="text-xs text-gray-500">Medium Impact</span>
              </div>
              <p className="text-sm text-gray-500">Northside location showing increased lunch traffic (11am-1pm) due to new office complex</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-600">
              ⚠️
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Competitor Alert</h4>
                <span className="text-xs text-gray-500">High Impact</span>
              </div>
              <p className="text-sm text-gray-500">New Mediterranean restaurant opening within 0.5 miles of your Eastside location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
