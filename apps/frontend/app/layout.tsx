"use client";

import { Providers } from "./providers";
// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { useAuth } from '../contexts/AuthContext'
// import PageWrapper from '../components/layout/PageWrapper'
import AppContent from "./AppContent"; // Import the new component
import "./globals.css";
import "../styles/consolidated-theme.css";
import { useEffect } from "react";
// import { TempoDevtools } from "tempo-devtools";
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize any client-side scripts if needed
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
        <title>BiteBase Explorer - Restaurant Discovery Platform</title>
        {/* Force deployment: 2025-06-09 08:55 UTC */}
        <meta
          name="description"
          content="BiteBase Explorer helps you discover and explore restaurants with real-time data, reviews, and comprehensive restaurant information for the best dining experiences."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#74C365" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="BiteBase Explorer - Restaurant Discovery Platform" />
        <meta property="og:description" content="AI-powered analytics for restaurant success" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bitebase.com" />
        <meta property="og:image" content="https://bitebase.com/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BiteBase Explorer - Restaurant Discovery Platform" />
        <meta name="twitter:description" content="AI-powered analytics for restaurant success" />
        <meta name="twitter:image" content="https://bitebase.com/images/twitter-card.jpg" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Font Awesome Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <ErrorBoundary>
            <AppContent>{children}</AppContent>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
