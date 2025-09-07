import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQp1U5MSeOik9qvTjBDxDpdpVWGjjB7KM",
  authDomain: "connectorbynova.firebaseapp.com",
  projectId: "connectorbynova",
  storageBucket: "connectorbynova.firebasestorage.app",
  messagingSenderId: "926160023678",
  appId: "1:926160023678:web:6c0abf7a5cfa810d29682f",
  measurementId: "G-53KEVJ8K0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
