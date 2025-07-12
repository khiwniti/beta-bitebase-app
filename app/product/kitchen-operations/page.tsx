"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import {
  ChefHat,
  Clock,
  Users,
  Utensils,
  Package,
  AlertTriangle,
  CheckCircle,
  Timer,
  Thermometer,
  Scale,
  Activity,
  Zap,
  Target,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Settings,
  Bell,
  Calendar,
  MapPin,
  Layers,
  Workflow,
  Gauge,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  StopCircle
} from "lucide-react"

// Kitchen Operations Interfaces
interface KitchenStation {
  id: string
  name: string
  type: 'prep' | 'cooking' | 'plating' | 'cleaning'
  status: 'active' | 'idle' | 'maintenance' | 'offline'
  efficiency: number
  currentOrders: number
  averageTime: number
  staff: Array<{
    name: string
    role: string
    efficiency: number
  }>
  equipment: Array<{
    name: string
    status: 'operational' | 'warning' | 'maintenance'
    utilization: number
  }>
}

interface OrderFlow {
  id: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    station: string
    status: 'pending' | 'in_progress' | 'completed'
    estimatedTime: number
    actualTime?: number
  }>
  totalEstimatedTime: number
  actualTime?: number
  currentStation: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  customerWaitTime: number
}

interface KitchenMetrics {
  totalOrders: number
  completedOrders: number
  averageOrderTime: number
  onTimeDelivery: number
  kitchenEfficiency: number
  staffUtilization: number
  equipmentUptime: number
  qualityScore: number
  wastePercentage: number
  energyEfficiency: number
}

