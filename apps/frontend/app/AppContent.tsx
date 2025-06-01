"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import PageWrapper from '../components/layout/PageWrapper'

export default function AppContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, loading } = useAuth() // This will now be called within AuthProvider
  const [tourCompleted, setTourCompleted] = useState(false)

  // Determine if we're on the landing page or auth pages
  const isPublicPage = pathname === '/' || pathname?.startsWith('/auth')

  // Check localStorage for tour completion status (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTourCompleted(!!localStorage.getItem('tour-completed'))
    }
  }, [])

  // Determine restaurant name from user data or use default
  const restaurantName = (user as any)?.restaurantName || user?.displayName || "Bella Vista Bistro"
  const userName = user?.displayName || user?.email?.split('@')[0] || "Maria Rodriguez"

  // Page title based on path
  const getPageInfo = () => {
    if (pathname === '/dashboard') {
      return {
        title: 'Dashboard',
        description: 'Your restaurant performance at a glance'
      }
    }
    if (pathname?.includes('/market-analysis')) {
      return {
        title: 'Market Analysis',
        description: 'Explore market data and competition in your area'
      }
    }
    if (pathname?.includes('/place')) {
      return {
        title: 'Location Intelligence',
        description: 'Analyze foot traffic and competitive landscape'
      }
    }
    if (pathname?.includes('/product')) {
      return {
        title: 'Menu Optimization',
        description: 'Optimize your menu offerings and pricing'
      }
    }
    if (pathname?.includes('/price')) {
      return {
        title: 'Pricing Strategy',
        description: 'Dynamic pricing recommendations based on market data'
      }
    }
    if (pathname?.includes('/promotion')) {
      return {
        title: 'Marketing',
        description: 'Create and track marketing campaigns'
      }
    }
    if (pathname?.includes('/reports')) {
      return {
        title: 'Reports',
        description: 'Key insights and performance analytics'
      }
    }
    
    return {
      title: '',
      description: ''
    }
  }

  const pageInfo = getPageInfo()

  if (loading && !isPublicPage) {
    // You might want a more sophisticated loading state here, 
    // especially if PageWrapper itself has styles that shouldn't flash.
    // For now, a simple loading indicator.
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isPublicPage ? (
        // Public pages (landing, auth) don't use the dashboard layout
        <>{children}</>
      ) : (
        // Dashboard and authenticated pages use the PageWrapper
        <PageWrapper
          pageTitle={pageInfo.title}
          pageDescription={pageInfo.description}
          showWelcomeBanner={pathname === '/dashboard' && !tourCompleted}
          restaurantName={restaurantName}
          userName={userName}
        >
          {children}
        </PageWrapper>
      )}
    </>
  )
} 