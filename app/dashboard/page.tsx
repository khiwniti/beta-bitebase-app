"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  BarChart2,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Target,
  Utensils,
  MessageCircle,
  Brain,
  Zap,
  Globe,
  Shield,
  Activity,
  Database,
  Smartphone,
  RefreshCw
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import ConversationalAnalytics from "../../components/ai/ConversationalAnalytics"
import { getAPIClient } from "../../lib/production-api-client"

// Mobile-first responsive dashboard following IMPROVEMENTS.md Phase 1 requirements
export default function ProductionDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')
  const [backendHealth, setBackendHealth] = useState<any>(null)
  const [aiStatus, setAiStatus] = useState<any>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [insights, setInsights] = useState<any[]>([])
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)

  const apiClient = getAPIClient()

  // Real-time connection monitoring
  const checkConnection = useCallback(async () => {
    setConnectionStatus('checking')
    try {
      const isConnected = await apiClient.testConnection()
      setConnectionStatus(isConnected ? 'connected' : 'disconnected')
      
      if (isConnected) {
        const [health, ai] = await Promise.all([
          apiClient.healthCheck(),
          apiClient.getAIStatus()
        ])
        setBackendHealth(health)
        setAiStatus(ai)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Connection check failed:', error)
      setConnectionStatus('disconnected')
    }
  }, [apiClient])

  // Get user location for location-based features
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [])

  // Initial connection check and periodic updates
  useEffect(() => {
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [checkConnection])

  // Handle AI insights from conversational analytics
  const handleInsightGenerated = useCallback((insight: any) => {
    setInsights(prev => [insight, ...prev].slice(0, 10)) // Keep last 10 insights
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
      case 'operational':
        return 'text-green-600 bg-green-100'
      case 'disconnected':
      case 'unhealthy':
      case 'unavailable':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 md:bg-white">
      {/* Mobile-first header */}
      <div className="bg-white border-b px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Restaurant Intelligence
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered business insights
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              className={`text-xs ${getStatusColor(connectionStatus)}`}
              variant="secondary"
            >
              <Activity className="w-3 h-3 mr-1" />
              {connectionStatus === 'connected' ? 'Online' : 
               connectionStatus === 'disconnected' ? 'Offline' : 'Checking...'}
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkConnection}
              disabled={connectionStatus === 'checking'}
            >
              <RefreshCw className={`w-4 h-4 ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* System Status Cards - Mobile optimized */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Backend Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-sm">Backend</span>
                </div>
                <Badge 
                  className={`text-xs ${getStatusColor(backendHealth?.status || 'checking')}`}
                  variant="secondary"
                >
                  {backendHealth?.status || 'Checking...'}
                </Badge>
              </div>
              {backendHealth && (
                <div className="mt-2 text-xs text-gray-600">
                  <div>Version: {backendHealth.version}</div>
                  <div>Environment: {backendHealth.environment}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-sm">AI Models</span>
                </div>
                <Badge 
                  className={`text-xs ${getStatusColor(aiStatus?.status || 'checking')}`}
                  variant="secondary"
                >
                  {aiStatus?.status || 'Checking...'}
                </Badge>
              </div>
              {aiStatus?.models && (
                <div className="mt-2 text-xs text-gray-600">
                  <div>Chat: {aiStatus.models.chat?.split('.')[1] || 'N/A'}</div>
                  <div>Reasoning: {aiStatus.models.reasoning?.split('.')[1] || 'N/A'}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-sm">Location</span>
                </div>
                <Badge 
                  className={`text-xs ${userLocation ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'}`}
                  variant="secondary"
                >
                  {userLocation ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              {userLocation && (
                <div className="mt-2 text-xs text-gray-600">
                  <div>Lat: {userLocation.latitude.toFixed(4)}</div>
                  <div>Lng: {userLocation.longitude.toFixed(4)}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Mobile responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              <BarChart2 className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="text-xs md:text-sm">
              <MessageCircle className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              <TrendingUp className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="text-xs md:text-sm hidden md:flex">
              <Globe className="w-4 h-4 mr-2" />
              Map
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs md:text-sm hidden md:flex">
              <Zap className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Utensils className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Connect your data to see metrics</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Link restaurant data</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customers</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Set up analytics tracking</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enable review monitoring</p>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Welcome to BiteBase Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Get started with AI-powered restaurant analytics. Connect your data to unlock insights.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">1. Start with AI Chat</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Ask questions about your business in natural language
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => setActiveTab('ai-chat')}
                        className="w-full"
                      >
                        Try AI Chat
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">2. Connect Your Data</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Link your restaurant data for personalized insights
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push('/restaurant-setup')}
                        className="w-full"
                      >
                        Setup Restaurant
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="ai-chat" className="mt-6">
            <ConversationalAnalytics
              restaurantId={undefined} // Will be set once user connects restaurant data
              initialContext={{
                location: userLocation || undefined,
                language: 'auto'
              }}
              onInsightGenerated={handleInsightGenerated}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Connect your restaurant data to see revenue analytics</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => router.push('/restaurant-setup')}
                    >
                      Connect Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Enable customer analytics to see insights</p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => router.push('/settings')}
                    >
                      Configure Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Location Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Interactive mapping features coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Location-based analytics and competitor mapping
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Insights History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights.length > 0 ? (
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.intent?.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {insight.timestamp?.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {insight.content}
                        </p>
                        {insight.suggestions && insight.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {insight.suggestions.slice(0, 2).map((suggestion: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No AI insights yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Start chatting with AI to generate insights
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab('ai-chat')}
                    >
                      Chat with AI
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()} • 
            Backend: {backendHealth?.environment || 'Unknown'} • 
            AI: {aiStatus?.status || 'Unknown'}
          </p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              AWS Bedrock AI
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}