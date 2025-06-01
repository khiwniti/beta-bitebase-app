"use client"

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './header'
import Sidebar from './sidebar'
import { WebTour, useTour } from '../tour/WebTour'
import { TourTrigger, WelcomeBanner } from '../tour/TourTrigger'

interface PageWrapperProps {
  children: React.ReactNode
  pageTitle?: string
  pageDescription?: string
  showWelcomeBanner?: boolean
  showSidebar?: boolean
  navItems?: {
    name: string
    href: string
    active?: boolean
  }[]
  headerActions?: React.ReactNode
  restaurantName?: string
  userName?: string
}

export function PageWrapper({
  children,
  pageTitle,
  pageDescription,
  showWelcomeBanner = false,
  showSidebar = true,
  navItems,
  headerActions,
  restaurantName = "Bella Vista Bistro",
  userName = "Maria Rodriguez"
}: PageWrapperProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Tour state management
  const { isTourOpen, isFirstTimeUser, startTour, closeTour, completeTour } = useTour()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Tour integration with proper props */}
      <WebTour 
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
        isFirstTimeUser={isFirstTimeUser}
      />

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar 
          collapsed={sidebarCollapsed}
          toggleCollapsed={toggleSidebar}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          userName={userName}
          restaurantName={restaurantName}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <Header 
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          restaurantName={restaurantName}
          userName={userName}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto px-4 py-6">
            {/* Welcome Banner */}
            {showWelcomeBanner && (
              <div className="mb-6">
                <WelcomeBanner onStartTour={startTour} />
              </div>
            )}

            {/* Page header */}
            {(pageTitle || pageDescription) && (
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
                  {pageTitle && (
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
                  )}
                  {pageDescription && (
                    <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">{pageDescription}</p>
            )}
          </div>
          
                {/* Header action buttons */}
                {headerActions && (
                  <div className="flex items-center gap-2">
                    {headerActions}
            </div>
          )}
        </div>
            )}
            
            {/* Navigation tabs if provided */}
            {navItems && navItems.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                <nav className="flex space-x-4 overflow-x-auto pb-1 scrollbar-none">
                  {navItems.map((item) => {
                    const isActive = item.active || pathname === item.href;
  return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`py-3 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                          isActive
                            ? 'border-primary-600 text-primary-700 dark:border-primary-500 dark:text-primary-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {item.name}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}
            
            {/* Main content with nice animation */}
            <div className="animate-fadeInUp">
              {children}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
              <span>© {new Date().getFullYear()} BiteBase Intelligence - Restaurant Market Analysis</span>
              </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <a href="/help" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Help</a>
              <a href="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms</a>
              <span className="text-gray-400 dark:text-gray-600">v1.2.0</span>
            </div>
        </div>
        </footer>
      </div>


    </div>
  )
}

export default PageWrapper
