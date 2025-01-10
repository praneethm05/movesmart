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
  voteTrafficReport: (reportId, vote) => api.post(`/traffic/report/${reportId}/vote`, { vote }),
  getTrafficInfo: async (origin, destination) => {
    try {
      const response = await api.get('/traffic', {
        params: { origin, destination }
      });
      
      console.log('Traffic info response:', response.data);
      
      // Format the duration strings
      const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      };

      return {
        duration: {
          normal: formatDuration(response.data.normalDuration),
          withTraffic: formatDuration(response.data.trafficDuration)
        },
        distance: response.data.distance ? `${response.data.distance} km` : 'N/A',
        trafficDensity: response.data.trafficDensity || 'medium'
      };
    } catch (error) {
      console.error('Traffic info fetch error:', error);
      return {
        duration: { normal: 'N/A', withTraffic: 'N/A' },
        distance: 'N/A',
        trafficDensity: 'medium'
      };
    }
  },
  getLocationTraffic: async (coordinates) => {
    try {
      console.log('Making traffic API request with coordinates:', coordinates);
      
      const response = await api.get('/traffic', {
        params: {
          origin: coordinates.origin,
          destination: coordinates.destination
        }
      });

      console.log('Raw traffic API response:', response);

      // If response is empty or invalid, return default values
      if (!response.data || !response.data.trafficDensity) {
        console.warn('Invalid response format, using default values');
        return {
          trafficDensity: 'Low',
          nextBestTime: '2:45 PM'
        };
      }

      return response.data;
    } catch (error) {
      console.error('Location traffic fetch error:', {
        error,
        coordinates,
        message: error.message,
        response: error.response?.data
      });
      
      // Return default values on error
      return {
        trafficDensity: 'Low',
        nextBestTime: '2:45 PM'
      };
    }
  },
  getPreviousTrafficStatus: () => api.get('/traffic/previous-status'),
  saveTrafficStatus: (data) => api.post('/traffic/status', data),
  getTrafficHistory: () => api.get('/traffic/history')
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
  getAllRoutes: async () => {
    try {
      const response = await api.get('/routes');
      return response;
    } catch (error) {
      console.error('Route fetch error:', error);
      throw error;
    }
  },

  addRoute: async (routeData) => {
    try {
      const response = await api.post('/routes', routeData);
      return response;
    } catch (error) {
      console.error('Route add error:', error);
      throw error;
    }
  },

  deleteRoute: async (routeId) => {
    try {
      console.log('Deleting route with ID:', routeId);
      const response = await api.delete(`/routes/${routeId}`);
      return response;
    } catch (error) {
      console.error('Route delete error:', {
        routeId,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  getRouteDetails: async (routeId) => {
    try {
      const response = await api.get(`/routes/${routeId}`);
      return response;
    } catch (error) {
      console.error('Route details fetch error:', error);
      throw error;
    }
  }
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
      // Ensure all required fields are present
      const requiredFields = [
        'vehicle_id', 
        'user_id', 
        'vehicle_type', 
        'vehicle_name', 
        'license_plate', 
        'year_of_manufacture', 
        'mileage'
      ];
      
      const missingFields = requiredFields.filter(field => !vehicleData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await api.post('/vehicles', vehicleData);
      return response;
    } catch (error) {
      console.error('Vehicle add error:', {
        message: error.message,
        response: error.response?.data,
        data: error.config?.data
      });
      throw error;
    }
  },
  updateVehicle: (id, data) => api.put(`/vehicles/${id}`, data),
  deleteVehicle: async (id) => {
    try {
      const response = await api.delete(`/vehicles/${id}`);
      return response;
    } catch (error) {
      console.error('Delete vehicle error:', error);
      throw error;
    }
  },
  getVehicleStats: (id) => api.get(`/vehicles/${id}/stats`)
};

export default api; 