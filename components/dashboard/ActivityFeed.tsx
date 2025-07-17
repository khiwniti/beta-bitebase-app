"use client"

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'
import {
  Activity,
  Clock,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  MapPin,
  Bell,
  MessageSquare,
  Settings,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  RefreshCw,
  Filter,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export type ActivityType = 'order' | 'customer' | 'revenue' | 'review' | 'alert' | 'system' | 'marketing' | 'analytics'
export type ActivityPriority = 'high' | 'medium' | 'low'
export type ActivityStatus = 'new' | 'read' | 'archived'

export interface ActivityItem {
  id: string
  type: ActivityType
  priority: ActivityPriority
  status: ActivityStatus
  title: string
  description: string
  timestamp: Date
  actor?: {
    name: string
    avatar?: string
    role?: string
  }
  metadata?: {
    amount?: number
    currency?: string
    location?: string
    rating?: number
    orderId?: string
    customerId?: string
    [key: string]: any
  }
  actions?: Array<{
    label: string
    url?: string
    onClick?: () => void
    primary?: boolean
  }>
  relatedData?: any
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  title?: string
  showFilters?: boolean
  showPriority?: boolean
  showTimestamp?: boolean
  showActions?: boolean
  realtime?: boolean
  updateInterval?: number
  maxItems?: number
  groupByDate?: boolean
  compact?: boolean
  autoRefresh?: boolean
  onActivityClick?: (activity: ActivityItem) => void
  onActivityAction?: (activity: ActivityItem, actionIndex: number) => void
  onMarkAsRead?: (activityId: string) => void
  onMarkAllAsRead?: () => void
  onRefresh?: () => void
  className?: string
}

export function ActivityFeed({
  activities,
  title = 'Activity Feed',
  showFilters = true,
  showPriority = true,
  showTimestamp = true,
  showActions = true,
  realtime = false,
  updateInterval = 30000,
  maxItems,
  groupByDate = false,
  compact = false,
  autoRefresh = false,
  onActivityClick,
  onActivityAction,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefresh,
  className
}: ActivityFeedProps) {
  const [filteredActivities, setFilteredActivities] = useState(activities)
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<ActivityPriority[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newActivityCount, setNewActivityCount] = useState(0)
  const lastActivityCountRef = useRef(activities.length)

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh || realtime) {
      const interval = setInterval(() => {
        onRefresh?.()
      }, updateInterval)

      return () => clearInterval(interval)
    }
  }, [autoRefresh, realtime, updateInterval, onRefresh])

  // Track new activities
  useEffect(() => {
    if (activities.length > lastActivityCountRef.current) {
      setNewActivityCount(activities.length - lastActivityCountRef.current)
      setTimeout(() => setNewActivityCount(0), 5000)
    }
    lastActivityCountRef.current = activities.length
  }, [activities.length])

  // Filter activities
  useEffect(() => {
    let filtered = activities

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(activity => selectedTypes.includes(activity.type))
    }

    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(activity => selectedPriorities.includes(activity.priority))
    }

    if (maxItems) {
      filtered = filtered.slice(0, maxItems)
    }

    setFilteredActivities(filtered)
  }, [activities, selectedTypes, selectedPriorities, maxItems])

  const getActivityIcon = (type: ActivityType) => {
    const iconClass = compact ? 'h-4 w-4' : 'h-5 w-5'
    
    switch (type) {
      case 'order':
        return <ShoppingCart className={iconClass} />
      case 'customer':
        return <Users className={iconClass} />
      case 'revenue':
        return <DollarSign className={iconClass} />
      case 'review':
        return <Star className={iconClass} />
      case 'alert':
        return <AlertCircle className={iconClass} />
      case 'system':
        return <Settings className={iconClass} />
      case 'marketing':
        return <TrendingUp className={iconClass} />
      case 'analytics':
        return <Activity className={iconClass} />
      default:
        return <Info className={iconClass} />
    }
  }

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'order':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'customer':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      case 'revenue':
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30'
      case 'review':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'alert':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'system':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
      case 'marketing':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
      case 'analytics':
        return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700'
    }
  }

  const getPriorityConfig = (priority: ActivityPriority) => {
    switch (priority) {
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const formatCurrency = (amount: number, currency: string = 'THB') => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const groupActivitiesByDate = () => {
    if (!groupByDate) return { 'All': filteredActivities }
    
    const groups: Record<string, ActivityItem[]> = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    filteredActivities.forEach(activity => {
      const activityDate = new Date(activity.timestamp)
      activityDate.setHours(0, 0, 0, 0)
      
      let groupKey: string
      if (activityDate.getTime() === today.getTime()) {
        groupKey = 'Today'
      } else if (activityDate.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday'
      } else {
        groupKey = activityDate.toLocaleDateString()
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(activity)
    })
    
    return groups
  }

  const activityTypes: ActivityType[] = ['order', 'customer', 'revenue', 'review', 'alert', 'system', 'marketing', 'analytics']
  const priorities: ActivityPriority[] = ['high', 'medium', 'low']
  const groupedActivities = groupActivitiesByDate()
  const unreadCount = activities.filter(a => a.status === 'new').length

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className={cn('flex items-center gap-2', compact ? 'text-lg' : 'text-xl')}>
              <Activity className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              {title}
            </CardTitle>
            
            {realtime && newActivityCount > 0 && (
              <Badge variant="secondary" className="animate-pulse">
                +{newActivityCount} new
              </Badge>
            )}
            
            {unreadCount > 0 && (
              <Badge variant="destructive">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8"
              >
                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              </Button>
            )}
            
            {onMarkAllAsRead && unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
              {activityTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedTypes(current =>
                      current.includes(type)
                        ? current.filter(t => t !== type)
                        : [...current, type]
                    )
                  }}
                  className="h-7 px-2 text-xs capitalize"
                >
                  {getActivityIcon(type)}
                  <span className="ml-1">{type}</span>
                </Button>
              ))}
            </div>
            
            {showPriority && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                {priorities.map(priority => (
                  <Button
                    key={priority}
                    variant={selectedPriorities.includes(priority) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPriorities(current =>
                        current.includes(priority)
                          ? current.filter(p => p !== priority)
                          : [...current, priority]
                      )
                    }}
                    className="h-7 px-2 text-xs capitalize"
                  >
                    <div className={cn('w-2 h-2 rounded-full mr-1', getPriorityConfig(priority).dot)} />
                    {priority}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className={cn('p-0', compact && 'p-0')}>
        {filteredActivities.length === 0 ? (
          <div className="p-6 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No activities to display</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
              <div key={dateGroup}>
                {groupByDate && (
                  <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {dateGroup}
                    </h4>
                  </div>
                )}
                
                {groupActivities.map((activity, index) => {
                  const priorityConfig = getPriorityConfig(activity.priority)
                  
                  return (
                    <div
                      key={activity.id}
                      className={cn(
                        'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
                        'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                        activity.status === 'new' && 'bg-blue-50 dark:bg-blue-900/10',
                        onActivityClick && 'cursor-pointer'
                      )}
                      onClick={() => onActivityClick?.(activity)}
                    >
                      <div className={cn('p-4 flex gap-3', compact && 'p-3')}>
                        {/* Icon */}
                        <div className={cn(
                          'p-2 rounded-lg flex-shrink-0',
                          getActivityColor(activity.type),
                          compact && 'p-1.5'
                        )}>
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={cn(
                              'font-medium text-gray-900 dark:text-gray-100 line-clamp-1',
                              compact ? 'text-sm' : 'text-base'
                            )}>
                              {activity.title}
                            </h4>
                            
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              {showPriority && (
                                <div className={cn('w-2 h-2 rounded-full', priorityConfig.dot)} />
                              )}
                              {activity.status === 'new' && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          
                          <p className={cn(
                            'text-gray-600 dark:text-gray-400 line-clamp-2 mb-2',
                            compact ? 'text-xs' : 'text-sm'
                          )}>
                            {activity.description}
                          </p>
                          
                          {/* Metadata */}
                          {activity.metadata && (
                            <div className="flex items-center gap-3 mb-2">
                              {activity.metadata.amount && (
                                <span className={cn(
                                  'font-medium text-green-600',
                                  compact ? 'text-xs' : 'text-sm'
                                )}>
                                  {formatCurrency(activity.metadata.amount, activity.metadata.currency)}
                                </span>
                              )}
                              {activity.metadata.location && (
                                <span className={cn(
                                  'text-gray-500 flex items-center gap-1',
                                  compact ? 'text-xs' : 'text-sm'
                                )}>
                                  <MapPin className="h-3 w-3" />
                                  {activity.metadata.location}
                                </span>
                              )}
                              {activity.metadata.rating && (
                                <span className={cn(
                                  'text-yellow-600 flex items-center gap-1',
                                  compact ? 'text-xs' : 'text-sm'
                                )}>
                                  <Star className="h-3 w-3 fill-current" />
                                  {activity.metadata.rating}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {activity.actor && (
                                <div className="flex items-center gap-2">
                                  <Avatar className={compact ? 'h-4 w-4' : 'h-5 w-5'}>
                                    <AvatarImage src={activity.actor.avatar} />
                                    <AvatarFallback className="text-xs">
                                      {activity.actor.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className={cn(
                                    'text-gray-600 dark:text-gray-400',
                                    compact ? 'text-xs' : 'text-sm'
                                  )}>
                                    {activity.actor.name}
                                  </span>
                                </div>
                              )}
                              
                              {showTimestamp && (
                                <span className={cn(
                                  'text-gray-500 dark:text-gray-400 flex items-center gap-1',
                                  compact ? 'text-xs' : 'text-sm'
                                )}>
                                  <Clock className="h-3 w-3" />
                                  {formatTimeAgo(activity.timestamp)}
                                </span>
                              )}
                            </div>
                            
                            {/* Actions */}
                            {showActions && activity.actions && activity.actions.length > 0 && (
                              <div className="flex items-center gap-1">
                                {activity.actions.map((action, actionIndex) => (
                                  <Button
                                    key={actionIndex}
                                    variant={action.primary ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (action.url) {
                                        window.open(action.url, '_blank')
                                      }
                                      action.onClick?.()
                                      onActivityAction?.(activity, actionIndex)
                                    }}
                                    className={compact ? 'h-6 px-2 text-xs' : 'h-7 px-3 text-xs'}
                                  >
                                    {action.label}
                                    {action.url && <ExternalLink className="ml-1 h-3 w-3" />}
                                  </Button>
                                ))}
                                
                                {onMarkAsRead && activity.status === 'new' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onMarkAsRead(activity.id)
                                    }}
                                    className={compact ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivityFeed