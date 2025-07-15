'use client';

import React from 'react';
import SimpleMapDashboard from '@/components/map/SimpleMapDashboard';
import { ProtectedRoute } from '@/components/auth';

export default function MapPage() {
  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-100">
        <SimpleMapDashboard className="h-full" />
      </div>
    </ProtectedRoute>
  );
}