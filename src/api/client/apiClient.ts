/**
 * API Client - Axios instance with JWT interceptors
 * Base URL: /api/v1/
 * ✅ CORRECTED: Refresh token endpoint, error handling
 */

import axios, { 
  type AxiosInstance, 
  AxiosError, 
  type InternalAxiosRequestConfig, 
  type AxiosResponse 
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'; // Changed fallback
// const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add access token
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add device ID
    const deviceId = localStorage.getItem('device_id') || generateDeviceId();
    if (deviceId && config.headers) {
      config.headers['X-Device-Id'] = deviceId;
      localStorage.setItem('device_id', deviceId);
    }

    // Debug logging
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('📤 REQUEST:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    // console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Debug logging
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('📥 RESPONSE:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ✅ CORRECTED: Handle 401 with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // ✅ CORRECTED: Backend endpoint is /accounts/token/refresh/
        const response = await axios.post(
          `${API_BASE_URL}/accounts/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        console.error('❌ Token refresh failed:', refreshError);
        clearAuthTokens();
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    // ✅ CORRECTED: Better error transformation
    const errorResponse = error.response?.data as any;
    const transformedError = {
      message: errorResponse?.detail 
        || errorResponse?.message 
        || error.message 
        || 'An unexpected error occurred',
      status: error.response?.status,
      errors: errorResponse?.errors || errorResponse,
      data: error.response?.data,
    };

    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.error('❌ RESPONSE ERROR:', transformedError);
    }

    return Promise.reject(transformedError);
  }
);

// ============================================================================
// HELPERS
// ============================================================================

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

// ✅ ADDED: Generate unique device ID
const generateDeviceId = (): string => {
  return `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export default apiClient;