"use client";

import { ProtectedRoute, useAuth, UserMenu } from "@/components/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BiteBaseLogo from "@/components/BiteBaseLogo";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BiteBaseLogo size="sm" variant="white" />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome back, {user?.name || user?.email.split("@")[0]}!
              </span>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-300">
            Welcome to your BiteBase Intelligence Platform
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-slate-400">Reports generated</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Locations Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-slate-400">Areas explored</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-slate-400">Recommendations</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400 capitalize">
                {user?.subscription_tier || "Free"}
              </div>
              <p className="text-xs text-slate-400">Current plan</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Market Analysis</CardTitle>
              <CardDescription className="text-slate-300">
                Analyze market opportunities in your target location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Get comprehensive insights about competitors, demographics, and market potential
                for your restaurant concept.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Start Market Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Location Intelligence</CardTitle>
              <CardDescription className="text-slate-300">
                Explore locations with interactive mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Use our interactive map to discover prime locations, analyze foot traffic,
                and understand local demographics.
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/map'}
              >
                Explore Locations
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">AI Predictions</CardTitle>
              <CardDescription className="text-slate-300">
                Get AI-powered business forecasts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Leverage machine learning to predict sales, customer behavior,
                and optimal pricing strategies.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Generate Predictions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Business Intelligence</CardTitle>
              <CardDescription className="text-slate-300">
                Comprehensive business analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-sm">
                Access detailed analytics, performance metrics, and actionable
                insights to grow your restaurant business.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Getting Started</CardTitle>
            <CardDescription className="text-slate-300">
              Complete your profile to unlock all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Complete Profile</h4>
                  <p className="text-slate-400 text-sm">Add your business information and preferences</p>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Complete
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Set Target Location</h4>
                  <p className="text-slate-400 text-sm">Define your area of interest for analysis</p>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Set Location
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Take Platform Tour</h4>
                  <p className="text-slate-400 text-sm">Learn how to use all BiteBase features</p>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Start Tour
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}