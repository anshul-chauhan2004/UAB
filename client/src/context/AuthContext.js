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

  const login = async (credentials) => {
    try {
      // Validate input
      if (!credentials.username || !credentials.password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      // Call backend for verification
      const res = await axios.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password
      });

      const { user: serverUser, token } = res.data;
      const sessionUser = { ...serverUser, token };
      setUser(sessionUser);
      sessionStorage.setItem('user', JSON.stringify(sessionUser));
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      // Validate input
      if (!userData.fullName || !userData.email || !userData.username || !userData.password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      const res = await axios.post('/api/auth/register', {
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
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
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

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
