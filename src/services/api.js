import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const trafficService = {
  getCurrentLocation: () => api.get('/location/current'),
  getRouteDetails: (routeId) => api.get(`/routes/${routeId}`),
  searchLocations: (query) => api.get(`/locations/search?q=${query}`),
  getTrafficInsights: () => api.get('/traffic/insights'),
  updateUserPreferences: (data) => api.put('/user/preferences', data),
};

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getDrivePoints: () => api.get('/user/points'),
}; 