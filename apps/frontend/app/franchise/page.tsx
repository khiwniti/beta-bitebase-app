"use client"

import { useState } from "react"
import { Button } from "@bitebase/ui"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Input } from "@bitebase/ui"
import { Label } from "@bitebase/ui"
import { Textarea } from "@bitebase/ui"
import { Badge } from "@bitebase/ui"
import {
  Building2,
  Users,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  ArrowRight
} from "lucide-react"

export default function FranchisePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-bitebase-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-bitebase-green" />
            </div>
            <h2 className="text-2xl font-bold text-accent mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your franchise inquiry has been submitted successfully. Our enterprise team will contact you within 24 hours.
            </p>
            <div className="space-y-3">
              <Button
                className="btn-primary w-full"
                onClick={() => window.location.href = '/dashboard/franchise'}
              >
                Access Franchise Dashboard
              </Button>
              <Button
                variant="outline"
                className="btn-secondary w-full"
                onClick={() => window.location.href = '/'}
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">BiteBase</span>
              <span className="ml-1 text-sm text-gray-500">Franchise</span>
            </div>
            <a href="/auth" className="nav-link-inactive">
              ← Back to Registration
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fadeInUp">
          <span className="inline-block px-4 py-2 rounded-full border border-primary text-primary font-semibold mb-6">
            🏢 Enterprise Solutions
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Franchise Partnership Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scale your restaurant empire with BiteBase Intelligence. Our enterprise solutions are designed for multi-location operations and franchise businesses.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-0 shadow-xl animate-fadeInUp delay-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Get Started Today</CardTitle>
              <CardDescription>
                Tell us about your franchise business and we'll create a custom solution for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input id="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Franchise Name *</Label>
                  <Input id="company" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="locations">Number of Locations</Label>
                    <Input id="locations" placeholder="e.g., 5, 10-20, 50+" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue Range</Label>
                    <Input id="revenue" placeholder="e.g., $1M-5M" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Current Challenges</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Tell us about your current market analysis challenges, expansion plans, or specific needs..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Implementation Timeline</Label>
                  <Input id="timeline" placeholder="e.g., ASAP, 3 months, 6 months" />
                </div>

                <Button
                  type="submit"
                  className="btn-primary w-full transition-all duration-300 hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="loading-spinner rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      Submit Franchise Inquiry
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits & Features */}
          <div className="space-y-8">
            {/* Enterprise Features */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Enterprise Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-bitebase-green mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Multi-Location Dashboard</h4>
                    <p className="text-sm text-gray-600">Centralized view of all your restaurant locations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-bitebase-green mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Franchise Performance Analytics</h4>
                    <p className="text-sm text-gray-600">Compare performance across locations and regions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-bitebase-green mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Custom Integrations</h4>
                    <p className="text-sm text-gray-600">Connect with your existing POS and management systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-bitebase-green mt-0.5" />
                  <div>
                    <h4 className="font-semibold">White-label Solutions</h4>
                    <p className="text-sm text-gray-600">Brand the platform with your franchise identity</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support & Service */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-secondary" />
                  Dedicated Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Dedicated Account Manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">24/7 Priority Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Quarterly Business Reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  <span className="font-semibold">Custom Training Programs</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle>Need to Talk Now?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Enterprise Sales</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">franchise@bitebase.ai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-accent text-center mb-8">
            Trusted by Leading Franchise Brands
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4 bg-bitebase-green text-white">Success Story</Badge>
                <h3 className="font-bold mb-2">FastBite Franchise</h3>
                <p className="text-gray-600 text-sm mb-4">
                  "Increased new location success rate by 87% using BiteBase market analysis"
                </p>
                <p className="text-2xl font-bold text-primary">50+ Locations</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4 bg-secondary text-white">Case Study</Badge>
                <h3 className="font-bold mb-2">Urban Eats Chain</h3>
                <p className="text-gray-600 text-sm mb-4">
                  "Reduced expansion costs by 40% with data-driven location selection"
                </p>
                <p className="text-2xl font-bold text-secondary">25+ Locations</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4 bg-warning text-white">Featured</Badge>
                <h3 className="font-bold mb-2">Gourmet Express</h3>
                <p className="text-gray-600 text-sm mb-4">
                  "Optimized menu pricing across all locations, boosting profit margins"
                </p>
                <p className="text-2xl font-bold text-warning">100+ Locations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
