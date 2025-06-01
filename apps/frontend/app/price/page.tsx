'use client';

import React from 'react';
import Link from 'next/link';

export default function PricePage() {
  return (
    <div>
      <div className="flex flex-col space-y-8">
      {/* Action Button */}
      <div className="flex justify-end mb-4">
        <Link
          href="/price/analysis"
          className="btn-primary px-4 py-2 rounded-md"
        >
          Run Price Analysis
        </Link>
      </div>

      {/* Price Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Check */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Check</p>
              <h3 className="text-2xl font-bold mt-1">$28.50</h3>
              <p className="text-sm mt-2 flex items-center text-primary">
                ↑ 5.1% vs last year
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              🧾
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Target: $30.00</span>
            <span>70% Complete</span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Profit Margin</p>
              <h3 className="text-2xl font-bold mt-1">22.4%</h3>
              <p className="text-sm mt-2 flex items-center text-primary">
                ↑ 1.2% vs last quarter
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              📈
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Target: 25%</span>
            <span>75% Complete</span>
          </div>
        </div>

        {/* Price Elasticity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Price Elasticity</p>
              <h3 className="text-2xl font-bold mt-1">Medium</h3>
              <p className="text-sm mt-2 flex items-center text-amber-600">
                ↔ Stable vs last quarter
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              ⚖️
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Inelastic</span>
            <span>Elastic</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price Strategy Dashboard */}
        <Link
          href="/price/strategy"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Price Strategy Dashboard</h3>
              <p className="text-sm text-gray-500">Complete pricing management dashboard</p>
            </div>
          </div>
        </Link>

        {/* Price Optimization */}
        <Link
          href="/price/optimization"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20h.01"></path>
                <path d="M7 20v-4"></path>
                <path d="M12 20v-8"></path>
                <path d="M17 20v-6"></path>
                <path d="M22 20V8"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Price Optimization</h3>
              <p className="text-sm text-gray-500">Optimize prices based on demand and costs</p>
            </div>
          </div>
        </Link>

        {/* Competitor Pricing */}
        <Link
          href="/price/competitors"
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
              <h3 className="text-lg font-medium">Competitor Pricing</h3>
              <p className="text-sm text-gray-500">Compare your prices with competitors</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Sub-categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pricing Models */}
        <Link
          href="/price/models"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <line x1="12" y1="22" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Pricing Models</h3>
              <p className="text-sm text-gray-500">Explore different pricing strategies</p>
            </div>
          </div>
        </Link>

        {/* Cost Analysis */}
        <Link
          href="/price/costs"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Cost Analysis</h3>
              <p className="text-sm text-gray-500">Track costs and calculate margins</p>
            </div>
          </div>
        </Link>

        {/* Special Offers */}
        <Link
          href="/price/special-offers"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Special Offers</h3>
              <p className="text-sm text-gray-500">Manage discounts and promotions</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Price Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Price Recommendations</h3>
        <div className="space-y-4">
          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              💡
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Premium Pricing Opportunity</h4>
                <span className="text-xs text-gray-500">High Impact</span>
              </div>
              <p className="text-sm text-gray-500">Increase prices for signature dishes by 8-10% based on competitor analysis</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              💡
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Bundle Opportunity</h4>
                <span className="text-xs text-gray-500">Medium Impact</span>
              </div>
              <p className="text-sm text-gray-500">Create appetizer + entrée bundles to increase average check size</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-600">
              ⚠️
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Price Adjustment Needed</h4>
                <span className="text-xs text-gray-500">High Impact</span>
              </div>
              <p className="text-sm text-gray-500">Seafood dishes are priced 12% below market rate - consider adjusting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
