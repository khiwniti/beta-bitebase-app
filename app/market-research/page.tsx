"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "../../components/ui/button"
import {
  ArrowLeft,
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  Calendar,
  Share2
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

// Import the comprehensive Market Research Dashboard
import { MarketResearchDashboard } from "../../components/dashboard"

export default function MarketResearchPage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Market Research Intelligence
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comprehensive analytics for restaurant market intelligence
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketResearchDashboard />
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Data sources: Wongnai, Google, Social Media APIs</span>
              <span>•</span>
              <span>Real-time updates every 15 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
