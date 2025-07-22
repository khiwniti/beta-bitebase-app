"use client";

import AdminTabs from "../../../components/admin/AdminTabs";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Admin Settings</h3>
          <p className="text-gray-500">Advanced settings panel coming soon</p>
        </div>
      </div>
    </div>
  );
}