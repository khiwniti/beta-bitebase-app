import React from 'react';

// Placeholder component for map functionality
// This prevents build errors when leaflet dependencies are not available
export const MapPlaceholder: React.FC<{ 
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className, style }) => {
  return (
    <div 
      className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}
      style={style}
    >
      <div className="text-gray-500">
        <svg 
          className="mx-auto h-12 w-12 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
        <h3 className="text-lg font-medium mb-2">Map Component</h3>
        <p className="text-sm">Interactive map will be available here</p>
        {children && (
          <div className="mt-4 text-xs text-gray-400">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Export common map-related components as placeholders
export const MapContainer = MapPlaceholder;
export const TileLayer = () => null;
export const Marker = () => null;
export const Popup = () => null;
export const Circle = () => null;

export default MapPlaceholder;