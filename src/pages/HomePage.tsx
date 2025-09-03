import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  UserGroupIcon,
  UserIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { AuthService } from '../services/authService';
import { ChatService } from '../services/chatService';
import SearchModal from '../components/SearchModal';
import ContactRequestsModal from '../components/ContactRequestsModal';
import ChatList from '../components/ChatList';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showContactRequests, setShowContactRequests] = useState(false);
  const { user, logout } = useAuthStore();
  const { contactRequests } = useChatStore();
  
  const authService = new AuthService();
  const chatService = new ChatService();

  useEffect(() => {
    if (user) {
      // Load chats and contact requests
      chatService.loadUserChats(user.uid);
      chatService.loadContactRequests(user.uid);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      logout();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const pendingRequests = contactRequests.filter(req => req.status === 'pending');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              ConnectorbyNova
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Search users"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowContactRequests(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Contact requests"
              >
                <UserGroupIcon className="w-5 h-5" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-white font-medium">
                  {user?.displayName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList />
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-2">
            <Link
              to="/profile"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <UserIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Profile</span>
            </Link>
            
            <Link
              to="/settings"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Cog6ToothIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Settings</span>
            </Link>
            
            <Link
              to="/about"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <InformationCircleIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">About</span>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mb-1" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to ConnectorbyNova
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Select a chat to start messaging or search for users to connect with
          </p>
          <button
            onClick={() => setShowSearch(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Start New Chat
          </button>
        </div>
      </div>

      {/* Modals */}
      {showSearch && (
        <SearchModal onClose={() => setShowSearch(false)} />
      )}
      
      {showContactRequests && (
        <ContactRequestsModal onClose={() => setShowContactRequests(false)} />
      )}
    </div>
  );
};

export default HomePage;
