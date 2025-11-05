import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../api/axios';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Simple check: do we have an access token in memory?
  // If not, the route will still render and useAuthStatus in the page will verify via cookie
  const hasAccessToken = !!getAccessToken();
  
  console.log('[ProtectedRoute] Checking access:', { hasAccessToken });

  // If we have access token, allow access immediately
  // If not, still allow (useAuthStatus will verify via cookie and redirect if needed)
  if (hasAccessToken) {
    console.log('[ProtectedRoute] Access token found, allowing access');
  } else {
    console.log('[ProtectedRoute] No access token in memory, but will check cookie...');
  }

  return children;
};

export default ProtectedRoute;
