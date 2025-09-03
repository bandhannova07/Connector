import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn, showAvatar }) => {
  const getDecryptedContent = () => {
    // This would be handled by the chat service in a real implementation
    return (message as any).decryptedContent || '[Encrypted]';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {message.senderId.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className={`${showAvatar && !isOwn ? '' : 'ml-10'} ${isOwn ? 'mr-0' : ''}`}>
          <div className={`chat-bubble ${isOwn ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
            {message.type === 'text' ? (
              <p className="text-sm whitespace-pre-wrap break-words">
                {getDecryptedContent()}
              </p>
            ) : (
              <div className="text-sm">
                <p className="text-xs opacity-75 mb-1">[{message.type.toUpperCase()}]</p>
                <p className="whitespace-pre-wrap break-words">
                  {getDecryptedContent()}
                </p>
              </div>
            )}
          </div>
          
          <div className={`flex items-center mt-1 space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(message.createdAt, { addSuffix: true })}
            </span>
            
            {message.editedAt && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                (edited)
              </span>
            )}
            
            {isOwn && message.seen.length > 1 && (
              <span className="text-xs text-primary-600 dark:text-primary-400">
                ✓✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
