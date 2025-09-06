import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';
import { auth } from './firebase/config';
import { useAuthStore } from './store/authStore';
import { AuthService } from './services/authService';
import { CryptoService } from './utils/simpleCrypto';

// Components
import LoadingScreen from './components/LoadingScreen';
import LockScreen from './components/LockScreen';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';

function App() {
  const { 
    isAuthenticated, 
    isLoading, 
    isLocked,
    setFirebaseUser, 
    setUser, 
    setLoading,
    setKeyPair 
  } = useAuthStore();

  const authService = new AuthService();
  const cryptoService = CryptoService.getInstance();

  // Guest Mode - Skip Authentication
  const GUEST_MODE = true; // Set to false to enable authentication

  useEffect(() => {
    if (GUEST_MODE) {
      // Create demo user for guest mode
      const guestUser = {
        uid: 'guest-user-123',
        username: 'Guest User',
        displayName: 'Guest User',
        email: 'guest@demo.com',
        photoURL: undefined,
        about: 'Demo user - no authentication required',
        pubBoxKey: 'demo-pub-box-key',
        pubSignKey: 'demo-pub-sign-key',
        devices: {
          'demo-device': {
            deviceName: 'Demo Device',
            pubKey: 'demo-device-pubkey',
            lastActive: new Date()
          }
        },
        status: 'online' as const,
        lastSeen: new Date(),
        createdAt: new Date(),
        settings: {
          theme: 'system' as const,
          notifications: true,
          language: 'en'
        }
      };
      
      // Set guest user as authenticated
      setUser(guestUser);
      setFirebaseUser({ uid: 'guest-user-123' } as any);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await authService.getUserData(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            
            // Try to load stored keys
            const storedKeys = localStorage.getItem('encryptedKeys');
            if (storedKeys) {
              // Keys are encrypted, will need unlock
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUser(null);
        setKeyPair(null);
        cryptoService.setKeyPair(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && isLocked && !GUEST_MODE) {
    return <LockScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/chat/:chatId" 
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <SettingsPage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/about" 
            element={isAuthenticated ? <AboutPage /> : <Navigate to="/auth" />} 
          />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
          }}
        />
      </div>
    </Router>
  );
}

export default App;
