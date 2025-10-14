import axios from 'axios';
import { getApiBaseURL } from './env';

// Create axios instance with dynamic base URL
const api = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies, authorization headers with HTTPS
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Only redirect to /signin for 401 if NOT a login attempt and user has a session
    const isLoginRequest = originalRequest?.url?.includes('/signin') || originalRequest?.url?.includes('/login');
    const hasSession = !!localStorage.getItem('sessionToken');
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && hasSession) {
      originalRequest._retry = true;
      localStorage.removeItem('sessionToken');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/api/auth/signin',
  register: '/api/auth/signup',
  logout: '/api/auth/signout',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
  verifyOTP: '/api/auth/verify-otp',

  // User
  profile: '/api/profile',
  changePassword: '/api/profile/change-password',

  // Products
  products: '/api/products',
  featuredProducts: '/api/products/featured',

  // Cart
  cart: '/api/cart',
  
  // Orders
  orders: '/api/orders',
  orderTracking: (id: string) => `/api/orders/${id}/tracking`,

  // Favorites
  favorites: '/api/favorites',

  // Courses
  courses: '/api/courses',
  
  // Testimonials
  testimonials: '/api/testimonials',

  // Blog
  blog: '/api/blog',

  // Others
  coupons: '/api/coupons/validate',
  deliveryOptions: '/api/delivery-options',
};

export default api;