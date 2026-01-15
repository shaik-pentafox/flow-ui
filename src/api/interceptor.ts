// src/api/interceptor.ts
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

/**
 * Type guard/interface for a normalized error response body
 */
interface NormalizedErrorBody {
    message: string;
    // Add other common error fields if needed, like code, errors
    [key: string]: any; 
}

/**
 * Applies request and response interceptors to a given Axios instance.
 * @param instance - The Axios instance to configure.
 * @param isProtected - Whether to add the Authorization header.
 */
const applyInterceptors = (instance: AxiosInstance, isProtected: boolean = true) => {

  // ➡️ Request Interceptor: Attach Authorization Header (Conditional)
  if (isProtected) {
    instance.interceptors.request.use(
      (config) => {
        // const authObj = useAuthStore.getState().auth;
        const authObj = {access_token : 20202020};
        
        if (authObj?.access_token) {
          // Ensure headers object exists
          config.headers.Authorization = `Bearer ${authObj.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // ⬅️ Response Interceptor: Normalize response data and handle errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Normalize successful responses (based on your original logic)
      if (response.status === 200 || response.status === 201) {
        return response.data; // Return the actual server response body
      } else if (response.status === 204) {
        return { status: 'success', message: 'No Content' };
      }
      return response;
    },
    async (error: AxiosError) => {
    //   const { auth: authObj, resetAuth: logout } = useAuthStore.getState();
        const authObj = {access_token : 20202020};
        const logout = () =>  console.log('simulating function')
      // Handle 401 Unauthorized (Token Expired) - Only for protected calls
      if (isProtected && error.response?.status === 401 && authObj?.access_token) {
        logout();
        // Reject with a clear, normalized error message
        return Promise.reject<NormalizedErrorBody>({ 
            message: 'Session expired. Please log in again.', 
            status: 401 
        });
      }

      // 💡 Normalize error response
      const responseData : any = error.response?.data;
      
      if (responseData && typeof responseData === 'object' && responseData.message) {
        // Server returned a structured error body
        return Promise.reject<NormalizedErrorBody>(responseData); 
      } else {
        // Network error, CORS, or unknown error structure
        return Promise.reject<NormalizedErrorBody>({
          message: error.message || 'A network error occurred or server is unavailable.',
          status: error.response?.status || 0 // Use 0 for unknown status
        });
      }
    }
  );
};

/**
 * Sets up interceptors for all main API instances.
 * Call this function once in your application entry point (e.g., in a central config file).
 */
export const setupAllInterceptors = (
  apiCall: AxiosInstance, 
  apiCallProtected: AxiosInstance, 
  apiCallFileProtected: AxiosInstance
): void => {
    // 1. Unprotected instance
    applyInterceptors(apiCall, false); 
    
    // 2. Protected instance
    applyInterceptors(apiCallProtected, true); 

    // 3. Protected File instance
    applyInterceptors(apiCallFileProtected, true); 
};