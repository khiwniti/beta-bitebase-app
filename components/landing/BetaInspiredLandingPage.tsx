"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import BiteBaseLogo from "../BiteBaseLogo";

// Animated particles component
const AnimatedParticles = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        const newY = particle.y - particle.speed;
        return {
          ...particle,
          x: particle.x + Math.sin(particle.y * 0.01) * 0.5,
          y: newY < -10 ? window.innerHeight + 10 : newY,
        };
      }));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-green-400 rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default function BetaInspiredLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Particles */}
      <AnimatedParticles />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <BiteBaseLogo size="md" showText={false} variant="white" clickable={false} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <Link href="#features" className="text-slate-300 hover:text-green-400 transition-colors">
                  Features
                </Link>
                <Link href="/blog" className="text-slate-300 hover:text-green-400 transition-colors">
                  Blog
                </Link>
                <Link href="/changelog" className="text-slate-300 hover:text-green-400 transition-colors">
                  Changelog
                </Link>
                <Link href="#pricing" className="text-slate-300 hover:text-green-400 transition-colors">
                  Pricing
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-300">
                  EN
                </div>
                <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Beta Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-8"
          >
            <span className="text-green-400">🚀</span>
            <span className="text-green-400 font-medium">Now in Beta</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Restaurant Intelligence
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Platform
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover profitable locations, track competitors, and optimize operations with 
            geospatial analytics and AI-driven insights that boost your bottom line.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/25">
              Get Started
            </Link>
            <button className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105">
              Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-slate-400">Restaurants Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">25%</div>
              <div className="text-slate-400">Average Revenue Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-slate-400">Platform Uptime</div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col items-center gap-2 text-slate-400"
          >
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-green-400 rounded-full mt-2"
              />
            </div>
            <span className="text-sm">Scroll to explore</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-green-400">✨</span>
              <span className="text-green-400 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Comprehensive tools and insights to help your restaurant thrive in a competitive market.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold mb-4">Geospatial Analytics</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Location intelligence mapping</li>
                <li>• Trade area analysis</li>
                <li>• Demographic insights</li>
                <li>• Foot traffic patterns</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Insights</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Predictive analytics</li>
                <li>• Market trend analysis</li>
                <li>• Revenue optimization</li>
                <li>• Smart recommendations</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-4">Business Intelligence</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Real-time dashboards</li>
                <li>• Performance metrics</li>
                <li>• Competitor tracking</li>
                <li>• Custom reports</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <span className="text-green-400">💬</span>
            <span className="text-green-400 font-medium">Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by Restaurant Owners
          </h2>
          <p className="text-xl text-slate-300 mb-16">
            See how BiteBase is helping restaurants grow and succeed.
          </p>
          
          {/* Testimonial placeholder */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-lg text-slate-300 mb-6 italic">
              "BiteBase helped us identify the perfect location for our second restaurant. 
              The AI insights were spot-on and we've seen a 30% increase in revenue since opening."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-slate-400">Owner, Bistro Central</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
              <span className="text-green-400">💰</span>
              <span className="text-green-400 font-medium">Simple Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-300">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Free Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-slate-400 mb-6">Basic analytics and insights for small businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Sales overview, peak hours
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Limited trade area view
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Monitor & receive alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-slate-500">✗</span>
                  Advanced analytics
                </li>
              </ul>
              <Link href="/auth" className="block w-full bg-slate-700 hover:bg-slate-600 text-center py-3 rounded-full font-medium transition-colors">
                Get Started
              </Link>
            </div>

            {/* Growth Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Growth</h3>
              <p className="text-slate-400 mb-6">For independent restaurants looking to optimize</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Analytics Overview Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Local Market Snapshot
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Track up to 5 competitors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Monthly AI business reports
                </li>
              </ul>
              <Link href="/auth" className="block w-full bg-green-500 hover:bg-green-600 text-center py-3 rounded-full font-medium transition-colors">
                Subscribe Now
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-slate-400 mb-6">Ideal for restaurants expanding to multiple locations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$109</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Advanced Analytics Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Extended Market Analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Track up to 15 competitors
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Weekly AI strategy recommendations
                </li>
              </ul>
              <Link href="/auth" className="block w-full bg-slate-700 hover:bg-slate-600 text-center py-3 rounded-full font-medium transition-colors">
                Choose Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-400 mb-6">Custom solutions for restaurant chains and franchises</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$599</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Enterprise Analytics Suite
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Multi-location Management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Unlimited competitor tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Daily AI strategic insights
                </li>
              </ul>
              <Link href="/auth" className="block w-full bg-slate-700 hover:bg-slate-600 text-center py-3 rounded-full font-medium transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of restaurants using BiteBase to optimize operations and increase profitability.
          </p>
          <Link href="/auth" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/25">
            <span>🚀</span>
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-2xl">🍽️</div>
            <div>
              <div className="font-bold text-xl">BiteBase</div>
              <div className="text-slate-400">Intelligence</div>
            </div>
          </div>
          <p className="text-slate-400">
            © 2024 BiteBase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}