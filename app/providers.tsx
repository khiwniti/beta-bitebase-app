"use client"

import React from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { AuthProvider } from "../contexts/AuthContext"
import { LanguageProvider } from "../contexts/LanguageContext"
import { OnboardingProvider } from "../components/onboarding"

// Create a client outside component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}
