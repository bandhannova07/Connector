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
    setFirebaseUser, 
    setUser, 
    setLoading,
    setKeyPair
  } = useAuthStore();

  const authService = new AuthService();
  const cryptoService = CryptoService.getInstance();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      
      if (firebaseUser) {
        try {
          // Use createOrGetUserData to handle both new and existing users
          const userData = await authService.createOrGetUserData(firebaseUser);
          
          if (userData) {
            console.log('User data loaded/created:', userData.username);
            
            // Set user data first, then Firebase user to trigger isAuthenticated
            setUser(userData);
            setFirebaseUser(firebaseUser);
            
            // Generate new keys if none exist
            const storedKeys = localStorage.getItem('encryptedKeys');
            if (!storedKeys) {
              const keyPair = cryptoService.generateKeyPair();
              cryptoService.setKeyPair(keyPair);
              setKeyPair(keyPair);
              
              // Update user document with public keys
              const publicKeys = cryptoService.exportPublicKeys(keyPair);
              await authService.updateUserData(firebaseUser.uid, {
                pubBoxKey: publicKeys.pubBoxKey,
                pubSignKey: publicKeys.pubSignKey
              });
            }
          } else {
            console.error('Failed to create/get user data for:', firebaseUser.uid);
            setFirebaseUser(firebaseUser);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setFirebaseUser(firebaseUser);
        }
      } else {
        console.log('User signed out');
        setFirebaseUser(null);
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
