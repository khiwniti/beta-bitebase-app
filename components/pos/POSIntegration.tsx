"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Wifi,
  WifiOff,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  FileText,
  Play,
  Pause,
  Eye,
  Download,
  Upload
} from 'lucide-react';

interface POSSystem {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  features: string[];
  config: {
    apiKey?: string;
    endpoint?: string;
    autoSync: boolean;
    syncInterval: number;
  };
}

interface SyncData {
  salesData: { count: number; lastUpdate: string; status: string };
  menuItems: { count: number; lastUpdate: string; status: string };
  inventory: { count: number; lastUpdate: string; status: string };
  customers: { count: number; lastUpdate: string; status: string };
  orders: { count: number; lastUpdate: string; status: string };
  payments: { count: number; lastUpdate: string; status: string };
}

const AVAILABLE_POS_SYSTEMS = [
  {
    id: 'square',
    name: 'Square POS',
    logo: '🟦',
    features: ['Sales Data', 'Menu Items', 'Inventory', 'Customers', 'Payments']
  },
  {
    id: 'toast',
    name: 'Toast POS',
    logo: '🍞',
    features: ['Sales Data', 'Menu Items', 'Orders', 'Customers', 'Analytics']
  },
  {
    id: 'clover',
    name: 'Clover',
    logo: '🍀',
    features: ['Sales Data', 'Inventory', 'Customers', 'Payments', 'Reports']
  },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    logo: '⚡',
    features: ['Sales Data', 'Menu Items', 'Inventory', 'Analytics', 'Reports']
  },
  {
    id: 'revel',
    name: 'Revel Systems',
    logo: '🎯',
    features: ['Sales Data', 'Menu Items', 'Orders', 'Inventory', 'Customers']
  }
];

