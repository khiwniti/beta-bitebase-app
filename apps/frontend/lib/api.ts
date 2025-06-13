const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  restaurants: '/api/restaurants',
  menu: '/api/menu',
  health: '/health',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register'
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