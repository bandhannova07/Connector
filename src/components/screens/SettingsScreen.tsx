import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

export const SettingsScreen: React.FC = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [passkeyEnabled, setPasskeyEnabled] = useState(user?.passkeyEnabled || false);

  const handleEnablePasskey = async () => {
    try {
      // Implement WebAuthn passkey registration
      if ('credentials' in navigator) {
        // This is a simplified implementation
        // In production, you'd need proper WebAuthn implementation
        setPasskeyEnabled(true);
        alert('Passkey feature will be implemented in the next update');
      } else {
        alert('Passkeys are not supported in this browser');
      }
    } catch (error) {
      console.error('Error enabling passkey:', error);
      alert('Failed to enable passkey');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Settings</h2>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <UserCircleIcon className="h-6 w-6 mr-2" />
          Profile
        </h3>
        
        {user && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xl">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-lg font-medium text-gray-900">{user.displayName}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <button className="btn-secondary">
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <ShieldCheckIcon className="h-6 w-6 mr-2" />
          Security
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Passkey Authentication</p>
              <p className="text-sm text-gray-500">
                Use biometric authentication or security keys to unlock the app
              </p>
            </div>
            <button
              onClick={handleEnablePasskey}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                passkeyEnabled
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {passkeyEnabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
          
          <div className="border-t pt-4">
            <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <KeyIcon className="h-5 w-5" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BellIcon className="h-6 w-6 mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">
                Receive notifications for new messages and friend requests
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {darkMode ? (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <SunIcon className="h-5 w-5 text-gray-600" />
              )}
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">
                  Switch to dark theme for better viewing in low light
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Online Status</span>
            <span className="text-sm text-green-600 font-medium">Visible</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Last Seen</span>
            <span className="text-sm text-green-600 font-medium">Visible</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Profile Photo</span>
            <span className="text-sm text-green-600 font-medium">Everyone</span>
          </div>
        </div>
      </div>

      {/* Data & Storage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Data & Storage</h3>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <p className="font-medium text-gray-900">Export Chat History</p>
            <p className="text-sm text-gray-500">Download your encrypted chat data</p>
          </button>
          
          <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <p className="font-medium text-gray-900">Clear Cache</p>
            <p className="text-sm text-gray-500">Free up storage space</p>
          </button>
          
          <button className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600">
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-red-500">Permanently delete your account and data</p>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-sm text-gray-600">
          <p>ConnectorbyNova v1.0.0</p>
          <p className="mt-1">Built with ❤️ by BandhanNova</p>
        </div>
      </div>
    </div>
  );
};
