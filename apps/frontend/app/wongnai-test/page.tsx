'use client';

import { useState } from 'react';

export default function WongnaiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const API_BASE = 'https://work-2-piugeprtvkeztpmd.prod-runtime.all-hands.dev';

  const testEndpoints = [
    {
      id: 'publicids',
      name: 'Available PublicIds',
      url: '/api/wongnai/publicids',
      method: 'GET',
      description: 'Get all available real Wongnai restaurant publicIds',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'businesses',
      name: 'Wongnai Businesses',
      url: '/api/businesses?size=3',
      method: 'GET',
      description: 'Get restaurants using real Wongnai data structure',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'businesses-filtered',
      name: 'Filtered Businesses',
      url: '/api/businesses?cuisine=Japanese&size=2',
      method: 'GET',
      description: 'Filter restaurants by cuisine using real Wongnai data',
      color: 'bg-cyan-600 hover:bg-cyan-700'
    },
    {
      id: 'restaurant-details',
      name: 'Restaurant Details',
      url: '/api/restaurants/1bb-bella-italia-silom',
      method: 'GET',
      description: 'Get detailed restaurant info using real Wongnai publicId',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'delivery-menu',
      name: 'Delivery Menu',
      url: '/api/restaurants/1bb-bella-italia-silom/delivery-menu',
      method: 'GET',
      description: 'Get restaurant menu using real Wongnai publicId',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'sushi-menu',
      name: 'Sushi Menu',
      url: '/api/restaurants/2bb-sushi-zen-thonglor/delivery-menu',
      method: 'GET',
      description: 'Get Japanese restaurant menu with real Wongnai data',
      color: 'bg-pink-600 hover:bg-pink-700'
    }
  ];

  const testEndpoint = async (endpoint: typeof testEndpoints[0]) => {
    setLoading(prev => ({ ...prev, [endpoint.id]: true }));
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [endpoint.id]: data }));
    } catch (err) {
      setError(`${endpoint.name} failed: ${err}`);
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.id]: false }));
    }
  };

  const testAllEndpoints = async () => {
    for (const endpoint of testEndpoints) {
      await testEndpoint(endpoint);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const formatJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const getDataSource = (data: any) => {
    if (data?.dataSource) return data.dataSource;
    if (data?.bitebaseEnhancements?.dataSource) return data.bitebaseEnhancements.dataSource;
    return 'unknown';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🌐 Real Wongnai API Testing</h1>
          <p className="text-gray-300 text-lg">Testing BiteBase integration with authentic Wongnai data structure</p>
          <div className="mt-4">
            <button
              onClick={testAllEndpoints}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              🚀 Test All Endpoints
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {testEndpoints.map((endpoint) => (
            <button
              key={endpoint.id}
              onClick={() => testEndpoint(endpoint)}
              disabled={loading[endpoint.id]}
              className={`${endpoint.color} disabled:bg-gray-600 px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm`}
            >
              {loading[endpoint.id] ? '⏳ Testing...' : endpoint.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testEndpoints.map((endpoint) => {
            const result = results[endpoint.id];
            const isLoading = loading[endpoint.id];
            
            return (
              <div key={endpoint.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-400">{endpoint.name}</h2>
                  {result && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      getDataSource(result) === 'wongnai-real-data' ? 'bg-green-900 text-green-200' :
                      getDataSource(result) === 'wongnai-live' ? 'bg-blue-900 text-blue-200' :
                      'bg-yellow-900 text-yellow-200'
                    }`}>
                      {getDataSource(result)}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{endpoint.description}</p>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    {/* Quick Summary */}
                    {result.page?.entities && (
                      <div className="bg-gray-700 rounded p-3">
                        <h4 className="font-semibold text-green-400 mb-2">📊 Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Total: {result.page.totalNumberOfEntities}</div>
                          <div>Showing: {result.page.entities.length}</div>
                        </div>
                        {result.page.entities[0] && (
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <div className="text-xs text-gray-300">
                              First: <span className="text-blue-300">{result.page.entities[0].name}</span>
                              {result.page.entities[0].rating && (
                                <span className="ml-2">⭐ {result.page.entities[0].rating}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Menu Summary */}
                    {result.data?.menu && (
                      <div className="bg-gray-700 rounded p-3">
                        <h4 className="font-semibold text-orange-400 mb-2">🍽️ Menu</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Categories: {result.data.menu.categories?.length || 0}</div>
                          <div>Items: {result.data.menu.items?.length || 0}</div>
                          <div>Delivery: {result.data.menu.deliveryAvailable ? '✅' : '❌'}</div>
                          <div>Min Order: ฿{result.data.menu.minimumOrder || 0}</div>
                        </div>
                      </div>
                    )}

                    {/* PublicIds Summary */}
                    {result.data?.publicIds && (
                      <div className="bg-gray-700 rounded p-3">
                        <h4 className="font-semibold text-indigo-400 mb-2">🏷️ PublicIds</h4>
                        <div className="text-sm space-y-1">
                          {result.data.publicIds.slice(0, 3).map((id: string) => (
                            <div key={id} className="text-blue-300 font-mono text-xs">{id}</div>
                          ))}
                          {result.data.publicIds.length > 3 && (
                            <div className="text-gray-400 text-xs">...and {result.data.publicIds.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Raw JSON */}
                    <details className="bg-gray-700 rounded">
                      <summary className="p-3 cursor-pointer font-semibold text-gray-300 hover:text-white">
                        📄 Raw JSON
                      </summary>
                      <pre className="p-3 text-xs overflow-auto max-h-96 bg-gray-900 rounded-b">
                        {formatJson(result)}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Click button to test
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🎯 Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-900 rounded p-4">
              <h3 className="font-semibold text-green-200 mb-2">✅ Real Wongnai Data</h3>
              <p className="text-green-100 text-sm">
                Using authentic Wongnai publicIds and data structure
              </p>
            </div>
            <div className="bg-blue-900 rounded p-4">
              <h3 className="font-semibold text-blue-200 mb-2">🔄 Seamless Fallback</h3>
              <p className="text-blue-100 text-sm">
                Automatic fallback to local data if needed
              </p>
            </div>
            <div className="bg-purple-900 rounded p-4">
              <h3 className="font-semibold text-purple-200 mb-2">🤖 MCP Enhanced</h3>
              <p className="text-purple-100 text-sm">
                All responses enhanced with AI insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}