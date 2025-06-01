"use client"

import React, { useState } from 'react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Input } from "@bitebase/ui"
import { Label } from "@bitebase/ui"
import { Switch } from "@bitebase/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { 
  Wifi, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Database,
  Download,
  Upload,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react'

interface POSSystem {
  id: string
  name: string
  provider: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  syncFrequency: string
  storeId?: string
  apiKey?: string
}

export default function POSIntegrationPage() {
  const [loading, setLoading] = useState(false)
  const [posSystems, setPOSSystems] = useState<POSSystem[]>([
    {
      id: '1',
      name: 'Toast POS',
      provider: 'toast',
      status: 'connected',
      lastSync: 'Today, 2:30 PM',
      syncFrequency: 'Real-time',
      storeId: 'store_12345',
      apiKey: 'toast_api_***'
    },
    {
      id: '2',
      name: 'Square',
      provider: 'square',
      status: 'disconnected',
      lastSync: 'Never',
      syncFrequency: 'Manual',
      storeId: '',
      apiKey: ''
    },
    {
      id: '3',
      name: 'Clover',
      provider: 'clover',
      status: 'error',
      lastSync: '2 days ago',
      syncFrequency: 'Hourly',
      storeId: 'clover_789',
      apiKey: 'clover_api_***'
    }
  ])

  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncFrequency: 'hourly',
    syncMenuItems: true,
    syncPricing: true,
    syncInventory: false,
    syncSales: true
  })

  const handleConnect = (systemId: string) => {
    setPOSSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, status: 'connected', lastSync: 'Just now' }
        : system
    ))
  }

  const handleDisconnect = (systemId: string) => {
    setPOSSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, status: 'disconnected', lastSync: 'Never' }
        : system
    ))
  }

  const handleSync = async (systemId: string) => {
    setLoading(true)
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPOSSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, lastSync: 'Just now' }
        : system
    ))
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case 'error': return <Badge variant="destructive">Error</Badge>
      default: return <Badge variant="secondary">Disconnected</Badge>
    }
  }

  return (
    <MainLayout 
      pageTitle="POS Integration" 
      pageDescription="Connect and manage your Point of Sale systems"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          {/* POS Connections */}
          <TabsContent value="connections" className="space-y-6">
            <div className="grid gap-6">
              {posSystems.map((system) => (
                <Card key={system.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(system.status)}`} />
                        <CardTitle>{system.name}</CardTitle>
                        {getStatusBadge(system.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        {system.status === 'connected' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSync(system.id)}
                            disabled={loading}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Sync Now
                          </Button>
                        )}
                        {system.status === 'connected' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(system.id)}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(system.id)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-500">Last Sync</Label>
                        <p className="font-medium">{system.lastSync}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Sync Frequency</Label>
                        <p className="font-medium">{system.syncFrequency}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Store ID</Label>
                        <p className="font-medium">{system.storeId || 'Not configured'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">API Key</Label>
                        <p className="font-medium">{system.apiKey || 'Not configured'}</p>
                      </div>
                    </div>
                    
                    {system.status === 'error' && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Connection Error</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          Unable to connect to {system.name}. Please check your API credentials.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add New POS System</CardTitle>
                <CardDescription>Connect additional Point of Sale systems</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add POS System
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Settings */}
          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Synchronization Settings</CardTitle>
                <CardDescription>Configure how data syncs between your POS and BiteBase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Sync</Label>
                    <p className="text-sm text-gray-500">Automatically sync data at regular intervals</p>
                  </div>
                  <Switch 
                    checked={syncSettings.autoSync}
                    onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, autoSync: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={syncSettings.syncFrequency}
                    onChange={(e) => setSyncSettings(prev => ({ ...prev, syncFrequency: e.target.value }))}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <Label>Data Types to Sync</Label>
                  <div className="space-y-3">
                    {[
                      { key: 'syncMenuItems', label: 'Menu Items', description: 'Sync menu items and categories' },
                      { key: 'syncPricing', label: 'Pricing', description: 'Sync item prices and modifiers' },
                      { key: 'syncInventory', label: 'Inventory', description: 'Sync stock levels and availability' },
                      { key: 'syncSales', label: 'Sales Data', description: 'Sync transaction and revenue data' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{item.label}</Label>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Switch 
                          checked={syncSettings[item.key as keyof typeof syncSettings] as boolean}
                          onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, [item.key]: checked }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Import/Export</CardTitle>
                <CardDescription>Manage your POS data imports and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Menu Data
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Sales Data
                  </Button>
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Backup All Data
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Force Full Sync
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>View recent POS integration activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: 'Today, 2:30 PM', action: 'Sync completed', system: 'Toast POS', status: 'success' },
                    { time: 'Today, 12:00 PM', action: 'Menu items updated', system: 'Toast POS', status: 'success' },
                    { time: 'Yesterday, 3:45 PM', action: 'Sync failed', system: 'Clover', status: 'error' },
                    { time: 'Yesterday, 2:15 PM', action: 'Connection established', system: 'Square', status: 'success' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-gray-500">{log.system} • {log.time}</p>
                        </div>
                      </div>
                      {log.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
