/**
 * Marketing Automation Service
 * Handles email campaigns, referrals, lead scoring, and growth hacking
 */

const sgMail = require('@sendgrid/mail');
const { Pool } = require('pg');
const crypto = require('crypto');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MarketingService {
  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Email templates
    this.templates = {
      welcome: {
        subject: 'Welcome to BiteBase Intelligence! 🍽️',
        templateId: 'd-welcome-template-id'
      },
      onboarding: {
        subject: 'Get started with BiteBase in 3 easy steps',
        templateId: 'd-onboarding-template-id'
      },
      trialExpiring: {
        subject: 'Your BiteBase trial expires in 3 days',
        templateId: 'd-trial-expiring-template-id'
      },
      upgrade: {
        subject: 'Unlock premium features with BiteBase Pro',
        templateId: 'd-upgrade-template-id'
      },
      referralInvite: {
        subject: 'Your friend invited you to BiteBase',
        templateId: 'd-referral-invite-template-id'
      },
      referralReward: {
        subject: 'You earned a reward! 🎉',
        templateId: 'd-referral-reward-template-id'
      }
    };
  }

  // Send welcome email sequence
  async sendWelcomeSequence(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) return false;

      // Send immediate welcome email
      await this.sendEmail(user.email, 'welcome', {
        firstName: user.display_name?.split(' ')[0] || 'there',
        dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
      });

      // Schedule onboarding emails
      await this.scheduleEmail(userId, 'onboarding', 1); // 1 day later
      await this.scheduleEmail(userId, 'upgrade', 7); // 7 days later

      return true;
    } catch (error) {
      console.error('Error sending welcome sequence:', error);
      return false;
    }
  }

  // Send email using template
  async sendEmail(to, templateType, dynamicData = {}) {
    try {
      const template = this.templates[templateType];
      if (!template) {
        throw new Error(`Template ${templateType} not found`);
      }

      const msg = {
        to,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: 'BiteBase Intelligence'
        },
        templateId: template.templateId,
        dynamicTemplateData: {
          ...dynamicData,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
          supportEmail: process.env.SENDGRID_FROM_EMAIL
        }
      };

      await sgMail.send(msg);

      // Log email sent
      await this.logEmailSent(to, templateType, 'sent');

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      await this.logEmailSent(to, templateType, 'failed', error.message);
      return false;
    }
  }

  // Schedule email for later delivery
  async scheduleEmail(userId, templateType, daysFromNow) {
    try {
      const sendAt = new Date();
      sendAt.setDate(sendAt.getDate() + daysFromNow);

      await this.db.query(`
        INSERT INTO scheduled_emails (user_id, template_type, send_at, status, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, templateType, sendAt, 'pending', new Date()]);

      return true;
    } catch (error) {
      console.error('Error scheduling email:', error);
      return false;
    }
  }

  // Process scheduled emails
  async processScheduledEmails() {
    try {
      const now = new Date();
      
      const result = await this.db.query(`
        SELECT se.*, u.email, u.display_name
        FROM scheduled_emails se
        JOIN users u ON se.user_id = u.id
        WHERE se.send_at <= $1 AND se.status = 'pending'
        ORDER BY se.send_at ASC
        LIMIT 100
      `, [now]);

      for (const email of result.rows) {
        const user = {
          email: email.email,
          display_name: email.display_name
        };

        const success = await this.sendEmail(user.email, email.template_type, {
          firstName: user.display_name?.split(' ')[0] || 'there'
        });

        // Update status
        await this.db.query(
          'UPDATE scheduled_emails SET status = $1, sent_at = $2 WHERE id = $3',
          [success ? 'sent' : 'failed', new Date(), email.id]
        );
      }

      return result.rows.length;
    } catch (error) {
      console.error('Error processing scheduled emails:', error);
      return 0;
    }
  }

  // Create referral program
  async createReferralCode(userId) {
    try {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      await this.db.query(`
        INSERT INTO referral_codes (user_id, code, created_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO UPDATE SET code = $2
      `, [userId, code, new Date()]);

      return code;
    } catch (error) {
      console.error('Error creating referral code:', error);
      return null;
    }
  }

  // Process referral signup
  async processReferral(referralCode, newUserId) {
    try {
      // Find referrer
      const referrerResult = await this.db.query(
        'SELECT user_id FROM referral_codes WHERE code = $1',
        [referralCode]
      );

      if (referrerResult.rows.length === 0) {
        return { success: false, reason: 'Invalid referral code' };
      }

      const referrerId = referrerResult.rows[0].user_id;

      // Create referral record
      await this.db.query(`
        INSERT INTO referrals (referrer_id, referred_id, status, created_at)
        VALUES ($1, $2, $3, $4)
      `, [referrerId, newUserId, 'pending', new Date()]);

      // Send notification to referrer
      const referrer = await this.getUserById(referrerId);
      if (referrer) {
        await this.sendEmail(referrer.email, 'referralReward', {
          firstName: referrer.display_name?.split(' ')[0] || 'there',
          reward: '$10 credit'
        });
      }

      return { success: true, referrerId };
    } catch (error) {
      console.error('Error processing referral:', error);
      return { success: false, reason: 'Processing error' };
    }
  }

  // Calculate lead score
  async calculateLeadScore(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) return 0;

      let score = 0;

      // Base score for signup
      score += 10;

      // Email verification
      if (user.email_verified) score += 15;

      // Profile completion
      const profileCompletion = await this.getProfileCompletion(userId);
      score += profileCompletion * 0.3; // Max 30 points

      // Activity score
      const activityScore = await this.getActivityScore(userId);
      score += activityScore * 0.4; // Max 40 points

      // Subscription status
      const subscription = await this.getUserSubscription(userId);
      if (subscription?.status === 'active') {
        score += 50;
      } else if (subscription?.status === 'trial') {
        score += 25;
      }

      // Engagement metrics
      const engagementScore = await this.getEngagementScore(userId);
      score += engagementScore * 0.2; // Max 20 points

      // Cap at 100
      score = Math.min(100, Math.round(score));

      // Update lead score in database
      await this.db.query(
        'UPDATE users SET lead_score = $1, lead_score_updated_at = $2 WHERE id = $3',
        [score, new Date(), userId]
      );

      return score;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      return 0;
    }
  }

  // Get profile completion percentage
  async getProfileCompletion(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) return 0;

      const fields = [
        'display_name',
        'company_name',
        'phone',
        'account_type'
      ];

      const completedFields = fields.filter(field => user[field] && user[field].trim() !== '');
      return (completedFields.length / fields.length) * 100;
    } catch (error) {
      console.error('Error getting profile completion:', error);
      return 0;
    }
  }

  // Get user activity score
  async getActivityScore(userId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.db.query(`
        SELECT 
          COUNT(*) as total_events,
          COUNT(DISTINCT DATE_TRUNC('day', created_at)) as active_days
        FROM user_events 
        WHERE user_id = $1 AND created_at >= $2
      `, [userId, thirtyDaysAgo]);

      const { total_events, active_days } = result.rows[0];
      
      // Score based on activity frequency and consistency
      const eventScore = Math.min(50, parseInt(total_events) * 0.5);
      const consistencyScore = Math.min(50, parseInt(active_days) * 2);
      
      return eventScore + consistencyScore;
    } catch (error) {
      console.error('Error getting activity score:', error);
      return 0;
    }
  }

  // Get user engagement score
  async getEngagementScore(userId) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const queries = {
        logins: `SELECT COUNT(*) as count FROM user_events WHERE user_id = $1 AND event_name = 'login' AND created_at >= $2`,
        aiUsage: `SELECT COUNT(*) as count FROM user_events WHERE user_id = $1 AND event_name = 'ai_request' AND created_at >= $2`,
        features: `SELECT COUNT(DISTINCT properties->>'feature') as count FROM user_events WHERE user_id = $1 AND created_at >= $2`
      };

      let score = 0;
      for (const [key, query] of Object.entries(queries)) {
        const result = await this.db.query(query, [userId, sevenDaysAgo]);
        const count = parseInt(result.rows[0].count);
        
        switch (key) {
          case 'logins':
            score += Math.min(30, count * 5);
            break;
          case 'aiUsage':
            score += Math.min(40, count * 2);
            break;
          case 'features':
            score += Math.min(30, count * 10);
            break;
        }
      }

      return score;
    } catch (error) {
      console.error('Error getting engagement score:', error);
      return 0;
    }
  }

  // Trigger behavior-based campaigns
  async triggerBehaviorCampaign(userId, trigger) {
    try {
      const user = await this.getUserById(userId);
      if (!user) return false;

      switch (trigger) {
        case 'trial_started':
          await this.scheduleEmail(userId, 'onboarding', 1);
          await this.scheduleEmail(userId, 'trialExpiring', 12); // 12 days into 14-day trial
          break;

        case 'feature_limit_reached':
          await this.sendEmail(user.email, 'upgrade', {
            firstName: user.display_name?.split(' ')[0] || 'there',
            feature: 'AI requests'
          });
          break;

        case 'inactive_7_days':
          await this.sendReEngagementEmail(userId);
          break;

        case 'subscription_cancelled':
          await this.sendWinBackEmail(userId);
          break;
      }

      return true;
    } catch (error) {
      console.error('Error triggering behavior campaign:', error);
      return false;
    }
  }

  // Helper methods
  async getUserById(userId) {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  }

  async getUserSubscription(userId) {
    const result = await this.db.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0] || null;
  }

  async logEmailSent(email, templateType, status, error = null) {
    await this.db.query(`
      INSERT INTO email_logs (email, template_type, status, error_message, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [email, templateType, status, error, new Date()]);
  }

  async sendReEngagementEmail(userId) {
    const user = await this.getUserById(userId);
    if (!user) return;

    await this.sendEmail(user.email, 'reengagement', {
      firstName: user.display_name?.split(' ')[0] || 'there',
      lastLogin: user.last_login
    });
  }

  async sendWinBackEmail(userId) {
    const user = await this.getUserById(userId);
    if (!user) return;

    await this.sendEmail(user.email, 'winback', {
      firstName: user.display_name?.split(' ')[0] || 'there',
      specialOffer: '50% off for 3 months'
    });
  }
}

module.exports = MarketingService;
