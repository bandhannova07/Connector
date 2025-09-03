import React, { useState, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AuthService } from '../services/authService';
import { ChatService } from '../services/chatService';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';
import toast from 'react-hot-toast';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const { user } = useAuthStore();
  const authService = new AuthService();
  const chatService = new ChatService();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim() || !user) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await authService.searchUsers(searchTerm, user.uid);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        toast.error('Search failed');
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, user]);

  const handleSendRequest = async () => {
    if (!selectedUser || !user) return;

    setIsSending(true);
    try {
      await chatService.sendContactRequest(selectedUser.uid, requestMessage.trim() || undefined);
      toast.success(`Contact request sent to ${selectedUser.displayName}`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send contact request');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {selectedUser ? 'Send Contact Request' : 'Search Users'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!selectedUser ? (
            <>
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by username or display name..."
                  className="input-field pl-10"
                  autoFocus
                />
              </div>

              <div className="max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((searchUser) => (
                      <div
                        key={searchUser.uid}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                            {searchUser.photoURL ? (
                              <img 
                                src={searchUser.photoURL} 
                                alt={searchUser.displayName}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-white font-medium">
                                {searchUser.displayName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {searchUser.displayName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{searchUser.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedUser(searchUser)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchTerm.trim() ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Start typing to search for users
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  {selectedUser.photoURL ? (
                    <img 
                      src={selectedUser.photoURL} 
                      alt={selectedUser.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {selectedUser.displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedUser.displayName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{selectedUser.username}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Introduction Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Hi! I'd like to connect with you..."
                  className="input-field resize-none"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={isSending}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
