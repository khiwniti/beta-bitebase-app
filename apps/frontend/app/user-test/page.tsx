'use client';

import { useState } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: User;
    users?: User[];
    session?: {
      token: string;
      expires_at: string;
    };
  };
  error?: string;
}

export default function UserTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    email: 'test.user@bitebase.app',
    password: 'testpassword123',
    first_name: 'Test',
    last_name: 'User'
  });

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.bitebase.app';

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [testName]: result }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testGetUsers = async () => {
    const response = await fetch(`${API_BASE}/users`);
    return await response.json();
  };

  const testCreateUser = async () => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return await response.json();
  };

  const testLoginUser = async () => {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });
    return await response.json();
  };

  const testGetUserById = async () => {
    // First get a user ID from the users list
    const usersResponse = await fetch(`${API_BASE}/users`);
    const usersData = await usersResponse.json();
    
    if (usersData.success && usersData.data.users.length > 0) {
      const userId = usersData.data.users[0].id;
      const response = await fetch(`${API_BASE}/users/${userId}`);
      return await response.json();
    }
    
    return { error: 'No users found to test with' };
  };

  const testHealthCheck = async () => {
    const response = await fetch(`${API_BASE}/health`);
    return await response.json();
  };

  const renderResult = (testName: string) => {
    const result = results[testName];
    const isLoading = loading[testName];

    if (isLoading) {
      return <div className="text-blue-600">Loading...</div>;
    }

    if (!result) {
      return <div className="text-gray-500">Not tested yet</div>;
    }

    const isSuccess = result.success === true;
    const hasError = result.error || result.success === false;

    return (
      <div className={`p-3 rounded-lg ${
        isSuccess ? 'bg-green-50 border border-green-200' : 
        hasError ? 'bg-red-50 border border-red-200' : 
        'bg-gray-50 border border-gray-200'
      }`}>
        <pre className="text-sm overflow-auto max-h-40">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-base font-bold text-gray-900 mb-8">
            🧪 User Management API Test Suite
          </h1>

          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-base font-semibold mb-4">Test Configuration</h2>
            <p className="text-sm text-gray-600 mb-4">
              API Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE}</code>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Check Test */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">🏥 Health Check</h3>
                <button
                  onClick={() => runTest('health', testHealthCheck)}
                  disabled={loading.health}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              {renderResult('health')}
            </div>

            {/* Get Users Test */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">👥 Get All Users</h3>
                <button
                  onClick={() => runTest('getUsers', testGetUsers)}
                  disabled={loading.getUsers}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              {renderResult('getUsers')}
            </div>

            {/* Create User Test */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">➕ Create User</h3>
                <button
                  onClick={() => runTest('createUser', testCreateUser)}
                  disabled={loading.createUser}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              {renderResult('createUser')}
            </div>

            {/* Login User Test */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">🔐 User Login</h3>
                <button
                  onClick={() => runTest('loginUser', testLoginUser)}
                  disabled={loading.loginUser}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              {renderResult('loginUser')}
            </div>

            {/* Get User by ID Test */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">🔍 Get User by ID</h3>
                <button
                  onClick={() => runTest('getUserById', testGetUserById)}
                  disabled={loading.getUserById}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              {renderResult('getUserById')}
            </div>

            {/* Run All Tests */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">🚀 Run All Tests</h3>
                <button
                  onClick={async () => {
                    await runTest('health', testHealthCheck);
                    await runTest('getUsers', testGetUsers);
                    await runTest('getUserById', testGetUserById);
                    // Note: Create and Login tests might fail if user already exists
                  }}
                  disabled={Object.values(loading).some(Boolean)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Run All
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Runs health check, get users, and get user by ID tests.
                Create/Login tests should be run manually to avoid conflicts.
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-base font-semibold mb-2">📝 Test Notes</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <strong>Health Check</strong>: Verifies API connectivity and database status</li>
              <li>• <strong>Get Users</strong>: Lists all users with pagination</li>
              <li>• <strong>Create User</strong>: Creates a new user (may fail if email exists)</li>
              <li>• <strong>User Login</strong>: Authenticates user and returns session token</li>
              <li>• <strong>Get User by ID</strong>: Retrieves specific user details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}