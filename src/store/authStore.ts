// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
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

  login: (data: LoginPayload) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (data) =>
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
