"use client";

import AdminTabs from "../../../components/admin/AdminTabs";

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor platform performance and user engagement</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500">Advanced analytics features coming soon</p>
        </div>
      </div>
    </div>
  );
}