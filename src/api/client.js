// src/api/client.js
import axios from "axios";

let accessToken = null;

let isRefreshing = false;
let failedQueue = [];

/**
 * Token helpers
 */
export const setAccessToken = (token) => {
  accessToken = token;
  // REMOVE the localStorage.setItem line!
};


export const getAccessToken = () => accessToken;

/**
 * Resolve or reject all queued requests
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

/**
 * Axios instance
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor (REFRESH LOGIC)
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. IF THERE IS NO RESPONSE (Network Error)
    if (!error.response) {
      return Promise.reject(error);
    }

    // 2. BREAK THE LOOP: 
    // If the error happened on a refresh or login attempt, STOP HERE.
    if (originalRequest.url.includes("/auth/refresh") || originalRequest.url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    // 3. Handle standard 401s for other protected routes
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
