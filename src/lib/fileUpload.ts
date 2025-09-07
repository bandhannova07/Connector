import { supabase, STORAGE_BUCKET, FILE_SIZE_LIMITS, SUPPORTED_FILE_TYPES } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export function validateFile(file: File, type: 'image' | 'video' | 'voice' | 'file'): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_SIZE_LIMITS[type]) {
    const maxSizeMB = FILE_SIZE_LIMITS[type] / (1024 * 1024);
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  // Check file type
  if (!SUPPORTED_FILE_TYPES[type].includes(file.type)) {
    return { valid: false, error: `Unsupported file type: ${file.type}` };
  }

  return { valid: true };
}

export async function uploadFile(
  file: File, 
  userId: string, 
  chatId: string,
  type: 'image' | 'video' | 'voice' | 'file'
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file, type);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${chatId}/${type}/${uuidv4()}.${fileExtension}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get signed URL for download
    const { data: urlData, error: urlError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days expiry

    if (urlError) {
      throw new Error(`Failed to create signed URL: ${urlError.message}`);
    }

    return {
      url: urlData.signedUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };

  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
}

export function getFileTypeFromMimeType(mimeType: string): 'image' | 'video' | 'voice' | 'file' {
  if (SUPPORTED_FILE_TYPES.image.includes(mimeType)) return 'image';
  if (SUPPORTED_FILE_TYPES.video.includes(mimeType)) return 'video';
  if (SUPPORTED_FILE_TYPES.voice.includes(mimeType)) return 'voice';
  return 'file';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
