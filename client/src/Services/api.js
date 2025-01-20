import axios from 'axios';
import store from '../store';

const BASE_URL = 'http://localhost:4002/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;