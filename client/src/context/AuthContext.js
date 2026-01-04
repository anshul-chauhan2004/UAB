import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session within the tab using sessionStorage
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const login = React.useCallback(async (credentials) => {
    try {
      // Validate input
      if (!credentials.username || !credentials.password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      // Call backend for verification - backend expects 'email' field
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: credentials.username,  // Backend expects 'email' not 'username'
        password: credentials.password,
        role: credentials.role // Send role for validation
      });

      const { user: serverUser, token } = res.data;
      const sessionUser = { ...serverUser, token };
      setUser(sessionUser);
      sessionStorage.setItem('user', JSON.stringify(sessionUser));
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Login failed';
      return { success: false, message };
    }
  }, [API_URL]);

  const register = React.useCallback(async (userData) => {
    try {
      // Validate input
      if (!userData.fullName || !userData.email || !userData.username || !userData.password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: userData.fullName,  // Backend expects 'name' not 'fullName'
        email: userData.email,
        password: userData.password,
        role: userData.role || 'student',
        department: userData.department
      });

      const { user: serverUser, token } = res.data;
      const sessionUser = { ...serverUser, token };
      setUser(sessionUser);
      sessionStorage.setItem('user', JSON.stringify(sessionUser));
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  }, [API_URL]);

  const logout = React.useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