export default function POSIntegration() {
  const t = useTranslations('pos');
  const tCommon = useTranslations('common');
  
  const [connectedSystems, setConnectedSystems] = useState<POSSystem[]>([
    {
      id: 'square',
      name: 'Square POS',
      logo: '🟦',
      status: 'connected',
      lastSync: '2025-01-15T10:30:00Z',
      features: ['Sales Data', 'Menu Items', 'Inventory', 'Customers', 'Payments'],
      config: {
        apiKey: 'sq_****_****_****_1234',
        endpoint: 'https://connect.squareup.com/v2',
        autoSync: true,
        syncInterval: 15
      }
    }
  ]);

  const [syncData, setSyncData] = useState<SyncData>({
    salesData: { count: 1247, lastUpdate: '2025-01-15T10:30:00Z', status: 'success' },
    menuItems: { count: 89, lastUpdate: '2025-01-15T09:15:00Z', status: 'success' },
    inventory: { count: 156, lastUpdate: '2025-01-15T10:00:00Z', status: 'success' },
    customers: { count: 2341, lastUpdate: '2025-01-15T10:25:00Z', status: 'success' },
    orders: { count: 892, lastUpdate: '2025-01-15T10:30:00Z', status: 'success' },
    payments: { count: 1247, lastUpdate: '2025-01-15T10:30:00Z', status: 'success' }
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [connectionConfig, setConnectionConfig] = useState({
    apiKey: '',
    endpoint: '',
    autoSync: true,
    syncInterval: 15
  });

  const handleConnect = async (systemId: string) => {
    setIsConnecting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const system = AVAILABLE_POS_SYSTEMS.find(s => s.id === systemId);
      if (system) {
        const newSystem: POSSystem = {
          ...system,
          status: 'connected',
          lastSync: new Date().toISOString(),
          config: { ...connectionConfig }
        };
        
        setConnectedSystems(prev => [...prev, newSystem]);
      }
      
      setSelectedSystem('');
      setConnectionConfig({
        apiKey: '',
        endpoint: '',
        autoSync: true,
        syncInterval: 15
      });
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (systemId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedSystems(prev => prev.filter(system => system.id !== systemId));
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const handleSync = async (systemId?: string) => {
    setIsSyncing(true);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update sync data
      const now = new Date().toISOString();
      setSyncData(prev => ({
        salesData: { ...prev.salesData, lastUpdate: now },
        menuItems: { ...prev.menuItems, lastUpdate: now },
        inventory: { ...prev.inventory, lastUpdate: now },
        customers: { ...prev.customers, lastUpdate: now },
        orders: { ...prev.orders, lastUpdate: now },
        payments: { ...prev.payments, lastUpdate: now }
      }));
      
      // Update last sync time for connected systems
      if (systemId) {
        setConnectedSystems(prev => 
          prev.map(system => 
            system.id === systemId 
              ? { ...system, lastSync: now, status: 'connected' }
              : system
          )
        );
      } else {
        setConnectedSystems(prev => 
          prev.map(system => ({ ...system, lastSync: now, status: 'connected' }))
        );
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConfigUpdate = (systemId: string, config: any) => {
    setConnectedSystems(prev => 
      prev.map(system => 
        system.id === systemId 
          ? { ...system, config: { ...system.config, ...config } }
          : system
      )
    );
  };

  const formatLastSync = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'disconnected': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      case 'syncing': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'error': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <CreditCard className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('description')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleSync()}
            disabled={isSyncing || connectedSystems.length === 0}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : t('syncNow')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connected" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            {t('connectedSystems')}
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {t('availableIntegrations')}
          </TabsTrigger>
          <TabsTrigger value="sync-status" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('syncStatus')}
          </TabsTrigger>
        </TabsList>

        {/* Connected Systems Tab */}
        <TabsContent value="connected">
          <div className="space-y-4">
            {connectedSystems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <WifiOff className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Connected Systems
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    Connect your POS system to start syncing data and unlock powerful analytics.
                  </p>
                  <Button onClick={() => setSelectedSystem('square')}>
                    Connect Your First POS
                  </Button>
                </CardContent>
              </Card>
            ) : (
              connectedSystems.map((system) => (
                <Card key={system.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{system.logo}</div>
                        <div>
                          <CardTitle className="text-lg">{system.name}</CardTitle>
                          <CardDescription>
                            {t('lastSync')}: {formatLastSync(system.lastSync)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(system.status)}>
                          {system.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {system.status === 'syncing' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                          {system.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {t(system.status)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(system.id)}
                          disabled={isSyncing}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {t('syncNow')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(system.id)}
                        >
                          {t('disconnect')}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Synced Data Types</Label>
                        <div className="flex flex-wrap gap-2">
                          {system.features.map((feature) => (
                            <Badge key={feature} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t('autoSync')}</Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={system.config.autoSync}
                              onCheckedChange={(checked) => 
                                handleConfigUpdate(system.id, { autoSync: checked })
                              }
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {system.config.autoSync ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t('syncInterval')}</Label>
                          <Select
                            value={system.config.syncInterval.toString()}
                            onValueChange={(value) => 
                              handleConfigUpdate(system.id, { syncInterval: parseInt(value) })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 {t('minutes')}</SelectItem>
                              <SelectItem value="15">15 {t('minutes')}</SelectItem>
                              <SelectItem value="30">30 {t('minutes')}</SelectItem>
                              <SelectItem value="60">1 {t('hours')}</SelectItem>
                              <SelectItem value="120">2 {t('hours')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Available Integrations Tab */}
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_POS_SYSTEMS.filter(system => 
              !connectedSystems.find(connected => connected.id === system.id)
            ).map((system) => (
              <Card key={system.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{system.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{system.name}</CardTitle>
                      <CardDescription>
                        {system.features.length} features available
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {system.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => setSelectedSystem(system.id)}
                      disabled={isConnecting}
                    >
                      {t('connect')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Connection Modal */}
          {selectedSystem && (
            <Card className="mt-6 border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20">
              <CardHeader>
                <CardTitle>
                  Connect {AVAILABLE_POS_SYSTEMS.find(s => s.id === selectedSystem)?.name}
                </CardTitle>
                <CardDescription>
                  Enter your API credentials to establish the connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">{t('apiKey')}</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={connectionConfig.apiKey}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter your API key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">{t('endpoint')}</Label>
                    <Input
                      id="endpoint"
                      value={connectionConfig.endpoint}
                      onChange={(e) => setConnectionConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                      placeholder="https://api.example.com/v1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={connectionConfig.autoSync}
                      onCheckedChange={(checked) => 
                        setConnectionConfig(prev => ({ ...prev, autoSync: checked }))
                      }
                    />
                    <Label>{t('autoSync')}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label>{t('syncInterval')}:</Label>
                    <Select
                      value={connectionConfig.syncInterval.toString()}
                      onValueChange={(value) => 
                        setConnectionConfig(prev => ({ ...prev, syncInterval: parseInt(value) }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 min</SelectItem>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSystem('')}
                    disabled={isConnecting}
                  >
                    {tCommon('cancel')}
                  </Button>
                  <Button
                    onClick={() => handleConnect(selectedSystem)}
                    disabled={isConnecting || !connectionConfig.apiKey}
                  >
                    {isConnecting ? tCommon('loading') : t('connect')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sync Status Tab */}
        <TabsContent value="sync-status">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(syncData).map(([key, data]) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base capitalize">
                      {t(key as keyof typeof syncData)}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      {data.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Records:</span>
                      <span className="font-semibold">{data.count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Update:</span>
                      <span className="text-sm">{formatLastSync(data.lastUpdate)}</span>
                    </div>
                    <Badge 
                      className={`w-full justify-center ${
                        data.status === 'success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {data.status === 'success' ? 'Synced' : 'Error'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sync Logs */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sync Logs</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  {t('viewLogs')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '10:30 AM', action: 'Sales data sync completed', status: 'success' },
                  { time: '10:25 AM', action: 'Customer data sync completed', status: 'success' },
                  { time: '10:00 AM', action: 'Inventory sync completed', status: 'success' },
                  { time: '09:15 AM', action: 'Menu items sync completed', status: 'success' },
                  { time: '09:00 AM', action: 'Auto sync started', status: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' : 
                        log.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-sm">{log.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}