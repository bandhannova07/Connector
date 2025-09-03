import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { ChatService } from '../services/chatService';
import MessageBubble from '../components/MessageBubble';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentChat, messages } = useChatStore();
  const { user } = useAuthStore();
  const chatService = new ChatService();

  const chatMessages = chatId ? messages[chatId] || [] : [];

  useEffect(() => {
    if (chatId) {
      // Load chat messages
      chatService.loadChatMessages(chatId);
      
      // Clear unread count
      useChatStore.getState().clearUnreadCount(chatId);
    }

    return () => {
      chatService.cleanup();
    };
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || isSending) return;

    const messageText = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      await chatService.sendMessage(chatId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Chat not found</p>
      </div>
    );
  }

  const chatName = currentChat?.isGroup 
    ? currentChat.name 
    : currentChat?.members.find(id => id !== user?.uid) || 'Unknown';

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              {currentChat?.avatar ? (
                <img 
                  src={currentChat.avatar} 
                  alt={chatName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <span className="text-white font-medium">
                  {chatName?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white">
                {chatName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentChat?.isGroup 
                  ? `${currentChat.members.length} members`
                  : 'Online'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No messages yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start the conversation by sending a message
              </p>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user?.uid}
                showAvatar={
                  index === 0 || 
                  chatMessages[index - 1].senderId !== msg.senderId
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="flex items-end space-x-2">
              <button
                type="button"
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <PaperClipIcon className="w-5 h-5" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field resize-none pr-12"
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 bottom-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <FaceSmileIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
