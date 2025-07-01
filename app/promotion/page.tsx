'use client';

import React from 'react';
import Link from 'next/link';

export default function PromotionPage() {
  return (
      <div className="flex flex-col space-y-8">
      {/* Action Button */}
      <div className="flex justify-end">
        <Link
          href="/promotion/campaign"
          className="btn-primary px-4 py-2 rounded-md"
        >
          Create Campaign
        </Link>
      </div>

      {/* Promotion Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
              <h3 className="text-2xl font-bold mt-1">4</h3>
              <p className="text-sm mt-2 flex items-center text-primary">
                ↑ 1 vs last month
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              📣
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Summer Special</span>
              <span className="text-primary">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Happy Hour</span>
              <span className="text-primary">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Loyalty Program</span>
              <span className="text-primary">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Email Newsletter</span>
              <span className="text-primary">Active</span>
            </div>
          </div>
        </div>

        {/* Marketing ROI */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Marketing ROI</p>
              <h3 className="text-2xl font-bold mt-1">3.2x</h3>
              <p className="text-sm mt-2 flex items-center text-primary">
                ↑ 0.4x vs last quarter
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
            <span>Target: 4.0x</span>
            <span>75% Complete</span>
          </div>
        </div>

        {/* Customer Acquisition Cost */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Acquisition</p>
              <h3 className="text-2xl font-bold mt-1">$18.50</h3>
              <p className="text-sm mt-2 flex items-center text-primary">
                ↓ $2.30 vs last quarter
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              👤
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Target: $15.00</span>
            <span>65% Complete</span>
          </div>
        </div>
        </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Campaign Management */}
        <Link
          href="/promotion/campaign"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 4v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12z"></path>
                <path d="M3 6v12"></path>
                <path d="M15 10h-6"></path>
                <path d="M15 14h-6"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Campaign Management</h3>
              <p className="text-sm text-gray-500">Create and manage marketing campaigns</p>
            </div>
          </div>
        </Link>

        {/* Social Media */}
        <Link
          href="/promotion/social-media"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Social Media</h3>
              <p className="text-sm text-gray-500">Manage social media marketing</p>
            </div>
          </div>
        </Link>

        {/* Loyalty Program */}
        <Link
          href="/promotion/loyalty"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Loyalty Program</h3>
              <p className="text-sm text-gray-500">Manage customer loyalty programs</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Sub-categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Marketing */}
        <Link
          href="/promotion/email"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Email Marketing</h3>
              <p className="text-sm text-gray-500">Create and manage email campaigns</p>
            </div>
          </div>
        </Link>

        {/* Local Advertising */}
        <Link
          href="/promotion/advertising"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Local Advertising</h3>
              <p className="text-sm text-gray-500">Manage local advertising campaigns</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Campaign Performance</h3>
        <div className="space-y-4">
          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              🏆
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Summer Special</h4>
                <span className="text-xs text-primary">High Performance</span>
              </div>
              <p className="text-sm text-gray-500">28% conversion rate, $4.2 ROI - Performing above target</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              ✓
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Happy Hour</h4>
                <span className="text-xs text-primary">Meeting Target</span>
              </div>
              <p className="text-sm text-gray-500">18% conversion rate, $3.1 ROI - Meeting expectations</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-600">
              ⚠️
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Email Newsletter</h4>
                <span className="text-xs text-amber-600">Needs Improvement</span>
              </div>
              <p className="text-sm text-gray-500">12% conversion rate, $1.8 ROI - Below target by 15%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
