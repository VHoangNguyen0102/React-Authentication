import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../api/axios';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Simple check: do we have an access token in memory OR refreshToken in localStorage?
  const hasAccessToken = !!getAccessToken();
  const hasRefreshToken = !!localStorage.getItem('refreshToken');
  
  console.log('[ProtectedRoute] Checking access:', { hasAccessToken, hasRefreshToken });

  // If we have either token, allow access
  // The useAuthStatus will handle the detailed verification
  if (!hasAccessToken && !hasRefreshToken) {
    console.log('[ProtectedRoute] No tokens found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('[ProtectedRoute] Token found, allowing access');
  return children;
};

export default ProtectedRoute;
