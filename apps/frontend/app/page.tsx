"use client"

import React, { useState } from "react"
import { Providers } from "./providers"
import BiteBaseLogo from "../components/BiteBaseLogo"
import Link from "next/link"
import {
  MapPin,
  BarChart3,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Clock,
  DollarSign,
  Store,
  ClipboardList,
  ChevronDown,
  Download,
  Menu
} from "lucide-react"

export default function HomePage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 font-sans antialiased overflow-x-hidden">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-100 fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <BiteBaseLogo size="xs" showText={false} />
                  <span className="ml-2 text-xl font-bold text-gray-900">BiteBase</span>
                  <span className="ml-1 text-sm text-gray-500">Intelligence</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <a href="#features" className="nav-link-inactive px-3 py-2 text-sm font-medium">
                    Features
                  </a>
                  <a href="#pricing" className="nav-link-inactive px-3 py-2 text-sm font-medium">
                    Pricing
                  </a>
                  <a href="#demo" className="nav-link-inactive px-3 py-2 text-sm font-medium">
                    Demo
                  </a>
                  <a href="#testimonials" className="nav-link-inactive px-3 py-2 text-sm font-medium">
                    Testimonials
                  </a>
                  <Link href="/demo-login" className="nav-link-inactive px-3 py-2 text-sm font-medium">
                    Demo Login
                  </Link>
                  <Link href="/auth" className="nav-link-inactive px-3 py-2 text-sm font-medium">
                    Sign In
                  </Link>
                  <Link href="/auth" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="md:hidden">
                <button className="text-gray-500 hover:text-green-600 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 overflow-hidden">
          {/* Floating Shapes */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute w-72 h-72 bg-green-500 rounded-full opacity-10 -top-24 -right-24 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
            <div className="absolute w-48 h-48 bg-green-500 rounded-full opacity-10 -bottom-12 -left-12 animate-spin" style={{ animation: 'spin 15s linear infinite reverse' }}></div>
            <div className="absolute w-36 h-36 bg-green-500 rounded-full opacity-10 top-1/2 left-1/3 animate-bounce" style={{ animation: 'bounce 6s ease-in-out infinite' }}></div>
            <div className="absolute w-24 h-24 bg-green-500 rounded-full opacity-10 bottom-1/4 right-1/4 animate-bounce" style={{ animation: 'bounce 5s ease-in-out infinite reverse' }}></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute w-24 h-24 top-1/5 left-1/20 bg-green-500 opacity-20 z-0" style={{
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            animation: 'float 8s ease-in-out infinite, spin 20s linear infinite'
          }}></div>
          <div className="absolute w-36 h-36 bottom-1/10 right-1/20 bg-green-500 opacity-20 z-0" style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animation: 'float 7s ease-in-out infinite reverse, spin 25s linear infinite'
          }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
            <div className="text-center">
              <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-500 font-semibold mb-6 hover:rotate-3 transition-transform">
                🚀 AI-Powered Restaurant Intelligence
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Introducing <span className="text-green-600 hover:scale-105 transition-transform inline-block">BiteBase</span> Intelligence
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold text-green-600 mb-8">
                Data-Driven Restaurant Success
              </h2>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                Harness the power of AI to analyze markets, optimize locations, and outperform competitors with BiteBase Intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/auth" className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  Start Free Trial
                </Link>
                <a href="#demo" className="btn-secondary border-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:rotate-1 flex items-center">
                  <Play className="w-5 h-5 mr-2" /> Watch Demo
                </a>
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span>Trusted by 5,000+ restaurants worldwide</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★★★★★</span>
                  <span>4.8/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
            <div className="relative rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Restaurant analytics dashboard"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-semibold mb-2">See it in action</h3>
                <p className="text-white/90">Our AI-powered dashboard gives you real-time insights</p>
                <button className="mt-4 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium flex items-center hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 mr-2" /> Watch demo
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-green-600 text-2xl animate-bounce cursor-pointer">
            <ChevronDown />
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">87%</div>
                <div className="text-gray-600">Increase in success rate</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:-rotate-1">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-600">Restaurants using our platform</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">$1.2M</div>
                <div className="text-gray-600">Average revenue increase</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:-rotate-1">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">40h</div>
                <div className="text-gray-600">Saved per month on research</div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 25s linear infinite reverse' }}></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-500 font-semibold mb-4 hover:rotate-3 transition-transform">
                Features
              </span>
              <h3 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">Everything you need to succeed</h3>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform provides comprehensive tools to analyze every aspect of your restaurant business.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                  <MapPin className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Location Intelligence</h3>
                <p className="text-gray-600">
                  AI-powered site selection with demographic analysis and foot traffic insights to help you find the perfect location.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                  <BarChart3 className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Market Analysis</h3>
                <p className="text-gray-600">
                  Comprehensive market research with competitive landscape analysis to identify opportunities and threats.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                  <Users className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Insights</h3>
                <p className="text-gray-600">
                  Deep customer behavior analysis and preference modeling to help you understand your target audience.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                  <DollarSign className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Revenue Optimization</h3>
                <p className="text-gray-600">
                  Menu engineering and pricing strategies to maximize profitability and increase average check size.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                  <Store className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Restaurant Setup</h3>
                <p className="text-gray-600">
                  Guided setup process with interactive map analysis and goal setting to ensure your success from day one.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 animate-pulse">
                  <ClipboardList className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Reports</h3>
                <p className="text-gray-600">
                  AI-generated insights and recommendations delivered to your inbox, saving you hours of analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-500 font-semibold mb-4 hover:rotate-3 transition-transform">
                How It Works
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform is designed to be intuitive and easy to use, even for non-technical users.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200 rounded-full hidden md:block"></div>

              {/* Step 1 */}
              <div className="relative flex items-center mb-12 md:mb-16">
                <div className="flex-1 md:pr-8 md:text-right">
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                    <div className="flex items-center mb-4 md:justify-end">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 md:mr-0 md:ml-4 md:order-2 animate-pulse">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 md:order-1">Sign Up & Connect</h4>
                    </div>
                    <p className="text-gray-600">
                      Create your account and connect your restaurant's data sources (POS, reservation system, etc.) in minutes.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg hidden md:block animate-pulse"></div>
                <div className="flex-1 md:pl-8 hidden md:block"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center mb-12 md:mb-16">
                <div className="flex-1 md:pr-8 hidden md:block"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg hidden md:block animate-pulse"></div>
                <div className="flex-1 md:pl-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 animate-pulse">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Set Your Goals</h4>
                    </div>
                    <p className="text-gray-600">
                      Define your business objectives and let our AI create a customized roadmap for your restaurant's success.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center">
                <div className="flex-1 md:pr-8 md:text-right">
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                    <div className="flex items-center mb-4 md:justify-end">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 md:mr-0 md:ml-4 md:order-2 animate-pulse">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 md:order-1">Get Insights & Grow</h4>
                    </div>
                    <p className="text-gray-600">
                      Receive actionable insights and recommendations to optimize every aspect of your restaurant operations.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg hidden md:block animate-pulse"></div>
                <div className="flex-1 md:pl-8 hidden md:block"></div>
              </div>
            </div>
          </div>

          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
        </section>

        {/* Demo Video Section */}
        <section id="demo" className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">Demo</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">See BiteBase in Action</h3>
            <p className="text-xl text-gray-600 mb-12">
              Watch our 2-minute demo to see how BiteBase can transform your restaurant business
            </p>

            <div className="relative rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 bg-gray-800">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-white text-lg font-medium">Click to watch demo</p>
                  <p className="text-gray-300 text-sm mt-2">2 minutes • HD Quality</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white font-medium transition-all duration-300 flex items-center mx-auto hover:scale-105">
                <Download className="w-4 h-4 mr-2" /> Download product brochure (PDF)
              </button>
            </div>
          </div>

          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-500 font-semibold mb-4 hover:rotate-3 transition-transform">
                Testimonials
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what restaurant owners have to say about BiteBase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="flex items-center mb-6">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah Johnson" className="w-12 h-12 rounded-full mr-4 hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                    <p className="text-gray-500 text-sm">Owner, The Green Fork</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "BiteBase helped us identify the perfect location for our second restaurant. Their demographic analysis was spot on, and we've seen a 30% increase in foot traffic compared to our original location."
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="flex items-center mb-6">
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Michael Chen" className="w-12 h-12 rounded-full mr-4 hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold text-gray-900">Michael Chen</h4>
                    <p className="text-gray-500 text-sm">CEO, Noodle House Chain</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "The competitor tracking feature alone is worth the price. We've been able to adjust our menu and pricing strategy in real-time based on what's working for others in our market."
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="flex items-center mb-6">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Elena Rodriguez" className="w-12 h-12 rounded-full mr-4 hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-bold text-gray-900">Elena Rodriguez</h4>
                    <p className="text-gray-500 text-sm">Founder, Tapas Revolution</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "As a small business owner, I don't have time to analyze data. BiteBase's automated reports give me exactly what I need to know each week, with clear recommendations on what to do next."
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-500 font-semibold mb-4 hover:rotate-3 transition-transform">
                Pricing Plans
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Select a plan that fits your needs and start building with BiteBase today!</p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  className={`px-8 py-3 font-semibold transition-all duration-300 rounded-l-lg border ${
                    billingPeriod === 'monthly'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setBillingPeriod('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-8 py-3 font-semibold transition-all duration-300 rounded-r-lg border-l-0 border relative ${
                    billingPeriod === 'yearly'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setBillingPeriod('yearly')}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Free Plan */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="text-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" alt="Free plan icon" className="w-24 h-24 mb-6 mx-auto hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
                  <p className="text-gray-600 mb-6">Basic analytics and insights for small businesses just getting started</p>
                </div>

                <p className="text-center text-2xl font-bold mb-4">US$0 <span className="text-base font-normal text-gray-600">per month</span></p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Sales overview, peak hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Limited trade area view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Monitor & receive alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mt-1 flex-shrink-0"></div>
                    <span className="text-sm text-gray-400">Advanced analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mt-1 flex-shrink-0"></div>
                    <span className="text-sm text-gray-400">Competitor tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mt-1 flex-shrink-0"></div>
                    <span className="text-sm text-gray-400">AI insights & recommendations</span>
                  </li>
                </ul>

                <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
              </div>

              {/* Growth Plan */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="text-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/3132/3132739.png" alt="Growth plan icon" className="w-24 h-24 mb-6 mx-auto hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Growth</h2>
                  <p className="text-gray-600 mb-6">For independent restaurants looking to optimize operations</p>
                </div>

                <p className="text-center text-2xl font-bold mb-4">
                  US${billingPeriod === 'monthly' ? '14.99' : '11.99'}
                  <span className="text-base font-normal text-gray-600">per month</span>
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Analytics Overview Dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Local Market Snapshot (Limited)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Review Monitoring (Google & Yelp)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Track up to 5 competitors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Monthly AI business reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">3-month data history</span>
                  </li>
                </ul>

                <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105">
                  Subscribe Now
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-green-500 relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                  Most Popular
                </div>
                <div className="text-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/3132/3132739.png" alt="Pro plan icon" className="w-24 h-24 mb-6 mx-auto hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
                  <p className="text-gray-600 mb-6">Ideal for restaurants expanding to multiple locations</p>
                </div>

                <p className="text-center text-3xl font-extrabold mb-4">
                  US${billingPeriod === 'monthly' ? '109' : '87'}
                  <span className="text-base font-normal text-gray-600">per month</span>
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Advanced Analytics Dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Extended Market Analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Full Review Suite Integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Track up to 15 competitors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Weekly AI strategy recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">1-year data history retention</span>
                  </li>
                </ul>

                <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all duration-300 hover:scale-105">
                  Choose Pro
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="text-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/3132/3132739.png" alt="Enterprise plan icon" className="w-24 h-24 mb-6 mx-auto hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h2>
                  <p className="text-gray-600 mb-6">For large restaurant chains and franchises</p>
                </div>

                <p className="text-center text-2xl font-bold mb-4">Custom <span className="text-base font-normal text-gray-600">pricing</span></p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Unlimited competitor tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Custom integrations & API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Priority phone & email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Custom training & onboarding</span>
                  </li>
                </ul>

                <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-xl text-green-100 mb-8">Join thousands of restaurants already using BiteBase to grow their business.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth" className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/restaurant-setup" className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 font-semibold text-lg transition-all duration-300 hover:scale-105">
                Try Market Research
              </Link>
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 20s linear infinite' }}></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-100 rounded-full opacity-10 animate-spin" style={{ animation: 'spin 25s linear infinite reverse' }}></div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-6">
                  <BiteBaseLogo size="sm" />
                  <span className="text-xl font-bold ml-2">BiteBase</span>
                </div>
                <p className="text-gray-400 mb-6">
                  AI-powered restaurant intelligence platform helping businesses make data-driven decisions.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6">Product</h3>
                <ul className="space-y-4">
                  <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                  <li><Link href="/restaurant-setup" className="text-gray-400 hover:text-white transition-colors">Market Research</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6">Company</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-6">Support</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-gray-400">© 2024 BiteBase Intelligence. All rights reserved.</p>
            </div>
          </div>

          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-100 rounded-full opacity-5 animate-spin" style={{ animation: 'spin 30s linear infinite' }}></div>
        </footer>
      </div>
    </Providers>
  )
}