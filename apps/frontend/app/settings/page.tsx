"use client"

import React, { useState } from 'react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Input } from "@bitebase/ui"
import { Label } from "@bitebase/ui"
import { Switch } from "@bitebase/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Database, 
  Wifi, 
  MapPin,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  })

  const [integrations, setIntegrations] = useState({
    pos: { connected: true, provider: 'Toast POS', lastSync: '2 hours ago' },
    maps: { connected: true, provider: 'Google Maps', status: 'Active' },
    analytics: { connected: false, provider: 'Google Analytics', status: 'Disconnected' }
  })

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <MainLayout 
      pageTitle="Settings" 
      pageDescription="Manage your account settings and integrations"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and restaurant details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant">Restaurant Name</Label>
                  <Input id="restaurant" placeholder="Enter your restaurant name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Restaurant Address</Label>
                  <Input id="address" placeholder="Enter your restaurant address" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive text messages</p>
                  </div>
                  <Switch 
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-gray-500">Receive product updates and tips</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your subscription and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Professional Plan</h3>
                    <p className="text-sm text-gray-500">$99/month • Next billing: Dec 15, 2024</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Button variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Payment Methods
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Billing History
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Integrations</CardTitle>
                <CardDescription>Connect your restaurant systems and third-party services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(integrations).map(([key, integration]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${integration.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h3 className="font-medium">{integration.provider}</h3>
                        <p className="text-sm text-gray-500">
                          {integration.connected ? `Connected • ${integration.lastSync || integration.status}` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {integration.connected ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data, exports, and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Data Sources
                </Button>
                <Button variant="destructive">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
