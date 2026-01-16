// src/api/interceptor.ts
import { env } from "@/config";
import { useAuthStore } from "@/store/authStore";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";

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
        const authToken = useAuthStore.getState().token || env.ACCESS_TOKEN;

        if (authToken) {
          // Ensure headers object exists
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // ⬅️ Response Interceptor: Normalize response data and handle errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      if (response.status === 204) {
        return { message: "No Content", status: 204 };
      }
      return response.data;
    },
    async (error: AxiosError) => {
      const authObj = useAuthStore.getState().token;
      const logout = () => console.log("simulating logout");
      // const logout = useAuthStore.getState().logout;

      /* 401 handling */
      if (isProtected && error.response?.status === 401 && authObj) {
        logout();
        return Promise.reject({
          message: "Session expired. Please log in again.",
          status: 401,
        });
      }

      /* Timeout */
      if (error.code === "ECONNABORTED") {
        return Promise.reject({
          message: "Server timeout. Please try again.",
          status: 408,
        });
      }

      /* Network / CORS / DNS */
      if (!error.response) {
        return Promise.reject({
          message: "Unable to connect to server",
          status: 0,
        });
      }

      /* Backend error */
      const responseData: any = error.response.data;

      return Promise.reject({
        message: responseData?.message || responseData?.error || "Request failed",
        status: error.response.status,
      });
    }
  );
  // instance.interceptors.response.use(
  //   (response: AxiosResponse) => {
  //     // Normalize successful responses (based on your original logic)
  //     if (response.status === 200 || response.status === 201) {
  //       return response.data; // Return the actual server response body
  //     } else if (response.status === 204) {
  //       return { status: "success", message: "No Content" };
  //     }
  //     return response;
  //   },
  //   async (error: AxiosError) => {
  //     // const authToken = useAuthStore.getState().token;
  //     const authToken = "20202020";
  //     const logout = () => console.log("simulating function");
  //     // const logout = useAuthStore.getState().logout;
  //     // Handle 401 Unauthorized (Token Expired) - Only for protected calls
  //     if (isProtected && error.response?.status === 401 && authToken) {
  //       logout();
  //       // Reject with a clear, normalized error message
  //       return Promise.reject<NormalizedErrorBody>({
  //         message: "Session expired. Please login again.",
  //         status: 401,
  //       });
  //     }

  //     // 💡 Normalize error response
  //     const responseData: any = error.response?.data;

  //     if (responseData && typeof responseData === "object" && responseData.message) {
  //       // Server returned a structured error body
  //       return Promise.reject<NormalizedErrorBody>(responseData);
  //     } else {
  //       // Network error, CORS, or unknown error structure
  //       return Promise.reject<NormalizedErrorBody>({
  //         message: error.message || "A network error occurred or server is unavailable.",
  //         status: error.response?.status || 0, // Use 0 for unknown status
  //       });
  //     }
  //   }
  // );
};

/**
 * Sets up interceptors for all main API instances.
 * Call this function once in your application entry point (e.g., in a central config file).
 */
export const setupAllInterceptors = (apiCall: AxiosInstance, apiCallProtected: AxiosInstance, apiCallFileProtected: AxiosInstance): void => {
  // 1. Unprotected instance
  applyInterceptors(apiCall, false);

  // 2. Protected instance
  applyInterceptors(apiCallProtected, true);

  // 3. Protected File instance
  applyInterceptors(apiCallFileProtected, true);
};
