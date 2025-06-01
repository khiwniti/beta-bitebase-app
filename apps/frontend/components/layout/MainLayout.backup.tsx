"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@bitebase/ui"
import {
  BarChart2,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  Search,
  Bell,
  User,
  Download,
  Plus,
  Menu,
  X,
  FileText,
  Home,
  Utensils,
  GripVertical,
  Package,
  Tag,
  Megaphone,
  ChevronDown,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  HelpCircle,
  Star,
  Eye,
  Target,
  Activity,
  PieChart,
  Map,
  Calendar,
  MessageSquare,
  Sun,
  Moon,
  Zap
} from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useAuth } from '../../contexts/AuthContext'
import BiteBaseLogo from '../BiteBaseLogo'
import { WebTour, useTour } from '../tour/WebTour'
import { TourTrigger, WelcomeBanner } from '../tour/TourTrigger'

// Navigation structure with nested sections for better organization
const navigation = [
  {
    name: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        tourId: "dashboard",
        description: "Market intelligence overview",
        badge: "New"
      },
    ]
  },
  {
    name: "Analytics",
    items: [
      {
        name: "Place",
        href: "/place",
        icon: MapPin,
        tourId: "place-analysis",
        description: "Location intelligence",
        subitems: [
          { name: "Area Analysis", href: "/place/area-analysis" },
          { name: "Foot Traffic", href: "/place/foot-traffic" },
          { name: "Competition", href: "/place/competition" },
        ]
      },
      {
        name: "Price",
        href: "/price",
        icon: DollarSign,
        tourId: "price-strategy",
        description: "Pricing optimization"
      },
      {
        name: "Product",
        href: "/product",
        icon: Package,
        tourId: "product-management",
        description: "Menu management"
      },
      {
        name: "Promotion",
        href: "/promotion",
        icon: Megaphone,
        tourId: "promotion-marketing",
        description: "Marketing campaigns"
      },
    ]
  },
  {
    name: "Research",
    items: [
      {
        name: "Market Analysis",
        href: "/market-analysis",
        icon: TrendingUp,
        tourId: "market-analysis",
        description: "Interactive map analysis",
        highlight: true
      },
      {
        name: "Reports",
        href: "/reports",
        icon: FileText,
        tourId: "reports",
        description: "Market analysis reports"
      },
    ]
  },
  {
    name: "Management",
    items: [
      {
        name: "Restaurant Setup",
        href: "/restaurant-setup",
        icon: Utensils,
        tourId: "restaurant-setup",
        description: "Setup wizard"
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        tourId: "settings",
        description: "System configuration"
      },
    ]
  }
]

interface MainLayoutProps {
  children: React.ReactNode
  showWelcomeBanner?: boolean
  pageTitle?: string
  pageDescription?: string
  showSidebar?: boolean
  showNavbar?: boolean
}

