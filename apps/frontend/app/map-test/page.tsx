"use client";

import { useState, useCallback } from 'react';
import { useGeocoding } from '@/hooks/useMCPApi';

export default function MapTestPage() {
  const [address, setAddress] = useState('1600 Amphitheatre Parkway, Mountain View, CA');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  const { geocodeAddress, loading } = useGeocoding();

  const handleGeocode = useCallback(async () => {
    setError('');
    setResult(null);

    try {
      const response = await geocodeAddress(address);
      if (response) {
        setResult(response);
      } else {
        setError('Failed to geocode address.');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    }
  }, [address, geocodeAddress]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Map API Test</h1>
      <div>
        <input 
          type="text" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: '400px', padding: '8px', marginRight: '10px' }}
        />
        <button onClick={handleGeocode} disabled={loading}>
          {loading ? 'Geocoding...' : 'Geocode Address'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Geocoding Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 