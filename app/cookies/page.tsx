"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import BiteBaseLogo from "../../components/BiteBaseLogo";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <BiteBaseLogo size="sm" showText={false} />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">About</Link>
              <Link href="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link>
            </nav>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 hidden sm:inline-flex"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button 
                size="sm" 
                className="bg-primary-600 hover:bg-primary-700 text-white"
                asChild
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 prose max-w-none">
              
              <h2>What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>

              <h2>How We Use Cookies</h2>
              <p>
                BiteBase Intelligence uses cookies to enhance your experience on our website and to improve our services. 
                We use cookies for the following purposes:
              </p>

              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable basic functions like page navigation, 
                access to secure areas of the website, and remembering your login status. The website cannot function properly without these cookies.
              </p>
              <ul>
                <li><strong>Authentication cookies:</strong> Keep you logged in during your session</li>
                <li><strong>Security cookies:</strong> Protect against fraudulent activity</li>
                <li><strong>Session cookies:</strong> Enable website functionality during your visit</li>
              </ul>

              <h3>Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. 
                This helps us improve our website performance and user experience.
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> Tracks website usage and performance</li>
                <li><strong>Performance monitoring:</strong> Monitors website speed and functionality</li>
                <li><strong>Error tracking:</strong> Helps us identify and fix technical issues</li>
              </ul>

              <h3>Functionality Cookies</h3>
              <p>
                These cookies enable enhanced functionality and personalization on our website, such as remembering your preferences 
                and settings.
              </p>
              <ul>
                <li><strong>Language preferences:</strong> Remember your selected language</li>
                <li><strong>Theme preferences:</strong> Remember your preferred color scheme</li>
                <li><strong>Dashboard settings:</strong> Save your customized dashboard layout</li>
              </ul>

              <h3>Marketing Cookies</h3>
              <p>
                These cookies are used to track visitors across websites to display relevant and engaging advertisements. 
                We only use these with your explicit consent.
              </p>
              <ul>
                <li><strong>Conversion tracking:</strong> Measure the effectiveness of our marketing campaigns</li>
                <li><strong>Retargeting cookies:</strong> Show relevant ads on other websites</li>
                <li><strong>Social media cookies:</strong> Enable sharing on social media platforms</li>
              </ul>

              <h2>Third-Party Cookies</h2>
              <p>
                Some cookies on our website are set by third-party services we use to enhance functionality:
              </p>
              <ul>
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Intercom:</strong> For customer support chat functionality</li>
                <li><strong>Hotjar:</strong> For user behavior analytics and feedback</li>
              </ul>

              <h2>Managing Your Cookie Preferences</h2>
              <p>
                You have several options for managing cookies:
              </p>

              <h3>Cookie Consent Banner</h3>
              <p>
                When you first visit our website, you'll see a cookie consent banner where you can choose which types of cookies to accept. 
                You can update your preferences at any time by clicking the "Cookie Settings" link in our website footer.
              </p>

              <h3>Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. You can set your browser to:
              </p>
              <ul>
                <li>Block all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Delete cookies when you close your browser</li>
                <li>Notify you when cookies are being set</li>
              </ul>

              <h3>Browser-Specific Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Google Chrome</h4>
                  <p className="text-sm">Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Mozilla Firefox</h4>
                  <p className="text-sm">Options → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Safari</h4>
                  <p className="text-sm">Preferences → Privacy → Cookies and website data</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Microsoft Edge</h4>
                  <p className="text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
                </div>
              </div>

              <h2>Impact of Disabling Cookies</h2>
              <p>
                Please note that disabling certain cookies may impact your experience on our website:
              </p>
              <ul>
                <li>You may need to log in repeatedly during your session</li>
                <li>Your preferences and settings may not be saved</li>
                <li>Some features and functionality may not work properly</li>
                <li>You may see less relevant content and advertisements</li>
              </ul>

              <h2>Cookie Retention</h2>
              <p>
                Different cookies have different retention periods:
              </p>
              <ul>
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain on your device for a set period (typically 30 days to 2 years)</li>
                <li><strong>Analytics cookies:</strong> Usually expire after 2 years</li>
                <li><strong>Marketing cookies:</strong> Typically expire after 30 days to 1 year</li>
              </ul>

              <h2>Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. 
                When we make changes, we will update the "Last Updated" date at the top of this policy and notify you through 
                our website or email if the changes are significant.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <ul>
                <li><strong>Email:</strong> privacy@bitebase.app</li>
                <li><strong>Address:</strong> BiteBase Intelligence, Bangkok, Thailand</li>
                <li><strong>Phone:</strong> +66 (0) 2-xxx-xxxx</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="text-blue-900 font-semibold mb-2">Your Privacy Rights</h3>
                <p className="text-blue-800 text-sm">
                  You have the right to know what personal data we collect, why we collect it, and how we use it. 
                  You also have the right to request access, correction, or deletion of your personal data. 
                  For more information, please see our <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <BiteBaseLogo size="sm" showText={false} variant="white" />
              <p className="text-gray-400 mt-4">
                Empowering restaurants with data-driven insights for success.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/restaurant-explorer" className="hover:text-white">Restaurant Explorer</Link></li>
                <li><Link href="/market-analysis" className="hover:text-white">Market Analysis</Link></li>
                <li><Link href="/reports" className="hover:text-white">Reports</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BiteBase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}