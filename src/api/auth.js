const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to safely parse JSON responses
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  // If not JSON, get text (might be HTML error page)
  const text = await response.text();
  console.error('Received non-JSON response:', text.substring(0, 200));
  
  throw new Error(`API Error: Expected JSON but received ${contentType || 'unknown content type'}`);
};

export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};




