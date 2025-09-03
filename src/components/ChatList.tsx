import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';

const ChatList: React.FC = () => {
  const { chats, unreadCounts } = useChatStore();
  const { user } = useAuthStore();

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>No chats yet</p>
        <p className="text-sm mt-1">Start a conversation by searching for users</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {chats.map((chat) => {
        const unreadCount = unreadCounts[chat.id] || 0;
        const isGroup = chat.isGroup;
        const chatName = isGroup 
          ? chat.name 
          : chat.members.find(id => id !== user?.uid) || 'Unknown';

        return (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  {chat.avatar ? (
                    <img 
                      src={chat.avatar} 
                      alt={chatName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-medium text-lg">
                      {chatName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {chatName}
                  </p>
                  <div className="flex items-center space-x-2">
                    {chat.lastMessageAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(chat.lastMessageAt, { addSuffix: true })}
                      </p>
                    )}
                    {unreadCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                
                {chat.lastMessageText && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {chat.lastMessageText}
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;
