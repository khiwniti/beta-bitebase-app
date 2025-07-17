"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Scale, CreditCard, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
                <Scale className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Terms of Service
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Legal terms and conditions for using BiteBase
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

          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                These Terms of Service ("Terms") govern your use of BiteBase ("Service") operated by BiteBase Inc. ("us", "we", or "our"). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                If you disagree with any part of these terms, then you may not access the Service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                BiteBase provides restaurant analytics and business intelligence services, including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                <li>Market analysis and location intelligence</li>
                <li>Menu optimization and pricing strategies</li>
                <li>Customer analytics and insights</li>
                <li>Performance reporting and dashboards</li>
                <li>POS system integrations</li>
                <li>Competitive analysis tools</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Registration</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  You must provide accurate, complete, and current information during registration and keep your account information updated.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Account Security</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>We are not liable for losses resulting from unauthorized account use</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the Service's operation</li>
                <li>Use the Service for competitive intelligence against us</li>
                <li>Share your account credentials with unauthorized parties</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Subscription Fees</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Subscription fees are billed in advance on a monthly or annual basis depending on your chosen plan.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Refunds</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We offer a 30-day money-back guarantee for new subscriptions. Refunds for annual plans are prorated.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Price Changes</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may modify subscription fees with 30 days' notice. Changes will apply to subsequent billing cycles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Data and Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Data</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You retain ownership of all data you upload to our Service. We use your data solely to provide our services as outlined in our Privacy Policy.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Security</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We implement industry-standard security measures to protect your data, but cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Data Retention</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We retain your data for as long as your account is active. Upon termination, data is deleted within 90 days unless legally required to retain it.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                To the fullest extent permitted by law, BiteBase shall not be liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party actions or content</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">By You</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You may terminate your account at any time through your account settings or by contacting support.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">By Us</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may terminate or suspend your account for violations of these Terms or for any reason with 30 days' notice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> legal@bitebase.com</div>
                  <div><strong>Address:</strong> BiteBase Inc., 123 Tech Street, San Francisco, CA 94105</div>
                  <div><strong>Phone:</strong> +1 (555) 123-4567</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center pt-8">
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              View Privacy Policy
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
