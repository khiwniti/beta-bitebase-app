"use client"

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface KPIMetric {
  id: string
  title: string
  value: number
  target?: number
  previousValue?: number
  unit?: string
  prefix?: string
  suffix?: string
  icon: React.ReactNode
  color: string
  change?: {
    value: number
    period: string
    trend: 'up' | 'down' | 'neutral'
  }
  category: 'revenue' | 'customers' | 'operations' | 'marketing'
  priority: 'high' | 'medium' | 'low'
  format?: 'number' | 'currency' | 'percentage' | 'decimal'
}

interface KPIDashboardProps {
  metrics: KPIMetric[]
  updateInterval?: number
  animationDuration?: number
  showTargets?: boolean
  showProgress?: boolean
  compactMode?: boolean
  realtime?: boolean
  className?: string
  onMetricClick?: (metric: KPIMetric) => void
}

// Hook for animated number counting
function useAnimatedCounter(
  endValue: number,
  duration: number = 2000,
  startValue: number = 0,
  dependencies: any[] = []
) {
  const [currentValue, setCurrentValue] = useState(startValue)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = null
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * easeOutCubic
      
      setCurrentValue(current)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [endValue, duration, startValue, ...dependencies])

  return currentValue
}

// Individual KPI Card Component
interface KPICardProps {
  metric: KPIMetric
  animationDuration: number
  showTarget: boolean
  showProgress: boolean
  compactMode: boolean
  realtime: boolean
  onClick?: () => void
}

function KPICard({
  metric,
  animationDuration,
  showTarget,
  showProgress,
  compactMode,
  realtime,
  onClick
}: KPICardProps) {
  const animatedValue = useAnimatedCounter(metric.value, animationDuration)
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (realtime) {
      const interval = setInterval(() => {
        setIsUpdating(true)
        setTimeout(() => setIsUpdating(false), 300)
      }, 5000 + Math.random() * 10000)

      return () => clearInterval(interval)
    }
  }, [realtime])

  const formatValue = (value: number) => {
    const roundedValue = Math.round(value)
    
    switch (metric.format) {
      case 'currency':
        return new Intl.NumberFormat('th-TH', {
          style: 'currency',
          currency: 'THB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(roundedValue)
      case 'percentage':
        return `${roundedValue}%`
      case 'decimal':
        return roundedValue.toFixed(1)
      default:
        return roundedValue.toLocaleString()
    }
  }

  const getProgressPercentage = () => {
    if (!metric.target) return 0
    return Math.min((metric.value / metric.target) * 100, 100)
  }

  const getTrendIcon = () => {
    if (!metric.change) return null
    
    const iconClass = compactMode ? 'h-3 w-3' : 'h-4 w-4'
    
    switch (metric.change.trend) {
      case 'up':
        return <TrendingUp className={`${iconClass} text-green-600`} />
      case 'down':
        return <TrendingDown className={`${iconClass} text-red-600`} />
      default:
        return <Minus className={`${iconClass} text-gray-500`} />
    }
  }

  const getTrendColor = () => {
    if (!metric.change) return 'text-gray-500'
    
    switch (metric.change.trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  const getCategoryColor = () => {
    switch (metric.category) {
      case 'revenue':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'customers':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'operations':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      case 'marketing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-300 cursor-pointer',
        'hover:shadow-lg hover:scale-[1.02] transform-gpu',
        isUpdating && 'ring-2 ring-primary-500 ring-offset-2',
        compactMode ? 'p-3' : 'p-4'
      )}
      onClick={onClick}
    >
      {realtime && isUpdating && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
      
      <CardHeader className={cn('pb-2', compactMode && 'pb-1')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                'p-2 rounded-lg',
                compactMode ? 'p-1.5' : 'p-2'
              )}
              style={{ backgroundColor: `${metric.color}20` }}
            >
              <div 
                className={cn(
                  compactMode ? 'w-4 h-4' : 'w-5 h-5'
                )}
                style={{ color: metric.color }}
              >
                {metric.icon}
              </div>
            </div>
            <div>
              <CardTitle className={cn(
                'font-medium text-gray-700 dark:text-gray-300',
                compactMode ? 'text-xs' : 'text-sm'
              )}>
                {metric.title}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={cn(
                  'mt-1 text-xs',
                  getCategoryColor(),
                  compactMode && 'text-xs px-1.5 py-0.5'
                )}
              >
                {metric.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn('space-y-3', compactMode && 'space-y-2')}>
        {/* Value */}
        <div className="space-y-1">
          <div className={cn(
            'font-bold text-gray-900 dark:text-gray-100',
            compactMode ? 'text-lg' : 'text-2xl lg:text-3xl'
          )}>
            {metric.prefix}{formatValue(animatedValue)}{metric.suffix}
          </div>
          
          {/* Change indicator */}
          {metric.change && (
            <div className={cn('flex items-center gap-1', getTrendColor())}>
              {getTrendIcon()}
              <span className={cn(
                'font-medium',
                compactMode ? 'text-xs' : 'text-sm'
              )}>
                {metric.change.value > 0 ? '+' : ''}{metric.change.value}%
              </span>
              <span className={cn(
                'text-gray-500',
                compactMode ? 'text-xs' : 'text-sm'
              )}>
                {metric.change.period}
              </span>
            </div>
          )}
        </div>

        {/* Target Progress */}
        {showTarget && metric.target && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={cn(
                'text-gray-600 dark:text-gray-400',
                compactMode ? 'text-xs' : 'text-sm'
              )}>
                Target: {formatValue(metric.target)}
              </span>
              <span className={cn(
                'font-medium',
                compactMode ? 'text-xs' : 'text-sm'
              )}>
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            {showProgress && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function KPIDashboard({
  metrics,
  updateInterval = 30000,
  animationDuration = 2000,
  showTargets = true,
  showProgress = true,
  compactMode = false,
  realtime = false,
  className,
  onMetricClick
}: KPIDashboardProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Auto-refresh for real-time mode
  useEffect(() => {
    if (realtime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, updateInterval)

      return () => clearInterval(interval)
    }
  }, [realtime, updateInterval])

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = []
    }
    acc[metric.category].push(metric)
    return acc
  }, {} as Record<string, KPIMetric[]>)

  const categoryIcons = {
    revenue: <DollarSign className="h-4 w-4" />,
    customers: <Users className="h-4 w-4" />,
    operations: <Activity className="h-4 w-4" />,
    marketing: <BarChart3 className="h-4 w-4" />
  }

  const categoryLabels = {
    revenue: 'Revenue',
    customers: 'Customers',
    operations: 'Operations',
    marketing: 'Marketing'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Key Performance Indicators
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time business metrics and performance tracking
          </p>
        </div>
        
        {realtime && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live • Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* KPI Grid by Category */}
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-gray-600 dark:text-gray-400">
              {categoryIcons[category as keyof typeof categoryIcons]}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          
          <div className={cn(
            'grid gap-4',
            compactMode 
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}>
            {categoryMetrics.map((metric) => (
              <KPICard
                key={metric.id}
                metric={metric}
                animationDuration={animationDuration}
                showTarget={showTargets}
                showProgress={showProgress}
                compactMode={compactMode}
                realtime={realtime}
                onClick={() => onMetricClick?.(metric)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default KPIDashboard