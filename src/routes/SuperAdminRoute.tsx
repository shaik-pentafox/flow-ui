// src/routes/SuperAdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function SuperAdminRoute() {
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
