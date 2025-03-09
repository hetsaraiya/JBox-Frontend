import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { apiPost, apiGet } from '../utils/apiService';

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await apiPost<{ access_token: string; token_type: string }>(
            '/auth/login',
            { username, password }
          );
          
          set({ 
            token: data.access_token, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          // Fetch user data after successful login
          await get().fetchCurrentUser();
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.detail || 'Login failed' 
          });
          throw error;
        }
      },

      signup: async (username, email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          await apiPost<User>(
            '/auth/signup', 
            { username, email, password }
          );
          
          // After signup, automatically log the user in
          await get().login(username, password);
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.detail || 'Signup failed' 
          });
          throw error;
        }
      },

      logout: () => {
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
      },

      clearError: () => {
        set({ error: null });
      },

      fetchCurrentUser: async () => {
        const token = get().token;
        if (!token) return;
        
        try {
          set({ isLoading: true });
          
          const userData = await apiGet<User>('/auth/me');
          
          set({ 
            user: userData,
            isLoading: false
          });
        } catch (error: any) {
          // If unauthorized, logout the user
          if (error.response?.status === 401) {
            get().logout();
          }
          
          set({ 
            isLoading: false,
            error: error.response?.data?.detail || 'Failed to fetch user data'
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);