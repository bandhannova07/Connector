import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDhZuInExe2qVK4Px3hsQ8VNRARcxvFm2Y",
  authDomain: "connetor-by-nova.firebaseapp.com",
  projectId: "connetor-by-nova",
  storageBucket: "connetor-by-nova.firebasestorage.app",
  messagingSenderId: "683556317411",
  appId: "1:683556317411:web:c03007d53a027791f03dd6",
  measurementId: "G-5R8CRKLXN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
