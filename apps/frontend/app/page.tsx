"use client"

import React from "react"
import { Providers } from "./providers"
import StunningLandingPage from "../components/landing/StunningLandingPage"

export default function HomePage() {
  return (
    <Providers>
      <StunningLandingPage />
    </Providers>
  )
}