"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Search, Clock, ChevronRight, Tag, Calendar } from "lucide-react";
import BiteBaseLogo from "../../components/BiteBaseLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "../../contexts/LanguageContext";

// Force dynamic rendering to avoid SSG issues with context
export const dynamic = 'force-dynamic';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  category: string;
}

// Simple translation system
const translations = {
  en: {
    blogTitle: "BiteBase Explorer Blog",
    blogSubtitle: "Discover insights, trends, and expert advice for restaurant discovery and dining experiences",
    searchPlaceholder: "Search articles...",
    readMore: "Read More",
    categories: {
      all: "All",
      restaurantDiscovery: "Restaurant Discovery",
      diningGuide: "Dining Guide", 
      foodCulture: "Food Culture",
      sustainability: "Sustainability"
    },
    newsletter: {
      title: "Stay Updated with BiteBase Explorer",
      subtitle: "Subscribe to our newsletter for the latest restaurant discoveries, dining trends, and food insights.",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      disclaimer: "We'll never share your email. You can unsubscribe at any time."
    },
    navigation: {
      home: "Home",
      explore: "Explore", 
      blog: "Blog",
      dashboard: "Dashboard",
      signIn: "Sign In",
      exploreNow: "Explore Now"
    }
  },
  th: {
    blogTitle: "บล็อก BiteBase Explorer",
    blogSubtitle: "ค้นพบข้อมูลเชิงลึก เทรนด์ และคำแนะนำจากผู้เชี่ยวชาญสำหรับการค้นหาร้านอาหารและประสบการณ์การรับประทานอาหาร",
    searchPlaceholder: "ค้นหาบทความ...",
    readMore: "อ่านเพิ่มเติม",
    categories: {
      all: "ทั้งหมด",
      restaurantDiscovery: "การค้นหาร้านอาหาร",
      diningGuide: "คู่มือการรับประทานอาหาร",
      foodCulture: "วัฒนธรรมอาหาร", 
      sustainability: "ความยั่งยืน"
    },
    newsletter: {
      title: "รับข้อมูลล่าสุดจาก BiteBase Explorer",
      subtitle: "สมัครรับจดหมายข่าวของเราเพื่อรับข้อมูลการค้นหาร้านอาหาร เทรนด์การรับประทานอาหาร และข้อมูลเชิงลึกเกี่ยวกับอาหารล่าสุด",
      emailPlaceholder: "กรอกอีเมลของคุณ",
      subscribe: "สมัครรับข้อมูล",
      disclaimer: "เราจะไม่แชร์อีเมลของคุณ คุณสามารถยกเลิกการสมัครได้ตลอดเวลา"
    },
    navigation: {
      home: "หน้าแรก",
      explore: "สำรวจ",
      blog: "บล็อก", 
      dashboard: "แดชบอร์ด",
      signIn: "เข้าสู่ระบบ",
      exploreNow: "เริ่มสำรวจ"
    }
  }
};

function BlogPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { language } = useLanguage();

  const t = translations[language];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Ultimate Guide to Finding Hidden Gem Restaurants",
      slug: "finding-hidden-gem-restaurants",
      excerpt: "Discover how to uncover amazing local restaurants that most people don't know about using data-driven exploration techniques.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1572715376701-98568319fd0b?q=80&w=2574&auto=format&fit=crop",
      author: {
        name: "Alex Chen",
        avatar: "/team/alex-chen.jpg"
      },
      publishedAt: "2024-09-15",
      readingTime: "8 min",
      tags: ["restaurant discovery", "hidden gems", "local dining"],
      category: "Restaurant Discovery"
    },
    {
      id: 2,
      title: "How to Read Restaurant Reviews Like a Pro",
      slug: "reading-restaurant-reviews-guide",
      excerpt: "Learn to decode restaurant reviews and ratings to make better dining decisions and discover your next favorite spot.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574&auto=format&fit=crop",
      author: {
        name: "Maria Rodriguez",
        avatar: "/team/maria-rodriguez.jpg"
      },
      publishedAt: "2024-09-10",
      readingTime: "10 min",
      tags: ["reviews", "ratings", "dining tips"],
      category: "Dining Guide"
    },
    {
      id: 3,
      title: "The Art of Food Photography: Capturing the Perfect Dish",
      slug: "food-photography-perfect-dish",
      excerpt: "Learn professional techniques for photographing food that will make your dining experiences more memorable and shareable.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1579165466814-3e9553f2beec?q=80&w=2680&auto=format&fit=crop",
      author: {
        name: "David Kim",
        avatar: "/team/david-kim.jpg"
      },
      publishedAt: "2024-09-05",
      readingTime: "12 min",
      tags: ["food photography", "social media", "dining", "tips"],
      category: "Food Culture"
    },
    {
      id: 4,
      title: "Exploring Global Cuisines: A Foodie's Guide to Authentic Flavors",
      slug: "exploring-global-cuisines-guide",
      excerpt: "Discover authentic dishes from around the world and learn how to identify genuine ethnic restaurants in your area.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1507527825661-f86bc6fa42a8?q=80&w=2574&auto=format&fit=crop",
      author: {
        name: "Sarah Johnson",
        avatar: "/team/sarah-johnson.jpg"
      },
      publishedAt: "2024-08-28",
      readingTime: "9 min",
      tags: ["global cuisine", "authentic food", "cultural dining", "foodie guide"],
      category: "Food Culture"
    },
    {
      id: 5,
      title: "The Ultimate Guide to Wine Pairing for Food Lovers",
      slug: "wine-pairing-guide-food-lovers",
      excerpt: "Master the art of wine pairing to enhance your dining experiences and discover perfect flavor combinations.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop",
      author: {
        name: "Michael Wong",
        avatar: "/team/michael-wong.jpg"
      },
      publishedAt: "2024-08-22",
      readingTime: "7 min",
      tags: ["wine pairing", "dining experience", "beverages", "food matching"],
      category: "Dining Guide"
    },
    {
      id: 6,
      title: "Sustainable Dining: How to Choose Eco-Friendly Restaurants",
      slug: "sustainable-dining-eco-friendly-restaurants",
      excerpt: "Learn how to identify and support restaurants that prioritize sustainability and environmental responsibility.",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2510&auto=format&fit=crop",
      author: {
        name: "Emma Rodriguez",
        avatar: "/team/emma-rodriguez.jpg"
      },
      publishedAt: "2024-08-15",
      readingTime: "6 min",
      tags: ["sustainable dining", "eco-friendly", "responsible eating", "green restaurants"],
      category: "Sustainability"
    }
  ];

  // Extract all unique categories
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  
  // Create a mapping for category translations
  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: keyof typeof t.categories } = {
      'Restaurant Discovery': 'restaurantDiscovery',
      'Dining Guide': 'diningGuide',
      'Food Culture': 'foodCulture',
      'Sustainability': 'sustainability'
    };
    return t.categories[categoryMap[category]] || category;
  };
  
  // Extract all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags))).sort();
  
  // Filter posts based on search, category, and tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || post.category === selectedCategory;
    
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

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
              <Link href="/" className="text-gray-500 hover:text-gray-900">{t.navigation.home}</Link>
              <Link href="/restaurant-explorer" className="text-gray-500 hover:text-gray-900">{t.navigation.explore}</Link>
              <Link href="/blog" className="text-primary-600 font-medium">{t.navigation.blog}</Link>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">{t.navigation.dashboard}</Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/dashboard">{t.navigation.signIn}</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary-600 hover:bg-primary-700 text-white"
                asChild
              >
                <Link href="/restaurant-explorer">{t.navigation.exploreNow}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.blogTitle}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.blogSubtitle}
            </p>
          </div>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="py-8 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === null
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {t.categories.all}
              </button>
              
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    category === selectedCategory
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryTranslation(category)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.slice(0, 12).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  tag === selectedTag
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No articles found matching your criteria.</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                  setSelectedTag(null);
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id}>
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{post.publishedAt}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden relative mr-3">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {post.author.name}
                          </span>
                        </div>
                        
                        <span className="text-primary-600 inline-flex items-center text-sm font-medium">
                          {t.readMore}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t.newsletter.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t.newsletter.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t.newsletter.emailPlaceholder}
              className="px-4 py-3 flex-grow border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6">
              {t.newsletter.subscribe}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            {t.newsletter.disclaimer}
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <BiteBaseLogo size="sm" showText={false} />
              <p className="text-gray-600 mt-4">
                Discover amazing restaurants and enhance your dining experiences with comprehensive restaurant data.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-primary-600">Home</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-primary-600">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-primary-600">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/resources" className="text-gray-600 hover:text-primary-600">Resource Center</Link></li>
                <li><Link href="/case-studies" className="text-gray-600 hover:text-primary-600">Case Studies</Link></li>
                <li><Link href="/webinars" className="text-gray-600 hover:text-primary-600">Webinars</Link></li>
                <li><Link href="/documentation" className="text-gray-600 hover:text-primary-600">API Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-gray-600 hover:text-primary-600">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="text-gray-600 hover:text-primary-600">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} BiteBase Explorer. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid SSR issues
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <BlogPageContent />;
} 