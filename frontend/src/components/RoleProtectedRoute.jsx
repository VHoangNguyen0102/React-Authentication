import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import toast from 'react-hot-toast';

/**
 * Role-based Protected Route Component
 * Restricts access to routes based on user roles
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['admin', 'user'])
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: '/home')
 */
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/home' 
}) => {
  const { isLoggedIn, isCheckingStatus } = useAuthStatus();

  // Show loading while checking auth status
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    console.error('[RoleProtectedRoute] Failed to parse user:', error);
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    console.warn(
      `[RoleProtectedRoute] Access denied. User role: ${user.role}, Required: ${allowedRoles.join(', ')}`
    );
    toast.error('You do not have permission to access this page');
    return <Navigate to={redirectTo} replace />;
  }

  // User is authorized - render children
  return children;
};

export default RoleProtectedRoute;
