
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Add request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Attaching token to request:', token); 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;