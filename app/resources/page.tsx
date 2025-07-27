"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, Video, BookOpen, Download, ExternalLink, Users } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";

export default function ResourcesPage() {
  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of BiteBase Intelligence and get your restaurant set up in minutes.",
      type: "Guide",
      icon: BookOpen,
      downloadUrl: "/guides/getting-started.pdf",
      size: "2.3 MB"
    },
    {
      title: "Restaurant Analytics Best Practices",
      description: "Comprehensive guide to interpreting and acting on your restaurant analytics data.",
      type: "Whitepaper",
      icon: FileText,
      downloadUrl: "/whitepapers/analytics-best-practices.pdf",
      size: "5.1 MB"
    },
    {
      title: "API Documentation",
      description: "Complete reference for BiteBase Intelligence APIs and webhooks.",
      type: "Documentation",
      icon: FileText,
      downloadUrl: "/documentation",
      isExternal: true
    },
    {
      title: "Dashboard Overview Training",
      description: "Video walkthrough of the BiteBase Intelligence dashboard and key features.",
      type: "Video",
      icon: Video,
      downloadUrl: "https://vimeo.com/bitebase/dashboard-overview",
      duration: "15 min"
    },
    {
      title: "Menu Engineering Template",
      description: "Excel template for analyzing menu performance and optimizing profitability.",
      type: "Template",
      icon: Download,
      downloadUrl: "/templates/menu-engineering.xlsx",
      size: "156 KB"
    },
    {
      title: "Industry Benchmarks Report",
      description: "Latest restaurant industry performance benchmarks and market insights.",
      type: "Report",
      icon: FileText,
      downloadUrl: "/reports/industry-benchmarks-2024.pdf",
      size: "8.7 MB"
    }
  ];

  const webinars = [
    {
      title: "Maximizing Revenue with Data-Driven Pricing",
      date: "March 15, 2024",
      duration: "45 min",
      registrationUrl: "/webinars/data-driven-pricing"
    },
    {
      title: "Understanding Customer Behavior Analytics",
      date: "April 3, 2024", 
      duration: "60 min",
      registrationUrl: "/webinars/customer-behavior"
    },
    {
      title: "Location Intelligence for Restaurant Growth",
      date: "April 18, 2024",
      duration: "50 min", 
      registrationUrl: "/webinars/location-intelligence"
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
              <Link href="/resources" className="text-primary-600 font-medium">Resources</Link>
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
                <Link href="/auth/register">Get Started</Link>
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
              Resource Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed with BiteBase Intelligence. From getting started guides to advanced analytics techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Downloads & Guides</h2>
            <p className="text-lg text-gray-600">
              Free resources to help you get the most out of restaurant analytics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mr-4">
                      <resource.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {resource.size && <span>{resource.size}</span>}
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                      asChild
                    >
                      <Link href={resource.downloadUrl} target={resource.isExternal ? "_blank" : undefined}>
                        {resource.isExternal ? (
                          <>
                            View <ExternalLink className="h-4 w-4 ml-1" />
                          </>
                        ) : (
                          <>
                            Download <Download className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Webinars</h2>
            <p className="text-lg text-gray-600">
              Join our live training sessions with restaurant analytics experts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Webinar
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{webinar.title}</h3>
                  
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <div>Date: {webinar.date}</div>
                    <div>Duration: {webinar.duration}</div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link href={webinar.registrationUrl}>Register Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need More Help?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Our customer success team is here to help you get the most out of BiteBase Intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
              asChild
            >
              <Link href="/help">Help Center</Link>
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