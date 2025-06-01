"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import BiteBaseLogo from '../../components/BiteBaseLogo';
import { Button } from "@bitebase/ui";

export default function DemoPortalPage() {
  const router = useRouter();

  const handleDemoAccess = () => {
    router.push('/demo-login');
  };

  const handleBackToAuth = () => {
    router.push('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-teal-400/5 to-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Demo Portal Content */}
      <div className="max-w-2xl mx-auto text-center px-6 relative z-10">
        {/* Logo */}
        <div className="mb-12">
          <BiteBaseLogo size="xl" variant="gradient" animated={true} />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          BiteBase Demo Portal
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          Experience the power of restaurant intelligence with our interactive demonstration
        </p>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Live sales data and performance metrics</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Location Intelligence</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">AI-powered geospatial market analysis</p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Insights</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">AI-driven recommendations and strategies</p>
          </div>
        </div>

        {/* Demo Access Button */}
        <div className="space-y-4">
          <Button
            onClick={handleDemoAccess}
            className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Launch Interactive Demo
          </Button>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No registration required • Full feature access • Sample data included
          </p>
        </div>

        {/* Back to Auth Link */}
        <div className="mt-12">
          <button
            onClick={handleBackToAuth}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-200"
          >
            ← Back to Authentication
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2025 BiteBase Intelligence - Restaurant Market Analysis Platform</p>
      </div>
    </div>
  );
}