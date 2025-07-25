"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "../ui/button"
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
  Brain,
  UtensilsCrossed,
  CreditCard
} from 'lucide-react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
// import { useAuth } from '../../contexts/AuthContext'
import BiteBaseLogo from '../BiteBaseLogo'
import { WebTour, useTour } from '../tour/WebTour'
import { TourTrigger, WelcomeBanner } from '../tour/TourTrigger'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { useTranslations } from '../../hooks/useTranslations'
import { useLanguage } from '../../contexts/LanguageContext'
import { GlobalChatbot } from '../GlobalChatbot'

// Type definitions for navigation
interface NavigationSubItem {
  name: string;
  href: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  tourId?: string;
  description?: string;
  badge?: string;
  expandable?: boolean;
  highlight?: boolean;
  subitems?: NavigationSubItem[];
}

interface NavigationSection {
  name: string;
  items: NavigationItem[];
}

// Function to get navigation structure with translations
const getNavigationStructure = (t: any): NavigationSection[] => [
  {
    name: t('navigation.sections.dashboard'),
    items: [
      {
        name: t('navigation.items.dashboard'),
        href: "/dashboard",
        icon: LayoutDashboard,
        tourId: "dashboard",
        description: t('navigation.descriptions.overview'),
        badge: t('navigation.badges.new')
      },
    ]
  },
  {
    name: t('navigation.sections.location'),
    items: [
      {
        name: t('navigation.items.marketAnalysis'),
        href: "/market-analysis",
        icon: TrendingUp,
        tourId: "market-analysis",
        description: t('navigation.descriptions.marketAnalysis'),
        highlight: true,
        badge: t('navigation.badges.pro')
      },
      {
        name: t('navigation.items.aiAnalytics'),
        href: "/analytics",
        icon: Activity,
        tourId: "ai-analytics",
        description: "AI-powered analytics",
        badge: t('navigation.badges.ai')
      },
      {
        name: t('navigation.items.locationAnalytics'),
        href: "/place",
        icon: MapPin,
        tourId: "place-analysis",
        description: t('navigation.descriptions.placeAnalysis'),
        expandable: true,
        subitems: [
          { name: t('navigation.subitems.areaOverview'), href: "/place/area-analysis" },
          { name: t('navigation.subitems.footTraffic'), href: "/place/foot-traffic" },
          { name: t('navigation.subitems.competitionMap'), href: "/place/competition" },
        ]
      },
    ]
  },
  {
    name: t('navigation.sections.business'),
    items: [
      {
        name: t('navigation.items.menuOptimization'),
        href: "/product",
        icon: Package,
        tourId: "product-management",
        description: t('navigation.descriptions.menuOptimization')
      },
      {
        name: t('navigation.items.pricingStrategy'),
        href: "/price",
        icon: DollarSign,
        tourId: "price-strategy",
        description: t('navigation.descriptions.pricingStrategy')
      },
      {
        name: t('navigation.items.marketing'),
        href: "/promotion",
        icon: Megaphone,
        tourId: "promotion-marketing",
        description: t('navigation.descriptions.marketing')
      },
      {
        name: t('navigation.items.customerInsights'),
        href: "/customers",
        icon: Users,
        tourId: "customer-insights",
        description: "Customer behavior analysis"
      },
    ]
  },
  {
    name: t('navigation.sections.operations'),
    items: [
      {
        name: t('navigation.items.restaurantSettings'),
        href: "/restaurant-settings",
        icon: Utensils,
        tourId: "restaurant-settings",
        description: "Restaurant configuration"
      },
      {
        name: t('navigation.items.posIntegration'),
        href: "/pos-integration",
        icon: Zap,
        tourId: "pos-integration",
        description: "POS system integration"
      },
      {
        name: t('navigation.items.campaignManagement'),
        href: "/campaigns",
        icon: Megaphone,
        tourId: "campaign-management",
        description: "Marketing campaigns"
      },
      {
        name: t('navigation.items.reviewsRatings'),
        href: "/reviews",
        icon: Star,
        tourId: "reviews-ratings",
        description: "Customer feedback"
      },
      {
        name: t('navigation.items.schedule'),
        href: "/calendar",
        icon: Calendar,
        tourId: "schedule",
        description: "Schedule management"
      },
    ]
  },
  {
    name: t('navigation.sections.reports'),
    items: [
      {
        name: t('navigation.items.marketReports'),
        href: "/reports",
        icon: FileText,
        tourId: "reports",
        description: t('navigation.descriptions.reports')
      },
      {
        name: t('navigation.items.performance'),
        href: "/reports/performance",
        icon: PieChart,
        tourId: "performance",
        description: "Performance metrics"
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
  // const { user, logout } = useAuth()
  // Temporary bypass for development
  const user = {
    id: '1',
    name: 'Restaurant Manager',
    email: 'admin@bitebase.app',
    role: 'admin',
    subscription_tier: 'pro' as const
  };
  const logout = () => console.log('Logout bypassed in development');
  const { isTourOpen, startTour, closeTour, completeTour } = useTour()
  const { language } = useLanguage()
  const t = useTranslations('common')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Removed expandedSections and expandedItems state - all sections are now always visible
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New market report available", time: "2 min ago", read: false },
    { id: 2, title: "Price trend alert detected", time: "1 hour ago", read: false },
    { id: 3, title: "Competitor opened nearby", time: "3 hours ago", read: true },
  ])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [collapsedSidebar, setCollapsedSidebar] = useState(false)

  // Direct navigation structure with translations - bypassing the function
  const navigation: NavigationSection[] = useMemo(() => {
    console.log('Creating navigation directly with language:', language);
    
    return [
      {
        name: language === 'th' ? 'ภาพรวม' : 'OVERVIEW',
        items: [
          {
            name: language === 'th' ? 'แดชบอร์ด' : 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            tourId: 'dashboard-nav'
          }
        ]
      },
      {
        name: language === 'th' ? 'ที่ตั้ง' : 'LOCATION',
        items: [
          {
            name: language === 'th' ? 'การวิเคราะห์ตลาด' : 'Market Analysis',
            href: '/market-analysis',
            icon: TrendingUp,
            badge: language === 'th' ? 'โปร' : 'Pro',
            highlight: true,
            tourId: 'market-analysis-nav'
          },
          {
            name: language === 'th' ? 'การวิเคราะห์ AI' : 'AI Analytics',
            href: '/analytics',
            icon: Brain,
            badge: 'AI',
            tourId: 'ai-analytics-nav'
          },
          {
            name: language === 'th' ? 'การวิเคราะห์ที่ตั้ง' : 'Location Analytics',
            href: '/place',
            icon: MapPin,
            subitems: [
              {
                name: language === 'th' ? 'การวิเคราะห์พื้นที่' : 'Area Analysis',
                href: '/place/area-analysis'
              },
              {
                name: language === 'th' ? 'การเดินทางของลูกค้า' : 'Foot Traffic',
                href: '/place/foot-traffic'
              },
              {
                name: language === 'th' ? 'แผนที่คู่แข่ง' : 'Competition Map',
                href: '/place/competition'
              }
            ],
            tourId: 'location-analytics-nav'
          }
        ]
      },
      {
        name: language === 'th' ? 'ธุรกิจ' : 'BUSINESS',
        items: [
          {
            name: language === 'th' ? 'การปรับปรุงเมนู' : 'Menu Optimization',
            href: '/product',
            icon: UtensilsCrossed,
            tourId: 'menu-optimization-nav'
          },
          {
            name: language === 'th' ? 'กลยุทธ์การตั้งราคา' : 'Pricing Strategy',
            href: '/price',
            icon: DollarSign,
            tourId: 'pricing-strategy-nav'
          },
          {
            name: language === 'th' ? 'การตลาด' : 'Marketing',
            href: '/promotion',
            icon: Megaphone,
            tourId: 'marketing-nav'
          },
          {
            name: language === 'th' ? 'ข้อมูลเชิงลึกลูกค้า' : 'Customer Insights',
            href: '/customers',
            icon: Users,
            tourId: 'customer-insights-nav'
          }
        ]
      },
      {
        name: language === 'th' ? 'การดำเนินงาน' : 'OPERATIONS',
        items: [
          {
            name: language === 'th' ? 'การตั้งค่าร้านอาหาร' : 'Restaurant Settings',
            href: '/restaurant-settings',
            icon: Settings,
            tourId: 'restaurant-settings-nav'
          },
          {
            name: language === 'th' ? 'การรวม POS' : 'POS Integration',
            href: '/pos-integration',
            icon: CreditCard,
            tourId: 'pos-integration-nav'
          },
          {
            name: language === 'th' ? 'การจัดการแคมเปญ' : 'Campaign Management',
            href: '/campaigns',
            icon: Target,
            tourId: 'campaign-management-nav'
          },
          {
            name: language === 'th' ? 'รีวิวและการให้คะแนน' : 'Reviews & Ratings',
            href: '/reviews',
            icon: Star,
            tourId: 'reviews-ratings-nav'
          },
          {
            name: language === 'th' ? 'ตารางเวลา' : 'Schedule',
            href: '/calendar',
            icon: Calendar,
            tourId: 'schedule-nav'
          }
        ]
      },
      {
        name: language === 'th' ? 'รายงาน' : 'REPORTS',
        items: [
          {
            name: language === 'th' ? 'รายงานตลาด' : 'Market Reports',
            href: '/reports',
            icon: FileText,
            tourId: 'market-reports-nav'
          },
          {
            name: language === 'th' ? 'ประสิทธิภาพ' : 'Performance',
            href: '/reports/performance',
            icon: BarChart2,
            tourId: 'performance-nav'
          }
        ]
      }
    ];
  }, [language]);

  // Removed expanded sections initialization - all sections are now always visible
  
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

  // Removed toggle functions - all sections are now always visible

  const isActive = (href: string) => {
    if (!pathname) return false;
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

  // Get current section and page title
  const getCurrentSection = () => {
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
        
        // Check subitems
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

  const { section: currentSection, title: currentPageTitle } = getCurrentSection();

  // Improved layout with PanelGroup for resizable areas
  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Web Tour Integration */}
      <WebTour
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
      
      {/* Sidebar - Improved with cleaner styling */}
      {showSidebar && (
        <div 
          key={`sidebar-${language}`}
          className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 transition-all duration-300 ease-in-out 
          ${collapsedSidebar ? 'w-20' : 'w-64'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:relative h-full z-30`}
        >
          {/* Sidebar header with logo */}
          <div className={`h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10`}>
            <div className="flex items-center">
              <BiteBaseLogo size={collapsedSidebar ? "xs" : "md"} showText={false} />
              {collapsedSidebar && <span className="sr-only">BiteBase</span>}
                      </div>
                      <button 
                        onClick={toggleSidebarCollapse}
              className="text-gray-500 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <GripVertical className="h-5 w-5" />
                      </button>
                    </div>

          {/* Navigation menu */}
          <nav key={language} className="h-full overflow-y-auto pb-20 pt-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="px-3">
                      {navigation.map((section) => (
                <div key={section.name} className="mb-6">
                  {/* Section header - always visible, simpler style */}
                          {!collapsedSidebar && (
                              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <span>{section.name}</span>
                              </div>
                          )}
                          
                  {/* Section items - always visible */}
                    <div className="space-y-1">
                      {section.items.map((item) => (
                                  <div key={item.name}>
                                    <Link
                                      href={item.href}
                            className={`group flex items-center ${!collapsedSidebar ? 'px-3 py-2.5 justify-between' : 'px-1 py-4 justify-center'} rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out
                              ${isActive(item.href) 
                                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-900/30' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              } ${item.highlight ? 'border border-dashed border-primary-400 dark:border-primary-700' : ''}`}
                            aria-current={isActive(item.href) ? 'page' : undefined}
                            data-tour-id={item.tourId}
                          >
                            <div className="flex items-center">
                              {/* Icon with improved visual treatment */}
                              <div className={`${isActive(item.href) 
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                                : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                } p-2 rounded-lg transition-colors mr-3`}>
                                <item.icon className="h-5 w-5" />
                              </div>
                              
                              {/* Item text with hover effects */}
                                      {!collapsedSidebar && (
                                <span className="truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.name}</span>
                              )}
                            </div>

                            {/* Right side UI elements */}
                            {!collapsedSidebar && (
                              <div className="flex items-center">
                                {/* Badge if relevant */}
                                            {item.badge && (
                                  <span className="px-2 py-1 ml-2 text-xs rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400">
                                                {item.badge}
                                              </span>
                                            )}
                                
                                        </div>
                                      )}
                                    </Link>
                                    
                          {/* Subitems - always visible when they exist */}
                                    {!collapsedSidebar && item.subitems && (
                            <div className="ml-6 mt-1 space-y-1">
                              {item.subitems.map((subitem) => (
                                            <Link
                                              key={subitem.name}
                                              href={subitem.href}
                                  className={`block px-3 py-2 rounded-lg text-sm transition-colors
                                    ${pathname === subitem.href
                                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                              }`}
                                            >
                                              {subitem.name}
                                            </Link>
                              ))}
                                      </div>
                                    )}
                                  </div>
                      ))}
                            </div>
                        </div>
                      ))}
                          </div>
            
            {/* Bottom sidebar area for user profile and theme toggle */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
              {!collapsedSidebar ? (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg w-full transition-colors"
                  >
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary-500 border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <div className="flex-1 truncate text-left">
                      <p className="font-medium">{user?.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Restaurant Manager</p>
                          </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                          </div>
              ) : (
                          <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary-500 border-2 border-white dark:border-gray-900"></div>
                      </div>
                </button>
              )}
              
              {/* User menu dropdown */}
              {showUserMenu && (
                <div className={`absolute ${collapsedSidebar ? 'left-full ml-2' : 'left-4 right-4'} bottom-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 py-2`}>
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-medium text-sm">{user?.email || 'user@example.com'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                  </div>
                  <div className="py-1">
                    <Link href="/settings/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <User className="h-4 w-4 mr-3" />
                      Profile Settings
                    </Link>
                    <div className="px-4 py-2">
                      <LanguageSwitcher />
                    </div>
                    <button 
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {darkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
                  </div>
      )}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
                  onClick={() => setSidebarOpen(false)} 
          ></div>
        )}

        {/* Top navbar */}
        {showNavbar && (
          <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="h-16 px-4 flex items-center justify-between">
              {/* Left section with mobile menu button and breadcrumbs */}
              <div className="flex items-center space-x-4">
                    <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                  <Menu className="h-6 w-6" />
                    </button>
                
                {/* Breadcrumbs navigation */}
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Dashboard
                  </Link>
                  {currentSection && (
                    <>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400">{currentSection}</span>
                    </>
                  )}
                  {currentPageTitle && (
                    <>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{currentPageTitle}</span>
                    </>
                  )}
                      </div>
                      </div>

              {/* Center section with page title (mobile only) */}
              <div className="sm:hidden font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                {currentPageTitle || 'BiteBase'}
                  </div>

              {/* Right section with actions */}
              <div className="flex items-center space-x-2">
                {/* Global search */}
                <button 
                  className="hidden md:flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span>Quick search...</span>
                  <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 hidden lg:inline">⌘K</span>
                </button>
                
                {/* Mobile search button */}
                <button className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Search className="h-5 w-5" />
                </button>
                
                {/* Help button */}
                <button 
                  onClick={startTour}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  data-tour-id="help-button"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                  >
                    <Bell className="h-5 w-5" />
                    {getUnreadNotificationsCount() > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {getUnreadNotificationsCount()}
                                        </span>
                                      )}
                  </button>
                  
                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Mark all as read
                                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto py-2">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                                !notification.read ? 'bg-primary-50 dark:bg-primary-900/10' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                                      )}
                                    </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                            <p className="mb-1">No notifications</p>
                            <p className="text-xs">We'll notify you when something important happens</p>
                                  </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                                        <Link
                          href="/notifications"
                          className="block text-center text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 w-full p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          View all notifications
                                        </Link>
                      </div>
                                  </div>
                                )}
                  </div>

                {/* Theme toggle */}
                      <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 py-6">
            {/* Welcome Banner */}
            {showWelcomeBanner && (
              <div className="mb-6">
                <TourTrigger onStartTour={startTour} />
              </div>
            )}
            
            {/* Page header */}
                {(pageTitle || pageDescription) && (
                  <div className="mb-6">
                    {pageTitle && (
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
                    )}
                    {pageDescription && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{pageDescription}</p>
                    )}
                  </div>
                )}

            {/* Main content */}
            <div className="animate-fadeInUp">
                {children}
            </div>
              </div>
            </main>
          </div>

          {/* Global Chatbot - Available on all pages */}
          <GlobalChatbot />
    </div>
  )
}

// Legacy exports for compatibility
export default MainLayout;
