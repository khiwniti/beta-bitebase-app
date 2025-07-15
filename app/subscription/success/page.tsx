/**
 * Subscription Success Page
 * Displayed after successful Stripe checkout
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you'd verify the session with your backend
      // For now, we'll just show a success message
      setTimeout(() => {
        setSessionData({
          id: sessionId,
          status: 'complete',
          customer_email: 'demo@bitebase.com'
        });
        setLoading(false);
      }, 1000);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/subscription"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="text-green-500 text-6xl mb-6">✅</div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to BiteBase!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your subscription has been successfully activated. You now have access to all premium features.
        </p>

        {/* Session Details */}
        {sessionData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">Subscription Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Session ID: {sessionData.id}</div>
              <div>Status: {sessionData.status}</div>
              <div>Email: {sessionData.customer_email}</div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">What's next?</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Check your email for a receipt
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Access your premium dashboard
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Start analyzing your market
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/analytics"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Start Analytics
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@bitebase.com" className="text-blue-600 hover:underline">
              support@bitebase.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}