"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Star, Zap, Bug, Plus, ArrowRight, Github, Heart } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";
import Link from "next/link";

// Standalone layout for changelog page
function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <BiteBaseLogo size="lg" showText={false} />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-green-400 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-white hover:text-green-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/about" className="text-white hover:text-green-400 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {children}
    </div>
  );
}

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  title: string;
  description: string;
  changes: {
    type: "feature" | "improvement" | "bugfix" | "breaking";
    title: string;
    description: string;
  }[];
  highlights?: string[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "0.0.1",
    date: "2024-12-12",
    type: "major",
    title: "Beta Launch - The Beginning of Something Amazing",
    description: "Welcome to BiteBase! Our first beta release brings you a powerful restaurant intelligence platform with cutting-edge features.",
    highlights: [
      "🎉 First public beta release",
      "🚀 Complete restaurant discovery platform",
      "🌍 Multi-language support (English & Thai)",
      "📊 Advanced analytics dashboard",
      "🗺️ Interactive geospatial mapping"
    ],
    changes: [
      {
        type: "feature",
        title: "Restaurant Discovery Engine",
        description: "Comprehensive restaurant search and discovery with real-time data integration from multiple sources."
      },
      {
        type: "feature",
        title: "Interactive Map Interface",
        description: "Beautiful, responsive map interface powered by Leaflet with custom markers and clustering."
      },
      {
        type: "feature",
        title: "Multi-language Support",
        description: "Full internationalization support with English and Thai languages, seamless switching."
      },
      {
        type: "feature",
        title: "Analytics Dashboard",
        description: "Comprehensive dashboard with charts, metrics, and insights for restaurant performance."
      },
      {
        type: "feature",
        title: "User Authentication",
        description: "Secure authentication system with Firebase integration and user management."
      },
      {
        type: "feature",
        title: "Responsive Design",
        description: "Mobile-first responsive design that works beautifully on all devices."
      },
      {
        type: "feature",
        title: "Dark Mode Support",
        description: "Beautiful dark mode theme with smooth transitions and consistent styling."
      },
      {
        type: "improvement",
        title: "Performance Optimization",
        description: "Optimized loading times, lazy loading, and efficient data fetching strategies."
      },
      {
        type: "improvement",
        title: "Enhanced Logo Design",
        description: "Larger, more prominent logo with improved visibility and brand recognition."
      },
      {
        type: "improvement",
        title: "Smooth Animations",
        description: "Added beautiful motion effects and transitions throughout the application."
      }
    ]
  }
];

const typeColors = {
  feature: "bg-green-500",
  improvement: "bg-blue-500",
  bugfix: "bg-yellow-500",
  breaking: "bg-red-500"
};

const typeIcons = {
  feature: Plus,
  improvement: Zap,
  bugfix: Bug,
  breaking: Star
};

export default function ChangelogPage() {
  return (
    <ChangelogLayout>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-red-500/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-red-600 bg-clip-text text-transparent mb-6">
              Changelog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Track our journey as we build the future of restaurant intelligence. 
              Every update brings us closer to revolutionizing the food industry.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Last updated: December 12, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>Version 0.0.1 Beta</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-red-500"></div>

            {changelogData.map((entry, index) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-16 last:mb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-red-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"></div>

                {/* Content card */}
                <div className="ml-20">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-accent-red-500 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold">v{entry.version}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            entry.type === 'major' ? 'bg-white/20' : 
                            entry.type === 'minor' ? 'bg-white/15' : 'bg-white/10'
                          }`}>
                            {entry.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/80">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(entry.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                      <p className="text-white/90">{entry.description}</p>
                    </div>

                    {/* Highlights */}
                    {entry.highlights && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          Highlights
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {entry.highlights.map((highlight, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * idx }}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                            >
                              <ArrowRight className="w-3 h-3 mr-2 text-primary-500" />
                              {highlight}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Changes */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Changes</h4>
                      <div className="space-y-4">
                        {entry.changes.map((change, idx) => {
                          const Icon = typeIcons[change.type];
                          return (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * idx }}
                              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className={`p-1.5 rounded-full ${typeColors[change.type]} text-white flex-shrink-0`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                  {change.title}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {change.description}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <Heart className="w-12 h-12 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl font-bold mb-4">Thank You for Being Part of Our Journey</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              This is just the beginning. We're excited to continue building amazing features 
              and improving your restaurant intelligence experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </ChangelogLayout>
  );
}