"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  Video,
  FileText,
  Settings,
  BarChart3,
  MapPin,
  DollarSign,
  Users,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface HelpResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'article' | 'tutorial';
  category: string;
  duration?: string;
  href: string;
}

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: 'setup-restaurant',
      question: 'How do I set up my restaurant profile?',
      answer: 'Navigate to Restaurant Settings and complete all required fields including location, cuisine type, operating hours, and contact information. This helps our AI provide more accurate insights.',
      category: 'Getting Started',
      tags: ['setup', 'profile', 'restaurant']
    },
    {
      id: 'connect-pos',
      question: 'How do I connect my POS system?',
      answer: 'Go to Settings > POS Integration and select your POS provider. Follow the step-by-step integration guide. We support Toast, Square, Clover, and 20+ other systems.',
      category: 'Integration',
      tags: ['pos', 'integration', 'setup']
    },
    {
      id: 'read-analytics',
      question: 'How do I interpret the analytics dashboard?',
      answer: 'The dashboard shows key metrics like revenue trends, customer patterns, and market positioning. Hover over any chart for detailed explanations, or visit our Analytics Guide.',
      category: 'Analytics',
      tags: ['dashboard', 'analytics', 'metrics']
    },
    {
      id: 'pricing-strategy',
      question: 'How does the pricing optimization work?',
      answer: 'Our AI analyzes local market data, competitor pricing, and your costs to suggest optimal menu prices. Recommendations are updated weekly based on market changes.',
      category: 'Features',
      tags: ['pricing', 'optimization', 'ai']
    },
    {
      id: 'data-accuracy',
      question: 'How accurate is the market data?',
      answer: 'We aggregate data from multiple sources including public records, review platforms, and partner networks. Data is updated daily and has 95%+ accuracy for major markets.',
      category: 'Data',
      tags: ['accuracy', 'data', 'market']
    },
    {
      id: 'export-reports',
      question: 'Can I export reports and data?',
      answer: 'Yes! All reports can be exported to PDF, Excel, or CSV formats. You can also schedule automated email reports on a daily, weekly, or monthly basis.',
      category: 'Reports',
      tags: ['export', 'reports', 'pdf']
    }
  ];

  const helpResources: HelpResource[] = [
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      description: 'Get up and running with BiteBase in under 10 minutes',
      type: 'guide',
      category: 'Getting Started',
      duration: '10 min',
      href: '/docs/quick-start'
    },
    {
      id: 'dashboard-tour',
      title: 'Dashboard Overview Video',
      description: 'Visual walkthrough of the main dashboard features',
      type: 'video',
      category: 'Getting Started',
      duration: '8 min',
      href: '/docs/dashboard-tour'
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis Deep Dive',
      description: 'Learn to use location intelligence for business decisions',
      type: 'tutorial',
      category: 'Analytics',
      duration: '25 min',
      href: '/docs/market-analysis'
    },
    {
      id: 'menu-optimization',
      title: 'Menu Engineering Guide',
      description: 'Step-by-step menu optimization strategies',
      type: 'article',
      category: 'Features',
      duration: '15 min',
      href: '/docs/menu-optimization'
    },
    {
      id: 'api-documentation',
      title: 'API Documentation',
      description: 'Complete developer reference for BiteBase API',
      type: 'guide',
      category: 'Developer',
      href: '/docs/api'
    },
    {
      id: 'troubleshooting',
      title: 'Common Issues & Solutions',
      description: 'Solutions to frequently encountered problems',
      type: 'article',
      category: 'Troubleshooting',
      duration: '12 min',
      href: '/docs/troubleshooting'
    }
  ];

  const categories = ['all', ...Array.from(new Set([...faqs.map(f => f.category), ...helpResources.map(r => r.category)]))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredResources = helpResources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'guide': return <Book className="h-4 w-4" />;
      case 'tutorial': return <Settings className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'guide': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'tutorial': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

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
              <div className="flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Help Center
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get help with BiteBase features and troubleshooting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Contact Section */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get instant help from our support team</p>
                <Badge className="mt-2 bg-green-100 text-green-800">Available 24/7</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Send us a detailed message</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Response in 2-4 hours</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Phone Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Speak directly with our team</p>
                <Badge className="mt-2 bg-purple-100 text-purple-800">Mon-Fri 9AM-6PM PST</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All Topics' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQs */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{faq.question}</CardTitle>
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${
                          expandedFaq === faq.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                  {expandedFaq === faq.id && (
                    <CardContent className="pt-0">
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{faq.answer}</p>
                      <div className="flex gap-1 flex-wrap">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Help Resources */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Guides & Resources
            </h2>
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{resource.title}</CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                      </div>
                      {resource.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {resource.duration}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                      <Link
                        href={resource.href}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                      >
                        View {resource.type}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Still need help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you succeed. Whether you need technical assistance, 
              have questions about features, or want to explore advanced capabilities, we're just a message away.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
