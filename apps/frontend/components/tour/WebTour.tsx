"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { X, ArrowRight, ArrowLeft, MapPin, Bot, BarChart3, FileText, Sparkles } from 'lucide-react'
import { markTourCompleted, markTourSkipped, shouldShowTour, isFirstTimeUser } from '../../utils/tourUtils'

interface TourStep {
  id: string
  title: string
  description: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right'
  icon: React.ReactNode
  action?: string
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to BiteBase! 🍽️',
    description: 'Your AI-powered restaurant business intelligence platform. Let\'s take a quick tour to show you around.',
    target: 'body',
    position: 'bottom',
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    id: 'dashboard',
    title: 'Market Intelligence Dashboard',
    description: 'Get real-time insights about market opportunities, competition levels, and revenue potential for your restaurant concept.',
    target: '[data-tour="dashboard"]',
    position: 'right',
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: 'map-analysis',
    title: 'Interactive Location Analysis',
    description: 'Click anywhere on the map to analyze restaurant opportunities. Our AI will provide detailed market research for any location.',
    target: '[data-tour="map-analysis"]',
    position: 'right',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'ai-assistant',
    title: 'AI Market Assistant',
    description: 'Chat with our AI to get instant insights about demographics, competitor analysis, pricing strategies, and market opportunities.',
    target: '[data-tour="ai-chat"]',
    position: 'left',
    icon: <Bot className="w-5 h-5" />
  },
  {
    id: 'reports',
    title: 'Generate Detailed Reports',
    description: 'Create comprehensive market analysis reports with AI-powered insights, competitor data, and location recommendations.',
    target: '[data-tour="reports"]',
    position: 'right',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'restaurant-setup',
    title: 'Restaurant Setup Wizard',
    description: 'Use our step-by-step wizard to plan your restaurant concept, analyze locations, and get AI recommendations.',
    target: '[data-tour="restaurant-setup"]',
    position: 'bottom',
    icon: <Sparkles className="w-5 h-5" />,
    action: 'Try the Restaurant Setup'
  }
]

interface WebTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  isFirstTimeUser?: boolean
}

