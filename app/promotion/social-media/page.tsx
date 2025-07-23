'use client';

import React, { useState } from 'react';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Plus, 
  TrendingUp, 
  Users, 
  Eye,
  Heart,
  MessageCircle,
  Share,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  BarChart3
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  content: string;
  image?: string;
  scheduledDate: string;
  status: 'scheduled' | 'published' | 'draft';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: 'Fresh summer pasta with garden vegetables! 🍝🌿 #SummerMenu #FreshIngredients',
    scheduledDate: '2025-07-24T12:00:00',
    status: 'scheduled',
    engagement: { likes: 0, comments: 0, shares: 0, views: 0 }
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'Join us for Happy Hour every weekday 4-6 PM! Special prices on drinks and appetizers.',
    scheduledDate: '2025-07-23T16:00:00',
    status: 'published',
    engagement: { likes: 45, comments: 8, shares: 12, views: 320 }
  },
  {
    id: '3',
    platform: 'twitter',
    content: 'Weekend special: 20% off all pasta dishes! Book your table now. #WeekendSpecial',
    scheduledDate: '2025-07-22T10:00:00',
    status: 'published',
    engagement: { likes: 28, comments: 5, shares: 15, views: 180 }
  }
];

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredPosts = posts.filter(post => 
    selectedPlatform === 'all' || post.platform === selectedPlatform
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      default: return <Share className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'twitter': return 'bg-sky-100 text-sky-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalEngagement = posts.reduce((sum, post) => ({
    likes: sum.likes + post.engagement.likes,
    comments: sum.comments + post.engagement.comments,
    shares: sum.shares + post.engagement.shares,
    views: sum.views + post.engagement.views
  }), { likes: 0, comments: 0, shares: 0, views: 0 });

  return (
    <MainLayout pageTitle="Social Media Marketing" pageDescription="Manage social media marketing campaigns">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Social Media Marketing</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage social media marketing campaigns
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Engagement Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalEngagement.views}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalEngagement.likes}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalEngagement.comments}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shares</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalEngagement.shares}
                  </p>
                </div>
                <Share className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-medium">2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Engagement</span>
                  <span className="font-medium">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posts This Month</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                Facebook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Page Likes</span>
                  <span className="font-medium">1,890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reach</span>
                  <span className="font-medium">5,670</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posts This Month</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-sky-600" />
                Twitter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-medium">890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Impressions</span>
                  <span className="font-medium">12,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tweets This Month</span>
                  <span className="font-medium">15</span>
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
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Post Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getPlatformColor(post.platform)}>
                        {getPlatformIcon(post.platform)}
                        <span className="ml-1 capitalize">{post.platform}</span>
                      </Badge>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-900 dark:text-white mb-3">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.status === 'scheduled' ? 'Scheduled for' : 'Published on'} {new Date(post.scheduledDate).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {post.engagement.views}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {post.engagement.likes}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {post.engagement.comments}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {post.engagement.shares}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Shares</div>
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