import { Providers } from "./providers";
import AppContent from "./AppContent";
import "./globals.css";
import "../styles/consolidated-theme.css";
import ErrorBoundary from "../components/ErrorBoundary";
import { TempoInit } from "./tempo-init";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <meta
          property="og:title"
          content="BiteBase Explorer - Restaurant Discovery Platform"
        />
        <meta
          property="og:description"
          content="AI-powered analytics for restaurant success"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bitebase.com" />
        <meta
          property="og:image"
          content="https://bitebase.com/images/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="BiteBase Explorer - Restaurant Discovery Platform"
        />
        <meta
          name="twitter:description"
          content="AI-powered analytics for restaurant success"
        />
        <meta
          name="twitter:image"
          content="https://bitebase.com/images/twitter-card.jpg"
        />

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
        <Script src="https://api.tempo.new/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
        <Providers>
          <ErrorBoundary>
            <TempoInit />
            <AppContent>{children}</AppContent>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
