"use client";

import { useState } from "react";
import Link from "next/link";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  icon: string;
  featured?: boolean;
  theme: 'starter' | 'growth' | 'professional' | 'enterprise';
  features: Array<{
    text: string;
    included: boolean;
  }>;
  buttonText: string;
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Starter",
    description: "Perfect for new restaurants testing the waters",
    price: 0,
    period: "per month",
    icon: "fa-seedling",
    theme: 'starter',
    features: [
      { text: "Basic sales overview & peak hours", included: true },
      { text: "Limited trade area insights", included: true },
      { text: "Basic alerts & notifications", included: true },
      { text: "Advanced analytics dashboard", included: false },
      { text: "Competitor tracking", included: false },
      { text: "AI insights & recommendations", included: false }
    ],
    buttonText: "Start Free",
    badge: "Free Forever"
  },
  {
    id: "growth",
    name: "Growth",
    description: "For ambitious restaurants ready to scale",
    price: 14.99,
    period: "per month",
    icon: "fa-chart-line",
    theme: 'growth',
    features: [
      { text: "Complete analytics dashboard", included: true },
      { text: "Local market insights", included: true },
      { text: "Review monitoring (Google & Yelp)", included: true },
      { text: "Track up to 5 competitors", included: true },
      { text: "Monthly AI business reports", included: true },
      { text: "3-month data history", included: true }
    ],
    buttonText: "Choose Growth",
    badge: "Most Popular"
  },
  {
    id: "pro",
    name: "Professional",
    description: "For established restaurants expanding operations",
    price: 109,
    period: "per month",
    icon: "fa-crown",
    theme: 'professional',
    featured: true,
    features: [
      { text: "Advanced analytics & forecasting", included: true },
      { text: "Extended market analysis", included: true },
      { text: "Full review suite integration", included: true },
      { text: "Track up to 15 competitors", included: true },
      { text: "Weekly AI strategy recommendations", included: true },
      { text: "1-year data history retention", included: true }
    ],
    buttonText: "Go Professional",
    badge: "Best Value"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For restaurant chains and large operations",
    price: 599,
    period: "per month",
    icon: "fa-building",
    theme: 'enterprise',
    features: [
      { text: "Enterprise analytics dashboard", included: true },
      { text: "AI-powered sales forecasting", included: true },
      { text: "Custom market research reports", included: true },
      { text: "Track unlimited competitors", included: true },
      { text: "API access & business intelligence", included: true },
      { text: "Unlimited historical data", included: true }
    ],
    buttonText: "Contact Sales",
    badge: "Custom Solutions"
  }
];

const themeStyles = {
  starter: {
    gradient: 'linear-gradient(135deg, #e8f5e8, #f0f9f0)',
    borderColor: '#4ade80',
    accentColor: '#22c55e',
    buttonGradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    shadowColor: 'rgba(34, 197, 94, 0.2)',
    badgeColor: '#dcfce7',
    badgeText: '#166534'
  },
  growth: {
    gradient: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
    borderColor: '#3b82f6',
    accentColor: '#2563eb',
    buttonGradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    shadowColor: 'rgba(37, 99, 235, 0.2)',
    badgeColor: '#fbbf24',
    badgeText: '#92400e'
  },
  professional: {
    gradient: 'linear-gradient(135deg, #fdf4ff, #faf5ff)',
    borderColor: '#a855f7',
    accentColor: '#9333ea',
    buttonGradient: 'linear-gradient(135deg, #9333ea, #7c3aed)',
    shadowColor: 'rgba(147, 51, 234, 0.3)',
    badgeColor: '#a855f7',
    badgeText: '#ffffff'
  },
  enterprise: {
    gradient: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    borderColor: '#64748b',
    accentColor: '#475569',
    buttonGradient: 'linear-gradient(135deg, #475569, #334155)',
    shadowColor: 'rgba(71, 85, 105, 0.2)',
    badgeColor: '#1e293b',
    badgeText: '#ffffff'
  }
};

