import { useAdminData, useLogout } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, LogOut, Server, Users, Database, CheckCircle } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useAdminData();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message || 'You do not have permission to access this page'}
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const adminData = data?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">System administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Welcome */}
        <div className="card mb-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="h-8 w-8" />
            <h2 className="text-2xl font-bold">{adminData?.message}</h2>
          </div>
          <p className="text-purple-100">
            You have administrative privileges. This page is protected by role-based access control.
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card hover:shadow-xl transition-shadow border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {adminData?.adminData?.totalUsers?.toLocaleString() || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Server Status</p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  {adminData?.adminData?.serverStatus || 'Unknown'}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Backup</p>
                <p className="text-sm font-medium text-gray-900 mt-2">
                  {adminData?.adminData?.lastBackup 
                    ? new Date(adminData.adminData.lastBackup).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <Server className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">System Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Authentication</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  JWT Access Tokens (15m expiry)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  JWT Refresh Tokens (7d expiry)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Automatic token refresh
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Role-based access control
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Security Features</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Access tokens in memory
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Refresh tokens in localStorage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Protected API routes
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  CORS enabled
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="card mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <Users className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-600">View and edit user accounts</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <Server className="h-6 w-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Server Settings</p>
              <p className="text-sm text-gray-600">Configure server parameters</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <Database className="h-6 w-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Database Backup</p>
              <p className="text-sm text-gray-600">Create system backup</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
