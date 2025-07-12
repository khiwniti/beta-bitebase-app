"use client";

import { useState } from "react";
import Image from "next/image";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  icon: string;
  featured?: boolean;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  buttonText: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic analytics and insights for small businesses just getting started",
    price: 0,
    period: "per month",
    icon: "/branding/subscription/free.png",
    features: [
      { text: "Sales overview, peak hours", included: true },
      { text: "Limited trade area view", included: true },
      { text: "Monitor & receive alerts", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Competitor tracking", included: false },
      { text: "AI insights & recommendations", included: false }
    ],
    buttonText: "Get Started"
  },
  {
    id: "growth",
    name: "Growth",
    description: "For independent restaurants looking to optimize operations",
    price: 14.99,
    period: "per month",
    icon: "/branding/subscription/growth.png",
    features: [
      { text: "Analytics Overview Dashboard", included: true },
      { text: "Local Market Snapshot (Limited)", included: true },
      { text: "Review Monitoring (Google & Yelp)", included: true },
      { text: "Track up to 5 competitors", included: true },
      { text: "Monthly AI business reports", included: true },
      { text: "3-month data history", included: true }
    ],
    buttonText: "Subscribe Now"
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for restaurants expanding to multiple locations",
    price: 109,
    period: "per month",
    icon: "/branding/subscription/pro.png",
    featured: true,
    features: [
      { text: "Advanced Analytics Dashboard", included: true },
      { text: "Extended Market Analysis", included: true },
      { text: "Full Review Suite Integration", included: true },
      { text: "Track up to 15 competitors", included: true },
      { text: "Weekly AI strategy recommendations", included: true },
      { text: "1-year data history retention", included: true }
    ],
    buttonText: "Choose Pro"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large restaurant chains and enterprise customers",
    price: 599,
    period: "per month",
    icon: "/branding/subscription/enterprise.png",
    features: [
      { text: "Enterprise Analytics Dashboard", included: true },
      { text: "AI-powered Sales Forecasting", included: true },
      { text: "Custom Market Research Reports", included: true },
      { text: "Track up to 50 competitors", included: true },
      { text: "API Access & Business Intelligence", included: true },
      { text: "Unlimited historical data", included: true }
    ],
    buttonText: "Contact Sales"
  }
];

export default function OfficialPricingCards() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="section bordered-section" id="pricing-section">
      <div className="container">
        <div className="text-center mb-xl">
          <span className="badge badge-outline badge-accent mb-sm">Pricing Plans</span>
          <h2>Choose Your Plan</h2>
          <p className="text-lead mx-auto" style={{ maxWidth: '600px' }}>
            Select a plan that fits your needs and start building with BiteBase today!
          </p>
        </div>
        
        <div className="flex justify-center mb-8" style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <button 
            className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '8px 16px',
              border: billingPeriod === 'monthly' ? '2px solid var(--accent-color)' : '1px solid #ccc',
              background: billingPeriod === 'monthly' ? 'var(--accent-color)' : 'transparent',
              color: billingPeriod === 'monthly' ? 'white' : '#333',
              borderRadius: '8px 0 0 8px',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            Monthly
          </button>
          <button 
            className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingPeriod('yearly')}
            style={{
              padding: '8px 16px',
              border: billingPeriod === 'yearly' ? '2px solid var(--accent-color)' : '1px solid #ccc',
              background: billingPeriod === 'yearly' ? 'var(--accent-color)' : 'transparent',
              color: billingPeriod === 'yearly' ? 'white' : '#333',
              borderRadius: '0 8px 8px 0',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              position: 'relative'
            }}
          >
            Yearly
            <span 
              className="pricing-save"
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--contrast-color)',
                color: '#333',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}
            >
              Save 20%
            </span>
          </button>
        </div>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-card translucent-card ${plan.featured ? 'popular' : ''}`}
              style={{
                position: 'relative',
                ...(plan.featured && {
                  transform: 'scale(1.05)',
                  border: '2px solid var(--accent-color)',
                  zIndex: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                })
              }}
            >
              {plan.featured && (
                <div className="popular-tag">
                  Most Popular
                </div>
              )}
              
              <div className="pricing-header">
                <div 
                  className="plan-icon"
                  style={{ 
                    fontSize: '3rem', 
                    color: 'var(--accent-color)', 
                    marginBottom: 'var(--spacing-sm)',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <i className={`fas ${
                    plan.id === 'free' ? 'fa-seedling' :
                    plan.id === 'growth' ? 'fa-chart-line' :
                    plan.id === 'pro' ? 'fa-crown' :
                    'fa-building'
                  }`}></i>
                </div>
                <h2 className="price" style={{ fontSize: '1.5rem', margin: '8px 0' }}>{plan.name}</h2>
                <div className="pricing-description">{plan.description}</div>
              </div>
              
              <p className="price" style={plan.featured ? { fontSize: '1.2em', fontWeight: 'bold' } : {}}>
                US${billingPeriod === 'yearly' ? (plan.price * 12 * 0.8).toFixed(2) : plan.price} 
                <span className="price-period"> {plan.period}</span>
              </p>
              
              <ul className="pricing-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <i 
                      className={`fas ${feature.included ? 'fa-check-circle' : 'fa-times-circle'}`}
                      style={{ 
                        color: feature.included 
                          ? (plan.featured ? 'var(--accent-color)' : 'var(--accent-color)') 
                          : '#ccc' 
                      }}
                    ></i>
                    <span style={{ color: feature.included ? '#333' : '#999' }}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                className="button button-lg"
                style={plan.featured ? {
                  background: 'var(--accent-color)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(116, 195, 101, 0.4)',
                  transition: 'all 0.3s ease'
                } : {}}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}