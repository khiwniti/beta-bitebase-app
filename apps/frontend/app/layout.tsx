"use client";

import { Providers } from "./providers";
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { useAuth } from '../contexts/AuthContext'
// import PageWrapper from '../components/layout/PageWrapper'
import AppContent from "./AppContent"; // Import the new component
import "./globals.css";
import { useEffect } from "react";
import { TempoDevtools } from "tempo-devtools";
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO) {
      TempoDevtools.init();
    }
  }, []);
  // const pathname = usePathname()
  // const { user, loading } = useAuth()
  // const [tourCompleted, setTourCompleted] = useState(false)

  // // Determine if we're on the landing page or auth pages
  // const isPublicPage = pathname === '/' || pathname?.startsWith('/auth')

  // // Check localStorage for tour completion status (client-side only)
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setTourCompleted(!!localStorage.getItem('tour-completed'))
  //   }
  // }, [])

  // // Determine restaurant name from user data or use default
  // const restaurantName = user?.restaurantName || user?.displayName || "Your Restaurant"
  // const userName = user?.displayName || user?.email?.split('@')[0] || "Restaurant Manager"

  // // Page title based on path
  // const getPageInfo = () => {
  //   if (pathname === '/dashboard') {
  //     return {
  //       title: 'Dashboard',
  //       description: 'Your restaurant performance at a glance'
  //     }
  //   }
  //   if (pathname?.includes('/market-analysis')) {
  //     return {
  //       title: 'Market Analysis',
  //       description: 'Explore market data and competition in your area'
  //     }
  //   }
  //   if (pathname?.includes('/place')) {
  //     return {
  //       title: 'Location Intelligence',
  //       description: 'Analyze foot traffic and competitive landscape'
  //     }
  //   }
  //   if (pathname?.includes('/product')) {
  //     return {
  //       title: 'Menu Optimization',
  //       description: 'Optimize your menu offerings and pricing'
  //     }
  //   }
  //   if (pathname?.includes('/price')) {
  //     return {
  //       title: 'Pricing Strategy',
  //       description: 'Dynamic pricing recommendations based on market data'
  //     }
  //   }
  //   if (pathname?.includes('/promotion')) {
  //     return {
  //       title: 'Marketing',
  //       description: 'Create and track marketing campaigns'
  //     }
  //   }
  //   if (pathname?.includes('/reports')) {
  //     return {
  //       title: 'Reports',
  //       description: 'Key insights and performance analytics'
  //     }
  //   }

  //   return {
  //     title: '',
  //     description: ''
  //   }
  // }

  // const pageInfo = getPageInfo()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BiteBase - Restaurant Intelligence Platform</title>
        <meta
          name="description"
          content="Data-driven insights for restaurant success"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <ErrorBoundary>
            <AppContent>{children}</AppContent>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
