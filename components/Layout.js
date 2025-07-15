/**
 * Simple Layout Component
 * Basic layout wrapper for pages
 */

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Map', href: '/map', icon: '🗺️' },
    { name: 'Analytics', href: '/analytics', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">🍽️</div>
                <span className="text-xl font-bold text-gray-900">BiteBase</span>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:ml-8 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      router.pathname === item.href
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">BiteBase Intelligence</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}