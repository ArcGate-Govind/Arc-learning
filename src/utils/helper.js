import axios from 'axios';
import { getAccessToken } from './common';
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set Bearer token for all requests
api.interceptors.request.use((config) => {
  const token = getAccessToken(); 
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
