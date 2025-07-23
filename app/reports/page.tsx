"use client";

import { ProtectedRoute } from "@/components/auth";
import SimpleReportManagement from "@/components/reports/SimpleReportManagement";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <SimpleReportManagement />
    </ProtectedRoute>
  );
}
