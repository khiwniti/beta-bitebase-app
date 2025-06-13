"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BiteBaseLogo from "../BiteBaseLogo";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ModernLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "Smart Analytics",
      description: "AI-powered insights to optimize your restaurant operations and increase profitability."
    },
    {
      icon: "📍",
      title: "Location Intelligence",
      description: "Analyze foot traffic, competition, and market opportunities in your area."
    },
    {
      icon: "💰",
      title: "Dynamic Pricing",
      description: "Optimize your menu pricing based on real-time market data and demand patterns."
    },
    {
      icon: "📊",
      title: "Performance Tracking",
      description: "Monitor key metrics and get actionable recommendations for growth."
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Get instant answers and recommendations from our intelligent assistant."
    },
    {
      icon: "🔗",
      title: "POS Integration",
      description: "Seamlessly connect with your existing point-of-sale systems."
    }
  ];

  const stats = [
    { value: "10K+", label: "Restaurants" },
    { value: "50M+", label: "Data Points" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <nav className={`modern-nav ${scrollY > 50 ? 'shadow-md' : ''}`}>
        <div className="modern-nav-container">
          <Link href="/" className="flex items-center gap-3">
            <BiteBaseLogo size="lg" showText={true} variant="default" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="modern-nav-links">
              <a href="#features" className="modern-nav-link">
                {t('navigation.features') || 'Features'}
              </a>
              <Link href="/blog" className="modern-nav-link">
                {t('navigation.blog') || 'Blog'}
              </Link>
              <Link href="/changelog" className="modern-nav-link">
                {t('navigation.changelog') || 'Changelog'}
              </Link>
              <a href="#pricing" className="modern-nav-link">
                {t('navigation.pricing') || 'Pricing'}
              </a>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                {language.toUpperCase()}
              </span>
              <Link href="/dashboard">
                <button className="btn-primary">
                  {t('landing.hero.cta') || 'Get Started'}
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-6 py-4 space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
                <Link href="/blog" className="block text-gray-600 hover:text-gray-900">Blog</Link>
                <Link href="/changelog" className="block text-gray-600 hover:text-gray-900">Changelog</Link>
                <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
                <Link href="/dashboard" className="block">
                  <button className="btn-primary w-full">Get Started</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="modern-hero">
        <div className="modern-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="modern-hero-title">
              Restaurant Intelligence
              <br />
              <span className="text-primary-500">Powered by AI</span>
            </h1>
            <p className="modern-hero-subtitle">
              Transform your restaurant with data-driven insights, smart analytics, 
              and AI-powered recommendations that drive growth and profitability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <button className="btn-primary text-lg px-8 py-4">
                  Start Free Trial
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="modern-section bg-gray-50">
        <div className="modern-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights to optimize every aspect of your restaurant business.
            </p>
          </div>

          <div className="modern-grid modern-grid-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="modern-section">
        <div className="modern-container">
          <div className="text-center bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your restaurant?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants already using BiteBase to optimize their operations and increase profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="btn-primary text-lg px-8 py-4">
                  Start Free Trial
                </button>
              </Link>
              <Link href="/contact">
                <button className="btn-secondary text-lg px-8 py-4">
                  Contact Sales
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="modern-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BiteBaseLogo size="lg" showText={false} variant="white" />
                <span className="text-xl font-bold">BiteBase</span>
              </div>
              <p className="text-gray-400">
                AI-powered restaurant intelligence platform helping businesses grow and succeed.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BiteBase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}