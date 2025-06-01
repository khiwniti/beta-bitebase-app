"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Button } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { 
  CheckCircle, 
  ArrowRight, 
  Settings, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Utensils,
  Wifi,
  CreditCard,
  BarChart3,
  Target,
  Zap,
  Building,
  Phone,
  Mail,
  Globe,
  Camera,
  Star,
  TrendingUp
} from 'lucide-react'

interface SetupStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  completed: boolean
  required: boolean
  href: string
  estimatedTime: string
}

const setupSteps: SetupStep[] = [
  {
    id: 'basic-info',
    title: 'Restaurant Information',
    description: 'Set up your restaurant name, cuisine type, and basic details',
    icon: Building,
    completed: false,
    required: true,
    href: '/restaurant-settings/basic-info',
    estimatedTime: '5 min'
  },
  {
    id: 'location',
    title: 'Location & Address',
    description: 'Add your restaurant location and service area',
    icon: MapPin,
    completed: false,
    required: true,
    href: '/restaurant-settings/location',
    estimatedTime: '3 min'
  },
  {
    id: 'hours',
    title: 'Operating Hours',
    description: 'Configure your business hours and availability',
    icon: Clock,
    completed: false,
    required: true,
    href: '/restaurant-settings/hours',
    estimatedTime: '3 min'
  },
  {
    id: 'pos-integration',
    title: 'POS Integration',
    description: 'Connect your point-of-sale system for real-time data',
    icon: CreditCard,
    completed: false,
    required: false,
    href: '/pos-integration',
    estimatedTime: '10 min'
  },
  {
    id: 'menu-setup',
    title: 'Menu & Pricing',
    description: 'Upload your menu and set pricing information',
    icon: Utensils,
    completed: false,
    required: false,
    href: '/restaurant-settings/menu',
    estimatedTime: '15 min'
  },
  {
    id: 'marketing',
    title: 'Marketing Preferences',
    description: 'Set up your marketing goals and target audience',
    icon: Target,
    completed: false,
    required: false,
    href: '/restaurant-settings/marketing',
    estimatedTime: '5 min'
  }
]

export default function RestaurantSettingsPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isFirstTime, setIsFirstTime] = useState(true)

  const completionPercentage = Math.round((completedSteps.length / setupSteps.length) * 100)
  const requiredStepsCompleted = setupSteps.filter(step => step.required && completedSteps.includes(step.id)).length
  const totalRequiredSteps = setupSteps.filter(step => step.required).length

  const handleStepClick = (step: SetupStep) => {
    router.push(step.href)
  }

  const handleSkipToAnalytics = () => {
    router.push('/market-analysis')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isFirstTime ? 'Welcome to BiteBase!' : 'Restaurant Settings'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isFirstTime 
              ? "Let's set up your restaurant profile to unlock powerful analytics and insights. Complete the required steps to get started."
              : "Manage your restaurant settings and configuration."
            }
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Setup Progress</CardTitle>
                <CardDescription>
                  {requiredStepsCompleted}/{totalRequiredSteps} required steps completed
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {completionPercentage}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            
            {requiredStepsCompleted === totalRequiredSteps ? (
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Ready to Go!</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      All required setup steps are complete. You can now access full analytics.
                    </p>
                  </div>
                </div>
                <Button onClick={handleGoToDashboard} className="bg-green-600 hover:bg-green-700">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Complete required steps to unlock full analytics features
                </div>
                <Button variant="outline" onClick={handleSkipToAnalytics}>
                  Skip to Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-4">
          {setupSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isNext = !isCompleted && index === currentStep
            
            return (
              <Card 
                key={step.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : isNext
                    ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleStepClick(step)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        isCompleted 
                          ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200'
                          : isNext
                          ? 'bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          {step.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {isNext && (
                            <Badge className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                              Next
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {step.estimatedTime}
                        </div>
                        {isCompleted && (
                          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Completed
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to enhance your restaurant intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/market-analysis')}
              >
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Market Analysis</span>
                <span className="text-xs text-gray-500">Analyze your location</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/pos-integration')}
              >
                <CreditCard className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">Connect POS</span>
                <span className="text-xs text-gray-500">Integrate sales data</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => router.push('/campaigns')}
              >
                <Target className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Start Campaign</span>
                <span className="text-xs text-gray-500">Launch marketing</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Need Help Getting Started?
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Our team can help you set up your restaurant profile and integrate your systems for maximum insights.
                </p>
                <div className="flex gap-3">
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Schedule Demo
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}