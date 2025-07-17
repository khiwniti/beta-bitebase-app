"use client"

import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Clock,
  ArrowRight,
  X,
  Bookmark,
  BookmarkCheck,
  MoreVertical,
  ExternalLink,
  Share
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export type InsightType = 'opportunity' | 'warning' | 'success' | 'info' | 'recommendation'
export type InsightPriority = 'high' | 'medium' | 'low'
export type InsightCategory = 'revenue' | 'customers' | 'operations' | 'marketing' | 'performance'

export interface InsightAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'link'
  url?: string
  onClick?: () => void
  external?: boolean
}

export interface Insight {
  id: string
  type: InsightType
  priority: InsightPriority
  category: InsightCategory
  title: string
  description: string
  impact?: {
    metric: string
    value: number
    unit: string
    timeframe: string
  }
  confidence?: number // 0-100
  source?: string
  timestamp: Date
  actions?: InsightAction[]
  tags?: string[]
  dismissed?: boolean
  bookmarked?: boolean
  readTime?: string
}

interface InsightCardProps {
  insight: Insight
  showActions?: boolean
  showMetadata?: boolean
  compact?: boolean
  interactive?: boolean
  onDismiss?: (insightId: string) => void
  onBookmark?: (insightId: string) => void
  onShare?: (insight: Insight) => void
  onAction?: (action: InsightAction, insight: Insight) => void
  className?: string
}

export function EnhancedInsightCard({
  insight,
  showActions = true,
  showMetadata = true,
  compact = false,
  interactive = true,
  onDismiss,
  onBookmark,
  onShare,
  onAction,
  className
}: InsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [isBookmarked, setIsBookmarked] = useState(insight.bookmarked || false)

  const getTypeConfig = () => {
    switch (insight.type) {
      case 'opportunity':
        return {
          icon: TrendingUp,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        }
      case 'recommendation':
        return {
          icon: Lightbulb,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800',
          badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
        }
      default:
        return {
          icon: Info,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800/50',
          borderColor: 'border-gray-200 dark:border-gray-700',
          badgeColor: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }
  }

  const getPriorityConfig = () => {
    switch (insight.priority) {
      case 'high':
        return {
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          dot: 'bg-red-500'
        }
      case 'medium':
        return {
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          dot: 'bg-yellow-500'
        }
      default:
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          dot: 'bg-green-500'
        }
    }
  }

  const getCategoryIcon = () => {
    switch (insight.category) {
      case 'revenue':
        return '💰'
      case 'customers':
        return '👥'
      case 'operations':
        return '⚙️'
      case 'marketing':
        return '📈'
      case 'performance':
        return '⚡'
      default:
        return '📊'
    }
  }

  const typeConfig = getTypeConfig()
  const priorityConfig = getPriorityConfig()
  const IconComponent = typeConfig.icon

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(insight.id)
  }

  const handleAction = (action: InsightAction) => {
    if (action.url) {
      if (action.external) {
        window.open(action.url, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = action.url
      }
    }
    onAction?.(action, insight)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300',
        typeConfig.bgColor,
        typeConfig.borderColor,
        'border',
        interactive && 'hover:shadow-md hover:scale-[1.01] transform-gpu cursor-pointer',
        compact && !isExpanded && 'max-h-32',
        className
      )}
      onClick={() => interactive && compact && setIsExpanded(!isExpanded)}
    >
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Icon */}
            <div className={cn(
              'p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm flex-shrink-0',
              typeConfig.color
            )}>
              <IconComponent className="h-5 w-5" />
            </div>
            
            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className={cn(
                  'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2',
                  compact ? 'text-sm' : 'text-base'
                )}>
                  {insight.title}
                </h3>
                
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <div className={cn('w-2 h-2 rounded-full', priorityConfig.dot)} />
                  <Badge variant="secondary" className={cn('text-xs', priorityConfig.bgColor)}>
                    {insight.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{getCategoryIcon()}</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {insight.category}
                </Badge>
                {insight.confidence && (
                  <Badge variant="secondary" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {interactive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBookmark()
                }}
                className="h-8 w-8 p-0"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-primary-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onShare(insight)
                }}
                className="h-8 w-8 p-0"
              >
                <Share className="h-4 w-4" />
              </Button>
            )}
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDismiss(insight.id)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Expandable content */}
      {(!compact || isExpanded) && (
        <CardContent className="pt-0 space-y-4">
          {/* Description */}
          <p className={cn(
            'text-gray-700 dark:text-gray-300 leading-relaxed',
            compact ? 'text-sm' : 'text-base'
          )}>
            {insight.description}
          </p>

          {/* Impact metrics */}
          {insight.impact && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Potential Impact
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-primary-600">
                  {insight.impact.value > 0 ? '+' : ''}{insight.impact.value}{insight.impact.unit}
                </span>
                {' '}in{' '}
                <span className="font-medium">{insight.impact.metric}</span>
                {' '}over{' '}
                <span className="font-medium">{insight.impact.timeframe}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {insight.tags && insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {insight.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          {showActions && insight.actions && insight.actions.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {insight.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.type === 'primary' ? 'default' : action.type === 'secondary' ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAction(action)
                    }}
                    className="text-sm"
                  >
                    {action.label}
                    {action.external && <ExternalLink className="ml-1 h-3 w-3" />}
                    {action.type === 'link' && <ArrowRight className="ml-1 h-3 w-3" />}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {showMetadata && (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(insight.timestamp)}</span>
                </div>
                {insight.readTime && (
                  <span>{insight.readTime} read</span>
                )}
              </div>
              {insight.source && (
                <span>Source: {insight.source}</span>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

// Insights Grid Component
interface InsightsGridProps {
  insights: Insight[]
  title?: string
  description?: string
  compact?: boolean
  maxItems?: number
  onInsightAction?: (action: InsightAction, insight: Insight) => void
  onInsightDismiss?: (insightId: string) => void
  onInsightBookmark?: (insightId: string) => void
  onInsightShare?: (insight: Insight) => void
  onViewAll?: () => void
  className?: string
}

export function InsightsGrid({
  insights,
  title = 'AI Insights',
  description = 'Actionable recommendations based on your data',
  compact = false,
  maxItems,
  onInsightAction,
  onInsightDismiss,
  onInsightBookmark,
  onInsightShare,
  onViewAll,
  className
}: InsightsGridProps) {
  const displayedInsights = maxItems ? insights.slice(0, maxItems) : insights
  const hasMore = maxItems && insights.length > maxItems

  if (insights.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No insights available at the moment</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        
        {hasMore && onViewAll && (
          <Button variant="outline" onClick={onViewAll}>
            View All ({insights.length})
          </Button>
        )}
      </div>

      {/* Insights Grid */}
      <div className={cn(
        'grid gap-4',
        compact 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 lg:grid-cols-2'
      )}>
        {displayedInsights.map((insight) => (
          <EnhancedInsightCard
            key={insight.id}
            insight={insight}
            compact={compact}
            onAction={onInsightAction}
            onDismiss={onInsightDismiss}
            onBookmark={onInsightBookmark}
            onShare={onInsightShare}
          />
        ))}
      </div>
    </div>
  )
}

export default EnhancedInsightCard