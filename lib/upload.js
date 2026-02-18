import { createClient } from '@supabase/supabase-js';

// Server-safe Supabase client for API routes
// Use NEXT_PUBLIC keys if you only need Storage; otherwise, use SERVICE_ROLE_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing in environment variables.');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Anon key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to Supabase Storage
 * @param {Buffer|Uint8Array} buffer - File content as Node.js Buffer
 * @param {string} folder - folder path in the bucket (e.g., 'images', 'pdfs')
 * @param {string} fileName - optional: original file name (to extract extension)
 * @param {string} mimeType - optional: content type of the file
 * @returns {string} Public URL of the uploaded file
 */
export async function uploadFile(buffer, folder = '', fileName = 'file.bin', mimeType = 'application/octet-stream') {
  try {
    if (!buffer) throw new Error('Buffer is required for upload');

    const ext = fileName.split('.').pop() || 'bin';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const path = `${folder}/${uniqueName}`;

    // Upload to Supabase Storage bucket 'uploads'
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(path, buffer, { contentType: mimeType, upsert: false });

    if (error) {
      console.error('Supabase upload error:', error, 'data:', data);
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Generate public URL
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
    return urlData.publicUrl;
  } catch (err) {
    console.error('Upload server error:', err);
    throw err;
  }
}

/**
 * Validate image files (server-side)
 * Exported as `validateImageFile` for API route imports
 */
export function validateImageFile(fileName, mimeType, size) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(mimeType)) {
    throw new Error('Invalid image type. Allowed: JPG, PNG, WEBP');
  }

  if (size > maxSize) {
    throw new Error('Image too large. Max size: 5MB');
  }

  return true;
}

/**
 * Validate PDF files (server-side)
 * Exported as `validatePdfFile` for API route imports
 */
export function validatePdfFile(fileName, mimeType, size) {
  const allowedTypes = ['application/pdf'];
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!allowedTypes.includes(mimeType)) {
    throw new Error('Invalid file type. Must be PDF');
  }

  if (size > maxSize) {
    throw new Error('PDF too large. Max size: 20MB');
  }

  return true;
}
