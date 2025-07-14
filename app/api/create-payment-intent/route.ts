import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2025-06-30.basil', // Use the latest API version
});

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json();

    // Validate the amount
    if (!amount || amount < 100) { // Minimum amount is $1.00 (100 cents)
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is $1.00' },
        { status: 400 }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description: description || 'BiteBase payment',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}