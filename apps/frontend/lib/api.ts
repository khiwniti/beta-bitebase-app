// API Configuration - uses external BiteBase API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bitebase.app';

export const api = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }
};

// API endpoints
export const apiEndpoints = {
  health: '/health',
  initDatabase: '/init-database',
  restaurants: {
    search: '/restaurants/search',
    details: (id: string) => `/restaurants/${id}`
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    track: '/analytics/track'
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ API Connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    return false;
  }
};

// Initialize database
export const initializeDatabase = async () => {
  try {
    const response = await api.post('/init-database', {});
    console.log('✅ Database initialization:', response);
    return response;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Search restaurants
export const searchRestaurants = async (params: {
  location?: string;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  limit?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/restaurants/search?${queryParams.toString()}`);
    return response;
  } catch (error) {
    console.error('❌ Restaurant search failed:', error);
    throw error;
  }
};

// Get analytics dashboard
export const getAnalyticsDashboard = async (timeframe: string = '7d') => {
  try {
    const response = await api.get(`/analytics/dashboard?timeframe=${timeframe}`);
    return response;
  } catch (error) {
    console.error('❌ Analytics dashboard failed:', error);
    throw error;
  }
};