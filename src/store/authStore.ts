import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { idbStorage } from '../lib/idbStorage';

interface AuthState {
  accessToken: string;
  setAccessToken: (newAccessToken: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }),
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      clearAuth: () => set({ accessToken: ''}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);
