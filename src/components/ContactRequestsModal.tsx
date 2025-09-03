import React, { useState } from 'react';
import { XMarkIcon, CheckIcon, XMarkIcon as RejectIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { useChatStore } from '../store/chatStore';
import { ChatService } from '../services/chatService';
import toast from 'react-hot-toast';

interface ContactRequestsModalProps {
  onClose: () => void;
}

const ContactRequestsModal: React.FC<ContactRequestsModalProps> = ({ onClose }) => {
  const { contactRequests } = useChatStore();
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  
  const chatService = new ChatService();

  const handleRequest = async (requestId: string, accept: boolean) => {
    setProcessingRequests(prev => new Set(prev).add(requestId));
    
    try {
      await chatService.respondToContactRequest(requestId, accept);
      toast.success(accept ? 'Contact request accepted' : 'Contact request rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const pendingRequests = contactRequests.filter(req => req.status === 'pending');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Contact Requests
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No pending contact requests
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => {
                const isProcessing = processingRequests.has(request.id);
                
                return (
                  <div
                    key={request.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {request.fromUid.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Contact Request
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          "{request.message}"
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequest(request.id, true)}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRequest(request.id, false)}
                        disabled={isProcessing}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <RejectIcon className="w-4 h-4 mr-2" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactRequestsModal;
