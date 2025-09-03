import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { CryptoService } from '../utils/simpleCrypto';
import type { User } from '../types';

export class AuthService {
  private cryptoService = CryptoService.getInstance();

  async signUp(email: string, password: string, username: string, displayName: string): Promise<void> {
    // Check if username is available
    const isAvailable = await this.checkUsernameAvailability(username);
    if (!isAvailable) {
      throw new Error('Username is already taken');
    }

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update Firebase profile
    await updateProfile(firebaseUser, { displayName });

    // Generate encryption keys
    const keyPair = this.cryptoService.generateKeyPair();
    const publicKeys = this.cryptoService.exportPublicKeys(keyPair);

    // Create user document
    const userData: Omit<User, 'uid'> = {
      username,
      displayName,
      email,
      photoURL: firebaseUser.photoURL || undefined,
      about: '',
      pubBoxKey: publicKeys.pubBoxKey,
      pubSignKey: publicKeys.pubSignKey,
      devices: {},
      status: 'online',
      settings: {
        notifications: true,
        theme: 'system',
        language: 'en'
      },
      lastSeen: new Date(),
      createdAt: new Date()
    };

    // Save user data to Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp()
    });

    // Reserve username
    await setDoc(doc(db, 'handles', username), {
      uid: firebaseUser.uid,
      reserved: true
    });

    // Store encrypted keys locally
    const encryptedKeys = this.cryptoService.encryptKeyPair(keyPair, password);
    localStorage.setItem('encryptedKeys', encryptedKeys);
    
    // Set keys in crypto service
    this.cryptoService.setKeyPair(keyPair);
  }

  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
    
    // Try to decrypt stored keys
    const encryptedKeys = localStorage.getItem('encryptedKeys');
    if (encryptedKeys) {
      try {
        const keyPair = this.cryptoService.decryptKeyPair(encryptedKeys, password);
        this.cryptoService.setKeyPair(keyPair);
      } catch (error) {
        console.error('Failed to decrypt keys:', error);
        // Keys might be from different device or corrupted
      }
    }
  }

  async signOut(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('encryptedKeys');
    this.cryptoService.setKeyPair(null);
    
    await signOut(auth);
  }

  async getUserData(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      uid,
      ...data,
      lastSeen: data.lastSeen?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date()
    } as User;
  }

  async updateUserData(uid: string, updates: Partial<User>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      lastSeen: serverTimestamp()
    });
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const handleDoc = await getDoc(doc(db, 'handles', username));
    return !handleDoc.exists();
  }

  async searchUsers(searchTerm: string, currentUserId: string): Promise<User[]> {
    const usersRef = collection(db, 'users');
    
    // Search by username
    const usernameQuery = query(
      usersRef,
      where('username', '>=', searchTerm),
      where('username', '<=', searchTerm + '\uf8ff')
    );
    
    // Search by display name
    const displayNameQuery = query(
      usersRef,
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff')
    );

    const [usernameResults, displayNameResults] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(displayNameQuery)
    ]);

    const users = new Map<string, User>();
    
    // Combine results and remove duplicates
    [...usernameResults.docs, ...displayNameResults.docs].forEach(doc => {
      if (doc.id !== currentUserId) {
        const data = doc.data();
        users.set(doc.id, {
          uid: doc.id,
          ...data,
          lastSeen: data.lastSeen?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date()
        } as User);
      }
    });

    return Array.from(users.values());
  }

  async unlockWithPassword(password: string): Promise<boolean> {
    try {
      const encryptedKeys = localStorage.getItem('encryptedKeys');
      if (!encryptedKeys) {
        throw new Error('No encrypted keys found');
      }

      const keyPair = this.cryptoService.decryptKeyPair(encryptedKeys, password);
      this.cryptoService.setKeyPair(keyPair);
      return true;
    } catch (error) {
      console.error('Failed to unlock with password:', error);
      return false;
    }
  }
}
