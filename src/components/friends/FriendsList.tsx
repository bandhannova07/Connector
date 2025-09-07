import React, { useEffect } from 'react';
import { useFriendsStore } from '../../store/friendsStore';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { 
  UserPlusIcon, 
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

export const FriendsList: React.FC = () => {
  const { friends, friendRequests, loading, initializeFriends, loadFriendRequests, respondToFriendRequest } = useFriendsStore();
  const { user } = useAuthStore();
  const { createDirectChat } = useChatStore();

  useEffect(() => {
    if (user) {
      const unsubscribeFriends = initializeFriends(user.uid);
      const unsubscribeRequests = loadFriendRequests(user.uid);
      
      return () => {
        unsubscribeFriends?.();
        unsubscribeRequests?.();
      };
    }
  }, [user, initializeFriends, loadFriendRequests]);

  const handleAcceptRequest = async (requestId: string, fromUserId: string) => {
    if (!user) return;
    
    try {
      await respondToFriendRequest(requestId, 'accepted', fromUserId, user.uid);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string, fromUserId: string) => {
    if (!user) return;
    
    try {
      await respondToFriendRequest(requestId, 'rejected', fromUserId, user.uid);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleStartChat = async (friendId: string) => {
    if (!user) return;
    
    try {
      // Get friend's public key (you'd need to fetch this)
      const friend = friends.find(f => f.uid === friendId);
      if (!friend) return;
      
      await createDirectChat(user.uid, friendId, user.publicKey, friend.publicKey);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Friend Requests</h3>
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {request.fromUserId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{request.fromUserId}</p>
                    <p className="text-sm text-gray-500">Wants to be your friend</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id, request.fromUserId)}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id, request.fromUserId)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Friends</h3>
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No friends yet</p>
            <p className="text-sm text-gray-400 mt-1">Search for users to send friend requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.uid} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {friend.photoURL ? (
                    <img
                      src={friend.photoURL}
                      alt={friend.displayName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {friend.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{friend.displayName}</p>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-xs text-gray-500">
                        {friend.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStartChat(friend.uid)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
