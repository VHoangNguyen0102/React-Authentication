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
      const { accessToken, user } = response.data;
      
      // Store access token in memory and user in localStorage
      // refreshToken is automatically stored in HTTP-only cookie by backend
      setAccessToken(accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('[Login] ✓ Access token stored in memory');
      console.log('[Login] ✓ User data stored in localStorage');
      console.log('[Login] ✓ Refresh token stored in HTTP-only cookie (by backend)');

      // Verify cookie was set
      try {
        const checkResponse = await authAPI.checkAuth();
        if (checkResponse.data.hasRefreshToken) {
          console.log('[Login] ✓ Refresh token cookie verified');
        } else {
          console.warn('[Login] ⚠ Cookie not detected (but should be set by backend)');
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
export const useLogout = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      console.log('[Logout] Logout successful');
      
      // Clear tokens and user data
      clearAccessToken();
      localStorage.removeItem('user');
      // refreshToken cookie is cleared by backend

      // Clear all queries
      queryClient.clear();
      
      toast.success('Logged out successfully.');
      
      // Call the onSuccess callback from the component (for navigation)
      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      console.error('[Logout] Logout error:', error);
      
      // Even if logout fails on server, clear local data
      clearAccessToken();
      localStorage.removeItem('user');
      queryClient.clear();
      
      toast.success('Logged out successfully.');
      
      // Still navigate away even on error
      if (options.onSuccess) {
        options.onSuccess();
      }
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
