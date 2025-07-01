"use client"

import React, { useState, useEffect } from 'react'
import { 
  Globe, 
  Star, 
  MessageCircle, 
  ThumbsUp,
  TrendingUp,
  TrendingDown,
  Eye,
  Share2,
  Heart,
  Users,
  Search,
  Smartphone,
  Monitor,
  Instagram,
  Facebook
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { MetricCard, DashboardGrid, ChartCard } from './DashboardGrid'

interface DigitalPresenceDashboardProps {
  className?: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data for digital presence analytics
const getDigitalMetrics = (timeRange: string) => ({
  onlineReviews: {
    value: '1,247',
    change: { value: 18.5, period: 'vs last period', trend: 'up' as const }
  },
  avgRating: {
    value: '4.6/5',
    change: { value: 0.2, period: 'vs last period', trend: 'up' as const }
  },
  socialFollowers: {
    value: '12.8K',
    change: { value: 15.3, period: 'vs last period', trend: 'up' as const }
  },
  onlineVisibility: {
    value: '85%',
    change: { value: 8.2, period: 'vs last period', trend: 'up' as const }
  },
  websiteTraffic: {
    value: '8,547',
    change: { value: 22.1, period: 'vs last period', trend: 'up' as const }
  },
  engagementRate: {
    value: '6.8%',
    change: { value: 1.2, period: 'vs last period', trend: 'up' as const }
  }
})

const getReviewPlatforms = () => [
  { 
    platform: 'Google Reviews', 
    reviews: 485, 
    rating: 4.7, 
    recentReviews: 28, 
    sentiment: 'positive',
    responseRate: 92
  },
  { 
    platform: 'Wongnai', 
    reviews: 342, 
    rating: 4.5, 
    recentReviews: 15, 
    sentiment: 'positive',
    responseRate: 88
  },
  { 
    platform: 'TripAdvisor', 
    reviews: 198, 
    rating: 4.4, 
    recentReviews: 8, 
    sentiment: 'positive',
    responseRate: 75
  },
  { 
    platform: 'Facebook', 
    reviews: 156, 
    rating: 4.6, 
    recentReviews: 12, 
    sentiment: 'positive',
    responseRate: 95
  },
  { 
    platform: 'Foursquare', 
    reviews: 66, 
    rating: 4.3, 
    recentReviews: 3, 
    sentiment: 'neutral',
    responseRate: 60
  }
]

const getSocialMediaMetrics = () => [
  {
    platform: 'Instagram',
    followers: 8500,
    engagement: 7.2,
    posts: 45,
    reach: 125000,
    growth: 18.5,
    icon: Instagram
  },
  {
    platform: 'Facebook',
    followers: 3200,
    engagement: 5.8,
    posts: 32,
    reach: 85000,
    growth: 12.3,
    icon: Facebook
  },
  {
    platform: 'TikTok',
    followers: 1100,
    engagement: 12.5,
    posts: 18,
    reach: 45000,
    growth: 35.8,
    icon: Smartphone
  }
]

const getOnlineVisibility = () => ({
  searchRankings: [
    { keyword: 'thai restaurant bangkok', position: 3, volume: 8900, difficulty: 'Medium' },
    { keyword: 'best pad thai sukhumvit', position: 1, volume: 2400, difficulty: 'Low' },
    { keyword: 'authentic thai food', position: 7, volume: 12000, difficulty: 'High' },
    { keyword: 'thai restaurant delivery', position: 5, volume: 5600, difficulty: 'Medium' },
    { keyword: 'sukhumvit restaurants', position: 2, volume: 3200, difficulty: 'Low' }
  ],
  directoryListings: [
    { directory: 'Google My Business', status: 'verified', completeness: 95, reviews: 485 },
    { directory: 'Wongnai', status: 'verified', completeness: 88, reviews: 342 },
    { directory: 'TripAdvisor', status: 'verified', completeness: 82, reviews: 198 },
    { directory: 'Foursquare', status: 'claimed', completeness: 75, reviews: 66 },
    { directory: 'Yelp', status: 'unclaimed', completeness: 45, reviews: 23 }
  ]
})

const getRecentReviews = () => [
  {
    platform: 'Google',
    author: 'Siriporn K.',
    rating: 5,
    text: 'Amazing Pad Thai! Best I\'ve had in Bangkok. Service was excellent too.',
    date: '2 days ago',
    responded: true
  },
  {
    platform: 'Wongnai',
    author: 'Niran P.',
    rating: 4,
    text: 'Good food quality but service could be faster during peak hours.',
    date: '3 days ago',
    responded: false
  },
  {
    platform: 'Facebook',
    author: 'Malee S.',
    rating: 5,
    text: 'Love the atmosphere and authentic flavors. Will definitely come back!',
    date: '5 days ago',
    responded: true
  }
]

export default function DigitalPresenceDashboard({ 
  className = '',
  timeRange = '30d',
  onTimeRangeChange 
}: DigitalPresenceDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(getDigitalMetrics(timeRange))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMetrics(getDigitalMetrics(timeRange))
      setLoading(false)
    }, 500)
  }, [timeRange])

  const reviewPlatforms = getReviewPlatforms()
  const socialMetrics = getSocialMediaMetrics()
  const visibility = getOnlineVisibility()
  const recentReviews = getRecentReviews()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Digital Presence</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor your online reputation and social media performance</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange?.(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="visibility">Visibility</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Digital Metrics */}
          <DashboardGrid>
            <MetricCard
              title="Online Reviews"
              value={metrics.onlineReviews.value}
              change={metrics.onlineReviews.change}
              icon={<MessageCircle className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Average Rating"
              value={metrics.avgRating.value}
              change={metrics.avgRating.change}
              icon={<Star className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Social Followers"
              value={metrics.socialFollowers.value}
              change={metrics.socialFollowers.change}
              icon={<Users className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
            <MetricCard
              title="Online Visibility"
              value={metrics.onlineVisibility.value}
              change={metrics.onlineVisibility.change}
              icon={<Eye className="h-5 w-5" />}
              status="connected"
              loading={loading}
            />
          </DashboardGrid>

          {/* Digital Presence Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Summary</CardTitle>
                <CardDescription>Overview of your online reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-green-600" />
                      <span className="font-medium">5 Star Reviews</span>
                    </div>
                    <span className="font-semibold text-green-600">68%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">4 Star Reviews</span>
                    </div>
                    <span className="font-semibold text-blue-600">22%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">3 Star Reviews</span>
                    </div>
                    <span className="font-semibold text-yellow-600">7%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-red-600" />
                      <span className="font-medium">1-2 Star Reviews</span>
                    </div>
                    <span className="font-semibold text-red-600">3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Latest customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.author}</span>
                          <span className="text-xs text-gray-500">{review.platform}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{review.date}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          review.responded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.responded ? 'Responded' : 'Needs Response'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Review Platforms */}
          <Card>
            <CardHeader>
              <CardTitle>Review Platforms Performance</CardTitle>
              <CardDescription>Your presence across different review platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewPlatforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{platform.platform}</div>
                        <div className="text-sm text-gray-500">{platform.reviews} reviews</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="font-semibold">{platform.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">+{platform.recentReviews}</div>
                        <div className="text-xs text-gray-500">This month</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{platform.responseRate}%</div>
                        <div className="text-xs text-gray-500">Response rate</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        platform.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        platform.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {platform.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {/* Social Media Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Performance</CardTitle>
              <CardDescription>Your social media presence and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {socialMetrics.map((social, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <social.icon className="h-6 w-6 text-gray-400" />
                      <h4 className="font-semibold">{social.platform}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Followers</span>
                        <span className="font-semibold">{social.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement</span>
                        <span className="font-semibold">{social.engagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Posts</span>
                        <span className="font-semibold">{social.posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reach</span>
                        <span className="font-semibold">{(social.reach / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth</span>
                        <span className="font-semibold text-green-600">+{social.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-6">
          {/* Search Rankings */}
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Rankings</CardTitle>
              <CardDescription>Your position for key search terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibility.searchRankings.map((ranking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{ranking.keyword}</div>
                        <div className="text-sm text-gray-500">{ranking.volume.toLocaleString()} searches/month</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-lg">#{ranking.position}</div>
                        <div className="text-xs text-gray-500">Position</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ranking.difficulty === 'Low' ? 'bg-green-100 text-green-800' :
                        ranking.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ranking.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Directory Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Directory Listings</CardTitle>
              <CardDescription>Your presence in online directories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibility.directoryListings.map((listing, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{listing.directory}</div>
                        <div className="text-sm text-gray-500">{listing.reviews} reviews</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold">{listing.completeness}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        listing.status === 'verified' ? 'bg-green-100 text-green-800' :
                        listing.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
