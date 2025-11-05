import { useEffect, useRef, useCallback } from 'react';
import { authAPI } from '../api';
import { setAccessToken, clearAccessToken } from '../api/axios';
import { jwtDecode } from 'jwt-decode';

/**
 * Hook to automatically refresh access token before it expires
 * Schedules refresh at 80% of token lifetime
 */
export const useTokenRefresh = () => {
  const timeoutRef = useRef(null);

  const performTokenRefresh = useCallback(async () => {
    try {
      // Refresh token is in HTTP-only cookie
      const response = await authAPI.refresh();
      const { accessToken } = response.data;

      setAccessToken(accessToken);
      console.log('[TokenRefresh] Token refreshed successfully ✓');

      // Schedule next refresh
      scheduleTokenRefresh(accessToken);
    } catch (error) {
      console.error('[TokenRefresh] Failed to refresh token:', error);
      clearAccessToken();
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      // Don't redirect - let the app handle it
    }
  }, []);

  const scheduleTokenRefresh = useCallback((token) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!token) return;

    try {
      // Decode token to get expiration time
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      // Schedule refresh at 80% of token lifetime
      // Example: if token expires in 15 min, refresh at 12 min
      const refreshTime = timeUntilExpiry * 0.8;

      console.log(`[TokenRefresh] Token expires in ${Math.round(timeUntilExpiry / 1000)}s, scheduling refresh in ${Math.round(refreshTime / 1000)}s`);

      if (refreshTime > 0) {
        timeoutRef.current = setTimeout(async () => {
          console.log('[TokenRefresh] Auto-refreshing token...');
          await performTokenRefresh();
        }, refreshTime);
      } else {
        // Token already expired or about to expire, refresh immediately
        console.log('[TokenRefresh] Token expired, refreshing immediately...');
        performTokenRefresh();
      }
    } catch (error) {
      console.error('[TokenRefresh] Failed to decode token:', error);
    }
  }, [performTokenRefresh]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { scheduleTokenRefresh };
};
