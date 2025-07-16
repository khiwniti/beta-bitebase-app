"use client"

import React, { useMemo, useState } from 'react'
import { cn } from '../../lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Award,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
  Zap,
  Eye,
  Clock,
  ArrowUp,
  ArrowDown,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'

export interface StatisticItem {
  id: string
  title: string
  value: number
  previousValue?: number
  target?: number
  unit?: string
  prefix?: string
  suffix?: string
  icon: React.ReactNode
  color: string
  category: 'revenue' | 'customers' | 'orders' | 'performance' | 'engagement'
  format: 'number' | 'currency' | 'percentage' | 'decimal' | 'time'
  trend?: {
    value: number
    period: string
    direction: 'up' | 'down' | 'neutral'
  }
  benchmark?: {
    type: 'industry' | 'competitor' | 'goal'
    value: number
    label: string
  }
  historical?: Array<{
    period: string
    value: number
  }>
}

export interface StatisticsOverviewProps {
  statistics: StatisticItem[]
  title?: string
  description?: string
  timeRange?: string
  showTrends?: boolean
  showTargets?: boolean
  showBenchmarks?: boolean
  showSparklines?: boolean
  compactMode?: boolean
  groupByCategory?: boolean
  onTimeRangeChange?: (range: string) => void
  onStatisticClick?: (statistic: StatisticItem) => void
  className?: string
}

