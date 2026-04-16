import { create } from 'zustand';
import { authLogin, authLogout, authRegister, getMe, type AuthUser } from '@/lib/api';

interface AuthStore {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  login: async (email, password) => {
    const user = await authLogin(email, password);
    set({ user, isLoggedIn: true });
  },

  register: async (email, username, password) => {
    await authRegister(email, username, password);
    const user = await authLogin(email, password);
    set({ user, isLoggedIn: true });
  },

  logout: async () => {
    await authLogout();
    set({ user: null, isLoggedIn: false });
  },

  fetchUser: async () => {
    set({ isLoading: true });
    const user = await getMe();
    set({ user, isLoggedIn: !!user, isLoading: false });
  },
}));
