import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    try {
      const stored = localStorage.getItem('menix_user');
      if (stored && stored !== 'undefined' && stored !== 'null' && stored.trim() !== '') {
        const userData = JSON.parse(stored);
        setUser(userData);
      } else if (stored) {
        // Clean up invalid legacy values like the string "undefined"
        localStorage.removeItem('menix_user');
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    if (!userData || typeof userData !== 'object') {
      console.warn('Attempted to login with invalid user data:', userData);
      return;
    }
    setUser(userData);
    localStorage.setItem('menix_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('menix_user');
  };

  // Don't render children until authentication state is loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 