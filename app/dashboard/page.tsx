"use client";

import { ProtectedRoute } from "@/components/auth";
import MarketAnalysisDashboard from "@/components/dashboard/MarketAnalysisDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MarketAnalysisDashboard />
    </ProtectedRoute>
  );
}