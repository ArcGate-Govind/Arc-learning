import axios from 'axios';
import { API_URL } from '../../constant';
import { getAccessToken } from './common';
export const api = axios.create({
  baseURL: {API_URL} ,
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
