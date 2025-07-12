"use client"

import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { Button } from "../ui/button"

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    period: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon: React.ReactNode
  description?: string
  status?: 'connected' | 'disconnected' | 'pending'
  actionLabel?: string
  onAction?: () => void
  loading?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  description,
  status = 'disconnected',
  actionLabel,
  onAction,
  loading = false,
  className = ''
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return null
    
    switch (change.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-primary-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    if (!change) return 'text-gray-500'
    
    switch (change.trend) {
      case 'up':
        return 'text-primary-600 dark:text-primary-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'connected':
        return <div className="w-2 h-2 bg-primary-500 rounded-full" />
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      default:
        return <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}>
      <div className="p-4 sm:p-5 lg:p-6 h-full flex flex-col min-h-[140px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 min-h-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
              <div className="w-5 h-5 flex items-center justify-center text-gray-600 dark:text-gray-300">
                {icon}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate leading-tight mb-1">{title}</h3>
              <div className="flex items-center gap-2">
                {getStatusIndicator()}
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</span>
              </div>
            </div>
          </div>
          
          <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 touch-manipulation">
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Value */}
        <div className="flex-1 min-h-0 mb-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            </div>
          ) : status === 'connected' ? (
            <div className="space-y-2">
              <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight break-words">{value}</div>
              {change && (
                <div className={`flex items-center gap-2 flex-wrap ${getTrendColor()}`}>
                  <div className="w-4 h-4 flex-shrink-0">
                    {getTrendIcon()}
                  </div>
                  <span className="text-xs font-medium">
                    {change.value > 0 ? '+' : ''}{change.value}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{change.period}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description || 'No data available'}
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        {actionLabel && onAction && status !== 'connected' && (
          <div className="mt-auto">
            <Button
              onClick={onAction}
              variant="outline"
              size="sm"
              className="w-full text-xs sm:text-sm touch-manipulation min-h-[36px] sm:min-h-[40px] truncate"
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  children: React.ReactNode
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
  actions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
  }>
  loading?: boolean
  className?: string
}

export function ChartCard({
  title,
  children,
  timeRange = '7d',
  onTimeRangeChange,
  actions = [],
  loading = false,
  className = ''
}: ChartCardProps) {
  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ]

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Time range selector */}
            {onTimeRangeChange && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 sm:p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => onTimeRangeChange(range.value)}
                    className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors touch-manipulation min-h-[28px] sm:min-h-[32px] ${
                      timeRange === range.value
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
            
            {/* Action buttons */}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"
                title={action.label}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  {action.icon}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 overflow-hidden">
        {loading ? (
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ) : (
          <div className="overflow-hidden">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

interface InsightCardProps {
  type: 'opportunity' | 'warning' | 'success' | 'info'
  title: string
  description: string
  impact: 'High' | 'Medium' | 'Low'
  action?: string
  onAction?: () => void
  priority?: number
  icon?: React.ReactNode
  className?: string
}

export function DashboardInsightCard({
  type,
  title,
  description,
  impact,
  action,
  onAction,
  priority,
  icon,
  className = ''
}: InsightCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'opportunity':
        return {
          bg: 'bg-primary-50 dark:bg-primary-900/20',
          border: 'border-primary-200 dark:border-primary-800',
          icon: 'text-primary-600 dark:text-primary-400',
          badge: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
        }
      case 'success':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800/50',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'text-gray-600 dark:text-gray-400',
          badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
        }
    }
  }

  const getImpactColor = () => {
    switch (impact) {
      case 'High':
        return 'text-red-600 dark:text-red-400'
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-primary-600 dark:text-primary-400'
    }
  }

  const styles = getTypeStyles()

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${styles.icon} bg-white dark:bg-gray-800 shadow-sm flex-shrink-0`}>
          {icon || <Info className="h-5 w-5" />}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 pr-2 truncate flex-1">{title}</h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              {priority && (
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">#{priority}</span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badge} whitespace-nowrap`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed overflow-hidden">{description}</p>
          
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Impact:</span>
              <span className={`text-xs font-medium ${getImpactColor()}`}>{impact}</span>
            </div>
            
            {action && onAction && (
              <Button
                onClick={onAction}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm flex-shrink-0 touch-manipulation min-h-[32px] sm:min-h-[36px] px-2 sm:px-3"
              >
                <span className="truncate">{action}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  action: string
  time: string
  type: 'analysis' | 'report' | 'optimization' | 'feedback' | 'location'
  icon: React.ReactNode
}

export function ActivityItem({ action, time, type, icon }: ActivityItemProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'analysis':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      case 'report':
        return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
      case 'optimization':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
      case 'feedback':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'location':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className={`p-1.5 sm:p-2 rounded-lg ${getTypeColor()} flex-shrink-0`}>
        <div className="w-3 h-3 sm:w-4 sm:h-4">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed line-clamp-2">{action}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">{time}</p>
      </div>
      <button className="p-1 sm:p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0 touch-manipulation">
        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </div>
  )
}

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
}

export function DashboardGrid({ children, className = '' }: DashboardGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 auto-rows-fr ${className}`}>
      {children}
    </div>
  )
}

export function DashboardSection({ 
  title, 
  description, 
  children, 
  actions,
  className = '' 
}: {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}