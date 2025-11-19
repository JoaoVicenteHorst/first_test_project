const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

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

export const userAPI = {
  // Get all users
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders()
      });
      
      const data = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      return data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  // Get single user
  async getById(id) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
      
      const data = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user');
      }
      
      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  // Create user
  async create(userData) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      const data = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      return data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  // Update user
  async update(id, userData) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      
      const data = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      return data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Delete user
  async delete(id) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      const data = await parseResponse(response);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }
      
      return data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
};

