"use client"

import React, { useState, useEffect } from "react"
import BetaInspiredLandingPage from "../components/landing/BetaInspiredLandingPage"

function HomePageContent() {
  return <BetaInspiredLandingPage />
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          {/* Loading Animation */}
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-green-400/40 rounded-full animate-ping mx-auto"></div>
          </div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Loading BiteBase</h2>
            <p className="text-slate-400">Preparing your restaurant intelligence platform...</p>
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <HomePageContent />;
}