'use client';

import React from 'react';
import Link from 'next/link';
import OfficialPricingCards from '../../components/subscription/OfficialPricingCards';

export default function PricePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-50 to-neutral-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold text-neutral-900 font-display mb-6">
            Pricing Plans
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            Choose the perfect plan for your restaurant's growth journey
          </p>
          <div className="flex justify-center mb-4">
            <Link
              href="/price/analysis"
              className="btn btn-primary btn-lg"
            >
              Run Price Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <OfficialPricingCards />

      
      {/* Additional Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 font-display mb-4">
              Why Choose BiteBase?
            </h2>
            <p className="text-lg text-neutral-600">
              Get the tools you need to optimize your restaurant's performance
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
