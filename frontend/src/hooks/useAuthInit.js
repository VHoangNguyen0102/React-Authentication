import { useEffect, useState, useCallback } from 'react';
import { authAPI } from '../api';
import { setAccessToken, clearAccessToken } from '../api/axios';

/**
 * Hook to initialize authentication on app startup
 * Attempts to refresh access token if refresh token exists
 */
export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        console.log('[AuthInit] Checking for refresh token in cookies...');
        
        // Check if refresh token cookie exists
        const checkResponse = await authAPI.checkAuth();
        
        if (!isMounted) return;
        
        if (!checkResponse.data.hasRefreshToken) {
          console.log('[AuthInit] No refresh token found in cookies');
          setIsInitializing(false);
          setIsAuthenticated(false);
          return;
        }

        console.log('[AuthInit] Attempting to refresh access token...');
        
        // Try to get new access token using refresh token from cookie
        const response = await authAPI.refresh();
        
        if (!isMounted) return;
        
        const { accessToken } = response.data;

        // Store new access token in memory
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        
        console.log('[AuthInit] Access token refreshed successfully');
      } catch (error) {
        if (!isMounted) return;
        
        console.error('[AuthInit] Failed to refresh token:', error);
        
        // Refresh token invalid/expired - clear everything
        clearAccessToken();
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isInitializing, isAuthenticated };
};
