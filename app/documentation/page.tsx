"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, Code, ExternalLink, Book, Zap, Shield } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";

export default function DocumentationPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Quick start guides and basic setup instructions",
      icon: Zap,
      links: [
        { title: "API Quick Start", url: "/docs/quickstart" },
        { title: "Authentication", url: "/docs/authentication" },
        { title: "Making Your First API Call", url: "/docs/first-call" },
        { title: "Error Handling", url: "/docs/errors" }
      ]
    },
    {
      title: "API Reference",
      description: "Complete API endpoints and parameters documentation",
      icon: Code,
      links: [
        { title: "Restaurant Data API", url: "/docs/api/restaurants" },
        { title: "Analytics API", url: "/docs/api/analytics" },
        { title: "Location Intelligence API", url: "/docs/api/location" },
        { title: "Market Research API", url: "/docs/api/market" }
      ]
    },
    {
      title: "Webhooks",
      description: "Real-time notifications and event handling",
      icon: Shield,
      links: [
        { title: "Webhook Overview", url: "/docs/webhooks/overview" },
        { title: "Event Types", url: "/docs/webhooks/events" },
        { title: "Security & Verification", url: "/docs/webhooks/security" },
        { title: "Testing Webhooks", url: "/docs/webhooks/testing" }
      ]
    },
    {
      title: "SDK & Libraries",
      description: "Official SDKs and community libraries",
      icon: Book,
      links: [
        { title: "JavaScript/Node.js SDK", url: "/docs/sdk/javascript" },
        { title: "Python SDK", url: "/docs/sdk/python" },
        { title: "PHP SDK", url: "/docs/sdk/php" },
        { title: "Community Libraries", url: "/docs/sdk/community" }
      ]
    }
  ];

  const examples = [
    {
      title: "Get Restaurant Data",
      description: "Fetch detailed restaurant information and analytics",
      language: "javascript",
      code: `const bitebase = require('@bitebase/sdk');

const client = new bitebase.Client({
  apiKey: 'your_api_key_here'
});

// Get restaurant by ID
const restaurant = await client.restaurants.get('rest_123');

// Search restaurants by location
const restaurants = await client.restaurants.search({
  latitude: 13.7563,
  longitude: 100.5018,
  radius: 5000,
  cuisine: 'thai'
});`
    },
    {
      title: "Analyze Market Data",
      description: "Get market insights and competitive analysis",
      language: "python",
      code: `import bitebase

client = bitebase.Client(api_key='your_api_key_here')

# Get market analysis for a location
analysis = client.market.analyze(
    latitude=13.7563,
    longitude=100.5018,
    radius=2000,
    analysis_type='competition'
)

# Get demographic data
demographics = client.location.demographics(
    latitude=13.7563,
    longitude=100.5018
)`
    },
    {
      title: "Real-time Analytics",
      description: "Stream real-time restaurant performance data",
      language: "javascript",
      code: `// Subscribe to real-time updates
const subscription = client.analytics.subscribe({
  restaurantId: 'rest_123',
  metrics: ['revenue', 'orders', 'customers'],
  interval: '1m'
});

subscription.on('data', (data) => {
  console.log('Real-time metrics:', data);
});

subscription.on('error', (error) => {
  console.error('Subscription error:', error);
});`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <BiteBaseLogo size="sm" showText={false} />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
              <Link href="/documentation" className="text-primary-600 font-medium">API Docs</Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link>
            </nav>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 hidden sm:inline-flex"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary-600 hover:bg-primary-700 text-white"
                asChild
              >
                <Link href="/auth/register">Get API Key</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              API Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive documentation for the BiteBase Intelligence API. 
              Integrate restaurant data, analytics, and market insights into your applications.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Documentation Sections</h2>
            <p className="text-lg text-gray-600">
              Find what you need to integrate BiteBase Intelligence into your application
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mr-4">
                      <section.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{section.description}</p>
                  
                  <div className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <Link 
                        key={linkIndex}
                        href={link.url}
                        className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {link.title}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>
            <p className="text-lg text-gray-600">
              Get started quickly with these practical examples
            </p>
          </div>
          
          <div className="space-y-8">
            {examples.map((example, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{example.title}</h3>
                      <p className="text-gray-600 mb-4">{example.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white"
                      >
                        View Full Documentation
                      </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-6 overflow-x-auto">
                      <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                        {example.language}
                      </div>
                      <pre className="text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Status */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Status & Support</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Status</h3>
                <p className="text-green-600 font-medium">All Systems Operational</p>
                <p className="text-sm text-gray-500 mt-2">99.9% uptime in the last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Limits</h3>
                <p className="text-gray-600">1,000 requests/hour</p>
                <p className="text-sm text-gray-500 mt-2">Contact us for higher limits</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <ExternalLink className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600">24/7 Developer Support</p>
                <p className="text-sm text-gray-500 mt-2">Response within 2 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Get your API key and start integrating restaurant intelligence into your application today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/register">Get API Key</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
              asChild
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <BiteBaseLogo size="sm" showText={false} variant="white" />
              <p className="text-gray-400 mt-4">
                Empowering restaurants with data-driven insights for success.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/restaurant-explorer" className="hover:text-white">Restaurant Explorer</Link></li>
                <li><Link href="/market-analysis" className="hover:text-white">Market Analysis</Link></li>
                <li><Link href="/reports" className="hover:text-white">Reports</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BiteBase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}