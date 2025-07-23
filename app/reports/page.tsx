"use client";

import { ProtectedRoute } from "@/components/auth";
import NotionLikeReports from "@/components/reports/NotionLikeReports";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <NotionLikeReports />
    </ProtectedRoute>
  );
}
