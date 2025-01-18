import axios from 'axios';
import axiosRetry from 'axios-retry';

export const axiosInstance = axios.create({
  timeout: 60000,
});

// Apply retry logic
axiosRetry(axiosInstance, {
  retries: 5, // Number of retries
  retryDelay: axiosRetry.exponentialDelay, // Uses an exponential backoff delay
  retryCondition: (error) => {
    // Retry on network errors or server errors (5xx), but not on client errors (4xx)
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500;
  },
});