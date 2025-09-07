import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qanwohrwrycvdgwbhcgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhbndvaHJ3cnljdmRnd2JoY2d5IiwiaWF0IjoxNzU3MjM2OTIwLCJleHAiOjIwNzI4MTI5MjB9.y4p0gvjxRSfe_Puty-a5d-Da7yXM7cbpvsKLuqyYLSg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name
export const STORAGE_BUCKET = 'chat-media';

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  image: 15 * 1024 * 1024, // 15MB
  video: 70 * 1024 * 1024, // 70MB
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