export function WebTour({ isOpen, onClose, onComplete, isFirstTimeUser = false }: WebTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tourPosition, setTourPosition] = useState({ top: 0, left: 0 })
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen && tourSteps[currentStep]) {
      const targetElement = document.querySelector(tourSteps[currentStep].target)
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        const position = calculatePosition(rect, tourSteps[currentStep].position)
        setTourPosition(position)

        // Scroll element into view
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Add highlight effect
        targetElement.classList.add('tour-highlight')

        return () => {
          targetElement.classList.remove('tour-highlight')
        }
      }
    }
  }, [currentStep, isOpen, isMobile])

  const calculatePosition = (rect: DOMRect, position: string) => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const isMobile = viewportWidth < 768
    
    // Mobile-responsive sizing
    const offset = isMobile ? 10 : 20
    const cardWidth = isMobile ? Math.min(viewportWidth - 20, 300) : 320
    const cardHeight = isMobile ? Math.min(viewportHeight * 0.6, 350) : 300
    
    let top = 0
    let left = 0
    
    // On mobile, prefer bottom positioning for better accessibility
    if (isMobile) {
      // Always position at bottom on mobile for better UX
      top = Math.max(offset, viewportHeight - cardHeight - offset - 60) // 60px for safe area
      left = offset
      return { top, left }
    }
    
    // Desktop positioning logic
    switch (position) {
      case 'top':
        top = Math.max(offset, rect.top - cardHeight - offset)
        left = Math.max(offset, Math.min(viewportWidth - cardWidth - offset, rect.left + rect.width / 2 - cardWidth / 2))
        break
      case 'bottom':
        top = Math.min(viewportHeight - cardHeight - offset, rect.bottom + offset)
        left = Math.max(offset, Math.min(viewportWidth - cardWidth - offset, rect.left + rect.width / 2 - cardWidth / 2))
        break
      case 'left':
        top = Math.max(offset, Math.min(viewportHeight - cardHeight - offset, rect.top + rect.height / 2 - cardHeight / 2))
        left = Math.max(offset, rect.left - cardWidth - offset)
        break
      case 'right':
        top = Math.max(offset, Math.min(viewportHeight - cardHeight - offset, rect.top + rect.height / 2 - cardHeight / 2))
        left = Math.min(viewportWidth - cardWidth - offset, rect.right + offset)
        break
      default:
        top = Math.min(viewportHeight - cardHeight - offset, rect.bottom + offset)
        left = Math.max(offset, Math.min(viewportWidth - cardWidth - offset, rect.left))
    }
    
    return { top, left }
  }

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    onComplete()
    onClose()
    // Mark tour as completed using utility function
    markTourCompleted(dontShowAgain)
  }

  const skipTour = () => {
    onClose()
    // Mark tour as skipped using utility function
    markTourSkipped(dontShowAgain)
  }

  if (!isOpen) return null

  const step = tourSteps[currentStep]

  return (
    <>
      {/* Overlay - Allow clicks to close tour */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-pointer"
        onClick={onClose}
        title="Click anywhere to close tour"
      />

      {/* Tour Active Indicator */}
      <div className="fixed top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm font-medium max-w-[90vw] text-center">
        <span className="hidden sm:inline">🎯 Interactive Tour Active - Click anywhere to close or use buttons below</span>
        <span className="sm:hidden">🎯 Tour Active - Tap to close</span>
      </div>

      {/* Tour Card */}
      <div
        className="fixed z-50 pointer-events-auto"
        style={{
          top: `${tourPosition.top}px`,
          left: `${tourPosition.left}px`,
          width: isMobile ? `${Math.min(window.innerWidth - 20, 300)}px` : '320px',
          maxWidth: '90vw',
          maxHeight: isMobile ? '60vh' : '80vh'
        }}
      >
        <Card className="tour-card shadow-2xl border-2 border-primary-200 bg-white overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg text-primary-600 flex-shrink-0">
                  {step.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm sm:text-base truncate leading-tight">{step.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Step {currentStep + 1} of {tourSteps.length}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-gray-400 hover:text-gray-600 p-1 sm:p-2"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 sm:space-y-4 overflow-hidden px-3 sm:px-6 pb-3 sm:pb-6 flex-1 flex flex-col">
            <CardDescription className="text-sm sm:text-base leading-relaxed break-words flex-1">
              {step.description}
            </CardDescription>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            {/* Don't show again checkbox - only for first-time users */}
            {isFirstTimeUser && (
              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="dont-show-again"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label
                  htmlFor="dont-show-again"
                  className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none"
                >
                  Don't show this tour again
                </label>
              </div>
            )}

            {/* Navigation - Mobile-optimized */}
            <div className="flex flex-col gap-2 pt-2 mt-auto">
              {/* Mobile: Stack buttons vertically for better touch targets */}
              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex-1 flex items-center justify-center space-x-1 h-10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  onClick={nextStep}
                  size="sm"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 flex items-center justify-center space-x-1 h-10"
                >
                  <span>
                    {currentStep === tourSteps.length - 1 ? 'Start' : 'Next'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipTour}
                  className="flex-1 text-gray-500 hover:text-gray-700 h-9"
                >
                  Skip Tour
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="flex-1 text-gray-400 hover:text-gray-600 h-9"
                >
                  Close
                </Button>
              </div>

              {/* Desktop: Original horizontal layout */}
              <div className="hidden sm:flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Skip
                  </Button>

                  <Button
                    onClick={nextStep}
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-700 flex items-center space-x-1"
                  >
                    <span>
                      {currentStep === tourSteps.length - 1 ? 'Start' : 'Next'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Close tour"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Button for final step */}
            {step.action && currentStep === tourSteps.length - 1 && (
              <div className="pt-2 border-t mt-2">
                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700 h-10 sm:h-auto"
                  onClick={() => {
                    completeTour()
                    window.location.href = '/restaurant-setup'
                  }}
                >
                  {step.action}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tour Styles */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.4), 0 0 0 4px rgba(34, 197, 94, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .tour-highlight::before {
          content: '';
          position: absolute;
          inset: -2px;
          border: 2px solid #22c55e;
          border-radius: 8px;
          animation: pulse-border 2s infinite;
        }

        @keyframes pulse-border {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          .tour-highlight {
            box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5), 0 0 0 4px rgba(34, 197, 94, 0.2);
          }
          
          .tour-highlight::before {
            inset: -2px;
            border-width: 2px;
          }
        }

        /* Improve touch targets on mobile */
        @media (max-width: 768px) {
          .tour-card button {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </>
  )
}

// Hook to manage tour state
export function useTour() {
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [isFirstTimeUserState, setIsFirstTimeUserState] = useState(false)

  useEffect(() => {
    // Check if user is new and hasn't seen the tour using utility functions
    const shouldShow = shouldShowTour()
    const isNewUser = isFirstTimeUser()

    // Debug logging
    console.log('Tour state check:', {
      shouldShow,
      isNewUser
    })

    setIsFirstTimeUserState(isNewUser)

    if (shouldShow) {
      // Delay tour start to let page load
      const timer = setTimeout(() => {
        console.log('Auto-starting tour for new user')
        setIsTourOpen(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const startTour = () => {
    console.log('Starting tour manually')
    setIsTourOpen(true)
  }

  const closeTour = () => {
    console.log('Closing tour')
    setIsTourOpen(false)
  }

  const completeTour = () => {
    console.log('Completing tour')
    localStorage.setItem('bitebase-tour-completed', 'true')
    setIsTourOpen(false)
  }

  // Add escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTourOpen) {
        console.log('Tour closed via Escape key')
        closeTour()
      }
    }

    if (isTourOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isTourOpen])

  return {
    isTourOpen,
    isFirstTimeUser: isFirstTimeUserState,
    startTour,
    closeTour,
    completeTour
  }
}
