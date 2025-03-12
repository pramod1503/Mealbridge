import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Network or connection error
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle specific HTTP errors
    switch (error.response.status) {
      case 401:
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(error.response?.data?.message || 'Something went wrong!');
    }

    return Promise.reject(error);
  }
);

export default api; 