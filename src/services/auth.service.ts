import { apiFetch } from "@/api/apiService";

export type loginPayload = {
  name: string;
  password: string;
}

export const logIn = (payload: loginPayload) => {
  return apiFetch({ method: "POST", url: "/login", data: payload, isProtected: false });
}

export const getAPIList = () => {
  return apiFetch({ method: "GET", url: "/feature_flow/feature" });
}

export const postFeature = (payload: any) => {
  return apiFetch({ method: "POST", url: "/feature_flow", data: payload });
}

export const getFeatureList = () => {
  return apiFetch({ method: "GET", url: "/feature_flow" });
}

export const postFlow = (payload: any) => {
  return apiFetch({ method: "POST", url: "/flow/generate", data: payload });
}

export const getFlowList = () => {
  return apiFetch({ method: "GET", url: "/flow/features" });
}

export const activateFlow = (payload: any) => {
  return apiFetch({ method: "POST", url: "/flow/activate", data: payload });
}

export const getFlowById = (flowId: string) => {
  return apiFetch({ method: "GET", url: `/flow/features/${flowId}` });
}

export const getFeatureById = (featId: string) => {
  return apiFetch({ method: "GET", url: `/feature_flow/${featId}` });
}

export const deleteFlowById = (flowId: string) => {
  return apiFetch({ method: "DELETE", url: `/flow/${flowId}` });
}