"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, Star, Zap, Crown, Building } from "lucide-react";
import Image from "next/image";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  icon: string;
  featured?: boolean;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
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
      "Sales overview, peak hours",
      "Limited trade area view", 
      "Monitor & receive alerts",
      "Advanced analytics",
      "Competitor tracking",
      "AI insights & recommendations"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    id: "growth",
    name: "Growth",
    description: "For independent restaurants looking to optimize operations",
    price: 14.99,
    period: "per month",
    icon: "/branding/subscription/growth.png",
    features: [
      "Analytics Overview Dashboard",
      "Local Market Snapshot (Limited)",
      "Review Monitoring (Google & Yelp)",
      "Track up to 5 competitors",
      "Monthly AI business reports",
      "3-month data history"
    ],
    buttonText: "Subscribe Now",
    buttonVariant: "default"
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
      "Advanced Analytics Dashboard",
      "Extended Market Analysis",
      "Full Review Suite Integration",
      "Track up to 15 competitors",
      "Weekly AI strategy recommendations",
      "1-year data history retention"
    ],
    buttonText: "Choose Pro",
    buttonVariant: "default"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For chains, franchises, and restaurant groups",
    price: 599,
    period: "per month",
    icon: "/branding/subscription/enterprise.png",
    features: [
      "Enterprise Analytics Dashboard",
      "AI-powered Sales Forecasting",
      "Custom Market Research Reports",
      "Track up to 50 competitors",
      "API Access & Business Intelligence",
      "Unlimited historical data"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary"
  }
];

export default function PricingCards() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const getIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <Star className="h-8 w-8 text-neutral-500" />;
      case "growth":
        return <Zap className="h-8 w-8 text-primary-500" />;
      case "pro":
        return <Crown className="h-8 w-8 text-accent-saffron-500" />;
      case "enterprise":
        return <Building className="h-8 w-8 text-accent-red-500" />;
      default:
        return <Star className="h-8 w-8 text-neutral-500" />;
    }
  };

  const getPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return "US$0";
    const price = billingPeriod === "yearly" ? plan.price * 12 * 0.8 : plan.price;
    return `US$${price.toFixed(2)}`;
  };

  const getPeriod = () => {
    return billingPeriod === "yearly" ? "per year" : "per month";
  };

  return (
    <div className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 font-display mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Select a plan that fits your needs and start building with BiteBase today!
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-lg p-1 border border-neutral-200">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === "yearly"
                    ? "bg-primary-500 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Yearly
                <Badge className="ml-2 bg-accent-saffron-100 text-accent-saffron-800 text-xs">
                  Save 20%
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`pricing-card relative ${
                plan.featured ? "featured border-primary-500 shadow-xl" : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getIcon(plan.id)}
                </div>
                <CardTitle className="text-2xl font-bold text-neutral-900 font-display">
                  {plan.name}
                </CardTitle>
                <p className="text-neutral-600 text-sm mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="pricing-price">
                    {getPrice(plan)}
                  </div>
                  <p className="text-neutral-500 text-sm">{getPeriod()}</p>
                </div>

                {/* Features */}
                <ul className="pricing-features space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.featured
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : plan.buttonVariant === "outline"
                      ? "border-primary-300 text-primary-600 hover:bg-primary-50"
                      : plan.buttonVariant === "secondary"
                      ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                      : "bg-primary-500 hover:bg-primary-600 text-white"
                  }`}
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 text-sm">
            All plans include 24/7 support and a 30-day money-back guarantee.
          </p>
          <p className="text-neutral-500 text-xs mt-2">
            Prices shown in USD. Taxes may apply.
          </p>
        </div>
      </div>
    </div>
  );
}