import React from 'react';
import type { Message, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  SpeakerWaveIcon, 
  DocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  sender?: User;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  sender, 
  showAvatar = true 
}) => {
  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.encryptedContent}
          </p>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <img
                src={message.fileUrl}
                alt={message.fileName || 'Image'}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
            )}
            {message.fileName && (
              <p className="text-xs opacity-75">{message.fileName}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <video
                src={message.fileUrl}
                controls
                className="max-w-xs rounded-lg"
              />
            )}
            {message.fileName && (
              <p className="text-xs opacity-75">{message.fileName}</p>
            )}
          </div>
        );
      
      case 'voice':
        return (
          <div className="flex items-center space-x-2">
            <SpeakerWaveIcon className="h-5 w-5" />
            {message.fileUrl && (
              <audio src={message.fileUrl} controls className="max-w-xs" />
            )}
            {message.duration && (
              <span className="text-xs opacity-75">
                {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-2">
            <DocumentIcon className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{message.fileName}</p>
              {message.fileSize && (
                <p className="text-xs opacity-75">
                  {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            {message.fileUrl && (
              <a
                href={message.fileUrl}
                download={message.fileName}
                className="text-xs underline hover:no-underline"
              >
                Download
              </a>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm">Unsupported message type</p>;
    }
  };

  const getMessageIcon = () => {
    switch (message.messageType) {
      case 'image':
        return <PhotoIcon className="h-4 w-4" />;
      case 'video':
        return <VideoCameraIcon className="h-4 w-4" />;
      case 'voice':
        return <SpeakerWaveIcon className="h-4 w-4" />;
      case 'file':
        return <DocumentIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getReadStatus = () => {
    const readByCount = Object.keys(message.readBy).length;
    if (readByCount === 1) {
      return <CheckIcon className="h-4 w-4" />;
    }
    return <CheckIcon className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="flex-shrink-0 w-8 h-8">
            {sender?.photoURL ? (
              <img
                src={sender.photoURL}
                alt={sender.displayName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {sender?.displayName?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            px-4 py-2 rounded-lg max-w-full
            ${isOwn 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-900'
            }
          `}
        >
          {/* Sender name for group chats */}
          {!isOwn && sender && (
            <p className="text-xs font-medium mb-1 opacity-75">
              {sender.displayName}
            </p>
          )}

          {/* Message content */}
          <div className="space-y-1">
            {message.messageType !== 'text' && (
              <div className="flex items-center space-x-1 mb-1">
                {getMessageIcon()}
                <span className="text-xs opacity-75 capitalize">
                  {message.messageType}
                </span>
              </div>
            )}
            
            {renderMessageContent()}
          </div>

          {/* Message metadata */}
          <div className={`flex items-center justify-between mt-2 text-xs opacity-75 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span>
              {formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })}
            </span>
            
            {isOwn && (
              <div className="flex items-center space-x-1">
                {getReadStatus()}
              </div>
            )}
          </div>

          {/* Edited indicator */}
          {message.editedAt && (
            <p className="text-xs opacity-50 mt-1">edited</p>
          )}
        </div>
      </div>
    </div>
  );
};
