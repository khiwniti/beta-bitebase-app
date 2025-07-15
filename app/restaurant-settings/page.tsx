"use client";

import { ProtectedRoute } from "@/components/auth";
import RestaurantSettings from "@/components/settings/RestaurantSettings";

export default function RestaurantSettingsPage() {
  return (
    <ProtectedRoute>
      <RestaurantSettings />
    </ProtectedRoute>
  );
}