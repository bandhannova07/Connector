import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDhZuInExe2qVK4Px3hsQ8VNRARcxvFm2Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "connetor-by-nova.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "connetor-by-nova",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "connetor-by-nova.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "683556317411",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:683556317411:web:c03007d53a027791f03dd6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5R8CRKLXN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
