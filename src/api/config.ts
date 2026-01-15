// src/api/config.ts
import axios from 'axios';

// Get base URL from environment variables
export const URL = {
  base: import.meta.env.VITE_API_BASE_URL
};

// Base Axios instance (can be used for unprotected calls)
export const apiCall = axios.create({
  baseURL: URL.base,
});

// Protected API instance (for most authenticated calls)
export const apiCallProtected = axios.create({
  baseURL: URL.base,
  headers: { 'Content-Type': 'application/json' },
});

// Protected API instance for file uploads (multipart/form-data)
export const apiCallFileProtected = axios.create({
  baseURL: URL.base,
  headers: { "content-type": "multipart/form-data" },
});