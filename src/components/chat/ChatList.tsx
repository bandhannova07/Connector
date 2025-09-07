import React, { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import type { Chat } from '../../types';

interface ChatListProps {
  onChatSelect: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { chats, loading, initializeChats } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const unsubscribe = initializeChats(user.uid);
      return unsubscribe;
    }
  }, [user, initializeChats]);

  const getChatDisplayName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    // For direct chats, show the other participant's name
    const otherParticipant = chat.participants.find(p => p !== user?.uid);
    return otherParticipant || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.groupPhoto || null;
    }
    
    // For direct chats, you'd need to fetch the other user's photo
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </div>
        <p className="text-gray-500">No chats yet</p>
        <p className="text-sm text-gray-400 mt-1">Start a conversation with your friends</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {getChatAvatar(chat) ? (
                <img
                  src={getChatAvatar(chat)!}
                  alt={getChatDisplayName(chat)}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {getChatDisplayName(chat).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Chat info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getChatDisplayName(chat)}
                </p>
                {chat.lastMessage.timestamp && (
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(chat.lastMessage.timestamp.toDate(), { addSuffix: true })}
                  </p>
                )}
              </div>
              
              {chat.lastMessage.text && (
                <p className="text-sm text-gray-500 truncate mt-1">
                  {chat.lastMessage.messageType === 'text' 
                    ? chat.lastMessage.text 
                    : `${chat.lastMessage.messageType} message`
                  }
                </p>
              )}
            </div>

            {/* Unread indicator */}
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
