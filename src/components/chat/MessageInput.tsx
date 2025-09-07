import React, { useState, useRef } from 'react';
import { 
  PaperAirplaneIcon,
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { uploadFile, validateFile, getFileTypeFromMimeType } from '../../lib/fileUpload';

interface MessageInputProps {
  chatId: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ chatId, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { sendMessage } = useChatStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || disabled) return;

    try {
      await sendMessage(chatId, message.trim(), 'text', user.uid);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const fileType = getFileTypeFromMimeType(file.type);
      const validation = validateFile(file, fileType);
      
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const uploadResult = await uploadFile(file, user.uid, chatId, fileType);
      
      await sendMessage(
        chatId,
        file.name,
        fileType,
        user.uid,
        uploadResult.url,
        uploadResult.fileName,
        uploadResult.fileSize
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        
        await handleFileUpload(audioFile);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* File upload input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />

        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <PaperClipIcon className="h-5 w-5" />
        </button>

        {/* Photo button */}
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.accept = 'image/*';
              fileInputRef.current.click();
            }
          }}
          disabled={disabled || isUploading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <PhotoIcon className="h-5 w-5" />
        </button>

        {/* Video button */}
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.accept = 'video/*';
              fileInputRef.current.click();
            }
          }}
          disabled={disabled || isUploading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <VideoCameraIcon className="h-5 w-5" />
        </button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 disabled:opacity-50"
            rows={1}
            style={{
              minHeight: '40px',
              height: 'auto',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Voice recording button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isUploading}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
            isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MicrophoneIcon className="h-5 w-5" />
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isUploading}
          className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Upload progress */}
      {isUploading && (
        <div className="mt-2 text-sm text-gray-500 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
          Uploading file...
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
          Recording... Click microphone to stop
        </div>
      )}
    </div>
  );
};
