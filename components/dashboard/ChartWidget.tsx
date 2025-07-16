"use client"

import React, { useState, useMemo } from 'react'
import { cn } from '../../lib/utils'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import {
  MoreHorizontal,
  Download,
  Expand,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Maximize2
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export type ChartType = 'line' | 'area' | 'bar' | 'pie'

export interface ChartDataPoint {
  [key: string]: any
  name?: string
  value?: number
  date?: string
}

export interface ChartSeries {
  dataKey: string
  name: string
  color: string
  type?: 'monotone' | 'linear' | 'basis'
}

interface ChartWidgetProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  series: ChartSeries[]
  type: ChartType
  height?: number
  loading?: boolean
  error?: string
  timeRange?: string
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  interactive?: boolean
  animated?: boolean
  gradient?: boolean
  referenceLines?: Array<{ value: number; label?: string; color?: string }>
  onTimeRangeChange?: (range: string) => void
  onExport?: () => void
  onExpand?: () => void
  onRefresh?: () => void
  className?: string
  formatValue?: (value: any) => string
  formatTooltip?: (value: any, name: string) => [string, string]
}

const COLORS = [
  '#74C365', // Primary
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#F97316', // Orange
  '#6366F1', // Indigo
]

export function ChartWidget({
  title,
  description,
  data,
  series,
  type,
  height = 300,
  loading = false,
  error,
  timeRange,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  interactive = true,
  animated = true,
  gradient = false,
  referenceLines = [],
  onTimeRangeChange,
  onExport,
  onExpand,
  onRefresh,
  className,
  formatValue = (value) => value?.toString() || '',
  formatTooltip
}: ChartWidgetProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null)

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' }
  ]

  const chartProps = useMemo(() => ({
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  }), [data])

  const customTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatTooltip ? formatTooltip(entry.value, entry.name)[0] : formatValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const renderChart = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-primary-600" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <Activity className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <BarChart3 className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      ...chartProps,
      onMouseEnter: interactive ? (data: any, index: number) => setActiveIndex(index) : undefined,
      onMouseLeave: interactive ? () => setActiveIndex(null) : undefined
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
              <XAxis 
                dataKey="name" 
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
              {showTooltip && <Tooltip content={customTooltip} />}
              {showLegend && <Legend />}
              {referenceLines.map((line, index) => (
                <ReferenceLine
                  key={index}
                  y={line.value}
                  stroke={line.color || '#8b5cf6'}
                  strokeDasharray="5 5"
                  label={line.label}
                />
              ))}
              {series.map((s, index) => (
                <Line
                  key={s.dataKey}
                  type={s.type || 'monotone'}
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ fill: s.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: s.color }}
                  animationDuration={animated ? 1000 : 0}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              {gradient && (
                <defs>
                  {series.map((s, index) => (
                    <linearGradient key={s.dataKey} id={`gradient-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
              )}
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
              <XAxis 
                dataKey="name" 
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
              {showTooltip && <Tooltip content={customTooltip} />}
              {showLegend && <Legend />}
              {series.map((s, index) => (
                <Area
                  key={s.dataKey}
                  type={s.type || 'monotone'}
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color}
                  fill={gradient ? `url(#gradient-${s.dataKey})` : s.color}
                  fillOpacity={gradient ? 1 : 0.3}
                  strokeWidth={2}
                  animationDuration={animated ? 1000 : 0}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
              <XAxis 
                dataKey="name" 
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
              {showTooltip && <Tooltip content={customTooltip} />}
              {showLegend && <Legend />}
              {series.map((s, index) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.color}
                  radius={[4, 4, 0, 0]}
                  animationDuration={animated ? 1000 : 0}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(height * 0.3, 80)}
                fill="#8884d8"
                dataKey="value"
                animationDuration={animated ? 1000 : 0}
                onMouseEnter={(_, index) => interactive && setActiveIndex(index)}
                onMouseLeave={() => interactive && setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke={activeIndex === index ? '#ffffff' : 'none'}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              {showTooltip && <Tooltip content={customTooltip} />}
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  const getChartIcon = () => {
    switch (type) {
      case 'line':
        return <TrendingUp className="h-4 w-4" />
      case 'pie':
        return <PieChartIcon className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {getChartIcon()}
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
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
                      'px-3 py-1 text-xs font-medium rounded-md transition-colors',
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
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                </Button>
              )}
              {onExport && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExport}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {onExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExpand}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div style={{ height }}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}

export default ChartWidget