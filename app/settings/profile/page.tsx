'use client'

import React, { useState } from 'react'
import { MainLayout } from '../../../components/layout/MainLayout'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Badge } from '../../../components/ui/badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Camera, 
  Save, 
  Shield,
  Bell,
  CreditCard,
  Key
} from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'BiteBase Restaurant',
    location: 'Bangkok, Thailand',
    bio: 'Restaurant owner passionate about data-driven decisions and customer satisfaction.',
    avatar: ''
  })

  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    emailReports: true,
    emailAlerts: false,
    pushNotifications: true,
    smsAlerts: false
  })

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationUpdate = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    // TODO: Implement profile save functionality
    console.log('Saving profile:', profile)
  }

  const handleSaveNotifications = () => {
    // TODO: Implement notification preferences save
    console.log('Saving notifications:', notifications)
  }

  return (
    <MainLayout pageTitle="Profile Settings" pageDescription="Manage your account settings and preferences">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback className="text-lg">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">Restaurant Owner</Badge>
                <Badge variant="outline">Free Plan</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and restaurant information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Restaurant/Company</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => handleProfileUpdate('company', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Tell us about yourself and your restaurant..."
                  />
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive updates and alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Marketing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive marketing emails and product updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailMarketing}
                      onChange={(e) => handleNotificationUpdate('emailMarketing', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Reports</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Weekly and monthly business reports</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailReports}
                      onChange={(e) => handleNotificationUpdate('emailReports', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Alerts</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Important alerts and notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={(e) => handleNotificationUpdate('emailAlerts', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Browser push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => handleNotificationUpdate('pushNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Alerts</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Critical alerts via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsAlerts}
                      onChange={(e) => handleNotificationUpdate('smsAlerts', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Change Password</h4>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <Button className="mt-3">
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Add an extra layer of security to your account.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Active Sessions</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Manage your active login sessions.
                    </p>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Current Plan</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Free Plan</p>
                    </div>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Upgrade Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h5 className="font-medium">Pro Plan</h5>
                      <p className="text-2xl font-bold">$29<span className="text-sm font-normal">/month</span></p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Advanced analytics and features</p>
                      <Button className="w-full mt-3">Upgrade to Pro</Button>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h5 className="font-medium">Enterprise</h5>
                      <p className="text-2xl font-bold">$99<span className="text-sm font-normal">/month</span></p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full feature access and support</p>
                      <Button className="w-full mt-3">Contact Sales</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
