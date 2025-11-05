import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI, userAPI } from '../api';
import { setAccessToken, clearAccessToken } from '../api/axios';
import toast from 'react-hot-toast';

// Login mutation
export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: async (response) => {
      console.log('[Login] Login response received:', response);
      
      // The response structure is: response.data from authAPI.login
      const { accessToken, refreshToken, user } = response.data;
      
      // Store access token in memory and user + refreshToken in localStorage
      setAccessToken(accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Store refreshToken as fallback (will use cookie primarily)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('[Login] ✓ Stored refreshToken in localStorage as fallback');
      }

      // Verify cookie was also set
      try {
        const checkResponse = await authAPI.checkAuth();
        if (checkResponse.data.hasRefreshToken) {
          console.log('[Login] ✓ Refresh token cookie also set successfully');
        } else {
          console.warn('[Login] ⚠ Cookie not set, but localStorage fallback available');
        }
      } catch (error) {
        console.error('[Login] Failed to verify cookie:', error);
      }

      // Invalidate queries
      queryClient.invalidateQueries(['user']);
      
      toast.success('Login successful! Welcome back.');
      console.log('[Login] Login successful, calling onSuccess callback');

      // Call the onSuccess callback from the component
      if (options.onSuccess) {
        options.onSuccess(response);
      }
    },
    onError: (error) => {
      console.error('[Login] Login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Clear tokens and user data
      clearAccessToken();
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');

      // Clear all queries
      queryClient.clear();
      
      toast.success('Logged out successfully.');
    },
    onError: (error) => {
      // Even if logout fails on server, clear local data
      clearAccessToken();
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      
      console.error('Logout error:', error);
    },
  });
};

// Get user profile query
export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userAPI.getProfile,
    retry: false,
  });
};

// Get dashboard data query
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: userAPI.getDashboard,
    retry: false,
  });
};

// Get admin data query
export const useAdminData = () => {
  return useQuery({
    queryKey: ['admin'],
    queryFn: userAPI.getAdminData,
    retry: false,
  });
};
