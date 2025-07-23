'use client';

import React, { useState } from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Plus, 
  MapPin, 
  Target,
  Eye,
  MousePointer,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  Pause,
  Play,
  BarChart3,
  Users
} from 'lucide-react';

interface LocalAd {
  id: string;
  name: string;
  platform: 'google' | 'facebook' | 'instagram' | 'local_directory';
  type: 'search' | 'display' | 'social' | 'directory';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targeting: {
    location: string;
    radius: number;
    demographics: string[];
    interests: string[];
  };
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    cost_per_click: number;
    conversion_rate: number;
  };
  description: string;
}

const mockAds: LocalAd[] = [
  {
    id: '1',
    name: 'Google Ads - "Best Thai Restaurant Bangkok"',
    platform: 'google',
    type: 'search',
    status: 'active',
    budget: 15000,
    spent: 8500,
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    targeting: {
      location: 'Bangkok, Thailand',
      radius: 10,
      demographics: ['25-45 years', 'Middle-high income'],
      interests: ['Thai cuisine', 'Fine dining', 'Local restaurants']
    },
    metrics: {
      impressions: 12400,
      clicks: 890,
      conversions: 45,
      cost_per_click: 9.55,
      conversion_rate: 5.1
    },
    description: 'Search ads targeting Thai food keywords in Bangkok area'
  },
  {
    id: '2',
    name: 'Facebook Local Awareness - Summer Menu',
    platform: 'facebook',
    type: 'social',
    status: 'active',
    budget: 8000,
    spent: 4200,
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    targeting: {
      location: 'Bangkok Metropolitan',
      radius: 15,
      demographics: ['18-55 years', 'Food enthusiasts'],
      interests: ['Restaurants', 'Thai food', 'Dining out']
    },
    metrics: {
      impressions: 25600,
      clicks: 1240,
      conversions: 78,
      cost_per_click: 3.39,
      conversion_rate: 6.3
    },
    description: 'Social media campaign promoting new summer menu items'
  },
  {
    id: '3',
    name: 'Local Directory Listings - Premium',
    platform: 'local_directory',
    type: 'directory',
    status: 'active',
    budget: 5000,
    spent: 2500,
    startDate: '2025-05-01',
    endDate: '2025-10-31',
    targeting: {
      location: 'Sukhumvit Area',
      radius: 5,
      demographics: ['All ages', 'Local residents'],
      interests: ['Local dining', 'Restaurant discovery']
    },
    metrics: {
      impressions: 8900,
      clicks: 340,
      conversions: 28,
      cost_per_click: 7.35,
      conversion_rate: 8.2
    },
    description: 'Premium listings on local restaurant directories and review sites'
  }
];

export default function LocalAdvertisingPage() {
  const [ads, setAds] = useState<LocalAd[]>(mockAds);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredAds = ads.filter(ad => 
    selectedPlatform === 'all' || ad.platform === selectedPlatform
  );

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'google': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'local_directory': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'search': return 'bg-purple-100 text-purple-800';
      case 'display': return 'bg-orange-100 text-orange-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'directory': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalStats = {
    totalBudget: ads.reduce((sum, ad) => sum + ad.budget, 0),
    totalSpent: ads.reduce((sum, ad) => sum + ad.spent, 0),
    totalImpressions: ads.reduce((sum, ad) => sum + ad.metrics.impressions, 0),
    totalClicks: ads.reduce((sum, ad) => sum + ad.metrics.clicks, 0),
    totalConversions: ads.reduce((sum, ad) => sum + ad.metrics.conversions, 0),
    averageCPC: ads.reduce((sum, ad) => sum + ad.metrics.cost_per_click, 0) / ads.length,
    averageConversionRate: ads.reduce((sum, ad) => sum + ad.metrics.conversion_rate, 0) / ads.length
  };

  return (
    <MainLayout pageTitle="Local Advertising" pageDescription="Manage local advertising campaigns">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Local Advertising</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage local advertising campaigns
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ฿{(totalStats.totalBudget / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    ฿{(totalStats.totalSpent / 1000).toFixed(0)}K spent
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Impressions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(totalStats.totalImpressions / 1000).toFixed(1)}K
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clicks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalClicks.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ฿{totalStats.averageCPC.toFixed(2)} avg CPC
                  </p>
                </div>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalConversions}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {totalStats.averageConversionRate.toFixed(1)}% avg rate
                  </p>
                </div>
                <Target className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Google Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Campaigns</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Spend</span>
                  <span className="font-medium">฿8,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-medium">5.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Social Media Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Campaigns</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Spend</span>
                  <span className="font-medium">฿4,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="font-medium">6.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Local Directories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Listings</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Spend</span>
                  <span className="font-medium">฿2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-medium">8.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by platform:</span>
              <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Platforms</option>
                <option value="google">Google Ads</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="local_directory">Local Directories</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns List */}
        <div className="space-y-4">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ad.name}
                      </h3>
                      <Badge className={getStatusColor(ad.status)}>
                        {ad.status}
                      </Badge>
                      <Badge className={getPlatformColor(ad.platform)}>
                        {ad.platform.replace('_', ' ')}
                      </Badge>
                      <Badge className={getTypeColor(ad.type)}>
                        {ad.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {ad.description}
                    </p>
                    
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {ad.targeting.location} ({ad.targeting.radius}km radius)
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {ad.targeting.demographics.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        ฿{(ad.budget / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Budget</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        ฿{(ad.spent / 1000).toFixed(0)}K spent
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {(ad.metrics.impressions / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Impressions</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {ad.metrics.clicks} clicks
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {ad.metrics.conversion_rate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Conv. Rate</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {ad.metrics.conversions} conversions
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {ad.status === 'active' ? (
                          <Button size="sm" variant="outline">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}