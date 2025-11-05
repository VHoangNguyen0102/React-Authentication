import axiosInstance from './axios';

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    // No need to send refreshToken - it's in HTTP-only cookie
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  refresh: async () => {
    // Try cookie first, fall back to localStorage
    const localRefreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post('/auth/refresh', 
      localRefreshToken ? { refreshToken: localRefreshToken } : {}
    );
    return response.data;
  },

  checkAuth: async () => {
    const response = await axiosInstance.get('/auth/check');
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  },

  getDashboard: async () => {
    const response = await axiosInstance.get('/user/dashboard');
    return response.data;
  },

  getAdminData: async () => {
    const response = await axiosInstance.get('/user/admin');
    return response.data;
  },
};
