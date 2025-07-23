'use client';

import React, { useState } from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'promotion' | 'discount' | 'loyalty' | 'seasonal';
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  revenue: number;
  customers: number;
  roi: number;
  description: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Special Menu',
    type: 'seasonal',
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    budget: 25000,
    spent: 12500,
    revenue: 45000,
    customers: 320,
    roi: 260,
    description: 'Promote new summer menu items with 15% discount'
  },
  {
    id: '2',
    name: 'Happy Hour Promotion',
    type: 'promotion',
    status: 'active',
    startDate: '2025-05-15',
    endDate: '2025-07-15',
    budget: 15000,
    spent: 8200,
    revenue: 28500,
    customers: 180,
    roi: 247,
    description: 'Daily happy hour 4-6 PM with drink specials'
  },
  {
    id: '3',
    name: 'Loyalty Rewards Launch',
    type: 'loyalty',
    status: 'completed',
    startDate: '2025-04-01',
    endDate: '2025-05-31',
    budget: 20000,
    spent: 20000,
    revenue: 52000,
    customers: 450,
    roi: 160,
    description: 'Launch customer loyalty program with sign-up bonuses'
  }
];

export default function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedStatus === 'all' || campaign.status === selectedStatus
  );

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
      case 'promotion': return 'bg-purple-100 text-purple-800';
      case 'discount': return 'bg-red-100 text-red-800';
      case 'loyalty': return 'bg-blue-100 text-blue-800';
      case 'seasonal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalStats = {
    totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
    totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
    totalCustomers: campaigns.reduce((sum, c) => sum + c.customers, 0),
    averageROI: Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length)
  };

  return (
    <MainLayout pageTitle="Campaign Management" pageDescription="Create and manage marketing campaigns">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaign Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage marketing campaigns
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ฿{(totalStats.totalBudget / 1000).toFixed(0)}K
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ฿{(totalStats.totalSpent / 1000).toFixed(0)}K
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ฿{(totalStats.totalRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.totalCustomers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg ROI</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalStats.averageROI}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
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
                        {campaign.name}
                      </h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge className={getTypeColor(campaign.type)}>
                        {campaign.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {campaign.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        ฿{(campaign.budget / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Budget</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        ฿{(campaign.spent / 1000).toFixed(0)}K spent
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ฿{(campaign.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Revenue</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {campaign.customers} customers
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {campaign.roi}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ROI</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {campaign.status === 'active' ? (
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