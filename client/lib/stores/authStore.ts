import { create } from 'zustand';
import { persist, createJSONStorage, StateCreator } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (userData: Partial<User>) => void;
}

type AuthStateCreator = StateCreator<
  AuthState,
  [],
  [],
  AuthState
>;

const authStateCreator: AuthStateCreator = (set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  login: (user: User) => {
    console.log('🔐 Zustand: User logged in:', user.email);
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    console.log('🚪 Zustand: User logged out');
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      console.log('👤 Zustand: User updated:', updatedUser.email);
      set({ user: updatedUser });
    }
  },
});

export const useAuthStore = create<AuthState>()(
  persist(
    authStateCreator,
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }), // only persist user and isAuthenticated
      onRehydrateStorage: () => (state?: AuthState) => {
        console.log('💾 Zustand: Auth state rehydrated from localStorage');
        if (state?.user) {
          console.log('✅ Zustand: Found existing user session:', state.user.email);
        }
      },
    }
  )
);

// Utility functions for easier access
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    setLoading: store.setLoading,
    updateUser: store.updateUser,
  };
};

// Helper function to check auth status
export const getAuthStatus = () => {
  const state = useAuthStore.getState();
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  };
}; 