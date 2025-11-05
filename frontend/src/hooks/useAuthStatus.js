import { useState, useEffect } from 'react';
import { authAPI, userAPI } from '../api';

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const verifyUser = async () => {
      try {
        // Check if refresh token cookie exists
        console.log('[AuthStatus] Component mounted, checking auth status...');
        
        const checkResponse = await authAPI.checkAuth();
        const hasCookie = checkResponse.data.hasRefreshToken;
        
        console.log('[AuthStatus] Has cookie token:', hasCookie);
        
        if (!isMounted) {
          console.log('[AuthStatus] Component unmounted, aborting...');
          return;
        }
        
        if (!hasCookie) {
          console.log('[AuthStatus] No refresh token cookie found - NOT LOGGED IN');
          setIsLoggedIn(false);
          setIsCheckingStatus(false);
          return;
        }

        // We have a cookie, verify by fetching profile
        // The axios interceptor will handle token refresh if needed
        console.log('[AuthStatus] Cookie found, verifying user via profile API...');
        await userAPI.getProfile();
        
        if (!isMounted) {
          console.log('[AuthStatus] Component unmounted after profile check, aborting...');
          return;
        }
        
        setIsLoggedIn(true);
        console.log('[AuthStatus] User verified successfully - LOGGED IN ✓');
      } catch (error) {
        // If fetching profile fails (e.g., invalid refresh token), log them out
        console.error('[AuthStatus] Verification failed:', error);
        
        if (!isMounted) return;
        
        setIsLoggedIn(false);
        localStorage.removeItem('user');
        console.log('[AuthStatus] Cleared user data');
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
          console.log('[AuthStatus] Status check complete');
        }
      }
    };

    verifyUser();
    
    return () => {
      isMounted = false;
      console.log('[AuthStatus] Component unmounting...');
    };
  }, []);

  return { isLoggedIn, isCheckingStatus };
};
