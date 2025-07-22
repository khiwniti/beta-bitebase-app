"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  BarChart3, 
  Settings,
  UtensilsCrossed,
  MapPin
} from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslations } from '../../hooks/useTranslations';

export default function AdminTabs() {
  const pathname = usePathname();
  const t = useTranslations('admin');

  const adminTabs = [
    {
      name: t('admin.navigation.dashboard'),
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: t('admin.navigation.restaurants'),
      href: '/admin/restaurants',
      icon: UtensilsCrossed,
      exact: false
    },
    {
      name: t('admin.navigation.locationIntelligence'),
      href: '/admin/location-intelligence',
      icon: MapPin,
      exact: false
    },
    {
      name: t('admin.navigation.seoManagement'),
      href: '/admin/seo',
      icon: Search,
      exact: false
    },
    {
      name: t('admin.navigation.userManagement'),
      href: '/admin/users',
      icon: Users,
      exact: false
    },
    {
      name: t('admin.navigation.analytics'),
      href: '/admin/analytics',
      icon: BarChart3,
      exact: false
    },
    {
      name: t('admin.navigation.settings'),
      href: '/admin/settings',
      icon: Settings,
      exact: false
    }
  ];

  const isActive = (tab: typeof adminTabs[0]) => {
    if (tab.exact) {
      return pathname === tab.href;
    }
    return pathname.startsWith(tab.href);
  };

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Admin Header */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600 mt-1">BiteBase Intelligence Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="text-sm text-emerald-600">
                Welcome, Admin User
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-8 overflow-x-auto">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab);
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${active
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}