import { useLogout } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, CheckCircle, Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header with Logout Button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="text-sm text-gray-500">Authenticated Successfully</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="card mb-8 text-center">
          <div className="mb-6">
            <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Login Successful! 🎉
            </h2>
            <p className="text-gray-600 text-lg">
              You have been authenticated with JWT tokens
            </p>
          </div>

          {/* User Information */}
          <div className="bg-primary-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">{user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {user.role || 'user'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="font-medium text-gray-900">{user.id || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-left transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">View Dashboard</p>
                  <p className="text-sm text-gray-600">See detailed statistics</p>
                </div>
              </div>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Admin Panel</p>
                    <p className="text-sm text-gray-600">Manage system settings</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Authentication Info */}
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            🔐 Authentication Details
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Access Token</p>
                <p className="text-blue-700">Stored in memory (15 minutes expiry)</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Refresh Token</p>
                <p className="text-blue-700">Stored in localStorage (7 days expiry)</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Automatic Token Refresh</p>
                <p className="text-blue-700">Tokens are refreshed automatically when expired</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Protected Routes</p>
                <p className="text-blue-700">All routes require valid authentication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ✨ Implemented Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">JWT Access & Refresh Tokens</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Axios Interceptors</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">React Query Integration</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">React Hook Form Validation</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Protected Routes</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Role-Based Access Control</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Automatic Token Refresh</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Error Handling</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
