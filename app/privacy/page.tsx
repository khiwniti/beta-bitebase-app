"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Users, Clock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Privacy Policy
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    How we collect, use, and protect your data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Last Updated */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Last updated: December 2024</span>
            </div>
          </div>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                At BiteBase ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our restaurant analytics platform.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                By using BiteBase, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Name, email address, and contact information</li>
                  <li>Restaurant business information and location data</li>
                  <li>Account credentials and authentication data</li>
                  <li>Billing and payment information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Business Data</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>Restaurant performance metrics and analytics</li>
                  <li>Menu items, pricing, and inventory data</li>
                  <li>Customer demographics and behavior patterns</li>
                  <li>Sales data and transaction records</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>How you interact with our platform</li>
                  <li>Device information and IP addresses</li>
                  <li>Browser type and operating system</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="font-medium text-purple-600 mt-1">•</span>
                  Provide and maintain our restaurant analytics services
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-purple-600 mt-1">•</span>
                  Generate insights and recommendations for your business
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-purple-600 mt-1">•</span>
                  Process payments and manage your account
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-purple-600 mt-1">•</span>
                  Communicate with you about our services
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-purple-600 mt-1">•</span>
                  Improve our platform and develop new features
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-purple-600 mt-1">•</span>
                  Comply with legal obligations and prevent fraud
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                <li>End-to-end encryption for data transmission</li>
                <li>Secure data storage with regular backups</li>
                <li>Access controls and employee training</li>
                <li>Regular security audits and monitoring</li>
                <li>Compliance with industry standards (SOC 2, GDPR)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                If you have questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> privacy@bitebase.com</div>
                  <div><strong>Address:</strong> BiteBase Inc., 123 Tech Street, San Francisco, CA 94105</div>
                  <div><strong>Phone:</strong> +1 (555) 123-4567</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We will respond to your inquiry within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center pt-8">
            <Link
              href="/terms"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              View Terms of Service
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
