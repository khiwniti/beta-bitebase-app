"use client"

import React from 'react'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { tourUtils, markUserAsFirstTime, clearUserSessionData } from '../../utils/tourUtils'

/**
 * Demo component for testing the tour functionality
 * This component provides buttons to simulate different user states
 */
export function TourDemo() {
  const handleSimulateNewUser = () => {
    // Clear all tour preferences and mark as new user
    tourUtils.resetTourPreferences()
    markUserAsFirstTime()
    console.log('Simulated new user - refresh page to see tour')
    alert('Simulated new user! Refresh the page to see the tour.')
  }

  const handleSimulateReturningUser = () => {
    // Clear first-time flag but keep tour preferences
    clearUserSessionData()
    console.log('Simulated returning user - tour should not show')
    alert('Simulated returning user! Tour will not show automatically.')
  }

  const handleResetTour = () => {
    tourUtils.enableTour()
    alert('Tour reset! Refresh the page to see the tour.')
  }

  const handleDisableTour = () => {
    tourUtils.disableTour()
    alert('Tour disabled! Refresh the page to confirm.')
  }

  const handleShowTourState = () => {
    const state = tourUtils.getTourState()
    console.log('Current tour state:', state)
    alert(`Tour State:\n${JSON.stringify(state, null, 2)}`)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🎯 Tour Demo & Testing</CardTitle>
        <CardDescription>
          Use these buttons to test different tour scenarios. Check the console for detailed logs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleSimulateNewUser}
            className="bg-green-600 hover:bg-green-700"
          >
            🆕 Simulate New User
          </Button>
          
          <Button 
            onClick={handleSimulateReturningUser}
            variant="outline"
          >
            🔄 Simulate Returning User
          </Button>
          
          <Button 
            onClick={handleResetTour}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔄 Reset Tour
          </Button>
          
          <Button 
            onClick={handleDisableTour}
            variant="destructive"
          >
            ❌ Disable Tour
          </Button>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={handleShowTourState}
            variant="outline"
            className="w-full"
          >
            📊 Show Tour State
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">How to test:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Simulate New User" to trigger the tour on page refresh</li>
            <li>The tour will appear with a "Don't show again" checkbox for first-time users</li>
            <li>Complete or skip the tour to test the preferences</li>
            <li>Use "Show Tour State" to debug the current state</li>
            <li>Use "Reset Tour" to test the tour again</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
