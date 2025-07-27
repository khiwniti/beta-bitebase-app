"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { TrendingUp, MapPin, Users, Award, ArrowRight } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      id: 1,
      title: "Milano Pizzeria: 40% Revenue Increase Through Data-Driven Menu Optimization",
      company: "Milano Pizzeria",
      location: "Bangkok, Thailand",
      industry: "Fast Casual Pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
      challenge: "Declining sales and poor menu performance with high food costs",
      solution: "Used BiteBase Intelligence to analyze menu performance, optimize pricing, and identify peak hours",
      results: [
        "40% increase in revenue within 6 months",
        "25% reduction in food waste",
        "15% improvement in customer satisfaction scores",
        "30% increase in repeat customers"
      ],
      tags: ["Menu Optimization", "Revenue Growth", "Cost Reduction"],
      slug: "milano-pizzeria-revenue-growth"
    },
    {
      id: 2,
      title: "Spice Garden: Expanding to 5 New Locations Using Location Intelligence",
      company: "Spice Garden Thai Cuisine",
      location: "Multiple Cities, Thailand",
      industry: "Thai Restaurant Chain",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
      challenge: "Difficulty finding optimal locations for expansion",
      solution: "Leveraged BiteBase location analytics and demographic data to identify prime locations",
      results: [
        "Successfully opened 5 new locations",
        "Average 23% higher revenue per location vs. competitors",
        "95% location success rate",
        "2x faster break-even time"
      ],
      tags: ["Location Intelligence", "Expansion", "Market Analysis"],
      slug: "spice-garden-expansion-success"
    },
    {
      id: 3,
      title: "Brew & Bite Café: Optimizing Operations During COVID-19",
      company: "Brew & Bite Café",
      location: "Chiang Mai, Thailand",
      industry: "Coffee Shop & Light Meals",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
      challenge: "Adapting to reduced capacity and changing customer behavior during pandemic",
      solution: "Used real-time analytics to optimize staffing, adjust menu offerings, and pivot to delivery",
      results: [
        "Maintained 85% of pre-pandemic revenue",
        "Reduced operating costs by 30%",
        "Increased delivery orders by 300%",
        "Improved operational efficiency by 45%"
      ],
      tags: ["Operations", "Crisis Management", "Delivery Optimization"],
      slug: "brew-bite-cafe-covid-adaptation"
    },
    {
      id: 4,
      title: "Ocean View Restaurant: Premium Pricing Strategy Success",
      company: "Ocean View Restaurant",
      location: "Phuket, Thailand",
      industry: "Fine Dining Seafood",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      challenge: "Underpricing premium dishes and missing revenue opportunities",
      solution: "Implemented dynamic pricing based on demand patterns and competitor analysis",
      results: [
        "35% increase in average ticket size",
        "20% improvement in profit margins",
        "Maintained customer satisfaction above 4.5/5",
        "15% increase in wine sales"
      ],
      tags: ["Premium Pricing", "Fine Dining", "Profit Optimization"],
      slug: "ocean-view-premium-pricing"
    },
    {
      id: 5,
      title: "Street Food Central: Scaling from Food Truck to Restaurant Chain",
      company: "Street Food Central",
      location: "Multiple Cities, Thailand",
      industry: "Street Food & Fast Casual",
      image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=600&h=400&fit=crop",
      challenge: "Scaling operations from single food truck to multi-location chain",
      solution: "Used BiteBase analytics to standardize operations, optimize supply chain, and maintain quality",
      results: [
        "Grew from 1 truck to 12 locations in 18 months",
        "Maintained consistent food quality across all locations",
        "40% reduction in inventory waste",
        "60% improvement in customer wait times"
      ],
      tags: ["Scaling", "Operations", "Supply Chain"],
      slug: "street-food-central-scaling"
    },
    {
      id: 6,
      title: "Green Leaf Vegan: Building a Sustainable Restaurant Model",
      company: "Green Leaf Vegan Kitchen",
      location: "Bangkok, Thailand",
      industry: "Plant-Based Restaurant",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
      challenge: "Creating profitable vegan restaurant while maintaining sustainability goals",
      solution: "Used data analytics to optimize plant-based menu, reduce waste, and target eco-conscious customers",
      results: [
        "Achieved profitability within 8 months",
        "Zero food waste to landfill",
        "25% higher margins than industry average",
        "4.8/5 sustainability rating from customers"
      ],
      tags: ["Sustainability", "Plant-Based", "Waste Reduction"],
      slug: "green-leaf-vegan-sustainability"
    }
  ];

  const stats = [
    { icon: TrendingUp, label: "Average Revenue Increase", value: "32%" },
    { icon: Users, label: "Restaurants Helped", value: "500+" },
    { icon: MapPin, label: "Successful Expansions", value: "150+" },
    { icon: Award, label: "Customer Satisfaction", value: "4.8/5" }
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
              <Link href="/case-studies" className="text-primary-600 font-medium">Case Studies</Link>
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
              Customer Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how restaurants around Thailand are using BiteBase Intelligence to grow their business, 
              optimize operations, and increase profitability.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-lg text-gray-600">
              The impact of data-driven restaurant management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">
              Real restaurants, real results, real impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={study.image}
                    alt={study.company}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {study.industry}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{study.location}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {study.title}
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Challenge:</strong> {study.challenge}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Solution:</strong> {study.solution}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Results:</h4>
                    <ul className="space-y-1">
                      {study.results.slice(0, 3).map((result, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {study.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-primary-600 border-primary-600 hover:bg-primary-600 hover:text-white"
                      asChild
                    >
                      <Link href={`/case-studies/${study.slug}`}>
                        Read More <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
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
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of restaurants that have transformed their business with BiteBase Intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/register">Start Free Trial</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
              asChild
            >
              <Link href="/contact">Schedule Demo</Link>
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