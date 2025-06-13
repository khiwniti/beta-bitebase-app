/**
 * Payment Webhook Handler using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const signature = req.headers['stripe-signature'];
    const event = req.body;

    if (!signature) {
      return res.status(400).json({
        error: 'Missing stripe signature'
      });
    }

    // Handle webhook via MCP
    const webhookResult = await mcpClient.executeTool('handle_webhook', {
      event,
      signature
    });

    if (!webhookResult.success) {
      return res.status(400).json({
        error: 'Webhook verification failed',
        details: webhookResult.error
      });
    }

    // Process different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(mcpClient, event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(mcpClient, event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(mcpClient, event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(mcpClient, event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Track webhook event
    await mcpClient.executeTool('track_event', {
      userId: 'system',
      event: 'webhook_processed',
      properties: {
        eventType: event.type,
        eventId: event.id,
        processed: true
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      received: true,
      eventType: event.type
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message
    });
  }
}

async function handlePaymentSuccess(mcpClient, paymentIntent) {
  const { customer, metadata } = paymentIntent;
  
  // Send confirmation email
  await mcpClient.executeTool('send_email', {
    to: customer.email,
    subject: 'Payment Confirmation - BiteBase',
    template: 'payment_success',
    data: {
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      restaurantId: metadata.restaurantId,
      reservationDetails: JSON.parse(metadata.reservationDetails || '{}')
    }
  });

  // Update reservation status if applicable
  if (metadata.reservationId) {
    await mcpClient.executeTool('update_record', {
      table: 'reservations',
      id: metadata.reservationId,
      data: {
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentIntentId: paymentIntent.id
      }
    });
  }
}

async function handlePaymentFailure(mcpClient, paymentIntent) {
  const { customer, metadata } = paymentIntent;
  
  // Send failure notification
  await mcpClient.executeTool('send_email', {
    to: customer.email,
    subject: 'Payment Failed - BiteBase',
    template: 'payment_failed',
    data: {
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      restaurantId: metadata.restaurantId
    }
  });
}

async function handleSubscriptionCreated(mcpClient, subscription) {
  // Update user subscription status
  await mcpClient.executeTool('update_record', {
    table: 'users',
    id: subscription.customer,
    data: {
      subscriptionStatus: 'active',
      subscriptionId: subscription.id,
      planId: subscription.items.data[0].price.id
    }
  });
}

async function handleSubscriptionCanceled(mcpClient, subscription) {
  // Update user subscription status
  await mcpClient.executeTool('update_record', {
    table: 'users',
    id: subscription.customer,
    data: {
      subscriptionStatus: 'canceled',
      subscriptionCanceledAt: new Date().toISOString()
    }
  });
}