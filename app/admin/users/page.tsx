"use client";

import AdminTabs from "../../../components/admin/AdminTabs";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTabs />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, subscriptions, and permissions</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">User Management System</h3>
          <p className="text-gray-500">Advanced user management features coming soon</p>
        </div>
      </div>
    </div>
  );
}