/**
 * Subscription Management Service
 * Handles billing, plan management, and subscription lifecycle
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Pool } = require('pg');

class SubscriptionService {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Subscription plans configuration
    this.plans = {
      starter: {
        id: 'starter',
        name: 'Starter',
        price: 29,
        interval: 'month',
        features: {
          restaurants: 100,
          aiRequests: 1000,
          analytics: 'basic',
          support: 'email',
          apiCalls: 10000
        },
        stripePriceId: process.env.STRIPE_STARTER_PRICE_ID
      },
      professional: {
        id: 'professional',
        name: 'Professional',
        price: 99,
        interval: 'month',
        features: {
          restaurants: 1000,
          aiRequests: 10000,
          analytics: 'advanced',
          support: 'priority',
          apiCalls: 100000,
          whiteLabel: true
        },
        stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 299,
        interval: 'month',
        features: {
          restaurants: 'unlimited',
          aiRequests: 'unlimited',
          analytics: 'premium',
          support: 'dedicated',
          apiCalls: 'unlimited',
          whiteLabel: true,
          sso: true,
          customIntegrations: true
        },
        stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID
      }
    };
  }

  // Create a new subscription
  async createSubscription(userId, planId, paymentMethodId) {
    try {
      // Get user details
      const userResult = await this.db.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = userResult.rows[0];
      
      if (!user) {
        throw new Error('User not found');
      }

      const plan = this.plans[planId];
      if (!plan) {
        throw new Error('Invalid plan');
      }

      // Create or get Stripe customer
      let stripeCustomer;
      if (user.stripe_customer_id) {
        stripeCustomer = await stripe.customers.retrieve(user.stripe_customer_id);
      } else {
        stripeCustomer = await stripe.customers.create({
          email: user.email,
          name: user.display_name,
          metadata: {
            userId: userId.toString()
          }
        });

        // Update user with Stripe customer ID
        await this.db.query(
          'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
          [stripeCustomer.id, userId]
        );
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomer.id,
      });

      // Set as default payment method
      await stripe.customers.update(stripeCustomer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create Stripe subscription
      const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: plan.stripePriceId }],
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent'],
      });

      // Save subscription to database
      const subscriptionData = {
        user_id: userId,
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: stripeCustomer.id,
        plan_id: planId,
        plan_name: plan.name,
        status: stripeSubscription.status,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000),
        amount: plan.price,
        currency: 'usd',
        billing_cycle: plan.interval,
        features: JSON.stringify(plan.features),
        created_at: new Date(),
        updated_at: new Date()
      };

      await this.db.query(`
        INSERT INTO subscriptions 
        (user_id, stripe_subscription_id, stripe_customer_id, plan_id, plan_name, 
         status, current_period_start, current_period_end, amount, currency, 
         billing_cycle, features, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, Object.values(subscriptionData));

      return {
        subscription: stripeSubscription,
        plan: plan,
        status: 'success'
      };

    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Update subscription plan
  async updateSubscription(userId, newPlanId) {
    try {
      // Get current subscription
      const subResult = await this.db.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
        [userId, 'active']
      );
      
      const currentSub = subResult.rows[0];
      if (!currentSub) {
        throw new Error('No active subscription found');
      }

      const newPlan = this.plans[newPlanId];
      if (!newPlan) {
        throw new Error('Invalid plan');
      }

      // Update Stripe subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(currentSub.stripe_subscription_id);
      
      const updatedSubscription = await stripe.subscriptions.update(currentSub.stripe_subscription_id, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPlan.stripePriceId,
        }],
        proration_behavior: 'create_prorations',
      });

      // Update database
      await this.db.query(`
        UPDATE subscriptions 
        SET plan_id = $1, plan_name = $2, amount = $3, features = $4, updated_at = $5
        WHERE user_id = $6 AND status = 'active'
      `, [newPlanId, newPlan.name, newPlan.price, JSON.stringify(newPlan.features), new Date(), userId]);

      return {
        subscription: updatedSubscription,
        plan: newPlan,
        status: 'success'
      };

    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(userId, cancelAtPeriodEnd = true) {
    try {
      const subResult = await this.db.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
        [userId, 'active']
      );
      
      const subscription = subResult.rows[0];
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Cancel in Stripe
      const stripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: cancelAtPeriodEnd
      });

      // Update database
      const newStatus = cancelAtPeriodEnd ? 'cancel_at_period_end' : 'cancelled';
      await this.db.query(
        'UPDATE subscriptions SET status = $1, updated_at = $2 WHERE user_id = $3 AND status = $4',
        [newStatus, new Date(), userId, 'active']
      );

      return {
        subscription: stripeSubscription,
        status: 'success',
        message: cancelAtPeriodEnd ? 'Subscription will cancel at period end' : 'Subscription cancelled immediately'
      };

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Get user's subscription details
  async getUserSubscription(userId) {
    try {
      const result = await this.db.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
      
      const subscription = result.rows[0];
      if (!subscription) {
        return null;
      }

      // Get usage statistics
      const usage = await this.getUsageStatistics(userId);
      
      return {
        ...subscription,
        features: JSON.parse(subscription.features),
        usage: usage,
        plan: this.plans[subscription.plan_id]
      };

    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }

  // Get usage statistics for a user
  async getUsageStatistics(userId) {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const queries = {
        aiRequests: `
          SELECT COUNT(*) as count 
          FROM user_events 
          WHERE user_id = $1 AND event_name = 'ai_request' AND created_at >= $2
        `,
        apiCalls: `
          SELECT COUNT(*) as count 
          FROM user_events 
          WHERE user_id = $1 AND event_name = 'api_call' AND created_at >= $2
        `,
        restaurantsAdded: `
          SELECT COUNT(*) as count 
          FROM restaurants 
          WHERE created_by = $1 AND created_at >= $2
        `
      };

      const usage = {};
      for (const [key, query] of Object.entries(queries)) {
        const result = await this.db.query(query, [userId, currentMonth]);
        usage[key] = parseInt(result.rows[0].count);
      }

      return usage;

    } catch (error) {
      console.error('Error getting usage statistics:', error);
      return {};
    }
  }

  // Check if user has access to a feature
  async hasFeatureAccess(userId, feature) {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      const features = subscription.features;
      return features[feature] !== undefined && features[feature] !== false;

    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  // Check usage limits
  async checkUsageLimit(userId, feature) {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription || subscription.status !== 'active') {
        return { allowed: false, reason: 'No active subscription' };
      }

      const features = subscription.features;
      const usage = subscription.usage;
      
      const limit = features[feature];
      const currentUsage = usage[feature] || 0;

      if (limit === 'unlimited') {
        return { allowed: true, unlimited: true };
      }

      if (typeof limit === 'number' && currentUsage >= limit) {
        return { 
          allowed: false, 
          reason: 'Usage limit exceeded',
          limit: limit,
          current: currentUsage
        };
      }

      return { 
        allowed: true, 
        limit: limit,
        current: currentUsage,
        remaining: limit - currentUsage
      };

    } catch (error) {
      console.error('Error checking usage limit:', error);
      return { allowed: false, reason: 'Error checking limits' };
    }
  }

  // Handle Stripe webhooks
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };

    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Webhook handlers
  async handlePaymentSucceeded(invoice) {
    const subscriptionId = invoice.subscription;
    await this.db.query(
      'UPDATE subscriptions SET status = $1, updated_at = $2 WHERE stripe_subscription_id = $3',
      ['active', new Date(), subscriptionId]
    );
  }

  async handlePaymentFailed(invoice) {
    const subscriptionId = invoice.subscription;
    await this.db.query(
      'UPDATE subscriptions SET status = $1, updated_at = $2 WHERE stripe_subscription_id = $3',
      ['past_due', new Date(), subscriptionId]
    );
  }

  async handleSubscriptionUpdated(subscription) {
    await this.db.query(
      'UPDATE subscriptions SET status = $1, current_period_end = $2, updated_at = $3 WHERE stripe_subscription_id = $4',
      [subscription.status, new Date(subscription.current_period_end * 1000), new Date(), subscription.id]
    );
  }

  async handleSubscriptionDeleted(subscription) {
    await this.db.query(
      'UPDATE subscriptions SET status = $1, updated_at = $2 WHERE stripe_subscription_id = $3',
      ['cancelled', new Date(), subscription.id]
    );
  }
}

module.exports = SubscriptionService;
