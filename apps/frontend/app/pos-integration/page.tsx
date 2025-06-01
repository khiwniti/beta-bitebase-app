"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bitebase/ui";
import { Button } from "@bitebase/ui";
import { Badge } from "@bitebase/ui";
import ExternalDataSourceConfig from "../../components/pos/ExternalDataSourceConfig";
import {
  CreditCard,
  Wifi,
  CheckCircle,
  AlertCircle,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  DollarSign,
  Users,
  Clock,
  Zap,
  Shield,
  Database,
} from "lucide-react";

interface POSSystem {
  id: string;
  name: string;
  logo: string;
  status: "connected" | "available" | "coming-soon";
  description: string;
  features: string[];
  setupTime: string;
  monthlyFee?: string;
}

const posSystemsData: POSSystem[] = [
  {
    id: "square",
    name: "Square POS",
    logo: "⬜",
    status: "connected",
    description: "Complete point-of-sale solution with inventory management",
    features: [
      "Real-time sales data",
      "Inventory tracking",
      "Customer analytics",
      "Payment processing",
    ],
    setupTime: "15 minutes",
    monthlyFee: "Free + 2.6% per transaction",
  },
  {
    id: "toast",
    name: "Toast POS",
    logo: "🍞",
    status: "available",
    description: "Restaurant-specific POS with kitchen display integration",
    features: [
      "Kitchen display system",
      "Online ordering",
      "Staff management",
      "Menu engineering",
    ],
    setupTime: "30 minutes",
    monthlyFee: "$69/month",
  },
  {
    id: "clover",
    name: "Clover",
    logo: "🍀",
    status: "available",
    description: "All-in-one business management platform",
    features: [
      "Payment processing",
      "Inventory management",
      "Employee management",
      "Reporting",
    ],
    setupTime: "20 minutes",
    monthlyFee: "$14.95/month",
  },
  {
    id: "lightspeed",
    name: "Lightspeed Restaurant",
    logo: "⚡",
    status: "available",
    description: "Cloud-based restaurant management system",
    features: [
      "Table management",
      "Multi-location support",
      "Advanced reporting",
      "Loyalty programs",
    ],
    setupTime: "45 minutes",
    monthlyFee: "$69/month",
  },
  {
    id: "revel",
    name: "Revel Systems",
    logo: "🎯",
    status: "coming-soon",
    description: "iPad-based POS system for restaurants",
    features: [
      "iPad interface",
      "CRM integration",
      "Real-time reporting",
      "Multi-location",
    ],
    setupTime: "60 minutes",
    monthlyFee: "$99/month",
  },
  {
    id: "shopify",
    name: "Shopify POS",
    logo: "🛍️",
    status: "coming-soon",
    description: "Unified commerce platform for retail and restaurants",
    features: [
      "E-commerce integration",
      "Inventory sync",
      "Customer profiles",
      "Analytics",
    ],
    setupTime: "25 minutes",
    monthlyFee: "$29/month",
  },
];

const integrationStats = {
  totalTransactions: 15847,
  dailyRevenue: 28450,
  averageOrderValue: 680,
  peakHours: "7:00 PM - 9:00 PM",
  lastSync: "2 minutes ago",
  dataAccuracy: 99.8,
};

export default function POSIntegrationPage() {
  const [selectedPOS, setSelectedPOS] = useState<string | null>("square");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (posId: string) => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSelectedPOS(posId);
    setIsConnecting(false);
  };

  const connectedPOS = posSystemsData.find((pos) => pos.status === "connected");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            POS Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect your point-of-sale system to unlock real-time analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      {connectedPOS && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{connectedPOS.logo}</div>
                <div>
                  <CardTitle className="text-green-800 dark:text-green-200">
                    {connectedPOS.name} Connected
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400">
                    Last sync: {integrationStats.lastSync} • Data accuracy:{" "}
                    {integrationStats.dataAccuracy}%
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {integrationStats.totalTransactions.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Total Transactions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  ฿{integrationStats.dailyRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Daily Revenue
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  ฿{integrationStats.averageOrderValue}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Avg Order Value
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {integrationStats.peakHours}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Peak Hours
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">Real-time Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Get instant insights into sales performance, customer behavior,
              and revenue trends
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Zap className="w-8 h-8 mx-auto text-yellow-600 dark:text-yellow-400" />
            <CardTitle className="text-lg">Automated Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Eliminate manual data entry with automatic synchronization of
              sales data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Shield className="w-8 h-8 mx-auto text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg">Secure Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Bank-level security with encrypted data transmission and storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available POS Systems */}
      <Card>
        <CardHeader>
          <CardTitle>Available POS Systems</CardTitle>
          <CardDescription>
            Choose from our supported point-of-sale integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posSystemsData.map((pos) => (
              <Card
                key={pos.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  pos.status === "connected"
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : pos.status === "coming-soon"
                      ? "opacity-60"
                      : "hover:border-primary-200 dark:hover:border-primary-800"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{pos.logo}</div>
                      <div>
                        <CardTitle className="text-base">{pos.name}</CardTitle>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Setup: {pos.setupTime}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        pos.status === "connected"
                          ? "default"
                          : pos.status === "available"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        pos.status === "connected"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : pos.status === "coming-soon"
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            : ""
                      }
                    >
                      {pos.status === "connected" && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {pos.status === "coming-soon" && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {pos.status === "connected"
                        ? "Connected"
                        : pos.status === "available"
                          ? "Available"
                          : "Coming Soon"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pos.description}
                  </p>

                  <div className="space-y-1">
                    {pos.features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-xs text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {pos.monthlyFee && (
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {pos.monthlyFee}
                    </div>
                  )}

                  <div className="pt-2">
                    {pos.status === "connected" ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <Database className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : pos.status === "available" ? (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleConnect(pos.id)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wifi className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External Data Sources Configuration */}
      <ExternalDataSourceConfig
        posSystemId={selectedPOS || "square"}
        onConfigurationSaved={(config) => {
          console.log("Configuration saved:", config);
        }}
      />

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
          <CardDescription>
            Follow these steps to connect your POS system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Choose Your POS System
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select from our list of supported POS systems above
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Authorize Connection
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Log in to your POS system and authorize BiteBase to access
                  your data
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Configure Settings
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up data sync preferences and notification settings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-sm">
                ✓
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Start Analyzing
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Begin receiving real-time insights and analytics from your
                  sales data
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
