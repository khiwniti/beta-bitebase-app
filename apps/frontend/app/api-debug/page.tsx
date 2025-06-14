"use client"

import React, { useState } from 'react';

export default function ApiDebugPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://work-2-rglykkquxarpgyuq.prod-runtime.all-hands.dev';
      const url = `${backendUrl}/restaurants/search`;
      
      console.log('🌐 Testing direct API call to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        setError(`HTTP ${response.status}: ${data.message || response.statusText}`);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Direct API Test</h2>
        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test /restaurants/search'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Success:</h3>
          <pre className="text-sm text-green-700 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}