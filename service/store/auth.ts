import { create } from "zustand";

type Profile = { username: string };
type AuthState = {
  isAuth: boolean;
  profile: Profile | null;
  setAuth: (p: Partial<AuthState>) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  profile: null,
  setAuth: (p) => set((s) => ({ ...s, ...p })),
  clear: () => set({ isAuth: false, profile: null }),
}));