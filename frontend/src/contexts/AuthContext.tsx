'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (user: User, token: string) => void;
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.getProfile();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔍 AuthContext: Starting login with:', { email, password: password.length + ' chars' });
      const response = await api.login(email, password);
      console.log('🔍 AuthContext: API response:', response);

      const { user: userData, token } = response.data;
      console.log('🔍 AuthContext: Extracted data:', { userData, token: token ? 'present' : 'missing' });

      localStorage.setItem('token', token);
      setUser(userData);

      toast.success('Welcome back!');
      router.push('/');
    } catch (error: any) {
      console.error('🔍 AuthContext: Login error:', error);
      console.error('🔍 AuthContext: Error response:', error.response);
      const message = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    try {
      const response = await api.register(data);
      const { user: userData, token } = response.data;

      localStorage.setItem('token', token);
      setUser(userData);

      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const loginWithOAuth = (user: User, token: string) => {
    localStorage.setItem('token', token);
    setUser(user);
    toast.success('Welcome back!');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    loading,
    login,
    loginWithOAuth,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
