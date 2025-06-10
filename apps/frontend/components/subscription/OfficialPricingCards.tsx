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
    <div className="w-full">
      {/* Billing Period Toggle */}
        
      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button 
            className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
              billingPeriod === 'monthly' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`px-6 py-3 rounded-md font-medium transition-all duration-300 relative ${
              billingPeriod === 'yearly' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'text-gray-600 hover:text-primary-600'
            }`}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-accent-saffron-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary-300 ${
                plan.featured 
                  ? 'scale-105 border-primary-500 shadow-lg z-10' 
                  : 'hover:rotate-1'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <Image
                    src={plan.icon}
                    alt={`${plan.name} plan icon`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold text-gray-900 ${plan.featured ? 'text-primary-600' : ''}`}>
                  ${billingPeriod === 'yearly' ? (plan.price * 12 * 0.8).toFixed(2) : plan.price}
                </div>
                <div className="text-gray-500 text-sm">{plan.period}</div>
                {billingPeriod === 'yearly' && plan.price > 0 && (
                  <div className="text-xs text-accent-saffron-600 font-semibold mt-1">
                    Save ${((plan.price * 12) - (plan.price * 12 * 0.8)).toFixed(2)}/year
                  </div>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                      feature.included 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {feature.included ? '✓' : '✕'}
                    </div>
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  plan.featured
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:from-primary-700 hover:to-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
    </div>
  );
}