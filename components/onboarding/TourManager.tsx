'use client';

import React, { useEffect } from 'react';

export function TourManager() {
  useEffect(() => {
    const handleStartTour = (event: CustomEvent) => {
      const { tourId } = event.detail;
      console.log(`Starting tour: ${tourId}`);
      // Here you would implement the actual tour logic
      // For now, just log the tour ID
    };

    window.addEventListener('start-guided-tour', handleStartTour as EventListener);

    return () => {
      window.removeEventListener('start-guided-tour', handleStartTour as EventListener);
    };
  }, []);

  return null; // This component doesn't render anything
}
