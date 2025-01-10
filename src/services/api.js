import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:6007/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request/response logging
api.interceptors.request.use(request => {
  console.log('API Request:', {
    method: request.method,
    url: request.url,
    data: request.data,
    headers: request.headers
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Success Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  error => {
    console.error('API Error Response:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const trafficService = {
  getCurrentLocation: () => api.get('/location/current'),
  getRouteDetails: (routeId) => api.get(`/routes/${routeId}`),
  searchLocations: (query) => api.get(`/locations/search?q=${query}`),
  getTrafficInsights: () => api.get('/traffic/insights'),
  reportTrafficIssue: (data) => api.post('/traffic/report', data),
  getTrafficHistory: (locationId) => api.get(`/traffic/history/${locationId}`),
  updateRouteStatus: (routeId, status) => api.put(`/routes/${routeId}/status`, { status }),
  getAlternativeRoutes: (from, to) => api.get(`/routes/alternatives`, { params: { from, to } }),
  voteTrafficReport: (reportId, vote) => api.post(`/traffic/report/${reportId}/vote`, { vote })
};

export const userService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getDrivePoints: () => api.get('/user/points'),
  redeemPoints: (pointsData) => api.post('/user/points/redeem', pointsData),
  getPreferences: () => api.get('/user/preferences'),
  updatePreferences: (data) => api.put('/user/preferences', data),
  getNotifications: () => api.get('/user/notifications'),
  updateNotificationSettings: (settings) => api.put('/user/notifications/settings', settings)
};

export const routeService = {
  createRoute: (routeData) => api.post('/routes', routeData),
  updateRoute: (routeId, data) => api.put(`/routes/${routeId}`, data),
  deleteRoute: (routeId) => api.delete(`/routes/${routeId}`),
  getSavedRoutes: () => api.get('/routes/saved'),
  getRouteAnalytics: (routeId) => api.get(`/routes/${routeId}/analytics`),
  scheduleRoute: (routeId, schedule) => api.post(`/routes/${routeId}/schedule`, schedule),
  getActiveRoutes: () => api.get('/routes/active')
};

export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await api.get('/vehicles');
      return response;
    } catch (error) {
      console.error('Vehicle fetch error:', error);
      throw error;
    }
  },
  getVehicle: (id) => api.get(`/vehicles/${id}`),
  addVehicle: async (vehicleData) => {
    try {
      console.log('Sending to API:', vehicleData);
      const response = await api.post('/vehicles', vehicleData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Add vehicle error details:', {
        message: error.message,
        data: error.response?.data,
        status: error.response?.status,
        sentData: vehicleData
      });
      throw error;
    }
  },
  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/vehicles/${id}`),
  getVehicleStats: (id) => api.get(`/vehicles/${id}/stats`)
};

export default api; 