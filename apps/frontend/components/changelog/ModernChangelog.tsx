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
    date: "Jun 12, 2024",
    title: "Enhanced AI Analytics Dashboard",
    description: "We've completely redesigned our analytics dashboard with new AI-powered insights, real-time data visualization, and customizable widgets. The new dashboard provides deeper insights into customer behavior, sales patterns, and operational efficiency.",
    type: "feature",
    image: "/images/changelog/dashboard-update.png"
  },
  {
    id: "2", 
    date: "Jun 10, 2024",
    title: "Improved POS Integration Performance",
    description: "Significantly improved the performance and reliability of our POS integrations. Data synchronization is now 3x faster with better error handling and automatic retry mechanisms.",
    type: "improvement"
  },
  {
    id: "3",
    date: "Jun 8, 2024", 
    title: "New Market Analysis Features",
    description: "Added comprehensive market analysis tools including competitor tracking, local market trends, and demographic insights. These features help restaurant owners make data-driven decisions about menu pricing, marketing strategies, and expansion opportunities.",
    type: "feature"
  },
  {
    id: "4",
    date: "Jun 5, 2024",
    title: "Fixed Menu Optimization Algorithm",
    description: "Resolved an issue where the menu optimization algorithm wasn't properly accounting for seasonal variations in ingredient costs. The algorithm now provides more accurate pricing recommendations.",
    type: "fix"
  },
  {
    id: "5",
    date: "Jun 3, 2024",
    title: "Mobile App Performance Improvements",
    description: "Optimized mobile app performance with faster loading times, improved offline capabilities, and better battery efficiency. The app now loads 40% faster on average.",
    type: "improvement"
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
      <nav className="modern-nav shadow-sm">
        <div className="modern-nav-container">
          <Link href="/" className="flex items-center gap-3">
            <BiteBaseLogo size="lg" showText={true} variant="default" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="modern-nav-links">
              <Link href="/" className="modern-nav-link">Home</Link>
              <Link href="/blog" className="modern-nav-link">Blog</Link>
              <Link href="/changelog" className="modern-nav-link active">Changelog</Link>
              <Link href="/docs" className="modern-nav-link">Docs</Link>
            </div>

            <Link href="/dashboard">
              <button className="btn-primary">Dashboard</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="changelog-container">
        <div className="changelog-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="changelog-title">Changelog</h1>
            <p className="changelog-subtitle">
              Stay up to date with the latest features, improvements, and fixes.
            </p>
            
            {/* Follow CTA */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 inline-block">
              <p className="text-sm text-gray-600 mb-2">
                Follow us on{" "}
                <a 
                  href="https://twitter.com/bitebase" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
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
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="changelog-entry"
            >
              <div className="flex items-center gap-3 mb-4">
                <time className="changelog-date">{entry.date}</time>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[entry.type]}`}>
                  {typeIcons[entry.type]} {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </span>
              </div>
              
              <h2 className="changelog-entry-title">
                <Link href={`/changelog/${entry.id}`} className="hover:text-primary-600 transition-colors">
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
              
              <div className="changelog-entry-content">
                <p>{entry.description}</p>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries found</h3>
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
            <button className="btn-secondary">
              Load More Entries
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="modern-container py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BiteBaseLogo size="md" showText={false} variant="default" />
              <span className="text-lg font-bold text-gray-900">BiteBase</span>
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