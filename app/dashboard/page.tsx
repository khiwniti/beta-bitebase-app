"use client";

import { ProtectedRoute } from "@/components/auth";
import EnhancedDashboard from "@/components/dashboard/EnhancedDashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <EnhancedDashboard />
    </ProtectedRoute>
  );
}