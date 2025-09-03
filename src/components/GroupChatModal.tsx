import { useState } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { ChatService } from '../services/chatService';
import toast from 'react-hot-toast';

interface GroupChatModalProps {
  onClose: () => void;
}

const GroupChatModal = ({ onClose }: GroupChatModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const chatService = new ChatService();

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      toast.error('Please enter a group name and select members');
      return;
    }

    setIsCreating(true);
    try {
      await chatService.createGroupChat(groupName.trim(), selectedUsers);
      toast.success('Group chat created successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create group chat');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Group Chat
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="input-field"
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Members
            </label>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <UserPlusIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Contact selection feature</p>
              <p className="text-sm">Would be implemented with contact list</p>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || isCreating}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
