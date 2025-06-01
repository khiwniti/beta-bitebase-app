"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bell, 
  Search, 
  Menu, 
  HelpCircle,
  MessageSquare,
  Calendar
} from 'lucide-react'
import BiteBaseLogo from '../BiteBaseLogo'
import { Button } from "@bitebase/ui"

interface HeaderProps {
  onOpenSidebar: () => void
  userName?: string
  restaurantName?: string
}

export function Header({ onOpenSidebar, userName = 'Maria Rodriguez', restaurantName = 'Bella Vista Bistro' }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if page is dashboard or analytics to show specific header actions
  const isAnalyticsPage = pathname?.includes('/market-analysis') || pathname?.includes('/place')
  const isDashboard = pathname === '/dashboard'
  
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Left section - Mobile menu toggle and branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{restaurantName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Culinary Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className={`${searchOpen ? 'flex' : 'hidden md:flex'} flex-1 mx-4 lg:mx-8 max-w-lg`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
            type="search"
              placeholder="Search competitors, locations, insights..."
              className="w-full py-2 pl-10 pr-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center px-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
          >
            <Search className="h-5 w-5" />
          </button>
          
          {/* Help button */}
          <button 
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Help and resources"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          
          {/* Calendar */}
          <Link
            href="/calendar"
            className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Calendar and events"
          >
            <Calendar className="h-5 w-5" />
          </Link>
          
          {/* Messages */}
          <Link
            href="/messages"
            className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-500"></span>
          </Link>
          
          {/* Notifications */}
          <Link
            href="/notifications"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Link>
          
          {/* Actions button - context-aware */}
          {(isAnalyticsPage || isDashboard) && (
            <div className="hidden md:block">
              <Button 
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                size="sm"
              >
                {isAnalyticsPage ? 'Generate Report' : 'Add Location'}
              </Button>
            </div>
          )}
          

        </div>
      </div>
    </header>
  )
}

export default Header
