"use client"

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'
import {
  Zap,
  Wifi,
  WifiOff,
  RefreshCw,
  Pause,
  Play,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export interface RealtimeDataPoint {
  id: string
  timestamp: Date
  value: number
  label?: string
  metadata?: Record<string, any>
}

export interface RealtimeWidgetProps {
  title: string
  description?: string
  dataPoints: RealtimeDataPoint[]
  currentValue?: number
  unit?: string
  prefix?: string
  suffix?: string
  format?: 'number' | 'currency' | 'percentage' | 'decimal'
  updateInterval?: number
  maxDataPoints?: number
  showTrend?: boolean
  showHistory?: boolean
  showStatus?: boolean
  autoRefresh?: boolean
  alertThreshold?: {
    high?: number
    low?: number
  }
  onDataUpdate?: (newData: RealtimeDataPoint) => void
  onAlert?: (type: 'high' | 'low', value: number) => void
  className?: string
  color?: string
}

export function RealtimeWidget({
  title,
  description,
  dataPoints,
  currentValue,
  unit,
  prefix,
  suffix,
  format = 'number',
  updateInterval = 5000,
  maxDataPoints = 50,
  showTrend = true,
  showHistory = true,
  showStatus = true,
  autoRefresh = true,
  alertThreshold,
  onDataUpdate,
  onAlert,
  className,
  color = '#74C365'
}: RealtimeWidgetProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [alertState, setAlertState] = useState<'normal' | 'high' | 'low'>('normal')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate real-time data updates
  useEffect(() => {
    if (!autoRefresh || isPaused) return

    intervalRef.current = setInterval(() => {
      // Simulate connection status
      const connected = Math.random() > 0.05 // 95% uptime
      setIsConnected(connected)

      if (connected) {
        // Generate simulated data point
        const newDataPoint: RealtimeDataPoint = {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          value: currentValue || Math.random() * 100,
          metadata: { simulated: true }
        }

        // Check for alerts
        if (alertThreshold) {
          if (alertThreshold.high && newDataPoint.value > alertThreshold.high) {
            setAlertState('high')
            onAlert?.('high', newDataPoint.value)
          } else if (alertThreshold.low && newDataPoint.value < alertThreshold.low) {
            setAlertState('low')
            onAlert?.('low', newDataPoint.value)
          } else {
            setAlertState('normal')
          }
        }

        onDataUpdate?.(newDataPoint)
        setLastUpdate(new Date())
      }
    }, updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, isPaused, updateInterval, currentValue, alertThreshold, onDataUpdate, onAlert])

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

  const getTrend = () => {
    if (dataPoints.length < 2) return null
    
    const recent = dataPoints.slice(-2)
    const [previous, current] = recent
    const change = ((current.value - previous.value) / previous.value) * 100
    
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral' as const
    }
  }

  const getStatusColor = () => {
    if (!isConnected) return 'text-red-500'
    if (alertState === 'high' || alertState === 'low') return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="h-4 w-4" />
    if (alertState === 'high' || alertState === 'low') return <AlertCircle className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected'
    if (alertState === 'high') return 'High Alert'
    if (alertState === 'low') return 'Low Alert'
    return 'Connected'
  }

  const trend = getTrend()
  const latestValue = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1].value : 0

  return (
    <Card className={cn('overflow-hidden relative', className)}>
      {/* Realtime indicator */}
      <div className="absolute top-2 right-2 z-10">
        <div className={cn(
          'w-3 h-3 rounded-full',
          isConnected && !isPaused ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        )} />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5" style={{ color }} />
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="h-8 w-8 p-0"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLastUpdate(new Date())}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status */}
        {showStatus && (
          <div className="flex items-center justify-between pt-2">
            <div className={cn('flex items-center gap-2 text-sm', getStatusColor())}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Value */}
        <div className="space-y-2">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {prefix}{formatValue(currentValue ?? latestValue)}{suffix}
            {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
          </div>
          
          {/* Trend */}
          {showTrend && trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm',
              trend.direction === 'up' ? 'text-green-600' : 
              trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
            )}>
              {trend.direction === 'up' ? <TrendingUp className="h-4 w-4" /> :
               trend.direction === 'down' ? <TrendingDown className="h-4 w-4" /> :
               <Activity className="h-4 w-4" />}
              <span className="font-medium">{trend.value.toFixed(1)}%</span>
              <span className="text-gray-500">from previous</span>
            </div>
          )}
        </div>

        {/* Mini Chart */}
        {showHistory && dataPoints.length > 1 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Activity
              </span>
              <Badge variant="secondary" className="text-xs">
                {dataPoints.length} points
              </Badge>
            </div>
            
            <div className="h-16 relative" ref={containerRef}>
              <MiniChart 
                data={dataPoints.slice(-20)} // Show last 20 points
                color={color}
                width={containerRef.current?.clientWidth || 300}
                height={64}
              />
            </div>
          </div>
        )}

        {/* Alert Thresholds */}
        {alertThreshold && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Alert Thresholds
            </span>
            <div className="flex gap-4 text-xs">
              {alertThreshold.high && (
                <div className="flex items-center gap-1 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  High: {formatValue(alertThreshold.high)}
                </div>
              )}
              {alertThreshold.low && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  Low: {formatValue(alertThreshold.low)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connection Info */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Update Interval: {updateInterval / 1000}s</span>
            <span>Max Points: {maxDataPoints}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mini chart component for realtime data visualization
function MiniChart({ 
  data, 
  color, 
  width, 
  height 
}: { 
  data: RealtimeDataPoint[]
  color: string
  width: number
  height: number
}) {
  if (data.length < 2) return null

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width
    const y = range > 0 ? ((maxValue - item.value) / range) * (height - 20) + 10 : height / 2
    return `${x},${y}`
  }).join(' ')

  // Create gradient for area fill
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <svg width={width} height={height} className="absolute inset-0">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      
      {/* Area */}
      <polygon
        fill={`url(#${gradientId})`}
        points={`0,${height} ${points} ${width},${height}`}
      />
      
      {/* Line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Points */}
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * width
        const y = range > 0 ? ((maxValue - item.value) / range) * (height - 20) + 10 : height / 2
        return (
          <circle
            key={item.id}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity={index === data.length - 1 ? 1 : 0.6}
          />
        )
      })}
    </svg>
  )
}

export default RealtimeWidget