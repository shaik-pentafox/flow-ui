import { apiFetch } from "@/api/apiService";

export type loginPayload = {
  name: string;
  password: string;
};

export const logIn = (payload: loginPayload) => {
  return apiFetch({ method: "POST", url: "/login", data: payload, isProtected: false });
}

export const getAPIList = () => {
  return apiFetch({ method: "GET", url: "/feature_flow/feature"});
}

export const getFeatureList = () => {
  return apiFetch({ method: "GET", url: "/feature_flow"});
}

export const postFeature = (payload : any) => {
  return apiFetch({ method: "POST", url: "/feature_flow", data: payload });
}