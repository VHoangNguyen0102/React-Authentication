import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Debug logging
console.log('🔍 [Environment] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔍 [API_URL] Using:', API_URL);
console.log('🔍 [Mode]:', import.meta.env.MODE);
console.log('🔍 [All Env]:', import.meta.env);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Access token stored in memory
let accessToken = null;

// Set access token
export const setAccessToken = (token) => {
  accessToken = token;
  console.log('[AccessToken] Token set in memory:', token ? '✓ (exists)' : '✗ (null)');
};

// Get access token
export const getAccessToken = () => {
  return accessToken;
};

// Clear access token
export const clearAccessToken = () => {
  accessToken = null;
  console.log('[AccessToken] Token cleared from memory');
};

// Request interceptor - attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url} - Token attached ✓`);
    } else {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url} - No token`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't attempt refresh for auth endpoints themselves (prevent infinite loops)
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/refresh') ||
                          originalRequest.url?.includes('/auth/check');
    
    if (isAuthEndpoint) {
      console.log('[Interceptor] Auth endpoint failed, not attempting refresh');
      return Promise.reject(error);
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[Interceptor] 401 error detected, attempting token refresh...');

      try {
        console.log('[Interceptor] Refreshing access token...');
        const response = await axios.post(`${API_URL}/auth/refresh`, {},
          {
            withCredentials: true, // Important: Send cookies with refresh request
          }
        );

        const { accessToken: newAccessToken } = response.data.data;
        console.log('[Interceptor] Access token refreshed successfully ✓');

        // Update access token
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens
        console.error('[Interceptor] Token refresh failed:', refreshError);
        clearAccessToken();
        localStorage.removeItem('user');
        // Cookie will be cleared by backend on next request
        // Don't redirect here - let ProtectedRoute handle it
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
