import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CameraIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';
import { AuthService } from '../services/authService';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    about: user?.about || '',
    photoURL: user?.photoURL || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const authService = new AuthService();

  const handleSave = async () => {
    if (!user) return;

    setIsUpdating(true);
    try {
      await authService.updateUserData(user.uid, {
        displayName: formData.displayName,
        about: formData.about,
        photoURL: formData.photoURL || undefined
      });
      
      setUser({
        ...user,
        displayName: formData.displayName,
        about: formData.about,
        photoURL: formData.photoURL || undefined
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      about: user?.about || '',
      photoURL: user?.photoURL || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary text-sm px-3 py-2"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="btn-primary text-sm px-3 py-2 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.photoURL ? (
                    <img 
                      src={formData.photoURL} 
                      alt={formData.displayName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-2xl">
                      {formData.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {!isEditing && (
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user?.displayName}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{user?.username}
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="input-field"
                    placeholder="Enter your display name"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {user?.displayName || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  @{user?.username}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.about}
                    onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Tell others about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {user?.about || 'No bio yet'}
                  </p>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) => setFormData(prev => ({ ...prev, photoURL: e.target.value }))}
                    className="input-field"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              )}

              {/* Account Info */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Member since</p>
                    <p className="text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {user?.status || 'offline'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
