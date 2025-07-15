"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building,
  MapPin,
  Clock,
  Bell,
  Settings,
  Phone,
  Mail,
  Globe,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RestaurantData {
  name: string;
  description: string;
  cuisineType: string;
  priceRange: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
}

const CUISINE_TYPES = [
  'Thai', 'Italian', 'Chinese', 'Japanese', 'American', 'Mexican', 
  'Indian', 'French', 'Korean', 'Vietnamese', 'Mediterranean', 'Other'
];

const PRICE_RANGES = [
  { value: '1', label: '$ - Budget' },
  { value: '2', label: '$$ - Moderate' },
  { value: '3', label: '$$$ - Expensive' },
  { value: '4', label: '$$$$ - Very Expensive' }
];

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export default function RestaurantSettings() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  
  const [restaurantData, setRestaurantData] = useState<RestaurantData>({
    name: 'BiteBase Restaurant',
    description: 'A modern restaurant serving delicious cuisine',
    cuisineType: 'Thai',
    priceRange: '2',
    phone: '+66 2 123 4567',
    email: 'info@bitebase-restaurant.com',
    website: 'https://bitebase-restaurant.com',
    address: '123 Main Street',
    city: 'Bangkok',
    state: 'Bangkok',
    zipCode: '10110',
    country: 'Thailand',
    businessHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' }
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setRestaurantData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHourChange = (day: string, field: string, value: string | boolean) => {
    setRestaurantData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setRestaurantData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make the actual API call
      console.log('Saving restaurant data:', restaurantData);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setRestaurantData({
      name: 'BiteBase Restaurant',
      description: 'A modern restaurant serving delicious cuisine',
      cuisineType: 'Thai',
      priceRange: '2',
      phone: '+66 2 123 4567',
      email: 'info@bitebase-restaurant.com',
      website: 'https://bitebase-restaurant.com',
      address: '123 Main Street',
      city: 'Bangkok',
      state: 'Bangkok',
      zipCode: '10110',
      country: 'Thailand',
      businessHours: {
        monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '23:00' },
        sunday: { isOpen: true, openTime: '10:00', closeTime: '21:00' }
      },
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
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
          {saveStatus === 'success' && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Saved successfully</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Save failed</span>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('resetToDefault')}
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? tCommon('loading') : t('saveChanges')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic-info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            {t('basicInfo')}
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('contactInfo')}
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('businessHours')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('notifications')}
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>{t('basicInfo')}</CardTitle>
              <CardDescription>
                Update your restaurant's basic information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('restaurantName')}</Label>
                  <Input
                    id="name"
                    value={restaurantData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter restaurant name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cuisineType">{t('cuisineType')}</Label>
                  <Select
                    value={restaurantData.cuisineType}
                    onValueChange={(value) => handleInputChange('cuisineType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUISINE_TYPES.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('description')}</Label>
                <Textarea
                  id="description"
                  value={restaurantData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your restaurant"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceRange">{t('priceRange')}</Label>
                <Select
                  value={restaurantData.priceRange}
                  onValueChange={(value) => handleInputChange('priceRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInfo')}</CardTitle>
              <CardDescription>
                Manage your restaurant's contact details and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={restaurantData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+66 2 123 4567"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={restaurantData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@restaurant.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">{t('website')}</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    value={restaurantData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://restaurant.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">{t('address')}</Label>
                  <Input
                    id="address"
                    value={restaurantData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('city')}</Label>
                    <Input
                      id="city"
                      value={restaurantData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Bangkok"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">{t('state')}</Label>
                    <Input
                      id="state"
                      value={restaurantData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Bangkok"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">{t('zipCode')}</Label>
                    <Input
                      id="zipCode"
                      value={restaurantData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="10110"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t('country')}</Label>
                  <Input
                    id="country"
                    value={restaurantData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Thailand"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours Tab */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>{t('businessHours')}</CardTitle>
              <CardDescription>
                Set your restaurant's operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <Label className="font-medium capitalize">
                      {t(day)}
                    </Label>
                  </div>
                  
                  <Switch
                    checked={restaurantData.businessHours[day].isOpen}
                    onCheckedChange={(checked) => 
                      handleBusinessHourChange(day, 'isOpen', checked)
                    }
                  />
                  
                  {restaurantData.businessHours[day].isOpen ? (
                    <div className="flex items-center space-x-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">{t('openTime')}</Label>
                        <Input
                          type="time"
                          value={restaurantData.businessHours[day].openTime}
                          onChange={(e) => 
                            handleBusinessHourChange(day, 'openTime', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      
                      <span className="text-gray-400">-</span>
                      
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-500">{t('closeTime')}</Label>
                        <Input
                          type="time"
                          value={restaurantData.businessHours[day].closeTime}
                          onChange={(e) => 
                            handleBusinessHourChange(day, 'closeTime', e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                    </div>
                  ) : (
                    <Badge variant="secondary">{t('closed')}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications')}</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">{t('emailNotifications')}</Label>
                    <p className="text-sm text-gray-500">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={restaurantData.notifications.email}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('email', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">{t('smsNotifications')}</Label>
                    <p className="text-sm text-gray-500">
                      Get urgent alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={restaurantData.notifications.sms}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('sms', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">{t('pushNotifications')}</Label>
                    <p className="text-sm text-gray-500">
                      Browser push notifications for real-time updates
                    </p>
                  </div>
                  <Switch
                    checked={restaurantData.notifications.push}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('push', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">{t('marketingEmails')}</Label>
                    <p className="text-sm text-gray-500">
                      Marketing tips and industry insights
                    </p>
                  </div>
                  <Switch
                    checked={restaurantData.notifications.marketing}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('marketing', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}