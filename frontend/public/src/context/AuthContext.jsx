import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem('prelovedph_token');
      if (token) {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          setProfile(response.data.user);
          fetchUnreadCount();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('prelovedph_token');
      localStorage.removeItem('prelovedph_user');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/messages/unread/count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Unread count error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('prelovedph_token', response.data.token);
        localStorage.setItem('prelovedph_user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setProfile(response.data.user);
        toast.success('Welcome back!');
        fetchUnreadCount();
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('prelovedph_token');
      localStorage.removeItem('prelovedph_user');
      setUser(null);
      setProfile(null);
      setUnreadCount(0);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.success) {
        setProfile(response.data.profile);
        setUser({ ...user, ...response.data.profile });
        toast.success('Profile updated!');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false };
    }
  };

  const value = {
    user,
    profile,
    loading,
    unreadCount,
    login,
    register,
    logout,
    updateProfile,
    fetchUnreadCount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};