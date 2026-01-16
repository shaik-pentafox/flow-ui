// src/api/config.ts
import { env } from '@/config';
import axios from 'axios';

// Get base URL from environment variables
export const URL = {
  base: env.API_BASE_URL,
  auth: env.API_AUTH_URL,
};

// Base Axios instance (can be used for unprotected calls)
export const apiCall = axios.create({
  baseURL: URL.auth,
  timeout: 15000,
});

// Protected API instance (for most authenticated calls)
export const apiCallProtected = axios.create({
  baseURL: URL.base,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Protected API instance for file uploads (multipart/form-data)
export const apiCallFileProtected = axios.create({
  baseURL: URL.base,
  headers: { "content-type": "multipart/form-data" },
  timeout: 30000,
});