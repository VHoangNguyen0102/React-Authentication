import { useState, useEffect } from 'react';
import { getAccessToken } from '../api/axios';

/**
 * Simple auth status check
 * Only verifies if user data exists in localStorage and access token in memory
 */
export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    console.log('[AuthStatus] Checking authentication status...');
    
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    const hasAccessToken = !!getAccessToken();
    
    const isAuthenticated = !!userData && hasAccessToken;
    
    console.log('[AuthStatus] User data in localStorage:', !!userData);
    console.log('[AuthStatus] Access token in memory:', hasAccessToken);
    console.log('[AuthStatus] Is authenticated:', isAuthenticated);
    
    setIsLoggedIn(isAuthenticated);
    setIsCheckingStatus(false);
  }, []);

  return { isLoggedIn, isCheckingStatus };
};
