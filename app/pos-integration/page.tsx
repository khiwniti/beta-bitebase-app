"use client";

import { ProtectedRoute } from "@/components/auth";
import POSIntegration from "@/components/pos/POSIntegration";
import { MainLayout } from "@/components/layout/MainLayout";

export default function POSIntegrationPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <POSIntegration />
      </MainLayout>
    </ProtectedRoute>
  );
}
