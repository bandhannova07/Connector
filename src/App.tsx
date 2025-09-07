import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Sidebar } from './components/layout/Sidebar';
import { ChatList } from './components/chat/ChatList';
import { ChatWindow } from './components/chat/ChatWindow';
import { FriendsList } from './components/friends/FriendsList';
import { UserSearch } from './components/search/UserSearch';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AboutScreen } from './components/screens/AboutScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import type { Chat } from './types';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeView, setActiveView] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    initialize();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialize]);

  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ConnectorbyNova...</p>
        </div>
      </div>
    );
  }

  // Show auth forms if user is not logged in
  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <SignupForm onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const renderMainContent = () => {
    // Mobile view with selected chat
    if (isMobile && selectedChat) {
      return (
        <ChatWindow 
          chat={selectedChat} 
          onBack={() => setSelectedChat(null)} 
        />
      );
    }

    switch (activeView) {
      case 'chats':
        return (
          <div className="flex h-full">
            <div className={`${isMobile ? 'w-full' : 'w-1/3'} border-r border-gray-200 bg-white`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
              </div>
              <div className="p-4">
                <ChatList onChatSelect={setSelectedChat} />
              </div>
            </div>
            
            {!isMobile && (
              <div className="flex-1">
                {selectedChat ? (
                  <ChatWindow chat={selectedChat} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                        </svg>
                      </div>
                      <p className="text-xl text-gray-500">Select a chat to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'friends':
        return (
          <div className="p-6">
            <FriendsList />
          </div>
        );
      
      case 'search':
        return (
          <div className="p-6">
            <UserSearch />
          </div>
        );
      
      case 'settings':
        return (
          <div className="p-6">
            <SettingsScreen />
          </div>
        );
      
      case 'about':
        return (
          <div className="p-6">
            <AboutScreen />
          </div>
        );
      
      case 'feedback':
        return (
          <div className="p-6">
            <FeedbackScreen />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select an option from the sidebar</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedChat(null);
        }}
        isMobile={isMobile}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
