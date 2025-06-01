"use client"

import { useState } from "react"
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import { Check, Crown, Star, Zap, ArrowRight, Building2, X } from "lucide-react"
import BiteBaseLogo from "../../components/BiteBaseLogo"
import Image from "next/image"

interface PricingPlan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  period: string
  description: string
  features: string[]
  notIncluded?: string[]
  popular?: boolean
  icon: string
  iconImage?: string
  stripePriceId: string
  buttonText: string
  buttonStyle: string
}

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      period: "month",
      description: "Basic analytics and insights for small businesses just getting started",
      stripePriceId: "price_free",

      icon: "🚀",
      iconImage: "/subscription/free.png",
      buttonText: "Get Started",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      features: [
        "Sales overview, peak hours",
        "Limited trade area view",
        "Monitor & receive alerts"
      ],
      notIncluded: [
        "Advanced analytics",
        "Competitor tracking",
        "AI insights & recommendations"
      ]
    },
    {
      id: "growth",
      name: "Growth",
      price: 49,
      yearlyPrice: 39,
      period: "month",
      description: "For independent restaurants looking to optimize operations",
      stripePriceId: "price_growth_monthly",
      icon: "📈",
      iconImage: "/subscription/growth.png",
      buttonText: "Subscribe Now",
      buttonStyle: "bg-green-600 text-white hover:bg-green-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl",
      features: [
        "Analytics Overview Dashboard",
        "Local Market Snapshot (Limited)",
        "Review Monitoring (Google & Yelp)",
        "Track up to 5 competitors",
        "Monthly AI business reports",
        "3-month data history"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: 109,
      yearlyPrice: 87,
      period: "month",
      description: "Ideal for restaurants expanding to multiple locations",
      stripePriceId: "price_pro_monthly",
      icon: "⭐",
      iconImage: "/subscription/pro.png",
      buttonText: "Choose Pro",
      buttonStyle: "bg-green-600 text-white hover:bg-green-700 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl",
      popular: true,
      features: [
        "Advanced Analytics Dashboard",
        "Extended Market Analysis",
        "Full Review Suite Integration",
        "Track up to 15 competitors",
        "Weekly AI strategy recommendations",
        "1-year data history retention"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 599,
      yearlyPrice: 479,
      period: "month",
      description: "For chains, franchises, and restaurant groups",
      stripePriceId: "price_enterprise_monthly",
      icon: "👑",
      iconImage: "/subscription/enterprise.png",
      buttonText: "Contact Sales",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      features: [
        "Enterprise Analytics Dashboard",
        "AI-powered Sales Forecasting",
        "Custom Market Research Reports",
        "Track up to 50 competitors",
        "API Access & Business Intelligence",
        "Unlimited historical data"
      ]
    }
  ]

  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan.id)
    setIsLoading(true)

    try {
      // Simulate Stripe integration
      console.log(`Redirecting to Stripe for plan: ${plan.stripePriceId}`)

      setTimeout(() => {
        setIsLoading(false)
        if (plan.id === 'free') {
          window.location.href = '/restaurant-setup'
        } else if (plan.id === 'enterprise') {
          window.location.href = '/franchise'
        } else {
          window.location.href = '/restaurant-setup'
        }
      }, 2000)

    } catch (error) {
      console.error('Payment failed:', error)
      setIsLoading(false)
    }
  }

  const getCurrentPrice = (plan: PricingPlan) => {
    return billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-100 rounded-full opacity-10 animate-spin-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full opacity-10 animate-spin-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-green-300 rounded-full opacity-15 animate-bounce-slow"></div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="animate-fadeInUp">
              <BiteBaseLogo size="sm" className="hover:scale-105 transition-transform" />
            </div>
            <a href="/auth" className="nav-link-inactive transition-all duration-300 hover:-translate-y-0.5 animate-fadeInUp delay-100">
              ← Back to Registration
            </a>
          </div>
        </div>
      </div>

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fadeInUp">
            <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-500 font-semibold mb-4 hover:rotate-3 transition-transform animate-pulse">
              Pricing Plans
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your <span className="text-green-600">Plan</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a plan that fits your needs and start building with BiteBase today!
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12 animate-fadeInUp delay-200">
            <div className="inline-flex rounded-md shadow-lg relative">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`relative px-8 py-3 font-semibold transition-all duration-300 ${
                  billingPeriod === 'monthly'
                    ? 'btn-tool-active shadow-lg'
                    : 'btn-tool-inactive'
                } border rounded-l-lg`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`relative px-8 py-3 font-semibold transition-all duration-300 ${
                  billingPeriod === 'yearly'
                    ? 'btn-tool-active shadow-lg'
                    : 'btn-tool-inactive'
                } border-t border-r border-b rounded-r-lg`}
              >
                Yearly
                {billingPeriod === 'yearly' && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    Save 20%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:rotate-1 ${
                  plan.popular
                    ? 'transform scale-105 border-2 border-green-500 z-10 shadow-green-500/25'
                    : 'border border-gray-200'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      {plan.iconImage ? (
                        <div className="w-16 h-16 relative">
                          <Image
                            src={plan.iconImage}
                            alt={`${plan.name} plan`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl">{plan.icon}</div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="text-3xl font-extrabold text-gray-900">
                      US${getCurrentPrice(plan)}
                      <span className="text-lg font-normal text-gray-600 ml-1">
                        per {plan.period}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && plan.price > 0 && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save ${(plan.price - plan.yearlyPrice) * 12}/year
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((feature, featureIndex) => (
                      <li key={`not-${featureIndex}`} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isLoading && selectedPlan === plan.id}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                  >
                    {isLoading && selectedPlan === plan.id ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Franchise Option */}
          <div className="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need a Franchise Solution?
              </h2>
              <p className="text-gray-600 mb-6">
                Managing multiple restaurant locations or franchise operations?
                Our enterprise team will create a custom solution tailored to your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="btn-primary px-6 py-3 rounded-lg transition-all duration-300"
                  onClick={() => window.location.href = '/franchise'}
                >
                  Contact Franchise Team
                </button>
                <button
                  className="btn-secondary px-6 py-3 rounded-lg transition-all duration-300"
                  onClick={() => window.location.href = '/demo'}
                >
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              All Plans Include
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Advanced machine learning algorithms analyze market trends and opportunities
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Data</h3>
                <p className="text-gray-600 text-sm">
                  Live market data and competitor insights updated continuously
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-600 text-sm">
                  Dedicated support team with restaurant industry expertise
                </p>
              </div>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>🔒 Secure payment processing by Stripe • 30-day money-back guarantee • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}
