'use client'

import React, { useState } from 'react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import {
  Bell,
  Check,
  X,
  TrendingUp,
  AlertTriangle,
  Info,
  Star,
  Clock,
  Mail,
  Trash2
} from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'alert'
  time: string
  read: boolean
  category: 'market' | 'system' | 'promotion' | 'alert'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Market Report Available",
      message: "Your weekly market analysis report for Bangkok area is ready to view.",
      type: "info",
      time: "2 minutes ago",
      read: false,
      category: "market"
    },
    {
      id: 2,
      title: "Price Trend Alert",
      message: "Significant price increase detected in Thai cuisine category (+15% this week).",
      type: "warning",
      time: "1 hour ago",
      read: false,
      category: "alert"
    },
    {
      id: 3,
      title: "New Competitor Detected",
      message: "A new restaurant 'Bangkok Bistro' opened 500m from your location.",
      type: "alert",
      time: "3 hours ago",
      read: true,
      category: "alert"
    },
    {
      id: 4,
      title: "System Maintenance Complete",
      message: "Scheduled maintenance has been completed. All services are now operational.",
      type: "success",
      time: "6 hours ago",
      read: true,
      category: "system"
    },
    {
      id: 5,
      title: "Promotion Campaign Results",
      message: "Your 'Happy Hour' campaign generated 23% more traffic than average.",
      type: "success",
      time: "1 day ago",
      read: false,
      category: "promotion"
    },
    {
      id: 6,
      title: "Location Analytics Update",
      message: "Foot traffic patterns have changed in your area. View updated insights.",
      type: "info",
      time: "2 days ago",
      read: true,
      category: "market"
    },
    {
      id: 7,
      title: "High Demand Period Detected",
      message: "Unusual high demand expected this weekend based on local events.",
      type: "warning",
      time: "3 days ago",
      read: true,
      category: "alert"
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread' | 'market' | 'system' | 'promotion' | 'alert'>('all')

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'success': return <Check className="h-5 w-5 text-green-500" />
      case 'alert': return <TrendingUp className="h-5 w-5 text-red-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'info': return 'default'
      case 'warning': return 'secondary'
      case 'success': return 'default'
      case 'alert': return 'destructive'
      default: return 'outline'
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAsUnread = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.read
    return notif.category === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <MainLayout pageTitle="Notifications" pageDescription="Stay updated with your restaurant insights and alerts">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="market">
              Market ({notifications.filter(n => n.category === 'market').length})
            </TabsTrigger>
            <TabsTrigger value="alert">
              Alerts ({notifications.filter(n => n.category === 'alert').length})
            </TabsTrigger>
            <TabsTrigger value="promotion">
              Promotions ({notifications.filter(n => n.category === 'promotion').length})
            </TabsTrigger>
            <TabsTrigger value="system">
              System ({notifications.filter(n => n.category === 'system').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {filter === 'unread' 
                      ? "You're all caught up! No unread notifications."
                      : `No ${filter === 'all' ? '' : filter} notifications to show.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${
                      !notification.read 
                        ? 'border-l-4 border-l-primary-500 bg-primary-50/50 dark:bg-primary-900/10' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`text-sm font-medium ${
                                  !notification.read 
                                    ? 'text-gray-900 dark:text-white' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                                )}
                                <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{notification.time}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-4">
                              {notification.read ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsUnread(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Market Alerts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about market trends and competitor activity</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">System Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Important system maintenance and feature updates</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Promotion Results</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Updates on your marketing campaigns and promotions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Weekly Reports</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automated weekly business intelligence reports</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button>Save Notification Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