// Mini sparkline component
function Sparkline({ data, color, height = 40 }: { 
  data: Array<{ period: string; value: number }>
  color: string
  height?: number 
}) {
  if (!data || data.length < 2) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = range > 0 ? ((maxValue - item.value) / range) * 100 : 50
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="relative" style={{ height }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

// Individual statistic card
function StatisticCard({ 
  statistic,
  showTrend = true,
  showTarget = true,
  showBenchmark = true,
  showSparkline = true,
  compact = false,
  onClick
}: {
  statistic: StatisticItem
  showTrend?: boolean
  showTarget?: boolean
  showBenchmark?: boolean
  showSparkline?: boolean
  compact?: boolean
  onClick?: () => void
}) {
  
  const formatValue = (value: number) => {
    switch (statistic.format) {
      case 'currency':
        return new Intl.NumberFormat('th-TH', {
          style: 'currency',
          currency: 'THB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'decimal':
        return value.toFixed(2)
      case 'time':
        return `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`
      default:
        return value.toLocaleString()
    }
  }

  const getTrendCalculation = () => {
    if (!statistic.previousValue || statistic.previousValue === 0) return null
    
    const change = ((statistic.value - statistic.previousValue) / statistic.previousValue) * 100
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral' as const,
      period: 'vs previous'
    }
  }

  const getTargetProgress = () => {
    if (!statistic.target) return null
    return Math.min((statistic.value / statistic.target) * 100, 100)
  }

  const getBenchmarkComparison = () => {
    if (!statistic.benchmark) return null
    
    const difference = statistic.value - statistic.benchmark.value
    const percentage = (difference / statistic.benchmark.value) * 100
    
    return {
      difference,
      percentage: Math.abs(percentage),
      isAbove: difference > 0
    }
  }

  const trend = statistic.trend || getTrendCalculation()
  const targetProgress = getTargetProgress()
  const benchmarkComparison = getBenchmarkComparison()

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    const iconClass = compact ? 'h-3 w-3' : 'h-4 w-4'
    switch (direction) {
      case 'up':
        return <TrendingUp className={`${iconClass} text-green-600`} />
      case 'down':
        return <TrendingDown className={`${iconClass} text-red-600`} />
      default:
        return <Minus className={`${iconClass} text-gray-500`} />
    }
  }

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-md',
        onClick && 'cursor-pointer hover:scale-[1.02] transform-gpu',
        compact && 'p-3'
      )}
      onClick={onClick}
    >
      <CardHeader className={cn('pb-2', compact && 'pb-1')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                'p-2 rounded-lg',
                compact && 'p-1.5'
              )}
              style={{ backgroundColor: `${statistic.color}20` }}
            >
              <div 
                className={cn(
                  compact ? 'w-4 h-4' : 'w-5 h-5'
                )}
                style={{ color: statistic.color }}
              >
                {statistic.icon}
              </div>
            </div>
            <div>
              <CardTitle className={cn(
                'font-medium text-gray-700 dark:text-gray-300',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {statistic.title}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={cn(
                  'mt-1 text-xs capitalize',
                  compact && 'text-xs px-1.5 py-0.5'
                )}
              >
                {statistic.category}
              </Badge>
            </div>
          </div>
          
          {!compact && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn('space-y-3', compact && 'space-y-2')}>
        {/* Value */}
        <div className="space-y-1">
          <div className={cn(
            'font-bold text-gray-900 dark:text-gray-100',
            compact ? 'text-lg' : 'text-2xl lg:text-3xl'
          )}>
            {statistic.prefix}{formatValue(statistic.value)}{statistic.suffix}
          </div>
          
          {/* Trend */}
          {showTrend && trend && (
            <div className={cn('flex items-center gap-1', getTrendColor(trend.direction as 'up' | 'down' | 'neutral'))}>
              {getTrendIcon(trend.direction as 'up' | 'down' | 'neutral')}
              <span className={cn(
                'font-medium',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {trend.value.toFixed(1)}%
              </span>
              <span className={cn(
                'text-gray-500',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {trend.period || 'vs previous'}
              </span>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {showSparkline && statistic.historical && statistic.historical.length > 1 && (
          <div className="pt-2">
            <Sparkline 
              data={statistic.historical} 
              color={statistic.color}
              height={compact ? 30 : 40}
            />
          </div>
        )}

        {/* Target Progress */}
        {showTarget && statistic.target && targetProgress !== null && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={cn(
                'text-gray-600 dark:text-gray-400',
                compact ? 'text-xs' : 'text-sm'
              )}>
                Target: {formatValue(statistic.target)}
              </span>
              <span className={cn(
                'font-medium',
                compact ? 'text-xs' : 'text-sm',
                targetProgress >= 100 ? 'text-green-600' : 'text-gray-600'
              )}>
                {Math.round(targetProgress)}%
              </span>
            </div>
            <Progress 
              value={targetProgress} 
              className={cn('h-2', compact && 'h-1.5')}
            />
          </div>
        )}

        {/* Benchmark Comparison */}
        {showBenchmark && statistic.benchmark && benchmarkComparison && (
          <div className={cn(
            'flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg',
            compact && 'p-1.5'
          )}>
            <div>
              <div className={cn(
                'font-medium text-gray-900 dark:text-gray-100',
                compact ? 'text-xs' : 'text-sm'
              )}>
                vs {statistic.benchmark.label}
              </div>
              <div className={cn(
                'text-gray-600 dark:text-gray-400',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {formatValue(statistic.benchmark.value)}
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-1',
              benchmarkComparison.isAbove ? 'text-green-600' : 'text-red-600'
            )}>
              {benchmarkComparison.isAbove ? (
                <ArrowUp className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
              ) : (
                <ArrowDown className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
              )}
              <span className={cn(
                'font-medium',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {benchmarkComparison.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function StatisticsOverview({
  statistics,
  title = 'Statistics Overview',
  description = 'Key performance metrics and trends',
  timeRange = '30d',
  showTrends = true,
  showTargets = true,
  showBenchmarks = true,
  showSparklines = true,
  compactMode = false,
  groupByCategory = true,
  onTimeRangeChange,
  onStatisticClick,
  className
}: StatisticsOverviewProps) {
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ]

  const categorizedStats = useMemo(() => {
    if (!groupByCategory) {
      return { 'All': statistics }
    }

    const categories = statistics.reduce((acc, stat) => {
      if (!acc[stat.category]) {
        acc[stat.category] = []
      }
      acc[stat.category].push(stat)
      return acc
    }, {} as Record<string, StatisticItem[]>)

    return categories
  }, [statistics, groupByCategory])

  const filteredStats = useMemo(() => {
    if (!selectedCategory) return statistics
    return statistics.filter(stat => stat.category === selectedCategory)
  }, [statistics, selectedCategory])

  const categoryIcons = {
    revenue: <DollarSign className="h-4 w-4" />,
    customers: <Users className="h-4 w-4" />,
    orders: <ShoppingCart className="h-4 w-4" />,
    performance: <Activity className="h-4 w-4" />,
    engagement: <Eye className="h-4 w-4" />
  }

  const categoryLabels = {
    revenue: 'Revenue',
    customers: 'Customers', 
    orders: 'Orders',
    performance: 'Performance',
    engagement: 'Engagement'
  }

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalStats = statistics.length
    const positiveStats = statistics.filter(s => {
      const trend = s.trend || (s.previousValue ? {
        direction: s.value > s.previousValue ? 'up' : s.value < s.previousValue ? 'down' : 'neutral'
      } : null)
      return trend?.direction === 'up'
    }).length
    
    const targetsReached = statistics.filter(s => 
      s.target && s.value >= s.target
    ).length

    return {
      total: totalStats,
      positive: positiveStats,
      targetsReached,
      positivePercentage: totalStats > 0 ? (positiveStats / totalStats) * 100 : 0
    }
  }, [statistics])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          {onTimeRangeChange && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => onTimeRangeChange(range.value)}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    timeRange === range.value
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Metrics</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{summaryStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Positive Trends</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{summaryStats.positive}</div>
            <div className="text-sm text-green-600">
              {summaryStats.positivePercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Targets Reached</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{summaryStats.targetsReached}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Performance</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summaryStats.positivePercentage > 75 ? 'Excellent' : 
               summaryStats.positivePercentage > 50 ? 'Good' : 'Needs Attention'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      {groupByCategory && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All ({statistics.length})
          </Button>
          {Object.keys(categorizedStats).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {categoryIcons[category as keyof typeof categoryIcons]}
              <span className="ml-1">
                {categoryLabels[category as keyof typeof categoryLabels] || category} 
                ({categorizedStats[category].length})
              </span>
            </Button>
          ))}
        </div>
      )}

      {/* Statistics Grid */}
      {groupByCategory && !selectedCategory ? (
        // Group by category
        Object.entries(categorizedStats).map(([category, categoryStats]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-gray-600 dark:text-gray-400">
                {categoryIcons[category as keyof typeof categoryIcons]}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </h3>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>
            
            <div className={cn(
              'grid gap-4',
              compactMode 
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            )}>
              {categoryStats.map((statistic) => (
                <StatisticCard
                  key={statistic.id}
                  statistic={statistic}
                  showTrend={showTrends}
                  showTarget={showTargets}
                  showBenchmark={showBenchmarks}
                  showSparkline={showSparklines}
                  compact={compactMode}
                  onClick={() => onStatisticClick?.(statistic)}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        // Show filtered stats or all stats
        <div className={cn(
          'grid gap-4',
          compactMode 
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}>
          {filteredStats.map((statistic) => (
            <StatisticCard
              key={statistic.id}
              statistic={statistic}
              showTrend={showTrends}
              showTarget={showTargets}
              showBenchmark={showBenchmarks}
              showSparkline={showSparklines}
              compact={compactMode}
              onClick={() => onStatisticClick?.(statistic)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StatisticsOverview