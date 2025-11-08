/**
 * Authentication Context - Global auth state management
 * ✅ CORRECTED: Token structure, OTP verification, request_id handling
 */

import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import * as authService from '../api/services/authService';
import type { User } from '../api/types/auth.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<{ request_id: string }>;
  verifyOTP: (phone: string, otp: string, request_id: string, deviceId?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        try {
          // Verify token is still valid by fetching fresh user data
          const freshUser = await authService.getMe();
          setUser(freshUser);
        } catch (error) {
          // Token invalid, clear storage
          console.error('Token validation failed:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // ✅ CORRECTED: Separate sendOTP function
  const sendOTP = async (phone: string): Promise<{ request_id: string }> => {
    const response = await authService.sendOTP({ 
      phone,
      purpose: 'login' 
    });
    return { request_id: response.request_id };
  };

  // ✅ CORRECTED: verifyOTP with request_id and correct field names
  const verifyOTP = async (phone: string, code: string, deviceId?: string) => {
    const response = await authService.verifyOTP({ 
      phone, 
      code, // ✅ CORRECTED: backend uses 'otp' not 'code'
      // request_id, // ✅ ADDED: required field
      device_id: deviceId 
    });
    setUser(response.user);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await authService.logout({ refresh: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    setUser(null);
  };

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const updatedUser = await authService.getMe();
        setUser(updatedUser);
      } catch (error) {
        console.error('Failed to refresh user:', error);
        // Token might be invalid, logout
        await logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      sendOTP,
      verifyOTP,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};