"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  Code, 
  Settings, 
  Users, 
  BarChart3, 
  MapPin, 
  DollarSign,
  Package,
  Megaphone,
  FileText,
  ChevronRight,
  ExternalLink,
  Download,
  Video,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  href: string;
  tags: string[];
}

export default function DocsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of BiteBase and set up your restaurant',
      icon: BookOpen,
      badge: 'Essential',
      articles: [
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          description: 'Get up and running with BiteBase in under 10 minutes',
          category: 'Setup',
          readTime: '5 min',
          href: '/docs/quick-start',
          tags: ['beginner', 'setup', 'basics']
        },
        {
          id: 'restaurant-setup',
          title: 'Restaurant Setup',
          description: 'Complete guide to setting up your restaurant profile',
          category: 'Setup',
          readTime: '8 min',
          href: '/docs/restaurant-setup',
          tags: ['setup', 'profile', 'configuration']
        },
        {
          id: 'dashboard-overview',
          title: 'Dashboard Overview',
          description: 'Understanding your BiteBase dashboard and key metrics',
          category: 'Interface',
          readTime: '6 min',
          href: '/docs/dashboard-overview',
          tags: ['dashboard', 'metrics', 'overview']
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'Understand your data and generate insights',
      icon: BarChart3,
      articles: [
        {
          id: 'market-analysis',
          title: 'Market Analysis',
          description: 'How to use location-based market intelligence',
          category: 'Analytics',
          readTime: '12 min',
          href: '/docs/market-analysis',
          tags: ['analytics', 'market', 'location']
        },
        {
          id: 'performance-metrics',
          title: 'Performance Metrics',
          description: 'Understanding key performance indicators',
          category: 'Analytics',
          readTime: '10 min',
          href: '/docs/performance-metrics',
          tags: ['kpi', 'performance', 'metrics']
        },
        {
          id: 'custom-reports',
          title: 'Custom Reports',
          description: 'Creating and scheduling custom analytics reports',
          category: 'Reports',
          readTime: '15 min',
          href: '/docs/custom-reports',
          tags: ['reports', 'custom', 'scheduling']
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      description: 'Deep dive into BiteBase features and capabilities',
      icon: Settings,
      articles: [
        {
          id: 'menu-engineering',
          title: 'Menu Engineering',
          description: 'Optimize your menu with data-driven insights',
          category: 'Features',
          readTime: '18 min',
          href: '/docs/menu-engineering',
          tags: ['menu', 'optimization', 'pricing']
        },
        {
          id: 'pricing-strategy',
          title: 'Pricing Strategy',
          description: 'Dynamic pricing and competitive analysis',
          category: 'Features',
          readTime: '14 min',
          href: '/docs/pricing-strategy',
          tags: ['pricing', 'strategy', 'competition']
        },
        {
          id: 'pos-integration',
          title: 'POS Integration',
          description: 'Connect your point-of-sale system',
          category: 'Integration',
          readTime: '20 min',
          href: '/docs/pos-integration',
          tags: ['pos', 'integration', 'sync']
        }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      description: 'Technical documentation for developers',
      icon: Code,
      badge: 'Technical',
      articles: [
        {
          id: 'api-overview',
          title: 'API Overview',
          description: 'Getting started with the BiteBase API',
          category: 'API',
          readTime: '10 min',
          href: '/docs/api-overview',
          tags: ['api', 'developer', 'integration']
        },
        {
          id: 'authentication',
          title: 'Authentication',
          description: 'API authentication and security',
          category: 'API',
          readTime: '8 min',
          href: '/docs/authentication',
          tags: ['auth', 'security', 'api']
        },
        {
          id: 'webhooks',
          title: 'Webhooks',
          description: 'Real-time data updates via webhooks',
          category: 'API',
          readTime: '12 min',
          href: '/docs/webhooks',
          tags: ['webhooks', 'realtime', 'api']
        }
      ]
    }
  ];

  const allArticles = docSections.flatMap(section => section.articles);
  
  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(allArticles.map(article => article.category)))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Documentation
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Guides, tutorials, and API reference
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <HelpCircle className="h-4 w-4" />
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searchQuery || selectedCategory !== 'all' ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} found
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {article.readTime}
                      </Badge>
                    </div>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link
                        href={article.href}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        Read more
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Documentation Sections */
          <div className="space-y-8">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h2>
                    {section.badge && (
                      <Badge variant="secondary">{section.badge}</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {section.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.articles.map((article) => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{article.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {article.readTime}
                            </Badge>
                          </div>
                          <CardDescription>{article.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1 flex-wrap">
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Link
                              href={article.href}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                            >
                              Read more
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Contact Support
            </Link>
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Video className="h-4 w-4" />
              Video Tutorials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
