"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar, Clock, Users, Video, Play } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";

export default function WebinarsPage() {
  const upcomingWebinars = [
    {
      id: 1,
      title: "Maximizing Revenue with Data-Driven Pricing Strategies",
      date: "March 15, 2024",
      time: "2:00 PM - 3:00 PM (ICT)",
      duration: "60 minutes",
      presenter: "Dr. Sarah Johnson, Revenue Optimization Expert",
      description: "Learn how to use analytics to optimize your menu pricing, implement dynamic pricing strategies, and increase profitability without losing customers.",
      agenda: [
        "Understanding price elasticity in restaurants",
        "Dynamic pricing implementation strategies",
        "Case study: 35% revenue increase through pricing optimization",
        "Q&A with pricing experts"
      ],
      registrationUrl: "/register/pricing-strategies-webinar",
      attendees: 234
    },
    {
      id: 2,
      title: "Customer Behavior Analytics: Understanding Your Diners",
      date: "April 3, 2024", 
      time: "10:00 AM - 11:30 AM (ICT)",
      duration: "90 minutes",
      presenter: "Maria Rodriguez, Customer Analytics Lead",
      description: "Dive deep into customer behavior patterns, learn to predict dining preferences, and create personalized experiences that drive loyalty.",
      agenda: [
        "Customer segmentation strategies",
        "Predictive analytics for dining preferences",
        "Building customer lifetime value models",
        "Live demo: Customer analytics dashboard"
      ],
      registrationUrl: "/register/customer-behavior-webinar",
      attendees: 189
    },
    {
      id: 3,
      title: "Location Intelligence for Restaurant Expansion",
      date: "April 18, 2024",
      time: "3:00 PM - 4:30 PM (ICT)", 
      duration: "90 minutes",
      presenter: "Alex Chen, Location Analytics Specialist",
      description: "Master the art of location selection using demographic data, foot traffic analysis, and competitive landscape insights.",
      agenda: [
        "Site selection methodology",
        "Demographic and psychographic analysis",
        "Foot traffic prediction models",
        "Case study: Successful 5-location expansion"
      ],
      registrationUrl: "/register/location-intelligence-webinar",
      attendees: 156
    }
  ];

  const pastWebinars = [
    {
      id: 4,
      title: "Restaurant Recovery: Data-Driven Strategies for Post-Pandemic Growth",
      date: "February 28, 2024",
      duration: "75 minutes",
      presenter: "David Kim, Restaurant Recovery Expert",
      description: "Strategies for rebuilding and growing your restaurant business using data insights and operational optimization.",
      videoUrl: "/watch/restaurant-recovery-webinar",
      views: 1247
    },
    {
      id: 5,
      title: "Menu Engineering Masterclass: Optimizing for Profitability",
      date: "February 14, 2024",
      duration: "90 minutes", 
      presenter: "Emily Chen, Menu Analytics Expert",
      description: "Learn advanced menu engineering techniques to boost profitability and improve customer satisfaction.",
      videoUrl: "/watch/menu-engineering-webinar",
      views: 892
    },
    {
      id: 6,
      title: "Delivery & Takeout Optimization in the Digital Age",
      date: "January 31, 2024",
      duration: "60 minutes",
      presenter: "Michael Torres, Digital Operations Lead",
      description: "Optimize your delivery and takeout operations using data analytics and automation tools.",
      videoUrl: "/watch/delivery-optimization-webinar", 
      views: 673
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
              <Link href="/webinars" className="text-primary-600 font-medium">Webinars</Link>
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
              Restaurant Analytics Webinars
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our live training sessions with industry experts. Learn advanced analytics techniques, 
              best practices, and real-world strategies to grow your restaurant business.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Webinars</h2>
            <p className="text-lg text-gray-600">
              Reserve your spot for our upcoming live training sessions
            </p>
          </div>
          
          <div className="space-y-8">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                        <div className="ml-4 flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{webinar.attendees} registered</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{webinar.title}</h3>
                      <p className="text-gray-600 mb-4">{webinar.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{webinar.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{webinar.time}</span>
                        </div>
                        <div className="flex items-center">
                          <Video className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{webinar.duration}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">What You'll Learn:</h4>
                        <ul className="space-y-1">
                          {webinar.agenda.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Presenter:</strong> {webinar.presenter}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <h4 className="font-semibold text-gray-900 mb-4">Register Now</h4>
                        <p className="text-sm text-gray-600 mb-6">
                          This webinar is free for all BiteBase Intelligence users and restaurant professionals.
                        </p>
                        <Button 
                          size="lg" 
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white mb-4"
                          asChild
                        >
                          <Link href={webinar.registrationUrl}>Register Free</Link>
                        </Button>
                        <p className="text-xs text-gray-500">
                          You'll receive a confirmation email with the webinar link
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Webinars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">On-Demand Webinars</h2>
            <p className="text-lg text-gray-600">
              Catch up on previous sessions available to watch anytime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastWebinars.map((webinar) => (
              <Card key={webinar.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      On-Demand
                    </span>
                    <div className="ml-auto flex items-center text-sm text-gray-500">
                      <Play className="h-4 w-4 mr-1" />
                      <span>{webinar.views} views</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{webinar.title}</h3>
                  <p className="text-gray-600 mb-4">{webinar.description}</p>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Recorded: {webinar.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Duration: {webinar.duration}</span>
                    </div>
                    <div className="text-sm">
                      <strong>Presenter:</strong> {webinar.presenter}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    asChild
                  >
                    <Link href={webinar.videoUrl}>
                      <Play className="h-4 w-4 mr-2" />
                      Watch Now
                    </Link>
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
            Never Miss a Session
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Subscribe to our webinar newsletter and get notified about upcoming sessions, 
            exclusive content, and special industry reports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 flex-grow border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Subscribe
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