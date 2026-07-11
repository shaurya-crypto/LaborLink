import axios from 'axios';
import { TokenStorage } from './TokenStorage';
import Config from 'react-native-config';

// In development, use a local IP for Android emulator or localhost for iOS
// Assuming the backend is running on port 3000
// Update this based on the environment
const baseURL = Config.API_URL || 'http://10.0.2.2:3000/api/v1';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await TokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and Token Refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      
      if (isRefreshing) {
        // Wait until refresh is done, then retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await TokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const res = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
        
        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        await TokenStorage.setTokens(newAccessToken, newRefreshToken);
        
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await TokenStorage.clearTokens();
        // You might want to trigger a global event here to navigate to Login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Extract the standard ApiError response structure
    let extractedError = error.response?.data?.message || error.message;
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      extractedError = `${extractedError}: ${error.response.data.errors[0].message}`;
    }
    return Promise.reject(extractedError);
  }
);
