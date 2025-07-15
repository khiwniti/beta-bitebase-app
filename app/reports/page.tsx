"use client";

import { ProtectedRoute } from "@/components/auth";
import ReportGeneration from "@/components/reports/ReportGeneration";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportGeneration />
    </ProtectedRoute>
  );
}
