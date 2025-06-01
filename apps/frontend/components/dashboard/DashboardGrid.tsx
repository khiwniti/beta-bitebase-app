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
  Info
} from 'lucide-react'
import { Button } from "@bitebase/ui"

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
        return <TrendingUp className="h-4 w-4 text-green-500" />
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
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'connected':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      default:
        return <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIndicator()}
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</span>
              </div>
            </div>
          </div>
          
          <button className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Value */}
        <div className="mb-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            </div>
          ) : status === 'connected' ? (
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
              {change && (
                <div className={`flex items-center space-x-1 mt-1 ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="text-sm font-medium">
                    {change.value > 0 ? '+' : ''}{change.value}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{change.period}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {description || 'No data available'}
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        {actionLabel && onAction && status !== 'connected' && (
          <Button
            onClick={onAction}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            {actionLabel}
          </Button>
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
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time range selector */}
            {onTimeRangeChange && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => onTimeRangeChange(range.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
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
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ) : (
          children
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

export function InsightCard({
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
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
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
        return 'text-green-600 dark:text-green-400'
    }
  }

  const styles = getTypeStyles()

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${styles.icon} bg-white dark:bg-gray-800 shadow-sm`}>
          {icon || <Info className="h-5 w-5" />}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
            <div className="flex items-center space-x-2">
              {priority && (
                <span className="text-xs text-gray-500 dark:text-gray-400">#{priority}</span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.badge}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Impact:</span>
              <span className={`text-xs font-medium ${getImpactColor()}`}>{impact}</span>
            </div>
            
            {action && onAction && (
              <Button
                onClick={onAction}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {action}
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
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
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
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className={`p-2 rounded-lg ${getTypeColor()}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{action}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
      <button className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        <ExternalLink className="h-4 w-4" />
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
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
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
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}