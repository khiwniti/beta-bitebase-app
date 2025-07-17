"use client"

import React from 'react'
import { cn } from '../../lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Button } from '../ui/button'

interface MetricCardProps {
  title: string
  value: string | number | null
  description?: string
  change?: {
    value: number
    period: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  status?: 'connected' | 'disconnected' | 'pending' | 'error'
  loading?: boolean
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'minimal'
  actionLabel?: string
  onAction?: () => void
  onRefresh?: () => void
  className?: string
  formatter?: (value: number | string) => string
}

export function EnhancedMetricCard({
  title,
  value,
  description,
  change,
  icon,
  status = 'connected',
  loading = false,
  animated = true,
  size = 'md',
  variant = 'default',
  actionLabel,
  onAction,
  onRefresh,
  className,
  formatter
}: MetricCardProps) {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3 sm:p-4'
      case 'lg':
        return 'p-5 sm:p-6 lg:p-8'
      default:
        return 'p-4 sm:p-5 lg:p-6'
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
      case 'minimal':
        return 'bg-transparent border-0 shadow-none hover:bg-gray-50 dark:hover:bg-gray-800/50'
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
    }
  }

  const getStatusIndicator = () => {
    switch (status) {
      case 'connected':
        return {
          dot: 'bg-green-500',
          icon: CheckCircle2,
          text: 'Connected',
          color: 'text-green-600 dark:text-green-400'
        }
      case 'pending':
        return {
          dot: 'bg-yellow-500 animate-pulse',
          icon: Clock,
          text: 'Pending',
          color: 'text-yellow-600 dark:text-yellow-400'
        }
      case 'error':
        return {
          dot: 'bg-red-500',
          icon: AlertCircle,
          text: 'Error',
          color: 'text-red-600 dark:text-red-400'
        }
      default:
        return {
          dot: 'bg-gray-300 dark:bg-gray-600',
          icon: Minus,
          text: 'Disconnected',
          color: 'text-gray-500 dark:text-gray-400'
        }
    }
  }

  const getTrendIcon = () => {
    if (!change) return null
    
    const iconClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
    
    switch (change.trend) {
      case 'up':
        return <TrendingUp className={`${iconClass} text-green-600 dark:text-green-400`} />
      case 'down':
        return <TrendingDown className={`${iconClass} text-red-600 dark:text-red-400`} />
      default:
        return <Minus className={`${iconClass} text-gray-500 dark:text-gray-400`} />
    }
  }

  const getTrendColor = () => {
    if (!change) return 'text-gray-500 dark:text-gray-400'
    
    switch (change.trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const statusInfo = getStatusIndicator()
  const displayValue = formatter && typeof value === 'number' ? formatter(value) : value

  return (
    <div 
      className={cn(
        'rounded-xl transition-all duration-300 group',
        getVariantClasses(),
        animated && 'hover:scale-[1.02] transform-gpu',
        className
      )}
      role="article"
      aria-label={`${title} metric card`}
    >
      <div className={cn('h-full flex flex-col', getSizeClasses())}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {icon && (
              <div className={cn(
                'p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 transition-colors',
                'group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
              )}>
                <div className={cn(
                  'flex items-center justify-center text-gray-600 dark:text-gray-300',
                  'group-hover:text-primary-600 dark:group-hover:text-primary-400',
                  size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
                )}>
                  {icon}
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className={cn(
                'font-medium text-gray-700 dark:text-gray-300 truncate leading-tight',
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs sm:text-sm'
              )}>
                {title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={cn('w-2 h-2 rounded-full', statusInfo.dot)} />
                <span className={cn('text-xs', statusInfo.color)}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className={cn(
                  'p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                  'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                )}
                aria-label="Refresh metric"
              >
                <RefreshCw className={cn(
                  loading && 'animate-spin',
                  size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
                )} />
              </button>
            )}
            <button 
              className={cn(
                'p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
                'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label="More options"
            >
              <MoreHorizontal className={cn(
                size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            </button>
          </div>
        </div>

        {/* Value */}
        <div className="flex-1 mb-3 sm:mb-4">
          {loading ? (
            <div className="space-y-2 sm:space-y-3">
              <div className={cn(
                'bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
                size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8'
              )} />
              <div className={cn(
                'bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4',
                size === 'sm' ? 'h-3' : 'h-4'
              )} />
            </div>
          ) : status === 'connected' ? (
            <div className="space-y-2">
              <div 
                className={cn(
                  'font-bold text-gray-900 dark:text-gray-100 leading-tight break-words',
                  animated && 'transition-all duration-500',
                  size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl lg:text-2xl'
                )}
              >
                {displayValue ?? '--'}
              </div>
              {change && (
                <div className={cn('flex items-center gap-2 flex-wrap', getTrendColor())}>
                  {getTrendIcon()}
                  <span className={cn(
                    'font-medium',
                    size === 'sm' ? 'text-xs' : 'text-sm'
                  )}>
                    {change.value > 0 ? '+' : ''}{change.value}%
                  </span>
                  <span className={cn(
                    'text-gray-500 dark:text-gray-400',
                    size === 'sm' ? 'text-xs' : 'text-sm'
                  )}>
                    {change.period}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className={cn(
                'font-bold text-gray-400 dark:text-gray-500',
                size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'
              )}>
                --
              </div>
              <div className={cn(
                'text-gray-500 dark:text-gray-400 leading-relaxed',
                size === 'sm' ? 'text-xs' : 'text-sm'
              )}>
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
              size={size === 'sm' ? 'sm' : 'default'}
              className={cn(
                'w-full transition-all duration-200',
                size === 'sm' ? 'text-xs h-8' : 'text-sm h-9'
              )}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnhancedMetricCard