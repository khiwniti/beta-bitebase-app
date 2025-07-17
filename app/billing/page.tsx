"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  Settings,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export default function BillingPage() {
  const router = useRouter();
  const [autoRenewal, setAutoRenewal] = useState(true);

  // Mock data
  const currentPlan = {
    name: "Professional",
    price: 79,
    billingCycle: "monthly",
    nextBilling: "2024-01-15",
    status: "active"
  };

  const invoices: Invoice[] = [
    {
      id: "inv_001",
      date: "2024-12-15",
      amount: 79.00,
      status: "paid",
      description: "Professional Plan - December 2024",
      downloadUrl: "/api/invoices/inv_001.pdf"
    },
    {
      id: "inv_002",
      date: "2024-11-15",
      amount: 79.00,
      status: "paid",
      description: "Professional Plan - November 2024",
      downloadUrl: "/api/invoices/inv_002.pdf"
    },
    {
      id: "inv_003",
      date: "2024-10-15",
      amount: 79.00,
      status: "paid",
      description: "Professional Plan - October 2024",
      downloadUrl: "/api/invoices/inv_003.pdf"
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "pm_001",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: "pm_002",
      type: "card",
      last4: "0005",
      brand: "Mastercard",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Billing & Payments
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your subscription and payment methods
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/subscription">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your subscription details and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      {currentPlan.name} Plan
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      ${currentPlan.price}/{currentPlan.billingCycle}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {currentPlan.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Next Billing Date
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(currentPlan.nextBilling).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Billing Cycle
                    </label>
                    <p className="text-gray-900 dark:text-gray-100 capitalize">
                      {currentPlan.billingCycle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Auto-renewal
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically renew your subscription
                    </p>
                  </div>
                  <Switch checked={autoRenewal} onCheckedChange={setAutoRenewal} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your saved payment methods
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {method.brand} •••• {method.last4}
                            </span>
                            {method.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Latest Invoice
                </Button>
                <Link href="/subscription">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Customer Portal
                </Button>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Have questions about billing or need assistance with your subscription?
                </p>
                <Link href="/contact">
                  <Button className="w-full">
                    Contact Billing Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Invoice History */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                Invoice History
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        Invoice
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              #{invoice.id.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {invoice.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100 font-medium">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${getStatusColor(invoice.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
