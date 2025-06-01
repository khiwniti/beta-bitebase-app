"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  MapPin,
  TrendingUp,
  DollarSign,
  Package,
  Megaphone,
  FileText,
  Utensils,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  Clock,
  Star,
  MessageSquare,
  Calendar,
  User,
  LogOut
} from 'lucide-react'
import { Button } from "@bitebase/ui"
import BiteBaseLogo from '../BiteBaseLogo'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
  badge?: string
  subitems?: { name: string; href: string }[]
}

interface NavigationSection {
  name: string
  items: NavigationItem[]
}

const navigation: NavigationSection[] = [
  {
    name: "Overview",
    items: [
  {
    name: "Dashboard",
    href: "/dashboard",
        icon: LayoutDashboard,
        description: "Restaurant performance metrics"
      }
    ]
  },
  {
    name: "Location",
    items: [
  {
    name: "Market Analysis",
    href: "/market-analysis",
        icon: TrendingUp,
        description: "Interactive map intelligence",
        badge: "Pro"
      },
      {
        name: "Location Analytics",
        href: "/place",
        icon: MapPin,
        description: "Location intelligence",
        subitems: [
          { name: "Area Overview", href: "/place/area-analysis" },
          { name: "Foot Traffic", href: "/place/foot-traffic" },
          { name: "Competition Map", href: "/place/competition" }
        ]
      }
    ]
  },
  {
    name: "Business",
    items: [
      {
        name: "Menu Optimization",
        href: "/product",
        icon: Package,
        description: "Menu engineering & analysis"
      },
      {
        name: "Pricing Strategy",
        href: "/price",
        icon: DollarSign,
        description: "Dynamic pricing models"
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
        description: "Customer preferences & segmentation"
      }
    ]
  },
  {
    name: "Operations",
    items: [
      {
        name: "Restaurant Settings",
        href: "/restaurant-settings",
        icon: Settings,
        description: "Restaurant configuration & setup"
      },
      {
        name: "POS Integration",
        href: "/pos-integration",
        icon: DollarSign,
        description: "Connect your POS system"
      },
      {
        name: "Campaign Management",
        href: "/campaigns",
        icon: Megaphone,
        description: "Monitor marketing campaigns & projects"
      },
      {
        name: "Reviews & Ratings",
        href: "/reviews",
        icon: Star,
        description: "Monitor & respond to reviews"
      },
      {
        name: "Schedule",
        href: "/calendar",
        icon: Calendar,
        description: "Business hours & events"
      }
    ]
  },
  {
    name: "Reports",
    items: [
      {
        name: "Market Reports",
    href: "/reports",
        icon: FileText,
        description: "Data analytics reports"
      },
      {
        name: "Performance",
        href: "/reports/performance",
        icon: TrendingUp, 
        description: "Business performance metrics"
      }
    ]
  }
];

interface SidebarProps {
  className?: string
  collapsed?: boolean
  toggleCollapsed?: () => void
  mobileOpen?: boolean
  setMobileOpen?: (open: boolean) => void
  userName?: string
  restaurantName?: string
}

