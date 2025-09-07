import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import type { Chat } from '../../types';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  InformationCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface ChatWindowProps {
  chat: Chat;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
  const { messages, loadMessages } = useChatStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessages = messages[chat.id] || [];

  useEffect(() => {
    const unsubscribe = loadMessages(chat.id);
    return unsubscribe;
  }, [chat.id, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChatDisplayName = () => {
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    }
    
    const otherParticipant = chat.participants.find(p => p !== user?.uid);
    return otherParticipant || 'Unknown User';
  };

  const getChatAvatar = () => {
    if (chat.type === 'group') {
      return chat.groupPhoto;
    }
    return null;
  };

  const getOnlineStatus = () => {
    if (chat.type === 'group') {
      return `${chat.participants.length} members`;
    }
    return 'Online'; // You'd need to implement real online status
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Back button for mobile */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          )}

          {/* Chat avatar */}
          <div className="flex-shrink-0">
            {getChatAvatar() ? (
              <img
                src={getChatAvatar()!}
                alt={getChatDisplayName()}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {getChatDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Chat info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {getChatDisplayName()}
            </h2>
            <p className="text-sm text-gray-500">
              {getOnlineStatus()}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((message, index) => {
              const isOwn = message.senderId === user?.uid;
              const showAvatar = !isOwn && (
                index === 0 || 
                chatMessages[index - 1].senderId !== message.senderId
              );

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <MessageInput chatId={chat.id} />
    </div>
  );
};
