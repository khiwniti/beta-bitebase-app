"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  ChefHat,
  Clock,
  Users,
  Utensils,
  AlertTriangle,
  CheckCircle,
  Timer,
  Activity,
  Zap,
  Target,
  RefreshCw,
  Download,
  Settings,
  Workflow,
  Gauge,
  AlertCircle,
  PlayCircle,
  PauseCircle
} from "lucide-react"

// Simplified Kitchen Operations Interfaces
interface SimpleKitchenMetrics {
  totalOrders: number
  completedOrders: number
  averageOrderTime: number
  onTimeDelivery: number
  kitchenEfficiency: number
  staffUtilization: number
  equipmentUptime: number
  qualityScore: number
}

interface SimpleKitchenStation {
  id: string
  name: string
  status: 'active' | 'idle' | 'maintenance'
  efficiency: number
  currentOrders: number
  averageTime: number
}

export default function SimpleKitchenOperationsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState<SimpleKitchenMetrics | null>(null)
  const [stations, setStations] = useState<SimpleKitchenStation[]>([])
  const [loading, setLoading] = useState(true)
  const [realTimeMode, setRealTimeMode] = useState(true)

  useEffect(() => {
    const generateSimpleData = () => {
      // Generate simple metrics
      setMetrics({
        totalOrders: 156,
        completedOrders: 142,
        averageOrderTime: 14.5,
        onTimeDelivery: 87.5,
        kitchenEfficiency: 84.2,
        staffUtilization: 78.9,
        equipmentUptime: 94.3,
        qualityScore: 4.3
      })

      // Generate simple stations
      setStations([
        {
          id: 'prep_1',
          name: 'Prep Station',
          status: 'active',
          efficiency: 87,
          currentOrders: 5,
          averageTime: 8.5
        },
        {
          id: 'wok_1',
          name: 'Wok Station',
          status: 'active',
          efficiency: 92,
          currentOrders: 8,
          averageTime: 12.3
        },
        {
          id: 'grill_1',
          name: 'Grill Station',
          status: 'maintenance',
          efficiency: 78,
          currentOrders: 3,
          averageTime: 15.2
        },
        {
          id: 'plating_1',
          name: 'Plating Station',
          status: 'active',
          efficiency: 89,
          currentOrders: 6,
          averageTime: 3.8
        }
      ])

      setLoading(false)
    }

    generateSimpleData()

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (realTimeMode) {
        generateSimpleData()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [realTimeMode])

  const getStationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'idle': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading kitchen operations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kitchen Operations Intelligence</h1>
          <p className="text-muted-foreground">
            Real-time kitchen workflow optimization and staff efficiency tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={realTimeMode ? "default" : "outline"}
            onClick={() => setRealTimeMode(!realTimeMode)}
          >
            {realTimeMode ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            {realTimeMode ? 'Pause' : 'Resume'} Live
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrders - metrics.completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.completedOrders} completed today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Time</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageOrderTime} min</div>
              <p className="text-xs text-muted-foreground">
                Target: 12 minutes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.onTimeDelivery}%</div>
              <p className="text-xs text-muted-foreground">
                +2.3% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kitchen Efficiency</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.kitchenEfficiency}%</div>
              <p className="text-xs text-muted-foreground">
                Optimal range: 80-90%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="stations">Station Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Kitchen Layout Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Kitchen Layout Status
              </CardTitle>
              <CardDescription>Real-time status of all kitchen stations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stations.map((station) => (
                  <div key={station.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{station.name}</h4>
                      <Badge className={getStationStatusColor(station.status)}>
                        {station.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Efficiency</span>
                        <span className="font-medium">{station.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${station.efficiency}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{station.currentOrders} orders</span>
                        <span>{station.averageTime} min avg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for kitchen operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Equipment Uptime</span>
                      <span className="font-medium">{metrics?.equipmentUptime}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${metrics?.equipmentUptime}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Score</span>
                      <span className="font-medium">{metrics?.qualityScore}/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(metrics?.qualityScore || 0) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Peak Efficiency</div>
                      <div className="text-xs text-gray-600">Most stations operating optimally</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-sm">Grill Station Warning</div>
                      <div className="text-xs text-gray-600">Equipment maintenance needed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Optimization Available</div>
                      <div className="text-xs text-gray-600">Workflow improvements possible</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stations.length}</div>
                    <div className="text-sm text-gray-600">Active Stations</div>
                    <div className="text-xs text-gray-500">Kitchen operations</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stations.filter(s => s.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Operational</div>
                    <div className="text-xs text-gray-500">Running smoothly</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Station Details</CardTitle>
              <CardDescription>Detailed view of each kitchen station</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stations.map((station) => (
                  <div key={station.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{station.name}</h3>
                      <Badge className={getStationStatusColor(station.status)}>
                        {station.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Efficiency:</span>
                        <span className="font-medium ml-2">{station.efficiency}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Orders:</span>
                        <span className="font-medium ml-2">{station.currentOrders}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Time:</span>
                        <span className="font-medium ml-2">{station.averageTime} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Performance trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-64 flex items-center justify-center text-gray-500 border rounded">
                  Performance chart placeholder
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Efficiency</span>
                    <span className="font-medium">{metrics?.kitchenEfficiency}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Staff Utilization</span>
                    <span className="font-medium">{metrics?.staffUtilization}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Equipment Uptime</span>
                    <span className="font-medium">{metrics?.equipmentUptime}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality Score</span>
                    <span className="font-medium">{metrics?.qualityScore}/5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
