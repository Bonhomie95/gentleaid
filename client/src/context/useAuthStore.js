import { create } from 'zustand';
import api from '../api/http';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('gentelaid_token') || null,
  loading: false,
  hydrated: false,

  hydrate: async () => {
    const token = localStorage.getItem('gentelaid_token');
    if (!token) {
      set({ hydrated: true });
      return;
    }
    try {
      const res = await api.get('/users/me');
      set({ user: res.data, token, hydrated: true });
    } catch (err) {
      console.error('hydrate failed', err);
      localStorage.removeItem('gentelaid_token');
      set({ user: null, token: null, hydrated: true });
    }
  },

  setAuth: ({ token, user }) => {
    if (token) {
      localStorage.setItem('gentelaid_token', token);
    }
    set({ token: token || null, user: user || null });
  },

  logout: () => {
    localStorage.removeItem('gentelaid_token');
    set({ token: null, user: null });
  },

  updateUser: (user) => set({ user }),
}));
