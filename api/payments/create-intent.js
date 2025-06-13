/**
 * Payment Intent Creation API using MCP
 */

import { getMCPClient } from '../lib/mcp-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mcpClient = getMCPClient();
    const { 
      amount,
      currency = 'usd',
      customerId,
      restaurantId,
      reservationDetails,
      metadata = {}
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Valid amount is required'
      });
    }

    // Create payment intent via MCP
    const paymentResult = await mcpClient.executeTool('create_payment_intent', {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customerId,
      metadata: {
        ...metadata,
        restaurantId,
        reservationDetails: JSON.stringify(reservationDetails),
        timestamp: new Date().toISOString()
      }
    });

    if (!paymentResult.success) {
      return res.status(500).json({
        error: 'Payment intent creation failed',
        details: paymentResult.error
      });
    }

    // Track payment intent creation
    await mcpClient.executeTool('track_event', {
      userId: req.headers['x-user-id'] || customerId || 'anonymous',
      event: 'payment_intent_created',
      properties: {
        amount,
        currency,
        restaurantId,
        hasReservation: !!reservationDetails,
        paymentIntentId: paymentResult.data.id
      },
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentResult.data.client_secret,
        paymentIntentId: paymentResult.data.id,
        amount,
        currency,
        status: paymentResult.data.status,
        meta: {
          timestamp: new Date().toISOString(),
          via: 'mcp-payment',
          restaurantId
        }
      }
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}