import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET || 'chat-media';

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  image: 15 * 1024 * 1024, // 15MB
  video: 50 * 1024 * 1024, // 50MB
  voice: 10 * 1024 * 1024, // 10MB
  file: 50 * 1024 * 1024,  // 50MB
};

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  voice: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
  file: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};
