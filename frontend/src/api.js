import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://food-hub-llzy.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodhub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (email, password) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
};

export const getRestaurants = async () => {
  const { data } = await api.get('/api/restaurants');
  return data;
};

export const getRestaurantById = async (id) => {
  const { data } = await api.get(`/api/restaurants/${id}`);
  return data;
};

export const placeOrder = async (orderData) => {
  const { data } = await api.post('/api/orders', orderData);
  return data;
};

export default api;
