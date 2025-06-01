"use client"

import React, { useState, useEffect } from 'react'
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
  Zap,
  Filter,
  MoreHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useAuth } from '../../contexts/AuthContext'
import BiteBaseLogo from '../BiteBaseLogo'
import { WebTour, useTour } from '../tour/WebTour'
import { TourTrigger } from '../tour/TourTrigger'

// Enhanced navigation structure with better organization
const navigation = [
  {
    name: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Performance overview",
        badge: "New"
      },
    ]
  },
  {
    name: "LOCATION",
    items: [
      {
        name: "Market Analysis",
        href: "/market-analysis",
        icon: TrendingUp,
        description: "Market intelligence",
        badge: "Pro"
      },
      {
        name: "Location Analytics",
        href: "/place",
        icon: MapPin,
        description: "Location insights",
        expandable: true,
        subitems: [
          { name: "Area Analysis", href: "/place/area" },
          { name: "Foot Traffic", href: "/place/traffic" },
          { name: "Competition", href: "/place/competition" },
        ]
      },
    ]
  },
  {
    name: "BUSINESS",
    items: [
      {
        name: "Menu Optimization",
        href: "/product",
        icon: Package,
        description: "Menu management"
      },
      {
        name: "Pricing Strategy",
        href: "/price",
        icon: DollarSign,
        description: "Price optimization"
      },
      {
        name: "Marketing",
        href: "/promotion",
        icon: Megaphone,
        description: "Campaigns & promotions"
      },
      {
        name: "Customer Insights",
        href: "/customers",
        icon: Users,
        description: "Customer analytics"
      },
    ]
  },
  {
    name: "OPERATIONS",
    items: [
      {
        name: "Restaurant Setup",
        href: "/restaurant-setup",
        icon: Utensils,
        description: "Setup wizard"
      },
      {
        name: "Reviews & Ratings",
        href: "/reviews",
        icon: Star,
        description: "Review management"
      },
      {
        name: "Schedule",
        href: "/calendar",
        icon: Calendar,
        description: "Calendar & events"
      },
    ]
  },
  {
    name: "REPORTS",
    items: [
      {
        name: "Market Reports",
        href: "/reports",
        icon: FileText,
        description: "Analysis reports"
      },
      {
        name: "Performance",
        href: "/reports/performance",
        icon: Activity,
        description: "Performance metrics"
      },
    ]
  }
]

interface DashboardLayoutProps {
  children: React.ReactNode
  pageTitle?: string
  pageDescription?: string
  headerActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: 'default' | 'outline' | 'ghost'
  }>
  showSidebar?: boolean
  sidebarCollapsible?: boolean
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href?: string }>
}

