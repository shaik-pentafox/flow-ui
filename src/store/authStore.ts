// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  role?: string;
  [key: string]: any;
};

type LoginPayload = {
  user: User;
  token: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role?: string;
  isSuperAdmin?: boolean;

  login: (data: LoginPayload) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: undefined,
      isSuperAdmin: false,

      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,

          role: data.user.decodedToken.role,
          isSuperAdmin: data?.user?.decodedToken?.role.toLowerCase() === "super_admin",
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: undefined,
          isSuperAdmin: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