export function MainLayout({
  children,
  showWelcomeBanner = false,
  pageTitle,
  pageDescription,
  showSidebar = true,
  showNavbar = true
}: MainLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isTourOpen, startTour, closeTour, completeTour } = useTour()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New market report available", time: "2 min ago", read: false },
    { id: 2, title: "Price trend alert detected", time: "1 hour ago", read: false },
    { id: 3, title: "Competitor opened nearby", time: "3 hours ago", read: true },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [collapsedSidebar, setCollapsedSidebar] = useState(false)

  // Initialize expanded sections on load
  useEffect(() => {
    // Default expand all sections
    const sections: Record<string, boolean> = {};
    navigation.forEach(section => {
      sections[section.name] = true;
    });
    setExpandedSections(sections);
    
    // Auto expand active section
    navigation.forEach(section => {
      section.items.forEach(item => {
        if (isActive(item.href)) {
          setExpandedItems(prev => ({ ...prev, [item.name]: true }));
        }
        
        // If the item has subitems and one is active, expand it
        if (item.subitems) {
          item.subitems.forEach(subitem => {
            if (pathname === subitem.href) {
              setExpandedItems(prev => ({ ...prev, [item.name]: true }));
            }
          });
        }
      });
    });
  }, []);
  
  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  }
  
  const toggleItem = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }
  
  const toggleSidebarCollapse = () => {
    setCollapsedSidebar(!collapsedSidebar);
  }
  
  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  }
  
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navbar */}
      {showNavbar && (
        <header className={`sticky top-0 z-30 backdrop-blur-sm border-b ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} shadow-lg`}>
          <div className="max-w-full px-4 mx-auto">
            <div className="flex justify-between h-16 items-center">
              {/* Left side - Logo and menu toggle */}
              <div className="flex items-center space-x-4">
                {showSidebar && (
                  <button
                    type="button"
                    className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}

                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="hover:scale-105 transition-transform duration-200">
                    <BiteBaseLogo size="sm" variant={darkMode ? "white" : "default"} />
                  </Link>
                </div>

                {/* Page Title in Header */}
                {pageTitle && (
                  <div className={`hidden md:block border-l pl-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                    {pageDescription && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pageDescription}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right side - Search, Actions, Notifications, User */}
              <div className="flex items-center space-x-3">
                {/* Global Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      className={`focus:ring-2 focus:ring-primary block w-full pl-10 pr-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-600' 
                          : 'bg-gray-50 hover:bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                      }`}
                      placeholder="Search markets, competitors..."
                    />
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Tour Guide */}
                <TourTrigger onStartTour={startTour} />

                {/* Quick Actions */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`transition-all duration-200 ${
                      darkMode 
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Analysis
                  </Button>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-lg relative transition-all duration-200 ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {getUnreadNotificationsCount() > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div 
                      className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl z-50 overflow-hidden ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className={`px-4 py-3 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                        <button 
                          onClick={markAllNotificationsAsRead}
                          className={`text-xs font-medium ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 border-b last:border-b-0 ${
                                darkMode 
                                  ? 'border-gray-700 hover:bg-gray-700' 
                                  : 'border-gray-100 hover:bg-gray-50'
                              } transition-colors duration-200 cursor-pointer ${
                                !notification.read ? (darkMode ? 'bg-gray-700/50' : 'bg-blue-50') : ''
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 mr-3 ${
                                  !notification.read ? 'bg-emerald-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                                }`}></div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </p>
                                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className={`px-4 py-2 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <Link 
                          href="/notifications" 
                          className={`text-sm font-medium ${
                            darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                          }`}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center rounded-lg p-1 transition-all duration-200 ${
                      darkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-md ${
                      darkMode
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden lg:block ml-2 text-left">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                        {user?.displayName || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Premium Plan</p>
                    </div>
                    <ChevronDown className={`ml-1 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>
                  
                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div 
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user?.displayName || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Profile Settings
                        </Link>
                        <Link 
                          href="/billing" 
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Billing
                        </Link>
                        <Link 
                          href="/api-keys" 
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          API Keys
                        </Link>
                      </div>
                      <div className={`py-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            darkMode
                              ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                              : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                          }`}
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar with Resizable Panels */}
            <div className="hidden lg:flex lg:flex-1">
              <PanelGroup direction="horizontal" className="flex-1">
                {/* Sidebar Panel */}
                <Panel 
                  defaultSize={22} 
                  minSize={collapsedSidebar ? 5 : 16} 
                  maxSize={collapsedSidebar ? 5 : 40} 
                  className="flex flex-col"
                >
                  <div className={`flex flex-col h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-sm`}>
                    {/* Sidebar Header */}
                    <div className={`px-4 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                      {!collapsedSidebar && (
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ${
                            darkMode
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          }`}>
                            <span className="text-white font-bold text-sm">B</span>
                          </div>
                          <div>
                            <h2 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>BiteBase</h2>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Intelligence Platform</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Collapse Button */}
                      <button 
                        onClick={toggleSidebarCollapse}
                        className={`p-1 rounded ${
                          darkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        } transition-all duration-200`}
                      >
                        {collapsedSidebar ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Sidebar Content - Navigation */}
                    <div className="h-0 flex-1 flex flex-col pt-2 pb-4 overflow-y-auto">
                      {navigation.map((section) => (
                        <div key={section.name} className="px-3 py-2">
                          {!collapsedSidebar && (
                            <div
                              className={`flex items-center justify-between mb-1 ${
                                expandedSections[section.name] ? 'mb-2' : ''
                              }`}
                            >
                              <h3 
                                className={`text-xs font-semibold uppercase tracking-wider ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                } flex items-center`}
                              >
                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                  darkMode 
                                    ? 'bg-emerald-600' 
                                    : 'bg-emerald-500'
                                }`}></span>
                                {section.name}
                              </h3>
                              <button
                                onClick={() => toggleSection(section.name)}
                                className={`p-1 rounded-md ${
                                  darkMode 
                                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <ChevronDown
                                  className={`h-3 w-3 transform transition-transform ${
                                    expandedSections[section.name] ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            </div>
                          )}
                          
                          {/* Section Items */}
                          {(expandedSections[section.name] || collapsedSidebar) && (
                            <div className="space-y-1">
                              {section.items.map((item) => {
                                const active = isActive(item.href);
                                return (
                                  <div key={item.name}>
                                    <Link
                                      href={item.href}
                                      className={`${
                                        active
                                          ? darkMode 
                                            ? 'bg-gray-700 border-l-4 border-emerald-500 text-white shadow-sm' 
                                            : 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 shadow-sm'
                                          : darkMode 
                                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white border-l-4 border-transparent hover:border-gray-600' 
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent hover:border-gray-300'
                                      } group flex items-center px-2 py-2 text-sm font-medium transition-all duration-200 rounded-r-lg ${
                                        item.highlight 
                                          ? darkMode 
                                            ? 'bg-emerald-900/20 border-emerald-800' 
                                            : 'bg-emerald-50/50 border-emerald-100' 
                                          : ''
                                      }`}
                                      title={collapsedSidebar ? item.name : ''}
                                    >
                                      <item.icon 
                                        className={`${
                                          active 
                                            ? darkMode 
                                              ? 'text-emerald-400' 
                                              : 'text-emerald-600' 
                                            : darkMode 
                                              ? 'text-gray-400 group-hover:text-gray-300' 
                                              : 'text-gray-400 group-hover:text-gray-600'
                                        } mr-3 flex-shrink-0 h-5 w-5`} 
                                      />
                                      
                                      {!collapsedSidebar && (
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium">{item.name}</div>
                                            {item.badge && (
                                              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                                darkMode 
                                                  ? 'bg-emerald-900 text-emerald-300' 
                                                  : 'bg-emerald-100 text-emerald-800'
                                              }`}>
                                                {item.badge}
                                              </span>
                                            )}
                                            {item.subitems && (
                                              <button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  toggleItem(item.name);
                                                }}
                                                className="ml-auto"
                                              >
                                                <ChevronDown
                                                  className={`h-4 w-4 transform transition-transform ${
                                                    expandedItems[item.name] ? 'rotate-180' : ''
                                                  } ${
                                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                                  }`}
                                                />
                                              </button>
                                            )}
                                          </div>
                                          <div className={`text-xs mt-0.5 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-500'
                                          }`}>
                                            {item.description}
                                          </div>
                                        </div>
                                      )}
                                    </Link>
                                    
                                    {/* Subitems */}
                                    {!collapsedSidebar && item.subitems && expandedItems[item.name] && (
                                      <div className="mt-1 ml-7 space-y-1">
                                        {item.subitems.map((subitem) => {
                                          const subActive = pathname === subitem.href;
                                          return (
                                            <Link
                                              key={subitem.name}
                                              href={subitem.href}
                                              className={`block px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                                                subActive
                                                  ? darkMode 
                                                    ? 'bg-gray-700 text-white' 
                                                    : 'bg-gray-100 text-gray-900'
                                                  : darkMode 
                                                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                              }`}
                                            >
                                              {subitem.name}
                                            </Link>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Pro Upgrade Banner */}
                      {!collapsedSidebar && (
                        <div className={`mx-3 mt-2 p-3 rounded-lg ${
                          darkMode
                            ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-800'
                            : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100'
                        }`}>
                          <div className="flex items-center">
                            <Zap className={`w-5 h-5 mr-2 ${
                              darkMode ? 'text-emerald-400' : 'text-emerald-500'
                            }`} />
                            <h4 className={`text-sm font-medium ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              Premium Features
                            </h4>
                          </div>
                          <p className={`text-xs mt-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Unlock advanced analytics and competitor insights
                          </p>
                          <Button
                            size="sm"
                            className={`w-full mt-2 text-xs ${
                              darkMode
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            Upgrade Plan
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Sidebar Footer with User Profile */}
                    {!collapsedSidebar && (
                      <div className={`flex-shrink-0 border-t p-4 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${
                            darkMode
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          }`}>
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {user?.displayName || user?.email?.split('@')[0] || 'Restaurant Owner'}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Premium Plan</p>
                          </div>
                          <button 
                            onClick={handleLogout}
                            className={`p-1 rounded-lg ${
                              darkMode
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            } transition-all duration-200`}
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>

                {/* Resize Handle */}
                {!collapsedSidebar && (
                  <PanelResizeHandle 
                    className={`w-1.5 transition-all duration-200 flex items-center justify-center group cursor-col-resize ${
                      darkMode ? 'bg-gray-700 hover:bg-emerald-800' : 'bg-gray-100 hover:bg-emerald-100'
                    }`}
                  >
                    <div className={`w-0.5 h-12 group-hover:opacity-100 opacity-0 transition-opacity ${
                      darkMode ? 'bg-emerald-600' : 'bg-emerald-500'
                    }`}>
                      <GripVertical className="w-3 h-3 text-transparent" />
                    </div>
                  </PanelResizeHandle>
                )}

                {/* Main Content Panel */}
                <Panel defaultSize={80} minSize={65} className="flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <main className="flex-1">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        {/* Page Header (only if not shown in navbar) */}
                        {!showNavbar && (pageTitle || pageDescription) && (
                          <div className="mb-6">
                            {pageTitle && (
                              <h1 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {pageTitle}
                              </h1>
                            )}
                            {pageDescription && (
                              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {pageDescription}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Welcome Banner */}
                        {showWelcomeBanner && <WelcomeBanner onStartTour={startTour} />}

                        {/* Page Content */}
                        {children}
                      </div>
                    </main>
                  </div>
                </Panel>
              </PanelGroup>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 lg:hidden">
                <div 
                  className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" 
                  onClick={() => setSidebarOpen(false)} 
                />
                <div className={`relative flex-1 flex flex-col max-w-sm w-full shadow-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </div>

                  {/* Mobile Sidebar Header */}
                  <div className={`px-4 py-4 border-b ${
                    darkMode 
                      ? 'border-gray-700 bg-gradient-to-r from-emerald-800 to-teal-900'
                      : 'border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-600'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">B</span>
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-white">BiteBase</h2>
                        <p className="text-xs text-emerald-100">Intelligence Platform</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className={`flex-1 h-0 pt-2 pb-4 overflow-y-auto ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    {navigation.map((section) => (
                      <div key={section.name} className="px-3 py-2">
                        <h3 className={`text-xs font-semibold uppercase tracking-wider px-3 mb-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {section.name}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => {
                            const active = isActive(item.href);
                            return (
                              <div key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`${
                                    active
                                      ? darkMode 
                                        ? 'bg-gray-700 border-l-4 border-emerald-500 text-white' 
                                        : 'bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700'
                                      : darkMode 
                                        ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-white border-l-4' 
                                        : 'border-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4'
                                  } group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200`}
                                  onClick={() => {
                                    if (!item.subitems) {
                                      setSidebarOpen(false);
                                    }
                                  }}
                                >
                                  <item.icon 
                                    className={`mr-4 flex-shrink-0 h-6 w-6 ${
                                      active 
                                        ? darkMode 
                                          ? 'text-emerald-400' 
                                          : 'text-emerald-600'
                                        : darkMode 
                                          ? 'text-gray-400 group-hover:text-gray-300' 
                                          : 'text-gray-400 group-hover:text-gray-600'
                                    }`} 
                                  />
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium">{item.name}</div>
                                      {item.badge && (
                                        <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                          darkMode 
                                            ? 'bg-emerald-900 text-emerald-300' 
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                          {item.badge}
                                        </span>
                                      )}
                                      {item.subitems && (
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            toggleItem(item.name);
                                          }}
                                          className="ml-auto"
                                        >
                                          <ChevronDown
                                            className={`h-5 w-5 transform transition-transform ${
                                              expandedItems[item.name] ? 'rotate-180' : ''
                                            } ${
                                              darkMode ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                          />
                                        </button>
                                      )}
                                    </div>
                                    <div className={`text-sm mt-0.5 ${
                                      darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                                
                                {/* Mobile Subitems */}
                                {item.subitems && expandedItems[item.name] && (
                                  <div className="mt-1 ml-12 space-y-1">
                                    {item.subitems.map((subitem) => {
                                      const subActive = pathname === subitem.href;
                                      return (
                                        <Link
                                          key={subitem.name}
                                          href={subitem.href}
                                          className={`block px-3 py-2 text-base rounded-lg transition-colors duration-200 ${
                                            subActive
                                              ? darkMode 
                                                ? 'bg-gray-700 text-white' 
                                                : 'bg-gray-100 text-gray-900'
                                              : darkMode 
                                                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                          }`}
                                          onClick={() => setSidebarOpen(false)}
                                        >
                                          {subitem.name}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Sidebar Footer */}
                  <div className={`flex-shrink-0 border-t p-4 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${
                        darkMode
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {user?.displayName || user?.email?.split('@')[0] || 'Restaurant Owner'}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Premium Plan
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`p-2 rounded-lg ${
                          darkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Fallback for when sidebar is hidden */}
        {!showSidebar && (
          <div className="flex-1 flex flex-col">
            <main className="flex-1">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Page Header */}
                {(pageTitle || pageDescription) && (
                  <div className="mb-6">
                    {pageTitle && (
                      <h1 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {pageTitle}
                      </h1>
                    )}
                    {pageDescription && (
                      <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {pageDescription}
                      </p>
                    )}
                  </div>
                )}

                {/* Welcome Banner */}
                {showWelcomeBanner && <WelcomeBanner onStartTour={startTour} />}

                {/* Page Content */}
                {children}
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Tour Component */}
      <WebTour
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </div>
  )
}

// Missing ChevronLeft icon
const ChevronLeft = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
