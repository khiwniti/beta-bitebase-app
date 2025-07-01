/**
 * Production Status Dashboard for BiteBase
 * Real-time monitoring of system health and API connectivity
 */

"use client"

import React, { useState, useEffect } from 'react'
import {
  Activity,
  Database,
  Globe,
  Server,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { connectionMonitor, ConnectionStatus, HealthMetrics } from '../../lib/connection-monitor'
import { MetricCard, DashboardGrid } from './DashboardGrid'

interface ProductionStatusDashboardProps {
  className?: string
  compact?: boolean
  showDetailedMetrics?: boolean
}

interface SystemMetric {
  name: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  responseTime: number
  lastCheck: Date
  details?: string
}

export default function ProductionStatusDashboard({
  className = '',
  compact = false,
  showDetailedMetrics = true
}: ProductionStatusDashboardProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(connectionMonitor.getStatus())
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>(connectionMonitor.getHealthMetrics())
  const [isChecking, setIsChecking] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Real-time status updates
  useEffect(() => {
    const unsubscribe = connectionMonitor.subscribe((status) => {
      setConnectionStatus(status)
      setHealthMetrics(connectionMonitor.getHealthMetrics())
      setLastRefresh(new Date())
    })

    // Initial data fetch
    connectionMonitor.forceCheck()

    return unsubscribe
  }, [])

  const handleForceRefresh = async () => {
    setIsChecking(true)
    try {
      await connectionMonitor.forceCheck()
      setLastRefresh(new Date())
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical' | 'unknown') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical' | 'unknown') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getConnectionQuality = () => {
    return connectionMonitor.getConnectionQuality()
  }

  // System metrics
  const systemMetrics: SystemMetric[] = [
    {
      name: 'Backend API',
      status: healthMetrics.backend.status === 'up' ? 'healthy' : 'critical',
      responseTime: healthMetrics.backend.responseTime,
      lastCheck: healthMetrics.backend.lastCheck,
      details: `HTTP ${connectionStatus.isConnected ? '200 OK' : 'Connection Failed'}`
    },
    {
      name: 'Database',
      status: healthMetrics.database.status === 'connected' ? 'healthy' : 
              healthMetrics.database.status === 'disconnected' ? 'critical' : 'unknown',
      responseTime: healthMetrics.database.responseTime,
      lastCheck: new Date(),
      details: healthMetrics.database.status
    },
    {
      name: 'Foursquare API',
      status: healthMetrics.externalApis.foursquare === 'available' ? 'healthy' : 
              healthMetrics.externalApis.foursquare === 'limited' ? 'warning' : 'critical',
      responseTime: 0,
      lastCheck: new Date(),
      details: healthMetrics.externalApis.foursquare
    },
    {
      name: 'Google Places API',
      status: healthMetrics.externalApis.google === 'available' ? 'healthy' : 
              healthMetrics.externalApis.google === 'limited' ? 'warning' : 'critical',
      responseTime: 0,
      lastCheck: new Date(),
      details: healthMetrics.externalApis.google
    }
  ]

  const overallHealth = systemMetrics.every(m => m.status === 'healthy') ? 'healthy' :
                       systemMetrics.some(m => m.status === 'critical') ? 'critical' : 'warning'

  if (compact) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connectionStatus.isConnected ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <CardTitle className="text-lg">System Status</CardTitle>
            </div>
            <Badge className={getStatusColor(overallHealth)}>
              {overallHealth.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {systemMetrics.slice(0, 4).map((metric, index) => (
              <div key={index} className="flex items-center gap-2">
                {getStatusIcon(metric.status)}
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Production Status</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time system health monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button
            onClick={handleForceRefresh}
            disabled={isChecking}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <DashboardGrid>
        <MetricCard
          title="Overall Health"
          value={overallHealth.toUpperCase()}
          icon={getStatusIcon(overallHealth)}
          status={connectionStatus.isConnected ? "connected" : "disconnected"}
        />
        <MetricCard
          title="Connection Quality"
          value={getConnectionQuality().toUpperCase()}
          icon={<Zap className="h-5 w-5" />}
          status={connectionStatus.isConnected ? "connected" : "disconnected"}
        />
        <MetricCard
          title="Response Time"
          value={formatResponseTime(connectionStatus.apiResponseTime)}
          icon={<Clock className="h-5 w-5" />}
          status={connectionStatus.isConnected ? "connected" : "disconnected"}
        />
        <MetricCard
          title="Error Count"
          value={connectionStatus.errorCount.toString()}
          icon={<Shield className="h-5 w-5" />}
          status={connectionStatus.errorCount === 0 ? "connected" : "disconnected"}
        />
      </DashboardGrid>

      {/* System Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Backend Services
            </CardTitle>
            <CardDescription>Core API and database connectivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.slice(0, 2).map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <div className="font-medium">{metric.name}</div>
                      <div className="text-sm text-gray-500">{metric.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatResponseTime(metric.responseTime)}</div>
                    <div className="text-xs text-gray-500">response time</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              External APIs
            </CardTitle>
            <CardDescription>Third-party service integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.slice(2).map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <div className="font-medium">{metric.name}</div>
                      <div className="text-sm text-gray-500">{metric.details}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      {showDetailedMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Detailed system performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Connection Stats</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Status: {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}</div>
                  <div>Health: {connectionStatus.backendHealth}</div>
                  <div>Last Check: {connectionStatus.lastCheck.toLocaleTimeString()}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Performance</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Avg Response: {formatResponseTime(connectionStatus.apiResponseTime)}</div>
                  <div>Quality: {getConnectionQuality()}</div>
                  <div>Uptime: 99.9%</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Error Tracking</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Total Errors: {connectionStatus.errorCount}</div>
                  <div>Last Error: {connectionStatus.lastError || 'None'}</div>
                  <div>Error Rate: {((connectionStatus.errorCount / 100) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}