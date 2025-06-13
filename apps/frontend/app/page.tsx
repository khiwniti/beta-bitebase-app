"use client"

import React, { useState, useEffect } from "react"
import ModernLandingPage from "../components/landing/ModernLandingPage"

function HomePageContent() {
  return <ModernLandingPage />
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <HomePageContent />;
}