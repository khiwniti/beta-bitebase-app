"use client";

import { ProtectedRoute } from "@/components/auth";
import RestaurantSettings from "@/components/settings/RestaurantSettings";
import { MainLayout } from "@/components/layout/MainLayout";

export default function RestaurantSettingsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <RestaurantSettings />
      </MainLayout>
    </ProtectedRoute>
  );
}