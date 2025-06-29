"use client";

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { formatPrice } from '../../lib/stripe';

interface CheckoutFormProps {
  amount: number;
  description: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: Error) => void;
}

export default function CheckoutForm({ amount, description, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Create payment intent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Confirm the payment with Stripe.js
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'BiteBase Customer',
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded
        if (onSuccess) onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      if (onError && error instanceof Error) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          Secure payment processing by Stripe
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <p className="text-2xl font-bold">{formatPrice(amount)}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Card Details
            </label>
            <div className="p-3 border rounded-md">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={!stripe || isLoading} 
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}