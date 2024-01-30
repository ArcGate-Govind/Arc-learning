import axios from "axios";
import { API_URL } from "../../constant";
import { getAccessToken, removeUserSession } from "./common";
export const api = axios.create({
  baseURL: { API_URL },
  headers: {
    "Content-Type": "application/json",
  },
});

// Set Bearer token for all requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeUserSession();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
