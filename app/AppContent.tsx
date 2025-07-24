"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
// import { useAuth } from '../contexts/AuthContext'
import PageWrapper from '../components/layout/PageWrapper'

import { useLanguage } from '../contexts/LanguageContext'

export default function AppContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { t } = useLanguage()
  // const { user, loading } = useAuth() // This will now be called within AuthProvider
  const user = {
    restaurantName: 'BiteBase Intelligence',
    displayName: 'Restaurant Manager',
    email: 'manager@bitebase.app'
  };
  const loading = false;
  const [tourCompleted, setTourCompleted] = useState(false)

  // Determine if we're on the landing page, auth pages, or blog pages
  const isPublicPage = pathname === '/' || pathname?.startsWith('/auth') || pathname?.startsWith('/blog') || pathname?.startsWith('/about') || pathname?.startsWith('/contact') || pathname?.startsWith('/privacy') || pathname?.startsWith('/terms') || pathname?.startsWith('/help') || pathname?.startsWith('/changelog')
  
  // Pages that use MainLayout instead of PageWrapper (to avoid double sidebar)
  const usesMainLayout = pathname?.startsWith('/place') || pathname?.startsWith('/reports') || pathname === '/dashboard' || pathname?.startsWith('/product') || pathname?.startsWith('/price') || pathname?.startsWith('/promotion') || pathname?.startsWith('/analytics') || pathname?.startsWith('/location-intelligence') || pathname?.startsWith('/settings') || pathname?.startsWith('/customers') || pathname?.startsWith('/campaigns') || pathname?.startsWith('/reviews') || pathname?.startsWith('/calendar') || pathname?.startsWith('/restaurant-settings') || pathname?.startsWith('/pos-integration')

  // Check localStorage for tour completion status (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTourCompleted(!!localStorage.getItem('tour-completed'))
    }
  }, [])

  // Determine restaurant name from user data - only show if actually set
  const restaurantName = (user as any)?.restaurantName || null
  const userName = (user as any)?.displayName || user?.email?.split('@')[0] || "Restaurant Manager"

  // Page title based on path
  const getPageInfo = () => {
    if (pathname === '/dashboard') {
      return {
        title: t('dashboard.title'),
        description: t('dashboard.subtitle')
      }
    }
    if (pathname?.includes('/market-analysis')) {
      return {
        title: t('marketAnalysis.title'),
        description: t('marketAnalysis.subtitle')
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
        title: t('product.title'),
        description: t('product.description')
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

  // if (loading && !isPublicPage) {
  //   // You might want a more sophisticated loading state here, 
  //   // especially if PageWrapper itself has styles that shouldn't flash.
  //   // For now, a simple loading indicator.
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
  //         <p className="text-gray-600">Authenticating...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {isPublicPage ? (
        // Public pages (landing, auth) don't use the dashboard layout
        <>{children}</>
      ) : usesMainLayout ? (
        // Pages that use MainLayout directly (to avoid double sidebar)
        <>{children}</>
      ) : (
        // Other authenticated pages use the PageWrapper
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