import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = authService.getStoredToken();
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
          }
        } catch {
          // Token expired or invalid
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
    }
    return res;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  // Handy one-click login for test users
  const quickLogin = async (userType) => {
    let email = '';
    let password = '';
    if (userType === 'STUDENT_1') {
      email = 'student1@college.edu';
      password = 'Password123!';
    } else if (userType === 'STUDENT_2') {
      email = 'student2@college.edu';
      password = 'Password123!';
    } else if (userType === 'FACULTY') {
      email = 'faculty@college.edu';
      password = 'Faculty123!';
    } else if (userType === 'ADMIN') {
      email = 'admin@college.edu';
      password = 'Admin123!';
    }
    return await login(email, password);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isStudent: user?.role === 'STUDENT',
    isFaculty: user?.role === 'FACULTY',
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'FACULTY' || user?.role === 'ADMIN',
    login,
    register,
    logout,
    quickLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
