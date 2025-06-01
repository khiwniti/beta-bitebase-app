"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Button } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { 
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  DollarSign,
  Users,
  Eye,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Mail,
  MessageSquare,
  Instagram,
  Facebook
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  type: 'promotion' | 'loyalty' | 'social' | 'email'
  status: 'active' | 'paused' | 'completed' | 'draft'
  startDate: string
  endDate: string
  budget: number
  spent: number
  revenue: number
  customers: number
  impressions: number
  clicks: number
  conversions: number
  roi: number
  description: string
  channel: string[]
}

const campaignsData: Campaign[] = [
  {
    id: '1',
    name: 'Weekend Pasta Special',
    type: 'promotion',
    status: 'active',
    startDate: '2025-05-25',
    endDate: '2025-06-08',
    budget: 15000,
    spent: 8500,
    revenue: 42300,
    customers: 156,
    impressions: 12400,
    clicks: 890,
    conversions: 156,
    roi: 397,
    description: '20% off pasta dishes on weekends',
    channel: ['Instagram', 'Facebook', 'In-store']
  },
  {
    id: '2',
    name: 'Lunch Express Campaign',
    type: 'promotion',
    status: 'active',
    startDate: '2025-05-20',
    endDate: '2025-06-20',
    budget: 25000,
    spent: 12800,
    revenue: 68900,
    customers: 234,
    impressions: 18600,
    clicks: 1240,
    conversions: 234,
    roi: 438,
    description: 'Quick lunch menu for office workers',
    channel: ['Email', 'Google Ads', 'LinkedIn']
  },
  {
    id: '3',
    name: 'Bella Rewards Launch',
    type: 'loyalty',
    status: 'completed',
    startDate: '2025-04-15',
    endDate: '2025-05-15',
    budget: 35000,
    spent: 35000,
    revenue: 125600,
    customers: 445,
    impressions: 25800,
    clicks: 2100,
    conversions: 445,
    roi: 259,
    description: 'Customer loyalty program launch',
    channel: ['Email', 'SMS', 'In-store', 'App']
  },
  {
    id: '4',
    name: 'Instagram Food Photography',
    type: 'social',
    status: 'paused',
    startDate: '2025-05-01',
    endDate: '2025-06-30',
    budget: 20000,
    spent: 6800,
    revenue: 18400,
    customers: 89,
    impressions: 45600,
    clicks: 1890,
    conversions: 89,
    roi: 170,
    description: 'User-generated content campaign',
    channel: ['Instagram', 'TikTok']
  },
  {
    id: '5',
    name: 'Summer Menu Preview',
    type: 'email',
    status: 'draft',
    startDate: '2025-06-01',
    endDate: '2025-06-15',
    budget: 8000,
    spent: 0,
    revenue: 0,
    customers: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    roi: 0,
    description: 'Email campaign for new summer menu',
    channel: ['Email', 'Newsletter']
  }
]

const campaignStats = {
  totalCampaigns: campaignsData.length,
  activeCampaigns: campaignsData.filter(c => c.status === 'active').length,
  totalBudget: campaignsData.reduce((sum, c) => sum + c.budget, 0),
  totalSpent: campaignsData.reduce((sum, c) => sum + c.spent, 0),
  totalRevenue: campaignsData.reduce((sum, c) => sum + c.revenue, 0),
  averageROI: Math.round(campaignsData.filter(c => c.roi > 0).reduce((sum, c) => sum + c.roi, 0) / campaignsData.filter(c => c.roi > 0).length)
}

export default function CampaignManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredCampaigns = campaignsData.filter(campaign => {
    const statusMatch = selectedStatus === 'all' || campaign.status === selectedStatus
    const typeMatch = selectedType === 'all' || campaign.type === selectedType
    return statusMatch && typeMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <Target className="w-4 h-4" />
      case 'loyalty': return <Users className="w-4 h-4" />
      case 'social': return <Instagram className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      default: return <Megaphone className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />
      case 'paused': return <Pause className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'draft': return <Edit className="w-3 h-3" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaign Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage all your marketing campaigns and projects
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {campaignStats.totalCampaigns}
                </p>
              </div>
              <Megaphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {campaignStats.activeCampaigns}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ฿{(campaignStats.totalBudget / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ฿{(campaignStats.totalSpent / 1000).toFixed(0)}K
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ฿{(campaignStats.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg ROI</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {campaignStats.averageROI}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>

            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="promotion">Promotion</option>
              <option value="loyalty">Loyalty</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
            </select>

            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
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
                    <div className="flex items-center gap-2">
                      {getTypeIcon(campaign.type)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.name}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {campaign.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {campaign.channel.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
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
                      {campaign.roi > 0 ? `${campaign.roi}%` : '-'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ROI</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.conversions} conversions
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {campaign.impressions > 0 ? `${(campaign.impressions / 1000).toFixed(1)}K` : '-'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Impressions</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {campaign.clicks} clicks
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {campaign.status === 'active' && (
                    <Button size="sm" variant="outline">
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  {campaign.status === 'paused' && (
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  {campaign.status === 'draft' && (
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Launch
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common campaign management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium">Create Promotion</span>
              <span className="text-xs text-gray-500">Launch a new promotional campaign</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium">Loyalty Program</span>
              <span className="text-xs text-gray-500">Set up customer rewards</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Instagram className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium">Social Campaign</span>
              <span className="text-xs text-gray-500">Create social media content</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Mail className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium">Email Campaign</span>
              <span className="text-xs text-gray-500">Send targeted emails</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}