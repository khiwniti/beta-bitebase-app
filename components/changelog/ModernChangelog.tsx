"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BiteBaseLogo from "../BiteBaseLogo";

interface ChangelogEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'fix' | 'breaking';
  image?: string;
}

const changelogEntries: ChangelogEntry[] = [
  {
    id: "1",
    date: "Dec 13, 2024",
    title: "🎨 Modern Auth Page Redesign",
    description: "Complete redesign of the authentication page with a centered layout, modern blue color scheme, and improved user experience. Removed the left sidebar for a cleaner, more focused design that works beautifully on all devices.",
    type: "feature",
    image: "/images/changelog/auth-redesign.png"
  },
  {
    id: "2", 
    date: "Dec 12, 2024",
    title: "Enhanced AI Analytics Dashboard",
    description: "We've completely redesigned our analytics dashboard with new AI-powered insights, real-time data visualization, and customizable widgets. The new dashboard provides deeper insights into customer behavior, sales patterns, and operational efficiency.",
    type: "feature",
    image: "/images/changelog/dashboard-update.png"
  },
  {
    id: "3",
    date: "Jun 10, 2024",
    title: "Improved POS Integration Performance",
    description: "Significantly improved the performance and reliability of our POS integrations. Data synchronization is now 3x faster with better error handling and automatic retry mechanisms.",
    type: "improvement"
  },
  {
    id: "4",
    date: "Jun 8, 2024", 
    title: "New Market Analysis Features",
    description: "Added comprehensive market analysis tools including competitor tracking, local market trends, and demographic insights. These features help restaurant owners make data-driven decisions about menu pricing, marketing strategies, and expansion opportunities.",
    type: "feature"
  },
  {
    id: "5",
    date: "Jun 5, 2024",
    title: "Fixed Menu Optimization Algorithm",
    description: "Resolved an issue where the menu optimization algorithm wasn't properly accounting for seasonal variations in ingredient costs. The algorithm now provides more accurate pricing recommendations.",
    type: "fix"
  },
  {
    id: "6",
    date: "May 1, 2024",
    title: "🚀 BiteBase Platform Launch",
    description: "Official launch of the BiteBase Restaurant Intelligence Platform! Starting our journey to help restaurants make data-driven decisions with geospatial analytics, AI-powered insights, and comprehensive market analysis tools.",
    type: "feature"
  }
];

const typeColors = {
  feature: "bg-blue-100 text-blue-800",
  improvement: "bg-green-100 text-green-800", 
  fix: "bg-red-100 text-red-800",
  breaking: "bg-orange-100 text-orange-800"
};

const typeIcons = {
  feature: "✨",
  improvement: "🚀",
  fix: "🐛", 
  breaking: "⚠️"
};

export default function ModernChangelog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredEntries = changelogEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || entry.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <BiteBaseLogo size="md" showText={false} variant="default" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
                <Link href="/changelog" className="text-gray-900 font-medium">Changelog</Link>
                <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</Link>
              </div>

              <Link href="/dashboard">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Latest updates
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
              Changelog
            </h1>
            <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Stay up to date with the latest features, improvements, and fixes.
            </p>
            
            {/* Follow CTA */}
            <div className="inline-flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Follow us on{" "}
                <a 
                  href="https://twitter.com/bitebase" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                {" "}to hear about changes first.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="feature">Features</option>
              <option value="improvement">Improvements</option>
              <option value="fix">Bug Fixes</option>
              <option value="breaking">Breaking Changes</option>
            </select>
          </div>
        </motion.div>

        {/* Changelog Entries */}
        <div className="space-y-12">
          {filteredEntries.map((entry, index) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <time className="text-sm text-gray-500 font-medium">{entry.date}</time>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[entry.type]}`}>
                  {typeIcons[entry.type]} {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Link href={`/changelog/${entry.id}`} className="hover:text-emerald-600 transition-colors">
                  {entry.title}
                </Link>
              </h2>
              
              {entry.image && (
                <div className="mb-6">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="w-full rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
              
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">{entry.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {filteredEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </motion.div>
        )}

        {/* Load More */}
        {filteredEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              Load More Entries
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BiteBaseLogo size="md" showText={false} variant="default" />
              <span className="text-base font-bold text-gray-900">BiteBase</span>
            </div>
            <p className="text-gray-600 mb-6">
              AI-powered restaurant intelligence platform
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}