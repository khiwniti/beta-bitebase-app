'use client';

import React, { useState } from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Plus, 
  Mail, 
  Send,
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  subject: string;
  type: 'newsletter' | 'promotion' | 'announcement' | 'welcome';
  status: 'draft' | 'scheduled' | 'sent' | 'sending';
  recipients: number;
  sentDate?: string;
  scheduledDate?: string;
  metrics: {
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  content: string;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    subject: 'Summer Menu Launch - Fresh Seasonal Dishes!',
    type: 'promotion',
    status: 'sent',
    recipients: 2340,
    sentDate: '2025-07-20T10:00:00',
    metrics: {
      delivered: 2298,
      opened: 1034,
      clicked: 156,
      bounced: 42,
      unsubscribed: 8
    },
    content: 'Discover our new summer menu featuring fresh, seasonal ingredients...'
  },
  {
    id: '2',
    subject: 'Weekly Newsletter - What\'s Happening at Bella Vista',
    type: 'newsletter',
    status: 'scheduled',
    recipients: 2340,
    scheduledDate: '2025-07-25T09:00:00',
    metrics: {
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    },
    content: 'This week at Bella Vista: New chef specials, upcoming events...'
  },
  {
    id: '3',
    subject: 'Happy Hour Extended - Now Until 7 PM!',
    type: 'announcement',
    status: 'sent',
    recipients: 1890,
    sentDate: '2025-07-18T14:00:00',
    metrics: {
      delivered: 1876,
      opened: 892,
      clicked: 234,
      bounced: 14,
      unsubscribed: 3
    },
    content: 'Great news! We\'re extending our happy hour until 7 PM...'
  }
];

export default function EmailMarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedType === 'all' || campaign.type === selectedType
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'bg-blue-100 text-blue-800';
      case 'promotion': return 'bg-red-100 text-red-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      case 'welcome': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.metrics.delivered === 0) return 0;
    return Math.round((campaign.metrics.opened / campaign.metrics.delivered) * 100);
  };

  const calculateClickRate = (campaign: EmailCampaign) => {
    if (campaign.metrics.delivered === 0) return 0;
    return Math.round((campaign.metrics.clicked / campaign.metrics.delivered) * 100);
  };

  const totalStats = {
    totalSent: campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + c.recipients, 0),
    totalOpened: campaigns.reduce((sum, c) => sum + c.metrics.opened, 0),
    totalClicked: campaigns.reduce((sum, c) => sum + c.metrics.clicked, 0),
    averageOpenRate: Math.round(
      campaigns.filter(c => c.status === 'sent').reduce((sum, c) => sum + calculateOpenRate(c), 0) / 
      campaigns.filter(c => c.status === 'sent').length
    )
  };

  return (
    <MainLayout pageTitle="Email Marketing" pageDescription="Create and manage email campaigns">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Marketing</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage email campaigns
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalSent.toLocaleString()}
                  </p>
                </div>
                <Send className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Opened</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalOpened.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalClicked.toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.averageOpenRate}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Newsletter Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subscribers</span>
                  <span className="font-medium">2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Open Rate</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Growth This Month</span>
                  <span className="font-medium text-green-600">+8.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Promotional Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Campaigns Sent</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Click Rate</span>
                  <span className="font-medium">6.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue Generated</span>
                  <span className="font-medium">฿45,600</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">List Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Subscribers</span>
                  <span className="font-medium">2,298</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <span className="font-medium">1.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unsubscribe Rate</span>
                  <span className="font-medium">0.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type:</span>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="newsletter">Newsletter</option>
                <option value="promotion">Promotion</option>
                <option value="announcement">Announcement</option>
                <option value="welcome">Welcome</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.subject}
                      </h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {campaign.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {campaign.recipients.toLocaleString()} recipients
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {campaign.status === 'scheduled' && campaign.scheduledDate
                          ? `Scheduled for ${new Date(campaign.scheduledDate).toLocaleString()}`
                          : campaign.sentDate
                          ? `Sent ${new Date(campaign.sentDate).toLocaleString()}`
                          : 'Draft'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {campaign.metrics.delivered.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Delivered</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {calculateOpenRate(campaign)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {campaign.metrics.opened} opens
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {calculateClickRate(campaign)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Click Rate</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {campaign.metrics.clicked} clicks
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4" />
                        </Button>
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