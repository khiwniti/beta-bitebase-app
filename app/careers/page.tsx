"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MapPin, Users, Award, TrendingUp, Globe, Heart, Clock, DollarSign, Home } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / Bangkok, Thailand",
      type: "Full-time",
      description: "Join our engineering team to build the next generation of restaurant analytics platform using React, Node.js, and AI technologies.",
      requirements: ["5+ years full-stack development", "React/Next.js expertise", "Node.js/Express experience", "PostgreSQL knowledge"],
      salary: "$80,000 - $120,000"
    },
    {
      title: "Data Scientist - Restaurant Analytics",
      department: "Data Science",
      location: "Remote / Bangkok, Thailand", 
      type: "Full-time",
      description: "Drive insights from restaurant data using machine learning, statistical analysis, and predictive modeling to help restaurants succeed.",
      requirements: ["PhD/Masters in Data Science", "Python/R proficiency", "ML/AI experience", "Restaurant industry knowledge preferred"],
      salary: "$90,000 - $130,000"
    },
    {
      title: "Product Manager - AI Features",
      department: "Product",
      location: "Remote / Bangkok, Thailand",
      type: "Full-time", 
      description: "Lead product strategy for AI-powered features, working closely with engineering and data science teams to deliver innovative solutions.",
      requirements: ["5+ years product management", "AI/ML product experience", "Restaurant/hospitality background", "Strong analytical skills"],
      salary: "$100,000 - $140,000"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Bangkok, Thailand",
      type: "Full-time",
      description: "Help restaurant owners maximize their success with BiteBase by providing onboarding, training, and ongoing support.",
      requirements: ["3+ years customer success", "Restaurant industry experience", "Thai and English fluency", "Strong communication skills"],
      salary: "฿800,000 - ฿1,200,000"
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive and beautiful user experiences for restaurant owners, focusing on data visualization and dashboard design.",
      requirements: ["4+ years UX/UI design", "Figma/Sketch expertise", "Data visualization experience", "Portfolio required"],
      salary: "$70,000 - $100,000"
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and maintain our cloud infrastructure, ensuring scalability, security, and reliability for our growing platform.",
      requirements: ["AWS/GCP expertise", "Docker/Kubernetes", "CI/CD pipelines", "Security best practices"],
      salary: "$85,000 - $125,000"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Market-leading compensation with equity options for all employees"
    },
    {
      icon: Home,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and quarterly team meetups"
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, wellness stipend, and mental health support"
    },
    {
      icon: TrendingUp,
      title: "Growth & Learning",
      description: "Professional development budget, conference attendance, and mentorship programs"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Unlimited PTO, sabbatical options, and family-friendly policies"
    },
    {
      icon: Users,
      title: "Amazing Team",
      description: "Work with passionate, talented people who care about making an impact"
    }
  ];

  const companyValues = [
    {
      title: "Customer Obsession",
      description: "We start with the customer and work backwards, ensuring every decision serves restaurant owners better."
    },
    {
      title: "Data-Driven Decisions", 
      description: "We believe in the power of data and evidence to guide our product and business decisions."
    },
    {
      title: "Continuous Innovation",
      description: "We're always pushing boundaries with new technologies and approaches to solve complex problems."
    },
    {
      title: "Inclusive Culture",
      description: "We build diverse, inclusive teams where everyone can do their best work and grow their careers."
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
              <Link href="/careers" className="text-primary-600 font-medium">Careers</Link>
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
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Help us transform the restaurant industry with data-driven insights. 
              Join a team of passionate innovators building the future of restaurant technology.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Remote-First Company
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                50+ Team Members
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                10+ Countries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide how we work and make decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Work at BiteBase?</h2>
            <p className="text-lg text-gray-600">
              We offer comprehensive benefits and a supportive environment for your career growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">
              Join our growing team and help shape the future of restaurant technology
            </p>
          </div>
          
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <span className="ml-3 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-4">{job.department}</span>
                        <span className="mr-4 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="lg:ml-6 mt-4 lg:mt-0">
                      <Button className="w-full lg:w-auto bg-primary-600 hover:bg-primary-700">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
            <p className="text-lg text-gray-600">
              We believe in a fair, transparent, and efficient hiring process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-sm text-gray-600">Submit your application with resume and cover letter</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Screen</h3>
              <p className="text-sm text-gray-600">Initial conversation with our talent team (30 mins)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical Interview</h3>
              <p className="text-sm text-gray-600">Role-specific interviews with team members (2-3 hours)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Final Decision</h3>
              <p className="text-sm text-gray-600">Reference checks and offer discussion</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See the Right Role?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            We're always looking for talented individuals who share our passion for innovation. 
            Send us your resume and tell us how you'd like to contribute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary-600"
              asChild
            >
              <Link href="/about">Learn More About Us</Link>
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