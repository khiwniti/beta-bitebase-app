'use client';

import { useState } from 'react';

export default function ComprehensiveTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState('');

  const API_BASE = 'https://work-2-piugeprtvkeztpmd.prod-runtime.all-hands.dev';

  const testEndpoints = [
    {
      id: 'health',
      name: 'Health Check',
      url: '/api/health',
      method: 'GET',
      description: 'Check API server health and database connectivity',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'mcp-tools',
      name: 'MCP Tools',
      url: '/api/mcp/tools',
      method: 'GET',
      description: 'List all available MCP tools and servers',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'restaurant-search',
      name: 'Restaurant Search',
      url: '/api/restaurants/search?cuisine=Italian&limit=3',
      method: 'GET',
      description: 'Search restaurants with comprehensive mock data',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'restaurant-details',
      name: 'Restaurant Details',
      url: '/api/restaurants/bella-italia-silom',
      method: 'GET',
      description: 'Get detailed restaurant information',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 'restaurant-analytics',
      name: 'Restaurant Analytics',
      url: '/api/restaurants/bella-italia-silom/analytics',
      method: 'GET',
      description: 'Get restaurant analytics and insights',
      color: 'bg-cyan-600 hover:bg-cyan-700'
    },
    {
      id: 'market-analysis',
      name: 'Market Analysis',
      url: '/api/market/analysis',
      method: 'GET',
      description: 'Get comprehensive market analysis data',
      color: 'bg-teal-600 hover:bg-teal-700'
    },
    {
      id: 'search-filters',
      name: 'Search with Filters',
      url: '/api/restaurants/search?cuisine=Japanese&priceRange=4&rating=4.5&features=delivery',
      method: 'GET',
      description: 'Test advanced filtering capabilities',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'ai-chat',
      name: 'AI Assistant',
      url: '/api/ai/chat',
      method: 'POST',
      body: { message: 'Recommend a good Italian restaurant', context: 'restaurant_search' },
      description: 'Test AI-powered restaurant recommendations',
      color: 'bg-pink-600 hover:bg-pink-700'
    }
  ];

  const testEndpoint = async (endpoint: typeof testEndpoints[0]) => {
    setLoading(prev => ({ ...prev, [endpoint.id]: true }));
    setError(null);
    
    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }
      
      const response = await fetch(`${API_BASE}${endpoint.url}`, options);
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
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const testAIChat = async () => {
    if (!aiMessage.trim()) return;
    
    setLoading(prev => ({ ...prev, 'ai-custom': true }));
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: aiMessage, 
          context: 'custom_test',
          userId: 'test-user'
        }),
      });
      
      const data = await response.json();
      setResults(prev => ({ ...prev, 'ai-custom': data }));
    } catch (err) {
      setError(`AI Chat failed: ${err}`);
    } finally {
      setLoading(prev => ({ ...prev, 'ai-custom': false }));
    }
  };

  const formatJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const getDataSource = (data: any) => {
    if (data?.source) return data.source;
    if (data?.bitebaseEnhancements?.dataSource) return data.bitebaseEnhancements.dataSource;
    return 'unknown';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 BiteBase Comprehensive Testing Dashboard</h1>
          <p className="text-gray-300 text-lg">Testing all features with realistic mock data and AI assistant</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={testAllEndpoints}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              🚀 Test All Features
            </button>
          </div>
        </div>

        {/* AI Chat Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">🤖 AI Assistant Testing</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Ask the AI assistant anything about restaurants..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-pink-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && testAIChat()}
            />
            <button
              onClick={testAIChat}
              disabled={loading['ai-custom'] || !aiMessage.trim()}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading['ai-custom'] ? '⏳ Thinking...' : '💬 Ask AI'}
            </button>
          </div>
          
          {/* AI Response */}
          {results['ai-custom'] && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-pink-300 mb-2">AI Response:</h3>
              <div className="text-gray-100 mb-3 whitespace-pre-wrap">
                {results['ai-custom'].data?.response}
              </div>
              {results['ai-custom'].data?.suggestions && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Suggestions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {results['ai-custom'].data.suggestions.map((suggestion: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setAiMessage(suggestion)}
                        className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-xs text-gray-400">
                Intent: {results['ai-custom'].data?.intent} | 
                Source: {getDataSource(results['ai-custom'])}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Test Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Results Grid */}
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
                      getDataSource(result) === 'mock-data-comprehensive' ? 'bg-green-900 text-green-200' :
                      getDataSource(result) === 'wongnai-real-data' ? 'bg-blue-900 text-blue-200' :
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
                    {result.data && (
                      <div className="bg-gray-700 rounded p-3">
                        <h4 className="font-semibold text-green-400 mb-2">📊 Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {/* Restaurant Search Results */}
                          {result.data.length !== undefined && (
                            <>
                              <div>Results: {result.data.length}</div>
                              <div>Page: {result.pagination?.page || 1}</div>
                            </>
                          )}
                          
                          {/* Market Analysis */}
                          {result.data.overview && (
                            <>
                              <div>Restaurants: {result.data.overview.totalRestaurants}</div>
                              <div>Avg Rating: {result.data.overview.averageRating}⭐</div>
                            </>
                          )}
                          
                          {/* Restaurant Details */}
                          {result.data.name && (
                            <>
                              <div>Name: {result.data.name}</div>
                              <div>Rating: {result.data.rating}⭐</div>
                            </>
                          )}
                          
                          {/* Analytics */}
                          {result.data.analytics && (
                            <>
                              <div>Monthly Visitors: {result.data.analytics.monthlyVisitors}</div>
                              <div>Avg Order: ฿{result.data.analytics.averageOrderValue}</div>
                            </>
                          )}
                          
                          {/* Health Check */}
                          {result.success !== undefined && (
                            <>
                              <div>Status: {result.success ? '✅ OK' : '❌ Error'}</div>
                              <div>Database: {result.data?.database?.connected ? '✅' : '❌'}</div>
                            </>
                          )}
                          
                          {/* MCP Tools */}
                          {result.data?.servers && (
                            <>
                              <div>Servers: {result.data.servers.length}</div>
                              <div>Tools: {result.data.totalTools}</div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Raw JSON */}
                    <details className="bg-gray-700 rounded">
                      <summary className="p-3 cursor-pointer font-semibold text-gray-300 hover:text-white">
                        📄 Raw JSON Response
                      </summary>
                      <pre className="p-3 text-xs overflow-auto max-h-96 bg-gray-900 rounded-b">
                        {formatJson(result)}
                      </pre>
                    </details>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Click the button above to test this endpoint
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature Status */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-400">🎯 Feature Testing Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-900 rounded p-4">
              <h3 className="font-semibold text-green-200 mb-2">✅ Mock Data System</h3>
              <p className="text-green-100 text-sm">
                Comprehensive mock data with 5 realistic restaurants, full analytics, and AI integration
              </p>
            </div>
            <div className="bg-blue-900 rounded p-4">
              <h3 className="font-semibold text-blue-200 mb-2">🤖 AI Assistant</h3>
              <p className="text-blue-100 text-sm">
                Intelligent restaurant recommendations with context-aware responses and suggestions
              </p>
            </div>
            <div className="bg-purple-900 rounded p-4">
              <h3 className="font-semibold text-purple-200 mb-2">📊 Analytics & Insights</h3>
              <p className="text-purple-100 text-sm">
                Market analysis, restaurant analytics, and business intelligence features
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}