// Authentication service for handling login/logout with better Android compatibility

const API_BASE = import.meta.env.VITE_API_URL || "https://menix-backend.vercel.app";

class AuthService {
  constructor() {
    this.isAndroid = this.detectAndroid();
  }

  detectAndroid() {
    // Check if running in Capacitor Android environment
    return window.Capacitor && window.Capacitor.isNative;
  }

  async login(identifier, password) {
    try {
      console.log('Attempting login with:', { identifier, hasPassword: !!password });
      
      // Normalize identifier
      let id = identifier;
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(id)) {
        id = id.toLowerCase();
      }

      // First attempt with the configured API
      const response = await this.makeRequest(`${API_BASE}/api/index`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ identifier: id, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Login successful:', data);
          const u = data.user || {};
          return {
            success: true,
            user: {
              id: u.id || u._id || data.userId,
              username: u.username || (id.includes('@') ? id.split('@')[0] : id),
              email: u.email || (id.includes('@') ? id : undefined),
              wallet: typeof u.wallet === 'number' ? u.wallet : 0
            }
          };
        } else {
          console.log('Login failed:', data.error);
          return {
            success: false,
            error: data.error || 'Invalid credentials'
          };
        }
      }

      // If first attempt fails, try alternative endpoints
      const fallbackResponse = await this.makeRequest(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          username: id.includes('@') ? id.split('@')[0] : id,
          email: id.includes('@') ? id : undefined,
          password 
        }),
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback login successful:', fallbackData);
        const u = fallbackData.user || fallbackData;
        return {
          success: true,
          user: {
            id: u.id || u._id || fallbackData.userId,
            username: u.username || (id.includes('@') ? id.split('@')[0] : id),
            email: u.email || (id.includes('@') ? id : undefined),
            wallet: typeof u.wallet === 'number' ? u.wallet : 0
          }
        };
      }

      console.log('All login attempts failed');
      return {
        success: false,
        error: 'Login failed. Please check your credentials and try again.'
      };

    } catch (error) {
      console.error('Login error:', error);
      
      // Provide specific error messages for common issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.'
        };
      }
      
      if (error.name === 'TypeError' && error.message.includes('JSON')) {
        return {
          success: false,
          error: 'Server response error. Please try again.'
        };
      }

      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  async makeRequest(url, options) {
    // Add timeout for Android
    const timeout = this.isAndroid ? 10000 : 5000; // 10 seconds for Android, 5 for web
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      throw error;
    }
  }

  async checkServerHealth() {
    try {
      const response = await this.makeRequest(`${API_BASE}/api/health`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Server health check:', data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }

  logout() {
    // Clear any stored authentication data
    localStorage.removeItem('menix_user');
    sessionStorage.clear();
  }
}

export default new AuthService();