export function DashboardLayout({
  children,
  pageTitle,
  pageDescription,
  headerActions = [],
  showSidebar = true,
  sidebarCollapsible = true,
  showBreadcrumb = true,
  breadcrumbItems = []
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  // Tour state management
  const { isTourOpen, isFirstTimeUser, startTour, closeTour, completeTour } = useTour()
  
  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [darkMode, setDarkMode] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New market report available", time: "2 min ago", read: false, type: "info" },
    { id: 2, title: "Price trend alert detected", time: "1 hour ago", read: false, type: "warning" },
    { id: 3, title: "Competitor opened nearby", time: "3 hours ago", read: true, type: "alert" },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Initialize expanded sections
  useEffect(() => {
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
        
        if (item.subitems) {
          item.subitems.forEach(subitem => {
            if (pathname === subitem.href) {
              setExpandedItems(prev => ({ ...prev, [item.name]: true }));
            }
          });
        }
      });
    });
  }, [pathname]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
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

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  }

  const getCurrentPageInfo = () => {
    let currentSection = '';
    let currentPageTitle = pageTitle || '';

    navigation.forEach(section => {
      section.items.forEach(item => {
        if (isActive(item.href)) {
          currentSection = section.name;
          if (!pageTitle) {
            currentPageTitle = item.name;
          }
        }
        
        if (item.subitems) {
          item.subitems.forEach(subitem => {
            if (pathname === subitem.href) {
              currentSection = section.name;
              if (!pageTitle) {
                currentPageTitle = `${item.name} / ${subitem.name}`;
              }
            }
          });
        }
      });
    });

    return { section: currentSection, title: currentPageTitle };
  }

  const { section: currentSection, title: currentPageTitle } = getCurrentPageInfo();

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark' : ''} ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Tour integration with proper props */}
      <WebTour 
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
        isFirstTimeUser={isFirstTimeUser}
      />
      {/* Sidebar */}
      {showSidebar && (
        <div 
          className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-300 ease-in-out 
          ${sidebarCollapsed ? 'w-20' : 'w-64'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:relative h-full z-30`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center">
              <BiteBaseLogo size={sidebarCollapsed ? "xs" : "md"} showText={!sidebarCollapsed} />
            </div>
            {sidebarCollapsible && (
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-gray-500 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <GripVertical className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="h-full overflow-y-auto pb-20 pt-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            <div className="px-3 py-2">
              {navigation.map((section) => (
                <div key={section.name} className="mb-4">
                  {/* Section Header */}
                  {!sidebarCollapsed && (
                    <button
                      onClick={() => toggleSection(section.name)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span>{section.name}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${expandedSections[section.name] ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                  
                  {/* Section Items */}
                  {(expandedSections[section.name] || sidebarCollapsed) && (
                    <div className="mt-1 space-y-1">
                      {section.items.map((item) => (
                        <div key={item.name}>
                          <a
                            href={item.href}
                            className={`group flex items-center ${!sidebarCollapsed ? 'px-3 py-2.5 justify-between' : 'px-2 py-3 justify-center'} rounded-lg text-sm font-medium transition-all duration-200
                            ${isActive(item.href) 
                              ? 'bg-primary-50 text-primary-700 shadow-sm border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`${isActive(item.href) 
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                } p-2 rounded-lg transition-colors ${!sidebarCollapsed ? 'mr-3' : ''}`}>
                                <item.icon className="h-5 w-5" />
                              </div>
                              
                              {!sidebarCollapsed && (
                                <div className="flex-1">
                                  <div className="font-medium">{item.name}</div>
                                  {item.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</div>
                                  )}
                                </div>
                              )}
                            </div>

                            {!sidebarCollapsed && (
                              <div className="flex items-center space-x-2">
                                {item.badge && (
                                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium
                                    ${item.badge === 'Pro' 
                                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400' 
                                      : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'
                                    }`}>
                                    {item.badge}
                                  </span>
                                )}
                                
                                {item.expandable && (
                                  <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                      expandedItems[item.name] ? 'rotate-180' : ''
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      toggleItem(item.name)
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </a>
                          
                          {/* Subitems */}
                          {!sidebarCollapsed && item.subitems && expandedItems[item.name] && (
                            <div className="ml-12 mt-1 space-y-1">
                              {item.subitems.map((subitem) => (
                                <a
                                  key={subitem.name}
                                  href={subitem.href}
                                  className={`block px-3 py-2 rounded-lg text-sm transition-colors
                                    ${pathname === subitem.href
                                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                    }`}
                                >
                                  {subitem.name}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
              {!sidebarCollapsed ? (
                <div className="space-y-2">
                  {/* User Profile */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg w-full transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'R'}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">Restaurant Manager</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Online</div>
                      </div>
                    </button>
                    
                    {/* Theme Toggle */}
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Pro Upgrade Banner */}
                  <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-primary-200 dark:border-primary-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">BiteBase Pro</span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">-20%</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Unlock premium features for deeper market analysis and competitor insights</p>
                    <Button size="sm" className="w-full text-xs">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-medium hover:bg-primary-200 dark:hover:bg-primary-900/70 transition-colors"
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'R'}
                  </button>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-1 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Breadcrumb */}
              {showBreadcrumb && (
                <nav className="flex items-center space-x-2 text-sm">
                  <a href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <Home className="h-4 w-4" />
                  </a>
                  {breadcrumbItems.length > 0 && (
                    <>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      {breadcrumbItems.map((item, index) => (
                        <React.Fragment key={index}>
                          {item.href ? (
                            <a href={item.href} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                              {item.label}
                            </a>
                          ) : (
                            <span className="text-gray-900 dark:text-gray-100 font-medium">{item.label}</span>
                          )}
                          {index < breadcrumbItems.length - 1 && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                  {breadcrumbItems.length === 0 && currentSection && (
                    <>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400">{currentSection}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{currentPageTitle}</span>
                    </>
                  )}
                </nav>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search competitors, locations, insights..."
                  className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded border">⌘K</kbd>
                </div>
              </div>

              {/* Action buttons */}
              {headerActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || 'default'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {action.icon}
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              ))}

              {/* Fullscreen toggle */}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {getUnreadNotificationsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getUnreadNotificationsCount()}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                        <button
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'R'}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Restaurant Manager</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <a href="/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </a>
                      <a href="/help" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help & Support
                      </a>
                      <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Header */}
        {(pageTitle || pageDescription || headerActions.length > 0) && (
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {pageTitle && (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pageTitle}</h1>
                )}
                {pageDescription && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{pageDescription}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="container max-w-7xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


    </div>
  )
}

export default DashboardLayout