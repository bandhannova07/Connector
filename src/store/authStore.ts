import { create } from 'zustand';
import {
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { generateKeyPair, encryptPrivateKey } from '../lib/encryption';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  initialize: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserStatus: (isOnline: boolean) => Promise<void>;
  decryptAndStorePrivateKey: (password: string) => Promise<boolean>;
  getDecryptedPrivateKey: () => string | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initialize: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData, loading: false, error: null });
            
            // Update online status
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              isOnline: true,
              lastSeen: serverTimestamp()
            });
          } else {
            set({ user: null, loading: false, error: null });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          set({ user: null, loading: false, error: 'Failed to fetch user data' });
        }
      } else {
        set({ user: null, loading: false, error: null });
      }
    });
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await signInWithEmailAndPassword(auth, email, password);
      
      // The user data will be set by the onAuthStateChanged listener
      // Store password for private key decryption
      localStorage.setItem('userPassword', password);
      
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    try {
      set({ loading: true, error: null });
      
      // Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, { displayName });
      
      // Generate encryption keys
      const keyPair = generateKeyPair();
      const encryptedPrivateKey = encryptPrivateKey(keyPair.privateKey, password);
      
      // Create user document in Firestore
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName,
        photoURL: result.user.photoURL,
        createdAt: serverTimestamp() as any,
        lastSeen: serverTimestamp() as any,
        isOnline: true,
        publicKey: keyPair.publicKey,
        encryptedPrivateKey,
        fcmToken: null,
        passkeyEnabled: false,
        passkeyCredentialId: null,
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      // Store password for private key decryption
      localStorage.setItem('userPassword', password);
      
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document for new Google user
        const keyPair = generateKeyPair();
        // For Google sign-in, we'll use a default password that the user can change later
        const defaultPassword = result.user.uid + '_default';
        const encryptedPrivateKey = encryptPrivateKey(keyPair.privateKey, defaultPassword);
        
        const userData: User = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'User',
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp() as any,
          lastSeen: serverTimestamp() as any,
          isOnline: true,
          publicKey: keyPair.publicKey,
          encryptedPrivateKey,
          fcmToken: null,
          passkeyEnabled: false,
          passkeyCredentialId: null,
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userData);
        localStorage.setItem('userPassword', defaultPassword);
      }
      
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { user } = get();
      if (user) {
        // Update offline status
        await updateDoc(doc(db, 'users', user.uid), {
          isOnline: false,
          lastSeen: serverTimestamp()
        });
      }
      
      await signOut(auth);
      localStorage.removeItem('userPassword');
      localStorage.removeItem('decryptedPrivateKey');
      set({ user: null, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateUserStatus: async (isOnline: boolean) => {
    const { user } = get();
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        isOnline,
        lastSeen: serverTimestamp()
      });
    }
  },

  decryptAndStorePrivateKey: async (password: string) => {
    const { user } = get();
    if (!user) return false;
    
    try {
      const { decryptPrivateKey } = await import('../lib/encryption');
      const privateKey = decryptPrivateKey(user.encryptedPrivateKey, password);
      
      if (privateKey) {
        localStorage.setItem('decryptedPrivateKey', privateKey);
        localStorage.setItem('userPassword', password);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to decrypt private key:', error);
      return false;
    }
  },

  getDecryptedPrivateKey: () => {
    return localStorage.getItem('decryptedPrivateKey');
  },
}));
