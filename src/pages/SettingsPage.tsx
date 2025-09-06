import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  LockClosedIcon,
  KeyIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/authService';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const authService = new AuthService();

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const updatedSettings = { ...user.settings, theme };
      
      // Check if this is guest mode (guest users have uid starting with 'guest-')
      const isGuestMode = user.uid.startsWith('guest-');
      
      if (!isGuestMode) {
        // Only update Firebase for real users
        await authService.updateUserData(user.uid, { settings: updatedSettings });
      }
      
      // Always update local state
      setUser({ ...user, settings: updatedSettings });
      
      // Apply theme immediately
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System theme
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
      
      toast.success('Theme updated');
    } catch (error) {
      toast.error('Failed to update theme');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationToggle = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const updatedSettings = { 
        ...user.settings, 
        notifications: !user.settings.notifications 
      };
      
      // Check if this is guest mode (guest users have uid starting with 'guest-')
      const isGuestMode = user.uid.startsWith('guest-');
      
      if (!isGuestMode) {
        // Only update Firebase for real users
        await authService.updateUserData(user.uid, { settings: updatedSettings });
      }
      
      // Always update local state
      setUser({ ...user, settings: updatedSettings });
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update notifications');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications for new messages
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleNotificationToggle}
                disabled={isUpdating}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  user?.settings.notifications 
                    ? 'bg-primary-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user?.settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            
            <div className="space-y-3">
              {[
                { key: 'light', label: 'Light', icon: SunIcon },
                { key: 'dark', label: 'Dark', icon: MoonIcon },
                { key: 'system', label: 'System', icon: ComputerDesktopIcon }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as any)}
                  disabled={isUpdating}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    user?.settings.theme === key
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {label}
                  </span>
                  {user?.settings.theme === key && (
                    <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Security
            </h2>
            
            <div className="space-y-4">
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <LockClosedIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Enable Passkey Lock
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use biometric authentication to unlock the app
                  </p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <KeyIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Backup Encryption Keys
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Download encrypted backup of your keys
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-red-200 dark:border-red-800">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h2>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg border border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400">
              <TrashIcon className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm opacity-75">
                  Permanently delete your account and all data
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
