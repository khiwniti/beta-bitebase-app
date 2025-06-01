"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { User, Building, BarChart3, Shield, TrendingUp, LogIn } from 'lucide-react'

const demoUsers = [
  {
    id: 1,
    email: "demo@bitebase.com",
    password: "demo123",
    name: "Alex Chen",
    role: "restaurant_owner",
    title: "Restaurant Owner",
    description: "Manage restaurants, view analytics, and track performance",
    icon: <Building className="w-6 h-6" />,
    features: [
      "Restaurant Management",
      "Financial Analytics", 
      "Customer Insights",
      "Menu Optimization",
      "Location Analysis"
    ],
    color: "bg-blue-500"
  },
  {
    id: 2,
    email: "analyst@bitebase.com",
    password: "analyst123",
    name: "Sarah Johnson",
    role: "market_analyst",
    title: "Market Analyst",
    description: "Access market research, location intelligence, and industry trends",
    icon: <BarChart3 className="w-6 h-6" />,
    features: [
      "Market Analysis",
      "Location Intelligence",
      "Competitor Research",
      "Trend Analysis",
      "Custom Reports"
    ],
    color: "bg-green-500"
  },
  {
    id: 3,
    email: "franchise@bitebase.com",
    password: "franchise123",
    name: "Michael Wong",
    role: "franchise_manager",
    title: "Franchise Manager",
    description: "Oversee multiple locations and franchise development",
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      "Multi-Location Management",
      "Franchise Development",
      "Performance Comparison",
      "Brand Standards",
      "Expansion Planning"
    ],
    color: "bg-purple-500"
  },
  {
    id: 4,
    email: "admin@bitebase.com",
    password: "admin123",
    name: "Emma Rodriguez",
    role: "admin",
    title: "Platform Administrator",
    description: "Full platform access with user and system management",
    icon: <Shield className="w-6 h-6" />,
    features: [
      "User Management",
      "System Administration",
      "Platform Analytics",
      "Security Controls",
      "Global Settings"
    ],
    color: "bg-red-500"
  },
  {
    id: 5,
    email: "investor@bitebase.com",
    password: "investor123",
    name: "David Kim",
    role: "investor",
    title: "Investment Analyst",
    description: "Investment insights and portfolio management for F&B ventures",
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      "Investment Analysis",
      "Portfolio Tracking",
      "Market Opportunities",
      "Risk Assessment",
      "ROI Projections"
    ],
    color: "bg-orange-500"
  }
]

export default function DemoLoginPage() {
  const [loading, setLoading] = useState(false)
  const [customEmail, setCustomEmail] = useState('')
  const [customPassword, setCustomPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('demo')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleDemoLogin = async (user: typeof demoUsers[0]) => {
    setLoading(true)
    setError('')
    
    try {
      await signIn(user.email, user.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await signIn(customEmail, customPassword)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BiteBase Demo Portal
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Experience the complete restaurant intelligence platform
          </p>
          <p className="text-sm text-gray-500">
            Choose a demo user below to explore different features and capabilities
          </p>
        </div>

        <div className="w-full">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <button 
                className="px-6 py-2 rounded-md bg-blue-500 text-white font-medium"
                onClick={() => setActiveTab('demo')}
              >
                Demo Users
              </button>
              <button 
                className="px-6 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium ml-1"
                onClick={() => setActiveTab('custom')}
              >
                Custom Login
              </button>
            </div>
          </div>

          {activeTab === 'demo' && (
            <div>
            {/* Demo Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {demoUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                  <div className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${user.color} text-white`}>
                        {user.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {user.title}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {user.description}
                    </p>
                  </div>
                  
                  <div className="pt-0">
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-700 mb-2">Key Features:</p>
                        <ul className="space-y-1">
                          {user.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500 mb-3">
                          <p><strong>Email:</strong> {user.email}</p>
                          <p><strong>Password:</strong> {user.password}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleDemoLogin(user)}
                          disabled={loading}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          {loading ? 'Logging in...' : `Login as ${user.name}`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Custom Login</h2>
                  <p className="text-gray-600 text-sm">
                    Enter your own credentials or use any demo account
                  </p>
                </div>
                <form onSubmit={handleCustomLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Platform Features Overview</h2>
            <p className="text-gray-600">
              Comprehensive restaurant intelligence and management platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-3">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Restaurant Management</h3>
              <p className="text-sm text-gray-600">Complete restaurant operations and analytics</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Market Intelligence</h3>
              <p className="text-sm text-gray-600">Location analysis and market research</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg inline-block mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Growth Analytics</h3>
              <p className="text-sm text-gray-600">Performance tracking and optimization</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-lg inline-block mb-3">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Role Access</h3>
              <p className="text-sm text-gray-600">Tailored experiences for different users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}