export default function KitchenOperationsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [kitchenStations, setKitchenStations] = useState<KitchenStation[]>([])
  const [orderFlows, setOrderFlows] = useState<OrderFlow[]>([])
  const [metrics, setMetrics] = useState<KitchenMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [realTimeMode, setRealTimeMode] = useState(true)

  useEffect(() => {
    const generateKitchenData = () => {
      // Generate kitchen stations
      const stations: KitchenStation[] = [
        {
          id: 'prep_1',
          name: 'Prep Station 1',
          type: 'prep',
          status: 'active',
          efficiency: 87,
          currentOrders: 5,
          averageTime: 8.5,
          staff: [
            { name: 'John Doe', role: 'Prep Cook', efficiency: 92 },
            { name: 'Jane Smith', role: 'Prep Assistant', efficiency: 85 }
          ],
          equipment: [
            { name: 'Food Processor', status: 'operational', utilization: 75 },
            { name: 'Mandoline Slicer', status: 'operational', utilization: 60 }
          ]
        },
        {
          id: 'wok_1',
          name: 'Wok Station 1',
          type: 'cooking',
          status: 'active',
          efficiency: 92,
          currentOrders: 8,
          averageTime: 12.3,
          staff: [
            { name: 'Chef Mike', role: 'Wok Chef', efficiency: 95 },
            { name: 'Tom Wilson', role: 'Line Cook', efficiency: 88 }
          ],
          equipment: [
            { name: 'Commercial Wok', status: 'operational', utilization: 85 },
            { name: 'Gas Burner', status: 'operational', utilization: 90 }
          ]
        },
        {
          id: 'grill_1',
          name: 'Grill Station',
          type: 'cooking',
          status: 'active',
          efficiency: 78,
          currentOrders: 3,
          averageTime: 15.2,
          staff: [
            { name: 'Sarah Lee', role: 'Grill Cook', efficiency: 82 }
          ],
          equipment: [
            { name: 'Charcoal Grill', status: 'warning', utilization: 70 },
            { name: 'Salamander', status: 'operational', utilization: 45 }
          ]
        },
        {
          id: 'plating_1',
          name: 'Plating Station',
          type: 'plating',
          status: 'active',
          efficiency: 89,
          currentOrders: 6,
          averageTime: 3.8,
          staff: [
            { name: 'Chef Anna', role: 'Expediter', efficiency: 94 },
            { name: 'Mark Brown', role: 'Plating Assistant', efficiency: 86 }
          ],
          equipment: [
            { name: 'Heat Lamps', status: 'operational', utilization: 80 },
            { name: 'Plate Warmer', status: 'operational', utilization: 65 }
          ]
        }
      ]

      // Generate order flows
      const flows: OrderFlow[] = [
        {
          id: 'order_001',
          orderNumber: '#1234',
          items: [
            { name: 'Pad Thai', quantity: 2, station: 'wok_1', status: 'in_progress', estimatedTime: 12, actualTime: 8 },
            { name: 'Spring Rolls', quantity: 1, station: 'prep_1', status: 'completed', estimatedTime: 5, actualTime: 4 }
          ],
          totalEstimatedTime: 17,
          actualTime: 12,
          currentStation: 'wok_1',
          priority: 'normal',
          customerWaitTime: 12
        },
        {
          id: 'order_002',
          orderNumber: '#1235',
          items: [
            { name: 'Green Curry', quantity: 1, station: 'wok_1', status: 'pending', estimatedTime: 15 },
            { name: 'Jasmine Rice', quantity: 1, station: 'prep_1', status: 'completed', estimatedTime: 3, actualTime: 2 }
          ],
          totalEstimatedTime: 18,
          currentStation: 'wok_1',
          priority: 'high',
          customerWaitTime: 8
        },
        {
          id: 'order_003',
          orderNumber: '#1236',
          items: [
            { name: 'Grilled Fish', quantity: 1, station: 'grill_1', status: 'in_progress', estimatedTime: 20, actualTime: 15 },
            { name: 'Vegetables', quantity: 1, station: 'prep_1', status: 'completed', estimatedTime: 5, actualTime: 4 }
          ],
          totalEstimatedTime: 25,
          actualTime: 19,
          currentStation: 'grill_1',
          priority: 'urgent',
          customerWaitTime: 25
        }
      ]

      // Generate metrics
      const kitchenMetrics: KitchenMetrics = {
        totalOrders: 156,
        completedOrders: 142,
        averageOrderTime: 14.5,
        onTimeDelivery: 87.5,
        kitchenEfficiency: 84.2,
        staffUtilization: 78.9,
        equipmentUptime: 94.3,
        qualityScore: 4.3,
        wastePercentage: 6.8,
        energyEfficiency: 82.1
      }

      setKitchenStations(stations)
      setOrderFlows(flows)
      setMetrics(kitchenMetrics)
      setLoading(false)
    }

    generateKitchenData()

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (realTimeMode) {
        generateKitchenData()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [realTimeMode])

  const getStationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'idle': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'offline': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEquipmentStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'maintenance': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Utilization</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.staffUtilization}%</div>
              <p className="text-xs text-muted-foreground">
                8 staff members active
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="stations">Station Status</TabsTrigger>
          <TabsTrigger value="orders">Order Flow</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Kitchen Layout Overview */}
          <div className="grid gap-6 md:grid-cols-2">
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
                  {kitchenStations.map((station) => (
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
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Current Order Queue
                </CardTitle>
                <CardDescription>Orders currently being processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderFlows.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{order.orderNumber}</div>
                          <div className="text-xs text-gray-600">
                            {order.items.length} items • {order.currentStation}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{order.customerWaitTime} min</div>
                        <div className="text-xs text-gray-600">wait time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Energy Efficiency</span>
                      <span className="font-medium">{metrics?.energyEfficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${metrics?.energyEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Peak Efficiency</div>
                      <div className="text-xs text-gray-600">All stations operating optimally</div>
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
                      <div className="text-xs text-gray-600">Prep station workflow can be improved</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{metrics?.wastePercentage}%</div>
                    <div className="text-sm text-gray-600">Food Waste</div>
                    <div className="text-xs text-gray-500">Target: &lt;5%</div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {kitchenStations.reduce((sum, station) => sum + station.staff.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Active Staff</div>
                    <div className="text-xs text-gray-500">Across all stations</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stations" className="space-y-4">
          {/* Detailed Station Analysis */}
          <div className="grid gap-6">
            {kitchenStations.map((station) => (
              <Card key={station.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      {station.name}
                    </CardTitle>
                    <Badge className={getStationStatusColor(station.status)}>
                      {station.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {station.type.charAt(0).toUpperCase() + station.type.slice(1)} station with {station.staff.length} staff members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Station Metrics */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Station Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Efficiency</span>
                          <span className="font-medium">{station.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${station.efficiency}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm">Current Orders</span>
                          <span className="font-medium">{station.currentOrders}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm">Average Time</span>
                          <span className="font-medium">{station.averageTime} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Staff Performance */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Staff Performance</h4>
                      <div className="space-y-3">
                        {station.staff.map((staff, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{staff.name}</span>
                              <span className="font-medium">{staff.efficiency}%</span>
                            </div>
                            <div className="text-xs text-gray-600">{staff.role}</div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-green-600 h-1 rounded-full"
                                style={{ width: `${staff.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment Status */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Equipment Status</h4>
                      <div className="space-y-3">
                        {station.equipment.map((equipment, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {getEquipmentStatusIcon(equipment.status)}
                              <span className="text-sm">{equipment.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{equipment.utilization}%</div>
                              <div className="text-xs text-gray-600">utilization</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {/* Order Flow Management */}
          <Card>
            <CardHeader>
              <CardTitle>Active Order Flow</CardTitle>
              <CardDescription>Real-time order tracking and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderFlows.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                        <h4 className="font-medium">{order.orderNumber}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{order.customerWaitTime} min</div>
                        <div className="text-xs text-gray-600">wait time</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium text-sm">{item.name}</span>
                            <span className="text-xs text-gray-600 ml-2">x{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {item.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-600">{item.station}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Dashboard */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Kitchen performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Performance chart placeholder
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
                <CardDescription>Key efficiency indicators</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
