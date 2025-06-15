"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "../../components/ui/button"
import { ArrowLeft, Download, Share2, Settings } from "lucide-react"
import RestaurantScoring from "../../components/scoring/RestaurantScoring"

export default function ScoringPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Restaurant Intelligence Score
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive performance analysis and recommendations
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Scoring Component */}
      <RestaurantScoring 
        restaurantId="demo-restaurant"
        showRecommendations={true}
      />
    </div>
  )
}