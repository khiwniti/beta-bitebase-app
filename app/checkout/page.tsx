"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StripeProvider from '../../components/checkout/StripeProvider';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BiteBaseLogo from '../../components/BiteBaseLogo';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Example subscription plans
  const plans = [
    { id: 'plan_basic', name: 'Basic Plan', price: 4900, description: 'Monthly subscription to BiteBase Basic' },
    { id: 'plan_pro', name: 'Pro Plan', price: 10900, description: 'Monthly subscription to BiteBase Pro' },
    { id: 'plan_enterprise', name: 'Enterprise Plan', price: 59900, description: 'Monthly subscription to BiteBase Enterprise' }
  ];
  
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Pro plan
  
  const handleSuccess = (paymentIntent: any) => {
    console.log('Payment succeeded:', paymentIntent);
    setPaymentSuccess(true);
    
    // In a real app, you would update the user's subscription status here
    // and redirect to a success page or dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };
  
  const handleError = (error: Error) => {
    console.error('Payment error:', error);
    // Handle payment errors
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <BiteBaseLogo size="md" />
          <Button variant="outline" onClick={() => router.push('/subscription')}>
            Back to Plans
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {paymentSuccess ? (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">Payment Successful!</CardTitle>
                <CardDescription>
                  Thank you for your subscription to BiteBase.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-4">
                  Your payment has been processed successfully. You now have access to all the features of the {selectedPlan.name}.
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan selection */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Select Your Plan</h2>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan.id === plan.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        <div className="text-xl font-bold">${(plan.price / 100).toFixed(2)}/mo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment form */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                <StripeProvider>
                  <CheckoutForm 
                    amount={selectedPlan.price}
                    description={selectedPlan.description}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </StripeProvider>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 BiteBase. All rights reserved. Payments processed securely by Stripe.</p>
        </div>
      </footer>
    </div>
  );
}