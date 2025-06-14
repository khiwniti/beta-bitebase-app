'use client';

import { useState, useEffect } from 'react';
import { testApiConnection, searchRestaurants, getAnalyticsDashboard, initializeDatabase } from '../../lib/api';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await testFunction();
      setResults((prev: any) => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error: any) {
      setResults((prev: any) => ({ ...prev, [testName]: { success: false, error: error.message } }));
    }
    setLoading(false);
  };

  const runAllTests = async () => {
    setResults({});
    setLoading(true);

    // Test API connection
    await runTest('connection', testApiConnection);

    // Test restaurant search
    await runTest('search', () => searchRestaurants({ limit: 5 }));

    // Test analytics
    await runTest('analytics', () => getAnalyticsDashboard());

    // Test search with filters
    await runTest('searchFiltered', () => searchRestaurants({ 
      cuisine: 'Italian', 
      limit: 3 
    }));

    setLoading(false);
  };

  const initDb = async () => {
    await runTest('initDatabase', initializeDatabase);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-base font-bold mb-8">BiteBase API Integration Test</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run All API Tests'}
        </button>
        
        <button
          onClick={initDb}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          Initialize Database
        </button>
      </div>

      <div className="grid gap-6">
        {Object.entries(results).map(([testName, result]: [string, any]) => (
          <div key={testName} className="border rounded-lg p-4">
            <h3 className="text-base font-semibold mb-2 flex items-center">
              {result.success ? '✅' : '❌'} {testName}
            </h3>
            
            {result.success ? (
              <div className="bg-green-50 p-3 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 p-3 rounded">
                <p className="text-red-600">Error: {result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">API Configuration</h3>
        <p>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.bitebase.app'}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}