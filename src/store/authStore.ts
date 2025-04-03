import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { idbStorage } from '../lib/idbStorage';

type AuthState = {
  accessToken: string;
  setAccessToken: (newAccessToken: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: '',
      setAccessToken: (newAccessToken) => set({ accessToken: newAccessToken }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);
