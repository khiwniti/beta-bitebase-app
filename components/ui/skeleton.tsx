'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        animation: 'shimmer 2s infinite',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// Metric Card Skeleton
function MetricCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="text-right space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <Skeleton className="h-5 w-32 mb-1" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

// Card Skeleton
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6", className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Dashboard Skeleton
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex flex-col space-y-8 p-6">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>

        {/* Featured Section Skeleton */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-48" />
              </div>
            </div>
            <Skeleton className="h-12 w-40 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-primary-50 border border-primary-100">
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Table Skeleton
function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Chart Skeleton
function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2" style={{ height }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1 rounded-t-md" 
            style={{ height: `${20 + Math.random() * 80}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  )
}

// Location Intelligence Skeleton
function LocationIntelligenceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* Info Alert */}
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>

      {/* Main Dashboard */}
      <div className="space-y-6">
        <CardSkeleton className="h-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton className="h-48" />
          <CardSkeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  MetricCardSkeleton,
  CardSkeleton,
  DashboardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  LocationIntelligenceSkeleton
}

// Add the shimmer animation to global CSS
const shimmerCSS = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`

// Inject the CSS if not already present
if (typeof document !== 'undefined' && !document.getElementById('shimmer-styles')) {
  const style = document.createElement('style')
  style.id = 'shimmer-styles'
  style.textContent = shimmerCSS
  document.head.appendChild(style)
}