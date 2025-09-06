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
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await authService.getUserData(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            
            // Generate new keys if none exist
            const storedKeys = localStorage.getItem('encryptedKeys');
            if (!storedKeys) {
              // Generate new encryption keys for this session
              const keyPair = cryptoService.generateKeyPair();
              cryptoService.setKeyPair(keyPair);
              setKeyPair(keyPair);
            }
            
            // Always allow direct access
          } else {
            console.error('No user data found for:', firebaseUser.uid);
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
