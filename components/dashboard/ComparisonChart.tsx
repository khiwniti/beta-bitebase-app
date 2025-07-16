"use client"

import React, { useMemo } from 'react'
import { cn } from '../../lib/utils'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MoreHorizontal,
  Download,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export interface ComparisonDataPoint {
  period: string
  current: number
  previous: number
  label?: string
  metadata?: Record<string, any>
}

export interface ComparisonChartProps {
  title: string
  description?: string
  data: ComparisonDataPoint[]
  currentLabel?: string
  previousLabel?: string
  type?: 'bar' | 'line'
  metric?: string
  unit?: string
  format?: 'number' | 'currency' | 'percentage' | 'decimal'
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTrendline?: boolean
  showComparison?: boolean
  comparisonType?: 'period-over-period' | 'year-over-year' | 'custom'
  colors?: {
    current: string
    previous: string
    trend?: string
  }
  onPeriodChange?: (period: string) => void
  onExport?: () => void
  onRefresh?: () => void
  className?: string
}

export function ComparisonChart({
  title,
  description,
  data,
  currentLabel = 'Current Period',
  previousLabel = 'Previous Period',
  type = 'bar',
  metric = 'Value',
  unit,
  format = 'number',
  height = 400,
  showGrid = true,
  showLegend = true,
  showTrendline = false,
  showComparison = true,
  comparisonType = 'period-over-period',
  colors = {
    current: '#74C365',
    previous: '#94a3b8',
    trend: '#3B82F6'
  },
  onPeriodChange,
  onExport,
  onRefresh,
  className
}: ComparisonChartProps) {

  // Calculate comparison metrics
  const comparisonMetrics = useMemo(() => {
    if (data.length === 0) return null

    const totalCurrent = data.reduce((sum, item) => sum + item.current, 0)
    const totalPrevious = data.reduce((sum, item) => sum + item.previous, 0)
    
    const change = totalCurrent - totalPrevious
    const changePercentage = totalPrevious !== 0 ? (change / totalPrevious) * 100 : 0
    
    const avgCurrent = totalCurrent / data.length
    const avgPrevious = totalPrevious / data.length
    
    // Find best and worst performing periods
    const performances = data.map(item => ({
      period: item.period,
      change: item.current - item.previous,
      changePercentage: item.previous !== 0 ? ((item.current - item.previous) / item.previous) * 100 : 0
    }))
    
    const bestPeriod = performances.reduce((best, current) => 
      current.changePercentage > best.changePercentage ? current : best
    )
    
    const worstPeriod = performances.reduce((worst, current) => 
      current.changePercentage < worst.changePercentage ? current : worst
    )

    return {
      totalCurrent,
      totalPrevious,
      change,
      changePercentage,
      avgCurrent,
      avgPrevious,
      bestPeriod,
      worstPeriod,
      trend: changePercentage > 0 ? 'up' : changePercentage < 0 ? 'down' : 'neutral'
    }
  }, [data])

  const formatValue = (value: number) => {
    switch (format) {
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
      default:
        return value.toLocaleString()
    }
  }

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const current = payload.find((p: any) => p.dataKey === 'current')
    const previous = payload.find((p: any) => p.dataKey === 'previous')
    
    if (!current || !previous) return null

    const change = current.value - previous.value
    const changePercentage = previous.value !== 0 ? (change / previous.value) * 100 : 0

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.current }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{currentLabel}:</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatValue(current.value)}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.previous }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{previousLabel}:</span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatValue(previous.value)}
            </span>
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Change:</span>
              <div className={cn(
                'text-sm font-medium flex items-center gap-1',
                change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
              )}>
                {change > 0 ? <ArrowUpRight className="h-3 w-3" /> :
                 change < 0 ? <ArrowDownRight className="h-3 w-3" /> :
                 <Minus className="h-3 w-3" />}
                <span>{change > 0 ? '+' : ''}{formatValue(Math.abs(change))}</span>
                <span className="text-xs">({changePercentage > 0 ? '+' : ''}{changePercentage.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const periodOptions = [
    { label: 'This Week vs Last Week', value: 'week' },
    { label: 'This Month vs Last Month', value: 'month' },
    { label: 'This Quarter vs Last Quarter', value: 'quarter' },
    { label: 'This Year vs Last Year', value: 'year' }
  ]

  if (!comparisonMetrics || data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No comparison data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onPeriodChange && (
              <select
                onChange={(e) => onPeriodChange(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {showComparison && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatValue(comparisonMetrics.totalCurrent)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{currentLabel}</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                {formatValue(comparisonMetrics.totalPrevious)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{previousLabel}</div>
            </div>
            
            <div className="text-center">
              <div className={cn(
                'text-2xl font-bold flex items-center justify-center gap-1',
                comparisonMetrics.trend === 'up' ? 'text-green-600' :
                comparisonMetrics.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              )}>
                {comparisonMetrics.trend === 'up' ? <TrendingUp className="h-5 w-5" /> :
                 comparisonMetrics.trend === 'down' ? <TrendingDown className="h-5 w-5" /> :
                 <Minus className="h-5 w-5" />}
                <span>{comparisonMetrics.changePercentage > 0 ? '+' : ''}{comparisonMetrics.changePercentage.toFixed(1)}%</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Change</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {comparisonMetrics.bestPeriod.changePercentage > 0 ? '+' : ''}
                {comparisonMetrics.bestPeriod.changePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Best: {comparisonMetrics.bestPeriod.period}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                <XAxis 
                  dataKey="period" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={formatValue}
                />
                <Tooltip content={customTooltip} />
                {showLegend && <Legend />}
                
                <Bar 
                  dataKey="previous" 
                  name={previousLabel}
                  fill={colors.previous}
                  radius={[2, 2, 0, 0]}
                  opacity={0.8}
                />
                <Bar 
                  dataKey="current" 
                  name={currentLabel}
                  fill={colors.current}
                  radius={[2, 2, 0, 0]}
                />
                
                {showTrendline && comparisonMetrics.avgCurrent && (
                  <ReferenceLine
                    y={comparisonMetrics.avgCurrent}
                    stroke={colors.trend}
                    strokeDasharray="5 5"
                    label={{ value: `Avg: ${formatValue(comparisonMetrics.avgCurrent)}`, position: 'top' }}
                  />
                )}
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                <XAxis 
                  dataKey="period" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={formatValue}
                />
                <Tooltip content={customTooltip} />
                {showLegend && <Legend />}
                
                <Line
                  type="monotone"
                  dataKey="previous"
                  name={previousLabel}
                  stroke={colors.previous}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: colors.previous, strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  name={currentLabel}
                  stroke={colors.current}
                  strokeWidth={3}
                  dot={{ fill: colors.current, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: colors.current }}
                />
                
                {showTrendline && comparisonMetrics.avgCurrent && (
                  <ReferenceLine
                    y={comparisonMetrics.avgCurrent}
                    stroke={colors.trend}
                    strokeDasharray="5 5"
                    label={{ value: `Avg: ${formatValue(comparisonMetrics.avgCurrent)}`, position: 'top' }}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        {showComparison && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Performance Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Change:</span>
                    <span className={cn(
                      'font-medium',
                      comparisonMetrics.change > 0 ? 'text-green-600' :
                      comparisonMetrics.change < 0 ? 'text-red-600' : 'text-gray-600'
                    )}>
                      {comparisonMetrics.change > 0 ? '+' : ''}{formatValue(comparisonMetrics.change)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average {currentLabel}:</span>
                    <span className="font-medium">{formatValue(comparisonMetrics.avgCurrent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average {previousLabel}:</span>
                    <span className="font-medium">{formatValue(comparisonMetrics.avgPrevious)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Period Analysis
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Best Period:</span>
                    <div className="text-right">
                      <div className="font-medium">{comparisonMetrics.bestPeriod.period}</div>
                      <div className="text-green-600">
                        +{comparisonMetrics.bestPeriod.changePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Worst Period:</span>
                    <div className="text-right">
                      <div className="font-medium">{comparisonMetrics.worstPeriod.period}</div>
                      <div className="text-red-600">
                        {comparisonMetrics.worstPeriod.changePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ComparisonChart