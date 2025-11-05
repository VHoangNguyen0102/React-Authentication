import { useEffect, useState } from 'react';
import { authAPI } from '../api';
import { setAccessToken, clearAccessToken } from '../api/axios';

/**
 * Hook to initialize authentication on app startup
 * Only checks if user was previously logged in
 */
export const useAuthInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          console.log('[AuthInit] No user data found - not logged in');
          if (isMounted) {
            setIsAuthenticated(false);
            setIsInitializing(false);
          }
          return;
        }

        console.log('[AuthInit] User data found, checking refresh token...');
        
        // Check if refresh token cookie exists
        const checkResponse = await authAPI.checkAuth();
        
        if (!isMounted) return;
        
        if (!checkResponse.data.hasRefreshToken) {
          console.log('[AuthInit] No refresh token cookie - session expired');
          // Clear stale user data
          localStorage.removeItem('user');
          clearAccessToken();
          setIsAuthenticated(false);
          setIsInitializing(false);
          return;
        }

        console.log('[AuthInit] Refresh token found, getting new access token...');
        
        // Get new access token using refresh token from cookie
        const response = await authAPI.refresh();
        
        if (!isMounted) return;
        
        const { accessToken } = response.data;

        // Store access token in memory
        setAccessToken(accessToken);
        setIsAuthenticated(true);
        
        console.log('[AuthInit] ✓ Authentication restored successfully');
      } catch (error) {
        if (!isMounted) return;
        
        console.error('[AuthInit] Failed to restore session:', error);
        
        // Session invalid - clear everything
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
  }, []); // Empty dependency - only run once on mount

  return { isInitializing, isAuthenticated };
};
