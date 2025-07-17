"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  ArrowLeft, 
  Home, 
  LogIn,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Access Denied
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-red-800 dark:text-red-200 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Unauthorized Access</span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  You don't have permission to access this resource.
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This could be because:
              </p>
              
              <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  You're not logged in to your account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Your session has expired
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  You don't have the required permissions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  The resource requires a higher subscription tier
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/auth" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              
              <button
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Need help accessing this resource?
                </p>
                <Link href="/help">
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
