import React, { useState } from 'react';
import { useFriendsStore } from '../../store/friendsStore';
import { useAuthStore } from '../../store/authStore';
import type { User } from '../../types';
import { 
  MagnifyingGlassIcon, 
  UserPlusIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';

export const UserSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  
  const { searchUsers, sendFriendRequest } = useFriendsStore();
  const { user } = useAuthStore();

  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;
    
    setLoading(true);
    try {
      const results = await searchUsers(searchTerm, user.uid);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (toUserId: string) => {
    if (!user) return;
    
    try {
      await sendFriendRequest(user.uid, toUserId);
      setSentRequests(prev => new Set(prev).add(toUserId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Users</h2>
        
        {/* Search input */}
        <div className="flex space-x-2 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchTerm.trim() || loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
            {searchResults.map((searchUser) => (
              <div key={searchUser.uid} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {searchUser.photoURL ? (
                    <img
                      src={searchUser.photoURL}
                      alt={searchUser.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {searchUser.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{searchUser.displayName}</p>
                    <p className="text-sm text-gray-500">{searchUser.email}</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${searchUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs text-gray-500">
                        {searchUser.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {sentRequests.has(searchUser.uid) ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Request Sent</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendFriendRequest(searchUser.uid)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    <span>Add Friend</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {searchTerm && searchResults.length === 0 && !loading && (
          <div className="text-center py-8">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try searching with a different term</p>
          </div>
        )}

        {/* Empty state */}
        {!searchTerm && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Search for users</p>
            <p className="text-sm text-gray-400 mt-2">
              Enter an email address or name to find and connect with other users
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
