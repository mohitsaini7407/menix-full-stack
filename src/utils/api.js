const PRIMARY_API_BASE_URL = import.meta.env.VITE_API_URL || 'https://menix-backend.vercel.app';
const FALLBACK_API_BASE_URL = 'https://menix-backtest.vercel.app';

class ApiService {
  constructor() {
    this.baseURL = PRIMARY_API_BASE_URL;
    this.fallbackBaseURL = FALLBACK_API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      // Try fallback base URL on network/CORS errors
      try {
        const fallbackUrl = `${this.fallbackBaseURL}${endpoint}`;
        const response = await fetch(fallbackUrl, config);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return await response.text();
      } catch (fallbackError) {
        console.error('API request failed:', error);
        console.error('Fallback API request failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // User endpoints
  async getUsers() {
    return this.request('/api/users');
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Generic CRUD methods
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  healthCheck,
  getUsers,
  createUser,
  get,
  post,
  put,
  delete: deleteMethod,
} = apiService; 