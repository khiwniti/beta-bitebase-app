import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  icon: string;
  iconImage?: string;
  stripePriceId: string;
  buttonText: string;
  buttonVariant: "default" | "outline" | "subtle" | "ghost";
}

interface PricingPlansProps {
  onSelectPlan: (plan: PricingPlan) => void;
  selectedPlan?: string;
  isLoading?: boolean;
}

export default function PricingPlans({ 
  onSelectPlan, 
  selectedPlan,
  isLoading = false 
}: PricingPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Basic analytics and insights for small businesses just getting started",
      stripePriceId: "price_free",
      icon: "🚀",
      iconImage: "/branding/subscription/free.png",
      buttonText: "Get Started",
      buttonVariant: "outline",
      features: [
        "Basic restaurant dashboard",
        "Sales overview analytics",
        "Peak hours identification",
        "Limited trade area view",
        "Basic monitoring alerts"
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
      description: "For independent restaurants looking to optimize operations",
      stripePriceId: billingPeriod === "monthly" ? "price_growth_monthly" : "price_growth_yearly",
      icon: "📈",
      iconImage: "/branding/subscription/growth.png",
      buttonText: "Subscribe Now",
      buttonVariant: "default",
      features: [
        "Analytics Overview Dashboard",
        "Local Market Snapshot",
        "Review Monitoring (Google & Yelp)",
        "Track up to 5 competitors",
        "Monthly AI business reports",
        "3-month data history",
        "Basic email support"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: 109,
      yearlyPrice: 87,
      description: "Ideal for restaurants expanding to multiple locations",
      stripePriceId: billingPeriod === "monthly" ? "price_pro_monthly" : "price_pro_yearly",
      icon: "⭐",
      iconImage: "/branding/subscription/pro.png",
      buttonText: "Choose Pro",
      buttonVariant: "default",
      popular: true,
      features: [
        "Advanced Analytics Dashboard",
        "Extended Market Analysis",
        "Full Review Suite Integration",
        "Track up to 15 competitors",
        "Weekly AI strategy recommendations",
        "1-year data history retention",
        "Priority support response",
        "Multi-location management",
        "Custom reporting"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 599,
      yearlyPrice: 479,
      description: "For chains, franchises, and restaurant groups",
      stripePriceId: billingPeriod === "monthly" ? "price_enterprise_monthly" : "price_enterprise_yearly",
      icon: "👑",
      iconImage: "/branding/subscription/enterprise.png",
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      features: [
        "Enterprise Analytics Dashboard",
        "AI-powered Sales Forecasting",
        "Custom Market Research Reports",
        "Track up to 50 competitors",
        "API Access & Business Intelligence",
        "Unlimited historical data",
        "Dedicated account manager",
        "Custom integration services",
        "White-label reporting",
        "Advanced data export options",
        "Employee training sessions"
      ]
    }
  ];
  
  const getCurrentPrice = (plan: PricingPlan) => {
    return billingPeriod === "yearly" ? plan.yearlyPrice : plan.price;
  };
  
  const getButtonClasses = (plan: PricingPlan) => {
    const isSelected = selectedPlan === plan.id;
    const isPro = plan.popular;
    
    if (isSelected) {
      return "bg-primary-600 hover:bg-primary-700 text-white";
    }
    
    if (plan.buttonVariant === "outline") {
      return "border border-gray-300 text-gray-700 hover:bg-gray-50";
    }
    
    if (isPro) {
      return "bg-primary-600 text-white hover:bg-primary-700 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl";
    }
    
    return "bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl";
  };

  return (
    <div>
      {/* Billing Toggle */}
      <div className="flex justify-center mb-10 animate-fadeInUp delay-200">
        <div className="inline-flex rounded-md shadow-lg relative">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`relative px-8 py-3 font-semibold transition-all duration-300 ${
              billingPeriod === "monthly"
                ? "bg-white text-gray-800 shadow-sm"
                : "bg-gray-100 text-gray-600"
            } border rounded-l-lg`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`relative px-8 py-3 font-semibold transition-all duration-300 ${
              billingPeriod === "yearly"
                ? "bg-white text-gray-800 shadow-sm"
                : "bg-gray-100 text-gray-600"
            } border-t border-r border-b rounded-r-lg`}
          >
            Yearly
            {billingPeriod === "yearly" && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
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
            className={`relative bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              plan.popular
                ? "transform scale-105 border-2 border-primary-500 z-10 shadow-green-500/25"
                : "border border-gray-200"
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: "fadeInUp 0.6s ease-out forwards"
            }}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
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
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-2xl">
                      {plan.icon}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              </div>

              {/* Plan Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    ${getCurrentPrice(plan)}
                  </span>
                  {getCurrentPrice(plan) > 0 && (
                    <span className="text-gray-500 ml-2">/{billingPeriod === "monthly" ? "mo" : "mo yearly"}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <>
                      <li className="border-t border-gray-100 my-4 pt-2"></li>
                      {plan.notIncluded.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-400">
                          <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>

              {/* Button */}
              <Button
                className={`w-full ${getButtonClasses(plan)}`}
                disabled={isLoading || selectedPlan === plan.id}
                onClick={() => onSelectPlan(plan)}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : selectedPlan === plan.id ? (
                  "Selected"
                ) : (
                  plan.buttonText
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 