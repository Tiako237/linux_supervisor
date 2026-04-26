import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
};

export const deploymentAPI = {
  create: (data: any) => api.post('/deployments', data),
  getAll: () => api.get('/deployments'),
  getById: (id: number) => api.get(`/deployments/${id}`),
};

export const monitoringAPI = {
  getVMs: () => api.get('/monitoring/vms'),
  getAlerts: () => api.get('/monitoring/alerts'),
};

export default api;