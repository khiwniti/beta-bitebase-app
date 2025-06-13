'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [toolsData, setToolsData] = useState<any>(null);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'https://work-2-piugeprtvkeztpmd.prod-runtime.all-hands.dev';

  const testHealthEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setError(`Health check failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testMCPTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/mcp/tools`);
      const data = await response.json();
      setToolsData(data);
    } catch (err) {
      setError(`MCP tools failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testRestaurantSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/restaurants/search?location=New York&cuisine=Italian&limit=3`);
      const data = await response.json();
      setRestaurantData(data);
    } catch (err) {
      setError(`Restaurant search failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🧪 MCP API Testing Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={testHealthEndpoint}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '⏳ Testing...' : '🏥 Test Health'}
          </button>
          
          <button
            onClick={testMCPTools}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '⏳ Testing...' : '🛠️ Test MCP Tools'}
          </button>
          
          <button
            onClick={testRestaurantSearch}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? '⏳ Testing...' : '🔍 Test Restaurant Search'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Check Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-400">🏥 Health Check</h2>
            {healthData ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={healthData.success ? 'text-green-400' : 'text-red-400'}>
                    {healthData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="text-blue-400">{healthData.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>MCP Enabled:</span>
                  <span className={healthData.mcp?.enabled ? 'text-green-400' : 'text-red-400'}>
                    {healthData.mcp?.enabled ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>MCP Servers:</span>
                  <span className="text-yellow-400">{healthData.mcp?.servers}</span>
                </div>
                <div className="flex justify-between">
                  <span>MCP Tools:</span>
                  <span className="text-yellow-400">{healthData.mcp?.tools}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Click "Test Health" to check API status</p>
            )}
          </div>

          {/* MCP Tools Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">🛠️ MCP Tools</h2>
            {toolsData ? (
              <div className="space-y-3">
                <div className="text-sm">
                  <strong>Total Tools:</strong> {toolsData.data?.meta?.totalTools}
                </div>
                <div className="text-sm">
                  <strong>Active Servers:</strong> {toolsData.data?.meta?.activeServers}
                </div>
                <div className="space-y-1">
                  <strong className="text-sm">Available Tools:</strong>
                  {toolsData.data?.tools?.slice(0, 3).map((tool: any, index: number) => (
                    <div key={index} className="text-xs bg-gray-700 p-2 rounded">
                      <div className="font-semibold text-green-400">{tool.name}</div>
                      <div className="text-gray-300">{tool.description}</div>
                      <div className="text-blue-400">Server: {tool.server}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Click "Test MCP Tools" to see available tools</p>
            )}
          </div>

          {/* Restaurant Search Results */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">🔍 Restaurant Search</h2>
            {restaurantData ? (
              <div className="space-y-3">
                <div className="text-sm">
                  <strong>Found:</strong> {restaurantData.data?.total} restaurants
                </div>
                <div className="text-sm">
                  <strong>Location:</strong> {restaurantData.data?.location}
                </div>
                <div className="space-y-2">
                  {restaurantData.data?.restaurants?.map((restaurant: any, index: number) => (
                    <div key={index} className="text-xs bg-gray-700 p-2 rounded">
                      <div className="font-semibold text-yellow-400">{restaurant.name}</div>
                      <div className="text-gray-300">{restaurant.cuisine} • {restaurant.priceRange}</div>
                      <div className="text-green-400">⭐ {restaurant.rating}</div>
                      <div className="text-blue-400">{restaurant.address?.street}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-400">
                  Via: {restaurantData.data?.meta?.via}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Click "Test Restaurant Search" to find restaurants</p>
            )}
          </div>
        </div>

        {/* Raw JSON Display */}
        {(healthData || toolsData || restaurantData) && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">📄 Raw API Response</h2>
            <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(
                {
                  health: healthData,
                  tools: toolsData,
                  restaurants: restaurantData
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}