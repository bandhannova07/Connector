import { useRef } from 'react';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import { MediaUploadService } from '../utils/mediaUpload';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileSelect: (file: File, type: string) => void;
  disabled?: boolean;
}

const FileUpload = ({ onFileSelect, disabled }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaService = MediaUploadService.getInstance();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = mediaService.validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    const fileType = mediaService.getFileType(file);
    onFileSelect(file, fileType);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        disabled={disabled}
      />
      
      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={disabled}
        className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Attach file"
      >
        <PaperClipIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FileUpload;
