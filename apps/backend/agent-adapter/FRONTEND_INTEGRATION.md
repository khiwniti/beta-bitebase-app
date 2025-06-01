# Frontend Integration Guide

This guide explains how to integrate the BiteBase Agent Adapter with various frontend frameworks.

## React Integration

### 1. Using Hooks

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// Agent adapter URL
const ADAPTER_URL = process.env.NEXT_PUBLIC_ADAPTER_URL || 'http://localhost:3002';

// Health check hook
function useAgentHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ADAPTER_URL}/health`);
        setHealth(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return { health, loading, error };
}

// Restaurant search hook
function useRestaurantSearch(latitude, longitude, radius, platforms) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!latitude || !longitude || !radius) {
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${ADAPTER_URL}/api/restaurants`, {
          params: { latitude, longitude, radius, platforms }
        });
        setRestaurants(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [latitude, longitude, radius, platforms]);

  return { restaurants, loading, error };
}

// Example component
function RestaurantFinder() {
  const [location, setLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 5
  });
  
  const { restaurants, loading, error } = useRestaurantSearch(
    location.latitude, 
    location.longitude, 
    location.radius
  );

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Nearby Restaurants</h2>
      <ul>
        {restaurants.map(restaurant => (
          <li key={restaurant.id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. Using a Custom Client

Create a client file `agentClient.js`:

```javascript
import axios from 'axios';

const ADAPTER_URL = process.env.NEXT_PUBLIC_ADAPTER_URL || 'http://localhost:3002';

export const agentClient = {
  getHealth: async () => {
    const response = await axios.get(`${ADAPTER_URL}/health`);
    return response.data;
  },
  
  researchRestaurant: async (query) => {
    const response = await axios.post(`${ADAPTER_URL}/api/research`, {
      query,
      type: 'restaurant'
    });
    return response.data;
  },
  
  getRestaurants: async (latitude, longitude, radius, platforms) => {
    const response = await axios.get(`${ADAPTER_URL}/api/restaurants`, {
      params: { latitude, longitude, radius, platforms }
    });
    return response.data;
  },
  
  analyzeMarket: async (latitude, longitude, radius, analysis_type) => {
    const response = await axios.get(`${ADAPTER_URL}/api/analyze`, {
      params: { latitude, longitude, radius, analysis_type }
    });
    return response.data;
  },
  
  geocodeAddress: async (address) => {
    const response = await axios.get(`${ADAPTER_URL}/api/geocode`, {
      params: { address }
    });
    return response.data;
  }
};
```

## Vue.js Integration

```vue
<template>
  <div>
    <h2>Nearby Restaurants</h2>
    <div v-if="loading">Loading restaurants...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        {{ restaurant.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

const ADAPTER_URL = process.env.VUE_APP_ADAPTER_URL || 'http://localhost:3002';

export default {
  data() {
    return {
      restaurants: [],
      loading: false,
      error: null,
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 5
      }
    };
  },
  created() {
    this.fetchRestaurants();
  },
  methods: {
    async fetchRestaurants() {
      this.loading = true;
      try {
        const response = await axios.get(`${ADAPTER_URL}/api/restaurants`, {
          params: {
            latitude: this.location.latitude,
            longitude: this.location.longitude,
            radius: this.location.radius
          }
        });
        this.restaurants = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## Angular Integration

```typescript
// agent.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private adapterUrl = 'http://localhost:3002';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<any> {
    return this.http.get(`${this.adapterUrl}/health`);
  }

  getRestaurants(latitude: number, longitude: number, radius: number, platforms?: string): Observable<any> {
    return this.http.get(`${this.adapterUrl}/api/restaurants`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        ...(platforms && { platforms })
      }
    });
  }

  analyzeMarket(latitude: number, longitude: number, radius: number, analysisType: string): Observable<any> {
    return this.http.get(`${this.adapterUrl}/api/analyze`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
        analysis_type: analysisType
      }
    });
  }

  geocodeAddress(address: string): Observable<any> {
    return this.http.get(`${this.adapterUrl}/api/geocode`, {
      params: { address }
    });
  }

  researchRestaurant(query: string): Observable<any> {
    return this.http.post(`${this.adapterUrl}/api/research`, {
      query,
      type: 'restaurant'
    });
  }
}

// restaurant.component.ts
import { Component, OnInit } from '@angular/core';
import { AgentService } from './agent.service';

@Component({
  selector: 'app-restaurants',
  template: `
    <div>
      <h2>Nearby Restaurants</h2>
      <div *ngIf="loading">Loading restaurants...</div>
      <div *ngIf="error">Error: {{ error }}</div>
      <ul *ngIf="!loading && !error">
        <li *ngFor="let restaurant of restaurants">{{ restaurant.name }}</li>
      </ul>
    </div>
  `
})
export class RestaurantComponent implements OnInit {
  restaurants: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.loading = true;
    this.agentService.getRestaurants(40.7128, -74.0060, 5)
      .subscribe({
        next: (data) => {
          this.restaurants = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        }
      });
  }
}
```

## CORS Configuration

If you're experiencing CORS issues when making requests from your frontend application, ensure that:

1. The agent adapter has CORS enabled (already included in the default setup)
2. Your frontend application is making requests with the correct origin

If needed, you can modify the CORS configuration in `agent-adapter.js`:

```javascript
// CORS middleware with specific origins
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://your-production-site.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

## Deployment Considerations

When deploying your frontend and the agent adapter to production:

1. Set the correct environment variables to point to your production agent adapter URL
2. Consider using environment-specific configuration for development and production
3. Implement proper error handling for network issues or service unavailability
4. Add request caching for frequently accessed data to improve performance 