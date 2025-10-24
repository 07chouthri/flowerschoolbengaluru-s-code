/**
 * Environment Configuration Utilities
 * Handles dynamic URL configuration based on development/production environment
 */

// Check if we're in development mode
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * Get the base URL for the application
 * @returns {string} Base URL (localhost in dev, production URL in prod)
 */
export const getBaseURL = (): string => {
  if (isDevelopment) {
    // Development: use current window location or environment variable
    return import.meta.env.VITE_SITE_URL || `${window.location.protocol}//${window.location.host}`;
  }
  // Production: use production URL
  // return import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
  return import.meta.env.VITE_SITE_URL || 'https://flowerschoolbengaluru.com';
};

/**
 * Get the API base URL
 * @returns {string} API base URL
 */
export const getApiBaseURL = (): string => {
  if (isDevelopment) {
    return import.meta.env.VITE_API_URL || 'https://flowerschoolbengaluru.com/api';
  }
  // return import.meta.env.VITE_API_URL || 'http://localhost:5173';
    return import.meta.env.VITE_API_URL || 'https://flowerschoolbengaluru.com/api';
};

/**
 * Get the current page URL
 * @returns {string} Complete URL for current page
 */
export const getCurrentURL = (): string => {
  const baseURL = getBaseURL();
  const path = window.location.pathname;
  return `${baseURL}${path}`;
};

/**
 * Build a complete URL from a relative path
 * @param {string} path - Relative path (e.g., '/about', '/classes')
 * @returns {string} Complete URL
 */
export const buildURL = (path: string): string => {
  const baseURL = getBaseURL();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${normalizedPath}`;
};

/**
 * Build a complete image URL from a relative path
 * @param {string} imagePath - Image path (e.g., '/logo.png', 'images/hero.jpg')
 * @returns {string} Complete image URL
 */
export const buildImageURL = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath; // Already a complete URL
  }
  const baseURL = getBaseURL();
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}${normalizedPath}`;
};

/**
 * Environment information for debugging
 */
export const envInfo = {
  isDevelopment,
  isProduction,
  baseURL: getBaseURL(),
  apiURL: getApiBaseURL(),
  nodeEnv: import.meta.env.MODE,
};

// Log environment info in development
if (isDevelopment) {
  console.log('🌸 Bengaluru Flower School - Environment Info:', envInfo);
}