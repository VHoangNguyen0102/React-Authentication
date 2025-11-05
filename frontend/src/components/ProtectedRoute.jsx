import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../api/axios';

/**
 * Protected route wrapper
 * Redirects to login if no access token found
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user data exists in localStorage
  const userData = localStorage.getItem('user');
  const hasAccessToken = !!getAccessToken();
  
  const isAuthenticated = !!userData && hasAccessToken;
  
  console.log('[ProtectedRoute]', {
    path: location.pathname,
    hasUserData: !!userData,
    hasAccessToken,
    isAuthenticated
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('[ProtectedRoute] Authenticated, allowing access');
  return children;
};

export default ProtectedRoute;
