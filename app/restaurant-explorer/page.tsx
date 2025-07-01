/**
 * Restaurant Explorer Page
 * Dedicated page for exploring restaurants with Wongnai integration
 */

"use client"

import React from 'react';
import { Providers } from '../providers';
import RestaurantExplorer from '../../components/restaurant/RestaurantExplorer';

export default function RestaurantExplorerPage() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <RestaurantExplorer 
          initialLocation={{
            latitude: 13.7563,
            longitude: 100.5018
          }}
        />
      </div>
    </Providers>
  );
}