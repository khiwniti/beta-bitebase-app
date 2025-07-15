/**
 * Subscription Cancel Page
 * Displayed when user cancels Stripe checkout
 */

'use client';

import Link from 'next/link';

export default function SubscriptionCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="text-yellow-500 text-6xl mb-6">⚠️</div>
        
        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your subscription process was cancelled. No charges have been made to your account.
        </p>

        {/* Why Subscribe Section */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-blue-900 mb-2">Why subscribe to BiteBase?</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">✓</span>
              AI-powered market analysis
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">✓</span>
              Real-time competitor tracking
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">✓</span>
              Predictive sales forecasting
            </div>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">✓</span>
              Location intelligence insights
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/subscription"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            Continue Free
          </Link>
        </div>

        {/* Free Trial Offer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Not ready to commit? Start with our free plan and upgrade anytime.
          </p>
          <Link
            href="/subscription"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View Free Plan Features →
          </Link>
        </div>

        {/* Support */}
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@bitebase.com" className="text-blue-600 hover:underline">
              support@bitebase.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}