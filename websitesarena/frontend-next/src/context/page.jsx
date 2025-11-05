import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/app/utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
        const response = await api.get('/api/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
      setIsAdmin(response.data.isAdmin);
      
      // Redirect based on user type if on wrong dashboard
      const path = window.location.pathname;
      const isClientPath = path.startsWith('/dashboard/client');
      const isDeveloperPath = path.startsWith('/dashboard/developer');
      
      // server uses 'user' for clients and 'admin' for admins; developers are stored separately
      if (response.data.role === 'user' && isDeveloperPath) {
        window.location.href = '/clientauth';
      } else if (response.data.role === 'developer' && isClientPath) {
        window.location.href = '/signin';
      }
    } catch (error) {
      localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
        const response = await api.post('/api/auth/login', { email, password });
      const { token, isAdmin: adminStatus } = response.data;
      localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setIsAdmin(adminStatus);
      await checkAuthStatus();
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isAdmin,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
