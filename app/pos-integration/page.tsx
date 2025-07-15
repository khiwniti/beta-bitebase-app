"use client";

import { ProtectedRoute } from "@/components/auth";
import POSIntegration from "@/components/pos/POSIntegration";

export default function POSIntegrationPage() {
  return (
    <ProtectedRoute>
      <POSIntegration />
    </ProtectedRoute>
  );
}