export function Sidebar({
  className = "",
  collapsed = false,
  toggleCollapsed,
  mobileOpen = false,
  setMobileOpen,
  userName = "Maria Rodriguez",
  restaurantName = "Bella Vista Bistro"
}: SidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [showUserMenu, setShowUserMenu] = useState(false)
  
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

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  }
  
  const toggleItem = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }
  
  const handleMobileClose = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && setMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={handleMobileClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 lg:relative transform transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-72'}
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col
          ${className}`
        }
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          {!collapsed ? (
            <>
              <Link href="/dashboard" className="flex items-center">
                <BiteBaseLogo size="xs" />
                <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">BiteBase</span>
        </Link>
              <button 
                onClick={toggleCollapsed}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Collapse sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Expand sidebar"
              >
                <BiteBaseLogo size="xs" showText={false} />
              </button>
            </div>
          )}
      </div>

        {/* Sidebar navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pt-2 pb-4">
          <nav className="px-2 space-y-1">
            {navigation.map((section) => (
              <div key={section.name} className="mb-4">
                {/* Section header */}
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(section.name)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors group"
                  >
                    <span>{section.name}</span>
                    <ChevronDown 
                      className={`h-3.5 w-3.5 transform transition-transform ${
                        expandedSections[section.name] ? 'rotate-180' : 'rotate-0'
                      } text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300`} 
                    />
                  </button>
                )}
                
                {/* Section items */}
                {(expandedSections[section.name] || collapsed) && (
                  <div className={`${collapsed ? 'space-y-2 mt-2' : 'space-y-1 mt-1'}`}>
                    {section.items.map((item) => {
                      const active = isActive(item.href);

          return (
                        <div key={item.name} className="relative">
                          <Link
                            href={item.href}
                            className={`group flex items-center ${
                              !collapsed ? 'justify-between px-3 py-2' : 'flex-col justify-center px-2 py-3'
                            } rounded-lg transition-colors
                              ${active 
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`
                            }
                            onClick={() => item.subitems && setMobileOpen && setMobileOpen(false)}
                          >
                            <div className={`flex items-center ${collapsed ? 'flex-col' : ''}`}>
                              <div className={`${
                                active 
                                  ? 'text-primary-700 dark:text-primary-400' 
                                  : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-700 dark:group-hover:text-primary-400'
                                } ${collapsed ? 'mb-1.5' : 'mr-3'}`}
                              >
                                <item.icon className={`${collapsed ? 'h-5 w-5' : 'h-5 w-5'}`} />
                              </div>
                              {!collapsed && (
                                <span className="text-sm font-medium truncate">
                                  {item.name}
                                </span>
                              )}
                              {collapsed && (
                                <span className="text-xs font-medium text-center">
                                  {item.name.split(' ')[0]}
                                </span>
                              )}
                            </div>
                            
                            {!collapsed && (
                              <div className="flex items-center">
                                {item.badge && (
                                  <span className="ml-auto mr-2 px-1.5 py-0.5 text-xs rounded-md bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
                                    {item.badge}
                                  </span>
                                )}
                                {item.subitems && (
                                  <button
                                    onClick={(e) => toggleItem(e, item.name)} 
                                    className={`p-0.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
                                    aria-label={expandedItems[item.name] ? "Collapse" : "Expand"}
                                  >
                                    <ChevronDown className={`h-4 w-4 transition-transform ${
                                      expandedItems[item.name] ? 'rotate-180' : 'rotate-0'
                                    }`} />
                                  </button>
                                )}
                              </div>
                            )}
                          </Link>
                          
                          {/* Tooltip for collapsed mode */}
                          {collapsed && (
                            <div className="absolute left-full top-0 ml-6 hidden group-hover:block z-50">
                              <div className="bg-gray-900 text-white text-sm rounded-md py-1 px-3 whitespace-nowrap">
                                {item.name}
                              </div>
                              <div className="absolute top-2 -left-1 w-0 h-0 border-t-4 border-r-4 border-b-4 border-t-transparent border-r-gray-900 border-b-transparent"></div>
                            </div>
                          )}
                          
                          {/* Subitems */}
                          {!collapsed && item.subitems && expandedItems[item.name] && (
                            <div className="mt-1 ml-10 space-y-1">
                              {item.subitems.map((subitem) => (
                                <Link
                                  key={subitem.name}
                                  href={subitem.href}
                                  onClick={handleMobileClose}
                                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors
                                    ${pathname === subitem.href
                                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`
                                  }
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                                  {subitem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        {/* Sidebar footer - User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {!collapsed ? (
            <div className="p-4">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{restaurantName}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 py-2 animate-fadeInUp">
                    <Link
                      href="/settings/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings/restaurant" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      Restaurant Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                    <Link
                      href="/auth/signout" 
                      className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-2">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full p-2 flex justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 relative"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                </div>
                
                {showUserMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 py-2 animate-fadeInUp">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{restaurantName}</p>
                    </div>
                    <Link
                      href="/settings/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings/restaurant" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      Restaurant Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                    <Link
                      href="/auth/signout" 
                      className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Link>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