export default function EnhancedPricingCards() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'yearly' ? (price * 12 * 0.8).toFixed(2) : price.toString();
  };

  return (
    <section className="section" id="pricing-section" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '80px 0'
    }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div className="text-center mb-xl" style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #74c363, #5fa854)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(116, 195, 99, 0.3)'
          }}>
            💰 Pricing Plans
          </div>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #1e293b, #475569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Choose Your Success Plan
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#64748b', 
            maxWidth: '700px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Transform your restaurant with AI-powered insights. Start free and scale as you grow.
          </p>
        </div>
        
        {/* Billing Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '60px' 
        }}>
          <div style={{
            background: 'white',
            borderRadius: '50px',
            padding: '6px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <button 
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '12px 24px',
                borderRadius: '25px',
                border: 'none',
                background: billingPeriod === 'monthly' 
                  ? 'linear-gradient(135deg, #74c363, #5fa854)' 
                  : 'transparent',
                color: billingPeriod === 'monthly' ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '16px'
              }}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod('yearly')}
              style={{
                padding: '12px 24px',
                borderRadius: '25px',
                border: 'none',
                background: billingPeriod === 'yearly' 
                  ? 'linear-gradient(135deg, #74c363, #5fa854)' 
                  : 'transparent',
                color: billingPeriod === 'yearly' ? 'white' : '#64748b',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '16px',
                position: 'relative'
              }}
            >
              Yearly
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#fbbf24',
                color: '#92400e',
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          maxWidth: '1300px',
          margin: '0 auto'
        }}>
          {pricingPlans.map((plan) => {
            const theme = themeStyles[plan.theme];
            return (
              <div 
                key={plan.id}
                style={{
                  background: theme.gradient,
                  borderRadius: '24px',
                  padding: '40px 30px',
                  border: `2px solid ${theme.borderColor}`,
                  boxShadow: plan.featured 
                    ? `0 20px 40px ${theme.shadowColor}, 0 0 0 1px ${theme.borderColor}` 
                    : `0 10px 30px ${theme.shadowColor}`,
                  transform: plan.featured ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = plan.featured ? 'scale(1.08)' : 'scale(1.03)';
                  e.currentTarget.style.boxShadow = `0 25px 50px ${theme.shadowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = plan.featured ? 'scale(1.05)' : 'scale(1)';
                  e.currentTarget.style.boxShadow = plan.featured 
                    ? `0 20px 40px ${theme.shadowColor}` 
                    : `0 10px 30px ${theme.shadowColor}`;
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: theme.badgeColor,
                    color: theme.badgeText,
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {plan.badge}
                  </div>
                )}
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{
                    fontSize: '3rem',
                    color: theme.accentColor,
                    marginBottom: '15px'
                  }}>
                    <i className={`fas ${plan.icon}`}></i>
                  </div>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '10px'
                  }}>
                    {plan.name}
                  </h3>
                  <p style={{
                    color: '#64748b',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {plan.description}
                  </p>
                </div>
                
                {/* Price */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    color: theme.accentColor,
                    lineHeight: '1'
                  }}>
                    ${getDiscountedPrice(plan.price)}
                    <span style={{
                      fontSize: '1rem',
                      color: '#64748b',
                      fontWeight: '500'
                    }}>
                      /{billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <div style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginTop: '5px'
                    }}>
                      <span style={{ textDecoration: 'line-through' }}>
                        ${(plan.price * 12).toFixed(2)}/year
                      </span>
                      <span style={{ color: '#22c55e', fontWeight: '600', marginLeft: '8px' }}>
                        Save ${((plan.price * 12) - (plan.price * 12 * 0.8)).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Features */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  marginBottom: '30px'
                }}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      fontSize: '14px'
                    }}>
                      <i 
                        className={`fas ${feature.included ? 'fa-check-circle' : 'fa-times-circle'}`}
                        style={{
                          color: feature.included ? theme.accentColor : '#cbd5e1',
                          marginRight: '12px',
                          fontSize: '16px'
                        }}
                      ></i>
                      <span style={{
                        color: feature.included ? '#1e293b' : '#94a3b8',
                        fontWeight: feature.included ? '500' : '400'
                      }}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* Button */}
                <Link href="/dashboard">
                  <button style={{
                    width: '100%',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: 'none',
                    background: theme.buttonGradient,
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 8px 20px ${theme.shadowColor}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 25px ${theme.shadowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${theme.shadowColor}`;
                  }}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(116, 195, 99, 0.1), rgba(95, 168, 84, 0.1))',
          borderRadius: '20px',
          border: '1px solid rgba(116, 195, 99, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '10px'
          }}>
            🚀 Ready to Transform Your Restaurant?
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '20px'
          }}>
            Join thousands of successful restaurants using BiteBase
          </p>
          <Link href="/dashboard">
            <button style={{
              padding: '12px 30px',
              borderRadius: '25px',
              border: 'none',
              background: 'linear-gradient(135deg, #74c363, #5fa854)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(116, 195, 99, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(116, 195, 99, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(116, 195, 99, 0.3)';
            }}
            >
              Start Your Free Trial Today
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}