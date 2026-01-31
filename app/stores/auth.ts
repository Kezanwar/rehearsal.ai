import { create } from "zustand";
import type { User } from "@/api/auth";

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  updateRequired: boolean;
  maintenanceMode: boolean;

  // Actions
  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setInitialized: (value: boolean) => void;
  setUpdateRequired: (value: boolean) => void;
  setMaintenanceMode: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  updateRequired: false,
  maintenanceMode: false,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isInitialized: true,
    }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setInitialized: (value) =>
    set({
      isInitialized: value,
    }),

  setUpdateRequired: (value) =>
    set({
      updateRequired: value,
    }),

  setMaintenanceMode: (value) =>
    set({
      maintenanceMode: value,
    }),
}));
