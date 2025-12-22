import React, { createContext, useState, useContext, useEffect } from 'react';

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
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Simple validation - check if fields are filled
      if (!credentials.username || !credentials.password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      // Demo user for testing (any username/password works)
      const demoUser = {
        id: '1',
        fullName: credentials.username,
        email: `${credentials.username}@uab.edu`,
        username: credentials.username,
        role: 'student',
        studentId: 'UAB' + Math.floor(Math.random() * 100000),
        department: 'Computer Science'
      };

      localStorage.setItem('user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Simple validation
      if (!userData.fullName || !userData.email || !userData.username || !userData.password) {
        return { success: false, message: 'Please fill in all fields' };
      }

      const newUser = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        role: 'student',
        studentId: 'UAB' + Math.floor(Math.random() * 100000),
        department: userData.department || 'Undeclared'
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
