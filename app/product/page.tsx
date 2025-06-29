'use client';

import React from 'react';
import Link from 'next/link';

export default function ProductPage() {
  return (
    <div>
      <div className="flex flex-col space-y-8">
      {/* Action Button */}
      <div className="flex justify-end mb-4">
        <Link
          href="/product/new"
          className="btn-primary px-4 py-2 rounded-md"
        >
          Add New Item
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Management Dashboard */}
        <Link
          href="/product/management"
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
              <h3 className="text-lg font-medium">Product Dashboard</h3>
              <p className="text-sm text-gray-500">Complete product management dashboard</p>
            </div>
          </div>
        </Link>

        {/* Menu Categories */}
        <Link
          href="/product/category"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Menu Categories</h3>
              <p className="text-sm text-gray-500">Organize and manage your menu categories</p>
            </div>
          </div>
        </Link>

        {/* Menu Performance */}
        <Link
          href="/product/performance"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Menu Performance</h3>
              <p className="text-sm text-gray-500">Analyze sales and popularity of menu items</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Sub-categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingredient Analysis */}
        <Link
          href="/product/ingredients"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v7.31"></path>
                <path d="M14 9.3V1.99"></path>
                <path d="M8.5 2h7"></path>
                <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                <path d="M5.58 16.5h12.85"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Ingredient Analysis</h3>
              <p className="text-sm text-gray-500">Track ingredient costs and availability</p>
            </div>
          </div>
        </Link>

        {/* Seasonal Menu Planning */}
        <Link
          href="/product/seasonal"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">Seasonal Menu Planning</h3>
              <p className="text-sm text-gray-500">Plan seasonal menus and special offerings</p>
            </div>
          </div>
        </Link>

        {/* POS Integration */}
        <Link
          href="/settings/pos-integration"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-200 hover:border-primary"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path>
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <line x1="8" y1="15" x2="8" y2="15"></line>
                <line x1="12" y1="15" x2="12" y2="15"></line>
                <line x1="16" y1="15" x2="16" y2="15"></line>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">POS Integration</h3>
              <p className="text-sm text-gray-500">Connect and sync with your Point of Sale system</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Recent Menu Changes</h3>
        <div className="space-y-4">
          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              ✓
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">New Item Added</h4>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-sm text-gray-500">Added "Mediterranean Salad" to Appetizers</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3 text-primary">
              ↑
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Price Updated</h4>
                <span className="text-xs text-gray-500">5 days ago</span>
              </div>
              <p className="text-sm text-gray-500">Updated price of "Grilled Salmon" from $18.99 to $21.99</p>
            </div>
          </div>

          <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-600">
              ⚠️
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">Ingredient Alert</h4>
                <span className="text-xs text-gray-500">1 week ago</span>
              </div>
              <p className="text-sm text-gray-500">Avocado prices increased by 15% - affects 3 menu items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
