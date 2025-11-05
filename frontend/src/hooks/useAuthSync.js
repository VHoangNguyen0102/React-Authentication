import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import authSync from '../utils/authSync';
import { setAccessToken, clearAccessToken } from '../api/axios';
import toast from 'react-hot-toast';

/**
 * Hook to handle multi-tab authentication synchronization
 * Listens for auth events from other tabs and syncs state
 */
export const useAuthSync = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleAuthEvent = (event) => {
      console.log('[useAuthSync] Handling auth event:', event.type);

      switch (event.type) {
        case 'logout':
          // Another tab logged out - sync this tab
          console.log('[useAuthSync] Logout detected from another tab');
          clearAccessToken();
          localStorage.removeItem('user');
          queryClient.clear();
          navigate('/login', { replace: true });
          toast.info('You have been logged out from another tab');
          break;

        case 'login':
          // Another tab logged in - sync this tab
          console.log('[useAuthSync] Login detected from another tab');
          const { accessToken, user } = event.payload;
          if (accessToken) {
            setAccessToken(accessToken);
          }
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          queryClient.invalidateQueries();
          navigate('/home', { replace: true });
          toast.success('Logged in from another tab');
          break;

        case 'token_refresh':
          // Another tab refreshed token - update access token
          console.log('[useAuthSync] Token refresh detected from another tab');
          const { accessToken: newAccessToken } = event.payload;
          if (newAccessToken) {
            setAccessToken(newAccessToken);
          }
          break;

        default:
          console.log('[useAuthSync] Unknown event type:', event.type);
      }
    };

    // Subscribe to auth sync events
    const unsubscribe = authSync.subscribe(handleAuthEvent);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [navigate, queryClient]);
};
