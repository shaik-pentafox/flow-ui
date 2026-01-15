// src/api/apiService.ts
import type { Method } from "axios";
import { apiCallProtected, apiCallFileProtected, apiCall } from "./config";

// Define a common options type for better type safety
interface FetchOptions {
  method: Method;
  url: string;
  data?: any; // For POST, PUT, PATCH
  params?: any; // For GET
  headers?: Record<string, string>;
  isFile?: boolean; // Use for file uploads
  isProtected?: boolean; // Use the default protected instance or the public one
}

/**
 * A generic API fetch function using async/await.
 * @param options - Configuration for the API call.
 * @returns The response data (normalized by the interceptor).
 */
export const apiFetch = async ({ method, url, data, params, headers, isFile = false, isProtected = true }: FetchOptions): Promise<any> => {
  let instance;

  if (!isProtected) {
    // Use the unprotected instance (e.g., for login)
    instance = apiCall;
  } else if (isFile) {
    // Use the protected file upload instance
    instance = apiCallFileProtected;
  } else {
    // Default to the protected JSON instance
    instance = apiCallProtected;
  }

  // The interceptor handles the response and error normalization
  const response = await instance.request({
    method: method.toLowerCase() as Method,
    url,
    data,
    params,
    headers,
  });

  return response;
};
