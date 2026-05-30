import { create } from 'zustand';
import { AuthState, User } from '../types';
import { apiClient } from './api';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setAuth: (user: User, token: string) =>
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),
}));

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (token && userJson) {
    try {
      const user = JSON.parse(userJson);
      apiClient.setToken(token);
      useAuthStore.setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      useAuthStore.setState({ isLoading: false });
    }
  } else {
    useAuthStore.setState({ isLoading: false });
  }
}
