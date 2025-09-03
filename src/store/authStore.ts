import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import type { User, KeyPair } from '../types';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  keyPair: KeyPair | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLocked: boolean;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setKeyPair: (keyPair: KeyPair | null) => void;
  setLoading: (loading: boolean) => void;
  setLocked: (locked: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  keyPair: null,
  isAuthenticated: false,
  isLoading: true,
  isLocked: false,
  
  setFirebaseUser: (firebaseUser) => 
    set((state) => ({ 
      firebaseUser, 
      isAuthenticated: !!firebaseUser && !!state.user 
    })),
    
  setUser: (user) => 
    set((state) => ({ 
      user, 
      isAuthenticated: !!state.firebaseUser && !!user 
    })),
    
  setKeyPair: (keyPair) => set({ keyPair }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setLocked: (isLocked) => set({ isLocked }),
  
  logout: () => set({
    firebaseUser: null,
    user: null,
    keyPair: null,
    isAuthenticated: false,
    isLoading: false,
    isLocked: false
  })
}));
