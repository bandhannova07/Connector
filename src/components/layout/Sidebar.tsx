import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: 'chats', label: 'Chats', icon: ChatBubbleLeftRightIcon },
    { id: 'friends', label: 'Friends', icon: UserGroupIcon },
    { id: 'search', label: 'Search', icon: MagnifyingGlassIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
    { id: 'about', label: 'About', icon: InformationCircleIcon },
    { id: 'feedback', label: 'Feedback', icon: ExclamationTriangleIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg lg:hidden"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-900">ConnectorbyNova</h1>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {user.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    if (isMobile) setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${activeView === item.id
                      ? 'bg-primary-100 text-primary-900 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
