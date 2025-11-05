import { useEffect } from 'react';
import { useDashboard, useLogout } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../api/axios';
import {
  LayoutDashboard,
  LogOut,
  User,
  Activity,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboard();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Initialize access token from localStorage on mount
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    
    if (refreshToken && userStr) {
      // Token will be refreshed automatically by axios interceptor
      // Just need to ensure we have the refresh token
    }
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true });
      },
    });
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || 'Failed to load dashboard data'}
          </p>
          <button onClick={handleLogout} className="btn-primary">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const dashboardData = data?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="card mb-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <h2 className="text-2xl font-bold mb-2">{dashboardData?.message}</h2>
          <p className="text-primary-100">
            You're logged in with JWT authentication. Your access token is stored in memory
            and will be automatically refreshed when needed.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData?.stats?.totalProjects || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData?.stats?.activeUsers || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData?.stats?.pendingTasks || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboardData?.stats?.completedTasks || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentActivity?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="card mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-medium text-gray-900">{user.id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
