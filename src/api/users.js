const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const userAPI = {
  // Get all users
  async getAll() {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch users');
    }
    
    return response.json();
  },

  // Get single user
  async getById(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch user');
    }
    
    return response.json();
  },

  // Create user
  async create(userData) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }
    
    return response.json();
  },

  // Update user
  async update(id, userData) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    return response.json();
  },

  // Delete user
  async delete(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
    
    return response.json();
  },
};

